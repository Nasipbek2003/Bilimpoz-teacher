'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Icons } from './Icons'

export interface SelectOption {
  value: string
  label: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
  error?: boolean
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Выберите опцию',
  className = '',
  disabled = false,
  error = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [position, setPosition] = useState<'bottom' | 'top'>('bottom')
  const selectRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      
      if (spaceBelow < 300 && spaceAbove > spaceBelow) {
        setPosition('top')
      } else {
        setPosition('bottom')
      }
    }
  }, [isOpen])

  const handleToggle = () => {
    if (disabled) return
    setIsOpen(!isOpen)
  }

  const handleSelect = (optionValue: string) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <div ref={selectRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--bg-select)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] focus:outline-none flex items-center justify-between transition-all border ${
          error 
            ? 'border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-400/20' 
            : 'border-[var(--border-primary)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span className={selectedOption ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <Icons.ChevronDown 
          className={`h-4 w-4 text-[var(--text-tertiary)] transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute left-0 right-0 z-50 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg shadow-xl max-h-[300px] overflow-y-auto transition-all ${
            position === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option.value)}
              className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--bg-hover)] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                option.value === value 
                  ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Select






