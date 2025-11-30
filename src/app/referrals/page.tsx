'use client'

import React, { useState, useEffect } from 'react'
import TeacherLayout from '@/components/teacher/TeacherLayout'
import StatCard from '@/components/teacher/StatCard'
import StudentsFilter from '@/components/teacher/StudentsFilter'
import StudentCard from '@/components/teacher/StudentCard'
import ReferralSystem from '@/components/teacher/ReferralSystem'
import InviteMethods from '@/components/teacher/InviteMethods'
import { Icons } from '@/components/ui/Icons'
import { useTranslation } from '@/hooks/useTranslation'
import { StudentsPageSkeleton } from '@/components/ui/PageSkeletons'
import { apiRequest } from '@/lib/client-auth'

interface ReferralData {
  referralLink: string
  stats: {
    total: number
    registered: number
    paid: number
    adminPaid: number
  }
  referrals: Array<{
    id: string
    student: {
      id: string
      name: string
      profilePhotoUrl: string | null
      status: string
      registrationDate: string
    }
    status: string
    createdAt: string
  }>
}

export default function ReferralsPage() {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    loadReferralData()
  }, [])

  const loadReferralData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiRequest('/api/teacher/referral')
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки данных')
      }
      
      const data = await response.json()
      setReferralData(data)
    } catch (err) {
      console.error('❌ Ошибка загрузки реферальных данных:', err)
      setError('Не удалось загрузить данные')
    } finally {
      setLoading(false)
    }
  }

  // Статистика
  const stats = referralData ? referralData.stats : {
    total: 0,
    registered: 0,
    paid: 0,
    adminPaid: 0
  }

  // Получаем список рефералов
  const students = referralData?.referrals.map(r => ({
    id: r.student.id,
    name: r.student.name,
    registrationDate: r.student.registrationDate,
    status: r.status, // статус реферала: registered | paid | referral_paid
    profilePhotoUrl: r.student.profilePhotoUrl,
    activity7Days: 0, // TODO: добавить подсчет активности
    completedLessons: 0, // TODO: добавить подсчет уроков
    points: 0 // TODO: добавить подсчет баллов
  })) || []

  // Фильтрация и сортировка рефералов
  const filteredAndSortedStudents = students
    .filter(student => {
      // Фильтрация по статусу реферала
      let matchesStatus = true
      if (status === 'registered') {
        matchesStatus = student.status === 'registered' || student.status === 'paid' || student.status === 'referral_paid'
      } else if (status === 'paid') {
        matchesStatus = student.status === 'paid' || student.status === 'referral_paid'
      } else if (status === 'adminPaid') {
        matchesStatus = student.status === 'referral_paid'
      } else if (status !== 'all') {
        matchesStatus = student.status === status
      }
      
      return matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'registration_date':
          return new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
        case 'activity':
          return b.activity7Days - a.activity7Days
        case 'lessons':
          return b.completedLessons - a.completedLessons
        case 'points':
          return b.points - a.points
        default:
          return 0
      }
    })

  const handleClearFilters = () => {
    setStatus('all')
    setSortBy('name')
  }

  const handleViewDetails = (studentId: string) => {
    console.log('Просмотр деталей реферала:', studentId)
    // Здесь можно открыть модальное окно с деталями
  }

  const handleCopyLink = async () => {
    if (referralData?.referralLink) {
      try {
        // Проверяем доступность Clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(referralData.referralLink)
        } else {
          // Fallback для мобильных устройств и небезопасных контекстов
          const textArea = document.createElement('textarea')
          textArea.value = referralData.referralLink
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
        console.log('Ссылка скопирована в буфер обмена')
        // TODO: показать toast уведомление
      } catch (err) {
        console.error('Ошибка копирования:', err)
      }
    }
  }

  const handleInviteStudent = () => {
    console.log('Открыть модальное окно приглашения реферала')
    // Здесь можно открыть модальное окно для приглашения
  }

  if (!mounted || loading) {
    return (
      <TeacherLayout>
        <StudentsPageSkeleton />
      </TeacherLayout>
    )
  }

  if (error) {
    return (
      <TeacherLayout>
        <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] px-4">
          <div className="text-center max-w-md">
            <Icons.AlertCircle className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-500 mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-white mb-2">Ошибка загрузки</h3>
            <p className="text-sm sm:text-base text-gray-400 mb-4">{error}</p>
            <button
              onClick={loadReferralData}
              className="px-4 py-2 bg-[var(--bg-active-button)] text-white rounded-lg hover:bg-[var(--bg-hover)] transition-colors text-sm sm:text-base"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </TeacherLayout>
    )
  }

  // Fallback текст для предотвращения ошибок гидратации
  const getText = (key: string, fallback: string) => {
    if (!mounted || !ready) return fallback
    const translation = t(key)
    // Если перевод вернул ключ (не найден), используем fallback
    return translation === key ? fallback : translation
  }

  return (
    <TeacherLayout>
      <div className="space-y-4 sm:space-y-6 max-w-full">
        {/* Заголовок страницы */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {getText('students.title', 'Ученики')}
          </h1>
        </div>

        {/* Статистические карточки */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 w-full">
          <StatCard
            title={getText('students.stats.total', 'Всего участников')}
            value={stats.total}
            icon={Icons.Users}
            onClick={() => setStatus('all')}
          />
          <StatCard
            title={getText('students.stats.registered', 'Зарегистрированные')}
            value={stats.registered}
            icon={Icons.UserCheck}
            onClick={() => setStatus('registered')}
          />
          <StatCard
            title={getText('students.stats.paid', 'Оплаченные')}
            value={stats.paid}
            icon={Icons.CreditCard}
            onClick={() => setStatus('paid')}
          />
          <StatCard
            title={getText('students.stats.adminPaid', 'Оплаченные администратором')}
            value={stats.adminPaid}
            icon={Icons.ShieldCheck}
            onClick={() => setStatus('adminPaid')}
          />
        </div>

        {/* Реферальная система */}
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {getText('students.referral.title', 'Реферальная система')}
        </h1>
        {referralData && (
          <ReferralSystem
            referralLink={referralData.referralLink}
            totalClicks={0} // TODO: добавить подсчет кликов
            totalRegistrations={stats.total}
            onCopyLink={handleCopyLink}
          />
        )}

        {/* Способы приглашения */}
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {getText('students.referral.inviteMethods', 'Способы приглашения')}
        </h1>
        {referralData && (
          <InviteMethods referralLink={referralData.referralLink} />
        )}

        {/* Фильтры */}
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {getText('students.filters.title', 'Фильтры')}
        </h1>
        <StudentsFilter
          status={status}
          onStatusChange={setStatus}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onClearFilters={handleClearFilters}
        />

        {/* Список рефералов */}
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
          {getText('students.myReferrals', 'Мои рефералы')}
        </h1>
        <div className="space-y-4">
          {filteredAndSortedStudents.length === 0 ? (
            <div className="bg-[var(--bg-card)] rounded-2xl p-8 sm:p-12 text-center">
              <Icons.Users className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-[var(--text-tertiary)] mb-4" />
              <h3 className="text-base sm:text-lg font-medium text-[var(--text-primary)] mb-2">
                {getText('students.empty.title', 'Нет рефералов')}
              </h3>
              <p className="text-sm sm:text-base text-[var(--text-tertiary)] mb-4">
                {status !== 'all' 
                  ? getText('students.empty.noResults', 'По выбранным фильтрам рефералы не найдены')
                  : getText('students.empty.noStudents', 'Пока нет рефералов. Пригласите первого реферала!')
                }
              </p>
              {status === 'all' && (
                <button
                  onClick={handleInviteStudent}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-active-button)] text-[var(--text-active-button)] rounded-lg font-medium hover:bg-[var(--bg-hover)] transition-colors text-sm sm:text-base"
                >
                  <Icons.Plus className="h-4 w-4" />
                  {getText('students.empty.inviteButton', 'Пригласить реферала')}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>

        {/* Пагинация */}
        {filteredAndSortedStudents.length > 0 && (
          <div className="flex items-center justify-center gap-2 sm:gap-2 pb-[calc(var(--bottom-nav-height)+var(--safe-area-bottom)+16px)] lg:pb-0">
            <button 
              disabled 
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[var(--bg-tertiary)] rounded-lg text-[var(--text-tertiary)] opacity-50 cursor-not-allowed text-sm sm:text-base"
            >
              <span className="hidden sm:inline">{getText('students.pagination.previous', 'Предыдущая')}</span>
              <span className="sm:hidden">{getText('students.pagination.prev', 'Пред')}</span>
            </button>
            <button className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[var(--bg-active-button)] text-[var(--text-active-button)] rounded-lg font-medium text-sm sm:text-base min-w-[36px] sm:min-w-[44px]">
              1
            </button>
            <button 
              disabled 
              className="px-3 sm:px-4 py-2 sm:py-2.5 bg-[var(--bg-tertiary)] rounded-lg text-[var(--text-tertiary)] opacity-50 cursor-not-allowed text-sm sm:text-base"
            >
              <span className="hidden sm:inline">{getText('students.pagination.next', 'Следующая')}</span>
              <span className="sm:hidden">{getText('students.pagination.next_short', 'След')}</span>
            </button>
          </div>
        )}
      </div>
    </TeacherLayout>
  )
}

