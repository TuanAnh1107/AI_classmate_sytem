import type { DataState } from '../../../models/shared/portal.types'
import { useLecturerAssignmentCreateController } from '../../../controllers/lecturer/useLecturerAssignmentCreateController'
import { LecturerAssignmentWizard } from '../../components/lecturer/LecturerAssignmentWizard'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { LoadingState } from '../../components/shared/LoadingState'
import { LecturerPortalLayout } from '../../layouts/LecturerPortalLayout'

type LecturerAssignmentCreatePageProps = {
  dataState: DataState
}

export function LecturerAssignmentCreatePage({ dataState }: LecturerAssignmentCreatePageProps) {
  const model = useLecturerAssignmentCreateController(dataState)

  if (model.state === 'loading') {
    return (
      <LecturerPortalLayout frame={model.frame}>
        <LoadingState description="Đang mở biểu mẫu tạo bài tập." />
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
        <EmptyState title="Chưa có dữ liệu" description="Hệ thống chưa sẵn sàng để tạo bài tập mới." />
      </LecturerPortalLayout>
    )
  }

  const initialDraft = {
    classId: model.classOptions[0]?.id ?? 'it4409',
    title: 'Bài tập mới',
    description: 'Mô tả yêu cầu bài tập và tiêu chí đánh giá cho sinh viên.',
    dueAt: '2026-04-20T23:59',
    maxScore: 10,
    rubricTemplateId: model.rubricTemplates[0]?.id ?? '',
    allowLatePolicy: 'late-10',
    submissionFormats: 'PDF, DOCX, ZIP',
    maxFileSize: '20MB',
    resubmissionPolicy: 'once',
    studentInstruction: 'Sinh viên nộp bài đúng hạn và tải đầy đủ file minh chứng.',
    attachmentNote: '',
  }

  return (
    <LecturerPortalLayout frame={model.frame}>
      <LecturerAssignmentWizard
        mode="create"
        classOptions={model.classOptions}
        rubricTemplates={model.rubricTemplates}
        questionDrafts={model.questions}
        initialDraft={initialDraft}
      />
    </LecturerPortalLayout>
  )
}
