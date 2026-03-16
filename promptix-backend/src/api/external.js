const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Ticket = require('../models/Ticket');
const Customer = require('../models/Customer');
const { generateTicketId } = require('../utils/generateTicketId');
const { createNotification } = require('../utils/notifications');

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads/ticket-attachments';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

// Middleware to validate API Key
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-support-api-key'];
    if (!apiKey || apiKey !== process.env.SUPPORT_API_KEY) {
        return res.status(401).json({ error: 'Unauthorized: Invalid API Key' });
    }
    next();
};

// Helper to handle client ticket creation logic
async function processClientTicket(data, res) {
    const { name, email, phone, subject, message } = data;

    if (!name) return res.status(400).json({ error: 'Name is required' });
    if (!email) return res.status(400).json({ error: 'Email is required' });
    if (!message) return res.status(400).json({ error: 'Message is required' });

    try {
        const normalizedEmail = email.toLowerCase();
        let customer = await Customer.findOne({ email: normalizedEmail });

        if (!customer) {
            customer = new Customer({
                name,
                email: normalizedEmail,
                phone: phone || 'N/A'
            });
            await customer.save();
        }

        const ticketId = await generateTicketId();

        const ticket = new Ticket({
            ticketId,
            customerId: customer._id,
            userType: 'Client',
            source: 'Website',
            subject: subject || 'Website Inquiry',
            description: message,
            priority: 'Medium',
            status: 'Open',
            history: [{
                action: 'Ticket Created',
                user: 'System (Website)',
                details: 'Ticket generated from mrcoach.in support form'
            }]
        });

        await ticket.save();

        await createNotification({
            userId: 'staff',
            title: 'New Client Ticket',
            message: `A new inquiry from ${name} was submitted via Website (Ticket: ${ticket.ticketId})`,
            type: 'New Ticket',
            relatedId: ticket.ticketId
        });

        return res.status(201).json({
            success: true,
            ticketId: ticket.ticketId,
            message: 'Support ticket created successfully'
        });

    } catch (error) {
        console.error('External Ticket Creation Error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
}

// @desc    Create backward compatible ticket
router.post('/create-ticket', validateApiKey, async (req, res) => {
    return processClientTicket(req.body, res);
});

// @desc    Create new client ticket from external website
// @route   POST /api/external/client-ticket
router.post('/client-ticket', validateApiKey, async (req, res) => {
    return processClientTicket(req.body, res);
});

// @desc    Create new coach ticket from external app
// @route   POST /api/external/coach-ticket
router.post('/coach-ticket', validateApiKey, upload.array('attachments'), async (req, res) => {
    const { coachId, coachName, subject, description, priority, gdriveLink, metadata } = req.body;

    if (!coachId) return res.status(400).json({ error: 'Coach ID is required' });
    if (!coachName) return res.status(400).json({ error: 'Coach Name is required' });
    if (!description) return res.status(400).json({ error: 'Description is required' });

    try {
        const ticketId = await generateTicketId();

        // Handle uploaded files
        let uploadedFiles = [];
        if (req.files && req.files.length > 0) {
            uploadedFiles = req.files.map(file => `/uploads/ticket-attachments/${file.filename}`);
        }

        const ticket = new Ticket({
            ticketId,
            userType: 'Coach',
            source: 'Coach App',
            coachId,
            coachName,
            gdriveLink: gdriveLink || '',
            metadata: metadata ? JSON.parse(metadata) : {},
            attachments: uploadedFiles,
            subject: subject || 'Coach App Issue',
            description,
            priority: priority || 'Medium',
            status: 'Open',
            history: [{
                action: 'Ticket Created',
                user: 'System (Coach App)',
                details: 'Ticket generated from Coach App'
            }]
        });

        await ticket.save();

        await createNotification({
            userId: 'staff',
            title: 'New Coach Ticket',
            message: `A new issue from Coach ${coachName} was submitted via App (Ticket: ${ticket.ticketId})`,
            type: 'New Ticket',
            relatedId: ticket.ticketId
        });

        res.status(201).json({
            success: true,
            ticketId: ticket.ticketId,
            message: 'Coach ticket created successfully'
        });

    } catch (error) {
        console.error('External Coach Ticket Creation Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
