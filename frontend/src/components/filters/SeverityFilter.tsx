'use client'

import DropdownFilter from './DropdownFilter'

const SEVERITY_OPTIONS = [
  { label: 'DEBUG', value: 'DEBUG' },
  { label: 'INFO', value: 'INFO' },
  { label: 'WARNING', value: 'WARNING' },
  { label: 'ERROR', value: 'ERROR' },
  { label: 'CRITICAL', value: 'CRITICAL' },
]

interface SeverityFilterProps {
  value?: string
  onChange: (filters: Record<string, string | undefined>) => void
}

export default function SeverityFilter({ value, onChange }: SeverityFilterProps) {
  return (
    <DropdownFilter
      label="Severity"
      value={value}
      options={SEVERITY_OPTIONS}
      onChange={(v) => onChange({ severity: v })}
    />
  )
}
