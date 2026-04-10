import type { DataState, StatusTone } from '../../models/shared/portal.types'
import type { AdminPageFrame } from '../../models/admin/admin.types'
import { formatPortalDateTime } from '../../models/student/student.mappers'
import { useAdminPortalShellController } from './useAdminPortalShellController'
import {
  getOperationalAlerts,
  getRecentSystemActivity,
  getUniversityScopedOperationalData,
} from '../../services/domain/sourceOfTruth'

type DashboardStat = {
  id: string
  label: string
  value: string
  tone?: Exclude<StatusTone, 'danger'>
}

type DashboardHighlight = {
  id: string
  title: string
  detail: string
  meta: string
  href: string
  tone: StatusTone
}

type DashboardQuickLink = {
  id: string
  label: string
  detail: string
  href: string
}

type DashboardActivity = {
  id: string
  title: string
  detail: string
  createdAtLabel: string
}

export interface AdminDashboardViewModel {
  frame: AdminPageFrame
  state: DataState
  stats: DashboardStat[]
  highlights: DashboardHighlight[]
  alerts: DashboardHighlight[]
  quickLinks: DashboardQuickLink[]
  activities: DashboardActivity[]
  errorMessage?: string
}

export function useAdminDashboardController(state: DataState): AdminDashboardViewModel {
  const shell = useAdminPortalShellController('dashboard')
  const scoped = getUniversityScopedOperationalData()

  const frame: AdminPageFrame = {
    shell,
    pageTitle: '',
    pageDescription: '',
    breadcrumbs: [{ label: 'Trang chủ', href: '?portal=admin&page=dashboard' }, { label: 'Tổng quan quản trị' }],
  }

  if (state === 'loading') {
    return {
      frame,
      state,
      stats: [],
      highlights: [],
      alerts: [],
      quickLinks: [],
      activities: [],
    }
  }

  if (state === 'error') {
    return {
      frame,
      state,
      stats: [],
      highlights: [],
      alerts: [],
      quickLinks: [],
      activities: [],
      errorMessage: 'Không thể tải tổng quan hệ thống vào lúc này.',
    }
  }

  const roleById = new Map(scoped.roles.map((role) => [role.id, role.name]))
  const userRoleByUserId = new Map(
    scoped.userRoles.map((item) => [item.user_id, roleById.get(item.role_id) ?? 'student']),
  )

  const totalLecturers = scoped.profiles.filter((profile) => userRoleByUserId.get(profile.id) === 'lecturer').length
  const totalStudents = scoped.profiles.filter((profile) => userRoleByUserId.get(profile.id) === 'student').length
  const totalAdmins = scoped.profiles.filter((profile) => userRoleByUserId.get(profile.id) === 'admin').length

  const now = Date.now()
  const openAssignments = scoped.assignments.filter((assignment) => new Date(assignment.deadline).getTime() >= now)
  const overdueAssignments = scoped.assignments.filter((assignment) => new Date(assignment.deadline).getTime() < now)
  const pendingGrading = scoped.submissions.filter(
    (submission) => !scoped.grades.some((grade) => grade.submission_id === submission.id),
  )
  const aiFailed = scoped.aiGradingJobs.filter((job) => job.status === 'failed').length

  const stats: DashboardStat[] = [
    { id: 'users', label: 'Tổng người dùng', value: String(scoped.profiles.length), tone: 'info' },
    { id: 'admins', label: 'Admin', value: String(totalAdmins), tone: 'neutral' },
    { id: 'lecturers', label: 'Giảng viên', value: String(totalLecturers), tone: 'warning' },
    { id: 'students', label: 'Sinh viên', value: String(totalStudents), tone: 'success' },
    { id: 'classes', label: 'Lớp đang quản lý', value: String(scoped.classes.length), tone: 'info' },
    { id: 'open-assignments', label: 'Assignment đang mở', value: String(openAssignments.length), tone: 'success' },
    { id: 'pending-grading', label: 'Bài nộp chưa chấm', value: String(pendingGrading.length), tone: 'warning' },
    { id: 'ai-failed', label: 'AI grading lỗi', value: String(aiFailed), tone: 'warning' },
  ]

  const classStudentCount = new Map<string, number>()
  scoped.classes.forEach((item) => {
    classStudentCount.set(item.id, scoped.classStudents.filter((row) => row.class_id === item.id).length)
  })

  const highlights: DashboardHighlight[] = scoped.assignments
    .map((assignment) => {
      const classSize = classStudentCount.get(assignment.class_id) ?? 0
      const submissions = scoped.submissions.filter((submission) => submission.assignment_id === assignment.id)
      const pending = submissions.filter(
        (submission) => !scoped.grades.some((grade) => grade.submission_id === submission.id),
      ).length
      const coverage = classSize ? Math.round((submissions.length / classSize) * 100) : 0
      const isOverdue = overdueAssignments.some((item) => item.id === assignment.id)

      return {
        id: assignment.id,
        title: assignment.title,
        detail: `${assignment.class_id.toUpperCase()} · ${submissions.length}/${classSize || 0} bài nộp · ${pending} bài chờ chấm`,
        meta: isOverdue ? `Quá hạn · ${coverage}% coverage` : `Đến hạn ${formatPortalDateTime(assignment.deadline)} · ${coverage}% coverage`,
        href: `?portal=admin&page=assignments&detailId=${assignment.id}`,
        tone: (isOverdue || coverage < 60 ? 'warning' : pending > 0 ? 'info' : 'success') as StatusTone,
      }
    })
    .sort((a, b) => {
      const priorityA = a.tone === 'warning' ? 2 : a.tone === 'info' ? 1 : 0
      const priorityB = b.tone === 'warning' ? 2 : b.tone === 'info' ? 1 : 0
      return priorityB - priorityA
    })
    .slice(0, 4)

  const alerts: DashboardHighlight[] = getOperationalAlerts().map((alert) => ({
    id: alert.id,
    title: alert.title,
    detail: alert.detail,
    meta: alert.tone === 'danger' ? 'Cần xử lý ngay' : alert.tone === 'warning' ? 'Cần theo dõi' : 'Thông tin vận hành',
    href: alert.href ?? '?portal=admin&page=dashboard',
    tone: alert.tone as StatusTone,
  }))

  const activities = getRecentSystemActivity()
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      title: item.title,
      detail: item.detail,
      createdAtLabel: formatPortalDateTime(item.createdAt),
    }))

  const quickLinks: DashboardQuickLink[] = [
    {
      id: 'users',
      label: 'Mở quản trị người dùng',
      detail: 'Tra cứu tài khoản, phân quyền và khóa hoặc mở khóa nhanh.',
      href: '?portal=admin&page=users',
    },
    {
      id: 'classes',
      label: 'Xem lớp cần chú ý',
      detail: 'Đi tới danh sách lớp với drill-down sĩ số, bài tập và tiến độ nộp.',
      href: '?portal=admin&page=classes',
    },
    {
      id: 'assignments',
      label: 'Đi tới điều phối bài tập',
      detail: 'Lọc assignment theo deadline, coverage và trạng thái mở hoặc đóng.',
      href: '?portal=admin&page=assignments',
    },
    {
      id: 'submissions',
      label: 'Mở hàng đợi bài nộp',
      detail: 'Ưu tiên các bài chưa chấm, nộp trễ và bài cần rà soát AI.',
      href: '?portal=admin&page=submissions',
    },
  ]

  if (state === 'empty') {
    return {
      frame,
      state,
      stats,
      highlights: [],
      alerts: [],
      quickLinks,
      activities: [],
    }
  }

  return {
    frame,
    state,
    stats,
    highlights,
    alerts,
    quickLinks,
    activities,
  }
}
