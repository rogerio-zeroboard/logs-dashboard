import SummaryCard from './SummaryCard'
import { formatSource } from '@/lib/utils'

interface SummaryCardsProps {
  totalCount: number
  errorCount?: number
  topSource?: string
}

export default function SummaryCards({ totalCount, errorCount = 0, topSource }: SummaryCardsProps) {
  const errorRate = totalCount > 0 ? ((errorCount / totalCount) * 100).toFixed(1) : '0'

  return (
    <div className="columns">
      <SummaryCard
        label="Total Logs"
        value={totalCount.toLocaleString()}
        subtitle="matching current filters"
      />
      <SummaryCard
        label="Error Rate"
        value={`${errorRate}%`}
        subtitle={`${errorCount.toLocaleString()} ${errorCount === 1 ? 'error' : 'errors'}`}
        className="has-text-danger"
      />
      <SummaryCard
        label="Most Active Source"
        value={
          <span
            style={{
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {topSource ? formatSource(topSource) : 'N/A'}
          </span>
        }
        subtitle="highest log volume"
      />
    </div>
  )
}
