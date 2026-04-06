import type { DataState } from '../../../models/shared/portal.types'
import { useStudentAssignmentDetailController } from '../../../controllers/student/useStudentAssignmentsController'
import { AssignmentQuestionCard } from '../../components/student/AssignmentQuestionCard'
import { AssignmentSubmissionPanel } from '../../components/student/AssignmentSubmissionPanel'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'
import { PageSection } from '../../components/shared/PageSection'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentAssignmentDetailPageProps = {
  dataState: DataState
  assignmentId?: string
}

export function StudentAssignmentDetailPage({ dataState, assignmentId }: StudentAssignmentDetailPageProps) {
  const model = useStudentAssignmentDetailController(assignmentId, dataState)

  return (
    <StudentPortalLayout frame={model.frame}>
      {model.state === 'loading' ? <LoadingState description="Đang mở chi tiết bài tập và câu hỏi liên quan." /> : null}
      {model.state === 'error' ? <div className="portal-inline-error">{model.errorMessage}</div> : null}

      {model.assignment && model.state !== 'loading' && model.state !== 'error' ? (
        <div className="student-detail-grid">
          <div className="student-detail-main">
            <PageSection
              title={model.assignment.title}
              kicker={model.assignment.classLabel}
              description={`Deadline: ${model.assignment.deadlineLabel}`}
              actions={
                <div className="portal-section-status-row">
                  <StatusBadge label={model.assignment.submissionLabel} tone={model.assignment.submissionTone} />
                  <StatusBadge label={model.assignment.gradingLabel} tone={model.assignment.gradingTone} />
                  <div className="portal-button-row">
                    <button type="button" className="portal-outline-button">
                      Lưu nháp
                    </button>
                    <button type="button" className="portal-primary-button">
                      Nộp bài
                    </button>
                  </div>
                </div>
              }
            >
              <div className="assignment-instruction-box">
                <h3>Yêu cầu chung</h3>
                <ul>
                  {model.assignment.instructions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>

              {model.state === 'empty' ? (
                <EmptyState
                  title="Chưa có câu hỏi để hiển thị"
                  description="Giảng viên chưa phát hành nội dung câu hỏi cho bài tập này."
                />
              ) : (
                <div className="assignment-question-list">
                  {model.assignment.questions.map((question) => (
                    <AssignmentQuestionCard key={question.id} question={question} />
                  ))}
                </div>
              )}
            </PageSection>
          </div>

          <AssignmentSubmissionPanel assignment={model.assignment} />
        </div>
      ) : null}
    </StudentPortalLayout>
  )
}
