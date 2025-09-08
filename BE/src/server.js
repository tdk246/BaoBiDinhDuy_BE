
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT || 5000;

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

// Các API mẫu (có thể xoá nếu dùng MongoDB cho CRUD)
const news = [
	{ title: 'Tin tức 1', summary: 'Nội dung tin tức 1', link: '#' },
	{ title: 'Tin tức 2', summary: 'Nội dung tin tức 2', link: '#' },
	{ title: 'Tin tức 3', summary: 'Nội dung tin tức 3', link: '#' }
];
app.get('/api/news', (req, res) => res.json(news));

app.use('/static', express.static(__dirname + '/../static'));

// Helper to get public base (useful when behind proxy or custom domain)
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok' });
});

// Ensure upload directory exists
try {
  const uploadDir = path.join(__dirname, '../../static/gallery');
  fs.mkdirSync(uploadDir, { recursive: true });
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
