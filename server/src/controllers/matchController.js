import User from '../models/User.js';
import { calculateCosineSimilarity } from '../utils/matchmaking.js';

// Helper function: Convert a user's traits into a multi-dimensional array
const vectorizeUser = (user) => {
  // We map the single travel style to a 2D profile: [BudgetLevel, AdventureLevel]
  const styleProfiles = {
    'Backpacker': [1, 5], // Ultra-low budget, maximum adventure
    'Budget':     [2, 3], // Low budget, medium adventure
    'Adventure':  [3, 5], // Mid budget, maximum adventure
    'Chill':      [4, 1], // High budget, minimum adventure (relaxing)
    'Luxury':     [5, 1]  // Max budget, minimum adventure (resorts)
  };
  
  // Default to a middle-ground profile if something goes wrong
  const profile = styleProfiles[user.travelStyle] || [3, 3]; 

  // Now returning a 2D vector! e.g., [3, 5]
  return profile; 
};

export const getTopMatches = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Find the current user asking for matches
    const currentUser = await User.findById(userId);
    if (!currentUser) return res.status(404).json({ message: 'User not found' });

    // 2. Find everyone else in the database
    const allOtherUsers = await User.find({ _id: { $ne: userId } });

    // 3. Convert the current user into a math vector
    const currentUserVector = vectorizeUser(currentUser);

    // 4. Calculate similarity for everyone else
    const matches = allOtherUsers.map(targetUser => {
      const targetVector = vectorizeUser(targetUser);
      const similarityScore = calculateCosineSimilarity(currentUserVector, targetVector);
      
      return {
        user: {
          _id: targetUser._id,
          name: targetUser.name,
          travelStyle: targetUser.travelStyle
        },
        matchPercentage: (similarityScore * 100).toFixed(1) // Convert to percentage
      };
    });

    // 5. Sort matches from highest percentage to lowest
    matches.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.status(200).json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};