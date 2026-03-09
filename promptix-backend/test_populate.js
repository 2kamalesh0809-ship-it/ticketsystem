const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const Ticket = require('./src/models/Ticket');
const Customer = require('./src/models/Customer');
const User = require('./src/models/User');

const testPopulate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const tickets = await Ticket.find()
            .populate('customerId', 'name email phone')
            .populate('assignedMember', 'name email role');

        console.log("Population Results:");
        tickets.forEach(t => {
            console.log(`Ticket ID: ${t.ticketId}`);
            console.log(`- Customer ID Raw: ${t.customerId?._id || 'null'}`);
            console.log(`- Customer Name: ${t.customerId?.name || 'NOT POPULATED'}`);
            console.log(`- Agent Name: ${t.assignedMember?.name || 'NOT POPULATED'}`);
        });

        process.exit(0);
    } catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
};

testPopulate();
