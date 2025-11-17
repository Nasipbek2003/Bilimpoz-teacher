import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Проверка аутентификации
    const user = await auth(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Не авторизован' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const teacherId = searchParams.get('teacherId') || user.id

    // Проверка, что запрашивающий пользователь имеет доступ к этим данным
    if (teacherId !== user.id && user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    // Получение активности из базы данных
    
    // Получаем последние активности из audit_logs
    const auditLogs = await prisma.audit_logs.findMany({
      where: { user_id: teacherId },
      orderBy: { created_at: 'desc' },
      take: 50
    })

    // Преобразуем audit_logs в формат активности
    const activities = auditLogs.map((log) => {
      // Маппинг типов событий на типы активности
      let activityType = 'test_created'
      let activityKey = 'testCreated'
      let icon = 'FileText'
      let data: Record<string, any> = {}

      switch (log.event_type) {
        case 'create_test_for_student':
          activityType = 'test_created'
          activityKey = 'testCreated'
          icon = 'FileText'
          // Можно получить название теста из Teacher_tests
          break
        case 'take_teacher_test':
          activityType = 'test_completed'
          activityKey = 'testCompleted'
          icon = 'CheckCircle'
          break
        case 'take_tests_for_students':
          activityType = 'test_completed'
          activityKey = 'testCompleted'
          icon = 'CheckCircle'
          break
        default:
          activityType = 'test_created'
          activityKey = 'testCreated'
          icon = 'Activity'
      }

      return {
        id: log.id,
        type: activityType,
        activityKey,
        data,
        timestamp: log.created_at.toISOString(),
        icon,
        color: 'blue'
      }
    })

    // Если нет активности в audit_logs, добавляем моковые данные для демонстрации
    if (activities.length === 0) {
      // Получаем последние созданные тесты учителя
      const recentTests = await prisma.teacher_tests.findMany({
        where: { created_by: teacherId },
        orderBy: { created_at: 'desc' },
        take: 5,
        select: {
          id: true,
          name: true,
          created_at: true
        }
      })

      activities.push(...recentTests.map((test) => ({
        id: `test_${test.id}`,
        type: 'test_created',
        activityKey: 'testCreated',
        data: { testName: test.name },
        timestamp: test.created_at.toISOString(),
        icon: 'FileText',
        color: 'blue'
      })))
    }

    return NextResponse.json({
      success: true,
      data: activities
    })
  } catch (error) {
    console.error('Activity API error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

