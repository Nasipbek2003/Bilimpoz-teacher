import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await auth(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    // Получаем полные данные пользователя
    const fullUser = await prisma.users.findUnique({
      where: { id: user.id },
      include: {
        social_networks: true,
        user_data: true
      }
    })

    if (!fullUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: fullUser.id,
      name: fullUser.name,
      login: fullUser.login,
      profile_photo_url: fullUser.profile_photo_url,
      language: fullUser.language,
      telegram_id: fullUser.telegram_id,
      social_networks: fullUser.social_networks,
      user_data: fullUser.user_data
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await auth(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    const { name, language, social_networks } = await request.json()

    // Валидация данных
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Имя обязательно для заполнения' },
        { status: 400 }
      )
    }

    // Обновляем основные данные пользователя
    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
        language: language || 'ru',
        updated_at: new Date()
      }
    })

    // Обновляем социальные сети
    if (social_networks) {
      await prisma.social_networks.upsert({
        where: { user_id: user.id },
        create: {
          user_id: user.id,
          telegram_login: social_networks.telegram_login || null,
          instagram_login: social_networks.instagram_login || null,
          whatsapp_login: social_networks.whatsapp_login || null
        },
        update: {
          telegram_login: social_networks.telegram_login || null,
          instagram_login: social_networks.instagram_login || null,
          whatsapp_login: social_networks.whatsapp_login || null
        }
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Профиль успешно обновлен',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        language: updatedUser.language
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}


