'use client'

import React, { useState } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import VerificationModal from './VerificationModal'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface TeacherLayoutProps {
  children: React.ReactNode
}

const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
  const { user, logout } = useAuth()
  const router = useRouter()

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

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleSidebarClose = () => {
    setIsSidebarOpen(false)
  }

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
        // Fallback: переходим в раздел обсуждений
        router.push('/discussions')
        setIsVerificationModalOpen(false)
      }
    } catch (error) {
      console.error('Ошибка при открытии Telegram чата:', error)
      // Fallback: переходим в раздел обсуждений
      router.push('/discussions')
      setIsVerificationModalOpen(false)
    }
  }

  const handleCloseVerificationModal = () => {
    setIsVerificationModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <div className="p-4 pb-0">
        <Header onMenuToggle={handleMenuToggle} />
      </div>

      {/* Main Container with Sidebar and Content */}
      <div className="flex h-[calc(100vh-5rem)] p-4 pt-6 gap-4 bg-[var(--bg-primary)]">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} onClose={handleSidebarClose} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[var(--bg-main-container)] rounded-2xl p-6">
          {children}
        </main>
      </div>

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
