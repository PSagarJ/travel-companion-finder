import express from 'express';
import { createReview, getUserReviews, getMyReviewsForTrip } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public: a user's reputation is visible on their profile to anyone
router.get('/user/:userId', getUserReviews);

// Protected: must be logged in to submit a review or check your own submissions
router.post('/', protect, createReview);
router.get('/trip/:tripId', protect, getMyReviewsForTrip);

export default router;