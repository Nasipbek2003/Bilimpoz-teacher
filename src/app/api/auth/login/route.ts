import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { login, password } = await request.json()

    console.log(`[LOGIN] Attempting login for: ${login}`)

    // Валидация входных данных
    if (!login || !password) {
      return NextResponse.json(
        { success: false, error: 'Логин и пароль обязательны' },
        { status: 400 }
      )
    }

    // Поиск пользователя в базе данных
    const user = await prisma.users.findUnique({
      where: { login: login.trim() },
      include: {
        user_stats: true,
        social_networks: true
      }
    })

    // Проверка существования пользователя
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Неверный логин или пароль' },
        { status: 404 }
      )
    }

    // Проверка роли
    if (user.role !== 'teacher') {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    // Проверка статуса пользователя
    if (user.status === 'banned' || user.status === 'deleted') {
      return NextResponse.json(
        { success: false, error: 'Аккаунт заблокирован или удален' },
        { status: 403 }
      )
    }

    // Проверка пароля
    const isPasswordValid = await verifyPassword(password, user.hash_password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Неверный логин или пароль' },
        { status: 401 }
      )
    }

    // Проверка наличия Telegram
    if (!user.telegram_id) {
      return NextResponse.json({
        success: false,
        message: 'Telegram не подключен',
        needsTelegram: true,
        data: {
          id: user.id,
          login: user.login,
          name: user.name,
          telegramId: null,
          profilePhoto: user.profile_photo_url,
          language: user.language,
          status: user.status
        }
      })
    }

    // Данные верны, возвращаем данные пользователя БЕЗ токена
    return NextResponse.json({
      success: true,
      message: 'Данные верны',
      data: {
        id: user.id,
        login: user.login,
        name: user.name,
        telegramId: user.telegram_id,
        profilePhoto: user.profile_photo_url,
        language: user.language,
        status: user.status
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
