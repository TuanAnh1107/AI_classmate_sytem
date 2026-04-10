import { useMemo } from 'react'
import type { DataState } from '../../../models/shared/portal.types'
import { NotificationList, type NotificationRow } from '../student/NotificationList'
import { EmptyState } from './EmptyState'
import { ErrorState } from './ErrorState'
import { LoadingState } from './LoadingState'
import { PortalSectionTabs } from './PortalSectionTabs'

type InboxFilter = 'all' | 'unread' | 'read'

type InboxStat = {
  id: string
  label: string
  value: string
}

type NotificationInboxShellProps = {
  kicker?: string
  title: string
  description: string
  state: DataState
  errorMessage?: string
  stats: InboxStat[]
  rows: NotificationRow[]
  selectedId?: string
  searchValue: string
  onSearchChange: (value: string) => void
  filterValue: InboxFilter
  onFilterChange: (value: InboxFilter) => void
  loadingTitle: string
  loadingDescription: string
  emptyTitle: string
  emptyDescription: string
}

function getCount(stats: InboxStat[], id: string) {
  return stats.find((item) => item.id === id)?.value ?? '0'
}

export function NotificationInboxShell({
  kicker,
  title,
  description,
  state,
  errorMessage,
  stats,
  rows,
  selectedId,
  searchValue,
  onSearchChange,
  filterValue,
  onFilterChange,
  loadingTitle,
  loadingDescription,
  emptyTitle,
  emptyDescription,
}: NotificationInboxShellProps) {
  const tabs = useMemo(
    () => [
      { id: 'all', label: 'Tất cả', countLabel: getCount(stats, 'total') },
      { id: 'unread', label: 'Chưa đọc', countLabel: getCount(stats, 'unread') },
      { id: 'read', label: 'Đã đọc', countLabel: getCount(stats, 'read') },
    ],
    [stats],
  )

  return (
    <section className="portal-section-card portal-inbox-shell portal-page-transition">
      <header className="portal-section-head">
        <div>
          {kicker ? <p className="portal-section-kicker">{kicker}</p> : null}
          <h2>{title}</h2>
          <p className="portal-section-description">{description}</p>
        </div>
      </header>

      <div className="portal-inbox-toolbar">
        <label className="portal-inline-search">
          <span>Tìm trong thông báo</span>
          <input
            className="portal-inline-search-input"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Tìm theo nội dung thông báo"
          />
        </label>

        <PortalSectionTabs
          className="portal-inline-tabs"
          items={tabs}
          activeId={filterValue}
          onChange={(value) => onFilterChange(value as InboxFilter)}
        />
      </div>

      <div className="portal-summary-inline">
        {stats.map((item) => (
          <article key={item.id} className="portal-summary-chip">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>

      {state === 'loading' ? <LoadingState title={loadingTitle} description={loadingDescription} /> : null}
      {state === 'error' ? <ErrorState description={errorMessage ?? 'Không thể tải thông báo.'} /> : null}
      {state === 'empty' ? <EmptyState title={emptyTitle} description={emptyDescription} /> : null}
      {state === 'ready' ? <NotificationList rows={rows} selectedId={selectedId} /> : null}
    </section>
  )
}
