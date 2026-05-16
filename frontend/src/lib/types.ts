export interface Log {
  id: string
  timestamp: string
  message: string
  severity: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  source: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface AggregateResponse {
  trend: TrendPoint[]
  severity_distribution: SeverityCount[]
  source_distribution: SourceCount[]
  total_count: number
}

export interface TrendPoint {
  date: string
  count: number
  severity?: string
}

export interface SeverityCount {
  severity: string
  count: number
}

export interface SourceCount {
  source: string
  count: number
}

export interface HealthResponse {
  status: 'ok' | 'degraded'
  database: 'connected' | 'disconnected'
}

export interface IngestResponse {
  inserted: number
  source: string
  date_range: { start: string; end: string }
}

export interface LogFilters {
  page?: number
  page_size?: number
  severity?: string
  source?: string
  search?: string
  start_date?: string
  end_date?: string
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}
