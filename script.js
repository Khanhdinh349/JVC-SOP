// === 🧠 Ngôn ngữ ===
function getLang() {
  const params = new URLSearchParams(window.location.search);
  return params.get("lang") || localStorage.getItem("lang") || "vi";
}

function setLang(lang) {
  localStorage.setItem("lang", lang);
}

// === Trang chọn loại đăng ký (index.html) ===
const goBtn = document.getElementById("goBtn");
if (goBtn) {
  goBtn.addEventListener("click", () => {
    const lang = document.getElementById("language").value;
    const type = document.getElementById("userType").value;
    if (!type) {
      alert(lang === "vi" ? "Vui lòng chọn loại đăng ký" : "Please select a registration type");
      return;
    }
    setLang(lang);
    window.location.href = `${type}.html?lang=${lang}`;
  });
}

// === Tự động cập nhật giờ VN (UTC+7) ===
function setVietnamTime() {
  const now = new Date();
  const vietnamOffset = 7 * 60;
  const localOffset = now.getTimezoneOffset();
  const vietnamTime = new Date(now.getTime() + (vietnamOffset + localOffset) * 60000);

  const dateInput = document.getElementById("visitDate");
  const timeInput = document.getElementById("visitTime");
  if (dateInput && timeInput) {
    const yyyy = vietnamTime.getFullYear();
    const mm = String(vietnamTime.getMonth() + 1).padStart(2, "0");
    const dd = String(vietnamTime.getDate()).padStart(2, "0");
    dateInput.value = `${yyyy}-${mm}-${dd}`;

    const hh = String(vietnamTime.getHours()).padStart(2, "0");
    const mi = String(vietnamTime.getMinutes()).padStart(2, "0");
    timeInput.value = `${hh}:${mi}`;
  }
}

// === Dịch toàn bộ form ===
function translateForm(lang) {
  document.querySelectorAll("label[data-vi]").forEach((lbl) => {
    lbl.textContent = lbl.getAttribute(`data-${lang}`);
  });
  document.querySelectorAll("[data-ph-vi]").forEach((el) => {
    el.placeholder = el.getAttribute(`data-ph-${lang}`);
  });

  const title = document.getElementById("form-title");
  const submitBtn = document.getElementById("goBtn");
  if (title && submitBtn) {
    const map = {
      doitac: { vi: "Đăng Ký Đối Tác", en: "Partner Registration" },
      khach: { vi: "Đăng Ký Khách", en: "Guest Registration" },
      daily: { vi: "Đăng Ký Đại Lý", en: "Agency Registration" },
    };
    const page = window.location.pathname.split("/").pop().split(".")[0];
    if (map[page]) {
      title.textContent = map[page][lang];
    }
    submitBtn.textContent = lang === "vi" ? "Gửi đăng ký" : "Submit";
  }
}

// === Hiển thị thông báo thành công và chuyển hướng ===
function showSuccessAndRedirect(lang) {
  const successMessage = lang === "vi" ? "✅ Đăng ký thành công! Bạn sẽ được chuyển hướng." : "✅ Registration successful! You will be redirected.";
  
  // Logic Confetti (nếu thư viện canvas-confetti.js được nhúng trong HTML)
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  } 

  // Hiển thị thông báo thành công
  alert(successMessage);
  
  // Chuyển hướng về trang index.html
  setTimeout(() => {
    window.location.href = `index.html?lang=${lang}`;
  }, 100); 
}

// === Thu thập dữ liệu form cụ thể (ĐÃ TỐI ƯU HÓA SỬ DỤNG THUỘC TÍNH NAME) ===
function collectFormData(formId) {
    const data = {
        // Ghi lại thời gian hiện tại theo múi giờ Việt Nam
        timestamp: new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }),
    };

    // Định nghĩa ánh xạ, sử dụng thuộc tính 'name' để tìm kiếm phần tử và đặt key
    // THỨ TỰ CỦA CÁC KHÓA NÀY PHẢI KHỚP CHÍNH XÁC VỚI THỨ TỰ CÁC CỘT TRONG APPS SCRIPT
    const fieldMap = {
        "form-doitac": [
            { selector: '[name="fullName"]', name: 'fullName' },
            { selector: '[name="idNumber"]', name: 'idNumber' },
            { selector: '[name="phoneNumber"]', name: 'phoneNumber' },
            { selector: '[name="company"]', name: 'company' },
            { selector: '[name="recDepartment"]', name: 'recDepartment' },
            { selector: '[name="recStaff"]', name: 'recStaff' },
            { selector: '[name="visitDate"]', name: 'visitDate' },
            { selector: '[name="visitTime"]', name: 'visitTime' },
            { selector: '[name="notes"]', name: 'notes' }
        ],
        "form-khach": [
            { selector: '[name="fullName"]', name: 'fullName' },
            { selector: '[name="idNumber"]', name: 'idNumber' },
            { selector: '[name="phoneNumber"]', name: 'phoneNumber' },
            { selector: '[name="email"]', name: 'email' },
            { selector: '[name="visitDate"]', name: 'visitDate' },
            { selector: '[name="visitTime"]', name: 'visitTime' },
            { selector: '[name="notes"]', name: 'notes' }
        ],
        "form-daily": [
            { selector: '[name="agencyName"]', name: 'agencyName' },
            { selector: '[name="staffName"]', name: 'staffName' },
            { selector: '[name="idNumber"]', name: 'idNumber' },
            { selector: '[name="phoneNumber"]', name: 'phoneNumber' },
            { selector: '[name="visitDate"]', name: 'visitDate' },
            { selector: '[name="visitTime"]', name: 'visitTime' },
            { selector: '[name="notes"]', name: 'notes' }
        ]
    };
    
    // Lấy ID form hiện tại
    const currentFormMap = fieldMap[formId];
    if (!currentFormMap) return null;

    currentFormMap.forEach(field => {
        // TÌM KIẾM PHẦN TỬ BẰNG THUỘC TÍNH NAME ĐÃ CẬP NHẬT TRONG HTML
        const element = document.querySelector(`#${formId} ${field.selector}`);
        if (element) {
            data[field.name] = element.value;
        }
    });

    data.formType = formId.replace('form-', ''); // Thêm loại form (doitac, khach, daily)
    return data;
}

// !!! ĐÃ THAY THẾ URL BẰNG URL BẠN CUNG CẤP !!!
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyuDDY28hFBK6cBcnMnsAEhLTyn6-FrWkXoFf9dqnbM5ea7-xIaxY1E1m4CDQ3967hw/exec'; 

async function sendDataToSheet(formData, lang) {
    
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                // Quan trọng: Sử dụng text/plain để Apps Script có thể đọc JSON
                'Content-Type': 'text/plain;charset=utf-8' 
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.result === "success") {
            showSuccessAndRedirect(lang); // Hiển thị chúc mừng và chuyển hướng
        } else {
            // Lỗi Apps Script sẽ hiển thị tại đây
            alert(`Lỗi khi ghi dữ liệu: ${result.message}`);
        }
    } catch (error) {
        alert(`Lỗi kết nối máy chủ: ${error.message}`);
    }
}


// === Khi tải mỗi trang ===
window.addEventListener("DOMContentLoaded", () => {
  const lang = getLang();
  setVietnamTime();
  translateForm(lang);
});

// === Submit form (Gửi dữ liệu) ===
document.addEventListener("submit", (e) => {
    e.preventDefault();
    const lang = getLang();
    const formId = e.target.id; 

    // 1. Thu thập dữ liệu
    const formData = collectFormData(formId);

    if (formData) {
        // 2. Gửi dữ liệu đến Apps Script
        sendDataToSheet(formData, lang);
    } else {
        alert("Lỗi: Không tìm thấy form ID hợp lệ.");
    }
});