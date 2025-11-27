'use client'

import React, { useState, useEffect } from 'react'
import TeacherLayout from '@/components/teacher/TeacherLayout'
import StatCard from '@/components/teacher/StatCard'
import StudentsFilter from '@/components/teacher/StudentsFilter'
import StudentCard from '@/components/teacher/StudentCard'
import ReferralSystem from '@/components/teacher/ReferralSystem'
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

export default function StudentsPage() {
  const { t, ready } = useTranslation()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
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

  // Получаем список студентов из рефералов
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

  // Фильтрация и сортировка учеников
  const filteredAndSortedStudents = students
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase())
      
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
      
      return matchesSearch && matchesStatus
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
    setSearch('')
    setStatus('all')
    setSortBy('name')
  }

  const handleViewDetails = (studentId: string) => {
    console.log('Просмотр деталей ученика:', studentId)
    // Здесь можно открыть модальное окно с деталями
  }

  const handleCopyLink = () => {
    if (referralData?.referralLink) {
      navigator.clipboard.writeText(referralData.referralLink)
      console.log('Ссылка скопирована в буфер обмена')
      // TODO: показать toast уведомление
    }
  }

  const handleInviteStudent = () => {
    console.log('Открыть модальное окно приглашения ученика')
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
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Icons.AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Ошибка загрузки</h3>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={loadReferralData}
              className="px-4 py-2 bg-[var(--bg-active-button)] text-white rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
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
    return t(key)
  }

  return (
    <TeacherLayout>
      <div className="space-y-6">
        {/* Заголовок страницы */}
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {getText('students.title', 'Ученики')}
          </h1>
          <p className="text-gray-400">
            {getText('students.description', 'Управление учениками и приглашение новых через реферальную систему')}
          </p>
        </div>

        {/* Статистические карточки */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        {referralData && (
          <ReferralSystem
            referralLink={referralData.referralLink}
            totalClicks={0} // TODO: добавить подсчет кликов
            totalRegistrations={stats.total}
            onCopyLink={handleCopyLink}
          />
        )}

        {/* Фильтры */}
        <StudentsFilter
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onClearFilters={handleClearFilters}
        />

        {/* Список учеников */}
        <div className="space-y-4">
          {filteredAndSortedStudents.length === 0 ? (
            <div className="bg-[var(--bg-card)] rounded-2xl p-12 text-center">
              <Icons.Users className="mx-auto h-12 w-12 text-[var(--text-tertiary)] mb-4" />
              <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
                {getText('students.empty.title', 'Нет учеников')}
              </h3>
              <p className="text-[var(--text-tertiary)] mb-4">
                {search || status !== 'all' 
                  ? getText('students.empty.noResults', 'По выбранным фильтрам ученики не найдены')
                  : getText('students.empty.noStudents', 'Пока нет учеников. Пригласите первого ученика!')
                }
              </p>
              {!search && status === 'all' && (
                <button
                  onClick={handleInviteStudent}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-active-button)] text-[var(--text-active-button)] rounded-lg font-medium hover:bg-[var(--bg-hover)] transition-colors"
                >
                  <Icons.Plus className="h-4 w-4" />
                  {getText('students.empty.inviteButton', 'Пригласить ученика')}
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
          <div className="flex items-center justify-center gap-2">
            <button 
              disabled 
              className="px-3 py-2 bg-[var(--bg-tertiary)] rounded-lg text-[var(--text-tertiary)] opacity-50 cursor-not-allowed"
            >
              {getText('students.pagination.previous', 'Предыдущая')}
            </button>
            <button className="px-3 py-2 bg-[var(--bg-active-button)] text-[var(--text-active-button)] rounded-lg font-medium">
              1
            </button>
            <button 
              disabled 
              className="px-3 py-2 bg-[var(--bg-tertiary)] rounded-lg text-[var(--text-tertiary)] opacity-50 cursor-not-allowed"
            >
              {getText('students.pagination.next', 'Следующая')}
            </button>
          </div>
        )}
      </div>
    </TeacherLayout>
  )
}

