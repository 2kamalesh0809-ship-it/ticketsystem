const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @desc    Get dashboard analytics
// @route   GET /api/reports/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
    try {
        const totalTickets = await Ticket.countDocuments();
        const openTickets = await Ticket.countDocuments({ status: 'Open' });
        const inProgressTickets = await Ticket.countDocuments({ status: 'In Progress' });
        const highPriorityTickets = await Ticket.countDocuments({ priority: 'High' });
        const resolvedTickets = await Ticket.countDocuments({ status: { $in: ['Resolved', 'Closed'] } });

        // Calculate average resolution time
        const resolvedOrClosedTickets = await Ticket.find({
            status: { $in: ['Resolved', 'Closed'] }
        });

        let averageResolutionTime = 0;
        if (resolvedOrClosedTickets.length > 0) {
            const totalDuration = resolvedOrClosedTickets.reduce((acc, ticket) => {
                const duration = new Date(ticket.updatedAt) - new Date(ticket.createdAt);
                return acc + duration;
            }, 0);
            averageResolutionTime = (totalDuration / resolvedOrClosedTickets.length) / (1000 * 60 * 60);
        }

        // Status distribution for chart
        const statusDistribution = await Ticket.aggregate([
            { $group: { _id: "$status", value: { $sum: 1 } } },
            { $project: { name: "$_id", value: 1, _id: 0 } }
        ]);

        res.json({
            stats: {
                totalTickets,
                openTickets,
                inProgressTickets,
                highPriorityTickets,
                resolvedTickets,
                averageResolutionTime: averageResolutionTime.toFixed(2) + 'h'
            },
            statusDistribution
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get performance analytics for agents
// @route   GET /api/reports/performance
// @access  Private
router.get('/performance', protect, async (req, res) => {
    try {
        const performance = await Ticket.aggregate([
            {
                $group: {
                    _id: "$assignedMember",

                    assigned: { $sum: 1 },
                    closed: {
                        $sum: {
                            $cond: [{ $in: ["$status", ["Resolved", "Closed"]] }, 1, 0]
                        }
                    },
                    open: {
                        $sum: {
                            $cond: [{ $in: ["$status", ["Open", "In Progress"]] }, 1, 0]
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "agent"
                }
            },
            {
                $unwind: { path: "$agent", preserveNullAndEmptyArrays: true }
            },
            {
                $project: {
                    name: { $ifNull: ["$agent.name", "Unassigned"] },
                    assigned: 1,
                    closed: 1,
                    open: 1,
                    score: {
                        $cond: [
                            { $gt: ["$assigned", 0] },
                            { $multiply: [{ $divide: ["$closed", "$assigned"] }, 100] },
                            0
                        ]
                    }
                }
            },
            { $sort: { closed: -1 } }
        ]);

        res.json(performance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
