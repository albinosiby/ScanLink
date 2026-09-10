const express = require('express');
const { generateQr } = require('../controllers/qr.controller');

const router = express.Router();
router.post('/', generateQr);

module.exports = router;
