'use client'

import React, { useState, useEffect } from 'react'
import { Icons } from '@/components/ui/Icons'
import Button from '@/components/ui/Button'
import { useTranslation } from '@/hooks/useTranslation'

interface ReferralSystemProps {
  referralLink: string
  totalClicks: number
  totalRegistrations: number
  onCopyLink: () => void
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({
  referralLink,
  totalClicks,
  totalRegistrations,
  onCopyLink
}) => {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      setCopied(true)
      onCopyLink()
      
      // Сбрасываем состояние через 2 секунды
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Ошибка копирования:', err)
    }
  }

  const getShareMessage = () => {
    // Всегда пытаемся получить перевод, независимо от состояния готовности
    try {
      const translation = t('students.referral.shareMessage')
      // Если вернулся ключ (не найден перевод), используем fallback
      if (translation === 'students.referral.shareMessage') {
        return 'Присоединяйся к Bilimpoz! Используй мою реферальную ссылку'
      }
      return translation
    } catch {
      return 'Присоединяйся к Bilimpoz! Используй мою реферальную ссылку'
    }
  }

  const handleTelegramShare = () => {
    const messageText = getShareMessage()
    // В Telegram API параметр url автоматически добавляется после текста
    // Поэтому в text передаем только сообщение без ссылки
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(messageText)}`
    window.open(telegramUrl, '_blank', 'noopener,noreferrer')
  }

  const handleWhatsAppShare = () => {
    const messageText = getShareMessage()
    const fullMessage = `${messageText} ${referralLink}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  // Fallback значения для предотвращения ошибок гидратации
  const getText = (key: string, fallback: string) => {
    if (!mounted || !ready) return fallback
    const translation = t(key)
    // Если перевод вернул ключ (не найден), используем fallback
    return translation === key ? fallback : translation
  }

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
          {getText('students.referral.title', 'Реферальная система')}
        </h3>
        <p className="text-[var(--text-tertiary)]">
          {getText('students.referral.description', 'Приглашайте новых учеников и получайте бонусы')}
        </p>
      </div>

      {/* Реферальная ссылка */}
      <div className="bg-[var(--bg-tertiary)] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-[var(--text-primary)]">{getText('students.referral.linkTitle', 'Ваша реферальная ссылка')}</h4>
          <div className="flex items-center gap-2">
            <Icons.Link className="h-4 w-4 text-[var(--text-tertiary)]" />
            <span className="text-sm text-[var(--text-tertiary)]">{getText('students.referral.shareHint', 'Поделитесь с учениками')}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 bg-[var(--bg-card)] rounded-lg px-4 py-3 border border-[var(--border-primary)]">
            <p className="text-sm text-[var(--text-secondary)] font-mono break-all">
              {referralLink}
            </p>
          </div>
          
          <Button
            variant={copied ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleCopyLink}
            className="whitespace-nowrap"
          >
            {copied ? (
              <>
                <Icons.CheckCircle className="h-4 w-4 mr-2" />
                {getText('students.referral.copied', 'Скопировано')}
              </>
            ) : (
              <>
                <Icons.Copy className="h-4 w-4 mr-2" />
                {getText('students.referral.copy', 'Копировать')}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Способы приглашения */}
      <div className="mt-6">
        <h4 className="font-medium text-[var(--text-primary)] mb-4">{getText('students.referral.inviteMethods', 'Способы приглашения')}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button 
            onClick={handleTelegramShare}
            className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors group"
          >
            <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
              <Icons.MessageCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[var(--text-primary)]">{getText('students.referral.telegram', 'Telegram')}</p>
              <p className="text-xs text-[var(--text-tertiary)]">{getText('students.referral.telegramHint', 'Отправить в чат')}</p>
            </div>
          </button>

          <button 
            onClick={handleWhatsAppShare}
            className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors group"
          >
            <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
              <Icons.Phone className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[var(--text-primary)]">{getText('students.referral.whatsapp', 'WhatsApp')}</p>
              <p className="text-xs text-[var(--text-tertiary)]">{getText('students.referral.whatsappHint', 'Поделиться ссылкой')}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReferralSystem

