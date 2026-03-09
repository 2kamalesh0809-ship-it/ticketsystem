const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const User = require('./src/models/User');

const listUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, '-password');
        console.log("Registered Users:");
        users.forEach(u => console.log(`- ${u.name} (${u.email}) [Role: ${u.role}]`));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listUsers();
