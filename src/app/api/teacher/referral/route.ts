import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getSetting } from '@/lib/settings'

/**
 * GET /api/teacher/referral
 * Получение или создание реферальной ссылки учителя
 */
export async function GET(request: NextRequest) {
  try {
    const user = await auth(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Не авторизован' },
        { status: 401 }
      )
    }

    // Проверяем, что пользователь - учитель
    if (user.role !== 'teacher') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    // Проверяем, существует ли уже реферальная ссылка для этого учителя
    let referralLink = await prisma.referral_links.findFirst({
      where: {
        teacher_id: user.id
      }
    })

    // Если нет, создаем новую (храним только user_id)
    if (!referralLink) {
      referralLink = await prisma.referral_links.create({
        data: {
          teacher_id: user.id,
          referral_link: user.id // Храним только user_id
        }
      })
    }

    // Получаем URL студенческого сервера из настроек для формирования полной ссылки
    const studentWebServerUrl = await getSetting('STUDENT_WEB_SERVER_URL', 'https://bilimpoz.kg')
    const fullReferralLink = `${studentWebServerUrl}/register?ref=${referralLink.referral_link}`

    // Получаем статистику по рефералам
    const referrals = await prisma.teacher_referrals.findMany({
      where: {
        referral_link_id: referralLink.id
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            profile_photo_url: true,
            status: true,
            created_at: true
          }
        }
      }
    })

    // Подсчет статистики
    const totalReferrals = referrals.length
    const registeredReferrals = referrals.filter(r => 
      r.status === 'registered' || r.status === 'paid' || r.status === 'referral_paid'
    ).length
    const paidReferrals = referrals.filter(r => {
      const status = r.status as 'paid' | 'referral_paid' | 'registered'
      return status === 'paid' || status === 'referral_paid'
    }).length
    const adminPaidReferrals = referrals.filter(r => {
      const status = r.status as 'paid' | 'referral_paid' | 'registered'
      return status === 'referral_paid'
    }).length

    return NextResponse.json({
      referralLink: fullReferralLink, // Отправляем полную ссылку на фронтенд
      stats: {
        total: totalReferrals,
        registered: registeredReferrals,
        paid: paidReferrals,
        adminPaid: adminPaidReferrals
      },
      referrals: referrals.map(r => ({
        id: r.id,
        student: {
          id: r.student.id,
          name: r.student.name,
          profilePhotoUrl: r.student.profile_photo_url,
          status: r.student.status,
          registrationDate: r.student.created_at.toISOString()
        },
        status: r.status,
        createdAt: r.created_at.toISOString()
      }))
    })
  } catch (error) {
    console.error('❌ Ошибка получения реферальной ссылки:', error)
    
    if (error instanceof Error && error.message === 'DATABASE_CONNECTION_ERROR') {
      return NextResponse.json(
        { error: 'Не удается подключиться к базе данных' },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

