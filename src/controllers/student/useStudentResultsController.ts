import type { DataState } from '../../models/shared/portal.types'
import type { FeedbackFilter, ResultRow, ResultSort, StudentPageFrame } from '../../models/student/student.types'
import {
  feedbackThreadsMock,
  studentAssignmentsMock,
  studentClassesMock,
  studentProfileMock,
  studentResultsMock,
} from '../../models/student/student.mock'
import {
  buildStudentPortalHref,
  formatPortalDate,
  formatPortalDateTime,
  getClassLabel,
  getFeedbackStatusMeta,
} from '../../models/student/student.mappers'
import { canStudentViewAssignment } from '../../services/domain/accessControl'
import { useStudentPortalShellController } from './useStudentPortalShellController'
import { useStudentQueryParams } from './useStudentQueryParams'

export interface StudentResultsViewModel {
  state: DataState
  frame: StudentPageFrame
  rows: ResultRow[]
  searchValue: string
  feedbackFilter: FeedbackFilter
  sortValue: ResultSort
  onSearchChange: (value: string) => void
  onFeedbackChange: (value: FeedbackFilter) => void
  onSortChange: (value: ResultSort) => void
  errorMessage?: string
}

export interface StudentResultDetailViewModel {
  state: DataState
  frame: StudentPageFrame
  result?: {
    id: string
    assignmentId: string
    title: string
    classLabel: string
    totalScoreLabel: string
    updatedAtLabel: string
    lecturerFeedback: string
    feedbackStatusLabel: string
    feedbackStatusTone: ResultRow['feedbackTone']
    summary: string[]
    questionResults: typeof studentResultsMock[number]['questionResults']
    feedbackMessages: typeof feedbackThreadsMock[number]['messages']
    assignmentHref: string
    feedbackHref: string
  }
  errorMessage?: string
}

function sortResults(sort: ResultSort, rows: ResultRow[]) {
  const sorted = [...rows]

  switch (sort) {
    case 'score':
      sorted.sort((a, b) => parseFloat(b.scoreLabel) - parseFloat(a.scoreLabel))
      break
    case 'updated':
    default:
      return sorted
  }

  return sorted
}

export function useStudentResultsController(state: DataState): StudentResultsViewModel {
  const shell = useStudentPortalShellController('results')
  const { query, setQuery } = useStudentQueryParams()
  const safeSort: ResultSort = query.sort === 'score' || query.sort === 'updated' ? query.sort : 'updated'
  const safeFeedback: FeedbackFilter =
    query.feedback === 'new' || query.feedback === 'reply_required' || query.feedback === 'read' || query.feedback === 'all'
      ? query.feedback
      : 'all'

  const frame: StudentPageFrame = {
    shell,
    pageTitle: 'Kết quả',
    pageDescription: 'Tập trung vào các bài đã có điểm, cập nhật mới và phản hồi cần xem lại để không bỏ sót thay đổi quan trọng.',
    breadcrumbs: [
      { label: 'Trang chủ', href: buildStudentPortalHref('dashboard') },
      { label: 'Kết quả' },
    ],
  }

  const setSearch = (value: string) => setQuery({ search: value })
  const setFeedback = (value: FeedbackFilter) => setQuery({ feedback: value })
  const setSort = (value: ResultSort) => setQuery({ sort: value })

  if (state === 'loading') {
    return {
      state,
      frame,
      rows: [],
      searchValue: query.search,
      feedbackFilter: safeFeedback,
      sortValue: safeSort,
      onSearchChange: setSearch,
      onFeedbackChange: setFeedback,
      onSortChange: setSort,
    }
  }

  if (state === 'error') {
    return {
      state,
      frame,
      rows: [],
      searchValue: query.search,
      feedbackFilter: safeFeedback,
      sortValue: safeSort,
      onSearchChange: setSearch,
      onFeedbackChange: setFeedback,
      onSortChange: setSort,
      errorMessage: 'Không thể tải danh sách kết quả. Vui lòng thử lại sau.',
    }
  }

  const rows: ResultRow[] = studentResultsMock
    .filter((result) => canStudentViewAssignment(studentProfileMock.id, result.assignmentId))
    .filter((result) => (safeFeedback === 'all' ? true : result.feedbackStatus === safeFeedback))
    .map((result) => {
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
    .filter((row) => {
      if (!query.search) {
        return true
      }

      const keyword = query.search.toLowerCase()
      return row.title.toLowerCase().includes(keyword) || row.classLabel.toLowerCase().includes(keyword)
    })

  const sortedRows = sortResults(safeSort, rows)

  if (state === 'empty' || !sortedRows.length) {
    return {
      state: 'empty',
      frame,
      rows: [],
      searchValue: query.search,
      feedbackFilter: safeFeedback,
      sortValue: safeSort,
      onSearchChange: setSearch,
      onFeedbackChange: setFeedback,
      onSortChange: setSort,
    }
  }

  return {
    state,
    frame,
    rows: sortedRows,
    searchValue: query.search,
    feedbackFilter: safeFeedback,
    sortValue: safeSort,
    onSearchChange: setSearch,
    onFeedbackChange: setFeedback,
    onSortChange: setSort,
  }
}

export function useStudentResultDetailController(
  resultId: string | undefined,
  state: DataState,
): StudentResultDetailViewModel {
  const shell = useStudentPortalShellController('result-detail')
  const result = studentResultsMock.find((item) => item.id === resultId)
  const assignment = result ? studentAssignmentsMock.find((item) => item.id === result.assignmentId) : undefined
  const studentClass = result ? studentClassesMock.find((item) => item.id === result.classId) : undefined
  const feedbackMeta = result ? getFeedbackStatusMeta(result.feedbackStatus) : undefined
  const feedbackThread = result ? feedbackThreadsMock.find((item) => item.assignmentId === result.assignmentId) : undefined

  const frame: StudentPageFrame = {
    shell,
    pageTitle: assignment?.title ?? 'Chi tiết kết quả',
    pageDescription: 'Xem điểm tổng, điểm từng câu và phản hồi theo rubric để biết mình cần cải thiện chính xác ở đâu.',
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

  if (!canStudentViewAssignment(studentProfileMock.id, result.assignmentId)) {
    return {
      state: 'error',
      frame,
      errorMessage: 'Bạn không có quyền xem kết quả này.',
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
        id: result.id,
        assignmentId: result.assignmentId,
        title: assignment.title,
        classLabel: getClassLabel(studentClass),
        totalScoreLabel: `${result.totalScore.toFixed(1)}/${result.maxScore}`,
        updatedAtLabel: formatPortalDateTime(result.updatedAt),
        lecturerFeedback: result.lecturerFeedback,
        feedbackStatusLabel: feedbackMeta?.label ?? 'Đã xem',
        feedbackStatusTone: feedbackMeta?.tone ?? 'neutral',
        summary: [],
        questionResults: [],
        feedbackMessages: feedbackThread?.messages ?? [],
        assignmentHref: buildStudentPortalHref('assignment-detail', { assignmentId: assignment.id }),
        feedbackHref: buildStudentPortalHref('feedback', {
          threadId: feedbackThread?.id,
        }),
      },
    }
  }

  return {
    state,
    frame,
    result: {
      id: result.id,
      assignmentId: result.assignmentId,
      title: assignment.title,
      classLabel: getClassLabel(studentClass),
      totalScoreLabel: `${result.totalScore.toFixed(1)}/${result.maxScore}`,
      updatedAtLabel: formatPortalDateTime(result.updatedAt),
      lecturerFeedback: result.lecturerFeedback,
      feedbackStatusLabel: feedbackMeta?.label ?? 'Đã xem',
      feedbackStatusTone: feedbackMeta?.tone ?? 'neutral',
      summary: result.summary,
      questionResults: result.questionResults,
      feedbackMessages: feedbackThread?.messages ?? [],
      assignmentHref: buildStudentPortalHref('assignment-detail', { assignmentId: assignment.id }),
      feedbackHref: buildStudentPortalHref('feedback', {
        threadId: feedbackThread?.id,
      }),
    },
  }
}
