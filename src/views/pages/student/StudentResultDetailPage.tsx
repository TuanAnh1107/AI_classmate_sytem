import type { DataState } from '../../../models/shared/portal.types'
import { useStudentResultDetailController } from '../../../controllers/student/useStudentResultsController'
import { ResultBreakdownCard } from '../../components/student/ResultBreakdownCard'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
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
      {model.state === 'loading' ? <LoadingState description="Đang tải điểm và phản hồi chi tiết theo từng câu." /> : null}
      {model.state === 'error' ? <ErrorState description={model.errorMessage ?? 'Không thể tải kết quả chi tiết.'} /> : null}

      {model.result && model.state !== 'loading' && model.state !== 'error' ? (
        <section className="student-page-body portal-page-transition">
          <section className="student-focus-hero student-result-hero">
            <div className="student-focus-copy">
              <p className="portal-page-kicker">{model.result.classLabel}</p>
              <h1>{model.result.title}</h1>
              <p>Đọc điểm tổng trước, sau đó quét từng câu để biết tiêu chí nào đã đạt và phần nào cần cải thiện tiếp.</p>
            </div>

            <div className="result-hero-score">
              <span>Điểm tổng</span>
              <strong>{model.result.totalScoreLabel}</strong>
              <small>Cập nhật lần cuối: {model.result.updatedAtLabel}</small>
            </div>
          </section>

          <div className="student-detail-grid">
            <div className="student-detail-main">
              <PageSection
                title="Phân tích theo từng câu"
                kicker="Rubric chi tiết"
                description="Mỗi thẻ cho biết phần nào đã đạt, phần nào còn thiếu và vì sao bạn nhận mức điểm hiện tại."
              >
                {model.state === 'empty' ? (
                  <EmptyState
                    title="Chưa có chi tiết điểm"
                    description="Giảng viên mới công bố điểm tổng. Phần phân tích sâu sẽ được cập nhật sau."
                  />
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
                  <h3>Nhận xét trọng tâm</h3>
                  <p>Đây là phần nên đọc ngay sau điểm tổng để biết hướng chỉnh sửa hoặc rút kinh nghiệm cho lần sau.</p>
                </header>
                <p className="result-feedback-text">{model.result.lecturerFeedback}</p>
              </section>

              <section className="portal-aside-card">
                <header>
                  <h3>Tóm tắt bài nộp</h3>
                  <p>Tóm tắt ngắn giúp bạn nhìn lại nhanh nội dung đã làm và phần cần cải thiện tiếp theo.</p>
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
        </section>
      ) : null}
    </StudentPortalLayout>
  )
}
