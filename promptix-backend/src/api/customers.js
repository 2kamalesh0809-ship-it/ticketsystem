const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Ticket = require('../models/Ticket');
const { protect } = require('../middleware/auth');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });
        res.json(customers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get customer profile with ticket history
// @route   GET /api/customers/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        // Fetch ticket history for this customer
        const tickets = await Ticket.find({ customerId: customer._id }).sort({ createdAt: -1 });

        // Fetch call logs for these tickets
        const CallLog = require('../models/CallLog');
        const callLogs = await CallLog.find({
            ticketId: { $in: tickets.map(t => t._id) }
        }).populate('agentId', 'name').sort({ createdAt: -1 });

        res.json({
            ...customer._doc,
            tickets,
            callLogs
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
router.post('/', protect, async (req, res) => {
    const { name, phone, email, company } = req.body;

    try {
        const customerExists = await Customer.findOne({ email });

        if (customerExists) {
            return res.status(400).json({ message: 'Customer with this email already exists' });
        }

        const customer = new Customer({
            name,
            phone,
            email,
            company
        });

        const createdCustomer = await customer.save();
        res.status(201).json(createdCustomer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Update customer details
// @route   PUT /api/customers/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        customer.name = req.body.name || customer.name;
        customer.phone = req.body.phone || customer.phone;
        customer.email = req.body.email || customer.email;
        customer.company = req.body.company || customer.company;

        const updatedCustomer = await customer.save();
        res.json(updatedCustomer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        await customer.deleteOne();
        res.json({ message: 'Customer removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
