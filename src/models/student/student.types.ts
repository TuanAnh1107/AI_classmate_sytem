import type {
  DataState,
  FooterModel,
  HeaderUserMenuModel,
  PortalNavItem,
  SecondaryTabModel,
  StatusTone,
  UtilityBarModel,
} from '../shared/portal.types'

export type SubmissionStatus = 'not_submitted' | 'draft' | 'submitted' | 'late'
export type GradingStatus = 'not_started' | 'pending' | 'published'
export type FeedbackStatus = 'new' | 'read' | 'reply_required'
export type CompletionStatus = 'complete' | 'draft' | 'missing'
export type SupportTone = 'neutral' | 'warning' | 'positive'
export type ClassDetailTab = 'overview' | 'assignments' | 'results' | 'announcements'
export type AssignmentFilter = 'all' | 'not_submitted' | 'submitted' | 'late' | 'graded'

export interface StudentProfile {
  id: string
  fullName: string
  studentCode: string
  faculty: string
  program: string
  email: string
}

export interface StudentClass {
  id: string
  code: string
  name: string
  lecturerName: string
  lecturerEmail: string
  semester: string
  openAssignments: number
  completionPercent: number
  schedule: string
  room: string
  overview: string
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

export interface StudentUploadedFile {
  id: string
  fileName: string
  sizeLabel: string
}

export interface AssignmentQuestion {
  id: string
  order: number
  prompt: string
  attachmentName?: string
  rubric: QuestionRubricItem[]
  answerText: string
  uploadedFiles: StudentUploadedFile[]
  completionStatus: CompletionStatus
}

export interface StudentAssignment {
  id: string
  classId: string
  title: string
  deadline: string
  submissionStatus: SubmissionStatus
  gradingStatus: GradingStatus
  score?: number
  submittedAt?: string
  requirements: AssignmentRequirement[]
  instructions: string[]
  questions: AssignmentQuestion[]
  allowedSubmissionFormats: string[]
  draftSavedAt?: string
}

export interface ResultRubricStatus {
  id: string
  label: string
  achieved: boolean
  note: string
}

export interface QuestionResult {
  questionId: string
  questionLabel: string
  score: number
  maxScore: number
  feedback: string
  rubric: ResultRubricStatus[]
}

export interface StudentResult {
  id: string
  assignmentId: string
  classId: string
  totalScore: number
  maxScore: number
  updatedAt: string
  feedbackStatus: FeedbackStatus
  lecturerFeedback: string
  summary: string[]
  questionResults: QuestionResult[]
}

export interface ClassAnnouncement {
  id: string
  classId: string
  title: string
  postedAt: string
  summary: string
}

export interface FeedbackMessage {
  id: string
  authorRole: 'lecturer' | 'student' | 'system'
  authorName: string
  sentAt: string
  content: string
}

export interface FeedbackThread {
  id: string
  assignmentId: string
  classId: string
  title: string
  status: FeedbackStatus
  updatedAt: string
  messages: FeedbackMessage[]
}

export interface StudentReminder {
  id: string
  label: string
  detail: string
  tone: SupportTone
}

export interface QuickGuideEntry {
  id: string
  label: string
  href: string
}

export interface StudentPortalShellModel {
  utilityBar: UtilityBarModel
  brandName: string
  brandSubtitle: string
  navItems: PortalNavItem[]
  userMenu: HeaderUserMenuModel
  footer: FooterModel
}

export interface StudentRouteContext {
  dataState: DataState
  pageKey: string
}

export interface StudentDashboardMetric {
  id: string
  label: string
  value: string
  tone: StatusTone
}

export interface StudentAssignmentRow {
  id: string
  title: string
  classLabel: string
  deadlineLabel: string
  submissionLabel: string
  submissionTone: StatusTone
  gradingLabel: string
  gradingTone: StatusTone
  scoreLabel: string
  href: string
}

export interface StudentClassRow {
  id: string
  title: string
  lecturerName: string
  classCode: string
  openAssignmentsLabel: string
  progressLabel: string
  href: string
}

export interface ResultRow {
  id: string
  title: string
  classLabel: string
  scoreLabel: string
  updatedAtLabel: string
  feedbackLabel: string
  feedbackTone: StatusTone
  href: string
}

export interface FeedbackThreadRow {
  id: string
  title: string
  classLabel: string
  updatedAtLabel: string
  preview: string
  statusLabel: string
  statusTone: StatusTone
  href: string
}

export interface StudentPageFrame {
  shell: StudentPortalShellModel
  pageTitle: string
  pageDescription: string
  breadcrumbs: { label: string; href?: string }[]
  tabs?: SecondaryTabModel[]
}

