
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.set('trust proxy', true);
const PORT = process.env.PORT || 5000;

// Strict CORS: allow specific origins and handle preflight
const parseAllowedOrigins = (value) => (value || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const defaultOrigins = [
  'https://ctydinhduy.vercel.app',
  'http://localhost:3000'
];
const allowedOrigins = Array.from(new Set([
  ...defaultOrigins,
  ...parseAllowedOrigins(process.env.ALLOWED_ORIGINS)
]));
const corsOptions = {
  origin: function (origin, callback) {
    // Allow no-origin requests (mobile apps, curl) and allowed origins
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('CORS not allowed for origin: ' + origin));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,
  optionsSuccessStatus: 200
};
app.use((req, res, next) => { res.setHeader('Vary', 'Origin'); next(); });
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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
