import type { StudentRoute } from '../../../models/app.types'
import type { AssignmentFilter } from '../../../models/student/student.types'
import { StudentAssignmentDetailPage } from './StudentAssignmentDetailPage'
import { StudentAssignmentsPage } from './StudentAssignmentsPage'
import { StudentDashboardPage } from './StudentDashboardPage'
import { StudentNotificationsPage } from './StudentNotificationsPage'

type StudentPortalAppProps = {
  route: StudentRoute
}

const assignmentFilters = new Set<AssignmentFilter>(['all', 'not_submitted', 'submitted', 'overdue'])

export function StudentPortalApp({ route }: StudentPortalAppProps) {
  const activeFilter: AssignmentFilter =
    route.filter && assignmentFilters.has(route.filter as AssignmentFilter)
      ? (route.filter as AssignmentFilter)
      : 'not_submitted'

  switch (route.page) {
    case 'notifications':
      return <StudentNotificationsPage dataState={route.dataState} notificationId={route.notificationId} />
    case 'assignments':
      return <StudentAssignmentsPage dataState={route.dataState} activeFilter={activeFilter} />
    case 'assignment-detail':
    case 'assignment-submit':
      return <StudentAssignmentDetailPage dataState={route.dataState} assignmentId={route.assignmentId} />
    case 'dashboard':
    default:
      return <StudentDashboardPage dataState={route.dataState} />
  }
}
