import { useSyncExternalStore } from 'react'

export type AdminQueryState = {
  search: string
  view: string
  page: number
  pageSize: number
  sort: string
  role: string
  status: string
  classId: string
  semester: string
  lecturerId: string
  assignmentId: string
  submissionStatus: string
  gradingStatus: string
  scoreMin: string
  scoreMax: string
  dateFrom: string
  dateTo: string
  detailId: string
}

export type AdminQueryUpdater = (next: Partial<AdminQueryState>) => void

const defaultQuery: AdminQueryState = {
  search: '',
  view: 'all',
  page: 1,
  pageSize: 20,
  sort: 'recent',
  role: 'all',
  status: 'all',
  classId: 'all',
  semester: 'all',
  lecturerId: 'all',
  assignmentId: 'all',
  submissionStatus: 'all',
  gradingStatus: 'all',
  scoreMin: '',
  scoreMax: '',
  dateFrom: '',
  dateTo: '',
  detailId: '',
}

function subscribe(callback: () => void) {
  window.addEventListener('popstate', callback)
  window.addEventListener('hashchange', callback)
  return () => {
    window.removeEventListener('popstate', callback)
    window.removeEventListener('hashchange', callback)
  }
}

function getSnapshot() {
  return `${window.location.pathname}?${window.location.search}#${window.location.hash}`
}

function parseNumber(value: string | null, fallback: number): number {
  if (!value) {
    return fallback
  }
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function parseQuery(): AdminQueryState {
  const params = new URLSearchParams(window.location.search)
  return {
    search: params.get('q') ?? defaultQuery.search,
    view: params.get('view') ?? defaultQuery.view,
    page: parseNumber(params.get('pageIndex'), defaultQuery.page),
    pageSize: parseNumber(params.get('pageSize'), defaultQuery.pageSize),
    sort: params.get('sort') ?? defaultQuery.sort,
    role: params.get('role') ?? defaultQuery.role,
    status: params.get('status') ?? defaultQuery.status,
    classId: params.get('classId') ?? defaultQuery.classId,
    semester: params.get('semester') ?? defaultQuery.semester,
    lecturerId: params.get('lecturerId') ?? defaultQuery.lecturerId,
    assignmentId: params.get('assignmentId') ?? defaultQuery.assignmentId,
    submissionStatus: params.get('submissionStatus') ?? defaultQuery.submissionStatus,
    gradingStatus: params.get('gradingStatus') ?? defaultQuery.gradingStatus,
    scoreMin: params.get('scoreMin') ?? defaultQuery.scoreMin,
    scoreMax: params.get('scoreMax') ?? defaultQuery.scoreMax,
    dateFrom: params.get('dateFrom') ?? defaultQuery.dateFrom,
    dateTo: params.get('dateTo') ?? defaultQuery.dateTo,
    detailId: params.get('detailId') ?? defaultQuery.detailId,
  }
}

function updateQuery(next: Partial<AdminQueryState>) {
  const params = new URLSearchParams(window.location.search)
  Object.entries(next).forEach(([key, value]) => {
    const paramKey = key === 'search' ? 'q' : key === 'page' ? 'pageIndex' : key
    if (paramKey === 'pageSize') {
      params.set('pageSize', String(value))
      return
    }
    if (value === undefined || value === null || value === '' || value === 'all') {
      params.delete(paramKey)
      return
    }
    params.set(paramKey, String(value))
  })

  if (!params.get('portal')) {
    params.set('portal', 'admin')
  }
  if (!params.get('page')) {
    params.set('page', 'dashboard')
  }

  const nextUrl = `${window.location.pathname}?${params.toString()}`
  window.history.pushState({}, '', nextUrl)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function useAdminQueryParams(): { query: AdminQueryState; setQuery: AdminQueryUpdater } {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const query = parseQuery()

  return {
    query,
    setQuery: updateQuery,
  }
}
