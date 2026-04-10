export type DbRoleName = 'admin' | 'lecturer' | 'student'

export interface DbUniversity {
  id: string
  name: string
  created_at: string
}

export interface DbFaculty {
  id: string
  university_id: string
  name: string
}

export interface DbDepartment {
  id: string
  faculty_id: string
  name: string
  code: string
  created_at: string
  updated_at: string
}

export interface DbProfile {
  id: string
  university_id: string
  full_name: string
  avatar_url?: string | null
  status: 'active' | 'disabled' | 'pending'
  created_at: string
  updated_at: string
}

export interface DbRole {
  id: string
  name: DbRoleName
}

export interface DbUserRole {
  user_id: string
  role_id: string
}

export interface DbOrganizationMember {
  id: string
  user_id: string
  university_id: string
  faculty_id: string
  department_id: string
  member_type: DbRoleName
  status: 'active' | 'inactive'
  joined_at: string
  created_by?: string | null
  updated_at: string
}

export interface DbCourse {
  id: string
  faculty_id: string
  name: string
}

export interface DbClass {
  id: string
  course_id: string
  lecturer_id: string
  university_id: string
  semester: string
  created_at: string
}

export interface DbClassStudent {
  class_id: string
  student_id: string
}

export interface DbAssignment {
  id: string
  class_id: string
  university_id: string
  title: string
  description: string
  type: 'essay' | 'code' | 'mcq'
  deadline: string
  created_by: string
  created_at: string
}

export interface DbSubmission {
  id: string
  assignment_id: string
  class_id: string
  university_id: string
  student_id: string
  file_url?: string | null
  version: number
  submitted_at: string
}

export interface DbGrade {
  id: string
  submission_id: string
  class_id: string
  university_id: string
  grader_id: string
  total_score: number
  feedback: string
  graded_at: string
}

export interface DbRubric {
  id: string
  assignment_id: string
  university_id: string
  title: string
}

export interface DbRubricItem {
  id: string
  rubric_id: string
  description: string
  max_score: number
}

export interface DbRubricScore {
  id: string
  grade_id: string
  rubric_item_id: string
  score: number
}

export interface DbAiGradingJob {
  id: string
  submission_id: string
  class_id: string
  university_id: string
  status: 'pending' | 'processing' | 'done' | 'failed'
  external_job_id?: string | null
  prompt_version?: string | null
  result_json?: Record<string, unknown> | null
  created_at: string
  completed_at?: string | null
}

export interface DbFile {
  id: string
  owner_id: string
  university_id: string
  url: string
  type: string
  created_at: string
}

export interface DbNotification {
  id: string
  user_id: string
  university_id: string
  content: string
  is_read: boolean
  created_at: string
}

export interface DbAuditLog {
  id: string
  user_id: string
  university_id: string
  action: string
  entity: string
  entity_id: string
  created_at: string
}

export interface DbAuthLog {
  id: string
  user_id: string
  event_type: string
  ip_address: string
  user_agent: string
  created_at: string
}
