export const ROLE_OPTIONS = [
  { value: 'all', label: 'Tất cả vai trò' },
  { value: 'admin', label: 'Admin' },
  { value: 'lecturer', label: 'Giảng viên' },
  { value: 'student', label: 'Sinh viên' },
]

export const USER_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang hoạt động' },
  { value: 'disabled', label: 'Đã khóa' },
  { value: 'pending', label: 'Chờ kích hoạt' },
]

export const CLASS_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'active', label: 'Đang mở' },
  { value: 'paused', label: 'Tạm dừng' },
  { value: 'completed', label: 'Đã kết thúc' },
]

export const ASSIGNMENT_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'draft', label: 'Bản nháp' },
  { value: 'open', label: 'Đang mở' },
  { value: 'closed', label: 'Đã đóng' },
  { value: 'overdue', label: 'Quá hạn' },
]

export const SUBMISSION_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'submitted', label: 'Đã nộp' },
  { value: 'late', label: 'Nộp trễ' },
  { value: 'draft', label: 'Lưu nháp' },
  { value: 'missing', label: 'Chưa nộp' },
]

export const GRADING_STATUS_OPTIONS = [
  { value: 'all', label: 'Tất cả chấm điểm' },
  { value: 'graded', label: 'Đã chấm' },
  { value: 'ungraded', label: 'Chưa chấm' },
  { value: 'pending', label: 'Chờ rà soát' },
]

export const PAGE_SIZE_OPTIONS = [
  { value: '10', label: '10 / trang' },
  { value: '20', label: '20 / trang' },
  { value: '50', label: '50 / trang' },
  { value: '100', label: '100 / trang' },
]
