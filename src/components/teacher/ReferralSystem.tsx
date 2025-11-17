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
  onInviteStudent: () => void
}

const ReferralSystem: React.FC<ReferralSystemProps> = ({
  referralLink,
  totalClicks,
  totalRegistrations,
  onCopyLink,
  onInviteStudent
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

  // Fallback значения для предотвращения ошибок гидратации
  const getText = (key: string, fallback: string) => {
    if (!mounted || !ready) return fallback
    return t(key)
  }

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            {getText('students.referral.title', 'Реферальная система')}
          </h3>
          <p className="text-[var(--text-tertiary)]">
            {getText('students.referral.description', 'Приглашайте новых учеников и получайте бонусы')}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={onInviteStudent}
        >
          <Icons.Plus className="h-4 w-4 mr-2" />
          {getText('students.referral.inviteButton', 'Пригласить ученика')}
        </Button>
      </div>

      {/* Статистика реферальной системы */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Icons.MousePointer className="h-5 w-5 text-blue-400" />
            <span className="text-sm font-medium text-[var(--text-secondary)]">{getText('students.referral.clicks', 'Переходы')}</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{totalClicks}</p>
        </div>

        <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Icons.UserPlus className="h-5 w-5 text-green-400" />
            <span className="text-sm font-medium text-[var(--text-secondary)]">{getText('students.referral.registrations', 'Регистрации')}</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{totalRegistrations}</p>
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors group">
            <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20">
              <Icons.MessageCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[var(--text-primary)]">{getText('students.referral.telegram', 'Telegram')}</p>
              <p className="text-xs text-[var(--text-tertiary)]">{getText('students.referral.telegramHint', 'Отправить в чат')}</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors group">
            <div className="p-2 bg-green-500/10 rounded-lg group-hover:bg-green-500/20">
              <Icons.Phone className="h-5 w-5 text-green-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[var(--text-primary)]">{getText('students.referral.whatsapp', 'WhatsApp')}</p>
              <p className="text-xs text-[var(--text-tertiary)]">{getText('students.referral.whatsappHint', 'Поделиться ссылкой')}</p>
            </div>
          </button>

          <button className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] rounded-lg hover:bg-[var(--bg-hover)] transition-colors group">
            <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20">
              <Icons.Share2 className="h-5 w-5 text-purple-400" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-[var(--text-primary)]">{getText('students.referral.other', 'Другие')}</p>
              <p className="text-xs text-[var(--text-tertiary)]">{getText('students.referral.otherHint', 'Социальные сети')}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReferralSystem

