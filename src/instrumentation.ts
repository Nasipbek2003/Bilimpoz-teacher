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
        console.log('🔧 Инициализация Telegram polling...')
        
        // Запускаем polling с задержкой для загрузки модулей
        setTimeout(async () => {
          try {
            const started = await telegramPolling.start()
            if (started) {
              console.log('✅ Telegram polling успешно запущен')
            } else {
              console.warn('⚠️ Не удалось запустить Telegram polling')
            }
          } catch (error) {
            console.error('❌ Ошибка при запуске Telegram polling:', error)
          }
        }, 1000)
      } else {
        console.warn('⚠️ TEACHER_BOT_TOKEN не установлен в БД, polling не будет запущен')
      }
    } catch (error) {
      console.error('❌ Ошибка при загрузке Telegram polling:', error)
    }
  }
}

