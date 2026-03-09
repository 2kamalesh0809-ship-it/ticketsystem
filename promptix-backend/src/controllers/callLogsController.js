const CallLog = require('../models/CallLog');
const { generateCallId } = require('../utils/callUtils');
const path = require('path');

// @desc    Get all call logs
// @route   GET /api/calllogs
// @access  Private
exports.getCallLogs = async (req, res) => {
    try {
        const callLogs = await CallLog.find()
            .populate('customerId', 'name email phone')
            .populate('ticketId', 'ticketId subject status')
            .populate('agentId', 'name email role')
            .sort({ createdAt: -1 });
        res.json(callLogs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get single call log
// @route   GET /api/calllogs/:id
// @access  Private
exports.getCallLogById = async (req, res) => {
    try {
        const callLog = await CallLog.findById(req.params.id)
            .populate('customerId', 'name email phone')
            .populate('ticketId', 'ticketId subject status')
            .populate('agentId', 'name email role');

        if (!callLog) {
            return res.status(404).json({ message: 'Call log not found' });
        }

        res.json(callLog);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Create new call log with recording
// @route   POST /api/calllogs
// @access  Private
exports.createCallLog = async (req, res) => {
    try {
        const { customerId, ticketId, type, duration, summary } = req.body;

        if (!customerId || !type || !duration) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const callId = await generateCallId();

        let recordingUrl = null;
        if (req.file) {
            // Static file access logic
            recordingUrl = `/uploads/call-recordings/${req.file.filename}`;
        }

        const callLog = new CallLog({
            callId,
            customerId,
            ticketId: ticketId || null,
            agentId: req.user._id,
            type,
            duration: Number(duration),
            summary,
            recordingUrl
        });

        const createdCallLog = await callLog.save();

        // Populate and return
        const populated = await CallLog.findById(createdCallLog._id)
            .populate('customerId', 'name email phone')
            .populate('ticketId', 'ticketId subject status')
            .populate('agentId', 'name email role');

        res.status(201).json(populated);
    } catch (error) {
        console.error('Create call log error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
