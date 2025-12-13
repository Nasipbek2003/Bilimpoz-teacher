'use client'

import React, { useState, useEffect } from 'react'
import { Icons } from '@/components/ui/Icons'
import { useTranslation } from '@/hooks/useTranslation'
import TestRACBlock from './TestRACBlock'
import Button from '@/components/ui/Button'

interface RACText {
  id: 'text-1' | 'text-2' | 'text-3'
  content: string
  question_ids: string[]
}

interface TestBlock {
  id: string
  textId: 'text-1' | 'text-2' | 'text-3'
  question: string
  answers: Array<{
    text: string
    isCorrect: boolean
  }>
  points: number
  timeLimit: number
  imageUrl?: string
}

interface Group {
  id: string
  total_questions: number
  time_limit: number
}

interface RACTestsManagerProps {
  groupId: string
  group: Group
  language: 'ru' | 'kg'
  onBlocksChange?: (blocks: TestBlock[]) => void
}

type TextTab = 'text-1' | 'text-2' | 'text-3'

const RACTestsManager: React.FC<RACTestsManagerProps> = ({
  groupId,
  group,
  language,
  onBlocksChange
}) => {
  const { t } = useTranslation()
  const [activeTextTab, setActiveTextTab] = useState<TextTab>('text-1')
  const [testBlocks, setTestBlocks] = useState<Record<TextTab, TestBlock[]>>({
    'text-1': [],
    'text-2': [],
    'text-3': []
  })
  const [racTexts, setRacTexts] = useState<RACText[]>([])

  // Загрузка данных при монтировании
  useEffect(() => {
    // Загружаем тексты RAC
    const savedTexts = localStorage.getItem(`racTexts_${groupId}`)
    if (savedTexts) {
      try {
        setRacTexts(JSON.parse(savedTexts))
      } catch (error) {
        console.error('Error parsing RAC texts:', error)
      }
    }

    // Загружаем блоки тестов для каждого текста
    const loadedBlocks: Record<TextTab, TestBlock[]> = {
      'text-1': [],
      'text-2': [],
      'text-3': []
    }

    ;(['text-1', 'text-2', 'text-3'] as TextTab[]).forEach(textId => {
      const savedBlocks = localStorage.getItem(`racTestBlocks_${groupId}_${textId}`)
      if (savedBlocks) {
        try {
          loadedBlocks[textId] = JSON.parse(savedBlocks)
        } catch (error) {
          console.error(`Error parsing test blocks for ${textId}:`, error)
        }
      }
    })

    setTestBlocks(loadedBlocks)
  }, [groupId])

  // Сохранение блоков при изменении
  useEffect(() => {
    Object.entries(testBlocks).forEach(([textId, blocks]) => {
      localStorage.setItem(`racTestBlocks_${groupId}_${textId}`, JSON.stringify(blocks))
    })

    // Отправляем событие для синхронизации
    const allBlocks = Object.values(testBlocks).flat()
    onBlocksChange?.(allBlocks)
    
    window.dispatchEvent(new CustomEvent('racBlocksUpdated', { 
      detail: { groupId, testBlocks } 
    }))
  }, [testBlocks, groupId, onBlocksChange])

  // Слушаем обновления текстов RAC
  useEffect(() => {
    const handleRacTextsUpdate = (event: CustomEvent) => {
      if (event.detail.groupId === groupId) {
        setRacTexts(event.detail.texts)
      }
    }

    window.addEventListener('racTextsUpdated', handleRacTextsUpdate as EventListener)
    return () => {
      window.removeEventListener('racTextsUpdated', handleRacTextsUpdate as EventListener)
    }
  }, [groupId])

  const generateBlockId = () => {
    return `rac_block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const addNewBlock = () => {
    const newBlock: TestBlock = {
      id: generateBlockId(),
      textId: activeTextTab,
      question: '',
      answers: [
        { text: '', isCorrect: true },
        { text: '', isCorrect: false }
      ],
      points: 1,
      timeLimit: 60
    }

    setTestBlocks(prev => ({
      ...prev,
      [activeTextTab]: [...prev[activeTextTab], newBlock]
    }))
  }

  const updateBlock = (blockId: string, updates: Partial<TestBlock>) => {
    setTestBlocks(prev => ({
      ...prev,
      [activeTextTab]: prev[activeTextTab].map(block =>
        block.id === blockId ? { ...block, ...updates } : block
      )
    }))
  }

  const removeBlock = (blockId: string) => {
    setTestBlocks(prev => ({
      ...prev,
      [activeTextTab]: prev[activeTextTab].filter(block => block.id !== blockId)
    }))
  }

  // Подсчет общих статистик
  const totalBlocksCount = Object.values(testBlocks).flat().length
  const totalTime = Object.values(testBlocks).flat().reduce((sum, block) => sum + block.timeLimit, 0)
  const groupTime = group.time_limit * 60 // конвертируем минуты в секунды

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const getTextContent = (textId: TextTab) => {
    const text = racTexts.find(t => t.id === textId)
    return text?.content || ''
  }

  const isTextEmpty = (textId: TextTab) => {
    return getTextContent(textId).trim().length === 0
  }

  return (
    <div className="space-y-6">
      {/* Переключатель текстов */}
      <div className="flex space-x-1 bg-[#1a1a1a] p-1 rounded-lg border border-gray-800">
        {(['text-1', 'text-2', 'text-3'] as TextTab[]).map((textId) => (
          <button
            key={textId}
            onClick={() => setActiveTextTab(textId)}
            className={`flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all ${
              activeTextTab === textId
                ? 'bg-yellow-500 text-black shadow-lg'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Icons.FileText className="h-4 w-4" />
              <span>
                {language === 'kg' ? `Текст ${textId.split('-')[1]}` : `Текст ${textId.split('-')[1]}`}
              </span>
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTextTab === textId
                  ? 'bg-black/20 text-black'
                  : 'bg-gray-700 text-gray-300'
              }`}>
                {testBlocks[textId].length}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Индикатор прогресса */}
      <div className="p-4 bg-[#1a1a1a] rounded-xl border border-gray-700">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Icons.FileText className="h-5 w-5 text-blue-400" />
            <span className="text-sm text-gray-300">
              {language === 'kg' ? 'Суроолор:' : 'Вопросов:'} {' '}
              <span className={totalBlocksCount === group.total_questions 
                ? 'text-green-400 font-semibold'
                : 'text-yellow-400 font-semibold'
              }>
                {totalBlocksCount}
              </span> / {group.total_questions}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icons.Clock className="h-5 w-5 text-purple-400" />
            <span className="text-sm text-gray-300">
              {language === 'kg' ? 'Убакыт:' : 'Время:'} {' '}
              <span className="text-purple-400 font-semibold">
                {formatTime(totalTime)} / {formatTime(groupTime)}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Предупреждение если текст пустой */}
      {isTextEmpty(activeTextTab) && (
        <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
          <div className="flex items-center gap-3">
            <Icons.AlertTriangle className="h-5 w-5 text-orange-400" />
            <div>
              <p className="text-orange-400 font-medium">
                {language === 'kg' 
                  ? 'Текст бош' 
                  : 'Текст пустой'
                }
              </p>
              <p className="text-orange-300/80 text-sm">
                {language === 'kg'
                  ? 'Суроолорду кошуудан мурун тексттерди толтуруңуз'
                  : 'Заполните тексты перед добавлением вопросов'
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Блоки вопросов */}
      <div className="space-y-4">
        {testBlocks[activeTextTab].length === 0 ? (
          <div className="text-center py-16 bg-[#1a1a1a] rounded-xl border border-gray-800">
            <svg className="h-16 w-16 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 text-lg mb-2">
              {language === 'kg' 
                ? 'Бул текст үчүн суроолор жок'
                : 'Нет вопросов для этого текста'
              }
            </p>
            <p className="text-gray-500 text-sm">
              {language === 'kg'
                ? 'Биринчи суроону кошуңуз'
                : 'Добавьте первый вопрос'
              }
            </p>
          </div>
        ) : (
          testBlocks[activeTextTab].map((block, index) => (
            <TestRACBlock
              key={block.id}
              blockId={block.id}
              data={block}
              textContent={getTextContent(activeTextTab)}
              language={language}
              onUpdate={(updates) => updateBlock(block.id, updates)}
              onRemove={() => removeBlock(block.id)}
              disabled={isTextEmpty(activeTextTab)}
            />
          ))
        )}
      </div>

      {/* Кнопка добавления нового вопроса */}
      <div className="flex justify-center">
        <Button
          onClick={addNewBlock}
          disabled={
            isTextEmpty(activeTextTab) || 
            totalBlocksCount >= group.total_questions
          }
          className="flex items-center gap-2"
        >
          <Icons.Plus className="h-4 w-4" />
          {language === 'kg' ? 'Суроо кошуу' : 'Добавить вопрос'}
        </Button>
      </div>
    </div>
  )
}

export default RACTestsManager






















