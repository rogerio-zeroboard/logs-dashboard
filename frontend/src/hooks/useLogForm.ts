import { useState, useCallback } from 'react'

export interface LogFormData {
  timestamp: string
  message: string
  severity: string
  source: string
}

export function useLogForm(initial?: Partial<LogFormData>) {
  const [formData, setFormData] = useState<LogFormData>({
    timestamp: initial?.timestamp
      ? new Date(initial.timestamp).toISOString().slice(0, 16)
      : new Date().toISOString().slice(0, 16),
    message: initial?.message || '',
    severity: initial?.severity || 'INFO',
    source: initial?.source || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const setField = useCallback(<K extends keyof LogFormData>(field: K, value: LogFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  const validate = useCallback(() => {
    const next: Record<string, string> = {}
    if (!formData.message.trim()) next.message = 'Message is required'
    if (!formData.source.trim()) next.source = 'Source is required'
    if (!formData.timestamp) next.timestamp = 'Timestamp is required'
    setErrors(next)
    return Object.keys(next).length === 0
  }, [formData])

  const toPayload = useCallback(
    () => ({
      ...formData,
      timestamp: new Date(formData.timestamp).toISOString(),
    }),
    [formData]
  )

  return { formData, errors, setField, validate, toPayload }
}
