# HƯỚNG DẪN TRIỂN KHAI CỔNG TIẾP NHẬN BÀI TRUYỀN THÔNG (WEB APP)
### TRƯỜNG THPT MẠC ĐĨNH CHI — NĂM HỌC 2026 - 2027

Toàn bộ giải pháp bao gồm 2 thành phần chính:
1. **Backend API**: Chạy trên Google Apps Script (lưu file trực tiếp vào Google Drive & ghi log vào Google Sheets).
2. **Frontend Web App**: Giao diện nộp bài hiện đại (không cần đăng nhập Gmail, hỗ trợ Giáo viên & Học sinh).

---

## BƯỚC 1: LẤY LINK API TỪ GOOGLE APPS SCRIPT (MẤT 1 PHÚT)

1. Mở file Google Sheets **`Master_Tracker_TruyenThong_MDC`** trên trình duyệt.
2. Vào menu **Tiện ích mở rộng** (Extensions) ➔ **Apps Script**.
3. Đảm bảo toàn bộ nội dung trong file [AppsScript_Code.js](file:///Users/macbook/Library/CloudStorage/GoogleDrive-tin.nguyenhotrong@gmail.com/My%20Drive/BAN%20TRUY%E1%BB%80N%20TH%C3%94NG/Quy%20Tri%CC%80nh/AppsScript_Code.js) đã được dán vào Apps Script.
4. Bấm nút màu xanh **Triển khai (Deploy)** ở góc trên bên phải ➔ chọn **Tùy chọn triển khai mới (New deployment)**.
5. Cài đặt các thông số như sau:
   * Nhấn vào biểu tượng **Bánh răng (⚙)** bên cạnh *"Chọn loại"* ➔ chọn **Ứng dụng web (Web App)**.
   * **Mô tả (Description)**: `Cổng Web Tiếp Nhận v1.0`
   * **Thực thi dưới dạng (Execute as)**: Chọn **Tôi (tài khoản email của bạn)**.
   * **Ai có quyền truy cập (Who has access)**: Chọn **Bất kỳ ai (Anyone)**. *(Rất quan trọng: Phải chọn mục này để học sinh và giáo viên không cần đăng nhập vẫn gửi bài được)*.
6. Bấm **Triển khai (Deploy)**.
7. Cấp quyền truy cập nếu Google hỏi:
   * Bấm **Xem lại quyền** (Review Permissions) ➔ Chọn tài khoản của bạn ➔ Bấm **Nâng cao** (Advanced) ➔ Bấm **Đi tới BTT_MDC_Automation (không an toàn)** ➔ Bấm **Cho phép** (Allow).
8. Google sẽ cung cấp một đường link **URL ứng dụng web (Web app URL)** có dạng:
   ```text
   https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXX/exec
   ```
   👉 Bấm nút **Sao chép (Copy)** đường link này.

---

## BƯỚC 2: DÁN LINK API VÀO FILE CONFIG TRÊN MÁY TÍNH (MẤT 10 GIÂY)

1. Mở file [config.js](file:///Users/macbook/Library/CloudStorage/GoogleDrive-tin.nguyenhotrong@gmail.com/My%20Drive/BAN%20TRUY%E1%BB%80N%20TH%C3%94NG/Web_NopBai_TruyenThong/js/config.js).
2. Dán đường link vừa sao chép ở Bước 1 vào dòng `API_ENDPOINT`:
   ```javascript
   const CONFIG = {
     API_ENDPOINT: "https://script.google.com/macros/s/AKfycbxXXXXXXXXXXXXXXX/exec",
     ...
   ```
3. Lưu file (`Cmd + S` hoặc `Ctrl + S`).

> 💡 **Kiểm tra ngay trên máy tính:** Bạn có thể nhấp đúp chuột vào file [index.html](file:///Users/macbook/Library/CloudStorage/GoogleDrive-tin.nguyenhotrong@gmail.com/My%20Drive/BAN%20TRUY%E1%BB%80N%20TH%C3%94NG/Web_NopBai_TruyenThong/index.html) để mở trang web trên trình duyệt và thử nộp 1 bài kèm ảnh ngay trên máy!

---

## BƯỚC 3: ĐƯA LÊN HOSTING MIỄN PHÍ TRỌN ĐỜI (MẤT 2 PHÚT)

Bạn có thể đưa thư mục `Web_NopBai_TruyenThong` lên Internet hoàn toàn miễn phí bằng một trong hai cách dưới đây:

### CÁCH KẾT NỐI REPO GITHUB VỚI CLOUDFLARE PAGES (TỰ ĐỘNG CẬP NHẬT KHI ĐỔI CODE)

Repository GitHub của bạn đã được tạo và đẩy mã nguồn thành công:
👉 **Repo GitHub:** [https://github.com/BanTruyenThongTHPTMDC/btt-thpt-macdinhchi](https://github.com/BanTruyenThongTHPTMDC/btt-thpt-macdinhchi)

**Các bước kết nối trên Cloudflare Pages (mất 1 phút):**
1. Truy cập: [https://dash.cloudflare.com/](https://dash.cloudflare.com/) (hoặc [pages.cloudflare.com](https://pages.cloudflare.com/)) và đăng nhập.
2. Ở thanh bên trái, chọn **Compute (Workers & Pages)** ➔ **Create application** (Tạo ứng dụng) ➔ Chọn tab **Pages**.
3. Bấm chọn **Connect to Git** (Kết nối với Git).
4. Nếu chưa liên kết tài khoản GitHub, bấm **Add account** để cấp quyền cho Cloudflare đọc repo GitHub của `BanTruyenThongTHPTMDC`.
5. Chọn repository: **`BanTruyenThongTHPTMDC/btt-thpt-macdinhchi`** ➔ Bấm **Begin setup** (Bắt đầu thiết lập).
6. Ở màn hình cấu hình build:
   - **Project name**: Giữ nguyên hoặc đặt tên tùy ý (ví dụ `btt-thpt-macdinhchi`).
   - **Production branch**: `main`
   - **Framework preset**: Chọn `None` (vì web dùng HTML/CSS/JS thuần cực nhẹ).
   - **Build command**: Để trống.
   - **Build output directory**: Để trống (hoặc `/`).
7. Bấm **Save and Deploy** (Lưu và Triển khai).
8. Sau ~20 giây, Cloudflare Pages sẽ cấp đường link trực tuyến miễn phí trọn đời:
   👉 **`https://btt-thpt-macdinhchi.pages.dev`**  
   *(Và trang admin: `https://btt-thpt-macdinhchi.pages.dev/admin.html`)*

✨ **Lợi ích cực lớn:** Kể từ bây giờ, bất cứ khi nào bạn chỉnh sửa code trên máy tính và gõ lệnh `git push`, Cloudflare Pages sẽ tự động nhận diện và cập nhật website ngay lập tức mà không cần làm thủ công lại!

---

---

## BƯỚC 4: HƯỚNG DẪN DÙNG TRANG QUẢN TRỊ & KIỂM DUYỆT (ADMIN BTT)

Hệ thống đã tích hợp sẵn trang Quản trị chuyên biệt dành riêng cho Ban Truyền Thông:
* **Cách truy cập:**
  * Bấm vào nút **"Nội Bộ BTT (Admin)"** ở góc trên bên phải trang chủ, hoặc mở file [admin.html](file:///Users/macbook/Library/CloudStorage/GoogleDrive-tin.nguyenhotrong@gmail.com/My%20Drive/BAN%20TRUY%E1%BB%80N%20TH%C3%94NG/Web_NopBai_TruyenThong/admin.html).
* **Mã PIN bảo mật mặc định:** `mdc2026`  
  *(Thầy có thể đổi mã PIN này tùy ý trong file [js/config.js](file:///Users/macbook/Library/CloudStorage/GoogleDrive-tin.nguyenhotrong@gmail.com/My%20Drive/BAN%20TRUY%E1%BB%80N%20TH%C3%94NG/Web_NopBai_TruyenThong/js/config.js) tại dòng `ADMIN_PIN`)*.
* **Tính năng trên trang Quản trị:**
  1. 📊 **Thống kê tự động**: Đếm tổng số bài, bài mới nhận, bài yêu cầu sửa, bài đã duyệt/đăng theo thời gian thực từ Google Sheets.
  2. 🔍 **Tìm kiếm & Lọc**: Tìm nhanh theo mã bài (ví dụ `TT-2026-0001`), tên sự kiện, người nộp; lọc theo trạng thái và người duyệt.
  3. 🔎 **Xem chi tiết & Mở Google Drive**: Xem đầy đủ caption, thông tin người nộp và bấm 1 nút là mở ngay thư mục chứa ảnh/video gốc trên Drive.
  4. ✍️ **Phân công & Duyệt bài**:
     * Chọn người duyệt trong danh sách 12 thành viên BTT.
     * Chuyển trạng thái quy trình (Mới nhận, Đang duyệt, Yêu cầu sửa, Đã duyệt, Đã đăng).
     * Ghi chú phản hồi (nếu chọn *Yêu cầu sửa*, hệ thống tự động gửi email thông báo cho giáo viên/học sinh).
     * **Cảnh báo tự động**: Nếu bài sửa đổi quá 2 lần, hệ thống sẽ hiện cảnh báo đỏ theo đúng Kế hoạch BTT.
     * Bấm **Lưu cập nhật**: Dữ liệu tự động đồng bộ ngay vào Google Sheets `01_MASTER_TRACKER` và ghi vết vào `02_ACTIVITY_LOG`.

> ⚠️ **LƯU Ý KHI CẬP NHẬT CODE APPS SCRIPT:**  
> Vì file `AppsScript_Code.js` vừa được bổ sung tính năng Admin, khi dán code mới vào Google Apps Script, Thầy hãy bấm **Triển khai (Deploy)** ➔ **Quản lý bản triển khai (Manage deployments)** ➔ Bấm biểu tượng **Cây bút (Chỉnh sửa)** ➔ Chọn **Phiên bản mới (New version)** ➔ Bấm **Triển khai (Deploy)** để cập nhật có hiệu lực nhé!

---

## KẾT QUẢ VẬN HÀNH:
* ✅ Giao diện cổng nộp bài tinh giản, sạch sẽ, bỏ hết các chữ khẩu hiệu dư thừa.
* ✅ Giáo viên và Học sinh mở web trên máy tính hoặc quét mã QR trên điện thoại là nộp được ngay (không cần tài khoản Google).
* ✅ Ban Truyền Thông có trang Quản trị duyệt bài trực quan, không cần mở từng dòng bảng tính Excel/Sheet phức tạp.
* ✅ 100% dữ liệu và tư liệu gốc vẫn an toàn tuyệt đối trên Google Drive & Google Sheets của Thầy!
