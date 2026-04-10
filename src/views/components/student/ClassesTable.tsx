import type { StudentClassRow } from '../../../models/student/student.types'
import { DisclosureSection } from '../shared/DisclosureSection'
import { ProgressBar } from '../shared/ProgressBar'

type ClassesTableProps = {
  rows: StudentClassRow[]
}

export function ClassesTable({ rows }: ClassesTableProps) {
  return (
    <div className="assignment-worklist">
      {rows.map((row) => (
        <article key={row.id} className="assignment-work-item assignment-work-item-compact">
          <div className="assignment-work-copy">
            <div className="assignment-work-head">
              <div>
                <p className="assignment-work-class">{row.classCode}</p>
                <h3>{row.title}</h3>
              </div>
            </div>

            <div className="assignment-work-meta">
              <span>{row.openAssignmentsLabel}</span>
            </div>
          </div>

          <div className="assignment-work-actions">
            <a className="portal-primary-button" href={row.href}>
              Vào lớp học
            </a>
          </div>

          <DisclosureSection
            title="Xem nhanh thông tin lớp"
            kicker="Chi tiết phụ"
            description="Mở khi cần xem giảng viên và tiến độ tổng quan của lớp."
            className="assignment-inline-disclosure"
          >
            <div className="portal-form-stack">
              <div className="assignment-work-meta assignment-work-meta-block">
                <span>Giảng viên: {row.lecturerName}</span>
                <span>{row.progressLabel}</span>
              </div>
              <ProgressBar value={row.progressPercent} label={row.progressLabel} />
            </div>
          </DisclosureSection>
        </article>
      ))}
    </div>
  )
}
