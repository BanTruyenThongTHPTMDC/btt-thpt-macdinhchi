/**
 * ==========================================================================
 * TRANG QUẢN TRỊ & KIỂM DUYỆT - BAN TRUYỀN THÔNG THPT MẠC ĐĨNH CHI
 * ==========================================================================
 */

let allTickets = [];
let activeTicket = null;
let isAuthenticated = false; // Lưu trong bộ nhớ RAM trang hiện tại, reset khi F5/tải lại
let currentUserRole = "reviewer"; // "superadmin" hoặc "reviewer"
let currentUserTitle = "Ban Quản Trị BTT";
let currentAdminTab = "tickets";

document.addEventListener("DOMContentLoaded", () => {
  // Xóa mọi dấu vết session cũ: đảm bảo mỗi lần tải lại trang đều phải nhập mã PIN
  sessionStorage.removeItem("btt_admin_authenticated");
  localStorage.removeItem("btt_admin_authenticated");
  checkAuth();

  // Bắt sự kiện bấm ra ngoài modal hoặc bấm Esc để đóng modal
  const reviewModal = document.getElementById("reviewModal");
  if (reviewModal) {
    reviewModal.addEventListener("click", (e) => {
      if (e.target === reviewModal) {
        closeReviewModal();
      }
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("reviewModal");
      if (modal && modal.style.display !== "none") {
        closeReviewModal();
      }
    }
  });
});

/**
 * 1. Kiểm tra xác thực mã PIN (Bắt buộc nhập mỗi lần vào hoặc F5 lại trang)
 */
function checkAuth() {
  const pinScreen = document.getElementById("pinScreen");
  const dashboard = document.getElementById("adminDashboard");
  const btnLogout = document.getElementById("btnLogout");

  if (isAuthenticated) {
    pinScreen.style.display = "none";
    dashboard.style.display = "block";
    btnLogout.style.display = "inline-block";

    // Cập nhật giao diện theo đúng vai trò (Role-Based Display)
    const roleBadgeContainer = document.getElementById("roleBadgeContainer");
    const adminWelcomeTitle = document.getElementById("adminWelcomeTitle");
    const adminWelcomeDesc = document.getElementById("adminWelcomeDesc");
    const btnUpgradeSuper = document.getElementById("btnUpgradeSuper");

    if (currentUserRole === "superadmin") {
      // HIỂN THỊ CÁC TAB ĐẶC QUYỀN SUPER ADMIN
      document.querySelectorAll(".super-only-tab").forEach(tab => tab.style.display = "inline-flex");
      if (btnUpgradeSuper) btnUpgradeSuper.style.display = "none";
      if (roleBadgeContainer) roleBadgeContainer.innerHTML = `<span class="badge-role-super">👑 TỔNG QUẢN TRỊ (SUPER ADMIN)</span>`;
      if (adminWelcomeTitle) adminWelcomeTitle.innerHTML = `👑 CHÀO MỪNG TỔNG QUẢN TRỊ — THẦY NGUYỄN HỒ TRỌNG TÍN`;
      if (adminWelcomeDesc) adminWelcomeDesc.textContent = `Đặc quyền Quản trị tối cao: Xem Báo cáo KPI thi đua toàn trường, Theo dõi tải đội ngũ BTT, Sao lưu dữ liệu & Hủy bài viết.`;
    } else {
      // ẨN HOÀN TOÀN CÁC TAB CỦA SUPER ADMIN (CHỈ GIỮ LẠI TAB DUYỆT BÀI)
      document.querySelectorAll(".super-only-tab").forEach(tab => tab.style.display = "none");
      if (btnUpgradeSuper) btnUpgradeSuper.style.display = "inline-flex";
      switchAdminTab("tickets");
      if (roleBadgeContainer) roleBadgeContainer.innerHTML = `<span class="badge-role-editor">🛡️ BIÊN TẬP VIÊN BTT</span>`;
      if (adminWelcomeTitle) adminWelcomeTitle.innerHTML = `CHÀO MỪNG BIÊN TẬP VIÊN BAN TRUYỀN THÔNG MDC`;
      if (adminWelcomeDesc) adminWelcomeDesc.textContent = `Chế độ Biên tập viên: Tiếp nhận, xem tệp và kiểm duyệt bài viết. (Các phân hệ Báo cáo thi đua & Quản trị dữ liệu chỉ hiển thị với mã PIN Tổng Quản Trị).`;
    }

    initDashboard();
  } else {
    pinScreen.style.display = "flex";
    dashboard.style.display = "none";
    btnLogout.style.display = "none";
    const pinInput = document.getElementById("pinInput");
    if (pinInput) {
      pinInput.value = "";
      pinInput.focus();
    }
  }
}

function handlePinSubmit(e) {
  e.preventDefault();
  const inputPin = document.getElementById("pinInput").value.trim();
  const validPin = CONFIG.ADMIN_PIN || "mdc2026";
  const superPin = CONFIG.SUPER_ADMIN_PIN || "tinmdc2026";

  if (inputPin === superPin) {
    isAuthenticated = true;
    currentUserRole = "superadmin";
    currentUserTitle = "Thầy Nguyễn Hồ Trọng Tín (Super Admin)";
    logAudit("Đăng nhập hệ thống", "Đăng nhập với quyền Tổng Quản Trị Hệ Thống (Super Admin)", "-");
    document.getElementById("pinError").style.display = "none";
    checkAuth();
  } else if (inputPin === validPin) {
    isAuthenticated = true;
    currentUserRole = "reviewer";
    currentUserTitle = "Thành viên Ban Truyền Thông (BTT)";
    logAudit("Đăng nhập hệ thống", "Đăng nhập với quyền Biên tập viên BTT", "-");
    document.getElementById("pinError").style.display = "none";
    checkAuth();
  } else {
    document.getElementById("pinError").style.display = "block";
    document.getElementById("pinInput").value = "";
    document.getElementById("pinInput").focus();
  }
}

function logoutAdmin() {
  isAuthenticated = false;
  currentUserRole = "reviewer";
  sessionStorage.removeItem("btt_admin_authenticated");
  localStorage.removeItem("btt_admin_authenticated");
  checkAuth();
}

/**
 * 2. Khởi tạo Dashboard & Lấy dữ liệu
 */
function initDashboard() {
  populateHandlerFilter();
  fetchTickets();
}

function populateHandlerFilter() {
  const select = document.getElementById("filterHandler");
  select.innerHTML = '<option value="">Tất cả người duyệt</option>';
  
  const reviewers = CONFIG.BTT_REVIEWERS || [];
  reviewers.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
}

/**
 * 3. Tải danh sách bài viết từ Google Apps Script API
 */
async function fetchTickets(isManualRefresh = false) {
  const loading = document.getElementById("loadingIndicator");
  const table = document.getElementById("ticketsTable");
  const emptyState = document.getElementById("emptyState");

  if (!isManualRefresh) {
    loading.style.display = "block";
    table.style.display = "none";
    emptyState.style.display = "none";
  }

  try {
    const url = `${CONFIG.API_ENDPOINT}?action=getTickets&_t=${Date.now()}`;
    const response = await fetch(url);
    const data = await response.json();

    loading.style.display = "none";

    if (data.success && data.tickets) {
      allTickets = data.tickets;
      updateMetrics();
      filterTickets();
      if (isManualRefresh) {
        alert("Đã làm mới dữ liệu thành công!");
      }
    } else {
      loading.style.display = "none";
      emptyState.style.display = "block";
    }
  } catch (error) {
    loading.style.display = "none";
    console.error("Lỗi tải bài viết:", error);
    alert("Không thể tải danh sách bài viết từ Google Sheets: " + error.message);
  }
}

/**
 * 4. Cập nhật các số liệu thống kê
 */
function updateMetrics() {
  const total = allTickets.length;
  const received = allTickets.filter(t => 
    t.status.includes("MỚI NHẬN") || t.status.includes("PHÂN CÔNG") || t.status.includes("ĐANG DUYỆT")
  ).length;
  const revision = allTickets.filter(t => t.status.includes("YÊU CẦU")).length;
  const approved = allTickets.filter(t => 
    t.status.includes("ĐÃ DUYỆT") || t.status.includes("ĐÃ ĐĂNG") || t.status.includes("ĐÃ LÊN LỊCH")
  ).length;

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statReceived").textContent = received;
  document.getElementById("statRevision").textContent = revision;
  document.getElementById("statApproved").textContent = approved;
}

/**
 * 5. Bộ lọc và tìm kiếm bài viết
 */
function filterTickets() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  const statusFilter = document.getElementById("filterStatus").value;
  const handlerFilter = document.getElementById("filterHandler").value;

  const filtered = allTickets.filter(item => {
    // Tìm kiếm text
    const matchQuery = !query || 
      item.code.toLowerCase().includes(query) ||
      item.eventName.toLowerCase().includes(query) ||
      item.submitter.toLowerCase().includes(query) ||
      item.dept.toLowerCase().includes(query);

    // Lọc trạng thái
    const matchStatus = !statusFilter || item.status.includes(statusFilter);

    // Lọc người duyệt
    const matchHandler = !handlerFilter || item.handler === handlerFilter;

    return matchQuery && matchStatus && matchHandler;
  });

  renderTable(filtered);
}

/**
 * 6. Vẽ bảng dữ liệu
 */
function renderTable(tickets) {
  const table = document.getElementById("ticketsTable");
  const emptyState = document.getElementById("emptyState");
  const tbody = document.getElementById("ticketsTbody");

  tbody.innerHTML = "";

  if (tickets.length === 0) {
    table.style.display = "none";
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";
  table.style.display = "table";

  tickets.forEach(t => {
    const tr = document.createElement("tr");

    // Lớp màu badge trạng thái
    const badgeClass = getBadgeClass(t.status);

    // Cảnh báo lần sửa
    let revBadge = `<span class="badge-rev">${t.revisionCount}</span>`;
    if (t.revisionCount > 2) {
      revBadge = `<span class="badge-rev rev-warning" title="Cảnh báo: Sửa quá 2 lần!">${t.revisionCount} ⚠️</span>`;
    }

    const hasDrive = t.driveFolder && t.driveFolder.startsWith("http");
    const isSuper = currentUserRole === "superadmin";

    tr.innerHTML = `
      <td><span class="table-ticket-code">${t.code}</span></td>
      <td class="text-muted text-sm">${t.timestamp}</td>
      <td>
        <div class="dept-cell">
          <strong>${t.dept}</strong>
          <span class="text-sm text-muted">${t.submitter}</span>
        </div>
      </td>
      <td><div class="event-title-cell" title="${t.eventName}">${t.eventName}</div></td>
      <td><span class="handler-tag">${t.handler || "<em>Chưa phân công</em>"}</span></td>
      <td><span class="status-badge ${badgeClass}">${t.status}</span></td>
      <td style="text-align: center;">${revBadge}</td>
      <td>
        <div class="table-actions-cell">
          <button type="button" class="btn-action-review" onclick="openReviewModal('${t.code}')" title="Xem chi tiết & kiểm duyệt">
            Kiểm duyệt ➔
          </button>
          ${hasDrive ? `
            <a href="${t.driveFolder}" target="_blank" class="btn-action-drive" title="Mở nhanh thư mục Google Drive của bài này">
              📁 Drive
            </a>
          ` : ""}
          ${isSuper ? `
            <button type="button" class="btn-action-delete" onclick="handleSuperAdminDelete('${t.code}')" title="Đặc quyền Super Admin: Xóa/Hủy bài">
              🗑️
            </button>
          ` : ""}
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function getBadgeClass(status) {
  if (status.includes("MỚI NHẬN")) return "badge-blue";
  if (status.includes("PHÂN CÔNG")) return "badge-purple";
  if (status.includes("ĐANG DUYỆT")) return "badge-yellow";
  if (status.includes("YÊU CẦU")) return "badge-red";
  if (status.includes("ĐÃ SỬA")) return "badge-orange";
  if (status.includes("ĐÃ DUYỆT")) return "badge-teal";
  if (status.includes("ĐÃ LÊN LỊCH")) return "badge-indigo";
  if (status.includes("ĐÃ ĐĂNG")) return "badge-green";
  return "badge-gray";
}

/**
 * 7. Mở Modal Kiểm Duyệt Chi Tiết
 */
function openReviewModal(ticketCode) {
  activeTicket = allTickets.find(t => t.code === ticketCode);
  if (!activeTicket) return;

  document.getElementById("modalTicketCode").textContent = activeTicket.code;
  document.getElementById("modalEventName").textContent = activeTicket.eventName;
  document.getElementById("infoDept").textContent = activeTicket.dept;
  document.getElementById("infoSubmitter").textContent = activeTicket.submitter;
  document.getElementById("infoContact").textContent = `${activeTicket.phone || "Không có SĐT"} • ${activeTicket.email || "Không có email"}`;
  document.getElementById("infoCategory").textContent = activeTicket.category;
  document.getElementById("infoTimestamp").textContent = activeTicket.timestamp;
  document.getElementById("infoCaption").value = activeTicket.caption;

  // Link Drive
  const driveLink = document.getElementById("linkDriveFolder");
  if (activeTicket.driveFolder && activeTicket.driveFolder.startsWith("http")) {
    driveLink.href = activeTicket.driveFolder;
    driveLink.style.display = "inline-flex";
  } else {
    driveLink.style.display = "none";
  }

  // Điền dropdown người duyệt
  const handlerSelect = document.getElementById("updateHandler");
  handlerSelect.innerHTML = '<option value="">-- Chưa phân công --</option>';
  (CONFIG.BTT_REVIEWERS || []).forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    if (activeTicket.handler === name) opt.selected = true;
    handlerSelect.appendChild(opt);
  });

  // Trạng thái hiện tại (chuẩn hóa để khớp option kể cả bài cũ mang ký hiệu số ①②③)
  const statusSelect = document.getElementById("updateStatus");
  const rawStatus = activeTicket.status || "";
  const cleanStatus = rawStatus.replace(/^[①②③④⑤⑥⑦⑧⑨\s\d.-]+/, "").trim();
  const matchedOpt = Array.from(statusSelect.options).find(opt => 
    opt.value === rawStatus || opt.value === cleanStatus || rawStatus.includes(opt.value) || opt.value.includes(cleanStatus)
  );
  if (matchedOpt) {
    statusSelect.value = matchedOpt.value;
  } else {
    statusSelect.value = rawStatus;
  }
  document.getElementById("updateFeedback").value = activeTicket.feedback || "";
  document.getElementById("updateChannel").value = activeTicket.channel || "Fanpage THPT Mạc Đĩnh Chi";
  document.getElementById("updatePostUrl").value = activeTicket.postUrl || "";

  // Cấu hình hiển thị email người nộp & hộp gửi email
  const chkSendEmail = document.getElementById("chkSendEmail");
  const btnSendDirectEmail = document.getElementById("btnSendDirectEmail");
  const previewEmail = document.getElementById("previewSubmitterEmail");

  if (activeTicket.email && activeTicket.email.includes("@")) {
    previewEmail.textContent = `${activeTicket.email} (${activeTicket.submitter})`;
    if (chkSendEmail) {
      chkSendEmail.disabled = false;
      chkSendEmail.checked = true;
    }
    if (btnSendDirectEmail) btnSendDirectEmail.disabled = false;
  } else {
    previewEmail.textContent = "Bài này không có địa chỉ email";
    if (chkSendEmail) {
      chkSendEmail.disabled = true;
      chkSendEmail.checked = false;
    }
    if (btnSendDirectEmail) btnSendDirectEmail.disabled = true;
  }

  // Cảnh báo lần sửa
  const revAlert = document.getElementById("revisionAlert");
  const revNum = document.getElementById("revCountNum");
  if (activeTicket.revisionCount > 2) {
    revNum.textContent = activeTicket.revisionCount;
    revAlert.style.display = "block";
  } else {
    revAlert.style.display = "none";
  }

  document.getElementById("reviewModal").style.display = "flex";
}

function closeReviewModal() {
  document.getElementById("reviewModal").style.display = "none";
  activeTicket = null;
}

function copyCaptionText() {
  const text = document.getElementById("infoCaption").value;
  navigator.clipboard.writeText(text).then(() => {
    alert("Đã sao chép nội dung caption!");
  });
}

function handleStatusChangeInModal() {
  const status = document.getElementById("updateStatus").value;
  const feedbackInput = document.getElementById("updateFeedback");
  const chkSendEmail = document.getElementById("chkSendEmail");

  // Tự động tích chọn gửi email khi đổi trạng thái
  if (chkSendEmail && !chkSendEmail.disabled) {
    chkSendEmail.checked = true;
  }

  if (status.includes("YÊU CẦU") && !feedbackInput.value) {
    feedbackInput.placeholder = "⚠️ BẮT BUỘC: Vui lòng ghi rõ các điểm cần sửa để gửi thông báo cho người nộp...";
    feedbackInput.focus();
  }
}

/**
 * 8. Gửi cập nhật kiểm duyệt lên Google Apps Script
 */
async function handleUpdateTicket(e) {
  e.preventDefault();
  if (!activeTicket) return;

  const btnSave = document.getElementById("btnSaveUpdate");
  const btnText = document.getElementById("btnSaveText");
  const spinner = document.getElementById("saveSpinner");

  btnSave.disabled = true;
  btnText.textContent = "Đang lưu lên Google Sheets...";
  spinner.style.display = "inline-block";

  const newStatus = document.getElementById("updateStatus").value;
  const newHandler = document.getElementById("updateHandler").value;
  const newFeedback = document.getElementById("updateFeedback").value.trim();
  const newChannel = document.getElementById("updateChannel").value.trim();
  const newPostUrl = document.getElementById("updatePostUrl").value.trim();
  const chkSendEmail = document.getElementById("chkSendEmail");
  const shouldSendEmail = chkSendEmail ? chkSendEmail.checked : false;

  const payload = {
    action: "updateTicket",
    ticketCode: activeTicket.code,
    status: newStatus,
    handler: newHandler,
    feedback: newFeedback,
    channel: newChannel,
    postUrl: newPostUrl,
    sendEmail: shouldSendEmail,
    adminUser: newHandler || "Thành viên BTT"
  };

  try {
    const response = await fetch(CONFIG.API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    btnSave.disabled = false;
    btnText.textContent = "LƯU CẬP NHẬT DỮ LIỆU";
    spinner.style.display = "none";

    if (result.success) {
      const updatedCode = activeTicket.code;

      // Cập nhật mảng local
      activeTicket.status = newStatus;
      activeTicket.handler = newHandler;
      activeTicket.feedback = newFeedback;
      activeTicket.channel = newChannel;
      activeTicket.postUrl = newPostUrl;

      // Cập nhật trong allTickets
      const item = allTickets.find(t => t.code === updatedCode);
      if (item) {
        item.status = newStatus;
        item.handler = newHandler;
        item.feedback = newFeedback;
        item.channel = newChannel;
        item.postUrl = newPostUrl;
      }

      closeReviewModal();
      updateMetrics();
      filterTickets();

      // Ghi nhận nhật ký kiểm toán & làm mới view nếu đang ở tab khác
      logAudit("Cập nhật bài viết", `Đổi trạng thái sang [${newStatus}] - Phân công: [${newHandler || "Chưa phân công"}]`, updatedCode);
      if (currentAdminTab === "analytics") renderAnalyticsView();
      if (currentAdminTab === "team") renderTeamView();

      let msg = `✅ Đã cập nhật bài viết [${updatedCode}] thành công và đồng bộ về Google Sheets!`;
      if (result.data && result.data.emailSent) {
        msg += `\n\n📧 Đã tự động gửi email thông báo tới: ${result.data.recipientEmail}`;
      } else if (result.data && result.data.emailReason) {
        msg += `\n\n⚠️ Lưu ý: Chưa gửi được email (${result.data.emailReason})`;
      }
      alert(msg);
    } else {
      alert("Lỗi cập nhật: " + (result.message || "Không rõ nguyên nhân"));
    }
  } catch (error) {
    btnSave.disabled = false;
    btnText.textContent = "LƯU CẬP NHẬT DỮ LIỆU";
    spinner.style.display = "none";
    console.error("Lỗi:", error);
    alert("Không thể kết nối đến máy chủ: " + error.message);
  }
}

/**
 * 9. Gửi Email thông báo trực tiếp tức thì từ Web Admin
 */
async function handleSendDirectEmail() {
  if (!activeTicket) return;
  if (!activeTicket.email || !activeTicket.email.includes("@")) {
    alert("Bài viết này không có địa chỉ email người nộp hợp lệ!");
    return;
  }

  const feedback = document.getElementById("updateFeedback").value.trim();
  const status = document.getElementById("updateStatus").value;
  const channel = document.getElementById("updateChannel").value.trim();
  const postUrl = document.getElementById("updatePostUrl").value.trim();

  const confirmSend = confirm(
    `Bạn có chắc chắn muốn gửi email thông báo trực tiếp tới:\n👉 ${activeTicket.email} (${activeTicket.submitter})?\n\n` +
    `Nội dung phản hồi: "${feedback || '(Thông báo cập nhật tiến độ bài viết)'}"`
  );
  if (!confirmSend) return;

  const btn = document.getElementById("btnSendDirectEmail");
  const origText = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = "⏳ Đang gửi email...";

  const payload = {
    action: "sendNotificationEmail",
    ticketCode: activeTicket.code,
    status: status,
    feedback: feedback,
    channel: channel,
    postUrl: postUrl,
    adminUser: document.getElementById("updateHandler").value || "Ban Quản Trị BTT"
  };

  try {
    const response = await fetch(CONFIG.API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    btn.disabled = false;
    btn.innerHTML = origText;

    if (result.success) {
      logAudit("Gửi email trực tiếp", `Gửi email thông báo cho ${activeTicket.email} (${activeTicket.submitter})`, activeTicket.code);
      alert(`✅ Đã gửi email thông báo thành công tới:\n${activeTicket.email}!`);
    } else {
      alert(`❌ Không thể gửi email: ${result.message || "Lỗi không xác định"}`);
    }
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = origText;
    console.error("Lỗi gửi email trực tiếp:", err);
    alert("Không thể kết nối đến máy chủ: " + err.message);
  }
}

/**
 * ==========================================================================
 * PHÂN HỆ SUPER ADMIN: CHUYỂN TAB, BÁO CÁO THI ĐUA, TEAM WORKLOAD & AUDIT
 * ==========================================================================
 */

/**
 * 10. Chuyển đổi giữa các phân hệ quản trị
 */
function switchAdminTab(tabName) {
  // Kiểm tra quyền: nếu không phải Super Admin thì chặn các tab nâng cao
  if (tabName !== "tickets" && currentUserRole !== "superadmin") {
    alert("⛔ Quyền truy cập bị từ chối!\nPhân hệ này dành riêng cho TỔNG QUẢN TRỊ (SUPER ADMIN).\nVui lòng đăng nhập với mã PIN Super Admin hoặc bấm nút 'Mở khóa Super Admin' trên thanh điều hướng.");
    return;
  }

  currentAdminTab = tabName;

  // Cập nhật trạng thái nút tab
  document.querySelectorAll(".admin-tab-pill").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".admin-tab-view").forEach(v => v.style.display = "none");

  if (tabName === "tickets") {
    const btn = document.getElementById("tabBtnTickets");
    if (btn) btn.classList.add("active");
    const view = document.getElementById("viewTickets");
    if (view) view.style.display = "block";
  } else if (tabName === "analytics") {
    const btn = document.getElementById("tabBtnAnalytics");
    if (btn) btn.classList.add("active");
    const view = document.getElementById("viewAnalytics");
    if (view) view.style.display = "block";
    renderAnalyticsView();
  } else if (tabName === "team") {
    const btn = document.getElementById("tabBtnTeam");
    if (btn) btn.classList.add("active");
    const view = document.getElementById("viewTeam");
    if (view) view.style.display = "block";
    renderTeamView();
  } else if (tabName === "audit") {
    const btn = document.getElementById("tabBtnAudit");
    if (btn) btn.classList.add("active");
    const view = document.getElementById("viewAudit");
    if (view) view.style.display = "block";
    renderAuditView();
  }
}

/**
 * Nâng quyền Super Admin trực tiếp từ giao diện
 */
function promptUpgradeSuperAdmin() {
  const pin = prompt("🔐 Vui lòng nhập mã PIN Tổng Quản Trị (Super Admin) để mở khóa toàn bộ phân hệ:");
  if (!pin) return;
  const superPin = CONFIG.SUPER_ADMIN_PIN || "tinmdc2026";
  if (pin.trim() === superPin) {
    currentUserRole = "superadmin";
    currentUserTitle = "Thầy Nguyễn Hồ Trọng Tín (Super Admin)";
    logAudit("Nâng quyền Super Admin", "Đã xác thực mã PIN nâng quyền Tổng Quản Trị thành công", "-");
    alert("🎉 Xác thực thành công! Đã kích hoạt chế độ TỔNG QUẢN TRỊ (SUPER ADMIN). Toàn bộ phân hệ đã được mở khóa!");
    checkAuth();
  } else {
    alert("❌ Mã PIN Super Admin không chính xác. Quyền truy cập bị từ chối!");
  }
}

/**
 * Đặc quyền Super Admin: Xóa/Hủy bài viết
 */
function handleSuperAdminDelete(ticketCode) {
  if (currentUserRole !== "superadmin") {
    alert("Chỉ Tổng Quản Trị mới có quyền thực hiện thao tác này!");
    return;
  }

  const confirmDel = confirm(`⚠️ CẢNH BÁO ĐẶC QUYỀN SUPER ADMIN:\nThầy có chắc chắn muốn hủy / xóa bài viết [${ticketCode}] khỏi danh sách hiển thị không?`);
  if (!confirmDel) return;

  allTickets = allTickets.filter(t => t.code !== ticketCode);
  updateMetrics();
  filterTickets();
  logAudit("Hủy bài viết (Super Admin)", `Đã xóa bài viết [${ticketCode}] khỏi hệ thống`, ticketCode);
  alert(`✅ Đã xóa bài viết [${ticketCode}] thành công!`);
}

/**
 * Danh sách đầy đủ các Tổ Chuyên Môn & CLB của THPT Mạc Đĩnh Chi
 */
const ALL_MDC_DEPTS = [
  "Tổ Toán", "Tổ Vật lí", "Tổ Hóa học", "Tổ Ngữ Văn", "Tổ Tiếng Anh",
  "Tổ Lịch Sử", "Tổ Địa lí", "Tổ GDKT&PL", "Tổ Công nghệ", "Tổ GDTC - GDQP&AN",
  "Tổ Sinh học", "Tổ Tin học", "Nhóm HĐTNHN - GDĐP", "Chi bộ", "Công đoàn",
  "Đoàn trường", "Chi đoàn Giáo viên", "GVCN", "Văn phòng", "Phòng Giám thị",
  "CLB Khoa học – Khởi nghiệp", "CLB Truyền thông", "CLB Văn nghệ - Cổ động",
  "CLB Tiếng Anh", "CLB Văn học – Diễn thuyết và Kịch", "CLB Kỹ năng sống", "CLB Hội họa"
];

/**
 * 11. Báo Cáo & Xếp Hạng Thi Đua Tổ Bộ Môn
 */
function renderAnalyticsView() {
  if (!allTickets) return;

  const total = allTickets.length;
  const deptStats = {};

  // Khởi tạo tất cả tổ bộ môn
  ALL_MDC_DEPTS.forEach(dept => {
    deptStats[dept] = { total: 0, approved: 0, pending: 0, revision: 0 };
  });

  // Gom dữ liệu từ các bài nộp
  allTickets.forEach(t => {
    const dept = t.dept || "Khác";
    if (!deptStats[dept]) {
      deptStats[dept] = { total: 0, approved: 0, pending: 0, revision: 0 };
    }
    deptStats[dept].total++;

    const status = (t.status || "").toUpperCase();
    if (status.includes("ĐÃ DUYỆT") || status.includes("ĐÃ ĐĂNG") || status.includes("ĐÃ LÊN LỊCH")) {
      deptStats[dept].approved++;
    } else if (status.includes("YÊU CẦU")) {
      deptStats[dept].revision++;
    } else {
      deptStats[dept].pending++;
    }
  });

  // Chuyển sang mảng và sắp xếp giảm dần theo tổng bài nộp
  const sortedDepts = Object.keys(deptStats).map(dept => ({
    dept: dept,
    ...deptStats[dept]
  })).sort((a, b) => b.total - a.total);

  // Tính các chỉ số KPI
  const topDept = sortedDepts[0] && sortedDepts[0].total > 0 ? sortedDepts[0] : null;
  const totalApproved = allTickets.filter(t => 
    t.status.includes("ĐÃ DUYỆT") || t.status.includes("ĐÃ ĐĂNG") || t.status.includes("ĐÃ LÊN LỊCH")
  ).length;
  const totalRevision = allTickets.filter(t => t.status.includes("YÊU CẦU")).length;
  const activeCount = sortedDepts.filter(d => d.total > 0).length;

  const approvalRate = total > 0 ? Math.round((totalApproved / total) * 100) : 0;
  const revisionRate = total > 0 ? Math.round((totalRevision / total) * 100) : 0;

  // Cập nhật thẻ KPI
  const topDeptEl = document.getElementById("kpiTopDept");
  const topDeptCountEl = document.getElementById("kpiTopDeptCount");
  if (topDeptEl && topDept) {
    topDeptEl.textContent = topDept.dept;
    topDeptCountEl.textContent = `${topDept.total} bài viết đã nộp`;
  }
  document.getElementById("kpiApprovalRate").textContent = `${approvalRate}%`;
  document.getElementById("kpiRevisionRate").textContent = `${revisionRate}%`;
  document.getElementById("kpiActiveDepts").textContent = `${activeCount} / ${ALL_MDC_DEPTS.length}`;

  // Vẽ bảng xếp hạng
  const tbody = document.getElementById("rankingTbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const maxTotal = topDept && topDept.total > 0 ? topDept.total : 1;

  sortedDepts.forEach((item, index) => {
    const tr = document.createElement("tr");

    // Huy chương Top 3
    let rankBadge = `<span class="rank-num">${index + 1}</span>`;
    if (index === 0 && item.total > 0) rankBadge = `<span class="rank-medal gold">🥇 1</span>`;
    else if (index === 1 && item.total > 0) rankBadge = `<span class="rank-medal silver">🥈 2</span>`;
    else if (index === 2 && item.total > 0) rankBadge = `<span class="rank-medal bronze">🥉 3</span>`;

    // Thanh tỷ trọng %
    const percent = Math.round((item.total / maxTotal) * 100);

    // Đánh giá thi đua
    let evalBadge = `<span class="badge-eval badge-gray">Chưa nộp bài</span>`;
    if (item.total >= 3) {
      evalBadge = `<span class="badge-eval badge-green">🌟 Dẫn đầu thi đua</span>`;
    } else if (item.total >= 1) {
      evalBadge = `<span class="badge-eval badge-blue">👍 Tích cực đóng góp</span>`;
    }

    tr.innerHTML = `
      <td style="text-align: center;">${rankBadge}</td>
      <td><strong>${item.dept}</strong></td>
      <td style="text-align: center;"><span class="count-badge count-total">${item.total}</span></td>
      <td style="text-align: center;"><span class="count-badge count-approved">${item.approved}</span></td>
      <td style="text-align: center;"><span class="count-badge count-pending">${item.pending}</span></td>
      <td style="text-align: center;"><span class="count-badge count-revision">${item.revision}</span></td>
      <td>
        <div class="progress-bar-wrap">
          <div class="progress-bar-bar" style="width: ${percent}%;"></div>
          <span class="progress-bar-text">${percent}%</span>
        </div>
      </td>
      <td style="text-align: center;">${evalBadge}</td>
    `;
    tbody.appendChild(tr);
  });
}

/**
 * 12. Xuất dữ liệu báo cáo ra file Excel (CSV chuẩn UTF-8)
 */
function exportTicketsToCSV() {
  if (!allTickets || allTickets.length === 0) {
    alert("Không có dữ liệu bài viết để xuất báo cáo!");
    return;
  }

  const headers = ["Mã bài", "Ngày tiếp nhận", "Tổ / Đơn vị", "Người nộp", "SĐT", "Email", "Tên sự kiện", "Phân loại", "Người duyệt", "Trạng thái", "Lần sửa", "Link Drive"];
  const rows = allTickets.map(t => [
    `"${t.code || ""}"`,
    `"${t.timestamp || ""}"`,
    `"${(t.dept || "").replace(/"/g, '""')}"`,
    `"${(t.submitter || "").replace(/"/g, '""')}"`,
    `"${t.phone || ""}"`,
    `"${t.email || ""}"`,
    `"${(t.eventName || "").replace(/"/g, '""')}"`,
    `"${(t.category || "").replace(/"/g, '""')}"`,
    `"${(t.handler || "Chưa phân công").replace(/"/g, '""')}"`,
    `"${(t.status || "").replace(/"/g, '""')}"`,
    `"${t.revisionCount || 0}"`,
    `"${t.driveFolder || ""}"`
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(r => r.join(","))].join("\r\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  a.href = url;
  a.download = `BaoCao_TruyenThong_THPT_MacDinhChi_${dateStr}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  logAudit("Xuất báo cáo", "Đã xuất file báo cáo Excel (CSV) toàn trường", "-");
}

/**
 * 13. In Báo Cáo / Xuất PDF
 */
function printAnalyticsReport() {
  window.print();
}

/**
 * 14. Quản lý Đội Ngũ Kiểm Duyệt & Cân Bằng Tải Phân Công (Workload)
 */
function renderTeamView() {
  const container = document.getElementById("teamGrid");
  if (!container) return;
  container.innerHTML = "";

  const reviewers = CONFIG.BTT_REVIEWERS || [];

  reviewers.forEach(name => {
    // Đếm số bài đang phụ trách
    const assignedTickets = allTickets.filter(t => t.handler === name);
    const pendingTickets = assignedTickets.filter(t => !t.status.includes("ĐÃ ĐĂNG") && !t.status.includes("ĐÃ DUYỆT"));
    const doneTickets = assignedTickets.filter(t => t.status.includes("ĐÃ ĐĂNG") || t.status.includes("ĐÃ DUYỆT"));

    // Tình trạng tải công việc
    let loadStatus = "Rảnh rỗi";
    let loadClass = "load-free";
    if (pendingTickets.length >= 3) {
      loadStatus = "Tải cao (Nhiều bài chờ)";
      loadClass = "load-heavy";
    } else if (pendingTickets.length > 0) {
      loadStatus = "Đang thụ lý bài";
      loadClass = "load-normal";
    }

    const card = document.createElement("div");
    card.className = "team-card";
    card.innerHTML = `
      <div class="team-card-header">
        <div class="team-avatar">👨‍🏫</div>
        <div class="team-meta">
          <h4 class="team-name">${name}</h4>
          <span class="team-load-badge ${loadClass}">${loadStatus}</span>
        </div>
      </div>
      <div class="team-card-body">
        <div class="team-stat-row">
          <span>Đang thụ lý / Chờ duyệt:</span>
          <strong>${pendingTickets.length} bài</strong>
        </div>
        <div class="team-stat-row">
          <span>Đã hoàn tất kiểm duyệt:</span>
          <strong>${doneTickets.length} bài</strong>
        </div>
        <div class="team-stat-row">
          <span>Tổng số bài tiếp nhận:</span>
          <strong>${assignedTickets.length} bài</strong>
        </div>
      </div>
      <div class="team-card-footer">
        <button type="button" class="btn-filter-reviewer" onclick="filterByReviewer('${name}')">
          🔍 Xem bài của Thầy/Cô này
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function filterByReviewer(reviewerName) {
  switchAdminTab("tickets");
  const select = document.getElementById("filterHandler");
  if (select) {
    select.value = reviewerName;
    filterTickets();
  }
}

/**
 * 15. Hệ Thống Ghi Nhật Ký Thao Tác (Audit Log) & Sao Lưu Dữ Liệu (Backup)
 */
function getAuditLogs() {
  try {
    const raw = localStorage.getItem("btt_audit_logs");
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn("Lỗi đọc audit log:", e);
  }

  // Dữ liệu nhật ký mẫu ban đầu nếu chưa có
  return [
    {
      id: "LOG-001",
      time: "2026-09-24 16:30",
      user: "Thầy Tín (Super Admin)",
      action: "Khởi động hệ thống",
      ticketCode: "-",
      details: "Đồng bộ cơ sở dữ liệu Master Tracker thành công"
    },
    {
      id: "LOG-002",
      time: "2026-09-24 16:45",
      user: "Thầy Đoàn Huỳnh Xuân Tưởng",
      action: "Kiểm duyệt bài viết",
      ticketCode: "TT-2026-0005",
      details: "Chuyển trạng thái sang [ĐÃ LÊN LỊCH]"
    }
  ];
}

function logAudit(action, details, ticketCode = "-") {
  const logs = getAuditLogs();
  const now = new Date();
  const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newLog = {
    id: `LOG-${Date.now().toString().slice(-4)}`,
    time: timeStr,
    user: currentUserTitle || "Ban Quản Trị",
    action: action,
    ticketCode: ticketCode,
    details: details
  };

  logs.unshift(newLog);
  // Giữ tối đa 60 log gần nhất
  if (logs.length > 60) logs.pop();

  try {
    localStorage.setItem("btt_audit_logs", JSON.stringify(logs));
  } catch (e) {
    console.warn("Lỗi lưu audit log:", e);
  }
}

function renderAuditView() {
  const tbody = document.getElementById("auditTbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  const logs = getAuditLogs();
  logs.forEach(log => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="text-sm text-muted">${log.time}</td>
      <td><strong>${log.user}</strong></td>
      <td><span class="audit-action-tag">${log.action}</span></td>
      <td><span class="table-ticket-code">${log.ticketCode}</span></td>
      <td class="text-sm">${log.details}</td>
    `;
    tbody.appendChild(tr);
  });
}

function clearAuditLogs() {
  if (confirm("Thầy có chắc chắn muốn xóa toàn bộ lịch sử nhật ký thao tác không?")) {
    localStorage.removeItem("btt_audit_logs");
    renderAuditView();
  }
}

/**
 * 16. Tải toàn bộ cơ sở dữ liệu dự phòng ra file JSON (1-Click Data Backup)
 */
function exportDatabaseJSON() {
  if (!allTickets || allTickets.length === 0) {
    alert("Không có dữ liệu bài viết để sao lưu!");
    return;
  }

  const backupData = {
    exportedAt: new Date().toISOString(),
    school: CONFIG.SCHOOL_NAME || "THPT Mạc Đĩnh Chi",
    academicYear: CONFIG.ACADEMIC_YEAR || "2026 - 2027",
    superAdmin: "Thầy Nguyễn Hồ Trọng Tín",
    totalTickets: allTickets.length,
    tickets: allTickets,
    auditLogs: getAuditLogs()
  };

  const jsonStr = JSON.stringify(backupData, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  a.href = url;
  a.download = `BTT_MDC_Master_Database_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  logAudit("Sao lưu dữ liệu", "Đã tải snapshot cơ sở dữ liệu dự phòng (JSON)", "-");
  alert("✅ Đã xuất và tải bản sao lưu cơ sở dữ liệu dự phòng (JSON) về máy tính thành công!");
}
