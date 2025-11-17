'use client'

import React, { useEffect, useState, createContext, useContext, useCallback } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark'
  toggleTheme: () => void
  isInitialized: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Инициализируем тему из localStorage сразу (синхронно)
  const getInitialTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'dark'
    try {
      const savedTheme = localStorage.getItem('bilimpoz-theme') as 'light' | 'dark' | null
      // Тёмная тема по умолчанию, если данных нет
      return savedTheme || 'dark'
    } catch {
      return 'dark'
    }
  }

  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)
  const [isInitialized, setIsInitialized] = useState(false)
  const [dayniteInstance, setDayniteInstance] = useState<any>(null)

  useEffect(() => {
    // Проверяем, что мы на клиенте
    if (typeof window === 'undefined') {
      setIsInitialized(true)
      return
    }

    // Устанавливаем тему сразу из localStorage (уже установлено скриптом, но на всякий случай)
    const initialTheme = getInitialTheme()
    setTheme(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)

    // Инициализируем DayniteJS асинхронно (не блокирует рендеринг)
    const initDaynite = async () => {
      try {
        // Динамически импортируем DayniteJS только на клиенте
        const DayniteJsModule = await import('daynitejs')
        const DayniteJs = DayniteJsModule.default || DayniteJsModule
        
        // Создаем экземпляр DayniteJS с тёмной темой по умолчанию
        const daynite = new DayniteJs({
          defaultTheme: 'dark', // Тёмная тема по умолчанию
          storageKey: 'bilimpoz-theme',
          attribute: 'data-theme',
          transitions: true,
        })
        
        // Устанавливаем тему из localStorage, если она есть
        if (initialTheme !== 'dark') {
          daynite.setTheme(initialTheme)
        }

        setDayniteInstance(daynite)

        // Получаем текущую тему (может отличаться от initialTheme если DayniteJS изменил её)
        const currentTheme = daynite.getTheme() as 'light' | 'dark'
        if (currentTheme !== initialTheme) {
          setTheme(currentTheme)
        }

        // Слушаем изменения темы
        daynite.onThemeChange((newTheme: 'light' | 'dark') => {
          setTheme(newTheme)
        })

        setIsInitialized(true)
      } catch (error) {
        console.error('Failed to initialize DayniteJS:', error)
        // Fallback: используем localStorage напрямую
        setIsInitialized(true)
      }
    }

    // Запускаем инициализацию без блокировки
    initDaynite()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTheme = useCallback(() => {
    if (dayniteInstance) {
      dayniteInstance.toggle()
    } else {
      // Fallback если DayniteJS еще не загружен
      const newTheme = theme === 'light' ? 'dark' : 'light'
      setTheme(newTheme)
      try {
        localStorage.setItem('bilimpoz-theme', newTheme)
        if (typeof window !== 'undefined') {
          document.documentElement.setAttribute('data-theme', newTheme)
        }
      } catch (error) {
        console.error('Failed to save theme:', error)
      }
    }
  }, [dayniteInstance, theme])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isInitialized }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
