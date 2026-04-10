import type { StudentAssignmentQuestion } from '../../../models/student/student.types'
import { getCompletionStatusMeta } from '../../../models/student/student.mappers'
import { AttachmentList } from '../shared/AttachmentList'
import { DisclosureSection } from '../shared/DisclosureSection'
import { StatusBadge } from '../shared/StatusBadge'
import { TextArea } from '../shared/TextArea'

type AssignmentQuestionCardProps = {
  question: StudentAssignmentQuestion
}

export function AssignmentQuestionCard({ question }: AssignmentQuestionCardProps) {
  const completionMeta = getCompletionStatusMeta(question.completionStatus)

  return (
    <article className="assignment-question-card">
      <header className="assignment-question-head">
        <div>
          <p className="assignment-question-label">Câu {question.order}</p>
          <h3>{question.prompt}</h3>
        </div>
        <div className="assignment-question-meta">
          <StatusBadge label={completionMeta.label} tone={completionMeta.tone} />
          <span>{question.rubric.length} tiêu chí</span>
        </div>
      </header>

      <div className="assignment-work-meta assignment-work-meta-block">
        {question.attachmentName ? <span>Tệp đính kèm: {question.attachmentName}</span> : <span>Không có tệp từ giảng viên</span>}
        <span>{question.uploadedFiles.length} tệp bài làm</span>
      </div>

      <DisclosureSection
        title="Rubric, bài làm và tệp đính kèm"
        kicker="Chi tiết câu hỏi"
        description="Mở khi cần xem đầy đủ tiêu chí chấm, nội dung trả lời và tệp đã nộp của câu này."
        className="assignment-inline-disclosure"
      >
        <section className="assignment-question-rubric">
          <h4>Tiêu chí chấm tóm tắt</h4>
          <ul>
            {question.rubric.map((item) => (
              <li key={item.id}>
                <strong>{item.label}</strong>
                <span>{item.detail}</span>
                <em>{item.maxScore} điểm</em>
              </li>
            ))}
          </ul>
        </section>

        <section className="assignment-answer-block">
          <h4>Câu trả lời văn bản</h4>
          <TextArea readOnly value={question.answerText} placeholder="Chưa có nội dung trả lời." />
        </section>

        <section className="assignment-upload-block">
          <h4>Tệp đã đính kèm</h4>
          <AttachmentList items={question.uploadedFiles.map((file) => `${file.fileName} · ${file.sizeLabel}`)} />
        </section>
      </DisclosureSection>
    </article>
  )
}
