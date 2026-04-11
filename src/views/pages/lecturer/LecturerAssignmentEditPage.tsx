import type { DataState } from '../../../models/shared/portal.types'
import { useLecturerAssignmentEditController } from '../../../controllers/lecturer/useLecturerAssignmentEditController'
import { LecturerAssignmentWizard } from '../../components/lecturer/LecturerAssignmentWizard'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { LoadingState } from '../../components/shared/LoadingState'
import { LecturerPortalLayout } from '../../layouts/LecturerPortalLayout'

type LecturerAssignmentEditPageProps = {
  dataState: DataState
  assignmentId?: string
}

export function LecturerAssignmentEditPage({ dataState, assignmentId }: LecturerAssignmentEditPageProps) {
  const model = useLecturerAssignmentEditController(assignmentId, dataState)

  if (model.state === 'loading') {
    return (
      <LecturerPortalLayout frame={model.frame}>
        <LoadingState description="Đang tải bài tập để chỉnh sửa." />
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

  if (model.state === 'empty' || !model.assignment) {
    return (
      <LecturerPortalLayout frame={model.frame}>
        <EmptyState title="Không tìm thấy bài tập" description="Vui lòng chọn lại bài tập cần chỉnh sửa." />
      </LecturerPortalLayout>
    )
  }

  const initialDraft = {
    classId: model.assignment.classId,
    title: model.assignment.title,
    description: model.assignment.description,
    dueAt: model.assignment.dueAt.slice(0, 16),
    maxScore: model.assignment.maxScore,
    rubricTemplateId: model.rubricTemplates[0]?.id ?? '',
    allowLatePolicy: model.assignment.allowLateSubmission ? 'late-10' : 'no-late',
    submissionFormats: model.assignment.allowedSubmissionFormats.join(', '),
    maxFileSize: '20MB',
    resubmissionPolicy: model.assignment.allowLateSubmission ? 'once' : 'none',
    studentInstruction: 'Sinh viên nộp bài đúng hạn và mô tả rõ nội dung bài làm.',
    attachmentNote: '',
  }

  return (
    <LecturerPortalLayout frame={model.frame}>
      <LecturerAssignmentWizard
        mode="edit"
        classOptions={model.classOptions}
        rubricTemplates={model.rubricTemplates}
        questionDrafts={model.assignment.questions.map((question) => ({
          id: question.id,
          order: question.order,
          prompt: question.prompt,
          rubricNote: question.rubric[0]?.detail ?? '',
          maxScore: question.rubric.reduce((sum, item) => sum + item.maxScore, 0),
        }))}
        initialDraft={initialDraft}
      />
    </LecturerPortalLayout>
  )
}
