const express = require("express");
const router = express.Router();
const { addCertificate, getCertificates } = require("../service/certificateService");

// API: Thêm chứng chỉ vào blockchain
router.post("/add", async (req, res) => {
    try {
        const { certificateId } = req.body;
        const txHash = await addCertificate(certificateId);
        res.json({ success: true, txHash });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Lấy danh sách chứng chỉ từ blockchain
router.get("/:owner", async (req, res) => {
    try {
        const certificates = await getCertificates(req.params.owner);
        res.json({ success: true, certificates });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
