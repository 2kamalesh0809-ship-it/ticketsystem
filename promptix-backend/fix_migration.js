const mongoose = require('mongoose');
require('dotenv').config();

const SOURCE_URI = 'mongodb+srv://kamalesh0809:Geethaamma0809@cluster0.nrlmzup.mongodb.net/test?appName=Cluster0';
const DEST_URI = process.env.MONGO_URI || 'mongodb+srv://kamalesh0809:Geethaamma0809@cluster0.nrlmzup.mongodb.net/PROMPTIX?appName=Cluster0';

async function migrate() {
    try {
        console.log('--- Moving data from "test" to "PROMPTIX" ---');

        // Connect to MongoDB
        const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
        const destConn = await mongoose.createConnection(DEST_URI).asPromise();

        const collections = ['users', 'customers', 'tickets', 'calllogs', 'notifications'];

        for (const colName of collections) {
            const sourceCol = sourceConn.db.collection(colName);
            const destCol = destConn.db.collection(colName);

            const docs = await sourceCol.find({}).toArray();
            console.log(`\nChecking ${colName}: Found ${docs.length} documents in "test" database.`);

            if (docs.length > 0) {
                let insertedCount = 0;
                for (const doc of docs) {
                    // Check if document already exists in destination
                    const existing = await destCol.findOne({ _id: doc._id });
                    if (!existing) {
                        await destCol.insertOne(doc);
                        insertedCount++;
                    }
                }
                console.log(`Successfully moved ${insertedCount} NEW documents to "PROMPTIX".`);
            }
        }

        console.log('\n--- Migration Finished ---');
        await sourceConn.close();
        await destConn.close();
        process.exit(0);
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
}

migrate();
