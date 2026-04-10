export type DbAssignmentConstraint = 'no_late' | 'allow_late'
export type DbQuestionGradeType = 'rubric' | 'auto' | 'manual'
export type DbSubmissionStatusGrade = 'draft' | 'submitted' | 'late' | 'graded'

export interface DbInfoAssignment {
  id_assignment: string
  deadline: string
  constraint: DbAssignmentConstraint
  class_code: string
  created_at: string
}

export interface DbContentAssignment {
  id_assignment: string
  title: string
  note: string
  type: string
}

export interface DbAssignmentQuestion {
  id_assignment: string
  id_question: string
}

export interface DbInfoQuestion {
  id_question: string
  id_teacher: string
  version: number
  type_grade: DbQuestionGradeType
  created_at: string
}

export interface DbContentQuestion {
  id_question: string
  text_content: string
}

export interface DbContentFileQuestion {
  id_question: string
  link_file: string
  type_file: string
}

export interface DbRubricQuestion {
  id_question: string
  max_score: number
  content: string
}

export interface DbAssignmentListSubmission {
  id_assignment: string
  id_list_submission: string
}

export interface DbListSubmission {
  id_list_submission: string
  id_submission: string
}

export interface DbInfoSubmission {
  id_submission: string
  id_student: string
  status_grade: DbSubmissionStatusGrade
  created_at: string
}

export interface DbContentSubmission {
  id_submission: string
  text_content: string
}

export interface DbContentFileSubmission {
  id_submission: string
  link_file: string
  type_file: string
}

export interface DbResultSubmission {
  id_submission: string
  score: number
  created_at: string
}

export interface DbResultFeedback {
  id_submission: string
  id_feedback: string
}

export interface DbFeedbackSubmission {
  id_feedback: string
  feedback: string
  id_feedback_previous?: string | null
  id_user: string
  created_at: string
}
