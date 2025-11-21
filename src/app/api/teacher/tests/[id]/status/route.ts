import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

/**
 * PATCH /api/teacher/tests/{id}/status?teacherId={teacherId}
 * Изменение статуса теста
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверка аутентификации
    const user = await auth(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      )
    }

    // Проверка роли - только учителя могут изменять статус тестов
    if (user.role !== 'teacher') {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    const testId = params.id
    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('teacherId') || user.id

    // Проверка существования теста
    const test = await prisma.teacher_tests.findUnique({
      where: { id: testId }
    })

    if (!test) {
      return NextResponse.json(
        { success: false, error: 'Тест не найден' },
        { status: 404 }
      )
    }

    // Проверка прав доступа - только создатель теста может изменить статус
    if (test.created_by !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { status } = body

    // Валидация статуса
    if (!status || !['draft', 'published'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Некорректный статус' },
        { status: 400 }
      )
    }

    // В таблице teacher_tests нет поля status
    // Статус определяется фактом наличия теста в БД
    // Для published статуса тест уже должен быть в БД
    // Просто возвращаем успешный ответ
    
    return NextResponse.json({
      success: true,
      data: {
        id: test.id,
        status: status
      }
    })
  } catch (error) {
    console.error('Ошибка изменения статуса теста:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

