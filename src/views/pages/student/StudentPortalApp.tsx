import type { StudentRoute, StudentPageKey } from '../../../models/app.types'
import type { AssignmentFilter, ClassDetailTab } from '../../../models/student/student.types'
import { StudentAssignmentDetailPage } from './StudentAssignmentDetailPage'
import { StudentAssignmentsPage } from './StudentAssignmentsPage'
import { StudentClassDetailPage } from './StudentClassDetailPage'
import { StudentClassesPage } from './StudentClassesPage'
import { StudentDashboardPage } from './StudentDashboardPage'
import { StudentFeedbackPage } from './StudentFeedbackPage'
import { StudentProfilePage } from './StudentProfilePage'
import { StudentResultDetailPage } from './StudentResultDetailPage'
import { StudentResultsPage } from './StudentResultsPage'

type StudentPortalAppProps = {
  route: StudentRoute
}

const assignmentFilters = new Set<AssignmentFilter>(['all', 'not_submitted', 'submitted', 'late', 'graded'])
const classTabs = new Set<ClassDetailTab>(['overview', 'assignments', 'results', 'announcements'])

export function StudentPortalApp({ route }: StudentPortalAppProps) {
  const activeFilter: AssignmentFilter = route.filter && assignmentFilters.has(route.filter as AssignmentFilter)
    ? (route.filter as AssignmentFilter)
    : 'all'

  const activeTab: ClassDetailTab = route.tab && classTabs.has(route.tab as ClassDetailTab)
    ? (route.tab as ClassDetailTab)
    : 'overview'

  return renderStudentPage(route.page, route.dataState, route, activeFilter, activeTab)
}

function renderStudentPage(
  page: StudentPageKey,
  dataState: StudentRoute['dataState'],
  route: StudentRoute,
  activeFilter: AssignmentFilter,
  activeTab: ClassDetailTab,
) {
  switch (page) {
    case 'classes':
      return <StudentClassesPage dataState={dataState} />
    case 'class-detail':
      return <StudentClassDetailPage dataState={dataState} classId={route.classId} activeTab={activeTab} />
    case 'assignments':
      return <StudentAssignmentsPage dataState={dataState} activeFilter={activeFilter} />
    case 'assignment-detail':
      return <StudentAssignmentDetailPage dataState={dataState} assignmentId={route.assignmentId} />
    case 'results':
      return <StudentResultsPage dataState={dataState} />
    case 'result-detail':
      return <StudentResultDetailPage dataState={dataState} resultId={route.resultId} />
    case 'feedback':
      return <StudentFeedbackPage dataState={dataState} threadId={route.threadId} />
    case 'profile':
      return <StudentProfilePage dataState={dataState} />
    case 'dashboard':
    default:
      return <StudentDashboardPage dataState={dataState} />
  }
}

