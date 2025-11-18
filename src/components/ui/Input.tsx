'use client'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
}

const Input: React.FC<InputProps> = ({
  error = false,
  className = '',
  ...props
}) => {
  return (
    <input
      className={`
        w-full px-4 py-2.5 rounded-xl border text-sm
        bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)]
        focus:outline-none
        transition-all duration-300 ease-in-out
        ${error 
          ? 'border-red-400 focus:border-red-400' 
          : 'border-[var(--border-primary)] hover:border-[var(--border-secondary)] focus:border-[var(--accent-primary)]'
        }
        ${className}
      `}
      {...props}
    />
  )
}

export default Input






