# CỔNG TIẾP NHẬN & QUẢN LÝ BÀI TRUYỀN THÔNG — THPT MẠC ĐĨNH CHI
### Năm học 2026 - 2027

Hệ thống cổng thông tin tiếp nhận bài viết, hình ảnh và tư liệu sự kiện trực tuyến, tích hợp trang quản trị duyệt bài nội bộ dành cho Ban Truyền Thông trường THPT Mạc Đĩnh Chi.

---

## 🌟 Tính Năng Chính
- **Không cần đăng nhập Google**: Giáo viên và Học sinh có thể truy cập bằng điện thoại hoặc máy tính để nộp bài.
- **Kéo thả tệp mượt mà**: Hỗ trợ nhiều ảnh/video, hiển thị ảnh thu nhỏ (thumbnail) và thanh chạy % tiến trình tải lên.
- **Tự động sinh mã bài**: Trả về mã Ticket ID `TT-2026-XXXX` ngay khi nộp thành công.
- **Trang Quản Trị & Kiểm Duyệt (`admin.html`)**:
  - Bảo mật bằng mã PIN nội bộ (`mdc2026`).
  - Thống kê thời gian thực từ Google Sheets.
  - Phân công người duyệt trong 12 thành viên BTT.
  - Đổi trạng thái bài viết và ghi chú phản hồi (tự động gửi email nếu yêu cầu sửa).
  - Nút mở trực tiếp thư mục Google Drive chứa ảnh/video gốc.
- **Lưu trữ dữ liệu**: 100% dữ liệu đổ về Google Drive và Google Sheets của trường.

---

## 🚀 Cấu Trúc Mã Nguồn
- `index.html`: Cổng tiếp nhận bài viết dành cho GV và Học sinh.
- `admin.html`: Trang quản trị và kiểm duyệt bài viết dành cho Ban Truyền Thông.
- `css/style.css`: Giao diện hiện đại, chuẩn nhận diện trường Mạc Đĩnh Chi, responsive đa thiết bị.
- `js/config.js`: Cấu hình API Endpoint và mã PIN Admin.
- `js/app.js`: Xử lý giao diện nộp bài, đọc file Base64 và gửi dữ liệu.
- `js/admin.js`: Xử lý đăng nhập PIN, đọc và cập nhật bài viết từ Google Sheets.

---

## 🛠️ Triển Khai Với Cloudflare Pages
1. Kết nối kho lưu trữ GitHub này với **Cloudflare Pages**.
2. Build command: Để trống (None).
3. Build output directory: Để trống hoặc `/`.
4. Bấm **Deploy**.
