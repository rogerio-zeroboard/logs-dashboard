import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'primary-outlined' | 'secondary' | 'danger' | 'danger-outlined' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = '', variant = 'primary', size = 'md', loading, children, disabled, ...props },
    ref
  ) => {
    const variantClass = {
      primary: 'is-primary',
      'primary-outlined': 'is-primary is-outlined',
      secondary: 'is-light',
      danger: 'is-danger',
      'danger-outlined': 'is-danger is-outlined',
      ghost: '',
    }
    const sizeClass = {
      sm: 'is-small',
      md: '',
      lg: '',
    }

    return (
      <button
        ref={ref}
        className={`button ${variantClass[variant]} ${sizeClass[size]} ${variant === 'ghost' ? 'is-ghost' : ''} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <span className="loader mr-2" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
export default Button
