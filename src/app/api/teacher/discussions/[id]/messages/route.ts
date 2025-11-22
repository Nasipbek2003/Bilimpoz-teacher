import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/jwt-middleware'

/**
 * GET /api/teacher/discussions/[id]/messages
 * Получение сообщений обсуждения
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

    // Проверяем, что обсуждение принадлежит учителю
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
      }
    })

    if (!discussion) {
      return NextResponse.json(
        { success: false, error: 'Обсуждение не найдено' },
        { status: 404 }
      )
    }

    // Получаем сообщения
    const messages = await prisma.discussion_chat.findMany({
      where: { discussion_id: discussionId },
      orderBy: { created_at: 'asc' },
      select: {
        id: true,
        text: true,
        companion: true,
        created_at: true
      }
    })

    // Форматируем сообщения для фронтенда
    const formattedMessages = messages.map(message => ({
      id: message.id,
      text: message.text,
      companion: message.companion === 'ai' ? 'teacher' : message.companion, // Временно используем ai как teacher
      timestamp: message.created_at.toISOString()
    }))

    return NextResponse.json({
      success: true,
      data: formattedMessages
    })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при получении сообщений' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/teacher/discussions/[id]/messages
 * Отправка нового сообщения
 */
export async function POST(
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
    const { text } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Текст сообщения не может быть пустым' },
        { status: 400 }
      )
    }

    // Проверяем, что обсуждение принадлежит учителю
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
      }
    })

    if (!discussion) {
      return NextResponse.json(
        { success: false, error: 'Обсуждение не найдено' },
        { status: 404 }
      )
    }

    // Создаем сообщение в транзакции
    const result = await prisma.$transaction(async (tx) => {
      // Создаем сообщение (используем 'ai' для сообщений учителя, пока нет 'teacher' в enum)
      const message = await tx.discussion_chat.create({
        data: {
          discussion_id: discussionId,
          companion: 'ai', // Временно используем ai для учителя
          text: text.trim()
        }
      })

      // Обновляем время последнего обновления обсуждения
      await tx.discussions.update({
        where: { id: discussionId },
        data: { updated_at: new Date() }
      })

      return message
    })

    // Форматируем ответ
    const formattedMessage = {
      id: result.id,
      text: result.text,
      companion: 'teacher', // На фронтенде показываем как teacher
      timestamp: result.created_at.toISOString()
    }

    return NextResponse.json({
      success: true,
      data: formattedMessage
    })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { success: false, error: 'Ошибка при отправке сообщения' },
      { status: 500 }
    )
  }
}
