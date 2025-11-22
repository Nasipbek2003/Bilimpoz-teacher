'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import TeacherLayout from '@/components/teacher/TeacherLayout'
import Button from '@/components/ui/Button'
import { Icons } from '@/components/ui/Icons'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/contexts/AuthContext'
import { 
  isTempId, 
  getDraftTest, 
  saveDraftTest, 
  getTestQuestions,
  generateTempId,
  addQuestionToTestDraft,
  saveQuestionDraft,
  removeQuestionDraft,
  setTestStatus,
  getTestStatus,
  removeTestStatus,
  removeDraftTest,
  type QuestionType,
  type QuestionData
} from '@/lib/test-storage'
import { TestLocalStorage } from '@/lib/test-storage'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import Toast, { ToastVariant } from '@/components/ui/Toast'

// Динамический импорт для избежания SSR проблем
const QuestionEditor = dynamic(() => import('@/components/teacher/QuestionEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--text-primary)] mx-auto mb-4"></div>
        <p className="text-sm text-[var(--text-tertiary)]">Загрузка редактора...</p>
      </div>
    </div>
  )
})

interface Test {
  id: string
  name: string
  description: string
  language: 'ru' | 'kg'
  status?: 'draft' | 'published'
  teacherId?: string
  createdAt?: string
  updatedAt?: string
  section?: 'math1' | 'math2' | 'analogy' | 'rac' | 'grammar' | 'standard'
}

interface Question {
  id: string
  type: QuestionType
  question?: string
  order?: number
}

export default function TestEditorPage() {
  const { t, ready } = useTranslation()
  const { user } = useAuth()
  const router = useRouter()
  const params = useParams()
  const testId = params.id as string

  const [mounted, setMounted] = useState(false)
  const [test, setTest] = useState<Test | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'questions' | 'settings'>('questions')
  const [questions, setQuestions] = useState<Question[]>([])
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [testName, setTestName] = useState('')
  const [testDescription, setTestDescription] = useState('')
  const [testLanguage, setTestLanguage] = useState<'ru' | 'kg'>('ru')
  const [testSection, setTestSection] = useState<QuestionType>('standard')
  const [saving, setSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showPublishConfirm, setShowPublishConfirm] = useState(false)
  const [showDeleteQuestionConfirm, setShowDeleteQuestionConfirm] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null)
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; variant: ToastVariant }>({
    isOpen: false,
    message: '',
    variant: 'success'
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Загрузка теста
  useEffect(() => {
    const loadTest = async () => {
      if (!mounted || !testId) return

      setIsLoading(true)
      try {
        if (isTempId(testId)) {
          // Сначала проверяем localStorage (если тест уже был сохранен)
          const draftTest = getDraftTest(testId)
          if (draftTest) {
            setTest(draftTest)
            setTestName(draftTest.name)
            setTestDescription(draftTest.description)
            setTestLanguage(draftTest.language)
            setTestSection(draftTest.section || 'standard')
          } else {
            // Если черновик не найден в localStorage, проверяем sessionStorage
            // Это данные из CreateTestModal, которые еще не сохранены
            const sessionDataKey = `temp_test_${testId}`
            const sessionData = sessionStorage.getItem(sessionDataKey)
            
            if (sessionData) {
              try {
                const testData = JSON.parse(sessionData)
                const newTest: Test = {
                  id: testId,
                  name: testData.name || getText('tests.newTestName', 'Новый тест'),
                  description: testData.description || '',
                  language: testData.language || 'ru',
                  status: 'draft',
                  teacherId: testData.teacherId || user?.id || '',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  section: testData.section || 'standard'
                }
                setTest(newTest)
                setTestName(newTest.name)
                setTestDescription(newTest.description)
                setTestLanguage(newTest.language)
                setTestSection(newTest.section || 'standard')
                
                // Удаляем данные из sessionStorage после загрузки
                sessionStorage.removeItem(sessionDataKey)
              } catch (error) {
                console.error('Ошибка парсинга данных из sessionStorage:', error)
                // Если ошибка, создаем пустой тест
                if (user?.id) {
                  const newTest: Test = {
                    id: testId,
                    name: getText('tests.newTestName', 'Новый тест'),
                    description: '',
                    language: 'ru',
                    status: 'draft',
                    teacherId: user.id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    section: 'standard'
                  }
                  setTest(newTest)
                  setTestName(newTest.name)
                  setTestDescription(newTest.description)
                  setTestLanguage(newTest.language)
                  setTestSection('standard')
                }
              }
            } else {
              // Если данных нет ни в localStorage, ни в sessionStorage, создаем пустой тест
              if (user?.id) {
                const newTest: Test = {
                  id: testId,
                  name: getText('tests.newTestName', 'Новый тест'),
                  description: '',
                  language: 'ru',
                  status: 'draft',
                  teacherId: user.id,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  section: 'standard'
                }
                setTest(newTest)
                setTestName(newTest.name)
                setTestDescription(newTest.description)
                setTestLanguage(newTest.language)
                setTestSection('standard')
              }
            }
          }

          // Загрузка вопросов из localStorage
          const localQuestions = getTestQuestions(testId)
          setQuestions(localQuestions)
          if (localQuestions.length > 0 && !selectedQuestionId) {
            setSelectedQuestionId(localQuestions[0].id)
          }
        } else {
          // Загрузка из БД
          const response = await fetch(`/api/teacher/tests/${testId}`)
          const result = await response.json()

          if (result.success && result.data) {
            const testData = result.data
            
            // Проверяем есть ли черновик в localStorage для получения section
            const draftFromStorage = getDraftTest(testId)
            const section = draftFromStorage?.section || testData.section || 'standard'
            
            // Проверяем статус из localStorage
            const storedStatus = getTestStatus(testId)
            const finalStatus = storedStatus || 'published'
            
            setTest({ ...testData, section, status: finalStatus })
            setTestName(testData.name)
            setTestDescription(testData.description)
            setTestLanguage(testData.language)
            setTestSection(section)

            // Загрузка вопросов из БД
            try {
              const questionsResponse = await fetch(`/api/teacher/tests/${testId}/questions`)
              const questionsResult = await questionsResponse.json()
              if (questionsResult.success && questionsResult.data && Array.isArray(questionsResult.data)) {
                // Преобразуем вопросы в нужный формат
                const formattedQuestions = questionsResult.data.map((q: any, index: number) => ({
                  id: q.id,
                  type: q.type || q.type_question || 'standard',
                  question: q.question,
                  order: q.order !== undefined ? q.order : index
                }))
                
                setQuestions(formattedQuestions)
                
                // Если section не был определен из теста или равен 'standard', определяем его из типа вопросов
                const currentSection = section || 'standard'
                if (currentSection === 'standard' && formattedQuestions.length > 0) {
                  // Определяем наиболее распространенный тип вопроса
                  const typeCounts: Record<string, number> = {}
                  formattedQuestions.forEach((q: Question) => {
                    const qType = q.type || 'standard'
                    if (qType && qType !== 'standard') {
                      typeCounts[qType] = (typeCounts[qType] || 0) + 1
                    }
                  })
                  
                  // Находим наиболее распространенный тип (игнорируя 'standard')
                  let mostCommonType = 'standard'
                  let maxCount = 0
                  Object.entries(typeCounts).forEach(([type, count]) => {
                    if (count > maxCount) {
                      maxCount = count
                      mostCommonType = type
                    }
                  })
                  
                  // Если нашли тип отличный от standard, используем его
                  if (mostCommonType !== 'standard' && maxCount > 0) {
                    const determinedSection = mostCommonType as QuestionType
                    setTestSection(determinedSection)
                    // Обновляем test с правильным section
                    setTest({ ...testData, section: determinedSection, status: finalStatus })
                    // НЕ сохраняем в localStorage при загрузке из БД
                    // localStorage используется только для черновиков, не для опубликованных тестов
                  }
                }
                
                // Сохраняем вопросы в localStorage ТОЛЬКО если их еще нет
                // Это нужно для возможности редактирования, но избегаем дубликатов
                const existingQuestionIds = getTestQuestions(testId)
                const needsSave = !existingQuestionIds || existingQuestionIds.length === 0
                
                if (needsSave) {
                  const questionIds: Array<{ id: string; type: QuestionType }> = formattedQuestions.map((q: Question) => ({
                    id: q.id,
                    type: q.type
                  }))
                  TestLocalStorage.saveTestQuestions(testId, questionIds)
                  
                  // Загружаем данные вопросов из БД в localStorage для редактирования
                  // Только если их еще нет в localStorage
                  for (const q of questionsResult.data) {
                    const questionType = q.type || q.type_question || 'standard'
                    const existingData = TestLocalStorage.load(q.id, questionType)
                    
                    // Сохраняем только если данных нет в localStorage
                    if (!existingData) {
                      const questionData: QuestionData = {
                        question: q.question || '',
                        answers: (q.answerVariants || []).map((av: any) => ({
                          value: av.value || '',
                          isCorrect: av.isCorrect || false
                        })),
                        points: q.points || 1,
                        timeLimit: q.timeLimit || 60,
                        imageUrl: q.photoUrl,
                        language: q.language || testData.language,
                        textRac: q.textRac,
                        explanation_ai: q.explanationAi
                      }
                      TestLocalStorage.save(q.id, questionData, questionType)
                    }
                  }
                }
                
                if (formattedQuestions.length > 0 && !selectedQuestionId) {
                  setSelectedQuestionId(formattedQuestions[0].id)
                }
              } else {
                // Если вопросов нет, устанавливаем пустой массив
                setQuestions([])
              }
            } catch (questionsError) {
              console.error('Ошибка загрузки вопросов:', questionsError)
              // Не прерываем загрузку теста из-за ошибки загрузки вопросов
              setQuestions([])
            }
          } else {
            console.error('Ошибка загрузки теста:', result.error)
            const errorMessage = result.error || 'Тест не найден'
            setToast({
              isOpen: true,
              message: getText('tests.loadError', 'Ошибка загрузки теста') + ': ' + errorMessage,
              variant: 'error'
            })
            // Небольшая задержка перед редиректом чтобы показать уведомление
            setTimeout(() => {
              router.push('/tests')
            }, 2000)
            return
          }
        }
      } catch (error) {
        console.error('Ошибка при загрузке теста:', error)
        const errorMessage = error instanceof Error ? error.message : String(error)
        setToast({
          isOpen: true,
          message: getText('tests.loadError', 'Ошибка загрузки теста') + ': ' + errorMessage,
          variant: 'error'
        })
        // Небольшая задержка перед редиректом чтобы показать уведомление
        setTimeout(() => {
          router.push('/tests')
        }, 2000)
      } finally {
        setIsLoading(false)
      }
    }

    if (mounted && testId) {
      loadTest()
    }
  }, [mounted, testId, user?.id])

  const getText = (key: string, fallback: string) => {
    if (!mounted || !ready) return fallback
    const translation = t(key)
    return translation === key ? fallback : translation
  }

  // Сохранение теста (черновик в localStorage или обновление в БД)
  const handleSaveTest = async () => {
    if (!test || !user?.id) return

    setSaving(true)
    try {
      const isTempTest = isTempId(test.id)
      // Проверяем статус из localStorage для определения черновика из БД
      const storedStatus = getTestStatus(test.id)
      const isDraftFromDB = (storedStatus === 'draft' || test.status === 'draft') && !isTempTest
      let currentTestId = test.id

      // Если это новый тест с temp-id, генерируем новый ID
      if (isTempTest && !test.id) {
        currentTestId = generateTempId()
      }

      const updatedName = testName.trim() || getText('tests.newTestName', 'Новый тест')
      const updatedDescription = testDescription.trim() || ''
      const updatedSection = testSection || 'standard'

      // Если черновик из БД - обновляем через API
      if (isDraftFromDB) {
        const response = await fetch(`/api/teacher/tests/${test.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: updatedName,
            description: updatedDescription,
            language: testLanguage
          })
        })

        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error || 'Ошибка обновления теста')
        }

        // Сохраняем section в localStorage для черновиков из БД
        const draftTestForStorage = {
          id: test.id,
          name: updatedName,
          description: updatedDescription,
          language: testLanguage,
          status: 'draft' as const,
          createdAt: test.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          teacherId: user.id,
          section: updatedSection
        }
        saveDraftTest(draftTestForStorage)

        // Обновляем состояние теста
        setTest({
          ...test,
          name: updatedName,
          description: updatedDescription,
          language: testLanguage,
          section: updatedSection,
          updatedAt: new Date().toISOString()
        })
        setTestSection(updatedSection)
      } else {
        // Сохранение теста в localStorage (temp-id черновик)
        const draftTest = {
          id: currentTestId,
          name: updatedName,
          description: updatedDescription,
          language: testLanguage,
          status: 'draft' as const,
          createdAt: test.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          teacherId: user.id,
          section: updatedSection
        }

        saveDraftTest(draftTest)
        setTestStatus(currentTestId, 'draft')

        // Обновление состояния теста
        if (isTempTest && currentTestId !== test.id) {
          // Переносим вопросы из старого ID в новый
          const oldQuestions = getTestQuestions(test.id)
          if (oldQuestions.length > 0) {
            TestLocalStorage.saveTestQuestions(currentTestId, oldQuestions)
          }
          
          setTest(draftTest)
          setTestSection(updatedSection)
          router.replace(`/tests/${currentTestId}`)
        } else {
          setTest({ ...test, ...draftTest })
          setTestSection(updatedSection)
        }
      }

      // Синхронизация вопросов (задержка для сохранения данных из компонентов)
      await new Promise(resolve => setTimeout(resolve, 100))

      let savedQuestionsCount = 0
      const questionIds: Array<{ id: string; type: QuestionType }> = []

      // Проверяем является ли тест опубликованным (не temp-id и не черновик)
      const isPublishedTest = !isTempTest && storedStatus !== 'draft' && test.status !== 'draft'

      // Обработка каждого вопроса
      for (const question of questions) {
        // Используем тип вопроса
        const questionType = question.type

        // Загрузка данных из localStorage
        const questionData = TestLocalStorage.load(question.id, questionType) || 
          (question.question ? { question: question.question, answers: [], points: 1, timeLimit: 60 } : null)

        if (!questionData) continue

        // Проверка на пустоту вопроса
        const hasText = questionData.question && questionData.question.trim()
        const hasAnswers = questionData.answers && questionData.answers.some((a: any) => a.value && a.value.trim())
        const hasImage = questionData.imageUrl

        const isEmpty = !hasText && !hasAnswers && !hasImage

        if (isEmpty) {
          // Удаляем пустой вопрос
          TestLocalStorage.remove(question.id, questionType)
          continue
        }

        // Проверка на частичное заполнение
        const isPartiallyFilled = hasText || hasAnswers || hasImage

        if (isPartiallyFilled) {
          // Сохранение вопроса
          const dataToSave: QuestionData = {
            question: questionData.question || '',
            answers: questionData.answers || [],
            points: questionData.points || 1,
            timeLimit: questionData.timeLimit || 60,
            imageUrl: questionData.imageUrl,
            language: questionData.language || testLanguage,
            textRac: questionData.textRac,
            answerA: questionData.answerA,
            answerB: questionData.answerB,
            explanation_ai: questionData.explanation_ai
          }

          TestLocalStorage.save(question.id, dataToSave, questionType)
          questionIds.push({ id: question.id, type: questionType })
          savedQuestionsCount++
        }
      }

      // Удаление пустых вопросов из state
      const validQuestions = questions.filter(q => {
        const questionData = TestLocalStorage.load(q.id, q.type)
        return questionData !== null
      })
      setQuestions(validQuestions)

      // Сохранение списка вопросов теста в localStorage
      // Это нужно даже для опубликованных тестов для возможности редактирования
      TestLocalStorage.saveTestQuestions(currentTestId, questionIds)

      // Сброс флага несохраненных изменений
      const savedTest = getDraftTest(currentTestId)
      if (savedTest) {
        setHasUnsavedChanges(false)
      }

      // Уведомление пользователя
      if (savedQuestionsCount > 0) {
        const message = getText('tests.savedWithQuestions', 'Тест и {count} вопросов сохранены').replace('{count}', String(savedQuestionsCount))
        setToast({
          isOpen: true,
          message,
          variant: 'success'
        })
      } else {
        setToast({
          isOpen: true,
          message: getText('tests.saved', 'Тест сохранен'),
          variant: 'success'
        })
      }
    } catch (error) {
      console.error('Ошибка сохранения теста:', error)
      setToast({
        isOpen: true,
        message: getText('tests.saveError', 'Ошибка при сохранении теста') + ': ' + (error instanceof Error ? error.message : String(error)),
        variant: 'error'
      })
    } finally {
      setSaving(false)
    }
  }

  // Валидация всех вопросов перед публикацией
  const validateAllQuestions = (): string[] => {
    const errors: string[] = []

    // Проверка 0: Количество вопросов
    if (questions.length === 0) {
      errors.push(getText('tests.publish.noQuestions', 'Добавьте вопросы перед публикацией'))
      return errors
    }

    // Ограничение на 30 вопросов убрано

    // Проверка каждого вопроса
    questions.forEach((question, index) => {
      const questionNum = index + 1
      const questionData = TestLocalStorage.load(question.id, question.type)

      if (!questionData) {
        const message = getText('tests.publish.questionNotFilled', 'Вопрос {num}: Заполните текст или добавьте фото').replace('{num}', String(questionNum))
        errors.push(message)
        return
      }

      // Проверка 1: Заполненность вопроса
      const hasText = questionData.question && questionData.question.trim()
      const hasImage = questionData.imageUrl
      const hasTextRac = questionData.textRac && questionData.textRac.trim()

      if (!hasText && !hasImage && !hasTextRac) {
        const message = getText('tests.publish.questionNotFilled', 'Вопрос {num}: Заполните текст или добавьте фото').replace('{num}', String(questionNum))
        errors.push(message)
        return
      }

      // Проверка 2: Количество вариантов ответов
      const answers = questionData.answers || []
      if (answers.length < 2) {
        const message = getText('tests.publish.minAnswers', 'Вопрос {num}: Минимум 2 варианта ответа').replace('{num}', String(questionNum))
        errors.push(message)
        return
      }

      // Проверка 3: Заполненность всех вариантов
      const filledAnswers = answers.filter((a: any) => a.value && a.value.trim())
      if (filledAnswers.length < 2) {
        const message = getText('tests.publish.allAnswersRequired', 'Вопрос {num}: Все варианты должны быть заполнены').replace('{num}', String(questionNum))
        errors.push(message)
        return
      }

      // Проверка 4: Правильный ответ
      const hasCorrectAnswer = filledAnswers.some((a: any) => a.isCorrect)
      if (!hasCorrectAnswer) {
        const message = getText('tests.publish.correctAnswerRequired', 'Вопрос {num}: Выберите правильный ответ').replace('{num}', String(questionNum))
        errors.push(message)
      }
    })

    return errors
  }

  // Обработчик публикации (первичная проверка и модальное окно)
  const handlePublishTest = () => {
    if (!test || !user?.id) return

    // Базовая валидация
    if (questions.length === 0) {
      setToast({
        isOpen: true,
        message: getText('tests.publish.noQuestions', 'Добавьте вопросы перед публикацией'),
        variant: 'warning'
      })
      return
    }

    // Валидация всех вопросов
    const validationErrors = validateAllQuestions()
    if (validationErrors.length > 0) {
      setToast({
        isOpen: true,
        message: validationErrors.join('\n'),
        variant: 'warning'
      })
      return
    }

    // Показываем модальное окно подтверждения
    setShowPublishConfirm(true)
  }

  // Основной процесс публикации
  const executePublishTest = async () => {
    if (!test || !user?.id) return

    setSaving(true)
    setShowPublishConfirm(false)

    try {
      // Задержка перед началом публикации
      await new Promise(resolve => setTimeout(resolve, 100))

      // Определение типа теста
      // КРИТИЧНО: isDraftOnly = true ТОЛЬКО если тест имеет temp-id (новый черновик)
      // Для ВСЕХ тестов с реальным ID из БД (включая опубликованные) ВСЕГДА используем PUT
      const isDraftOnly = isTempId(test.id)
      const oldTestId = test.id

      // КРИТИЧНО: savedTestId должен оставаться тем же для уже существующих тестов
      // НЕ создаем новый тест, а обновляем существующий
      let savedTestId = test.id

      // Сохранение/обновление теста в БД
      // КРИТИЧНО: для уже существующих тестов (не temp-id) ВСЕГДА используем PUT, а не POST
      // Это предотвращает клонирование теста при повторной публикации
      if (isDraftOnly) {
        // POST - создание нового теста (ТОЛЬКО для temp-id черновиков)
        const response = await fetch('/api/teacher/tests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: testName.trim() || getText('tests.newTestName', 'Новый тест'),
            description: testDescription.trim() || '',
            teacherId: user.id,
            language: testLanguage,
            section: testSection
          })
        })

        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error || 'Ошибка создания теста')
        }

        savedTestId = result.data.id
      } else {
        // PUT - обновление существующего теста
        // Это применяется для ВСЕХ тестов с реальным ID из БД, включая уже опубликованные
        // КРИТИЧНО: НЕ создаем новый тест, а обновляем существующий по его ID
        // Это предотвращает клонирование теста при повторной публикации
        
        if (!test.id) {
          throw new Error('Некорректный ID теста для обновления')
        }
        
        const response = await fetch(`/api/teacher/tests/${test.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: testName.trim() || test.name,
            description: testDescription.trim() || test.description,
            language: testLanguage
            // section хранится только в localStorage, не в БД
          })
        })

        const result = await response.json()
        if (!result.success) {
          throw new Error(result.error || 'Ошибка обновления теста')
        }
        
        // КРИТИЧНО: для уже существующего теста savedTestId ВСЕГДА остается тем же
        // НЕ меняем ID, чтобы не создавать клон теста
        savedTestId = test.id
      }

      // Сохранение вопросов в БД
      const oldQuestionIds: string[] = []
      let savedCount = 0
      let failedCount = 0
      let lastError = ''

      for (const question of questions) {
        oldQuestionIds.push(question.id)

        // Синхронизация данных из localStorage
        const questionType = question.type

        const questionData = TestLocalStorage.load(question.id, questionType)
        if (!questionData) {
          failedCount++
          continue
        }

        // Валидация перед сохранением в БД
        const hasText = questionData.question && questionData.question.trim()
        const filledAnswers = (questionData.answers || []).filter((a: any) => a.value && a.value.trim())
        const hasCorrectAnswer = filledAnswers.some((a: any) => a.isCorrect)

        if (!hasText || filledAnswers.length < 2 || !hasCorrectAnswer) {
          failedCount++
          const questionNum = questions.indexOf(question) + 1
          const message = getText('tests.publish.questionInvalid', 'Вопрос {num} не прошел валидацию').replace('{num}', String(questionNum))
          lastError = message
          continue
        }

        // Формирование данных для отправки
        const questionPayload: any = {
          question: questionData.question,
          answerVariants: filledAnswers.map((a: any) => ({
            value: a.value,
            isCorrect: a.isCorrect
          })),
          photoUrl: questionData.imageUrl,
          points: questionData.points || 1,
          timeLimit: questionData.timeLimit || 60,
          language: questionData.language || testLanguage,
          type: questionType
        }

        // Добавляем опциональные поля если они есть
        if (questionData.textRac) {
          questionPayload.textRac = questionData.textRac
        }
        if (questionData.explanation_ai) {
          questionPayload.explanationAi = questionData.explanation_ai
        }

        try {
          if (isTempId(question.id)) {
            // POST - создание нового вопроса
            const response = await fetch(`/api/teacher/tests/${savedTestId}/questions?teacherId=${user.id}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(questionPayload)
            })

            const result = await response.json()
            if (result.success) {
              savedCount++
              // Обновляем ID вопроса в state
              setQuestions(prev => prev.map(q => 
                q.id === question.id ? { ...q, id: result.data.id } : q
              ))
            } else {
              failedCount++
              lastError = result.error || 'Ошибка сохранения вопроса'
            }
          } else {
            // PUT - обновление существующего вопроса
            const response = await fetch(`/api/teacher/tests/${savedTestId}/questions/${question.id}?teacherId=${user.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(questionPayload)
            })

            const result = await response.json()
            if (result.success) {
              savedCount++
            } else {
              failedCount++
              lastError = result.error || 'Ошибка обновления вопроса'
            }
          }
        } catch (error) {
          failedCount++
          lastError = error instanceof Error ? error.message : String(error)
        }
      }

      // Проверка результата сохранения вопросов
      if (failedCount > 0) {
        if (savedCount === 0) {
          throw new Error(lastError || 'Не удалось сохранить вопросы')
        } else {
          const message = getText('tests.publish.partialSave', 'Сохранено {saved} из {total} вопросов')
            .replace('{saved}', String(savedCount))
            .replace('{total}', String(questions.length))
          throw new Error(message + '. ' + lastError)
        }
      }

      // Обновление статуса теста в БД
      const statusResponse = await fetch(`/api/teacher/tests/${savedTestId}/status?teacherId=${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' })
      })

      const statusResult = await statusResponse.json()
      if (!statusResult.success) {
        throw new Error(statusResult.error || 'Ошибка изменения статуса теста')
      }

      // Обновление состояния теста
      const updatedTest = {
        ...test,
        id: savedTestId,
        status: 'published' as const,
        name: testName.trim() || test.name,
        description: testDescription.trim() || test.description,
        language: testLanguage,
        section: testSection
      }
      
      setTest(updatedTest)
      
      // Обновляем список вопросов с актуальными ID из БД
      // Вопросы уже обновлены в state через setQuestions в цикле сохранения
      // Получаем актуальный список вопросов из state
      const currentQuestions = questions
      
      // Обновляем выбранный вопрос если нужно
      if (currentQuestions.length > 0) {
        // Если текущий выбранный вопрос больше не существует, выбираем первый
        const currentSelectedExists = currentQuestions.some((q: Question) => q.id === selectedQuestionId)
        if (!currentSelectedExists) {
          setSelectedQuestionId(currentQuestions[0].id)
        }
      } else {
        setSelectedQuestionId(null)
      }
      
      // Очистка localStorage после публикации
      // После публикации тест хранится в БД, не нужно дублировать в localStorage
      // Это предотвращает дубликаты при повторной публикации или создании теста
      
      if (isDraftOnly) {
        // Для новых тестов (черновиков) удаляем все данные из localStorage
        removeDraftTest(oldTestId)
        TestLocalStorage.removeTestQuestions(oldTestId)
        if (savedTestId !== oldTestId) {
          removeDraftTest(savedTestId)
          TestLocalStorage.removeTestQuestions(savedTestId)
        }
        
        // Удаление данных всех вопросов
        for (const questionId of oldQuestionIds) {
          const question = questions.find(q => q.id === questionId)
          if (question) {
            TestLocalStorage.remove(questionId, question.type)
          }
        }
        
        // Удаление статуса теста
        removeTestStatus(oldTestId)
        if (savedTestId !== oldTestId) {
          removeTestStatus(savedTestId)
        }
      } else {
        // Для уже опубликованных тестов удаляем из localStorage после публикации
        // чтобы избежать дубликатов и конфликтов данных
        removeDraftTest(savedTestId)
        removeTestStatus(savedTestId)
        TestLocalStorage.removeTestQuestions(savedTestId)
        
        // Удаляем temp-id вопросы из localStorage, которые были сохранены в БД
        for (const questionId of oldQuestionIds) {
          const question = questions.find(q => q.id === questionId)
          if (question && isTempId(questionId)) {
            // Удаляем старый temp-id вопрос, так как он теперь в БД
            TestLocalStorage.remove(questionId, question.type)
          }
        }
      }

      // Обновление URL только если ID изменился (для новых тестов)
      // Для уже опубликованных тестов ID не меняется, поэтому редирект не нужен
      if (savedTestId !== oldTestId && isDraftOnly) {
        router.replace(`/tests/${savedTestId}`)
      }

      // Уведомление пользователя
      setToast({
        isOpen: true,
        message: getText('tests.published', 'Тест опубликован'),
        variant: 'success'
      })
    } catch (error) {
      console.error('Ошибка публикации теста:', error)
      setToast({
        isOpen: true,
        message: getText('tests.publishError', 'Ошибка при публикации теста') + ': ' + (error instanceof Error ? error.message : String(error)),
        variant: 'error'
      })
    } finally {
      setSaving(false)
    }
  }

  // Добавление нового вопроса
  const handleAddQuestion = () => {
    if (!test) return

    // Тип вопроса определяется из раздела теста
    // Используем test.section если testSection не установлен
    const questionType = testSection || test.section || 'standard'

    const newQuestionId = generateTempId()
    const newQuestion: Question = {
      id: newQuestionId,
      type: questionType,
      question: '',
      order: questions.length
    }

    // Сохраняем в localStorage
    addQuestionToTestDraft(test.id, newQuestionId, questionType)
    saveQuestionDraft(newQuestionId, questionType, {
      question: '',
      answers: [{ value: '', isCorrect: false }, { value: '', isCorrect: false }],
      points: 1,
      timeLimit: 60,
      language: test.language
    })

    setQuestions([...questions, newQuestion])
    setSelectedQuestionId(newQuestionId)
  }

  // Удаление вопроса
  const handleDeleteQuestion = (questionId: string) => {
    setQuestionToDelete(questionId)
    setShowDeleteQuestionConfirm(true)
  }

  const executeDeleteQuestion = () => {
    if (!questionToDelete) return

    const question = questions.find(q => q.id === questionToDelete)
    if (question) {
      removeQuestionDraft(questionToDelete, question.type)
    }

    const updatedQuestions = questions.filter(q => q.id !== questionToDelete)
    setQuestions(updatedQuestions)

    if (selectedQuestionId === questionToDelete) {
      setSelectedQuestionId(updatedQuestions.length > 0 ? updatedQuestions[0].id : null)
    }

    setShowDeleteQuestionConfirm(false)
    setQuestionToDelete(null)
  }

  // Возврат к списку тестов
  const handleBack = () => {
    router.push('/tests')
  }

  // Получаем название типа вопроса
  const getQuestionTypeName = (type: QuestionType) => {
    const typeNames = {
      standard: getText('tests.types.standard', 'С'),
      analogy: getText('tests.types.analogy', 'А'),
      grammar: getText('tests.types.grammar', 'Г'),
      math1: getText('tests.types.math1', 'М1'),
      math2: getText('tests.types.math2', 'М2'),
      rac: getText('tests.types.rac', 'Р')
    }
    return typeNames[type] || type
  }

  // Получаем цвет для типа вопроса
  const getQuestionTypeColor = (type: QuestionType) => {
    const typeColors = {
      standard: 'bg-gray-500',
      analogy: 'bg-green-500',
      grammar: 'bg-red-500',
      math1: 'bg-blue-500',
      math2: 'bg-purple-500',
      rac: 'bg-orange-500'
    }
    return typeColors[type] || 'bg-gray-500'
  }

  if (!mounted) {
    return null
  }

  if (isLoading) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Icons.Loader2 className="h-8 w-8 animate-spin mx-auto text-[var(--text-tertiary)] mb-4" />
            <p className="text-sm text-[var(--text-tertiary)]">
              {getText('tests.loading', 'Загрузка теста...')}
            </p>
          </div>
        </div>
      </TeacherLayout>
    )
  }

  if (!test) {
    return (
      <TeacherLayout>
        <div className="text-center py-12">
          <p className="text-[var(--text-tertiary)] mb-4">
            {getText('tests.testNotFound', 'Тест не найден')}
          </p>
          <Button onClick={handleBack} variant="primary">
            {getText('tests.backToList', 'Вернуться к списку тестов')}
          </Button>
        </div>
      </TeacherLayout>
    )
  }

  return (
    <TeacherLayout>
      <div className="flex flex-col h-screen">
        {/* Заголовок */}
        <div className="flex items-center justify-between px-6 py-4 bg-[var(--bg-card)] border-b border-[var(--border-primary)]">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-[var(--bg-hover)] rounded-lg transition-colors"
            >
              <Icons.ArrowLeft className="h-5 w-5 text-[var(--text-primary)]" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                {testName || getText('tests.editTest', 'Редактирование теста')}
              </h1>
              <p className="text-sm text-[var(--text-tertiary)] mt-1">
                {test.status === 'draft' 
                  ? getText('tests.draft', 'Черновик')
                  : getText('tests.published', 'Опубликован')
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={handleSaveTest} 
              variant="primary" 
              disabled={saving || !test}
              isLoading={saving}
            >
              {saving ? getText('tests.saving', 'Saving...') : getText('tests.save', 'Сохранить')}
            </Button>
            {test?.status === 'draft' && questions.length > 0 && (
              <Button 
                onClick={handlePublishTest} 
                variant="primary"
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {saving ? getText('tests.publishing', 'Publishing...') : getText('tests.publish', 'Опубликовать')}
              </Button>
            )}
          </div>
        </div>

        {/* Основной контент: 2 колонки */}
        <div className="flex flex-1 overflow-hidden">
          {/* Левая панель - Список вопросов */}
          <div className="w-80 bg-[var(--bg-card)] border-r border-[var(--border-primary)] flex flex-col">
            {/* Вкладки */}
            <div className="flex border-b border-[var(--border-primary)]">
              <button
                onClick={() => setActiveTab('questions')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'questions'
                    ? 'text-[var(--text-primary)] border-b-2 border-[var(--text-primary)]'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {getText('tests.tabs.questions', 'Вопросы')}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'text-[var(--text-primary)] border-b-2 border-[var(--text-primary)]'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                }`}
              >
                {getText('tests.tabs.settings', 'Настройки')}
              </button>
            </div>

            {/* Контент вкладок */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'questions' ? (
                <div className="p-4 space-y-2">
                  {/* Кнопка добавления вопроса */}
                  <button
                    onClick={handleAddQuestion}
                    className="w-full p-4 border-2 border-dashed border-[var(--border-primary)] rounded-lg hover:border-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors flex items-center justify-center gap-2 text-[var(--text-secondary)]"
                  >
                    <Icons.Plus className="h-5 w-5" />
                    <span>{getText('tests.addQuestion', 'Добавить вопрос')}</span>
                  </button>

                  {/* Список вопросов */}
                  {questions.length === 0 ? (
                    <div className="text-center py-12 text-[var(--text-tertiary)]">
                      <Icons.HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p className="text-sm">{getText('tests.noQuestions', 'Вопросы пока не добавлены')}</p>
                    </div>
                  ) : (
                    questions.map((q, index) => (
                      <div
                        key={q.id}
                        onClick={() => setSelectedQuestionId(q.id)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          selectedQuestionId === q.id
                            ? 'border-[var(--text-primary)] bg-[var(--text-primary)]/10'
                            : 'border-[var(--border-primary)] hover:border-[var(--text-primary)]/50 hover:bg-[var(--bg-hover)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            {/* Номер вопроса */}
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-primary)] font-semibold text-sm flex-shrink-0">
                              {index + 1}
                            </div>
                            
                            <div className="flex-1 min-w-0 overflow-hidden">
                              {/* Тип вопроса */}
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getQuestionTypeColor(q.type)}`}>
                                  {getQuestionTypeName(q.type)}
                                </span>
                                <span className="text-xs text-[var(--text-tertiary)]">
                                  {getText(`tests.types.${q.type}Full`, q.type)}
                                </span>
                              </div>
                              
                              {/* Текст вопроса (если есть) */}
                              {q.question && (
                                <p className="text-sm text-[var(--text-secondary)] truncate">
                                  {q.question}
                                </p>
                              )}
                              {!q.question && (
                                <p className="text-sm text-[var(--text-tertiary)] italic">
                                  {getText('tests.newQuestion', 'Новый вопрос')}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Кнопка удаления */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteQuestion(q.id)
                            }}
                            className="p-1 hover:bg-red-500/10 rounded transition-colors flex-shrink-0"
                          >
                            <Icons.Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                // Вкладка настроек
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      {getText('tests.testName', 'Название теста')} <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={testName}
                      onChange={(e) => setTestName(e.target.value)}
                      placeholder={getText('tests.testNamePlaceholder', 'Введите название теста')}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-primary)] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      {getText('tests.testDescription', 'Описание теста')}
                    </label>
                    <textarea
                      value={testDescription}
                      onChange={(e) => setTestDescription(e.target.value)}
                      placeholder={getText('tests.testDescriptionPlaceholder', 'Введите описание теста')}
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent-primary)] resize-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      {getText('tests.createModal.section', 'Раздел теста')}
                    </label>
                    <select
                      value={testSection}
                      onChange={(e) => setTestSection(e.target.value as QuestionType)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-sm"
                    >
                      <option value="math1">{getText('tests.types.math1Full', 'Математика 1')}</option>
                      <option value="math2">{getText('tests.types.math2Full', 'Математика 2')}</option>
                      <option value="analogy">{getText('tests.types.analogyFull', 'Аналогия')}</option>
                      <option value="rac">{getText('tests.types.racFull', 'Чтение и понимание')}</option>
                      <option value="grammar">{getText('tests.types.grammarFull', 'Грамматика')}</option>
                      <option value="standard">{getText('tests.types.standardFull', 'Стандартный')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                      {getText('tests.language', 'Язык')} <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={testLanguage}
                      onChange={(e) => setTestLanguage(e.target.value as 'ru' | 'kg')}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)] text-sm"
                    >
                      <option value="ru">{getText('tests.russian', 'Русский')}</option>
                      <option value="kg">{getText('tests.kyrgyz', 'Кыргызский')}</option>
                    </select>
                  </div>

                  <Button onClick={handleSaveTest} variant="primary" className="w-full" disabled={saving} isLoading={saving}>
                    {saving ? getText('tests.saving', 'Saving...') : getText('tests.save', 'Сохранить')}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Правая панель - Редактор вопроса */}
          <div className="flex-1 overflow-y-auto bg-[var(--bg-primary)]">
            {selectedQuestionId ? (() => {
              const selectedQuestion = questions.find(q => q.id === selectedQuestionId)
              const questionType: QuestionType = (selectedQuestion?.type || testSection || 'standard') as QuestionType
              return (
                <QuestionEditor
                  questionId={selectedQuestionId}
                  testId={testId}
                  testLanguage={testLanguage}
                  questionType={questionType}
                  onQuestionUpdate={(questionId, data) => {
                    // Обновляем текст вопроса в списке
                    setQuestions(prev => prev.map(q => 
                      q.id === questionId ? { ...q, question: data.question, type: data.type } : q
                    ))
                  }}
                />
              )
            })() : (
              <div className="flex items-center justify-center h-full text-[var(--text-tertiary)]">
                <div className="text-center">
                  <Icons.HelpCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>{getText('tests.selectQuestion', 'Выберите вопрос для редактирования')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модальное окно подтверждения публикации */}
      <ConfirmDialog
        isOpen={showPublishConfirm}
        onClose={() => setShowPublishConfirm(false)}
        onConfirm={executePublishTest}
        title={getText('tests.publishConfirmTitle', 'Подтвердите публикацию')}
        message={getText('tests.publishConfirmMessage', 'Вы уверены, что хотите опубликовать этот тест? После публикации тест станет доступен для прохождения.')}
        confirmText={getText('tests.publish', 'Опубликовать')}
        cancelText={getText('common.cancel', 'Отмена')}
        variant="warning"
        isLoading={saving}
      />

      {/* Модальное окно подтверждения удаления вопроса */}
      <ConfirmDialog
        isOpen={showDeleteQuestionConfirm}
        onClose={() => {
          setShowDeleteQuestionConfirm(false)
          setQuestionToDelete(null)
        }}
        onConfirm={executeDeleteQuestion}
        title={getText('tests.deleteQuestionConfirmTitle', 'Удалить вопрос?')}
        message={getText('tests.deleteQuestionConfirmMessage', 'Вы уверены, что хотите удалить этот вопрос? Это действие нельзя отменить.')}
        confirmText={getText('common.delete', 'Удалить')}
        cancelText={getText('common.cancel', 'Отмена')}
        variant="danger"
      />

      {/* Toast уведомления */}
      <Toast
        isOpen={toast.isOpen}
        onClose={() => setToast({ ...toast, isOpen: false })}
        message={toast.message}
        variant={toast.variant}
        duration={4000}
      />
    </TeacherLayout>
  )
}
