import { useSyncExternalStore } from 'react'
import type { AppRoute, StudentPageKey } from '../models/app.types'
import type { DataState } from '../models/shared/portal.types'

const studentPages = new Set<StudentPageKey>([
  'dashboard',
  'profile',
  'classes',
  'class-detail',
  'assignments',
  'assignment-detail',
  'results',
  'result-detail',
  'feedback',
])

const dataStates = new Set<DataState>(['ready', 'loading', 'empty', 'error'])

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

function parseRoute(): AppRoute {
  const searchParams = new URLSearchParams(window.location.search)
  const portal = searchParams.get('portal')

  if (portal !== 'student') {
    return { view: 'home' }
  }

  const pageParam = searchParams.get('page')
  const page: StudentPageKey = pageParam && studentPages.has(pageParam as StudentPageKey)
    ? (pageParam as StudentPageKey)
    : 'dashboard'

  const stateParam = searchParams.get('state')
  const dataState: DataState = stateParam && dataStates.has(stateParam as DataState)
    ? (stateParam as DataState)
    : 'ready'

  return {
    view: 'student',
    page,
    dataState,
    classId: searchParams.get('classId') ?? undefined,
    assignmentId: searchParams.get('assignmentId') ?? undefined,
    resultId: searchParams.get('resultId') ?? undefined,
    threadId: searchParams.get('threadId') ?? undefined,
    filter: searchParams.get('filter') ?? undefined,
    tab: searchParams.get('tab') ?? undefined,
  }
}

export function useAppController(): AppRoute {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return parseRoute()
}

