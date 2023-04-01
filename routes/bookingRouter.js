const express = require('express');
const { sessionPaymant } = require('../controllers/bookingControl');
const { protect } = require('../controllers/authControl');
const router = express.Router();
router.get('/checkout-session/:tourID', protect, sessionPaymant);

module.exports = router;
