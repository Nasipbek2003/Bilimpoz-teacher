export async function register() {
  // Этот код выполняется только на сервере при старте Next.js
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      // Динамически импортируем для избежания проблем с SSR
      const { telegramPolling } = await import('@/lib/telegram-polling')
      const { getTeacherBotToken } = await import('@/lib/settings')
      
      // Проверяем наличие токена бота в БД
      const botToken = await getTeacherBotToken()
      if (botToken) {
        console.log('🔧 Telegram bot token найден')
        
        // Автоматический запуск polling в development режиме
        if (process.env.NODE_ENV === 'development') {
          // Проверяем, не запущен ли уже polling
          if (telegramPolling.isActive) {
            console.log('⚠️ Telegram polling уже активен, пропускаем автоматический запуск')
          } else {
            console.log('🚀 Автоматический запуск Telegram polling...')
            const startResult = await telegramPolling.start()
            if (startResult) {
              console.log('✅ Telegram polling запущен автоматически')
            } else {
              console.log('❌ Ошибка автоматического запуска polling')
              console.log('💡 Возможные причины:')
              console.log('   - Другой экземпляр приложения уже использует polling')
              console.log('   - Активный webhook')
              console.log('   - Проблемы с токеном бота')
              console.log('💡 Для ручного запуска используйте: POST /api/telegram/polling-control с action: "start"')
              console.log('💡 Для очистки конфликтов используйте: POST /api/telegram/force-clear')
            }
          }
        } else {
          console.log('💡 Для запуска polling используйте: POST /api/telegram/polling-control с action: "start"')
        }
        console.log('💡 Для остановки polling используйте: POST /api/telegram/polling-control с action: "stop"')
      } else {
        console.warn('⚠️ TEACHER_BOT_TOKEN не установлен в БД')
      }
    } catch (error) {
      console.error('❌ Ошибка при загрузке Telegram polling:', error)
    }
  }
}

