'use client'

import React, { useState, useEffect } from 'react'
import LoginForm from '@/components/auth/LoginForm'
import ThemeToggle from '@/components/ui/ThemeToggle'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import { useTranslation } from '@/hooks/useTranslation'
import { useIOSSafariAutoHide } from '@/hooks/useIOSSafariAutoHide'

export default function LoginPage() {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)
  
  // Автоматически скрываем адресную строку на iOS Safari
  useIOSSafariAutoHide()

  useEffect(() => {
    setMounted(true)
  }, [])

  const getText = (key: string, fallback: string) => {
    if (!mounted || !ready) return fallback
    return t(key) || fallback
  }
  return (
    <div 
      className="min-h-screen min-h-[-webkit-fill-available] flex items-center justify-center px-4 py-8 sm:p-4 bg-[var(--bg-primary)] overflow-auto"
    >
      {/* Переключатели темы и языка */}
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50 flex items-center gap-2 sm:gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--text-primary)] rounded-xl flex items-center justify-center">
              <span className="text-[var(--bg-primary)] font-bold text-xl sm:text-2xl">B</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              Bilimpoz Teachers
            </h1>
          </div>
          <p className="text-sm sm:text-base text-[var(--text-tertiary)]">
            {getText('app.platformForTeachers', 'Платформа для преподавателей')}
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}







