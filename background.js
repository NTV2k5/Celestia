// Lắng nghe sự kiện khi extension được cài đặt hoặc cập nhật
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension Installed");
});

// Lắng nghe sự kiện khi người dùng nhấn vào biểu tượng extension
chrome.action.onClicked.addListener(async (tab) => {
    try {
        // Kiểm tra xem tab có tồn tại không
        if (!tab.id) {
            console.error("No active tab found.");
            return;
        }

        // Thực thi file content.js trên tab hiện tại
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ["content.js"]
        });

        console.log("Content script executed successfully on tab:", tab.id);
    } catch (error) {
        // Ghi log lỗi nếu xảy ra vấn đề
        console.error("Failed to execute script:", error);
    }
});

async function checkCertificate(domain) {
    try {
        const response = await fetch("http://localhost:8080/verify_certificate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Certificate Check Result:", data);
            return data;
        } else {
            throw new Error("Failed to verify certificate.");
        }
    } catch (error) {
        console.error("Error:", error);
        return { valid: false, message: "Error verifying certificate." };
    }
}

document.getElementById("check-button").addEventListener("click", async () => {
    const domain = prompt("Enter domain to check:");
    if (domain) {
        const result = await checkCertificate(domain);
        alert(result.message);
    }
});

