import type { DataState } from '../../models/shared/portal.types'
import type { LecturerPageFrame } from '../../models/lecturer/lecturer.types'
import { assignmentsMock, submissionsMock } from '../../models/assignment/assignment.mock'
import { lecturerProfileMock } from '../../models/lecturer/lecturer.mock'
import { getClassStudents, canLecturerManageClass } from '../../models/rbac/rbac.mappers'
import { useLecturerPortalShellController } from './useLecturerPortalShellController'
import { useLecturerQueryParams } from './useLecturerQueryParams'
import { formatPortalDateTime } from '../../models/student/student.mappers'
import { getDeadlineState } from './lecturer.utils'

export type LecturerClassStudentRow = {
  id: string
  fullName: string
  submittedLabel: string
  lateLabel: string
}

export type LecturerClassAssignmentRow = {
  id: string
  title: string
  dueAtLabel: string
  statusLabel: string
  statusTone: 'success' | 'warning' | 'danger'
  submittedLabel: string
  href: string
}

export type LecturerClassDetailViewModel = {
  frame: LecturerPageFrame
  state: DataState
  classTitle?: string
  overview?: {
    lecturerName: string
    semester: string
    totalStudents: number
    openAssignments: number
    pendingGrading: number
  }
  students: LecturerClassStudentRow[]
  activeAssignments: LecturerClassAssignmentRow[]
  overdueAssignments: LecturerClassAssignmentRow[]
  errorMessage?: string
  activeTab: string
}

export function useLecturerClassDetailController(
  classId: string | undefined,
  state: DataState,
): LecturerClassDetailViewModel {
  const shell = useLecturerPortalShellController('class-detail')
  const { query } = useLecturerQueryParams()
  const activeTab = query.tab || 'overview'

  const frame: LecturerPageFrame = {
    shell,
    pageTitle: 'Chi tiết lớp',
    pageDescription: 'Danh sách sinh viên và tiến độ bài tập trong lớp.',
    breadcrumbs: [
      { label: 'Trang chủ', href: '?portal=lecturer&page=dashboard' },
      { label: 'Lớp phụ trách', href: '?portal=lecturer&page=classes' },
      { label: classId ?? 'Chi tiết lớp' },
    ],
    tabs: [
      { label: 'Tổng quan', href: `?portal=lecturer&page=class-detail&classId=${classId}&tab=overview`, isActive: activeTab === 'overview' },
      { label: 'Roster', href: `?portal=lecturer&page=class-detail&classId=${classId}&tab=roster`, isActive: activeTab === 'roster' },
      { label: 'Bài tập', href: `?portal=lecturer&page=class-detail&classId=${classId}&tab=assignments`, isActive: activeTab === 'assignments' },
      { label: 'Thống kê', href: `?portal=lecturer&page=class-detail&classId=${classId}&tab=stats`, isActive: activeTab === 'stats' },
    ],
  }

  if (state === 'loading') {
    return { frame, state, students: [], activeAssignments: [], overdueAssignments: [], activeTab }
  }

  if (state === 'error') {
    return { frame, state, students: [], activeAssignments: [], overdueAssignments: [], activeTab, errorMessage: 'Không thể tải dữ liệu lớp.' }
  }

  if (!classId) {
    return { frame, state: 'empty', students: [], activeAssignments: [], overdueAssignments: [], activeTab }
  }

  if (!canLecturerManageClass(lecturerProfileMock.lecturerCode, classId)) {
    return { frame, state: 'error', students: [], activeAssignments: [], overdueAssignments: [], activeTab, errorMessage: 'Bạn không có quyền xem lớp này.' }
  }

  const students = getClassStudents(classId)
  const classAssignments = assignmentsMock.filter((assignment) => assignment.classId === classId)
  const openAssignments = classAssignments.filter((assignment) => assignment.status === 'published')
  const pendingGrading = submissionsMock.filter((submission) => classAssignments.some((a) => a.id === submission.assignmentId) && submission.score === undefined).length

  const studentRows = students.map((student) => {
    const submissions = submissionsMock.filter(
      (submission) => submission.studentId === student.id && classAssignments.some((a) => a.id === submission.assignmentId),
    )
    const submitted = submissions.filter((item) => item.status === 'submitted').length
    const late = submissions.filter((item) => item.status === 'late').length
    return {
      id: student.id,
      fullName: student.fullName,
      submittedLabel: `${submitted}/${classAssignments.length}`,
      lateLabel: late ? `${late} bài` : '0',
    }
  })

  const assignmentRows = classAssignments.map((assignment) => {
    const submissions = submissionsMock.filter((submission) => submission.assignmentId === assignment.id)
    const deadline = getDeadlineState(assignment.dueAt)
    return {
      id: assignment.id,
      title: assignment.title,
      dueAtLabel: formatPortalDateTime(assignment.dueAt),
      statusLabel: deadline.label,
      statusTone: deadline.tone,
      submittedLabel: `${submissions.length}/${students.length}`,
      href: `?portal=lecturer&page=assignment-detail&assignmentId=${assignment.id}`,
    }
  })

  const activeAssignments = assignmentRows.filter((row) => row.statusTone !== 'danger')
  const overdueAssignments = assignmentRows.filter((row) => row.statusTone === 'danger')

  return {
    frame,
    state: studentRows.length ? 'ready' : 'empty',
    classTitle: classId.toUpperCase(),
    overview: {
      lecturerName: lecturerProfileMock.fullName,
      semester: '2026-1',
      totalStudents: students.length,
      openAssignments: openAssignments.length,
      pendingGrading,
    },
    students: studentRows,
    activeAssignments,
    overdueAssignments,
    activeTab,
  }
}
