const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

const router = express.Router();

// Middleware to verify JWT token and extract user ID
function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Authorization token required' });

  try {
    const payload = jwt.verify(token, 'secretkey');
    req.userId = payload.id;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// POST: Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

  try {
    // Check if user already exists
    const existingUser = await req.app.locals.usersCollection.findOne({ username });
    console.log('Existing User Check:', existingUser);

    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashedPassword };
    console.log('New User to be Inserted:', user);

    // Insert the user into the collection
    const result = await req.app.locals.usersCollection.insertOne(user);
    console.log('Insert Result:', result);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ message: 'Error registering user', error: err });
  }
});

// POST: Login an existing user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });

  try {
    // Find the user by username
    const user = await req.app.locals.usersCollection.findOne({ username });
    console.log('User Found for Login:', user);

    if (!user) return res.status(404).json({ message: 'User not found' });

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(403).json({ message: 'Invalid password' });

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, username: user.username }, 'secretkey', { expiresIn: '2h' });
    console.log('Generated JWT Token:', token);

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

// GET: Retrieve user profile and order history (Protected)
router.get('/profile', verifyToken, async (req, res) => {
  try {
    // Find the user by ID extracted from the token
    const user = await req.app.locals.usersCollection.findOne({ _id: new ObjectId(req.userId) });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const orders = await req.app.locals.ordersCollection.find({ userId: req.userId }).toArray();
    console.log('User Profile and Orders:', { username: user.username, orders });

    res.json({ username: user.username, orders });
  } catch (err) {
    console.error('Error retrieving profile:', err);
    res.status(500).json({ message: 'Error retrieving profile', error: err });
  }
});

module.exports = router;
