document.addEventListener('DOMContentLoaded', async () => {
    const currentSiteElement = document.getElementById('current-site');
    const certificateStatusElement = document.getElementById('certificate-status');
    const spinnerElement = document.getElementById('loading-spinner');
    const historyContainer = document.getElementById('history-container');

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
                // API giả lập kiểm tra chứng chỉ
                const response = await fetch(`https://api.certificatetransparency.dev/v1/check?domain=${hostname}`);
                const data = await response.json();

                let statusText = '';
                let statusClass = '';
                if (response.ok && data) {
                    statusText = data.status || 'Hợp lệ';
                    statusClass = data.status === 'Hợp lệ' ? 'valid' : 'invalid';
                } else {
                    statusText = 'Không hợp lệ';
                    statusClass = 'invalid';
                }

                certificateStatusElement.innerText = statusText;
                certificateStatusElement.className = statusClass;

                // Lưu trạng thái vào localStorage
                saveToHistory(hostname, statusText);
            } catch (error) {
                certificateStatusElement.innerText = 'Lỗi khi kiểm tra chứng chỉ';
                certificateStatusElement.className = 'invalid';
                console.error('Error fetching certificate status:', error);
            } finally {
                // Ẩn spinner sau khi hoàn tất
                spinnerElement.style.display = 'none';
                certificateStatusElement.style.display = 'block';

                // Hiển thị lịch sử từ localStorage
                renderHistory();
            }
        } else {
            currentSiteElement.innerText = 'Không thể lấy thông tin trang web';
        }
    });
});

function redirectToIndex() {
    window.open('index.html', '_blank');
}

// Lưu trạng thái vào localStorage
function saveToHistory(site, status) {
    const history = JSON.parse(localStorage.getItem('certificateHistory')) || [];
    history.unshift({ site, status, timestamp: new Date().toLocaleString() });
    localStorage.setItem('certificateHistory', JSON.stringify(history));
}

// Hiển thị lịch sử từ localStorage
function renderHistory() {
    const history = JSON.parse(localStorage.getItem('certificateHistory')) || [];
    const historyContainer = document.getElementById('history-container');
    historyContainer.innerHTML = ''; // Xóa lịch sử cũ

    if (history.length === 0) {
        historyContainer.innerHTML = '<p>Không có lịch sử kiểm tra nào.</p>';
        return;
    }

    history.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'history-entry';
        entryDiv.innerHTML = `
            <p><strong>Trang:</strong> ${entry.site}</p>
            <p><strong>Trạng thái:</strong> ${entry.status}</p>
            <p><strong>Thời gian:</strong> ${entry.timestamp}</p>
        `;
        historyContainer.appendChild(entryDiv);
    });
}

// Xóa lịch sử
function clearHistory() {
    localStorage.removeItem('certificateHistory');
    renderHistory();
}
