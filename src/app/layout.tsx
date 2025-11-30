import type { Metadata } from 'next'
import Script from 'next/script'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { AuthProviderWrapper } from '@/components/providers/AuthProviderWrapper'
import I18nProvider from '@/components/providers/I18nProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'

export const metadata: Metadata = {
  title: 'Bilimpoz Teacher',
  description: 'Сервис для преподавателей Bilimpoz',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* Блокирующий скрипт для установки темы ДО загрузки CSS - предотвращает мигание */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('bilimpoz-theme');
                  // Тёмная тема по умолчанию, если данных нет
                  const theme = savedTheme || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {
                  // В случае ошибки устанавливаем тёмную тему по умолчанию
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased h-full">
        {/* Дополнительный скрипт через Next.js Script для гарантии выполнения */}
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('bilimpoz-theme');
                  const theme = savedTheme || 'dark';
                  if (document.documentElement.getAttribute('data-theme') !== theme) {
                    document.documentElement.setAttribute('data-theme', theme);
                  }
                } catch (e) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                }
              })();
            `,
          }}
        />
        <ThemeProvider>
          <I18nProvider>
            <AuthProviderWrapper>
              {children}
            </AuthProviderWrapper>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

