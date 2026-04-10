import { useEffect, useMemo, useState } from 'react'
import type { DataState } from '../../../models/shared/portal.types'
import { adminUserRoleOptions, adminUserSortOptions, adminUserStatusOptions, useAdminUsersController } from '../../../controllers/admin/useAdminUsersController'
import { AdminBulkActionBar } from '../../components/admin/AdminBulkActionBar'
import { AdminDetailPanel } from '../../components/admin/AdminDetailPanel'
import { AdminFilterToolbar } from '../../components/admin/AdminFilterToolbar'
import { AdminPaginationBar } from '../../components/admin/AdminPaginationBar'
import { AdminRowActions } from '../../components/admin/AdminRowActions'
import { AdminTableShell } from '../../components/admin/AdminTableShell'
import { AdminTableSkeleton } from '../../components/admin/AdminTableSkeleton'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { MetricBar } from '../../components/shared/MetricBar'
import { RoleBadge } from '../../components/shared/RoleBadge'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { AdminPortalLayout } from '../../layouts/AdminPortalLayout'

type AdminUsersPageProps = {
  dataState: DataState
}

export function AdminUsersPage({ dataState }: AdminUsersPageProps) {
  const model = useAdminUsersController(dataState)
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  useEffect(() => {
    setSelectedIds([])
  }, [model.rows])

  const allSelected = model.rows.length > 0 && selectedIds.length === model.rows.length

  const bulkActions = useMemo(
    () => [
      { id: 'role', label: 'Đổi vai trò', onClick: () => {} },
      { id: 'lock', label: 'Khóa tài khoản', tone: 'danger' as const, onClick: () => {} },
      { id: 'export', label: 'Export danh sách', onClick: () => {} },
    ],
    [],
  )

  return (
    <AdminPortalLayout frame={model.frame}>
      <div className="page-title-bar">
        <h1>Quản trị tài khoản</h1>
        <div className="page-title-bar-actions">
          <button className="portal-outline-button">Import</button>
          <button className="portal-outline-button">Export</button>
          <button className="portal-primary-button">Thêm người dùng</button>
        </div>
      </div>

      <div className="student-page-body portal-page-transition">
        <MetricBar items={model.stats} />

        <AdminFilterToolbar
          sticky
          searchPlaceholder="Tìm theo mã user, họ tên hoặc email"
          searchValue={model.filters.search}
          onSearchChange={(value) => model.setQuery({ search: value, page: 1 })}
          selects={[
            {
              id: 'role',
              label: 'Vai trò',
              value: model.filters.role,
              options: adminUserRoleOptions,
              onChange: (value) => model.setQuery({ role: value, page: 1 }),
            },
            {
              id: 'status',
              label: 'Trạng thái',
              value: model.filters.status,
              options: adminUserStatusOptions,
              onChange: (value) => model.setQuery({ status: value, page: 1 }),
            },
          ]}
          sortOptions={adminUserSortOptions}
          sortValue={model.filters.sort}
          onSortChange={(value) => model.setQuery({ sort: value })}
          onReset={() =>
            model.setQuery({
              search: '',
              role: 'all',
              status: 'all',
              sort: 'recent',
              page: 1,
              pageSize: 20,
              detailId: '',
            })
          }
          rightSlot={<span className="admin-filter-hint">Tổng {model.pagination.total} tài khoản</span>}
        />

        {selectedIds.length ? (
          <AdminBulkActionBar selectedCount={selectedIds.length} actions={bulkActions} onClear={() => setSelectedIds([])} />
        ) : null}

        {model.state === 'loading' ? <AdminTableSkeleton rows={6} columns={7} /> : null}
        {model.state === 'error' ? <ErrorState description={model.errorMessage ?? 'Không thể tải dữ liệu.'} /> : null}
        {model.state === 'empty' ? (
          <EmptyState title="Chưa có người dùng" description="Danh sách sẽ hiển thị khi có dữ liệu." />
        ) : null}

        {model.state === 'ready' ? (
          <AdminTableShell
            selectable
            allSelected={allSelected}
            onToggleAll={() => setSelectedIds(allSelected ? [] : model.rows.map((row) => row.id))}
            columns={[
              { id: 'id', label: 'Mã user' },
              { id: 'name', label: 'Họ tên' },
              { id: 'email', label: 'Email' },
              { id: 'role', label: 'Vai trò' },
              { id: 'status', label: 'Trạng thái' },
              { id: 'unit', label: 'Đơn vị' },
              { id: 'lastLogin', label: 'Đăng nhập gần nhất' },
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
                <td>{row.id}</td>
                <td><strong style={{ fontSize: '13px' }}>{row.fullName}</strong></td>
                <td>{row.email}</td>
                <td><RoleBadge label={row.roleLabel} tone={row.roleTone} /></td>
                <td><StatusBadge label={row.statusLabel} tone={row.statusTone} /></td>
                <td>{row.unitLabel}</td>
                <td>{row.lastLoginLabel}</td>
                <td>
                  <AdminRowActions
                    actions={[
                      { id: 'detail', label: 'Chi tiết', href: row.detailHref },
                      { id: 'edit', label: 'Sửa' },
                      { id: 'lock', label: 'Khóa' },
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
