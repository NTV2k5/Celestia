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
    // const manageAccess = document.getElementById('manage-access');
    const notifications = document.getElementById('notifications');
    const language = document.getElementById('language');
    // const personalData = document.getElementById('personal-data');
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
    // checkButton.addEventListener("click", async () => {
    //     const domain = prompt("Nhập địa chỉ website để kiểm tra (ví dụ: example.com):").trim();

    //     if (!domain) {
    //         alert("Bạn cần nhập một địa chỉ hợp lệ!");
    //         return;
    //     }

    //     if (!isValidDomain(domain)) {
    //         alert("Địa chỉ không hợp lệ! Vui lòng nhập đúng định dạng, ví dụ: example.com");
    //         return;
    //     }

    //     showResult("Đang kiểm tra...", "loading");

    //     try {
    //         // Kết nối API để kiểm tra chứng chỉ
    //         const response = await fetch(`https://api.certificatetransparency.dev/v1/check?domain=${domain}`);

    //         if (!response.ok) {
    //             throw new Error("Không thể kết nối đến API kiểm tra chứng chỉ.");
    //         }

    //         const data = await response.json();
    //         const isValid = data.status === "Valid";

    //         const statusText = isValid ? "Chứng chỉ hợp lệ!" : "Chứng chỉ không hợp lệ!";
    //         const statusClass = isValid ? "valid" : "invalid";

    //         // Hiển thị kết quả
    //         showResult(statusText, statusClass);

    //         // Lưu kết quả vào lịch sử
    //         saveToHistory(domain, statusText);

    //         // Hiển thị lịch sử mới
    //         displayHistory();
    //     } catch (error) {
    //         console.error("Lỗi khi kiểm tra chứng chỉ:", error);
    //         showResult("Lỗi khi kiểm tra chứng chỉ!", "invalid");
    //     }
    // });

    // Xử lý sự kiện khi nhấn nút "Check Now"
    checkButton.addEventListener('click', () => {
        // Kiểm tra xem URL có hợp lệ không
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
}

// Hiển thị kết quả lên giao diện
function showResult(message, status) {
    resultText.innerText = message;
    switch (status) {
        case 'success':
            resultText.style.color = 'green';
            break;
        case 'error':
            resultText.style.color = 'red';
            break;
        case 'info':
            resultText.style.color = 'blue';
            break;
        default:
            resultText.style.color = 'black';
    }
}

// Lưu kết quả vào lịch sử kiểm tra
function saveToHistory(url, status) {
    let history = JSON.parse(localStorage.getItem('sslCheckHistory')) || [];
    history.unshift({ url, status, checkedAt: new Date().toLocaleString() });
    localStorage.setItem('sslCheckHistory', JSON.stringify(history));
}

// Hiển thị lịch sử kiểm tra lên giao diện
function displayHistory() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = ''; // Xóa danh sách cũ

    let history = JSON.parse(localStorage.getItem('sslCheckHistory')) || [];
    history.slice(0, 10).forEach(entry => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${entry.url}</strong> - ${entry.status} <small>(${entry.checkedAt})</small>`;
        listItem.style.color = entry.status === 'Valid' ? 'green' : 'red';
        historyList.appendChild(listItem);
    });
}

// Gửi request đến API để kiểm tra chứng chỉ SSL
async function checkCertificate(url) {
    try {
        const response = await fetch(`https://your-api.com/check-ssl?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        return data.isValid; // API trả về { isValid: true/false }
    } catch (error) {
        console.error('Error checking certificate:', error);
        return false;
    }
}

// Xử lý sự kiện khi nhấn nút "Check Now"
document.getElementById('checkButton').addEventListener('click', async () => {
    const urlInput = document.getElementById('urlInput');
    const resultText = document.getElementById('resultText');

    const url = urlInput.value.trim();

    // Kiểm tra nếu URL rỗng hoặc không hợp lệ
    if (!url || !isValidUrl(url)) {
        showResult('Please enter a valid URL.', 'error');
        return;
    }

    // Hiển thị thông báo đang kiểm tra
    showResult(`Checking certificate for URL: ${url}`, 'info');

    // Gọi API kiểm tra chứng chỉ SSL
    const isValid = await checkCertificate(url);

    // Hiển thị kết quả kiểm tra
    const resultMessage = isValid
        ? `Certificate of ${url} is valid!`
        : `Certificate of ${url} is invalid or lacking transparency.`;

    showResult(resultMessage, isValid ? 'success' : 'error');

    // Lưu vào lịch sử và cập nhật giao diện
    saveToHistory(url, isValid ? 'Valid' : 'Not transparent or invalid');
    displayHistory();
})});

// Hiển thị lịch sử khi tải trang
document.addEventListener('DOMContentLoaded', displayHistory);

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

    // Xử lý sự kiện cho các nút trong Cài đặt
    // Tùy chỉnh giao diện
    // customizeInterface.addEventListener('click', () => {
    //     // alert('Mở giao diện tùy chỉnh màu sắc và chủ đề!');

    // });
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

    // // Quản lý quyền truy cập
    // manageAccess.addEventListener('click', () => {
    //     alert('Điều chỉnh quyền truy cập của người dùng!');
    // });

    // Thông báo
    notifications.addEventListener('click', () => {
        const enableNotifications = confirm('Turn on notifications?');
        if (enableNotifications) {
            alert('Notifications are enabled.');
        } else {
            alert('Notifications have been turned off.');
        }
    });

    // Ngôn ngữ
    // language.addEventListener('click', () => {
    //     const selectedLanguage = prompt('Chọn ngôn ngữ (vi/eng):', 'vi');
    //     if (selectedLanguage) {
    //         alert(`Ngôn ngữ đã được thay đổi thành: ${selectedLanguage}`);
    //     } else {
    //         alert('Ngôn ngữ không thay đổi.');
    //     }
    // });

    // Sao lưu và khôi phục
    backupRestore.addEventListener('click', () => {
        const action = prompt('You want: \n(1) Backup \n(2) Data Recovery', '1');
        if (action === '1') {
            alert('Data has been backed up successfully!');
        } else if (action === '2') {
            alert('Restore data from backup.');
        } else {
            alert('Take no action.');
        }
    });

    // Cập nhật
    update.addEventListener('click', () => {
        alert('The current version is the latest update.');
    });


}

run();
