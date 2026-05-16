interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  children: React.ReactNode
  className?: string
}

const variants = {
  default: 'is-light is-grey',
  success: 'is-success is-light',
  warning: 'is-warning is-light',
  error: 'is-danger is-light',
  info: 'is-info is-light',
}

import { SEVERITY_BADGE_VARIANTS } from '@/lib/constants'

export function getSeverityVariant(severity: string) {
  return SEVERITY_BADGE_VARIANTS[severity] || 'default'
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return <span className={`tag ${variants[variant]} ${className}`}>{children}</span>
}
