import { useEffect, useMemo, useState } from 'react'
import type { DataState } from '../../../models/shared/portal.types'
import {
  adminClassLecturerOptions,
  adminClassSortOptions,
  adminClassStatusOptions,
  useAdminClassesController,
} from '../../../controllers/admin/useAdminClassesController'
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

type AdminClassesPageProps = {
  dataState: DataState
}

export function AdminClassesPage({ dataState }: AdminClassesPageProps) {
  const model = useAdminClassesController(dataState)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    setSelectedIds([])
  }, [model.rows])

  const allSelected = model.rows.length > 0 && selectedIds.length === model.rows.length

  const bulkActions = useMemo(
    () => [
      { id: 'export', label: 'Export danh sách', onClick: () => {} },
      { id: 'assign', label: 'Phân công giảng viên', onClick: () => {} },
    ],
    [],
  )

  return (
    <AdminPortalLayout frame={model.frame}>
      <div className="page-workspace">
        <InfoHeader
          title="Quản lý lớp học"
          stats={model.stats.map((s) => ({ label: s.label, value: s.value }))}
          actions={
            <>
              <button className="portal-outline-button">Phân công giảng viên</button>
              <button className="portal-primary-button">Tạo lớp</button>
            </>
          }
        />

        <AdminFilterToolbar
          sticky
          searchPlaceholder="Tìm theo mã lớp, tên lớp hoặc giảng viên"
          searchValue={model.filters.search}
          onSearchChange={(value) => model.setQuery({ search: value, page: 1 })}
          selects={[
            {
              id: 'status',
              label: 'Trạng thái',
              value: model.filters.status,
              options: adminClassStatusOptions,
              onChange: (value) => model.setQuery({ status: value, page: 1 }),
            },
            {
              id: 'lecturerId',
              label: 'Giảng viên',
              value: model.filters.lecturerId,
              options: adminClassLecturerOptions,
              onChange: (value) => model.setQuery({ lecturerId: value, page: 1 }),
            },
          ]}
          sortOptions={adminClassSortOptions}
          sortValue={model.filters.sort}
          onSortChange={(value) => model.setQuery({ sort: value })}
          onReset={() =>
            model.setQuery({
              search: '',
              semester: 'all',
              status: 'all',
              lecturerId: 'all',
              sort: 'recent',
              page: 1,
              pageSize: 20,
              detailId: '',
            })
          }
          rightSlot={<span className="admin-filter-hint">Tổng {model.pagination.total} lớp</span>}
        />

        {selectedIds.length ? (
          <AdminBulkActionBar selectedCount={selectedIds.length} actions={bulkActions} onClear={() => setSelectedIds([])} />
        ) : null}

        {model.state === 'loading' ? <AdminTableSkeleton rows={6} columns={7} /> : null}
        {model.state === 'error' ? <ErrorState description={model.errorMessage ?? 'Không thể tải dữ liệu.'} /> : null}
        {model.state === 'empty' ? (
          <EmptyState title="Chưa có lớp học" description="Danh sách lớp sẽ hiển thị khi có dữ liệu." />
        ) : null}

        {model.state === 'ready' ? (
          <AdminTableShell
            selectable
            allSelected={allSelected}
            onToggleAll={() => setSelectedIds(allSelected ? [] : model.rows.map((row) => row.id))}
            columns={[
              { id: 'code', label: 'Mã lớp' },
              { id: 'name', label: 'Tên lớp' },
              { id: 'semester', label: 'Học kỳ' },
              { id: 'lecturer', label: 'Giảng viên' },
              { id: 'students', label: 'Sĩ số' },
              { id: 'assignments', label: 'Bài tập' },
              { id: 'submissionRate', label: 'Tỷ lệ nộp' },
              { id: 'status', label: 'Trạng thái' },
              { id: 'actions', label: '' },
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
                <td>{row.code}</td>
                <td><strong style={{ fontSize: '13px' }}>{row.name}</strong></td>
                <td>{row.semester}</td>
                <td>{row.lecturerName}</td>
                <td>{row.studentCountLabel}</td>
                <td>{row.assignmentCountLabel}</td>
                <td>{row.submissionRateLabel}</td>
                <td><StatusBadge label={row.statusLabel} tone={row.status === 'active' ? 'success' : 'warning'} /></td>
                <td>
                  <AdminRowActions
                    actions={[
                      { id: 'detail', label: 'Chi tiết', href: row.detailHref },
                      { id: 'roster', label: 'Roster' },
                      { id: 'assignments', label: 'Assignments' },
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
