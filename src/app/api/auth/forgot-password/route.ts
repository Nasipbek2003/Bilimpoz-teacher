import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateAndStoreVerificationCode, canRequestNewCode } from '@/lib/verification'
import { telegramPolling } from '@/lib/telegram-polling'

export async function POST(request: NextRequest) {
  try {
    const { login } = await request.json()

    // Валидация
    if (!login || !login.trim()) {
      return NextResponse.json(
        { success: false, error: 'Логин обязателен' },
        { status: 400 }
      )
    }

    // Найти пользователя по логину с social_networks
    const user = await prisma.users.findUnique({
      where: { login: login.trim() },
      include: {
        social_networks: true
      }
    })

    // Проверки
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    if (user.role !== 'teacher') {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    if (!user.telegram_id) {
      return NextResponse.json(
        { success: false, error: 'Telegram не подключен' },
        { status: 400 }
      )
    }

    // Проверка cooldown
    const cooldownCheck = await canRequestNewCode(user.id)
    if (!cooldownCheck.canRequest) {
      return NextResponse.json(
        {
          success: false,
          message: cooldownCheck.message || 'Подождите перед запросом нового кода',
          cooldownSeconds: cooldownCheck.cooldownSeconds
        },
        { status: 429 }
      )
    }

    // Генерировать код восстановления
    const code = await generateAndStoreVerificationCode(user.id, 'password_reset')

    // Отправить код через Telegram
    const sendResult = await telegramPolling.sendRecoveryCode(
      user.telegram_id,
      code,
      user.login
    )

    if (sendResult.error === 'BOT_BLOCKED' || sendResult.isBlocked) {
      return NextResponse.json(
        {
          success: false,
          message: 'Бот заблокирован',
          code: 'BOT_BLOCKED',
          instructions: {
            title: 'Бот заблокирован',
            message: 'Пожалуйста, разблокируйте бота в Telegram и попробуйте снова.'
          }
        },
        { status: 403 }
      )
    }

    if (!sendResult.success) {
      return NextResponse.json(
        { success: false, error: 'Ошибка отправки кода в Telegram' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Код восстановления отправлен в Telegram'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

