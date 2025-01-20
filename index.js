import init from "./pkg/certificate_transparency_extension.js";

async function run() {
    await init();

    const homePage = document.getElementById("home-section");
    const startCheckButton = document.getElementById("start-check-button");
    const checkButton = document.getElementById("check-button");
    const resultContainer = document.getElementById("result-container");
    const resultText = document.getElementById("result");
    const historyContainer = document.getElementById("history-container");
    const historyList = document.getElementById("history-list");
    const clearButton = document.getElementById("clear-history");
    const popupContainer = document.querySelector('.popup-container');
    const menuItems = document.querySelectorAll('.menu li a');
    const settingsPage = document.getElementById('settings-section');
    const customizeInterface = document.getElementById('customize-interface');
    const manageAccess = document.getElementById('manage-access');
    const notifications = document.getElementById('notifications');
    const functionSettings = document.getElementById('function-settings');
    const language = document.getElementById('language');
    const personalData = document.getElementById('personal-data');
    const backupRestore = document.getElementById('backup-restore');
    const update = document.getElementById('update');
    const aboutPage = document.getElementById('about-container');

    // Xử lý menu navigation
    function handleMenuAction(action) {
        // Ẩn tất cả các container trước
        resultContainer.classList.add('hidden');
        historyList.parentElement.classList.add('hidden');
        popupContainer.classList.add('hidden');
        settingsPage.classList.add('hidden');
        aboutPage.classList.add('hidden');

        switch (action) {
            case 'home':
                // Hiển thị trang chủ

                popupContainer.style.display = 'none';
                homePage.style.display = 'block';
                settingsPage.style.display = 'none';
                aboutPage.style.display = 'none';
                break;

            case 'check':
                // Hiển thị popup và nút kiểm tra
                homePage.style.display = 'none';
                popupContainer.style.display = 'block';
                checkButton.style.display = 'block';
                resultContainer.style.display = 'block';
                // Ẩn phần lịch sử
                historyContainer.style.display = 'none';
                historyList.parentElement.classList.add('hidden');
                settingsPage.style.display = 'none';
                aboutPage.style.display = 'none';
                break;

            case 'history':
                // Hiển thị popup và phần lịch sử
                homePage.style.display = 'none';
                popupContainer.style.display = 'block';
                checkButton.style.display = 'none';
                resultContainer.style.display = 'none';
                settingsPage.style.display = 'none';
                aboutPage.style.display = 'none';
                historyContainer.style.display = 'block';
                historyList.parentElement.classList.remove('hidden');
                displayHistory();

                break;

            case 'settings':
                // Ẩn popup ở các trang khác
                popupContainer.style.display = 'none';
                homePage.style.display = 'none';
                aboutPage.style.display = 'none';
                // Hiển thị trang settings
                settingsPage.style.display = 'block';
                break;
            case 'about':
                // Ẩn popup ở các trang khác
                popupContainer.style.display = 'none';
                homePage.style.display = 'none';
                settingsPage.style.display = 'none';
                // Hiển thị trang about
                aboutPage.style.display = 'block';
                break;

            default:
                console.error('Unknown action:', action);
        }
    }

    if (startCheckButton) {
        startCheckButton.addEventListener('click', (event) => {
            event.preventDefault(); // Ngăn chặn hành động mặc định
            handleMenuAction('check'); // Chuyển đến phần kiểm tra chứng chỉ
        });
    }



    // Thêm event listeners cho menu
    menuItems.forEach(item => {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            const action = this.getAttribute('data-action');
            handleMenuAction(action);
        });
    });
    checkButton.addEventListener("click", async () => {
        const domain = prompt("Nhập địa chỉ website để kiểm tra (ví dụ: example.com):").trim();

        if (!domain) {
            alert("Bạn cần nhập một địa chỉ hợp lệ!");
            return;
        }

        if (!isValidDomain(domain)) {
            alert("Địa chỉ không hợp lệ! Vui lòng nhập đúng định dạng, ví dụ: example.com");
            return;
        }

        showResult("Đang kiểm tra...", "loading");

        try {
            // Kết nối API để kiểm tra chứng chỉ
            const response = await fetch(`https://api.certificatetransparency.dev/v1/check?domain=${domain}`);

            if (!response.ok) {
                throw new Error("Không thể kết nối đến API kiểm tra chứng chỉ.");
            }

            const data = await response.json();
            const isValid = data.status === "Valid";

            const statusText = isValid ? "Chứng chỉ hợp lệ!" : "Chứng chỉ không hợp lệ!";
            const statusClass = isValid ? "valid" : "invalid";

            // Hiển thị kết quả
            showResult(statusText, statusClass);

            // Lưu kết quả vào lịch sử
            saveToHistory(domain, statusText);

            // Hiển thị lịch sử mới
            displayHistory();
        } catch (error) {
            console.error("Lỗi khi kiểm tra chứng chỉ:", error);
            showResult("Lỗi khi kiểm tra chứng chỉ!", "invalid");
        }
    });

    function isValidDomain(domain) {
        const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;
        return domainRegex.test(domain);
    }

    function showResult(message, status) {
        resultText.textContent = message;
        resultText.className = status;
        resultContainer.classList.remove("hidden");
    }

    // Gọi hàm lưu vào lịch sử khi kiểm tra thành công
    function saveToHistory(domain, result) {
        const history = JSON.parse(localStorage.getItem("certHistory")) || []; // Lấy lịch sử hiện tại
        const newEntry = {
            domain, // Tên miền
            date: new Date().toLocaleString(), // Thời gian kiểm tra
            result, // Kết quả kiểm tra
        };

        // Thêm kết quả mới vào lịch sử
        history.push(newEntry);

        // Giới hạn số lượng mục lịch sử (tối đa 20)
        if (history.length > 20) {
            history.shift(); // Xóa mục đầu tiên nếu vượt quá giới hạn
        }

        // Lưu lịch sử mới vào localStorage
        localStorage.setItem("certHistory", JSON.stringify(history));
        console.log("Lịch sử sau khi lưu:", history); // Debugging
    }

    // Hiển thị lịch sử khi có thay đổi
    function displayHistory() {
        const history = JSON.parse(localStorage.getItem("certHistory")) || []; // Lấy lịch sử từ localStorage
        if (history.length === 0) {
            historyList.innerHTML = "<p>Chưa có lịch sử kiểm tra nào.</p>";
            return;
        }

        // Tạo danh sách lịch sử
        historyList.innerHTML = history
            .map((entry, index) => `
            <div class="history-entry" data-index="${index}">
                <strong>${entry.domain}</strong>
                <p>${entry.date}</p>
                <p>Kết quả: ${entry.result}</p>
                <button class="delete-button" data-index="${index}">Xóa</button>
            </div>
        `)
            .join("");

        // Gắn sự kiện cho các nút xóa
        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                deleteHistoryEntry(index);
            });
        });
    }

    function deleteHistoryEntry(index) {
        const history = JSON.parse(localStorage.getItem("certHistory")) || [];
        history.splice(index, 1); // Xóa mục tại vị trí `index`
        localStorage.setItem("certHistory", JSON.stringify(history)); // Cập nhật localStorage
        displayHistory(); // Cập nhật giao diện
    }

    function clearHistory() {
        if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử?")) {
            localStorage.removeItem("certHistory");
            displayHistory();
            alert("Lịch sử đã được xóa.");
        }
    }

    if (clearButton) {
        clearButton.addEventListener("click", clearHistory);
    }

    // Khởi tạo giao diện - ẩn popup ban đầu
    handleMenuAction('home');

    // Xử lý sự kiện cho các nút trong Cài đặt
    // Tùy chỉnh giao diện
    customizeInterface.addEventListener('click', () => {
        alert('Mở giao diện tùy chỉnh màu sắc và chủ đề!');
    });

    // Quản lý quyền truy cập
    manageAccess.addEventListener('click', () => {
        alert('Điều chỉnh quyền truy cập của người dùng!');
    });

    // Thông báo
    notifications.addEventListener('click', () => {
        const enableNotifications = confirm('Bật thông báo?');
        if (enableNotifications) {
            alert('Thông báo đã được bật.');
        } else {
            alert('Thông báo đã bị tắt.');
        }
    });


    // Cài đặt chức năng
    functionSettings.addEventListener('click', () => {
        alert('Mở menu cài đặt chức năng chi tiết.');
    });

    // Ngôn ngữ
    language.addEventListener('click', () => {
        const selectedLanguage = prompt('Chọn ngôn ngữ (vi/eng):', 'vi');
        if (selectedLanguage) {
            alert(`Ngôn ngữ đã được thay đổi thành: ${selectedLanguage}`);
        } else {
            alert('Ngôn ngữ không thay đổi.');
        }
    });

    // Dữ liệu cá nhân
    personalData.addEventListener('click', () => {
        alert('Mở trình quản lý dữ liệu cá nhân.');
    });

    // Sao lưu và khôi phục
    backupRestore.addEventListener('click', () => {
        const action = prompt('Bạn muốn (1) Sao lưu hay (2) Khôi phục dữ liệu?', '1');
        if (action === '1') {
            alert('Dữ liệu đã được sao lưu thành công!');
        } else if (action === '2') {
            alert('Khôi phục dữ liệu từ bản sao lưu.');
        } else {
            alert('Không thực hiện hành động nào.');
        }
    });

    // Cập nhật
    update.addEventListener('click', () => {
        alert('Kiểm tra và cài đặt bản cập nhật mới nhất.');
    });


}

run();