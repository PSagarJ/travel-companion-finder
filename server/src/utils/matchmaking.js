// Calculate the dot product of two vectors
const dotProduct = (vecA, vecB) => {
  return vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
};

// Calculate the magnitude (length) of a vector
const magnitude = (vec) => {
  return Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
};

// The main Cosine Similarity function
export const calculateCosineSimilarity = (userVector, targetVector) => {
  const dotProd = dotProduct(userVector, targetVector);
  const magA = magnitude(userVector);
  const magB = magnitude(targetVector);

  if (magA === 0 || magB === 0) return 0; // Prevent division by zero
  
  return dotProd / (magA * magB);
};