import { useEffect, useMemo, useState } from 'react'
import type { DataState } from '../../../models/shared/portal.types'
import {
  adminGradingStatusOptions,
  adminSubmissionAssignmentOptions,
  adminSubmissionClassOptions,
  adminSubmissionLecturerOptions,
  adminSubmissionSortOptions,
  adminSubmissionStatusOptions,
  useAdminSubmissionsController,
} from '../../../controllers/admin/useAdminSubmissionsController'
import { AdminBulkActionBar } from '../../components/admin/AdminBulkActionBar'
import { AdminDetailPanel } from '../../components/admin/AdminDetailPanel'
import { AdminFilterToolbar } from '../../components/admin/AdminFilterToolbar'
import { AdminPaginationBar } from '../../components/admin/AdminPaginationBar'
import { AdminRowActions } from '../../components/admin/AdminRowActions'
import { AdminTableShell } from '../../components/admin/AdminTableShell'
import { AdminTableSkeleton } from '../../components/admin/AdminTableSkeleton'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { InfoHeader } from '../../components/shared/InfoHeader'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { AdminPortalLayout } from '../../layouts/AdminPortalLayout'

type AdminSubmissionsPageProps = {
  dataState: DataState
}

export function AdminSubmissionsPage({ dataState }: AdminSubmissionsPageProps) {
  const model = useAdminSubmissionsController(dataState)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    setSelectedIds([])
  }, [model.rows])

  const allSelected = model.rows.length > 0 && selectedIds.length === model.rows.length

  const bulkActions = useMemo(
    () => [
      { id: 'export', label: 'Export bộ lọc', onClick: () => {} },
      { id: 'queue', label: 'Gán vào hàng chấm', onClick: () => {} },
    ],
    [],
  )

  return (
    <AdminPortalLayout frame={model.frame}>
      <div className="page-workspace">
        <InfoHeader
          title="Quản lý bài nộp"
          stats={model.stats.map((s) => ({ label: s.label, value: s.value }))}
          actions={
            <>
              <button className="portal-outline-button">Export bộ lọc</button>
              <a className="portal-primary-button" href="?portal=admin&page=assignments">Xem assignment</a>
            </>
          }
        />

        <AdminFilterToolbar
          sticky
          searchPlaceholder="Tìm theo mã sinh viên, tên sinh viên hoặc bài tập"
          searchValue={model.filters.search}
          onSearchChange={(value) => model.setQuery({ search: value, page: 1 })}
          selects={[
            {
              id: 'classId',
              label: 'Lớp',
              value: model.filters.classId,
              options: adminSubmissionClassOptions,
              onChange: (value) => model.setQuery({ classId: value, page: 1 }),
            },
            {
              id: 'lecturerId',
              label: 'Giảng viên',
              value: model.filters.lecturerId,
              options: adminSubmissionLecturerOptions,
              onChange: (value) => model.setQuery({ lecturerId: value, page: 1 }),
            },
            {
              id: 'assignmentId',
              label: 'Assignment',
              value: model.filters.assignmentId,
              options: adminSubmissionAssignmentOptions,
              onChange: (value) => model.setQuery({ assignmentId: value, page: 1 }),
            },
            {
              id: 'submissionStatus',
              label: 'Trạng thái nộp',
              value: model.filters.submissionStatus,
              options: adminSubmissionStatusOptions,
              onChange: (value) => model.setQuery({ submissionStatus: value, page: 1 }),
            },
            {
              id: 'gradingStatus',
              label: 'Chấm điểm',
              value: model.filters.gradingStatus,
              options: adminGradingStatusOptions,
              onChange: (value) => model.setQuery({ gradingStatus: value, page: 1 }),
            },
          ]}
          textFilters={[
            {
              id: 'scoreMin',
              label: 'Điểm từ',
              value: model.filters.scoreMin,
              placeholder: '0',
              onChange: (value) => model.setQuery({ scoreMin: value, page: 1 }),
            },
            {
              id: 'scoreMax',
              label: 'Điểm đến',
              value: model.filters.scoreMax,
              placeholder: '10',
              onChange: (value) => model.setQuery({ scoreMax: value, page: 1 }),
            },
            {
              id: 'dateFrom',
              label: 'Từ ngày',
              value: model.filters.dateFrom,
              placeholder: 'YYYY-MM-DD',
              onChange: (value) => model.setQuery({ dateFrom: value, page: 1 }),
            },
            {
              id: 'dateTo',
              label: 'Đến ngày',
              value: model.filters.dateTo,
              placeholder: 'YYYY-MM-DD',
              onChange: (value) => model.setQuery({ dateTo: value, page: 1 }),
            },
          ]}
          sortOptions={adminSubmissionSortOptions}
          sortValue={model.filters.sort}
          onSortChange={(value) => model.setQuery({ sort: value })}
          onReset={() =>
            model.setQuery({
              search: '',
              classId: 'all',
              lecturerId: 'all',
              assignmentId: 'all',
              submissionStatus: 'all',
              gradingStatus: 'all',
              scoreMin: '',
              scoreMax: '',
              dateFrom: '',
              dateTo: '',
              sort: 'submitted-desc',
              page: 1,
              pageSize: 20,
              detailId: '',
            })
          }
          rightSlot={<span className="admin-filter-hint">Tổng {model.pagination.total} bài nộp</span>}
        />

        {selectedIds.length ? (
          <AdminBulkActionBar selectedCount={selectedIds.length} actions={bulkActions} onClear={() => setSelectedIds([])} />
        ) : null}

        {model.state === 'loading' ? <AdminTableSkeleton rows={6} columns={9} /> : null}
        {model.state === 'error' ? <ErrorState description={model.errorMessage ?? 'Không thể tải dữ liệu.'} /> : null}
        {model.state === 'empty' ? (
          <EmptyState title="Chưa có bài nộp" description="Danh sách bài nộp sẽ hiển thị khi có dữ liệu." />
        ) : null}

        {model.state === 'ready' ? (
          <AdminTableShell
            selectable
            allSelected={allSelected}
            onToggleAll={() => setSelectedIds(allSelected ? [] : model.rows.map((row) => row.id))}
            columns={[
              { id: 'assignment', label: 'Assignment' },
              { id: 'class', label: 'Lớp' },
              { id: 'lecturer', label: 'Giảng viên' },
              { id: 'studentId', label: 'Mã SV' },
              { id: 'studentName', label: 'Tên SV' },
              { id: 'submissionStatus', label: 'Trạng thái nộp' },
              { id: 'gradingStatus', label: 'Chấm điểm' },
              { id: 'submittedAt', label: 'Thời điểm nộp' },
              { id: 'score', label: 'Điểm' },
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
                <td>{row.assignmentTitle}</td>
                <td>{row.classLabel}</td>
                <td>{row.lecturerName}</td>
                <td>{row.studentId}</td>
                <td>{row.studentName}</td>
                <td>
                  <StatusBadge
                    label={row.submissionStatusLabel}
                    tone={row.submissionStatus === 'late' ? 'warning' : row.submissionStatus === 'missing' ? 'danger' : row.submissionStatus === 'draft' ? 'neutral' : 'success'}
                  />
                </td>
                <td>
                  <StatusBadge label={row.gradingStatusLabel} tone={row.gradingStatus === 'graded' ? 'success' : 'warning'} />
                </td>
                <td>{row.submittedAtLabel}</td>
                <td>{row.scoreLabel}</td>
                <td>
                  <AdminRowActions
                    actions={[
                      { id: 'detail', label: 'Chi tiết', href: row.detailHref },
                      { id: 'feedback', label: 'Feedback' },
                      { id: 'grade', label: 'Chấm bài' },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </AdminTableShell>
        ) : null}

        <AdminPaginationBar
          page={model.pagination.page}
          pageSize={model.pagination.pageSize}
          total={model.pagination.total}
          onPageChange={(page) => model.setQuery({ page })}
          onPageSizeChange={(pageSize) => model.setQuery({ pageSize, page: 1 })}
        />

        {model.detail ? <AdminDetailPanel title={model.detail.title} subtitle={model.detail.subtitle} sections={model.detail.sections} /> : null}
      </div>
    </AdminPortalLayout>
  )
}
