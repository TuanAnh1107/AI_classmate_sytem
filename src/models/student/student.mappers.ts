import type { StudentPageKey } from '../app.types'
import type { LinkItemModel, PortalNavItem, SecondaryTabModel, StatusTone } from '../shared/portal.types'
import type {
  AssignmentFilter,
  ClassDetailTab,
  CompletionStatus,
  FeedbackStatus,
  GradingStatus,
  StudentAssignment,
  StudentClass,
  SubmissionStatus,
} from './student.types'

const VI_DATE = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

const VI_DATE_TIME = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatPortalDate(dateIso: string) {
  return VI_DATE.format(new Date(dateIso))
}

export function formatPortalDateTime(dateIso: string) {
  return VI_DATE_TIME.format(new Date(dateIso))
}

export function buildStudentPortalHref(page: StudentPageKey, params?: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams({
    portal: 'student',
    page,
  })

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        searchParams.set(key, value)
      }
    })
  }

  return `?${searchParams.toString()}`
}

export function buildFilterHref(filter: AssignmentFilter) {
  return buildStudentPortalHref('assignments', { filter })
}

export function buildClassTabItems(classId: string, activeTab: ClassDetailTab): SecondaryTabModel[] {
  const tabs: { key: ClassDetailTab; label: string }[] = [
    { key: 'overview', label: 'Tổng quan' },
    { key: 'assignments', label: 'Bài tập' },
    { key: 'results', label: 'Kết quả' },
    { key: 'announcements', label: 'Thông báo' },
  ]

  return tabs.map((tab) => ({
    label: tab.label,
    href: buildStudentPortalHref('class-detail', { classId, tab: tab.key }),
    isActive: tab.key === activeTab,
  }))
}

export function buildStudentNavItems(activePage: StudentPageKey): PortalNavItem[] {
  const pageToNav: Record<
    StudentPageKey,
    'dashboard' | 'classes' | 'assignments' | 'results' | 'feedback' | 'guide'
  > = {
    dashboard: 'dashboard',
    classes: 'classes',
    'class-detail': 'classes',
    assignments: 'assignments',
    'assignment-detail': 'assignments',
    results: 'results',
    'result-detail': 'results',
    feedback: 'feedback',
    profile: 'dashboard',
  }

  const activeNav = pageToNav[activePage]

  return [
    { label: 'Trang chủ', href: buildStudentPortalHref('dashboard'), isActive: activeNav === 'dashboard' },
    { label: 'Lớp học của tôi', href: buildStudentPortalHref('classes'), isActive: activeNav === 'classes' },
    { label: 'Bài tập', href: buildStudentPortalHref('assignments'), isActive: activeNav === 'assignments' },
    { label: 'Kết quả', href: buildStudentPortalHref('results'), isActive: activeNav === 'results' },
    { label: 'Phản hồi', href: buildStudentPortalHref('feedback'), isActive: activeNav === 'feedback' },
    { label: 'Hướng dẫn', href: buildStudentPortalHref('dashboard') + '#huong-dan', isActive: activeNav === 'guide' },
  ]
}

export function buildUserMenuLinks(): LinkItemModel[] {
  return [
    { label: 'Thông tin cá nhân', href: buildStudentPortalHref('profile') },
    { label: 'Đổi mật khẩu', href: buildStudentPortalHref('dashboard') + '#doi-mat-khau' },
    { label: 'Đăng xuất', href: '?' },
  ]
}

export function getSubmissionStatusMeta(status: SubmissionStatus): { label: string; tone: StatusTone } {
  switch (status) {
    case 'draft':
      return { label: 'Đang lưu nháp', tone: 'info' }
    case 'submitted':
      return { label: 'Đã nộp', tone: 'success' }
    case 'late':
      return { label: 'Quá hạn', tone: 'danger' }
    case 'not_submitted':
    default:
      return { label: 'Chưa nộp', tone: 'warning' }
  }
}

export function getGradingStatusMeta(status: GradingStatus): { label: string; tone: StatusTone } {
  switch (status) {
    case 'pending':
      return { label: 'Đang chờ chấm', tone: 'info' }
    case 'published':
      return { label: 'Đã có kết quả', tone: 'success' }
    case 'not_started':
    default:
      return { label: 'Chưa chấm', tone: 'neutral' }
  }
}

export function getFeedbackStatusMeta(status: FeedbackStatus): { label: string; tone: StatusTone } {
  switch (status) {
    case 'new':
      return { label: 'Mới cập nhật', tone: 'info' }
    case 'reply_required':
      return { label: 'Cần phản hồi', tone: 'warning' }
    case 'read':
    default:
      return { label: 'Đã xem', tone: 'neutral' }
  }
}

export function getCompletionStatusMeta(status: CompletionStatus): { label: string; tone: StatusTone } {
  switch (status) {
    case 'complete':
      return { label: 'Hoàn thành', tone: 'success' }
    case 'draft':
      return { label: 'Đang làm', tone: 'info' }
    case 'missing':
    default:
      return { label: 'Chưa làm', tone: 'warning' }
  }
}

export function getCompletionLabel(assignment: StudentAssignment) {
  const total = assignment.questions.length
  const complete = assignment.questions.filter((question) => question.completionStatus === 'complete').length
  return `${complete}/${total} câu đã hoàn thành`
}

export function getClassLabel(studentClass: StudentClass) {
  return `${studentClass.code} · ${studentClass.name}`
}

export function getAssignmentFilterLabel(filter: AssignmentFilter) {
  switch (filter) {
    case 'not_submitted':
      return 'Chưa nộp'
    case 'submitted':
      return 'Đã nộp'
    case 'late':
      return 'Quá hạn'
    case 'graded':
      return 'Đã có kết quả'
    case 'all':
    default:
      return 'Tất cả'
  }
}
