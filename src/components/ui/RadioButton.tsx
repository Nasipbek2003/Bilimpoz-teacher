'use client'

import React, { useEffect } from 'react'

interface RadioButtonProps {
  id: string
  name: string
  checked: boolean
  onChange: () => void
  label: string
}

const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  name,
  checked,
  onChange,
  label
}) => {
  useEffect(() => {
    // Добавляем глобальные стили для RadioButton при первом рендере
    if (typeof document !== 'undefined' && !document.getElementById('radio-button-styles')) {
      const style = document.createElement('style')
      style.id = 'radio-button-styles'
      style.textContent = `
        .radio-input:checked ~ .radio-check {
          border: 2px solid var(--text-primary) !important;
        }
        .radio-input:checked ~ .radio-check .radio-inside {
          background: var(--text-primary) !important;
        }
        .radio-input:checked ~ .radio-label {
          color: var(--text-primary) !important;
        }
        .radio-input:hover ~ .radio-check {
          border-color: #9CA3AF !important;
        }
        .radio-input:hover ~ .radio-label {
          color: var(--text-primary) !important;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  return (
    <div className="radio-button-wrapper relative">
      <input
        type="radio"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="radio-input absolute opacity-0 cursor-pointer w-0 h-0"
      />
      <div className="radio-check absolute top-1/2 left-0 -translate-y-1/2 w-6 h-6 rounded-full border-2 border-gray-500 transition-[border] duration-[250ms] ease-linear z-[5]">
        <div className="radio-inside absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[10px] h-[10px] rounded-full bg-transparent transition-[background] duration-[250ms] ease-linear" />
      </div>
      <label
        htmlFor={id}
        className="radio-label relative block text-sm font-normal pl-8 m-0 z-[9] cursor-pointer text-gray-400 transition-all duration-[250ms] ease-linear"
      >
        {label}
      </label>
    </div>
  )
}

export default RadioButton

