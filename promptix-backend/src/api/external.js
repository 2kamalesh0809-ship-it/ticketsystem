const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Customer = require('../models/Customer');
const { generateTicketId } = require('../utils/generateTicketId');
const { createNotification } = require('../utils/notifications');

// Middleware to validate API Key
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-support-api-key'];
    if (!apiKey || apiKey !== process.env.SUPPORT_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }
    next();
};

// @desc    Create new ticket from external website
// @route   POST /api/external/create-ticket
// @access  Public (with API Key)
router.post('/create-ticket', validateApiKey, async (req, res) => {
    const { name, email, phone, subject, message, source } = req.body;

    // STEP 1 - Validation
    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!message) return res.status(400).json({ error: 'Message is required' });

    try {
        // STEP 2 - Customer Logic
        let customer = await Customer.findOne({ email: email.toLowerCase() });

        if (!customer) {
            customer = new Customer({
                name,
                email: email.toLowerCase(),
                phone: phone || 'N/A'
            });
            await customer.save();
        }

        // STEP 3 - Generate Ticket ID
        const ticketId = await generateTicketId();

        // STEP 4 - Create Ticket
        const ticket = new Ticket({
            ticketId,
            customerId: customer._id,
            subject: subject || 'Website Inquiry',
            description: message,
            priority: 'Medium',
            status: 'Open',
            source: 'Website',
            history: [{
                action: 'Ticket Created',
                user: 'System (Website)',
                details: 'Ticket generated from mrcoach.in support form'
            }]
        });

        await ticket.save();

        // STEP 5 - Notification
        await createNotification({
            userId: 'staff',
            title: 'New Website Ticket',
            message: `A new inquiry from ${name} was submitted via mrcoach.in (Ticket: ${ticket.ticketId})`,
            type: 'New Ticket',
            relatedId: ticket.ticketId
        });

        // STEP 6 - Success Response
        res.status(201).json({
            success: true,
            ticketId: ticket.ticketId,
            message: 'Support ticket created successfully'
        });

    } catch (error) {
        console.error('External Ticket Creation Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
