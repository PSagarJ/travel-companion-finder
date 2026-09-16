import express from 'express';
import { getTopMatches } from '../controllers/matchController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/matches — always returns matches for the logged-in user,
// derived from their token. No userId in the URL to guess or spoof.
router.get('/', protect, getTopMatches);

export default router;