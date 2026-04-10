import type { DataState } from '../../../models/shared/portal.types'
import { useLecturerAssignmentCreateController } from '../../../controllers/lecturer/useLecturerAssignmentCreateController'
import { EmptyState } from '../../components/shared/EmptyState'
import { ErrorState } from '../../components/shared/ErrorState'
import { LoadingState } from '../../components/shared/LoadingState'
import { LecturerPortalLayout } from '../../layouts/LecturerPortalLayout'
import { LecturerAssignmentWizard } from '../../components/lecturer/LecturerAssignmentWizard'

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
    title: 'Bài tập 03 - Thiết kế rubric đánh giá bằng AI',
    description: 'Sinh viên thiết kế rubric đánh giá, mô tả tiêu chí và quy trình phản hồi cho lớp học.',
    dueAt: '2026-04-20T23:59',
    maxScore: 10,
    rubricTemplateId: model.rubricTemplates[0]?.id ?? '',
    allowLatePolicy: 'late-10',
    submissionFormats: 'PDF, DOCX, Link Google Drive',
    maxFileSize: '20MB',
    resubmissionPolicy: 'once',
    studentInstruction: 'Nộp bài đúng hạn và đính kèm minh chứng đầy đủ.',
    attachmentNote: '',
  }

  return (
    <LecturerPortalLayout frame={model.frame}>
      <LecturerAssignmentWizard
        mode="create"
        classOptions={model.classOptions}
        rubricTemplates={model.rubricTemplates}
        questionDrafts={model.questions}
        questionBank={model.questionBank}
        initialDraft={initialDraft}
        initialSelectedQuestionIds={model.questionBank.map((item) => item.id)}
      />
    </LecturerPortalLayout>
  )
}
