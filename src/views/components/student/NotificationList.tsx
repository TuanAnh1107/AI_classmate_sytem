import { DisclosureSection } from '../shared/DisclosureSection'
import { StatusBadge } from '../shared/StatusBadge'

export type NotificationRow = {
  id: string
  content: string
  createdAtLabel: string
  isRead: boolean
  href: string
}

type NotificationListProps = {
  rows: NotificationRow[]
  selectedId?: string
}

export function NotificationList({ rows, selectedId }: NotificationListProps) {
  const activeRow = rows.find((row) => row.id === selectedId) ?? rows[0]

  return (
    <div className="notification-workspace">
      <div className="notification-master-list">
        {rows.map((row) => (
          <a
            key={row.id}
            href={row.href}
            className={`notification-item${row.isRead ? '' : ' is-unread'}${activeRow?.id === row.id ? ' is-active' : ''}`}
          >
            <div className="notification-item-head">
              <StatusBadge label={row.isRead ? 'Đã đọc' : 'Mới'} tone={row.isRead ? 'neutral' : 'info'} />
              <span>{row.createdAtLabel}</span>
            </div>
            <p className="notification-preview-text">{row.content}</p>
          </a>
        ))}
      </div>

      <aside className="notification-detail-panel">
        {activeRow ? (
          <>
            <div className="notification-detail-meta">
              <StatusBadge label={activeRow.isRead ? 'Đã đọc' : 'Chưa đọc'} tone={activeRow.isRead ? 'neutral' : 'info'} />
              <span>{activeRow.createdAtLabel}</span>
            </div>
            <h3>Nội dung thông báo</h3>
            <p className="portal-muted-text">Mặc định chỉ hiển thị phần tóm tắt. Mở chi tiết đầy đủ khi bạn cần xử lý sâu hơn.</p>
            <DisclosureSection
              title="Xem toàn bộ thông báo"
              kicker="Detail"
              description="Ẩn mặc định để vùng làm việc chính luôn gọn và dễ quét."
              defaultOpen={false}
              className="notification-detail-disclosure"
            >
              <p>{activeRow.content}</p>
            </DisclosureSection>
          </>
        ) : null}
      </aside>
    </div>
  )
}
