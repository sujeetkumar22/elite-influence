// server.js
require('dotenv').config();
// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Import bcrypt

const app = express();
const PORT = 3000;

// --- Middleware ---
const corsOptions = {
    origin: 'https://eliteinfluence.netlify.app',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json()); 

// --- MongoDB Connection ---
const dbURL = process.env.DB_URL;

mongoose.connect(dbURL)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));

// --- Mongoose Schemas & Models ---

// Campaign Model (existing)
const campaignSchema = new mongoose.Schema({
    title: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
});
const Campaign = mongoose.model('Campaign', campaignSchema);

// NEW: User Model
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['influencer', 'brand'], required: true }
});
const User = mongoose.model('User', userSchema);


// --- API Routes (Endpoints) ---

// Campaign Routes (existing)
app.get('/api/campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching campaigns' });
    }
});

app.post('/api/campaigns', async (req, res) => {
    const newCampaign = new Campaign(req.body);
    try {
        const savedCampaign = await newCampaign.save();
        res.status(201).json(savedCampaign);
    } catch (err) {
        res.status(400).json({ message: 'Error creating campaign', error: err.message });
    }
});

// NEW: Authentication Routes

// POST: Register a new user
app.post('/api/auth/register', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({ email, password: hashedPassword, role });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Server error during registration.', error: err.message });
    }
});

// POST: Log in a user
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        res.status(200).json({ message: 'Login successful!', user: { email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ message: 'Server error during login.', error: err.message });
    }
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});