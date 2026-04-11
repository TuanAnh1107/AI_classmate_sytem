import { useEffect, useMemo, useState } from 'react'
import type { DataState } from '../../../models/shared/portal.types'
import {
  adminAssignmentClassOptions,
  adminAssignmentLecturerOptions,
  adminAssignmentSortOptions,
  adminAssignmentStatusOptions,
  useAdminAssignmentsController,
} from '../../../controllers/admin/useAdminAssignmentsController'
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

type AdminAssignmentsPageProps = {
  dataState: DataState
}

export function AdminAssignmentsPage({ dataState }: AdminAssignmentsPageProps) {
  const model = useAdminAssignmentsController(dataState)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    setSelectedIds([])
  }, [model.rows])

  const allSelected = model.rows.length > 0 && selectedIds.length === model.rows.length

  const bulkActions = useMemo(
    () => [
      { id: 'export', label: 'Export tổng hợp', onClick: () => {} },
      { id: 'close', label: 'Đóng bài', tone: 'danger' as const, onClick: () => {} },
    ],
    [],
  )

  return (
    <AdminPortalLayout frame={model.frame}>
      <div className="page-workspace">
        <InfoHeader
          title="Quản lý assignment"
          stats={model.stats.map((s) => ({ label: s.label, value: s.value }))}
          actions={
            <>
              <button className="portal-outline-button">Export</button>
              <button className="portal-primary-button">Tạo assignment</button>
            </>
          }
        />

        <AdminFilterToolbar
          sticky
          searchPlaceholder="Tìm theo tiêu đề, mã lớp hoặc mã bài"
          searchValue={model.filters.search}
          onSearchChange={(value) => model.setQuery({ search: value, page: 1 })}
          selects={[
            {
              id: 'classId',
              label: 'Lớp',
              value: model.filters.classId,
              options: adminAssignmentClassOptions,
              onChange: (value) => model.setQuery({ classId: value, page: 1 }),
            },
            {
              id: 'lecturerId',
              label: 'Giảng viên',
              value: model.filters.lecturerId,
              options: adminAssignmentLecturerOptions,
              onChange: (value) => model.setQuery({ lecturerId: value, page: 1 }),
            },
            {
              id: 'status',
              label: 'Trạng thái',
              value: model.filters.status,
              options: adminAssignmentStatusOptions,
              onChange: (value) => model.setQuery({ status: value, page: 1 }),
            },
          ]}
          textFilters={[
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
          sortOptions={adminAssignmentSortOptions}
          sortValue={model.filters.sort}
          onSortChange={(value) => model.setQuery({ sort: value })}
          onReset={() =>
            model.setQuery({
              search: '',
              classId: 'all',
              lecturerId: 'all',
              status: 'all',
              dateFrom: '',
              dateTo: '',
              sort: 'deadline',
              page: 1,
              pageSize: 20,
              detailId: '',
            })
          }
          rightSlot={<span className="admin-filter-hint">Tổng {model.pagination.total} assignment</span>}
        />

        {selectedIds.length ? (
          <AdminBulkActionBar selectedCount={selectedIds.length} actions={bulkActions} onClear={() => setSelectedIds([])} />
        ) : null}

        {model.state === 'loading' ? <AdminTableSkeleton rows={6} columns={8} /> : null}
        {model.state === 'error' ? <ErrorState description={model.errorMessage ?? 'Không thể tải dữ liệu.'} /> : null}
        {model.state === 'empty' ? (
          <EmptyState title="Chưa có assignment" description="Danh sách assignment sẽ hiển thị khi có dữ liệu." />
        ) : null}

        {model.state === 'ready' ? (
          <AdminTableShell
            selectable
            allSelected={allSelected}
            onToggleAll={() => setSelectedIds(allSelected ? [] : model.rows.map((row) => row.id))}
            columns={[
              { id: 'id', label: 'Mã bài' },
              { id: 'title', label: 'Tiêu đề' },
              { id: 'class', label: 'Lớp' },
              { id: 'lecturer', label: 'Giảng viên' },
              { id: 'deadline', label: 'Deadline' },
              { id: 'status', label: 'Trạng thái' },
              { id: 'students', label: 'Tổng SV' },
              { id: 'submissions', label: 'Đã nộp' },
              { id: 'rate', label: 'Tỷ lệ' },
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
                <td>{row.id}</td>
                <td>{row.title}</td>
                <td>{row.classLabel}</td>
                <td>{row.lecturerName}</td>
                <td>{row.dueAtLabel}</td>
                <td>
                  <StatusBadge
                    label={row.statusLabel}
                    tone={row.status === 'overdue' ? 'warning' : row.status === 'open' ? 'success' : row.status === 'draft' ? 'neutral' : 'info'}
                  />
                </td>
                <td>{row.studentCountLabel}</td>
                <td>{row.submissionsLabel}</td>
                <td>{row.submissionRateLabel}</td>
                <td>
                  <AdminRowActions
                    actions={[
                      { id: 'detail', label: 'Chi tiết', href: row.detailHref },
                      { id: 'submissions', label: 'Bài nộp' },
                      { id: 'close', label: 'Đóng' },
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
