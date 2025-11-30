'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Select, { SelectOption } from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { useTranslation } from '@/hooks/useTranslation'

interface StudentsFilterProps {
  status: string
  onStatusChange: (status: string) => void
  sortBy: string
  onSortByChange: (sortBy: string) => void
  onClearFilters: () => void
}

const StudentsFilter: React.FC<StudentsFilterProps> = ({
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  onClearFilters
}) => {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const statusOptions: SelectOption[] = useMemo(() => {
    if (!mounted || !ready) return []
    return [
      { value: 'all', label: t('students.filters.statusOptions.all') },
      { value: 'registered', label: t('students.filters.statusOptions.registered') },
      { value: 'paid', label: t('students.filters.statusOptions.paid') },
      { value: 'adminPaid', label: t('students.filters.statusOptions.adminPaid') },
  ]
  }, [t, mounted, ready])

  const sortOptions: SelectOption[] = useMemo(() => {
    if (!mounted || !ready) return []
    return [
      { value: 'name', label: t('students.filters.sortOptions.name') },
      { value: 'registration_date', label: t('students.filters.sortOptions.registration_date') },
      { value: 'activity', label: t('students.filters.sortOptions.activity') },
      { value: 'lessons', label: t('students.filters.sortOptions.lessons') },
      { value: 'points', label: t('students.filters.sortOptions.points') },
    ]
  }, [t, mounted, ready])

  // Fallback значения для предотвращения ошибок гидратации
  const getText = (key: string, fallback: string) => {
    if (!mounted || !ready) return fallback
    return t(key)
  }

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-6 relative z-20">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        {/* Статус */}
        <div className="relative z-40 flex-1">
          <Select
            value={status}
            onChange={onStatusChange}
            options={statusOptions}
            placeholder={getText('students.filters.statusPlaceholder', 'Выберите статус')}
          />
        </div>

        {/* Сортировка */}
        <div className="relative z-30 flex-1">
          <Select
            value={sortBy}
            onChange={onSortByChange}
            options={sortOptions}
            placeholder={getText('students.filters.sortPlaceholder', 'Сортировать по')}
          />
        </div>

        {/* Кнопка Очистить */}
        <div className="flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={onClearFilters}
            className="w-full sm:w-auto"
          >
            {getText('students.filters.clear', 'Очистить')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StudentsFilter






