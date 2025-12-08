import { NextRequest, NextResponse } from 'next/server'
import { getPresignedUrl } from '@/lib/s3'

/**
 * API роут для получения presigned URL для изображений из S3
 * Это решает проблему доступа к приватным файлам в S3
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL изображения не предоставлен' },
        { status: 400 }
      )
    }

    // Проверяем, что URL начинается с разрешенного домена
    const allowedDomains = [
      's3.twcstorage.ru',
      'storage.yandexcloud.net',
      'amazonaws.com'
    ]

    const isAllowed = allowedDomains.some(domain => imageUrl.includes(domain))
    
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Недопустимый домен изображения' },
        { status: 403 }
      )
    }

    console.log('📸 Запрос изображения для:', imageUrl)

    let fetchUrl: string
    
    // Проверяем, нужен ли presigned URL или можно обращаться напрямую
    // Для PUBLIC S3 (новые изображения) - обращаемся напрямую
    // Для PRIVATE S3 (старые изображения) - используем presigned URL
    if (imageUrl.includes('/bilimpoz/teachers/teacher-test-images/')) {
      // Новые изображения в PUBLIC S3 - доступны напрямую
      console.log('🔓 PUBLIC S3 изображение, обращаемся напрямую')
      fetchUrl = imageUrl
    } else {
      // Старые изображения в PRIVATE S3 - нужен presigned URL
      console.log('🔒 PRIVATE S3 изображение, генерируем presigned URL')
      fetchUrl = await getPresignedUrl(imageUrl, 3600)
      console.log('✅ Presigned URL сгенерирован успешно')
    }

    // Загружаем изображение
    const response = await fetch(fetchUrl, {
      headers: {
        'Accept': 'image/*'
      }
    })

    if (!response.ok) {
      console.error('❌ Ошибка загрузки изображения из S3:', response.status, response.statusText)
      return NextResponse.json(
        { error: `Ошибка загрузки изображения: ${response.statusText}` },
        { status: response.status }
      )
    }

    // Получаем тип контента
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    
    // Получаем данные изображения
    const imageBuffer = await response.arrayBuffer()

    console.log('✅ Изображение успешно загружено, размер:', imageBuffer.byteLength, 'байт')

    // Возвращаем изображение с правильными заголовками
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600', // Кэшируем на 1 час (как presigned URL)
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
      }
    })
  } catch (error) {
    console.error('❌ Ошибка проксирования изображения:', error)
    const errorMessage = error instanceof Error ? error.message : 'Внутренняя ошибка сервера'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}







