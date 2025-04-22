const express = require('express');
const router = express.Router();
const { saveLog } = require('../controllers/log.controller');

// POST /api/logs
router.post('/', saveLog);

module.exports = router;