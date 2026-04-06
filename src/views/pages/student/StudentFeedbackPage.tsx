import type { DataState } from '../../../models/shared/portal.types'
import { useStudentFeedbackController } from '../../../controllers/student/useStudentFeedbackController'
import { FeedbackThreadDetail } from '../../components/student/FeedbackThreadDetail'
import { FeedbackThreadList } from '../../components/student/FeedbackThreadList'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentFeedbackPageProps = {
  dataState: DataState
  threadId?: string
}

export function StudentFeedbackPage({ dataState, threadId }: StudentFeedbackPageProps) {
  const model = useStudentFeedbackController(dataState, threadId)

  return (
    <StudentPortalLayout frame={model.frame}>
      {model.state === 'loading' ? <LoadingState description="Đang mở các luồng phản hồi học tập." /> : null}
      {model.state === 'error' ? <div className="portal-inline-error">{model.errorMessage}</div> : null}
      {model.state === 'empty' ? (
        <EmptyState title="Chưa có phản hồi nào" description="Khi giảng viên phản hồi bài tập, các luồng trao đổi sẽ hiển thị tại đây." />
      ) : null}

      {model.state === 'ready' ? (
        <div className="feedback-layout-grid">
          <section className="feedback-sidebar-shell">
            <FeedbackThreadList threads={model.threads} activeThreadId={model.selectedThread?.id} />
          </section>

          {model.selectedThread ? (
            <FeedbackThreadDetail thread={model.selectedThread} />
          ) : (
            <EmptyState title="Chọn một luồng phản hồi" description="Danh sách trao đổi hiện có sẽ hiển thị ở cột bên trái." />
          )}
        </div>
      ) : null}
    </StudentPortalLayout>
  )
}
