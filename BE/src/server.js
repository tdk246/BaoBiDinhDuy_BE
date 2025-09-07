
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
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
const banners = [
	{ img: 'http://localhost:5000/static/banner1.jpg' },
	{ img: 'http://localhost:5000/static/banner2.jpg' },
	{ img: 'http://localhost:5000/static/banner3.jpg' }
];
const gallery = [
	{ img: 'http://localhost:5000/static/gallery1.jpg' },
	{ img: 'http://localhost:5000/static/gallery2.jpg' },
	{ img: 'http://localhost:5000/static/gallery3.jpg' }
];
const news = [
	{ title: 'Tin tức 1', summary: 'Nội dung tin tức 1', link: '#' },
	{ title: 'Tin tức 2', summary: 'Nội dung tin tức 2', link: '#' },
	{ title: 'Tin tức 3', summary: 'Nội dung tin tức 3', link: '#' }
];
app.get('/api/banner', (req, res) => res.json(banners));
app.get('/api/gallery', (req, res) => res.json(gallery));
app.get('/api/news', (req, res) => res.json(news));

app.use('/static', express.static(__dirname + '/../static'));

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
