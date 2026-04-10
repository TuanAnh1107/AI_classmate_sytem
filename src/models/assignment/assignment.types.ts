export type AssignmentStatus = 'draft' | 'published' | 'closed'
export type SubmissionStatus = 'draft' | 'submitted' | 'late'

export interface AssignmentResourceLink {
  id: string
  label: string
  url: string
}

export interface AssignmentRequirement {
  label: string
  detail: string
}

export interface QuestionRubricItem {
  id: string
  label: string
  detail: string
  maxScore: number
}

export interface AssignmentQuestion {
  id: string
  order: number
  prompt: string
  attachmentName?: string
  rubric: QuestionRubricItem[]
}

export interface Assignment {
  id: string
  classId: string
  title: string
  description: string
  createdBy: string
  dueAt: string
  allowLateSubmission: boolean
  maxScore: number
  resourceLinks: AssignmentResourceLink[]
  createdAt: string
  updatedAt: string
  status: AssignmentStatus
  requirements: AssignmentRequirement[]
  instructions: string[]
  questions: AssignmentQuestion[]
  allowedSubmissionFormats: string[]
}

export interface Submission {
  id: string
  assignmentId: string
  studentId: string
  contentText: string
  attachmentUrls: string[]
  submittedAt?: string
  status: SubmissionStatus
  score?: number
  feedback?: string
  updatedAt: string
}
