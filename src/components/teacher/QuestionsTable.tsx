'use client'

import React, { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import 'katex/dist/katex.min.css'
import { Icons } from '@/components/ui/Icons'
import { useTranslation } from '@/hooks/useTranslation'

interface Question {
  id: string
  question: string
  type_question: 'math1' | 'math2' | 'analogy' | 'rac' | 'grammar' | 'standard'
  type_from: 'from_lesson' | 'from_teacher' | 'from_trial' | 'from_student' | 'from_mentor'
  language: 'ru' | 'kg'
  created_at: string
  hasComplaint?: boolean
  averageCorrect?: number
  photo_url?: string
}

interface QuestionsTableProps {
  questions: Question[]
  onQuestionClick?: (question: Question) => void
  onQuestionEdit?: (question: Question) => void
  isLoading?: boolean
}

const QuestionsTable: React.FC<QuestionsTableProps> = ({
  questions,
  onQuestionClick,
  onQuestionEdit,
  isLoading = false
}) => {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const getText = (key: string, fallback: string) => {
    if (!mounted || !ready) return fallback
    return t(key)
  }

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getTypeQuestionLabel = (type: Question['type_question']) => {
    const labels: Record<Question['type_question'], string> = {
      math1: 'М1',
      math2: 'М2',
      analogy: 'А',
      rac: 'Р',
      grammar: 'Г',
      standard: 'С',
    }
    return labels[type] || type
  }

  const getTypeFromLabel = (source: Question['type_from']) => {
    if (!mounted || !ready) {
      const fallbackLabels: Record<Question['type_from'], string> = {
        from_lesson: 'Урок',
        from_teacher: 'Учитель',
        from_trial: 'Пробный тест',
        from_student: 'Студент',
        from_mentor: 'Ментор',
      }
      return fallbackLabels[source] || source
    }
    const labels: Record<Question['type_from'], string> = {
      from_lesson: t('questions.sources.from_lesson'),
      from_teacher: t('questions.sources.from_teacher'),
      from_trial: t('questions.sources.from_trial'),
      from_student: t('questions.sources.from_student'),
      from_mentor: t('questions.sources.from_mentor'),
    }
    return labels[source] || source
  }

  const getLanguageLabel = (language: Question['language']) => {
    return language === 'ru' ? 'RU' : 'KG'
  }

  if (isLoading) {
    return (
      <div className="bg-[#151515] rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="h-6 bg-gray-700 rounded w-1/4 animate-pulse"></div>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#151515] rounded-2xl overflow-hidden">
      {/* Заголовок таблицы */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white">
          {getText('questions.foundQuestions', 'Найдено вопросов')}: {questions.length}
        </h2>
      </div>

      {/* Таблица */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#242424]">
            <tr>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">
                Вопрос
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">
                Тип вопроса
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">
                Источник
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">
                Язык
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">
                {getText('questions.createdAt', 'Дата создания')}
              </th>
              <th className="text-left py-3 px-6 text-sm font-medium text-gray-400">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {questions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-400">
                  {getText('questions.noQuestions', 'Вопросы не найдены')}
                </td>
              </tr>
            ) : (
              questions.map((question) => (
                <tr
                  key={question.id}
                  className="border-b border-gray-800/50 hover:bg-[#242424] cursor-pointer transition-colors"
                  onClick={(e) => {
                    // Открываем детали только если клик не по кнопке действия
                    if ((e.target as HTMLElement).closest('button') === null) {
                      onQuestionClick?.(question)
                    }
                  }}
                >
                  {/* Ячейка "Вопрос" */}
                  <td className="py-4 px-6 max-w-md">
                    <div className="flex flex-col gap-1 w-full">
                      <div className="text-white font-medium w-full overflow-hidden break-words">
                        <div className="overflow-hidden w-full max-w-full">
                          <div className="prose prose-invert prose-sm max-w-none dark:prose-invert">
                            <ReactMarkdown
                              remarkPlugins={[remarkMath, remarkGfm]}
                              rehypePlugins={[rehypeKatex, rehypeRaw]}
                            >
                              {truncateText(question.question)}
                            </ReactMarkdown>
                          </div>
                        </div>
                      </div>
                      {question.photo_url && (
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <Icons.Image className="h-3 w-3" />
                          <span>{getText('questions.withImage', 'С изображением')}</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Ячейка "Тип вопроса" */}
                  <td className="py-4 px-6">
                    <span className="inline-block px-8 py-1.5 bg-[#242424] hover:bg-[#2a2a2a] text-white rounded-full text-xs font-medium transition-colors cursor-default min-w-[120px] text-center whitespace-nowrap">
                      {getTypeQuestionLabel(question.type_question)}
                    </span>
                  </td>

                  {/* Ячейка "Источник" */}
                  <td className="py-4 px-6">
                    <span className="inline-block px-8 py-1.5 bg-[#242424] hover:bg-[#2a2a2a] text-white rounded-full text-xs font-medium transition-colors cursor-default min-w-[120px] text-center whitespace-nowrap">
                      {getTypeFromLabel(question.type_from)}
                    </span>
                  </td>

                  {/* Ячейка "Язык" */}
                  <td className="py-4 px-6">
                    <span className="px-3 py-1.5 bg-[#242424] text-white rounded-xl text-xs font-medium border border-gray-700/50">
                      {getLanguageLabel(question.language)}
                    </span>
                  </td>

                  {/* Ячейка "Дата создания" */}
                  <td className="py-4 px-6 text-gray-400">
                    {formatDate(question.created_at)}
                  </td>

                  {/* Ячейка "Действия" */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onQuestionClick?.(question)
                        }}
                        className="relative p-2 hover:bg-[#242424] rounded-lg transition-colors"
                        title={getText('questions.tooltips.details', 'Просмотр')}
                      >
                        <Icons.Eye className="h-4 w-4 text-white" />
                      </button>
                      {onQuestionEdit && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onQuestionEdit(question)
                          }}
                          className="relative p-2 hover:bg-[#242424] rounded-lg transition-colors"
                          title={getText('questions.tooltips.edit', 'Редактировать')}
                        >
                          <Icons.Edit className="h-4 w-4 text-white" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default QuestionsTable

