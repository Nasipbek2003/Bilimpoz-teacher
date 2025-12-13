'use client'

import { useEffect } from 'react'

export default function PWAProvider() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Регистрируем Service Worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration.scope)
          
          // Проверяем обновления
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // Новая версия доступна
                  console.log('New version available! Please refresh.')
                  
                  // Можно показать уведомление пользователю
                  if (window.confirm('Доступна новая версия приложения. Обновить?')) {
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error)
        })

      // Слушаем сообщения от Service Worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Message from Service Worker:', event.data)
      })

      // Обработка установки PWA
      let deferredPrompt: any = null

      window.addEventListener('beforeinstallprompt', (e) => {
        console.log('PWA install prompt available')
        e.preventDefault()
        deferredPrompt = e
        
        // Можно показать кнопку установки
        showInstallButton()
      })

      window.addEventListener('appinstalled', () => {
        console.log('PWA was installed')
        deferredPrompt = null
        hideInstallButton()
      })

      const showInstallButton = () => {
        // Создаем кнопку установки PWA
        const installButton = document.createElement('button')
        installButton.id = 'pwa-install-button'
        installButton.innerHTML = '📱 Установить приложение'
        installButton.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          background: var(--bg-active-button);
          color: var(--text-active-button);
          border: none;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        `

        installButton.addEventListener('click', async () => {
          if (deferredPrompt) {
            deferredPrompt.prompt()
            const { outcome } = await deferredPrompt.userChoice
            console.log(`User response to the install prompt: ${outcome}`)
            deferredPrompt = null
            hideInstallButton()
          }
        })

        // Добавляем кнопку только если её ещё нет
        if (!document.getElementById('pwa-install-button')) {
          document.body.appendChild(installButton)
        }
      }

      const hideInstallButton = () => {
        const installButton = document.getElementById('pwa-install-button')
        if (installButton) {
          installButton.remove()
        }
      }

      // Проверяем, запущено ли приложение как PWA
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isIOSStandalone = (window.navigator as any).standalone === true

      if (isStandalone || isIOSStandalone) {
        console.log('App is running as PWA')
        document.body.classList.add('pwa-mode')
      }
    }
  }, [])

  return null
}
