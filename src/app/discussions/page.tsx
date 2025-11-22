'use client'

import React, { useState, useEffect } from 'react'
import TeacherLayout from '@/components/teacher/TeacherLayout'
import StatCard from '@/components/teacher/StatCard'
import DiscussionCard from '@/components/teacher/DiscussionCard'
import ChatModal from '@/components/teacher/ChatModal'
import { Icons } from '@/components/ui/Icons'
import { useTranslation } from '@/hooks/useTranslation'
import { DiscussionsPageSkeleton } from '@/components/ui/PageSkeletons'

interface Discussion {
  id: string
  name: string
  student: string
  studentId: string
  lessonId: string
  lessonTitle: string
  messageCount: number
  lastMessage: string
  lastMessageTime: string
  status: 'active' | 'closed'
  unreadCount?: number
  summarizedChat?: string
  createdAt: string
  updatedAt: string
}

interface ChatMessage {
  id: string
  text: string
  companion: 'student' | 'teacher'
  timestamp: string
}

export default function DiscussionsPage() {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [selectedDiscussion, setSelectedDiscussion] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'closed' | 'unread'>('all')

  useEffect(() => {
    setMounted(true)
  }, [])

  // Загрузка обсуждений из API
  useEffect(() => {
    const fetchDiscussions = async () => {
      if (!mounted) return
      
      setIsLoading(true)
      try {
        const response = await fetch('/api/teacher/discussions')
        const result = await response.json()
        
        if (result.success && result.data) {
          setDiscussions(result.data)
        } else {
          console.error('Ошибка загрузки обсуждений:', result.error)
          setDiscussions([])
        }
      } catch (error) {
        console.error('Ошибка при загрузке обсуждений:', error)
        setDiscussions([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchDiscussions()
  }, [mounted])

  const getText = (key: string, fallback: string) => {
    if (!mounted || !ready) return fallback
    return t(key)
  }

  // Фильтрация обсуждений
  const filteredDiscussions = discussions.filter(discussion => {
    switch (filter) {
      case 'active':
        return discussion.status === 'active'
      case 'closed':
        return discussion.status === 'closed'
      case 'unread':
        return (discussion.unreadCount || 0) > 0
      default:
        return true
    }
  })

  // Статистика
  const stats = {
    total: discussions.length,
    active: discussions.filter(d => d.status === 'active').length,
    closed: discussions.filter(d => d.status === 'closed').length,
    unread: discussions.reduce((sum, d) => sum + (d.unreadCount || 0), 0),
  }

  const handleOpenChat = async (discussionId: string) => {
    setSelectedDiscussion(discussionId)
    setIsChatOpen(true)
    
    // Загружаем сообщения для этого обсуждения
    try {
      const response = await fetch(`/api/teacher/discussions/${discussionId}/messages`)
      const result = await response.json()
      
      if (result.success && result.data) {
        setChatMessages(result.data)
      } else {
        console.error('Ошибка загрузки сообщений:', result.error)
        setChatMessages([])
      }
    } catch (error) {
      console.error('Ошибка при загрузке сообщений:', error)
      setChatMessages([])
    }
    
    // Сбрасываем счетчик непрочитанных сообщений
    setDiscussions(prev =>
      prev.map(d =>
        d.id === discussionId
          ? { ...d, unreadCount: 0 }
          : d
      )
    )
  }

  const handleCloseChat = () => {
    setIsChatOpen(false)
    setSelectedDiscussion(null)
  }

  const handleSendMessage = async (message: string) => {
    if (!selectedDiscussion) return
    
    try {
      const response = await fetch(`/api/teacher/discussions/${selectedDiscussion}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message })
      })
      
      const result = await response.json()
      
      if (result.success && result.data) {
        // Добавляем новое сообщение в чат
        setChatMessages(prev => [...prev, result.data])
        
        // Обновляем последнее сообщение в обсуждении
        setDiscussions(prev =>
          prev.map(d =>
            d.id === selectedDiscussion
              ? {
                  ...d,
                  lastMessage: message,
                  lastMessageTime: result.data.timestamp,
                  messageCount: d.messageCount + 1,
                }
              : d
          )
        )
      } else {
        console.error('Ошибка отправки сообщения:', result.error)
        alert('Ошибка при отправке сообщения. Попробуйте снова.')
      }
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error)
      alert('Ошибка при отправке сообщения. Попробуйте снова.')
    }
  }

  const handleCloseDiscussion = async (discussionId: string) => {
    try {
      const response = await fetch(`/api/teacher/discussions/${discussionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'close',
          summarizedChat: 'Обсуждение закрыто учителем'
        })
      })
      
      const result = await response.json()
      
      if (result.success && result.data) {
        // Обновляем статус обсуждения
        setDiscussions(prev =>
          prev.map(d =>
            d.id === discussionId
              ? { ...d, status: 'closed' as const, summarizedChat: result.data.summarizedChat }
              : d
          )
        )
      } else {
        console.error('Ошибка закрытия обсуждения:', result.error)
        alert('Ошибка при закрытии обсуждения. Попробуйте снова.')
      }
    } catch (error) {
      console.error('Ошибка при закрытии обсуждения:', error)
      alert('Ошибка при закрытии обсуждения. Попробуйте снова.')
    }
  }

  const handleSummarize = async (discussionId: string) => {
    try {
      // В будущем здесь можно добавить AI суммаризацию
      const summary = 'Обсуждение суммировано учителем'
      
      const response = await fetch(`/api/teacher/discussions/${discussionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'summarize',
          summarizedChat: summary
        })
      })
      
      const result = await response.json()
      
      if (result.success && result.data) {
        // Обновляем суммаризацию обсуждения
        setDiscussions(prev =>
          prev.map(d =>
            d.id === discussionId
              ? { ...d, summarizedChat: result.data.summarizedChat }
              : d
          )
        )
        alert('Обсуждение суммировано!')
      } else {
        console.error('Ошибка суммирования обсуждения:', result.error)
        alert('Ошибка при суммировании обсуждения. Попробуйте снова.')
      }
    } catch (error) {
      console.error('Ошибка при суммировании обсуждения:', error)
      alert('Ошибка при суммировании обсуждения. Попробуйте снова.')
    }
  }

  const selectedDiscussionData = discussions.find(d => d.id === selectedDiscussion)

  if (!mounted || !ready) {
    return (
      <TeacherLayout>
        <DiscussionsPageSkeleton />
      </TeacherLayout>
    )
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Заголовок страницы */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {t('discussions.title')}
          </h1>
          <p className="text-gray-400">
            {t('discussions.description')}
          </p>
        </div>

        {/* Статистические карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title={t('discussions.stats.total')}
            value={stats.total}
            icon={Icons.MessageCircle}
          />
          <StatCard
            title={t('discussions.stats.active')}
            value={stats.active}
            icon={Icons.Activity}
          />
          <StatCard
            title={t('discussions.stats.closed')}
            value={stats.closed}
            icon={Icons.CheckCircle}
          />
          <StatCard
            title={t('discussions.stats.unread')}
            value={stats.unread}
            icon={Icons.Bell}
            onClick={() => console.log('Показать непрочитанные')}
          />
        </div>

        {/* Фильтры */}
        <div className="bg-[var(--bg-card)] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{t('discussions.filters.title')}</h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-[var(--bg-active-button)] text-[var(--text-active-button)]'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {t('discussions.filters.all')}
            </button>
            <button 
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === 'active'
                  ? 'bg-[var(--bg-active-button)] text-[var(--text-active-button)]'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {t('discussions.filters.active')}
            </button>
            <button 
              onClick={() => setFilter('closed')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === 'closed'
                  ? 'bg-[var(--bg-active-button)] text-[var(--text-active-button)]'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {t('discussions.filters.closed')}
            </button>
            <button 
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === 'unread'
                  ? 'bg-[var(--bg-active-button)] text-[var(--text-active-button)]'
                  : 'bg-[var(--bg-tertiary)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              {t('discussions.filters.withUnread')}
            </button>
          </div>
        </div>

        {/* Список обсуждений */}
        <div className="space-y-4">
          {isLoading ? (
            <DiscussionsPageSkeleton />
          ) : filteredDiscussions.length === 0 ? (
            <div className="bg-[var(--bg-card)] rounded-2xl p-12 text-center">
              <Icons.MessageCircle className="mx-auto h-12 w-12 text-[var(--text-tertiary)] mb-4" />
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                {t('discussions.empty.title')}
              </h3>
              <p className="text-[var(--text-tertiary)]">
                {t('discussions.empty.description')}
              </p>
            </div>
          ) : (
            filteredDiscussions.map((discussion) => (
              <DiscussionCard
                key={discussion.id}
                discussion={discussion}
                onOpenChat={handleOpenChat}
                onCloseDiscussion={handleCloseDiscussion}
                onSummarize={handleSummarize}
              />
            ))
          )}
        </div>

        {/* Модальное окно чата */}
        <ChatModal
          isOpen={isChatOpen}
          onClose={handleCloseChat}
          discussionName={selectedDiscussionData?.name || ''}
          studentName={selectedDiscussionData?.student || ''}
          messages={chatMessages}
          onSendMessage={handleSendMessage}
        />
      </div>
    </TeacherLayout>
  )
}






