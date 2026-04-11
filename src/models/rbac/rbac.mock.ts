import type { RbacClass, RbacEnrollment, RbacUser } from './rbac.types'

export const rbacUsersMock: RbacUser[] = [
  { id: 'admin-01', fullName: 'Quản trị hệ thống', email: 'admin@aiclassmate.edu.vn', role: 'admin' },
  { id: 'lect-it4409', fullName: 'TS. Vũ Đình Minh', email: 'minh.vudinh@hust.edu.vn', role: 'lecturer' },
  { id: 'lect-em1180', fullName: 'TS. Lê Minh Hà', email: 'ha.lm@soict.hust.edu.vn', role: 'lecturer' },
  { id: 'lect-mi2021', fullName: 'PGS. Lê Quang Việt', email: 'viet.lq@hust.edu.vn', role: 'lecturer' },
  { id: '20231556', fullName: 'Nguyễn Tuấn Anh', email: 'anh.nt231556@sis.hust.edu.vn', role: 'student' },
  { id: '20231572', fullName: 'Trần Mai Phương', email: 'phuong.tm231572@sis.hust.edu.vn', role: 'student' },
  { id: '20231604', fullName: 'Lê Minh Quân', email: 'quan.lm231604@sis.hust.edu.vn', role: 'student' },
  { id: '20231688', fullName: 'Phạm Gia Huy', email: 'huy.pg231688@sis.hust.edu.vn', role: 'student' },
  { id: '20231702', fullName: 'Bùi Khánh Linh', email: 'linh.bk231702@sis.hust.edu.vn', role: 'student' },
]

export const rbacClassesMock: RbacClass[] = [
  {
    id: 'it4409',
    code: 'IT4409',
    name: 'Phát triển hệ thống đánh giá học tập thông minh',
    lecturerId: 'lect-it4409',
  },
  {
    id: 'em1180',
    code: 'EM1180',
    name: 'Phân tích dữ liệu giáo dục',
    lecturerId: 'lect-em1180',
  },
  {
    id: 'mi2021',
    code: 'MI2021',
    name: 'Xác suất thống kê',
    lecturerId: 'lect-mi2021',
  },
]

export const rbacEnrollmentsMock: RbacEnrollment[] = [
  { classId: 'it4409', studentId: '20231556' },
  { classId: 'it4409', studentId: '20231572' },
  { classId: 'it4409', studentId: '20231604' },
  { classId: 'it4409', studentId: '20231688' },
  { classId: 'it4409', studentId: '20231702' },
  { classId: 'em1180', studentId: '20231556' },
  { classId: 'em1180', studentId: '20231572' },
  { classId: 'mi2021', studentId: '20231556' },
  { classId: 'mi2021', studentId: '20231688' },
]
