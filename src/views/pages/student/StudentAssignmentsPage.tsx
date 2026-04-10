import type { AssignmentFilter } from '../../../models/student/student.types'
import type { DataState } from '../../../models/shared/portal.types'
import { useStudentAssignmentsController } from '../../../controllers/student/useStudentAssignmentsController'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentAssignmentsPageProps = {
  dataState: DataState
  activeFilter: AssignmentFilter
}

export function StudentAssignmentsPage({ dataState, activeFilter }: StudentAssignmentsPageProps) {
  const model = useStudentAssignmentsController(dataState, activeFilter)

  return (
    <StudentPortalLayout frame={model.frame}>
      <div className="page-title-bar">
        <h1>Bài tập</h1>
      </div>

      <div className="student-page-body portal-page-transition">
        <div className="class-selector">
          <label htmlFor="class-select">Lớp</label>
          <select
            id="class-select"
            value={model.classes.find((item) => item.isActive)?.id ?? ''}
            onChange={(event) => {
              const selectedClass = model.classes.find((item) => item.id === event.target.value)
              if (selectedClass) {
                window.location.href = selectedClass.href
              }
            }}
          >
            {model.classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.code} — {item.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {model.filters.map((filter) => (
            <a key={filter.key} href={filter.href} className={`filter-chip${filter.isActive ? ' is-active' : ''}`}>
              <span>{filter.label}</span>
              <strong>{filter.count}</strong>
            </a>
          ))}
        </div>

        <div className="filter-toolbar">
          <div className="filter-search">
            <input
              type="text"
              placeholder="Tìm theo tên bài hoặc mã bài"
              value={model.searchValue}
              onChange={(event) => model.onSearchChange(event.target.value)}
            />
          </div>
        </div>

        {model.state === 'loading' ? (
          <div className="table-skeleton">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="table-skeleton-row" />
            ))}
          </div>
        ) : null}

        {model.state === 'error' ? <ErrorState description={model.errorMessage ?? 'Không thể tải dữ liệu.'} /> : null}
        {model.state === 'empty' ? (
          <EmptyState title="Không có bài tập phù hợp" description="Lớp hiện tại chưa có bài đúng với bộ lọc bạn đang chọn." />
        ) : null}

        {model.state === 'ready' ? (
          <div className="content-panel" style={{ padding: 0 }}>
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Bài tập</th>
                  <th>Hạn nộp</th>
                  <th>Trạng thái</th>
                  <th>Điểm</th>
                  <th style={{ width: '100px' }}></th>
                </tr>
              </thead>
              <tbody>
                {model.rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <a className="compact-table-title" href={row.primaryActionHref}>
                        {row.title}
                      </a>
                      <div className="compact-table-meta">{row.classLabel}</div>
                    </td>
                    <td style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>{row.deadlineLabel}</td>
                    <td>
                      <StatusBadge label={row.statusLabel} tone={row.statusTone} />
                    </td>
                    <td style={{ fontSize: '13px', fontWeight: 600 }}>{row.scoreLabel || '—'}</td>
                    <td>
                      <a className="portal-primary-button" href={row.primaryActionHref}>
                        {row.primaryActionLabel}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </StudentPortalLayout>
  )
}
