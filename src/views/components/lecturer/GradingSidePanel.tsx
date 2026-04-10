import type { StatusTone } from '../../../models/shared/portal.types'
import { FormField } from '../shared/FormField'
import { StatusBadge } from '../shared/StatusBadge'
import { TextArea } from '../shared/TextArea'
import { TextInput } from '../shared/TextInput'

export type GradingSaveState = 'idle' | 'saving' | 'saved' | 'published'

type GradingHelperItem = {
  id: string
  label: string
  value: string
  tone?: StatusTone
}

export type GradingPanelProps = {
  score: string
  maxScore: number
  statusLabel: string
  statusTone: StatusTone
  feedback: string
  saveState: GradingSaveState
  saveStateLabel: string
  saveStateTone: StatusTone
  helperItems: GradingHelperItem[]
  validationMessage?: string
  canPublish: boolean
  onScoreChange: (value: string) => void
  onFeedbackChange: (value: string) => void
  onSaveDraft: () => void
  onPublish: () => void
}

export function GradingSidePanel({
  score,
  maxScore,
  statusLabel,
  statusTone,
  feedback,
  saveState,
  saveStateLabel,
  saveStateTone,
  helperItems,
  validationMessage,
  canPublish,
  onScoreChange,
  onFeedbackChange,
  onSaveDraft,
  onPublish,
}: GradingPanelProps) {
  return (
    <section className="grading-panel grading-workspace-panel">
      <header className="grading-panel-header">
        <div>
          <p className="portal-section-kicker">Không gian chấm bài</p>
          <h3>Chấm điểm và phát hành phản hồi</h3>
          <p className="portal-section-description">
            Giữ toàn bộ thao tác chấm trong cùng một vùng làm việc để không bị mất ngữ cảnh khi xử lý liên tục.
          </p>
        </div>
        <div className="grading-panel-statuses" aria-live="polite">
          <StatusBadge label={statusLabel} tone={statusTone} />
          <StatusBadge label={saveStateLabel} tone={saveStateTone} />
        </div>
      </header>

      <div className="grading-score-hero">
        <div>
          <span>Điểm hiện tại</span>
          <strong>{score.trim() ? score : '--'}</strong>
        </div>
        <small>Tối đa {maxScore} điểm</small>
      </div>

      <div className="grading-helper-grid">
        {helperItems.map((item) => (
          <div key={item.id} className={`grading-helper-item${item.tone ? ` tone-${item.tone}` : ''}`}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>

      <div className="portal-form-stack">
        <FormField label="Điểm tổng" helper={`Nhập từ 0 đến ${maxScore}.`} required>
          <TextInput value={score} type="number" onChange={onScoreChange} />
        </FormField>

        <FormField
          label="Nhận xét cho sinh viên"
          helper="Tập trung vào điều cần cải thiện tiếp theo, không chỉ lặp lại số điểm."
        >
          <TextArea
            value={feedback}
            onChange={onFeedbackChange}
            placeholder="Ví dụ: Cần bổ sung dẫn chứng thực tế ở câu 2 và làm rõ logic phản biện ở câu 3."
          />
        </FormField>
      </div>

      {validationMessage ? <div className="grading-validation-alert">{validationMessage}</div> : null}

      <div className="grading-action-bar">
        <button
          type="button"
          className="portal-outline-button"
          onClick={onSaveDraft}
          disabled={saveState === 'saving'}
        >
          {saveState === 'saving' ? 'Đang lưu...' : 'Lưu nháp chấm'}
        </button>
        <button
          type="button"
          className="portal-primary-button"
          onClick={onPublish}
          disabled={!canPublish || saveState === 'saving'}
        >
          {saveState === 'published' ? 'Đã phát hành' : 'Phát hành kết quả'}
        </button>
      </div>
    </section>
  )
}
