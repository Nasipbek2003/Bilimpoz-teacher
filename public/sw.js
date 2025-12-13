const CACHE_NAME = 'bilimpoz-teacher-v1'
const STATIC_CACHE_URLS = [
  '/',
  '/tests',
  '/referrals',
  '/settings',
  '/manifest.json'
]

// Установка Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .catch((error) => {
        console.error('Cache addAll failed:', error)
      })
  )
  self.skipWaiting()
})

// Активация Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// Обработка запросов
self.addEventListener('fetch', (event) => {
  // Пропускаем запросы к API и внешним ресурсам
  if (
    event.request.url.includes('/api/') ||
    event.request.url.includes('chrome-extension://') ||
    event.request.url.includes('moz-extension://') ||
    !event.request.url.startsWith(self.location.origin)
  ) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Возвращаем кэшированный ответ, если есть
        if (response) {
          return response
        }

        // Клонируем запрос
        const fetchRequest = event.request.clone()

        return fetch(fetchRequest).then((response) => {
          // Проверяем валидность ответа
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }

          // Клонируем ответ
          const responseToCache = response.clone()

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })

          return response
        }).catch(() => {
          // Возвращаем офлайн страницу для навигационных запросов
          if (event.request.destination === 'document') {
            return caches.match('/')
          }
        })
      })
  )
})

// Обработка push уведомлений (для будущего использования)
self.addEventListener('push', (event) => {
  console.log('Push received:', event)
  
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Открыть',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/icons/xmark.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Bilimpoz Teacher', options)
  )
})

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received.')

  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})
