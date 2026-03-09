const Ticket = require('../models/Ticket');

/**
 * Generates a unique ticket ID in the format TCK-1001, TCK-1002, etc.
 */
const generateTicketId = async () => {
    const lastTicket = await Ticket.findOne().sort({ createdAt: -1 });

    let nextId = 1001;

    if (lastTicket && lastTicket.ticketId) {
        const lastIdMatch = lastTicket.ticketId.match(/\d+/);
        if (lastIdMatch) {
            nextId = parseInt(lastIdMatch[0]) + 1;
        }
    }

    return `TCK-${nextId}`;
};

module.exports = { generateTicketId };
