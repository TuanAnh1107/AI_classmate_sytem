import type { DataState } from '../../../models/shared/portal.types'
import { useStudentAssignmentDetailController } from '../../../controllers/student/useStudentAssignmentsController'
import { buildStudentPortalHref } from '../../../models/student/student.mappers'
import { CollapsibleSection } from '../../components/shared/CollapsibleSection'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { LoadingState } from '../../components/shared/LoadingState'
import { MetricBar } from '../../components/shared/MetricBar'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentAssignmentDetailPageProps = {
  dataState: DataState
  assignmentId?: string
}

export function StudentAssignmentDetailPage({ dataState, assignmentId }: StudentAssignmentDetailPageProps) {
  const model = useStudentAssignmentDetailController(assignmentId, dataState)

  if (model.state === 'loading') {
    return (
      <StudentPortalLayout frame={model.frame}>
        <LoadingState />
      </StudentPortalLayout>
    )
  }

  if (model.state === 'error') {
    return (
      <StudentPortalLayout frame={model.frame}>
        <ErrorState description={model.errorMessage ?? 'Không thể tải dữ liệu.'} />
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

  const maxScore = assignment.resultSummary?.maxScore ?? assignment.questions.reduce(
    (total, question) => total + question.rubric.reduce((rubricTotal, item) => rubricTotal + item.maxScore, 0),
    0,
  )

  const submissionHistory = [
    assignment.draftSavedAtLabel
      ? { id: 'draft', label: 'Lưu nháp', timeLabel: assignment.draftSavedAtLabel, tone: 'neutral' as const }
      : undefined,
    assignment.submittedAtLabel
      ? { id: 'submitted', label: assignment.submissionLabel, timeLabel: assignment.submittedAtLabel, tone: assignment.submissionTone }
      : undefined,
  ].filter((item): item is { id: string; label: string; timeLabel: string; tone: 'neutral' | 'info' | 'success' | 'warning' | 'danger' } => Boolean(item))

  const canContinueSubmission = assignment.assignmentStatus !== 'closed'
  const submitHref = buildStudentPortalHref('assignment-submit', { assignmentId: assignment.id })

  return (
    <StudentPortalLayout frame={model.frame}>
      <div className="page-title-bar">
        <div>
          <h1>{assignment.title}</h1>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px', flexWrap: 'wrap' }}>
            <StatusBadge label={assignment.submissionLabel} tone={assignment.submissionTone} />
            <StatusBadge label={assignment.gradingLabel} tone={assignment.gradingTone} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Hạn: {assignment.deadlineLabel}</span>
          </div>
        </div>
        <div className="page-title-bar-actions">
          {canContinueSubmission ? (
            <a className="portal-primary-button" href={submitHref}>
              {assignment.submissionTone === 'warning' || assignment.submissionTone === 'neutral' ? 'Nộp bài' : 'Cập nhật bài nộp'}
            </a>
          ) : null}
        </div>
      </div>

      <div className="student-page-body portal-page-transition">
        {assignment.resultSummary ? (
          <div className="score-banner">
            <span>Điểm</span>
            <strong>{assignment.resultSummary.totalScore}/{assignment.resultSummary.maxScore}</strong>
          </div>
        ) : null}

        <MetricBar
          items={[
            { id: 'class', label: 'Lớp', value: assignment.classLabel },
            { id: 'deadline', label: 'Hạn nộp', value: assignment.deadlineLabel },
            { id: 'questions', label: 'Câu hỏi', value: String(assignment.questions.length) },
            { id: 'max-score', label: 'Điểm tối đa', value: String(maxScore) },
          ]}
        />

        <CollapsibleSection title="Nộp bài" count={assignment.questions.length} defaultOpen>
          {assignment.questions.length ? (
            <div style={{ display: 'grid', gap: '12px' }}>
              {assignment.questions.map((question) => (
                <div key={question.id} className="question-card">
                  <h4>Câu {question.order}</h4>
                  <p>{question.prompt}</p>

                  {question.answerText ? (
                    <div style={{ marginTop: '8px', padding: '8px', background: 'var(--surface-alt)', borderRadius: '2px', fontSize: '13px' }}>
                      {question.answerText}
                    </div>
                  ) : null}

                  {question.uploadedFiles.length ? (
                    <ul className="portal-attachment-list">
                      {question.uploadedFiles.map((file) => (
                        <li key={file.id}>
                          {file.fileName} ({file.sizeLabel})
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="Chưa có nội dung" description="Câu hỏi sẽ được hiển thị ở đây." />
          )}
        </CollapsibleSection>

        <CollapsibleSection title="Thông tin bài tập">
          <dl className="info-pair-list">
            <div>
              <dt>Tiêu đề</dt>
              <dd>{assignment.title}</dd>
            </div>
            <div>
              <dt>Lớp</dt>
              <dd>{assignment.classLabel}</dd>
            </div>
            <div>
              <dt>Hạn nộp</dt>
              <dd>{assignment.deadlineLabel}</dd>
            </div>
            <div>
              <dt>Nộp trễ</dt>
              <dd>{assignment.allowLateSubmission ? 'Cho phép có điều kiện' : 'Không cho phép'}</dd>
            </div>
            {assignment.description ? (
              <div>
                <dt>Mô tả</dt>
                <dd style={{ textAlign: 'left', maxWidth: '50ch' }}>{assignment.description}</dd>
              </div>
            ) : null}
          </dl>

          {assignment.requirements.length ? (
            <div style={{ marginTop: '12px' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Yêu cầu
              </h3>
              <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                {assignment.requirements.map((requirement, index) => (
                  <li key={`${requirement.label}-${index}`}>
                    {requirement.label}: {requirement.detail}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CollapsibleSection>

        <CollapsibleSection title="Lịch sử nộp bài" count={submissionHistory.length}>
          {submissionHistory.length ? (
            <div className="compact-list">
              {submissionHistory.map((entry) => (
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
            <EmptyState title="Chưa có lần nộp nào" description="Lịch sử nộp bài sẽ hiển thị ở đây sau khi bạn thao tác." />
          )}
        </CollapsibleSection>

        {(assignment.feedbackMessages.length || assignment.resultSummary) ? (
          <CollapsibleSection title="Phản hồi từ giảng viên" count={assignment.feedbackMessages.length}>
            {assignment.resultSummary?.lecturerFeedback ? (
              <div className="feedback-message-card role-lecturer" style={{ marginBottom: assignment.feedbackMessages.length ? '12px' : 0 }}>
                <header>
                  <strong>Nhận xét tổng quan</strong>
                  <span>{assignment.resultSummary.updatedAtLabel}</span>
                </header>
                <p>{assignment.resultSummary.lecturerFeedback}</p>
              </div>
            ) : null}

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
          </CollapsibleSection>
        ) : null}
      </div>
    </StudentPortalLayout>
  )
}
