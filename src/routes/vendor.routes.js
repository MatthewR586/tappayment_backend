const express = require('express');
const router = express.Router();
const { getVendor } = require('../controllers/vendor.controller');

// GET /api/vendor?address=param
router.get('', getVendor);

module.exports = router;