const express = require('express');
const router = express.Router();
const {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getDashboardEvents,
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/').get(getEvents).post(protect, upload.single('image'), createEvent);
router.route('/dashboard').get(protect, getDashboardEvents);
router
    .route('/:id')
    .get(getEventById)
    .put(protect, upload.single('image'), updateEvent)
    .delete(protect, deleteEvent);

module.exports = router;
