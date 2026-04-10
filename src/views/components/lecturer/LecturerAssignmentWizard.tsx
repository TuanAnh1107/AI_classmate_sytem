import { useEffect, useMemo, useState } from 'react'
import { validateAssignmentDraft } from '../../../utils/assignmentValidators'
import type { AssignmentQuestionDraft, LecturerClassOption, RubricTemplate } from '../../../models/lecturer/lecturer.types'
import { AssignmentReviewSummary } from './AssignmentReviewSummary'
import { QuestionBankPicker, type QuestionBankFilters } from './QuestionBankPicker'
import type { QuestionBankItem } from './QuestionCompactCard'
import { LecturerStepper } from './LecturerStepper'
import { DisclosureSection } from '../shared/DisclosureSection'
import { FormField } from '../shared/FormField'
import { FormRow } from '../shared/FormRow'
import { SelectInput } from '../shared/SelectInput'
import { TextArea } from '../shared/TextArea'
import { TextInput } from '../shared/TextInput'
import { DateTimeInput } from '../shared/DateTimeInput'
import { FileUploadField } from '../shared/FileUploadField'
import { StatusBadge } from '../shared/StatusBadge'
import { ConfirmDialog } from '../shared/ConfirmDialog'
import { formatPortalDateTime } from '../../../models/student/student.mappers'

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
  questionBank: QuestionBankItem[]
  initialDraft: AssignmentWizardDraft
  initialSelectedQuestionIds: string[]
}

type StepId = 'general' | 'submission' | 'questions' | 'review'

export function LecturerAssignmentWizard({
  mode,
  classOptions,
  rubricTemplates,
  questionDrafts,
  questionBank,
  initialDraft,
  initialSelectedQuestionIds,
}: AssignmentWizardProps) {
  const [step, setStep] = useState<StepId>('general')
  const [draft, setDraft] = useState<AssignmentWizardDraft>(initialDraft)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>(initialSelectedQuestionIds)
  const [validationMessage, setValidationMessage] = useState<string | undefined>()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null)
  const [rubricFileLabel, setRubricFileLabel] = useState('')

  const [questionFilters, setQuestionFilters] = useState<QuestionBankFilters>({
    search: '',
    typeGrade: 'all',
    owner: 'all',
    scoreRange: 'all',
  })

  useEffect(() => {
    if (!dirty) return
    const timer = window.setTimeout(() => {
      setLastSavedAt(new Date())
      setDirty(false)
    }, 900)
    return () => window.clearTimeout(timer)
  }, [dirty, draft, rubricFileLabel, selectedQuestionIds])

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!dirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const totalQuestionScore = useMemo(() => {
    return questionBank
      .filter((item) => selectedQuestionIds.includes(item.id))
      .reduce((sum, item) => sum + item.maxScore, 0)
  }, [questionBank, selectedQuestionIds])

  const selectedWarnings = useMemo(() => {
    const warnings = [] as { id: string; label: string; tone: 'info' | 'warning' | 'danger' }[]
    if (selectedQuestionIds.length === 0) {
      warnings.push({ id: 'no-questions', label: 'Chưa chọn câu hỏi', tone: 'warning' })
    }
    if (!rubricFileLabel) {
      warnings.push({ id: 'no-rubric-file', label: 'Chưa đính kèm tệp rubric bắt buộc', tone: 'warning' })
    }
    if (totalQuestionScore !== draft.maxScore) {
      warnings.push({
        id: 'score-mismatch',
        label: 'Tổng điểm câu hỏi chưa khớp điểm bài',
        tone: 'danger',
      })
    }
    return warnings
  }, [selectedQuestionIds.length, rubricFileLabel, totalQuestionScore, draft.maxScore])

  const filteredQuestionBank = useMemo(() => {
    return questionBank
      .filter((item) => item.title.toLowerCase().includes(questionFilters.search.toLowerCase()))
      .filter((item) => (questionFilters.typeGrade === 'all' ? true : item.typeGrade === questionFilters.typeGrade))
      .filter((item) => (questionFilters.owner === 'all' ? true : item.ownerLabel === questionFilters.owner))
      .filter((item) => {
        if (questionFilters.scoreRange === 'all') return true
        if (questionFilters.scoreRange === 'low') return item.maxScore <= 5
        if (questionFilters.scoreRange === 'mid') return item.maxScore > 5 && item.maxScore <= 8
        return item.maxScore > 8
      })
  }, [questionBank, questionFilters])

  const classOption = classOptions.find((item) => item.id === draft.classId) ?? classOptions[0]
  const rubricOption = rubricTemplates.find((item) => item.id === draft.rubricTemplateId)

  const reviewWarnings = selectedWarnings.map((warning) => ({
    id: warning.id,
    label: warning.label,
    detail: warning.label,
    tone: warning.tone,
  }))

  const steps = [
    { id: 'general', label: 'Thông tin chung' },
    { id: 'submission', label: 'Yêu cầu nộp bài' },
    { id: 'questions', label: 'Cấu trúc câu hỏi' },
    { id: 'review', label: 'Rà soát & phát hành' },
  ]

  const stepButtons = steps.map((item) => ({
    id: item.id,
    label: item.label,
    isActive: step === item.id,
    onClick: () => setStep(item.id as StepId),
  }))

  const handlePublish = () => {
    const validation = validateAssignmentDraft({
      title: draft.title,
      description: draft.description,
      dueAt: draft.dueAt,
      maxScore: draft.maxScore,
    })

    if (!selectedQuestionIds.length) {
      setValidationMessage('Vui lòng chọn ít nhất một câu hỏi cho bài tập.')
      return
    }
    if (!rubricFileLabel) {
      setValidationMessage('Cần đính kèm tệp rubric trước khi phát hành bài tập.')
      return
    }
    if (totalQuestionScore !== draft.maxScore) {
      setValidationMessage('Tổng điểm câu hỏi chưa khớp tổng điểm bài tập.')
      return
    }

    setValidationMessage(validation.isValid ? undefined : validation.message)
    if (validation.isValid) {
      setConfirmOpen(true)
    }
  }

  const advanceTo = (nextStep: StepId) => () => setStep(nextStep)

  return (
    <div className="lecturer-assignment-wizard">
      <div className="lecturer-wizard-head">
        <div>
          <h2>{mode === 'create' ? 'Tạo bài tập mới' : 'Chỉnh sửa bài tập'}</h2>
          <p>
            {mode === 'create'
              ? 'Đi từng bước: thông tin chung, chính sách nộp, cấu trúc câu hỏi, rồi rà soát trước khi phát hành.'
              : 'Cập nhật bài tập theo từng nhóm thông tin để giảm lỗi và dễ kiểm soát thay đổi.'}
          </p>
        </div>
        <div className="lecturer-wizard-meta">
          {lastSavedAt ? <span>Lưu nháp lúc {formatPortalDateTime(lastSavedAt.toISOString())}</span> : <span>Chưa lưu nháp</span>}
          {dirty ? <StatusBadge label="Chưa lưu" tone="warning" /> : <StatusBadge label="Đã lưu" tone="success" />}
        </div>
      </div>

      <LecturerStepper steps={stepButtons} />

      {validationMessage ? <div className="portal-inline-error">{validationMessage}</div> : null}

      {step === 'general' ? (
        <section className="portal-section-card">
          <header className="portal-section-head">
            <div>
              <p className="portal-section-kicker">Thiết lập chung</p>
              <h2>Thông tin bài tập</h2>
            </div>
            <div className="portal-button-row">
              <button type="button" className="portal-outline-button" onClick={advanceTo('submission')}>
                Tiếp theo
              </button>
            </div>
          </header>

          <DisclosureSection
            title="Thông tin bắt buộc"
            kicker="Primary fields"
            description="Chỉ giữ những trường thật sự cần để bài tập có thể được nhận diện và lên lịch."
            defaultOpen
            summary={<StatusBadge label={classOption ? classOption.code : 'Chưa chọn lớp'} tone="info" />}
          >
            <div className="portal-form-stack">
              <FormRow>
                <FormField label="Lớp học" required helper="Chọn lớp sẽ nhận bài tập này.">
                  <SelectInput
                    value={draft.classId}
                    options={classOptions.map((item) => ({ value: item.id, label: `${item.code} · ${item.name}` }))}
                    onChange={(value) => {
                      setDraft((prev) => ({ ...prev, classId: value }))
                      setDirty(true)
                    }}
                  />
                </FormField>
                <FormField label="Hạn nộp" required helper="Thời gian đóng bài của sinh viên.">
                  <DateTimeInput
                    value={draft.dueAt}
                    onChange={(value) => {
                      setDraft((prev) => ({ ...prev, dueAt: value }))
                      setDirty(true)
                    }}
                  />
                </FormField>
              </FormRow>

              <FormField label="Tiêu đề bài tập" required helper="Ngắn gọn, phản ánh đúng mục tiêu học phần.">
                <TextInput
                  value={draft.title}
                  onChange={(value) => {
                    setDraft((prev) => ({ ...prev, title: value }))
                    setDirty(true)
                  }}
                />
              </FormField>

              <FormField label="Mô tả bài tập" required>
                <TextArea
                  value={draft.description}
                  onChange={(value) => {
                    setDraft((prev) => ({ ...prev, description: value }))
                    setDirty(true)
                  }}
                />
              </FormField>
            </div>
          </DisclosureSection>

          <DisclosureSection
            title="Thiết lập đánh giá"
            kicker="Assessment setup"
            description="Ẩn phần cấu hình sâu để bước đầu tiên không biến thành một form dài và nặng."
            summary={<StatusBadge label={`${draft.maxScore} điểm`} tone="info" />}
          >
            <FormRow>
              <FormField label="Điểm tối đa" required>
                <TextInput
                  type="number"
                  value={String(draft.maxScore)}
                  onChange={(value) => {
                    setDraft((prev) => ({ ...prev, maxScore: Number(value) || 0 }))
                    setDirty(true)
                  }}
                />
              </FormField>
              <FormField label="Rubric mẫu" helper="Gợi ý tiêu chí chấm cho toàn bộ bài.">
                <SelectInput
                  value={draft.rubricTemplateId}
                  options={rubricTemplates.map((item) => ({ value: item.id, label: item.label }))}
                  onChange={(value) => {
                    setDraft((prev) => ({ ...prev, rubricTemplateId: value }))
                    setDirty(true)
                  }}
                />
              </FormField>
              <FormField label="Chính sách trễ hạn" helper="Thiết lập quy định nộp trễ.">
                <SelectInput
                  value={draft.allowLatePolicy}
                  options={[
                    { value: 'late-10', label: 'Nộp trễ tối đa 2 ngày · trừ 10%' },
                    { value: 'late-20', label: 'Nộp trễ tối đa 1 ngày · trừ 20%' },
                    { value: 'no-late', label: 'Không nhận bài trễ hạn' },
                  ]}
                  onChange={(value) => {
                    setDraft((prev) => ({ ...prev, allowLatePolicy: value }))
                    setDirty(true)
                  }}
                />
              </FormField>
            </FormRow>
          </DisclosureSection>
        </section>
      ) : null}

      {step === 'submission' ? (
        <section className="portal-section-card">
          <header className="portal-section-head">
            <div>
              <p className="portal-section-kicker">Submission policy</p>
              <h2>Yêu cầu nộp bài</h2>
            </div>
            <div className="portal-button-row">
              <button type="button" className="portal-outline-button" onClick={advanceTo('general')}>
                Quay lại
              </button>
              <button type="button" className="portal-outline-button" onClick={advanceTo('questions')}>
                Tiếp theo
              </button>
            </div>
          </header>

          <DisclosureSection
            title="Quy định nộp bài chính"
            kicker="Core policy"
            description="Mở sẵn để giảng viên hoàn tất các luật nộp bài quan trọng trước."
            defaultOpen
            summary={<StatusBadge label={draft.resubmissionPolicy === 'none' ? 'Không cho nộp lại' : 'Có cho nộp lại'} tone="info" />}
          >
            <FormRow>
              <FormField label="Định dạng chấp nhận">
                <TextInput
                  value={draft.submissionFormats}
                  onChange={(value) => {
                    setDraft((prev) => ({ ...prev, submissionFormats: value }))
                    setDirty(true)
                  }}
                />
              </FormField>
              <FormField label="Dung lượng tối đa">
                <TextInput
                  value={draft.maxFileSize}
                  onChange={(value) => {
                    setDraft((prev) => ({ ...prev, maxFileSize: value }))
                    setDirty(true)
                  }}
                />
              </FormField>
            </FormRow>

            <FormField label="Chính sách nộp lại">
              <SelectInput
                value={draft.resubmissionPolicy}
                options={[
                  { value: 'once', label: 'Cho phép nộp lại 1 lần' },
                  { value: 'twice', label: 'Cho phép nộp lại 2 lần' },
                  { value: 'none', label: 'Không cho phép nộp lại' },
                ]}
                onChange={(value) => {
                  setDraft((prev) => ({ ...prev, resubmissionPolicy: value }))
                  setDirty(true)
                }}
              />
            </FormField>
          </DisclosureSection>

          <DisclosureSection
            title="Hướng dẫn và rubric file"
            kicker="Guidance"
            description="Ẩn mặc định để phần chính sách không bị trôi xuống quá sâu. Rubric file là bắt buộc trong luồng này."
            summary={<StatusBadge label={rubricFileLabel ? 'Đã có tệp rubric' : 'Thiếu tệp rubric'} tone={rubricFileLabel ? 'success' : 'warning'} />}
          >
            <div className="portal-form-stack">
              <FormField label="Hướng dẫn cho sinh viên">
                <TextArea
                  value={draft.studentInstruction}
                  onChange={(value) => {
                    setDraft((prev) => ({ ...prev, studentInstruction: value }))
                    setDirty(true)
                  }}
                />
              </FormField>

              <FileUploadField
                label="Tệp rubric"
                helper="Bắt buộc đính kèm rubric hoặc tài liệu hướng dẫn chấm cho bài tập này."
                required
                valueLabel={rubricFileLabel || 'Chưa chọn tệp rubric'}
                buttonLabel={rubricFileLabel ? 'Đổi tệp' : 'Chọn tệp'}
                onClick={() => {
                  setRubricFileLabel(rubricFileLabel || 'rubric-huong-dan.pdf')
                  setDirty(true)
                }}
              />
            </div>
          </DisclosureSection>
        </section>
      ) : null}

      {step === 'questions' ? (
        <section className="portal-section-card">
          <header className="portal-section-head">
            <div>
              <p className="portal-section-kicker">Cấu trúc câu hỏi</p>
              <h2>Thiết kế câu hỏi</h2>
            </div>
            <div className="portal-button-row">
              <button type="button" className="portal-outline-button" onClick={advanceTo('submission')}>
                Quay lại
              </button>
              <button type="button" className="portal-outline-button" onClick={advanceTo('review')}>
                Tiếp theo
              </button>
            </div>
          </header>

          <DisclosureSection
            title="Câu hỏi tự soạn"
            kicker="Manual questions"
            description="Mỗi câu hỏi được đóng theo từng nhóm để bước này không biến thành một cột form rất dài."
            defaultOpen
            summary={<StatusBadge label={`${questionDrafts.length} câu`} tone="info" />}
          >
            <div className="portal-form-stack">
              {questionDrafts.map((question) => (
                <DisclosureSection
                  key={question.id}
                  title={`Câu ${question.order}`}
                  kicker="Question editor"
                  description="Mở khi cần sửa prompt hoặc điểm số của câu này."
                  className="question-editor-disclosure"
                  summary={<StatusBadge label={`${question.maxScore} điểm`} tone="info" />}
                  defaultOpen={question.order === 1}
                >
                  <div className="portal-form-stack">
                    <FormField label="Đề bài" required>
                      <TextArea defaultValue={question.prompt} />
                    </FormField>

                    <FormRow>
                      <FormField label="Điểm tối đa" required>
                        <TextInput type="number" defaultValue={String(question.maxScore)} />
                      </FormField>
                      <FormField label="Gợi ý rubric">
                        <TextInput defaultValue={question.rubricNote} />
                      </FormField>
                    </FormRow>
                  </div>
                </DisclosureSection>
              ))}
            </div>
          </DisclosureSection>

          <DisclosureSection
            title="Chọn câu từ ngân hàng"
            kicker="Question bank"
            description="Ngân hàng câu hỏi được giữ gọn: summary chọn câu hiện ra trước, bộ lọc sâu và preview nằm sau disclosure riêng."
            defaultOpen
            summary={<StatusBadge label={`${selectedQuestionIds.length} câu đã chọn`} tone="success" />}
          >
            <QuestionBankPicker
              items={filteredQuestionBank}
              selectedIds={selectedQuestionIds}
              filters={questionFilters}
              typeOptions={[
                { value: 'all', label: 'Tất cả' },
                { value: 'rubric', label: 'Rubric' },
                { value: 'auto', label: 'Tự động' },
                { value: 'manual', label: 'Thủ công' },
              ]}
              ownerOptions={['all', ...Array.from(new Set(questionBank.map((item) => item.ownerLabel)))].map((value) => ({
                value,
                label: value === 'all' ? 'Tất cả' : value,
              }))}
              scoreOptions={[
                { value: 'all', label: 'Tất cả' },
                { value: 'low', label: '<= 5 điểm' },
                { value: 'mid', label: '6 - 8 điểm' },
                { value: 'high', label: '>= 9 điểm' },
              ]}
              onFiltersChange={(next) => setQuestionFilters((prev) => ({ ...prev, ...next }))}
              onToggle={(id) => {
                setSelectedQuestionIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
                setDirty(true)
              }}
              totalScore={totalQuestionScore}
              warnings={selectedWarnings}
            />
          </DisclosureSection>
        </section>
      ) : null}

      {step === 'review' ? (
        <section className="portal-section-card">
          <header className="portal-section-head">
            <div>
              <p className="portal-section-kicker">Review & publish</p>
              <h2>Rà soát trước khi phát hành</h2>
            </div>
            <div className="portal-button-row">
              <button type="button" className="portal-outline-button" onClick={advanceTo('questions')}>
                Quay lại
              </button>
              <button type="button" className="portal-outline-button">
                Xem preview
              </button>
              <button type="button" className="portal-primary-button" onClick={handlePublish}>
                {mode === 'create' ? 'Phát hành' : 'Cập nhật'}
              </button>
            </div>
          </header>

          <AssignmentReviewSummary
            title={draft.title}
            classLabel={classOption ? `${classOption.code} · ${classOption.name}` : ''}
            dueAtLabel={formatPortalDateTime(draft.dueAt)}
            totalQuestions={selectedQuestionIds.length}
            totalScore={totalQuestionScore}
            allowLateLabel={draft.allowLatePolicy === 'no-late' ? 'Không nhận bài trễ hạn' : 'Cho phép nộp trễ có điều kiện'}
            submissionFormats={draft.submissionFormats}
            rubricTemplateLabel={rubricOption?.label}
            warnings={reviewWarnings}
          />
        </section>
      ) : null}

      <ConfirmDialog
        open={confirmOpen}
        title={mode === 'create' ? 'Phát hành bài tập' : 'Cập nhật bài tập'}
        description={
          mode === 'create'
            ? 'Bài tập sẽ được gửi tới sinh viên trong lớp. Bạn có chắc chắn muốn phát hành?'
            : 'Nội dung sẽ được cập nhật và gửi thông báo cho sinh viên.'
        }
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
      />
    </div>
  )
}


