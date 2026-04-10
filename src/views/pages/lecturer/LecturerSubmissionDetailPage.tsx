import { useState } from 'react'
import type { DataState } from '../../../models/shared/portal.types'
import { useLecturerSubmissionDetailController } from '../../../controllers/lecturer/useLecturerSubmissionDetailController'
import { buildLecturerPortalHref } from '../../../models/lecturer/lecturer.mappers'
import { CollapsibleSection } from '../../components/shared/CollapsibleSection'
import { ContentPanel } from '../../components/shared/ContentPanel'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { LoadingState } from '../../components/shared/LoadingState'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { LecturerPortalLayout } from '../../layouts/LecturerPortalLayout'

type LecturerSubmissionDetailPageProps = {
  dataState: DataState
  submissionId?: string
}

export function LecturerSubmissionDetailPage({ dataState, submissionId }: LecturerSubmissionDetailPageProps) {
  const model = useLecturerSubmissionDetailController(submissionId, dataState)

  if (model.state === 'loading') {
    return (
      <LecturerPortalLayout frame={model.frame}>
        <LoadingState />
      </LecturerPortalLayout>
    )
  }

  if (model.state === 'error') {
    return (
      <LecturerPortalLayout frame={model.frame}>
        <ErrorState description={model.errorMessage ?? 'Không thể tải chi tiết bài nộp.'} />
      </LecturerPortalLayout>
    )
  }

  if (!model.submission) {
    return (
      <LecturerPortalLayout frame={model.frame}>
        <EmptyState title="Không tìm thấy bài nộp" description="Bài nộp không tồn tại hoặc đã bị xóa." />
      </LecturerPortalLayout>
    )
  }

  const sub = model.submission
  const [scoreDraft, setScoreDraft] = useState(sub.scoreValue)
  const [feedbackDraft, setFeedbackDraft] = useState(sub.feedback ?? '')
  const prevHref = model.prevId ? buildLecturerPortalHref('submission-detail', { submissionId: model.prevId }) : undefined
  const nextHref = model.nextId ? buildLecturerPortalHref('submission-detail', { submissionId: model.nextId }) : undefined

  return (
    <LecturerPortalLayout frame={model.frame}>
      <div className="page-title-bar">
        <div>
          <h1>{sub.studentName}</h1>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{sub.studentCode}</span>
            <StatusBadge label={sub.submissionStatusLabel} tone={sub.submissionTone} />
            <StatusBadge label={sub.gradingStatusLabel} tone={sub.gradingTone} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Nộp: {sub.submittedAtLabel}</span>
          </div>
        </div>
        <div className="page-title-bar-actions">
          {prevHref ? (
            <a className="portal-outline-button" href={prevHref}>
              ← Trước
            </a>
          ) : null}
          {nextHref ? (
            <a className="portal-outline-button" href={nextHref}>
              Sau →
            </a>
          ) : null}
        </div>
      </div>

      <div className="student-page-body portal-page-transition">
        <div className="grading-workspace">
          <div className="grading-main">
            <ContentPanel title={sub.assignmentTitle}>
              <div className="grading-content-body">
                <p>{sub.contentText}</p>

                {sub.attachmentUrls.length ? (
                  <ul className="portal-attachment-list">
                    {sub.attachmentUrls.map((url) => (
                      <li key={url}>{url}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="portal-muted-text">Không có tệp đính kèm cho bài nộp này.</p>
                )}
              </div>
            </ContentPanel>

            <CollapsibleSection title="Lịch sử nộp" count={model.attempts?.length ?? 0}>
              {model.attempts?.length ? (
                <div className="grading-attempt-list">
                  {model.attempts.map((attempt) => (
                    <div key={attempt.id} className={`grading-attempt-item${attempt.isCurrent ? ' is-current' : ''}`}>
                      <div>
                        <strong>{attempt.submittedAtLabel}</strong>
                        <span>{attempt.statusLabel}</span>
                      </div>
                      <em>{attempt.scoreLabel}</em>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Chỉ có một lần nộp" description="Không có phiên bản nộp trước đó." />
              )}
            </CollapsibleSection>

            <CollapsibleSection title="Rubric" count={model.rubric?.length ?? 0}>
              {model.rubric?.length ? (
                <div className="grading-rubric-list">
                  {model.rubric.map((item) => (
                    <div key={item.id} className="grading-rubric-item">
                      <div>
                        <strong>{item.label}</strong>
                        <span>{item.detail}</span>
                      </div>
                      <em>{item.maxScore} điểm</em>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Chưa có rubric" description="Bài tập này chưa có rubric chi tiết." />
              )}
            </CollapsibleSection>

            <CollapsibleSection title="Phản hồi" count={model.feedbackThread?.length ?? 0}>
              {model.feedbackThread?.length ? (
                <div className="feedback-message-list">
                  {model.feedbackThread.map((message) => (
                    <div key={message.id} className={`feedback-message-card role-${message.authorRole}`}>
                      <header>
                        <strong>{message.authorName}</strong>
                        <span>{message.createdAt}</span>
                      </header>
                      <p>{message.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Chưa có trao đổi" description="Phản hồi sẽ hiển thị ở đây khi giảng viên và sinh viên bắt đầu trao đổi." />
              )}
            </CollapsibleSection>
          </div>

          <div className="grading-side">
            <div className="grading-panel">
              <h3>Chấm điểm</h3>

              <div className="portal-form-stack">
                <div className="portal-form-field">
                  <label className="portal-form-label">Điểm</label>
                  <input
                    type="number"
                    className="portal-input"
                    value={scoreDraft}
                    onChange={(event) => setScoreDraft(event.target.value)}
                    min={0}
                    max={sub.maxScoreValue}
                  />
                  <p className="portal-form-help">Tối đa: {sub.maxScoreValue}</p>
                </div>

                <div className="portal-form-field">
                  <label className="portal-form-label">Nhận xét</label>
                  <textarea
                    className="portal-textarea"
                    rows={4}
                    value={feedbackDraft}
                    onChange={(event) => setFeedbackDraft(event.target.value)}
                    placeholder="Nhập nhận xét cho sinh viên..."
                  />
                </div>
              </div>

              <div className="grading-panel-helpers">
                {model.summaryFacts?.map((fact) => (
                  <div key={fact.id} className="grading-panel-helper">
                    <span>{fact.label}</span>
                    <strong>{fact.value}</strong>
                  </div>
                ))}
                <div className="grading-panel-helper">
                  <span>Lớp</span>
                  <strong>{sub.classLabel}</strong>
                </div>
              </div>

              <div className="portal-button-row">
                <button type="button" className="portal-outline-button">
                  Lưu nháp
                </button>
                <button type="button" className="portal-primary-button">
                  Công bố
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LecturerPortalLayout>
  )
}
