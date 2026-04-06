import type { DashboardFeedbackItem } from '../../../controllers/student/useStudentDashboardController'
import type { QuickGuideEntry, StudentReminder } from '../../../models/student/student.types'

type StudentReminderPanelProps = {
  reminders: StudentReminder[]
  feedbackUpdates: DashboardFeedbackItem[]
  guideLinks: QuickGuideEntry[]
}

export function StudentReminderPanel({ reminders, feedbackUpdates, guideLinks }: StudentReminderPanelProps) {
  return (
    <div className="portal-aside-stack">
      <section className="portal-aside-card">
        <header>
          <h3>Nhắc việc hôm nay</h3>
          <p>Những đầu việc nên xử lý trong buổi học hiện tại.</p>
        </header>
        <ul className="aside-check-list">
          {reminders.map((item) => (
            <li key={item.id} className={`tone-${item.tone}`}>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="portal-aside-card">
        <header>
          <h3>Phản hồi mới</h3>
          <p>Các luồng trao đổi vừa được cập nhật.</p>
        </header>
        <ul className="aside-link-list">
          {feedbackUpdates.map((item) => (
            <li key={item.id}>
              <a href={item.href}>{item.title}</a>
              <span>{item.updatedAtLabel}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="huong-dan" className="portal-aside-card">
        <header>
          <h3>Hướng dẫn nhanh</h3>
          <p>Các thao tác cốt lõi khi làm bài và theo dõi nhận xét.</p>
        </header>
        <ul className="aside-link-list">
          {guideLinks.map((item) => (
            <li key={item.id}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
