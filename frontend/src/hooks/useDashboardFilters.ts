import { useState, useCallback, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface DashboardFilters {
  severity?: string
  source?: string
  date_range?: string
  start_date?: string
  end_date?: string
}

export function useDashboardFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [filters, setFilters] = useState<DashboardFilters>(() => ({
    severity: searchParams.get('severity') || undefined,
    source: searchParams.get('source') || undefined,
    date_range: searchParams.get('date_range') || undefined,
    start_date: searchParams.get('start_date') || undefined,
    end_date: searchParams.get('end_date') || undefined,
  }))

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false

      return
    }

    const params = new URLSearchParams()

    if (filters.severity) params.set('severity', filters.severity)

    if (filters.source) params.set('source', filters.source)

    if (filters.date_range) params.set('date_range', filters.date_range)

    if (filters.start_date) params.set('start_date', filters.start_date)

    if (filters.end_date) params.set('end_date', filters.end_date)

    const query = params.toString()

    router.push(query ? `/dashboard?${query}` : '/dashboard', { scroll: false })
  }, [filters, router])

  const setFilter = useCallback((patch: Partial<DashboardFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
  }, [])

  return { filters, setFilter }
}
