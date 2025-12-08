'use client'

import React, { useState, useEffect } from 'react'
import { Icons } from '@/components/ui/Icons'
import { useTranslation } from '@/hooks/useTranslation'
import ReadingTextEditor from './ReadingTextEditor'

interface RACText {
  id: 'text-1' | 'text-2' | 'text-3'
  content: string
  question_ids: string[]
}

interface RACTextsManagerProps {
  groupId: string
  language: 'ru' | 'kg'
  onTextsChange?: (texts: RACText[]) => void
}

const RACTextsManager: React.FC<RACTextsManagerProps> = ({
  groupId,
  language,
  onTextsChange
}) => {
  const { t } = useTranslation()
  const [texts, setTexts] = useState<RACText[]>([
    { id: 'text-1', content: '', question_ids: [] },
    { id: 'text-2', content: '', question_ids: [] },
    { id: 'text-3', content: '', question_ids: [] }
  ])
  const [activeTextId, setActiveTextId] = useState<'text-1' | 'text-2' | 'text-3'>('text-1')

  // Загрузка текстов из localStorage при монтировании
  useEffect(() => {
    const savedTexts = localStorage.getItem(`racTexts_${groupId}`)
    if (savedTexts) {
      try {
        const parsedTexts = JSON.parse(savedTexts)
        setTexts(parsedTexts)
      } catch (error) {
        console.error('Error parsing saved RAC texts:', error)
      }
    }
  }, [groupId])

  // Сохранение текстов в localStorage при изменении
  useEffect(() => {
    localStorage.setItem(`racTexts_${groupId}`, JSON.stringify(texts))
    onTextsChange?.(texts)
    
    // Отправляем событие для синхронизации между окнами
    window.dispatchEvent(new CustomEvent('racTextsUpdated', { 
      detail: { groupId, texts } 
    }))
  }, [texts, groupId, onTextsChange])

  const handleTextChange = (textId: 'text-1' | 'text-2' | 'text-3', content: string) => {
    setTexts(prevTexts => 
      prevTexts.map(text => 
        text.id === textId ? { ...text, content } : text
      )
    )
  }

  const getTitle = () => {
    return language === 'kg' 
      ? 'Окуу тексттери'
      : 'Тексты для чтения'
  }

  const getDescription = () => {
    return language === 'kg'
      ? 'Тестти окуу жана түшүнүү үчүн үч текст киргизиңиз. Бул тексттер S3-ке сакталат жана суроолор үчүн колдонулат.'
      : 'Введите три текста для чтения и понимания. Эти тексты будут сохранены в S3 и использованы для создания вопросов.'
  }

  return (
    <div className="bg-[#151515] rounded-2xl p-8 space-y-6">
      {/* Заголовок секции */}
      <div className="flex items-start gap-3">
        <div className="p-2 bg-yellow-500/10 rounded-lg">
          <Icons.FileText className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">
            {getTitle()}
          </h3>
          <p className="text-sm text-gray-400">
            {getDescription()}
          </p>
        </div>
      </div>

      {/* Тексты */}
      <div className="space-y-6">
        {texts.map((text, index) => (
          <div key={text.id} className="space-y-3">
            {/* Заголовок текста */}
            <div className="flex items-center gap-2">
              <div className={`
                w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold
                transition-colors duration-200
                ${activeTextId === text.id 
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-700 text-gray-300'
                }
              `}>
                {index + 1}
              </div>
              <span className="text-sm font-medium text-gray-300">
                {language === 'kg' ? `Текст ${index + 1}` : `Текст ${index + 1}`}
              </span>
              <span className="ml-auto text-xs text-gray-500">
                {text.content.length} {language === 'kg' ? 'символ' : 'символов'}
              </span>
            </div>

            {/* Редактор текста */}
            <ReadingTextEditor
              value={text.content}
              onChange={(content) => handleTextChange(text.id, content)}
              language={language}
              isActive={activeTextId === text.id}
              onFocus={() => setActiveTextId(text.id)}
            />
          </div>
        ))}
      </div>

      {/* Статистика */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>
            {language === 'kg' ? 'Жалпы символдор:' : 'Всего символов:'} {' '}
            <span className="text-yellow-400 font-medium">
              {texts.reduce((total, text) => total + text.content.length, 0)}
            </span>
          </span>
          <span>
            {language === 'kg' ? 'Толтурулган тексттер:' : 'Заполнено текстов:'} {' '}
            <span className="text-yellow-400 font-medium">
              {texts.filter(text => text.content.trim().length > 0).length} / 3
            </span>
          </span>
        </div>
      </div>
    </div>
  )
}

export default RACTextsManager








