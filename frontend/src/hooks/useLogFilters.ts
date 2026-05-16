import { useState, useCallback, useEffect, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface Filters {
  page: number
  page_size: number
  severity?: string
  source?: string
  search?: string
  date_range?: string
  start_date?: string
  end_date?: string
}

export function useLogFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [filters, setFilters] = useState<Filters>(() => ({
    page: Number(searchParams.get('page')) || 1,
    page_size: 20,
    severity: searchParams.get('severity') || undefined,
    source: searchParams.get('source') || undefined,
    search: searchParams.get('search') || undefined,
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

    if (filters.page && filters.page > 1) params.set('page', String(filters.page))

    if (filters.severity) params.set('severity', filters.severity)

    if (filters.source) params.set('source', filters.source)

    if (filters.search) params.set('search', filters.search)

    if (filters.start_date) params.set('start_date', filters.start_date)

    if (filters.end_date) params.set('end_date', filters.end_date)

    const query = params.toString()

    router.push(query ? `/logs?${query}` : '/logs', { scroll: false })
  }, [filters, router])

  const setFilter = useCallback((patch: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }))
  }, [])

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  return { filters, setFilter, setPage }
}
