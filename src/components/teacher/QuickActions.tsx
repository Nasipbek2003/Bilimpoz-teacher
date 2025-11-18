'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/Icons'
import { useTranslation } from '@/hooks/useTranslation'

interface QuickActionsProps {
  teacherId: string
  onTabChange?: (tab: string) => void
}

const QuickActions: React.FC<QuickActionsProps> = ({ teacherId, onTabChange }) => {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const getText = (key: string, fallback: string) => {
    if (!mounted || !ready) return fallback
    return t(key)
  }

  const actions = [
    {
      icon: Icons.Plus,
      title: getText('quickActions.createTest', 'Создать тест'),
      description: getText('quickActions.createTestDesc', 'Создайте новый тест для ваших студентов'),
      action: () => {
        if (onTabChange) {
          onTabChange('tests')
        } else {
          router.push('/questions')
        }
      }
    },
    {
      icon: Icons.UserPlus,
      title: getText('quickActions.inviteStudent', 'Пригласить студента'),
      description: getText('quickActions.inviteStudentDesc', 'Поделитесь реферальной ссылкой'),
      action: () => {
        if (onTabChange) {
          onTabChange('referrals')
        } else {
          router.push('/students')
        }
      }
    },
    {
      icon: Icons.Settings,
      title: getText('quickActions.profileSettings', 'Настройки профиля'),
      description: getText('quickActions.profileSettingsDesc', 'Измените настройки вашего профиля'),
      action: () => {
        if (onTabChange) {
          onTabChange('settings')
        } else {
          router.push('/settings')
        }
      }
    }
  ]

  if (!mounted || !ready) {
    return (
      <div className="bg-[var(--bg-card)] rounded-2xl p-6 border border-[var(--border-primary)] shadow-sm">
        <div className="h-6 skeleton-shimmer rounded w-1/4 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-[var(--bg-tertiary)]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 skeleton-shimmer rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 skeleton-shimmer rounded w-3/4"></div>
                  <div className="h-3 skeleton-shimmer rounded w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-6  shadow-sm">
      <div className="pb-2 border-b border-[var(--border-primary)] mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          {getText('quickActions.title', 'Быстрые действия')}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <button
              key={index}
              onClick={action.action}
              className="p-4 rounded-xl transition-all duration-300 text-left group relative overflow-hidden hover:bg-[var(--bg-hover)]"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 min-w-[2.5rem] flex-shrink-0 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center">
                  <Icon className="w-6 h-6 flex-shrink-0 text-[var(--text-primary)]" />
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">{action.title}</p>
                  <p className="text-sm text-[var(--text-tertiary)]">{action.description}</p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions

