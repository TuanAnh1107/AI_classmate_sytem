import { useMemo, useState } from 'react'
import type { DataState } from '../../../models/shared/portal.types'
import { buildStudentPortalHref } from '../../../models/student/student.mappers'
import { validateSubmissionPayload } from '../../../utils/assignmentValidators'
import { useStudentAssignmentSubmitController } from '../../../controllers/student/useStudentAssignmentSubmitController'
import { AssignmentSubmissionQuestionCard } from '../../components/student/AssignmentSubmissionQuestionCard'
import { AttachmentList } from '../../components/shared/AttachmentList'
import { DisclosureSection } from '../../components/shared/DisclosureSection'
import { EmptyState } from '../../components/shared/EmptyState'
import { FileUploadField } from '../../components/shared/FileUploadField'
import { FormField } from '../../components/shared/FormField'
import { FormRow } from '../../components/shared/FormRow'
import { LoadingState } from '../../components/shared/LoadingState'
import { PortalSectionTabs } from '../../components/shared/PortalSectionTabs'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { SubmissionStatusChip } from '../../components/shared/SubmissionStatusChip'
import { TextArea } from '../../components/shared/TextArea'
import { TextInput } from '../../components/shared/TextInput'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentAssignmentSubmitPageProps = {
  dataState: DataState
  assignmentId?: string
}

type SubmitTabId = 'overview' | 'questions' | 'package'

export function StudentAssignmentSubmitPage({ dataState, assignmentId }: StudentAssignmentSubmitPageProps) {
  const model = useStudentAssignmentSubmitController(assignmentId, dataState)
  const [activeTab, setActiveTab] = useState<SubmitTabId>('questions')
  const [contentText, setContentText] = useState('')
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([])
  const [attachmentInput, setAttachmentInput] = useState('')
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
        <div className="portal-inline-error">{model.errorMessage}</div>
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
  const submitPolicy = assignment.submitPolicy
  const isClosed = assignment.assignmentStatus === 'closed'
  const canSubmit = submitPolicy.allowed && !isClosed
  const isResubmit = assignment.submissionStatus === 'submitted' || assignment.submissionStatus === 'late'
  const detailHref = assignmentId ? buildStudentPortalHref('assignment-detail', { assignmentId }) : buildStudentPortalHref('assignments')

  const handleAddAttachment = () => {
    if (!attachmentInput.trim()) {
      return
    }
    setAttachmentUrls((prev) => [...prev, attachmentInput.trim()])
    setAttachmentInput('')
  }

  const handleSubmit = () => {
    const validation = validateSubmissionPayload({ contentText, attachmentUrls })
    setValidationMessage(validation.isValid ? undefined : validation.message)
  }

  const tabs = useMemo(
    () => [
      { id: 'overview', label: 'Tổng quan bài tập' },
      { id: 'questions', label: 'Câu hỏi cần nộp', countLabel: `${assignment.questions.length}` },
      { id: 'package', label: 'Gói bài nộp', countLabel: attachmentUrls.length ? `${attachmentUrls.length}` : undefined },
    ],
    [assignment.questions.length, attachmentUrls.length],
  )

  return (
    <StudentPortalLayout frame={model.frame}>
      <section className="student-page-body portal-page-transition">
        <div className="workflow-command-bar">
          <div className="workflow-command-copy">
            <p className="portal-page-kicker">Khu nộp bài</p>
            <h2>Chỉ mở đúng phần bạn đang thao tác</h2>
            <p>
              Màn nộp bài giờ chia thành ba vùng riêng. Mặc định tập trung vào câu hỏi cần làm, còn gói nộp và phần tổng quan
              được đưa ra theo tab để tránh một trang form quá dài.
            </p>
          </div>
          <div className="workflow-command-actions portal-button-row">
            <a className="portal-outline-button" href={detailHref}>
              Quay lại chi tiết bài
            </a>
            <button type="button" className="portal-outline-button">
              Lưu nháp
            </button>
            <button type="button" className="portal-primary-button" disabled={!canSubmit} onClick={handleSubmit}>
              {isResubmit ? 'Nộp lại' : 'Nộp bài'}
            </button>
          </div>
        </div>

        <section className="student-focus-hero assignment-focus-hero">
          <div className="student-focus-copy">
            <p className="portal-page-kicker">{assignment.classLabel}</p>
            <h1>{assignment.title}</h1>
            <p>Hạn nộp: {assignment.deadlineLabel}</p>
          </div>

          <div className="student-focus-actions">
            <div className="student-focus-statuses">
              <SubmissionStatusChip status={assignment.submissionStatus} />
              <StatusBadge label={assignment.gradingLabel} tone={assignment.gradingTone} />
            </div>
          </div>
        </section>

        {submitPolicy.reason ? <div className="student-inline-alert">{submitPolicy.reason}</div> : null}
        {isClosed ? <div className="portal-inline-error">Bài đã đóng, không thể nộp thêm.</div> : null}
        {!canSubmit && !isClosed ? <div className="portal-inline-error">Bài đã quá hạn và không còn được nộp.</div> : null}
        {validationMessage ? <div className="portal-inline-error">{validationMessage}</div> : null}

        <div className="student-summary-strip">
          <article className="student-summary-card">
            <span>Tiến độ</span>
            <strong>{assignment.completionLabel}</strong>
          </article>
          <article className="student-summary-card">
            <span>Định dạng nộp</span>
            <strong>{assignment.allowedSubmissionFormats.join(', ')}</strong>
          </article>
          <article className="student-summary-card">
            <span>Chính sách</span>
            <strong>{submitPolicy.allowed ? 'Có thể nộp' : 'Đang bị chặn'}</strong>
          </article>
        </div>

        <PortalSectionTabs items={tabs} activeId={activeTab} onChange={(id) => setActiveTab(id as SubmitTabId)} />

        {activeTab === 'overview' ? (
          <section className="portal-section-card">
            <header className="portal-section-head">
              <div>
                <p className="portal-section-kicker">Tổng quan</p>
                <h2>Yêu cầu chung</h2>
                <p className="portal-section-description">Giữ phần tổng quan thật ngắn, để việc làm bài và đóng gói bài nộp không bị chìm xuống dưới.</p>
              </div>
            </header>

            <div className="assignment-instruction-box">
              <h3>Checklist tổng quan</h3>
              <ul>
                {assignment.instructions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {activeTab === 'questions' ? (
          <section className="portal-section-card">
            <header className="portal-section-head">
              <div>
                <p className="portal-section-kicker">Phần chính</p>
                <h2>Câu hỏi cần hoàn thành</h2>
                <p className="portal-section-description">Mỗi câu chỉ hiện tóm tắt trước, nhấn mở khi cần nhập bài làm hoặc tải tệp.</p>
              </div>
            </header>
            <div className="assignment-question-list">
              {assignment.questions.map((question) => (
                <AssignmentSubmissionQuestionCard key={question.id} question={question} />
              ))}
            </div>
          </section>
        ) : null}

        {activeTab === 'package' ? (
          <section className="portal-section-card">
            <header className="portal-section-head">
              <div>
                <p className="portal-section-kicker">Gói nộp cuối</p>
                <h2>Đóng gói bài nộp</h2>
                <p className="portal-section-description">Gom liên kết, ghi chú và tệp bổ sung vào cùng một nơi, thay vì chia nhỏ ra nhiều khối trên màn.</p>
              </div>
            </header>

            <div className="portal-form-stack">
              <section className="assignment-info-panel">
                <h3>Liên kết bài làm</h3>
                <FormRow>
                  <FormField label="Liên kết bài làm (tùy chọn)">
                    <TextInput
                      value={attachmentInput}
                      placeholder="https://drive.google.com/..."
                      onChange={setAttachmentInput}
                    />
                  </FormField>
                </FormRow>
                <div className="portal-button-row">
                  <button type="button" className="portal-outline-button" onClick={handleAddAttachment}>
                    Thêm liên kết
                  </button>
                </div>
                <AttachmentList items={attachmentUrls} />
              </section>

              <DisclosureSection
                title="Ghi chú cho giảng viên"
                kicker="Ghi chú tùy chọn"
                description="Chỉ mở khi bạn thực sự cần gửi thêm ngữ cảnh cho người chấm."
                className="assignment-inline-disclosure"
              >
                <FormField label="Nội dung ghi chú">
                  <TextArea value={contentText} onChange={setContentText} placeholder="Nhập ghi chú nếu cần." />
                </FormField>
              </DisclosureSection>

              <DisclosureSection
                title="Tệp bổ sung"
                kicker="Tệp tùy chọn"
                description="Ẩn mặc định để vùng package giữ được sự gọn gàng khi bạn không cần thêm minh chứng."
                className="assignment-inline-disclosure"
              >
                <FileUploadField label="Tải tệp bổ sung" helper="Hệ thống chấp nhận PDF hoặc DOCX." />
              </DisclosureSection>
            </div>
          </section>
        ) : null}
      </section>
    </StudentPortalLayout>
  )
}
