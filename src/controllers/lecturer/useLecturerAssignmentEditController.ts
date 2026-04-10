import type { DataState } from '../../models/shared/portal.types'
import type { LecturerPageFrame } from '../../models/lecturer/lecturer.types'
import { assignmentsMock } from '../../models/assignment/assignment.mock'
import {
  lecturerClassesMock,
  rubricTemplatesMock,
  assignmentChecklistMock,
  lecturerProfileMock,
} from '../../models/lecturer/lecturer.mock'
import {
  dbContentFileQuestions,
  dbContentQuestions,
  dbInfoQuestions,
  dbRubricQuestions,
} from '../../models/db/assignmentDb.mock'
import { useLecturerPortalShellController } from './useLecturerPortalShellController'
import { formatPortalDateTime } from '../../models/student/student.mappers'

export type LecturerAssignmentEditViewModel = {
  frame: LecturerPageFrame
  state: DataState
  assignment?: typeof assignmentsMock[number]
  classOptions: typeof lecturerClassesMock
  rubricTemplates: typeof rubricTemplatesMock
  checklist: typeof assignmentChecklistMock
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
  errorMessage?: string
}

export function useLecturerAssignmentEditController(
  assignmentId: string | undefined,
  state: DataState,
): LecturerAssignmentEditViewModel {
  const shell = useLecturerPortalShellController('assignment-edit')
  const assignment = assignmentsMock.find((item) => item.id === assignmentId)

  const frame: LecturerPageFrame = {
    shell,
    pageTitle: assignment ? `Chỉnh sửa: ${assignment.title}` : 'Chỉnh sửa bài tập',
    pageDescription: assignment ? `Cập nhật nội dung và rubric trước hạn ${formatPortalDateTime(assignment.dueAt)}.` : 'Cập nhật nội dung bài tập theo học phần.',
    breadcrumbs: [
      { label: 'Trang chủ', href: '?portal=lecturer&page=assignments' },
      { label: 'Bài tập', href: '?portal=lecturer&page=assignments' },
      { label: assignment?.title ?? 'Chỉnh sửa' },
    ],
  }

  if (state === 'loading') {
    return { frame, state, classOptions: [], rubricTemplates: [], checklist: [], questionBank: [] }
  }

  if (state === 'error') {
    return { frame, state, classOptions: [], rubricTemplates: [], checklist: [], questionBank: [], errorMessage: 'Không thể tải bài tập.' }
  }

  if (assignment && assignment.createdBy !== lecturerProfileMock.lecturerCode) {
    return {
      frame,
      state: 'error',
      classOptions: [],
      rubricTemplates: [],
      checklist: [],
      questionBank: [],
      errorMessage: 'Bạn không có quyền chỉnh sửa bài tập này.',
    }
  }

  if (!assignment) {
    return { frame, state: 'empty', classOptions: [], rubricTemplates: [], checklist: [], questionBank: [] }
  }

  const questionBank = dbContentQuestions.map((question) => {
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
  })

  return {
    frame,
    state,
    assignment,
    classOptions: lecturerClassesMock,
    rubricTemplates: rubricTemplatesMock,
    checklist: assignmentChecklistMock,
    questionBank,
  }
}
