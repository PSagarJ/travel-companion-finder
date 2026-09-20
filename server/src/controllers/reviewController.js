import Review from '../models/Review.js';
import Trip from '../models/TripModel.js';
import User from '../models/User.js';
import { deriveTripStatus } from '../utils/tripStatus.js';

const isTripMember = (trip, userId) =>
  trip.creatorId === userId || trip.approvedMembers.some((m) => m.userId === userId);

// POST: Submit (or update) a review for a fellow trip member. Only allowed
// once the trip has actually completed, and only between two people who
// were genuinely both on that trip.
export const createReview = async (req, res) => {
  try {
    const { tripId, revieweeId, rating, comment } = req.body;
    const reviewerId = req.user.id;

    if (!tripId || !revieweeId || rating === undefined) {
      return res.status(400).json({ message: 'tripId, revieweeId, and rating are required.' });
    }
    if (reviewerId === revieweeId) {
      return res.status(400).json({ message: "You can't review yourself." });
    }

    const parsedRating = Number(rating);
    if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (deriveTripStatus(trip) !== 'Completed') {
      return res.status(400).json({ message: 'You can only leave reviews after a trip is completed.' });
    }

    if (!isTripMember(trip, reviewerId)) {
      return res.status(403).json({ message: 'You were not a member of this trip.' });
    }
    if (!isTripMember(trip, revieweeId)) {
      return res.status(400).json({ message: 'That person was not a member of this trip.' });
    }

    const [reviewerUser, revieweeUser] = await Promise.all([
      User.findById(reviewerId).select('name'),
      User.findById(revieweeId).select('name'),
    ]);

    // upsert: resubmitting a review for the same person on the same trip
    // updates it in place rather than creating a duplicate
    const review = await Review.findOneAndUpdate(
      { tripId, reviewerId, revieweeId },
      {
        tripId,
        reviewerId,
        reviewerName: reviewerUser ? reviewerUser.name : 'Traveler',
        revieweeId,
        revieweeName: revieweeUser ? revieweeUser.name : 'Traveler',
        rating: parsedRating,
        comment,
      },
      { upsert: true, new: true, runValidators: true },
    );

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error saving review', error: error.message });
  }
};

// GET: Public reputation for a user — their average rating and every
// review written about them
export const getUserReviews = async (req, res) => {
  try {
    const { userId } = req.params;
    const reviews = await Review.find({ revieweeId: userId }).sort({ createdAt: -1 });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : null;

    res.status(200).json({
      reviews,
      averageRating,
      reviewCount: reviews.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// GET: Reviews the logged-in user has already submitted for a specific
// trip — lets the UI show which crew members are already rated
export const getMyReviewsForTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const reviews = await Review.find({ tripId, reviewerId: req.user.id });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trip reviews', error: error.message });
  }
};