import { DisclosureSection } from '../shared/DisclosureSection'
import { SelectInput } from '../shared/SelectInput'
import { TextInput } from '../shared/TextInput'
import { StatusBadge } from '../shared/StatusBadge'
import type { QuestionBankItem } from './QuestionCompactCard'
import { QuestionCompactCard } from './QuestionCompactCard'

export type QuestionBankFilters = {
  search: string
  typeGrade: string
  owner: string
  scoreRange: string
}

export type QuestionBankPickerProps = {
  items: QuestionBankItem[]
  selectedIds: string[]
  filters: QuestionBankFilters
  typeOptions: { value: string; label: string }[]
  ownerOptions: { value: string; label: string }[]
  scoreOptions: { value: string; label: string }[]
  onFiltersChange: (next: Partial<QuestionBankFilters>) => void
  onToggle: (id: string) => void
  totalScore: number
  warnings: { id: string; label: string; tone: 'info' | 'warning' | 'danger' }[]
}

export function QuestionBankPicker({
  items,
  selectedIds,
  filters,
  typeOptions,
  ownerOptions,
  scoreOptions,
  onFiltersChange,
  onToggle,
  totalScore,
  warnings,
}: QuestionBankPickerProps) {
  return (
    <section className="question-bank">
      <header className="question-bank-head">
        <div>
          <h3>Ngân hàng câu hỏi</h3>
          <p>Chỉ giữ summary chọn câu ở ngoài cùng. Bộ lọc sâu và preview câu hỏi được mở khi thật sự cần.</p>
        </div>
        <div className="question-bank-summary">
          <div>
            <strong>{selectedIds.length}</strong>
            <span>câu đã chọn</span>
          </div>
          <div>
            <strong>{totalScore}</strong>
            <span>điểm tổng</span>
          </div>
        </div>
      </header>

      {warnings.length ? (
        <div className="question-bank-warnings">
          {warnings.map((warning) => (
            <StatusBadge key={warning.id} label={warning.label} tone={warning.tone} />
          ))}
        </div>
      ) : null}

      <DisclosureSection
        title="Bộ lọc ngân hàng câu hỏi"
        kicker="Search and filters"
        description="Giữ bộ lọc ở trạng thái đóng để phần danh sách câu hỏi luôn là trọng tâm chính của bước này."
        summary={<StatusBadge label={`${items.length} kết quả`} tone="info" />}
        className="question-bank-disclosure"
      >
        <div className="question-bank-filters">
          <label>
            <span>Tìm kiếm</span>
            <TextInput
              value={filters.search}
              placeholder="Từ khóa nội dung hoặc mã câu"
              onChange={(value) => onFiltersChange({ search: value })}
            />
          </label>
          <label>
            <span>Loại chấm</span>
            <SelectInput value={filters.typeGrade} options={typeOptions} onChange={(value) => onFiltersChange({ typeGrade: value })} />
          </label>
          <label>
            <span>Người tạo</span>
            <SelectInput value={filters.owner} options={ownerOptions} onChange={(value) => onFiltersChange({ owner: value })} />
          </label>
          <label>
            <span>Thang điểm</span>
            <SelectInput value={filters.scoreRange} options={scoreOptions} onChange={(value) => onFiltersChange({ scoreRange: value })} />
          </label>
        </div>
      </DisclosureSection>

      <div className="question-bank-list">
        {items.map((item) => (
          <QuestionCompactCard key={item.id} item={item} selected={selectedIds.includes(item.id)} onToggle={onToggle} />
        ))}
      </div>
    </section>
  )
}

