const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const connectDB = require('./db');
const KodUser = require('./models/KodUser');
const UserToken = require('./models/UserToken');

const app = express();

// Connect to MongoDB
connectDB();

app.use(cors({
    origin: true,
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkodbankkey';

// Registration Route
app.post('/api/auth/register', async (req, res) => {
    try {
        const { uid, username, email, password, phone } = req.body;
        // The role is only allowed to be 'Customer'
        const role = 'Customer';
        // Default balance is 100000
        const defaultBalance = 100000;

        if (!uid || !username || !email || !password || !phone) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        const existingUser = await KodUser.findOne({ $or: [{ username }, { email }, { uid }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User (uid, username or email) already exists' });
        }

        // Encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into MongoDB KodUser collection
        const newUser = new KodUser({
            uid,
            username,
            email,
            password: hashedPassword,
            balance: defaultBalance,
            phone,
            role
        });

        await newUser.save();

        res.status(201).json({ message: 'Registration successful', uid: newUser.uid });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Registration failed or user already exists (database error)' });
    }
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Fetch user from MongoDB
        const user = await KodUser.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT Token
        // Use username as Subject, and role as Claim
        const payload = {
            role: user.role
        };
        const signOptions = {
            subject: user.username,
            expiresIn: '1h' // Token expiry 1 hour
        };
        const token = jwt.sign(payload, JWT_SECRET, signOptions);

        // Calculate expiry date for database (current time + 1 hour)
        const expiryDate = new Date(Date.now() + 60 * 60 * 1000);

        // Store JWT token in MongoDB UserToken collection
        const newToken = new UserToken({
            token,
            uid: user.uid,
            expiry: expiryDate
        });
        await newToken.save();

        // Send token to client (store in cookie)
        res.cookie('token', token, {
            httpOnly: false, // For easier access in this project, ideally should be true
            secure: false, // Since it's HTTP locally
            maxAge: 3600000,
            sameSite: 'Lax'
        });

        res.status(200).json({ message: 'Login successful', token, role: user.role, username: user.username });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Check Balance Route
app.get('/api/auth/balance', async (req, res) => {
    try {
        let token = req.cookies.token;
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ error: 'Access denied: No token provided' });
        }

        // Verify token signature and expiry
        jwt.verify(token, JWT_SECRET, async (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Token expired' });
                }
                return res.status(401).json({ error: 'Invalid token' });
            }

            // Extract username from token (Subject)
            const username = decoded.sub;

            // Fetch balance from MongoDB
            const user = await KodUser.findOne({ username });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({ balance: user.balance });
        });
    } catch (error) {
        console.error('Balance check error:', error);
        res.status(500).json({ error: 'Server error while checking balance' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
