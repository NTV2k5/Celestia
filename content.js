import init, { check_certificate } from "./pkg/certificate_transparency_extension.js";

async function run() {
    console.log("Initializing WebAssembly...");
    try {
        // Khởi tạo WebAssembly
        await init();
        console.log("WebAssembly initialized successfully.");

        // Tạo nút "Check Certificate"
        createCheckButton();

        // Tạo nút "View History"
        createHistoryButton();

    } catch (error) {
        console.error("Error initializing WebAssembly:", error);
        displayResult("Failed to initialize WebAssembly.", true);
    }
}

function createCheckButton() {
    const button = document.createElement("button");
    button.id = "check-button";
    button.innerText = "Check Certificate";
    styleButton(button, "20px", "20px", "#007bff");
    document.body.appendChild(button);

    // Gắn sự kiện click vào nút
    button.addEventListener("click", async () => {
        console.log("Check Certificate button clicked.");
        await handleCertificateCheck();
    });
}

function createHistoryButton() {
    const button = document.createElement("button");
    button.id = "history-button";
    button.innerText = "View History";
    styleButton(button, "20px", "100px", "#28a745");
    document.body.appendChild(button);

    // Gắn sự kiện click vào nút
    button.addEventListener("click", () => {
        console.log("View History button clicked.");
        displayHistory();
    });
}

async function handleCertificateCheck() {
    try {
        // Lấy chứng chỉ từ header HTTP
        const cert = await fetchCertificate();

        if (!cert) {
            console.error("No certificate found in headers.");
            displayResult("No certificate found in headers.", true);
            return;
        }

        // Kiểm tra chứng chỉ thông qua hàm WASM
        const result = await check_certificate(cert);
        console.log("Certificate check result:", result);

        const certDetails = {
            domain: window.location.hostname,
            issuedDate: "Ngày cấp (mocked)", // Thay thế bằng dữ liệu thực nếu có
            expiryDate: "Ngày hết hạn (mocked)", // Thay thế bằng dữ liệu thực nếu có
            issuer: "CA (mocked)", // Thay thế bằng dữ liệu thực nếu có
            result: result ? "Valid" : "Invalid"
        };

        // Hiển thị thông tin chứng chỉ
        displayCertificateDetails(certDetails);

        // Lưu trữ lịch sử kiểm tra
        saveToHistory(certDetails);

    } catch (error) {
        console.error("Error checking certificate:", error);
        displayResult("Error checking certificate.", true);
    }
}

async function fetchCertificate() {
    try {
        const response = await fetch(window.location.href);
        const cert = response.headers.get("Certificate");

        if (!cert) {
            console.warn("Certificate header not found.");
            return null;
        }

        return cert;

    } catch (error) {
        console.error("Error fetching certificate:", error);
        throw new Error("Failed to fetch certificate.");
    }
}

function displayCertificateDetails(certDetails) {
    const resultDiv = document.createElement("div");
    resultDiv.id = "certificate-result";
    resultDiv.innerHTML = `
        <div style="padding: 15px; margin: 10px; border: 1px solid ${certDetails.result === "Valid" ? "green" : "red"}; border-radius: 5px;">
            <strong>Certificate Check Result</strong><br>
            <strong>Domain:</strong> ${certDetails.domain}<br>
            <strong>Issued Date:</strong> ${certDetails.issuedDate}<br>
            <strong>Expiry Date:</strong> ${certDetails.expiryDate}<br>
            <strong>Issuer:</strong> ${certDetails.issuer}<br>
            <strong>Result:</strong> <span style="color: ${certDetails.result === "Valid" ? "green" : "red"}">${certDetails.result}</span>
        </div>
    `;
    document.body.appendChild(resultDiv);

    // Ẩn kết quả sau 10 giây
    setTimeout(() => resultDiv.remove(), 10000);
}

function displayHistory() {
    const history = JSON.parse(localStorage.getItem('certHistory')) || [];
    if (history.length === 0) {
        displayResult("No history available.", true);
        return;
    }

    const historyDiv = document.createElement("div");
    historyDiv.id = "certificate-history";
    historyDiv.style.position = "fixed";
    historyDiv.style.top = "10px";
    historyDiv.style.right = "10px";
    historyDiv.style.backgroundColor = "#fff";
    historyDiv.style.border = "1px solid #000";
    historyDiv.style.padding = "15px";
    historyDiv.style.borderRadius = "5px";
    historyDiv.style.zIndex = "1000";
    historyDiv.style.maxHeight = "400px";
    historyDiv.style.overflowY = "auto";

    historyDiv.innerHTML = `<strong>Certificate History:</strong><br><br>`;
    history.forEach((item, index) => {
        historyDiv.innerHTML += `
            <div style="margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px;">
                <strong>#${index + 1}</strong><br>
                <strong>Domain:</strong> ${item.domain}<br>
                <strong>Issued Date:</strong> ${item.issuedDate}<br>
                <strong>Expiry Date:</strong> ${item.expiryDate}<br>
                <strong>Issuer:</strong> ${item.issuer}<br>
                <strong>Result:</strong> <span style="color: ${item.result === "Valid" ? "green" : "red"}">${item.result}</span><br>
            </div>
        `;
    });

    document.body.appendChild(historyDiv);

    // Đóng lịch sử sau 10 giây
    setTimeout(() => historyDiv.remove(), 10000);
}

function displayResult(message, isError = false) {
    const resultDiv = document.createElement("div");
    resultDiv.id = "error-result";
    resultDiv.innerHTML = `
        <div style="padding: 15px; margin: 10px; border: 1px solid ${isError ? "red" : "green"}; border-radius: 5px;">
            <strong>${isError ? "Error" : "Success"}:</strong> ${message}
        </div>
    `;
    document.body.appendChild(resultDiv);

    // Ẩn thông báo sau 10 giây
    setTimeout(() => resultDiv.remove(), 10000);
}

function saveToHistory(certDetails) {
    let history = JSON.parse(localStorage.getItem('certHistory')) || [];
    history.push(certDetails);
    localStorage.setItem('certHistory', JSON.stringify(history));
}

function styleButton(button, bottom, right, color) {
    button.style.position = "fixed";
    button.style.bottom = bottom;
    button.style.right = right;
    button.style.padding = "10px";
    button.style.backgroundColor = color;
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.zIndex = "1000";
}

run();
