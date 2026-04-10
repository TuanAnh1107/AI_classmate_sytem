import type {
  DbAiGradingJob,
  DbAssignment,
  DbAuditLog,
  DbAuthLog,
  DbClass,
  DbClassStudent,
  DbCourse,
  DbDepartment,
  DbFaculty,
  DbFile,
  DbGrade,
  DbNotification,
  DbOrganizationMember,
  DbProfile,
  DbRole,
  DbRubric,
  DbRubricItem,
  DbRubricScore,
  DbSubmission,
  DbUniversity,
  DbUserRole,
} from './modernDb.types'

export const dbUniversities: DbUniversity[] = [
  { id: 'uni-hust', name: 'Đại học Bách Khoa Hà Nội', created_at: '2024-08-01T08:00:00+07:00' },
]

export const dbFaculties: DbFaculty[] = [
  { id: 'fac-ite', university_id: 'uni-hust', name: 'Viện Công nghệ Thông tin và Truyền thông' },
]

export const dbDepartments: DbDepartment[] = [
  {
    id: 'dep-se',
    faculty_id: 'fac-ite',
    name: 'Khoa Kỹ thuật Phần mềm',
    code: 'SE',
    created_at: '2024-08-01T08:00:00+07:00',
    updated_at: '2026-04-01T08:00:00+07:00',
  },
]

export const dbProfiles: DbProfile[] = [
  {
    id: 'admin-01',
    university_id: 'uni-hust',
    full_name: 'Quản trị hệ thống',
    avatar_url: null,
    status: 'active',
    created_at: '2025-08-20T09:00:00+07:00',
    updated_at: '2026-04-01T09:00:00+07:00',
  },
  {
    id: 'lect-it4409',
    university_id: 'uni-hust',
    full_name: 'TS. Vũ Đình Minh',
    avatar_url: null,
    status: 'active',
    created_at: '2025-08-20T09:10:00+07:00',
    updated_at: '2026-04-01T09:10:00+07:00',
  },
  {
    id: 'lect-em1180',
    university_id: 'uni-hust',
    full_name: 'TS. Lê Minh Hà',
    avatar_url: null,
    status: 'active',
    created_at: '2025-08-20T09:12:00+07:00',
    updated_at: '2026-04-01T09:12:00+07:00',
  },
  {
    id: '20231556',
    university_id: 'uni-hust',
    full_name: 'Nguyễn Tuấn Anh',
    avatar_url: null,
    status: 'active',
    created_at: '2025-08-20T09:20:00+07:00',
    updated_at: '2026-04-01T09:20:00+07:00',
  },
  {
    id: '20231572',
    university_id: 'uni-hust',
    full_name: 'Trần Mai Phương',
    avatar_url: null,
    status: 'active',
    created_at: '2025-08-20T09:22:00+07:00',
    updated_at: '2026-04-01T09:22:00+07:00',
  },
  {
    id: '20231604',
    university_id: 'uni-hust',
    full_name: 'Lê Minh Quân',
    avatar_url: null,
    status: 'active',
    created_at: '2025-08-20T09:24:00+07:00',
    updated_at: '2026-04-01T09:24:00+07:00',
  },
]

export const dbRoles: DbRole[] = [
  { id: 'role-admin', name: 'admin' },
  { id: 'role-lecturer', name: 'lecturer' },
  { id: 'role-student', name: 'student' },
]

export const dbUserRoles: DbUserRole[] = [
  { user_id: 'admin-01', role_id: 'role-admin' },
  { user_id: 'lect-it4409', role_id: 'role-lecturer' },
  { user_id: 'lect-em1180', role_id: 'role-lecturer' },
  { user_id: '20231556', role_id: 'role-student' },
  { user_id: '20231572', role_id: 'role-student' },
  { user_id: '20231604', role_id: 'role-student' },
]

export const dbOrganizationMembers: DbOrganizationMember[] = [
  {
    id: 'orgmem-admin',
    user_id: 'admin-01',
    university_id: 'uni-hust',
    faculty_id: 'fac-ite',
    department_id: 'dep-se',
    member_type: 'admin',
    status: 'active',
    joined_at: '2025-08-20T09:00:00+07:00',
    created_by: 'admin-01',
    updated_at: '2026-04-01T09:00:00+07:00',
  },
  {
    id: 'orgmem-lect-it4409',
    user_id: 'lect-it4409',
    university_id: 'uni-hust',
    faculty_id: 'fac-ite',
    department_id: 'dep-se',
    member_type: 'lecturer',
    status: 'active',
    joined_at: '2025-08-20T09:10:00+07:00',
    created_by: 'admin-01',
    updated_at: '2026-04-01T09:10:00+07:00',
  },
  {
    id: 'orgmem-lect-em1180',
    user_id: 'lect-em1180',
    university_id: 'uni-hust',
    faculty_id: 'fac-ite',
    department_id: 'dep-se',
    member_type: 'lecturer',
    status: 'active',
    joined_at: '2025-08-20T09:12:00+07:00',
    created_by: 'admin-01',
    updated_at: '2026-04-01T09:12:00+07:00',
  },
  {
    id: 'orgmem-stu-01',
    user_id: '20231556',
    university_id: 'uni-hust',
    faculty_id: 'fac-ite',
    department_id: 'dep-se',
    member_type: 'student',
    status: 'active',
    joined_at: '2025-08-20T09:20:00+07:00',
    created_by: 'admin-01',
    updated_at: '2026-04-01T09:20:00+07:00',
  },
  {
    id: 'orgmem-stu-02',
    user_id: '20231572',
    university_id: 'uni-hust',
    faculty_id: 'fac-ite',
    department_id: 'dep-se',
    member_type: 'student',
    status: 'active',
    joined_at: '2025-08-20T09:22:00+07:00',
    created_by: 'admin-01',
    updated_at: '2026-04-01T09:22:00+07:00',
  },
  {
    id: 'orgmem-stu-03',
    user_id: '20231604',
    university_id: 'uni-hust',
    faculty_id: 'fac-ite',
    department_id: 'dep-se',
    member_type: 'student',
    status: 'active',
    joined_at: '2025-08-20T09:24:00+07:00',
    created_by: 'admin-01',
    updated_at: '2026-04-01T09:24:00+07:00',
  },
]

export const dbCourses: DbCourse[] = [
  { id: 'course-it4409', faculty_id: 'fac-ite', name: 'Phát triển hệ thống đánh giá học tập thông minh' },
  { id: 'course-em1180', faculty_id: 'fac-ite', name: 'Phân tích dữ liệu giáo dục' },
]

export const dbClasses: DbClass[] = [
  {
    id: 'it4409',
    course_id: 'course-it4409',
    lecturer_id: 'lect-it4409',
    university_id: 'uni-hust',
    semester: '2025.2',
    created_at: '2025-09-01T08:00:00+07:00',
  },
  {
    id: 'em1180',
    course_id: 'course-em1180',
    lecturer_id: 'lect-em1180',
    university_id: 'uni-hust',
    semester: '2025.2',
    created_at: '2025-09-02T08:00:00+07:00',
  },
]

export const dbClassStudents: DbClassStudent[] = [
  { class_id: 'it4409', student_id: '20231556' },
  { class_id: 'it4409', student_id: '20231572' },
  { class_id: 'it4409', student_id: '20231604' },
  { class_id: 'em1180', student_id: '20231556' },
]

export const dbAssignments: DbAssignment[] = [
  {
    id: 'asg-it4409-01',
    class_id: 'it4409',
    university_id: 'uni-hust',
    title: 'Bài tập 01 - Phân tích rubric và luồng chấm điểm',
    description: 'Thiết kế rubric và mô tả luồng đánh giá tự động cho bài tập.',
    type: 'essay',
    deadline: '2026-04-09T23:59:00+07:00',
    created_by: 'lect-it4409',
    created_at: '2026-04-01T09:00:00+07:00',
  },
  {
    id: 'asg-it4409-02',
    class_id: 'it4409',
    university_id: 'uni-hust',
    title: 'Bài tập 02 - Thiết kế rubric phản biện nhóm',
    description: 'Xây dựng rubric đánh giá theo nhóm và hướng dẫn nộp bài.',
    type: 'essay',
    deadline: '2026-04-03T23:59:00+07:00',
    created_by: 'lect-it4409',
    created_at: '2026-03-18T10:30:00+07:00',
  },
  {
    id: 'asg-em1180-01',
    class_id: 'em1180',
    university_id: 'uni-hust',
    title: 'Bài phản hồi tuần 6 - Đọc và phản biện tài liệu',
    description: 'Viết phản biện theo cấu trúc học thuật và nhận xét có dẫn chứng.',
    type: 'essay',
    deadline: '2026-03-29T17:00:00+07:00',
    created_by: 'lect-em1180',
    created_at: '2026-03-12T11:20:00+07:00',
  },
]

export const dbSubmissions: DbSubmission[] = [
  {
    id: 'sub-01',
    assignment_id: 'asg-it4409-01',
    class_id: 'it4409',
    university_id: 'uni-hust',
    student_id: '20231556',
    file_url: 'https://files.hust.edu.vn/submissions/it4409/sub-01.pdf',
    version: 1,
    submitted_at: '2026-04-08T18:20:00+07:00',
  },
  {
    id: 'sub-02',
    assignment_id: 'asg-it4409-02',
    class_id: 'it4409',
    university_id: 'uni-hust',
    student_id: '20231556',
    file_url: 'https://files.hust.edu.vn/submissions/it4409/sub-02.pdf',
    version: 1,
    submitted_at: '2026-04-03T21:14:00+07:00',
  },
  {
    id: 'sub-04',
    assignment_id: 'asg-em1180-01',
    class_id: 'em1180',
    university_id: 'uni-hust',
    student_id: '20231556',
    file_url: 'https://files.hust.edu.vn/submissions/em1180/sub-04.pdf',
    version: 1,
    submitted_at: '2026-03-29T15:24:00+07:00',
  },
]

export const dbGrades: DbGrade[] = [
  {
    id: 'grade-001',
    submission_id: 'sub-02',
    class_id: 'it4409',
    university_id: 'uni-hust',
    grader_id: 'lect-it4409',
    total_score: 8.5,
    feedback: 'Đã hoàn thành đầy đủ rubric, cần làm rõ hơn phần đánh giá tự động.',
    graded_at: '2026-04-09T10:30:00+07:00',
  },
  {
    id: 'grade-002',
    submission_id: 'sub-04',
    class_id: 'em1180',
    university_id: 'uni-hust',
    grader_id: 'lect-em1180',
    total_score: 8.6,
    feedback: 'Lập luận chắc, cần rút gọn phần dẫn nhập và bổ sung ví dụ thực tế.',
    graded_at: '2026-04-02T09:10:00+07:00',
  },
]

export const dbRubrics: DbRubric[] = [
  {
    id: 'rubric-001',
    assignment_id: 'asg-it4409-01',
    university_id: 'uni-hust',
    title: 'Rubric đánh giá bài tập 01',
  },
]

export const dbRubricItems: DbRubricItem[] = [
  { id: 'rubric-item-1', rubric_id: 'rubric-001', description: 'Độ rõ ràng của rubric', max_score: 3 },
  { id: 'rubric-item-2', rubric_id: 'rubric-001', description: 'Tính khả thi khi triển khai', max_score: 3 },
  { id: 'rubric-item-3', rubric_id: 'rubric-001', description: 'Tính đầy đủ của luồng chấm', max_score: 4 },
]

export const dbRubricScores: DbRubricScore[] = [
  { id: 'rub-score-1', grade_id: 'grade-001', rubric_item_id: 'rubric-item-1', score: 3 },
  { id: 'rub-score-2', grade_id: 'grade-001', rubric_item_id: 'rubric-item-2', score: 2.5 },
  { id: 'rub-score-3', grade_id: 'grade-001', rubric_item_id: 'rubric-item-3', score: 3 },
]

export const dbAiGradingJobs: DbAiGradingJob[] = [
  {
    id: 'ai-job-001',
    submission_id: 'sub-01',
    class_id: 'it4409',
    university_id: 'uni-hust',
    status: 'done',
    external_job_id: 'openai-job-7781',
    prompt_version: 'v2.1',
    result_json: { score: 8.2, notes: 'Rubric phù hợp, cần làm rõ tiêu chí 2.' },
    created_at: '2026-04-08T19:00:00+07:00',
    completed_at: '2026-04-08T19:05:00+07:00',
  },
]

export const dbFiles: DbFile[] = [
  {
    id: 'file-001',
    owner_id: '20231556',
    university_id: 'uni-hust',
    url: 'https://files.hust.edu.vn/submissions/it4409/sub-01.pdf',
    type: 'pdf',
    created_at: '2026-04-08T18:21:00+07:00',
  },
]

export const dbNotifications: DbNotification[] = [
  {
    id: 'ntf-001',
    user_id: '20231556',
    university_id: 'uni-hust',
    content: 'Bài tập 01 được gia hạn thêm 12 giờ do điều chỉnh rubric.',
    is_read: false,
    created_at: '2026-04-05T09:00:00+07:00',
  },
  {
    id: 'ntf-002',
    user_id: '20231556',
    university_id: 'uni-hust',
    content: 'Giảng viên đã cập nhật nhận xét cho bài phản hồi tuần 6.',
    is_read: true,
    created_at: '2026-04-03T15:40:00+07:00',
  },
]

export const dbAuditLogs: DbAuditLog[] = [
  {
    id: 'audit-001',
    user_id: 'admin-01',
    university_id: 'uni-hust',
    action: 'UPDATE_ROLE',
    entity: 'profiles',
    entity_id: '20231556',
    created_at: '2026-04-04T14:20:00+07:00',
  },
]

export const dbAuthLogs: DbAuthLog[] = [
  {
    id: 'auth-001',
    user_id: 'lect-it4409',
    event_type: 'login_success',
    ip_address: '203.0.113.8',
    user_agent: 'Chrome 124',
    created_at: '2026-04-06T08:45:00+07:00',
  },
]

