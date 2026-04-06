import type { StudentPageFrame, StudentDashboardMetric } from '../../models/student/student.types'
import type { DataState } from '../../models/shared/portal.types'
import {
  feedbackThreadsMock,
  studentAssignmentsMock,
  studentQuickGuideMock,
  studentRemindersMock,
  studentResultsMock,
} from '../../models/student/student.mock'
import { buildStudentPortalHref, formatPortalDate, getClassLabel } from '../../models/student/student.mappers'
import { studentClassesMock } from '../../models/student/student.mock'
import { useStudentPortalShellController } from './useStudentPortalShellController'

export interface DashboardUpcomingItem {
  id: string
  title: string
  classLabel: string
  deadlineLabel: string
  href: string
}

export interface DashboardResultItem {
  id: string
  title: string
  classLabel: string
  scoreLabel: string
  updatedAtLabel: string
  href: string
}

export interface DashboardFeedbackItem {
  id: string
  title: string
  updatedAtLabel: string
  href: string
}

export interface StudentDashboardViewModel {
  state: DataState
  frame: StudentPageFrame
  metrics: StudentDashboardMetric[]
  upcomingAssignments: DashboardUpcomingItem[]
  recentResults: DashboardResultItem[]
  reminders: typeof studentRemindersMock
  feedbackUpdates: DashboardFeedbackItem[]
  guideLinks: typeof studentQuickGuideMock
  errorMessage?: string
}

export function useStudentDashboardController(state: DataState): StudentDashboardViewModel {
  const shell = useStudentPortalShellController('dashboard')

  const frame: StudentPageFrame = {
    shell,
    pageTitle: 'Trang chủ sinh viên',
    pageDescription: 'Theo dõi hạn nộp, kết quả mới và các phản hồi học tập trong cùng một không gian học vụ.',
    breadcrumbs: [{ label: 'Trang chủ' }],
  }

  if (state === 'loading') {
    return {
      state,
      frame,
      metrics: [],
      upcomingAssignments: [],
      recentResults: [],
      reminders: [],
      feedbackUpdates: [],
      guideLinks: [],
    }
  }

  if (state === 'error') {
    return {
      state,
      frame,
      metrics: [],
      upcomingAssignments: [],
      recentResults: [],
      reminders: [],
      feedbackUpdates: [],
      guideLinks: [],
      errorMessage: 'Không thể tải tổng quan sinh viên vào lúc này. Vui lòng thử lại sau.',
    }
  }

  const actionableAssignments = studentAssignmentsMock.filter((assignment) => assignment.gradingStatus !== 'published')

  const metrics: StudentDashboardMetric[] = [
    {
      id: 'm1',
      label: 'Bài chưa nộp',
      value: String(studentAssignmentsMock.filter((assignment) => assignment.submissionStatus === 'not_submitted').length),
      tone: 'warning',
    },
    {
      id: 'm2',
      label: 'Bài sắp đến hạn',
      value: String(actionableAssignments.filter((assignment) => assignment.submissionStatus !== 'submitted').length),
      tone: 'info',
    },
    {
      id: 'm3',
      label: 'Bài đang chờ chấm',
      value: String(studentAssignmentsMock.filter((assignment) => assignment.gradingStatus === 'pending').length),
      tone: 'neutral',
    },
    {
      id: 'm4',
      label: 'Điểm mới cập nhật',
      value: String(studentResultsMock.filter((result) => result.feedbackStatus === 'new').length),
      tone: 'success',
    },
  ]

  const upcomingAssignments = actionableAssignments.slice(0, 3).map((assignment) => {
    const studentClass = studentClassesMock.find((item) => item.id === assignment.classId)

    return {
      id: assignment.id,
      title: assignment.title,
      classLabel: studentClass ? getClassLabel(studentClass) : assignment.classId,
      deadlineLabel: formatPortalDate(assignment.deadline),
      href: buildStudentPortalHref('assignment-detail', { assignmentId: assignment.id }),
    }
  })

  const recentResults = studentResultsMock.slice(0, 2).map((result) => {
    const assignment = studentAssignmentsMock.find((item) => item.id === result.assignmentId)
    const studentClass = studentClassesMock.find((item) => item.id === result.classId)

    return {
      id: result.id,
      title: assignment?.title ?? 'Bài tập',
      classLabel: studentClass ? getClassLabel(studentClass) : result.classId,
      scoreLabel: `${result.totalScore.toFixed(1)}/${result.maxScore}`,
      updatedAtLabel: formatPortalDate(result.updatedAt),
      href: buildStudentPortalHref('result-detail', { resultId: result.id }),
    }
  })

  const feedbackUpdates = feedbackThreadsMock.slice(0, 3).map((thread) => ({
    id: thread.id,
    title: thread.title,
    updatedAtLabel: formatPortalDate(thread.updatedAt),
    href: buildStudentPortalHref('feedback', { threadId: thread.id }),
  }))

  if (state === 'empty') {
    return {
      state,
      frame,
      metrics,
      upcomingAssignments: [],
      recentResults: [],
      reminders: [],
      feedbackUpdates: [],
      guideLinks: studentQuickGuideMock,
    }
  }

  return {
    state,
    frame,
    metrics,
    upcomingAssignments,
    recentResults,
    reminders: studentRemindersMock,
    feedbackUpdates,
    guideLinks: studentQuickGuideMock,
  }
}
