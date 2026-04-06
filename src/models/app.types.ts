import type { DataState } from './shared/portal.types'

export type AppView = 'home' | 'student'

export type StudentPageKey =
  | 'dashboard'
  | 'profile'
  | 'classes'
  | 'class-detail'
  | 'assignments'
  | 'assignment-detail'
  | 'results'
  | 'result-detail'
  | 'feedback'

export interface HomeRoute {
  view: 'home'
}

export interface StudentRoute {
  view: 'student'
  page: StudentPageKey
  dataState: DataState
  classId?: string
  assignmentId?: string
  resultId?: string
  threadId?: string
  tab?: string
  filter?: string
}

export type AppRoute = HomeRoute | StudentRoute

