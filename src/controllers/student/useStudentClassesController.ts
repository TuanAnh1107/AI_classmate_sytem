import type { DataState, StatusTone } from '../../models/shared/portal.types'
import type { StudentPageFrame, StudentClassRow, ClassDetailTab } from '../../models/student/student.types'
import {
  classAnnouncementsMock,
  studentAssignmentsMock,
  studentClassesMock,
  studentProfileMock,
  studentResultsMock,
} from '../../models/student/student.mock'
import {
  buildClassTabItems,
  buildStudentPortalHref,
  formatPortalDate,
  getFeedbackStatusMeta,
  getGradingStatusMeta,
  getSubmissionStatusMeta,
} from '../../models/student/student.mappers'
import { canStudentViewClass } from '../../services/domain/accessControl'
import { useStudentPortalShellController } from './useStudentPortalShellController'
import { useStudentQueryParams } from './useStudentQueryParams'

export interface StudentClassesListViewModel {
  state: DataState
  frame: StudentPageFrame
  rows: StudentClassRow[]
  searchValue: string
  onSearchChange: (value: string) => void
  errorMessage?: string
}

export interface StudentClassAssignmentItem {
  id: string
  title: string
  deadlineLabel: string
  submissionLabel: string
  submissionTone: StatusTone
  gradingLabel: string
  gradingTone: StatusTone
  href: string
}

export interface StudentClassResultItem {
  id: string
  title: string
  scoreLabel: string
  updatedAtLabel: string
  feedbackLabel: string
  feedbackTone: StatusTone
  href: string
}

export interface StudentClassAnnouncementItem {
  id: string
  title: string
  postedAtLabel: string
  summary: string
}

export interface StudentClassDetailViewModel {
  state: DataState
  frame: StudentPageFrame
  classSummary?: {
    title: string
    code: string
    lecturerName: string
    lecturerEmail: string
    semester: string
    schedule: string
    room: string
    overview: string
    progressLabel: string
    openAssignmentsLabel: string
  }
  assignments: StudentClassAssignmentItem[]
  results: StudentClassResultItem[]
  announcements: StudentClassAnnouncementItem[]
  activeTab: ClassDetailTab
  errorMessage?: string
}

export function useStudentClassesController(state: DataState): StudentClassesListViewModel {
  const shell = useStudentPortalShellController('classes')
  const { query, setQuery } = useStudentQueryParams()
  const frame: StudentPageFrame = {
    shell,
    pageTitle: 'Lớp học của tôi',
    pageDescription: 'Theo dõi từng lớp đang tham gia, số bài đang mở và mức độ hoàn thành theo nhịp học thực tế.',
    breadcrumbs: [
      { label: 'Trang chủ', href: buildStudentPortalHref('dashboard') },
      { label: 'Lớp học của tôi' },
    ],
  }

  const onSearchChange = (value: string) => setQuery({ search: value })

  if (state === 'loading') {
    return { state, frame, rows: [], searchValue: query.search, onSearchChange }
  }

  if (state === 'error') {
    return {
      state,
      frame,
      rows: [],
      searchValue: query.search,
      onSearchChange,
      errorMessage: 'Không thể tải danh sách lớp học. Vui lòng thử lại sau.',
    }
  }

  if (state === 'empty') {
    return { state, frame, rows: [], searchValue: query.search, onSearchChange }
  }

  const rows = studentClassesMock
    .filter((studentClass) => {
      if (!query.search) {
        return true
      }
      const keyword = query.search.toLowerCase()
      return (
        studentClass.name.toLowerCase().includes(keyword) ||
        studentClass.code.toLowerCase().includes(keyword) ||
        studentClass.lecturerName.toLowerCase().includes(keyword)
      )
    })
    .map((studentClass) => ({
      id: studentClass.id,
      title: studentClass.name,
      lecturerName: studentClass.lecturerName,
      classCode: studentClass.code,
      openAssignmentsLabel: `${studentClass.openAssignments} bài đang mở`,
      progressLabel: `${studentClass.completionPercent}% hoàn thành`,
      progressPercent: studentClass.completionPercent,
      href: buildStudentPortalHref('class-detail', { classId: studentClass.id, tab: 'overview' }),
    }))

  if (!rows.length) {
    return {
      state: 'empty',
      frame,
      rows: [],
      searchValue: query.search,
      onSearchChange,
    }
  }

  return {
    state,
    frame,
    rows,
    searchValue: query.search,
    onSearchChange,
  }
}

export function useStudentClassDetailController(
  classId: string | undefined,
  activeTab: ClassDetailTab,
  state: DataState,
): StudentClassDetailViewModel {
  const shell = useStudentPortalShellController('class-detail')
  const studentClass = studentClassesMock.find((item) => item.id === classId)

  const baseFrame: StudentPageFrame = {
    shell,
    pageTitle: studentClass?.name ?? 'Chi tiết lớp học',
    pageDescription: 'Theo dõi tiến độ học phần, bài tập, kết quả và thông báo của lớp trong cùng một không gian.',
    breadcrumbs: [
      { label: 'Trang chủ', href: buildStudentPortalHref('dashboard') },
      { label: 'Lớp học của tôi', href: buildStudentPortalHref('classes') },
      { label: studentClass?.code ?? 'Chi tiết lớp' },
    ],
    tabs: classId ? buildClassTabItems(classId, activeTab) : undefined,
  }

  if (!studentClass) {
    return {
      state: 'error',
      frame: baseFrame,
      assignments: [],
      results: [],
      announcements: [],
      activeTab,
      errorMessage: 'Không tìm thấy lớp học đã chọn.',
    }
  }

  if (classId && !canStudentViewClass(studentProfileMock.id, classId)) {
    return {
      state: 'error',
      frame: baseFrame,
      assignments: [],
      results: [],
      announcements: [],
      activeTab,
      errorMessage: 'Bạn không có quyền xem lớp học này.',
    }
  }

  if (state === 'loading') {
    return { state, frame: baseFrame, classSummary: undefined, assignments: [], results: [], announcements: [], activeTab }
  }

  const classAssignments = studentAssignmentsMock.filter((item) => item.classId === studentClass.id)
  const classResults = studentResultsMock.filter((item) => item.classId === studentClass.id)
  const classAnnouncements = classAnnouncementsMock.filter((item) => item.classId === studentClass.id)

  const assignments = classAssignments.map((assignment) => {
    const submissionMeta = getSubmissionStatusMeta(assignment.submissionStatus)
    const gradingMeta = getGradingStatusMeta(assignment.gradingStatus)

    return {
      id: assignment.id,
      title: assignment.title,
      deadlineLabel: formatPortalDate(assignment.dueAt),
      submissionLabel: submissionMeta.label,
      submissionTone: submissionMeta.tone,
      gradingLabel: gradingMeta.label,
      gradingTone: gradingMeta.tone,
      href: buildStudentPortalHref('assignment-detail', { assignmentId: assignment.id }),
    }
  })

  const results = classResults.map((result) => {
    const feedbackMeta = getFeedbackStatusMeta(result.feedbackStatus)
    const assignment = studentAssignmentsMock.find((item) => item.id === result.assignmentId)

    return {
      id: result.id,
      title: assignment?.title ?? 'Bài tập',
      scoreLabel: `${result.totalScore.toFixed(1)}/${result.maxScore}`,
      updatedAtLabel: formatPortalDate(result.updatedAt),
      feedbackLabel: feedbackMeta.label,
      feedbackTone: feedbackMeta.tone,
      href: buildStudentPortalHref('result-detail', { resultId: result.id }),
    }
  })

  const announcements = classAnnouncements.map((item) => ({
    id: item.id,
    title: item.title,
    postedAtLabel: formatPortalDate(item.postedAt),
    summary: item.summary,
  }))

  if (state === 'error') {
    return {
      state,
      frame: baseFrame,
      classSummary: undefined,
      assignments: [],
      results: [],
      announcements: [],
      activeTab,
      errorMessage: 'Không thể tải chi tiết lớp học. Vui lòng thử lại sau.',
    }
  }

  const classSummary = {
    title: studentClass.name,
    code: studentClass.code,
    lecturerName: studentClass.lecturerName,
    lecturerEmail: studentClass.lecturerEmail,
    semester: studentClass.semester,
    schedule: studentClass.schedule,
    room: studentClass.room,
    overview: studentClass.overview,
    progressLabel: `${studentClass.completionPercent}% hoàn thành`,
    openAssignmentsLabel: `${studentClass.openAssignments} bài đang mở`,
  }

  if (state === 'empty') {
    return {
      state,
      frame: baseFrame,
      classSummary,
      assignments: [],
      results: [],
      announcements: [],
      activeTab,
    }
  }

  return {
    state,
    frame: baseFrame,
    classSummary,
    assignments,
    results,
    announcements,
    activeTab,
  }
}
