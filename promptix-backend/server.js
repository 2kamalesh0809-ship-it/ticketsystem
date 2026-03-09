const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Enable JSON body parsing
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Enable CORS
app.use(cors());

// Connect to MongoDB
connectDB();

// Static file access for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./src/api/auth'));
app.use('/api/tickets', require('./src/api/tickets'));
app.use('/api/external', require('./src/api/external'));
app.use('/api/customers', require('./src/api/customers'));
app.use('/api/users', require('./src/api/users'));
app.use('/api/calllogs', require('./src/api/calllogs'));
app.use('/api/reports', require('./src/api/reports'));
app.use('/api/notifications', require('./src/api/notifications'));

// Test Route
app.get('/', (req, res) => {
    res.send('Promptix Backend API Running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
