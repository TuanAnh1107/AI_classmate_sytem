import type { DataState } from '../../../models/shared/portal.types'
import { useLecturerDashboardController } from '../../../controllers/lecturer/useLecturerDashboardController'
import { CollapsibleSection } from '../../components/shared/CollapsibleSection'
import { ContentPanel } from '../../components/shared/ContentPanel'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { LoadingState } from '../../components/shared/LoadingState'
import { MetricBar } from '../../components/shared/MetricBar'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { LecturerPortalLayout } from '../../layouts/LecturerPortalLayout'

type LecturerDashboardPageProps = {
  dataState: DataState
}

export function LecturerDashboardPage({ dataState }: LecturerDashboardPageProps) {
  const model = useLecturerDashboardController(dataState)

  return (
    <LecturerPortalLayout frame={model.frame}>
      <div className="page-title-bar">
        <h1>Trang chủ giảng viên</h1>
        <div className="page-title-bar-actions">
          <a className="portal-outline-button" href="?portal=lecturer&page=assignment-create">
            Tạo bài tập mới
          </a>
          <a className="portal-primary-button" href="?portal=lecturer&page=assignments">
            Mở hàng chấm
          </a>
        </div>
      </div>

      {model.state === 'loading' ? <LoadingState /> : null}
      {model.state === 'error' ? <ErrorState description={model.errorMessage ?? 'Không thể tải dữ liệu.'} /> : null}

      {model.state === 'ready' || model.state === 'empty' ? (
        <div className="student-page-body portal-page-transition">
          <MetricBar items={model.stats} />

          <ContentPanel
            title="Cần chấm"
            actions={
              <a className="portal-outline-button" href="?portal=lecturer&page=assignments">
                Xem tất cả
              </a>
            }
          >
            {model.needsGrading.length ? (
              <div className="compact-list">
                {model.needsGrading.slice(0, 5).map((item) => (
                  <div key={item.id} className="compact-list-item">
                    <div>
                      <a className="compact-list-title" href={item.href}>
                        {item.title}
                      </a>
                      <div className="compact-list-meta">
                        {item.studentName} · {item.classLabel} · {item.submittedAtLabel}
                      </div>
                    </div>
                    <div className="compact-list-actions">
                      <StatusBadge label={item.statusLabel} tone="warning" />
                      <a className="portal-primary-button" href={item.href}>
                        Chấm
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState title="Không có bài cần chấm" description="Khi có bài nộp mới, chúng sẽ xuất hiện ở đây." />
            )}
          </ContentPanel>

          <CollapsibleSection title="Bài tập sắp hết hạn" count={model.upcomingDeadlines.length}>
            {model.upcomingDeadlines.length ? (
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
            )}
          </CollapsibleSection>

          <CollapsibleSection title="Độ phủ nộp bài" count={model.lowCoverageAssignments.length}>
            {model.lowCoverageAssignments.length ? (
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
            )}
          </CollapsibleSection>

          <CollapsibleSection title="Bài nộp gần đây" count={model.recentSubmissions.length}>
            {model.recentSubmissions.length ? (
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
            )}
          </CollapsibleSection>
        </div>
      ) : null}
    </LecturerPortalLayout>
  )
}
