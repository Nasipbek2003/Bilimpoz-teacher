import { prisma } from './prisma'

/**
 * Получение настройки из БД
 */
export async function getSetting(key: string, defaultValue?: string): Promise<string | null> {
  try {
    const setting = await prisma.settings.findUnique({
      where: { key }
    })
    return setting?.value || defaultValue || null
  } catch (error) {
    console.error(`❌ Ошибка получения настройки ${key}:`, error)
    return defaultValue || null
  }
}

/**
 * Получение токена бота учителя из БД
 */
export async function getTeacherBotToken(): Promise<string | null> {
  // Пробуем разные варианты ключей
  const possibleKeys = ['TEACHER_BOT_TOKEN', 'ADMIN_BOT_TOKEN', 'teacher_bot_token', 'admin_bot_token']
  
  for (const key of possibleKeys) {
    const token = await getSetting(key)
    if (token) {
      return token
    }
  }
  
  return null
}

/**
 * Получение URL сайта учителя
 */
export async function getTeacherSiteUrl(): Promise<string> {
  const siteUrl = await getSetting('TEACHER_SITE_URL', 'https://teacher.bilimpoz.kg')
  return siteUrl || 'https://teacher.bilimpoz.kg'
}

/**
 * Получение username бота учителя
 */
export async function getTeacherBotUsername(): Promise<string> {
  const username = await getSetting('TEACHER_BOT_USERNAME', 'bilimpozteacher_bot')
  return username || 'bilimpozteacher_bot'
}

/**
 * Получение Telegram логина администратора
 */
export async function getAdminTelegramLogin(): Promise<string | null> {
  const possibleKeys = [
    'TELEGRAM_LOGIN_ADMIN',
    'ADMIN_TELEGRAM_LOGIN',
    'admin_telegram_login',
    'ADMIN_TELEGRAM',
    'admin_telegram'
  ]
  
  for (const key of possibleKeys) {
    const login = await getSetting(key)
    if (login) {
      return login
    }
  }
  
  return null
}

