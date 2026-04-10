import type { Assignment, Submission } from '../models/assignment/assignment.types'
import { assignmentsMock, submissionsMock } from '../models/assignment/assignment.mock'

const LATENCY_MS = 200

function delay<T>(value: T, ms = LATENCY_MS) {
  return new Promise<T>((resolve) => {
    window.setTimeout(() => resolve(value), ms)
  })
}

export async function listAssignmentsByClassIds(classIds: string[]) {
  const result = assignmentsMock.filter((assignment) => classIds.includes(assignment.classId))
  return delay(result)
}

export async function listAssignmentsByLecturer(lecturerId: string) {
  const result = assignmentsMock.filter((assignment) => assignment.createdBy === lecturerId)
  return delay(result)
}

export async function getAssignmentById(assignmentId: string) {
  return delay(assignmentsMock.find((assignment) => assignment.id === assignmentId) ?? null)
}

export async function listSubmissionsByAssignment(assignmentId: string) {
  const result = submissionsMock.filter((submission) => submission.assignmentId === assignmentId)
  return delay(result)
}

export async function getSubmissionById(submissionId: string) {
  return delay(submissionsMock.find((submission) => submission.id === submissionId) ?? null)
}

export async function getSubmissionForStudent(assignmentId: string, studentId: string) {
  return delay(
    submissionsMock.find((submission) => submission.assignmentId === assignmentId && submission.studentId === studentId) ??
      null,
  )
}

export async function upsertAssignmentDraft(nextAssignment: Assignment) {
  const index = assignmentsMock.findIndex((assignment) => assignment.id === nextAssignment.id)
  if (index >= 0) {
    assignmentsMock[index] = nextAssignment
  } else {
    assignmentsMock.push(nextAssignment)
  }
  return delay(nextAssignment)
}

export async function upsertSubmission(nextSubmission: Submission) {
  const index = submissionsMock.findIndex((submission) => submission.id === nextSubmission.id)
  if (index >= 0) {
    submissionsMock[index] = nextSubmission
  } else {
    submissionsMock.push(nextSubmission)
  }
  return delay(nextSubmission)
}
