import type { DataState, StatusTone } from '../../models/shared/portal.types'
import type { LecturerPageFrame } from '../../models/lecturer/lecturer.types'
import { assignmentsMock, submissionsMock } from '../../models/assignment/assignment.mock'
import { lecturerProfileMock } from '../../models/lecturer/lecturer.mock'
import { buildLecturerPortalHref } from '../../models/lecturer/lecturer.mappers'
import { formatPortalDateTime } from '../../models/student/student.mappers'
import { getClassStudents } from '../../models/rbac/rbac.mappers'
import { useLecturerPortalShellController } from './useLecturerPortalShellController'
import { useLecturerQueryParams } from './useLecturerQueryParams'

export type LecturerAssignmentClassCard = {
  id: string
  code: string
  title: string
  helperText: string
  openAssignmentsLabel: string
  pendingLabel: string
  href: string
  isActive: boolean
}

export type LecturerAssignmentWorkItem = {
  id: string
  title: string
  summary: string
  deadlineLabel: string
  deadlineTone: StatusTone
  statusLabel: string
  statusTone: StatusTone
  submittedLabel: string
  pendingGradeLabel: string
  detailHref: string
  queueHref: string
  editHref: string
}

export type LecturerAssignmentsViewModel = {
  frame: LecturerPageFrame
  state: DataState
  classes: LecturerAssignmentClassCard[]
  selectedClass?: {
    id: string
    code: string
    title: string
    studentCountLabel: string
  }
  rows: LecturerAssignmentWorkItem[]
  filters: {
    search: string
    status: string
    sort: string
  }
  stats: { id: string; label: string; value: string; tone?: 'neutral' | 'warning' | 'success' | 'info' }[]
  errorMessage?: string
  setQuery: (next: Partial<ReturnType<typeof useLecturerQueryParams>['query']>) => void
}

export const lecturerAssignmentSortOptions = [
  { value: 'deadline', label: 'Hạn nộp gần nhất' },
  { value: 'recent', label: 'Cập nhật gần đây' },
  { value: 'coverage', label: 'Tỷ lệ nộp thấp' },
]

function getDeadlineTone(dueAt: string): StatusTone {
  const diff = new Date(dueAt).getTime() - Date.now()
  if (diff < 0) {
    return 'danger'
  }
  if (diff <= 1000 * 60 * 60 * 24 * 3) {
    return 'warning'
  }
  return 'neutral'
}

function getAssignmentStatusMeta(status: typeof assignmentsMock[number]['status']) {
  if (status === 'draft') return { label: 'Nháp', tone: 'neutral' as StatusTone }
  if (status === 'closed') return { label: 'Đã đóng', tone: 'neutral' as StatusTone }
  return { label: 'Đang mở', tone: 'success' as StatusTone }
}

export function useLecturerAssignmentsController(state: DataState): LecturerAssignmentsViewModel {
  const shell = useLecturerPortalShellController('assignments')
  const { query, setQuery } = useLecturerQueryParams()
  const lecturerAssignments = assignmentsMock.filter((assignment) => assignment.createdBy === lecturerProfileMock.lecturerCode)
  const classIds = Array.from(new Set(lecturerAssignments.map((assignment) => assignment.classId)))
  const selectedClassId = query.classId !== 'all' && classIds.includes(query.classId) ? query.classId : classIds[0]
  const selectedAssignments = lecturerAssignments.filter((assignment) => assignment.classId === selectedClassId)
  const sortValue = lecturerAssignmentSortOptions.some((item) => item.value === query.sort) ? query.sort : 'deadline'

  const frame: LecturerPageFrame = {
    shell,
    pageTitle: '',
    pageDescription: '',
    breadcrumbs: [
      { label: 'Trang chủ', href: buildLecturerPortalHref('dashboard') },
      { label: 'Bài tập' },
    ],
  }

  const classes = classIds.map((classId) => {
    const classAssignments = lecturerAssignments.filter((assignment) => assignment.classId === classId)
    const students = getClassStudents(classId)
    const pendingCount = classAssignments.reduce((total, assignment) => {
      const submissions = submissionsMock.filter((submission) => submission.assignmentId === assignment.id)
      return total + submissions.filter((submission) => submission.score === undefined).length
    }, 0)

    return {
      id: classId,
      code: classId.toUpperCase(),
      title: classAssignments[0]?.classId.toUpperCase() ?? classId.toUpperCase(),
      helperText: `${students.length} sinh viên`,
      openAssignmentsLabel: `${classAssignments.filter((assignment) => assignment.status === 'published').length} bài đang mở`,
      pendingLabel: `${pendingCount} bài chờ chấm`,
      href: buildLecturerPortalHref('assignments', {
        classId,
        status: query.status || undefined,
        sort: sortValue,
        q: query.search || undefined,
      }),
      isActive: classId === selectedClassId,
    }
  })

  const stats = [
    { id: 'classes', label: 'Lớp phụ trách', value: String(classIds.length), tone: 'info' as const },
    { id: 'assignments', label: 'Bài trong lớp', value: String(selectedAssignments.length), tone: 'neutral' as const },
    {
      id: 'open',
      label: 'Đang mở',
      value: String(selectedAssignments.filter((assignment) => assignment.status === 'published').length),
      tone: 'success' as const,
    },
    {
      id: 'pending',
      label: 'Chờ chấm',
      value: String(
        selectedAssignments.reduce((total, assignment) => {
          const submissions = submissionsMock.filter((submission) => submission.assignmentId === assignment.id)
          return total + submissions.filter((submission) => submission.score === undefined).length
        }, 0),
      ),
      tone: 'warning' as const,
    },
  ]

  const selectedClassMeta = selectedClassId
    ? {
        id: selectedClassId,
        code: selectedClassId.toUpperCase(),
        title: `Lớp ${selectedClassId.toUpperCase()}`,
        studentCountLabel: `${getClassStudents(selectedClassId).length} sinh viên`,
      }
    : undefined

  if (state === 'loading') {
    return {
      frame,
      state,
      classes,
      selectedClass: selectedClassMeta,
      rows: [],
      filters: {
        search: query.search,
        status: query.status,
        sort: sortValue,
      },
      stats,
      setQuery,
    }
  }

  if (state === 'error') {
    return {
      frame,
      state,
      classes,
      selectedClass: selectedClassMeta,
      rows: [],
      filters: {
        search: query.search,
        status: query.status,
        sort: sortValue,
      },
      stats,
      setQuery,
      errorMessage: 'Không thể tải workspace bài tập của giảng viên.',
    }
  }

  const rows = selectedAssignments
    .filter((assignment) => {
      if (!query.search) {
        return true
      }

      const keyword = query.search.toLowerCase()
      return assignment.title.toLowerCase().includes(keyword) || assignment.id.toLowerCase().includes(keyword)
    })
    .filter((assignment) => (query.status && query.status !== 'all' ? assignment.status === query.status : true))
    .sort((a, b) => {
      if (sortValue === 'recent') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }

      if (sortValue === 'coverage') {
        const aStudents = getClassStudents(a.classId).length
        const bStudents = getClassStudents(b.classId).length
        const aSubmitted = submissionsMock.filter((submission) => submission.assignmentId === a.id).length
        const bSubmitted = submissionsMock.filter((submission) => submission.assignmentId === b.id).length
        const aRate = aStudents ? aSubmitted / aStudents : 0
        const bRate = bStudents ? bSubmitted / bStudents : 0
        return aRate - bRate
      }

      return new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()
    })
    .map((assignment) => {
      const students = getClassStudents(assignment.classId)
      const submissions = submissionsMock.filter((submission) => submission.assignmentId === assignment.id)
      const statusMeta = getAssignmentStatusMeta(assignment.status)
      return {
        id: assignment.id,
        title: assignment.title,
        summary: assignment.description,
        deadlineLabel: formatPortalDateTime(assignment.dueAt),
        deadlineTone: getDeadlineTone(assignment.dueAt),
        statusLabel: statusMeta.label,
        statusTone: statusMeta.tone,
        submittedLabel: `${submissions.length}/${students.length} đã nộp`,
        pendingGradeLabel: `${submissions.filter((submission) => submission.score === undefined).length} chờ chấm`,
        detailHref: buildLecturerPortalHref('assignment-detail', { assignmentId: assignment.id }),
        queueHref: buildLecturerPortalHref('submission-list', { assignmentId: assignment.id }),
        editHref: buildLecturerPortalHref('assignment-edit', { assignmentId: assignment.id }),
      }
    })

  if (state === 'empty' || !selectedClassId || !rows.length) {
    return {
      frame,
      state: 'empty',
      classes,
      selectedClass: selectedClassMeta,
      rows: [],
      filters: {
        search: query.search,
        status: query.status,
        sort: sortValue,
      },
      stats,
      setQuery,
    }
  }

  return {
    frame,
    state,
    classes,
    selectedClass: selectedClassMeta,
    rows,
    filters: {
      search: query.search,
      status: query.status,
      sort: sortValue,
    },
    stats,
    setQuery,
  }
}
