import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { openAIService } from '@/lib/openai'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // 1. Проверка авторизации
    const user = await auth(request)
    if (!user) {
      return NextResponse.json(
        { error: 'Необходима авторизация' },
        { status: 401 }
      )
    }

    // 2. Парсинг тела запроса
    const body = await request.json()
    const { questionData, courseLanguage, testType } = body

    // 3. Валидация
    if (!questionData || !questionData.question || !questionData.answers) {
      return NextResponse.json(
        { error: 'Данные вопроса обязательны' },
        { status: 400 }
      )
    }

    if (!courseLanguage || !['kg', 'ru'].includes(courseLanguage)) {
      return NextResponse.json(
        { error: 'Некорректный язык курса' },
        { status: 400 }
      )
    }

    if (!testType || !['math1', 'math2', 'analogy', 'rac', 'grammar', 'standard'].includes(testType)) {
      return NextResponse.json(
        { error: 'Некорректный тип теста' },
        { status: 400 }
      )
    }

    // 4. Получение промпта из БД по секции (name) и языку
    // Если промпта нет в БД, используем дефолтный промпт
    let promptText = ''
    
    try {
      const prompt = await prisma.prompts.findFirst({
        where: {
          name: testType,
          language: courseLanguage as 'kg' | 'ru'
        }
      })

      if (prompt && prompt.value) {
        promptText = prompt.value
      }
    } catch (error) {
      console.warn('Ошибка при получении промпта из БД, используем дефолтный:', error)
    }

    // Если промпта нет в БД, используем дефолтный промпт
    if (!promptText) {
      const languageName = courseLanguage === 'kg' ? 'кыргызский' : 'русский'
      promptText = `Ты - помощник для объяснения учебных вопросов. Объясни следующий вопрос на ${languageName} языке, сделав объяснение понятным и структурированным.

**ВАЖНО:** Твой ответ должен быть в формате Markdown с поддержкой LaTeX для математических формул:
- Используй Markdown для форматирования: **жирный текст**, *курсив*, списки, заголовки
- Используй LaTeX для формул: инлайн формулы через \`$...$\` и блочные через \`$$...$$\`
- Структурируй объяснение с помощью заголовков и списков
- Сделай объяснение читаемым и понятным

Вопрос: {question}

Варианты ответов:
{answers}

Правильный ответ: {correctAnswer}

Дай подробное объяснение в формате Markdown, почему правильный ответ является верным, и почему остальные варианты неверны. Используй структурированный формат с заголовками и списками.`
    }

    // 5. Вызов AI сервиса с промптом из БД или дефолтным
    let explanation: string
    try {
      explanation = await openAIService.explainQuestion(
        questionData,
        courseLanguage as 'kg' | 'ru',
        testType as 'math1' | 'math2' | 'analogy' | 'rac' | 'grammar' | 'standard',
        promptText
      )
    } catch (error) {
      console.error('Ошибка OpenAI API:', error)
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          return NextResponse.json(
            { error: 'OpenAI API key не настроен. Обратитесь к администратору.' },
            { status: 503 }
          )
        }
        if (error.message.includes('Неверная модель') || error.message.includes('invalid model') || error.message.includes('model ID')) {
          return NextResponse.json(
            { error: error.message },
            { status: 503 }
          )
        }
        throw error
      }
      throw new Error('Ошибка при генерации объяснения')
    }

    // 6. Возврат результата
    return NextResponse.json({
      success: true,
      explanation
    })

  } catch (error) {
    console.error('Ошибка API генерации объяснения:', error)
    
    let errorMessage = 'Внутренняя ошибка сервера'
    let statusCode = 500
    
    if (error instanceof Error) {
      errorMessage = error.message
      
      if (error.message.includes('OpenAI API key')) {
        statusCode = 503 // Service Unavailable
      } else if (error.message.includes('Неверная модель') || error.message.includes('invalid model') || error.message.includes('model ID')) {
        statusCode = 503
      } else if (error.message.includes('промпт')) {
        statusCode = 404
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}

