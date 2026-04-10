import { StatusBadge } from '../shared/StatusBadge'

export type AssignmentReviewItem = {
  id: string
  label: string
  value: string
}

export type AssignmentReviewWarning = {
  id: string
  label: string
  detail: string
  tone: 'info' | 'warning' | 'danger'
}

type AssignmentReviewSummaryProps = {
  title: string
  classLabel: string
  dueAtLabel: string
  totalQuestions: number
  totalScore: number
  allowLateLabel: string
  submissionFormats: string
  rubricTemplateLabel?: string
  warnings: AssignmentReviewWarning[]
}

export function AssignmentReviewSummary({
  title,
  classLabel,
  dueAtLabel,
  totalQuestions,
  totalScore,
  allowLateLabel,
  submissionFormats,
  rubricTemplateLabel,
  warnings,
}: AssignmentReviewSummaryProps) {
  const items: AssignmentReviewItem[] = [
    { id: 'title', label: 'Tiêu đề', value: title },
    { id: 'class', label: 'Lớp', value: classLabel },
    { id: 'dueAt', label: 'Hạn nộp', value: dueAtLabel },
    { id: 'questions', label: 'Số câu hỏi', value: String(totalQuestions) },
    { id: 'score', label: 'Tổng điểm', value: `${totalScore} điểm` },
    { id: 'late', label: 'Chính sách trễ hạn', value: allowLateLabel },
    { id: 'formats', label: 'Định dạng nộp', value: submissionFormats },
  ]

  if (rubricTemplateLabel) {
    items.push({ id: 'rubric', label: 'Rubric mẫu', value: rubricTemplateLabel })
  }

  return (
    <section className="assignment-review">
      <header>
        <h3>Tóm tắt trước khi phát hành</h3>
        <p>Kiểm tra nhanh các thông tin quan trọng và cảnh báo nghiệp vụ.</p>
      </header>
      <div className="assignment-review-grid">
        {items.map((item) => (
          <div key={item.id} className="assignment-review-item">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
      {warnings.length ? (
        <div className="assignment-review-warnings">
          {warnings.map((warning) => (
            <div key={warning.id} className="assignment-review-warning">
              <StatusBadge label={warning.label} tone={warning.tone} />
              <p>{warning.detail}</p>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  )
}
