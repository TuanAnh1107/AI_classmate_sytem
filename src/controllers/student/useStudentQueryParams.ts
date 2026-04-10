import { useSyncExternalStore } from 'react'

export type StudentQueryState = {
  search: string
  filter: string
  sort: string
  view: string
  classId: string
  feedback: string
  tab: string
}

export type StudentQueryUpdater = (next: Partial<StudentQueryState>) => void

const defaultQuery: StudentQueryState = {
  search: '',
  filter: 'not_submitted',
  sort: 'recent',
  view: 'all',
  classId: 'all',
  feedback: 'all',
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

function parseQuery(): StudentQueryState {
  const params = new URLSearchParams(window.location.search)
  return {
    search: params.get('q') ?? defaultQuery.search,
    filter: params.get('filter') ?? defaultQuery.filter,
    sort: params.get('sort') ?? defaultQuery.sort,
    view: params.get('view') ?? defaultQuery.view,
    classId: params.get('classId') ?? defaultQuery.classId,
    feedback: params.get('feedback') ?? defaultQuery.feedback,
    tab: params.get('tab') ?? defaultQuery.tab,
  }
}

function updateQuery(next: Partial<StudentQueryState>) {
  const params = new URLSearchParams(window.location.search)
  Object.entries(next).forEach(([key, value]) => {
    const paramKey = key === 'search' ? 'q' : key
    if (value === undefined || value === null || value === '' || value === 'all') {
      params.delete(paramKey)
      return
    }
    params.set(paramKey, String(value))
  })

  if (!params.get('portal')) {
    params.set('portal', 'student')
  }
  if (!params.get('page')) {
    params.set('page', 'dashboard')
  }

  const nextUrl = `${window.location.pathname}?${params.toString()}`
  window.history.pushState({}, '', nextUrl)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

export function useStudentQueryParams(): { query: StudentQueryState; setQuery: StudentQueryUpdater } {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const query = parseQuery()
  return { query, setQuery: updateQuery }
}
