import type { DataState } from '../../../models/shared/portal.types'
import type { ClassDetailTab } from '../../../models/student/student.types'
import { useStudentClassDetailController } from '../../../controllers/student/useStudentClassesController'
import { EmptyState } from '../../components/shared/EmptyState'
import { LoadingState } from '../../components/shared/LoadingState'
import { PageSection } from '../../components/shared/PageSection'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

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
        <div className="student-detail-grid">
          <div className="student-detail-main">
            {activeTab === 'overview' ? (
              <PageSection title="Tổng quan học phần" kicker={model.classSummary.code} description={model.classSummary.overview}>
                <div className="class-overview-grid">
                  <article>
                    <h3>Giảng viên phụ trách</h3>
                    <p>{model.classSummary.lecturerName}</p>
                    <span>{model.classSummary.lecturerEmail}</span>
                  </article>
                  <article>
                    <h3>Thông tin lịch học</h3>
                    <p>{model.classSummary.schedule}</p>
                    <span>{model.classSummary.room}</span>
                  </article>
                  <article>
                    <h3>Học kỳ</h3>
                    <p>{model.classSummary.semester}</p>
                    <span>{model.classSummary.progressLabel}</span>
                  </article>
                  <article>
                    <h3>Bài tập đang mở</h3>
                    <p>{model.classSummary.openAssignmentsLabel}</p>
                    <span>Tiến độ được cập nhật theo từng bài nộp.</span>
                  </article>
                </div>
              </PageSection>
            ) : null}

            {activeTab === 'assignments' ? (
              <PageSection title="Bài tập trong lớp" kicker="Theo dõi học phần" description="Danh sách bài tập thuộc học phần hiện tại.">
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
                          <StatusBadge label={item.gradingLabel} tone={item.gradingTone} />
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
              <PageSection title="Kết quả theo lớp" kicker="Kết quả học tập" description="Các bài đã công bố điểm trong học phần hiện tại.">
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
              <PageSection title="Thông báo lớp học" kicker="Thông tin từ giảng viên" description="Các lưu ý mới nhất liên quan đến deadline, rubric và kết quả học tập.">
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
          </div>

          <aside className="portal-aside-stack">
            <section className="portal-aside-card">
              <header>
                <h3>Thông tin lớp</h3>
              </header>
              <dl className="info-pair-list">
                <div>
                  <dt>Mã lớp</dt>
                  <dd>{model.classSummary.code}</dd>
                </div>
                <div>
                  <dt>Giảng viên</dt>
                  <dd>{model.classSummary.lecturerName}</dd>
                </div>
                <div>
                  <dt>Tiến độ</dt>
                  <dd>{model.classSummary.progressLabel}</dd>
                </div>
                <div>
                  <dt>Bài mở</dt>
                  <dd>{model.classSummary.openAssignmentsLabel}</dd>
                </div>
              </dl>
            </section>
          </aside>
        </div>
      ) : null}
    </StudentPortalLayout>
  )
}
