'use client'

import React, { useState, useEffect } from 'react'
import { Icons } from '@/components/ui/Icons'
import { useTranslation } from '@/hooks/useTranslation'
import Tooltip from '@/components/ui/Tooltip'
import { AILoadingAnimation } from '@/components/ui/AILoadingAnimation'
import Toast, { ToastVariant } from '@/components/ui/Toast'
import { loadQuestionDraft, saveQuestionDraft, type QuestionType } from '@/lib/test-storage'

interface AnswerVariant {
  value: string
  isCorrect: boolean
}

interface TestAIExplainButtonProps {
  blockId: string
  question?: string
  answers?: AnswerVariant[]
  courseLanguage: 'kg' | 'ru'
  isShowingExplanation: boolean
  onToggleExplanation: () => void
  onRegenerateSuccess?: (explanation: string) => void
  storageKeyPrefix?: string
  testType?: 'math1' | 'math2' | 'analogy' | 'rac' | 'grammar' | 'standard'
  imageUrl?: string
}

const TestAIExplainButton: React.FC<TestAIExplainButtonProps> = ({
  blockId,
  question = '',
  answers = [],
  courseLanguage,
  isShowingExplanation,
  onToggleExplanation,
  onRegenerateSuccess,
  storageKeyPrefix = 'testQuestion',
  testType = 'standard',
  imageUrl
}) => {
  const { t } = useTranslation()
  const [hasExplanation, setHasExplanation] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [toast, setToast] = useState<{ isOpen: boolean; title?: string; message: string; variant: ToastVariant }>({
    isOpen: false,
    message: '',
    variant: 'error'
  })

  const closeToast = () => {
    setToast(prev => ({ ...prev, isOpen: false }))
  }

  // Монтирование компонента
  useEffect(() => {
    setMounted(true)
  }, [])

  // Функция для проверки наличия AI объяснения
  const checkHasExplanation = React.useCallback(() => {
    if (typeof window === 'undefined' || !testType || !blockId) return false
    
    const questionData = loadQuestionDraft(blockId, testType as QuestionType)
    const hasExp = !!(questionData?.explanation_ai && questionData.explanation_ai.trim())
    return hasExp
  }, [blockId, testType])

  // Загрузка данных из localStorage при монтировании и изменении параметров
  useEffect(() => {
    if (!mounted || typeof window === 'undefined' || !testType || !blockId) return
    
    const hasExp = checkHasExplanation()
    setHasExplanation(hasExp)
  }, [mounted, blockId, testType, checkHasExplanation])

  // Периодическая синхронизация с localStorage для отслеживания изменений
  useEffect(() => {
    if (!mounted || typeof window === 'undefined' || !testType || !blockId) return
    
    const syncWithLocalStorage = () => {
      const hasExp = checkHasExplanation()
      setHasExplanation(hasExp)
    }
    
    // Проверяем каждые 5000мс для синхронизации с изменениями
    const interval = setInterval(syncWithLocalStorage, 5000)
    
    return () => clearInterval(interval)
  }, [mounted, blockId, testType, checkHasExplanation])

  // Генерация объяснения
  const generateExplanation = async () => {
    // Всегда загружаем свежие данные из localStorage
    let questionToUse = ''
    let answersToUse: AnswerVariant[] = []
    let imageUrlToUse = ''
    
    if (typeof window !== 'undefined' && testType) {
      const questionData = loadQuestionDraft(blockId, testType as QuestionType)
      
      console.log('📦 Данные из localStorage:', {
        blockId,
        testType,
        questionData,
        hasImageUrl: !!(questionData?.imageUrl)
      })
      
      if (questionData) {
        questionToUse = questionData.question || ''
        answersToUse = questionData.answers || []
        imageUrlToUse = questionData.imageUrl || ''
      }
    }
    
    // Если из localStorage ничего не получили, используем пропсы
    if (!questionToUse && question) {
      questionToUse = question
    }
    if (answersToUse.length === 0 && answers && answers.length > 0) {
      answersToUse = answers
    }
    if (!imageUrlToUse && imageUrl) {
      imageUrlToUse = imageUrl
    }
    
    // Отладочное логирование
    console.log('🔍 AI Explain Debug:', {
      questionToUse,
      answersToUse,
      imageUrlFromProps: imageUrl,
      imageUrlToUse,
      hasQuestionText: !!(questionToUse && questionToUse.trim()),
      hasImage: !!(imageUrlToUse && imageUrlToUse.trim())
    })
    
    // Валидация: должен быть либо текст вопроса, либо изображение
    const hasQuestionText = questionToUse && questionToUse.trim()
    const hasImage = imageUrlToUse && imageUrlToUse.trim()
    
    if (!hasQuestionText && !hasImage) {
      const errorMsg = t('testEditor.validation.fillQuestionOrImage', 'Заполните текст вопроса или добавьте изображение')
      setToast({
        isOpen: true,
        message: errorMsg,
        variant: 'error'
      })
      console.error('Neither question text nor image provided:', { questionToUse, imageUrl })
      return null
    }
    
    if (!answersToUse || answersToUse.length === 0) {
      const errorMsg = t('testEditor.validation.fillAnswers', 'Заполните варианты ответов')
      setToast({
        isOpen: true,
        message: errorMsg,
        variant: 'error'
      })
      console.error('Answers are empty:', { answersToUse })
      return null
    }
    
    // Проверяем, что хотя бы один ответ заполнен
    const hasFilledAnswers = answersToUse.some(a => a.value && a.value.trim())
    if (!hasFilledAnswers) {
      const errorMsg = t('testEditor.validation.fillAtLeastOneAnswer', 'Заполните хотя бы один вариант ответа')
      setToast({
        isOpen: true,
        message: errorMsg,
        variant: 'error'
      })
      console.error('No filled answers found:', answersToUse)
      return null
    }
    
    setIsLoading(true)
    try {
      // Подготовка данных
      const questionData = {
        question: hasQuestionText ? questionToUse : '', // Пустая строка если нет текста
        answers: answersToUse.map(a => ({ value: a.value, isCorrect: a.isCorrect })),
        imageUrl: hasImage ? imageUrlToUse : undefined
      }

      // Вызов AI API
      const response = await fetch('/api/ai/explain-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionData,
          courseLanguage,
          testType
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`
        console.error('AI API error:', errorMessage)
        throw new Error(errorMessage)
      }

      const data = await response.json()
      const aiExplanation = data.explanation || ''
      
      if (!aiExplanation) {
        throw new Error('Пустое объяснение от API')
      }
      

      // Сохранение в localStorage через saveQuestionDraft
      if (typeof window !== 'undefined' && testType) {
        try {
          // Загружаем существующие данные вопроса
          const existingData = loadQuestionDraft(blockId, testType as QuestionType)
          
          if (existingData) {
            // Обновляем существующие данные
            existingData.explanation_ai = aiExplanation
            saveQuestionDraft(blockId, testType as QuestionType, existingData)
          } else {
            // Если данных нет, создаем новую запись
            const newData = {
              question: questionToUse,
              answers: answersToUse.map((answer, index) => ({
                id: `answer_${index}`,
                value: answer.value,
                isCorrect: answer.isCorrect,
                order: index
              })),
              explanation_ai: aiExplanation,
              points: 1,
              timeLimit: 60
            }
            saveQuestionDraft(blockId, testType as QuestionType, newData)
          }
          setHasExplanation(true)
        } catch (e) {
          console.error('Error saving explanation:', e)
        }
      }

      // Уведомление родителя и автоматический показ объяснения
      if (onRegenerateSuccess) {
        onRegenerateSuccess(aiExplanation)
      }
      
      // Автоматически показываем объяснение после генерации
      if (!isShowingExplanation) {
        onToggleExplanation()
      }

      return aiExplanation
    } catch (error) {
      console.error('Error generating explanation:', error)
      
      // Более информативное сообщение об ошибке
      let errorMessage = t('testEditor.ai.errorGenerating', 'Ошибка при генерации объяснения')
      if (error instanceof Error) {
        if (error.message.includes('промпт') || error.message.includes('не найден')) {
          errorMessage = error.message
        } else if (error.message.includes('API key')) {
          errorMessage = t('testEditor.ai.apiKeyError', 'OpenAI API key не настроен. Обратитесь к администратору.')
        } else if (error.message.includes('HTTP error')) {
          errorMessage = `${t('testEditor.ai.errorGenerating', 'Ошибка при генерации объяснения')}: ${error.message}`
        }
      }
      
      setToast({
        isOpen: true,
        message: errorMessage,
        variant: 'error'
      })
      return null
    } finally {
      setIsLoading(false)
    }
  }

  // Обработчик клика
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Если показывается объяснение, то скрываем его
    if (isShowingExplanation) {
      onToggleExplanation()
      return
    }

    // Если объяснение уже есть, показываем его
    if (hasExplanation) {
      onToggleExplanation()
      return
    }

    // Если объяснения нет, генерируем его
    await generateExplanation()
  }

  // Определение tooltip
  const getTooltip = () => {
    if (isLoading) {
      return t('testEditor.ai.generating', 'Генерация объяснения...')
    }
    if (isShowingExplanation) {
      return t('testEditor.ai.backToQuestion', 'Вернуться к вопросу')
    }
    if (hasExplanation) {
      return t('testEditor.ai.showExplanation', 'Показать объяснение')
    }
    return t('testEditor.ai.getExplanation', 'Получить объяснение от AI')
  }

  // Если идет загрузка, показываем только анимацию
  if (isLoading) {
    return (
      <div className="p-2 flex items-center justify-center">
        <AILoadingAnimation isActive={true} size={22} />
      </div>
    )
  }

  return (
    <>
      <Tooltip text={getTooltip()}>
        <button
          type="button"
          onClick={handleClick}
          className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors group relative"
        >
          {isShowingExplanation ? (
            <Icons.ArrowLeft className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="-10 -10 562 562"
              className={`transition-colors ${
                hasExplanation
                  ? 'text-purple-500'
                  : 'text-gray-400 group-hover:text-purple-400'
              }`}
            >
              <path
                fill={hasExplanation ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={hasExplanation ? '0' : '20'}
                d="M 327.5 85.2 c -4.5 1.7 -7.5 6 -7.5 10.8 s 3 9.1 7.5 10.8 L 384 128 l 21.2 56.5 c 1.7 4.5 6 7.5 10.8 7.5 s 9.1 -3 10.8 -7.5 L 448 128 l 56.5 -21.2 c 4.5 -1.7 7.5 -6 7.5 -10.8 s -3 -9.1 -7.5 -10.8 L 448 64 L 426.8 7.5 C 425.1 3 420.8 0 416 0 s -9.1 3 -10.8 7.5 L 384 64 L 327.5 85.2 Z M 205.1 73.3 c -2.6 -5.7 -8.3 -9.3 -14.5 -9.3 s -11.9 3.6 -14.5 9.3 L 123.3 187.3 L 9.3 240 C 3.6 242.6 0 248.3 0 254.6 s 3.6 11.9 9.3 14.5 l 114.1 52.7 L 176 435.8 c 2.6 5.7 8.3 9.3 14.5 9.3 s 11.9 -3.6 14.5 -9.3 l 52.7 -114.1 l 114.1 -52.7 c 5.7 -2.6 9.3 -8.3 9.3 -14.5 s -3.6 -11.9 -9.3 -14.5 L 257.8 187.4 L 205.1 73.3 Z M 384 384 l -56.5 21.2 c -4.5 1.7 -7.5 6 -7.5 10.8 s 3 9.1 7.5 10.8 L 384 448 l 21.2 56.5 c 1.7 4.5 6 7.5 10.8 7.5 s 9.1 -3 10.8 -7.5 L 448 448 l 56.5 -21.2 c 4.5 -1.7 7.5 -6 7.5 -10.8 s -3 -9.1 -7.5 -10.8 L 448 384 l -21.2 -56.5 c -1.7 -4.5 -6 -7.5 -10.8 -7.5 s -9.1 3 -10.8 7.5 L 384 384 Z"
              />
            </svg>
          )}
        </button>
      </Tooltip>
      <Toast
        isOpen={toast.isOpen}
        onClose={closeToast}
        title={toast.title}
        message={toast.message}
        variant={toast.variant}
        duration={4000}
      />
    </>
  )
}

export default TestAIExplainButton

