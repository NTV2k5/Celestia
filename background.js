// Lắng nghe sự kiện khi extension được cài đặt hoặc cập nhật
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
});

// Lắng nghe sự kiện khi người dùng nhấn vào biểu tượng extension
chrome.action.onClicked.addListener(async (tab) => {
    try {
        if (!tab.id) {
            console.error("No active tab found.");
            return;
        }
        
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
        });
        console.log("Content script executed successfully on tab:", tab.id);
    } catch (error) {
        console.error("Failed to execute script:", error);
    }
});

// Hàm kiểm tra chứng chỉ thông qua server proxy
async function checkCertificate(domain) {
    try {
        const response = await fetch("http://localhost:8080/verify_certificate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain })
        });
        
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Certificate Check Result:", data);
        return data;
    } catch (error) {
        console.error("Error verifying certificate:", error);
        return { valid: false, message: "Error verifying certificate." };
    }
}

// Lắng nghe tin nhắn từ popup.js hoặc content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchCertificate") {
        fetch("http://localhost:8080/verify_certificate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain: request.hostname })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => sendResponse({ success: true, data }))
        .catch(error => {
            console.error("Fetch error:", error);
            sendResponse({ success: false, error: error.message });
        });
        
        return true; // Giữ kết nối để đợi phản hồi từ fetch()
    }
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "fetchSSLStatus") {
        try {
            const response = await fetch(`https://ssl-checker.io/api/v1/check/${request.hostname}`);
            const data = await response.json();
            sendResponse({ success: true, data });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
    }
    return true;
});
