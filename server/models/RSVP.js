const mongoose = require('mongoose');

const rsvpSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
}, {
    timestamps: true,
});

// Enforce unique compound index to prevent duplicate RSVPs at DB level
rsvpSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const RSVP = mongoose.model('RSVP', rsvpSchema);

module.exports = RSVP;
