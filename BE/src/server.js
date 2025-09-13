const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.set('trust proxy', true);

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../static/gallery');

// CORS
app.use(cors());
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    const origin = req.headers.origin || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.sendStatus(204);
  }
  next();
});
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => console.log('MongoDB connected!'))
	.catch(err => console.error('MongoDB connection error:', err));

// Routes
const bannerRoutes = require('../src/routes/bannerRoutes');
const galleryRoutes = require('../src/routes/galleryRoutes');
const newsRoutes = require('../src/routes/newsRoutes');
const adminRoutes = require('../src/routes/adminRoutes');

app.use('/api/banner', bannerRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/admin', adminRoutes);

// Static
app.use('/static', express.static(path.join(__dirname, '../static')));
app.use('/static/gallery', express.static(UPLOAD_DIR));

// Health check
app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

// Ensure upload dir
try {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
} catch (e) {
  console.error('Failed to ensure upload directory:', e);
}

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app; 
