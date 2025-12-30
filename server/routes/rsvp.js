const express = require('express');
const router = express.Router();
const { rsvpEvent, cancelRSVP, checkRSVPStatus } = require('../controllers/rsvpController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:eventId/check', protect, checkRSVPStatus);
router.post('/:eventId', protect, rsvpEvent);
router.delete('/:eventId', protect, cancelRSVP);

module.exports = router;
