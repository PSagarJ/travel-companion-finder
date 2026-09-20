import User from '../models/User.js';
import { calculateCosineSimilarity, jaccardSimilarity } from '../utils/matchmaking.js';

// Maps each travel style to a [budgetLevel, adventureLevel] profile, so two
// styles can be compared by direction/magnitude rather than treated as an
// all-or-nothing exact match.
const STYLE_PROFILES = {
  Backpacker: [1, 5], // Ultra-low budget, maximum adventure
  Budget: [2, 3],      // Low budget, medium adventure
  Adventure: [3, 5],   // Mid budget, maximum adventure
  Chill: [4, 1],       // High budget, minimum adventure (relaxing)
  Luxury: [5, 1],      // Max budget, minimum adventure (resorts)
};

const vectorizeStyle = (user) => STYLE_PROFILES[user.travelStyle] || [3, 3];

// Weighted multi-factor formula. Style alone is a blunt signal (only 5
// possible values), so it's weighted evenly alongside two richer factors —
// actual shared destinations and shared interests — rather than treated as
// the dominant score on its own.
const WEIGHTS = {
  style: 0.35,
  destinations: 0.35,
  interests: 0.3,
};

export const getTopMatches = async (req, res) => {
  try {
    // The requesting user's identity comes from their verified token, not
    // a URL param — otherwise anyone could fetch anyone else's matches by
    // just changing the ID in the request.
    const userId = req.user.id;

    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    const allOtherUsers = await User.find({ _id: { $ne: userId } });

    const currentStyleVector = vectorizeStyle(currentUser);
    const currentDestinations = currentUser.preferredDestinations || [];
    const currentBadges = currentUser.vibeBadges || [];

    const matches = allOtherUsers.map((targetUser) => {
      const targetDestinations = targetUser.preferredDestinations || [];
      const targetBadges = targetUser.vibeBadges || [];

      // Factor 1: travel style compatibility
      const styleScore = Math.max(
        0,
        calculateCosineSimilarity(currentStyleVector, vectorizeStyle(targetUser)),
      );

      // Factor 2: overlap between each person's destination wishlist
      const destinationScore = jaccardSimilarity(currentDestinations, targetDestinations);
      const sharedDestinations = currentDestinations.filter((dest) =>
        targetDestinations.some((td) => td.toLowerCase() === dest.toLowerCase()),
      );

      // Factor 3: overlap between each person's vibe badges/interests
      const interestScore = jaccardSimilarity(currentBadges, targetBadges);
      const sharedBadges = currentBadges.filter((badge) =>
        targetBadges.some((tb) => tb.toLowerCase() === badge.toLowerCase()),
      );

      const weightedScore =
        styleScore * WEIGHTS.style +
        destinationScore * WEIGHTS.destinations +
        interestScore * WEIGHTS.interests;

      return {
        user: {
          _id: targetUser._id,
          name: targetUser.name,
          travelStyle: targetUser.travelStyle,
          vibeBadges: targetUser.vibeBadges,
        },
        matchPercentage: (weightedScore * 100).toFixed(1),
        sharedDestinations,
        // Per-factor breakdown so the UI can explain *why* this is a match,
        // not just show a number.
        breakdown: {
          travelStyle: {
            score: Math.round(styleScore * 100),
            label:
              styleScore > 0.9
                ? 'Very similar travel style'
                : styleScore > 0.6
                  ? 'Compatible travel style'
                  : 'Different travel style',
          },
          destinations: {
            score: Math.round(destinationScore * 100),
            sharedCount: sharedDestinations.length,
            shared: sharedDestinations,
          },
          interests: {
            score: Math.round(interestScore * 100),
            sharedCount: sharedBadges.length,
            shared: sharedBadges,
          },
        },
      };
    });

    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};