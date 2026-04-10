import type { DbRoleName } from '../../models/db/modernDb.types'
import {
  ACTIVE_UNIVERSITY_ID,
  getAssignmentById,
  getClassById,
  getNotificationsForUser,
  getProfileById,
  getSubmissionById,
  getUniversityScopedOperationalData,
} from './sourceOfTruth'

export function getUserRole(userId: string): DbRoleName | undefined {
  const scoped = getUniversityScopedOperationalData()
  const roleById = new Map(scoped.roles.map((role) => [role.id, role.name]))
  const userRole = scoped.userRoles.find((item) => item.user_id === userId)
  return userRole ? roleById.get(userRole.role_id) : undefined
}

export function isUserInUniversity(userId: string, universityId = ACTIVE_UNIVERSITY_ID) {
  return getProfileById(userId)?.university_id === universityId
}

export function canAdminAccessUniversity(userId: string, universityId = ACTIVE_UNIVERSITY_ID) {
  return getUserRole(userId) === 'admin' && isUserInUniversity(userId, universityId)
}

export function canLecturerManageClass(lecturerId: string, classId: string) {
  const classItem = getClassById(classId)
  return Boolean(classItem && classItem.lecturer_id === lecturerId)
}

export function canLecturerManageAssignment(lecturerId: string, assignmentId: string) {
  const assignment = getAssignmentById(assignmentId)
  if (!assignment) {
    return false
  }
  return assignment.created_by === lecturerId || canLecturerManageClass(lecturerId, assignment.class_id)
}

export function canLecturerManageSubmission(lecturerId: string, submissionId: string) {
  const submission = getSubmissionById(submissionId)
  if (!submission) {
    return false
  }
  return canLecturerManageAssignment(lecturerId, submission.assignment_id)
}

export function canStudentViewClass(studentId: string, classId: string) {
  const scoped = getUniversityScopedOperationalData()
  return scoped.classStudents.some((item) => item.class_id === classId && item.student_id === studentId)
}

export function canStudentViewAssignment(studentId: string, assignmentId: string) {
  const assignment = getAssignmentById(assignmentId)
  if (!assignment) {
    return false
  }
  return canStudentViewClass(studentId, assignment.class_id)
}

export function canStudentViewSubmission(studentId: string, submissionId: string) {
  const submission = getSubmissionById(submissionId)
  if (!submission) {
    return false
  }
  return submission.student_id === studentId
}

export function canStudentViewNotification(studentId: string, notificationId: string) {
  return getNotificationsForUser(studentId).some((item) => item.id === notificationId)
}
