import { useMemo, useState } from 'react'
import type { DataState, StatusTone } from '../../../models/shared/portal.types'
import { useLecturerAssignmentDetailController } from '../../../controllers/lecturer/useLecturerAssignmentDetailController'
import { buildLecturerPortalHref } from '../../../models/lecturer/lecturer.mappers'
import { CollapsibleSection } from '../../components/shared/CollapsibleSection'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { InfoHeader } from '../../components/shared/InfoHeader'
import { LoadingState } from '../../components/shared/LoadingState'
import { PortalSectionTabs } from '../../components/shared/PortalSectionTabs'
import { StatusBadge } from '../../components/shared/StatusBadge'
import { LecturerPortalLayout } from '../../layouts/LecturerPortalLayout'

type LecturerAssignmentDetailPageProps = {
  dataState: DataState
  assignmentId?: string
}

type TabId = 'submitted' | 'missing'

function getAssignmentStatusMeta(status: 'draft' | 'published' | 'closed'): { label: string; tone: StatusTone } {
  switch (status) {
    case 'draft':
      return { label: 'Nháp', tone: 'neutral' }
    case 'closed':
      return { label: 'Đã đóng', tone: 'neutral' }
    case 'published':
    default:
      return { label: 'Đang mở', tone: 'success' }
  }
}

export function LecturerAssignmentDetailPage({ dataState, assignmentId }: LecturerAssignmentDetailPageProps) {
  const model = useLecturerAssignmentDetailController(assignmentId, dataState)
  const [activeTab, setActiveTab] = useState<TabId>('submitted')

  const tabs = useMemo(
    () => [
      { id: 'submitted', label: 'Đã nộp', countLabel: String(model.submittedStudents.length) },
      { id: 'missing', label: 'Chưa nộp', countLabel: String(model.missingStudents.length) },
    ],
    [model.submittedStudents.length, model.missingStudents.length],
  )

  if (model.state === 'loading') {
    return (
      <LecturerPortalLayout frame={model.frame}>
        <LoadingState description="Đang tải chi tiết bài tập." />
      </LecturerPortalLayout>
    )
  }

  if (model.state === 'error') {
    return (
      <LecturerPortalLayout frame={model.frame}>
        <ErrorState description={model.errorMessage ?? 'Không thể tải chi tiết bài tập.'} />
      </LecturerPortalLayout>
    )
  }

  if (!model.assignment) {
    return (
      <LecturerPortalLayout frame={model.frame}>
        <EmptyState title="Không tìm thấy bài tập" description="Bài tập không tồn tại hoặc bạn không còn quyền truy cập." />
      </LecturerPortalLayout>
    )
  }

  const assignment = model.assignment
  const assignmentStatus = getAssignmentStatusMeta(assignment.status)

  return (
    <LecturerPortalLayout frame={model.frame}>
      <div className="page-workspace">
        <InfoHeader
          title={assignment.title}
          subtitle={model.deadlineLabel ? `Hạn nộp: ${model.deadlineLabel}` : undefined}
          badges={[{ label: assignmentStatus.label, tone: assignmentStatus.tone }]}
          stats={model.stats.map((item) => ({ label: item.label, value: item.value }))}
          actions={
            <>
              <a className="portal-outline-button" href={buildLecturerPortalHref('assignments')}>
                Quay lại danh sách
              </a>
              <a className="portal-outline-button" href={buildLecturerPortalHref('assignment-edit', { assignmentId: assignment.id })}>
                Chỉnh sửa
              </a>
              <a className="portal-primary-button" href={buildLecturerPortalHref('submission-list', { assignmentId: assignment.id })}>
                Mở hàng chấm
              </a>
            </>
          }
        />

        <section className="content-panel" style={{ padding: 0 }}>
          <div style={{ padding: '12px 16px 0' }}>
            <PortalSectionTabs items={tabs} activeId={activeTab} onChange={(id) => setActiveTab(id as TabId)} />
          </div>

          {activeTab === 'submitted' ? (
            model.submittedStudents.length ? (
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>Sinh viên</th>
                    <th>Trạng thái nộp</th>
                    <th>Số lần nộp</th>
                    <th>Điểm</th>
                    <th>Phản hồi</th>
                    <th style={{ width: 120 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {model.submittedStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <strong style={{ fontSize: 13 }}>{student.studentName}</strong>
                        <div className="compact-table-meta">{student.studentCode}</div>
                      </td>
                      <td>
                        <StatusBadge label={student.submissionLabel} tone={student.submissionTone} />
                      </td>
                      <td style={{ fontSize: 13 }}>{student.attemptsLabel}</td>
                      <td style={{ fontSize: 13, fontWeight: 600 }}>{student.scoreLabel}</td>
                      <td style={{ fontSize: 13 }}>{student.feedbackLabel}</td>
                      <td>
                        {student.href ? (
                          <a className="portal-primary-button" href={student.href}>
                            Xem bài nộp
                          </a>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: 16 }}>
                <EmptyState title="Chưa có sinh viên nộp bài" description="Danh sách sinh viên đã nộp sẽ xuất hiện tại đây." />
              </div>
            )
          ) : null}

          {activeTab === 'missing' ? (
            model.missingStudents.length ? (
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>Sinh viên</th>
                    <th>Mã sinh viên</th>
                    <th>Trạng thái</th>
                    <th>Số lần nộp</th>
                  </tr>
                </thead>
                <tbody>
                  {model.missingStudents.map((student) => (
                    <tr key={student.id}>
                      <td><strong style={{ fontSize: 13 }}>{student.studentName}</strong></td>
                      <td style={{ fontSize: 13 }}>{student.studentCode}</td>
                      <td><StatusBadge label={student.submissionLabel} tone={student.submissionTone} /></td>
                      <td style={{ fontSize: 13 }}>{student.attemptsLabel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: 16 }}>
                <EmptyState title="Tất cả sinh viên đã nộp" description="Hiện tại không còn sinh viên nào thiếu bài." />
              </div>
            )
          ) : null}
        </section>

        <CollapsibleSection title="Thông tin bài tập" defaultOpen={false}>
          <dl className="info-pair-list">
            <div>
              <dt>Lớp</dt>
              <dd>{assignment.classId.toUpperCase()}</dd>
            </div>
            <div>
              <dt>Hạn nộp</dt>
              <dd>{model.deadlineLabel ?? '--'}</dd>
            </div>
            <div>
              <dt>Điểm tối đa</dt>
              <dd>{assignment.maxScore}</dd>
            </div>
            <div>
              <dt>Số câu hỏi</dt>
              <dd>{assignment.questions.length}</dd>
            </div>
            {assignment.description ? (
              <div>
                <dt>Mô tả</dt>
                <dd style={{ textAlign: 'left' }}>{assignment.description}</dd>
              </div>
            ) : null}
          </dl>
        </CollapsibleSection>
      </div>
    </LecturerPortalLayout>
  )
}
