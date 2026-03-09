const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const db = mongoose.connection.db;
        const tickets = await db.collection('tickets').find().toArray();

        console.log(`Checking ${tickets.length} tickets for migration...`);

        for (const ticket of tickets) {
            let update = {};

            if (typeof ticket.customerId === 'string') {
                update.customerId = new mongoose.Types.ObjectId(ticket.customerId);
            }

            if (ticket.assignedMember && typeof ticket.assignedMember === 'string') {
                update.assignedMember = new mongoose.Types.ObjectId(ticket.assignedMember);
            }

            if (Object.keys(update).length > 0) {
                await db.collection('tickets').updateOne({ _id: ticket._id }, { $set: update });
                console.log(`Migrated ticket ${ticket.ticketId}`);
            }
        }

        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
};

migrate();
