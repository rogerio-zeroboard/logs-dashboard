'use client'

import { useRouter } from 'next/navigation'

import Badge, { getSeverityVariant } from '@/components/ui/Badge'
import { TableSkeleton } from '@/components/ui/Skeleton'
import { formatTimestamp, formatSource } from '@/lib/utils'
import { SEVERITY_ICONS } from '@/lib/constants'
import type { Log } from '@/lib/types'

interface LogTableProps {
  logs: Log[]
  loading?: boolean
}

export default function LogTable({ logs, loading }: LogTableProps) {
  const router = useRouter()

  if (loading) return <TableSkeleton />

  if (logs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <p className="has-text-grey">No logs found</p>
      </div>
    )
  }

  return (
    <div className="table-container">
      <table className="table is-fullwidth is-hoverable is-striped">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Severity</th>
            <th>Source</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr
              key={log.id}
              onClick={() => router.push(`/logs/${log.id}`)}
              className="is-clickable"
            >
              <td className="is-size-7">{formatTimestamp(log.timestamp)}</td>
              <td>
                <Badge variant={getSeverityVariant(log.severity)}>
                  {SEVERITY_ICONS[log.severity]} {log.severity}
                </Badge>
              </td>
              <td className="has-text-grey-dark is-size-7">{formatSource(log.source)}</td>
              <td
                className="has-text-grey-dark is-size-7"
                style={{
                  maxWidth: '400px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {log.message}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
