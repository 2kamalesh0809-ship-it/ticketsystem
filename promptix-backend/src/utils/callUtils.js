const CallLog = require('../models/CallLog');

/**
 * Generates a unique call ID in the format CL-1001, CL-1002, etc.
 */
const generateCallId = async () => {
    const lastCall = await CallLog.findOne().sort({ createdAt: -1 });

    let nextId = 1001;

    if (lastCall && lastCall.callId) {
        const lastIdMatch = lastCall.callId.match(/\d+/);
        if (lastIdMatch) {
            nextId = parseInt(lastIdMatch[0]) + 1;
        }
    }

    return `CL-${nextId}`;
};

module.exports = { generateCallId };
