const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');

router.get('/', bannerController.getAll);
router.post('/', bannerController.create);
router.put('/:id', bannerController.update);
router.delete('/:id', bannerController.delete);

module.exports = router;
