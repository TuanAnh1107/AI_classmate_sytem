import type { Assignment, Submission } from '../models/assignment/assignment.types'

export type ValidationResult = {
  isValid: boolean
  message?: string
}

export function validateAssignmentDraft(assignment: Pick<Assignment, 'title' | 'description' | 'dueAt' | 'maxScore'>): ValidationResult {
  if (!assignment.title.trim()) {
    return { isValid: false, message: 'Tiêu đề bài tập là bắt buộc.' }
  }
  if (!assignment.description.trim()) {
    return { isValid: false, message: 'Mô tả bài tập là bắt buộc.' }
  }
  if (!assignment.dueAt.trim()) {
    return { isValid: false, message: 'Hạn nộp không hợp lệ.' }
  }
  if (assignment.maxScore < 0) {
    return { isValid: false, message: 'Điểm tối đa phải lớn hơn hoặc bằng 0.' }
  }
  return { isValid: true }
}

export function validateSubmissionPayload(payload: Pick<Submission, 'contentText' | 'attachmentUrls'>): ValidationResult {
  const hasText = payload.contentText.trim().length > 0
  const hasAttachment = payload.attachmentUrls.length > 0
  if (!hasText && !hasAttachment) {
    return { isValid: false, message: 'Bạn cần nhập nội dung hoặc đính kèm tệp trước khi nộp.' }
  }
  return { isValid: true }
}
