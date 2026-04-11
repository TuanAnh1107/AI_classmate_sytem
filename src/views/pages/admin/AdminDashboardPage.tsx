import { useMemo, useState } from 'react'
import type { DataState } from '../../../models/shared/portal.types'
import { useAdminDashboardController } from '../../../controllers/admin/useAdminDashboardController'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { InfoHeader } from '../../components/shared/InfoHeader'
import { LoadingState } from '../../components/shared/LoadingState'
import { PortalSectionTabs } from '../../components/shared/PortalSectionTabs'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { AdminPortalLayout } from '../../layouts/AdminPortalLayout'

type AdminDashboardPageProps = {
  dataState: DataState
}

type AdminHomeTabId = 'hotspots' | 'alerts' | 'activity'

export function AdminDashboardPage({ dataState }: AdminDashboardPageProps) {
  const model = useAdminDashboardController(dataState)
  const [activeTab, setActiveTab] = useState<AdminHomeTabId>('hotspots')

  const tabs = useMemo(
    () => [
      { id: 'hotspots', label: 'Điểm nóng', countLabel: `${model.highlights.length}` },
      { id: 'alerts', label: 'Cảnh báo', countLabel: `${model.alerts.length}` },
      { id: 'activity', label: 'Hoạt động', countLabel: `${model.activities.length}` },
    ],
    [model.activities.length, model.alerts.length, model.highlights.length],
  )

  return (
    <AdminPortalLayout frame={model.frame}>
      {model.state === 'loading' ? <LoadingState title="Đang tải dashboard" description="Đang tổng hợp dữ liệu." /> : null}
      {model.state === 'error' ? <ErrorState description={model.errorMessage ?? 'Không thể tải dashboard.'} /> : null}
      {model.state === 'empty' ? (
        <EmptyState title="Chưa có dữ liệu" description="Dashboard sẽ hiển thị khi có dữ liệu vận hành." />
      ) : null}

      {model.state === 'ready' ? (
        <div className="page-workspace">
          <InfoHeader
            title="Admin Home"
            stats={model.stats.slice(0, 6).map((s) => ({ label: s.label, value: s.value }))}
            actions={
              <>
                <a className="portal-outline-button" href="?portal=admin&page=submissions">Submissions</a>
                <a className="portal-primary-button" href="?portal=admin&page=users">Quản lý người dùng</a>
              </>
            }
          />

          <div className="content-panel">
            <PortalSectionTabs items={tabs} activeId={activeTab} onChange={(id) => setActiveTab(id as AdminHomeTabId)} />

            {activeTab === 'hotspots' ? (
              model.highlights.length ? (
                <div className="compact-list">
                  {model.highlights.map((item) => (
                    <a key={item.id} href={item.href} className="compact-list-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div>
                        <span className="compact-list-title">{item.title}</span>
                        <div className="compact-list-meta">{item.detail}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <StatusBadge
                          label={item.tone === 'warning' ? 'Cần chú ý' : item.tone === 'info' ? 'Theo dõi' : 'Ổn định'}
                          tone={item.tone}
                        />
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.meta}</span>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <EmptyState title="Không có điểm nóng" description="Các assignment cần chú ý sẽ xuất hiện tại đây." />
              )
            ) : null}

            {activeTab === 'alerts' ? (
              model.alerts.length ? (
                <div className="compact-list">
                  {model.alerts.map((item) => (
                    <a key={item.id} href={item.href} className="compact-list-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div>
                        <span className="compact-list-title">{item.title}</span>
                        <div className="compact-list-meta">{item.detail}</div>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.meta}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <EmptyState title="Không có cảnh báo" description="Tín hiệu bất thường sẽ xuất hiện ở đây." />
              )
            ) : null}

            {activeTab === 'activity' ? (
              model.activities.length ? (
                <div className="compact-list">
                  {model.activities.map((item) => (
                    <div key={item.id} className="compact-list-item">
                      <div>
                        <span className="compact-list-title">{item.title}</span>
                        <div className="compact-list-meta">{item.detail}</div>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{item.createdAtLabel}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Chưa có hoạt động" description="Hoạt động hệ thống sẽ xuất hiện ở đây." />
              )
            ) : null}
          </div>

          {model.quickLinks.length ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px', padding: '10px 0', borderTop: '1px solid var(--border)' }}>
              {model.quickLinks.map((item) => (
                <a key={item.id} className="portal-outline-button" href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </AdminPortalLayout>
  )
}
