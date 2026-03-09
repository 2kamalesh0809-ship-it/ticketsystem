const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    company: {
        type: String,
        trim: true
    }

}, {
    timestamps: { createdAt: true, updatedAt: false }
});

module.exports = mongoose.model('Customer', customerSchema);
