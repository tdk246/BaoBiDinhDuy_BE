
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '../../static/gallery');

// Permissive CORS: allow all origins and handle preflight automatically
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dinhduy', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(() => console.log('MongoDB connected!'))
	.catch(err => console.error('MongoDB connection error:', err));

// Banner, Gallery, News routes
const bannerRoutes = require('./routes/bannerRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const newsRoutes = require('./routes/newsRoutes');
app.use('/api/banner', bannerRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/news', newsRoutes);

// Admin routes
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);

// Removed sample /api/news to avoid conflicts; using real routes above

app.use('/static', express.static(__dirname + '/../static'));
// Serve uploaded files from configurable directory under /static/gallery
app.use('/static/gallery', express.static(UPLOAD_DIR));

// Helper to get public base (useful when behind proxy or custom domain)
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok' });
});

// Ensure upload directory exists
try {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
} catch (e) {
  console.error('Failed to ensure upload directory:', e);
}

// JSON error handler (avoid HTML error pages)
// Must be AFTER routes/middlewares
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
