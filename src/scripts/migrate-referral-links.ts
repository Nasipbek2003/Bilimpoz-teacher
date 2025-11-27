/**
 * Скрипт миграции реферальных ссылок
 * Преобразует полные URL в user_id
 * 
 * Запуск: npx tsx src/scripts/migrate-referral-links.ts
 */

import { prisma } from '../lib/prisma'

async function migrateReferralLinks() {
  console.log('🔄 Начинаем миграцию реферальных ссылок...')

  try {
    // Получаем все реферальные ссылки
    const referralLinks = await prisma.referral_links.findMany()

    console.log(`📊 Найдено ${referralLinks.length} реферальных ссылок`)

    let updated = 0
    let skipped = 0

    for (const link of referralLinks) {
      // Проверяем, является ли ссылка полным URL
      if (link.referral_link.includes('http') || link.referral_link.includes('/register?ref=')) {
        // Извлекаем user_id из ссылки
        // Формат: http://example.com/register?ref=USER_ID или /register?ref=USER_ID
        const match = link.referral_link.match(/ref=([^&]+)/)
        
        if (match && match[1]) {
          const userId = match[1]
          
          // Обновляем запись
          await prisma.referral_links.update({
            where: { id: link.id },
            data: { referral_link: userId }
          })
          
          console.log(`✅ Обновлено: ${link.referral_link} -> ${userId}`)
          updated++
        } else {
          console.log(`⚠️  Не удалось извлечь user_id из: ${link.referral_link}`)
          skipped++
        }
      } else {
        // Уже в правильном формате (только user_id)
        console.log(`✓ Пропущено (уже в правильном формате): ${link.referral_link}`)
        skipped++
      }
    }

    console.log('\n📈 Результаты миграции:')
    console.log(`   ✅ Обновлено: ${updated}`)
    console.log(`   ⏭️  Пропущено: ${skipped}`)
    console.log(`   📊 Всего: ${referralLinks.length}`)
    console.log('\n✨ Миграция завершена успешно!')

  } catch (error) {
    console.error('❌ Ошибка миграции:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Запускаем миграцию
migrateReferralLinks()



