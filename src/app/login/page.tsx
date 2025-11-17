'use client'

import React from 'react'
import LoginForm from '@/components/auth/LoginForm'
import ThemeToggle from '@/components/ui/ThemeToggle'

export default function LoginPage() {
  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-primary)]"
    >
      {/* Переключатель темы */}
      <div className="fixed top-4 right-4 z-50">
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
        <LoginForm />
      </div>
    </div>
  )
}







