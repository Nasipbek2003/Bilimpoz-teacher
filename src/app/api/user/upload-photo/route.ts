import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const user = await auth(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('photo') as File

    if (!file) {
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 400 }
      )
    }

    // Проверяем тип файла
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Файл должен быть изображением' },
        { status: 400 }
      )
    }

    // Проверяем размер файла (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Размер файла не должен превышать 5MB' },
        { status: 400 }
      )
    }

    // Создаем директорию для загрузок если её нет
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'profiles')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Генерируем уникальное имя файла
    const fileExtension = file.name.split('.').pop()
    const fileName = `${user.id}_${Date.now()}.${fileExtension}`
    const filePath = join(uploadsDir, fileName)

    // Сохраняем файл
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Создаем URL для доступа к файлу
    const fileUrl = `/uploads/profiles/${fileName}`

    // Обновляем URL фото в базе данных
    await prisma.users.update({
      where: { id: user.id },
      data: {
        profile_photo_url: fileUrl,
        updated_at: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Фото профиля успешно обновлено',
      photo_url: fileUrl
    })
  } catch (error) {
    console.error('Upload photo error:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

