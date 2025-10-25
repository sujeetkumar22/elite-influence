// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3000;

// --- Middleware ---
app.use(cors()); 
app.use(express.json()); 

// --- Configuration ---
// IMPORTANT: Replace this with a long, random string in production!
const JWT_SECRET = 'your_super_secret_key_that_is_very_long';

// --- MongoDB Connection ---
const dbURI = 'mongodb+srv://sujeetk382016:teejus321@cluster0.lrflccz.mongodb.net/?appName=Cluster0';

mongoose.connect(dbURI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Failed to connect to MongoDB', err));

// --- Mongoose Schemas & Models ---

// User Model (NEW)
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['influencer', 'company'] },
});
const User = mongoose.model('User', userSchema);

// Campaign Model (Unchanged)
const campaignSchema = new mongoose.Schema({
    title: { type: String, required: true },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    // We can link it to the company that posted it (NEW)
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Campaign = mongoose.model('Campaign', campaignSchema);


// --- Authentication Middleware (NEW) ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (token == null) {
        return res.status(401).json({ message: 'No token provided' }); // Unauthorized
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token is invalid' }); // Forbidden
        }
        req.user = user; // Add the user payload to the request object
        next(); // Move on to the next function (the route handler)
    });
};


// --- Auth API Routes (NEW) ---

// POST: Register a new user
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashedPassword,
            role,
        });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user' });
    }
});

// POST: Login a user
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Create JWT token
        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: user.role
        };
        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' }); // Token lasts for 1 hour
        
        res.json({ token, role: user.role });
    } catch (err) {
        console.error("REGISTRATION ERROR:", err); 
        // ---------------------
        res.status(500).json({ message: 'Error registering user' });
    }
});


// --- Campaign API Routes (UPDATED) ---

// GET: Fetch all campaigns (Stays public)
app.get('/api/campaigns', async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching campaigns' });
    }
});

// POST: Create a new campaign (NOW PROTECTED)
app.post('/api/campaigns', authenticateToken, async (req, res) => {
    // Thanks to middleware, we know the user is logged in.
    // Now, let's check if they have the 'company' role.
    if (req.user.role !== 'company') {
        return res.status(403).json({ message: 'Forbidden: Only companies can post campaigns' });
    }
    
    const { title, brand, description } = req.body;
    
    const newCampaign = new Campaign({
        title,
        brand,
        description,
        company: req.user.id // Link the campaign to the logged-in user
    });

    try {
        const savedCampaign = await newCampaign.save();
        res.status(201).json(savedCampaign);
    } catch (err) {
        res.status(400).json({ message: 'Error creating campaign' });
    }
});


// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});