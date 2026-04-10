import type { DataState } from '../../../models/shared/portal.types'
import { useLecturerClassDetailController } from '../../../controllers/lecturer/useLecturerClassDetailController'
import { DisclosureSection } from '../../components/shared/DisclosureSection'
import { DataTable } from '../../components/shared/DataTable'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { LoadingState } from '../../components/shared/LoadingState'
import { PageSection } from '../../components/shared/PageSection'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { LecturerPortalLayout } from '../../layouts/LecturerPortalLayout'

type LecturerClassDetailPageProps = {
  dataState: DataState
  classId?: string
}

export function LecturerClassDetailPage({ dataState, classId }: LecturerClassDetailPageProps) {
  const model = useLecturerClassDetailController(classId, dataState)

  if (model.state === 'loading') {
    return (
      <LecturerPortalLayout frame={model.frame}>
        <LoadingState description="Đang tải danh sách sinh viên." />
      </LecturerPortalLayout>
    )
  }

  if (model.state === 'error') {
    return (
      <LecturerPortalLayout frame={model.frame}>
        <ErrorState description={model.errorMessage ?? 'Không thể tải dữ liệu.'} />
      </LecturerPortalLayout>
    )
  }

  if (model.state === 'empty') {
    return (
      <LecturerPortalLayout frame={model.frame}>
        <EmptyState title="Chưa có dữ liệu lớp" description="Danh sách sinh viên sẽ hiển thị tại đây." />
      </LecturerPortalLayout>
    )
  }

  return (
    <LecturerPortalLayout frame={model.frame}>
      <section className="student-page-body portal-page-transition">
        {model.activeTab === 'overview' ? (
          <PageSection
            title="Tổng quan lớp"
            kicker={model.classTitle ?? 'Lớp phụ trách'}
            description="Mở lớp ở trạng thái thật gọn: chỉ summary quan trọng hiện trước, chi tiết vận hành mở sau."
          >
            <div className="student-summary-strip">
              <article className="student-summary-card">
                <span>Giảng viên</span>
                <strong>{model.overview?.lecturerName}</strong>
              </article>
              <article className="student-summary-card">
                <span>Học kỳ</span>
                <strong>{model.overview?.semester}</strong>
              </article>
              <article className="student-summary-card">
                <span>Sĩ số</span>
                <strong>{model.overview?.totalStudents}</strong>
              </article>
              <article className="student-summary-card">
                <span>Chờ chấm</span>
                <strong>{model.overview?.pendingGrading}</strong>
              </article>
            </div>

            <DisclosureSection
              title="Chỉ số lớp học"
              kicker="Thông tin phụ"
              description="Ẩn phần này theo mặc định để tab tổng quan giữ được một vùng tập trung rõ hơn."
              className="assignment-inline-disclosure"
            >
              <div className="assignment-review-grid">
                <div className="assignment-review-item">
                  <span>Bài tập đang mở</span>
                  <strong>{model.overview?.openAssignments}</strong>
                </div>
                <div className="assignment-review-item">
                  <span>Bài cần chấm</span>
                  <strong>{model.overview?.pendingGrading}</strong>
                </div>
              </div>
            </DisclosureSection>
          </PageSection>
        ) : null}

        {model.activeTab === 'roster' ? (
          <PageSection
            title="Sinh viên trong lớp"
            kicker={model.classTitle ?? 'Lớp phụ trách'}
            description="Giữ danh sách lớp ở dạng scan nhanh: chỉ lộ trạng thái nộp bài summary, không phơi sâu mọi chi tiết từng sinh viên."
          >
            <DataTable headers={['Mã sinh viên', 'Họ tên', 'Đã nộp', 'Nộp trễ']}>
              {model.students.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.fullName}</td>
                  <td>{row.submittedLabel}</td>
                  <td>{row.lateLabel}</td>
                </tr>
              ))}
            </DataTable>
          </PageSection>
        ) : null}

        {model.activeTab === 'assignments' ? (
          <PageSection
            title="Bài tập trong lớp"
            kicker={model.classTitle ?? 'Lớp phụ trách'}
            description="Chỉ hiện bảng bài tập đang hoạt động trước. Nhóm quá hạn được đưa vào disclosure riêng."
          >
            <section className="portal-form-card">
              <header className="portal-form-card-head">
                <div>
                  <p className="portal-form-kicker">Đang mở</p>
                  <h3>Bài tập đang hoạt động</h3>
                </div>
              </header>

              <DataTable headers={['Bài tập', 'Hạn nộp', 'Đã nộp', 'Trạng thái']}>
                {model.activeAssignments.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <a className="portal-table-title-link" href={row.href}>
                        {row.title}
                      </a>
                    </td>
                    <td>{row.dueAtLabel}</td>
                    <td>{row.submittedLabel}</td>
                    <td>
                      <StatusBadge label={row.statusLabel} tone={row.statusTone} />
                    </td>
                  </tr>
                ))}
              </DataTable>
            </section>

            <DisclosureSection
              title="Bài tập quá hạn"
              kicker="Cần chú ý"
              description="Chỉ mở khi bạn cần xử lý riêng nhóm bài tập đã quá hạn."
              className="assignment-inline-disclosure"
              summary={<StatusBadge label={`${model.overdueAssignments.length} bài`} tone={model.overdueAssignments.length ? 'warning' : 'neutral'} />}
            >
              {model.overdueAssignments.length ? (
                <DataTable headers={['Bài tập', 'Hạn nộp', 'Đã nộp', 'Trạng thái']}>
                  {model.overdueAssignments.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <a className="portal-table-title-link" href={row.href}>
                          {row.title}
                        </a>
                      </td>
                      <td>{row.dueAtLabel}</td>
                      <td>{row.submittedLabel}</td>
                      <td>
                        <StatusBadge label={row.statusLabel} tone={row.statusTone} />
                      </td>
                    </tr>
                  ))}
                </DataTable>
              ) : (
                <EmptyState title="Không có bài tập quá hạn" description="Toàn bộ bài tập của lớp hiện vẫn trong ngưỡng an toàn." />
              )}
            </DisclosureSection>
          </PageSection>
        ) : null}

        {model.activeTab === 'stats' ? (
          <PageSection
            title="Thống kê lớp"
            kicker={model.classTitle ?? 'Lớp phụ trách'}
            description="Tổng hợp ngắn gọn các chỉ số để giảng viên nắm tình hình mà không phải mở nhiều panel cùng lúc."
          >
            <div className="student-summary-strip">
              <article className="student-summary-card">
                <span>Sinh viên</span>
                <strong>{model.overview?.totalStudents}</strong>
              </article>
              <article className="student-summary-card">
                <span>Bài tập đang mở</span>
                <strong>{model.overview?.openAssignments}</strong>
              </article>
              <article className="student-summary-card">
                <span>Bài cần chấm</span>
                <strong>{model.overview?.pendingGrading}</strong>
              </article>
            </div>
          </PageSection>
        ) : null}
      </section>
    </LecturerPortalLayout>
  )
}
