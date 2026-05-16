import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { useExportLogs } from '@/hooks/useExportLogs'
import { toast } from '@/components/ui/Toast'

vi.mock('@/components/ui/Toast', () => ({
  toast: vi.fn(),
}))

const originalFetch = global.fetch
const originalCreateObjectURL = global.URL.createObjectURL
const originalRevokeObjectURL = global.URL.revokeObjectURL
const originalCreateElement = document.createElement.bind(document)

describe('useExportLogs', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      blob: vi.fn().mockResolvedValue(new Blob(['id,timestamp,message,severity,source'])),
    } as unknown as Response)

    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:test-url')
    global.URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    global.fetch = originalFetch
    global.URL.createObjectURL = originalCreateObjectURL
    global.URL.revokeObjectURL = originalRevokeObjectURL
    vi.restoreAllMocks()
  })

  function mockAnchorClick() {
    const anchorClick = vi.fn()

    vi.spyOn(document, 'createElement').mockImplementation((tagName: string, options?: any) => {
      if (tagName === 'a') {
        return { click: anchorClick } as unknown as HTMLAnchorElement
      }

      return originalCreateElement(tagName, options)
    })

    return { anchorClick }
  }

  it('triggers CSV download with correct query params', async () => {
    const { anchorClick } = mockAnchorClick()

    const { result } = renderHook(() => useExportLogs())

    result.current.exportLogs({
      severity: 'ERROR',
      source: 'auth-service',
      start_date: '2024-01-01',
      end_date: '2024-01-31',
    })

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())

    const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0]

    expect(fetchCall[0]).toContain('/api/v1/logs/export')
    expect(fetchCall[0]).toContain('severity=ERROR')
    expect(fetchCall[0]).toContain('source=auth-service')
    expect(fetchCall[0]).toContain('start_date=2024-01-01')
    expect(fetchCall[0]).toContain('end_date=2024-01-31')

    await waitFor(() => expect(anchorClick).toHaveBeenCalled())
  })

  it('shows success toast when export completes', async () => {
    mockAnchorClick()

    const { result } = renderHook(() => useExportLogs())

    result.current.exportLogs({})

    await waitFor(() => expect(toast).toHaveBeenCalledWith('Export started', 'success'))
  })

  it('shows error toast when export fails', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useExportLogs())

    result.current.exportLogs({})

    await waitFor(() => expect(toast).toHaveBeenCalledWith('Export failed', 'error'))
  })

  it('toggles isExporting during the export lifecycle', async () => {
    let resolveFetch: () => void
    const fetchPromise = new Promise<void>((resolve) => {
      resolveFetch = resolve
    })

    global.fetch = vi.fn().mockReturnValue(
      fetchPromise.then(() => ({
        blob: vi.fn().mockResolvedValue(new Blob(['test'])),
      }))
    )

    mockAnchorClick()

    const { result } = renderHook(() => useExportLogs())

    expect(result.current.isExporting).toBe(false)

    result.current.exportLogs({})

    await waitFor(() => expect(result.current.isExporting).toBe(true))

    resolveFetch!()

    await waitFor(() => expect(result.current.isExporting).toBe(false))
  })

  it('skips undefined filter values in query params', async () => {
    const { result } = renderHook(() => useExportLogs())

    result.current.exportLogs({
      severity: 'INFO',
      source: undefined,
      start_date: undefined,
      end_date: undefined,
    })

    await waitFor(() => expect(global.fetch).toHaveBeenCalled())

    const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0]

    expect(fetchCall[0]).toContain('severity=INFO')
    expect(fetchCall[0]).not.toContain('source=')
    expect(fetchCall[0]).not.toContain('start_date=')
    expect(fetchCall[0]).not.toContain('end_date=')
  })
})
