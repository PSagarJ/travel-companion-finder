import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// GET: Fetch a single user's public profile
router.get('/:id', async (req, res) => {
  try {
    // We use .select('-password') to ensure we NEVER send the password hash to the frontend
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

export default router;