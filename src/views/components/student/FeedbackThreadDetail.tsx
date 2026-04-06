import type { StudentFeedbackViewModel } from '../../../controllers/student/useStudentFeedbackController'

type FeedbackThreadDetailProps = {
  thread: NonNullable<StudentFeedbackViewModel['selectedThread']>
}

export function FeedbackThreadDetail({ thread }: FeedbackThreadDetailProps) {
  return (
    <section className="feedback-thread-detail">
      <header className="feedback-thread-detail-head">
        <div>
          <p>{thread.classLabel}</p>
          <h2>{thread.title}</h2>
        </div>
        <span>{thread.updatedAtLabel}</span>
      </header>

      <div className="feedback-thread-assignment">Bài tập liên quan: {thread.assignmentTitle}</div>

      <div className="feedback-message-list">
        {thread.messages.map((message) => (
          <article key={message.id} className={`feedback-message-card role-${message.authorRole}`}>
            <header>
              <strong>{message.authorName}</strong>
              <span>{message.sentAt}</span>
            </header>
            <p>{message.content}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
