import { useEffect, useMemo, useState } from 'react'
import type { DataState } from '../../../models/shared/portal.types'
import { lecturerSubmissionSortOptions, useLecturerSubmissionListController } from '../../../controllers/lecturer/useLecturerSubmissionListController'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { LecturerBulkActionBar } from '../../components/lecturer/LecturerBulkActionBar'
import { LecturerFilterToolbar } from '../../components/lecturer/LecturerFilterToolbar'
import { LecturerPaginationBar } from '../../components/lecturer/LecturerPaginationBar'
import { LecturerQueueTabs } from '../../components/lecturer/LecturerQueueTabs'
import { LecturerRowActions } from '../../components/lecturer/LecturerRowActions'
import { LecturerSavedViewBar } from '../../components/lecturer/LecturerSavedViewBar'
import { LecturerStatsRow } from '../../components/lecturer/LecturerStatsRow'
import { LecturerTableShell } from '../../components/lecturer/LecturerTableShell'
import { LecturerTableSkeleton } from '../../components/lecturer/LecturerTableSkeleton'
import { LecturerPortalLayout } from '../../layouts/LecturerPortalLayout'

type LecturerSubmissionListPageProps = {
  dataState: DataState
  assignmentId?: string
}

export function LecturerSubmissionListPage({ dataState, assignmentId }: LecturerSubmissionListPageProps) {
  const model = useLecturerSubmissionListController(assignmentId, dataState)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    setSelectedIds([])
  }, [model.rows])

  const allSelected = model.rows.length > 0 && selectedIds.length === model.rows.length
  const bulkActions = useMemo(
    () => [
      { id: 'export', label: 'Export bộ lọc', onClick: () => {} },
      { id: 'assign', label: 'Gán vào hàng chấm', onClick: () => {} },
    ],
    [],
  )

  return (
    <LecturerPortalLayout frame={model.frame}>
      <section className="student-page-body">
        <div className="workflow-command-bar">
          <div className="workflow-command-copy">
            <p className="portal-page-kicker">Hàng chấm bài</p>
            <h2>Hàng chấm tập trung theo trạng thái xử lý</h2>
            <p>
              Hàng chấm này được tối ưu cho giảng viên tìm đúng bài cần chấm, bài nộp trễ và các bài cần phản hồi mà
              không phải lục lại từ danh sách bài tập.
            </p>
          </div>

          <div className="workflow-command-actions portal-button-row">
            <a className="portal-outline-button" href="?portal=lecturer&page=assignments">
              Về bài tập
            </a>
            <a className="portal-primary-button" href="?portal=lecturer&page=submission-list&view=ungraded">
              Chỉ xem chưa chấm
            </a>
          </div>
        </div>

        <LecturerStatsRow items={model.stats} />

        <LecturerQueueTabs
          tabs={model.tabs.map((tab) => ({
            ...tab,
            isActive: model.filters.view === tab.id,
            onClick: () => model.setQuery({ view: tab.id, page: 1 }),
          }))}
        />

        <LecturerSavedViewBar
          views={[
            { id: 'all', label: 'Tất cả', isActive: model.filters.view === 'all', onClick: () => model.setQuery({ view: 'all' }) },
            {
              id: 'ungraded',
              label: 'Chưa chấm',
              isActive: model.filters.view === 'ungraded',
              onClick: () => model.setQuery({ view: 'ungraded' }),
            },
            { id: 'late', label: 'Nộp trễ', isActive: model.filters.view === 'late', onClick: () => model.setQuery({ view: 'late' }) },
          ]}
        />

        <LecturerFilterToolbar
          sticky
          searchPlaceholder="Tìm theo mã sinh viên, tên sinh viên hoặc bài tập"
          searchValue={model.filters.search}
          onSearchChange={(value) => model.setQuery({ search: value, page: 1 })}
          selects={[
            {
              id: 'classId',
              label: 'Lớp',
              value: model.filters.classId,
              options: model.classOptions,
              onChange: (value) => model.setQuery({ classId: value, page: 1 }),
            },
            {
              id: 'assignmentId',
              label: 'Bài tập',
              value: model.filters.assignmentId,
              options: model.assignmentOptions,
              onChange: (value) => model.setQuery({ assignmentId: value, page: 1 }),
            },
            {
              id: 'submissionStatus',
              label: 'Trạng thái nộp',
              value: model.filters.submissionStatus,
              options: [
                { value: 'all', label: 'Tất cả' },
                { value: 'submitted', label: 'Đã nộp' },
                { value: 'late', label: 'Nộp trễ' },
                { value: 'missing', label: 'Chưa nộp' },
              ],
              onChange: (value) => model.setQuery({ submissionStatus: value, page: 1 }),
            },
            {
              id: 'gradingStatus',
              label: 'Chấm điểm',
              value: model.filters.gradingStatus,
              options: [
                { value: 'all', label: 'Tất cả' },
                { value: 'ungraded', label: 'Chưa chấm' },
                { value: 'graded', label: 'Đã chấm' },
              ],
              onChange: (value) => model.setQuery({ gradingStatus: value, page: 1 }),
            },
          ]}
          sortOptions={lecturerSubmissionSortOptions}
          sortValue={model.filters.sort}
          onSortChange={(value) => model.setQuery({ sort: value })}
          onReset={() =>
            model.setQuery({
              search: '',
              submissionStatus: 'all',
              gradingStatus: 'all',
              view: 'all',
              page: 1,
              pageSize: 20,
            })
          }
          rightSlot={<span className="admin-filter-hint">Tổng {model.pagination.total} bài nộp</span>}
        />

        <LecturerBulkActionBar selectedCount={selectedIds.length} actions={bulkActions} onClear={() => setSelectedIds([])} />

        {model.state === 'loading' ? <LecturerTableSkeleton rows={6} columns={10} /> : null}
        {model.state === 'error' ? <ErrorState description={model.errorMessage ?? 'Không thể tải dữ liệu.'} /> : null}
        {model.state === 'empty' ? (
          <EmptyState title="Không có bài nộp phù hợp" description="Queue hiện tại trống theo bộ lọc đang chọn." />
        ) : null}

        {model.state === 'ready' ? (
          <LecturerTableShell
            selectable
            allSelected={allSelected}
            onToggleAll={() => setSelectedIds(allSelected ? [] : model.rows.map((row) => row.id))}
            columns={[
              { id: 'assignment', label: 'Bài tập' },
              { id: 'student', label: 'Sinh viên' },
              { id: 'submission', label: 'Trạng thái nộp' },
              { id: 'grading', label: 'Chấm điểm' },
              { id: 'submittedAt', label: 'Thời điểm nộp' },
              { id: 'attempts', label: 'Lần nộp' },
              { id: 'score', label: 'Điểm' },
              { id: 'feedback', label: 'Phản hồi' },
              { id: 'actions', label: 'Hành động' },
            ]}
          >
            {model.rows.map((row) => (
              <tr key={row.id}>
                <td className="admin-table-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() =>
                      setSelectedIds((prev) =>
                        prev.includes(row.id) ? prev.filter((item) => item !== row.id) : [...prev, row.id],
                      )
                    }
                  />
                </td>
                <td>
                  <div className="portal-table-stack">
                    <a className="portal-table-title-link" href={row.href}>
                      {row.assignmentTitle}
                    </a>
                    <span className="portal-muted-text">{row.classLabel}</span>
                  </div>
                </td>
                <td>
                  <div className="portal-table-stack">
                    <span>{row.studentName}</span>
                    <span className="portal-muted-text">{row.studentCode}</span>
                  </div>
                </td>
                <td>
                  <StatusBadge
                    label={row.submissionLabel}
                    tone={row.submissionStatus === 'missing' ? 'danger' : row.submissionStatus === 'late' ? 'warning' : 'success'}
                  />
                </td>
                <td>
                  <StatusBadge label={row.gradingLabel} tone={row.gradingStatus === 'graded' ? 'success' : 'warning'} />
                </td>
                <td>{row.submittedAtLabel}</td>
                <td>{row.attemptsLabel}</td>
                <td>{row.scoreLabel}</td>
                <td>{row.feedbackLabel}</td>
                <td>
                  <LecturerRowActions
                    actions={[
                      { id: 'detail', label: 'Chi tiết', href: row.href },
                      { id: 'grade', label: 'Chấm bài' },
                      { id: 'feedback', label: 'Phản hồi' },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </LecturerTableShell>
        ) : null}

        <LecturerPaginationBar
          page={model.pagination.page}
          pageSize={model.pagination.pageSize}
          total={model.pagination.total}
          onPageChange={(page) => model.setQuery({ page })}
          onPageSizeChange={(pageSize) => model.setQuery({ pageSize, page: 1 })}
        />
      </section>
    </LecturerPortalLayout>
  )
}
