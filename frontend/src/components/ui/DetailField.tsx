interface DetailFieldProps {
  label: string
  value?: string
  children?: React.ReactNode
}

export default function DetailField({ label, value, children }: DetailFieldProps) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <p className="has-text-grey is-size-7">{label}</p>
      {value ? <p className="has-text-grey-dark is-size-7">{value}</p> : children}
    </div>
  )
}
