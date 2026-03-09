const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        console.log("Collections in current database:");
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`- ${col.name}: ${count} documents`);
        }

        const admin = db.admin();
        const dbs = await admin.listDatabases();
        console.log("All Databases on server:");
        dbs.databases.forEach(d => console.log(`- ${d.name}`));

        process.exit(0);
    } catch (error) {
        console.error("Check failed:", error);
        process.exit(1);
    }
};

checkDB();
