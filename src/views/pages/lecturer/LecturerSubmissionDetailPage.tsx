import { useMemo, useState } from 'react'
import type { DataState } from '../../../models/shared/portal.types'
import { useLecturerSubmissionDetailController } from '../../../controllers/lecturer/useLecturerSubmissionDetailController'
import { buildLecturerPortalHref } from '../../../models/lecturer/lecturer.mappers'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { InfoHeader } from '../../components/shared/InfoHeader'
import { LoadingState } from '../../components/shared/LoadingState'
import { PortalSectionTabs } from '../../components/shared/PortalSectionTabs'
import { LecturerPortalLayout } from '../../layouts/LecturerPortalLayout'

type LecturerSubmissionDetailPageProps = {
  dataState: DataState
  submissionId?: string
}

type LeftTabId = 'content' | 'history' | 'rubric' | 'feedback'

export function LecturerSubmissionDetailPage({ dataState, submissionId }: LecturerSubmissionDetailPageProps) {
  const model = useLecturerSubmissionDetailController(submissionId, dataState)

  if (model.state === 'loading') {
    return (
      <LecturerPortalLayout frame={model.frame}>
        <LoadingState description="Đang tải chi tiết bài nộp." />
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

  return <SubmissionDetailBody model={model} />
}

function SubmissionDetailBody({ model }: { model: ReturnType<typeof useLecturerSubmissionDetailController> }) {
  const submission = model.submission!
  const [activeLeftTab, setActiveLeftTab] = useState<LeftTabId>('content')
  const [scoreDraft, setScoreDraft] = useState(submission.scoreValue)
  const [feedbackDraft, setFeedbackDraft] = useState(submission.feedback ?? '')
  const prevHref = model.prevId ? buildLecturerPortalHref('submission-detail', { submissionId: model.prevId }) : undefined
  const nextHref = model.nextId ? buildLecturerPortalHref('submission-detail', { submissionId: model.nextId }) : undefined

  const leftTabs = useMemo(
    () => [
      { id: 'content', label: 'Bài nộp' },
      { id: 'history', label: 'Phiên bản', countLabel: String(model.attempts?.length ?? 0) },
      { id: 'rubric', label: 'Rubric', countLabel: String(model.rubric?.length ?? 0) },
      { id: 'feedback', label: 'Phản hồi', countLabel: String(model.feedbackThread?.length ?? 0) },
    ],
    [model.attempts?.length, model.feedbackThread?.length, model.rubric?.length],
  )

  return (
    <LecturerPortalLayout frame={model.frame}>
      <div className="page-workspace">
        <InfoHeader
          title={submission.studentName}
          subtitle={`${submission.studentCode} · Nộp lúc ${submission.submittedAtLabel}`}
          badges={[
            { label: submission.submissionStatusLabel, tone: submission.submissionTone },
            { label: submission.gradingStatusLabel, tone: submission.gradingTone },
          ]}
          actions={
            <>
              <a className="portal-outline-button" href={submission.assignmentHref}>
                Bài tập
              </a>
              <a className="portal-outline-button" href={submission.queueHref}>
                Hàng chấm
              </a>
              {prevHref ? <a className="portal-outline-button" href={prevHref}>Trước</a> : null}
              {nextHref ? <a className="portal-outline-button" href={nextHref}>Sau</a> : null}
            </>
          }
        />

        <div className="grading-workspace">
          <div className="grading-main">
            <PortalSectionTabs items={leftTabs} activeId={activeLeftTab} onChange={(id) => setActiveLeftTab(id as LeftTabId)} />

            {activeLeftTab === 'content' ? (
              <div className="tab-panel">
                <div className="grading-content-body">
                  <h3>{submission.assignmentTitle}</h3>
                  <p>{submission.contentText}</p>

                  {submission.attachmentUrls.length ? (
                    <ul className="portal-attachment-list">
                      {submission.attachmentUrls.map((url) => (
                        <li key={url}>{url}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="portal-muted-text">Không có tệp đính kèm cho bài nộp này.</p>
                  )}
                </div>
              </div>
            ) : null}

            {activeLeftTab === 'history' ? (
              <div className="tab-panel">
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
                  <EmptyState title="Chỉ có một lần nộp" description="Không có phiên bản cũ hơn cho bài nộp này." />
                )}
              </div>
            ) : null}

            {activeLeftTab === 'rubric' ? (
              <div className="tab-panel">
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
                  <EmptyState title="Chưa có rubric" description="Bài tập này chưa cấu hình rubric chi tiết." />
                )}
              </div>
            ) : null}

            {activeLeftTab === 'feedback' ? (
              <div className="tab-panel">
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
                  <EmptyState title="Chưa có phản hồi" description="Khi giảng viên hoặc sinh viên trao đổi, nội dung sẽ hiển thị tại đây." />
                )}
              </div>
            ) : null}
          </div>

          <div className="grading-side">
            <div className="grading-panel">
              <h3>Chấm điểm và phản hồi</h3>

              <div className="portal-form-stack">
                <div className="portal-form-field">
                  <label className="portal-form-label">Điểm</label>
                  <input
                    type="number"
                    className="portal-input"
                    value={scoreDraft}
                    onChange={(event) => setScoreDraft(event.target.value)}
                    min={0}
                    max={submission.maxScoreValue}
                  />
                  <p className="portal-form-help">Tối đa: {submission.maxScoreValue}</p>
                </div>

                <div className="portal-form-field">
                  <label className="portal-form-label">Phản hồi</label>
                  <textarea
                    className="portal-textarea"
                    rows={4}
                    value={feedbackDraft}
                    onChange={(event) => setFeedbackDraft(event.target.value)}
                    placeholder="Nhập nhận xét cho sinh viên."
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
                  <strong>{submission.classLabel}</strong>
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
