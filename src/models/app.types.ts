import type { DataState } from './shared/portal.types'

export type AppView = 'home' | 'student' | 'lecturer' | 'admin'

export type StudentPageKey =
  | 'dashboard'
  | 'notifications'
  | 'profile'
  | 'classes'
  | 'class-detail'
  | 'assignments'
  | 'assignment-detail'
  | 'assignment-submit'
  | 'results'
  | 'result-detail'
  | 'feedback'

export type LecturerPageKey =
  | 'dashboard'
  | 'notifications'
  | 'assignments'
  | 'classes'
  | 'class-detail'
  | 'assignment-detail'
  | 'assignment-create'
  | 'assignment-edit'
  | 'submission-list'
  | 'submission-detail'

export type AdminPageKey = 'assignments' | 'submissions' | 'users' | 'classes' | 'notifications'
export type AdminExtendedPageKey = 'dashboard' | AdminPageKey

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
  notificationId?: string
  tab?: string
  filter?: string
}

export interface LecturerRoute {
  view: 'lecturer'
  page: LecturerPageKey
  dataState: DataState
  classId?: string
  assignmentId?: string
  submissionId?: string
  notificationId?: string
}

export interface AdminRoute {
  view: 'admin'
  page: AdminExtendedPageKey
  dataState: DataState
  notificationId?: string
}

export type AppRoute = HomeRoute | StudentRoute | LecturerRoute | AdminRoute

