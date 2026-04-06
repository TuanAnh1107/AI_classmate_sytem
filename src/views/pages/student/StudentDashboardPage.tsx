import type { DataState } from '../../../models/shared/portal.types'
import { useStudentDashboardController } from '../../../controllers/student/useStudentDashboardController'
import { DashboardSummaryCards } from '../../components/student/DashboardSummaryCards'
import { RecentResultsPanel } from '../../components/student/RecentResultsPanel'
import { StudentReminderPanel } from '../../components/student/StudentReminderPanel'
import { UpcomingAssignmentsPanel } from '../../components/student/UpcomingAssignmentsPanel'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentDashboardPageProps = {
  dataState: DataState
}

export function StudentDashboardPage({ dataState }: StudentDashboardPageProps) {
  const model = useStudentDashboardController(dataState)

  return (
    <StudentPortalLayout frame={model.frame}>
      {model.state === 'loading' ? <LoadingState /> : null}
      {model.state === 'error' ? <div className="portal-inline-error">{model.errorMessage}</div> : null}

      {model.state !== 'loading' && model.state !== 'error' ? (
        <>
          <DashboardSummaryCards metrics={model.metrics} />

          <div className="student-overview-grid">
            <div className="student-overview-main">
              {model.state === 'empty' ? (
                <EmptyState
                  title="Chưa có dữ liệu tổng quan"
                  description="Khi có bài tập, kết quả và phản hồi mới, thông tin sẽ xuất hiện tại đây."
                />
              ) : (
                <>
                  <UpcomingAssignmentsPanel items={model.upcomingAssignments} />
                  <RecentResultsPanel items={model.recentResults} />
                </>
              )}
            </div>

            <StudentReminderPanel
              reminders={model.reminders}
              feedbackUpdates={model.feedbackUpdates}
              guideLinks={model.guideLinks}
            />
          </div>
        </>
      ) : null}
    </StudentPortalLayout>
  )
}
