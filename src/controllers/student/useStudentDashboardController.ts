import type { StudentPageFrame, StudentDashboardMetric } from '../../models/student/student.types'
import type { DataState } from '../../models/shared/portal.types'
import {
  feedbackThreadsMock,
  studentAssignmentsMock,
  studentResultsMock,
  studentClassesMock,
  studentProfileMock,
} from '../../models/student/student.mock'
import { buildStudentPortalHref, formatPortalDate, getClassLabel } from '../../models/student/student.mappers'
import { getNotificationsForUser } from '../../services/domain/sourceOfTruth'
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
  reminders: Array<{ id: string; label: string; detail: string; tone: 'warning' | 'positive' | 'neutral' }>
  feedbackUpdates: DashboardFeedbackItem[]
  guideLinks: Array<{ id: string; label: string; href: string }>
  quickActions: Array<{ id: string; label: string; href: string }>
  notifications: { id: string; content: string; createdAt: string; isRead: boolean }[]
  errorMessage?: string
}

const cleanReminders = [
  {
    id: 'rem-1',
    label: 'Hoàn thiện phần còn thiếu của bài đang mở',
    detail: 'Kiểm tra lại các câu chưa làm xong trước khi deadline gần nhất kết thúc.',
    tone: 'warning' as const,
  },
  {
    id: 'rem-2',
    label: 'Đọc phản hồi mới từ giảng viên',
    detail: 'Mở lại kết quả gần đây để xem nhận xét mới và hướng chỉnh sửa tiếp theo.',
    tone: 'positive' as const,
  },
  {
    id: 'rem-3',
    label: 'Kiểm tra yêu cầu định dạng tệp nộp',
    detail: 'Một số assignment yêu cầu PDF hoặc tệp minh chứng đúng chuẩn lớp học.',
    tone: 'neutral' as const,
  },
]

const cleanGuideLinks = [
  { id: 'guide-1', label: 'Lưu nháp và nộp bài chính thức', href: '#guide-submit' },
  { id: 'guide-2', label: 'Đọc rubric trước khi hoàn thành từng câu', href: '#guide-rubric' },
  { id: 'guide-3', label: 'Theo dõi phản hồi sau khi có điểm', href: '#guide-feedback' },
]

export function useStudentDashboardController(state: DataState): StudentDashboardViewModel {
  const shell = useStudentPortalShellController('dashboard')
  const notifications = getNotificationsForUser(studentProfileMock.id).map((item) => ({
    id: item.id,
    content: item.content,
    createdAt: item.created_at,
    isRead: item.is_read,
  }))

  const frame: StudentPageFrame = {
    shell,
    pageTitle: 'Trang chủ sinh viên',
    pageDescription: 'Theo dõi hạn nộp, kết quả mới và phản hồi học tập trong một không gian thống nhất.',
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
      quickActions: [],
      notifications: [],
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
      quickActions: [],
      notifications: [],
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
      label: 'Sắp đến hạn',
      value: String(actionableAssignments.filter((assignment) => assignment.submissionStatus !== 'submitted').length),
      tone: 'info',
    },
    {
      id: 'm3',
      label: 'Đang chờ chấm',
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
      deadlineLabel: formatPortalDate(assignment.dueAt),
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

  const quickActions = [
    { id: 'act-1', label: 'Mở danh sách bài tập', href: buildStudentPortalHref('assignments') },
    { id: 'act-2', label: 'Xem kết quả mới', href: buildStudentPortalHref('results') },
    { id: 'act-3', label: 'Kiểm tra phản hồi', href: buildStudentPortalHref('feedback') },
    { id: 'act-4', label: 'Đọc thông báo mới', href: buildStudentPortalHref('notifications', { view: 'unread' }) },
  ]

  if (state === 'empty') {
    return {
      state,
      frame,
      metrics,
      upcomingAssignments: [],
      recentResults: [],
      reminders: cleanReminders,
      feedbackUpdates: [],
      guideLinks: cleanGuideLinks,
      quickActions,
      notifications,
    }
  }

  return {
    state,
    frame,
    metrics,
    upcomingAssignments,
    recentResults,
    reminders: cleanReminders,
    feedbackUpdates,
    guideLinks: cleanGuideLinks,
    quickActions,
    notifications,
  }
}
