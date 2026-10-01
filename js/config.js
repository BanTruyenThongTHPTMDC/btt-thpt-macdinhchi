/**
 * ==========================================================================
 * CẤU HÌNH HỆ THỐNG CỔNG NỘP BÀI TRUYỀN THÔNG - THPT MẠC ĐĨNH CHI
 * ==========================================================================
 * Hướng dẫn lấy API_ENDPOINT:
 * 1. Mở file Google Sheets "Master_Tracker_TruyenThong_MDC".
 * 2. Vào Tiện ích mở rộng ➔ Apps Script.
 * 3. Bấm nút màu xanh "Triển khai" (Deploy) ở góc trên bên phải ➔ chọn "Tùy chọn triển khai mới" (New deployment).
 * 4. Nhấn biểu tượng Bánh răng (⚙) bên cạnh "Chọn loại" ➔ Chọn "Ứng dụng web" (Web App).
 * 5. Cấu hình:
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Tài khoản của bạn)
 *    - Ai có quyền truy cập (Who has access): "Bất kỳ ai" (Anyone)
 * 6. Bấm "Triển khai" (Deploy) ➔ Sao chép URL ứng dụng web (bắt đầu bằng https://script.google.com/macros/s/.../exec).
 * 7. Dán URL đó vào biến API_ENDPOINT bên dưới.
 */

const CONFIG = {
  // Dán URL Web App của bạn vào đây:
  API_ENDPOINT: "https://script.google.com/macros/s/AKfycbxjxkgs9mIdOqxcfbZoypQrRj7ZMefRRPXqJGiOSWxFIr3-xVrQn3ZU80qwG-JGtbS_jA/exec",

  // ID Google Sheet "Thông tin cá nhân Ban truyền thông (Responses)"
  TEACHER_SHEET_ID: "1QbzexEM7mn0rh0JhCxKchkFOucVeb94SaM8jYxQ_4rE",

  // Giới hạn tệp tải lên
  MAX_FILES: 20,
  MAX_FILE_SIZE_MB: 50, // MB mỗi file (Hỗ trợ video clip ngắn trực tiếp)

  // Tên trường
  SCHOOL_NAME: "THPT Mạc Đĩnh Chi",
  ACADEMIC_YEAR: "2026 - 2027",

  // Mật mã truy cập trang Quản trị Admin BTT (dành cho Biên tập viên BTT)
  ADMIN_PIN: "mdc2026",

  // Mật mã TỔNG QUẢN TRỊ (SUPER ADMIN) - Dành riêng cho Thầy Tín / Ban Giám Hiệu
  SUPER_ADMIN_PIN: "tinmdc2026",

  // Danh sách Thành viên Ban Quản Trị & Kiểm Duyệt BTT (Theo Kế hoạch BTT)
  BTT_REVIEWERS: [
    "Đoàn Huỳnh Xuân Tưởng (PHT - Trưởng ban)",
    "Phạm Thị Thu Thùy (Chi ủy viên)",
    "Du Quế Lộc (Trợ lý thanh niên)",
    "Phan Quỳnh Anh (Bí thư Chi đoàn GV)",
    "Trịnh Thị Hà Trang (Cố vấn CLB Nhiếp ảnh - Báo chí)",
    "Nguyễn Hồ Trọng Tín (Tổ Tin học - Quản trị)",
    "Nguyễn Huỳnh Trọng Phúc (Tổ Tin học)",
    "Trần Quang Vĩ (Tổ Lịch sử)",
    "Quách Trí Minh (Tổ Toán)",
    "Nguyễn Thị Hải Vân (Tổ GDKT&PL)",
    "Trần Nguyễn Thanh Mai (Tổ Hóa học)",
    "Nguyễn Hoài Nam (Văn phòng - Học vụ)"
  ],

  // 8+1 Trạng thái chuẩn hóa (text thuần gọn đẹp)
  BTT_STATUSES: [
    "MỚI NHẬN",
    "ĐÃ PHÂN CÔNG",
    "ĐANG DUYỆT",
    "YÊU CẦU CHỈNH SỬA",
    "ĐÃ SỬA – CHỜ DUYỆT",
    "ĐÃ DUYỆT",
    "ĐÃ LÊN LỊCH",
    "ĐÃ ĐĂNG",
    "TẠM DỪNG – CHỜ XÁC MINH"
  ],

  // Danh sách sự kiện thu thập ảnh tuyên dương / khen thưởng học sinh (mặc định)
  DEFAULT_STUDENT_EVENTS: [
    {
      id: "event_tuyen_duong_3_tot",
      name: "Lễ Tuyên Dương Học Sinh 3 Tốt Năm Học 2026 - 2027",
      note: "Học sinh tải lên 1 ảnh chân dung rõ mặt (áo dài / đồng phục MĐC) và 1 ảnh nhận giấy chứng nhận / hoạt động tiêu biểu.",
      active: true,
      folderId: "" // Có thể dán link/ID thư mục Google Drive riêng nếu muốn
    },
    {
      id: "event_hsg_quoc_gia_tp",
      name: "Vinh Danh Học Sinh Giỏi Cấp Quốc Gia & Cấp Thành Phố",
      note: "Học sinh tải lên ảnh chân dung sắc nét và ảnh nhận giải thưởng / huy chương.",
      active: true,
      folderId: ""
    },
    {
      id: "event_hkpd_the_thao",
      name: "Khen Thưởng Hội Khỏe Phù Đổng & Giải Thể Thao MĐC",
      note: "Học sinh tải lên ảnh nhận huy chương / giấy khen và ảnh thi đấu thể thao.",
      active: true,
      folderId: ""
    }
  ]
};
