import { useSyncExternalStore } from 'react'
import type { AdminPageKey, AppRoute, LecturerPageKey, StudentPageKey } from '../models/app.types'
import type { DataState } from '../models/shared/portal.types'

const studentPages = new Set<StudentPageKey>([
  'dashboard',
  'notifications',
  'profile',
  'classes',
  'class-detail',
  'assignments',
  'assignment-detail',
  'assignment-submit',
  'results',
  'result-detail',
  'feedback',
])

const lecturerPages = new Set<LecturerPageKey>([
  'dashboard',
  'notifications',
  'assignments',
  'classes',
  'class-detail',
  'assignment-detail',
  'assignment-create',
  'assignment-edit',
  'submission-list',
  'submission-detail',
])

const adminPages = new Set<AdminPageKey | 'dashboard'>([
  'dashboard',
  'assignments',
  'submissions',
  'users',
  'classes',
  'notifications',
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

  if (portal === 'lecturer') {
    const pageParam = searchParams.get('page')
    const page: LecturerPageKey = pageParam && lecturerPages.has(pageParam as LecturerPageKey)
      ? (pageParam as LecturerPageKey)
      : 'dashboard'

    const stateParam = searchParams.get('state')
    const dataState: DataState = stateParam && dataStates.has(stateParam as DataState)
      ? (stateParam as DataState)
      : 'ready'

    return {
      view: 'lecturer',
      page,
      dataState,
      classId: searchParams.get('classId') ?? undefined,
      assignmentId: searchParams.get('assignmentId') ?? undefined,
      submissionId: searchParams.get('submissionId') ?? undefined,
      notificationId: searchParams.get('notificationId') ?? undefined,
    }
  }

  if (portal === 'admin') {
    const pageParam = searchParams.get('page')
    const page = pageParam && adminPages.has(pageParam as AdminPageKey | 'dashboard')
      ? (pageParam as AdminPageKey | 'dashboard')
      : 'dashboard'

    const stateParam = searchParams.get('state')
    const dataState: DataState = stateParam && dataStates.has(stateParam as DataState)
      ? (stateParam as DataState)
      : 'ready'

    return {
      view: 'admin',
      page,
      dataState,
      notificationId: searchParams.get('notificationId') ?? undefined,
    }
  }

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
    notificationId: searchParams.get('notificationId') ?? undefined,
    filter: searchParams.get('filter') ?? undefined,
    tab: searchParams.get('tab') ?? undefined,
  }
}

export function useAppController(): AppRoute {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return parseRoute()
}

