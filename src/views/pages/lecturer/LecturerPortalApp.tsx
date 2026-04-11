import type { LecturerRoute } from '../../../models/app.types'
import { LecturerAssignmentCreatePage } from './LecturerAssignmentCreatePage'
import { LecturerAssignmentDetailPage } from './LecturerAssignmentDetailPage'
import { LecturerAssignmentEditPage } from './LecturerAssignmentEditPage'
import { LecturerAssignmentsPage } from './LecturerAssignmentsPage'
import { LecturerClassDetailPage } from './LecturerClassDetailPage'
import { LecturerClassesPage } from './LecturerClassesPage'
import { LecturerDashboardPage } from './LecturerDashboardPage'
import { LecturerNotificationsPage } from './LecturerNotificationsPage'
import { LecturerSubmissionDetailPage } from './LecturerSubmissionDetailPage'
import { LecturerSubmissionListPage } from './LecturerSubmissionListPage'

type LecturerPortalAppProps = {
  route: LecturerRoute
}

export function LecturerPortalApp({ route }: LecturerPortalAppProps) {
  switch (route.page) {
    case 'dashboard':
      return <LecturerDashboardPage dataState={route.dataState} />
    case 'notifications':
      return <LecturerNotificationsPage dataState={route.dataState} notificationId={route.notificationId} />
    case 'assignments':
      return <LecturerAssignmentsPage dataState={route.dataState} />
    case 'classes':
      return <LecturerClassesPage dataState={route.dataState} />
    case 'class-detail':
      return <LecturerClassDetailPage dataState={route.dataState} classId={route.classId} />
    case 'assignment-detail':
      return <LecturerAssignmentDetailPage dataState={route.dataState} assignmentId={route.assignmentId} />
    case 'assignment-edit':
      return <LecturerAssignmentEditPage dataState={route.dataState} assignmentId={route.assignmentId} />
    case 'submission-list':
      return <LecturerSubmissionListPage dataState={route.dataState} assignmentId={route.assignmentId} />
    case 'submission-detail':
      return <LecturerSubmissionDetailPage dataState={route.dataState} submissionId={route.submissionId} />
    case 'assignment-create':
    default:
      return <LecturerAssignmentCreatePage dataState={route.dataState} />
  }
}
