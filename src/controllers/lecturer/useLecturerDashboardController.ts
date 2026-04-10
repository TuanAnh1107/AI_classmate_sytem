import type { DataState } from '../../models/shared/portal.types'
import type { LecturerPageFrame } from '../../models/lecturer/lecturer.types'
import { assignmentsMock, submissionsMock } from '../../models/assignment/assignment.mock'
import { lecturerProfileMock } from '../../models/lecturer/lecturer.mock'
import { getClassStudents, getLecturerClasses, getUserById } from '../../models/rbac/rbac.mappers'
import { useLecturerPortalShellController } from './useLecturerPortalShellController'
import { formatPortalDateTime } from '../../models/student/student.mappers'
import { getCoverageLabel, getCoverageTone, getDeadlineState } from './lecturer.utils'
import {
  dbAssignmentListSubmissions,
  dbAssignmentQuestions,
  dbContentAssignments,
  dbContentFileQuestions,
  dbContentFileSubmissions,
  dbContentQuestions,
  dbContentSubmissions,
  dbFeedbackSubmissions,
  dbInfoAssignments,
  dbInfoQuestions,
  dbInfoSubmissions,
  dbListSubmissions,
  dbResultFeedbacks,
  dbResultSubmissions,
  dbRubricQuestions,
} from '../../models/db/assignmentDb.mock'
import { buildFeedbackThreadsFromDb } from '../../models/db/assignmentDb.mappers'

export type LecturerDashboardStat = {
  id: string
  label: string
  value: string
  tone?: 'neutral' | 'info' | 'warning' | 'success'
}

export type LecturerDeadlineItem = {
  id: string
  title: string
  classLabel: string
  dueAtLabel: string
  deadlineLabel: string
  tone: 'warning' | 'success' | 'danger'
  href: string
}

export type LecturerQueueItem = {
  id: string
  title: string
  studentName: string
  classLabel: string
  submittedAtLabel: string
  statusLabel: string
  href: string
}

export type LecturerCoverageItem = {
  id: string
  title: string
  classLabel: string
  coverageLabel: string
  tone: 'success' | 'info' | 'warning'
  href: string
}

export type LecturerDashboardViewModel = {
  frame: LecturerPageFrame
  state: DataState
  stats: LecturerDashboardStat[]
  upcomingDeadlines: LecturerDeadlineItem[]
  needsGrading: LecturerQueueItem[]
  lowCoverageAssignments: LecturerCoverageItem[]
  recentSubmissions: LecturerQueueItem[]
  feedbackNeedsReply: LecturerQueueItem[]
  errorMessage?: string
}

const dbBundle = {
  infoAssignments: dbInfoAssignments,
  contentAssignments: dbContentAssignments,
  assignmentQuestions: dbAssignmentQuestions,
  infoQuestions: dbInfoQuestions,
  contentQuestions: dbContentQuestions,
  contentFileQuestions: dbContentFileQuestions,
  rubricQuestions: dbRubricQuestions,
  assignmentListSubmissions: dbAssignmentListSubmissions,
  listSubmissions: dbListSubmissions,
  infoSubmissions: dbInfoSubmissions,
  contentSubmissions: dbContentSubmissions,
  contentFileSubmissions: dbContentFileSubmissions,
  resultSubmissions: dbResultSubmissions,
  resultFeedbacks: dbResultFeedbacks,
  feedbackSubmissions: dbFeedbackSubmissions,
}

export function useLecturerDashboardController(state: DataState): LecturerDashboardViewModel {
  const shell = useLecturerPortalShellController('dashboard')
  const frame: LecturerPageFrame = {
    shell,
    pageTitle: '',
    pageDescription: '',
    breadcrumbs: [{ label: 'Trang chủ', href: '?portal=lecturer&page=dashboard' }],
  }

  if (state === 'loading') {
    return {
      frame,
      state,
      stats: [],
      upcomingDeadlines: [],
      needsGrading: [],
      lowCoverageAssignments: [],
      recentSubmissions: [],
      feedbackNeedsReply: [],
    }
  }

  if (state === 'error') {
    return {
      frame,
      state,
      stats: [],
      upcomingDeadlines: [],
      needsGrading: [],
      lowCoverageAssignments: [],
      recentSubmissions: [],
      feedbackNeedsReply: [],
      errorMessage: 'Không thể tải bảng tổng quan.',
    }
  }

  const classes = getLecturerClasses(lecturerProfileMock.lecturerCode)
  const assignments = assignmentsMock.filter((assignment) => assignment.createdBy === lecturerProfileMock.lecturerCode)
  const openAssignments = assignments.filter((assignment) => assignment.status === 'published')
  const upcomingAssignments = openAssignments.filter((assignment) => {
    const due = new Date(assignment.dueAt).getTime()
    const now = Date.now()
    const diff = (due - now) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 7
  })
  const submissions = submissionsMock.filter((submission) =>
    assignments.some((assignment) => assignment.id === submission.assignmentId),
  )
  const ungradedSubmissions = submissions.filter((submission) => submission.score === undefined)
  const lateSubmissions = submissions.filter((submission) => submission.status === 'late')

  const feedbackThreads = buildFeedbackThreadsFromDb(dbBundle)
  const feedbackNeedsReply = feedbackThreads.filter((thread) => {
    const last = thread.messages[thread.messages.length - 1]
    const author = getUserById(last?.authorId ?? '')
    return author?.role === 'student'
  })

  const stats: LecturerDashboardStat[] = [
    { id: 'classes', label: 'Lớp phụ trách', value: String(classes.length), tone: 'info' },
    { id: 'open', label: 'Assignment đang mở', value: String(openAssignments.length), tone: 'success' },
    { id: 'upcoming', label: 'Sắp đến hạn (7 ngày)', value: String(upcomingAssignments.length), tone: 'warning' },
    { id: 'ungraded', label: 'Bài chưa chấm', value: String(ungradedSubmissions.length), tone: 'warning' },
    { id: 'late', label: 'Nộp trễ', value: String(lateSubmissions.length), tone: 'warning' },
    { id: 'feedback', label: 'Chờ phản hồi', value: String(feedbackNeedsReply.length), tone: 'neutral' },
  ]

  const upcomingDeadlines: LecturerDeadlineItem[] = upcomingAssignments.slice(0, 5).map((assignment) => {
    const classInfo = classes.find((item) => item.id === assignment.classId)
    const deadline = getDeadlineState(assignment.dueAt)
    return {
      id: assignment.id,
      title: assignment.title,
      classLabel: classInfo ? `${classInfo.code} · ${classInfo.name}` : assignment.classId,
      dueAtLabel: formatPortalDateTime(assignment.dueAt),
      deadlineLabel: deadline.label,
      tone: deadline.tone,
      href: `?portal=lecturer&page=assignment-detail&assignmentId=${assignment.id}`,
    }
  })

  const needsGrading: LecturerQueueItem[] = ungradedSubmissions.slice(0, 5).map((submission) => {
    const assignment = assignments.find((item) => item.id === submission.assignmentId)
    const classInfo = classes.find((item) => item.id === assignment?.classId)
    const student = getUserById(submission.studentId)
    return {
      id: submission.id,
      title: assignment?.title ?? 'Bài tập',
      studentName: student?.fullName ?? submission.studentId,
      classLabel: classInfo ? classInfo.code : assignment?.classId ?? '--',
      submittedAtLabel: submission.submittedAt ? formatPortalDateTime(submission.submittedAt) : 'Chưa nộp',
      statusLabel: submission.status === 'late' ? 'Nộp trễ' : 'Chưa chấm',
      href: `?portal=lecturer&page=submission-detail&submissionId=${submission.id}`,
    }
  })

  const lowCoverageAssignments: LecturerCoverageItem[] = assignments
    .slice(0, 4)
    .map((assignment) => {
      const classInfo = classes.find((item) => item.id === assignment.classId)
      const students = getClassStudents(assignment.classId)
      const submitted = submissions.filter((submission) => submission.assignmentId === assignment.id).length
      const rate = students.length === 0 ? 0 : Math.round((submitted / students.length) * 100)
      return {
        id: assignment.id,
        title: assignment.title,
        classLabel: classInfo ? classInfo.code : assignment.classId,
        coverageLabel: getCoverageLabel(submitted, students.length),
        tone: getCoverageTone(rate),
        href: `?portal=lecturer&page=submission-list&assignmentId=${assignment.id}`,
      }
    })

  const recentSubmissions: LecturerQueueItem[] = submissions
    .slice()
    .sort((a, b) => (b.submittedAt ?? '').localeCompare(a.submittedAt ?? ''))
    .slice(0, 5)
    .map((submission) => {
      const assignment = assignments.find((item) => item.id === submission.assignmentId)
      const classInfo = classes.find((item) => item.id === assignment?.classId)
      const student = getUserById(submission.studentId)
      return {
        id: submission.id,
        title: assignment?.title ?? 'Bài tập',
        studentName: student?.fullName ?? submission.studentId,
        classLabel: classInfo ? classInfo.code : assignment?.classId ?? '--',
        submittedAtLabel: submission.submittedAt ? formatPortalDateTime(submission.submittedAt) : 'Chưa nộp',
        statusLabel: submission.status === 'late' ? 'Nộp trễ' : 'Đã nộp',
        href: `?portal=lecturer&page=submission-detail&submissionId=${submission.id}`,
      }
    })

  const feedbackNeedsReplyItems: LecturerQueueItem[] = feedbackNeedsReply.map((thread) => {
    const submission = submissions.find((item) => item.id === thread.submissionId)
    const assignment = assignments.find((item) => item.id === submission?.assignmentId)
    const classInfo = classes.find((item) => item.id === assignment?.classId)
    const last = thread.messages[thread.messages.length - 1]
    const student = getUserById(last?.authorId ?? '')
    return {
      id: thread.feedbackId,
      title: assignment?.title ?? 'Bài tập',
      studentName: student?.fullName ?? last?.authorId ?? 'Sinh viên',
      classLabel: classInfo ? classInfo.code : assignment?.classId ?? '--',
      submittedAtLabel: last ? formatPortalDateTime(last.createdAt) : '--',
      statusLabel: 'Chờ phản hồi',
      href: submission ? `?portal=lecturer&page=submission-detail&submissionId=${submission.id}` : '#',
    }
  })

  return {
    frame,
    state,
    stats,
    upcomingDeadlines,
    needsGrading,
    lowCoverageAssignments,
    recentSubmissions,
    feedbackNeedsReply: feedbackNeedsReplyItems,
  }
}
