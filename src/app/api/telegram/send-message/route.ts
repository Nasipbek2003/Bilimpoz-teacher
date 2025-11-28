import { NextRequest, NextResponse } from 'next/server'
import { telegramService } from '@/lib/telegram'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

/**
 * API Endpoint для отправки сообщений через Telegram бота
 * POST /api/telegram/send-message
 * 
 * Body:
 * {
 *   "telegramId": "123456789",
 *   "message": "Текст сообщения"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Проверка аутентификации
    const user = await auth(request)
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Не авторизован',
          message: 'Требуется аутентификация для отправки сообщений'
        },
        { status: 401 }
      )
    }

    // Проверка роли (только учителя и администраторы могут отправлять сообщения)
    if (user.role !== 'teacher' && user.role !== 'admin') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Доступ запрещен',
          message: 'Только учителя и администраторы могут отправлять сообщения'
        },
        { status: 403 }
      )
    }

    // Получение данных из запроса
    const body = await request.json()
    const { telegramId, message } = body

    // Валидация входных данных
    if (!telegramId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Telegram ID обязателен',
          message: 'Необходимо указать Telegram ID получателя'
        },
        { status: 400 }
      )
    }

    if (!message) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Сообщение обязательно',
          message: 'Необходимо указать текст сообщения'
        },
        { status: 400 }
      )
    }

    // Валидация формата Telegram ID (должен быть числом или строкой из цифр)
    const telegramIdStr = String(telegramId).trim()
    if (!/^\d+$/.test(telegramIdStr)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Неверный формат Telegram ID',
          message: 'Telegram ID должен содержать только цифры'
        },
        { status: 400 }
      )
    }

    // Валидация длины сообщения (Telegram ограничение - 4096 символов)
    const messageStr = String(message).trim()
    if (messageStr.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Сообщение не может быть пустым',
          message: 'Текст сообщения должен содержать хотя бы один символ'
        },
        { status: 400 }
      )
    }

    if (messageStr.length > 4096) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Сообщение слишком длинное',
          message: 'Максимальная длина сообщения - 4096 символов'
        },
        { status: 400 }
      )
    }

    // Проверка существования пользователя с данным Telegram ID (опционально)
    const recipient = await prisma.users.findUnique({
      where: { telegram_id: telegramIdStr },
      select: { id: true, name: true, telegram_id: true, status: true }
    })

    // Если пользователь не найден, предупреждаем, но продолжаем отправку
    if (!recipient) {
      console.warn(`[SEND-MESSAGE] User with telegram_id ${telegramIdStr} not found in database`)
    }

    // Проверка статуса пользователя
    if (recipient && recipient.status === 'banned') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Пользователь заблокирован',
          message: 'Невозможно отправить сообщение заблокированному пользователю'
        },
        { status: 403 }
      )
    }

    if (recipient && recipient.status === 'deleted') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Пользователь удален',
          message: 'Невозможно отправить сообщение удаленному пользователю'
        },
        { status: 403 }
      )
    }

    console.log(`[SEND-MESSAGE] Sending message from ${user.login} to telegram_id: ${telegramIdStr}`)

    // Отправка сообщения через Telegram Bot
    const sendResult = await telegramService.sendMessage(telegramIdStr, messageStr)

    if (!sendResult) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ошибка отправки сообщения',
          message: 'Не удалось отправить сообщение. Возможно, бот заблокирован пользователем или Telegram ID неверный'
        },
        { status: 500 }
      )
    }

    console.log(`[SEND-MESSAGE] Message successfully sent to telegram_id: ${telegramIdStr}`)

    // Успешный ответ
    return NextResponse.json({
      success: true,
      message: 'Сообщение успешно отправлено',
      data: {
        telegramId: telegramIdStr,
        recipientName: recipient?.name || 'Неизвестный пользователь',
        sentAt: new Date().toISOString(),
        messageLength: messageStr.length
      }
    })

  } catch (error: any) {
    console.error('[SEND-MESSAGE] Error:', error)

    // Обработка специфичных ошибок
    if (error.message?.includes('bot token')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Бот не настроен',
          message: 'Telegram бот не настроен. Обратитесь к администратору.'
        },
        { status: 503 }
      )
    }

    if (error.message?.includes('network') || error.message?.includes('fetch')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Ошибка сети',
          message: 'Не удалось подключиться к Telegram API. Попробуйте позже.'
        },
        { status: 503 }
      )
    }

    if (error.name === 'SyntaxError' || error.message?.includes('JSON')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Неверный формат данных',
          message: 'Некорректный формат запроса'
        },
        { status: 400 }
      )
    }

    // Общая ошибка
    return NextResponse.json(
      { 
        success: false, 
        error: 'Внутренняя ошибка сервера',
        message: 'Произошла непредвиденная ошибка при отправке сообщения'
      },
      { status: 500 }
    )
  }
}

