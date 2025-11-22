import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt-middleware'

/**
 * GET /api/teacher/discussions
 * Получение списка обсуждений для учителя
 */
export async function GET(request: NextRequest) {
  try {
    // Получаем токен из заголовков
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Токен не предоставлен' },
        { status: 401 }
      )
    }

    // Проверяем токен
    const payload = await verifyToken(token)
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, error: 'Недействительный токен' },
        { status: 401 }
      )
    }

    const teacherId = payload.userId

    // Получаем все обсуждения для уроков этого учителя
    const discussions = await prisma.discussions.findMany({
      where: {
        lesson: {
          lesson_group: {
            course: {
              created_by: teacherId
            }
          }
        }
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            profile_photo_url: true
          }
        },
        lesson: {
          select: {
            id: true,
            title: true
          }
        },
        discussion_chat: {
          orderBy: { created_at: 'desc' },
          take: 1,
          select: {
            text: true,
            created_at: true,
            companion: true
          }
        },
        _count: {
          select: {
            discussion_chat: true
          }
        }
      },
      orderBy: { updated_at: 'desc' }
    })

    // Форматируем данные для фронтенда
    const formattedDiscussions = discussions.map(discussion => {
      const lastMessage = discussion.discussion_chat[0]
      
      // Определяем статус через эвристику (пока нет поля status в БД)
      const daysSinceUpdate = Math.floor(
        (new Date().getTime() - new Date(discussion.updated_at).getTime()) / (1000 * 60 * 60 * 24)
      )
      const status = discussion.summarized_chat ? 'closed' : 
                    daysSinceUpdate > 7 ? 'closed' : 'active'

      // Считаем непрочитанные (пока без точного отслеживания)
      // Считаем сообщения студента за последние 24 часа как непрочитанные
      const oneDayAgo = new Date()
      oneDayAgo.setDate(oneDayAgo.getDate() - 1)
      
      return {
        id: discussion.id,
        name: discussion.name || discussion.lesson.title,
        student: discussion.student.name,
        studentId: discussion.student.id,
        lessonId: discussion.lesson.id,
        lessonTitle: discussion.lesson.title,
        messageCount: discussion._count.discussion_chat,
        lastMessage: lastMessage?.text || '',
        lastMessageTime: lastMessage?.created_at || discussion.created_at,
        status,
        unreadCount: status === 'active' && lastMessage?.companion === 'student' && 
                    new Date(lastMessage.created_at) > oneDayAgo ? 1 : 0,
        summarizedChat: discussion.summarized_chat,
        createdAt: discussion.created_at,
        updatedAt: discussion.updated_at
      }
    })

    return NextResponse.json({
      success: true,
      data: formattedDiscussions
    })

  } catch (error) {
    console.error('Error fetching discussions:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при получении обсуждений' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/teacher/discussions
 * Создание нового обсуждения
 */
export async function POST(request: NextRequest) {
  try {
    // Получаем токен из заголовков
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Токен не предоставлен' },
        { status: 401 }
      )
    }

    // Проверяем токен
    const payload = await verifyToken(token)
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, error: 'Недействительный токен' },
        { status: 401 }
      )
    }

    const teacherId = payload.userId
    const { name, lessonId, studentId } = await request.json()

    if (!name || !lessonId || !studentId) {
      return NextResponse.json(
        { success: false, error: 'Отсутствуют обязательные поля' },
        { status: 400 }
      )
    }

    // Проверяем, что урок принадлежит учителю
    const lesson = await prisma.lessons.findFirst({
      where: {
        id: lessonId,
        lesson_group: {
          course: {
            created_by: teacherId
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: 'Урок не найден или не принадлежит учителю' },
        { status: 403 }
      )
    }

    // Создаем обсуждение
    const discussion = await prisma.discussions.create({
      data: {
        name,
        lesson_id: lessonId,
        student_id: studentId
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            profile_photo_url: true
          }
        },
        lesson: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: discussion.id,
        name: discussion.name,
        student: discussion.student.name,
        studentId: discussion.student.id,
        lessonId: discussion.lesson.id,
        lessonTitle: discussion.lesson.title,
        messageCount: 0,
        lastMessage: '',
        lastMessageTime: discussion.created_at,
        status: 'active',
        unreadCount: 0,
        createdAt: discussion.created_at,
        updatedAt: discussion.updated_at
      }
    })

  } catch (error) {
    console.error('Error creating discussion:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при создании обсуждения' },
      { status: 500 }
    )
  }
}
