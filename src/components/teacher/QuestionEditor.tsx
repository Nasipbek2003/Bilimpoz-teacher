'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import 'katex/dist/katex.min.css'
import { Icons } from '@/components/ui/Icons'
import Button from '@/components/ui/Button'
import TestToolbar from '@/components/teacher/TestToolbar'
import { useTranslation } from '@/hooks/useTranslation'
import { useAI } from '@/hooks/useAI'
import { 
  loadQuestionDraft, 
  saveQuestionDraft, 
  type QuestionType, 
  type QuestionData 
} from '@/lib/test-storage'

interface QuestionEditorProps {
  questionId: string
  testId: string
  testLanguage: 'ru' | 'kg'
  questionType: QuestionType
  onQuestionUpdate?: (questionId: string, data: { question: string; type: QuestionType }) => void
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  questionId,
  testId,
  testLanguage,
  questionType,
  onQuestionUpdate
}) => {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [questionText, setQuestionText] = useState('')
  const [answers, setAnswers] = useState<Array<{ value: string; isCorrect: boolean }>>([
    { value: '', isCorrect: false },
    { value: '', isCorrect: false }
  ])
  const [points, setPoints] = useState(1)
  const [timeLimit, setTimeLimit] = useState(60)
  const [imageUrl, setImageUrl] = useState('')
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ start: 0, end: 0 })
  const questionTextareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageToLatexInputRef = useRef<HTMLInputElement>(null)
  
  // AI hooks - с проверкой на существование
  const [aiLoading, setAiLoading] = useState(false)
  const aiHook = typeof window !== 'undefined' ? useAI() : null
  const improveText = aiHook?.improveText
  const convertImageToLatex = aiHook?.convertImageToLatex

  useEffect(() => {
    setMounted(true)
  }, [])

  // Загрузка данных вопроса
  useEffect(() => {
    if (!mounted || !questionId) return

    const loadedData = loadQuestionDraft(questionId, questionType)
    if (loadedData) {
      setQuestionText(loadedData.question || '')
      setAnswers(loadedData.answers || [{ value: '', isCorrect: false }, { value: '', isCorrect: false }])
      setPoints(loadedData.points || 1)
      setTimeLimit(loadedData.timeLimit || 60)
      setImageUrl(loadedData.imageUrl || '')
    }
  }, [mounted, questionId, questionType])

  // Автосохранение при изменении
  useEffect(() => {
    if (!mounted || !questionId) return

    const saveTimer = setTimeout(() => {
      saveQuestionDraft(questionId, questionType, {
        question: questionText,
        answers,
        points,
        timeLimit,
        imageUrl,
        language: testLanguage
      })

      // Уведомляем родителя об обновлении
      if (onQuestionUpdate) {
        onQuestionUpdate(questionId, {
          question: questionText,
          type: questionType
        })
      }
    }, 500)

    return () => clearTimeout(saveTimer)
  }, [mounted, questionId, questionType, questionText, answers, points, timeLimit, imageUrl, testLanguage, onQuestionUpdate])

  const getText = (key: string, fallback: string) => {
    if (!mounted || !ready) return fallback
    const translation = t(key)
    return translation === key ? fallback : translation
  }

  // Функция для определения активного форматирования в выделенном тексте
  const getActiveFormats = (text: string, start: number, end: number) => {
    const selectedText = text.substring(start, end)
    const formats = {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false
    }

    // Проверяем, окружен ли выделенный текст маркерами форматирования
    const textBefore = text.substring(Math.max(0, start - 10), start)
    const textAfter = text.substring(end, Math.min(text.length, end + 10))

    // Жирный: **текст**
    if (textBefore.endsWith('**') && textAfter.startsWith('**')) {
      formats.bold = true
    }

    // Курсив: *текст* (но не **текст**)
    if (textBefore.endsWith('*') && textAfter.startsWith('*') && 
        !textBefore.endsWith('**') && !textAfter.startsWith('**')) {
      formats.italic = true
    }

    // Зачеркнутый: ~~текст~~
    if (textBefore.endsWith('~~') && textAfter.startsWith('~~')) {
      formats.strikethrough = true
    }

    // Подчеркнутый: <u>текст</u>
    if (textBefore.endsWith('<u>') && textAfter.startsWith('</u>')) {
      formats.underline = true
    }

    return formats
  }

  // Обработчики форматирования текста
  const handleFormat = (format: string) => {
    const textarea = questionTextareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = questionText.substring(start, end)

    // Для формул используем старую логику (без toggle)
    if (format === 'inline-formula' || format === 'block-formula') {
      let formattedText = ''
      
      // Проверяем, что находится перед курсором (для добавления пробела между формулами)
      const textBefore = questionText.substring(0, start)
      const endsWithFormula = textBefore.length > 0 && 
        (textBefore.endsWith('$$') || textBefore.endsWith('$'))
      const needsSpace = endsWithFormula && 
        !textBefore.endsWith(' ') && 
        !textBefore.endsWith('\n')

      switch (format) {
        case 'inline-formula':
          formattedText = `${needsSpace ? ' ' : ''}$${selectedText || 'x^2'}$`
          break
        case 'block-formula':
          formattedText = `${needsSpace ? ' ' : ''}$$${selectedText || '\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}'}$$`
          break
      }

      const newText = 
        questionText.substring(0, start) + 
        formattedText + 
        questionText.substring(end)
      
      setQuestionText(newText)
      
      setTimeout(() => {
        textarea.focus()
        const newPosition = start + formattedText.length
        textarea.setSelectionRange(newPosition, newPosition)
      }, 0)
      return
    }

    // Для текстового форматирования используем toggle-логику
    const activeFormats = getActiveFormats(questionText, start, end)
    let newText = questionText
    let newStart = start
    let newEnd = end

    switch (format) {
      case 'bold':
        if (activeFormats.bold) {
          // Убираем форматирование: удаляем ** с обеих сторон
          const beforeMarker = questionText.substring(0, start - 2)
          const afterMarker = questionText.substring(end + 2)
          newText = beforeMarker + selectedText + afterMarker
          newStart = start - 2
          newEnd = end - 2
        } else {
          // Добавляем форматирование
          const formattedText = `**${selectedText || 'текст'}**`
          newText = questionText.substring(0, start) + formattedText + questionText.substring(end)
          newStart = start + 2
          newEnd = start + 2 + (selectedText || 'текст').length
        }
        break

      case 'italic':
        if (activeFormats.italic) {
          // Убираем форматирование: удаляем * с обеих сторон
          const beforeMarker = questionText.substring(0, start - 1)
          const afterMarker = questionText.substring(end + 1)
          newText = beforeMarker + selectedText + afterMarker
          newStart = start - 1
          newEnd = end - 1
        } else {
          // Добавляем форматирование
          const formattedText = `*${selectedText || 'текст'}*`
          newText = questionText.substring(0, start) + formattedText + questionText.substring(end)
          newStart = start + 1
          newEnd = start + 1 + (selectedText || 'текст').length
        }
        break

      case 'strikethrough':
        if (activeFormats.strikethrough) {
          // Убираем форматирование: удаляем ~~ с обеих сторон
          const beforeMarker = questionText.substring(0, start - 2)
          const afterMarker = questionText.substring(end + 2)
          newText = beforeMarker + selectedText + afterMarker
          newStart = start - 2
          newEnd = end - 2
        } else {
          // Добавляем форматирование
          const formattedText = `~~${selectedText || 'текст'}~~`
          newText = questionText.substring(0, start) + formattedText + questionText.substring(end)
          newStart = start + 2
          newEnd = start + 2 + (selectedText || 'текст').length
        }
        break

      case 'underline':
        if (activeFormats.underline) {
          // Убираем форматирование: удаляем <u> и </u>
          const beforeMarker = questionText.substring(0, start - 3)
          const afterMarker = questionText.substring(end + 4)
          newText = beforeMarker + selectedText + afterMarker
          newStart = start - 3
          newEnd = end - 3
        } else {
          // Добавляем форматирование
          const formattedText = `<u>${selectedText || 'текст'}</u>`
          newText = questionText.substring(0, start) + formattedText + questionText.substring(end)
          newStart = start + 3
          newEnd = start + 3 + (selectedText || 'текст').length
        }
        break

      default:
        return
    }

    setQuestionText(newText)
    
    // Восстанавливаем фокус и выделение
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newStart, newEnd)
    }, 0)
  }

  // Загрузка изображения
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert(getText('questions.form.invalidImageType', 'Неподдерживаемый тип файла'))
      return
    }

    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert(getText('questions.form.imageTooLarge', 'Размер файла превышает 5MB'))
      return
    }

    setIsUploadingImage(true)

    try {
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: uploadFormData
      })

      const result = await response.json()

      if (result.success && result.url) {
        setImageUrl(result.url)
      } else {
        alert(result.error || getText('questions.form.uploadError', 'Ошибка загрузки изображения'))
      }
    } catch (error) {
      console.error('Ошибка загрузки изображения:', error)
      alert(getText('questions.form.uploadError', 'Ошибка загрузки изображения'))
    } finally {
      setIsUploadingImage(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // AI улучшение текста
  const handleMagicWand = async () => {
    // Улучшает выделенный текст с помощью AI
    const textarea = questionTextareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = questionText.substring(start, end).trim()

    if (!selectedText) {
      // Если ничего не выделено, показываем подсказку
      alert(getText('testEditor.errors.selectTextToImprove', 'Выделите текст, который нужно улучшить'))
      return
    }

    if (!improveText) {
      alert(getText('testEditor.errors.aiNotAvailable', 'AI функция недоступна'))
      return
    }

    setAiLoading(true)
    try {
      // Вызываем AI для улучшения текста
      const improvedText = await improveText(selectedText, testLanguage)

      // Заменяем выделенный текст на улучшенный
      const newText = 
        questionText.substring(0, start) + 
        improvedText + 
        questionText.substring(end)
      
      setQuestionText(newText)
      
      // Восстанавливаем фокус и позицию курсора
      setTimeout(() => {
        textarea.focus()
        const newPosition = start + improvedText.length
        textarea.setSelectionRange(newPosition, newPosition)
      }, 0)
    } catch (error) {
      console.error('Ошибка улучшения текста:', error)
      alert(getText('testEditor.errors.improvementError', 'Ошибка при улучшении текста'))
    } finally {
      setAiLoading(false)
    }
  }

  // Конвертация изображения в LaTeX
  const handleImageToLatex = () => {
    // Открываем диалог выбора файла
    imageToLatexInputRef.current?.click()
  }

  const handleImageToLatexFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      alert(getText('questions.form.invalidImageType', 'Выберите изображение'))
      return
    }
    
    // Проверка размера (максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(getText('questions.form.imageTooLarge', 'Размер файла превышает 5MB'))
      return
    }

    const textarea = questionTextareaRef.current
    if (!textarea) return

    if (!convertImageToLatex) {
      alert(getText('testEditor.errors.aiNotAvailable', 'AI функция недоступна'))
      return
    }

    setAiLoading(true)
    try {
      // Конвертируем изображение в LaTeX
      const latexCode = await convertImageToLatex(file)
      
      // Вставляем LaTeX код в позицию курсора
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      
      const newText = 
        questionText.substring(0, start) + 
        latexCode + 
        questionText.substring(end)
      
      setQuestionText(newText)
      
      // Восстанавливаем фокус и позицию курсора
      setTimeout(() => {
        textarea.focus()
        const newPosition = start + latexCode.length
        textarea.setSelectionRange(newPosition, newPosition)
      }, 0)
    } catch (error) {
      console.error('Ошибка конвертации изображения:', error)
      alert(getText('questions.form.imageConversionError', 'Ошибка при конвертации изображения'))
    } finally {
      setAiLoading(false)
      // Очищаем input для возможности повторной загрузки того же файла
      if (imageToLatexInputRef.current) {
        imageToLatexInputRef.current.value = ''
      }
    }
  }

  // Управление вариантами ответов
  const handleAddAnswer = () => {
    setAnswers([...answers, { value: '', isCorrect: false }])
  }

  const handleRemoveAnswer = (index: number) => {
    if (answers.length > 2) {
      const wasCorrect = answers[index].isCorrect
      const newAnswers = answers.filter((_, i) => i !== index)
      
      // Если удалили правильный ответ, делаем первый ответ правильным
      if (wasCorrect && newAnswers.length > 0) {
        newAnswers[0].isCorrect = true
      }
      
      setAnswers(newAnswers)
    }
  }

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers]
    newAnswers[index].value = value
    setAnswers(newAnswers)
  }

  const handleCorrectAnswerChange = (index: number) => {
    const newAnswers = answers.map((a, i) => ({ ...a, isCorrect: i === index }))
    setAnswers(newAnswers)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="h-full flex flex-col bg-[var(--bg-card)]">
      {/* Заголовок редактора */}
      <div className="px-6 py-4 border-b border-[var(--border-primary)]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            {getText('tests.questionEditor', 'Редактор вопроса')}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isPreviewMode
                  ? 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {isPreviewMode 
                ? getText('tests.editMode', 'Редактирование')
                : getText('tests.previewMode', 'Предпросмотр')
              }
            </button>
          </div>
        </div>
      </div>

      {/* Контент редактора */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Текст вопроса */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)]">
              {getText('tests.questionText', 'Текст вопроса')} <span className="text-red-400">*</span>
            </label>
          </div>

          {!isPreviewMode ? (
            <>
              <TestToolbar
                onFormat={handleFormat}
                isPreviewMode={isPreviewMode}
                onImageToLatex={handleImageToLatex}
                onMagicWand={handleMagicWand}
                onTogglePreview={() => setIsPreviewMode(!isPreviewMode)}
                activeFormats={getActiveFormats(questionText, cursorPosition.start, cursorPosition.end)}
                isAiLoading={aiLoading}
              />
              <textarea
                ref={questionTextareaRef}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                onSelect={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  setCursorPosition({ start: target.selectionStart, end: target.selectionEnd })
                }}
                onKeyUp={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  setCursorPosition({ start: target.selectionStart, end: target.selectionEnd })
                }}
                onClick={(e) => {
                  const target = e.target as HTMLTextAreaElement
                  setCursorPosition({ start: target.selectionStart, end: target.selectionEnd })
                }}
                placeholder={getText('tests.questionPlaceholder', 'Введите текст вопроса...')}
                rows={8}
                className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-primary)] resize-none text-sm font-mono"
              />
            </>
          ) : (
            <div className="p-4 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] min-h-[200px] prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex, rehypeRaw]}
              >
                {questionText || getText('tests.emptyQuestion', 'Текст вопроса отсутствует')}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Изображение */}
        {imageUrl && (
          <div className="relative">
            <img
              src={imageUrl}
              alt="Question"
              className="max-w-full h-auto rounded-lg border border-[var(--border-primary)]"
            />
            <button
              onClick={() => setImageUrl('')}
              className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              <Icons.Trash2 className="h-4 w-4 text-white" />
            </button>
          </div>
        )}

        {/* Варианты ответов */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-[var(--text-secondary)]">
              {getText('tests.answers', 'Варианты ответов')} <span className="text-red-400">*</span>
            </label>
          </div>

          <div className="space-y-2">
            {answers.map((answer, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={answer.isCorrect}
                  onChange={() => handleCorrectAnswerChange(index)}
                  className="flex-shrink-0"
                />
                <textarea
                  value={answer.value}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  placeholder={`${getText('tests.answer', 'Ответ')} ${index + 1}`}
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:border-[var(--text-primary)] text-sm resize-none overflow-y-auto"
                />
                {/* Кнопка удаления - показываем если больше минимального количества */}
                {answers.length > 2 && (
                  <button
                    onClick={() => handleRemoveAnswer(index)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                    title={getText('tests.removeAnswer', 'Удалить вариант')}
                  >
                    <Icons.Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Кнопка добавления ответа */}
          <button
            onClick={handleAddAnswer}
            className="mt-3 w-full px-4 py-2.5 border-2 border-dashed border-[var(--border-primary)] rounded-lg hover:border-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors flex items-center justify-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <Icons.Plus className="h-5 w-5" />
            <span>{getText('tests.addAnswer', 'Добавить вариант')}</span>
          </button>
        </div>

        {/* Баллы и время */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              {getText('tests.points', 'Баллы')} <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={points || ''}
              onChange={(e) => {
                const inputValue = e.target.value
                if (inputValue === '') {
                  setPoints(0)
                  return
                }
                const value = parseInt(inputValue) || 0
                if (value >= 1 && value <= 5) {
                  setPoints(value)
                } else if (value === 0 && inputValue === '0') {
                  setPoints(0)
                }
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value) || 1
                setPoints(Math.min(Math.max(1, value), 5))
              }}
              min="1"
              max="5"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] text-sm"
            />
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              {getText('tests.pointsHint', 'Максимум 5 баллов')}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              {getText('tests.timeLimit', 'Время (сек)')} <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              value={timeLimit || ''}
              onChange={(e) => {
                const inputValue = e.target.value
                if (inputValue === '') {
                  setTimeLimit(0)
                  return
                }
                const value = parseInt(inputValue) || 0
                if (value >= 1 && value <= 120) {
                  setTimeLimit(value)
                } else if (value === 0 && inputValue === '0') {
                  setTimeLimit(0)
                }
              }}
              onBlur={(e) => {
                const value = parseInt(e.target.value) || 60
                setTimeLimit(Math.min(Math.max(1, value), 120))
              }}
              min="1"
              max="120"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border-primary)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)] text-sm"
            />
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              {getText('tests.timeLimitHint', 'Максимум 120 секунд')}
            </p>
          </div>
        </div>
      </div>

      {/* Скрытые input для загрузки изображений */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        className="hidden"
      />
      <input
        type="file"
        ref={imageToLatexInputRef}
        onChange={handleImageToLatexFileSelect}
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        className="hidden"
        disabled={aiLoading}
      />
    </div>
  )
}

export default QuestionEditor

