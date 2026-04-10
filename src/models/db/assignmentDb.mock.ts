import type {
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

export const dbInfoAssignments: DbInfoAssignment[] = [
  {
    id_assignment: 'asg-it4409-01',
    deadline: '2026-04-09T23:59:00',
    constraint: 'no_late',
    class_code: 'it4409',
    created_at: '2026-03-25T08:10:00',
  },
  {
    id_assignment: 'asg-it4409-02',
    deadline: '2026-04-03T23:59:00',
    constraint: 'allow_late',
    class_code: 'it4409',
    created_at: '2026-03-18T09:15:00',
  },
  {
    id_assignment: 'asg-it4409-00',
    deadline: '2026-03-25T23:59:00',
    constraint: 'no_late',
    class_code: 'it4409',
    created_at: '2026-03-10T08:00:00',
  },
  {
    id_assignment: 'asg-em1180-01',
    deadline: '2026-03-29T17:00:00',
    constraint: 'no_late',
    class_code: 'em1180',
    created_at: '2026-03-12T11:20:00',
  },
  {
    id_assignment: 'asg-mi2021-01',
    deadline: '2026-04-02T23:59:00',
    constraint: 'allow_late',
    class_code: 'mi2021',
    created_at: '2026-03-20T07:15:00',
  },
]

export const dbContentAssignments: DbContentAssignment[] = [
  {
    id_assignment: 'asg-it4409-01',
    title: 'Bài tập 01 - Phân tích luồng chấm điểm bằng AI',
    note: 'Phân tích quy trình chấm điểm tự động và đề xuất cải tiến dựa trên rubric.',
    type: 'pdf,zip',
  },
  {
    id_assignment: 'asg-it4409-02',
    title: 'Bài tập 02 - Thiết kế rubric cho bài phản biện nhóm',
    note: 'Thiết kế bộ tiêu chí chấm cho bài phản biện nhóm theo chuẩn học thuật.',
    type: 'pdf',
  },
  {
    id_assignment: 'asg-it4409-00',
    title: 'Bài tập tuần 7 - Mô hình hóa quy trình phản hồi tự động',
    note: 'Phân tích luồng xử lý và vai trò của hệ thống phản hồi tự động.',
    type: 'text',
  },
  {
    id_assignment: 'asg-em1180-01',
    title: 'Bài phản hồi tuần 6 - Đọc và phản biện tài liệu',
    note: 'Viết phản biện theo cấu trúc học thuật và nhận xét có dẫn chứng.',
    type: 'text',
  },
  {
    id_assignment: 'asg-mi2021-01',
    title: 'Bài tập tuần 8 - Phân tích dữ liệu mô phỏng',
    note: 'Phân tích dữ liệu thống kê và giải thích các chỉ số quan trọng.',
    type: 'pdf',
  },
]

export const dbAssignmentQuestions: DbAssignmentQuestion[] = [
  { id_assignment: 'asg-it4409-01', id_question: 'q-it4409-01-1' },
  { id_assignment: 'asg-it4409-01', id_question: 'q-it4409-01-2' },
  { id_assignment: 'asg-it4409-01', id_question: 'q-it4409-01-3' },
  { id_assignment: 'asg-it4409-02', id_question: 'q-it4409-02-1' },
  { id_assignment: 'asg-it4409-00', id_question: 'q-it4409-00-1' },
  { id_assignment: 'asg-it4409-00', id_question: 'q-it4409-00-2' },
  { id_assignment: 'asg-em1180-01', id_question: 'q-em1180-01-1' },
  { id_assignment: 'asg-em1180-01', id_question: 'q-em1180-01-2' },
  { id_assignment: 'asg-mi2021-01', id_question: 'q-mi2021-01-1' },
]

export const dbInfoQuestions: DbInfoQuestion[] = [
  {
    id_question: 'q-it4409-01-1',
    id_teacher: 'lect-it4409',
    version: 1,
    type_grade: 'rubric',
    created_at: '2026-03-25T08:30:00',
  },
  {
    id_question: 'q-it4409-01-2',
    id_teacher: 'lect-it4409',
    version: 1,
    type_grade: 'rubric',
    created_at: '2026-03-25T08:32:00',
  },
  {
    id_question: 'q-it4409-01-3',
    id_teacher: 'lect-it4409',
    version: 1,
    type_grade: 'rubric',
    created_at: '2026-03-25T08:34:00',
  },
  {
    id_question: 'q-it4409-02-1',
    id_teacher: 'lect-it4409',
    version: 2,
    type_grade: 'rubric',
    created_at: '2026-03-18T10:00:00',
  },
  {
    id_question: 'q-it4409-00-1',
    id_teacher: 'lect-it4409',
    version: 1,
    type_grade: 'rubric',
    created_at: '2026-03-10T08:10:00',
  },
  {
    id_question: 'q-it4409-00-2',
    id_teacher: 'lect-it4409',
    version: 1,
    type_grade: 'rubric',
    created_at: '2026-03-10T08:12:00',
  },
  {
    id_question: 'q-em1180-01-1',
    id_teacher: 'lect-em1180',
    version: 1,
    type_grade: 'rubric',
    created_at: '2026-03-12T11:25:00',
  },
  {
    id_question: 'q-em1180-01-2',
    id_teacher: 'lect-em1180',
    version: 1,
    type_grade: 'rubric',
    created_at: '2026-03-12T11:28:00',
  },
  {
    id_question: 'q-mi2021-01-1',
    id_teacher: 'lect-mi2021',
    version: 1,
    type_grade: 'rubric',
    created_at: '2026-03-20T07:25:00',
  },
]

export const dbContentQuestions: DbContentQuestion[] = [
  {
    id_question: 'q-it4409-01-1',
    text_content: 'Mô tả quy trình xử lý bài nộp từ lúc sinh viên gửi bài đến khi giảng viên công bố kết quả.',
  },
  {
    id_question: 'q-it4409-01-2',
    text_content: 'Đề xuất cách hiển thị rubric để sinh viên hiểu rõ tiêu chí trước khi nộp bài.',
  },
  {
    id_question: 'q-it4409-01-3',
    text_content: 'Nêu một rủi ro khi dùng AI hỗ trợ phản hồi học tập và cách giảm thiểu.',
  },
  {
    id_question: 'q-it4409-02-1',
    text_content: 'Xây dựng thang tiêu chí cho phần mở đầu của báo cáo nhóm.',
  },
  {
    id_question: 'q-it4409-00-1',
    text_content: 'Mô tả vai trò của hệ thống trong bước tiếp nhận và lưu trữ bài nộp.',
  },
  {
    id_question: 'q-it4409-00-2',
    text_content: 'Phân tích cách hệ thống gửi phản hồi lại cho sinh viên sau khi chấm.',
  },
  {
    id_question: 'q-em1180-01-1',
    text_content: 'Tóm tắt luận điểm chính của tài liệu và đánh giá tính thuyết phục.',
  },
  {
    id_question: 'q-em1180-01-2',
    text_content: 'Đề xuất một cách cải thiện lập luận của tác giả.',
  },
  {
    id_question: 'q-mi2021-01-1',
    text_content: 'Giải thích cách tính kỳ vọng và phương sai của mẫu dữ liệu đã cho.',
  },
]

export const dbContentFileQuestions: DbContentFileQuestion[] = [
  {
    id_question: 'q-it4409-01-2',
    link_file: 'https://drive.google.com/rubric-it4409',
    type_file: 'docx',
  },
  {
    id_question: 'q-em1180-01-1',
    link_file: 'https://drive.google.com/em1180',
    type_file: 'pdf',
  },
]

export const dbRubricQuestions: DbRubricQuestion[] = [
  { id_question: 'q-it4409-01-1', max_score: 3, content: 'Nêu đủ các bước chính trong hệ thống.' },
  { id_question: 'q-it4409-01-1', max_score: 2, content: 'Phân biệt vai trò sinh viên, giảng viên và AI.' },
  { id_question: 'q-it4409-01-2', max_score: 2, content: 'Giải pháp bám đúng bài tập học thuật.' },
  { id_question: 'q-it4409-01-2', max_score: 2, content: 'Triển khai được trên giao diện hiện có.' },
  { id_question: 'q-it4409-01-2', max_score: 1, content: 'Người học đọc hiểu nhanh.' },
  { id_question: 'q-it4409-01-3', max_score: 2, content: 'Nêu đúng rủi ro gắn với đánh giá học tập.' },
  { id_question: 'q-it4409-01-3', max_score: 2, content: 'Biện pháp giảm thiểu có tính thực tế.' },
  { id_question: 'q-it4409-02-1', max_score: 3, content: 'Ít nhất 3 tiêu chí rõ nghĩa.' },
  { id_question: 'q-it4409-02-1', max_score: 2, content: 'Mỗi tiêu chí có mức đánh giá cụ thể.' },
  { id_question: 'q-it4409-00-1', max_score: 5, content: 'Nêu đúng vai trò của submission record.' },
  { id_question: 'q-it4409-00-2', max_score: 5, content: 'Đưa ra ít nhất một ví dụ về phản hồi theo rubric.' },
  { id_question: 'q-em1180-01-1', max_score: 4, content: 'Tóm tắt đúng ý chính.' },
  { id_question: 'q-em1180-01-1', max_score: 3, content: 'Nêu được nhận định cá nhân rõ ràng.' },
  { id_question: 'q-em1180-01-2', max_score: 3, content: 'Đề xuất gắn đúng vấn đề.' },
  { id_question: 'q-mi2021-01-1', max_score: 5, content: 'Sử dụng đúng ký hiệu và cách biến đổi.' },
]

export const dbAssignmentListSubmissions: DbAssignmentListSubmission[] = [
  { id_assignment: 'asg-it4409-01', id_list_submission: 'list-it4409-01' },
  { id_assignment: 'asg-it4409-02', id_list_submission: 'list-it4409-02' },
  { id_assignment: 'asg-it4409-00', id_list_submission: 'list-it4409-00' },
  { id_assignment: 'asg-em1180-01', id_list_submission: 'list-em1180-01' },
  { id_assignment: 'asg-mi2021-01', id_list_submission: 'list-mi2021-01' },
]

export const dbListSubmissions: DbListSubmission[] = [
  { id_list_submission: 'list-it4409-01', id_submission: 'sub-01' },
  { id_list_submission: 'list-it4409-02', id_submission: 'sub-02' },
  { id_list_submission: 'list-it4409-00', id_submission: 'sub-03' },
  { id_list_submission: 'list-em1180-01', id_submission: 'sub-04' },
  { id_list_submission: 'list-mi2021-01', id_submission: 'sub-05' },
]

export const dbInfoSubmissions: DbInfoSubmission[] = [
  {
    id_submission: 'sub-01',
    id_student: '20231556',
    status_grade: 'draft',
    created_at: '2026-04-04T20:40:00',
  },
  {
    id_submission: 'sub-02',
    id_student: '20231556',
    status_grade: 'submitted',
    created_at: '2026-04-03T21:14:00',
  },
  {
    id_submission: 'sub-03',
    id_student: '20231556',
    status_grade: 'graded',
    created_at: '2026-03-25T20:10:00',
  },
  {
    id_submission: 'sub-04',
    id_student: '20231556',
    status_grade: 'graded',
    created_at: '2026-03-29T15:24:00',
  },
  {
    id_submission: 'sub-05',
    id_student: '20231556',
    status_grade: 'late',
    created_at: '2026-04-03T00:10:00',
  },
]

export const dbContentSubmissions: DbContentSubmission[] = [
  { id_submission: 'sub-01', text_content: 'Em đã trình bày quy trình theo các bước chính của hệ thống.' },
  { id_submission: 'sub-02', text_content: 'Đã nộp đầy đủ rubric nhóm.' },
  { id_submission: 'sub-03', text_content: 'Bài đã nộp đúng hạn tuần 7.' },
  { id_submission: 'sub-04', text_content: 'Phản biện theo hai câu hỏi chính.' },
  { id_submission: 'sub-05', text_content: '' },
]

export const dbContentFileSubmissions: DbContentFileSubmission[] = [
  { id_submission: 'sub-01', link_file: 'https://drive.google.com/file/ai-it4409-01.pdf', type_file: 'pdf' },
  { id_submission: 'sub-02', link_file: 'https://drive.google.com/file/rubric-phan-bien.pdf', type_file: 'pdf' },
]

export const dbResultSubmissions: DbResultSubmission[] = [
  { id_submission: 'sub-03', score: 9.1, created_at: '2026-03-26T15:00:00' },
  { id_submission: 'sub-04', score: 8.6, created_at: '2026-04-02T09:10:00' },
]

export const dbResultFeedbacks: DbResultFeedback[] = [
  { id_submission: 'sub-03', id_feedback: 'fb-it4409-00' },
  { id_submission: 'sub-04', id_feedback: 'fb-em1180-01' },
]

export const dbFeedbackSubmissions: DbFeedbackSubmission[] = [
  {
    id_feedback: 'fb-em1180-01',
    feedback:
      'Bài làm có lập luận chắc và bám sát tài liệu. Cần rút gọn phần dẫn nhập và làm rõ hơn liên hệ thực tế ở câu 2.',
    id_feedback_previous: null,
    id_user: 'lect-em1180',
    created_at: '2026-04-02T09:20:00',
  },
  {
    id_feedback: 'fb-em1180-01-1',
    feedback: 'Em cảm ơn cô. Với câu 2, em nên bổ sung ví dụ thực tế ở phần nào để thuyết phục hơn ạ?',
    id_feedback_previous: 'fb-em1180-01',
    id_user: '20231556',
    created_at: '2026-04-02T12:05:00',
  },
  {
    id_feedback: 'fb-em1180-01-2',
    feedback:
      'Em có thể liên hệ với tình huống phản biện trong lớp tuần trước, như vậy sẽ sát với bối cảnh học phần hơn.',
    id_feedback_previous: 'fb-em1180-01-1',
    id_user: 'lect-em1180',
    created_at: '2026-04-02T14:10:00',
  },
  {
    id_feedback: 'fb-it4409-00',
    feedback: 'Bài trình bày gọn và đúng mục tiêu. Cần chuẩn hóa thuật ngữ ở phần kết luận.',
    id_feedback_previous: null,
    id_user: 'lect-it4409',
    created_at: '2026-03-26T15:05:00',
  },
]
