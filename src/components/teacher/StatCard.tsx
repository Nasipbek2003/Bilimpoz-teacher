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
      className={`bg-[var(--bg-card)] rounded-2xl p-6 transition-all border border-[var(--border-secondary)] ${
        isClickable 
          ? 'hover:bg-[var(--bg-hover)] cursor-pointer group' 
          : ''
      } ${className}`}
      onClick={onClick}
    >
      {/* Иконка и заголовок */}
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-[var(--bg-tertiary)] rounded-lg">
          <Icon className="h-6 w-6 text-[var(--text-primary)]" />
        </div>
      </div>
      
      {/* Заголовок */}
      <h3 className="text-sm font-medium text-[var(--text-tertiary)] mb-1">
        {title}
      </h3>
      
      {/* Значение */}
      <p className="text-2xl font-bold text-[var(--text-primary)]">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  )
}

export default StatCard
