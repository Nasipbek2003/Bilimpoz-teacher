import { prisma } from './prisma'
import { VerificationCodeType } from '@prisma/client'
import bcrypt from 'bcrypt'

/**
 * Генерация 6-значного кода подтверждения
 */
export function generateVerificationCode(): string {
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  return code
}

/**
 * Генерация и сохранение кода верификации в БД
 */
export async function generateAndStoreVerificationCode(
  userId: string,
  type: VerificationCodeType = 'login'
): Promise<string> {
  // Генерируем 6-значный код
  const code = generateVerificationCode()
  
  // Хэшируем код перед сохранением
  const saltRounds = 12
  const hashCode = await bcrypt.hash(code, saltRounds)
  
  // Вычисляем время истечения (5 минут)
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000)
    
  // Сохраняем в БД
    await prisma.verification_codes.create({
      data: {
        user_id: userId,
        hash_code: hashCode,
        type: type,
        expires_at: expiresAt
      }
    })
    
  // Возвращаем оригинальный код для отправки
  return code
}

/**
 * Проверка cooldown (60 секунд между запросами)
 */
export async function canRequestNewCode(userId: string): Promise<{
  canRequest: boolean
  message?: string
  cooldownSeconds?: number
}> {
  // Найти последний созданный код для пользователя
  const lastCode = await prisma.verification_codes.findFirst({
    where: { user_id: userId },
    orderBy: { created_at: 'desc' }
  })
  
  if (!lastCode) {
    return { canRequest: true }
  }
  
  const timeSinceCreation = Date.now() - lastCode.created_at.getTime()
  const cooldownMs = 60 * 1000 // 60 секунд
  
  if (timeSinceCreation < cooldownMs) {
    const cooldownSeconds = Math.ceil((cooldownMs - timeSinceCreation) / 1000)
    return {
      canRequest: false,
      message: `Подождите ${cooldownSeconds} секунд`,
      cooldownSeconds
    }
  }
  
  return { canRequest: true }
}

/**
 * Проверка кода верификации
 */
export async function verifyCode(
  userId: string,
  inputCode: string,
  type: VerificationCodeType = 'login'
): Promise<{
  success: boolean
  message: string
  attemptsLeft?: number
}> {
  // Нормализация кода (убрать пробелы)
  const normalizedCode = inputCode.trim().replace(/\s/g, '')
  
  // Найти активный код в БД
  const verificationCode = await prisma.verification_codes.findFirst({
      where: {
        user_id: userId,
        type: type,
      used_at: null, // Не использован
      expires_at: { gt: new Date() } // Не истек
      },
    orderBy: { created_at: 'desc' } // Последний созданный
  })
  
  if (!verificationCode) {
    return {
      success: false,
      message: 'Код не найден или истек. Запросите новый код.'
    }
  }
  
  // Дополнительная проверка истечения
  if (new Date() > verificationCode.expires_at) {
    // Пометить как использованный (истек)
    await prisma.verification_codes.update({
      where: { id: verificationCode.id },
      data: { used_at: new Date() }
    })
    
    return {
      success: false,
      message: 'Код истек. Запросите новый код.'
    }
  }
  
  // Сравнить хэши
  const isCodeValid = await bcrypt.compare(normalizedCode, verificationCode.hash_code)
        
  if (!isCodeValid) {
    return {
      success: false,
      message: 'Неверный код. Попробуйте еще раз.',
      attemptsLeft: 4
        }
  }
  
  // Код верный - пометить как использованный
  await prisma.verification_codes.update({
    where: { id: verificationCode.id },
    data: { used_at: new Date() }
  })
  
  return {
    success: true,
    message: 'Код подтвержден'
    }
  }
  
/**
 * Проверка кода восстановления (без пометки как использованного)
 */
export async function checkRecoveryCode(
  userId: string,
  inputCode: string
): Promise<{
  success: boolean
  message: string
  userId?: string
  codeId?: string
}> {
  // Нормализация кода
  const normalizedCode = inputCode.trim().replace(/\s/g, '')
  
  // Найти активный код
  const verificationCode = await prisma.verification_codes.findFirst({
      where: { 
        user_id: userId,
      type: 'password_reset',
      used_at: null,
      expires_at: { gt: new Date() }
    },
    orderBy: { created_at: 'desc' }
    })
  
  if (!verificationCode) {
    return {
      success: false,
      message: 'Код не найден или истек'
    }
  }
  
  // Проверить срок действия
  if (new Date() > verificationCode.expires_at) {
    return {
      success: false,
      message: 'Код истек'
    }
  }
  
  // Сравнить хэши
  const isCodeValid = await bcrypt.compare(normalizedCode, verificationCode.hash_code)
  
  if (!isCodeValid) {
    return {
      success: false,
      message: 'Неверный код восстановления'
    }
  }
  
  // Код верный - НЕ помечаем как использованный
  // Это будет сделано после успешного сброса пароля
  
  return {
    success: true,
    message: 'Код подтвержден',
    userId: verificationCode.user_id,
    codeId: verificationCode.id
  }
}

/**
 * Пометить код восстановления как использованный
 */
export async function markRecoveryCodeAsUsed(userId: string): Promise<void> {
  await prisma.verification_codes.updateMany({
    where: { 
      user_id: userId,
      type: 'password_reset',
      used_at: null
    },
    data: {
      used_at: new Date()
    }
  })
}
