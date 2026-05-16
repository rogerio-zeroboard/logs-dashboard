'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface DropdownFilterProps {
  label: string
  value?: string
  options: { label: string; value: string }[]
  placeholder?: string
  onChange: (value: string | undefined) => void
}

export default function DropdownFilter({
  label,
  value,
  options,
  placeholder = 'All',
  onChange,
}: DropdownFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selected = options.find((o) => o.value === value)
  const displayLabel = selected ? selected.label : placeholder

  return (
    <div className="column is-narrow">
      <label className="label is-size-7">{label}</label>
      <div ref={ref} className={`dropdown ${isOpen ? 'is-active' : ''}`}>
        <div className="dropdown-trigger">
          <button
            className={`button is-primary-outlined ${isOpen ? 'is-active' : ''}`}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            style={{ minWidth: '10rem', justifyContent: 'space-between' }}
          >
            <span>{displayLabel}</span>
            <span
              className="icon is-small"
              style={{
                transform: isOpen ? 'rotate(180deg)' : undefined,
                transition: 'transform 0.2s ease',
              }}
            >
              <ChevronDown size={14} />
            </span>
          </button>
        </div>
        <div className="dropdown-menu">
          <div className="dropdown-content">
            <a
              className={`dropdown-item ${!value ? 'is-active' : ''}`}
              onClick={() => {
                onChange(undefined)
                setIsOpen(false)
              }}
            >
              {placeholder}
            </a>
            {options.map((opt) => (
              <a
                key={opt.value}
                className={`dropdown-item ${value === opt.value ? 'is-active' : ''}`}
                onClick={() => {
                  onChange(opt.value)
                  setIsOpen(false)
                }}
              >
                {opt.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
