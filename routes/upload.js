const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const { uploadMiddleware, uploadAudio } = require('../controllers/uploadController');

const router = express.Router();

router.post('/upload/audio', authMiddleware, uploadMiddleware, uploadAudio);

module.exports = router;