import { useMemo, useState } from 'react'
import type { DataState } from '../../../models/shared/portal.types'
import { useLecturerDashboardController } from '../../../controllers/lecturer/useLecturerDashboardController'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { InfoHeader } from '../../components/shared/InfoHeader'
import { LoadingState } from '../../components/shared/LoadingState'
import { PortalSectionTabs } from '../../components/shared/PortalSectionTabs'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { LecturerPortalLayout } from '../../layouts/LecturerPortalLayout'

type LecturerDashboardPageProps = {
  dataState: DataState
}

type SecondaryTabId = 'deadlines' | 'coverage' | 'recent'

export function LecturerDashboardPage({ dataState }: LecturerDashboardPageProps) {
  const model = useLecturerDashboardController(dataState)
  const [secondaryTab, setSecondaryTab] = useState<SecondaryTabId>('deadlines')

  const secondaryTabs = useMemo(
    () => [
      { id: 'deadlines', label: 'Sắp hết hạn', countLabel: String(model.upcomingDeadlines.length) },
      { id: 'coverage', label: 'Độ phủ nộp bài', countLabel: String(model.lowCoverageAssignments.length) },
      { id: 'recent', label: 'Nộp gần đây', countLabel: String(model.recentSubmissions.length) },
    ],
    [model.upcomingDeadlines.length, model.lowCoverageAssignments.length, model.recentSubmissions.length],
  )

  return (
    <LecturerPortalLayout frame={model.frame}>
      {model.state === 'loading' ? <LoadingState /> : null}
      {model.state === 'error' ? <ErrorState description={model.errorMessage ?? 'Không thể tải dữ liệu.'} /> : null}

      {model.state === 'ready' || model.state === 'empty' ? (
        <div className="page-workspace">
          <InfoHeader
            title="Trang chủ giảng viên"
            stats={model.stats.map((s) => ({ label: s.label, value: s.value }))}
            actions={
              <>
                <a className="portal-outline-button" href="?portal=lecturer&page=assignment-create">
                  Tạo bài tập mới
                </a>
                <a className="portal-primary-button" href="?portal=lecturer&page=assignments">
                  Mở hàng chấm
                </a>
              </>
            }
          />

          <div className="priority-list">
            <div className="priority-list-header">
              <h2>Cần chấm</h2>
              <a className="portal-outline-button" href="?portal=lecturer&page=assignments">
                Xem tất cả
              </a>
            </div>
            <div className="priority-list-body">
              {model.needsGrading.length ? (
                model.needsGrading.slice(0, 5).map((item) => (
                  <div key={item.id} className="priority-list-item">
                    <div className="priority-list-item-info">
                      <a className="priority-list-item-title" href={item.href}>
                        {item.title}
                      </a>
                      <div className="priority-list-item-meta">
                        {item.studentName} · {item.classLabel} · {item.submittedAtLabel}
                      </div>
                    </div>
                    <div className="priority-list-item-actions">
                      <StatusBadge label={item.statusLabel} tone="warning" />
                      <a className="portal-primary-button" href={item.href}>
                        Chấm
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState title="Không có bài cần chấm" description="Khi có bài nộp mới, chúng sẽ xuất hiện ở đây." />
              )}
            </div>
          </div>

          <div className="content-panel" style={{ marginTop: '12px' }}>
            <PortalSectionTabs items={secondaryTabs} activeId={secondaryTab} onChange={(id) => setSecondaryTab(id as SecondaryTabId)} />

            {secondaryTab === 'deadlines' ? (
              model.upcomingDeadlines.length ? (
                <div className="compact-list">
                  {model.upcomingDeadlines.map((item) => (
                    <div key={item.id} className="compact-list-item">
                      <div>
                        <a className="compact-list-title" href={item.href}>
                          {item.title}
                        </a>
                        <div className="compact-list-meta">
                          {item.classLabel} · {item.dueAtLabel}
                        </div>
                      </div>
                      <StatusBadge label={item.deadlineLabel} tone={item.tone} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Không có rủi ro deadline" description="Các bài tập đang tiến triển bình thường." />
              )
            ) : null}

            {secondaryTab === 'coverage' ? (
              model.lowCoverageAssignments.length ? (
                <div className="compact-list">
                  {model.lowCoverageAssignments.map((item) => (
                    <div key={item.id} className="compact-list-item">
                      <div>
                        <a className="compact-list-title" href={item.href}>
                          {item.title}
                        </a>
                        <div className="compact-list-meta">{item.classLabel}</div>
                      </div>
                      <StatusBadge label={item.coverageLabel} tone={item.tone} />
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Tất cả bài tập có độ phủ tốt" description="Không có bài nào cần chú ý thêm." />
              )
            ) : null}

            {secondaryTab === 'recent' ? (
              model.recentSubmissions.length ? (
                <div className="compact-list">
                  {model.recentSubmissions.map((item) => (
                    <div key={item.id} className="compact-list-item">
                      <div>
                        <a className="compact-list-title" href={item.href}>
                          {item.title}
                        </a>
                        <div className="compact-list-meta">
                          {item.studentName} · {item.classLabel}
                        </div>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {item.submittedAtLabel}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Chưa có bài nộp gần đây" description="Hoạt động mới sẽ xuất hiện tại đây." />
              )
            ) : null}
          </div>
        </div>
      ) : null}
    </LecturerPortalLayout>
  )
}
