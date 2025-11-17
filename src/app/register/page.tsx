'use client'

import React from 'react'
import RegisterForm from '@/components/auth/RegisterForm'
import ThemeToggle from '@/components/ui/ThemeToggle'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'

export default function RegisterPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-primary)]"
    >
      {/* Переключатели темы и языка */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-[var(--text-primary)] rounded-xl flex items-center justify-center">
              <span className="text-[var(--bg-primary)] font-bold text-2xl">B</span>
            </div>
            <h1 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              Bilimpoz Teachers
            </h1>
          </div>
          <p className="text-[var(--text-tertiary)]">
            Платформа для преподавателей
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
