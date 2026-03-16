const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const dbName = mongoose.connection.db.databaseName;
        console.log(`MongoDB Connected to database: ${dbName}`);
    } catch (error) {
        console.error("Database connection failed");
        process.exit(1);
    }
};

module.exports = connectDB;
