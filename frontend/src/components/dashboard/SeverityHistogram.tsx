'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

import type { SeverityCount } from '@/lib/types'
import { SEVERITY_ORDER, SEVERITY_COLORS } from '@/lib/constants'
import ChartEmptyState from './ChartEmptyState'

interface SeverityHistogramProps {
  data: SeverityCount[]
}

export default function SeverityHistogram({ data }: SeverityHistogramProps) {
  if (data.length === 0) {
    return <ChartEmptyState message="No severity data available" />
  }

  const sortedData = SEVERITY_ORDER.map((sev) => data.find((d) => d.severity === sev))
    .filter(Boolean)
    .map((d) => ({
      severity: d!.severity,
      count: d!.count,
      fill: SEVERITY_COLORS[d!.severity] || '#8884d8',
    }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={sortedData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          tick={{ fontSize: 12, fill: '#1f2937' }}
          tickFormatter={(value) =>
            typeof value === 'number' ? value.toLocaleString() : String(value)
          }
        />
        <YAxis
          dataKey="severity"
          type="category"
          tick={{ fontSize: 12, fill: '#1f2937' }}
          width={80}
        />
        <Tooltip
          formatter={(value) =>
            typeof value === 'number' ? value.toLocaleString() : String(value)
          }
        />
        <Bar dataKey="count" radius={[0, 4, 4, 0]}>
          {sortedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
