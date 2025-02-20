require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const Redis = require('ioredis');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const XENON_URL = process.env.XENON_URL || 'https://xenon2024.com/api/root';

app.use(express.json());
app.use(cors());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Mô hình dữ liệu
const ServiceSchema = new mongoose.Schema({
    service: String,
    publicKey: String,
    registeredAt: { type: Date, default: Date.now }
});
const Service = mongoose.model('Service', ServiceSchema);

const RootSchema = new mongoose.Schema({
    service: String,
    signedTreeHead: String,
    createdAt: { type: Date, default: Date.now }
});
const Root = mongoose.model('Root', RootSchema);

// Middleware xác thực JWT
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// **1. API Đăng ký dịch vụ**
app.post('/register', authenticateToken, async (req, res) => {
    const { service, publicKey } = req.body;
    if (!service || !publicKey) return res.status(400).json({ error: 'Missing required fields' });

    const newService = new Service({ service, publicKey });
    await newService.save();
    res.json({ message: 'Service registered successfully' });
});

// **2. API Polling Root Mới**
app.get('/poll-root', authenticateToken, async (req, res) => {
    try {
        const lastRoot = await redis.get('latest_root');
        if (lastRoot) return res.json({ root: lastRoot });

        // Gửi yêu cầu đến Xenon2024 để lấy root mới
        const response = await axios.get(XENON_URL);
        const newRoot = response.data.root || 'No new root';

        await redis.set('latest_root', newRoot, 'EX', 60); // Lưu root vào Redis trong 60 giây

        res.json({ root: newRoot });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching root' });
    }
});

// **3. API Lưu Root Mới**
app.post('/set-data', authenticateToken, async (req, res) => {
    const { service, signedTreeHead } = req.body;
    if (!service || !signedTreeHead) return res.status(400).json({ error: 'Missing required fields' });

    const newRoot = new Root({ service, signedTreeHead });
    await newRoot.save();

    await redis.set('latest_root', signedTreeHead, 'EX', 60);

    res.json({ message: 'Root saved successfully' });
});

// **4. API Lấy Lịch Sử Root**
app.get('/history', authenticateToken, async (req, res) => {
    const history = await Root.find().sort({ createdAt: -1 }).limit(20);
    res.json(history);
});

// **5. API Đăng nhập (Token)**
app.post('/login', (req, res) => {
    const token = jwt.sign({ user: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Khởi động server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
