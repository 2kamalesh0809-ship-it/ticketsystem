const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        required: true,
        unique: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    userType: {
        type: String,
        default: 'Client'
    },
    coachId: {
        type: String
    },
    coachName: {
        type: String
    },
    gdriveLink: {
        type: String
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Waiting for Customer', 'Resolved', 'Closed'],
        default: 'Open'
    },
    category: {
        type: String
    },
    source: {
        type: String,
        default: 'Manual'
    },
    assignedMember: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    tags: [{
        type: String
    }],
    attachments: [{
        type: String
    }],
    notes: [{
        text: String,
        author: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    history: [{
        action: String,
        user: String,
        details: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]

}, {
    timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);
