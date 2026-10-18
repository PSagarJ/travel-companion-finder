import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 1. REGISTER A NEW USER
export const register = async (req, res) => {
  try {
    const { name, email, password, travelStyle } = req.body;

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Input validation
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 60) {
      return res.status(400).json({ message: 'Name must be between 2 and 60 characters.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim()) || email.length > 100) {
      return res.status(400).json({ message: 'A valid email address is required.' });
    }

    if (!password || typeof password !== 'string' || password.length < 6 || password.length > 128) {
      return res.status(400).json({ message: 'Password must be between 6 and 128 characters.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Guard against anything outside the schema's allowed values reaching Mongoose
    const allowedTravelStyles = ['Backpacker', 'Luxury', 'Budget', 'Adventure', 'Chill'];
    const safeTravelStyle = allowedTravelStyles.includes(travelStyle) ? travelStyle : 'Chill';

    // Hash the password so it's safely encrypted
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      travelStyle: safeTravelStyle,
    });
    await newUser.save();

    // Create a JWT token for the user session
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, travelStyle: newUser.travelStyle }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// 2. LOGIN USER
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Guard against NoSQL injection objects or missing values
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, travelStyle: user.travelStyle }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Server error during login' });
  }
};