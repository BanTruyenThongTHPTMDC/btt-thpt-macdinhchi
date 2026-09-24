/**
 * ==========================================================================
 * CỔNG TIẾP NHẬN BÀI TRUYỀN THÔNG - THPT MẠC ĐĨNH CHI
 * Logic xử lý giao diện, kéo thả file, chuyển đổi Base64 và gửi API
 * ==========================================================================
 */

// Danh sách danh mục theo Kế hoạch Ban Truyền Thông MDC 2026 - 2027
const DEPARTMENTS = {
  teacher: [
    "Tổ Toán", "Tổ Vật lí", "Tổ Hóa học", "Tổ Ngữ Văn", "Tổ Tiếng Anh",
    "Tổ Lịch Sử", "Tổ Địa lí", "Tổ GDKT&PL", "Tổ Công nghệ", "Tổ GDTC - GDQP&AN",
    "Tổ Sinh học", "Tổ Tin học", "Nhóm HĐTNHN - GDĐP", "Chi bộ", "Công đoàn",
    "Đoàn trường", "Chi đoàn Giáo viên", "GVCN", "Văn phòng", "Phòng Giám thị", "Khác"
  ],
  student: [
    "CLB Khoa học – Khởi nghiệp",
    "CLB Truyền thông",
    "CLB Văn nghệ - Cổ động",
    "CLB Tiếng Anh",
    "CLB Văn học – Diễn thuyết và Kịch",
    "CLB Kỹ năng sống",
    "CLB Hội họa",
    "Đoàn Thanh niên - Đội Tình nguyện",
    "Ban Chỉ huy Liên chi Đoàn",
    "Đại diện Khối 10",
    "Đại diện Khối 11",
    "Đại diện Khối 12",
    "Cộng tác viên Media / Nhiếp ảnh",
    "Khác"
  ]
};

// State
let currentRole = "teacher"; // "teacher" hoặc "student"
let selectedFiles = []; // Mảng chứa các File object

// Khởi chạy khi DOM sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  applySystemConfig();
  populateDeptDropdown("teacher");
  setupDragAndDrop();
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
          "Đoàn Thanh niên - Đội Tình nguyện",
          "Ban Chỉ huy Liên chi Đoàn",
          "Đại diện Khối 10",
          "Đại diện Khối 11",
          "Đại diện Khối 12",
          "Cộng tác viên Media / Nhiếp ảnh",
          "Khác"
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
 * 1. Chuyển đổi giữa vai trò Giáo viên và Học sinh
 */
function switchRole(role) {
  currentRole = role;
  
  const tabTeacher = document.getElementById("tabTeacher");
  const tabStudent = document.getElementById("tabStudent");
  const submitterNameInput = document.getElementById("submitterName");
  
  if (role === "teacher") {
    tabTeacher.classList.add("active");
    tabTeacher.setAttribute("aria-selected", "true");
    tabStudent.classList.remove("active");
    tabStudent.setAttribute("aria-selected", "false");
    
    submitterNameInput.placeholder = "Ví dụ: Thầy Đoàn Minh Tâm / Cô Nguyễn Khánh Ninh";
    populateDeptDropdown("teacher");
  } else {
    tabStudent.classList.add("active");
    tabStudent.setAttribute("aria-selected", "true");
    tabTeacher.classList.remove("active");
    tabTeacher.setAttribute("aria-selected", "false");
    
    submitterNameInput.placeholder = "Ví dụ: Nguyễn Văn A (Chủ nhiệm CLB / Lớp 12A1)";
    populateDeptDropdown("student");
  }
}

/**
 * Điền danh sách đơn vị vào dropdown
 */
function populateDeptDropdown(role) {
  const select = document.getElementById("deptSelect");
  if (!select) return;
  select.innerHTML = '<option value="" disabled selected>-- Vui lòng chọn tổ / bộ phận / CLB --</option>';
  
  const list = role === "student" ? getStudentDepartments() : (DEPARTMENTS.teacher || []);
  list.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item;
    opt.textContent = item;
    select.appendChild(opt);
  });
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
  const maxLimit = CONFIG.MAX_FILES || 20;
  const maxMb = CONFIG.MAX_FILE_SIZE_MB || 50;

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

  // Hiển thị modal tiến trình
  showProgressModal("Đang chuẩn bị và mã hóa tư liệu...", 10);

  try {
    // Chuyển đổi các file sang Base64
    const filePayloads = [];
    const totalFiles = selectedFiles.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = selectedFiles[i];
      const percent = Math.round(10 + ((i + 1) / totalFiles) * 40);
      showProgressModal(`Đang xử lý tệp ${i + 1}/${totalFiles}: ${file.name}...`, percent);
      
      const base64Data = await compressAndReadAsBase64(file);
      filePayloads.push({
        name: file.name,
        type: file.type.startsWith("image/") ? "image/jpeg" : file.type,
        base64: base64Data
      });
    }

    showProgressModal("Đang gửi bài viết đến Google Drive THPT Mạc Đĩnh Chi...", 60);

    // Gói dữ liệu JSON
    const payload = {
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

    showProgressModal("Hệ thống đang cấp Mã bài viết & khởi tạo thư mục lưu trữ...", 85);

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
  document.getElementById("summaryFileCount").textContent = `${fileCount} tệp tư liệu`;
  
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
  switchRole("teacher");
}
