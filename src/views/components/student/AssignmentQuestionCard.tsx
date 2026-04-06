import type { AssignmentQuestion } from '../../../models/student/student.types'
import { getCompletionStatusMeta } from '../../../models/student/student.mappers'
import { StatusBadge } from '../shared/StatusBadge'

type AssignmentQuestionCardProps = {
  question: AssignmentQuestion
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
        <StatusBadge label={completionMeta.label} tone={completionMeta.tone} />
      </header>

      {question.attachmentName ? (
        <p className="assignment-question-attachment">Tệp đính kèm: {question.attachmentName}</p>
      ) : null}

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
        <textarea readOnly value={question.answerText} placeholder="Chưa có nội dung trả lời." />
      </section>

      <section className="assignment-upload-block">
        <h4>Tệp đã đính kèm</h4>
        {question.uploadedFiles.length ? (
          <ul>
            {question.uploadedFiles.map((file) => (
              <li key={file.id}>
                <span>{file.fileName}</span>
                <em>{file.sizeLabel}</em>
              </li>
            ))}
          </ul>
        ) : (
          <p>Chưa có tệp nào được tải lên cho câu này.</p>
        )}
      </section>
    </article>
  )
}
