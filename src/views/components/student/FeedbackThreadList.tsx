import type { FeedbackThreadRow } from '../../../models/student/student.types'
import { StatusBadge } from '../shared/StatusBadge'

type FeedbackThreadListProps = {
  threads: FeedbackThreadRow[]
  activeThreadId?: string
}

export function FeedbackThreadList({ threads, activeThreadId }: FeedbackThreadListProps) {
  return (
    <div className="feedback-thread-list">
      {threads.map((thread) => (
        <a key={thread.id} href={thread.href} className={`feedback-thread-link${thread.id === activeThreadId ? ' is-active' : ''}`}>
          <div>
            <h3>{thread.title}</h3>
            <p>{thread.classLabel}</p>
          </div>
          <StatusBadge label={thread.statusLabel} tone={thread.statusTone} />
          <span className="feedback-thread-preview">{thread.preview}</span>
          <span className="feedback-thread-date">{thread.updatedAtLabel}</span>
        </a>
      ))}
    </div>
  )
}

