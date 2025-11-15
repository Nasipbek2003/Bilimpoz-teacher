'use client'

import React, { useState } from 'react'
import { Icons } from '@/components/ui/Icons'
import { useAuth } from '@/contexts/AuthContext'
import { useTranslation } from '@/hooks/useTranslation'
import LanguageSwitcher from '@/components/ui/LanguageSwitcher'
import ThemeToggle from '@/components/ui/ThemeToggle'

interface HeaderProps {
  onMenuToggle: () => void
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  const handleLogout = async () => {
    if (confirm(t('auth.confirmLogout'))) {
      await logout()
    }
  }

  return (
    <header className="bg-[var(--bg-card)] rounded-2xl shadow-2xl z-50 relative border border-[var(--border-secondary)]">
      <div className="flex items-center justify-between px-4 lg:px-6 h-16">
        {/* Левая часть */}
        <div className="flex items-center gap-4">
          {/* Кнопка меню (только на мобильных) */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
          >
            <Icons.Menu className="h-5 w-5 text-[var(--text-primary)]" />
          </button>

          {/* Логотип */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[var(--text-primary)] rounded-lg flex items-center justify-center">
              <span className="text-[var(--bg-primary)] font-bold text-lg">B</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-[var(--text-primary)]">Bilimpoz Teachers</h1>
            </div>
          </div>
        </div>

        {/* Правая часть */}
        <div className="flex items-center gap-4">
          {/* Поиск (скрыт на мобильных) */}
          <div className="hidden md:flex items-center relative">
            <Icons.Search className="absolute left-4 h-4 w-4 text-[var(--text-tertiary)]" />
            <input
              type="text"
              placeholder={t('common.search')}
              className="pl-12 pr-4 py-3 bg-[var(--bg-tertiary)] border-0 rounded-xl text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all w-64"
            />
          </div>

          {/* Переключатель языка */}
          <LanguageSwitcher />

          {/* Переключатель темы */}
          <ThemeToggle />

          {/* Уведомления */}
          <button className="relative p-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors">
            <Icons.Bell className="h-5 w-5 text-[var(--text-secondary)]" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </button>

          {/* Профиль */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
            >
              {user?.profile_photo_url ? (
                <img 
                  src={user.profile_photo_url} 
                  alt={user.name || 'Пользователь'}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-[var(--bg-active)] rounded-full flex items-center justify-center">
                  <Icons.User className="h-4 w-4 text-[var(--text-primary)]" />
                </div>
              )}
              <div className="text-left min-w-[120px]">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.name || t('common.user')}</p>
                <p className="text-xs text-[var(--text-tertiary)] truncate">
                  {user?.role ? t(`roles.${user.role}`) : t('common.roleNotSpecified')}
                </p>
              </div>
              <Icons.ChevronDown className="h-4 w-4 text-[var(--text-tertiary)]" />
            </button>

            {/* Выпадающее меню профиля */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] rounded-2xl shadow-2xl py-2 z-50 border border-[var(--border-secondary)]">
                <button className="w-full px-4 py-2 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-3">
                  <Icons.User className="h-4 w-4" />
                  {t('header.profile')}
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-3">
                  <Icons.Settings className="h-4 w-4" />
                  {t('header.settings')}
                </button>
                <hr className="my-2 border-[var(--border-primary)]" />
                <button 
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-[var(--accent-danger)] hover:bg-[var(--bg-hover)] transition-colors flex items-center gap-3"
                >
                  <Icons.LogOut className="h-4 w-4" />
                  {t('auth.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
