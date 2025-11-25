'use client'

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface TooltipProps {
  text: string
  children: React.ReactNode
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState<'top' | 'bottom'>('top')
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({})
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const updatePosition = () => {
        if (!triggerRef.current || !tooltipRef.current) return

        const triggerRect = triggerRef.current.getBoundingClientRect()
        const tooltipRect = tooltipRef.current.getBoundingClientRect()
        const spaceAbove = triggerRect.top
        const spaceBelow = window.innerHeight - triggerRect.bottom

        const isTop = spaceBelow < tooltipRect.height && spaceAbove > spaceBelow
        setPosition(isTop ? 'top' : 'bottom')

        // Позиционирование относительно триггера
        const left = triggerRect.left + triggerRect.width / 2
        const top = isTop 
          ? triggerRect.top - tooltipRect.height - 8
          : triggerRect.bottom + 8

        setTooltipStyle({
          position: 'fixed',
          left: `${left}px`,
          top: `${top}px`,
          transform: 'translateX(-50%)',
          zIndex: 99999
        })
      }

      // Используем requestAnimationFrame для правильного позиционирования после рендера
      requestAnimationFrame(() => {
        requestAnimationFrame(updatePosition)
      })

      // Обновляем позицию при скролле и изменении размера окна
      window.addEventListener('scroll', updatePosition, true)
      window.addEventListener('resize', updatePosition)

      return () => {
        window.removeEventListener('scroll', updatePosition, true)
        window.removeEventListener('resize', updatePosition)
      }
    }
  }, [isVisible])

  return (
    <>
      <div
        ref={triggerRef}
        className="relative"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && typeof window !== 'undefined' && createPortal(
        <div
          ref={tooltipRef}
          className={`
            px-3 py-2 rounded-lg
            bg-[var(--bg-card)] border border-[var(--border-primary)]
            shadow-xl
            text-[var(--text-primary)] text-xs whitespace-nowrap
            pointer-events-none
          `}
          style={tooltipStyle}
        >
          {text}
          {/* Треугольный указатель */}
          <div
            className={`
              absolute left-1/2 transform -translate-x-1/2
              w-0 h-0 border-4 border-transparent
              ${position === 'top' 
                ? 'top-full' 
                : 'bottom-full'
              }
            `}
            style={{
              borderTopColor: position === 'top' ? 'var(--bg-card)' : 'transparent',
              borderBottomColor: position === 'bottom' ? 'var(--bg-card)' : 'transparent',
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
            }}
          />
        </div>,
        document.body
      )}
    </>
  )
}

export default Tooltip






