interface ChartEmptyStateProps {
  message?: string
}

export default function ChartEmptyState({ message = 'No data available' }: ChartEmptyStateProps) {
  return <div className="h-64 flex items-center justify-center text-gray-500">{message}</div>
}
