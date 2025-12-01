'use client'

import React from 'react'
import { Icons } from './Icons'
import Button from './Button'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'primary'
  isLoading?: boolean
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Отмена',
  variant = 'primary',
  isLoading = false
}) => {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose()
    }
  }

  const variantStyles = {
    danger: 'bg-[var(--accent-danger)] hover:bg-red-600 text-white',
    warning: 'bg-[var(--accent-warning)] hover:bg-yellow-600 text-white',
    primary: 'bg-[var(--accent-primary)] hover:bg-blue-600 text-white'
  }

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99998] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-[var(--bg-card)] rounded-2xl max-w-md w-full p-6 border border-[var(--border-primary)] shadow-2xl">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          {title}
        </h3>
        <p className="text-[var(--text-tertiary)] mb-6">
          {message}
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-[var(--text-tertiary)] font-semibold border border-[var(--border-primary)] rounded-xl hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed h-10 flex items-center justify-center"
          >
            <span className="whitespace-nowrap">{cancelText}</span>
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`relative px-4 py-2 font-semibold rounded-xl transition-all duration-200 min-w-[120px] h-10 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]}`}
          >
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Icons.Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span>Загрузка...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <span>{confirmText}</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog


