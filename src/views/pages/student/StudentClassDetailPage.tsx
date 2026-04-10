import type { DataState } from '../../../models/shared/portal.types'
import { useStudentClassDetailController } from '../../../controllers/student/useStudentClassesController'
import { DisclosureSection } from '../../components/shared/DisclosureSection'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'
import { PageSection } from '../../components/shared/PageSection'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'
import type { ClassDetailTab } from '../../../models/student/student.types'

type StudentClassDetailPageProps = {
  dataState: DataState
  classId?: string
  activeTab: ClassDetailTab
}

export function StudentClassDetailPage({ dataState, classId, activeTab }: StudentClassDetailPageProps) {
  const model = useStudentClassDetailController(classId, activeTab, dataState)

  return (
    <StudentPortalLayout frame={model.frame}>
      {model.state === 'loading' ? <LoadingState description="Đang tải thông tin học phần và các dữ liệu liên quan." /> : null}
      {model.state === 'error' ? <div className="portal-inline-error">{model.errorMessage}</div> : null}

      {model.classSummary && model.state !== 'loading' && model.state !== 'error' ? (
        <section className="student-page-body portal-page-transition">
          {activeTab === 'overview' ? (
            <PageSection title="Tổng quan học phần" kicker={model.classSummary.code} description={model.classSummary.overview}>
              <div className="student-summary-strip">
                <article className="student-summary-card">
                  <span>Giảng viên</span>
                  <strong>{model.classSummary.lecturerName}</strong>
                </article>
                <article className="student-summary-card">
                  <span>Học kỳ</span>
                  <strong>{model.classSummary.semester}</strong>
                </article>
                <article className="student-summary-card">
                  <span>Bài đang mở</span>
                  <strong>{model.classSummary.openAssignmentsLabel}</strong>
                </article>
              </div>

              <DisclosureSection
                title="Thông tin lớp học"
                kicker="Shared details"
                description="Ẩn mặc định để overview giữ được nhịp đọc gọn: summary trước, chi tiết phụ sau."
                className="assignment-inline-disclosure"
              >
                <dl className="info-pair-list">
                  <div>
                    <dt>Lịch học</dt>
                    <dd>{model.classSummary.schedule}</dd>
                  </div>
                  <div>
                    <dt>Phòng học</dt>
                    <dd>{model.classSummary.room}</dd>
                  </div>
                  <div>
                    <dt>Tiến độ</dt>
                    <dd>{model.classSummary.progressLabel}</dd>
                  </div>
                  <div>
                    <dt>Email giảng viên</dt>
                    <dd>{model.classSummary.lecturerEmail}</dd>
                  </div>
                </dl>
              </DisclosureSection>
            </PageSection>
          ) : null}

          {activeTab === 'assignments' ? (
            <PageSection title="Bài tập trong lớp" kicker="Theo dõi học phần" description="Danh sách rút gọn để bạn quét nhanh trạng thái rồi mở đúng bài cần xử lý.">
              {model.assignments.length ? (
                <div className="portal-list-block compact">
                  {model.assignments.map((item) => (
                    <article key={item.id} className="portal-list-item compact">
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.deadlineLabel}</p>
                      </div>
                      <div className="portal-list-statuses">
                        <StatusBadge label={item.submissionLabel} tone={item.submissionTone} />
                        <a href={item.href}>Mở bài tập</a>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState title="Chưa có bài tập nào" description="Khi giảng viên mở bài mới, danh sách sẽ hiển thị tại đây." />
              )}
            </PageSection>
          ) : null}

          {activeTab === 'results' ? (
            <PageSection title="Kết quả theo lớp" kicker="Kết quả học tập" description="Chỉ giữ thông tin cốt lõi: bài nào đã có điểm và có phản hồi mới hay chưa.">
              {model.results.length ? (
                <div className="portal-list-block compact">
                  {model.results.map((item) => (
                    <article key={item.id} className="portal-list-item compact">
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.updatedAtLabel}</p>
                      </div>
                      <div className="portal-list-statuses">
                        <strong>{item.scoreLabel}</strong>
                        <StatusBadge label={item.feedbackLabel} tone={item.feedbackTone} />
                        <a href={item.href}>Xem kết quả</a>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState title="Chưa có kết quả nào" description="Điểm số xuất hiện khi giảng viên công bố kết quả cho lớp học này." />
              )}
            </PageSection>
          ) : null}

          {activeTab === 'announcements' ? (
            <PageSection title="Thông báo lớp học" kicker="Thông tin từ giảng viên" description="Chỉ hiển thị thông báo theo dạng tóm tắt để bạn đọc nhanh và không bị ngợp.">
              {model.announcements.length ? (
                <div className="portal-list-block compact">
                  {model.announcements.map((item) => (
                    <article key={item.id} className="portal-list-item compact">
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.summary}</p>
                      </div>
                      <div className="portal-list-meta">
                        <span>{item.postedAtLabel}</span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState title="Chưa có thông báo nào" description="Thông báo của giảng viên cho học phần sẽ được cập nhật tại đây." />
              )}
            </PageSection>
          ) : null}
        </section>
      ) : null}
    </StudentPortalLayout>
  )
}
