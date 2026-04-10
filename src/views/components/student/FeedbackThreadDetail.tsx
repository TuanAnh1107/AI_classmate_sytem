import type { StudentFeedbackViewModel } from '../../../controllers/student/useStudentFeedbackController'
import { DisclosureSection } from '../shared/DisclosureSection'

type FeedbackThreadDetailProps = {
  thread: NonNullable<StudentFeedbackViewModel['selectedThread']>
}

export function FeedbackThreadDetail({ thread }: FeedbackThreadDetailProps) {
  const latestMessage = thread.messages[thread.messages.length - 1]

  return (
    <section className="feedback-thread-detail">
      <header className="feedback-thread-detail-head">
        <div>
          <p>{thread.classLabel}</p>
          <h2>{thread.title}</h2>
          <span className="feedback-thread-assignment">Bài tập liên quan: {thread.assignmentTitle}</span>
        </div>
        <div className="feedback-thread-detail-meta">
          <strong>{thread.messages.length} phản hồi</strong>
          <span>{thread.updatedAtLabel}</span>
        </div>
      </header>

      {latestMessage ? (
        <article className={`feedback-message-card role-${latestMessage.authorRole}`}>
          <header>
            <strong>{latestMessage.authorName}</strong>
            <span>{latestMessage.sentAt}</span>
          </header>
          <p>{latestMessage.content}</p>
        </article>
      ) : null}

      {thread.messages.length > 1 ? (
        <DisclosureSection
          title="Toàn bộ trao đổi"
          kicker="Thread history"
          description="Mặc định chỉ hiện cập nhật mới nhất để bạn nắm ý chính trước. Mở phần này khi cần xem đầy đủ chuỗi phản hồi."
          className="feedback-thread-disclosure"
        >
          <div className="feedback-message-list">
            {thread.messages.slice(0, -1).map((message) => (
              <article key={message.id} className={`feedback-message-card role-${message.authorRole}`}>
                <header>
                  <strong>{message.authorName}</strong>
                  <span>{message.sentAt}</span>
                </header>
                <p>{message.content}</p>
              </article>
            ))}
          </div>
        </DisclosureSection>
      ) : null}
    </section>
  )
}
