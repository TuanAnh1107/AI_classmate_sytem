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
  {
    id_assignment: 'asg-it4409-03',
    deadline: '2026-04-25T23:59:00',
    constraint: 'allow_late',
    class_code: 'it4409',
    created_at: '2026-04-10T09:00:00',
  },
  {
    id_assignment: 'asg-it4409-04',
    deadline: '2026-04-30T23:59:00',
    constraint: 'allow_late',
    class_code: 'it4409',
    created_at: '2026-04-11T08:30:00',
  },
  {
    id_assignment: 'asg-em1180-02',
    deadline: '2026-04-18T17:00:00',
    constraint: 'no_late',
    class_code: 'em1180',
    created_at: '2026-04-08T08:20:00',
  },
  {
    id_assignment: 'asg-mi2021-02',
    deadline: '2026-04-20T23:59:00',
    constraint: 'allow_late',
    class_code: 'mi2021',
    created_at: '2026-04-09T07:45:00',
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
  {
    id_assignment: 'asg-it4409-03',
    title: 'Bài tập 03 - Thiết kế UI cho hệ thống nộp bài online',
    note: 'Xây dựng wireframe và prototype cho giao diện sinh viên nộp bài, bao gồm luồng sử dụng và trạng thái bài.',
    type: 'pdf,zip',
  },
  {
    id_assignment: 'asg-it4409-04',
    title: 'Bài tập 04 - Thiết kế API quản lý nộp bài',
    note: 'Định nghĩa endpoint cho tạo bài tập, nộp bài, xem kết quả và gửi phản hồi phúc khảo.',
    type: 'pdf,zip',
  },
  {
    id_assignment: 'asg-em1180-02',
    title: 'Bài phản hồi tuần 8 - Đánh giá chất lượng dữ liệu',
    note: 'Phân tích tính đầy đủ, độ tin cậy của dữ liệu giáo dục và đề xuất cách trực quan hóa.',
    type: 'pdf',
  },
  {
    id_assignment: 'asg-mi2021-02',
    title: 'Bài tập tuần 10 - Mô phỏng phân phối mẫu',
    note: 'Viết báo cáo ngắn và nộp mã nguồn mô phỏng phân phối mẫu, kèm giải thích kết quả.',
    type: 'pdf,zip',
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
  { id_assignment: 'asg-it4409-03', id_question: 'q-it4409-03-1' },
  { id_assignment: 'asg-it4409-03', id_question: 'q-it4409-03-2' },
  { id_assignment: 'asg-it4409-04', id_question: 'q-it4409-04-1' },
  { id_assignment: 'asg-it4409-04', id_question: 'q-it4409-04-2' },
  { id_assignment: 'asg-em1180-02', id_question: 'q-em1180-02-1' },
  { id_assignment: 'asg-em1180-02', id_question: 'q-em1180-02-2' },
  { id_assignment: 'asg-mi2021-02', id_question: 'q-mi2021-02-1' },
  { id_assignment: 'asg-mi2021-02', id_question: 'q-mi2021-02-2' },
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
  {
    id_question: 'q-it4409-03-1',
    id_teacher: 'lect-it4409',
    version: 1,
    type_grade: 'rubric',
    created_at: '2026-04-10T09:10:00',
  },
  {
    id_question: 'q-it4409-03-2',
    id_teacher: 'lect-it4409',
    version: 1,
    type_grade: 'rubric',
    created_at: '2026-04-10T09:12:00',
  },
  {
    id_question: 'q-it4409-04-1',
    id_teacher: 'lect-it4409',
    version: 1,
    type_grade: 'rubric',
    created_at: '2026-04-11T08:35:00',
  },
  {
    id_question: 'q-it4409-04-2',
    id_teacher: 'lect-it4409',
    version: 1,
    type_grade: 'rubric',
    created_at: '2026-04-11T08:37:00',
  },
  {
    id_question: 'q-em1180-02-1',
    id_teacher: 'lect-em1180',
    version: 1,
    type_grade: 'rubric',
    created_at: '2026-04-08T08:25:00',
  },
  {
    id_question: 'q-em1180-02-2',
    id_teacher: 'lect-em1180',
    version: 1,
    type_grade: 'rubric',
    created_at: '2026-04-08T08:27:00',
  },
  {
    id_question: 'q-mi2021-02-1',
    id_teacher: 'lect-mi2021',
    version: 1,
    type_grade: 'rubric',
    created_at: '2026-04-09T07:50:00',
  },
  {
    id_question: 'q-mi2021-02-2',
    id_teacher: 'lect-mi2021',
    version: 1,
    type_grade: 'rubric',
    created_at: '2026-04-09T07:52:00',
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
  {
    id_question: 'q-it4409-03-1',
    text_content: 'Mô tả user flow của sinh viên từ lúc mở bài tập đến khi nộp bài thành công.',
  },
  {
    id_question: 'q-it4409-03-2',
    text_content: 'Thiết kế wireframe cho trang nộp bài, bao gồm khu vực câu hỏi, upload file và nút xác nhận.',
  },
  {
    id_question: 'q-it4409-04-1',
    text_content: 'Xác định các API tối thiểu để hỗ trợ giảng viên tạo bài tập và sinh viên nộp bài.',
  },
  {
    id_question: 'q-it4409-04-2',
    text_content: 'Mô tả payload phản hồi khi công bố điểm và lịch sử chỉnh sửa bài nộp.',
  },
  {
    id_question: 'q-em1180-02-1',
    text_content: 'Phân tích ít nhất hai rủi ro về chất lượng dữ liệu trong bộ dữ liệu giáo dục.',
  },
  {
    id_question: 'q-em1180-02-2',
    text_content: 'Đề xuất cách trực quan hóa dữ liệu để giúp giảng viên ra quyết định nhanh hơn.',
  },
  {
    id_question: 'q-mi2021-02-1',
    text_content: 'Mô tả cách sinh mẫu ngẫu nhiên và các tham số cần kiểm soát trong mô phỏng.',
  },
  {
    id_question: 'q-mi2021-02-2',
    text_content: 'So sánh kết quả mô phỏng với phân phối lý thuyết và giải thích sai lệch nếu có.',
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
  {
    id_question: 'q-it4409-03-2',
    link_file: 'https://drive.google.com/wireframe-template-it4409',
    type_file: 'fig',
  },
  {
    id_question: 'q-it4409-04-2',
    link_file: 'https://drive.google.com/api-contract-template',
    type_file: 'pdf',
  },
  {
    id_question: 'q-mi2021-02-1',
    link_file: 'https://drive.google.com/mi2021-sample-dataset',
    type_file: 'csv',
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
  { id_question: 'q-it4409-03-1', max_score: 3, content: 'Liệt kê đủ các bước chính trong luồng.' },
  { id_question: 'q-it4409-03-1', max_score: 3, content: 'Mô tả rõ trạng thái hệ thống ở mỗi bước.' },
  { id_question: 'q-it4409-03-1', max_score: 4, content: 'Xử lý trường hợp ngoại lệ như lỗi upload hoặc quá hạn.' },
  { id_question: 'q-it4409-03-2', max_score: 3, content: 'Wireframe rõ ràng, đủ thành phần.' },
  { id_question: 'q-it4409-03-2', max_score: 3, content: 'Giải thích thiết kế có logic.' },
  { id_question: 'q-it4409-03-2', max_score: 4, content: 'Thiết kế responsive và thân thiện người dùng.' },
  { id_question: 'q-it4409-04-1', max_score: 4, content: 'Liệt kê đúng endpoint cốt lõi.' },
  { id_question: 'q-it4409-04-1', max_score: 3, content: 'Payload đáp ứng đúng nghiệp vụ.' },
  { id_question: 'q-it4409-04-2', max_score: 3, content: 'Bám đúng trạng thái nộp bài và công bố điểm.' },
  { id_question: 'q-em1180-02-1', max_score: 4, content: 'Nêu rõ rủi ro chất lượng dữ liệu.' },
  { id_question: 'q-em1180-02-1', max_score: 3, content: 'Có dẫn chứng hoặc ví dụ phù hợp.' },
  { id_question: 'q-em1180-02-2', max_score: 3, content: 'Đề xuất trực quan hóa có khả năng ứng dụng.' },
  { id_question: 'q-mi2021-02-1', max_score: 4, content: 'Mô tả đúng quy trình sinh mẫu và mô phỏng.' },
  { id_question: 'q-mi2021-02-2', max_score: 3, content: 'So sánh được với phân phối lý thuyết.' },
  { id_question: 'q-mi2021-02-2', max_score: 3, content: 'Giải thích được sai lệch quan sát được.' },
]

export const dbAssignmentListSubmissions: DbAssignmentListSubmission[] = [
  { id_assignment: 'asg-it4409-01', id_list_submission: 'list-it4409-01' },
  { id_assignment: 'asg-it4409-02', id_list_submission: 'list-it4409-02' },
  { id_assignment: 'asg-it4409-00', id_list_submission: 'list-it4409-00' },
  { id_assignment: 'asg-em1180-01', id_list_submission: 'list-em1180-01' },
  { id_assignment: 'asg-mi2021-01', id_list_submission: 'list-mi2021-01' },
  { id_assignment: 'asg-it4409-03', id_list_submission: 'list-it4409-03' },
  { id_assignment: 'asg-em1180-02', id_list_submission: 'list-em1180-02' },
  { id_assignment: 'asg-mi2021-02', id_list_submission: 'list-mi2021-02' },
]

export const dbListSubmissions: DbListSubmission[] = [
  { id_list_submission: 'list-it4409-01', id_submission: 'sub-01' },
  { id_list_submission: 'list-it4409-01', id_submission: 'sub-06' },
  { id_list_submission: 'list-it4409-01', id_submission: 'sub-07' },
  { id_list_submission: 'list-it4409-02', id_submission: 'sub-02' },
  { id_list_submission: 'list-it4409-00', id_submission: 'sub-03' },
  { id_list_submission: 'list-em1180-01', id_submission: 'sub-04' },
  { id_list_submission: 'list-mi2021-01', id_submission: 'sub-05' },
  { id_list_submission: 'list-mi2021-01', id_submission: 'sub-13' },
  { id_list_submission: 'list-it4409-03', id_submission: 'sub-08' },
  { id_list_submission: 'list-it4409-03', id_submission: 'sub-09' },
  { id_list_submission: 'list-it4409-03', id_submission: 'sub-10' },
  { id_list_submission: 'list-it4409-03', id_submission: 'sub-11' },
  { id_list_submission: 'list-em1180-02', id_submission: 'sub-12' },
  { id_list_submission: 'list-mi2021-02', id_submission: 'sub-14' },
  { id_list_submission: 'list-mi2021-02', id_submission: 'sub-15' },
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
  {
    id_submission: 'sub-06',
    id_student: '20231572',
    status_grade: 'submitted',
    created_at: '2026-04-09T18:00:00',
  },
  {
    id_submission: 'sub-07',
    id_student: '20231604',
    status_grade: 'late',
    created_at: '2026-04-10T07:45:00',
  },
  {
    id_submission: 'sub-08',
    id_student: '20231556',
    status_grade: 'draft',
    created_at: '2026-04-11T20:30:00',
  },
  {
    id_submission: 'sub-09',
    id_student: '20231572',
    status_grade: 'submitted',
    created_at: '2026-04-14T18:20:00',
  },
  {
    id_submission: 'sub-10',
    id_student: '20231572',
    status_grade: 'submitted',
    created_at: '2026-04-18T19:05:00',
  },
  {
    id_submission: 'sub-11',
    id_student: '20231688',
    status_grade: 'submitted',
    created_at: '2026-04-17T13:40:00',
  },
  {
    id_submission: 'sub-12',
    id_student: '20231556',
    status_grade: 'graded',
    created_at: '2026-04-16T10:15:00',
  },
  {
    id_submission: 'sub-13',
    id_student: '20231688',
    status_grade: 'submitted',
    created_at: '2026-04-02T21:10:00',
  },
  {
    id_submission: 'sub-14',
    id_student: '20231556',
    status_grade: 'draft',
    created_at: '2026-04-11T22:00:00',
  },
  {
    id_submission: 'sub-15',
    id_student: '20231702',
    status_grade: 'submitted',
    created_at: '2026-04-18T22:10:00',
  },
]

export const dbContentSubmissions: DbContentSubmission[] = [
  { id_submission: 'sub-01', text_content: 'Em đã trình bày quy trình theo các bước chính của hệ thống.' },
  { id_submission: 'sub-02', text_content: 'Đã nộp đầy đủ rubric nhóm.' },
  { id_submission: 'sub-03', text_content: 'Bài đã nộp đúng hạn tuần 7.' },
  { id_submission: 'sub-04', text_content: 'Phản biện theo hai câu hỏi chính.' },
  { id_submission: 'sub-05', text_content: '' },
  { id_submission: 'sub-06', text_content: 'Em đã tách rõ từng bước trong luồng chấm và thêm đề xuất cải tiến.' },
  { id_submission: 'sub-07', text_content: 'Nộp trễ do cập nhật lại ví dụ minh họa cho phần phản hồi.' },
  { id_submission: 'sub-08', text_content: 'Đang hoàn thiện wireframe và mô tả trạng thái hệ thống.' },
  { id_submission: 'sub-09', text_content: 'Phiên bản 1 tập trung vào sơ đồ điều hướng và khu vực upload file.' },
  { id_submission: 'sub-10', text_content: 'Phiên bản 2 bổ sung trạng thái lỗi, lịch sử nộp và phản hồi chấm.' },
  { id_submission: 'sub-11', text_content: 'Mô tả user flow và đính kèm prototype PDF.' },
  { id_submission: 'sub-12', text_content: 'Bài phân tích chất lượng dữ liệu và đề xuất dashboard cho giảng viên.' },
  { id_submission: 'sub-13', text_content: 'Phân tích dữ liệu mô phỏng bằng bảng và đồ thị cơ bản.' },
  { id_submission: 'sub-14', text_content: 'Đang hoàn thiện mô phỏng phân phối mẫu và chú thích cho mã nguồn.' },
  { id_submission: 'sub-15', text_content: 'Bản mô phỏng đã có mã nguồn và báo cáo tóm tắt.' },
]

export const dbContentFileSubmissions: DbContentFileSubmission[] = [
  { id_submission: 'sub-01', link_file: 'https://drive.google.com/file/ai-it4409-01.pdf', type_file: 'pdf' },
  { id_submission: 'sub-02', link_file: 'https://drive.google.com/file/rubric-phan-bien.pdf', type_file: 'pdf' },
  { id_submission: 'sub-06', link_file: 'https://drive.google.com/file/it4409-01-student-72.pdf', type_file: 'pdf' },
  { id_submission: 'sub-07', link_file: 'https://drive.google.com/file/it4409-01-student-604.pdf', type_file: 'pdf' },
  { id_submission: 'sub-08', link_file: 'https://drive.google.com/file/wireframe-draft-v1.zip', type_file: 'zip' },
  { id_submission: 'sub-09', link_file: 'https://drive.google.com/file/wireframe-v1.pdf', type_file: 'pdf' },
  { id_submission: 'sub-10', link_file: 'https://drive.google.com/file/wireframe-v2.zip', type_file: 'zip' },
  { id_submission: 'sub-11', link_file: 'https://drive.google.com/file/prototype-phamgiahuy.pdf', type_file: 'pdf' },
  { id_submission: 'sub-12', link_file: 'https://drive.google.com/file/em1180-data-quality.pdf', type_file: 'pdf' },
  { id_submission: 'sub-13', link_file: 'https://drive.google.com/file/mi2021-analysis.pdf', type_file: 'pdf' },
  { id_submission: 'sub-14', link_file: 'https://drive.google.com/file/mi2021-simulation-draft.zip', type_file: 'zip' },
  { id_submission: 'sub-15', link_file: 'https://drive.google.com/file/mi2021-simulation-final.zip', type_file: 'zip' },
]

export const dbResultSubmissions: DbResultSubmission[] = [
  { id_submission: 'sub-03', score: 9.1, created_at: '2026-03-26T15:00:00' },
  { id_submission: 'sub-04', score: 8.6, created_at: '2026-04-02T09:10:00' },
  { id_submission: 'sub-12', score: 8.9, created_at: '2026-04-18T08:40:00' },
]

export const dbResultFeedbacks: DbResultFeedback[] = [
  { id_submission: 'sub-03', id_feedback: 'fb-it4409-00' },
  { id_submission: 'sub-04', id_feedback: 'fb-em1180-01' },
  { id_submission: 'sub-12', id_feedback: 'fb-em1180-02' },
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
  {
    id_feedback: 'fb-em1180-02',
    feedback:
      'Phân tích dữ liệu tốt, nhưng phần trực quan hóa mới dừng ở mức liệt kê. Cần làm rõ giảng viên sẽ dùng biểu đồ này để ra quyết định như thế nào.',
    id_feedback_previous: null,
    id_user: 'lect-em1180',
    created_at: '2026-04-18T08:45:00',
  },
  {
    id_feedback: 'fb-em1180-02-1',
    feedback:
      'Em muốn xin phúc khảo phần trực quan hóa vì em có thêm bản cập nhật minh họa việc theo dõi sinh viên có nguy cơ học kém.',
    id_feedback_previous: 'fb-em1180-02',
    id_user: '20231556',
    created_at: '2026-04-18T10:10:00',
  },
  {
    id_feedback: 'fb-em1180-02-2',
    feedback: 'Giảng viên đã ghi nhận yêu cầu phúc khảo. Em bổ sung file minh họa để đối chiếu trong lượt chấm tiếp theo.',
    id_feedback_previous: 'fb-em1180-02-1',
    id_user: 'lect-em1180',
    created_at: '2026-04-18T11:30:00',
  },
]
