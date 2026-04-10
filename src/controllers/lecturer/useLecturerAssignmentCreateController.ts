import type { DataState } from '../../models/shared/portal.types'
import type { LecturerPageFrame } from '../../models/lecturer/lecturer.types'
import {
  assignmentChecklistMock,
  assignmentQuestionsDraft,
  lecturerClassesMock,
  lecturerProfileMock,
  rubricTemplatesMock,
} from '../../models/lecturer/lecturer.mock'
import {
  dbContentFileQuestions,
  dbContentQuestions,
  dbInfoQuestions,
  dbRubricQuestions,
} from '../../models/db/assignmentDb.mock'
import { useLecturerPortalShellController } from './useLecturerPortalShellController'
import { formatPortalDateTime } from '../../models/student/student.mappers'

export type LecturerAssignmentCreateViewModel = {
  frame: LecturerPageFrame
  state: DataState
  classOptions: typeof lecturerClassesMock
  rubricTemplates: typeof rubricTemplatesMock
  questions: typeof assignmentQuestionsDraft
  questionBank: {
    id: string
    title: string
    preview: string
    maxScore: number
    typeGrade: string
    rubricCount: number
    fileCount: number
    ownerLabel: string
    createdAtLabel: string
  }[]
  checklist: typeof assignmentChecklistMock
  lecturerName: string
  errorMessage?: string
}

export function useLecturerAssignmentCreateController(dataState: DataState): LecturerAssignmentCreateViewModel {
  const shell = useLecturerPortalShellController('assignment-create')

  return {
    frame: {
      shell,
      pageTitle: 'Tạo bài tập mới',
      pageDescription: 'Thiết lập đề bài, rubric và yêu cầu nộp bài cho lớp phụ trách.',
      breadcrumbs: [
        { label: 'Trang chủ', href: '?portal=lecturer&page=assignment-create' },
        { label: 'Bài tập' },
        { label: 'Tạo bài tập' },
      ],
    },
    state: dataState,
    classOptions: lecturerClassesMock,
    rubricTemplates: rubricTemplatesMock,
    questions: assignmentQuestionsDraft,
    questionBank: dbContentQuestions.map((question) => {
      const info = dbInfoQuestions.find((item) => item.id_question === question.id_question)
      const rubric = dbRubricQuestions.filter((item) => item.id_question === question.id_question)
      const files = dbContentFileQuestions.filter((item) => item.id_question === question.id_question)
      return {
        id: question.id_question,
        title: question.text_content,
        preview: question.text_content.length > 96 ? `${question.text_content.slice(0, 96)}…` : question.text_content,
        maxScore: rubric.reduce((sum, item) => sum + item.max_score, 0),
        typeGrade: info?.type_grade ?? 'rubric',
        rubricCount: rubric.length,
        fileCount: files.length,
        ownerLabel: info?.id_teacher === lecturerProfileMock.lecturerCode ? lecturerProfileMock.fullName : info?.id_teacher ?? 'Giảng viên',
        createdAtLabel: info?.created_at ? formatPortalDateTime(info.created_at) : '--',
      }
    }),
    checklist: assignmentChecklistMock,
    lecturerName: lecturerProfileMock.fullName,
    errorMessage: dataState === 'error' ? 'Không thể mở biểu mẫu tạo bài tập. Vui lòng thử lại.' : undefined,
  }
}
