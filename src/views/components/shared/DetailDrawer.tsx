import type { ReactNode } from 'react'

type DetailDrawerProps = {
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
}

export function DetailDrawer({ title, subtitle, onClose, children }: DetailDrawerProps) {
  return (
    <>
      <div className="detail-drawer-overlay" onClick={onClose} />
      <aside className="detail-drawer">
        <div className="detail-drawer-header">
          <div>
            <h2>{title}</h2>
            {subtitle ? <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>{subtitle}</p> : null}
          </div>
          <button className="detail-drawer-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="detail-drawer-body">{children}</div>
      </aside>
    </>
  )
}
