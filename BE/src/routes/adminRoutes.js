const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/login', adminController.login);
router.post('/create', adminController.createAdmin); // Tạo tài khoản admin mới

module.exports = router;
