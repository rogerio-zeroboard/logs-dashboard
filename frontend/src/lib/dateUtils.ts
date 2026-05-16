export function getDateRange(
  value: string
): { start_date: string; end_date: string } | Record<string, never> {
  const now = new Date()
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)

  switch (value) {
    case 'today': {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      return { start_date: start.toISOString(), end_date: end.toISOString() }
    }
    case 'this_week': {
      const day = now.getDay()
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day)

      return { start_date: start.toISOString(), end_date: end.toISOString() }
    }
    case 'this_month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)

      return { start_date: start.toISOString(), end_date: end.toISOString() }
    }
    case 'last_3_months': {
      const start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())

      return { start_date: start.toISOString(), end_date: end.toISOString() }
    }
    case 'last_6_months': {
      const start = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())

      return { start_date: start.toISOString(), end_date: end.toISOString() }
    }
    case 'last_12_months': {
      const start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())

      return { start_date: start.toISOString(), end_date: end.toISOString() }
    }
    default:
      return {}
  }
}
