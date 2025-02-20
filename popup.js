require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const https = require('https');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Certificate Schema
const CertCheckSchema = new mongoose.Schema({
    url: String,
    status: String,
    validTo: String,
    checkedAt: { type: Date, default: Date.now }
});
const CertCheck = mongoose.model('CertCheck', CertCheckSchema);

// Middleware for JWT authentication
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });
    
    jwt.verify(token.split(' ')[1], JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

// Check SSL Certificate API
app.post('/check', authenticateToken, async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    
    try {
        const hostname = url.replace(/^https?:\/\//, '');
        const options = { hostname, port: 443, method: 'GET' };
        
        const reqTLS = https.request(options, (response) => {
            const cert = response.socket.getPeerCertificate();
            if (!cert || Object.keys(cert).length === 0) {
                return res.status(400).json({ error: 'No certificate found' });
            }
            const status = cert.valid_to ? 'Valid' : 'Invalid';
            
            const certCheck = new CertCheck({ url, status, validTo: cert.valid_to });
            certCheck.save();
            
            res.json({ url, status, validTo: cert.valid_to });
        });
        reqTLS.on('error', (err) => res.status(500).json({ error: err.message }));
        reqTLS.end();
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all check history
app.get('/history', authenticateToken, async (req, res) => {
    try {
        const history = await CertCheck.find().sort({ checkedAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get history by specific domain
app.get('/history/:url', authenticateToken, async (req, res) => {
    try {
        const { url } = req.params;
        const history = await CertCheck.find({ url }).sort({ checkedAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete history
app.delete('/history', authenticateToken, async (req, res) => {
    try {
        await CertCheck.deleteMany({});
        res.json({ message: 'History cleared' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Generate JWT token (for testing, ideally use proper auth)
app.post('/login', (req, res) => {
    const token = jwt.sign({ user: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
