'use client'

import React, { useEffect } from 'react'
import { Icons } from './Icons'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  message: string
  variant?: ToastVariant
  duration?: number
}

const Toast: React.FC<ToastProps> = ({
  isOpen,
  onClose,
  title,
  message,
  variant = 'success',
  duration = 3000
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, duration])

  if (!isOpen) return null

  const variantStyles = {
    success: {
      title: title || 'Успешно!',
      icon: Icons.CheckCircle2
    },
    error: {
      title: title || 'Ошибка!',
      icon: Icons.AlertCircle
    },
    warning: {
      title: title || 'Внимание!',
      icon: Icons.AlertTriangle
    },
    info: {
      title: title || 'Информация',
      icon: Icons.Info
    }
  }

  const style = variantStyles[variant]
  const Icon = style.icon

  return (
    <div className="fixed top-24 sm:top-4 right-4 z-[99999] max-w-md">
      <div
        className={`bg-[#151515] border border-gray-800 rounded-2xl p-4 shadow-lg backdrop-blur-sm animate-slide-in-right`}
      >
        <div className="flex items-start gap-3">
          {/* Иконка */}
          <div className="flex-shrink-0 p-2 bg-[#242424] rounded-lg">
            <Icon className="h-5 w-5 text-white" />
          </div>
          
          {/* Контент */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white mb-1">
              {style.title}
            </h3>
            <p className="text-sm text-gray-400">
              {message}
            </p>
          </div>
          
          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
            aria-label="Закрыть"
          >
            <Icons.X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toast

