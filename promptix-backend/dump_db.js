const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const dumpTickets = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const tickets = await db.collection('tickets').find().toArray();
        console.log("Raw Tickets in DB:");
        console.log(JSON.stringify(tickets, null, 2));

        const customers = await db.collection('customers').find().toArray();
        console.log("Raw Customers in DB:");
        console.log(JSON.stringify(customers, null, 2));

        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
};

dumpTickets();
