Certificate Transparency Browser Extension

🚀 Introduction

The Certificate Transparency Browser Extension is a project utilizing blockchain technology to ensure the transparency and security of SSL/TLS certificates. We leverage Ethereum, Celestia, and Merkle Tree to store and verify certificate validity, preventing forgery attacks and enhancing trust for users.

❌ Current Issues

SSL/TLS certificates can be forged or revoked without public notice.

Users have no direct way to verify the reliability of a certificate.

Certificate data is often controlled by intermediaries, making it susceptible to manipulation.

✅ Our Solution

Store certificate logs on Blockchain (Ethereum, Celestia).

Ensure data integrity with Merkle Tree & Transparency Proofs.

Integrate a browser extension for real-time certificate verification.

Build a backend API with Rust to connect with blockchain and process data.

🛠 Core Components

1️⃣ Blockchain Smart Contract

Stores certificates, Merkle Root, and Transparency Proofs.

Records Revocation Logs for revoked certificates.

2️⃣ API Server (Rust)

Connects the browser with the blockchain.

Provides Merkle Proof data from Celestia.

3️⃣ Browser Extension & UI

Checks website certificates directly from the browser.

Displays verification history retrieved from the blockchain.

🔗 Data Stored on Blockchain

Log Entries: Public key, serial number, certificate hash, issuing organization details.

Transparency Proofs: Merkle Root, Inclusion Proofs.

Metadata: Timestamp, Block Height, Log ID.

Revocation Logs: Records of revoked certificates.

🚀 Technologies Used

Blockchain: Ethereum, Celestia.

Smart Contract: Solidity.

Backend: Rust (Actix Web), Web3.js.

Frontend: Chrome Extension.

Data Verification: Merkle Tree, Prism SDK.

🎯 System Demo

Real-time SSL/TLS certificate verification via browser extension.

Verification history stored on Blockchain for transparency.

Backend API connecting to Celestia for Merkle Proof validation.

✔ Benefits & Applications

Prevents SSL/TLS certificate forgery.

Enhances transparency in certificate issuance.

Protects users from MITM (Man-In-The-Middle) attacks.

🔥 Future Development Plans

Expand support to multiple blockchains (Polygon, BNB Chain, Solana).

Integrate AI to detect suspicious certificates.

Improve UI/UX and verification speed optimization.

📌 Installation & Usage Guide

1️⃣ Set Up API Server

cargo run --release

2️⃣ Install Chrome Extension

Go to chrome://extensions/.

Click "Load Unpacked" and select the extension folder.

3️⃣ Deploy Smart Contract

npx hardhat run scripts/deploy.js --network goerli

💡 Contributions & Contact

Contribute via Pull Requests on GitHub.

Contact: https://github.com/NTV2k5.

📌 Let's build a more secure and transparent certificate security system! 🔥
