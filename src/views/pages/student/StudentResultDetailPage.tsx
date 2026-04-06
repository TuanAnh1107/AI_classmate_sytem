import type { DataState } from '../../../models/shared/portal.types'
import { useStudentResultDetailController } from '../../../controllers/student/useStudentResultsController'
import { ResultBreakdownCard } from '../../components/student/ResultBreakdownCard'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'
import { PageSection } from '../../components/shared/PageSection'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentResultDetailPageProps = {
  dataState: DataState
  resultId?: string
}

export function StudentResultDetailPage({ dataState, resultId }: StudentResultDetailPageProps) {
  const model = useStudentResultDetailController(resultId, dataState)

  return (
    <StudentPortalLayout frame={model.frame}>
      {model.state === 'loading' ? <LoadingState description="Đang tải điểm và nhận xét chi tiết theo từng câu." /> : null}
      {model.state === 'error' ? <div className="portal-inline-error">{model.errorMessage}</div> : null}

      {model.result && model.state !== 'loading' && model.state !== 'error' ? (
        <div className="student-detail-grid">
          <div className="student-detail-main">
            <PageSection
              title={model.result.title}
              kicker={model.result.classLabel}
              description={`Cập nhật lần cuối: ${model.result.updatedAtLabel}`}
            >
              <div className="result-total-banner">
                <strong>{model.result.totalScoreLabel}</strong>
                <span>Điểm tổng sau khi đối chiếu theo rubric</span>
              </div>

              {model.state === 'empty' ? (
                <EmptyState title="Chưa có chi tiết điểm" description="Giảng viên mới công bố điểm tổng, phần nhận xét chi tiết sẽ cập nhật sau." />
              ) : (
                <div className="result-breakdown-list">
                  {model.result.questionResults.map((item) => (
                    <ResultBreakdownCard key={item.questionId} item={item} />
                  ))}
                </div>
              )}
            </PageSection>
          </div>

          <aside className="portal-aside-stack">
            <section className="portal-aside-card">
              <header>
                <h3>Nhận xét của giảng viên</h3>
              </header>
              <p className="result-feedback-text">{model.result.lecturerFeedback}</p>
            </section>

            <section className="portal-aside-card">
              <header>
                <h3>Tóm tắt bài nộp</h3>
              </header>
              <ul className="aside-detail-list compact">
                {model.result.summary.map((item) => (
                  <li key={item}>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      ) : null}
    </StudentPortalLayout>
  )
}
