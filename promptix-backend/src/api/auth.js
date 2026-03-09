const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`);

    try {
        // 1. Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`User not found: ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 2. Compare password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log(`Password mismatch for: ${email}`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // 3. Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        console.log(`Login successful for: ${email}`);

        // 4. Return token and user information
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const { protect } = require('../middleware/auth');
router.get('/profile', protect, async (req, res) => {
    res.json(req.user);
});

// @desc    Register a new user (Admin only)
// @route   POST /api/auth/register
// @access  Private/Admin
router.post('/register', protect, async (req, res) => {
    // Only admins can register new users
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Not authorized as an admin' });
    }

    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'Support Member'
        });

        const createdUser = await user.save();

        res.status(201).json({
            id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            role: createdUser.role
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

