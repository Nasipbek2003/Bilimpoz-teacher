'use client'

import React, { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { useTranslation } from '@/hooks/useTranslation'

// Динамический импорт MDEditor для избежания SSR проблем
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

interface ReadingTextEditorProps {
  value: string
  onChange: (value: string) => void
  language: 'ru' | 'kg'
  isActive?: boolean
  onFocus?: () => void
}

const ReadingTextEditor: React.FC<ReadingTextEditorProps> = ({
  value,
  onChange,
  language,
  isActive = false,
  onFocus
}) => {
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Обработка текста для отображения с нумерацией строк
  const displayLines = useMemo(() => {
    if (!value) return ['']
    
    // Разбиваем текст на строки, сохраняя пустые строки
    const lines = value.split('\n')
    return lines.length > 0 ? lines : ['']
  }, [value])

  // Функция для отображения номера строки
  const renderLineNumber = (lineIndex: number) => {
    const lineNumber = lineIndex + 1
    if (lineNumber % 5 === 0) {
      return (
        <span className="text-gray-500 text-xs font-normal select-none tabular-nums">
          {lineNumber}
        </span>
      )
    }
    return null
  }

  const getInstructionText = () => {
    return language === 'kg' 
      ? 'Текстти жазыңыз. Жаңы абзац үчүн эки жолу Enter басыңыз. Ар бир 5-сапта номер коюлат.'
      : 'Введите текст. Для нового абзаца нажмите Enter дважды. Каждая 5-я строка нумеруется.'
  }

  const getLeftPanelLabel = () => {
    return language === 'kg' ? 'Текстти жазыңыз:' : 'Введите текст:'
  }

  const getRightPanelLabel = () => {
    return language === 'kg' 
      ? 'Алдын ала көрүү (кантип сакталат):'
      : 'Предпросмотр (как будет сохранено):'
  }

  if (!mounted) {
    return (
      <div className={`
        bg-[#1a1a1a] rounded-lg border transition-colors duration-200
        ${isActive ? 'border-white' : 'border-gray-700'}
      `}>
        <div className="px-4 py-3 border-b border-gray-700/50">
          <p className="text-xs text-gray-500">
            {getInstructionText()}
          </p>
        </div>
        <div className="flex" style={{ minHeight: '350px' }}>
          <div className="flex-1 p-4 border-r border-gray-700/50">
            <div className="text-xs text-gray-500 mb-2">
              {getLeftPanelLabel()}
            </div>
            <div className="bg-[#0d0d0d] rounded-lg border border-gray-700/50 h-[300px] flex items-center justify-center">
              <span className="text-gray-500">Загрузка редактора...</span>
            </div>
          </div>
          <div className="flex-1 p-4">
            <div className="text-xs text-gray-500 mb-2">
              {getRightPanelLabel()}
            </div>
            <div className="bg-[#0d0d0d] rounded-lg p-4 border border-gray-700/50 h-[300px]">
              <div className="text-gray-500 text-sm">Предпросмотр будет здесь...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`
        bg-[#1a1a1a] rounded-lg border transition-colors duration-200
        ${isActive ? 'border-white' : 'border-gray-700'}
      `}
      onClick={onFocus}
    >
      {/* Инструкция */}
      <div className="px-4 py-3 border-b border-gray-700/50">
        <p className="text-xs text-gray-500">
          {getInstructionText()}
        </p>
      </div>

      {/* Двухпанельный интерфейс */}
      <div className="flex" style={{ minHeight: '350px' }}>
        {/* Левая панель - Редактор */}
        <div className="flex-1 p-4 border-r border-gray-700/50">
          <div className="text-xs text-gray-500 mb-2">
            {getLeftPanelLabel()}
          </div>
          <div className="bg-[#0d0d0d] rounded-lg border border-gray-700/50">
            <MDEditor
              value={value}
              onChange={(val) => onChange(val || '')}
              preview="edit"
              hideToolbar={true}
              height={300}
              data-color-mode="dark"
              style={{
                backgroundColor: '#0d0d0d',
              }}
            />
          </div>
        </div>

        {/* Правая панель - Превью с нумерацией */}
        <div className="flex-1 p-4">
          <div className="text-xs text-gray-500 mb-2">
            {getRightPanelLabel()}
          </div>
          <div 
            className="bg-[#0d0d0d] rounded-lg p-4 border border-gray-700/50 overflow-auto" 
            style={{ height: '300px' }}
          >
            <div className="flex">
              {/* Колонка с номерами строк */}
              <div 
                className="flex flex-col items-end pr-3 select-none flex-shrink-0" 
                style={{ width: '40px' }}
              >
                {displayLines.map((_, index) => (
                  <div key={index} className="h-6 flex items-center justify-end">
                    {renderLineNumber(index)}
                  </div>
                ))}
              </div>
              
              {/* Колонка с текстом */}
              <div className="text-gray-200 leading-6 text-sm font-mono flex-1">
                {displayLines.map((line, index) => (
                  <div key={index} className="h-6 whitespace-pre-wrap break-words">
                    {line || '\u00A0'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Футер со статистикой */}
      <div className="px-4 py-2 border-t border-gray-700/50 flex justify-between text-xs text-gray-500">
        <span>
          {displayLines.length} {language === 'kg' ? 'сап' : 'строк'}
        </span>
        <span>
          {value.length} {language === 'kg' ? 'символ' : 'символов'}
        </span>
      </div>
    </div>
  )
}

export default ReadingTextEditor






















