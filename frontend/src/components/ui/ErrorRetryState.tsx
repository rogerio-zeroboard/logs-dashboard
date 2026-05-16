import Button from './Button'

interface ErrorRetryStateProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorRetryState({
  message = 'Failed to load data. Please try again.',
  onRetry,
}: ErrorRetryStateProps) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 0' }}>
      <p className="has-text-danger">{message}</p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} style={{ marginTop: '1rem' }}>
          Retry
        </Button>
      )}
    </div>
  )
}
