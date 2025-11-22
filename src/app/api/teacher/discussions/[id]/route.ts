import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt-middleware'

/**
 * GET /api/teacher/discussions/[id]
 * Получение конкретного обсуждения
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const discussionId = params.id

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

    // Получаем обсуждение с проверкой принадлежности учителю
    const discussion = await prisma.discussions.findFirst({
      where: {
        id: discussionId,
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
        _count: {
          select: {
            discussion_chat: true
          }
        }
      }
    })

    if (!discussion) {
      return NextResponse.json(
        { success: false, error: 'Обсуждение не найдено' },
        { status: 404 }
      )
    }

    // Определяем статус через эвристику
    const daysSinceUpdate = Math.floor(
      (new Date().getTime() - new Date(discussion.updated_at).getTime()) / (1000 * 60 * 60 * 24)
    )
    const status = discussion.summarized_chat ? 'closed' : 
                  daysSinceUpdate > 7 ? 'closed' : 'active'

    const formattedDiscussion = {
      id: discussion.id,
      name: discussion.name || discussion.lesson.title,
      student: discussion.student.name,
      studentId: discussion.student.id,
      lessonId: discussion.lesson.id,
      lessonTitle: discussion.lesson.title,
      messageCount: discussion._count.discussion_chat,
      status,
      summarizedChat: discussion.summarized_chat,
      createdAt: discussion.created_at,
      updatedAt: discussion.updated_at
    }

    return NextResponse.json({
      success: true,
      data: formattedDiscussion
    })

  } catch (error) {
    console.error('Error fetching discussion:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при получении обсуждения' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/teacher/discussions/[id]
 * Обновление обсуждения (закрытие, суммирование)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const discussionId = params.id

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
    const { action, summarizedChat } = await request.json()

    // Проверяем, что обсуждение принадлежит учителю
    const existingDiscussion = await prisma.discussions.findFirst({
      where: {
        id: discussionId,
        lesson: {
          lesson_group: {
            course: {
              created_by: teacherId
            }
          }
        }
      }
    })

    if (!existingDiscussion) {
      return NextResponse.json(
        { success: false, error: 'Обсуждение не найдено' },
        { status: 404 }
      )
    }

    let updateData: any = {}

    if (action === 'close') {
      // Для закрытия используем суммаризацию как индикатор
      updateData.summarized_chat = summarizedChat || 'Обсуждение закрыто учителем'
    } else if (action === 'summarize' && summarizedChat) {
      updateData.summarized_chat = summarizedChat
    }

    // Обновляем обсуждение
    const updatedDiscussion = await prisma.discussions.update({
      where: { id: discussionId },
      data: updateData,
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
        _count: {
          select: {
            discussion_chat: true
          }
        }
      }
    })

    const status = updatedDiscussion.summarized_chat ? 'closed' : 'active'

    const formattedDiscussion = {
      id: updatedDiscussion.id,
      name: updatedDiscussion.name || updatedDiscussion.lesson.title,
      student: updatedDiscussion.student.name,
      studentId: updatedDiscussion.student.id,
      lessonId: updatedDiscussion.lesson.id,
      lessonTitle: updatedDiscussion.lesson.title,
      messageCount: updatedDiscussion._count.discussion_chat,
      status,
      summarizedChat: updatedDiscussion.summarized_chat,
      createdAt: updatedDiscussion.created_at,
      updatedAt: updatedDiscussion.updated_at
    }

    return NextResponse.json({
      success: true,
      data: formattedDiscussion
    })

  } catch (error) {
    console.error('Error updating discussion:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при обновлении обсуждения' },
      { status: 500 }
    )
  }
}
