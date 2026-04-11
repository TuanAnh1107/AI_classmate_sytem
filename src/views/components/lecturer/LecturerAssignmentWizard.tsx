import { useEffect, useMemo, useState } from 'react'
import type { AssignmentQuestionDraft, LecturerClassOption, RubricTemplate } from '../../../models/lecturer/lecturer.types'
import { formatPortalDateTime } from '../../../models/student/student.mappers'
import { validateAssignmentDraft } from '../../../utils/assignmentValidators'
import { AssignmentReviewSummary } from './AssignmentReviewSummary'
import { LecturerStepper } from './LecturerStepper'
import { ConfirmDialog } from '../shared/ConfirmDialog'
import { DateTimeInput } from '../shared/DateTimeInput'
import { FileUploadField } from '../shared/FileUploadField'
import { FormField } from '../shared/FormField'
import { FormRow } from '../shared/FormRow'
import { InfoHeader } from '../shared/InfoHeader'
import { SelectInput } from '../shared/SelectInput'
import { StatusBadge } from '../shared/StatusBadge'
import { TextArea } from '../shared/TextArea'
import { TextInput } from '../shared/TextInput'

export type AssignmentWizardDraft = {
  classId: string
  title: string
  description: string
  dueAt: string
  maxScore: number
  rubricTemplateId: string
  allowLatePolicy: string
  submissionFormats: string
  maxFileSize: string
  resubmissionPolicy: string
  studentInstruction: string
  attachmentNote: string
}

type AssignmentWizardProps = {
  mode: 'create' | 'edit'
  classOptions: LecturerClassOption[]
  rubricTemplates: RubricTemplate[]
  questionDrafts: AssignmentQuestionDraft[]
  initialDraft: AssignmentWizardDraft
}

type StepId = 'general' | 'submission' | 'questions' | 'review'

export function LecturerAssignmentWizard({
  mode,
  classOptions,
  rubricTemplates,
  questionDrafts,
  initialDraft,
}: AssignmentWizardProps) {
  const [step, setStep] = useState<StepId>('general')
  const [draft, setDraft] = useState<AssignmentWizardDraft>(initialDraft)
  const [manualQuestionText, setManualQuestionText] = useState(questionDrafts.map((item) => item.prompt).join('\n\n'))
  const [questionFileLabel, setQuestionFileLabel] = useState('')
  const [rubricFileLabel, setRubricFileLabel] = useState('')
  const [validationMessage, setValidationMessage] = useState<string | undefined>()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)

  useEffect(() => {
    if (!dirty) return
    const timer = window.setTimeout(() => {
      setLastSavedAt(new Date())
      setDirty(false)
    }, 900)
    return () => window.clearTimeout(timer)
  }, [dirty, draft, manualQuestionText, questionFileLabel, rubricFileLabel])

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const selectedClass = classOptions.find((item) => item.id === draft.classId) ?? classOptions[0]
  const warningItems = useMemo(() => {
    const warnings: { id: string; label: string; detail: string; tone: 'info' | 'warning' | 'danger' }[] = []
    if (!draft.title.trim()) {
      warnings.push({ id: 'title', label: 'Thiếu tiêu đề', detail: 'Cần nhập tiêu đề bài tập.', tone: 'warning' })
    }
    if (!manualQuestionText.trim() && !questionFileLabel) {
      warnings.push({ id: 'questions', label: 'Thiếu câu hỏi', detail: 'Cần nhập câu hỏi hoặc tải tệp câu hỏi lên.', tone: 'warning' })
    }
    if (!rubricFileLabel) {
      warnings.push({ id: 'rubric', label: 'Thiếu rubric', detail: 'Rubric file là bắt buộc trước khi phát hành.', tone: 'danger' })
    }
    return warnings
  }, [draft.title, manualQuestionText, questionFileLabel, rubricFileLabel])

  const steps = [
    { id: 'general', label: 'Thông tin chung' },
    { id: 'submission', label: 'Chính sách nộp bài' },
    { id: 'questions', label: 'Câu hỏi và rubric' },
    { id: 'review', label: 'Rà soát và phát hành' },
  ] as const

  const handleFieldChange = <K extends keyof AssignmentWizardDraft>(key: K, value: AssignmentWizardDraft[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }))
    setDirty(true)
  }

  const handlePublish = () => {
    const validation = validateAssignmentDraft({
      title: draft.title,
      description: draft.description,
      dueAt: draft.dueAt,
      maxScore: draft.maxScore,
    })

    if (!manualQuestionText.trim() && !questionFileLabel) {
      setValidationMessage('Cần nhập câu hỏi hoặc tải file câu hỏi trước khi phát hành.')
      return
    }

    if (!rubricFileLabel) {
      setValidationMessage('Cần tải file rubric trước khi phát hành bài tập.')
      return
    }

    if (!validation.isValid) {
      setValidationMessage(validation.message)
      return
    }

    setValidationMessage(undefined)
    setConfirmOpen(true)
  }

  return (
    <div className="page-workspace">
      <InfoHeader
        title={mode === 'create' ? 'Tạo bài tập mới' : 'Chỉnh sửa bài tập'}
        subtitle={
          mode === 'create'
            ? 'Thiết lập đề bài, cách nộp bài và rubric theo đúng lớp phụ trách.'
            : 'Cập nhật nội dung bài tập và giữ nguyên luồng chấm bài hiện có.'
        }
        badges={[{ label: dirty ? 'Chưa lưu' : 'Đã lưu nháp', tone: dirty ? 'warning' : 'success' }]}
        stats={lastSavedAt ? [{ label: 'Lưu nháp lúc', value: formatPortalDateTime(lastSavedAt.toISOString()) }] : []}
        actions={
          <a className="portal-outline-button" href="?portal=lecturer&page=assignments">
            Quay lại danh sách
          </a>
        }
      />

      <LecturerStepper steps={steps.map((item) => ({ ...item, isActive: item.id === step, onClick: () => setStep(item.id) }))} />

      {validationMessage ? <div className="portal-inline-error">{validationMessage}</div> : null}

      {step === 'general' ? (
        <section className="portal-section-card">
          <header className="portal-section-head">
            <div>
              <p className="portal-section-kicker">Bước 1</p>
              <h2>Thông tin chung</h2>
            </div>
            <div className="portal-button-row">
              <button type="button" className="portal-outline-button" onClick={() => setStep('submission')}>
                Tiếp theo
              </button>
            </div>
          </header>

          <div className="portal-form-stack">
            <FormRow>
              <FormField label="Lớp học" required helper="Chọn lớp sẽ nhận bài tập này.">
                <SelectInput
                  value={draft.classId}
                  options={classOptions.map((item) => ({ value: item.id, label: `${item.code} · ${item.name}` }))}
                  onChange={(value) => handleFieldChange('classId', value)}
                />
              </FormField>
              <FormField label="Hạn nộp" required helper="Sinh viên chỉ có thể nộp bài trước mốc này trừ khi bạn bật nộp trễ.">
                <DateTimeInput value={draft.dueAt} onChange={(value) => handleFieldChange('dueAt', value)} />
              </FormField>
            </FormRow>

            <FormField label="Tiêu đề bài tập" required>
              <TextInput value={draft.title} onChange={(value) => handleFieldChange('title', value)} />
            </FormField>

            <FormField label="Mô tả bài tập" required>
              <TextArea value={draft.description} onChange={(value) => handleFieldChange('description', value)} />
            </FormField>

            <FormRow>
              <FormField label="Điểm tối đa" required>
                <TextInput type="number" value={String(draft.maxScore)} onChange={(value) => handleFieldChange('maxScore', Number(value) || 0)} />
              </FormField>
              <FormField label="Rubric mẫu tham chiếu">
                <SelectInput
                  value={draft.rubricTemplateId}
                  options={rubricTemplates.map((item) => ({ value: item.id, label: item.label }))}
                  onChange={(value) => handleFieldChange('rubricTemplateId', value)}
                />
              </FormField>
            </FormRow>
          </div>
        </section>
      ) : null}

      {step === 'submission' ? (
        <section className="portal-section-card">
          <header className="portal-section-head">
            <div>
              <p className="portal-section-kicker">Bước 2</p>
              <h2>Chính sách nộp bài</h2>
            </div>
            <div className="portal-button-row">
              <button type="button" className="portal-outline-button" onClick={() => setStep('general')}>
                Quay lại
              </button>
              <button type="button" className="portal-outline-button" onClick={() => setStep('questions')}>
                Tiếp theo
              </button>
            </div>
          </header>

          <div className="portal-form-stack">
            <FormRow>
              <FormField label="Định dạng chấp nhận">
                <TextInput value={draft.submissionFormats} onChange={(value) => handleFieldChange('submissionFormats', value)} />
              </FormField>
              <FormField label="Dung lượng tối đa">
                <TextInput value={draft.maxFileSize} onChange={(value) => handleFieldChange('maxFileSize', value)} />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField label="Nộp trễ">
                <SelectInput
                  value={draft.allowLatePolicy}
                  options={[
                    { value: 'late-10', label: 'Cho phép nộp trễ, trừ 10%' },
                    { value: 'late-20', label: 'Cho phép nộp trễ, trừ 20%' },
                    { value: 'no-late', label: 'Không cho phép nộp trễ' },
                  ]}
                  onChange={(value) => handleFieldChange('allowLatePolicy', value)}
                />
              </FormField>
              <FormField label="Nộp lại">
                <SelectInput
                  value={draft.resubmissionPolicy}
                  options={[
                    { value: 'once', label: 'Cho phép nộp lại 1 lần' },
                    { value: 'twice', label: 'Cho phép nộp lại 2 lần' },
                    { value: 'none', label: 'Không cho phép nộp lại' },
                  ]}
                  onChange={(value) => handleFieldChange('resubmissionPolicy', value)}
                />
              </FormField>
            </FormRow>

            <FormField label="Hướng dẫn cho sinh viên">
              <TextArea value={draft.studentInstruction} onChange={(value) => handleFieldChange('studentInstruction', value)} />
            </FormField>
          </div>
        </section>
      ) : null}

      {step === 'questions' ? (
        <section className="portal-section-card">
          <header className="portal-section-head">
            <div>
              <p className="portal-section-kicker">Bước 3</p>
              <h2>Câu hỏi và rubric</h2>
            </div>
            <div className="portal-button-row">
              <button type="button" className="portal-outline-button" onClick={() => setStep('submission')}>
                Quay lại
              </button>
              <button type="button" className="portal-outline-button" onClick={() => setStep('review')}>
                Tiếp theo
              </button>
            </div>
          </header>

          <div className="portal-form-stack">
            <FormField label="Nhập nội dung câu hỏi" helper="Giảng viên có thể nhập trực tiếp đề bài tại đây.">
              <TextArea
                value={manualQuestionText}
                onChange={(value) => {
                  setManualQuestionText(value)
                  setDirty(true)
                }}
                placeholder="Ví dụ: Câu 1... Câu 2..."
              />
            </FormField>

            <FileUploadField
              label="Tệp câu hỏi"
              helper="Hoặc tải file câu hỏi lên thay cho việc nhập trực tiếp."
              valueLabel={questionFileLabel || 'Chưa chọn file câu hỏi'}
              buttonLabel={questionFileLabel ? 'Đổi file' : 'Tải file câu hỏi'}
              onClick={() => {
                setQuestionFileLabel(questionFileLabel || 'de-bai-assignment.pdf')
                setDirty(true)
              }}
            />

            <FileUploadField
              label="Tệp rubric"
              helper="Bắt buộc phải có file rubric trước khi phát hành bài tập."
              required
              valueLabel={rubricFileLabel || 'Chưa chọn file rubric'}
              buttonLabel={rubricFileLabel ? 'Đổi file' : 'Tải file rubric'}
              onClick={() => {
                setRubricFileLabel(rubricFileLabel || 'rubric-assignment.pdf')
                setDirty(true)
              }}
            />

            <div className="portal-summary-inline">
              <article className="portal-summary-chip">
                <span>Nội dung câu hỏi</span>
                <strong>{manualQuestionText.trim() ? 'Đã nhập' : 'Chưa nhập'}</strong>
              </article>
              <article className="portal-summary-chip">
                <span>Tệp câu hỏi</span>
                <strong>{questionFileLabel ? 'Đã tải' : 'Chưa có'}</strong>
              </article>
              <article className="portal-summary-chip">
                <span>Tệp rubric</span>
                <strong>{rubricFileLabel ? 'Đã tải' : 'Bắt buộc'}</strong>
              </article>
            </div>
          </div>
        </section>
      ) : null}

      {step === 'review' ? (
        <section className="portal-section-card">
          <header className="portal-section-head">
            <div>
              <p className="portal-section-kicker">Bước 4</p>
              <h2>Rà soát và phát hành</h2>
            </div>
            <div className="portal-button-row">
              <button type="button" className="portal-outline-button" onClick={() => setStep('questions')}>
                Quay lại
              </button>
              <button type="button" className="portal-primary-button" onClick={handlePublish}>
                {mode === 'create' ? 'Phát hành' : 'Cập nhật'}
              </button>
            </div>
          </header>

          <div className="portal-button-row" style={{ marginBottom: 16 }}>
            {warningItems.map((item) => (
              <StatusBadge key={item.id} label={item.label} tone={item.tone} />
            ))}
          </div>

          <AssignmentReviewSummary
            title={draft.title}
            classLabel={selectedClass ? `${selectedClass.code} · ${selectedClass.name}` : 'Chưa chọn lớp'}
            dueAtLabel={draft.dueAt ? formatPortalDateTime(draft.dueAt) : 'Chưa có hạn nộp'}
            totalQuestions={manualQuestionText.trim() ? manualQuestionText.split('\n').filter(Boolean).length : 0}
            totalScore={draft.maxScore}
            allowLateLabel={draft.allowLatePolicy === 'no-late' ? 'Không cho phép nộp trễ' : 'Cho phép nộp trễ có điều kiện'}
            submissionFormats={draft.submissionFormats || 'Chưa cấu hình'}
            rubricTemplateLabel={rubricFileLabel || 'Chưa tải file rubric'}
            warnings={warningItems}
          />
        </section>
      ) : null}

      <ConfirmDialog
        open={confirmOpen}
        title={mode === 'create' ? 'Phát hành bài tập' : 'Cập nhật bài tập'}
        description={
          mode === 'create'
            ? 'Bài tập sẽ được gửi tới lớp đã chọn. Xác nhận để phát hành.'
            : 'Thay đổi sẽ được cập nhật cho bài tập hiện tại. Xác nhận để tiếp tục.'
        }
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
      />
    </div>
  )
}
