import type { HomePageViewModel } from './homePageModel'

export const homePageData: HomePageViewModel = {
  utilityBar: {
    helperText: 'Cổng chính thức của nhà trường',
    supportEmail: 'hotro@aiclassmate.edu.vn',
    hotline: '024 7300 8899',
    activeLanguage: 'VI',
  },
  brandName: 'ĐẠI HỌC BÁCH KHOA HÀ NỘI',
  navItems: [
    { label: 'Trang chủ', href: '#' },
    { label: 'Thông báo', href: '#thong-bao' },
    { label: 'Hướng dẫn', href: '#ho-tro' },
    { label: 'Hỗ trợ', href: '#ho-tro' },
    { label: 'Liên hệ', href: '#lien-he' },
  ],
  loginLink: {
    label: 'Đăng nhập',
    href: '?portal=student&page=dashboard',
  },
  hero: {
    eyebrow: 'HỆ THỐNG ĐÁNH GIÁ HỌC TẬP BẰNG AI',
    title: 'AI Classmate System',
    subtitle: 'Chấm bài nhanh hơn, phản hồi rõ hơn, theo dõi tiến độ tập trung hơn',
    description:
      'Hỗ trợ giảng viên giao bài, đánh giá theo tiêu chí và phản hồi học tập trên một nền tảng thống nhất cho toàn lớp.',
    actions: [
      { label: 'Đăng nhập giảng viên', href: '?portal=lecturer&page=assignments', variant: 'primary' },
      { label: 'Đăng nhập sinh viên', href: '?portal=student&page=dashboard', variant: 'secondary' },
    ],
    guideLink: {
      label: 'Xem hướng dẫn sử dụng',
      href: '#ho-tro',
    },
  },
  announcements: [
    {
      id: 'tb-01',
      title: 'Cập nhật AI Classmate 1.6',
      date: '02/04/2026',
      summary: 'Tối ưu tốc độ tải danh sách bài nộp và bộ lọc tiến độ theo lớp.',
      href: '#',
    },
    {
      id: 'tb-02',
      title: 'Hướng dẫn nộp bài với tệp PDF và ZIP',
      date: '01/04/2026',
      summary: 'Kiểm tra định dạng và dung lượng tệp trước khi gửi để tránh lỗi nộp bài.',
      href: '#',
    },
    {
      id: 'tb-03',
      title: 'Lịch bảo trì hệ thống ngày 05/04/2026',
      date: '31/03/2026',
      summary: 'Dịch vụ tạm gián đoạn từ 22:00 đến 23:00 để nâng cấp hạ tầng.',
      href: '#',
    },
    {
      id: 'tb-04',
      title: 'Kích hoạt nhắc hạn nộp tự động theo lớp',
      date: '30/03/2026',
      summary: 'Thông báo nhắc hạn được gửi trước mốc đóng bài trong từng học phần.',
      href: '#',
    },
  ],
  sidePanels: [
    {
      id: 'ho-tro',
      title: 'Hỗ trợ chính thức',
      caption: 'Kênh hướng dẫn và tiếp nhận hỗ trợ',
      items: [
        { label: 'Trung tâm hỗ trợ', href: '#' },
        { label: 'Liên hệ quản trị hệ thống', href: '#lien-he' },
        { label: 'Gửi yêu cầu hỗ trợ', href: '#' },
        { label: 'Câu hỏi thường gặp', href: '#' },
      ],
    },
  ],
  footer: {
    systemName: 'ĐẠI HỌC BÁCH KHOA HÀ NỘI',
    systemSubtitle: 'Hệ thống đánh giá học tập thông minh',
    description:
      'Nền tảng hỗ trợ giao bài, nộp bài, chấm điểm và phản hồi học tập cho giảng viên và sinh viên.',
    quickLinks: [
      { label: 'Trang chủ', href: '#' },
      { label: 'Thông báo', href: '#thong-bao' },
      { label: 'Hướng dẫn', href: '#ho-tro' },
      { label: 'Hỗ trợ', href: '#ho-tro' },
    ],
    supportEmail: 'hotro@aiclassmate.edu.vn',
    hotline: '024 7300 8899',
    supportItems: ['Trung tâm hỗ trợ người dùng', 'Liên hệ quản trị hệ thống'],
    copyright: '© 2026 Đại học Bách Khoa Hà Nội · AI Classmate System',
  },
}
