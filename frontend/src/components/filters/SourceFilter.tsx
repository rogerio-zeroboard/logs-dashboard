'use client'

import { formatSource } from '@/lib/utils'

import DropdownFilter from './DropdownFilter'

interface SourceFilterProps {
  value?: string
  sources: string[]
  onChange: (filters: Record<string, string | undefined>) => void
}

export default function SourceFilter({ value, sources, onChange }: SourceFilterProps) {
  const options = sources.map((src) => ({ label: formatSource(src), value: src }))

  return (
    <DropdownFilter
      label="Source"
      value={value}
      options={options}
      onChange={(v) => onChange({ source: v })}
    />
  )
}
