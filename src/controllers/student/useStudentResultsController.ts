import type { DataState } from '../../models/shared/portal.types'
import type { ResultRow, StudentPageFrame } from '../../models/student/student.types'
import { studentAssignmentsMock, studentClassesMock, studentResultsMock } from '../../models/student/student.mock'
import {
  buildStudentPortalHref,
  formatPortalDate,
  formatPortalDateTime,
  getClassLabel,
  getFeedbackStatusMeta,
} from '../../models/student/student.mappers'
import { useStudentPortalShellController } from './useStudentPortalShellController'

export interface StudentResultsViewModel {
  state: DataState
  frame: StudentPageFrame
  rows: ResultRow[]
  errorMessage?: string
}

export interface StudentResultDetailViewModel {
  state: DataState
  frame: StudentPageFrame
  result?: {
    title: string
    classLabel: string
    totalScoreLabel: string
    updatedAtLabel: string
    lecturerFeedback: string
    summary: string[]
    questionResults: typeof studentResultsMock[number]['questionResults']
  }
  errorMessage?: string
}

export function useStudentResultsController(state: DataState): StudentResultsViewModel {
  const shell = useStudentPortalShellController('results')
  const frame: StudentPageFrame = {
    shell,
    pageTitle: 'Kết quả',
    pageDescription: 'Tổng hợp các bài đã có điểm, thời điểm cập nhật và trạng thái phản hồi từ giảng viên.',
    breadcrumbs: [
      { label: 'Trang chủ', href: buildStudentPortalHref('dashboard') },
      { label: 'Kết quả' },
    ],
  }

  if (state === 'loading') {
    return { state, frame, rows: [] }
  }

  if (state === 'error') {
    return {
      state,
      frame,
      rows: [],
      errorMessage: 'Không thể tải danh sách kết quả. Vui lòng thử lại sau.',
    }
  }

  if (state === 'empty') {
    return { state, frame, rows: [] }
  }

  const rows: ResultRow[] = studentResultsMock.map((result) => {
    const assignment = studentAssignmentsMock.find((item) => item.id === result.assignmentId)
    const studentClass = studentClassesMock.find((item) => item.id === result.classId)
    const feedbackMeta = getFeedbackStatusMeta(result.feedbackStatus)

    return {
      id: result.id,
      title: assignment?.title ?? 'Bài tập',
      classLabel: studentClass ? getClassLabel(studentClass) : result.classId,
      scoreLabel: `${result.totalScore.toFixed(1)}/${result.maxScore}`,
      updatedAtLabel: formatPortalDate(result.updatedAt),
      feedbackLabel: feedbackMeta.label,
      feedbackTone: feedbackMeta.tone,
      href: buildStudentPortalHref('result-detail', { resultId: result.id }),
    }
  })

  return { state, frame, rows }
}

export function useStudentResultDetailController(
  resultId: string | undefined,
  state: DataState,
): StudentResultDetailViewModel {
  const shell = useStudentPortalShellController('result-detail')
  const result = studentResultsMock.find((item) => item.id === resultId)
  const assignment = result ? studentAssignmentsMock.find((item) => item.id === result.assignmentId) : undefined
  const studentClass = result ? studentClassesMock.find((item) => item.id === result.classId) : undefined

  const frame: StudentPageFrame = {
    shell,
    pageTitle: assignment?.title ?? 'Chi tiết kết quả',
    pageDescription: 'Xem điểm tổng, điểm từng câu và nhận xét chi tiết dựa trên rubric đã công bố.',
    breadcrumbs: [
      { label: 'Trang chủ', href: buildStudentPortalHref('dashboard') },
      { label: 'Kết quả', href: buildStudentPortalHref('results') },
      { label: assignment?.title ?? 'Chi tiết kết quả' },
    ],
  }

  if (!result || !assignment || !studentClass) {
    return {
      state: 'error',
      frame,
      errorMessage: 'Không tìm thấy kết quả cần xem.',
    }
  }

  if (state === 'loading') {
    return { state, frame }
  }

  if (state === 'error') {
    return {
      state,
      frame,
      errorMessage: 'Không thể tải chi tiết kết quả. Vui lòng thử lại sau.',
    }
  }

  if (state === 'empty') {
    return {
      state,
      frame,
      result: {
        title: assignment.title,
        classLabel: getClassLabel(studentClass),
        totalScoreLabel: `${result.totalScore.toFixed(1)}/${result.maxScore}`,
        updatedAtLabel: formatPortalDateTime(result.updatedAt),
        lecturerFeedback: result.lecturerFeedback,
        summary: [],
        questionResults: [],
      },
    }
  }

  return {
    state,
    frame,
    result: {
      title: assignment.title,
      classLabel: getClassLabel(studentClass),
      totalScoreLabel: `${result.totalScore.toFixed(1)}/${result.maxScore}`,
      updatedAtLabel: formatPortalDateTime(result.updatedAt),
      lecturerFeedback: result.lecturerFeedback,
      summary: result.summary,
      questionResults: result.questionResults,
    },
  }
}
