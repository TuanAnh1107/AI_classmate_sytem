import { DisclosureSection } from '../shared/DisclosureSection'
import { StatusBadge } from '../shared/StatusBadge'

export type QuestionBankItem = {
  id: string
  title: string
  preview: string
  maxScore: number
  typeGrade: string
  rubricCount: number
  fileCount: number
  ownerLabel: string
  createdAtLabel: string
}

type QuestionCompactCardProps = {
  item: QuestionBankItem
  selected: boolean
  onToggle: (id: string) => void
}

export function QuestionCompactCard({ item, selected, onToggle }: QuestionCompactCardProps) {
  return (
    <article className={`question-compact-card${selected ? ' is-selected' : ''}`}>
      <header>
        <div>
          <p className="question-compact-kicker">Mã câu hỏi: {item.id}</p>
          <h4>{item.title}</h4>
        </div>
        <StatusBadge label={`${item.maxScore} điểm`} tone="info" />
      </header>

      <div className="question-compact-footer question-compact-footer-summary">
        <span className="question-compact-date">{item.typeGrade}</span>
        <button type="button" className={selected ? 'portal-primary-button' : 'portal-outline-button'} onClick={() => onToggle(item.id)}>
          {selected ? 'Đã chọn' : 'Chọn'}
        </button>
      </div>

      <DisclosureSection
        title="Xem tóm tắt câu hỏi"
        kicker="Preview"
        description="Ẩn phần preview và metadata sâu để question bank giữ được mật độ quét nhanh."
        className="question-inline-disclosure"
      >
        <p className="question-compact-preview">{item.preview}</p>
        <div className="question-compact-meta">
          <span>Loại chấm: {item.typeGrade}</span>
          <span>Rubric: {item.rubricCount}</span>
          <span>Tệp: {item.fileCount}</span>
          <span>Người tạo: {item.ownerLabel}</span>
          <span>Cập nhật: {item.createdAtLabel}</span>
        </div>
      </DisclosureSection>
    </article>
  )
}


