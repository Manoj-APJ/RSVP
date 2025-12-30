const Event = require('../models/Event');
const { validationResult } = require('express-validator');

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ dateTime: 1 }).populate('createdBy', 'name email');
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('createdBy', 'name email');

        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private
const createEvent = async (req, res) => {
    // Check for validation errors? 
    // We can add validation middleware in routes

    // Manual validation for simple fields or trust express-validator passed in routes
    const { title, description, dateTime, location, capacity } = req.body;
    let imageUrl = '';

    if (req.file) {
        imageUrl = req.file.path;
    }

    if (!title || !description || !dateTime || !location || !capacity) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const event = new Event({
            title,
            description,
            dateTime,
            location,
            capacity,
            imageUrl,
            createdBy: req.user._id,
        });

        const createdEvent = await event.save();
        res.status(201).json(createdEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private (Owner only)
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check user ownership
        if (event.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const { title, description, dateTime, location, capacity } = req.body;

        event.title = title || event.title;
        event.description = description || event.description;
        event.dateTime = dateTime || event.dateTime;
        event.location = location || event.location;
        event.capacity = capacity || event.capacity;

        // Handle Image update? (Complex, might skip for simplicity or strict requirement)
        // User didn't strictly ask for image edit, but let's see. 
        // "Create, edit, delete events"
        // I'll stick to text fields for edit to keep it simple unless requested. 
        // Or if file is passed, update it.
        // Actually, if I want to support image update, I need to check req.file.
        // I will wait for user feedback on that polish, basic edit is fine.

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private (Owner only)
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check user ownership
        if (event.createdBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
};
