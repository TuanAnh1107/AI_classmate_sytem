import type { PortalPageFrame, PortalShellModel, StatusTone } from '../shared/portal.types'

export interface LecturerProfile {
  id: string
  fullName: string
  lecturerCode: string
  faculty: string
  email: string
}

export interface LecturerClassOption {
  id: string
  code: string
  name: string
}

export interface RubricTemplate {
  id: string
  label: string
  description: string
}

export interface AssignmentQuestionDraft {
  id: string
  order: number
  prompt: string
  rubricNote: string
  maxScore: number
}

export interface AssignmentCreateChecklistItem {
  id: string
  label: string
  detail: string
  tone: StatusTone
}

export type LecturerPortalShellModel = PortalShellModel
export type LecturerPageFrame = PortalPageFrame
