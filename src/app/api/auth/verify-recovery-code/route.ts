import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRecoveryCode } from '@/lib/verification'

export async function POST(request: NextRequest) {
  try {
    const { login, code } = await request.json()

    // Валидация входных данных
    if (!login || !code) {
      return NextResponse.json(
        { success: false, error: 'Логин и код обязательны' },
        { status: 400 }
      )
    }

    // Найти пользователя по логину
    const user = await prisma.users.findUnique({
      where: { login: login.trim() }
    })

    // Проверки
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    if (user.role !== 'teacher') {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    // Проверить код (БЕЗ пометки как использованного)
    const verificationResult = await checkRecoveryCode(user.id, code.trim())

    if (!verificationResult.success) {
      return NextResponse.json(
        { success: false, error: verificationResult.message },
        { status: 400 }
      )
    }

    // Проверить принадлежность кода пользователю
    if (verificationResult.userId !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Неверный код восстановления' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Код подтвержден. Теперь введите новый пароль.',
      data: {
        userId: user.id,
        login: user.login,
        codeId: verificationResult.codeId
      }
    })
  } catch (error) {
    console.error('Verify recovery code error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

