'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

import type { SourceCount } from '@/lib/types'
import { formatSource } from '@/lib/utils'
import ChartEmptyState from './ChartEmptyState'

interface SourceDistributionProps {
  data: SourceCount[]
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function SourceDistribution({ data }: SourceDistributionProps) {
  if (data.length === 0) {
    return <ChartEmptyState message="No source data available" />
  }

  const chartData = data.map((d) => ({
    ...d,
    displayName: formatSource(d.source),
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="displayName"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, percent }: { name?: string; percent?: number }) =>
            `${name || 'Unknown'} (${((percent || 0) * 100).toFixed(0)}%)`
          }
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) =>
            typeof value === 'number' ? value.toLocaleString() : String(value)
          }
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
