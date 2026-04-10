import type {
  ClassAnnouncement,
  FeedbackThread,
  FeedbackMessage,
  QuickGuideEntry,
  StudentAssignment,
  StudentAssignmentQuestion,
  StudentClass,
  StudentNotification,
  StudentProfile,
  StudentReminder,
  StudentResult,
} from './student.types'
import type { Assignment } from '../assignment/assignment.types'
import { assignmentsMock, submissionsMock } from '../assignment/assignment.mock'
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
import { buildFeedbackThreadsFromDb } from '../db/assignmentDb.mappers'

export const studentProfileMock: StudentProfile = {
  id: '20231556',
  studentCode: '20231556',
  faculty: 'Khoa Khoa học và Công nghệ giáo dục',
  program: 'Công nghệ giáo dục',
  email: 'anh.nt231556@sis.hust.edu.vn',
  fullName: 'Nguyễn Tuấn Anh',
}

export const studentClassesMock: StudentClass[] = [
  {
    id: 'it4409',
    code: 'IT4409',
    name: 'Phát triển hệ thống đánh giá học tập thông minh',
    lecturerName: 'TS. Vũ Đình Minh',
    lecturerEmail: 'minh.vudinh@hust.edu.vn',
    semester: '2025.2',
    openAssignments: 2,
    completionPercent: 68,
    schedule: 'Thứ 4, 13:00 - 16:00',
    room: 'C7-333S',
    overview:
      'Học phần tập trung vào thiết kế quy trình giao bài, đánh giá theo rubric và sử dụng AI để hỗ trợ phản hồi học tập.',
  },
  {
    id: 'em1180',
    code: 'EM1180',
    name: 'Kỹ năng học tập và phản biện học thuật',
    lecturerName: 'ThS. Trần Thu Hương',
    lecturerEmail: 'huong.tranthu@hust.edu.vn',
    semester: '2025.2',
    openAssignments: 1,
    completionPercent: 84,
    schedule: 'Thứ 6, 09:00 - 11:00',
    room: 'D3-301',
    overview:
      'Sinh viên luyện viết phản biện, gửi bài trực tuyến và nhận nhận xét theo từng tiêu chí rõ ràng từ giảng viên.',
  },
  {
    id: 'mi2021',
    code: 'MI2021',
    name: 'Xác suất thống kê',
    lecturerName: 'PGS. Lê Quang Việt',
    lecturerEmail: 'viet.lequang@hust.edu.vn',
    semester: '2025.2',
    openAssignments: 1,
    completionPercent: 42,
    schedule: 'Thứ 2, 07:00 - 09:00',
    room: 'B1-201',
    overview:
      'Học phần yêu cầu nộp báo cáo ngắn theo câu hỏi, phân tích dữ liệu và theo dõi tiến độ làm bài theo tuần.',
  },
]

const questionAnswerMap: Record<string, Partial<StudentAssignmentQuestion>> = {
  'asg-it4409-01-q1': {
    answerText:
      'Sau khi sinh viên lưu nháp hoặc nộp bài, hệ thống tạo bản ghi submission, đồng bộ câu trả lời theo từng câu và chuyển sang hàng đợi chấm nếu bài đã gửi chính thức.',
    uploadedFiles: [{ id: 'f1', fileName: 'quy-trinh-cham-ai.pdf', sizeLabel: '1.2 MB' }],
    completionStatus: 'complete',
  },
  'asg-it4409-01-q2': {
    answerText:
      'Rubric nên hiển thị ngay dưới từng câu, gói gọn theo mục tiêu chấm và số điểm tối đa để sinh viên chủ động kiểm tra mức độ hoàn thành trước khi nộp.',
    uploadedFiles: [],
    completionStatus: 'draft',
  },
  'asg-it4409-01-q3': {
    answerText: '',
    uploadedFiles: [],
    completionStatus: 'missing',
  },
  'asg-it4409-02-q1': {
    answerText: 'Đã nộp trực tuyến.',
    uploadedFiles: [{ id: 'f2', fileName: 'rubric-phan-bien.pdf', sizeLabel: '860 KB' }],
    completionStatus: 'complete',
  },
  'asg-it4409-00-q1': {
    answerText: 'Đã nộp trực tuyến.',
    uploadedFiles: [],
    completionStatus: 'complete',
  },
  'asg-it4409-00-q2': {
    answerText: 'Đã nộp trực tuyến.',
    uploadedFiles: [],
    completionStatus: 'complete',
  },
  'asg-em1180-01-q1': {
    answerText: 'Đã nộp trực tuyến.',
    uploadedFiles: [],
    completionStatus: 'complete',
  },
  'asg-em1180-01-q2': {
    answerText: 'Đã nộp trực tuyến.',
    uploadedFiles: [],
    completionStatus: 'complete',
  },
  'asg-mi2021-01-q1': {
    answerText: '',
    uploadedFiles: [],
    completionStatus: 'missing',
  },
}

function enrichQuestions(assignment: Assignment): StudentAssignmentQuestion[] {
  return assignment.questions.map((question) => ({
    ...question,
    answerText: questionAnswerMap[question.id]?.answerText ?? '',
    uploadedFiles: questionAnswerMap[question.id]?.uploadedFiles ?? [],
    completionStatus: questionAnswerMap[question.id]?.completionStatus ?? 'missing',
  }))
}

export const studentAssignmentsMock: StudentAssignment[] = assignmentsMock
  .filter((assignment) => studentClassesMock.some((studentClass) => studentClass.id === assignment.classId))
  .map((assignment) => {
    const submission = submissionsMock.find(
      (item) => item.assignmentId === assignment.id && item.studentId === studentProfileMock.id,
    )
    const submissionMeta: Partial<StudentAssignment> = {
      submissionStatus: 'not_submitted',
      gradingStatus: 'not_started',
      score: undefined,
      submittedAt: undefined,
      draftSavedAt: undefined,
    }

    if (submission) {
      submissionMeta.submissionStatus = submission.status
      submissionMeta.submittedAt = submission.submittedAt
      submissionMeta.score = submission.score
      if (submission.status === 'draft') {
        submissionMeta.draftSavedAt = submission.updatedAt
      }
      if (submission.score !== undefined) {
        submissionMeta.gradingStatus = 'published'
      } else if (submission.status === 'submitted' || submission.status === 'late') {
        submissionMeta.gradingStatus = 'pending'
      }
    }

    return {
      ...assignment,
      ...submissionMeta,
      questions: enrichQuestions(assignment),
    } as StudentAssignment
  })

export const studentResultsMock: StudentResult[] = buildStudentResultsFromDb()

export const classAnnouncementsMock: ClassAnnouncement[] = [
  {
    id: 'note-it4409-01',
    classId: 'it4409',
    title: 'Nhắc hạn nộp Bài tập 01 trước 23:59 ngày 09/04',
    postedAt: '2026-04-04T10:00:00',
    summary: 'Sinh viên kiểm tra lại rubric từng câu và nộp đủ phần trả lời trực tuyến lẫn tệp đính kèm.',
  },
  {
    id: 'note-it4409-02',
    classId: 'it4409',
    title: 'Cập nhật rubric cho phần đề xuất giao diện',
    postedAt: '2026-04-02T08:45:00',
    summary: 'Đã bổ sung tiêu chí về tính rõ ràng và khả năng triển khai trong thực tế.',
  },
  {
    id: 'note-em1180-01',
    classId: 'em1180',
    title: 'Giảng viên đã công bố kết quả bài phản hồi tuần 6',
    postedAt: '2026-04-02T09:15:00',
    summary: 'Sinh viên vào mục Kết quả để xem nhận xét chi tiết theo từng câu.',
  },
]

export const feedbackThreadsMock: FeedbackThread[] = buildFeedbackThreadsFromDbBundle()

export const studentRemindersMock: StudentReminder[] = [
  {
    id: 'rem-1',
    label: 'Hoàn thiện câu 3 của Bài tập 01',
    detail: 'Còn thiếu 1/3 câu hỏi trước hạn nộp ngày 09/04.',
    tone: 'warning',
  },
  {
    id: 'rem-2',
    label: 'Kiểm tra phản hồi mới từ học phần EM1180',
    detail: 'Giảng viên đã trả lời trao đổi trong luồng phản hồi học tập.',
    tone: 'positive',
  },
  {
    id: 'rem-3',
    label: 'Xem lại yêu cầu định dạng file PDF',
    detail: 'Một số bài tập yêu cầu nộp kèm tệp minh chứng theo đúng chuẩn lớp.',
    tone: 'neutral',
  },
]

export const studentQuickGuideMock: QuickGuideEntry[] = [
  { id: 'guide-1', label: 'Cách lưu nháp và nộp bài chính thức', href: '#guide-submit' },
  { id: 'guide-2', label: 'Xem rubric trước khi hoàn thành từng câu', href: '#guide-rubric' },
  { id: 'guide-3', label: 'Theo dõi phản hồi sau khi có kết quả', href: '#guide-feedback' },
]

export const studentNotificationsMock: StudentNotification[] = [
  {
    id: 'ntf-1',
    content: 'Bài tập 01 đã được gia hạn thêm 12 giờ do điều chỉnh rubric.',
    createdAt: '2026-04-05T09:00:00',
    isRead: false,
  },
  {
    id: 'ntf-2',
    content: 'Giảng viên đã cập nhật nhận xét cho bài phản hồi tuần 6.',
    createdAt: '2026-04-03T15:40:00',
    isRead: true,
  },
]

function buildStudentResultsFromDb(): StudentResult[] {
  return dbResultSubmissions.map((result) => {
    const submission = submissionsMock.find((item) => item.id === result.id_submission)
    const assignment = assignmentsMock.find((item) => item.id === submission?.assignmentId)
    const classId = assignment?.classId ?? 'unknown'
    const maxScore = assignment?.maxScore ?? 10
    const questionResults = (assignment?.questions ?? []).map((question) => {
      const questionMax = question.rubric.reduce((sum, item) => sum + item.maxScore, 0) || 1
      const ratio = maxScore ? result.score / maxScore : 0
      const score = Number((questionMax * ratio).toFixed(1))
      return {
        questionId: question.id,
        questionLabel: `Câu ${question.order}`,
        score,
        maxScore: questionMax,
        feedback: 'Đã chấm theo rubric và phản hồi trong luồng trao đổi.',
        rubric: question.rubric.map((item) => ({
          id: item.id,
          label: item.label,
          achieved: true,
          note: 'Đã ghi nhận.',
        })),
      }
    })

    return {
      id: `res-${result.id_submission}`,
      assignmentId: submission?.assignmentId ?? 'unknown',
      classId,
      totalScore: result.score,
      maxScore,
      updatedAt: result.created_at,
      feedbackStatus: 'new',
      lecturerFeedback: submission?.feedback ?? 'Giảng viên sẽ phản hồi chi tiết trong luồng trao đổi.',
      summary: [
        `Đạt ${result.score}/${maxScore}.`,
        'Hoàn thành đủ các tiêu chí cốt lõi.',
        'Xem phản hồi chi tiết ở mục Phản hồi.',
      ],
      questionResults,
    }
  })
}

function buildFeedbackThreadsFromDbBundle(): FeedbackThread[] {
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
  const threads = buildFeedbackThreadsFromDb(dbBundle)

  return threads.map((thread) => {
    const submission = submissionsMock.find((item) => item.id === thread.submissionId)
    const assignment = assignmentsMock.find((item) => item.id === submission?.assignmentId)
    const classId = assignment?.classId ?? 'unknown'
    const messages = thread.messages.map((message) => mapFeedbackMessage(message))
    return {
      id: `thread-${thread.submissionId}`,
      assignmentId: assignment?.id ?? 'unknown',
      classId,
      title: assignment ? `Phản hồi cho ${assignment.title}` : 'Phản hồi học tập',
      status: 'new',
      updatedAt: messages[messages.length - 1]?.sentAt ?? '',
      messages,
    }
  })
}

function mapFeedbackMessage(message: { id: string; authorId: string; createdAt: string; content: string }): FeedbackMessage {
  const authorRole =
    message.authorId === studentProfileMock.id || message.authorId === studentProfileMock.studentCode
      ? 'student'
      : message.authorId.startsWith('lect-')
        ? 'lecturer'
        : 'system'

  return {
    id: message.id,
    authorRole,
    authorName: resolveAuthorName(message.authorId, authorRole),
    sentAt: message.createdAt,
    content: message.content,
  }
}

function resolveAuthorName(authorId: string, role: FeedbackMessage['authorRole']) {
  if (role === 'student') {
    return studentProfileMock.fullName
  }
  if (role === 'lecturer') {
    const lecturerMap: Record<string, string> = {
      'lect-it4409': 'TS. Vũ Đình Minh',
      'lect-em1180': 'ThS. Trần Thu Hương',
      'lect-mi2021': 'PGS. Lê Quang Việt',
    }
    return lecturerMap[authorId] ?? 'Giảng viên'
  }
  return 'Hệ thống'
}
