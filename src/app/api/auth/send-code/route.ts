import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { canRequestNewCode } from '@/lib/verification'
import { telegramPolling } from '@/lib/telegram-polling'
import { getTeacherBotToken } from '@/lib/settings'

export async function POST(request: NextRequest) {
  try {
    const { login, telegramId, language } = await request.json()

    console.log('[SEND-CODE] Request:', { login, telegramId, language })

    // Валидация входных данных
    if (!login || !telegramId) {
      return NextResponse.json(
        { success: false, error: 'Логин и Telegram ID обязательны' },
        { status: 400 }
      )
    }

    // Проверка наличия токена бота
    const botToken = await getTeacherBotToken()
    if (!botToken) {
      console.error('[SEND-CODE] Bot token not found')
      return NextResponse.json(
        { success: false, error: 'Бот не настроен. Обратитесь к администратору.' },
        { status: 503 }
      )
    }

    // Найти пользователя по логину
    const user = await prisma.users.findUnique({
      where: { login: login.trim() }
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

    // Проверка cooldown (60 секунд между запросами)
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

    console.log('[SEND-CODE] Sending code via telegramPolling...')
    
    // Отправить код через Telegram Bot (код генерируется внутри метода)
    const sendResult = await telegramPolling.sendVerificationCode(
      login.trim(),
      telegramId,
      language || 'ru'
    )

    console.log('[SEND-CODE] Send result:', sendResult)

    if (sendResult.isBlocked) {
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
      message: 'Код отправлен в Telegram',
      data: {
        codeSent: true,
        telegramId: telegramId,
        expiresIn: 300 // 5 минут в секундах
      }
    })
  } catch (error) {
    console.error('Send code error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

