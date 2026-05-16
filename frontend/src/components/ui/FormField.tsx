interface FormFieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

export default function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      <div className="control">{children}</div>
      {error && <p className="help is-danger">{error}</p>}
    </div>
  )
}
