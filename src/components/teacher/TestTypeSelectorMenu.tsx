'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Icons } from '@/components/ui/Icons'
import Tooltip from '@/components/ui/Tooltip'
import { type QuestionType } from '@/lib/test-storage'

interface TestTypeSelectorMenuProps {
  onAddQuestion: (type: QuestionType) => void
  disabled?: boolean
  totalQuestions?: number
  currentQuestionsCount: number
}

const TestTypeSelectorMenu: React.FC<TestTypeSelectorMenuProps> = ({
  onAddQuestion,
  disabled = false,
  totalQuestions,
  currentQuestionsCount
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showButton, setShowButton] = useState(true)
  const menuRef = useRef<HTMLDivElement>(null)

  // Управление показом кнопки
  useEffect(() => {
    if (!isMenuOpen) {
      const timer = setTimeout(() => {
        setShowButton(true)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isMenuOpen])

  // Обработка клика вне меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleAddQuestion = (type: QuestionType) => {
    // Проверяем лимит вопросов
    if (totalQuestions !== undefined && currentQuestionsCount >= totalQuestions) {
      setIsMenuOpen(false)
      return
    }

    onAddQuestion(type)
    setIsMenuOpen(false)
  }

  const maxTestsReached = totalQuestions !== undefined && currentQuestionsCount >= totalQuestions

  return (
    <div className="fixed bottom-4 right-16 z-50">
      <div 
        ref={menuRef}
        className="w-16 bg-[var(--bg-tertiary)] border border-gray-700 rounded-2xl shadow-2xl transition-colors"
      >
        {/* Кнопка открытия меню */}
        <Tooltip text={disabled ? 'Заполните поля теста' : 'Добавить вопрос'}>
          <button
            onClick={() => {
              if (disabled) return
              if (maxTestsReached && totalQuestions !== undefined) {
                setIsMenuOpen(false)
                return
              }
              setShowButton(false)
              setIsMenuOpen(true)
            }}
            disabled={disabled}
            className={`
              flex items-center justify-center overflow-hidden
              transition-all duration-300 ease-in-out
              w-full transition-colors
              ${!isMenuOpen ? 'p-4 rounded-2xl' : 'p-0 h-0'}
              ${!isMenuOpen && showButton ? 'opacity-100' : 'opacity-0 pointer-events-none'}
              ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-[var(--bg-hover)]'}
            `}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Icons.Plus className="h-5 w-5 text-[var(--text-secondary)]" />
            </div>
          </button>
        </Tooltip>

        {/* Меню с типами тестов */}
        <div 
          className={`
            transition-all duration-300 ease-in-out overflow-hidden
            ${isMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}
          `}
        >
          <div className="p-3 space-y-2">
            {/* Математика 1 */}
            <Tooltip text="Математика 1">
              <button
                onClick={() => handleAddQuestion('math1')}
                disabled={disabled || maxTestsReached}
                className={`w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center transition-colors group mx-auto ${
                  disabled || maxTestsReached
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-blue-500/20'
                }`}
              >
                <span className="text-blue-400 font-bold text-sm">М1</span>
              </button>
            </Tooltip>

            {/* Математика 2 */}
            <Tooltip text="Математика 2">
              <button
                onClick={() => handleAddQuestion('math2')}
                disabled={disabled || maxTestsReached}
                className={`w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center transition-colors group mx-auto ${
                  disabled || maxTestsReached
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-purple-500/20'
                }`}
              >
                <span className="text-purple-400 font-bold text-sm">М2</span>
              </button>
            </Tooltip>

            {/* Аналогии */}
            <Tooltip text="Аналогии">
              <button
                onClick={() => handleAddQuestion('analogy')}
                disabled={disabled || maxTestsReached}
                className={`w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center transition-colors group mx-auto ${
                  disabled || maxTestsReached
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-green-500/20'
                }`}
              >
                <span className="text-green-400 font-bold text-sm">А</span>
              </button>
            </Tooltip>

            {/* Чтение и понимание */}
            <Tooltip text="Чтение и понимание">
              <button
                onClick={() => handleAddQuestion('rac')}
                disabled={disabled || maxTestsReached}
                className={`w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center transition-colors group mx-auto ${
                  disabled || maxTestsReached
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-yellow-500/20'
                }`}
              >
                <span className="text-yellow-400 font-bold text-sm">Ч</span>
              </button>
            </Tooltip>

            {/* Грамматика */}
            <Tooltip text="Грамматика">
              <button
                onClick={() => handleAddQuestion('grammar')}
                disabled={disabled || maxTestsReached}
                className={`w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center transition-colors group mx-auto ${
                  disabled || maxTestsReached
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-red-500/20'
                }`}
              >
                <span className="text-red-400 font-bold text-sm">Г</span>
              </button>
            </Tooltip>

            {/* Стандарт */}
            <Tooltip text="Стандарт">
              <button
                onClick={() => handleAddQuestion('standard')}
                disabled={disabled || maxTestsReached}
                className={`w-10 h-10 rounded-lg bg-gray-500/10 flex items-center justify-center transition-colors group mx-auto ${
                  disabled || maxTestsReached
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-gray-500/20'
                }`}
              >
                <span className="text-[var(--text-tertiary)] font-bold text-sm">С</span>
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestTypeSelectorMenu

