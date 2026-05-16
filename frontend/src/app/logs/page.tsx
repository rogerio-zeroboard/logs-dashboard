'use client'

import { Suspense } from 'react'

import FilterBar from '@/components/FilterBar'
import LogTable from '@/components/logs/LogTable'
import Pagination from '@/components/logs/Pagination'
import LogListHeader from '@/components/logs/LogListHeader'
import ErrorRetryState from '@/components/ui/ErrorRetryState'
import { useLogs, useSources } from '@/hooks/useLogs'
import { useLogFilters } from '@/hooks/useLogFilters'
import { useExportLogs } from '@/hooks/useExportLogs'

function LogListContent() {
  const { filters, setFilter, setPage } = useLogFilters()
  const { data, isLoading, isError, refetch } = useLogs(filters)
  const { data: sources } = useSources()
  const { exportLogs, isExporting } = useExportLogs()

  const handleFilterChange = (newFilters: Record<string, string | undefined>) => {
    setFilter(newFilters as Partial<typeof filters>)
  }

  const handleExport = () => {
    exportLogs({
      severity: filters.severity,
      source: filters.source,
      start_date: filters.start_date,
      end_date: filters.end_date,
    })
  }

  return (
    <div className="section">
      <div className="container">
        <LogListHeader onExport={handleExport} isExporting={isExporting} />

        <FilterBar
          key={`${filters.search}-${filters.severity}-${filters.source}-${filters.start_date}-${filters.end_date}`}
          onFilterChange={handleFilterChange}
          showSearch
          initialFilters={{
            search: filters.search,
            severity: filters.severity,
            source: filters.source,
            date_range: filters.date_range,
            start_date: filters.start_date,
            end_date: filters.end_date,
          }}
          sources={sources}
        />

        <div className="box" style={{ marginTop: '1.5rem', padding: 0, overflow: 'hidden' }}>
          {isError ? (
            <ErrorRetryState message="Failed to load logs. Please try again." onRetry={refetch} />
          ) : (
            <>
              <LogTable logs={data?.items || []} loading={isLoading} />
              {data && (
                <Pagination page={data.page} totalPages={data.total_pages} onPageChange={setPage} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function LogListPage() {
  return (
    <Suspense fallback={<div className="section has-text-centered">Loading...</div>}>
      <LogListContent />
    </Suspense>
  )
}
