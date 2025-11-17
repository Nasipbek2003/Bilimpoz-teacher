import { NextResponse } from 'next/server'
import { telegramPolling } from '@/lib/telegram-polling'
import { getTeacherBotToken } from '@/lib/settings'

export async function GET() {
  try {
    const botToken = await getTeacherBotToken()
    
    return NextResponse.json({
      success: true,
      data: {
        pollingActive: telegramPolling.isActive,
        botConfigured: !!botToken,
        environment: process.env.NODE_ENV
      }
    })
  } catch (error) {
    console.error('Error getting polling status:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка получения статуса' },
      { status: 500 }
    )
  }
}

