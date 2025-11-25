'use client'

import React from 'react'
import { Icons } from './Icons'
import Tooltip from './Tooltip'
import { useTranslation } from '@/hooks/useTranslation'

interface BreadcrumbItem {
  title: string
  type?: 'course' | 'group' | 'lesson' | 'test' | 'edit'
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  onNavigate?: (href: string) => void
  onSettingsClick?: () => void
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate, onSettingsClick }) => {
  const { t, ready } = useTranslation()
  
  const getText = (key: string, fallback: string) => {
    if (!ready) return fallback
    const translation = t(key)
    return translation === key ? fallback : translation
  }
  const getIcon = (type?: string) => {
    switch (type) {
      case 'course':
        return <Icons.BookOpen className="h-4 w-4 text-[var(--text-tertiary)]" />
      case 'group':
        return <Icons.Users className="h-4 w-4 text-[var(--text-tertiary)]" />
      case 'lesson':
        return <Icons.FileText className="h-4 w-4 text-[var(--text-tertiary)]" />
      case 'test':
        return <Icons.HelpCircle className="h-4 w-4 text-[var(--text-tertiary)]" />
      case 'edit':
        return <Icons.Edit className="h-4 w-4 text-[var(--text-tertiary)]" />
      default:
        return null
    }
  }

  const handleClick = (item: BreadcrumbItem) => {
    if (item.href && onNavigate) {
      onNavigate(item.href)
    }
  }

  return (
    <div className="flex items-center justify-between gap-2 p-4 bg-[var(--bg-card)] rounded-lg mb-6">
      <div className="flex items-center gap-2">
        <Icons.Home className="h-4 w-4 text-[var(--text-tertiary)]" />
        <button 
          onClick={() => onNavigate?.('/tests')}
          className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors text-sm"
        >
          {getText('sidebar.tests', 'Тесты')}
        </button>
        
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Icons.ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
            <div className="flex items-center gap-1">
            {getIcon(item.type)}
            <button 
              onClick={() => handleClick(item)}
              className={`text-sm transition-colors ${
                index === items.length - 1 
                  ? 'text-[var(--text-primary)] font-medium' 
                  : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]'
              } ${item.href ? 'cursor-pointer' : 'cursor-default'}`}
              disabled={!item.href}
            >
              {item.title}
            </button>
            </div>
          </div>
        ))}
      </div>
      
      <Tooltip text={getText('header.settings', 'Настройки')}>
        <button 
          onClick={onSettingsClick}
          className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <Icons.Settings className="h-5 w-5" />
        </button>
      </Tooltip>
    </div>
  )
}

export default Breadcrumbs
