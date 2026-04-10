import type { AdminPageKey } from '../../../models/admin/admin.types'
import type { AppRoute } from '../../../models/app.types'
import { AdminAssignmentsPage } from './AdminAssignmentsPage'
import { AdminClassesPage } from './AdminClassesPage'
import { AdminDashboardPage } from './AdminDashboardPage'
import { AdminNotificationsPage } from './AdminNotificationsPage'
import { AdminSubmissionsPage } from './AdminSubmissionsPage'
import { AdminUsersPage } from './AdminUsersPage'

type AdminPortalAppProps = {
  route: AppRoute
}

export function AdminPortalApp({ route }: AdminPortalAppProps) {
  if (route.view !== 'admin') {
    return null
  }

  const page = route.page as AdminPageKey
  const dataState = route.dataState

  switch (page) {
    case 'dashboard':
      return <AdminDashboardPage dataState={dataState} />
    case 'notifications':
      return <AdminNotificationsPage dataState={dataState} notificationId={route.notificationId} />
    case 'users':
      return <AdminUsersPage dataState={dataState} />
    case 'classes':
      return <AdminClassesPage dataState={dataState} />
    case 'submissions':
      return <AdminSubmissionsPage dataState={dataState} />
    case 'assignments':
    default:
      return <AdminAssignmentsPage dataState={dataState} />
  }
}
