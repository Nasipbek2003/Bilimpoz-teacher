import { NextRequest, NextResponse } from 'next/server'
import { getVerificationMessages, updateVerificationMessages } from '@/lib/settings'
import { auth } from '@/lib/auth'

/**
 * GET /api/admin/verification-messages
 * Получение сообщений верификации
 */
export async function GET(request: NextRequest) {
  try {
    // Проверка авторизации и прав администратора
    const user = await auth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    const messages = await getVerificationMessages()
    
    if (!messages) {
      return NextResponse.json({
        success: false,
        error: 'Сообщения верификации не найдены в БД'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: messages
    })
  } catch (error) {
    console.error('Error getting verification messages:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/verification-messages
 * Обновление сообщений верификации
 */
export async function PUT(request: NextRequest) {
  try {
    // Проверка авторизации и прав администратора
    const user = await auth(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { messages } = body

    if (!messages || !messages.ru || !messages.kg) {
      return NextResponse.json(
        { success: false, error: 'Неверный формат данных. Ожидается объект с полями ru и kg' },
        { status: 400 }
      )
    }

    // Валидация структуры
    const requiredKeys = [
      'verificationRequired',
      'whatIsVerification',
      'verificationDescription',
      'howToVerify',
      'verifyStep1',
      'verifyStep2',
      'verifyStep3',
      'verifyStep4',
      'afterVerification',
      'connectionSuccessVerified',
      'invalidParameters',
      'telegramAlreadyConnected',
      'adminVerificationMessage'
    ]

    for (const lang of ['ru', 'kg'] as const) {
      for (const key of requiredKeys) {
        if (!messages[lang][key] || typeof messages[lang][key] !== 'string') {
          return NextResponse.json(
            { success: false, error: `Отсутствует или неверный формат ключа: ${lang}.${key}` },
            { status: 400 }
          )
        }
      }
    }

    const success = await updateVerificationMessages(messages)

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Ошибка при сохранении сообщений' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Сообщения верификации успешно обновлены',
      data: messages
    })
  } catch (error) {
    console.error('Error updating verification messages:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

