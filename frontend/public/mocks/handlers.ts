import { http, HttpResponse } from 'msw'

const API_BASE = 'http://localhost:8000'

const mockLogs = [
  {
    id: '1',
    timestamp: '2024-01-15T10:30:00Z',
    message: 'User login successful',
    severity: 'INFO',
    source: 'auth-service',
  },
  {
    id: '2',
    timestamp: '2024-01-15T11:00:00Z',
    message: 'Payment processing failed',
    severity: 'ERROR',
    source: 'payment-service',
  },
]

export const handlers = [
  http.get(`${API_BASE}/api/v1/health`, () => {
    return HttpResponse.json({ status: 'ok', database: 'connected' })
  }),

  http.get(`${API_BASE}/api/v1/logs`, ({ request }) => {
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1')
    const pageSize = parseInt(url.searchParams.get('page_size') || '20')
    const search = url.searchParams.get('search')

    let filtered = [...mockLogs]
    if (search) {
      filtered = filtered.filter((log) => log.message.toLowerCase().includes(search.toLowerCase()))
    }

    return HttpResponse.json({
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      page_size: pageSize,
      total_pages: Math.ceil(filtered.length / pageSize),
    })
  }),

  http.get(`${API_BASE}/api/v1/logs/:id`, ({ params }) => {
    const log = mockLogs.find((l) => l.id === params.id)
    if (!log) {
      return HttpResponse.json({ detail: 'Log not found' }, { status: 404 })
    }
    return HttpResponse.json(log)
  }),

  http.post(`${API_BASE}/api/v1/logs`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json({ id: 'new-id', ...body }, { status: 201 })
  }),

  http.put(`${API_BASE}/api/v1/logs/:id`, async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const log = mockLogs.find((l) => l.id === params.id)
    if (!log) {
      return HttpResponse.json({ detail: 'Log not found' }, { status: 404 })
    }
    return HttpResponse.json({ ...log, ...body })
  }),

  http.delete(`${API_BASE}/api/v1/logs/:id`, ({ params }) => {
    const log = mockLogs.find((l) => l.id === params.id)
    if (!log) {
      return HttpResponse.json({ detail: 'Log not found' }, { status: 404 })
    }
    return new HttpResponse(null, { status: 204 })
  }),

  http.get(`${API_BASE}/api/v1/logs/aggregate`, () => {
    return HttpResponse.json({
      trend: [
        { date: '2024-01-15', count: 10, severity: 'INFO' },
        { date: '2024-01-15', count: 5, severity: 'ERROR' },
      ],
      severity_distribution: [
        { severity: 'INFO', count: 10 },
        { severity: 'ERROR', count: 5 },
      ],
      source_distribution: [
        { source: 'auth-service', count: 10 },
        { source: 'payment-service', count: 5 },
      ],
      total_count: 15,
    })
  }),

  http.post(`${API_BASE}/api/v1/logs/ingest`, () => {
    return HttpResponse.json(
      {
        inserted: 500,
        source: 'billing-service',
        date_range: {
          start: '2024-01-01T00:00:00Z',
          end: '2024-01-31T23:59:59Z',
        },
      },
      { status: 201 }
    )
  }),
]
