import type { AssignmentQuestion } from '../../../models/assignment/assignment.types'
import { StatusBadge } from '../shared/StatusBadge'

type AssignmentQuestionPreviewCardProps = {
  question: AssignmentQuestion
}

export function AssignmentQuestionPreviewCard({ question }: AssignmentQuestionPreviewCardProps) {
  const totalScore = question.rubric.reduce((sum, item) => sum + item.maxScore, 0)

  return (
    <article className="assignment-question-card">
      <header className="assignment-question-head">
        <div>
          <p className="assignment-question-label">Câu {question.order}</p>
          <h3>{question.prompt}</h3>
        </div>
        <StatusBadge label={`${totalScore} điểm`} tone="info" />
      </header>

      {question.attachmentName ? (
        <p className="assignment-question-attachment">Tệp đính kèm: {question.attachmentName}</p>
      ) : null}

      <section className="assignment-question-rubric">
        <h4>Rubric</h4>
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
    </article>
  )
}
