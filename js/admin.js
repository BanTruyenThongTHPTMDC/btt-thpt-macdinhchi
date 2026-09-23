/**
 * ==========================================================================
 * TRANG QUẢN TRỊ & KIỂM DUYỆT - BAN TRUYỀN THÔNG THPT MẠC ĐĨNH CHI
 * ==========================================================================
 */

let allTickets = [];
let activeTicket = null;
let isAuthenticated = false; // Lưu trong bộ nhớ RAM trang hiện tại, reset khi F5/tải lại

document.addEventListener("DOMContentLoaded", () => {
  // Xóa mọi dấu vết session cũ: đảm bảo mỗi lần tải lại trang đều phải nhập mã PIN
  sessionStorage.removeItem("btt_admin_authenticated");
  localStorage.removeItem("btt_admin_authenticated");
  checkAuth();
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

  if (inputPin === validPin) {
    isAuthenticated = true;
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
  const revision = allTickets.filter(t => t.status.includes("YÊU CẦU SỬA")).length;
  const approved = allTickets.filter(t => t.status.includes("ĐÃ DUYỆT") || t.status.includes("ĐÃ ĐĂNG")).length;

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
        <button type="button" class="btn-action-review" onclick="openReviewModal('${t.code}')">
          Kiểm duyệt ➔
        </button>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function getBadgeClass(status) {
  if (status.includes("MỚI NHẬN")) return "badge-blue";
  if (status.includes("PHÂN CÔNG")) return "badge-purple";
  if (status.includes("ĐANG DUYỆT")) return "badge-yellow";
  if (status.includes("YÊU CẦU SỬA")) return "badge-red";
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

  // Trạng thái hiện tại
  document.getElementById("updateStatus").value = activeTicket.status;
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

  if (status.includes("YÊU CẦU SỬA") && !feedbackInput.value) {
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
