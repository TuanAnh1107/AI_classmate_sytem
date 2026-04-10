import type { Assignment, Submission } from './assignment.types'
import {
  dbAssignmentListSubmissions,
  dbAssignmentQuestions,
  dbContentAssignments,
  dbContentFileQuestions,
  dbContentFileSubmissions,
  dbContentQuestions,
  dbContentSubmissions,
  dbFeedbackSubmissions,
  dbInfoAssignments,
  dbInfoQuestions,
  dbInfoSubmissions,
  dbListSubmissions,
  dbResultFeedbacks,
  dbResultSubmissions,
  dbRubricQuestions,
} from '../db/assignmentDb.mock'
import { buildAssignmentsFromDb, buildSubmissionsFromDb } from '../db/assignmentDb.mappers'

const dbBundle = {
  infoAssignments: dbInfoAssignments,
  contentAssignments: dbContentAssignments,
  assignmentQuestions: dbAssignmentQuestions,
  infoQuestions: dbInfoQuestions,
  contentQuestions: dbContentQuestions,
  contentFileQuestions: dbContentFileQuestions,
  rubricQuestions: dbRubricQuestions,
  assignmentListSubmissions: dbAssignmentListSubmissions,
  listSubmissions: dbListSubmissions,
  infoSubmissions: dbInfoSubmissions,
  contentSubmissions: dbContentSubmissions,
  contentFileSubmissions: dbContentFileSubmissions,
  resultSubmissions: dbResultSubmissions,
  resultFeedbacks: dbResultFeedbacks,
  feedbackSubmissions: dbFeedbackSubmissions,
}

export const assignmentsMock: Assignment[] = buildAssignmentsFromDb(dbBundle)
export const submissionsMock: Submission[] = buildSubmissionsFromDb(dbBundle)
