export function paginateRows<T>(rows: T[], page: number, pageSize: number) {
  const total = rows.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const start = (safePage - 1) * pageSize
  const paged = rows.slice(start, start + pageSize)
  return { total, totalPages, page: safePage, rows: paged }
}

export function matchSearch(value: string, search: string) {
  if (!search.trim()) return true
  return value.toLowerCase().includes(search.trim().toLowerCase())
}

export function getCoverageLabel(submitted: number, total: number) {
  if (total === 0) return '0%'
  return `${Math.round((submitted / total) * 100)}%`
}

export function getCoverageTone(rate: number): 'success' | 'info' | 'warning' {
  if (rate >= 85) return 'success'
  if (rate >= 60) return 'info'
  return 'warning'
}

export function getDeadlineState(dueAt: string, now = new Date()) {
  const due = new Date(dueAt).getTime()
  const diff = due - now.getTime()
  const days = diff / (1000 * 60 * 60 * 24)
  if (diff < 0) return { label: 'Quá hạn', tone: 'danger' as const }
  if (days <= 3) return { label: 'Sắp đến hạn', tone: 'warning' as const }
  return { label: 'Đang mở', tone: 'success' as const }
}
