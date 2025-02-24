require("dotenv").config();
const { ethers } = require("ethers");
const contractABI = require("../artifacts/CertificateTransparency.json").abi;

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, wallet);

// Gửi chứng chỉ lên blockchain
async function addCertificate(certificateId) {
    const tx = await contract.addCertificate(certificateId);
    await tx.wait();
    return tx.hash;
}

// Lấy danh sách chứng chỉ từ blockchain
async function getCertificates(owner) {
    return await contract.getCertificates(owner);
}

module.exports = { addCertificate, getCertificates };
