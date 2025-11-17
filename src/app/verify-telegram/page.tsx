'use client'

import React from 'react'
import TelegramVerificationForm from '@/components/auth/TelegramVerificationForm'

export default function VerifyTelegramPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#0b0b0b' }}
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <span className="text-[#0b0b0b] font-bold text-2xl">B</span>
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Bilimpoz Teachers
            </h1>
          </div>
          <p className="text-gray-400">
            Подтверждение входа через Telegram
          </p>
        </div>
        <TelegramVerificationForm />
      </div>
    </div>
  )
}