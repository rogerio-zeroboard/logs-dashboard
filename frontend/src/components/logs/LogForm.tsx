'use client'

import Button from '@/components/ui/Button'
import FormField from '@/components/ui/FormField'
import { toast } from '@/components/ui/Toast'
import { useCreateLog, useUpdateLog } from '@/hooks/useLogs'
import { useLogForm } from '@/hooks/useLogForm'

interface LogFormProps {
  initialData?: {
    id?: string
    timestamp?: string
    message?: string
    severity?: string
    source?: string
  }
  onSuccess?: () => void
  onCancel?: () => void
}

const SEVERITIES = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']

export default function LogForm({ initialData, onSuccess, onCancel }: LogFormProps) {
  const isEditing = !!initialData?.id
  const createLog = useCreateLog()
  const updateLog = useUpdateLog()

  const { formData, errors, setField, validate, toPayload } = useLogForm(initialData)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const payload = toPayload()

    try {
      if (isEditing && initialData?.id) {
        await updateLog.mutateAsync({ id: initialData.id, data: payload })
        toast('Log updated successfully', 'success')
      } else {
        await createLog.mutateAsync(payload)
        toast('Log created successfully', 'success')
      }

      onSuccess?.()
    } catch {
      toast('Failed to save log', 'error')
    }
  }

  const isPending = createLog.isPending || updateLog.isPending

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Timestamp" error={errors.timestamp}>
        <input
          type="datetime-local"
          value={formData.timestamp}
          onChange={(e) => setField('timestamp', e.target.value)}
          className={`input ${errors.timestamp ? 'is-danger' : ''}`}
        />
      </FormField>

      <FormField label="Severity">
        <div className="select is-fullwidth">
          <select value={formData.severity} onChange={(e) => setField('severity', e.target.value)}>
            {SEVERITIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </FormField>

      <FormField label="Source" error={errors.source}>
        <input
          type="text"
          value={formData.source}
          onChange={(e) =>
            setField(
              'source',
              e.target.value
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
            )
          }
          placeholder="e.g., auth-service"
          className={`input ${errors.source ? 'is-danger' : ''}`}
        />
      </FormField>

      <FormField label="Message" error={errors.message}>
        <textarea
          value={formData.message}
          onChange={(e) => setField('message', e.target.value)}
          rows={4}
          className={`textarea ${errors.message ? 'is-danger' : ''}`}
        />
      </FormField>

      <div className="field" style={{ display: 'flex', justifyContent: 'space-between' }}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" loading={isPending}>
          {isEditing ? 'Update Log' : 'Create Log'}
        </Button>
      </div>
    </form>
  )
}
