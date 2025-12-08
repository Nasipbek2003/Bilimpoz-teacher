import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { getSetting } from './settings'

/**
 * Типы путей для файлов в S3
 */
export type S3PathType = 
  | 'course-images'
  | 'course-videos'
  | 'lesson-videos'
  | 'lesson-images'
  | 'lesson-documents'
  | 'lesson-lectures'
  | 'lesson-test-images'
  | 'profile-photos'
  | 'newsletter-images'
  | 'teacher-profile-photos'
  | 'question-pictures'
  | 'teacher-test-images'

/**
 * Получение пути в S3 для типа файла
 */
export function getS3Path(type: S3PathType): string {
  const basePath = 'bilimpoz'
  
  switch (type) {
    case 'course-images':
      return `${basePath}/courses/images`
    case 'course-videos':
      return `${basePath}/courses/videos`
    case 'lesson-videos':
      return `${basePath}/lessons/videos`
    case 'lesson-images':
      return `${basePath}/lessons/lecture-images`
    case 'lesson-documents':
      return `${basePath}/lessons/lecture-images`
    case 'lesson-lectures':
      return `${basePath}/lessons/lectures`
    case 'lesson-test-images':
      return `${basePath}/lessons/lesson-test-images`
    case 'profile-photos':
      return `${basePath}/users/profile-photos`
    case 'newsletter-images':
      return `${basePath}/newsletters/images`
    case 'teacher-profile-photos':
      return `${basePath}/teachers/teacher_profile_photos`
    case 'question-pictures':
      return `${basePath}/teachers/question_pictures`
    case 'teacher-test-images':
      return `${basePath}/teachers/teacher-test-images`
    default:
      return `${basePath}/misc`
  }
}

/**
 * Генерация уникального имени файла
 */
export function generateFileName(originalName: string, prefix: string = ''): string {
  // 1. Таймстамп (миллисекунды)
  const timestamp = Date.now()
  
  // 2. Случайная строка (base36)
  const randomString = Math.random()
    .toString(36)
    .substring(2, 15)
  
  // 3. Расширение из оригинального имени
  const extension = originalName.split('.').pop() || 'jpg'
  
  // 4. Формирование имени
  if (prefix) {
    return `${prefix}-${timestamp}-${randomString}.${extension}`
  }
  return `${timestamp}-${randomString}.${extension}`
}

/**
 * Получение конфигурации S3 из базы данных (PRIVATE)
 */
async function getS3Config() {
  const url = await getSetting('PRIVATE_S3_URL')
  const bucketName = await getSetting('PRIVATE_BUCKET_NAME')
  const accessKeyId = await getSetting('PRIVATE_S3_ACCESS_KEY')
  const secretAccessKey = await getSetting('PRIVATE_S3_SECRET_ACCESS_KEY')

  if (!url || !bucketName || !accessKeyId || !secretAccessKey) {
    const missing = []
    if (!url) missing.push('PRIVATE_S3_URL')
    if (!bucketName) missing.push('PRIVATE_BUCKET_NAME')
    if (!accessKeyId) missing.push('PRIVATE_S3_ACCESS_KEY')
    if (!secretAccessKey) missing.push('PRIVATE_S3_SECRET_ACCESS_KEY')
    throw new Error(`S3 конфигурация не найдена в базе данных. Отсутствуют: ${missing.join(', ')}`)
  }

  // Проверка на placeholder значения
  if (url.includes('your-s3-endpoint') || url.includes('example.com') || url.includes('placeholder')) {
    throw new Error('PRIVATE_S3_URL содержит placeholder значение. Пожалуйста, укажите реальный S3 endpoint в настройках.')
  }

  return {
    url: url.trim(),
    bucketName: bucketName.trim(),
    // Убираем все пробелы и переносы строк из ключей
    accessKeyId: accessKeyId.trim().replace(/\s+/g, ''),
    secretAccessKey: secretAccessKey.trim().replace(/\s+/g, '')
  }
}

/**
 * Получение конфигурации PUBLIC S3 из базы данных
 */
async function getPublicS3Config() {
  const bucketName = await getSetting('PUBLIC_BUCKET_NAME')
  const accessKeyId = await getSetting('PUBLIC_S3_ACCESS_KEY')
  const secretAccessKey = await getSetting('PUBLIC_S3_SECRET_ACCESS_KEY')
  // Используем тот же URL что и для PRIVATE или отдельный PUBLIC_S3_URL
  const url = await getSetting('PUBLIC_S3_URL') || await getSetting('PRIVATE_S3_URL')

  if (!url || !bucketName || !accessKeyId || !secretAccessKey) {
    const missing = []
    if (!url) missing.push('PUBLIC_S3_URL или PRIVATE_S3_URL')
    if (!bucketName) missing.push('PUBLIC_BUCKET_NAME')
    if (!accessKeyId) missing.push('PUBLIC_S3_ACCESS_KEY')
    if (!secretAccessKey) missing.push('PUBLIC_S3_SECRET_ACCESS_KEY')
    throw new Error(`PUBLIC S3 конфигурация не найдена в базе данных. Отсутствуют: ${missing.join(', ')}`)
  }

  return {
    url: url.trim(),
    bucketName: bucketName.trim(),
    accessKeyId: accessKeyId.trim().replace(/\s+/g, ''),
    secretAccessKey: secretAccessKey.trim().replace(/\s+/g, '')
  }
}

/**
 * Получение endpoint и region из конфигурации
 */
function parseS3Endpoint(url: string): { endpoint: string; region: string; forcePathStyle: boolean } {
  let endpoint: string
  let region: string = 'us-east-1' // По умолчанию
  let forcePathStyle: boolean = true
  
  try {
    // Если URL уже полный с протоколом
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const urlObj = new URL(url)
      
      // Для Yandex Cloud
      if (urlObj.hostname.includes('yandexcloud') || urlObj.hostname.includes('storage.yandexcloud.net')) {
        endpoint = 'https://storage.yandexcloud.net'
        region = 'ru-central1'
        forcePathStyle = true
      } 
      // Для Timeweb Cloud Storage
      else if (urlObj.hostname.includes('twcstorage.ru') || urlObj.hostname.includes('s3.twcstorage.ru')) {
        endpoint = `https://${urlObj.hostname}`
        region = 'us-east-1' // Timeweb может не требовать регион
        forcePathStyle = true
      }
      // Для AWS S3
      else if (urlObj.hostname.includes('amazonaws.com') || urlObj.hostname.includes('s3.')) {
        endpoint = `https://${urlObj.hostname}`
        // Пытаемся извлечь регион из hostname (например, s3.eu-west-1.amazonaws.com)
        const regionMatch = urlObj.hostname.match(/s3[.-]([a-z0-9-]+)\.amazonaws\.com/)
        if (regionMatch) {
          region = regionMatch[1]
        }
        forcePathStyle = false // AWS использует virtual-hosted style по умолчанию
      }
      // Для других S3-совместимых хранилищ
      else {
        endpoint = `${urlObj.protocol}//${urlObj.hostname}${urlObj.port ? `:${urlObj.port}` : ''}`
        region = 'us-east-1'
        forcePathStyle = true
      }
    } else {
      // Если URL без протокола, добавляем https
      if (url.includes('yandexcloud')) {
        endpoint = 'https://storage.yandexcloud.net'
        region = 'ru-central1'
        forcePathStyle = true
      } else if (url.includes('twcstorage.ru')) {
        endpoint = `https://${url.replace(/^\/+|\/+$/g, '')}`
        region = 'us-east-1'
        forcePathStyle = true
      } else {
        endpoint = `https://${url.replace(/^\/+|\/+$/g, '')}`
        region = 'us-east-1'
        forcePathStyle = true
      }
    }
  } catch (error) {
    console.error('Ошибка парсинга S3 URL:', url, error)
    throw new Error(`Неверный формат PRIVATE_S3_URL: ${url}. Ожидается полный URL (например: https://storage.yandexcloud.net)`)
  }

  return { endpoint, region, forcePathStyle }
}

/**
 * Инициализация S3 клиента (PRIVATE)
 */
async function getS3Client() {
  const config = await getS3Config()
  const { endpoint, region, forcePathStyle } = parseS3Endpoint(config.url)

  console.log('S3 конфигурация:', {
    endpoint,
    region,
    bucketName: config.bucketName,
    forcePathStyle,
    hasAccessKey: !!config.accessKeyId,
    hasSecretKey: !!config.secretAccessKey,
    accessKeyPreview: config.accessKeyId ? `${config.accessKeyId.substring(0, 8)}...` : 'не указан'
  })

  return new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle,
  })
}

/**
 * Инициализация PUBLIC S3 клиента
 */
async function getPublicS3Client() {
  const config = await getPublicS3Config()
  const { endpoint, region, forcePathStyle } = parseS3Endpoint(config.url)

  console.log('PUBLIC S3 конфигурация:', {
    endpoint,
    region,
    bucketName: config.bucketName,
    forcePathStyle,
    hasAccessKey: !!config.accessKeyId,
    hasSecretKey: !!config.secretAccessKey,
    accessKeyPreview: config.accessKeyId ? `${config.accessKeyId.substring(0, 8)}...` : 'не указан'
  })

  return new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle,
  })
}

/**
 * Загрузка файла в S3
 */
export async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  contentType: string,
  s3Path: string
): Promise<string> {
  try {
    const config = await getS3Config()
    const { endpoint } = parseS3Endpoint(config.url)
    const s3Client = await getS3Client()

    // Нормализация пути
    const normalizedPath = s3Path.replace(/\/+/g, '/').replace(/^\/+|\/+$/g, '')
    const normalizedFileName = fileName.replace(/^\/+/, '')
    
    // Формирование ключа (путь в S3)
    const key = `${normalizedPath}/${normalizedFileName}`.replace(/\/+/g, '/')

    // Загружаем файл
    // Убираем ACL, так как не все S3-совместимые хранилища поддерживают его
    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
      // ACL: 'public-read', // Убрано - не все провайдеры поддерживают
    })

    await s3Client.send(command)

    // Формируем публичный URL файла
    // Формат: {endpoint}/{bucketName}/{key}
    const fileUrl = `${endpoint}/${config.bucketName}/${key}`
    
    console.log('Файл успешно загружен в S3:', fileUrl)
    
    return fileUrl
  } catch (error: any) {
    console.error('Ошибка загрузки файла в S3:', error)
    
    // Детальная обработка ошибок
    if (error?.Code === 'InvalidAccessKeyId' || error?.name === 'InvalidAccessKeyId') {
      throw new Error('Неверный Access Key ID. Проверьте значение PRIVATE_S3_ACCESS_KEY в настройках.')
    }
    
    if (error?.Code === 'SignatureDoesNotMatch' || error?.name === 'SignatureDoesNotMatch') {
      throw new Error('Неверный Secret Access Key. Проверьте значение PRIVATE_S3_SECRET_ACCESS_KEY в настройках.')
    }
    
    if (error?.Code === 'AccessDenied' || error?.name === 'AccessDenied') {
      throw new Error('Доступ запрещен. Проверьте права доступа для указанных ключей.')
    }
    
    if (error?.Code === 'NoSuchBucket' || error?.name === 'NoSuchBucket') {
      const bucketName = (await getS3Config()).bucketName || 'не указан'
      throw new Error(`Bucket "${bucketName}" не найден. Проверьте значение PRIVATE_BUCKET_NAME в настройках.`)
    }
    
    if (error instanceof Error) {
      // Если это уже наша кастомная ошибка, пробрасываем её
      if (error.message.includes('S3 конфигурация') || error.message.includes('PRIVATE_S3')) {
        throw error
      }
      throw new Error(`Ошибка загрузки в S3: ${error.message}`)
    }
    
    throw new Error('Не удалось загрузить файл в S3. Проверьте настройки S3 в базе данных.')
  }
}

/**
 * Удаление файла из S3 (PRIVATE)
 */
export async function deleteFileFromS3(fileUrl: string): Promise<void> {
  try {
    const config = await getS3Config()
    const s3Client = await getS3Client()

    // Извлечение ключа из URL
    // Формат URL: {endpoint}/{bucketName}/{key}
    const urlParts = fileUrl.split('/')
    const bucketIndex = urlParts.indexOf(config.bucketName)
    
    if (bucketIndex === -1) {
      throw new Error('Неверный URL файла: bucket не найден в URL')
    }
    
    // Формирование ключа (путь в S3)
    const key = urlParts.slice(bucketIndex + 1).join('/')
    
    // Проверка, что это файл, а не папка
    if (key.endsWith('/') || !key.includes('.')) {
      throw new Error('Нельзя удалить папку, только файлы')
    }
    
    // Создание команды удаления
    const command = new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    })

    // Выполнение удаления
    await s3Client.send(command)
    
    console.log('Файл успешно удален из S3:', fileUrl)
  } catch (error: any) {
    console.error('Ошибка удаления файла из S3:', error)
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('Не удалось удалить файл из S3')
  }
}

/**
 * Загрузка файла в PUBLIC S3 (для фото профилей преподавателей)
 */
export async function uploadFileToPublicS3(
  file: Buffer,
  fileName: string,
  contentType: string,
  s3Path: string
): Promise<string> {
  try {
    const config = await getPublicS3Config()
    const { endpoint } = parseS3Endpoint(config.url)
    const s3Client = await getPublicS3Client()

    // Нормализация пути
    const normalizedPath = s3Path.replace(/\/+/g, '/').replace(/^\/+|\/+$/g, '')
    const normalizedFileName = fileName.replace(/^\/+/, '')
    
    // Формирование ключа (путь в S3)
    const key = `${normalizedPath}/${normalizedFileName}`.replace(/\/+/g, '/')

    // Загружаем файл
    const command = new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
    })

    await s3Client.send(command)

    console.log('📤 Файл загружен в PUBLIC S3 бакет:', config.bucketName)
    console.log('🔑 Ключ файла:', key)

    // Формируем публичный URL файла
    // Для PUBLIC S3 всегда включаем бакет в URL
    let fileUrl: string
    if (endpoint.includes('twcstorage.ru')) {
      // Для Timeweb Cloud Storage публичные файлы: https://s3.twcstorage.ru/{bucket}/{key}
      fileUrl = `${endpoint}/${config.bucketName}/${key}`
      console.log('🌐 Формат URL для twcstorage.ru (с бакетом):', fileUrl)
    } else {
      // Для других провайдеров используем стандартный формат
      fileUrl = `${endpoint}/${config.bucketName}/${key}`
      console.log('🌐 Стандартный формат URL (с бакетом):', fileUrl)
    }
    
    console.log('Файл успешно загружен в PUBLIC S3:', fileUrl)
    
    // Тестируем доступность файла
    try {
      console.log('🔍 Тестируем доступность файла...')
      const testResponse = await fetch(fileUrl, { method: 'HEAD' })
      console.log('📊 Статус доступности:', testResponse.status, testResponse.statusText)
      if (!testResponse.ok) {
        console.warn('⚠️ Файл загружен, но недоступен по прямому URL. Возможно, бакет не публичный.')
      } else {
        console.log('✅ Файл доступен по прямому URL')
      }
    } catch (testError) {
      console.warn('⚠️ Ошибка при тестировании доступности:', testError)
    }
    
    return fileUrl
  } catch (error: any) {
    console.error('Ошибка загрузки файла в PUBLIC S3:', error)
    
    if (error?.Code === 'InvalidAccessKeyId' || error?.name === 'InvalidAccessKeyId') {
      throw new Error('Неверный Access Key ID. Проверьте значение PUBLIC_S3_ACCESS_KEY в настройках.')
    }
    
    if (error?.Code === 'SignatureDoesNotMatch' || error?.name === 'SignatureDoesNotMatch') {
      throw new Error('Неверный Secret Access Key. Проверьте значение PUBLIC_S3_SECRET_ACCESS_KEY в настройках.')
    }
    
    if (error?.Code === 'AccessDenied' || error?.name === 'AccessDenied') {
      throw new Error('Доступ запрещен. Проверьте права доступа для указанных ключей.')
    }
    
    if (error?.Code === 'NoSuchBucket' || error?.name === 'NoSuchBucket') {
      throw new Error(`Bucket не найден. Проверьте значение PUBLIC_BUCKET_NAME в настройках.`)
    }
    
    if (error instanceof Error) {
      if (error.message.includes('S3 конфигурация') || error.message.includes('PUBLIC_S3')) {
        throw error
      }
      throw new Error(`Ошибка загрузки в PUBLIC S3: ${error.message}`)
    }
    
    throw new Error('Не удалось загрузить файл в PUBLIC S3. Проверьте настройки S3 в базе данных.')
  }
}

/**
 * Удаление файла из PUBLIC S3
 */
export async function deleteFileFromPublicS3(fileUrl: string): Promise<void> {
  try {
    const config = await getPublicS3Config()
    const s3Client = await getPublicS3Client()

    // Извлечение ключа из URL для PUBLIC S3
    let key: string
    
    // Для всех провайдеров теперь используем стандартную логику с бакетом
    const urlParts = fileUrl.split('/')
    const bucketIndex = urlParts.indexOf(config.bucketName)
    
    if (bucketIndex === -1) {
      throw new Error('Неверный URL файла: bucket не найден в URL')
    }
    
    key = urlParts.slice(bucketIndex + 1).join('/')
    
    if (key.endsWith('/') || !key.includes('.')) {
      throw new Error('Нельзя удалить папку, только файлы')
    }
    
    const command = new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    })

    await s3Client.send(command)
    
    console.log('Файл успешно удален из PUBLIC S3:', fileUrl)
  } catch (error: any) {
    console.error('Ошибка удаления файла из PUBLIC S3:', error)
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('Не удалось удалить файл из PUBLIC S3')
  }
}

/**
 * Проверка, является ли URL ссылкой на S3 хранилище
 */
export function isS3Url(url: string | null | undefined): boolean {
  if (!url) return false
  
  // Проверяем типичные признаки S3 URL
  return (
    url.includes('s3.') ||
    url.includes('amazonaws.com') ||
    url.includes('storage.yandexcloud.net') ||
    url.includes('twcstorage.ru') ||
    url.includes('teacher_profile_photos') // Наша папка для фото профилей
  )
}

/**
 * Проверка, является ли URL ссылкой на Telegram
 */
export function isTelegramUrl(url: string | null | undefined): boolean {
  if (!url) return false
  return url.includes('api.telegram.org')
}

/**
 * Генерация presigned URL для доступа к файлу в S3
 * @param fileUrl - Полный URL файла в S3
 * @param expiresIn - Время жизни ссылки в секундах (по умолчанию 1 час)
 */
export async function getPresignedUrl(fileUrl: string, expiresIn: number = 3600): Promise<string> {
  try {
    const config = await getS3Config()
    const s3Client = await getS3Client()

    // Извлечение ключа из URL
    const urlParts = fileUrl.split('/')
    const bucketIndex = urlParts.indexOf(config.bucketName)
    
    if (bucketIndex === -1) {
      throw new Error('Неверный URL файла: bucket не найден в URL')
    }
    
    // Формирование ключа (путь в S3)
    const key = urlParts.slice(bucketIndex + 1).join('/')
    
    console.log('🔗 Генерация presigned URL для:', key)

    // Создание команды для получения объекта
    const command = new GetObjectCommand({
      Bucket: config.bucketName,
      Key: key,
    })

    // Генерация подписанного URL
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn })
    
    console.log('✅ Presigned URL сгенерирован, истекает через:', expiresIn, 'секунд')
    
    return presignedUrl
  } catch (error: any) {
    console.error('❌ Ошибка генерации presigned URL:', error)
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('Не удалось сгенерировать presigned URL')
  }
}

