import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'

vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart">{children}</div>
  ),
  Bar: () => null,
  PieChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie-chart">{children}</div>
  ),
  Pie: () => null,
  Cell: () => null,
}))

import FilterBar from '@/components/FilterBar'

describe('FilterBar', () => {
  it('renders filter controls', () => {
    const onFilterChange = vi.fn()

    render(<FilterBar onFilterChange={onFilterChange} />)

    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
    expect(screen.getByText(/severity/i)).toBeInTheDocument()
    expect(screen.getByText(/source/i)).toBeInTheDocument()
  })

  it('calls onFilterChange when search changes', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()

    render(<FilterBar onFilterChange={onFilterChange} />)

    const searchInput = screen.getByPlaceholderText(/search/i)

    await user.type(searchInput, 'test')

    await waitFor(() => expect(onFilterChange).toHaveBeenCalled(), { timeout: 500 })
  })

  it('shows clear button when filters are active', () => {
    const onFilterChange = vi.fn()

    render(<FilterBar onFilterChange={onFilterChange} initialFilters={{ severity: 'ERROR' }} />)

    expect(screen.getByText(/clear/i)).toBeInTheDocument()
  })

  it('hides search when showSearch is false', () => {
    const onFilterChange = vi.fn()

    render(<FilterBar onFilterChange={onFilterChange} showSearch={false} />)

    expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument()
  })
})
