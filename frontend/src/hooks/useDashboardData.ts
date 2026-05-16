import { useMemo } from 'react'

import type { AggregateResponse } from '@/lib/types'

export function useDashboardData(aggregate?: AggregateResponse) {
  return useMemo(() => {
    const errorCount =
      aggregate?.severity_distribution
        ?.filter((s) => s.severity === 'ERROR' || s.severity === 'CRITICAL')
        .reduce((sum, s) => sum + s.count, 0) || 0

    const topSource = aggregate?.source_distribution?.[0]?.source

    return { errorCount, topSource }
  }, [aggregate])
}
