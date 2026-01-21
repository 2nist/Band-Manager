/**
 * SeededRandom - Deterministic random number generator
 * 
 * Ensures reproducible music generation with same seed + game state.
 * Uses simple LCG algorithm (Linear Congruential Generator) for speed.
 */

export class SeededRandom {
  constructor(seed = '') {
    // Convert seed string to number
    this.seed = this._hashSeed(seed);
    this.current = this.seed;
  }

  /**
   * Convert string seed to number
   */
  _hashSeed(seed) {
    if (typeof seed === 'number') return seed;
    
    let hash = 0;
    const str = String(seed);
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return Math.abs(hash) || 12345;
  }

  /**
   * Generate next random number (0-1)
   * Uses LCG: X(n+1) = (a * X(n) + c) mod m
   */
  next() {
    // Standard LCG parameters
    const a = 1664525;
    const c = 1013904223;
    const m = 2147483648; // 2^31
    
    this.current = (a * this.current + c) % m;
    return this.current / m;
  }

  /**
   * Generate integer within range [min, max)
   */
  nextInt(min, max) {
    return Math.floor(this.next() * (max - min) + min);
  }

  /**
   * Reset to seed
   */
  reset() {
    this.current = this.seed;
  }
}

export default SeededRandom;
