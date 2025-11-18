import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { login, password, fullName, language } = await request.json()

    // Валидация входных данных
    if (!login || !password || !fullName) {
      return NextResponse.json(
        { success: false, message: 'Все обязательные поля должны быть заполнены' },
        { status: 400 }
      )
    }

    // Валидация языка
    const validLanguage = language === 'kg' ? 'kg' : 'ru'

    // Валидация логина
    const loginRegex = /^[a-zA-Z][a-zA-Z0-9_]{2,19}$/
    if (!loginRegex.test(login.trim())) {
      return NextResponse.json(
        { success: false, message: 'Логин должен начинаться с буквы, содержать 3-20 символов (латиница, цифры, подчеркивание)' },
        { status: 400 }
      )
    }

    // Валидация пароля
    if (password.length < 8 || password.length > 50) {
      return NextResponse.json(
        { success: false, message: 'Пароль должен содержать от 8 до 50 символов' },
        { status: 400 }
      )
    }

    // Валидация имени
    const nameRegex = /^[а-яА-ЯёЁ\s]+$/
    if (!nameRegex.test(fullName.trim()) || fullName.trim().length < 3 || fullName.trim().length > 30) {
      return NextResponse.json(
        { success: false, message: 'Имя должно содержать от 3 до 30 символов (только кириллица и пробелы)' },
        { status: 400 }
      )
    }

    // Проверка существования пользователя
    const existingUser = await prisma.users.findUnique({
      where: { login: login.trim() }
    })

    if (existingUser) {
      // Если пользователь существует
      if (!existingUser.telegram_id) {
        // Пользователь существует, но не подключен Telegram - продолжаем регистрацию
        return NextResponse.json({
          success: true,
          message: 'Аккаунт существует, но не подключен Telegram',
          data: {
            needsTelegram: true,
            id: existingUser.id,
            login: existingUser.login,
            name: existingUser.name,
            status: existingUser.status,
            language: existingUser.language
          }
        })
      } else {
        // Пользователь полностью зарегистрирован
      return NextResponse.json(
          { success: false, message: 'Пользователь уже существует' },
        { status: 409 }
      )
      }
    }

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 12)

    // Создание пользователя
    const user = await prisma.users.create({
      data: {
        name: fullName.trim(),
        login: login.trim(),
        hash_password: hashedPassword,
        role: 'teacher',
        telegram_id: null,
        status: 'registered',
        language: validLanguage,
        created_at: new Date(),
        updated_at: new Date()
      },
      select: {
        id: true,
        name: true,
        login: true,
        status: true
      }
    })

    // Создание статистики пользователя
    await prisma.user_stats.create({
      data: {
        user_id: user.id
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Первичные данные сохранены',
      data: {
        id: user.id,
        login: user.login,
        name: user.name,
        status: user.status,
        language: validLanguage
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
