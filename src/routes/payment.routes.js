const express = require('express');
const { createNew } = require('../controllers/payment.controller');
const router = express.Router();

// POST /api/payment
router.post('', createNew);

module.exports = router;