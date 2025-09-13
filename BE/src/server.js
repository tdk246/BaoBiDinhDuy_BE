const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.set("trust proxy", true);

// Upload dir
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, "../static/gallery");

// ===== CORS CONFIG =====
const allowedOrigins = [
  "http://localhost:3000",
  "https://ctydinhduy.vercel.app/" // domain frontend trên Vercel
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization"
  })
);

app.use(express.json());

// ===== CONNECT MONGODB =====
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error("MongoDB connection error:", err));

const bannerRoutes = require("./routes/bannerRoutes");
const galleryRoutes = require("./routes/galleryRoutes");
const newsRoutes = require("./routes/newsRoutes");
const adminRoutes = require("./routes/adminRoutes");

app.use("/api/banner", bannerRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/admin", adminRoutes);

// ===== STATIC FILES =====
// Ảnh cần commit sẵn vào repo (ví dụ thư mục /static hoặc /public)
app.use("/static", express.static(path.join(__dirname, "../static")));
app.use("/static/gallery", express.static(UPLOAD_DIR));
app.use("/img", express.static(path.join(__dirname, "../static"))); // serve images under /img

// Health check
app.get("/healthz", (req, res) => res.json({ status: "ok" }));

// Ensure upload dir
try {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
} catch (e) {
  console.error("Failed to ensure upload directory:", e);
}

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Xuất ra để Vercel dùng
module.exports = app;
