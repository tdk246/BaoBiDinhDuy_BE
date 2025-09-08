const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const galleryController = require('../controllers/galleryController');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use memory storage; we'll stream to Cloudinary
const upload = multer({ storage: multer.memoryStorage() });

// API upload ảnh gallery
router.post('/upload', upload.single('image'), async (req, res, next) => {
	if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

	try {
		const uploadStream = cloudinary.uploader.upload_stream(
			{ folder: process.env.CLOUDINARY_FOLDER || 'dinhduy/gallery' },
			(error, result) => {
				if (error) return next(error);
				return res.json({ url: result.secure_url, public_id: result.public_id });
			}
		);
		streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
	} catch (e) {
		next(e);
	}
});

router.get('/', galleryController.getAll);
router.post('/', galleryController.create);
router.delete('/:id', galleryController.delete);

module.exports = router;
