import type { StudentAssignmentDetailViewModel } from '../../../controllers/student/useStudentAssignmentsController'
import { StatusBadge } from '../shared/StatusBadge'

type AssignmentSubmissionPanelProps = {
  assignment: NonNullable<StudentAssignmentDetailViewModel['assignment']>
}

export function AssignmentSubmissionPanel({ assignment }: AssignmentSubmissionPanelProps) {
  return (
    <aside className="assignment-submission-panel">
      <section className="portal-aside-card">
        <header>
          <h3>Thông tin nộp bài</h3>
          <p>Theo dõi hạn nộp, tiến độ và yêu cầu định dạng trước khi gửi chính thức.</p>
        </header>

        <dl className="info-pair-list">
          <div>
            <dt>Deadline</dt>
            <dd>{assignment.deadlineLabel}</dd>
          </div>
          <div>
            <dt>Trạng thái nộp</dt>
            <dd>
              <StatusBadge label={assignment.submissionLabel} tone={assignment.submissionTone} />
            </dd>
          </div>
          <div>
            <dt>Trạng thái chấm</dt>
            <dd>
              <StatusBadge label={assignment.gradingLabel} tone={assignment.gradingTone} />
            </dd>
          </div>
          <div>
            <dt>Tiến độ</dt>
            <dd>{assignment.completionLabel}</dd>
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
      </section>

      <section className="portal-aside-card">
        <header>
          <h3>Yêu cầu nộp</h3>
        </header>
        <ul className="aside-detail-list">
          {assignment.requirements.map((item) => (
            <li key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="portal-aside-card">
        <header>
          <h3>Tổng quan rubric</h3>
        </header>
        <ul className="aside-detail-list compact">
          {assignment.questions.map((question) => (
            <li key={question.id}>
              <strong>Câu {question.order}</strong>
              <span>{question.rubric.length} tiêu chí chấm</span>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
