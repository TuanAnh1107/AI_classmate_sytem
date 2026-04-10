import type { RbacClass, RbacEnrollment, RbacUser, UserRole } from './rbac.types'
import { rbacClassesMock, rbacEnrollmentsMock, rbacUsersMock } from './rbac.mock'

export function getUserById(userId: string): RbacUser | undefined {
  return rbacUsersMock.find((user) => user.id === userId)
}

export function getLecturerClasses(lecturerId: string): RbacClass[] {
  return rbacClassesMock.filter((item) => item.lecturerId === lecturerId)
}

export function getClassStudents(classId: string): RbacUser[] {
  const studentIds = rbacEnrollmentsMock.filter((item) => item.classId === classId).map((item) => item.studentId)
  return rbacUsersMock.filter((user) => user.role === 'student' && studentIds.includes(user.id))
}

export function getUserClasses(userId: string, role: UserRole): RbacClass[] {
  if (role === 'lecturer') {
    return getLecturerClasses(userId)
  }
  if (role === 'student') {
    const enrolled = rbacEnrollmentsMock.filter((item) => item.studentId === userId)
    return rbacClassesMock.filter((item) => enrolled.some((en) => en.classId === item.id))
  }
  return rbacClassesMock
}

export function canLecturerManageClass(lecturerId: string, classId: string): boolean {
  return rbacClassesMock.some((item) => item.id === classId && item.lecturerId === lecturerId)
}

export function canStudentAccessClass(studentId: string, classId: string): boolean {
  return rbacEnrollmentsMock.some((item) => item.classId === classId && item.studentId === studentId)
}

export function getEnrollmentList(): RbacEnrollment[] {
  return rbacEnrollmentsMock
}

