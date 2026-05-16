'use client'

import { useState, useRef } from 'react'

import SeverityFilter from './filters/SeverityFilter'
import SourceFilter from './filters/SourceFilter'
import DateRangeFilter from './filters/DateRangeFilter'

interface FilterBarProps {
  onFilterChange: (filters: Record<string, string | undefined>) => void
  showSearch?: boolean
  initialFilters?: Record<string, string | number | undefined>
  sources?: string[]
}

function cleanFilters(
  filters: Record<string, string | number | undefined>
): Record<string, string | undefined> {
  const clean: Record<string, string | undefined> = {}

  for (const [k, v] of Object.entries(filters)) {
    clean[k] = v !== undefined && v !== '' ? String(v) : undefined
  }

  return clean
}

export default function FilterBar({
  onFilterChange,
  showSearch = true,
  initialFilters = {},
  sources = [],
}: FilterBarProps) {
  const [filters, setFilters] =
    useState<Record<string, string | number | undefined>>(initialFilters)
  const [searchText, setSearchText] = useState((initialFilters.search as string) || '')
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined && v !== '')

  const handleFilterChange = (updated: Record<string, string | undefined>) => {
    const newFilters = { ...filters, ...updated }

    setFilters(newFilters)
    onFilterChange(cleanFilters(newFilters))
  }

  const handleSearchChange = (value: string) => {
    setSearchText(value)
    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    debounceTimer.current = setTimeout(() => {
      handleFilterChange({ search: value || undefined })
    }, 300)
  }

  return (
    <div className="box">
      <div className="columns is-vcentered">
        {showSearch && (
          <div className="column">
            <label className="label is-size-7">&nbsp;</label>
            <input
              type="text"
              className="input"
              placeholder="Search logs by message..."
              value={searchText}
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </div>
        )}
        <SeverityFilter value={filters.severity as string} onChange={handleFilterChange} />
        <SourceFilter
          value={filters.source as string}
          sources={sources}
          onChange={handleFilterChange}
        />
        <DateRangeFilter value={filters.date_range as string} onChange={handleFilterChange} />
        {hasActiveFilters && (
          <div
            className="column is-narrow"
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              paddingBottom: '0.35rem',
            }}
          >
            <button
              className="button is-default is-text"
              style={{
                color: '#7a7a7a',
                backgroundColor: 'transparent',
                border: 'none',
              }}
              onClick={() => {
                const cleared = {
                  search: undefined,
                  severity: undefined,
                  source: undefined,
                  date_range: undefined,
                  start_date: undefined,
                  end_date: undefined,
                }

                setSearchText('')
                setFilters(cleared)
                onFilterChange(cleanFilters(cleared))
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#363636'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#7a7a7a'
              }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
