import { useCallback, useState } from 'react'

import { api } from '@/lib/api'
import { toast } from '@/components/ui/Toast'

interface ExportFilters {
  severity?: string
  source?: string
  start_date?: string
  end_date?: string
}

export function useExportLogs() {
  const [isExporting, setIsExporting] = useState(false)

  const exportLogs = useCallback(async (filters: ExportFilters) => {
    const params: Record<string, string> = {}

    if (filters.severity) params.severity = filters.severity

    if (filters.source) params.source = filters.source

    if (filters.start_date) params.start_date = filters.start_date

    if (filters.end_date) params.end_date = filters.end_date

    setIsExporting(true)

    try {
      const res = await api.exportLogs(params)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')

      anchor.href = url
      anchor.download = 'logs.csv'
      anchor.click()
      URL.revokeObjectURL(url)

      toast('Export started', 'success')
    } catch {
      toast('Export failed', 'error')
    } finally {
      setIsExporting(false)
    }
  }, [])

  return { exportLogs, isExporting }
}
