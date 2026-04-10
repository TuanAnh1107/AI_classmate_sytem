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
