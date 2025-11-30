'use client'

import React, { useState, useEffect } from 'react'
import { Icons } from '@/components/ui/Icons'
import { useTranslation } from '@/hooks/useTranslation'

interface Student {
  id: string
  name: string
  registrationDate: string
  activity7Days: number
  completedLessons: number
  status: string // статус реферала: registered | paid | referral_paid
  points: number
  profilePhotoUrl?: string | null
}

interface StudentCardProps {
  student: Student
  onViewDetails: (studentId: string) => void
}

const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onViewDetails
}) => {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  const getStatusConfig = (status: string) => {
    // Определяем цвет и текст для статуса реферала
    if (!mounted || !ready) {
      // Fallback значения до готовности переводов
      switch (status) {
        case 'registered':
          return {
            label: 'Зарегистрирован',
            bgColor: 'bg-blue-500/10',
            textColor: 'text-blue-400',
            borderColor: 'border-blue-500/20'
          }
        case 'paid':
          return {
            label: 'Оплачен',
            bgColor: 'bg-green-500/10',
            textColor: 'text-green-400',
            borderColor: 'border-green-500/20'
          }
        case 'referral_paid':
          return {
            label: 'Оплачен администратором',
            bgColor: 'bg-purple-500/10',
            textColor: 'text-purple-400',
            borderColor: 'border-purple-500/20'
          }
        default:
          return {
            label: 'Неизвестно',
            bgColor: 'bg-gray-500/10',
            textColor: 'text-gray-400',
            borderColor: 'border-gray-500/20'
          }
      }
    }
    
    switch (status) {
      case 'registered':
        return {
          label: t('students.card.status.registered'),
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-400',
          borderColor: 'border-blue-500/20'
        }
      case 'paid':
        return {
          label: t('students.card.status.paid'),
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-400',
          borderColor: 'border-green-500/20'
        }
      case 'referral_paid':
        return {
          label: t('students.card.status.referral_paid'),
          bgColor: 'bg-purple-500/10',
          textColor: 'text-purple-400',
          borderColor: 'border-purple-500/20'
        }
      default:
        return {
          label: t('students.card.status.unknown'),
          bgColor: 'bg-gray-500/10',
          textColor: 'text-gray-400',
          borderColor: 'border-gray-500/20'
        }
    }
  }

  const statusConfig = getStatusConfig(student.status)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  // Fallback значения для предотвращения ошибок гидратации
  const getText = (key: string, fallback: string) => {
    if (!mounted || !ready) return fallback
    return t(key)
  }

  return (
    <div className="bg-[var(--bg-card)] rounded-2xl p-4 sm:p-6 hover:bg-[var(--bg-hover)] transition-colors overflow-hidden">
      {/* Мобильная версия */}
      <div className="lg:hidden space-y-3">
        {/* Верхняя часть: Аватар, имя */}
        <div className="flex items-center gap-3">
          {/* Аватар */}
          <div className="w-12 h-12 bg-[var(--bg-active)] rounded-full flex items-center justify-center flex-shrink-0">
            {student.profilePhotoUrl ? (
              <img 
                src={student.profilePhotoUrl} 
                alt={student.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <Icons.User className="h-6 w-6 text-[var(--text-primary)]" />
            )}
          </div>
          
          {/* Имя */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-[var(--text-primary)] truncate">{student.name}</h3>
          </div>
        </div>

        {/* Статус и дата регистрации в одной строке */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} whitespace-nowrap`}>
            {statusConfig.label}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
            <Icons.Calendar className="h-3.5 w-3.5 flex-shrink-0" />
            <span>{formatDate(student.registrationDate)}</span>
          </div>
        </div>

        {/* Статистика */}
        <div className="pt-3 border-t border-[var(--border-primary)]">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-2.5 text-center">
              <p className="text-lg font-bold text-[var(--text-primary)] mb-0.5">{student.activity7Days}</p>
              <p className="text-[10px] text-[var(--text-tertiary)] leading-tight">Активность</p>
            </div>
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-2.5 text-center">
              <p className="text-lg font-bold text-[var(--text-primary)] mb-0.5">{student.completedLessons}</p>
              <p className="text-[10px] text-[var(--text-tertiary)] leading-tight">Уроков</p>
            </div>
            <div className="bg-[var(--bg-tertiary)] rounded-lg p-2.5 text-center">
              <p className="text-lg font-bold text-[var(--text-primary)] mb-0.5">{student.points.toLocaleString()}</p>
              <p className="text-[10px] text-[var(--text-tertiary)] leading-tight">Баллы</p>
            </div>
          </div>
        </div>
      </div>

      {/* Десктоп версия */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Аватар */}
        <div className="w-12 h-12 bg-[var(--bg-active)] rounded-full flex items-center justify-center flex-shrink-0">
          {student.profilePhotoUrl ? (
            <img 
              src={student.profilePhotoUrl} 
              alt={student.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <Icons.User className="h-6 w-6 text-[var(--text-primary)]" />
          )}
        </div>
        
        {/* Имя, статус и дата */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <h3 className="font-semibold text-base text-[var(--text-primary)]">{student.name}</h3>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor} whitespace-nowrap`}>
              {statusConfig.label}
            </span>
          </div>
          <p className="text-sm text-[var(--text-tertiary)]">
            {formatDate(student.registrationDate)}
          </p>
        </div>

        {/* Статистика */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <div className="text-center min-w-[80px]">
            <p className="text-lg font-bold text-[var(--text-primary)]">{student.activity7Days}</p>
            <p className="text-xs text-[var(--text-tertiary)]">{getText('students.card.activity7Days', 'Активность (7 дней)')}</p>
          </div>
          <div className="text-center min-w-[80px]">
            <p className="text-lg font-bold text-[var(--text-primary)]">{student.completedLessons}</p>
            <p className="text-xs text-[var(--text-tertiary)]">{getText('students.card.lessons', 'Уроков')}</p>
          </div>
          <div className="text-center min-w-[80px]">
            <p className="text-lg font-bold text-[var(--text-primary)]">{student.points.toLocaleString()}</p>
            <p className="text-xs text-[var(--text-tertiary)]">{getText('students.card.points', 'Баллы')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentCard

