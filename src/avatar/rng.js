/**
 * Seeded Random Number Generator
 * 
 * Provides deterministic randomness for procedural avatar generation.
 * Uses Mulberry32 algorithm for fast, high-quality pseudo-random numbers.
 */

/**
 * Mulberry32 PRNG - Fast, high-quality seeded random number generator
 * @param {number} seed - Numeric seed value
 * @returns {Function} Function that returns next random number [0, 1)
 */
export function mulberry32(seed) {
  let state = seed;
  
  return function() {
    let t = state += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Create seeded RNG from string seed
 * @param {string|number} seed - String seed (will be hashed to number)
 * @returns {Function} Function that returns next random number [0, 1)
 */
export function seededRNG(seed) {
  const numericSeed = typeof seed === 'number' 
    ? seed 
    : hashString(seed);
  
  return mulberry32(numericSeed);
}

/**
 * Hash string to number
 * @param {string} str - String to hash
 * @returns {number} Numeric hash
 */
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash) || 1;
}

/**
 * Generate jitter value for subtle randomness
 * @param {Function} rng - Random number generator function
 * @param {number} range - Maximum jitter range
 * @returns {number} Jitter value in range [-range/2, range/2]
 */
export function jitter(rng, range) {
  return (rng() - 0.5) * range;
}

/**
 * Pick random item from array
 * @param {Function} rng - Random number generator function
 * @param {Array} items - Array of items to pick from
 * @returns {*} Randomly selected item
 */
export function pick(rng, items) {
  if (items.length === 0) {
    throw new Error('Cannot pick from empty array');
  }
  return items[Math.floor(rng() * items.length)];
}

/**
 * Pick random item with weights
 * @param {Function} rng - Random number generator function
 * @param {Array<[*, number]>} weightedItems - Array of [item, weight] tuples
 * @returns {*} Randomly selected item based on weights
 */
export function pickWeighted(rng, weightedItems) {
  if (weightedItems.length === 0) {
    throw new Error('Cannot pick from empty weighted array');
  }
  
  const totalWeight = weightedItems.reduce((sum, [, weight]) => sum + weight, 0);
  let random = rng() * totalWeight;
  
  for (const [item, weight] of weightedItems) {
    random -= weight;
    if (random <= 0) {
      return item;
    }
  }
  
  // Fallback to last item
  return weightedItems[weightedItems.length - 1][0];
}

/**
 * Generate random integer in range [min, max)
 * @param {Function} rng - Random number generator function
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (exclusive)
 * @returns {number} Random integer
 */
export function randomInt(rng, min, max) {
  return Math.floor(rng() * (max - min)) + min;
}

/**
 * Generate random float in range [min, max)
 * @param {Function} rng - Random number generator function
 * @param {number} min - Minimum value (inclusive)
 * @param {number} max - Maximum value (exclusive)
 * @returns {number} Random float
 */
export function randomFloat(rng, min, max) {
  return rng() * (max - min) + min;
}
