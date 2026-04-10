import { useSyncExternalStore } from 'react'

export type LecturerQueryState = {
  search: string
  page: number
  pageSize: number
  sort: string
  classId: string
  status: string
  semester: string
  assignmentId: string
  submissionStatus: string
  gradingStatus: string
  deadlineFrom: string
  deadlineTo: string
  coverage: string
  view: string
  detailId: string
  tab: string
}

export type LecturerQueryUpdater = (next: Partial<LecturerQueryState>) => void

const defaultQuery: LecturerQueryState = {
  search: '',
  page: 1,
  pageSize: 20,
  sort: 'recent',
  classId: 'all',
  status: 'all',
  semester: 'all',
  assignmentId: 'all',
  submissionStatus: 'all',
  gradingStatus: 'all',
  deadlineFrom: '',
  deadlineTo: '',
  coverage: 'all',
  view: 'all',
  detailId: '',
  tab: 'overview',
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

function parseQuery(): LecturerQueryState {
  const params = new URLSearchParams(window.location.search)
  return {
    search: params.get('q') ?? defaultQuery.search,
    page: parseNumber(params.get('pageIndex'), defaultQuery.page),
    pageSize: parseNumber(params.get('pageSize'), defaultQuery.pageSize),
    sort: params.get('sort') ?? defaultQuery.sort,
    classId: params.get('classId') ?? defaultQuery.classId,
    status: params.get('status') ?? defaultQuery.status,
    semester: params.get('semester') ?? defaultQuery.semester,
    assignmentId: params.get('assignmentId') ?? defaultQuery.assignmentId,
    submissionStatus: params.get('submissionStatus') ?? defaultQuery.submissionStatus,
    gradingStatus: params.get('gradingStatus') ?? defaultQuery.gradingStatus,
    deadlineFrom: params.get('deadlineFrom') ?? defaultQuery.deadlineFrom,
    deadlineTo: params.get('deadlineTo') ?? defaultQuery.deadlineTo,
    coverage: params.get('coverage') ?? defaultQuery.coverage,
    view: params.get('view') ?? defaultQuery.view,
    detailId: params.get('detailId') ?? defaultQuery.detailId,
    tab: params.get('tab') ?? defaultQuery.tab,
  }
}

function updateQuery(next: Partial<LecturerQueryState>) {
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
    params.set('portal', 'lecturer')
  }
  if (!params.get('page')) {
    params.set('page', 'dashboard')
  }

  const nextUrl = `${window.location.pathname}?${params.toString()}`
  window.history.pushState({}, '', nextUrl)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function useLecturerQueryParams(): { query: LecturerQueryState; setQuery: LecturerQueryUpdater } {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const query = parseQuery()
  return { query, setQuery: updateQuery }
}
