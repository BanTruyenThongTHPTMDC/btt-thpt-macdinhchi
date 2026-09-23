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

  // Giới hạn tệp tải lên
  MAX_FILES: 10,
  MAX_FILE_SIZE_MB: 25, // MB mỗi file

  // Tên trường
  SCHOOL_NAME: "THPT Mạc Đĩnh Chi",
  ACADEMIC_YEAR: "2026 - 2027",

  // Mật mã truy cập trang Quản trị Admin BTT (có thể đổi tùy ý)
  ADMIN_PIN: "mdc2026",

  // Danh sách Thành viên Ban Quản Trị & Kiểm Duyệt BTT (Theo Kế hoạch BTT)
  BTT_REVIEWERS: [
    "Thầy Đoàn Huỳnh Xuân Tưởng (PHT - Trưởng ban)",
    "Cô Phạm Thị Thu Thùy (Chi ủy viên)",
    "Thầy Du Quế Lộc (Trợ lý thanh niên)",
    "Cô Phan Quỳnh Anh (Bí thư Chi đoàn GV)",
    "Cô Trịnh Thị Hà Trang (Cố vấn CLB Truyền thông)",
    "Thầy Nguyễn Hồ Trọng Tín (Tổ Tin học - Quản trị)",
    "Thầy Nguyễn Huỳnh Trọng Phúc (Tổ Tin học)",
    "Thầy Trần Quang Vĩ (Tổ Lịch sử)",
    "Thầy Quách Trí Minh (Tổ Toán)",
    "Cô Nguyễn Thị Hải Vân (Tổ GDKT&PL)",
    "Cô Trần Nguyễn Thanh Mai (Tổ Hóa học)",
    "Thầy Nguyễn Hoài Nam (Văn phòng - Học vụ)"
  ],

  // 8+1 Trạng thái chuẩn hóa
  BTT_STATUSES: [
    "① MỚI NHẬN",
    "② ĐÃ PHÂN CÔNG",
    "③ ĐANG DUYỆT",
    "④ YÊU CẦU SỬA",
    "⑤ ĐÃ SỬA – CHỜ DUYỆT",
    "⑥ ĐÃ DUYỆT",
    "⑦ ĐÃ LÊN LỊCH",
    "⑧ ĐÃ ĐĂNG",
    "TẠM DỪNG – CHỜ XÁC MINH"
  ]
};
