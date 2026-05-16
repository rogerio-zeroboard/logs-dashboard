import type {
  PaginatedResponse,
  Log,
  AggregateResponse,
  HealthResponse,
  IngestResponse,
} from '@/lib/types'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: 'Request failed' }))

    throw new ApiError(res.status, body.detail || 'Request failed')
  }

  if (res.status === 204) return undefined as T

  return res.json()
}

export const api = {
  health: () => request<HealthResponse>('/api/v1/health'),

  listLogs: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''

    return request<PaginatedResponse<Log>>(`/api/v1/logs${query}`)
  },

  getLog: (id: string) => request<Log>(`/api/v1/logs/${id}`),

  createLog: (data: { timestamp: string; message: string; severity: string; source: string }) =>
    request('/api/v1/logs', { method: 'POST', body: JSON.stringify(data) }),

  updateLog: (id: string, data: Record<string, unknown>) =>
    request(`/api/v1/logs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteLog: (id: string) => request(`/api/v1/logs/${id}`, { method: 'DELETE' }),

  getAggregate: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''

    return request<AggregateResponse>(`/api/v1/logs/aggregate${query}`)
  },

  getSources: () => request<string[]>('/api/v1/logs/sources'),

  exportLogs: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : ''

    return fetch(`${API_BASE}/api/v1/logs/export${query}`)
  },

  ingestLogs: () => request<IngestResponse>('/api/v1/logs/ingest', { method: 'POST' }),
}
