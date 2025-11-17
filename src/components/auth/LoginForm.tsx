'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Icons } from '@/components/ui/Icons'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function LoginForm() {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const router = useRouter()
  const { loadUser } = useAuth()

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.login.trim()) {
      newErrors.login = 'Логин обязателен для заполнения'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Пароль обязателен для заполнения'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validate()) return

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      console.log('[LoginForm] Login response:', { ok: response.ok, data })

      if (response.ok && data.success) {
        // Проверка наличия Telegram
        if (data.needsTelegram) {
          // Telegram не подключен - нужно подключить
          setErrors({ general: 'Telegram не подключен. Пожалуйста, подключите Telegram для входа.' })
          return
        }

        // Данные верны, есть Telegram ID - отправляем код верификации
        if (data.data && data.data.telegramId) {
          try {
            console.log('[LoginForm] Sending verification code for:', data.data.login, data.data.telegramId)
            
            // Автоматически отправляем код верификации
            const sendCodeResponse = await fetch('/api/auth/send-code', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                login: data.data.login,
                telegramId: data.data.telegramId,
                language: data.data.language || 'ru'
              }),
            })

            const sendCodeData = await sendCodeResponse.json()
            console.log('[LoginForm] Send code response:', sendCodeData)

            if (sendCodeResponse.ok && sendCodeData.success) {
          // Сохраняем данные для верификации
          localStorage.setItem('pendingVerification', JSON.stringify({
                login: data.data.login,
                telegramId: data.data.telegramId,
                userId: data.data.id,
                user: data.data
          }))
          // Перенаправляем на страницу верификации Telegram
          router.push('/verify-telegram')
        } else {
              // Ошибка отправки кода
              if (sendCodeData.code === 'BOT_BLOCKED' || sendCodeData.isBlocked) {
                setErrors({ general: 'Бот заблокирован. Пожалуйста, разблокируйте бота в Telegram и попробуйте снова.' })
              } else {
                setErrors({ general: sendCodeData.error || sendCodeData.message || 'Ошибка отправки кода верификации' })
              }
            }
          } catch (sendError) {
            console.error('[LoginForm] Send code error:', sendError)
            setErrors({ general: 'Ошибка отправки кода верификации. Попробуйте еще раз.' })
          }
        } else {
          setErrors({ general: 'Ошибка: данные пользователя неполные' })
        }
      } else {
        // Ошибка входа
        const errorMessage = data.error || data.message || 'Ошибка входа'
        console.error('[LoginForm] Login error:', errorMessage)
        setErrors({ general: errorMessage })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: 'Произошла ошибка при входе' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' })
    }
    if (errors.general) {
      setErrors({ ...errors, general: '' })
    }
  }

  return (
    <div className="bg-[var(--bg-card)] rounded-3xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Добро пожаловать!
        </h2>
        <p className="text-[var(--text-tertiary)]">
          Войдите в свой аккаунт преподавателя
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{errors.general}</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Логин
          </label>
          <Input
            type="text"
            value={formData.login}
            onChange={(e) => handleInputChange('login', e.target.value)}
            placeholder="Введите ваш логин"
            error={errors.login}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Пароль
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Введите ваш пароль"
              error={errors.password}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
              disabled={isLoading}
            >
              {showPassword ? (
                <Icons.EyeOff className="h-5 w-5" />
              ) : (
                <Icons.Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Вход...
            </div>
          ) : (
            'Войти'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-[var(--text-tertiary)] text-sm">
          Нет аккаунта?{' '}
          <button
            onClick={() => router.push('/register')}
            className="text-[var(--accent-primary)] hover:underline"
          >
            Зарегистрироваться
          </button>
        </p>
      </div>
    </div>
  )
}

