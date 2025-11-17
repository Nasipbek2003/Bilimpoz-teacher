import { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const user = await auth(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    // Проверка статуса пользователя
    if (user.status === 'banned' || user.status === 'deleted') {
      return NextResponse.json(
        { error: 'Аккаунт заблокирован или удален', status: user.status },
        { status: 403 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    // Обработка ошибок подключения к БД
    if (error instanceof Error && error.message === 'DATABASE_CONNECTION_ERROR') {
      return NextResponse.json(
        { error: 'Не удается подключиться к базе данных' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}





