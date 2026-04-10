import {
  dbAiGradingJobs,
  dbAssignments,
  dbAuditLogs,
  dbAuthLogs,
  dbClasses,
  dbClassStudents,
  dbCourses,
  dbDepartments,
  dbFaculties,
  dbFiles,
  dbGrades,
  dbNotifications,
  dbOrganizationMembers,
  dbProfiles,
  dbRoles,
  dbRubricItems,
  dbRubrics,
  dbRubricScores,
  dbSubmissions,
  dbUniversities,
  dbUserRoles,
} from '../../models/db/modernDb.mock'
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

export const ACTIVE_UNIVERSITY_ID = 'uni-hust'

export const ACTIVE_DOMAIN_TABLES = [
  'profiles',
  'roles',
  'user_roles',
  'organization_members',
  'universities',
  'faculties',
  'departments',
  'classes',
  'class_students',
  'courses',
  'assignments',
  'submissions',
  'grades',
  'rubrics',
  'rubric_items',
  'rubric_scores',
  'ai_grading_jobs',
  'files',
  'notifications',
  'audit_logs',
  'auth_logs',
] as const

export const LEGACY_COMPATIBILITY_TABLES = [
  'info_assignment',
  'content_assignment',
  'assignment_question',
  'info_question',
  'content_question',
  'content_file_question',
  'rubric_question',
  'assignment_list_submission',
  'info_submission',
  'content_submission',
  'content_file_submission',
  'result_submission',
  'result_feedback',
  'feedback_submission',
] as const

export type OperationalAlertTone = 'info' | 'warning' | 'danger' | 'success'

export interface OperationalAlert {
  id: string
  title: string
  detail: string
  tone: OperationalAlertTone
  href?: string
}

export interface ActivityFeedItem {
  id: string
  title: string
  detail: string
  createdAt: string
  href?: string
}

const notificationReadOverrides = new Map<string, boolean>()

export function getUniversityScopedOperationalData(universityId = ACTIVE_UNIVERSITY_ID) {
  return {
    university: dbUniversities.find((item) => item.id === universityId),
    faculties: dbFaculties.filter((item) => item.university_id === universityId),
    departments: dbDepartments,
    profiles: dbProfiles.filter((item) => item.university_id === universityId),
    roles: dbRoles,
    userRoles: dbUserRoles,
    organizationMembers: dbOrganizationMembers.filter((item) => item.university_id === universityId),
    classes: dbClasses.filter((item) => item.university_id === universityId),
    classStudents: dbClassStudents,
    courses: dbCourses,
    assignments: dbAssignments.filter((item) => item.university_id === universityId),
    submissions: dbSubmissions.filter((item) => item.university_id === universityId),
    grades: dbGrades.filter((item) => item.university_id === universityId),
    rubrics: dbRubrics.filter((item) => item.university_id === universityId),
    rubricItems: dbRubricItems,
    rubricScores: dbRubricScores,
    aiGradingJobs: dbAiGradingJobs.filter((item) => item.university_id === universityId),
    files: dbFiles.filter((item) => item.university_id === universityId),
    notifications: dbNotifications.filter((item) => item.university_id === universityId),
    auditLogs: dbAuditLogs.filter((item) => item.university_id === universityId),
    authLogs: dbAuthLogs,
  }
}

export function getLegacyAssignmentBundle() {
  return {
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
}

export function getProfileById(profileId: string) {
  return dbProfiles.find((item) => item.id === profileId)
}

export function getAssignmentById(assignmentId: string) {
  return dbAssignments.find((item) => item.id === assignmentId)
}

export function getClassById(classId: string) {
  return dbClasses.find((item) => item.id === classId)
}

export function getSubmissionById(submissionId: string) {
  return dbSubmissions.find((item) => item.id === submissionId)
}

export function getNotificationsForUser(userId: string, universityId = ACTIVE_UNIVERSITY_ID) {
  return dbNotifications
    .filter((item) => item.user_id === userId && item.university_id === universityId)
    .map((item) => ({
      ...item,
      is_read: notificationReadOverrides.get(item.id) ?? item.is_read,
    }))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
}

export function markNotificationRead(notificationId: string) {
  notificationReadOverrides.set(notificationId, true)
}

export function markNotificationUnread(notificationId: string) {
  notificationReadOverrides.set(notificationId, false)
}

export function getOperationalAlerts(universityId = ACTIVE_UNIVERSITY_ID): OperationalAlert[] {
  const scoped = getUniversityScopedOperationalData(universityId)
  const alerts: OperationalAlert[] = []

  const failedJobs = scoped.aiGradingJobs.filter((job) => job.status === 'failed')
  if (failedJobs.length) {
    alerts.push({
      id: 'alert-ai-failed',
      title: 'Có tác vụ AI grading thất bại',
      detail: `${failedJobs.length} bài nộp đang cần rà soát lại hàng đợi chấm tự động.`,
      tone: 'danger',
      href: '?portal=admin&page=submissions',
    })
  }

  const processingJobs = scoped.aiGradingJobs.filter((job) => job.status === 'processing')
  if (processingJobs.length) {
    alerts.push({
      id: 'alert-ai-processing',
      title: 'Hàng đợi AI grading đang xử lý',
      detail: `${processingJobs.length} tác vụ đang chạy, nên ưu tiên theo dõi tiến độ chấm ở các lớp đông.`,
      tone: 'info',
      href: '?portal=admin&page=submissions',
    })
  }

  const disabledMembers = scoped.profiles.filter((profile) => profile.status !== 'active')
  if (disabledMembers.length) {
    alerts.push({
      id: 'alert-account-review',
      title: 'Có tài khoản cần kiểm tra trạng thái',
      detail: `${disabledMembers.length} tài khoản đang ở trạng thái chờ kích hoạt hoặc đã khóa.`,
      tone: 'warning',
      href: '?portal=admin&page=users',
    })
  }

  const assignmentsWithoutCoverage = scoped.assignments.filter((assignment) => {
    const classStudents = scoped.classStudents.filter((item) => item.class_id === assignment.class_id)
    const submissions = scoped.submissions.filter((item) => item.assignment_id === assignment.id)
    if (!classStudents.length) {
      return false
    }
    return submissions.length / classStudents.length < 0.5
  })

  if (assignmentsWithoutCoverage.length) {
    alerts.push({
      id: 'alert-low-coverage',
      title: 'Có bài tập có tỷ lệ nộp thấp',
      detail: `${assignmentsWithoutCoverage.length} bài tập dưới ngưỡng 50% bài nộp, cần nhắc lớp hoặc kiểm tra deadline.`,
      tone: 'warning',
      href: '?portal=admin&page=assignments',
    })
  }

  return alerts
}

export function getRecentSystemActivity(universityId = ACTIVE_UNIVERSITY_ID): ActivityFeedItem[] {
  const scoped = getUniversityScopedOperationalData(universityId)

  const auditItems: ActivityFeedItem[] = scoped.auditLogs.map((item) => ({
    id: `audit-${item.id}`,
    title: item.action.replaceAll('_', ' '),
    detail: `${item.entity} · ${item.entity_id}`,
    createdAt: item.created_at,
    href: '?portal=admin&page=users',
  }))

  const authItems: ActivityFeedItem[] = scoped.authLogs
    .filter((item) => getProfileById(item.user_id)?.university_id === universityId)
    .map((item) => ({
      id: `auth-${item.id}`,
      title: item.event_type.replaceAll('_', ' '),
      detail: `${item.user_agent} · ${item.ip_address}`,
      createdAt: item.created_at,
      href: '?portal=admin&page=users',
    }))

  return [...auditItems, ...authItems].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
