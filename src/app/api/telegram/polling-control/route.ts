import { NextRequest, NextResponse } from 'next/server'
import { telegramPolling } from '@/lib/telegram-polling'

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()
    
    if (action === 'start') {
      const result = await telegramPolling.start()
      return NextResponse.json({
        success: result,
        message: result ? 'Polling запущен' : 'Ошибка запуска polling'
      })
    } else if (action === 'stop') {
      telegramPolling.stop()
      return NextResponse.json({
        success: true,
        message: 'Polling остановлен'
      })
    } else {
      return NextResponse.json(
        { success: false, error: 'Неизвестное действие. Используйте "start" или "stop"' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error controlling polling:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка управления polling' },
      { status: 500 }
    )
  }
}

