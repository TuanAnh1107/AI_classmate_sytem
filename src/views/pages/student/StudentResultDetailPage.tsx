import { useMemo, useState } from 'react'
import type { DataState } from '../../../models/shared/portal.types'
import { useStudentResultDetailController } from '../../../controllers/student/useStudentResultsController'
import { ResultBreakdownCard } from '../../components/student/ResultBreakdownCard'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { LoadingState } from '../../components/shared/LoadingState'
import { PageSection } from '../../components/shared/PageSection'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentResultDetailPageProps = {
  dataState: DataState
  resultId?: string
}

export function StudentResultDetailPage({ dataState, resultId }: StudentResultDetailPageProps) {
  const model = useStudentResultDetailController(resultId, dataState)
  const [appealDraft, setAppealDraft] = useState('')
  const [localMessages, setLocalMessages] = useState<
    { id: string; authorRole: 'student'; authorName: string; sentAt: string; content: string }[]
  >([])

  const feedbackMessages = useMemo(() => {
    if (!model.result) {
      return []
    }

    return [...model.result.feedbackMessages, ...localMessages]
  }, [localMessages, model.result])

  const handleSubmitAppeal = () => {
    const content = appealDraft.trim()
    if (!content) {
      return
    }

    setLocalMessages((current) => [
      ...current,
      {
        id: `appeal-${Date.now()}`,
        authorRole: 'student',
        authorName: 'Bạn',
        sentAt: new Intl.DateTimeFormat('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date()),
        content,
      },
    ])
    setAppealDraft('')
  }

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
              <p>Đọc điểm tổng trước, sau đó xem rubric breakdown và gửi phản hồi phúc khảo nếu cần giảng viên xem lại.</p>
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

              <PageSection
                title="Phản hồi và phúc khảo"
                kicker="Trao đổi với giảng viên"
                description="Sinh viên xem điểm xong có thể gửi yêu cầu phúc khảo ngay tại đây, không cần đi vòng qua màn khác."
              >
                <div style={{ display: 'grid', gap: 16 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                      flexWrap: 'wrap',
                    }}
                  >
                    <div>
                      <strong style={{ display: 'block', marginBottom: 4 }}>Trạng thái phản hồi</strong>
                      <p className="portal-muted-text" style={{ margin: 0 }}>
                        {model.result.updatedAtLabel}
                      </p>
                    </div>
                    <StatusBadge label={model.result.feedbackStatusLabel} tone={model.result.feedbackStatusTone} />
                  </div>

                  <article className="feedback-message-card role-lecturer">
                    <header>
                      <strong>Giảng viên</strong>
                      <span>{model.result.updatedAtLabel}</span>
                    </header>
                    <p>{model.result.lecturerFeedback}</p>
                  </article>

                  {feedbackMessages.length ? (
                    <div className="feedback-message-list">
                      {feedbackMessages.map((message) => (
                        <article key={message.id} className={`feedback-message-card role-${message.authorRole}`}>
                          <header>
                            <strong>{message.authorName}</strong>
                            <span>{message.sentAt}</span>
                          </header>
                          <p>{message.content}</p>
                        </article>
                      ))}
                    </div>
                  ) : null}

                  <div className="portal-form-field">
                    <label className="portal-form-label">Nội dung yêu cầu phúc khảo</label>
                    <textarea
                      className="portal-textarea"
                      rows={4}
                      value={appealDraft}
                      onChange={(event) => setAppealDraft(event.target.value)}
                      placeholder="Ví dụ: Em muốn xin phúc khảo phần trực quan hóa vì đã bổ sung file minh họa cập nhật."
                    />
                    <p className="portal-form-help">
                      Nêu rõ phần cần xem lại, lý do và nếu có thì nói luôn tài liệu minh chứng bạn muốn giảng viên đối chiếu.
                    </p>
                  </div>

                  <div className="portal-button-row">
                    <button type="button" className="portal-primary-button" onClick={handleSubmitAppeal}>
                      Gửi yêu cầu phúc khảo
                    </button>
                    <a className="portal-outline-button" href={model.result.feedbackHref}>
                      Mở trang phản hồi
                    </a>
                    <a className="portal-outline-button" href={model.result.assignmentHref}>
                      Mở bài tập
                    </a>
                  </div>
                </div>
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
