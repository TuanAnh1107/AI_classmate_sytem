import type {
  ClassAnnouncement,
  FeedbackThread,
  QuickGuideEntry,
  StudentAssignment,
  StudentClass,
  StudentProfile,
  StudentReminder,
  StudentResult,
} from './student.types'

export const studentProfileMock: StudentProfile = {
  id: '20231556',
  fullName: 'Nguyễn Tuấn Anh',
  studentCode: '20231556',
  faculty: 'Khoa Khoa học và Công nghệ giáo dục',
  program: 'Công nghệ giáo dục',
  email: 'anh.nt231556@sis.hust.edu.vn',
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
    room: 'TC-205',
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
    name: 'Xác suất thống kê ứng dụng',
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

export const studentAssignmentsMock: StudentAssignment[] = [
  {
    id: 'asg-it4409-01',
    classId: 'it4409',
    title: 'Bài tập 01 - Phân tích luồng chấm điểm bằng AI',
    deadline: '2026-04-09T23:59:00',
    submissionStatus: 'draft',
    gradingStatus: 'not_started',
    requirements: [
      { label: 'Hình thức', detail: 'Nộp câu trả lời trực tiếp và 01 tệp PDF tổng hợp' },
      { label: 'Thời lượng', detail: 'Hoàn thành trong tuần 9 của học phần' },
    ],
    instructions: [
      'Đọc kỹ yêu cầu từng câu và hoàn thành lần lượt theo thứ tự.',
      'Mỗi câu trả lời nên nêu rõ lập luận, ví dụ và đề xuất cải tiến.',
      'Tệp đính kèm cần cùng nội dung với phần trả lời trực tuyến.',
    ],
    allowedSubmissionFormats: ['PDF', 'ZIP'],
    draftSavedAt: '2026-04-04T20:40:00',
    questions: [
      {
        id: 'asg-it4409-01-q1',
        order: 1,
        prompt: 'Mô tả quy trình xử lý bài nộp từ lúc sinh viên gửi bài đến khi giảng viên công bố kết quả.',
        rubric: [
          { id: 'r1', label: 'Đúng quy trình', detail: 'Nêu đủ các bước chính trong hệ thống.', maxScore: 3 },
          { id: 'r2', label: 'Rõ vai trò', detail: 'Phân biệt rõ vai trò sinh viên, giảng viên và AI.', maxScore: 2 },
        ],
        answerText:
          'Sau khi sinh viên lưu nháp hoặc nộp bài, hệ thống tạo bản ghi submission, đồng bộ câu trả lời theo từng câu và chuyển sang hàng đợi chấm nếu bài đã gửi chính thức.',
        uploadedFiles: [{ id: 'f1', fileName: 'quy-trinh-cham-ai.pdf', sizeLabel: '1.2 MB' }],
        completionStatus: 'complete',
      },
      {
        id: 'asg-it4409-01-q2',
        order: 2,
        prompt: 'Đề xuất cách hiển thị rubric để sinh viên hiểu rõ tiêu chí trước khi nộp bài.',
        attachmentName: 'rubric-mau.docx',
        rubric: [
          { id: 'r3', label: 'Phù hợp ngữ cảnh', detail: 'Giải pháp bám đúng bài tập học thuật.', maxScore: 2 },
          { id: 'r4', label: 'Khả thi', detail: 'Triển khai được trên giao diện hiện có.', maxScore: 2 },
          { id: 'r5', label: 'Rõ ràng', detail: 'Người học đọc hiểu nhanh.', maxScore: 1 },
        ],
        answerText:
          'Rubric nên hiển thị ngay dưới từng câu, gói gọn theo mục tiêu chấm và số điểm tối đa để sinh viên chủ động kiểm tra mức độ hoàn thành trước khi nộp.',
        uploadedFiles: [],
        completionStatus: 'draft',
      },
      {
        id: 'asg-it4409-01-q3',
        order: 3,
        prompt: 'Nêu một rủi ro khi dùng AI hỗ trợ phản hồi học tập và cách giảm thiểu.',
        rubric: [
          { id: 'r6', label: 'Nêu đúng rủi ro', detail: 'Rủi ro phải gắn với đánh giá học tập.', maxScore: 2 },
          { id: 'r7', label: 'Giải pháp hợp lý', detail: 'Biện pháp giảm thiểu có tính thực tế.', maxScore: 2 },
        ],
        answerText: '',
        uploadedFiles: [],
        completionStatus: 'missing',
      },
    ],
  },
  {
    id: 'asg-it4409-02',
    classId: 'it4409',
    title: 'Bài tập 02 - Thiết kế rubric cho bài phản biện nhóm',
    deadline: '2026-04-03T23:59:00',
    submissionStatus: 'submitted',
    gradingStatus: 'pending',
    submittedAt: '2026-04-03T21:14:00',
    requirements: [
      { label: 'Hình thức', detail: 'Nộp trực tuyến và đính kèm bảng rubric nhóm' },
      { label: 'Minh chứng', detail: 'Mỗi câu cần gắn ví dụ từ báo cáo nhóm' },
    ],
    instructions: ['Hoàn thành đầy đủ ba câu hỏi và nộp trước hạn.', 'Mỗi câu trả lời không quá 400 từ.'],
    allowedSubmissionFormats: ['PDF'],
    questions: [
      {
        id: 'asg-it4409-02-q1',
        order: 1,
        prompt: 'Xây dựng thang tiêu chí cho phần mở đầu của báo cáo nhóm.',
        rubric: [
          { id: 'r8', label: 'Đủ tiêu chí', detail: 'Ít nhất 3 tiêu chí rõ nghĩa.', maxScore: 3 },
          { id: 'r9', label: 'Đo lường được', detail: 'Mỗi tiêu chí có mức đánh giá cụ thể.', maxScore: 2 },
        ],
        answerText: 'Đã nộp trực tuyến.',
        uploadedFiles: [{ id: 'f2', fileName: 'rubric-phan-bien.pdf', sizeLabel: '860 KB' }],
        completionStatus: 'complete',
      },
    ],
  },
  {
    id: 'asg-it4409-00',
    classId: 'it4409',
    title: 'Bài tập tuần 7 - Mô hình hóa quy trình phản hồi tự động',
    deadline: '2026-03-25T23:59:00',
    submissionStatus: 'submitted',
    gradingStatus: 'published',
    score: 9.1,
    submittedAt: '2026-03-25T20:10:00',
    requirements: [{ label: 'Hình thức', detail: 'Nộp câu trả lời trực tuyến theo từng câu hỏi' }],
    instructions: ['Tập trung phân tích luồng xử lý và mô tả rõ điểm can thiệp của giảng viên.'],
    allowedSubmissionFormats: ['Không yêu cầu tệp đính kèm'],
    questions: [
      {
        id: 'asg-it4409-00-q1',
        order: 1,
        prompt: 'Mô tả vai trò của hệ thống trong bước tiếp nhận và lưu trữ bài nộp.',
        rubric: [
          { id: 'r00-1', label: 'Đúng khái niệm', detail: 'Nêu đúng vai trò của submission record.', maxScore: 5 },
        ],
        answerText: 'Đã nộp trực tuyến.',
        uploadedFiles: [],
        completionStatus: 'complete',
      },
      {
        id: 'asg-it4409-00-q2',
        order: 2,
        prompt: 'Phân tích cách hệ thống gửi phản hồi lại cho sinh viên sau khi chấm.',
        rubric: [
          { id: 'r00-2', label: 'Có ví dụ', detail: 'Đưa ra ít nhất một ví dụ về phản hồi theo rubric.', maxScore: 5 },
        ],
        answerText: 'Đã nộp trực tuyến.',
        uploadedFiles: [],
        completionStatus: 'complete',
      },
    ],
  },
  {
    id: 'asg-em1180-01',
    classId: 'em1180',
    title: 'Bài phản hồi tuần 6 - Đọc và phản biện tài liệu',
    deadline: '2026-03-29T17:00:00',
    submissionStatus: 'submitted',
    gradingStatus: 'published',
    score: 8.6,
    submittedAt: '2026-03-29T15:24:00',
    requirements: [
      { label: 'Hình thức', detail: 'Nộp câu trả lời trực tuyến cho từng câu' },
      { label: 'Số câu', detail: '02 câu hỏi phản biện ngắn' },
    ],
    instructions: ['Ưu tiên lập luận rõ ràng và dùng dẫn chứng từ tài liệu đã cho.'],
    allowedSubmissionFormats: ['Không yêu cầu tệp đính kèm'],
    questions: [
      {
        id: 'asg-em1180-01-q1',
        order: 1,
        prompt: 'Tóm tắt luận điểm chính của tài liệu và đánh giá tính thuyết phục.',
        rubric: [
          { id: 'r10', label: 'Nắm đúng luận điểm', detail: 'Tóm tắt đúng ý chính.', maxScore: 4 },
          { id: 'r11', label: 'Có phản biện', detail: 'Nêu được nhận định cá nhân rõ ràng.', maxScore: 3 },
        ],
        answerText: 'Đã nộp trực tuyến.',
        uploadedFiles: [],
        completionStatus: 'complete',
      },
      {
        id: 'asg-em1180-01-q2',
        order: 2,
        prompt: 'Đề xuất một cách cải thiện lập luận của tác giả.',
        rubric: [{ id: 'r12', label: 'Hợp lý', detail: 'Đề xuất gắn đúng vấn đề.', maxScore: 3 }],
        answerText: 'Đã nộp trực tuyến.',
        uploadedFiles: [],
        completionStatus: 'complete',
      },
    ],
  },
  {
    id: 'asg-mi2021-01',
    classId: 'mi2021',
    title: 'Bài tập tuần 8 - Phân tích dữ liệu mô phỏng',
    deadline: '2026-04-02T23:59:00',
    submissionStatus: 'late',
    gradingStatus: 'not_started',
    requirements: [{ label: 'Hình thức', detail: 'Nộp file PDF và câu trả lời ngắn cho từng câu' }],
    instructions: ['Nếu nộp muộn, hệ thống vẫn ghi nhận nhưng trạng thái sẽ là quá hạn.'],
    allowedSubmissionFormats: ['PDF'],
    questions: [
      {
        id: 'asg-mi2021-01-q1',
        order: 1,
        prompt: 'Giải thích cách tính kỳ vọng và phương sai của mẫu dữ liệu đã cho.',
        rubric: [
          { id: 'r13', label: 'Đúng công thức', detail: 'Sử dụng đúng ký hiệu và cách biến đổi.', maxScore: 5 },
        ],
        answerText: '',
        uploadedFiles: [],
        completionStatus: 'missing',
      },
    ],
  },
]

export const studentResultsMock: StudentResult[] = [
  {
    id: 'res-em1180-01',
    assignmentId: 'asg-em1180-01',
    classId: 'em1180',
    totalScore: 8.6,
    maxScore: 10,
    updatedAt: '2026-04-02T09:10:00',
    feedbackStatus: 'new',
    lecturerFeedback:
      'Bài làm có lập luận chắc và bám sát tài liệu. Cần rút gọn phần dẫn nhập và làm rõ hơn liên hệ thực tế ở câu 2.',
    summary: [
      'Đã hoàn thành đầy đủ 2/2 câu hỏi.',
      'Điểm mạnh nằm ở lập luận phản biện.',
      'Nên trình bày ngắn gọn hơn ở phần mở đầu.',
    ],
    questionResults: [
      {
        questionId: 'asg-em1180-01-q1',
        questionLabel: 'Câu 1',
        score: 5,
        maxScore: 6,
        feedback: 'Tóm tắt đúng ý chính, có nhận xét riêng nhưng phần dẫn chứng còn hơi dài.',
        rubric: [
          { id: 'rr1', label: 'Nắm đúng luận điểm', achieved: true, note: 'Đạt yêu cầu.' },
          { id: 'rr2', label: 'Có phản biện', achieved: true, note: 'Nhận xét rõ, có quan điểm cá nhân.' },
        ],
      },
      {
        questionId: 'asg-em1180-01-q2',
        questionLabel: 'Câu 2',
        score: 3.6,
        maxScore: 4,
        feedback: 'Đề xuất phù hợp nhưng có thể bổ sung thêm ví dụ thực tiễn.',
        rubric: [{ id: 'rr3', label: 'Hợp lý', achieved: true, note: 'Giải pháp hợp ngữ cảnh.' }],
      },
    ],
  },
  {
    id: 'res-it4409-00',
    assignmentId: 'asg-it4409-00',
    classId: 'it4409',
    totalScore: 9.1,
    maxScore: 10,
    updatedAt: '2026-03-26T15:00:00',
    feedbackStatus: 'read',
    lecturerFeedback:
      'Bài trình bày gọn và hiểu đúng mục tiêu hệ thống. Cần chuẩn hóa thuật ngữ ở phần kết luận.',
    summary: ['Đạt 9.1/10.', 'Hoàn thành đủ các tiêu chí cốt lõi.', 'Đã đọc phản hồi của giảng viên.'],
    questionResults: [
      {
        questionId: 'asg-it4409-00-q1',
        questionLabel: 'Câu 1',
        score: 4.6,
        maxScore: 5,
        feedback: 'Trả lời đầy đủ, cần tối ưu cách dùng thuật ngữ.',
        rubric: [{ id: 'rr4', label: 'Đúng khái niệm', achieved: true, note: 'Đạt.' }],
      },
      {
        questionId: 'asg-it4409-00-q2',
        questionLabel: 'Câu 2',
        score: 4.5,
        maxScore: 5,
        feedback: 'Có ví dụ minh họa rõ, phần kết luận còn ngắn.',
        rubric: [{ id: 'rr5', label: 'Có ví dụ', achieved: true, note: 'Đạt.' }],
      },
    ],
  },
]

export const classAnnouncementsMock: ClassAnnouncement[] = [
  {
    id: 'note-it4409-01',
    classId: 'it4409',
    title: 'Nhắc hạn nộp Bài tập 01 trước 23:59 ngày 09/04',
    postedAt: '2026-04-04T10:00:00',
    summary: 'Sinh viên kiểm tra lại rubric từng câu và nộp đủ cả phần trả lời trực tuyến lẫn tệp đính kèm.',
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

export const feedbackThreadsMock: FeedbackThread[] = [
  {
    id: 'thread-em1180-01',
    assignmentId: 'asg-em1180-01',
    classId: 'em1180',
    title: 'Phản hồi cho Bài phản hồi tuần 6',
    status: 'new',
    updatedAt: '2026-04-02T09:20:00',
    messages: [
      {
        id: 'msg-1',
        authorRole: 'lecturer',
        authorName: 'ThS. Trần Thu Hương',
        sentAt: '2026-04-02T09:20:00',
        content: 'Em làm tốt phần phản biện. Cần chú ý rút gọn phần mở đầu để tập trung vào luận điểm chính.',
      },
      {
        id: 'msg-2',
        authorRole: 'student',
        authorName: 'Nguyễn Tuấn Anh',
        sentAt: '2026-04-02T12:05:00',
        content: 'Em cảm ơn cô. Với câu 2, em nên bổ sung ví dụ thực tế ở phần nào để thuyết phục hơn ạ?',
      },
      {
        id: 'msg-3',
        authorRole: 'lecturer',
        authorName: 'ThS. Trần Thu Hương',
        sentAt: '2026-04-02T14:10:00',
        content: 'Em có thể liên hệ với tình huống phản biện trong lớp tuần trước, như vậy sẽ sát với bối cảnh học phần hơn.',
      },
    ],
  },
  {
    id: 'thread-it4409-02',
    assignmentId: 'asg-it4409-02',
    classId: 'it4409',
    title: 'Trao đổi về bài tập rubric nhóm',
    status: 'reply_required',
    updatedAt: '2026-04-03T22:00:00',
    messages: [
      {
        id: 'msg-4',
        authorRole: 'system',
        authorName: 'Hệ thống',
        sentAt: '2026-04-03T22:00:00',
        content:
          'Bài nộp đã được ghi nhận và đang chờ giảng viên rà soát. Nếu cần bổ sung minh chứng, giảng viên sẽ phản hồi tại đây.',
      },
    ],
  },
  {
    id: 'thread-it4409-00',
    assignmentId: 'asg-it4409-00',
    classId: 'it4409',
    title: 'Nhận xét cho bài phân tích tuần 7',
    status: 'read',
    updatedAt: '2026-03-26T15:05:00',
    messages: [
      {
        id: 'msg-5',
        authorRole: 'lecturer',
        authorName: 'TS. Nguyễn Đức Minh',
        sentAt: '2026-03-26T15:05:00',
        content: 'Bài làm tốt, em lưu ý chuẩn hóa thuật ngữ khi mô tả các bước đánh giá tự động.',
      },
    ],
  },
]

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
