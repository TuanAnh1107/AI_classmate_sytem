import type { DataState } from '../../models/shared/portal.types'
import type { FeedbackThreadRow, StudentPageFrame } from '../../models/student/student.types'
import { feedbackThreadsMock, studentAssignmentsMock, studentClassesMock } from '../../models/student/student.mock'
import { buildStudentPortalHref, formatPortalDateTime, getClassLabel, getFeedbackStatusMeta } from '../../models/student/student.mappers'
import { useStudentPortalShellController } from './useStudentPortalShellController'

export interface StudentFeedbackViewModel {
  state: DataState
  frame: StudentPageFrame
  threads: FeedbackThreadRow[]
  selectedThread?: {
    id: string
    title: string
    classLabel: string
    assignmentTitle: string
    updatedAtLabel: string
    messages: typeof feedbackThreadsMock[number]['messages']
  }
  errorMessage?: string
}

export function useStudentFeedbackController(
  state: DataState,
  selectedThreadId?: string,
): StudentFeedbackViewModel {
  const shell = useStudentPortalShellController('feedback')
  const selectedThread = feedbackThreadsMock.find((thread) => thread.id === selectedThreadId) ?? feedbackThreadsMock[0]
  const selectedAssignment = selectedThread
    ? studentAssignmentsMock.find((assignment) => assignment.id === selectedThread.assignmentId)
    : undefined
  const selectedClass = selectedThread
    ? studentClassesMock.find((studentClass) => studentClass.id === selectedThread.classId)
    : undefined

  const frame: StudentPageFrame = {
    shell,
    pageTitle: 'Phản hồi',
    pageDescription: 'Theo dõi các luồng trao đổi học tập giữa sinh viên, giảng viên và hệ thống theo từng bài tập.',
    breadcrumbs: [
      { label: 'Trang chủ', href: buildStudentPortalHref('dashboard') },
      { label: 'Phản hồi' },
    ],
  }

  if (state === 'loading') {
    return { state, frame, threads: [] }
  }

  if (state === 'error') {
    return {
      state,
      frame,
      threads: [],
      errorMessage: 'Không thể tải luồng phản hồi. Vui lòng thử lại sau.',
    }
  }

  const threads: FeedbackThreadRow[] = feedbackThreadsMock.map((thread) => {
    const feedbackMeta = getFeedbackStatusMeta(thread.status)
    const threadClass = studentClassesMock.find((studentClass) => studentClass.id === thread.classId)
    const preview = thread.messages[thread.messages.length - 1]?.content ?? 'Chưa có trao đổi mới.'

    return {
      id: thread.id,
      title: thread.title,
      classLabel: threadClass ? getClassLabel(threadClass) : thread.classId,
      updatedAtLabel: formatPortalDateTime(thread.updatedAt),
      preview,
      statusLabel: feedbackMeta.label,
      statusTone: feedbackMeta.tone,
      href: buildStudentPortalHref('feedback', { threadId: thread.id }),
    }
  })

  if (state === 'empty') {
    return { state, frame, threads: [] }
  }

  return {
    state,
    frame,
    threads,
    selectedThread:
      selectedThread && selectedAssignment && selectedClass
        ? {
            id: selectedThread.id,
            title: selectedThread.title,
            classLabel: getClassLabel(selectedClass),
            assignmentTitle: selectedAssignment.title,
            updatedAtLabel: formatPortalDateTime(selectedThread.updatedAt),
            messages: selectedThread.messages,
          }
        : undefined,
  }
}
