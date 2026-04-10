import type { UserRole } from '../rbac/rbac.types'
import {
  dbClasses,
  dbCourses,
  dbDepartments,
  dbFaculties,
  dbOrganizationMembers,
  dbProfiles,
  dbRoles,
  dbUserRoles,
} from '../db/modernDb.mock'

export type AccountStatus = 'active' | 'disabled' | 'pending'

export type AdminUserAccount = {
  id: string
  fullName: string
  email: string
  role: UserRole
  status: AccountStatus
  unitLabel: string
  lastLoginAt?: string
  createdAt: string
  classIds: string[]
}

export type AdminClassMeta = {
  id: string
  semester: string
  status: 'active' | 'paused' | 'completed'
  faculty: string
}

const roleById = new Map(dbRoles.map((role) => [role.id, role.name]))
const userRoleByUser = new Map(dbUserRoles.map((item) => [item.user_id, roleById.get(item.role_id)]))
const facultyById = new Map(dbFaculties.map((item) => [item.id, item]))
const departmentById = new Map(dbDepartments.map((item) => [item.id, item]))
const orgMemberByUser = new Map(dbOrganizationMembers.map((item) => [item.user_id, item]))
const courseById = new Map(dbCourses.map((course) => [course.id, course]))

const emailFallbacks: Record<string, string> = {
  'admin-01': 'admin@aiclassmate.edu.vn',
  'lect-it4409': 'minh.vudinh@hust.edu.vn',
  'lect-em1180': 'ha.lm@soict.hust.edu.vn',
  '20231556': 'anh.nt231556@sis.hust.edu.vn',
  '20231572': 'phuong.tm231572@sis.hust.edu.vn',
  '20231604': 'quan.lm231604@sis.hust.edu.vn',
}

const userClassMap = new Map<string, string[]>()
dbClasses.forEach((clazz) => {
  if (clazz.lecturer_id) {
    const lecturerClasses = userClassMap.get(clazz.lecturer_id) ?? []
    lecturerClasses.push(clazz.id)
    userClassMap.set(clazz.lecturer_id, lecturerClasses)
  }
})

export const adminUsersMock: AdminUserAccount[] = dbProfiles.map((profile) => {
  const role = (userRoleByUser.get(profile.id) ?? 'student') as UserRole
  const member = orgMemberByUser.get(profile.id)
  const department = member ? departmentById.get(member.department_id) : undefined
  const faculty = member ? facultyById.get(member.faculty_id) : undefined
  const unitLabel = department?.name ?? faculty?.name ?? 'Trường Đại học Bách Khoa Hà Nội'

  return {
    id: profile.id,
    fullName: profile.full_name,
    email: emailFallbacks[profile.id] ?? 'user@aiclassmate.edu.vn',
    role,
    status: profile.status,
    unitLabel,
    lastLoginAt: '2026-04-06T09:10:00+07:00',
    createdAt: profile.created_at,
    classIds: userClassMap.get(profile.id) ?? [],
  }
})

export const adminClassMetaMock: AdminClassMeta[] = dbClasses.map((clazz) => {
  const course = courseById.get(clazz.course_id)
  const faculty = course ? facultyById.get(course.faculty_id) : undefined

  return {
    id: clazz.id,
    semester: clazz.semester,
    status: 'active',
    faculty: faculty?.name ?? 'Viện Công nghệ Thông tin và Truyền thông',
  }
})
