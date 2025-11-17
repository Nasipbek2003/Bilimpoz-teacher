import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const login = searchParams.get('login')

    if (!login) {
      return NextResponse.json(
        { success: false, error: 'Логин обязателен' },
        { status: 400 }
      )
    }

    // Найти пользователя по логину
    const user = await prisma.users.findUnique({
      where: { login: login.trim() },
      select: {
        id: true,
        login: true,
        telegram_id: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      connected: !!user.telegram_id
    })
  } catch (error) {
    console.error('Check telegram error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

