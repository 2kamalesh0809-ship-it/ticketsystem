const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const seedUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const name = 'Admin User';
        const email = 'admin@promptix.com';
        const password = 'Password@123';
        const role = 'Admin';

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('User already exists');
            process.exit();
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();
        console.log('Admin user created successfully!');
        console.log('Email:', email);
        console.log('Password:', password);

        process.exit();
    } catch (error) {
        console.error('Error seeding user:', error);
        process.exit(1);
    }
};

seedUser();
