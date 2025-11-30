'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from '@/components/ui/Icons'

const BottomNav: React.FC = () => {
  const pathname = usePathname()

  const menuItems = [
    {
      href: '/',
      icon: Icons.Home,
      label: 'Главная',
    },
    {
      href: '/referrals',
      icon: Icons.Users,
      label: 'Рефералы',
    },
    {
      href: '/tests',
      icon: Icons.FileText,
      label: 'Тесты',
    },
    {
      href: '/settings',
      icon: Icons.Settings,
      label: 'Настройки',
    },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[var(--bg-card)] border-t border-[var(--border-primary)] z-50 pb-[var(--safe-area-bottom)]">
      <div className="flex items-center justify-around h-[var(--bottom-nav-height)]">
        {menuItems.map((item) => {
          const isActive = item.href === '/' 
            ? pathname === '/' || pathname === ''
            : pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors ${
                isActive
                  ? 'text-[var(--text-primary)]'
                  : 'text-[var(--text-tertiary)]'
              }`}
            >
              <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-[var(--accent-primary)]' : ''}`} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-[var(--accent-primary)]' : ''}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav

