import type { DataState } from '../../models/shared/portal.types'
import type { StudentPageFrame, StudentProfile } from '../../models/student/student.types'
import { studentAssignmentsMock, studentClassesMock, studentProfileMock } from '../../models/student/student.mock'
import { useStudentPortalShellController } from './useStudentPortalShellController'

type InfoPair = {
  label: string
  value: string
}

type StudentProfileViewModel = {
  frame: StudentPageFrame
  state: DataState
  profile?: StudentProfile
  identityPairs: InfoPair[]
  academicPairs: InfoPair[]
  summaryPairs: InfoPair[]
  errorMessage?: string
}

export function useStudentProfileController(dataState: DataState): StudentProfileViewModel {
  const shell = useStudentPortalShellController('profile')
  const profile = dataState === 'ready' ? studentProfileMock : undefined

  const identityPairs: InfoPair[] = profile
    ? [
        { label: 'Họ và tên', value: profile.fullName },
        { label: 'Mã sinh viên', value: profile.studentCode },
        { label: 'Email trường', value: profile.email },
      ]
    : []

  const academicPairs: InfoPair[] = profile
    ? [
        { label: 'Khoa/Viện', value: profile.faculty },
        { label: 'Chương trình', value: profile.program },
      ]
    : []

  const openAssignments = studentAssignmentsMock.filter(
    (assignment) => assignment.submissionStatus === 'not_submitted' || assignment.submissionStatus === 'draft',
  ).length

  const summaryPairs: InfoPair[] = [
    { label: 'Lớp học đang theo học', value: `${studentClassesMock.length} lớp` },
    { label: 'Bài tập đang mở', value: `${openAssignments} bài` },
  ]

  return {
    frame: {
      shell,
      pageTitle: 'Thông tin cá nhân',
      pageDescription: 'Thông tin định danh và học vụ được cập nhật từ hệ thống nhà trường.',
      breadcrumbs: [
        { label: 'Trang chủ', href: '?portal=student&page=dashboard' },
        { label: 'Thông tin cá nhân' },
      ],
    },
    state: dataState,
    profile,
    identityPairs,
    academicPairs,
    summaryPairs,
    errorMessage: dataState === 'error' ? 'Không thể tải thông tin sinh viên. Vui lòng thử lại sau.' : undefined,
  }
}
