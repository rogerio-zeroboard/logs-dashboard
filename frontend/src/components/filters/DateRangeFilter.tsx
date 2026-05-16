'use client'

import DropdownFilter from './DropdownFilter'
import { getDateRange } from '@/lib/dateUtils'

const DATE_RANGES = [
  { label: 'Today', value: 'today' },
  { label: 'This week', value: 'this_week' },
  { label: 'This month', value: 'this_month' },
  { label: 'Last 3 months', value: 'last_3_months' },
  { label: 'Last 6 months', value: 'last_6_months' },
  { label: 'Last 12 months', value: 'last_12_months' },
]

interface DateRangeFilterProps {
  value?: string
  onChange: (filters: Record<string, string | undefined>) => void
}

export default function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <DropdownFilter
      label="Date Range"
      value={value}
      options={DATE_RANGES}
      placeholder="All time"
      onChange={(v) => {
        const range = v ? getDateRange(v) : {}
        const change: Record<string, string | undefined> = {
          date_range: v,
          start_date: undefined,
          end_date: undefined,
        }

        if (range.start_date) change.start_date = range.start_date
        if (range.end_date) change.end_date = range.end_date

        onChange(change)
      }}
    />
  )
}
