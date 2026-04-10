import type { DataState } from '../../../models/shared/portal.types'
import { useLecturerAssignmentsController } from '../../../controllers/lecturer/useLecturerAssignmentsController'
import { lecturerAssignmentSortOptions } from '../../../controllers/lecturer/useLecturerAssignmentsController'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { MetricBar } from '../../components/shared/MetricBar'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { LecturerPortalLayout } from '../../layouts/LecturerPortalLayout'

type LecturerAssignmentsPageProps = {
  dataState: DataState
}

const statusOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'published', label: 'Đang mở' },
  { value: 'draft', label: 'Nháp' },
  { value: 'closed', label: 'Đã đóng' },
] as const

export function LecturerAssignmentsPage({ dataState }: LecturerAssignmentsPageProps) {
  const model = useLecturerAssignmentsController(dataState)

  return (
    <LecturerPortalLayout frame={model.frame}>
      <div className="page-title-bar">
        <div>
          <h1>Bài tập</h1>
          <p className="portal-section-description">
            Chọn lớp trước, sau đó quét danh sách bài theo hạn nộp, tỷ lệ nộp và trạng thái chấm để xử lý nhanh hơn.
          </p>
        </div>
        <div className="page-title-bar-actions">
          <a className="portal-primary-button" href="?portal=lecturer&page=assignment-create">
            Tạo bài tập mới
          </a>
        </div>
      </div>

      <div className="student-page-body portal-page-transition">
        <div className="class-selector">
          <label htmlFor="lec-class-select">Lớp</label>
          <select
            id="lec-class-select"
            value={model.classes.find((item) => item.isActive)?.id ?? ''}
            onChange={(event) => {
              const selected = model.classes.find((item) => item.id === event.target.value)
              if (selected) {
                window.location.href = selected.href
              }
            }}
          >
            {model.classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.code} - {item.title}
              </option>
            ))}
          </select>
        </div>

        {model.stats.length ? <MetricBar items={model.stats} /> : null}

        <div className="filter-toolbar">
          <div className="filter-search">
            <input
              type="text"
              placeholder="Tìm theo tên bài tập hoặc mã bài"
              value={model.filters.search}
              onChange={(event) => model.setQuery({ search: event.target.value, page: 1 })}
            />
          </div>

          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`filter-chip${model.filters.status === option.value ? ' is-active' : ''}`}
              onClick={() => model.setQuery({ status: option.value, page: 1 })}
            >
              {option.label}
            </button>
          ))}

          <select value={model.filters.sort} onChange={(event) => model.setQuery({ sort: event.target.value })}>
            {lecturerAssignmentSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {model.state === 'loading' ? (
          <div className="table-skeleton">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="table-skeleton-row" />
            ))}
          </div>
        ) : null}

        {model.state === 'error' ? <ErrorState description={model.errorMessage ?? 'Không thể tải dữ liệu.'} /> : null}

        {model.state === 'empty' ? (
          <EmptyState title="Chưa có bài tập" description="Tạo bài tập mới hoặc thử đổi bộ lọc để xem dữ liệu phù hợp." />
        ) : null}

        {model.state === 'ready' ? (
          <div className="content-panel" style={{ padding: 0 }}>
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Bài tập</th>
                  <th>Hạn nộp</th>
                  <th>Đã nộp</th>
                  <th>Chờ chấm</th>
                  <th>Trạng thái</th>
                  <th style={{ width: 100 }}></th>
                </tr>
              </thead>
              <tbody>
                {model.rows.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <a className="compact-table-title" href={row.detailHref}>
                        {row.title}
                      </a>
                      <div className="compact-table-meta">{row.summary}</div>
                    </td>
                    <td style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>{row.deadlineLabel}</td>
                    <td style={{ fontSize: '13px' }}>{row.submittedLabel}</td>
                    <td style={{ fontSize: '13px' }}>{row.pendingGradeLabel}</td>
                    <td>
                      <StatusBadge label={row.statusLabel} tone={row.statusTone} />
                    </td>
                    <td>
                      <a className="portal-outline-button" href={row.detailHref}>
                        Mở
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </LecturerPortalLayout>
  )
}
