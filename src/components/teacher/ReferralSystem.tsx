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
      // Проверяем доступность Clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(referralLink)
      } else {
        // Fallback для мобильных устройств и небезопасных контекстов
        const textArea = document.createElement('textarea')
        textArea.value = referralLink
        textArea.style.position = 'fixed'
        textArea.style.left = '-9999px'
        textArea.style.top = '-9999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        try {
          document.execCommand('copy')
        } finally {
          document.body.removeChild(textArea)
        }
      }
      
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
    const translation = t(key)
    // Если перевод вернул ключ (не найден), используем fallback
    return translation === key ? fallback : translation
  }

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-6 overflow-hidden">
      {/* Реферальная ссылка */}
      <div className="bg-[var(--bg-tertiary)] rounded-lg p-4 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
          <h4 className="font-medium text-[var(--text-primary)]">{getText('students.referral.linkTitle', 'Ваша реферальная ссылка')}</h4>
          <div className="flex items-center gap-2">
            <Icons.Link className="h-4 w-4 text-[var(--text-tertiary)]" />
            <span className="text-sm text-[var(--text-tertiary)]">{getText('students.referral.shareHint', 'Поделитесь с учениками')}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 bg-[var(--bg-card)] rounded-lg px-4 py-3 border border-[var(--border-primary)] overflow-hidden min-w-0">
            <p className="text-sm text-[var(--text-secondary)] font-mono truncate sm:break-all sm:whitespace-normal">
              {referralLink}
            </p>
          </div>
          
          <Button
            variant={copied ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleCopyLink}
            className="whitespace-nowrap py-3 w-full sm:w-auto flex-shrink-0"
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
    </div>
  )
}

export default ReferralSystem

