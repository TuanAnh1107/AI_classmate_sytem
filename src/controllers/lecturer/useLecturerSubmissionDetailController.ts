import type { SubmissionStatus } from '../../models/assignment/assignment.types'
import type { LecturerPageFrame } from '../../models/lecturer/lecturer.types'
import type { DataState, StatusTone } from '../../models/shared/portal.types'
import { assignmentsMock, submissionsMock } from '../../models/assignment/assignment.mock'
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
} from '../../models/db/assignmentDb.mock'
import { buildFeedbackThreadsFromDb } from '../../models/db/assignmentDb.mappers'
import { lecturerProfileMock } from '../../models/lecturer/lecturer.mock'
import { getUserById } from '../../models/rbac/rbac.mappers'
import { formatPortalDateTime } from '../../models/student/student.mappers'
import { canLecturerManageSubmission } from '../../services/domain/accessControl'
import { useLecturerPortalShellController } from './useLecturerPortalShellController'

type FeedbackMessageViewModel = {
  id: string
  authorName: string
  authorRole: string
  createdAt: string
  content: string
}

type SubmissionAttemptViewModel = {
  id: string
  submittedAtLabel: string
  statusLabel: string
  scoreLabel: string
  isCurrent: boolean
}

type SubmissionSummaryFact = {
  id: string
  label: string
  value: string
  tone?: StatusTone
}

export type LecturerSubmissionDetailViewModel = {
  frame: LecturerPageFrame
  state: DataState
  submission?: {
    id: string
    assignmentId: string
    assignmentTitle: string
    classLabel: string
    studentName: string
    studentCode: string
    submittedAtLabel: string
    updatedAtLabel: string
    dueAtLabel: string
    allowLateLabel: string
    status: SubmissionStatus
    submissionStatusLabel: string
    submissionTone: StatusTone
    gradingStatusLabel: string
    gradingTone: StatusTone
    contentText: string
    attachmentUrls: string[]
    scoreLabel: string
    scoreValue: string
    feedback?: string
    maxScoreLabel: string
    maxScoreValue: number
    attemptCountLabel: string
    queueHref: string
    assignmentHref: string
  }
  rubric?: { id: string; label: string; detail: string; maxScore: number }[]
  feedbackThread?: FeedbackMessageViewModel[]
  attempts?: SubmissionAttemptViewModel[]
  summaryFacts?: SubmissionSummaryFact[]
  prevId?: string
  nextId?: string
  errorMessage?: string
}

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

function getSubmissionTone(status: SubmissionStatus): StatusTone {
  switch (status) {
    case 'late':
      return 'warning'
    case 'submitted':
      return 'success'
    case 'draft':
    default:
      return 'neutral'
  }
}

function getSubmissionStatusLabel(status: SubmissionStatus): string {
  switch (status) {
    case 'late':
      return 'Nộp trễ'
    case 'submitted':
      return 'Đã nộp'
    case 'draft':
    default:
      return 'Lưu nháp'
  }
}

function getGradingMeta(score: number | undefined): { label: string; tone: StatusTone } {
  if (score === undefined) {
    return { label: 'Chưa chấm', tone: 'warning' }
  }
  return { label: 'Đã chấm', tone: 'success' }
}

export function useLecturerSubmissionDetailController(
  submissionId: string | undefined,
  state: DataState,
): LecturerSubmissionDetailViewModel {
  const shell = useLecturerPortalShellController('submission-detail')
  const submission = submissionsMock.find((item) => item.id === submissionId)
  const assignment = submission ? assignmentsMock.find((item) => item.id === submission.assignmentId) : undefined
  const student = submission ? getUserById(submission.studentId) : undefined

  const frame: LecturerPageFrame = {
    shell,
    pageTitle: 'Chi tiết bài nộp',
    pageDescription: 'Xem từng phiên bản bài nộp, điểm số và luồng phản hồi trong một màn hình.',
    breadcrumbs: [
      { label: 'Trang chủ', href: '?portal=lecturer&page=dashboard' },
      {
        label: 'Hàng chấm bài',
        href: assignment
          ? `?portal=lecturer&page=submission-list&assignmentId=${assignment.id}`
          : '?portal=lecturer&page=submission-list',
      },
      { label: 'Chi tiết bài nộp' },
    ],
  }

  if (state === 'loading') {
    return { frame, state }
  }

  if (state === 'error') {
    return { frame, state, errorMessage: 'Không thể tải chi tiết bài nộp.' }
  }

  if (submissionId && !canLecturerManageSubmission(lecturerProfileMock.id, submissionId)) {
    return {
      frame,
      state: 'error',
      errorMessage: 'Bạn không có quyền xem bài nộp này.',
    }
  }

  if (!submission || !assignment) {
    return { frame, state: 'empty' }
  }

  const submissionList = submissionsMock
    .filter((item) => item.assignmentId === assignment.id)
    .sort((a, b) => (a.submittedAt ?? '').localeCompare(b.submittedAt ?? ''))
  const currentIndex = submissionList.findIndex((item) => item.id === submission.id)
  const prevId = submissionList[currentIndex - 1]?.id
  const nextId = submissionList[currentIndex + 1]?.id

  const attempts = submissionsMock
    .filter((item) => item.assignmentId === assignment.id && item.studentId === submission.studentId)
    .sort((a, b) => (b.submittedAt ?? '').localeCompare(a.submittedAt ?? ''))
    .map((item) => ({
      id: item.id,
      submittedAtLabel: item.submittedAt ? formatPortalDateTime(item.submittedAt) : 'Chưa nộp',
      statusLabel: getSubmissionStatusLabel(item.status),
      scoreLabel: item.score !== undefined ? item.score.toFixed(1) : '--',
      isCurrent: item.id === submission.id,
    }))

  const feedbackThreads = buildFeedbackThreadsFromDb(dbBundle)
  const feedback = feedbackThreads.find((thread) => thread.submissionId === submission.id)
  const feedbackThread = feedback?.messages.map((message) => {
    const author = getUserById(message.authorId)
    return {
      id: message.id,
      authorName: author?.fullName ?? message.authorId,
      authorRole: author?.role ?? 'lecturer',
      createdAt: formatPortalDateTime(message.createdAt),
      content: message.content,
    }
  })

  const gradingMeta = getGradingMeta(submission.score)
  const submissionStatusLabel = getSubmissionStatusLabel(submission.status)
  const submissionTone = getSubmissionTone(submission.status)
  const classLabel = assignment.classId.toUpperCase()
  const summaryFacts: SubmissionSummaryFact[] = [
    {
      id: 'deadline',
      label: 'Hạn nộp',
      value: formatPortalDateTime(assignment.dueAt),
      tone: submission.status === 'late' ? 'warning' : 'neutral',
    },
    {
      id: 'late-policy',
      label: 'Nộp trễ',
      value: assignment.allowLateSubmission ? 'Có cho phép' : 'Không cho phép',
      tone: assignment.allowLateSubmission ? 'info' : 'neutral',
    },
    {
      id: 'attempts',
      label: 'Số lần nộp',
      value: `${attempts.length} lần`,
      tone: attempts.length > 1 ? 'info' : 'neutral',
    },
    {
      id: 'updated',
      label: 'Cập nhật gần nhất',
      value: formatPortalDateTime(submission.updatedAt),
      tone: 'neutral',
    },
  ]

  return {
    frame,
    state: 'ready',
    submission: {
      id: submission.id,
      assignmentId: assignment.id,
      assignmentTitle: assignment.title,
      classLabel,
      studentName: student?.fullName ?? submission.studentId,
      studentCode: student?.id ?? submission.studentId,
      submittedAtLabel: submission.submittedAt ? formatPortalDateTime(submission.submittedAt) : 'Chưa nộp',
      updatedAtLabel: formatPortalDateTime(submission.updatedAt),
      dueAtLabel: formatPortalDateTime(assignment.dueAt),
      allowLateLabel: assignment.allowLateSubmission ? 'Cho phép nộp trễ' : 'Không cho phép nộp trễ',
      status: submission.status,
      submissionStatusLabel,
      submissionTone,
      gradingStatusLabel: gradingMeta.label,
      gradingTone: gradingMeta.tone,
      contentText: submission.contentText || 'Sinh viên chưa gửi nội dung văn bản cho bài nộp này.',
      attachmentUrls: submission.attachmentUrls,
      scoreLabel: submission.score !== undefined ? submission.score.toFixed(1) : '--',
      scoreValue: submission.score !== undefined ? submission.score.toFixed(1) : '',
      feedback: submission.feedback,
      maxScoreLabel: `${assignment.maxScore} điểm`,
      maxScoreValue: assignment.maxScore,
      attemptCountLabel: `${attempts.length} lần nộp`,
      queueHref: `?portal=lecturer&page=submission-list&assignmentId=${assignment.id}`,
      assignmentHref: `?portal=lecturer&page=assignment-detail&assignmentId=${assignment.id}`,
    },
    rubric: assignment.questions.flatMap((question) =>
      question.rubric.map((item) => ({
        id: item.id,
        label: `Câu ${question.order} · ${item.label}`,
        detail: item.detail,
        maxScore: item.maxScore,
      })),
    ),
    feedbackThread,
    attempts,
    summaryFacts,
    prevId,
    nextId,
  }
}
