'use client'

import React from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  onClick?: () => void
  className?: string
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  onClick,
  className = ''
}) => {
  const isClickable = !!onClick

  return (
    <div
      className={`bg-[var(--bg-tertiary)] rounded-2xl p-4 sm:p-6 transition-all overflow-hidden ${
        isClickable 
          ? 'hover:bg-[var(--bg-hover)] cursor-pointer group' 
          : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Мобильная версия: иконка + значение в одну строку */}
      <div className="flex sm:hidden items-center gap-3 mb-2">
        <div className="p-2 bg-[var(--bg-card)] rounded-lg flex-shrink-0">
          <Icon className="h-5 w-5 text-[var(--text-primary)]" />
        </div>
        <p className="text-xl font-bold text-[var(--text-primary)]">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </p>
      </div>
      <h3 className="sm:hidden text-xs font-medium text-[var(--text-tertiary)] truncate">
        {title}
      </h3>

      {/* Десктоп версия */}
      <div className="hidden sm:flex items-center gap-3 mb-4">
        <div className="p-2 bg-[var(--bg-card)] rounded-lg flex-shrink-0">
          <Icon className="h-6 w-6 text-[var(--text-primary)]" />
        </div>
        <h3 className="text-sm font-medium text-[var(--text-tertiary)] line-clamp-2 break-words">
          {title}
        </h3>
      </div>
      <p className="hidden sm:block text-2xl font-bold text-[var(--text-primary)]">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  )
}

export default StatCard
