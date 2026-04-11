import type { DataState } from '../../../models/shared/portal.types'
import { lecturerAssignmentSortOptions, useLecturerAssignmentsController } from '../../../controllers/lecturer/useLecturerAssignmentsController'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { InfoHeader } from '../../components/shared/InfoHeader'
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
      <div className="page-workspace">
        <InfoHeader
          title="Bài tập"
          subtitle="Chọn lớp phụ trách, xem nhanh số lượng đã nộp và đi thẳng vào bài cần xử lý."
          actions={
            <a className="portal-primary-button" href="?portal=lecturer&page=assignment-create">
              Tạo bài tập mới
            </a>
          }
        />

        <section className="content-panel">
          <div className="content-panel-header">
            <div>
              <h2>Danh sách lớp học</h2>
              <p>Chọn lớp để xem danh sách bài tập và tình trạng nộp bài.</p>
            </div>
          </div>

          <div className="assignment-class-grid">
            {model.classes.map((item) => (
              <a key={item.id} href={item.href} className={`assignment-class-card${item.isActive ? ' is-active' : ''}`}>
                <div className="assignment-class-card-head">
                  <strong>{item.code}</strong>
                  <StatusBadge label={item.isActive ? 'Đang xem' : 'Chọn lớp'} tone={item.isActive ? 'info' : 'neutral'} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.helperText}</p>
                <div className="assignment-class-card-meta">
                  <span>{item.openAssignmentsLabel}</span>
                  <span>{item.pendingLabel}</span>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="content-panel">
          <div className="content-panel-header">
            <div>
              <h2>{model.selectedClass?.title ?? 'Danh sách bài tập'}</h2>
              <p>{model.selectedClass ? `${model.selectedClass.studentCountLabel}. Chọn một bài để xem danh sách đã nộp và chưa nộp.` : 'Chọn lớp để xem bài tập.'}</p>
            </div>
          </div>

          <div className="assignment-toolbar">
            <div className="assignment-filter-row">
              {statusOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`filter-chip${model.filters.status === option.value ? ' is-active' : ''}`}
                  onClick={() => model.setQuery({ status: option.value, page: 1 })}
                >
                  <span>{option.label}</span>
                </button>
              ))}
            </div>

            <div className="assignment-toolbar-controls">
              <div className="filter-search">
                <input
                  type="text"
                  placeholder="Tìm theo tên bài tập hoặc mã bài"
                  value={model.filters.search}
                  onChange={(event) => model.setQuery({ search: event.target.value, page: 1 })}
                />
              </div>

              <select value={model.filters.sort} onChange={(event) => model.setQuery({ sort: event.target.value })}>
                {lecturerAssignmentSortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="portal-summary-inline" style={{ marginBottom: 16 }}>
            {model.stats.map((item) => (
              <article key={item.id} className="portal-summary-chip">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
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
            <EmptyState title="Chưa có bài tập phù hợp" description="Tạo bài tập mới hoặc đổi bộ lọc để xem dữ liệu khác." />
          ) : null}

          {model.state === 'ready' ? (
            <div className="assignment-list-stack">
              {model.rows.map((row) => (
                <article key={row.id} className="assignment-list-card">
                  <div className="assignment-list-card-main">
                    <div className="assignment-list-card-head">
                      <div>
                        <a className="compact-list-title" href={row.detailHref}>
                          {row.title}
                        </a>
                        <div className="compact-list-meta">{row.summary}</div>
                      </div>
                      <StatusBadge label={row.statusLabel} tone={row.statusTone} />
                    </div>

                    <div className="assignment-list-card-meta">
                      <span>Hạn nộp: {row.deadlineLabel}</span>
                      <span>{row.submittedLabel}</span>
                      <span>{row.pendingGradeLabel}</span>
                    </div>
                  </div>

                  <div className="assignment-list-card-actions">
                    <a className="portal-outline-button" href={row.editHref}>
                      Chỉnh sửa
                    </a>
                    <a className="portal-outline-button" href={row.detailHref}>
                      Xem chi tiết
                    </a>
                    <a className="portal-primary-button" href={row.queueHref}>
                      Mở hàng chấm
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </LecturerPortalLayout>
  )
}
