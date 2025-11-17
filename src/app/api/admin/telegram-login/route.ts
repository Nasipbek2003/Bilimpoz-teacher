import { NextRequest, NextResponse } from 'next/server'
import { getAdminTelegramLogin } from '@/lib/settings'

export async function GET(request: NextRequest) {
  try {
    const telegramLogin = await getAdminTelegramLogin()
    
    if (!telegramLogin) {
      return NextResponse.json(
        { success: false, error: 'Логин администратора не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        telegramLogin
      }
    })
  } catch (error) {
    console.error('Error fetching admin telegram login:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

