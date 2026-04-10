import type { DataState } from '../../../models/shared/portal.types'
import type { FeedbackFilter, ResultSort } from '../../../models/student/student.types'
import { useStudentResultsController } from '../../../controllers/student/useStudentResultsController'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingTable } from '../../components/shared/LoadingTable'
import { StudentFilterToolbar } from '../../components/student/StudentFilterToolbar'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentResultsPageProps = {
  dataState: DataState
}

const feedbackOptions: { value: FeedbackFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'new', label: 'Mới cập nhật' },
  { value: 'reply_required', label: 'Cần phản hồi' },
  { value: 'read', label: 'Đã xem' },
]

const sortOptions: { value: ResultSort; label: string }[] = [
  { value: 'updated', label: 'Cập nhật gần nhất' },
  { value: 'score', label: 'Điểm cao nhất' },
]

export function StudentResultsPage({ dataState }: StudentResultsPageProps) {
  const model = useStudentResultsController(dataState)
  const freshCount = model.rows.filter((row) => row.feedbackLabel === 'Mới cập nhật').length
  const replyCount = model.rows.filter((row) => row.feedbackLabel === 'Cần phản hồi').length

  return (
    <StudentPortalLayout frame={model.frame}>
      <section className="student-page-body">
        <section className="student-focus-hero student-result-hero">
          <div className="student-focus-copy">
            <p className="portal-page-kicker">Khu kết quả học tập</p>
            <h1>Điểm số và phản hồi</h1>
            <p>Ưu tiên nhìn các bài vừa có điểm hoặc phản hồi mới, sau đó mở thẳng chi tiết để đọc rubric và nhận xét trọng tâm.</p>
          </div>

          <div className="result-hero-score">
            <span>Bài đã chấm</span>
            <strong>{model.rows.length}</strong>
            <small>{freshCount} bài vừa cập nhật</small>
          </div>
        </section>

        <div className="student-summary-strip">
          <article className="student-summary-card">
            <span>Tổng kết quả</span>
            <strong>{model.rows.length}</strong>
          </article>
          <article className="student-summary-card">
            <span>Mới cập nhật</span>
            <strong>{freshCount}</strong>
          </article>
          <article className="student-summary-card">
            <span>Cần phản hồi</span>
            <strong>{replyCount}</strong>
          </article>
        </div>

        <StudentFilterToolbar
          sticky
          search={{
            value: model.searchValue,
            onChange: model.onSearchChange,
            placeholder: 'Tìm theo tên bài hoặc lớp',
            helper: 'Lọc nhanh các kết quả vừa đổi điểm hoặc vừa có phản hồi mới.',
          }}
          filters={[
            {
              id: 'feedback',
              label: 'Trạng thái phản hồi',
              value: model.feedbackFilter,
              options: feedbackOptions,
              onChange: (value) => model.onFeedbackChange(value as FeedbackFilter),
            },
          ]}
          sort={{
            label: 'Sắp xếp',
            value: model.sortValue,
            options: sortOptions,
            onChange: (value) => model.onSortChange(value as ResultSort),
          }}
        />

        {model.state === 'loading' ? <LoadingTable columns={4} /> : null}
        {model.state === 'error' ? <div className="portal-inline-error">{model.errorMessage}</div> : null}
        {model.state === 'empty' ? (
          <EmptyState title="Chưa có kết quả nào" description="Điểm và phản hồi sẽ xuất hiện khi giảng viên hoàn tất chấm bài." />
        ) : null}

        {model.state === 'ready' ? (
          <div className="assignment-worklist">
            {model.rows.map((row) => (
              <article key={row.id} className="assignment-work-item">
                <div className="assignment-work-copy">
                  <div className="assignment-work-head">
                    <div>
                      <p className="assignment-work-class">{row.classLabel}</p>
                      <h3>{row.title}</h3>
                    </div>
                    <StatusBadge label={row.feedbackLabel} tone={row.feedbackTone} />
                  </div>

                  <div className="assignment-work-meta">
                    <span>Điểm: {row.scoreLabel}</span>
                    <span>Cập nhật: {row.updatedAtLabel}</span>
                  </div>
                </div>

                <div className="assignment-work-actions">
                  <a className="portal-primary-button" href={row.href}>
                    Xem chi tiết
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </StudentPortalLayout>
  )
}
