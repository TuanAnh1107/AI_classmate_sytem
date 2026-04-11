import { useMemo, useState } from 'react'
import type { DataState } from '../../../models/shared/portal.types'
import { buildStudentPortalHref } from '../../../models/student/student.mappers'
import { validateSubmissionPayload } from '../../../utils/assignmentValidators'
import { useStudentAssignmentSubmitController } from '../../../controllers/student/useStudentAssignmentSubmitController'
import { AssignmentSubmissionQuestionCard } from '../../components/student/AssignmentSubmissionQuestionCard'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { InfoHeader } from '../../components/shared/InfoHeader'
import { LoadingState } from '../../components/shared/LoadingState'
import { PortalSectionTabs } from '../../components/shared/PortalSectionTabs'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentAssignmentSubmitPageProps = {
  dataState: DataState
  assignmentId?: string
}

type SubmitTabId = 'questions' | 'submit'

export function StudentAssignmentSubmitPage({ dataState, assignmentId }: StudentAssignmentSubmitPageProps) {
  const model = useStudentAssignmentSubmitController(assignmentId, dataState)
  const [activeTab, setActiveTab] = useState<SubmitTabId>('submit')
  const [contentText, setContentText] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [validationMessage, setValidationMessage] = useState<string | undefined>()

  if (model.state === 'loading') {
    return (
      <StudentPortalLayout frame={model.frame}>
        <LoadingState description="Đang mở biểu mẫu nộp bài." />
      </StudentPortalLayout>
    )
  }

  if (model.state === 'error') {
    return (
      <StudentPortalLayout frame={model.frame}>
        <ErrorState description={model.errorMessage ?? 'Không thể tải biểu mẫu nộp bài.'} />
      </StudentPortalLayout>
    )
  }

  if (model.state === 'empty' || !model.assignment) {
    return (
      <StudentPortalLayout frame={model.frame}>
        <EmptyState title="Không tìm thấy bài tập" description="Vui lòng quay lại danh sách bài tập để chọn lại." />
      </StudentPortalLayout>
    )
  }

  const assignment = model.assignment
  const canSubmit = assignment.submitPolicy.allowed && assignment.assignmentStatus !== 'closed'
  const detailHref = buildStudentPortalHref('assignment-detail', { assignmentId })

  const tabs = useMemo(
    () => [
      { id: 'submit', label: 'Nộp bài' },
      { id: 'questions', label: 'Câu hỏi', countLabel: String(assignment.questions.length) },
    ],
    [assignment.questions.length],
  )

  const handleSubmit = () => {
    const validation = validateSubmissionPayload({ contentText, attachmentUrls: selectedFiles })
    setValidationMessage(validation.isValid ? undefined : validation.message)
  }

  return (
    <StudentPortalLayout frame={model.frame}>
      <div className="page-workspace">
        <InfoHeader
          title={assignment.title}
          subtitle={`${assignment.classLabel} · Hạn nộp: ${assignment.deadlineLabel}`}
          badges={[{ label: assignment.submissionLabel, tone: assignment.submissionTone }]}
          stats={[
            { label: 'Tiến độ', value: assignment.completionLabel },
            { label: 'Định dạng', value: assignment.allowedSubmissionFormats.join(', ') },
            { label: 'Chính sách', value: assignment.submitPolicy.allowed ? 'Có thể nộp' : 'Bị chặn' },
          ]}
          actions={
            <>
              <a className="portal-outline-button" href={detailHref}>
                Quay lại chi tiết
              </a>
              <button type="button" className="portal-primary-button" disabled={!canSubmit} onClick={handleSubmit}>
                Nộp bài
              </button>
            </>
          }
        />

        {assignment.submitPolicy.reason ? <div className="student-inline-alert">{assignment.submitPolicy.reason}</div> : null}
        {validationMessage ? <div className="portal-inline-error">{validationMessage}</div> : null}

        <PortalSectionTabs items={tabs} activeId={activeTab} onChange={(id) => setActiveTab(id as SubmitTabId)} />

        {activeTab === 'submit' ? (
          <section className="content-panel">
            <div className="content-panel-header">
              <div>
                <h2>Khu vực nộp bài</h2>
                <p>Tải file bài làm lên và nhập ghi chú nếu cần.</p>
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
                <p className="portal-form-help">Yêu cầu quan trọng: tải file bài làm lên trước khi nộp.</p>
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
                  value={contentText}
                  onChange={(event) => setContentText(event.target.value)}
                  placeholder="Nhập ghi chú cho bài nộp nếu cần."
                />
              </div>

              <div className="portal-button-row">
                <button type="button" className="portal-outline-button">
                  Lưu nháp
                </button>
                <button type="button" className="portal-primary-button" disabled={!canSubmit} onClick={handleSubmit}>
                  Nộp bài
                </button>
              </div>
            </div>
          </section>
        ) : null}

        {activeTab === 'questions' ? (
          <section className="tab-panel">
            <div className="assignment-question-list">
              {assignment.questions.map((question) => (
                <AssignmentSubmissionQuestionCard key={question.id} question={question} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </StudentPortalLayout>
  )
}
