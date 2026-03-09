const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const Customer = require('../models/Customer');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { generateTicketId } = require('../utils/generateTicketId');


// @desc    Get all tickets
// @route   GET /api/tickets
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const tickets = await Ticket.find()
            .populate('customerId', 'name email phone')
            .populate('assignedMember', 'name email role')
            .sort({ createdAt: -1 });

        if (tickets.length > 0) {
            console.log('Sample ticket populated customer:', tickets[0].customerId);
        }

        res.json(tickets);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get specific ticket by ID or ticketId
// @route   GET /api/tickets/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id)
            .populate('customerId', 'name email phone')
            .populate('assignedMember', 'name email role');

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        res.json(ticket);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Create new ticket
// @route   POST /api/tickets
// @access  Private
router.post('/', protect, async (req, res) => {
    let { customerId, customerName, customerEmail, customerPhone, subject, description, priority, category, assignedMember } = req.body;

    try {
        // If customerId is not provided, try to find or create customer
        if (!customerId) {
            if (!customerName || !customerEmail) {
                return res.status(400).json({ message: 'Customer details (Name and Email) are required if no customer is selected' });
            }

            let customer = await Customer.findOne({ email: customerEmail.toLowerCase() });

            if (!customer) {
                customer = new Customer({
                    name: customerName,
                    email: customerEmail.toLowerCase(),
                    phone: customerPhone || 'N/A'
                });
                await customer.save();
            }
            customerId = customer._id;
        }

        if (!customerId || !subject || !description || !priority) {
            return res.status(400).json({ message: 'Major missing fields' });
        }

        const ticketId = await generateTicketId();

        const ticket = new Ticket({
            ticketId,
            customerId,
            subject,
            description,
            priority,
            category: category || 'General',
            assignedMember: assignedMember || null,
            history: [{
                action: 'Ticket Created',
                user: req.user.name,
                details: 'Initial support request registered'
            }]
        });

        const createdTicket = await ticket.save();

        // Return populated
        const populated = await Ticket.findById(createdTicket._id)
            .populate('customerId', 'name email phone')
            .populate('assignedMember', 'name email role');

        res.status(201).json(populated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update ticket
// @route   PUT /api/tickets/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);

        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        ticket.status = req.body.status || ticket.status;
        ticket.priority = req.body.priority || ticket.priority;
        ticket.assignedMember = req.body.assignedMember || ticket.assignedMember;
        ticket.category = req.body.category || ticket.category;
        ticket.description = req.body.description || ticket.description;
        ticket.subject = req.body.subject || ticket.subject;

        const updatedTicket = await ticket.save();

        const populated = await Ticket.findById(updatedTicket._id)
            .populate('customerId', 'name email phone')
            .populate('assignedMember', 'name email role');

        res.json(populated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Delete ticket
// @route   DELETE /api/tickets/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        await ticket.deleteOne();
        res.json({ message: 'Ticket removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Add note to ticket
router.post('/:id/notes', protect, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        const note = {
            text: req.body.text,
            author: req.user.name,
            createdAt: new Date()
        };

        ticket.notes.unshift(note);
        await ticket.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Add history event
router.post('/:id/history', protect, async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

        const historyItem = {
            action: req.body.action,
            user: req.user.name,
            details: req.body.details,
            createdAt: new Date()
        };

        ticket.history.unshift(historyItem);
        await ticket.save();
        res.json(historyItem);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
