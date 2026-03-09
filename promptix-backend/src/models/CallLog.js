const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
    callId: {
        type: String,
        required: true,
        unique: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    },
    agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Inbound', 'Outbound'],
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    summary: {
        type: String
    },
    recordingUrl: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('CallLog', callLogSchema);
