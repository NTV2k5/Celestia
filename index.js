import init, { check_certificate } from "./pkg/certificate_transparency_extension.js";

async function run() {
    await init();

    const checkButton = document.getElementById("check-button");
    const resultContainer = document.getElementById("result-container");
    const resultText = document.getElementById("result");
    const historyList = document.getElementById("history-list");

    checkButton.addEventListener("click", async () => {
        // Hiển thị prompt để nhập địa chỉ website
        const domain = prompt("Nhập địa chỉ website để kiểm tra (ví dụ: example.com):");

        if (!domain) {
            alert("Bạn cần nhập một địa chỉ hợp lệ!");
            return;
        }

        if (!isValidDomain(domain)) {
            alert("Địa chỉ không hợp lệ! Vui lòng nhập đúng định dạng, ví dụ: example.com");
            return;
        }

        // Mô phỏng việc kiểm tra chứng chỉ
        resultText.textContent = "Đang kiểm tra...";
        resultContainer.classList.remove("hidden");

        try {
            const result = await check_certificate(domain);

            resultText.textContent = result ? "Chứng chỉ hợp lệ!" : "Chứng chỉ không hợp lệ!";
            resultText.className = result ? "valid" : "invalid";

            // Lưu vào lịch sử
            saveToHistory(domain, result ? "Valid" : "Invalid");
            displayHistory();
        } catch (error) {
            console.error("Lỗi khi kiểm tra chứng chỉ:", error);
            resultText.textContent = "Lỗi khi kiểm tra chứng chỉ!";
            resultText.className = "invalid";
        }
    });

    function isValidDomain(domain) {
        const domainRegex = /^(?!:\/\/)([a-zA-Z0-9-_]+\.)+[a-zA-Z]{2,}$/;
        return domainRegex.test(domain);
    }

    function saveToHistory(domain, result) {
        const history = JSON.parse(localStorage.getItem("certHistory")) || [];
        const newEntry = {
            domain,
            date: new Date().toLocaleString(),
            result,
        };
        history.push(newEntry);
        localStorage.setItem("certHistory", JSON.stringify(history));
    }

    function displayHistory() {
        const history = JSON.parse(localStorage.getItem("certHistory")) || [];
        historyList.innerHTML = history
            .map(entry => `
                <div class="history-entry">
                    <strong>${entry.domain}</strong>
                    <p>${entry.date}</p>
                    <p>Kết quả: ${entry.result}</p>
                </div>
            `)
            .join("");
    }

    displayHistory();
}

run();
