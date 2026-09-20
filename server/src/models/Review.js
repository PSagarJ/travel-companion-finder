import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    tripId: { type: String, required: true },
    reviewerId: { type: String, required: true }, // who wrote the review
    reviewerName: { type: String },
    revieweeId: { type: String, required: true }, // who the review is about
    revieweeName: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

// One review per (reviewer, reviewee, trip) — resubmitting updates the
// existing review instead of stacking duplicates.
reviewSchema.index({ tripId: 1, reviewerId: 1, revieweeId: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;