import type { StudentResultDetailViewModel } from '../../../controllers/student/useStudentResultsController'

type ResultBreakdownCardProps = {
  item: NonNullable<StudentResultDetailViewModel['result']>['questionResults'][number]
}

export function ResultBreakdownCard({ item }: ResultBreakdownCardProps) {
  const achievedCount = item.rubric.filter((rubric) => rubric.achieved).length

  return (
    <article className="result-breakdown-card">
      <header className="result-breakdown-head">
        <div>
          <p>{item.questionLabel}</p>
          <h3>
            {item.score}/{item.maxScore} điểm
          </h3>
        </div>
        <div className="result-breakdown-score">
          <strong>
            {achievedCount}/{item.rubric.length}
          </strong>
          <span>tiêu chí đạt</span>
        </div>
      </header>

      <p className="result-feedback-text">{item.feedback}</p>

      <ul className="rubric-result-list">
        {item.rubric.map((rubric) => (
          <li key={rubric.id} className={rubric.achieved ? 'is-achieved' : 'is-missing'}>
            <strong>{rubric.label}</strong>
            <span>{rubric.note}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
