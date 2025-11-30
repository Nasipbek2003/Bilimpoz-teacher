'use client'

import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import VerificationModal from './VerificationModal'
import { useAuth } from '@/contexts/AuthContext'

interface TeacherLayoutProps {
  children: React.ReactNode
}

const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children }) => {
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
  const { user, logout } = useAuth()

  // Проверяем статус пользователя при загрузке
  React.useEffect(() => {
    if (user) {
      // Если пользователь забанен, автоматически выходим
      if (user.status === 'banned' || user.status === 'deleted') {
        logout()
        return
      }
      
      // Если статус registered, показываем модальное окно верификации
      if (user.status === 'registered') {
        setIsVerificationModalOpen(true)
      }
    }
  }, [user, logout])

  const handleGoToChat = async () => {
    try {
      // Получаем логин администратора из API
      const response = await fetch('/api/admin/telegram-login')
      const data = await response.json()
      
      if (data.success && data.data.telegramLogin) {
        // Формируем URL для Telegram чата с предзаполненным текстом
        let telegramLogin = data.data.telegramLogin.trim()
        
        // Убираем @ если есть
        if (telegramLogin.startsWith('@')) {
          telegramLogin = telegramLogin.substring(1)
        }
        
        // Текст сообщения для администратора
        const message = `Здравствуйте! Я зарегистрировался как учитель и хочу пройти верификацию. Мой логин: ${user?.login || 'не указан'}`
        const encodedMessage = encodeURIComponent(message)
        
        // Открываем Telegram чат
        const telegramUrl = `https://t.me/${telegramLogin}?text=${encodedMessage}`
        window.open(telegramUrl, '_blank')
        // Модальное окно остается открытым
      } else {
        console.error('Не удалось получить логин администратора')
        setIsVerificationModalOpen(false)
      }
    } catch (error) {
      console.error('Ошибка при открытии Telegram чата:', error)
      setIsVerificationModalOpen(false)
    }
  }

  const handleCloseVerificationModal = () => {
    setIsVerificationModalOpen(false)
  }

  return (
    <div className="h-screen bg-[var(--bg-primary)] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-2 sm:p-3 md:p-4 pb-0">
        <Header />
      </div>

      {/* Main Container with Sidebar and Content */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 p-2 sm:p-3 md:p-4 pt-3 sm:pt-4 md:pt-6 gap-2 sm:gap-3 md:gap-4 bg-[var(--bg-primary)] pb-[calc(var(--bottom-nav-height)+var(--safe-area-bottom)+8px)] lg:pb-4">
        {/* Sidebar - только для десктопа */}
        <div className="hidden lg:block">
          <Sidebar isOpen={false} onClose={() => {}} />
        </div>

        {/* Main Content */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden bg-[var(--bg-main-container)] rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Bottom Navigation - только для мобильных */}
      <BottomNav />

      {/* Verification Modal */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={handleCloseVerificationModal}
        onGoToChat={handleGoToChat}
      />
    </div>
  )
}

export default TeacherLayout
