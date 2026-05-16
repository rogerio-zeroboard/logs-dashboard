interface SummaryCardProps {
  label: string
  value: React.ReactNode
  subtitle: React.ReactNode
  className?: string
}

export default function SummaryCard({ label, value, subtitle, className = '' }: SummaryCardProps) {
  return (
    <div className="column">
      <div className="box">
        <p className="heading is-size-7">{label}</p>
        <p className={`title is-3 ${className}`}>{value}</p>
        <p className="has-text-grey-dark is-size-7">{subtitle}</p>
      </div>
    </div>
  )
}
