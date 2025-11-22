import { NextRequest, NextResponse } from 'next/server'
import { auth, verifyPassword, hashPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const user = await auth(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    const { currentPassword, newPassword } = await request.json()

    // Валидация данных
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Текущий и новый пароль обязательны' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Новый пароль должен содержать минимум 6 символов' },
        { status: 400 }
      )
    }

    // Получаем полные данные пользователя для проверки пароля
    const fullUser = await prisma.users.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        hash_password: true
      }
    })

    if (!fullUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    // Проверяем текущий пароль
    const isCurrentPasswordValid = await verifyPassword(currentPassword, fullUser.hash_password)
    
    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { error: 'Неверный текущий пароль' },
        { status: 400 }
      )
    }

    // Хешируем новый пароль
    const hashedNewPassword = await hashPassword(newPassword)

    // Обновляем пароль в базе данных
    await prisma.users.update({
      where: { id: user.id },
      data: {
        hash_password: hashedNewPassword,
        updated_at: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Пароль успешно изменен'
    })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

