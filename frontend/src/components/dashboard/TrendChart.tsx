'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

import type { TrendPoint } from '@/lib/types'
import { SEVERITY_COLORS } from '@/lib/constants'
import ChartEmptyState from './ChartEmptyState'

interface TrendChartProps {
  data: TrendPoint[]
}

export default function TrendChart({ data }: TrendChartProps) {
  if (data.length === 0) {
    return <ChartEmptyState message="No trend data available" />
  }

  const groupedByDate = data.reduce<Record<string, Record<string, number>>>((acc, point) => {
    if (!acc[point.date]) acc[point.date] = {}

    acc[point.date][point.severity || 'unknown'] = point.count

    return acc
  }, {})

  const chartData = Object.entries(groupedByDate).map(([date, severities]) => ({
    date,
    ...severities,
  }))

  const severities = [...new Set(data.map((d) => d.severity).filter(Boolean))]

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#1f2937' }} />
        <YAxis
          tick={{ fontSize: 12, fill: '#1f2937' }}
          tickFormatter={(value) =>
            typeof value === 'number' ? value.toLocaleString() : String(value)
          }
        />
        <Tooltip
          formatter={(value) =>
            typeof value === 'number' ? value.toLocaleString() : String(value)
          }
        />
        <Legend />
        {severities.map((sev) => (
          <Line
            key={sev}
            type="monotone"
            dataKey={sev}
            stroke={SEVERITY_COLORS[sev || ''] || '#8884d8'}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
