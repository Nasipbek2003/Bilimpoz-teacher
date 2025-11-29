'use client'

import React, { useState, useEffect } from 'react'
import TeacherLayout from '@/components/teacher/TeacherLayout'
import TeacherStats from '@/components/teacher/TeacherStats'
import QuickActions from '@/components/teacher/QuickActions'
import RecentActivity from '@/components/teacher/RecentActivity'
import { Icons } from '@/components/ui/Icons'
import { useTranslation } from '@/hooks/useTranslation'
import { useAuth } from '@/contexts/AuthContext'
import { DashboardSkeleton } from '@/components/ui/PageSkeletons'

export default function HomePage() {
  const { t, ready } = useTranslation()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Fallback значения для предотвращения ошибок гидратации
  const getText = (key: string, fallback: string) => {
    if (!mounted || !ready) return fallback
    return t(key)
  }

  return (
    <TeacherLayout>
      <div className="space-y-4 sm:space-y-5 md:space-y-6">
        {/* 1. Welcome Section */}
        <div className="bg-[var(--bg-card)] rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--bg-tertiary)] rounded-lg flex items-center justify-center flex-shrink-0">
              <Icons.User className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-primary)]" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-[var(--text-primary)] truncate">
                {getText('dashboard.welcome', 'Добро пожаловать')}, {user?.name || 'Пользователь'}!
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-tertiary)] mt-1">
                {getText('dashboard.welcomeSubtitle', 'Начните создавать тесты и управлять учебным процессом')}
              </p>
            </div>
          </div>
        </div>

        {/* 2. TeacherStats - Статистика учителя */}
        <div>
          <TeacherStats teacherId={user?.id || ''} />
        </div>

        {/* 3. QuickActions - Быстрые действия */}
        <div>
          <QuickActions teacherId={user?.id || ''} />
        </div>

        {/* 4. RecentActivity - Последняя активность */}
        <div>
          <RecentActivity teacherId={user?.id || ''} />
        </div>
      </div>
    </TeacherLayout>
  )
}
