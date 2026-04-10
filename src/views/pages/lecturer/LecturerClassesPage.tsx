import type { DataState } from '../../../models/shared/portal.types'
import { lecturerClassSortOptions, useLecturerClassesController } from '../../../controllers/lecturer/useLecturerClassesController'
import { LecturerFilterToolbar } from '../../components/lecturer/LecturerFilterToolbar'
import { LecturerPaginationBar } from '../../components/lecturer/LecturerPaginationBar'
import { LecturerStatsRow } from '../../components/lecturer/LecturerStatsRow'
import { DisclosureSection } from '../../components/shared/DisclosureSection'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { LoadingTable } from '../../components/shared/LoadingTable'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { LecturerPortalLayout } from '../../layouts/LecturerPortalLayout'

type LecturerClassesPageProps = {
  dataState: DataState
}

export function LecturerClassesPage({ dataState }: LecturerClassesPageProps) {
  const model = useLecturerClassesController(dataState)

  return (
    <LecturerPortalLayout frame={model.frame}>
      <section className="student-page-body">
        <div className="workflow-command-bar">
          <div className="workflow-command-copy">
            <p className="portal-page-kicker">Lớp phụ trách</p>
            <h2>Quét lớp theo mức độ cần chú ý</h2>
            <p>
              Mỗi lớp chỉ hiển thị tóm tắt vận hành trước. Tỷ lệ nộp, lượng bài chờ chấm và nhánh thao tác phụ được ẩn phía sau
              để màn làm việc luôn nhẹ mắt và dễ quét hơn.
            </p>
          </div>

          <div className="workflow-command-actions portal-button-row">
            <a className="portal-outline-button" href="?portal=lecturer&page=submission-list">
              Mở hàng chấm
            </a>
            <a className="portal-primary-button" href="?portal=lecturer&page=assignment-create">
              Tạo bài tập
            </a>
          </div>
        </div>

        <LecturerStatsRow items={model.stats} />

        <LecturerFilterToolbar
          sticky
          searchPlaceholder="Tìm theo mã lớp hoặc tên lớp"
          searchValue={model.filters.search}
          onSearchChange={(value) => model.setQuery({ search: value, page: 1 })}
          selects={[
            {
              id: 'semester',
              label: 'Học kỳ',
              value: model.filters.semester,
              options: [
                { value: 'all', label: 'Tất cả học kỳ' },
                { value: '2026-1', label: '2026-1' },
                { value: '2025-2', label: '2025-2' },
              ],
              onChange: (value) => model.setQuery({ semester: value, page: 1 }),
            },
            {
              id: 'status',
              label: 'Trạng thái',
              value: model.filters.status,
              options: [
                { value: 'all', label: 'Tất cả' },
                { value: 'attention', label: 'Cần chú ý' },
                { value: 'stable', label: 'Ổn định' },
              ],
              onChange: (value) => model.setQuery({ status: value, page: 1 }),
            },
          ]}
          sortOptions={lecturerClassSortOptions}
          sortValue={model.filters.sort}
          onSortChange={(value) => model.setQuery({ sort: value })}
          onReset={() => model.setQuery({ search: '', semester: 'all', status: 'all', sort: 'attention', page: 1, pageSize: 20 })}
          rightSlot={<span className="admin-filter-hint">Tổng {model.pagination.total} lớp</span>}
        />

        {model.state === 'loading' ? <LoadingTable columns={4} /> : null}
        {model.state === 'error' ? <ErrorState description={model.errorMessage ?? 'Không thể tải dữ liệu.'} /> : null}
        {model.state === 'empty' ? (
          <EmptyState title="Chưa có lớp phụ trách" description="Bạn chưa được phân công lớp nào trong học kỳ hiện tại." />
        ) : null}

        {model.state === 'ready' ? (
          <div className="assignment-worklist lecturer-class-worklist">
            {model.rows.map((row) => (
              <article key={row.id} className="assignment-work-item assignment-work-item-compact lecturer-class-item">
                <div className="assignment-work-copy">
                  <div className="assignment-work-head">
                    <div>
                      <p className="assignment-work-class">{row.semester}</p>
                      <h3>
                        {row.code} · {row.name}
                      </h3>
                    </div>
                    <StatusBadge label={row.attentionLabel} tone={row.attentionTone} />
                  </div>

                  <div className="assignment-work-meta assignment-work-meta-block">
                    <span>{row.studentCountLabel}</span>
                    <span>{row.openAssignmentsLabel}</span>
                  </div>
                </div>

                <div className="assignment-work-actions">
                  <a className="portal-primary-button" href={`?portal=lecturer&page=submission-list&classId=${row.id}`}>
                    Hàng chấm lớp
                  </a>
                </div>

                <DisclosureSection
                  title="Xem thêm về lớp này"
                  kicker="Thông tin phụ"
                  description="Mở khi cần tỷ lệ nộp, lượng bài chờ chấm hoặc các lối vào phụ như danh sách lớp và bài tập."
                  className="assignment-inline-disclosure"
                >
                  <div className="assignment-work-meta assignment-work-meta-block">
                    <span>{row.pendingGradeLabel}</span>
                    <StatusBadge label={row.coverageLabel} tone={row.coverageTone} />
                  </div>
                  <div className="assignment-work-actions assignment-work-actions-inline">
                    <a className="portal-outline-button" href={`${row.href}&tab=roster`}>
                      Danh sách lớp
                    </a>
                    <a className="portal-outline-button" href={`?portal=lecturer&page=assignments&classId=${row.id}`}>
                      Bài tập
                    </a>
                  </div>
                </DisclosureSection>
              </article>
            ))}
          </div>
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

