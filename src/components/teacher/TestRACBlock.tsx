'use client'

import React, { useState, useEffect } from 'react'
import { Icons } from '@/components/ui/Icons'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useTranslation } from '@/hooks/useTranslation'
import TestAIExplainButton from './TestAIExplainButton'
import TestEditorField from './TestEditorField'

interface Answer {
  text: string
  isCorrect: boolean
}

interface TestBlockData {
  id: string
  textId: 'text-1' | 'text-2' | 'text-3'
  question: string
  answers: Answer[]
  points: number
  timeLimit: number
  imageUrl?: string
}

interface TestRACBlockProps {
  blockId: string
  data?: TestBlockData
  textContent?: string
  language: 'ru' | 'kg'
  onUpdate?: (updates: Partial<TestBlockData>) => void
  onRemove?: () => void
  disabled?: boolean
}

const TestRACBlock: React.FC<TestRACBlockProps> = ({
  blockId,
  data,
  textContent = '',
  language,
  onUpdate,
  onRemove,
  disabled = false
}) => {
  const { t } = useTranslation()
  const [localData, setLocalData] = useState<TestBlockData>({
    id: blockId,
    textId: 'text-1',
    question: '',
    answers: [
      { text: '', isCorrect: true },
      { text: '', isCorrect: false }
    ],
    points: 1,
    timeLimit: 60,
    ...data
  })

  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (data) {
      setLocalData(prev => ({ ...prev, ...data }))
    }
  }, [data])

  const handleUpdate = (updates: Partial<TestBlockData>) => {
    const newData = { ...localData, ...updates }
    setLocalData(newData)
    onUpdate?.(updates)
  }

  const handleQuestionChange = (question: string) => {
    handleUpdate({ question })
    if (errors.question && question.trim()) {
      setErrors(prev => ({ ...prev, question: '' }))
    }
  }

  const handleAnswerChange = (index: number, text: string) => {
    const newAnswers = [...localData.answers]
    newAnswers[index] = { ...newAnswers[index], text }
    handleUpdate({ answers: newAnswers })
    
    if (errors[`answer_${index}`] && text.trim()) {
      setErrors(prev => ({ ...prev, [`answer_${index}`]: '' }))
    }
  }

  const handleCorrectAnswerChange = (index: number) => {
    const newAnswers = localData.answers.map((answer, i) => ({
      ...answer,
      isCorrect: i === index
    }))
    handleUpdate({ answers: newAnswers })
  }

  const addAnswer = () => {
    if (localData.answers.length < 6) {
      const newAnswers = [...localData.answers, { text: '', isCorrect: false }]
      handleUpdate({ answers: newAnswers })
    }
  }

  const removeAnswer = (index: number) => {
    if (localData.answers.length > 2) {
      const newAnswers = localData.answers.filter((_, i) => i !== index)
      // Если удаляем правильный ответ, делаем первый ответ правильным
      if (localData.answers[index].isCorrect && newAnswers.length > 0) {
        newAnswers[0].isCorrect = true
      }
      handleUpdate({ answers: newAnswers })
    }
  }

  const handlePointsChange = (points: number) => {
    handleUpdate({ points: Math.max(1, Math.min(10, points)) })
  }

  const handleTimeLimitChange = (timeLimit: number) => {
    handleUpdate({ timeLimit: Math.max(10, Math.min(300, timeLimit)) })
  }

  const validateBlock = () => {
    const newErrors: Record<string, string> = {}
    
    if (!localData.question.trim()) {
      newErrors.question = language === 'kg' ? 'Суроо талап кылынат' : 'Вопрос обязателен'
    }
    
    localData.answers.forEach((answer, index) => {
      if (!answer.text.trim()) {
        newErrors[`answer_${index}`] = language === 'kg' ? 'Жооп талап кылынат' : 'Ответ обязателен'
      }
    })
    
    const hasCorrectAnswer = localData.answers.some(answer => answer.isCorrect)
    if (!hasCorrectAnswer) {
      newErrors.correctAnswer = language === 'kg' ? 'Туура жоопту тандаңыз' : 'Выберите правильный ответ'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const getBlockTitle = () => {
    return language === 'kg' ? 'Окуу жана түшүнүү' : 'Чтение и понимание'
  }

  const getBlockSubtitle = () => {
    return language === 'kg' ? 'Суроо блогу' : 'Блок вопроса'
  }

  return (
    <div className="bg-[#1a1a1a] rounded-xl p-6 space-y-6">
      {/* Заголовок блока */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <span className="text-yellow-400 font-bold">Ч</span>
          </div>
          <div>
            <h3 className="text-white font-medium">{getBlockTitle()}</h3>
            <p className="text-gray-400 text-sm">{getBlockSubtitle()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TestAIExplainButton
            blockId={blockId}
            question={localData.question}
            answers={localData.answers.map(answer => ({
              value: answer.text,
              isCorrect: answer.isCorrect
            }))}
            courseLanguage={language}
            isShowingExplanation={false}
            onToggleExplanation={() => {}}
            testType="rac"
            imageUrl={localData.imageUrl}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirmDelete(true)}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-400"
          >
            <Icons.Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Поле вопроса */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
          {language === 'kg' ? 'Суроо' : 'Вопрос'}
          <span className="text-red-400 ml-1">*</span>
        </label>
        <TestEditorField
          value={localData.question}
          onChange={handleQuestionChange}
          placeholder={language === 'kg' ? 'Суроону жазыңыз...' : 'Введите вопрос...'}
          hasError={!!errors.question}
        />
        {errors.question && (
          <p className="text-red-400 text-sm mt-1">{errors.question}</p>
        )}
      </div>

      {/* Варианты ответов */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-300">
            {language === 'kg' ? 'Жооп варианттары' : 'Варианты ответов'}
            <span className="text-red-400 ml-1">*</span>
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={addAnswer}
            disabled={disabled || localData.answers.length >= 6}
            className="text-blue-400 hover:text-blue-300"
          >
            <Icons.Plus className="h-4 w-4 mr-1" />
            {language === 'kg' ? 'Кошуу' : 'Добавить'}
          </Button>
        </div>

        <div className="space-y-3">
          {localData.answers.map((answer, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => handleCorrectAnswerChange(index)}
                  disabled={disabled}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    answer.isCorrect
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  {answer.isCorrect && (
                    <Icons.Check className="h-3 w-3 text-white" />
                  )}
                </button>
                <span className="text-xs text-gray-500 w-4">
                  {String.fromCharCode(65 + index)}
                </span>
              </div>
              
              <div className="flex-1">
                <TestEditorField
                  value={answer.text}
                  onChange={(text) => handleAnswerChange(index, text)}
                  placeholder={language === 'kg' ? `${index + 1}-жооп...` : `Ответ ${index + 1}...`}
                  hasError={!!errors[`answer_${index}`]}
                />
                {errors[`answer_${index}`] && (
                  <p className="text-red-400 text-sm mt-1">{errors[`answer_${index}`]}</p>
                )}
              </div>

              {localData.answers.length > 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeAnswer(index)}
                  disabled={disabled}
                  className="text-red-400 hover:text-red-300 mt-1"
                >
                  <Icons.X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {errors.correctAnswer && (
          <p className="text-red-400 text-sm">{errors.correctAnswer}</p>
        )}
      </div>

      {/* Настройки */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-700/50">
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">
            {language === 'kg' ? 'Упайлар' : 'Баллы'}
          </label>
          <Input
            type="number"
            min={1}
            max={10}
            value={localData.points}
            onChange={(e) => handlePointsChange(parseInt(e.target.value) || 1)}
            disabled={disabled}
            className="w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-300 block mb-2">
            {language === 'kg' ? 'Убакыт (секунда)' : 'Время (секунды)'}
          </label>
          <Input
            type="number"
            min={10}
            max={300}
            value={localData.timeLimit}
            onChange={(e) => handleTimeLimitChange(parseInt(e.target.value) || 60)}
            disabled={disabled}
            className="w-full"
          />
        </div>
      </div>

      {/* Диалог подтверждения удаления */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              {language === 'kg' ? 'Суроону өчүрүү' : 'Удалить вопрос'}
            </h3>
            <p className="text-gray-400 mb-6">
              {language === 'kg' 
                ? 'Бул суроону өчүрүүнү каалайсызбы? Бул аракетти кайтаруу мүмкүн эмес.'
                : 'Вы уверены, что хотите удалить этот вопрос? Это действие нельзя отменить.'
              }
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDelete(false)}
              >
                {language === 'kg' ? 'Жокко чыгаруу' : 'Отмена'}
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  onRemove?.()
                  setShowConfirmDelete(false)
                }}
              >
                {language === 'kg' ? 'Өчүрүү' : 'Удалить'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TestRACBlock



