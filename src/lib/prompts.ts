import { prisma } from './prisma'

/**
 * Получение промпта из базы данных
 */
export async function getPrompt(name: string, language: 'ru' | 'kg'): Promise<string | null> {
  try {
    const prompt = await prisma.prompts.findUnique({
      where: {
        name_language: {
          name,
          language
        }
      }
    })

    return prompt?.value || null
  } catch (error) {
    console.error(`❌ Ошибка получения промпта ${name} (${language}):`, error)
    return null
  }
}

/**
 * Получение промпта для улучшения текста
 */
export async function getImproveTextPrompt(language: 'ru' | 'kg'): Promise<string> {
  const prompt = await getPrompt('improve_text', language)
  
  if (!prompt) {
    // Fallback промпт, если не найден в БД
    const languageName = language === 'kg' ? 'кыргызский' : 'русский'
    return `Ты - помощник для улучшения образовательных текстов. Улучши следующий текст на ${languageName} языке, сделав его более понятным, структурированным и подходящим для учебных материалов. Сохрани основную мысль и смысл, но улучши формулировки, грамматику и стиль.

Текст для улучшения:
{text}

Верни только улучшенный текст без дополнительных комментариев.`
  }
  
  return prompt
}
