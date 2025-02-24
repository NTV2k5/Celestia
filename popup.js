document.addEventListener('DOMContentLoaded', async () => {
    const currentSiteElement = document.getElementById('current-site');
    const certificateStatusElement = document.getElementById('certificate-status');
    const spinnerElement = document.getElementById('loading-spinner');
    const historyContainer = document.getElementById('history-container');
    
    // Hiển thị spinner trong khi tải
    spinnerElement.style.display = 'block';
    certificateStatusElement.style.display = 'none';

    try {
        const tab = await getCurrentTab();
        if (!tab) throw new Error("Không thể lấy thông tin website");
        
        const hostname = new URL(tab.url).hostname;
        currentSiteElement.innerText = hostname;
        
        const sslStatus = await checkSSLCertificate(hostname);
        updateUI(sslStatus);
        saveToHistory(hostname, sslStatus.statusText);
    } catch (error) {
        certificateStatusElement.innerText = `❌ Lỗi: ${error.message}`;
        certificateStatusElement.className = 'invalid';
    } finally {
        spinnerElement.style.display = 'none';
        certificateStatusElement.style.display = 'block';
        renderHistory();
    }
});

// Lấy tab hiện tại
async function getCurrentTab() {
    return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            resolve(tabs.length ? tabs[0] : null);
        });
    });
}

// Gọi API kiểm tra chứng chỉ SSL thông qua proxy
async function checkSSLCertificate(hostname) {
    const proxyUrl = "https://api.allorigins.win/raw?url=";
    const apiUrl = `https://api.ssllabs.com/api/v3/analyze?host=${hostname}`;
    
    try {
        const response = await fetch(proxyUrl + encodeURIComponent(apiUrl));
        if (!response.ok) throw new Error(`API trả về lỗi ${response.status}`);
        
        const data = await response.json();
        
        return {
            statusText: data.status === "READY" ? "✅ Certificate is VALID!" : "❌ Certificate is INVALID or EXPIRED.",
            statusClass: data.status === "READY" ? "valid" : "invalid",
        };
    } catch (error) {
        return {
            statusText: "⚠️ Không thể kiểm tra chứng chỉ.",
            statusClass: "warning",
        };
    }
}

// Cập nhật giao diện
function updateUI(sslStatus) {
    const certificateStatusElement = document.getElementById('certificate-status');
    certificateStatusElement.innerText = sslStatus.statusText;
    certificateStatusElement.className = sslStatus.statusClass;
}

// Lưu vào lịch sử kiểm tra
function saveToHistory(site, result) {
    const history = JSON.parse(localStorage.getItem('certHistory')) || [];
    
    const newHistory = history.filter(entry => entry.site !== site);
    newHistory.unshift({ site, timestamp: new Date().toLocaleString(), result });

    if (newHistory.length > 20) newHistory.pop();
    
    localStorage.setItem('certHistory', JSON.stringify(newHistory));
}

// Hiển thị lịch sử kiểm tra
function renderHistory() {
    const history = JSON.parse(localStorage.getItem('certHistory')) || [];
    const historyContainer = document.getElementById('history-container');
    
    if (!historyContainer) return;
    
    historyContainer.innerHTML = history.length
        ? history.map(entry => `
            <div class="history-entry">
                <p><strong>Site:</strong> ${entry.site}</p>
                <p><strong>Time:</strong> ${entry.timestamp}</p>
                <p><strong>Result:</strong> ${entry.result}</p>
            </div>
        `).join("")
        : '<p>No test history.</p>';
}

// Xóa lịch sử kiểm tra
function clearHistory() {
    localStorage.removeItem('certHistory');
    renderHistory();
}
