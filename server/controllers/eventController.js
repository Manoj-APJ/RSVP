const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
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
            return res.status(403).json({ message: 'You are not authorized to modify this event' });
        }

        const { title, description, dateTime, location, capacity } = req.body;

        // Validate required fields (FormData always sends all fields, so we check for empty values)
        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Title cannot be empty' });
        }
        if (!description || !description.trim()) {
            return res.status(400).json({ message: 'Description cannot be empty' });
        }
        if (!dateTime) {
            return res.status(400).json({ message: 'Date and time is required' });
        }
        if (!location || !location.trim()) {
            return res.status(400).json({ message: 'Location cannot be empty' });
        }
        if (!capacity || isNaN(capacity) || parseInt(capacity) < 1) {
            return res.status(400).json({ message: 'Capacity must be a positive number' });
        }

        // Update all fields
        event.title = title.trim();
        event.description = description.trim();
        event.dateTime = dateTime;
        event.location = location.trim();
        event.capacity = parseInt(capacity);

        // Handle image update if new image is provided
        if (req.file) {
            event.imageUrl = req.file.path;
        }

        const updatedEvent = await event.save();
        const populatedEvent = await Event.findById(updatedEvent._id).populate('createdBy', 'name email');
        res.json(populatedEvent);
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
            return res.status(403).json({ message: 'You are not authorized to delete this event' });
        }

        // Delete all related RSVPs
        await RSVP.deleteMany({ eventId: event._id });

        // Delete the event
        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get dashboard events (upcoming, created, registered)
// @route   GET /api/events/dashboard
// @access  Private
const getDashboardEvents = async (req, res) => {
    try {
        const userId = req.user._id;
        const currentDate = new Date();

        // 1. Get upcoming events (dateTime >= current date)
        const upcomingEvents = await Event.find({
            dateTime: { $gte: currentDate }
        }).sort({ dateTime: 1 }).populate('createdBy', 'name email');

        // 2. Get events created by the user (any date)
        const createdEvents = await Event.find({
            createdBy: userId
        }).sort({ dateTime: -1 }).populate('createdBy', 'name email');

        // 3. Get events the user has registered for (any date)
        const userRSVPs = await RSVP.find({ userId }).select('eventId');
        const registeredEventIds = userRSVPs.map(rsvp => rsvp.eventId);
        const registeredEvents = await Event.find({
            _id: { $in: registeredEventIds }
        }).sort({ dateTime: -1 }).populate('createdBy', 'name email');

        // 4. Combine all events and deduplicate by _id
        const allEventsMap = new Map();

        // Add upcoming events
        upcomingEvents.forEach(event => {
            allEventsMap.set(event._id.toString(), event.toObject());
        });

        // Add created events (will overwrite if already exists, keeping the same data)
        createdEvents.forEach(event => {
            allEventsMap.set(event._id.toString(), event.toObject());
        });

        // Add registered events (will overwrite if already exists)
        registeredEvents.forEach(event => {
            allEventsMap.set(event._id.toString(), event.toObject());
        });

        // 5. Convert map to array and add isRegistered flag
        const registeredEventIdsStr = registeredEventIds.map(id => id.toString());
        const allEvents = Array.from(allEventsMap.values()).map(event => {
            const isRegistered = registeredEventIdsStr.includes(event._id.toString());
            return {
                ...event,
                isRegistered
            };
        });

        res.json(allEvents);
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
    getDashboardEvents,
};
