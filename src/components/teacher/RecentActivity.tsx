'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Icons } from '@/components/ui/Icons'
import { useTranslation } from '@/hooks/useTranslation'

interface RecentActivityProps {
  teacherId: string
}

interface Activity {
  id: string
  type: string
  activityKey: string
  data: Record<string, any>
  timestamp: string
  icon: keyof typeof Icons
  color?: string
}

const RecentActivity: React.FC<RecentActivityProps> = ({ teacherId }) => {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !ready) return

    const fetchActivities = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/teacher/activity?teacherId=${teacherId}`)
        const data = await response.json()
        
        if (data.success) {
          setActivities(data.data || [])
        } else {
          setError(data.error || 'Ошибка загрузки активности')
        }
      } catch (err) {
        console.error('Error fetching activities:', err)
        setError('Ошибка загрузки активности')
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [teacherId, mounted, ready])

  const getText = (key: string, fallback: string) => {
    if (!mounted || !ready) return fallback
    return t(key)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

    if (diffInSeconds < 60) return getText('activity.time.justNow', 'Только что')
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${getText('activity.time.minutesAgo', 'минут назад')}`
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${getText('activity.time.hoursAgo', 'часов назад')}`
    }
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${getText('activity.time.daysAgo', 'дней назад')}`
  }

  const totalPages = Math.ceil(activities.length / itemsPerPage)
  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return activities.slice(start, end)
  }, [activities, currentPage, itemsPerPage])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (!mounted || !ready || loading) {
    return (
      <div className="bg-[var(--bg-card)] rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border border-[var(--border-primary)] shadow-sm">
        <div className="h-6 skeleton-shimmer rounded w-1/3 mb-4"></div>
        <div className="space-y-3 sm:space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-10 h-10 skeleton-shimmer rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 skeleton-shimmer rounded w-3/4"></div>
                <div className="h-3 skeleton-shimmer rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && activities.length === 0) {
    return (
      <div className="bg-[var(--bg-card)] rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 border border-[var(--border-primary)] shadow-sm text-center">
        <p className="text-sm sm:text-base text-red-500 dark:text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--bg-card)] rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm">
      <div className="pb-2 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
            {getText('activity.title', 'Последняя активность')}
          </h3>
          
          {/* Пагинация */}
          {activities.length > 0 && (
          <div className="flex items-center space-x-2 self-end sm:self-auto">
            {/* Селектор количества */}
            <div className="relative">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="px-2 py-1 text-xs sm:text-sm bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </select>
            </div>
            
            {/* Кнопки навигации */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Предыдущая страница"
            >
              <Icons.ChevronLeft className="w-4 h-4 text-[var(--text-primary)]" />
            </button>
            <span className="text-xs sm:text-sm text-[var(--text-tertiary)] min-w-[3rem] text-center">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-[var(--bg-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Следующая страница"
            >
              <Icons.ChevronRight className="w-4 h-4 text-[var(--text-primary)]" />
            </button>
          </div>
          )}
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-6 sm:py-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[var(--bg-tertiary)] rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Icons.BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--text-tertiary)]" />
          </div>
          <p className="text-sm sm:text-base text-[var(--text-tertiary)]">{getText('activity.noActivity', 'Нет активности')}</p>
          <p className="text-xs sm:text-sm text-[var(--text-tertiary)] mt-1">
            {getText('activity.noActivityDesc', 'Начните создавать тесты...')}
          </p>
        </div>
      ) : (
        <div className="space-y-2 sm:space-y-4">
          {paginatedActivities.map((activity) => {
            const Icon = Icons[activity.icon] || Icons.Activity
            const title = getText(`activity.${activity.activityKey}.title`, activity.type)
            const description = getText(`activity.${activity.activityKey}.description`, '')
            
            return (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 sm:p-4 rounded-lg sm:rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[var(--text-primary)] text-xs sm:text-sm truncate">{title}</p>
                  {description && (
                    <p className="text-xs text-[var(--text-tertiary)] mt-1 line-clamp-2">{description}</p>
                  )}
                  <p className="text-xs text-[var(--text-tertiary)] mt-1.5 sm:mt-2">
                    {formatTimeAgo(activity.timestamp)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RecentActivity

