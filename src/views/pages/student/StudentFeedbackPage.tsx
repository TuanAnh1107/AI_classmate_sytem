import type { DataState } from '../../../models/shared/portal.types'
import type { FeedbackFilter } from '../../../models/student/student.types'
import { useStudentFeedbackController } from '../../../controllers/student/useStudentFeedbackController'
import { FeedbackThreadDetail } from '../../components/student/FeedbackThreadDetail'
import { FeedbackThreadList } from '../../components/student/FeedbackThreadList'
import { StudentFilterToolbar } from '../../components/student/StudentFilterToolbar'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { LoadingState } from '../../components/shared/LoadingState'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentFeedbackPageProps = {
  dataState: DataState
  threadId?: string
}

const feedbackOptions: { value: FeedbackFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'new', label: 'Mới cập nhật' },
  { value: 'reply_required', label: 'Cần phản hồi' },
  { value: 'read', label: 'Đã xem' },
]

export function StudentFeedbackPage({ dataState, threadId }: StudentFeedbackPageProps) {
  const model = useStudentFeedbackController(dataState, threadId)

  const summaryItems = [
    { id: 'total', label: 'Tổng luồng', value: model.threads.length },
    { id: 'new', label: 'Mới cập nhật', value: model.threads.filter((thread) => thread.statusLabel === 'Mới cập nhật').length },
    { id: 'reply', label: 'Cần phản hồi', value: model.threads.filter((thread) => thread.statusLabel === 'Cần phản hồi').length },
  ]

  return (
    <StudentPortalLayout frame={model.frame}>
      {model.state === 'loading' ? <LoadingState description="Đang mở các luồng phản hồi học tập." /> : null}
      {model.state === 'error' ? <ErrorState description={model.errorMessage ?? 'Không thể tải dữ liệu phản hồi.'} /> : null}
      {model.state === 'empty' ? (
        <EmptyState
          title="Chưa có phản hồi nào"
          description="Khi giảng viên phản hồi bài tập, các luồng trao đổi sẽ xuất hiện tại đây."
        />
      ) : null}

      {model.state === 'ready' ? (
        <section className="student-page-body portal-page-transition">
          <section className="student-focus-hero">
            <div className="student-focus-copy">
              <p className="portal-page-kicker">Khu phản hồi</p>
              <h1>Trao đổi tập trung theo từng bài</h1>
              <p>Ưu tiên nhìn các luồng mới cập nhật và các luồng cần phản hồi để không bỏ sót trao đổi quan trọng.</p>
            </div>

            <div className="student-summary-strip feedback-summary-strip">
              {summaryItems.map((item) => (
                <article key={item.id} className="student-summary-card">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </article>
              ))}
            </div>
          </section>

          <StudentFilterToolbar
            sticky
            search={{
              value: model.searchValue,
              onChange: model.onSearchChange,
              placeholder: 'Tìm theo bài tập hoặc lớp học',
            }}
            filters={[
              {
                id: 'feedback',
                label: 'Trạng thái phản hồi',
                value: model.filterValue,
                options: feedbackOptions,
                onChange: (value) => model.onFilterChange(value as FeedbackFilter),
              },
            ]}
          />

          <div className="feedback-layout-grid">
            <section className="feedback-sidebar-shell">
              <div className="feedback-sidebar-head">
                <div>
                  <p className="portal-section-kicker">Danh sách trao đổi</p>
                  <h2>Luồng phản hồi</h2>
                </div>
                <span>{model.threads.length} luồng</span>
              </div>
              <FeedbackThreadList threads={model.threads} activeThreadId={model.selectedThread?.id} />
            </section>

            {model.selectedThread ? (
              <FeedbackThreadDetail thread={model.selectedThread} />
            ) : (
              <EmptyState title="Chọn một luồng phản hồi" description="Danh sách trao đổi hiện có sẽ hiển thị ở cột bên trái." />
            )}
          </div>
        </section>
      ) : null}
    </StudentPortalLayout>
  )
}
