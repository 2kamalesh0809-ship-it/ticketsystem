const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const createUser = async () => {
    // Get arguments from command line
    const args = process.argv.slice(2);

    if (args.length < 4) {
        console.log('Usage: node createUser.js "<name>" <email> <password> <role>');
        console.log('Roles: Admin, Manager, Support Member');
        console.log('Example: node createUser.js "John Doe" john@promptix.com Password123 "Support Member"');
        process.exit(1);
    }

    const [name, email, password, role] = args;

    try {
        await mongoose.connect(process.env.MONGO_URI);

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log(`Error: User with email ${email} already exists.`);
            process.exit(1);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();
        console.log('-----------------------------------');
        console.log('User Created Successfully!');
        console.log(`Name:     ${name}`);
        console.log(`Email:    ${email}`);
        console.log(`Role:     ${role}`);
        console.log('-----------------------------------');

        process.exit(0);
    } catch (error) {
        console.error('Error creating user:', error);
        process.exit(1);
    }
};

createUser();
