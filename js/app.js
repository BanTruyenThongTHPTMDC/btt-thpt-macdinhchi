/**
 * ==========================================================================
 * CỔNG TIẾP NHẬN BÀI TRUYỀN THÔNG - THPT MẠC ĐĨNH CHI
 * Logic xử lý giao diện, kéo thả file, chuyển đổi Base64 và gửi API
 * ==========================================================================
 */

// Danh sách danh mục theo Kế hoạch Ban Truyền Thông MDC 2026 - 2027
const DEPARTMENTS = {
  teacher: [
    // 20 Tổ chuyên môn & Phòng ban
    "Tổ Toán", "Tổ Vật lí", "Tổ Hóa học", "Tổ Ngữ Văn", "Tổ Tiếng Anh",
    "Tổ Lịch Sử", "Tổ Địa lí", "Tổ GDKT&PL", "Tổ Công nghệ", "Tổ GDTC - GDQP&AN",
    "Tổ Sinh học", "Tổ Tin học", "Nhóm HĐTNHN - GDĐP", "Chi bộ", "Công đoàn",
    "Đoàn trường", "Chi đoàn Giáo viên", "GVCN", "Văn phòng", "Phòng Giám thị",
    // Các Câu Lạc Bộ do Thầy/Cô đại diện nộp
    "CLB Khoa học – Khởi nghiệp",
    "CLB Nhiếp ảnh - Báo chí",
    "CLB Văn nghệ - Cổ động",
    "CLB Tiếng Anh",
    "CLB Văn học – Diễn thuyết và Kịch",
    "CLB Kỹ năng sống",
    "CLB Hội họa",
    "Khác"
  ],
  student: [
    "Đoàn Thanh niên – Đội Tình nguyện",
    "Ban Chỉ huy Liên chi Đoàn",
    "Đại diện Khối 10",
    "Đại diện Khối 11",
    "Đại diện Khối 12",
    "Cộng tác viên Media / Nhiếp ảnh",
    "Khác (Thu thập hình tuyên dương / sự kiện học sinh)"
  ]
};

// ==========================================================================
// DANH BẠ ĐẠI DIỆN TRUYỀN THÔNG CÁC TỔ & PHÒNG BAN (THEO GOOGLE SHEET & KẾ HOẠCH BTT)
// ==========================================================================
const DEFAULT_TEACHER_DIRECTORY = {
  "Tổ Ngữ Văn": [
    { name: "Nguyễn Khánh Ninh", phone: "0356730727", email: "thkhanhninh@gmail.com", role: "Đại diện tổ" },
    { name: "Phạm Thị Thu Thuỳ", phone: "0348429135", email: "Thuthuy03051979@gmail.com", role: "Chi ủy viên" },
    { name: "Lê Phát Tài", phone: "0373079550", email: "4501601104.tailp@gmail.com", role: "Bí thư Chi đoàn GV" }
  ],
  "Tổ Hóa học": [
    { name: "Nguyễn Lan Anh", phone: "0901604588", email: "pecoc0920@gmail.com", role: "Đại diện tổ" },
    { name: "Trần Nguyễn Thanh Mai", phone: "0915358430", email: "trannguyenthanhmai0987@gmail.com", role: "Ban Truyền Thông" }
  ],
  "Tổ Lịch Sử": [
    { name: "Ngô Phạm Gia Bảo", phone: "0392020257", email: "ngophamgiabao2002@gmail.com", role: "Đại diện tổ" },
    { name: "Trần Quang Vĩ", phone: "0938439868", email: "quangvi346@gmail.com", role: "Ban Truyền Thông" }
  ],
  "Tổ Toán": [
    { name: "Đoàn Minh Tâm", phone: "", email: "", role: "Đại diện tổ" },
    { name: "Quách Trí Minh", phone: "0768002000", email: "tm3011.qtm@gmail.com", role: "Ban Truyền Thông" }
  ],
  "Tổ Tiếng Anh": [
    { name: "Nguyễn Lê Công Trường", phone: "0374862151", email: "nguyenlecongtruong@gmail.com", role: "Đại diện tổ" },
    { name: "Phan Huỳnh Nhật Linh", phone: "0365427274", email: "nhatlinhphanhuynh@gmail.com", role: "Cố vấn CLB Tiếng Anh" }
  ],
  "Văn phòng": [
    { name: "Nguyễn Hoài Nam", phone: "0333221235", email: "namnguyenz0602@gmail.com", role: "Văn phòng - Học vụ" }
  ],
  "Tổ GDKT&PL": [
    { name: "Nguyễn Thị Mai", phone: "0778772160", email: "mainguyen09mdc@gmail.com", role: "Đại diện tổ" }
  ],
  "Tổ Địa lí": [
    { name: "Lê Phương Trựt Nhân", phone: "0853382026", email: "lephuongtrutnhan@gmail.com", role: "Đại diện tổ" }
  ],
  "Tổ GDTC - GDQP&AN": [
    { name: "Phan Xuân Anh", phone: "0908643438", email: "phanxuananh9@gmail.com", role: "Đại diện tổ" }
  ],
  "Công đoàn": [
    { name: "Đặng Thái Phong", phone: "0937137905", email: "Phong.wind.1112@gmail.com", role: "Chủ tịch Công đoàn" }
  ],
  "Phòng Giám thị": [
    { name: "Phan Phi", phone: "0867012641", email: "phanphi429@gmail.com", role: "Giám thị" }
  ],
  "Tổ Công nghệ": [
    { name: "Huỳnh Thị Hồng Cẩm", phone: "0906753836", email: "camhth88@gmail.com", role: "Đại diện tổ" }
  ],
  "Nhóm HĐTNHN - GDĐP": [
    { name: "Nguyễn Minh Tâm", phone: "0933939328", email: "nguyentam28@yahoo.com", role: "Đại diện nhóm" }
  ],
  "Đoàn trường": [
    { name: "Du Quế Lộc", phone: "0938830617", email: "locdu1994@gmail.com", role: "Đại diện tổ" },
    { name: "Nguyễn Thị Hải Vân", phone: "0368577068", email: "haivannguyen2472@gmail.com", role: "Ban Truyền Thông" }
  ],
  "Chi đoàn Giáo viên": [
    { name: "Lê Phát Tài", phone: "0373079550", email: "4501601104.tailp@gmail.com", role: "Bí thư Chi đoàn GV" }
  ],
  "Chi bộ": [
    { name: "Phạm Thị Thu Thuỳ", phone: "0348429135", email: "Thuthuy03051979@gmail.com", role: "Chi ủy viên" }
  ],
  "Tổ Tin học": [
    { name: "Huỳnh Diệp Tân", phone: "0917755455", email: "dieptan@gmail.com", role: "Đại diện tổ" },
    { name: "Nguyễn Hồ Trọng Tín", phone: "0983034558", email: "tin.nguyenhotrong@gmail.com", role: "Quản trị BTT" }
  ],
  "GVCN": [
    { name: "Lê Thị Thúy Hằng", phone: "0982355697", email: "thuyhang.toan.mdc@gmail.com", role: "Đại diện GVCN" }
  ],
  "Tổ Vật lí": [
    { name: "Lương Tuấn Anh", phone: "", email: "", role: "Đại diện tổ" }
  ],
  "Tổ Sinh học": [
    { name: "Nguyễn Mỹ Kim Ngân", phone: "", email: "", role: "Đại diện tổ" }
  ],
  "CLB Hội họa": [
    { name: "Nguyễn Hoàng Yến", phone: "0839315315", email: "nguyenhoangyenmdc@gmail.com", role: "Cố vấn CLB" }
  ],
  "CLB Thiết kế Hội hoạ": [
    { name: "Nguyễn Hoàng Yến", phone: "0839315315", email: "nguyenhoangyenmdc@gmail.com", role: "Cố vấn CLB" }
  ],
  "CLB Nhiếp ảnh - Báo chí": [
    { name: "Trịnh Thị Hà Trang", phone: "", email: "", role: "Cố vấn CLB" }
  ],
  "CLB Văn nghệ - Cổ động": [
    { name: "Trần Nguyễn Thanh Mai", phone: "0915358430", email: "trannguyenthanhmai0987@gmail.com", role: "Cố vấn CLB" }
  ],
  "CLB Tiếng Anh": [
    { name: "Phan Huỳnh Nhật Linh", phone: "0365427274", email: "nhatlinhphanhuynh@gmail.com", role: "Cố vấn CLB" }
  ],
  "CLB Văn học – Diễn thuyết và Kịch": [
    { name: "Phan Quỳnh Anh", phone: "", email: "", role: "Cố vấn CLB" }
  ],
  "CLB Kỹ năng sống": [
    { name: "Nguyễn Thị Mỹ Thu", phone: "", email: "", role: "Cố vấn CLB" }
  ],
  "CLB Khoa học – Khởi nghiệp": [
    { name: "Lương Tuấn Anh", phone: "", email: "", role: "Cố vấn CLB" }
  ]
};

// State
let currentRole = "teacher"; // "teacher" | "student"
let isStudentPhotoMode = false; // Chế độ thu thập hình tuyên dương cho học sinh khi chọn "Khác"
let selectedFiles = []; // Mảng chứa các File object nộp mới
let selectedRevFiles = []; // Mảng chứa các File object chỉnh sửa bổ sung
let currentTeacherDirectory = { ...DEFAULT_TEACHER_DIRECTORY };
let currentActiveRevisionTicket = null; // Ticket đang được mở để sửa
let cachedRevisionTickets = null; // Bộ nhớ đệm danh sách bài viết
let lastRevisionFetchTime = 0; // Mốc thời gian tải danh sách gần nhất

// Khởi chạy khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  applySystemConfig();
  initTeacherDirectory();
  populateDeptDropdown();
  setupDragAndDrop();
  setupRevisionDragAndDrop();
  setupDeptAutoFillListener();
  setupStudentNameRenameListener();
  initStudentEventsSync();
});

/**
 * Lấy danh sách CLB & Đơn vị học sinh (kết hợp cấu hình động từ Quản trị viên)
 */
function getStudentDepartments() {
  try {
    const raw = localStorage.getItem("btt_system_config");
    if (raw) {
      const cfg = JSON.parse(raw);
      if (Array.isArray(cfg.clubsList) && cfg.clubsList.length > 0) {
        return [
          ...cfg.clubsList,
          "Đoàn Thanh niên – Đội Tình nguyện",
          "Ban Chỉ huy Liên chi Đoàn",
          "Đại diện Khối 10",
          "Đại diện Khối 11",
          "Đại diện Khối 12",
          "Cộng tác viên Media / Nhiếp ảnh",
          "Khác (Thu thập hình tuyên dương / sự kiện học sinh)"
        ];
      }
    }
  } catch (e) {
    console.warn("Lỗi đọc cấu hình CLB:", e);
  }
  return DEPARTMENTS.student;
}

/**
 * Áp dụng cấu hình vận hành từ Quản Trị Viên (Khóa cổng tiếp nhận & Banner tiêu điểm)
 */
function applySystemConfig() {
  try {
    const raw = localStorage.getItem("btt_system_config");
    if (!raw) return;
    const cfg = JSON.parse(raw);

    // 1. Kiểm tra trạng thái cổng tiếp nhận
    if (cfg.portalOpen === false) {
      const formWrapper = document.querySelector(".form-wrapper");
      if (formWrapper) {
        formWrapper.innerHTML = `
          <div class="portal-closed-box">
            <div class="closed-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2>CỔNG TIẾP NHẬN BÀI VIẾT ĐANG TẠM ĐÓNG</h2>
            <p>${cfg.closedReason || "Hệ thống hiện đang tạm ngưng tiếp nhận bài viết mới để phục vụ công tác rà soát, sơ kết học kỳ hoặc bảo trì định kỳ. Quý Thầy/Cô và các bạn học sinh vui lòng liên hệ trực tiếp Ban Truyền Thông để được hỗ trợ."}</p>
          </div>
        `;
        return;
      }
    }

    // 2. Kiểm tra thông báo tiêu điểm
    if (cfg.bannerActive && cfg.bannerText && cfg.bannerText.trim()) {
      const container = document.getElementById("portalNoticeContainer");
      if (container) {
        container.innerHTML = `
          <div class="portal-notice-banner">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <div class="portal-notice-banner-text">
              <strong>Thông báo từ Ban Truyền Thông:</strong> ${cfg.bannerText.trim()}
            </div>
          </div>
        `;
      }
    }
  } catch (err) {
    console.warn("Lỗi áp dụng cấu hình hệ thống:", err);
  }
}

/**
 * 1. Chuyển đổi giữa 2 chế độ tác vụ: Nộp bài mới VS Bổ sung / Chỉnh sửa theo yêu cầu
 */
function switchPortalMode(mode) {
  const tabSubmit = document.getElementById("tabModeSubmit");
  const tabRevise = document.getElementById("tabModeRevise");
  const submissionForm = document.getElementById("submissionForm");
  const revisionSection = document.getElementById("revisionSection");

  if (mode === "submit") {
    if (tabSubmit) {
      tabSubmit.classList.add("active");
      tabSubmit.setAttribute("aria-selected", "true");
    }
    if (tabRevise) {
      tabRevise.classList.remove("active");
      tabRevise.setAttribute("aria-selected", "false");
    }
    if (submissionForm) submissionForm.style.display = "block";
    if (revisionSection) revisionSection.style.display = "none";
  } else {
    if (tabRevise) {
      tabRevise.classList.add("active");
      tabRevise.setAttribute("aria-selected", "true");
    }
    if (tabSubmit) {
      tabSubmit.classList.remove("active");
      tabSubmit.setAttribute("aria-selected", "false");
    }
    if (submissionForm) submissionForm.style.display = "none";
    if (revisionSection) revisionSection.style.display = "block";

    // Tự động tải trước danh sách bài viết trong nền nếu chưa có cache
    if (CONFIG.API_ENDPOINT && (!cachedRevisionTickets || Date.now() - lastRevisionFetchTime > 60000)) {
      fetch(`${CONFIG.API_ENDPOINT}?action=getTickets`, { method: "GET", credentials: "omit" })
        .then(r => r.json())
        .then(data => {
          const list = Array.isArray(data.tickets) ? data.tickets : (data.data?.tickets || []);
          if (list.length > 0) {
            cachedRevisionTickets = list;
            lastRevisionFetchTime = Date.now();
          }
        })
        .catch(e => console.warn("Tải trước danh sách bài viết:", e));
    }

    // Tự động focus vào ô tìm kiếm bài viết
    setTimeout(() => {
      const searchInput = document.getElementById("revisionSearchInput");
      if (searchInput) searchInput.focus();
    }, 120);
  }
}

/**
 * 1b. Chuyển đổi đối tượng nộp bài: Giáo viên & CLB vs Học sinh (Đoàn Đội & Khối lớp)
 */
function switchRole(role) {
  currentRole = role;
  // Luôn đặt lại chế độ ảnh học sinh khi chuyển tab
  toggleStudentPhotoMode(false);

  const tabTeacher = document.getElementById("tabTeacher");
  const tabStudent = document.getElementById("tabStudent");
  const submitterNameInput = document.getElementById("submitterName");
  const deptLabel = document.getElementById("deptLabel");
  const submitterLabel = document.getElementById("submitterLabel");

  if (role === "teacher") {
    if (tabTeacher) {
      tabTeacher.classList.add("active");
      tabTeacher.setAttribute("aria-selected", "true");
    }
    if (tabStudent) {
      tabStudent.classList.remove("active");
      tabStudent.setAttribute("aria-selected", "false");
    }
    if (deptLabel) deptLabel.textContent = "Tổ Chuyên Môn / Đơn Vị / Câu Lạc Bộ";
    if (submitterLabel) submitterLabel.textContent = "Họ và Tên Thầy/Cô Đại Diện";
    if (submitterNameInput) submitterNameInput.placeholder = "Họ và tên Thầy/Cô phụ trách hoặc cố vấn CLB";
    populateDeptDropdown("teacher");
  } else {
    if (tabStudent) {
      tabStudent.classList.add("active");
      tabStudent.setAttribute("aria-selected", "true");
    }
    if (tabTeacher) {
      tabTeacher.classList.remove("active");
      tabTeacher.setAttribute("aria-selected", "false");
    }
    if (deptLabel) deptLabel.textContent = "Đoàn Thể / Đại Diện Khối Lớp";
    if (submitterLabel) submitterLabel.textContent = "Họ và Tên Học Sinh Đại Diện";
    if (submitterNameInput) submitterNameInput.placeholder = "Ví dụ: Nguyễn Văn A (Đại diện Khối 12 / BCH Liên chi Đoàn)";
    populateDeptDropdown("student");
  }

  // Xóa thông báo tự động điền khi chuyển vai trò
  const notice = document.getElementById("deptAutoFillNotice");
  if (notice) {
    notice.style.display = "none";
    notice.innerHTML = "";
  }
}

/**
 * Khởi tạo danh bạ giáo viên và đồng bộ từ Google Apps Script API nếu có mạng
 */
async function initTeacherDirectory() {
  try {
    const cached = localStorage.getItem("btt_teacher_directory_v2");
    if (cached) {
      currentTeacherDirectory = { ...DEFAULT_TEACHER_DIRECTORY, ...JSON.parse(cached) };
    }
  } catch (e) {
    console.warn("Không đọc được cache danh bạ:", e);
  }

  // Tải ngầm từ Google Apps Script API nếu có cấu hình
  if (CONFIG.API_ENDPOINT) {
    fetch(`${CONFIG.API_ENDPOINT}?action=getTeachers`, { method: "GET" })
      .then(res => res.json())
      .then(json => {
        if (json && json.success && json.data && json.data.directory) {
          const liveDir = json.data.directory;
          for (const [dept, members] of Object.entries(liveDir)) {
            if (Array.isArray(members) && members.length > 0) {
              currentTeacherDirectory[dept] = members;
            }
          }
          localStorage.setItem("btt_teacher_directory_v2", JSON.stringify(currentTeacherDirectory));
          console.log("✓ Đã đồng bộ danh bạ giáo viên từ Google Sheet thành công.");
        }
      })
      .catch(err => {
        console.log("Sử dụng danh bạ giáo viên cục bộ (offline):", err);
      });
  }
}

/**
 * Lắng nghe sự kiện chọn Tổ chuyên môn để tự động điền thông tin giáo viên
 */
function setupDeptAutoFillListener() {
  const deptSelect = document.getElementById("deptSelect");
  if (!deptSelect) return;

  deptSelect.addEventListener("change", handleDeptChange);
}

function handleDeptChange() {
  const deptSelect = document.getElementById("deptSelect");
  const selectedDept = deptSelect ? deptSelect.value : "";
  const noticeEl = document.getElementById("deptAutoFillNotice");

  // Kiểm tra nếu là học sinh chọn mục Khác (Thu thập hình tuyên dương học sinh)
  if (currentRole === "student" && (selectedDept === "Khác" || selectedDept.startsWith("Khác"))) {
    toggleStudentPhotoMode(true);
    if (noticeEl) {
      noticeEl.style.display = "none";
      noticeEl.innerHTML = "";
    }
    return;
  } else {
    toggleStudentPhotoMode(false);
  }

  if (!selectedDept || selectedDept === "Khác" || selectedDept.startsWith("Khác")) {
    if (noticeEl) {
      noticeEl.style.display = "none";
      noticeEl.innerHTML = "";
    }
    return;
  }

  // Tra cứu trong danh bạ đại diện tổ / cố vấn CLB
  const members = currentTeacherDirectory[selectedDept] || null;

  if (members && members.length > 0) {
    // Tự động điền thông tin Thầy/Cô đại diện đầu tiên
    fillTeacherInfo(members[0], selectedDept, 0, members);
  } else {
    if (noticeEl) {
      noticeEl.style.display = "none";
      noticeEl.innerHTML = "";
    }
  }
}

/**
 * ==========================================================================
 * CÁC HÀM XỬ LÝ CHẾ ĐỘ THU THẬP ẢNH TUYÊN DƯƠNG HỌC SINH (KHI CHỌN "KHÁC")
 * ==========================================================================
 */

/**
 * Lấy danh sách sự kiện tuyên dương học sinh (từ localStorage hoặc config mặc định)
 */
function getStudentEventsList() {
  try {
    const raw = localStorage.getItem("btt_student_events_v1");
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list) && list.length > 0) return list;
    }
  } catch (e) {
    console.warn("Không đọc được cấu hình sự kiện học sinh:", e);
  }
  return CONFIG.DEFAULT_STUDENT_EVENTS || [];
}

/**
 * Tự động đồng bộ danh sách sự kiện từ Google Apps Script (kèm link Drive SuperAdmin đã gán)
 */
async function initStudentEventsSync() {
  if (CONFIG.API_ENDPOINT) {
    try {
      const res = await fetch(`${CONFIG.API_ENDPOINT}?action=getStudentEvents`);
      const json = await res.json();
      if (json && json.success && Array.isArray(json.data?.events) && json.data.events.length > 0) {
        localStorage.setItem("btt_student_events_v1", JSON.stringify(json.data.events));
        if (isStudentPhotoMode) {
          initStudentEventSelect();
        }
      }
    } catch(err) {
      console.log("Dùng cấu hình sự kiện học sinh cục bộ:", err);
    }
  }
}

/**
 * Khởi tạo dropdown sự kiện cố định cho học sinh
 */
function initStudentEventSelect() {
  const select = document.getElementById("studentEventSelect");
  const noteEl = document.getElementById("studentEventNote");
  if (!select) return;

  const events = getStudentEventsList().filter(ev => ev.active !== false);
  select.innerHTML = '<option value="" disabled selected>-- Vui lòng chọn Sự kiện / Lễ tuyên dương tương ứng --</option>';

  events.forEach(ev => {
    const opt = document.createElement("option");
    opt.value = ev.id || ev.name;
    opt.textContent = ev.name;
    opt.dataset.note = ev.note || "";
    opt.dataset.name = ev.name;
    opt.dataset.folderId = ev.folderId || "";
    select.appendChild(opt);
  });

  select.onchange = () => {
    const selectedOpt = select.options[select.selectedIndex];
    if (selectedOpt && noteEl) {
      const note = selectedOpt.dataset.note;
      if (note) {
        noteEl.innerHTML = `<strong>📌 Yêu cầu ảnh:</strong> ${note}`;
        noteEl.style.display = "block";
      } else {
        noteEl.style.display = "none";
        noteEl.innerHTML = "";
      }
    }
  };

  // Nếu chỉ có 1 sự kiện active, tự động chọn
  if (events.length === 1) {
    select.selectedIndex = 1;
    select.dispatchEvent(new Event("change"));
  } else if (noteEl) {
    noteEl.style.display = "none";
    noteEl.innerHTML = "";
  }
}

/**
 * Bật / tắt chế độ nộp ảnh tuyên dương học sinh
 */
function toggleStudentPhotoMode(active) {
  isStudentPhotoMode = active;
  const banner = document.getElementById("studentPhotoBanner");
  const emailGroup = document.getElementById("emailFormGroup");
  const submitterEmail = document.getElementById("submitterEmail");
  const categoryGroup = document.getElementById("categoryGroup");
  const categorySelect = document.getElementById("categorySelect");
  const eventNameInputGroup = document.getElementById("eventNameInputGroup");
  const eventNameInput = document.getElementById("eventName");
  const studentEventGroup = document.getElementById("studentEventGroup");
  const studentEventSelect = document.getElementById("studentEventSelect");
  const timeLocationGroup = document.getElementById("timeLocationGroup");
  const guidelinesCallout = document.getElementById("guidelinesCallout");
  const captionGroup = document.getElementById("captionGroup");
  const captionText = document.getElementById("captionText");
  const submitterLabel = document.getElementById("submitterLabel");
  const submitterPhoneLabel = document.getElementById("submitterPhoneLabel");
  const submitterName = document.getElementById("submitterName");
  const step1Title = document.getElementById("step1Title");
  const step2Title = document.getElementById("step2Title");

  if (active) {
    if (banner) banner.style.display = "flex";
    if (step1Title) step1Title.textContent = "Thông Tin Học Sinh Tuyên Dương";
    if (submitterLabel) submitterLabel.textContent = "Họ và Tên Học Sinh";
    if (submitterName) {
      submitterName.placeholder = "Ví dụ: Nguyễn Văn A (Lớp 12A1)";
    }
    if (submitterPhoneLabel) submitterPhoneLabel.textContent = "Số Điện Thoại Học Sinh / Phụ Huynh";

    // Ẩn Email, bỏ required
    if (emailGroup) emailGroup.style.display = "none";
    if (submitterEmail) {
      submitterEmail.required = false;
      submitterEmail.value = "";
    }

    // Ẩn Phân loại hoạt động
    if (categoryGroup) categoryGroup.style.display = "none";
    if (categorySelect) categorySelect.required = false;

    // Ẩn ô nhập tên sự kiện tự do, hiện dropdown sự kiện cố định do SuperAdmin quản lý
    if (eventNameInputGroup) eventNameInputGroup.style.display = "none";
    if (eventNameInput) {
      eventNameInput.required = false;
      eventNameInput.value = "";
    }

    if (studentEventGroup) {
      studentEventGroup.style.display = "block";
      initStudentEventSelect();
    }
    if (studentEventSelect) studentEventSelect.required = true;

    // Ẩn Thời gian, Địa điểm, Thẻ quy chuẩn và Caption
    if (timeLocationGroup) timeLocationGroup.style.display = "none";
    if (guidelinesCallout) guidelinesCallout.style.display = "none";
    if (captionGroup) captionGroup.style.display = "none";
    if (captionText) {
      captionText.required = false;
      captionText.value = "";
    }

    if (step2Title) step2Title.textContent = "Chọn Sự Kiện Tuyên Dương / Khen Thưởng";

    // Cập nhật giao diện tải ảnh: Mỗi học sinh 1 hình duy nhất
    const step3Title = document.getElementById("step3Title");
    if (step3Title) step3Title.textContent = "Tải Lên 1 Hình Ảnh Tuyên Dương Của Học Sinh";
    const dropZoneTitle = document.getElementById("dropZoneTitle");
    if (dropZoneTitle) dropZoneTitle.textContent = "Kéo & thả 1 ảnh tuyên dương vào đây";
    const dropZoneNote = document.getElementById("dropZoneNote");
    if (dropZoneNote) dropZoneNote.textContent = "Mỗi học sinh nộp đúng 1 ảnh (Định dạng JPG, PNG). Tên ảnh sẽ tự động đổi thành [Họ Tên].[đuôi ảnh]";
    const hugeFileGroup = document.getElementById("hugeFileGroup");
    if (hugeFileGroup) hugeFileGroup.style.display = "none";
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.multiple = false;

    // Nếu đã chọn nhiều hơn 1 file từ trước, giữ lại đúng 1 file
    if (selectedFiles.length > 1) {
      selectedFiles = [selectedFiles[0]];
    }
  } else {
    if (banner) banner.style.display = "none";
    if (step1Title) step1Title.textContent = "Thông Tin Đại Diện Nộp Bài";
    if (emailGroup) emailGroup.style.display = "block";
    if (submitterEmail) submitterEmail.required = true;

    if (categoryGroup) categoryGroup.style.display = "block";
    if (categorySelect) categorySelect.required = true;

    if (eventNameInputGroup) eventNameInputGroup.style.display = "block";
    if (eventNameInput) eventNameInput.required = true;

    if (studentEventGroup) studentEventGroup.style.display = "none";
    if (studentEventSelect) studentEventSelect.required = false;

    if (timeLocationGroup) timeLocationGroup.style.display = "block";
    if (guidelinesCallout) guidelinesCallout.style.display = "block";
    if (captionGroup) captionGroup.style.display = "block";
    if (captionText) captionText.required = true;

    if (currentRole === "student") {
      if (submitterLabel) submitterLabel.textContent = "Họ và Tên Học Sinh Đại Diện";
      if (submitterName) submitterName.placeholder = "Ví dụ: Nguyễn Văn A (Đại diện Khối 12 / BCH Liên chi Đoàn)";
      if (submitterPhoneLabel) submitterPhoneLabel.textContent = "Số Điện Thoại / Zalo Liên Hệ";
    } else {
      if (submitterLabel) submitterLabel.textContent = "Họ và Tên Thầy/Cô Đại Diện";
      if (submitterName) submitterName.placeholder = "Họ và tên Thầy/Cô phụ trách hoặc cố vấn CLB";
      if (submitterPhoneLabel) submitterPhoneLabel.textContent = "Số Điện Thoại / Zalo Liên Hệ";
    }

    if (step2Title) step2Title.textContent = "Nội Dung Sự Kiện & Bài Viết";

    const step3Title = document.getElementById("step3Title");
    if (step3Title) step3Title.textContent = "Tải Lên Hình Ảnh & Video Gốc";
    const dropZoneTitle = document.getElementById("dropZoneTitle");
    if (dropZoneTitle) dropZoneTitle.textContent = "Kéo & thả hình ảnh hoặc video vào đây";
    const dropZoneNote = document.getElementById("dropZoneNote");
    if (dropZoneNote) dropZoneNote.textContent = "Hỗ trợ JPG, PNG, MP4, MOV, PDF. Tối đa 20 tệp (lên đến 50MB/tệp).";
    const hugeFileGroup = document.getElementById("hugeFileGroup");
    if (hugeFileGroup) hugeFileGroup.style.display = "block";
    const fileInput = document.getElementById("fileInput");
    if (fileInput) fileInput.multiple = true;
  }

  // Cập nhật lại danh sách file xem trước (hiển thị hoặc ẩn badge đổi tên)
  renderFileList();
}

/**
 * Sinh tên tệp tự động theo họ tên học sinh: [Tên_Học_Sinh].[ext] (Không có _01)
 */
function getStudentRenamedFileName(originalName) {
  const submitterNameInput = document.getElementById("submitterName");
  let rawName = (submitterNameInput ? submitterNameInput.value : "").trim();
  // Loại bỏ các ký tự cấm trên Drive / File System
  rawName = rawName.replace(/[\/\\:*?"<>|]/g, "_").trim();

  const ext = originalName && originalName.includes(".") ? originalName.substring(originalName.lastIndexOf(".")) : ".jpg";

  if (!rawName) {
    return `[Chưa điền tên]${ext}`;
  }
  return `${rawName}${ext}`;
}

/**
 * Lắng nghe ô Họ tên học sinh để tự động cập nhật tên file hiển thị trực tiếp (Live UX)
 */
function setupStudentNameRenameListener() {
  const submitterNameInput = document.getElementById("submitterName");
  if (submitterNameInput) {
    submitterNameInput.addEventListener("input", () => {
      if (isStudentPhotoMode && selectedFiles.length > 0) {
        renderFileList();
      }
    });
  }
}

/**
 * Điền thông tin giáo viên vào form và tạo hiệu ứng phản hồi
 */
function fillTeacherInfo(member, dept, activeIndex = 0, allMembers = null) {
  const submitterNameInput = document.getElementById("submitterName");
  const submitterPhoneInput = document.getElementById("submitterPhone");
  const submitterEmailInput = document.getElementById("submitterEmail");
  const noticeEl = document.getElementById("deptAutoFillNotice");

  const displayName = member.name;
  if (submitterNameInput) submitterNameInput.value = displayName;
  if (submitterPhoneInput) submitterPhoneInput.value = member.phone || "";
  if (submitterEmailInput) submitterEmailInput.value = member.email || "";

  // Hiệu ứng highlight phát sáng nhẹ cho các trường input
  [submitterNameInput, submitterPhoneInput, submitterEmailInput].forEach(el => {
    if (el) {
      el.classList.remove("autofill-highlight");
      void el.offsetWidth; // trigger reflow
      el.classList.add("autofill-highlight");
    }
  });

  // Hiển thị thông báo và danh sách chip nếu tổ có nhiều đại diện
  if (noticeEl) {
    noticeEl.style.display = "flex";
    
    let html = `
      <div class="autofill-header">
        <span class="autofill-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </span>
        <span>Đã tự động điền: <strong>${displayName}</strong> ${member.phone ? `(${member.phone})` : ""} - Có thể chỉnh sửa nếu cần.</span>
      </div>
    `;

    if (allMembers && allMembers.length > 1) {
      html += `
        <div class="autofill-chips-wrap">
          <span class="autofill-chips-label">Hoặc chọn đại diện khác cùng tổ:</span>
          ${allMembers.map((m, idx) => `
            <button type="button" class="autofill-chip-btn ${idx === activeIndex ? "active" : ""}" 
                    onclick="selectTeacherMember('${dept.replace(/'/g, "\\'")}', ${idx})">
              <span>${m.name}</span>
              ${m.role ? `<span class="autofill-chip-badge">(${m.role})</span>` : ""}
            </button>
          `).join("")}
        </div>
      `;
    }

    noticeEl.innerHTML = html;
  }
}

/**
 * Chọn nhanh giáo viên khác trong cùng tổ từ chip
 */
function selectTeacherMember(dept, memberIndex) {
  const members = currentTeacherDirectory[dept];
  if (members && members[memberIndex]) {
    fillTeacherInfo(members[memberIndex], dept, memberIndex, members);
  }
}

/**
 * Áp dụng thông tin cố vấn CLB vào form cho học sinh
 */
function applyAdvisorInfo(dept) {
  const members = currentTeacherDirectory[dept];
  if (members && members.length > 0) {
    fillTeacherInfo(members[0], dept, 0, members);
  }
}

/**
 * Điền danh sách đơn vị vào dropdown theo đối tượng nộp bài
 */
function populateDeptDropdown(role = currentRole) {
  const select = document.getElementById("deptSelect");
  if (!select) return;

  if (role === "student") {
    select.innerHTML = '<option value="" disabled selected>-- Chọn Đoàn Thể / Khối Lớp Nộp Bài --</option>';
    const studentList = getStudentDepartments();
    studentList.forEach(item => {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      select.appendChild(opt);
    });
    return;
  }

  // Mặc định: Giáo viên (Gồm cả Tổ Chuyên Môn và các Câu Lạc Bộ)
  select.innerHTML = '<option value="" disabled selected>-- Vui lòng chọn Tổ Chuyên Môn / Đơn Vị / CLB --</option>';

  // 1. Nhóm Tổ Chuyên Môn & Phòng Ban (20 đơn vị)
  const groupTeacher = document.createElement("optgroup");
  groupTeacher.label = "── TỔ CHUYÊN MÔN & PHÒNG BAN ──";
  const teacherList = [
    "Tổ Toán", "Tổ Vật lí", "Tổ Hóa học", "Tổ Ngữ Văn", "Tổ Tiếng Anh",
    "Tổ Lịch Sử", "Tổ Địa lí", "Tổ GDKT&PL", "Tổ Công nghệ", "Tổ GDTC - GDQP&AN",
    "Tổ Sinh học", "Tổ Tin học", "Nhóm HĐTNHN - GDĐP", "Chi bộ", "Công đoàn",
    "Đoàn trường", "Chi đoàn Giáo viên", "GVCN", "Văn phòng", "Phòng Giám thị"
  ];
  teacherList.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    groupTeacher.appendChild(opt);
  });
  select.appendChild(groupTeacher);

  // 2. Nhóm Câu Lạc Bộ (do Thầy/Cô cố vấn / phụ trách đại diện)
  const groupClubs = document.createElement("optgroup");
  groupClubs.label = "── CÂU LẠC BỘ (Thầy/Cô Phụ Trách / Cố Vấn) ──";
  const clubList = [
    "CLB Khoa học – Khởi nghiệp",
    "CLB Nhiếp ảnh - Báo chí",
    "CLB Văn nghệ - Cổ động",
    "CLB Tiếng Anh",
    "CLB Văn học – Diễn thuyết và Kịch",
    "CLB Kỹ năng sống",
    "CLB Hội họa",
    "Khác"
  ];
  clubList.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    groupClubs.appendChild(opt);
  });
  select.appendChild(groupClubs);
}

/**
 * 2. Cấu hình Kéo & Thả (Drag and Drop)
 */
function setupDragAndDrop() {
  const dropZone = document.getElementById("dropZone");

  ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });

  ["dragenter", "dragover"].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.add("dragover"), false);
  });

  ["dragleave", "drop"].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.remove("dragover"), false);
  });

  dropZone.addEventListener("drop", handleDrop, false);
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function triggerFileInput() {
  document.getElementById("fileInput").click();
}

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;
  addFiles(files);
}

function handleFilesSelected(e) {
  const files = e.target.files;
  addFiles(files);
  e.target.value = ""; // Reset input
}

/**
 * Thêm file vào danh sách và kiểm tra giới hạn
 */
function addFiles(fileList) {
  const maxMb = CONFIG.MAX_FILE_SIZE_MB || 50;

  // Nếu ở chế độ ảnh học sinh tuyên dương: Mỗi học sinh 1 ảnh duy nhất
  if (isStudentPhotoMode) {
    if (fileList.length > 0) {
      const file = fileList[0];
      if (file.size > maxMb * 1024 * 1024) {
        alert(`Tệp "${file.name}" vượt quá kích thước cho phép (${maxMb}MB).`);
        return;
      }
      selectedFiles = [file]; // Thay thế bằng 1 file duy nhất
      if (fileList.length > 1) {
        alert("Chế độ thu thập ảnh tuyên dương: Mỗi học sinh chỉ gửi đúng 1 hình. Hệ thống đã chọn ảnh đầu tiên.");
      }
    }
    renderFileList();
    return;
  }

  const maxLimit = CONFIG.MAX_FILES || 20;

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];

    if (selectedFiles.length >= maxLimit) {
      alert(`Bạn chỉ được tải lên tối đa ${maxLimit} tệp.`);
      break;
    }

    if (file.size > maxMb * 1024 * 1024) {
      alert(`Tệp "${file.name}" vượt quá kích thước cho phép (${maxMb}MB).`);
      continue;
    }

    // Tránh trùng tên
    if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
      selectedFiles.push(file);
    }
  }

  renderFileList();
}

function removeFile(index) {
  selectedFiles.splice(index, 1);
  renderFileList();
}

/**
 * Hiển thị thumbnail xem trước của các file
 */
function renderFileList() {
  const container = document.getElementById("fileListContainer");
  if (selectedFiles.length === 0) {
    container.style.display = "none";
    container.innerHTML = "";
    return;
  }

  container.style.display = "grid";
  container.innerHTML = "";

  selectedFiles.forEach((file, idx) => {
    const card = document.createElement("div");
    card.className = "file-preview-card";

    // Nút xóa
    const btnRemove = document.createElement("button");
    btnRemove.className = "btn-remove-file";
    btnRemove.innerHTML = "&times;";
    btnRemove.type = "button";
    btnRemove.onclick = (e) => {
      e.stopPropagation();
      removeFile(idx);
    };
    card.appendChild(btnRemove);

    // Hình ảnh xem trước
    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.className = "file-thumbnail";
      img.alt = file.name;
      const reader = new FileReader();
      reader.onload = (e) => img.src = e.target.result;
      reader.readAsDataURL(file);
      card.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "file-icon-placeholder";
      placeholder.textContent = file.type.startsWith("video/") ? "🎬" : "📄";
      card.appendChild(placeholder);
    }

    // Tên file
    const nameLabel = document.createElement("span");
    nameLabel.className = "file-name-truncate";
    nameLabel.title = file.name;
    nameLabel.textContent = file.name;
    card.appendChild(nameLabel);

    // Dung lượng
    const sizeLabel = document.createElement("span");
    sizeLabel.className = "file-size-tag";
    sizeLabel.textContent = formatBytes(file.size);
    card.appendChild(sizeLabel);

    // Nếu ở chế độ ảnh học sinh, hiển thị tên file được tự động đổi: [Tên_Học_Sinh].[ext]
    if (isStudentPhotoMode) {
      const renamed = getStudentRenamedFileName(file.name);
      const renameBadge = document.createElement("div");
      renameBadge.className = "file-rename-badge";
      renameBadge.innerHTML = `<span class="rename-icon">🏷️</span> <span class="rename-text" title="${renamed}">${renamed}</span>`;
      card.appendChild(renameBadge);
    }

    container.appendChild(card);
  });
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

/**
 * 3. Xử lý Gửi Form lên Google Apps Script Web App
 */
async function handleFormSubmit(e) {
  e.preventDefault();

  if (!CONFIG.API_ENDPOINT || CONFIG.API_ENDPOINT.includes("SAMPLE_YOUR_SCRIPT_ID_HERE")) {
    alert("Chưa cấu hình API_ENDPOINT trong file js/config.js!\nVui lòng dán link Web App của Google Apps Script vào file config.js để hệ thống hoạt động.");
    return;
  }

  const form = document.getElementById("submissionForm");
  const formData = new FormData(form);

  // Kiểm tra tính hợp lệ riêng cho chế độ Thu thập ảnh học sinh
  if (isStudentPhotoMode) {
    const studentName = (formData.get("submitter") || "").trim();
    const phone = (formData.get("phone") || "").trim();
    const studentEventSelect = document.getElementById("studentEventSelect");

    if (!studentName) {
      alert("Vui lòng điền Họ và tên học sinh!");
      document.getElementById("submitterName")?.focus();
      return;
    }
    if (!phone) {
      alert("Vui lòng nhập Số điện thoại liên hệ!");
      document.getElementById("submitterPhone")?.focus();
      return;
    }
    if (!studentEventSelect || !studentEventSelect.value) {
      alert("Vui lòng chọn Sự kiện / Lễ tuyên dương khen thưởng của trường!");
      studentEventSelect?.focus();
      return;
    }
    if (selectedFiles.length === 0) {
      alert("Vui lòng tải lên ít nhất 1 ảnh để gửi!");
      return;
    }
  }

  // Hiển thị modal tiến trình
  showProgressModal("Đang chuẩn bị và mã hóa tư liệu...", 10);

  try {
    // Chuyển đổi các file sang Base64 và tự động đổi tên theo học sinh nếu ở chế độ ảnh
    const filePayloads = [];
    const totalFiles = selectedFiles.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = selectedFiles[i];
      const percent = Math.round(10 + ((i + 1) / totalFiles) * 40);
      showProgressModal(`Đang xử lý tệp ${i + 1}/${totalFiles}: ${file.name}...`, percent);
      
      const base64Data = await compressAndReadAsBase64(file);

      // Đổi tên file theo cú pháp [Tên_Học_Sinh].[ext] (Không có _01 vì 1 học sinh 1 hình)
      let finalFileName = file.name;
      if (isStudentPhotoMode) {
        const studentName = (formData.get("submitter") || "").trim().replace(/[\/\\:*?"<>|]/g, "_");
        const ext = file.name.includes(".") ? file.name.substring(file.name.lastIndexOf(".")) : ".jpg";
        finalFileName = `${studentName}${ext}`;
      }

      filePayloads.push({
        name: finalFileName,
        originalName: file.name,
        type: file.type.startsWith("image/") ? "image/jpeg" : file.type,
        base64: base64Data
      });
    }

    showProgressModal("Đang gửi bài viết đến Google Drive THPT Mạc Đĩnh Chi...", 60);

    // Gói dữ liệu JSON theo từng chế độ
    let payload;
    if (isStudentPhotoMode) {
      const studentEventSelect = document.getElementById("studentEventSelect");
      const selectedOption = studentEventSelect ? studentEventSelect.options[studentEventSelect.selectedIndex] : null;
      const eventName = selectedOption ? (selectedOption.dataset.name || selectedOption.textContent) : "Sự kiện Tuyên dương Học sinh";
      const sharedFolderId = selectedOption ? (selectedOption.dataset.folderId || "") : "";
      const studentName = (formData.get("submitter") || "").trim();
      const phone = (formData.get("phone") || "").trim();

      payload = {
        isStudentPhotoCollection: true,
        studentEventId: studentEventSelect ? studentEventSelect.value : "",
        sharedFolderId: sharedFolderId,
        role: "Học sinh",
        dept: "Học sinh (Khác - Tuyên dương)",
        submitter: studentName,
        phone: phone,
        email: "",
        category: "Tuyên dương / Khen thưởng học sinh",
        eventName: eventName,
        timeLocation: "",
        caption: `[Thu thập ảnh tuyên dương: ${eventName}] Học sinh: ${studentName} - SĐT: ${phone}`,
        hugeFileLink: (formData.get("hugeFileLink") || "").trim(),
        files: filePayloads
      };
    } else {
      payload = {
        role: currentRole === "teacher" ? "Giáo viên / Tổ chuyên môn" : "Học sinh / Câu lạc bộ",
        dept: formData.get("dept"),
        submitter: formData.get("submitter"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        category: formData.get("category"),
        eventName: formData.get("eventName"),
        timeLocation: formData.get("timeLocation") || "",
        caption: formData.get("caption"),
        hugeFileLink: (formData.get("hugeFileLink") || "").trim(),
        files: filePayloads
      };
    }

    showProgressModal("Hệ thống đang cấp Mã bài viết & lưu trữ vào Google Drive...", 85);

    // Gửi dữ liệu bằng text/plain để tránh preflight CORS issues
    const response = await fetch(CONFIG.API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    showProgressModal("Hoàn tất xử lý!", 100);

    const result = await response.json();

    hideProgressModal();

    if (result.success) {
      showSuccessModal(result.ticketCode, result.folderUrl, filePayloads.length);
    } else {
      alert("Lỗi từ máy chủ: " + (result.message || "Không rõ nguyên nhân."));
    }

  } catch (error) {
    hideProgressModal();
    console.error("Lỗi gửi dữ liệu:", error);
    alert("Không thể gửi bài viết: " + error.message + "\nVui lòng kiểm tra kết nối mạng hoặc liên hệ Thầy Tín (Ban Truyền Thông).");
  }
}

/**
 * Đọc file thành chuỗi Base64 (Kèm nén ảnh thông minh nếu > 1.5MB để upload mượt 20 file)
 */
function compressAndReadAsBase64(file) {
  return new Promise((resolve, reject) => {
    // Nếu không phải ảnh (video, pdf, docx...) hoặc ảnh nhỏ (< 1.5MB), đọc trực tiếp
    if (!file.type.startsWith("image/") || file.size < 1.5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = () => {
        const rawBase64 = reader.result.split(",")[1];
        resolve(rawBase64);
      };
      reader.onerror = err => reject(err);
      reader.readAsDataURL(file);
      return;
    }

    // Nếu là ảnh lớn > 1.5MB (ảnh chụp điện thoại 4K/8K), tối ưu kích thước để đảm bảo tải lên 20 tệp mượt mà
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDimension = 2400; // Độ phân giải cực nét cho truyền thông (2.4K)

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Xuất ra JPEG chất lượng cao 88%
        const dataUrl = canvas.toDataURL("image/jpeg", 0.88);
        const base64 = dataUrl.split(",")[1];
        resolve(base64);
      };
      img.onerror = () => {
        const rawBase64 = e.target.result.split(",")[1];
        resolve(rawBase64);
      };
      img.src = e.target.result;
    };
    reader.onerror = err => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Tiến trình Modal
 */
function showProgressModal(title, percent) {
  const modal = document.getElementById("progressModal");
  const titleEl = document.getElementById("progressTitle");
  const fillEl = document.getElementById("progressBarFill");
  const percentEl = document.getElementById("progressPercent");

  modal.style.display = "flex";
  titleEl.textContent = title;
  fillEl.style.width = percent + "%";
  percentEl.textContent = percent + "%";
}

function hideProgressModal() {
  document.getElementById("progressModal").style.display = "none";
}

/**
 * Modal thành công
 */
function showSuccessModal(ticketCode, folderUrl, fileCount) {
  const modal = document.getElementById("successModal");
  document.getElementById("ticketCodeDisplay").textContent = ticketCode;

  if (isStudentPhotoMode) {
    document.getElementById("summaryFileCount").textContent = `${fileCount} ảnh tuyên dương (Đã tự động đổi tên theo học sinh)`;
  } else {
    document.getElementById("summaryFileCount").textContent = `${fileCount} tệp tư liệu`;
  }
  
  const linkEl = document.getElementById("summaryFolderLink");
  const directLink = document.getElementById("btnOpenDriveDirect");
  if (folderUrl && folderUrl.startsWith("http")) {
    linkEl.href = folderUrl;
    linkEl.style.display = "inline-block";
    if (directLink) directLink.href = folderUrl;
  } else {
    linkEl.style.display = "none";
  }

  modal.style.display = "flex";
}

function copyTicketCode() {
  const code = document.getElementById("ticketCodeDisplay").textContent;
  navigator.clipboard.writeText(code).then(() => {
    const copyText = document.getElementById("copyText");
    const originalText = copyText.textContent;
    copyText.textContent = "Đã chép!";
    setTimeout(() => copyText.textContent = originalText, 2000);
  });
}

function resetFormAndCloseModal() {
  document.getElementById("successModal").style.display = "none";
  document.getElementById("submissionForm").reset();
  selectedFiles = [];
  renderFileList();
  const notice = document.getElementById("deptAutoFillNotice");
  if (notice) {
    notice.style.display = "none";
    notice.innerHTML = "";
  }
  switchRole("teacher");
}

/**
 * ==========================================================================
 * QUẢN LÝ MODAL QUY CHUẨN & YÊU CẦU NỘI DUNG BÀI ĐĂNG (THEO KẾ HOẠCH & QUY CHUẨN MĐC)
 * ==========================================================================
 */
function openGuidelinesModal(tab = 'content') {
  const modal = document.getElementById("guidelinesModal");
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
    switchGuidelinesTab(tab);
  }
}

function closeGuidelinesModal() {
  const modal = document.getElementById("guidelinesModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
}

function switchGuidelinesTab(tabName) {
  const tabBtns = document.querySelectorAll(".guidelines-tab-btn");
  tabBtns.forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabName);
  });

  const panels = document.querySelectorAll(".guidelines-tab-panel");
  panels.forEach(panel => {
    panel.classList.toggle("active", panel.id === `tabGuidelines_${tabName}`);
  });
}

/**
 * Chèn mẫu Footer chuẩn quy định vào ô Caption đề xuất
 */
function insertFooterTemplate() {
  const captionEl = document.getElementById("captionText");
  const deptEl = document.getElementById("deptSelect");
  const submitterEl = document.getElementById("submitterName");

  const deptName = deptEl && deptEl.value ? deptEl.value : "[Tên Tổ / CLB]";
  const submitterName = submitterEl && submitterEl.value ? submitterEl.value : "[Họ tên Thầy/Cô]";

  const footerText = 
`\n\n---------------------------------------
Chịu trách nhiệm nội dung: ${submitterName} - ${deptName}
Chịu trách nhiệm hình ảnh: ${deptName} / Ban Truyền Thông
---------------------------------------
Mọi thông tin chi tiết xin liên hệ:
TRƯỜNG THPT MẠC ĐĨNH CHI - PHƯỜNG PHÚ LÂM - THÀNH PHỐ HỒ CHÍ MINH
Địa chỉ: Số 4 Tân Hòa Đông, Phường Phú Lâm, Thành phố Hồ Chí Minh
Website: https://thptmacdinhchi.hcm.edu.vn/homemb2  
Fanpage chính thức: https://www.facebook.com/thptmacdinhchi.edu/  
#THPTMacDinhChi`;

  if (captionEl) {
    if (captionEl.value.includes("#THPTMacDinhChi")) {
      alert("Khung caption đã có sẵn khối thông tin Footer liên hệ.");
      return;
    }
    captionEl.value = (captionEl.value.trim() ? captionEl.value.trim() : "[Nhập nội dung bài viết chi tiết tại đây...]") + footerText;
    captionEl.focus();
    alert("Đã chèn mẫu Footer chuẩn vào khung Caption đề xuất!");
  }
}

/**
 * Sao chép mẫu Footer chuẩn vào bộ nhớ đệm
 */
function copyFooterTemplate() {
  const footerText = 
`Chịu trách nhiệm nội dung: [Họ tên Thầy/Cô] - [Tổ / Đơn vị]
Chịu trách nhiệm hình ảnh: [Họ tên Thầy/Cô hoặc Bộ phận chụp ảnh]
---------------------------------------
Mọi thông tin chi tiết xin liên hệ:
TRƯỜNG THPT MẠC ĐĨNH CHI - PHƯỜNG PHÚ LÂM - THÀNH PHỐ HỒ CHÍ MINH
Địa chỉ: Số 4 Tân Hòa Đông, Phường Phú Lâm, Thành phố Hồ Chí Minh
Website: https://thptmacdinhchi.hcm.edu.vn/homemb2  
Fanpage chính thức: https://www.facebook.com/thptmacdinhchi.edu/  
#THPTMacDinhChi`;

  navigator.clipboard.writeText(footerText).then(() => {
    alert("Đã sao chép mẫu Footer chuẩn vào bộ nhớ tạm!");
  });
}

// ==========================================================================
// MODULE CHỈNH SỬA & BỔ SUNG BÀI VIẾT THEO YÊU CẦU (CHO THẦY/CÔ)
// ==========================================================================

/**
 * Cấu hình Kéo & Thả file cho khu vực chỉnh sửa
 */
function setupRevisionDragAndDrop() {
  const revDropZone = document.getElementById("revDropZone");
  if (!revDropZone) return;

  ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
    revDropZone.addEventListener(eventName, preventDefaults, false);
  });

  ["dragenter", "dragover"].forEach(eventName => {
    revDropZone.addEventListener(eventName, () => revDropZone.classList.add("dragover"), false);
  });

  ["dragleave", "drop"].forEach(eventName => {
    revDropZone.addEventListener(eventName, () => revDropZone.classList.remove("dragover"), false);
  });

  revDropZone.addEventListener("drop", (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files) {
      addRevFiles(dt.files);
    }
  }, false);
}

function triggerRevFileInput() {
  const input = document.getElementById("revFileInput");
  if (input) input.click();
}

function handleRevFilesSelected(e) {
  if (e && e.target && e.target.files) {
    addRevFiles(e.target.files);
    e.target.value = "";
  }
}

function addRevFiles(fileList) {
  const maxLimit = CONFIG.MAX_FILES || 20;
  const maxMb = CONFIG.MAX_FILE_SIZE_MB || 50;

  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    if (selectedRevFiles.length >= maxLimit) {
      alert(`Chỉ được tải lên tối đa ${maxLimit} tệp bổ sung.`);
      break;
    }
    if (file.size > maxMb * 1024 * 1024) {
      alert(`Tệp "${file.name}" vượt quá kích thước cho phép (${maxMb}MB).`);
      continue;
    }
    if (!selectedRevFiles.some(f => f.name === file.name && f.size === file.size)) {
      selectedRevFiles.push(file);
    }
  }
  renderRevFileList();
}

function removeRevFile(index) {
  selectedRevFiles.splice(index, 1);
  renderRevFileList();
}

function renderRevFileList() {
  const container = document.getElementById("revFileListContainer");
  if (!container) return;

  if (selectedRevFiles.length === 0) {
    container.style.display = "none";
    container.innerHTML = "";
    return;
  }

  container.style.display = "grid";
  container.innerHTML = "";

  selectedRevFiles.forEach((file, idx) => {
    const card = document.createElement("div");
    card.className = "file-preview-card";

    const btnRemove = document.createElement("button");
    btnRemove.className = "btn-remove-file";
    btnRemove.innerHTML = "&times;";
    btnRemove.type = "button";
    btnRemove.onclick = (e) => {
      e.stopPropagation();
      removeRevFile(idx);
    };
    card.appendChild(btnRemove);

    if (file.type.startsWith("image/")) {
      const img = document.createElement("img");
      img.className = "file-thumbnail";
      img.alt = file.name;
      const reader = new FileReader();
      reader.onload = (e) => img.src = e.target.result;
      reader.readAsDataURL(file);
      card.appendChild(img);
    } else {
      const placeholder = document.createElement("div");
      placeholder.className = "file-icon-placeholder";
      placeholder.textContent = file.type.startsWith("video/") ? "🎬" : "📄";
      card.appendChild(placeholder);
    }

    const nameLabel = document.createElement("span");
    nameLabel.className = "file-name-truncate";
    nameLabel.title = file.name;
    nameLabel.textContent = file.name;
    card.appendChild(nameLabel);

    const sizeLabel = document.createElement("span");
    sizeLabel.className = "file-size-tag";
    sizeLabel.textContent = formatBytes(file.size);
    card.appendChild(sizeLabel);

    container.appendChild(card);
  });
}

function insertFooterToRevision() {
  const captionEl = document.getElementById("revFormCaption");
  if (!captionEl) return;
  const footerText = 
`\n\nChịu trách nhiệm nội dung: [Họ tên Thầy/Cô] - [Tổ / Đơn vị]
Chịu trách nhiệm hình ảnh: [Họ tên Thầy/Cô hoặc Bộ phận chụp ảnh]
---------------------------------------
Mọi thông tin chi tiết xin liên hệ:
TRƯỜNG THPT MẠC ĐĨNH CHI - PHƯỜNG PHÚ LÂM - THÀNH PHỐ HỒ CHÍ MINH
Địa chỉ: Số 4 Tân Hòa Đông, Phường Phú Lâm, Thành phố Hồ Chí Minh
Website: https://thptmacdinhchi.hcm.edu.vn/homemb2  
Fanpage chính thức: https://www.facebook.com/thptmacdinhchi.edu/  
#THPTMacDinhChi`;

  if (captionEl.value.includes("#THPTMacDinhChi")) {
    alert("Khung caption đã có sẵn khối Footer liên hệ.");
    return;
  }
  captionEl.value = captionEl.value.trim() + footerText;
  captionEl.focus();
}

/**
 * Tra cứu bài viết cần chỉnh sửa theo Mã Ticket, Tên Thầy/Cô hoặc SĐT
 */
async function searchTicketForRevision() {
  const searchInput = document.getElementById("revisionSearchInput");
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const noticeEl = document.getElementById("revisionSearchNotice");
  const resultsContainer = document.getElementById("revisionSearchResults");
  const detailCard = document.getElementById("revisionDetailCard");
  const btnSearchText = document.getElementById("btnSearchTicketText");
  const spinner = document.getElementById("searchSpinner");

  if (!query) {
    if (noticeEl) {
      noticeEl.style.display = "flex";
      noticeEl.style.background = "#fff7ed";
      noticeEl.style.color = "#c2410c";
      noticeEl.innerHTML = "⚠️ Vui lòng nhập Mã bài viết (ví dụ: TT-2026-0001) hoặc Họ tên Thầy/Cô / Số điện thoại để tra cứu.";
    }
    return;
  }

  // Hiển thị trạng thái đang tìm kiếm
  if (btnSearchText) btnSearchText.style.display = "none";
  if (spinner) spinner.style.display = "inline-block";
  if (noticeEl) noticeEl.style.display = "none";
  if (resultsContainer) {
    resultsContainer.style.display = "none";
    resultsContainer.innerHTML = "";
  }
  if (detailCard) detailCard.style.display = "none";

  try {
    let allTickets = [];
    const now = Date.now();

    // 1. Tận dụng cache nếu vừa tải trong vòng 60 giây để tra cứu tức thì
    if (cachedRevisionTickets && cachedRevisionTickets.length > 0 && (now - lastRevisionFetchTime < 60000)) {
      allTickets = cachedRevisionTickets;
    } else {
      const url = `${CONFIG.API_ENDPOINT}?action=getTickets`;
      const res = await fetch(url, { 
        method: "GET",
        credentials: "omit"
      });
      const rawText = await res.text();
      let json = null;
      try {
        json = JSON.parse(rawText);
      } catch (parseErr) {
        console.warn("Máy chủ Google Apps Script trả về văn bản không phải JSON:", rawText);
        if (rawText && rawText.trim().startsWith("<")) {
          throw new Error("Dịch vụ Google Apps Script phản hồi chậm hoặc đang chuyển tiếp HTML. Thầy/Cô vui lòng bấm 'Tìm bài viết' lại sau giây lát.");
        }
        throw new Error("Không thể phân tích dữ liệu bài viết từ máy chủ (" + parseErr.message + ").");
      }

      allTickets = Array.isArray(json.tickets) ? json.tickets : (json.data && Array.isArray(json.data.tickets) ? json.data.tickets : []);

      if (!json.success && allTickets.length === 0) {
        throw new Error(json.message || "Không thể tải danh sách bài viết từ máy chủ.");
      }

      if (allTickets.length > 0) {
        cachedRevisionTickets = allTickets;
        lastRevisionFetchTime = Date.now();
      }
    }

    if (btnSearchText) btnSearchText.style.display = "inline";
    if (spinner) spinner.style.display = "none";

    function removeVietnameseTones(str) {
      if (!str) return "";
      str = String(str).toLowerCase().trim();
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      return str;
    }

    const qClean = removeVietnameseTones(query);
    const qDigits = query.replace(/\D/g, "");

    // Lọc bài viết theo truy vấn
    const matched = allTickets.filter(t => {
      const code = String(t.code || "").toLowerCase();
      const codeDigits = code.replace(/\D/g, "");
      const name = removeVietnameseTones(t.submitter || "");
      const rawName = String(t.submitter || "").toLowerCase();
      const phoneDigits = String(t.phone || "").replace(/\D/g, "");
      const eventName = removeVietnameseTones(t.eventName || "");
      const rawEvent = String(t.eventName || "").toLowerCase();
      const dept = removeVietnameseTones(t.dept || "");

      // 1. Khớp mã ticket (VD: "TT-2026-0002", "0002", "2")
      const matchCode = code.includes(query) || (qDigits && (codeDigits.endsWith(qDigits) || Number(codeDigits) === Number(qDigits)));
      // 2. Khớp tên người nộp (có dấu hoặc không dấu)
      const matchName = name.includes(qClean) || rawName.includes(query);
      // 3. Khớp số điện thoại (chấp nhận cả 0795337935 lẫn 795337935)
      const matchPhone = qDigits && (
        phoneDigits.includes(qDigits) || 
        (qDigits.startsWith("0") && phoneDigits.includes(qDigits.substring(1))) || 
        ("0" + phoneDigits).includes(qDigits)
      );
      // 4. Khớp tên sự kiện hoặc tổ
      const matchEvent = eventName.includes(qClean) || rawEvent.includes(query) || dept.includes(qClean);

      return matchCode || matchName || matchPhone || matchEvent;
    });

    if (matched.length === 0) {
      if (noticeEl) {
        noticeEl.style.display = "flex";
        noticeEl.style.background = "#fef2f2";
        noticeEl.style.color = "#991b1b";
        noticeEl.innerHTML = `❌ Không tìm thấy bài viết nào khớp với từ khóa "<strong>${searchInput.value.trim()}</strong>". Thầy/Cô vui lòng kiểm tra lại mã bài hoặc số điện thoại.`;
      }
      return;
    }

    // Nếu chỉ khớp đúng 1 bài: hiển thị trực tiếp chi tiết để sửa
    if (matched.length === 1) {
      displayRevisionDetail(matched[0]);
    } else {
      // Nếu có nhiều bài: hiển thị danh sách thẻ để Thầy/Cô chọn
      // Ưu tiên hiển thị bài đang ở trạng thái YÊU CẦU CHỈNH SỬA lên trên
      matched.sort((a, b) => {
        const isRevA = (a.status || "").includes("YÊU CẦU") ? 1 : 0;
        const isRevB = (b.status || "").includes("YÊU CẦU") ? 1 : 0;
        return isRevB - isRevA;
      });

      renderRevisionSearchResults(matched);
    }

  } catch (err) {
    if (btnSearchText) btnSearchText.style.display = "inline";
    if (spinner) spinner.style.display = "none";
    if (noticeEl) {
      noticeEl.style.display = "flex";
      noticeEl.style.background = "#fef2f2";
      noticeEl.style.color = "#991b1b";
      noticeEl.innerHTML = `⚠️ Lỗi tra cứu: ${err.message}`;
    }
  }
}

/**
 * Hiển thị danh sách kết quả tìm kiếm khi có nhiều bài viết
 */
function renderRevisionSearchResults(tickets) {
  const container = document.getElementById("revisionSearchResults");
  if (!container) return;

  container.style.display = "flex";
  container.innerHTML = `
    <div style="font-size: 0.9rem; font-weight: 700; color: #334155; margin-bottom: 4px;">
      Tìm thấy ${tickets.length} bài viết phù hợp. Thầy/Cô vui lòng bấm chọn bài cần chỉnh sửa:
    </div>
  `;

  tickets.forEach(ticket => {
    const isNeedsRev = (ticket.status || "").includes("YÊU CẦU");
    const item = document.createElement("div");
    item.className = `result-item-card ${isNeedsRev ? "needs-revision" : ""}`;
    item.onclick = () => displayRevisionDetail(ticket);

    item.innerHTML = `
      <div class="result-item-info">
        <h4>[${ticket.code}] ${ticket.eventName || "Bài viết truyền thông"}</h4>
        <div class="result-item-meta">
          <span>🏛️ ${ticket.dept || "Chưa rõ tổ"}</span>
          <span>👤 ${ticket.submitter || "Thầy/Cô"}</span>
          <span style="color: ${isNeedsRev ? '#c2410c' : '#0369a1'}; font-weight: 700;">
            ${isNeedsRev ? '⚠️ ' + ticket.status : '📌 ' + ticket.status}
          </span>
          ${ticket.revisionCount ? `<span>(Sửa: ${ticket.revisionCount})</span>` : ""}
        </div>
      </div>
      <button type="button" class="btn-select-result">
        ${isNeedsRev ? "Chỉnh sửa bài này ↗" : "Xem & Bổ sung ↗"}
      </button>
    `;

    container.appendChild(item);
  });
}

/**
 * Hiển thị chi tiết bài viết và mở Form chỉnh sửa bổ sung
 */
function displayRevisionDetail(ticket) {
  currentActiveRevisionTicket = ticket;

  const resultsContainer = document.getElementById("revisionSearchResults");
  if (resultsContainer) resultsContainer.style.display = "none";

  const detailCard = document.getElementById("revisionDetailCard");
  if (!detailCard) return;

  // 1. Điền thông tin meta
  const codeEl = document.getElementById("revDetailCode");
  const eventNameEl = document.getElementById("revDetailEventName");
  const deptSubmitterEl = document.getElementById("revDetailDeptSubmitter");
  const statusEl = document.getElementById("revDetailStatus");
  const countEl = document.getElementById("revDetailCount");
  const handlerEl = document.getElementById("revDetailHandler");
  const feedbackEl = document.getElementById("revDetailFeedback");
  const directLinkEl = document.getElementById("revDirectDriveLink");
  const rootLabelEl = document.getElementById("revTreeRootLabel");

  if (codeEl) codeEl.textContent = ticket.code;
  if (eventNameEl) eventNameEl.textContent = ticket.eventName || "Bài viết truyền thông";
  if (deptSubmitterEl) {
    deptSubmitterEl.textContent = `${ticket.dept || "Tổ chuyên môn"} • Người nộp: ${ticket.submitter || "Thầy/Cô"} ${ticket.phone ? "(" + ticket.phone + ")" : ""}`;
  }

  // Trạng thái badge
  const isNeedsRev = (ticket.status || "").includes("YÊU CẦU");
  if (statusEl) {
    statusEl.textContent = ticket.status || "MỚI NHẬN";
    statusEl.style.background = isNeedsRev ? "#fef3c7" : "#ecfdf5";
    statusEl.style.color = isNeedsRev ? "#b45309" : "#047857";
    statusEl.style.borderColor = isNeedsRev ? "#fde68a" : "#a7f3d0";
  }

  if (countEl) {
    countEl.textContent = `Lần sửa: ${ticket.revisionCount || 0}`;
  }

  // Lời nhắn / Nhận xét của Ban Biên Tập
  if (handlerEl) {
    handlerEl.textContent = `Người duyệt: ${ticket.handler || "Ban Quản Trị BTT"}`;
  }
  if (feedbackEl) {
    if (ticket.feedback && ticket.feedback.trim()) {
      feedbackEl.textContent = `"${ticket.feedback.trim()}"`;
    } else {
      feedbackEl.textContent = `"Thầy/Cô vui lòng rà soát lại thông tin bài viết và bổ sung thêm ảnh/video gốc nếu cần."`;
    }
  }

  // Link Drive & Cây thư mục
  const folderUrl = ticket.driveFolder || "#";
  if (directLinkEl) {
    directLinkEl.href = folderUrl;
    if (folderUrl === "#") {
      directLinkEl.style.display = "none";
    } else {
      directLinkEl.style.display = "inline-flex";
    }
  }

  const cleanEvent = (ticket.eventName || "").replace(/[\\/:*?"<>|#%&{}]/g, "_").trim().substring(0, 30);
  if (rootLabelEl) {
    rootLabelEl.textContent = `${ticket.code}_${cleanEvent}`;
  }

  // 2. Điền form chỉnh sửa
  const formTicketCode = document.getElementById("revFormTicketCode");
  const formSubmitter = document.getElementById("revFormSubmitter");
  const formCaption = document.getElementById("revFormCaption");
  const formTeacherNotes = document.getElementById("revTeacherNotes");
  const formHugeLink = document.getElementById("revHugeFileLink");

  if (formTicketCode) formTicketCode.value = ticket.code;
  if (formSubmitter) formSubmitter.value = ticket.submitter || "";
  if (formCaption) formCaption.value = ticket.caption || "";
  if (formTeacherNotes) formTeacherNotes.value = "";
  if (formHugeLink) formHugeLink.value = "";

  // Reset danh sách file đính kèm mới
  selectedRevFiles = [];
  renderRevFileList();

  // Hiển thị khung chi tiết
  detailCard.style.display = "block";
  detailCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * Đóng khung chi tiết bài viết và quay lại danh sách
 */
function closeRevisionDetail() {
  const detailCard = document.getElementById("revisionDetailCard");
  if (detailCard) detailCard.style.display = "none";

  const resultsContainer = document.getElementById("revisionSearchResults");
  if (resultsContainer && resultsContainer.children.length > 1) {
    resultsContainer.style.display = "flex";
  }
}

/**
 * Xử lý Gửi bản chỉnh sửa / bổ sung bài viết lên Apps Script
 */
async function handleRevisionSubmit(event) {
  event.preventDefault();

  const ticketCode = (document.getElementById("revFormTicketCode")?.value || "").trim();
  const submitter = (document.getElementById("revFormSubmitter")?.value || "").trim();
  const revisedCaption = (document.getElementById("revFormCaption")?.value || "").trim();
  const teacherNotes = (document.getElementById("revTeacherNotes")?.value || "").trim();
  const hugeFileLink = (document.getElementById("revHugeFileLink")?.value || "").trim();

  if (!ticketCode) {
    alert("Không tìm thấy mã bài viết hợp lệ.");
    return;
  }

  if (!revisedCaption) {
    alert("Vui lòng nhập nội dung bài viết / caption đã chỉnh sửa.");
    return;
  }

  const btnSubmit = document.getElementById("btnSubmitRevision");
  const btnText = document.getElementById("btnSubmitRevText");
  const spinner = document.getElementById("btnRevSpinner");

  if (btnSubmit) btnSubmit.disabled = true;
  if (btnText) btnText.style.display = "none";
  if (spinner) spinner.style.display = "inline-block";

  showProgressModal("Đang tải các tệp chỉnh sửa lên Google Drive...", 20);

  try {
    // Chuyển đổi các file mới sang Base64
    const filePayloads = [];
    const totalFiles = selectedRevFiles.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = selectedRevFiles[i];
      const percent = Math.round(20 + ((i + 1) / (totalFiles || 1)) * 50);
      showProgressModal(`Đang xử lý tệp bổ sung (${i + 1}/${totalFiles}): ${file.name}...`, percent);

      const base64Data = await compressAndReadAsBase64(file);
      filePayloads.push({
        name: file.name,
        type: file.type || "application/octet-stream",
        size: file.size,
        base64: base64Data
      });
    }

    showProgressModal("Đang cập nhật trạng thái bài viết sang [ĐÃ SỬA – CHỜ DUYỆT]...", 85);

    const payload = {
      action: "submitRevision",
      ticketCode: ticketCode,
      folderUrl: (currentActiveRevisionTicket && currentActiveRevisionTicket.driveFolder) || "",
      submitter: submitter,
      revisedCaption: revisedCaption,
      teacherNotes: teacherNotes,
      hugeFileLink: hugeFileLink,
      files: filePayloads
    };

    const response = await fetch(CONFIG.API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    showProgressModal("Hoàn tất xử lý!", 100);
    const result = await response.json();
    hideProgressModal();

    if (btnSubmit) btnSubmit.disabled = false;
    if (btnText) btnText.style.display = "inline";
    if (spinner) spinner.style.display = "none";

    if (result.success) {
      showRevisionSuccessModal(result.ticketCode, result.folderUrl, filePayloads.length);
    } else {
      alert("Lỗi từ máy chủ: " + (result.message || "Không thể lưu bản chỉnh sửa."));
    }

  } catch (err) {
    hideProgressModal();
    if (btnSubmit) btnSubmit.disabled = false;
    if (btnText) btnText.style.display = "inline";
    if (spinner) spinner.style.display = "none";

    console.error("Lỗi gửi bản chỉnh sửa:", err);
    alert("Không thể gửi bản chỉnh sửa: " + err.message + "\nVui lòng thử lại hoặc liên hệ Thầy Tín (Ban Truyền Thông).");
  }
}

/**
 * Hiển thị Modal thành công sau khi gửi bản chỉnh sửa
 */
function showRevisionSuccessModal(ticketCode, folderUrl, fileCount) {
  const modal = document.getElementById("revisionSuccessModal");
  const codeEl = document.getElementById("revSuccessTicketCode");
  const countEl = document.getElementById("revSuccessFileCount");
  const linkEl = document.getElementById("revSuccessFolderLink");

  if (codeEl) codeEl.textContent = ticketCode;
  if (countEl) countEl.textContent = `${fileCount} tệp bổ sung`;
  if (linkEl) {
    linkEl.href = folderUrl || "#";
    if (!folderUrl || folderUrl === "#") {
      linkEl.style.display = "none";
    } else {
      linkEl.style.display = "inline-block";
    }
  }

  if (modal) modal.style.display = "flex";
}

function closeRevisionSuccessModal() {
  const modal = document.getElementById("revisionSuccessModal");
  if (modal) modal.style.display = "none";

  // Reset form và đóng detail
  closeRevisionDetail();
  const searchInput = document.getElementById("revisionSearchInput");
  if (searchInput) searchInput.value = "";
  const resultsContainer = document.getElementById("revisionSearchResults");
  if (resultsContainer) resultsContainer.style.display = "none";

  // Quay lại tab nộp bài mới
  switchPortalMode("submit");
}

// Bắt sự kiện bàn phím Escape để đóng Modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeGuidelinesModal();
    const revModal = document.getElementById("revisionSuccessModal");
    if (revModal && revModal.style.display === "flex") {
      closeRevisionSuccessModal();
    }
  }
});

