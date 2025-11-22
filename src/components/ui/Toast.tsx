'use client'

import React, { useEffect } from 'react'
import { Icons } from './Icons'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  isOpen: boolean
  onClose: () => void
  message: string
  variant?: ToastVariant
  duration?: number
}

const Toast: React.FC<ToastProps> = ({
  isOpen,
  onClose,
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
  }, [isOpen, duration, onClose])

  if (!isOpen) return null

  const variantStyles = {
    success: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      icon: Icons.CheckCircle2
    },
    error: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      icon: Icons.XCircle
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-400',
      icon: Icons.AlertTriangle
    },
    info: {
      bg: 'bg-[var(--accent-primary)]/10',
      border: 'border-[var(--accent-primary)]/20',
      text: 'text-[var(--accent-primary)]',
      icon: Icons.Info
    }
  }

  const style = variantStyles[variant]
  const Icon = style.icon

  return (
    <div className="fixed top-4 right-4 z-[100]">
      <div
        className={`${style.bg} ${style.border} border rounded-xl px-4 py-3 shadow-lg backdrop-blur-sm bg-[var(--bg-card)] flex items-center gap-3 min-w-[300px] max-w-[500px] transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <Icon className={`h-5 w-5 ${style.text} flex-shrink-0`} />
        <p className={`${style.text} text-sm font-medium flex-1`}>
          {message}
        </p>
        <button
          onClick={onClose}
          className={`${style.text} hover:opacity-70 transition-opacity flex-shrink-0`}
          aria-label="Закрыть"
        >
          <Icons.X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default Toast

