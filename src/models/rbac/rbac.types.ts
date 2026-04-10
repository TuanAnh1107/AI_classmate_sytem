export type UserRole = 'admin' | 'lecturer' | 'student'

export interface RbacUser {
  id: string
  fullName: string
  email: string
  role: UserRole
}

export interface RbacClass {
  id: string
  code: string
  name: string
  lecturerId: string
}

export interface RbacEnrollment {
  classId: string
  studentId: string
}

