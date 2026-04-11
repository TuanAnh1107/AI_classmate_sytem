import type { AssignmentFilter } from '../../../models/student/student.types'
import type { DataState } from '../../../models/shared/portal.types'
import { useStudentAssignmentsController } from '../../../controllers/student/useStudentAssignmentsController'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { InfoHeader } from '../../components/shared/InfoHeader'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentAssignmentsPageProps = {
  dataState: DataState
  activeFilter: AssignmentFilter
}

const sortOptions = [
  { value: 'deadline', label: 'Hạn nộp gần nhất' },
  { value: 'recent', label: 'Cập nhật gần đây' },
  { value: 'status', label: 'Theo trạng thái' },
] as const

export function StudentAssignmentsPage({ dataState, activeFilter }: StudentAssignmentsPageProps) {
  const model = useStudentAssignmentsController(dataState, activeFilter)

  return (
    <StudentPortalLayout frame={model.frame}>
      <div className="page-workspace">
        <InfoHeader
          title="Bài tập"
          subtitle="Sinh viên vào là thấy danh sách lớp trước, sau đó mới chọn lớp và lọc bài tập cần xử lý."
        />

        <section className="student-sis-shell">
          <div className="student-sis-head compact">
            <div>
              <p className="portal-page-kicker">Bước 1</p>
              <h2>Danh sách lớp học</h2>
              <p>Chọn lớp để mở đúng danh sách bài tập. Bảng này được giữ ở dạng học vụ để nhìn nhanh và ít nhiễu hơn.</p>
            </div>
          </div>

          <div className="student-course-table-shell">
            <table className="student-course-table student-course-table-selectable">
              <thead>
                <tr>
                  <th style={{ width: 56 }}>STT</th>
                  <th>Lớp học</th>
                  <th style={{ width: 120 }}>Hình thức</th>
                  <th style={{ width: 180 }}>Tiến độ</th>
                  <th style={{ width: 280 }}>Lịch học</th>
                  <th style={{ width: 190 }}>Giảng viên</th>
                  <th style={{ width: 140 }}>Bài tập mở</th>
                  <th style={{ width: 120 }}>Chọn</th>
                </tr>
              </thead>
              <tbody>
                {model.classes.map((item, index) => (
                  <tr key={item.id} className={item.isActive ? 'is-active' : ''}>
                    <td className="student-course-index">{index + 1}</td>
                    <td>
                      <div className="student-course-title-cell">
                        <strong className="student-course-link static">{item.name}</strong>
                        <div className="student-course-subline">
                          <span>{item.code}</span>
                          <span>{item.semester}</span>
                          <span>{item.roomLabel}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="student-course-mode">{item.deliveryMode}</span>
                    </td>
                    <td>
                      <div className="student-course-progress">
                        <strong>{item.progressLabel}</strong>
                        <div className="student-course-progress-bar">
                          <span
                            style={{
                              width: `${Math.max(
                                12,
                                Number.parseInt(item.progressLabel, 10) || (item.isActive ? 72 : 48),
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="student-course-schedule">
                        <strong>{item.scheduleLabel}</strong>
                        <span>{item.helperText}</span>
                      </div>
                    </td>
                    <td>
                      <div className="student-course-lecturer">
                        <strong>{item.lecturerName}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="student-course-open">{item.openAssignmentsLabel}</span>
                    </td>
                    <td>
                      <a
                        className={
                          item.isActive
                            ? 'portal-primary-button student-course-action'
                            : 'portal-outline-button student-course-action'
                        }
                        href={item.href}
                      >
                        {item.isActive ? 'Đang xem' : 'Chọn lớp'}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="content-panel">
          <div className="content-panel-header">
            <div>
              <h2>{model.selectedClass?.title ?? 'Danh sách bài tập'}</h2>
              <p>
                {model.selectedClass
                  ? `${model.selectedClass.lecturerName} · ${model.selectedClass.overview}`
                  : 'Chọn lớp học để xem bài tập.'}
              </p>
            </div>
          </div>

          <div className="assignment-toolbar">
            <div className="assignment-filter-row">
              {model.filters.map((filter) => (
                <a key={filter.key} href={filter.href} className={`filter-chip${filter.isActive ? ' is-active' : ''}`}>
                  <span>{filter.label}</span>
                  <strong>{filter.count}</strong>
                </a>
              ))}
            </div>

            <div className="assignment-toolbar-controls">
              <div className="filter-search">
                <input
                  type="text"
                  placeholder="Tìm theo tên bài tập hoặc mã bài"
                  value={model.searchValue}
                  onChange={(event) => model.onSearchChange(event.target.value)}
                />
              </div>

              <select value={model.sortValue} onChange={(event) => model.onSortChange(event.target.value as typeof model.sortValue)}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
            <EmptyState
              title="Không có bài tập phù hợp"
              description="Lớp hiện tại chưa có bài tập phù hợp với bộ lọc bạn đang chọn."
            />
          ) : null}

          {model.state === 'ready' ? (
            <div className="assignment-list-stack">
              {model.rows.map((row) => (
                <article key={row.id} className="assignment-list-card">
                  <div className="assignment-list-card-main">
                    <div className="assignment-list-card-head">
                      <div>
                        <a className="compact-list-title" href={row.secondaryActionHref}>
                          {row.title}
                        </a>
                        <div className="compact-list-meta">{row.classLabel}</div>
                      </div>
                      <StatusBadge label={row.statusLabel} tone={row.statusTone} />
                    </div>

                    <p className="assignment-list-card-summary">{row.summary}</p>

                    <div className="assignment-list-card-meta">
                      <span>Hạn nộp: {row.deadlineLabel}</span>
                      <span>Trạng thái: {row.statusLabel}</span>
                      <span>{row.scoreLabel ? `Điểm: ${row.scoreLabel}` : 'Chưa có điểm'}</span>
                    </div>
                  </div>

                  <div className="assignment-list-card-actions">
                    <a className="portal-outline-button" href={row.secondaryActionHref}>
                      {row.secondaryActionLabel}
                    </a>
                    <a className="portal-primary-button" href={row.primaryActionHref}>
                      {row.primaryActionLabel}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </StudentPortalLayout>
  )
}
