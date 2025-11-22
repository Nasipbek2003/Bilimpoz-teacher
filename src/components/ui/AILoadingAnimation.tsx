'use client'

import React from 'react'

interface AILoadingAnimationProps {
  isActive: boolean
  size?: number
}

export function AILoadingAnimation({ isActive, size = 28 }: AILoadingAnimationProps) {
  if (!isActive) return null

  return (
    <div className="w-10 h-10 flex items-center justify-center">
      <div 
        className="loader-circle"
        style={{ width: size, height: size }}
      />
      <style jsx>{`
        .loader-circle {
          width: ${size}px;
          height: ${size}px;
          flex-shrink: 0;
          border-radius: 50%;
          background-color: transparent;
          animation: loader-combined 2.3s linear infinite;
        }
        @keyframes loader-combined {
          0% {
            transform: rotate(90deg);
            box-shadow:
              0 2.5px 5px 0 #a78bfa inset,
              0 5px 7.5px 0 #8b5cf6 inset,
              0 15px 15px 0 #7c3aed inset,
              0 0 1.2px 0.5px rgba(167, 139, 250, 0.3),
              0 0 2.4px 0.75px rgba(139, 92, 246, 0.2);
          }
          25% {
            transform: rotate(180deg);
            box-shadow:
              0 2.5px 5px 0 #c4b5fd inset,
              0 5px 7.5px 0 #a78bfa inset,
              0 15px 15px 0 #8b5cf6 inset,
              0 0 2.4px 1px rgba(167, 139, 250, 0.3),
              0 0 4.8px 1.5px rgba(139, 92, 246, 0.2),
              0 0 7.2px 2.5px rgba(124, 58, 237, 0.15);
          }
          50% {
            transform: rotate(270deg);
            box-shadow:
              0 2.5px 5px 0 #ddd6fe inset,
              0 5px 2.5px 0 #a78bfa inset,
              0 10px 15px 0 #8b5cf6 inset,
              0 0 1.2px 0.5px rgba(167, 139, 250, 0.3),
              0 0 2.4px 0.75px rgba(139, 92, 246, 0.2);
          }
          75% {
            transform: rotate(360deg);
            box-shadow:
              0 2.5px 5px 0 #c4b5fd inset,
              0 5px 7.5px 0 #a78bfa inset,
              0 15px 15px 0 #8b5cf6 inset,
              0 0 2.4px 1px rgba(167, 139, 250, 0.3),
              0 0 4.8px 1.5px rgba(139, 92, 246, 0.2),
              0 0 7.2px 2.5px rgba(124, 58, 237, 0.15);
          }
          100% {
            transform: rotate(450deg);
            box-shadow:
              0 2.5px 5px 0 #a78bfa inset,
              0 5px 7.5px 0 #8b5cf6 inset,
              0 15px 15px 0 #7c3aed inset,
              0 0 1.2px 0.5px rgba(167, 139, 250, 0.3),
              0 0 2.4px 0.75px rgba(139, 92, 246, 0.2);
          }
        }
      `}</style>
    </div>
  )
}


