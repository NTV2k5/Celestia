document.addEventListener('DOMContentLoaded', async () => {
    const currentSiteElement = document.getElementById('current-site');
    const certificateStatusElement = document.getElementById('certificate-status');
    const spinnerElement = document.getElementById('loading-spinner');
    const historyContainer = document.getElementById('history-container');
    const resultContainer = document.getElementById('result-container');
    const resultText = document.getElementById('result');


    // Hiển thị spinner trong khi tải
    spinnerElement.style.display = 'block';
    certificateStatusElement.style.display = 'none';

    // Sử dụng Chrome Tabs API để lấy thông tin tab hiện tại
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
        if (tabs.length > 0) {
            const tab = tabs[0];
            const url = new URL(tab.url);
            const hostname = url.hostname;

            // Hiển thị hostname
            currentSiteElement.innerText = hostname;

            try {
                // // API giả lập kiểm tra chứng chỉ
                // const response = await fetch(`https://api.certificatetransparency.dev/v1/check?domain=${hostname}`);
                // const data = await response.json();

                // let statusText = '';
                // let statusClass = '';
                // if (response.ok && data) {
                //     statusText = data.status || 'Hợp lệ';
                //     statusClass = data.status === 'Hợp lệ' ? 'valid' : 'invalid';
                // } else {
                //     statusText = 'Không hợp lệ';
                //     statusClass = 'invalid';
                // }

                // certificateStatusElement.innerText = statusText;
                // certificateStatusElement.className = statusClass;

                // // Lưu trạng thái vào localStorage
                // saveToHistory(hostname, statusText);


                // Kiểm tra nếu URL rỗng
                if (!url) {
                    resultContainer.style.display = 'block';
                    resultText.textContent = 'Please enter a valid URL.';
                    resultText.style.color = 'red';
                    return;
                }

                // Giả lập kiểm tra chứng chỉ (bạn có thể thay bằng logic kiểm tra thực tế)
                resultContainer.style.display = 'block';
                resultText.textContent = `Checking certificate for URL: ${hostname}`;
                resultText.style.color = 'blue';

                setTimeout(() => {
                    // Mô phỏng kết quả kiểm tra
                    const isValid = Math.random() > 0.5; // Kết quả ngẫu nhiên (true hoặc false)
                    if (isValid) {
                        resultText.textContent = `Certificate of ${hostname} is valid!`;
                        resultText.style.color = 'green';
                    } else {
                        resultText.textContent = `Certificate of ${hostname} is invalid or lacking transparency.`;
                        resultText.style.color = 'red';
                    }
                    resultText.textContent = resultMessage;

                    // Lưu kết quả vào lịch sử
                    saveToHistory(hostname, resultMessage);

                    // Cập nhật hiển thị lịch sử
                    renderHistory();
                }, 3000); // Thời gian giả lập kiểm tra (3 giây)

            } catch (error) {
                certificateStatusElement.innerText = 'Error while checking certificate';
                certificateStatusElement.className = 'invalid';
                // console.error('Error fetching certificate status:', error);
            } finally {
                // Ẩn spinner sau khi hoàn tất
                spinnerElement.style.display = 'none';
                certificateStatusElement.style.display = 'block';

                // Hiển thị lịch sử từ localStorage
                renderHistory();
            }
        } else {
            currentSiteElement.innerText = 'Unable to get website information';
        }


    });

    // Hàm hiển thị kết quả trong popup
    function showResultPopup(message, status) {
        certificateStatusElement.innerText = message; // Gán thông báo
        certificateStatusElement.style.color =
            status === 'success' ? 'green' : status === 'error' ? 'red' : 'blue';
        resultContainer.style.display = 'block'; // Hiển thị popup
    }

    // Lưu kết quả kiểm tra vào lịch sử
    function saveToHistory(site, result) {
        const history = JSON.parse(localStorage.getItem('certHistory')) || []; // Lấy lịch sử
        const newEntry = {
            site, // Tên miền
            timestamp: new Date().toLocaleString(), // Thời gian kiểm tra
            result, // Kết quả kiểm tra
        };

        // Giới hạn số lượng lịch sử (tối đa 20 mục)
        history.push(newEntry);
        if (history.length > 20) {
            history.shift(); // Xóa mục đầu tiên nếu vượt quá giới hạn
        }

        // Lưu lịch sử vào localStorage
        localStorage.setItem('certHistory', JSON.stringify(history));
    }

    // Hiển thị lịch sử kiểm tra từ localStorage
    function renderHistory() {
        const history = JSON.parse(localStorage.getItem('certHistory')) || [];
        historyContainer.innerHTML = ''; // Xóa nội dung cũ

        if (history.length === 0) {
            historyContainer.innerHTML = '<p>No test history.</p>';
            return;
        }

        history.forEach((entry) => {
            const entryDiv = document.createElement('div');
            entryDiv.className = 'history-entry';
            entryDiv.innerHTML = `
            <p><strong>Site:</strong> ${entry.site}</p>
            <p><strong>Time:</strong> ${entry.timestamp}</p>
            <p><strong>Result:</strong> ${entry.result}</p>
        `;
            historyContainer.appendChild(entryDiv);
        });
    }

    // Xóa lịch sử kiểm tra
    function clearHistory() {
        localStorage.removeItem('certHistory');
        renderHistory();
    }

    // Chuyển hướng về trang index
    function redirectToIndex() {
        window.open('index.html', '_blank');
    }

});

