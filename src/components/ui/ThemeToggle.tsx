'use client'

import React, { useState, useEffect } from 'react'
import { Icons } from './Icons'
import { useTheme } from '@/components/providers/ThemeProvider'

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, isInitialized } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Показываем placeholder до полной загрузки (избегаем гидратации)
  if (!mounted || !isInitialized) {
    return (
      <button 
        className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-opacity-50"
        disabled
        aria-label="Загрузка темы"
      >
        <Icons.Sun className="h-5 w-5 text-[var(--text-secondary)] opacity-50" />
      </button>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors hover:bg-[var(--bg-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-opacity-50"
      title={theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
      aria-label={theme === 'light' ? 'Переключить на темную тему' : 'Переключить на светлую тему'}
    >
      {theme === 'light' ? (
        <Icons.Moon className="h-5 w-5 text-[var(--text-secondary)]" />
      ) : (
        <Icons.Sun className="h-5 w-5 text-[var(--text-secondary)]" />
      )}
    </button>
  )
}

export default ThemeToggle
