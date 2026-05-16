'use client'

import { Suspense } from 'react'

import FilterBar from '@/components/FilterBar'
import TrendChart from '@/components/dashboard/TrendChart'
import SeverityHistogram from '@/components/dashboard/SeverityHistogram'
import SourceDistribution from '@/components/dashboard/SourceDistribution'
import SummaryCards from '@/components/dashboard/SummaryCards'
import ErrorRetryState from '@/components/ui/ErrorRetryState'
import { ChartSkeleton, SummaryCardsSkeleton } from '@/components/ui/Skeleton'
import { useDashboardData } from '@/hooks/useDashboardData'
import { useDashboardFilters } from '@/hooks/useDashboardFilters'
import { useAggregate, useSources } from '@/hooks/useLogs'

function DashboardContent() {
  const { filters, setFilter } = useDashboardFilters()
  const { data: aggregate, isLoading, isError, refetch } = useAggregate(filters)
  const { data: sources } = useSources()
  const { errorCount, topSource } = useDashboardData(aggregate)

  const handleFilterChange = (newFilters: Record<string, string | undefined>) => {
    setFilter(newFilters)
  }

  return (
    <div className="section">
      <div className="container">
        <FilterBar
          onFilterChange={handleFilterChange}
          showSearch={false}
          initialFilters={{
            severity: filters.severity,
            source: filters.source,
            date_range: filters.date_range,
            start_date: filters.start_date,
            end_date: filters.end_date,
          }}
          sources={sources}
        />

        {isError ? (
          <ErrorRetryState
            message="Failed to load dashboard data. Please try again."
            onRetry={refetch}
          />
        ) : (
          <>
            <div style={{ marginTop: '1.5rem' }}>
              {isLoading ? (
                <SummaryCardsSkeleton />
              ) : (
                <SummaryCards
                  totalCount={aggregate?.total_count || 0}
                  errorCount={errorCount}
                  topSource={topSource}
                />
              )}
            </div>

            <div className="columns" style={{ marginTop: '2rem' }}>
              <div className="column is-6">
                <div className="box">
                  <h2 className="title is-5">Log Trend Over Time</h2>
                  {isLoading ? <ChartSkeleton /> : <TrendChart data={aggregate?.trend || []} />}
                </div>
              </div>
              <div className="column is-6">
                <div className="box">
                  <h2 className="title is-5">Severity Distribution</h2>
                  {isLoading ? (
                    <ChartSkeleton />
                  ) : (
                    <SeverityHistogram data={aggregate?.severity_distribution || []} />
                  )}
                </div>
              </div>
            </div>

            <div className="box" style={{ marginTop: '1.5rem' }}>
              <h2 className="title is-5">Source Distribution</h2>
              {isLoading ? (
                <ChartSkeleton />
              ) : (
                <SourceDistribution data={aggregate?.source_distribution || []} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="section has-text-centered">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}
