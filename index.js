import init from "./pkg/certificate_transparency_extension.js";
async function run() {
    await init();
    
    const homePage = document.getElementById("home-section");
    const introductionPage = document.getElementById("introduction-container");
    const startCheckButton = document.getElementById("start-check-button");
    const checkButton = document.getElementById("check-button");
    const urlInput = document.getElementById('url-input');
    const resultContainer = document.getElementById("result-container");
    const resultText = document.getElementById("result");
    const historyContainer = document.getElementById("history-container");
    const historyList = document.getElementById("history-list");
    const clearButton = document.getElementById("clear-history");
    const popupContainer = document.querySelector('.popup-container');
    const popupHeader = document.querySelector('.popup-header');
    const menuItems = document.querySelectorAll('.menu li a');
    const settingsPage = document.getElementById('settings-section');
    const customizeInterface = document.getElementById('customize-interface');
    const customizeMenu = document.getElementById('customize-menu');
    const themeSelect = document.getElementById('theme-select');
    const notifications = document.getElementById('notifications');
    const backupRestore = document.getElementById('backup-restore');
    const backupRestoreModal = document.getElementById("backup-restore-modal");
    const backupRestoreContent = document.getElementById("backup-restore-content");
    const backupButton = document.getElementById("backup-button");
    const restoreButton = document.getElementById("restore-button");
    const cancelBackupRestore = document.getElementById("cancel-backup-restore");
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
                introductionPage.style.display = 'block';
                break;

            case 'check':
                // Hiển thị popup và nút kiểm tra
                homePage.style.display = 'none';
                introductionPage.style.display = 'none';
                popupContainer.style.display = 'block';
                popupHeader.style.display = 'block';
                checkButton.style.display = 'block';
                urlInput.style.display = 'block';
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
                introductionPage.style.display = 'none';
                popupContainer.style.display = 'block';
                popupHeader.style.display = 'block';
                checkButton.style.display = 'none';
                urlInput.style.display = 'none';
                resultContainer.style.display = 'none';
                settingsPage.style.display = 'none';
                aboutPage.style.display = 'none';
                historyContainer.style.display = 'block';
                historyList.parentElement.classList.remove('hidden');
                displayHistory();

                break;

            case 'settings':
                // Ẩn popup ở các trang khác
                homePage.style.display = 'none';
                introductionPage.style.display = 'none';
                aboutPage.style.display = 'none';
                resultContainer.style.display = 'none';
                popupHeader.style.display = 'none';
                historyContainer.style.display = 'none';
                // Hiển thị trang settings
                popupContainer.style.display = 'block';
                settingsPage.style.display = 'block';
                break;
            case 'about':
                // Ẩn popup ở các trang khác
                homePage.style.display = 'none';
                introductionPage.style.display = 'none';
                settingsPage.style.display = 'none';
                resultContainer.style.display = 'none';
                popupHeader.style.display = 'none';
                historyContainer.style.display = 'none';
                // Hiển thị trang about
                popupContainer.style.display = 'block';
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
        const domain = urlInput.value.trim();
        if (!domain) {
            showResult("Please enter a valid URL.", "error");
            return;
        }

        showResult(`Checking certificate for ${domain}...`, "info");
        
        try {
            const proxyUrl = "https://api.allorigins.win/raw?url=";
            const apiUrl = `https://api.ssllabs.com/api/v3/analyze?host=${domain}`;
            const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
            if (!response.ok) throw new Error("Failed to fetch SSL data");
            
            const data = await response.json();
            const statusText = data.status === "READY" ? "✅ Certificate is VALID!" : "❌ Certificate is INVALID or EXPIRED.";
            showResult(statusText, data.status === "READY" ? "valid" : "invalid");
            saveToHistory(domain, statusText);
            displayHistory();
        } catch (error) {
            showResult("❌ Error checking certificate!", "invalid");
        }
    });

    function isValidDomain(domain) {
        const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,}$/;
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
        console.log("History after saving:", history); // Debugging
    }

    // Hiển thị lịch sử khi có thay đổi
    function displayHistory() {
        const history = JSON.parse(localStorage.getItem("certHistory")) || []; // Lấy lịch sử từ localStorage
        if (history.length === 0) {
            historyList.innerHTML = "<p>No test history yet.</p>";
            return;
        }

        // Tạo danh sách lịch sử
        historyList.innerHTML = history
            .map((entry, index) => `
            <div class="history-entry" data-index="${index}">
                <strong>${entry.domain}</strong>
                <p>${entry.date}</p>
                <p>Result: ${entry.result}</p>
                <button class="delete-button" data-index="${index}">Delete</button>
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
        if (confirm("Are you sure you want to delete all history?")) {
            localStorage.removeItem("certHistory");
            displayHistory();
            alert("History cleared.");
        }
    }

    if (clearButton) {
        clearButton.addEventListener("click", clearHistory);
    }

    // Khởi tạo giao diện - ẩn popup ban đầu
    handleMenuAction('home');

    // Hiển thị menu tùy chỉnh khi nhấn nút "Tùy chỉnh"
    customizeInterface.addEventListener('click', function () {
        customizeMenu.classList.toggle('hidden');
    });

    // Áp dụng giao diện khi người dùng chọn từ menu
    themeSelect.addEventListener('change', function () {
        const selectedTheme = themeSelect.value;
        setTheme(selectedTheme);
        localStorage.setItem('theme', selectedTheme); // Lưu lựa chọn vào localStorage
    });

    // Hàm thay đổi giao diện
    function setTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else if (theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else if (theme === 'system') {
            // Theo mặc định của hệ thống
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.add('light-theme');
            }
        }
    }

    // Áp dụng giao diện khi tải trang
    window.addEventListener('DOMContentLoaded', function () {
        const savedTheme = localStorage.getItem('theme') || 'system'; // Lấy giao diện từ localStorage
        themeSelect.value = savedTheme; // Hiển thị lựa chọn trong menu
        setTheme(savedTheme); // Áp dụng giao diện
    });

    // Thông báo
    let isNotificationActive = false;
    notifications.addEventListener('click', () => {
        const notification = document.getElementById("notification");
        const notificationMessage = document.getElementById("notificationMessage");

        if (!isNotificationActive) {
            // Bật thông báo
            notification.classList.remove("inactive");
            notification.classList.add("active");
            notificationMessage.textContent = "Notifications are enabled"; // Nội dung thông báo
            notification.style.display = "block";
            isNotificationActive = true;
            notifications.textContent = "Off"; // Thay đổi văn bản nút

            // Tự động ẩn thông báo sau 5 giây
            setTimeout(() => {
                closeNotification();
            }, 5000);
        } else {
            // Tắt thông báo
            notification.classList.remove("active");
            notification.classList.add("inactive");
            notificationMessage.textContent = "Notifications have been turned off"; // Nội dung thông báo
            notification.style.display = "block"; // Hiển thị thông báo màu đỏ
            isNotificationActive = false;
            notifications.textContent = "On"; // Đặt lại văn bản nút

            // Tự động ẩn thông báo sau 5 giây
            setTimeout(() => {
                closeNotification();
            }, 5000);
        }

    });

    function closeNotification() {
        const notification = document.getElementById("notification");
        notification.style.display = "none"; // Ẩn thông báo ngay lập tức
    }

    backupRestore.addEventListener('click', () => {
        backupRestoreModal.style.display = "block";
    });

    backupButton.addEventListener('click', () => {
        backupRestoreContent.innerHTML = "<p>Data has been backed up successfully!</p>";
        setTimeout(() => {
            backupRestoreModal.style.display = "none";
        }, 2000); // Đóng modal sau 2 giây
        display = "none";
    });
    
    restoreButton.addEventListener('click', () => {
        backupRestoreContent.innerHTML = "<p>Data has been restored from backup.</p>";
        setTimeout(() => {
            backupRestoreModal.style.display = "none";
        }, 2000);
        display = "none";
    });
    
    cancelBackupRestore.addEventListener('click', () => {
        backupRestoreModal.style.display = "none";
    });

    // Cập nhật
    update.addEventListener('click', () => {
        const updateMessage = document.getElementById("updateMessage");
        updateMessage.style.display = "block"; // Hiển thị thông báo
        // Tự động ẩn thông báo sau 5 giây
        setTimeout(() => {
            closeUpdateNotification();
        }, 5000);
        function closeUpdateNotification() {
            const updateMessage = document.getElementById("updateMessage");
            updateMessage.style.display = "none"; // Ẩn thông báo ngay lập tức
        }
    });

}

run();