const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const galleryController = require('../controllers/galleryController');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../../static/gallery'));
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	}
});
const upload = multer({ storage });

// API upload ảnh gallery
router.post('/upload', upload.single('image'), (req, res) => {
	const PORT = process.env.PORT || 5000;
	if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
	const fileUrl = `http://localhost:${PORT}/static/gallery/${req.file.filename}`;
	res.json({ url: fileUrl });
});

router.get('/', galleryController.getAll);
router.post('/', galleryController.create);
router.delete('/:id', galleryController.delete);

module.exports = router;
