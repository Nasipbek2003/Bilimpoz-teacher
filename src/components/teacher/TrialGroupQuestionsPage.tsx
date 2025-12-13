'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/Icons'
import Button from '@/components/ui/Button'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/contexts/AuthContext'
import RACTextsManager from './RACTextsManager'
import RACTestsManager from './RACTestsManager'

interface TrialQuestionGroup {
  id: string
  trial_test_id: string
  subject: 'math1' | 'math2' | 'analogy' | 'rac' | 'grammar' | 'standard'
  title: string
  description: string
  total_questions: number
  text_rac?: string
  time_limit: number
  created_at: string
  updated_at: string
}

interface TrialTest {
  id: string
  name: string
  description: string
  language: 'ru' | 'kg'
  status: 'inactive' | 'in_development' | 'published'
}

interface TrialGroupQuestionsPageProps {
  testId: string
  groupId: string
}

const TrialGroupQuestionsPage: React.FC<TrialGroupQuestionsPageProps> = ({
  testId,
  groupId
}) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const router = useRouter()
  
  const [test, setTest] = useState<TrialTest | null>(null)
  const [group, setGroup] = useState<TrialQuestionGroup | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Состояния для RAC групп
  const [activeRACTab, setActiveRACTab] = useState<'texts' | 'tests'>('texts')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Загрузка данных теста и группы
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        
        // Загружаем данные теста
        const testResponse = await fetch(`/api/trial-tests/${testId}`)
        if (!testResponse.ok) {
          throw new Error('Failed to load test')
        }
        const testData = await testResponse.json()
        setTest(testData)
        
        // Загружаем данные группы
        const groupResponse = await fetch(`/api/trial-tests/${testId}/groups/${groupId}`)
        if (!groupResponse.ok) {
          throw new Error('Failed to load group')
        }
        const groupData = await groupResponse.json()
        setGroup(groupData)
        
      } catch (err) {
        console.error('Error loading data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [testId, groupId])

  const handleSave = async () => {
    if (!group) return

    try {
      // Здесь будет логика сохранения в зависимости от типа группы
      if (group.subject === 'rac') {
        // Сохраняем тексты и вопросы RAC
        const racTexts = localStorage.getItem(`racTexts_${groupId}`)
        const racBlocks = ['text-1', 'text-2', 'text-3'].map(textId => 
          localStorage.getItem(`racTestBlocks_${groupId}_${textId}`)
        ).filter(Boolean)

        const response = await fetch(`/api/trial-tests/${testId}/groups/${groupId}/questions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            racTexts: racTexts ? JSON.parse(racTexts) : [],
            racBlocks: racBlocks.map(block => JSON.parse(block!)).flat()
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to save RAC data')
        }
      }

      setHasUnsavedChanges(false)
      // Показать уведомление об успешном сохранении
    } catch (err) {
      console.error('Error saving:', err)
      // Показать уведомление об ошибке
    }
  }

  const getBreadcrumbs = () => {
    if (!test || !group) return []
    
    return [
      { 
        label: t('tests.trialTests', 'Пробные тесты'), 
        href: '/trial-tests' 
      },
      { 
        label: test.name, 
        href: `/trial-tests/${testId}` 
      },
      { 
        label: group.title, 
        href: null 
      }
    ]
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Загрузка...</p>
        </div>
      </div>
    )
  }

  if (error || !test || !group) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Icons.AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Ошибка загрузки</h3>
          <p className="text-gray-400 mb-4">{error || 'Не удалось загрузить данные'}</p>
          <Button onClick={() => router.back()}>
            Назад
          </Button>
        </div>
      </div>
    )
  }

  // Проверяем, является ли группа RAC
  const isRACGroup = group.subject === 'rac'

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-400">
        {getBreadcrumbs().map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <Icons.ChevronRight className="h-4 w-4" />}
            {crumb.href ? (
              <button
                onClick={() => router.push(crumb.href!)}
                className="hover:text-white transition-colors"
              >
                {crumb.label}
              </button>
            ) : (
              <span className="text-white">{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Заголовок */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {group.title}
          </h1>
          <p className="text-gray-400 mt-1">
            {group.description}
          </p>
        </div>
        
        {isRACGroup && (
          <div className="flex items-center gap-4">
            {hasUnsavedChanges && (
              <span className="text-yellow-400 text-sm">
                Есть несохраненные изменения
              </span>
            )}
            <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
              <Icons.Save className="h-4 w-4 mr-2" />
              Сохранить
            </Button>
          </div>
        )}
      </div>

      {/* Контент для RAC групп */}
      {isRACGroup ? (
        <div className="space-y-6">
          {/* Переключатель табов для RAC */}
          <div className="flex items-center gap-1 bg-[#242424] p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveRACTab('texts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeRACTab === 'texts'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icons.BookOpen className="h-4 w-4" />
              {test.language === 'kg' ? 'Тексттер' : 'Тексты'}
            </button>
            <button
              onClick={() => setActiveRACTab('tests')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeRACTab === 'tests'
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icons.FileText className="h-4 w-4" />
              {test.language === 'kg' ? 'Тесттер' : 'Тесты'}
            </button>
          </div>

          {/* Контент табов */}
          {activeRACTab === 'texts' ? (
            <RACTextsManager
              groupId={groupId}
              language={test.language}
              onTextsChange={() => setHasUnsavedChanges(true)}
            />
          ) : (
            <RACTestsManager
              groupId={groupId}
              group={{
                id: group.id,
                total_questions: group.total_questions,
                time_limit: group.time_limit
              }}
              language={test.language}
              onBlocksChange={() => setHasUnsavedChanges(true)}
            />
          )}
        </div>
      ) : (
        /* Контент для других типов групп */
        <div className="bg-[#1a1a1a] rounded-xl p-8 text-center">
          <Icons.FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Редактор для типа "{group.subject}"
          </h3>
          <p className="text-gray-400">
            Редактор для этого типа вопросов пока не реализован
          </p>
        </div>
      )}

      {/* Информация о группе */}
      <div className="bg-[#1a1a1a] rounded-xl p-6">
        <h3 className="text-lg font-medium text-white mb-4">Информация о группе</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Тип:</span>
            <span className="text-white ml-2 font-medium">{group.subject.toUpperCase()}</span>
          </div>
          <div>
            <span className="text-gray-400">Вопросов:</span>
            <span className="text-white ml-2 font-medium">{group.total_questions}</span>
          </div>
          <div>
            <span className="text-gray-400">Время (мин):</span>
            <span className="text-white ml-2 font-medium">{group.time_limit}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrialGroupQuestionsPage






















