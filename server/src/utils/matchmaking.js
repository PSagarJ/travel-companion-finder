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

// Measures overlap between two lists (e.g. preferred destinations, vibe
// badges) as intersection-over-union, bounded 0–1. Two people who've each
// listed nothing in common get 0, not a false-positive full score.
export const jaccardSimilarity = (listA = [], listB = []) => {
  if (listA.length === 0 || listB.length === 0) return 0;

  const setA = new Set(listA.map((item) => item.toLowerCase().trim()));
  const setB = new Set(listB.map((item) => item.toLowerCase().trim()));

  const intersectionSize = [...setA].filter((item) => setB.has(item)).length;
  const unionSize = new Set([...setA, ...setB]).size;

  return unionSize === 0 ? 0 : intersectionSize / unionSize;
};