'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'

import Badge, { getSeverityVariant } from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import DetailField from '@/components/ui/DetailField'
import { Log } from '@/lib/types'
import { formatTimestamp, formatSource } from '@/lib/utils'
import { SEVERITY_ICONS } from '@/lib/constants'

interface LogDetailViewProps {
  log: Log
  onEdit: () => void
  onDelete: () => void
}

export default function LogDetailView({ log, onEdit, onDelete }: LogDetailViewProps) {
  const router = useRouter()

  return (
    <div className="section">
      <div className="container" style={{ maxWidth: '48rem' }}>
        <button onClick={() => router.push('/logs')} className="button is-ghost has-text-grey-dark">
          <ArrowLeft size={16} style={{ marginRight: '0.25rem' }} />
          Back to logs
        </button>

        <div className="box" style={{ marginTop: '1rem' }}>
          <div className="level">
            <div className="level-left">
              <h1 className="title is-2">Log Details</h1>
            </div>
            <div className="level-right">
              <div className="buttons">
                <Button variant="primary-outlined" onClick={onEdit}>
                  <Pencil size={16} style={{ marginRight: '0.25rem' }} />
                  Edit
                </Button>
                <Button variant="danger-outlined" onClick={onDelete}>
                  <Trash2 size={16} style={{ marginRight: '0.25rem' }} />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <DetailField label="Timestamp" value={formatTimestamp(log.timestamp)} />
            <DetailField label="Severity">
              <Badge variant={getSeverityVariant(log.severity)}>
                {SEVERITY_ICONS[log.severity]} {log.severity}
              </Badge>
            </DetailField>
            <DetailField label="Source">
              <Badge variant="default">{formatSource(log.source)}</Badge>
            </DetailField>
            <DetailField label="Message">
              <p className="has-text-grey-dark is-size-7" style={{ whiteSpace: 'pre-wrap' }}>
                {log.message}
              </p>
            </DetailField>
            <DetailField label="ID">
              <p className="has-text-grey is-size-7" style={{ fontFamily: 'monospace' }}>
                {log.id}
              </p>
            </DetailField>
          </div>
        </div>
      </div>
    </div>
  )
}
