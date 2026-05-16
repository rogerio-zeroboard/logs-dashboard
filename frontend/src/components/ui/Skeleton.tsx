interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export default function Skeleton({ className = '', style }: SkeletonProps) {
  return <div className={`skeleton ${className}`} style={{ height: '1rem', ...style }} />
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="box"
          style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}
        >
          <Skeleton style={{ width: '150px', height: '1rem' }} />
          <Skeleton style={{ width: '80px', height: '1rem' }} />
          <Skeleton style={{ width: '100px', height: '1rem' }} />
          <Skeleton style={{ flex: 1, height: '1rem' }} />
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div style={{ width: '100%', height }}>
      <Skeleton style={{ width: '100%', height: '100%' }} />
    </div>
  )
}

export function SummaryCardsSkeleton() {
  return (
    <div className="columns">
      <div className="column">
        <div className="box" style={{ height: '6rem' }} />
      </div>
      <div className="column">
        <div className="box" style={{ height: '6rem' }} />
      </div>
      <div className="column">
        <div className="box" style={{ height: '6rem' }} />
      </div>
    </div>
  )
}
