import { NextResponse } from 'next/server'
import { getTeacherBotToken } from '@/lib/settings'

export async function GET() {
  try {
    const botToken = await getTeacherBotToken()
    
    if (!botToken) {
      return NextResponse.json({
        success: false,
        message: 'TEACHER_BOT_TOKEN не установлен'
      }, { status: 400 })
    }

    // Получаем информацию о боте
    const botInfoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getMe`)
    const botInfo = await botInfoResponse.json()

    // Получаем последние обновления
    const updatesResponse = await fetch(`https://api.telegram.org/bot${botToken}/getUpdates?limit=5`)
    const updates = await updatesResponse.json()

    // Проверяем webhook
    const webhookResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`)
    const webhookInfo = await webhookResponse.json()

    return NextResponse.json({
      success: true,
      data: {
        botInfo: botInfo.result,
        recentUpdates: updates.result || [],
        webhookInfo: webhookInfo.result,
        tokenValid: botInfo.ok
      }
    })
  } catch (error) {
    console.error('Error getting bot info:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка получения информации о боте' },
      { status: 500 }
    )
  }
}

