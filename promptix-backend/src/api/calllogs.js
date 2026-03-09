const express = require('express');
const router = express.Router();
const { getCallLogs, createCallLog, getCallLogById } = require('../controllers/callLogsController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

// @desc    Get all call logs
// @route   GET /api/calllogs
// @access  Private
router.get('/', protect, getCallLogs);

// @desc    Get specific call log
// @route   GET /api/calllogs/:id
// @access  Private
router.get('/:id', protect, getCallLogById);

// @desc    Create new call log with recording upload
// @route   POST /api/calllogs
// @access  Private
router.post('/', protect, upload.single('recordingFile'), createCallLog);

module.exports = router;
