import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET: Fetch a single user's public profile
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    // We use .select('-password') to ensure we NEVER send the password hash to the frontend
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// PUT: Update the logged-in user's own matchmaking profile (travel style,
// interests, destination wishlist). Only ever updates req.user's own
// record — there's no userId in the URL to spoof.
router.put('/me', protect, async (req, res) => {
  try {
    const { travelStyle, vibeBadges, preferredDestinations } = req.body;
    const allowedStyles = ['Backpacker', 'Luxury', 'Budget', 'Adventure', 'Chill'];
    const update = {};

    if (travelStyle !== undefined) {
      if (!allowedStyles.includes(travelStyle)) {
        return res.status(400).json({ message: 'Invalid travel style' });
      }
      update.travelStyle = travelStyle;
    }

    // Trim, drop empties, and cap list length so this can't be abused to
    // store unbounded data on a user document
    if (Array.isArray(vibeBadges)) {
      update.vibeBadges = vibeBadges
        .map((badge) => String(badge).trim())
        .filter(Boolean)
        .slice(0, 10);
    }

    if (Array.isArray(preferredDestinations)) {
      update.preferredDestinations = preferredDestinations
        .map((dest) => String(dest).trim())
        .filter(Boolean)
        .slice(0, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, update, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

export default router;