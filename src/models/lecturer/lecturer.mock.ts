import type {
  AssignmentCreateChecklistItem,
  AssignmentQuestionDraft,
  LecturerClassOption,
  LecturerProfile,
  RubricTemplate,
} from './lecturer.types'
import { dbClasses, dbCourses, dbProfiles } from '../db/modernDb.mock'
import { rbacEnrollmentsMock, rbacUsersMock } from '../rbac/rbac.mock'

const lecturerProfile = dbProfiles.find((profile) => profile.id === 'lect-it4409')

export const lecturerProfileMock: LecturerProfile = {
  id: lecturerProfile?.id ?? 'lect-it4409',
  fullName: lecturerProfile?.full_name ?? 'TS. Vũ Đình Minh',
  lecturerCode: 'lect-it4409',
  faculty: 'Viện Công nghệ Thông tin và Truyền thông',
  email: 'minh.vudinh@hust.edu.vn',
}

export const lecturerClassesMock: LecturerClassOption[] = dbClasses.map((clazz) => {
  const course = dbCourses.find((item) => item.id === clazz.course_id)
  return {
    id: clazz.id,
    code: clazz.id.toUpperCase(),
    name: course?.name ?? 'Lớp học',
  }
})

export const rubricTemplatesMock: RubricTemplate[] = [
  {
    id: 'rubric-ai-01',
    label: 'Rubric bài viết học thuật',
    description: 'Đánh giá theo bố cục, luận điểm và dẫn chứng.',
  },
  {
    id: 'rubric-code-01',
    label: 'Rubric bài lập trình',
    description: 'Đánh giá theo đúng yêu cầu, chất lượng mã và báo cáo.',
  },
  {
    id: 'rubric-team-01',
    label: 'Rubric làm việc nhóm',
    description: 'Đánh giá theo phân công, tiến độ và tổng kết.',
  },
]

export const assignmentQuestionsDraft: AssignmentQuestionDraft[] = [
  {
    id: 'q1',
    order: 1,
    prompt: 'Phân tích yêu cầu đánh giá và đề xuất tiêu chí chấm phù hợp cho bài tập.',
    rubricNote: 'Tập trung vào tính rõ ràng, khả thi và liên kết với mục tiêu học phần.',
    maxScore: 4,
  },
  {
    id: 'q2',
    order: 2,
    prompt: 'Mô tả quy trình triển khai và cách theo dõi tiến độ bài làm của sinh viên.',
    rubricNote: 'Đánh giá độ đầy đủ của luồng, tính khả thi và minh chứng.',
    maxScore: 3,
  },
  {
    id: 'q3',
    order: 3,
    prompt: 'Đề xuất một cải tiến sử dụng AI để nâng cao chất lượng phản hồi.',
    rubricNote: 'Chấm theo tính sáng tạo, tính phù hợp và tính thực tiễn.',
    maxScore: 3,
  },
]

export const assignmentChecklistMock: AssignmentCreateChecklistItem[] = [
  {
    id: 'check-deadline',
    label: 'Xác nhận hạn nộp và chính sách trễ hạn',
    detail: 'Hạn nộp đang đặt ở 23:59 ngày 20/04/2026.',
    tone: 'info',
  },
  {
    id: 'check-rubric',
    label: 'Bổ sung rubric chi tiết cho từng câu hỏi',
    detail: 'Mỗi câu có tối thiểu 3 tiêu chí chấm.',
    tone: 'warning',
  },
  {
    id: 'check-format',
    label: 'Định dạng nộp bài',
    detail: 'PDF, DOCX hoặc liên kết Drive.',
    tone: 'success',
  },
]

export const lecturerStudentsMock = rbacUsersMock
  .filter((user) => user.role === 'student')
  .map((student) => ({
    id: student.id,
    name: student.fullName,
    email: student.email,
  }))

export const lecturerClassStudentMap: Record<string, string[]> = rbacEnrollmentsMock.reduce<Record<string, string[]>>(
  (acc, item) => {
    if (!acc[item.classId]) {
      acc[item.classId] = []
    }
    acc[item.classId].push(item.studentId)
    return acc
  },
  {},
)
