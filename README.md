Certificate Transparency Browser Extension

🚀 Giới Thiệu

Certificate Transparency Browser Extension là một dự án sử dụng công nghệ blockchain để đảm bảo tính minh bạch và an toàn cho chứng chỉ SSL/TLS. Chúng tôi sử dụng Ethereum, Celestia, và Merkle Tree để lưu trữ và xác minh tính hợp lệ của chứng chỉ, giúp chống lại các cuộc tấn công giả mạo và đảm bảo độ tin cậy cho người dùng.

❌ Vấn Đề Hiện Nay

Chứng chỉ SSL/TLS có thể bị giả mạo hoặc thu hồi mà không có thông báo công khai.

Người dùng không có cách trực tiếp để kiểm tra độ tin cậy của chứng chỉ.

Dữ liệu chứng chỉ thường bị kiểm soát bởi các bên trung gian, dễ bị thao túng.

✅ Giải Pháp của Chúng Tôi

Lưu trữ log chứng chỉ trên Blockchain (Ethereum, Celestia)

Xác minh tính toàn vẹn bằng Merkle Tree & Transparency Proofs

Tích hợp Extension trình duyệt để kiểm tra chứng chỉ theo thời gian thực

Xây dựng API backend bằng Rust để kết nối với blockchain và xử lý dữ liệu

🛠 Thành Phần Chính

1️⃣ Smart Contract Blockchain

Lưu trữ chứng chỉ, Merkle Root, và Transparency Proofs.

Ghi nhận chứng chỉ bị thu hồi (Revocation Logs).

2️⃣ API Server (Rust)

Kết nối trình duyệt với blockchain.

Cung cấp dữ liệu Merkle Proof từ Celestia.

3️⃣ Trình Duyệt Extension & UI

Kiểm tra chứng chỉ của website trực tiếp từ trình duyệt.

Hiển thị lịch sử kiểm tra từ blockchain.

🔗 Dữ Liệu Được Lưu Trên Blockchain

Log Entries về chứng chỉ: Public key, serial number, hash chứng chỉ, thông tin tổ chức cấp phát.

Transparency Proofs: Merkle Root, Inclusion Proofs.

Metadata: Timestamp, Block Height, Log ID.

Revocation Logs: Ghi nhận chứng chỉ bị thu hồi.

🚀 Công Nghệ Sử Dụng

Blockchain: Ethereum, Celestia.

Smart Contract: Solidity.

Backend: Rust (Actix Web), Web3.js.

Frontend: Chrome Extension.

Xác minh dữ liệu: Merkle Tree, Prism SDK.

🎯 Demo Hệ Thống

Trình duyệt extension kiểm tra chứng chỉ theo thời gian thực.

Lịch sử kiểm tra được lưu trên Blockchain.

API Backend kết nối với Celestia để xác minh Merkle Proof.

✔ Lợi Ích và Ứng Dụng

Chống giả mạo chứng chỉ SSL/TLS.

Minh bạch hóa quá trình cấp phát chứng chỉ.

Bảo vệ người dùng khỏi các cuộc tấn công MITM (Man-In-The-Middle).

🔥 Kế Hoạch Phát Triển

Mở rộng hỗ trợ nhiều blockchain (Polygon, BNB Chain, Solana).

Tích hợp AI để phát hiện chứng chỉ đáng ngờ.

Cải thiện giao diện, tối ưu tốc độ xác minh.

📌 Cách Cài Đặt và Sử Dụng

1️⃣ Cài đặt API Server

cargo run --release

2️⃣ Cài đặt Extension trên Chrome

Truy cập chrome://extensions/.

Chọn "Load Unpacked" và tải thư mục chứa mã extension.

3️⃣ Deploy Smart Contract

npx hardhat run scripts/deploy.js --network goerli

💡 Đóng Góp và Liên Hệ

Đóng góp qua Pull Request trên GitHub.

Liên hệ: https://github.com/NTV2k5.

📌 Hãy cùng xây dựng một hệ thống bảo mật chứng chỉ minh bạch và an toàn hơn! 🔥
