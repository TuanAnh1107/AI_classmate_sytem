import { useMemo, useState } from 'react'
import type { DataState } from '../../../models/shared/portal.types'
import { useStudentAssignmentDetailController } from '../../../controllers/student/useStudentAssignmentsController'
import { buildStudentPortalHref } from '../../../models/student/student.mappers'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { InfoHeader } from '../../components/shared/InfoHeader'
import { LoadingState } from '../../components/shared/LoadingState'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentAssignmentDetailPageProps = {
  dataState: DataState
  assignmentId?: string
}

export function StudentAssignmentDetailPage({ dataState, assignmentId }: StudentAssignmentDetailPageProps) {
  const model = useStudentAssignmentDetailController(assignmentId, dataState)
  const [note, setNote] = useState('')
  const [replyDraft, setReplyDraft] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  if (model.state === 'loading') {
    return (
      <StudentPortalLayout frame={model.frame}>
        <LoadingState description="Đang tải chi tiết bài tập." />
      </StudentPortalLayout>
    )
  }

  if (model.state === 'error') {
    return (
      <StudentPortalLayout frame={model.frame}>
        <ErrorState description={model.errorMessage ?? 'Không thể tải dữ liệu bài tập.'} />
      </StudentPortalLayout>
    )
  }

  const assignment = model.assignment
  if (!assignment) {
    return (
      <StudentPortalLayout frame={model.frame}>
        <EmptyState title="Không tìm thấy bài tập" description="Bài tập có thể đã bị xóa hoặc bạn không có quyền truy cập." />
      </StudentPortalLayout>
    )
  }

  const maxScore = useMemo(
    () =>
      assignment.resultSummary?.maxScore ??
      assignment.questions.reduce(
        (total, question) => total + question.rubric.reduce((rubricTotal, item) => rubricTotal + item.maxScore, 0),
        0,
      ),
    [assignment.questions, assignment.resultSummary],
  )

  const canSubmit = assignment.assignmentStatus !== 'closed'
  const detailSubmitHref = buildStudentPortalHref('assignment-submit', { assignmentId: assignment.id })
  const historyRows = [
    assignment.draftSavedAtLabel
      ? { id: 'draft', label: 'Lưu nháp', timeLabel: assignment.draftSavedAtLabel, tone: 'neutral' as const }
      : undefined,
    assignment.submittedAtLabel
      ? { id: 'submitted', label: 'Đã nộp', timeLabel: assignment.submittedAtLabel, tone: assignment.submissionTone }
      : undefined,
  ].filter(Boolean) as { id: string; label: string; timeLabel: string; tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger' }[]

  return (
    <StudentPortalLayout frame={model.frame}>
      <div className="page-workspace">
        <InfoHeader
          title={assignment.title}
          subtitle={`${assignment.classLabel} · Hạn nộp: ${assignment.deadlineLabel}`}
          badges={[
            { label: assignment.submissionLabel, tone: assignment.submissionTone },
            { label: assignment.gradingLabel, tone: assignment.gradingTone },
          ]}
          stats={[
            { label: 'Số câu hỏi', value: String(assignment.questions.length) },
            { label: 'Điểm tối đa', value: String(maxScore) },
            { label: 'Định dạng', value: assignment.allowedSubmissionFormats.join(', ') },
          ]}
          scoreLabel={assignment.resultSummary ? `${assignment.resultSummary.totalScore}/${assignment.resultSummary.maxScore}` : undefined}
          actions={
            <>
              <a className="portal-outline-button" href={buildStudentPortalHref('assignments')}>
                Quay lại danh sách
              </a>
              <a className="portal-primary-button" href={detailSubmitHref}>
                {assignment.submissionTone === 'success' || assignment.submissionTone === 'info' ? 'Cập nhật bài nộp' : 'Nộp bài'}
              </a>
            </>
          }
        />

        <div className="assignment-detail-layout">
          <div className="assignment-detail-main">
            <section className="content-panel">
              <div className="content-panel-header">
                <div>
                  <h2>Thông tin bài tập</h2>
                  <p>Đọc yêu cầu, tài nguyên và tiêu chí trước khi nộp bài.</p>
                </div>
              </div>

              <div style={{ display: 'grid', gap: 16 }}>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7 }}>{assignment.description}</p>

                {assignment.instructions.length ? (
                  <div>
                    <h3 style={{ marginBottom: 10 }}>Hướng dẫn thực hiện</h3>
                    <ul style={{ margin: 0, paddingLeft: 18, display: 'grid', gap: 6, fontSize: 14, lineHeight: 1.6 }}>
                      {assignment.instructions.map((instruction) => (
                        <li key={instruction}>{instruction}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {assignment.questions.length ? (
                  <div>
                    <h3 style={{ marginBottom: 10 }}>Nội dung bài tập</h3>
                    <div className="assignment-list-stack">
                      {assignment.questions.map((question) => (
                        <article key={question.id} className="assignment-list-card">
                          <div className="assignment-list-card-main">
                            <div className="assignment-list-card-head">
                              <strong>Câu {question.order}</strong>
                              <span className="portal-muted-text">{question.rubric.length} tiêu chí</span>
                            </div>
                            <p className="assignment-list-card-summary">{question.prompt}</p>
                            {question.attachmentName ? (
                              <div className="assignment-list-card-meta">
                                <span>Tệp đính kèm: {question.attachmentName}</span>
                              </div>
                            ) : null}
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                ) : null}

                <dl className="info-pair-list">
                  <div>
                    <dt>Hạn nộp</dt>
                    <dd>{assignment.deadlineLabel}</dd>
                  </div>
                  <div>
                    <dt>Cho phép nộp trễ</dt>
                    <dd>{assignment.allowLateSubmission ? 'Có' : 'Không'}</dd>
                  </div>
                  <div>
                    <dt>Tiến độ hiện tại</dt>
                    <dd>{assignment.completionLabel}</dd>
                  </div>
                  <div>
                    <dt>Định dạng chấp nhận</dt>
                    <dd>{assignment.allowedSubmissionFormats.join(', ')}</dd>
                  </div>
                </dl>

                {assignment.resourceLinks.length ? (
                  <div>
                    <h3 style={{ marginBottom: 10 }}>Tài nguyên đính kèm</h3>
                    <ul className="portal-attachment-list">
                      {assignment.resourceLinks.map((resource) => (
                        <li key={resource.id}>{resource.label}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>

            <section className="content-panel">
              <div className="content-panel-header">
                <div>
                  <h2>Phản hồi</h2>
                  <p>Chỉ mở khi bài tập đã có điểm hoặc có nhận xét từ giảng viên.</p>
                </div>
                {assignment.resultSummary ? (
                  <button type="button" className="portal-outline-button">
                    Yêu cầu phúc khảo
                  </button>
                ) : null}
              </div>

              {assignment.resultSummary ? (
                <div style={{ display: 'grid', gap: 12 }}>
                  <div className="feedback-message-card role-lecturer">
                    <header>
                      <strong>Giảng viên</strong>
                      <span>{assignment.resultSummary.updatedAtLabel}</span>
                    </header>
                    <p>{assignment.resultSummary.lecturerFeedback}</p>
                  </div>

                  {assignment.feedbackMessages.length ? (
                    <div className="feedback-message-list">
                      {assignment.feedbackMessages.map((message) => (
                        <div key={message.id} className={`feedback-message-card role-${message.authorRole}`}>
                          <header>
                            <strong>{message.authorName}</strong>
                            <span>{message.sentAt}</span>
                          </header>
                          <p>{message.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  <div className="portal-form-field">
                    <label className="portal-form-label">Nội dung phản hồi</label>
                    <textarea
                      className="portal-textarea"
                      rows={4}
                      value={replyDraft}
                      onChange={(event) => setReplyDraft(event.target.value)}
                      placeholder="Nhập nội dung trao đổi với giảng viên."
                    />
                  </div>

                  <div className="portal-button-row">
                    <button type="button" className="portal-primary-button">
                      Gửi phản hồi
                    </button>
                    <a className="portal-outline-button" href={assignment.resultSummary.resultHref}>
                      Xem kết quả chi tiết
                    </a>
                  </div>
                </div>
              ) : (
                <EmptyState title="Chưa có phản hồi" description="Khu vực phản hồi sẽ mở khi bài tập đã được chấm điểm." />
              )}
            </section>
          </div>

          <aside className="assignment-detail-side">
            <section className="content-panel">
              <div className="content-panel-header">
                <div>
                  <h2>Khu vực nộp bài</h2>
                  <p>Tải file bài làm lên ngay tại đây.</p>
                </div>
              </div>

              <div className="portal-form-stack">
                <div className="portal-form-field">
                  <label className="portal-form-label">Tệp bài làm</label>
                  <input
                    type="file"
                    className="portal-input"
                    multiple
                    onChange={(event) => {
                      const files = Array.from(event.target.files ?? []).map((file) => file.name)
                      setSelectedFiles(files)
                    }}
                  />
                  <p className="portal-form-help">Tải lên PDF, DOCX hoặc tệp minh chứng theo yêu cầu bài tập.</p>
                </div>

                {selectedFiles.length ? (
                  <ul className="portal-attachment-list">
                    {selectedFiles.map((fileName) => (
                      <li key={fileName}>{fileName}</li>
                    ))}
                  </ul>
                ) : null}

                <div className="portal-form-field">
                  <label className="portal-form-label">Ghi chú cho giảng viên</label>
                  <textarea
                    className="portal-textarea"
                    rows={4}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Nhập mô tả ngắn cho bài nộp nếu cần."
                  />
                </div>

                <div className="portal-button-row">
                  <button type="button" className="portal-outline-button">
                    Lưu nháp
                  </button>
                  <button type="button" className="portal-primary-button" disabled={!canSubmit}>
                    {assignment.submissionTone === 'success' || assignment.submissionTone === 'info' ? 'Nộp lại' : 'Nộp bài'}
                  </button>
                </div>
              </div>
            </section>

            <section className="content-panel">
              <div className="content-panel-header">
                <div>
                  <h2>Lịch sử nộp bài</h2>
                  <p>Theo dõi các lần lưu nháp và nộp bài.</p>
                </div>
              </div>

              {historyRows.length ? (
                <div className="compact-list">
                  {historyRows.map((entry) => (
                    <div key={entry.id} className="compact-list-item">
                      <div>
                        <span className="compact-list-title">{entry.label}</span>
                        <div className="compact-list-meta">{entry.timeLabel}</div>
                      </div>
                      <StatusBadge label={entry.label} tone={entry.tone} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Chưa có lần nộp nào" description="Lịch sử sẽ xuất hiện sau khi bạn lưu nháp hoặc nộp bài." />
              )}
            </section>
          </aside>
        </div>
      </div>
    </StudentPortalLayout>
  )
}
