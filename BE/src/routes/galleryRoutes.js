const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const galleryController = require('../controllers/galleryController');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const dir = path.join(__dirname, '../../static/gallery');
		try {
			fs.mkdirSync(dir, { recursive: true });
			cb(null, dir);
		} catch (e) {
			cb(e);
		}
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	}
});
const upload = multer({ storage });

// API upload ảnh gallery
router.post('/upload', upload.single('image'), (req, res, next) => {
	if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
	const envBase = process.env.PUBLIC_BASE_URL;
	const baseUrl = envBase && envBase.startsWith('http') ? envBase : `${req.protocol}://${req.get('host')}`;
	const filePath = `/static/gallery/${req.file.filename}`;
	try {
		res.json({ url: `${baseUrl}${filePath}`, path: filePath });
	} catch (e) {
		next(e);
	}
});

router.get('/', galleryController.getAll);
router.post('/', galleryController.create);
router.delete('/:id', galleryController.delete);

module.exports = router;
