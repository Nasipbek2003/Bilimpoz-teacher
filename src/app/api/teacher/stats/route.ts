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

    // Получение статистики из базы данных
    
    // 1. Тесты добавлены - количество тестов, созданных учителем
    const tests_added = await prisma.teacher_tests.count({
      where: {
        created_by: teacherId
      }
    })

    // 2. Студенты прошли тесты - уникальные студенты, прошедшие тесты этого учителя
    // Получаем все тесты учителя
    const teacherTests = await prisma.teacher_tests.findMany({
      where: { created_by: teacherId },
      select: { id: true }
    })
    
    const teacherTestIds = teacherTests.map(test => test.id)
    
    // Находим уникальных студентов, которые прошли эти тесты
    let students_completed_tests = 0
    if (teacherTestIds.length > 0) {
      // Используем groupBy для получения уникальных студентов
      const uniqueStudents = await prisma.passed_materials.groupBy({
        by: ['passed_by'],
        where: {
          material_type: 'teacher_test',
          material_id: { in: teacherTestIds }
        }
      })
      students_completed_tests = uniqueStudents.length
    }

    // 3. Мои рефералы - количество студентов по реферальным ссылкам учителя
    // Получаем все реферальные ссылки учителя
    const referralLinks = await prisma.referral_links.findMany({
      where: { teacher_id: teacherId },
      select: { id: true }
    })
    
    const referralLinkIds = referralLinks.map(link => link.id)
    
    let referral_students = 0
    if (referralLinkIds.length > 0) {
      referral_students = await prisma.teacher_referrals.count({
        where: {
          referral_link_id: { in: referralLinkIds }
        }
      })
    }

    // 4. Всего студентов на платформе
    const total_platform_students = await prisma.users.count({
      where: {
        role: 'student'
      }
    })

    const stats = {
      tests_added,
      students_completed_tests,
      referral_students,
      total_platform_students
    }

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Stats API error:', error)
    return NextResponse.json(
      { success: false, error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

