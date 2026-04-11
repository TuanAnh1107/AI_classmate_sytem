import type { StudentRoute } from '../../../models/app.types'
import type { AssignmentFilter } from '../../../models/student/student.types'
import { StudentAssignmentDetailPage } from './StudentAssignmentDetailPage'
import { StudentAssignmentSubmitPage } from './StudentAssignmentSubmitPage'
import { StudentAssignmentsPage } from './StudentAssignmentsPage'
import { StudentClassDetailPage } from './StudentClassDetailPage'
import { StudentClassesPage } from './StudentClassesPage'
import { StudentDashboardPage } from './StudentDashboardPage'
import { StudentFeedbackPage } from './StudentFeedbackPage'
import { StudentNotificationsPage } from './StudentNotificationsPage'
import { StudentProfilePage } from './StudentProfilePage'
import { StudentResultDetailPage } from './StudentResultDetailPage'
import { StudentResultsPage } from './StudentResultsPage'
import type { ClassDetailTab } from '../../../models/student/student.types'

type StudentPortalAppProps = {
  route: StudentRoute
}

const assignmentFilters = new Set<AssignmentFilter>(['all', 'not_submitted', 'submitted', 'overdue'])
const classDetailTabs = new Set<ClassDetailTab>(['overview', 'assignments', 'results', 'announcements'])

export function StudentPortalApp({ route }: StudentPortalAppProps) {
  const activeFilter: AssignmentFilter =
    route.filter && assignmentFilters.has(route.filter as AssignmentFilter)
      ? (route.filter as AssignmentFilter)
      : 'not_submitted'
  const activeClassTab: ClassDetailTab =
    route.tab && classDetailTabs.has(route.tab as ClassDetailTab) ? (route.tab as ClassDetailTab) : 'overview'

  switch (route.page) {
    case 'notifications':
      return <StudentNotificationsPage dataState={route.dataState} notificationId={route.notificationId} />
    case 'profile':
      return <StudentProfilePage dataState={route.dataState} />
    case 'classes':
      return <StudentClassesPage dataState={route.dataState} />
    case 'class-detail':
      return <StudentClassDetailPage dataState={route.dataState} classId={route.classId} activeTab={activeClassTab} />
    case 'assignments':
      return <StudentAssignmentsPage dataState={route.dataState} activeFilter={activeFilter} />
    case 'assignment-submit':
      return <StudentAssignmentSubmitPage dataState={route.dataState} assignmentId={route.assignmentId} />
    case 'assignment-detail':
      return <StudentAssignmentDetailPage dataState={route.dataState} assignmentId={route.assignmentId} />
    case 'results':
      return <StudentResultsPage dataState={route.dataState} />
    case 'result-detail':
      return <StudentResultDetailPage dataState={route.dataState} resultId={route.resultId} />
    case 'feedback':
      return <StudentFeedbackPage dataState={route.dataState} threadId={route.threadId} />
    case 'dashboard':
    default:
      return <StudentDashboardPage dataState={route.dataState} />
  }
}
