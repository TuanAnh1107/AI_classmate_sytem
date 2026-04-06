import type { DataState } from '../../../models/shared/portal.types'
import { useStudentProfileController } from '../../../controllers/student/useStudentProfileController'
import { LoadingState } from '../../components/shared/LoadingState'
import { EmptyState } from '../../components/shared/EmptyState'
import { PageSection } from '../../components/shared/PageSection'
import { StudentPortalLayout } from '../../layouts/StudentPortalLayout'

type StudentProfilePageProps = {
  dataState: DataState
}

export function StudentProfilePage({ dataState }: StudentProfilePageProps) {
  const model = useStudentProfileController(dataState)

  return (
    <StudentPortalLayout frame={model.frame}>
      {model.state === 'loading' ? <LoadingState description="Đang tải hồ sơ sinh viên." /> : null}
      {model.state === 'error' ? <div className="portal-inline-error">{model.errorMessage}</div> : null}
      {model.state === 'empty' ? (
        <EmptyState title="Chưa có hồ sơ" description="Hệ thống chưa ghi nhận dữ liệu hồ sơ cho sinh viên này." />
      ) : null}

      {model.state === 'ready' && model.profile ? (
        <div className="student-detail-grid">
          <div className="student-detail-main">
            <PageSection
              title="Thông tin sinh viên"
              kicker="Hồ sơ cá nhân"
              description="Các thông tin định danh và liên hệ được liên thông từ cổng dữ liệu học vụ."
            >
              <dl className="info-pair-list">
                {model.identityPairs.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </PageSection>

            <PageSection
              title="Thông tin học vụ"
              kicker="Chương trình đào tạo"
              description="Dữ liệu phục vụ theo dõi lớp học, bài tập và kết quả học tập."
            >
              <dl className="info-pair-list">
                {model.academicPairs.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </PageSection>
          </div>

          <aside className="portal-aside-stack">
            <div className="portal-aside-card">
              <header>
                <h3>Tóm tắt học tập</h3>
                <p>Trạng thái tổng quan của học kỳ hiện tại.</p>
              </header>
              <dl className="info-pair-list">
                {model.summaryPairs.map((item) => (
                  <div key={item.label}>
                    <dt>{item.label}</dt>
                    <dd>{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="portal-aside-card">
              <header>
                <h3>Liên hệ hỗ trợ</h3>
                <p>Kênh tiếp nhận yêu cầu chính thức.</p>
              </header>
              <ul className="aside-link-list">
                <li>
                  <a href="?portal=student&page=dashboard#huong-dan">Trung tâm hỗ trợ</a>
                  <span>Tra cứu hướng dẫn sử dụng và quy định.</span>
                </li>
                <li>
                  <a href="?portal=student&page=dashboard#huong-dan">Gửi yêu cầu hỗ trợ</a>
                  <span>Liên hệ bộ phận quản trị hệ thống.</span>
                </li>
                <li>
                  <a href="?portal=student&page=dashboard#huong-dan">Câu hỏi thường gặp</a>
                  <span>Những tình huống phổ biến khi học tập.</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      ) : null}
    </StudentPortalLayout>
  )
}
