import type {
  DbAssignmentConstraint,
  DbAssignmentListSubmission,
  DbAssignmentQuestion,
  DbContentAssignment,
  DbContentFileQuestion,
  DbContentFileSubmission,
  DbContentQuestion,
  DbContentSubmission,
  DbFeedbackSubmission,
  DbInfoAssignment,
  DbInfoQuestion,
  DbInfoSubmission,
  DbListSubmission,
  DbResultFeedback,
  DbResultSubmission,
  DbRubricQuestion,
} from './assignmentDb.types'
import type { Assignment, AssignmentQuestion, Submission, SubmissionStatus } from '../assignment/assignment.types'

type DbBundle = {
  infoAssignments: DbInfoAssignment[]
  contentAssignments: DbContentAssignment[]
  assignmentQuestions: DbAssignmentQuestion[]
  infoQuestions: DbInfoQuestion[]
  contentQuestions: DbContentQuestion[]
  contentFileQuestions: DbContentFileQuestion[]
  rubricQuestions: DbRubricQuestion[]
  assignmentListSubmissions: DbAssignmentListSubmission[]
  listSubmissions: DbListSubmission[]
  infoSubmissions: DbInfoSubmission[]
  contentSubmissions: DbContentSubmission[]
  contentFileSubmissions: DbContentFileSubmission[]
  resultSubmissions: DbResultSubmission[]
  resultFeedbacks: DbResultFeedback[]
  feedbackSubmissions: DbFeedbackSubmission[]
}

export type FeedbackThreadMessage = {
  id: string
  authorId: string
  createdAt: string
  content: string
}

export type FeedbackThread = {
  submissionId: string
  feedbackId: string
  messages: FeedbackThreadMessage[]
}

const constraintMap: Record<DbAssignmentConstraint, boolean> = {
  allow_late: true,
  no_late: false,
}

export function mapConstraintToAllowLate(constraint: DbAssignmentConstraint) {
  return constraintMap[constraint] ?? false
}

export function mapStatusGradeToSubmissionStatus(status: DbInfoSubmission['status_grade']): SubmissionStatus {
  switch (status) {
    case 'late':
      return 'late'
    case 'submitted':
    case 'graded':
      return 'submitted'
    case 'draft':
    default:
      return 'draft'
  }
}

export function buildAssignmentsFromDb(bundle: DbBundle): Assignment[] {
  return bundle.infoAssignments.map((info) => {
    const content = bundle.contentAssignments.find((item) => item.id_assignment === info.id_assignment)
    const questionLinks = bundle.assignmentQuestions.filter((item) => item.id_assignment === info.id_assignment)
    const questions = questionLinks
      .map((link, index) => mapQuestionFromDb(link.id_question, index, bundle))
      .filter((question): question is AssignmentQuestion => Boolean(question))

    const createdBy = deriveAssignmentTeacher(questionLinks, bundle.infoQuestions)
    const status = resolveAssignmentStatus(info.deadline)

    return {
      id: info.id_assignment,
      classId: info.class_code,
      title: content?.title ?? 'Bài tập',
      description: content?.note ?? '',
      createdBy,
      dueAt: info.deadline,
      allowLateSubmission: mapConstraintToAllowLate(info.constraint),
      maxScore: questions.reduce((sum, question) => sum + question.rubric.reduce((acc, item) => acc + item.maxScore, 0), 0),
      resourceLinks: buildQuestionResourceLinks(questions),
      createdAt: info.created_at,
      updatedAt: info.created_at,
      status,
      requirements: [
        { label: 'Hình thức', detail: mapAssignmentTypeToRequirement(content?.type) },
        { label: 'Ràng buộc', detail: mapConstraintToLabel(info.constraint) },
      ],
      instructions: [
        'Đọc kỹ yêu cầu từng câu và hoàn thành lần lượt theo thứ tự.',
        'Nộp bài đúng hạn theo quy định của học phần.',
      ],
      questions,
      allowedSubmissionFormats: mapAssignmentTypeToFormats(content?.type),
    }
  })
}

export function buildSubmissionsFromDb(bundle: DbBundle): Submission[] {
  const listLookup = buildListSubmissionLookup(bundle.assignmentListSubmissions, bundle.listSubmissions)

  return bundle.infoSubmissions.map((info) => {
    const content = bundle.contentSubmissions.find((item) => item.id_submission === info.id_submission)
    const files = bundle.contentFileSubmissions.filter((item) => item.id_submission === info.id_submission)
    const result = bundle.resultSubmissions.find((item) => item.id_submission === info.id_submission)
    const feedback = buildLatestFeedback(bundle.resultFeedbacks, bundle.feedbackSubmissions, info.id_submission)
    const assignmentId = listLookup.get(info.id_submission)

    return {
      id: info.id_submission,
      assignmentId: assignmentId ?? 'unknown',
      studentId: info.id_student,
      contentText: content?.text_content ?? '',
      attachmentUrls: files.map((item) => item.link_file),
      submittedAt: info.created_at,
      status: mapStatusGradeToSubmissionStatus(info.status_grade),
      score: result?.score,
      feedback,
      updatedAt: result?.created_at ?? info.created_at,
    }
  })
}

export function buildFeedbackThreadsFromDb(bundle: DbBundle): FeedbackThread[] {
  return bundle.resultFeedbacks.map((resultFeedback) => {
    const root = bundle.feedbackSubmissions.find((item) => item.id_feedback === resultFeedback.id_feedback)
    const chain = buildFeedbackChain(bundle.feedbackSubmissions, root?.id_feedback ?? resultFeedback.id_feedback)
    return {
      submissionId: resultFeedback.id_submission,
      feedbackId: resultFeedback.id_feedback,
      messages: chain.map((item) => ({
        id: item.id_feedback,
        authorId: item.id_user,
        createdAt: item.created_at,
        content: item.feedback,
      })),
    }
  })
}

function mapQuestionFromDb(questionId: string, index: number, bundle: DbBundle): AssignmentQuestion | null {
  const content = bundle.contentQuestions.find((item) => item.id_question === questionId)
  if (!content) {
    return null
  }
  const files = bundle.contentFileQuestions.filter((item) => item.id_question === questionId)
  const rubric = bundle.rubricQuestions
    .filter((item) => item.id_question === questionId)
    .map((item, idx) => ({
      id: `${questionId}-r${idx + 1}`,
      label: buildRubricLabel(item.content, idx),
      detail: item.content,
      maxScore: item.max_score,
    }))

  return {
    id: questionId,
    order: index + 1,
    prompt: content.text_content,
    attachmentName: files[0]?.link_file ? sanitizeFileName(files[0].link_file) : undefined,
    rubric,
  }
}

function buildListSubmissionLookup(
  assignmentList: DbAssignmentListSubmission[],
  listSubmissions: DbListSubmission[],
): Map<string, string> {
  const listToAssignment = new Map<string, string>()
  assignmentList.forEach((item) => {
    listToAssignment.set(item.id_list_submission, item.id_assignment)
  })

  const submissionToAssignment = new Map<string, string>()
  listSubmissions.forEach((item) => {
    const assignmentId = listToAssignment.get(item.id_list_submission)
    if (assignmentId) {
      submissionToAssignment.set(item.id_submission, assignmentId)
    }
  })

  return submissionToAssignment
}

function deriveAssignmentTeacher(links: DbAssignmentQuestion[], infoQuestions: DbInfoQuestion[]): string {
  const firstQuestionId = links[0]?.id_question
  const questionInfo = infoQuestions.find((item) => item.id_question === firstQuestionId)
  return questionInfo?.id_teacher ?? 'unknown-teacher'
}

function buildQuestionResourceLinks(questions: AssignmentQuestion[]) {
  return questions
    .filter((question) => Boolean(question.attachmentName))
    .map((question, index) => ({
      id: `link-${question.id}-${index}`,
      label: question.attachmentName ?? 'Tệp đính kèm',
      url: question.attachmentName ?? '',
    }))
}

function buildLatestFeedback(
  resultFeedbacks: DbResultFeedback[],
  feedbackSubmissions: DbFeedbackSubmission[],
  submissionId: string,
): string | undefined {
  const root = resultFeedbacks.find((item) => item.id_submission === submissionId)
  if (!root) {
    return undefined
  }
  const chain = buildFeedbackChain(feedbackSubmissions, root.id_feedback)
  const last = chain[chain.length - 1]
  return last?.feedback
}

function buildFeedbackChain(feedbacks: DbFeedbackSubmission[], rootId: string): DbFeedbackSubmission[] {
  const chain: DbFeedbackSubmission[] = []
  let current = feedbacks.find((item) => item.id_feedback === rootId) ?? null
  while (current) {
    chain.push(current)
    current = feedbacks.find((item) => item.id_feedback_previous === current?.id_feedback) ?? null
  }
  return chain
}

function sanitizeFileName(link: string) {
  const parts = link.split('/')
  return parts[parts.length - 1]
}

function mapConstraintToLabel(constraint?: DbAssignmentConstraint) {
  if (constraint === 'allow_late') {
    return 'Cho phép nộp trễ theo quy định'
  }
  return 'Không cho phép nộp trễ'
}

function mapAssignmentTypeToFormats(type?: string) {
  if (!type) {
    return ['PDF']
  }
  if (type === 'text') {
    return ['Trả lời trực tuyến']
  }
  return type.split(',').map((item) => item.trim().toUpperCase())
}

function mapAssignmentTypeToRequirement(type?: string) {
  if (!type) {
    return 'Nộp trực tuyến theo quy định'
  }
  if (type === 'text') {
    return 'Nộp câu trả lời trực tuyến theo từng câu hỏi'
  }
  return `Chấp nhận ${type.replace(',', ', ').toUpperCase()}`
}

function resolveAssignmentStatus(deadline: string) {
  const now = new Date()
  const dueAt = new Date(deadline)
  if (Number.isNaN(dueAt.getTime())) {
    return 'published'
  }
  return dueAt.getTime() < now.getTime() ? 'closed' : 'published'
}

function buildRubricLabel(content: string, index: number) {
  if (!content) {
    return `Tiêu chí ${index + 1}`
  }
  return content.length > 24 ? `${content.slice(0, 24)}…` : content
}
