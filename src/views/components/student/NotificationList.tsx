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
}

export function NotificationList({ rows }: NotificationListProps) {
  return (
    <div className="notification-workspace">
      <div className="notification-master-list" style={{ width: '100%', maxWidth: '840px', margin: '0 auto', borderRight: 'none' }}>
        {rows.map((row) => (
          <a key={row.id} href={row.href} className={`notification-item${row.isRead ? '' : ' is-unread'}`}>
            <div style={{ display: 'grid', gap: 8 }}>
              <div className="notification-item-head">
                <StatusBadge label={row.isRead ? 'Đã đọc' : 'Mới'} tone={row.isRead ? 'neutral' : 'info'} />
                <span>{row.createdAtLabel}</span>
              </div>
              <p className="notification-preview-text">{row.content}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
