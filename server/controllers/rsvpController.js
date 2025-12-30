const RSVP = require('../models/RSVP');
const Event = require('../models/Event');

// @desc    RSVP to an event
// @route   POST /api/rsvp/:eventId
// @access  Private
const rsvpEvent = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user._id;

    try {
        // 1. Check if user already RSVPed
        const existingRSVP = await RSVP.findOne({ userId, eventId });
        if (existingRSVP) {
            return res.status(400).json({ message: 'You have already RSVPed to this event' });
        }

        // 2. Fetch event to check existence (optional, but good for error msg)
        // Optimization: We can do it in the atomic update query, but checking strict existence first helps clarity.
        // However, to be truly concurrent, we rely on the atomic update result.

        // 3. ATOMIC UPDATE: Decrement capacity or Increment attendeesCount ONLY IF valid
        // We use attendeesCount < capacity condition.
        const event = await Event.findOneAndUpdate(
            { _id: eventId, $expr: { $lt: ['$attendeesCount', '$capacity'] } },
            { $inc: { attendeesCount: 1 } },
            { new: true }
        );

        // Note: $expr with $lt comparison of fields is handy if capacity is dynamic per doc. 
        // If query was just `attendeesCount: { $lt: 50 }`, it works if 50 is constant. 
        // Since capacity is a field, we might need $expr or just retrieve capacity first?
        // Actually, `attendeesCount: { $lt: capacity }` isn't valid mongo syntax for field comparison in query.
        // We must find the event first to get capacity? No, that introduces race condition.
        // If we trust capacity doesn't change atomically often, we can use $where or $expr.
        // $expr allows usage of aggregation expressions in find.

        if (!event) {
            // Either event doesn't exist OR it is full
            const checkEvent = await Event.findById(eventId);
            if (!checkEvent) {
                return res.status(404).json({ message: 'Event not found' });
            }
            return res.status(400).json({ message: 'Event is full' });
        }

        // 4. Create RSVP Record
        try {
            await RSVP.create({ userId, eventId });
            res.status(201).json({ message: 'RSVP successful' });
        } catch (error) {
            // Rollback if RSVP creation fails (e.g. unique index violation if race condition slipped somehow, 
            // though create should fail if existingRSVP check passed but another req came in? Valid.)
            // Or generic DB error.
            await Event.findByIdAndUpdate(eventId, { $inc: { attendeesCount: -1 } });
            console.error(error);
            if (error.code === 11000) {
                return res.status(400).json({ message: 'You have already RSVPed to this event' });
            }
            res.status(500).json({ message: 'Server error during RSVP creation' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Cancel RSVP
// @route   DELETE /api/rsvp/:eventId
// @access  Private
const cancelRSVP = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user._id;

    try {
        const rsvp = await RSVP.findOneAndDelete({ userId, eventId });

        if (!rsvp) {
            return res.status(404).json({ message: 'RSVP not found' });
        }

        // Decrement attendees count
        await Event.findByIdAndUpdate(eventId, { $inc: { attendeesCount: -1 } });

        res.json({ message: 'RSVP cancelled' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Check if user RSVPed
// @route   GET /api/rsvp/:eventId/check
// @access  Private
const checkRSVPStatus = async (req, res) => {
    const { eventId } = req.params;
    const userId = req.user._id;

    try {
        const rsvp = await RSVP.findOne({ userId, eventId });
        res.json({ hasRSVPed: !!rsvp });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    rsvpEvent,
    cancelRSVP,
    checkRSVPStatus,
};
