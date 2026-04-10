import type { DataState } from '../../models/shared/portal.types'
import type { FeedbackFilter, FeedbackThreadRow, StudentPageFrame } from '../../models/student/student.types'
import { feedbackThreadsMock, studentAssignmentsMock, studentClassesMock, studentProfileMock } from '../../models/student/student.mock'
import { buildStudentPortalHref, formatPortalDateTime, getClassLabel, getFeedbackStatusMeta } from '../../models/student/student.mappers'
import { canStudentViewAssignment } from '../../services/domain/accessControl'
import { useStudentPortalShellController } from './useStudentPortalShellController'
import { useStudentQueryParams } from './useStudentQueryParams'

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
  searchValue: string
  filterValue: FeedbackFilter
  onSearchChange: (value: string) => void
  onFilterChange: (value: FeedbackFilter) => void
  errorMessage?: string
}

export function useStudentFeedbackController(
  state: DataState,
  selectedThreadId?: string,
): StudentFeedbackViewModel {
  const shell = useStudentPortalShellController('feedback')
  const { query, setQuery } = useStudentQueryParams()
  const safeFilter: FeedbackFilter =
    query.feedback === 'new' || query.feedback === 'reply_required' || query.feedback === 'read' || query.feedback === 'all'
      ? query.feedback
      : 'all'

  const frame: StudentPageFrame = {
    shell,
    pageTitle: 'Phản hồi',
    pageDescription: 'Theo dõi các luồng trao đổi học tập theo từng bài để biết phản hồi nào mới và phản hồi nào cần xử lý tiếp.',
    breadcrumbs: [
      { label: 'Trang chủ', href: buildStudentPortalHref('dashboard') },
      { label: 'Phản hồi' },
    ],
  }

  const setSearch = (value: string) => setQuery({ search: value })
  const setFilter = (value: FeedbackFilter) => setQuery({ feedback: value })

  if (state === 'loading') {
    return {
      state,
      frame,
      threads: [],
      searchValue: query.search,
      filterValue: safeFilter,
      onSearchChange: setSearch,
      onFilterChange: setFilter,
    }
  }

  if (state === 'error') {
    return {
      state,
      frame,
      threads: [],
      searchValue: query.search,
      filterValue: safeFilter,
      onSearchChange: setSearch,
      onFilterChange: setFilter,
      errorMessage: 'Không thể tải luồng phản hồi. Vui lòng thử lại sau.',
    }
  }

  const threads: FeedbackThreadRow[] = feedbackThreadsMock
    .filter((thread) => canStudentViewAssignment(studentProfileMock.id, thread.assignmentId))
    .filter((thread) => (safeFilter === 'all' ? true : thread.status === safeFilter))
    .map((thread) => {
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
    .filter((thread) => {
      if (!query.search) {
        return true
      }

      const keyword = query.search.toLowerCase()
      return (
        thread.title.toLowerCase().includes(keyword) ||
        thread.classLabel.toLowerCase().includes(keyword) ||
        thread.preview.toLowerCase().includes(keyword)
      )
    })

  const activeThreadId = threads.find((thread) => thread.id === selectedThreadId)?.id ?? threads[0]?.id
  const activeThread = feedbackThreadsMock.find(
    (thread) => thread.id === activeThreadId && canStudentViewAssignment(studentProfileMock.id, thread.assignmentId),
  )
  const activeAssignment = activeThread
    ? studentAssignmentsMock.find((assignment) => assignment.id === activeThread.assignmentId)
    : undefined
  const activeClass = activeThread
    ? studentClassesMock.find((studentClass) => studentClass.id === activeThread.classId)
    : undefined

  if (state === 'empty') {
    return {
      state,
      frame,
      threads: [],
      searchValue: query.search,
      filterValue: safeFilter,
      onSearchChange: setSearch,
      onFilterChange: setFilter,
    }
  }

  return {
    state,
    frame,
    threads,
    searchValue: query.search,
    filterValue: safeFilter,
    onSearchChange: setSearch,
    onFilterChange: setFilter,
    selectedThread:
      activeThread && activeAssignment && activeClass
        ? {
            id: activeThread.id,
            title: activeThread.title,
            classLabel: getClassLabel(activeClass),
            assignmentTitle: activeAssignment.title,
            updatedAtLabel: formatPortalDateTime(activeThread.updatedAt),
            messages: activeThread.messages,
          }
        : undefined,
  }
}
