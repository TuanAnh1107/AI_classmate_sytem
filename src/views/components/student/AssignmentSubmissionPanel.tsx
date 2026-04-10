import type { StudentAssignmentDetailViewModel } from '../../../controllers/student/useStudentAssignmentsController'
import { DisclosureSection } from '../shared/DisclosureSection'
import { StatusBadge } from '../shared/StatusBadge'

type AssignmentSubmissionPanelProps = {
  assignment: NonNullable<StudentAssignmentDetailViewModel['assignment']>
}

export function AssignmentSubmissionPanel({ assignment }: AssignmentSubmissionPanelProps) {
  const totalQuestions = assignment.questions.length
  const completedQuestions = assignment.questions.filter((question) => question.completionStatus === 'complete').length
  const progressPercent = totalQuestions ? Math.round((completedQuestions / totalQuestions) * 100) : 0

  return (
    <div className="assignment-submission-panel">
      <section className="portal-aside-card submission-focus-card">
        <header>
          <h3>Trạng thái nộp hiện tại</h3>
          <p>Đây là phần cần nhìn đầu tiên trước khi quyết định nộp mới, nộp lại hay chỉ xem kết quả.</p>
        </header>

        <div className="submission-focus-statuses">
          <StatusBadge label={assignment.submissionLabel} tone={assignment.submissionTone} />
          <StatusBadge label={assignment.gradingLabel} tone={assignment.gradingTone} />
        </div>

        <div className="portal-progress">
          <div className="portal-progress-track">
            <div className="portal-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <span className="portal-progress-label">
            Hoàn thành {completedQuestions}/{totalQuestions || 0} câu · {assignment.completionLabel}
          </span>
        </div>
      </section>

      <DisclosureSection
        title="Mốc nộp bài"
        kicker="Submission history"
        description="Chỉ mở khi bạn cần kiểm tra thời điểm lưu nháp hoặc đã nộp chính thức."
      >
        <dl className="info-pair-list">
          <div>
            <dt>Deadline</dt>
            <dd>{assignment.deadlineLabel}</dd>
          </div>
          {assignment.draftSavedAtLabel ? (
            <div>
              <dt>Lưu nháp gần nhất</dt>
              <dd>{assignment.draftSavedAtLabel}</dd>
            </div>
          ) : null}
          {assignment.submittedAtLabel ? (
            <div>
              <dt>Đã nộp lúc</dt>
              <dd>{assignment.submittedAtLabel}</dd>
            </div>
          ) : null}
        </dl>
      </DisclosureSection>

      <DisclosureSection
        title="Checklist trước khi nộp"
        kicker="Validation"
        description="Mở khi bạn muốn soát nhanh những lỗi dễ gặp trước khi bấm nộp bài."
      >
        <ul className="aside-check-list">
          <li className={completedQuestions === totalQuestions && totalQuestions > 0 ? 'tone-positive' : 'tone-warning'}>
            <strong>Hoàn tất từng câu hỏi</strong>
            <span>Hiện đã hoàn thành {completedQuestions}/{totalQuestions || 0} câu trong bài này.</span>
          </li>
          <li className="tone-positive">
            <strong>Đúng định dạng yêu cầu</strong>
            <span>{assignment.allowedSubmissionFormats.join(', ')}</span>
          </li>
          <li className={assignment.allowLateSubmission ? 'tone-warning' : 'tone-positive'}>
            <strong>Chính sách nộp trễ</strong>
            <span>{assignment.allowLateSubmission ? 'Lớp cho phép nộp trễ nếu cần.' : 'Lớp không chấp nhận nộp sau hạn.'}</span>
          </li>
        </ul>
      </DisclosureSection>

      <DisclosureSection
        title="Yêu cầu nộp"
        kicker="Requirements"
        description="Ẩn mặc định để bạn không phải đọc lại toàn bộ metadata trước mỗi lần thao tác."
      >
        <ul className="aside-detail-list">
          {assignment.requirements.map((item) => (
            <li key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </li>
          ))}
        </ul>
      </DisclosureSection>

      <DisclosureSection
        title="Rubric tổng quan"
        kicker="Rubric overview"
        description="Mở khi cần biết câu nào có nhiều tiêu chí chấm hơn để ưu tiên hoàn thiện."
      >
        <ul className="aside-detail-list compact">
          {assignment.questions.map((question) => (
            <li key={question.id}>
              <strong>Câu {question.order}</strong>
              <span>{question.rubric.length} tiêu chí chấm</span>
            </li>
          ))}
        </ul>
      </DisclosureSection>
    </div>
  )
}
