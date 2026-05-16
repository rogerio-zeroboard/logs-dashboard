export const SEVERITY_ORDER = ['CRITICAL', 'ERROR', 'WARNING', 'INFO', 'DEBUG'] as const

export type SeverityLevel = (typeof SEVERITY_ORDER)[number]

export const SEVERITY_COLORS: Record<string, string> = {
  DEBUG: '#9CA3AF',
  INFO: '#3B82F6',
  WARNING: '#F59E0B',
  ERROR: '#EF4444',
  CRITICAL: '#7F1D1D',
}

export const SEVERITY_ICONS: Record<string, string> = {
  DEBUG: '○',
  INFO: '●',
  WARNING: '⚠',
  ERROR: '✕',
  CRITICAL: '✕✕',
}

export const SEVERITY_BADGE_VARIANTS: Record<
  string,
  'default' | 'success' | 'warning' | 'error' | 'info'
> = {
  DEBUG: 'default',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  CRITICAL: 'error',
}
