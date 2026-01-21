/**
 * PatternAnalyzer - Base analysis utilities for music patterns
 * 
 * Provides common analysis functions used across drum, harmony, and melody processors.
 * These functions extract musical characteristics that inform constraint-based selection.
 */

export class PatternAnalyzer {
  /**
   * Calculate rhythmic density (notes per beat average)
   * @param {Array<number>} beats - Array of beat positions
   * @param {number} totalBeats - Total beats in pattern (e.g., 4 for 4/4)
   * @returns {number} Density score 0-1
   */
  static calculateRhythmicDensity(beats, totalBeats = 4) {
    if (!beats || beats.length === 0) return 0;
    return Math.min(1, beats.length / (totalBeats * 4)); // Max 4 notes per beat
  }

  /**
   * Calculate energy curve across pattern
   * @param {Object} pattern - Pattern with beat arrays (kick, snare, hihat, etc.)
   * @param {number} totalBeats - Total beats in pattern
   * @returns {Array<number>} Energy level at each beat position (0-1)
   */
  static calculateEnergyCurve(pattern, totalBeats = 4) {
    const curve = [];
    const beatResolution = 16; // 16th note resolution
    
    for (let i = 0; i < totalBeats * beatResolution; i++) {
      const time = i / beatResolution;
      let energy = 0;
      
      // Count hits at this time position (with small tolerance)
      Object.values(pattern).forEach(beats => {
        if (Array.isArray(beats)) {
          beats.forEach(beat => {
            if (Math.abs(beat - time) < 0.1) {
              energy += 0.3; // Each hit contributes energy
            }
          });
        }
      });
      
      curve.push(Math.min(1, energy));
    }
    
    return curve;
  }

  /**
   * Detect swing factor in timing
   * @param {Array<number>} beats - Array of beat positions
   * @returns {number} Swing factor 0-1 (0 = straight, 1 = heavy swing)
   */
  static detectSwingFactor(beats) {
    if (!beats || beats.length < 4) return 0;
    
    // Look for uneven spacing in off-beats
    let swingScore = 0;
    let offBeatCount = 0;
    
    for (let i = 0; i < beats.length - 1; i++) {
      const beat = beats[i];
      const nextBeat = beats[i + 1];
      
      // Check if this is an off-beat position
      const beatPosition = beat % 1;
      if (beatPosition > 0.1 && beatPosition < 0.9) {
        const interval = nextBeat - beat;
        // Swing typically has longer first interval, shorter second
        if (interval > 0.3 && interval < 0.7) {
          swingScore += 0.2;
        }
        offBeatCount++;
      }
    }
    
    return offBeatCount > 0 ? Math.min(1, swingScore / offBeatCount) : 0;
  }

  /**
   * Calculate complexity score
   * @param {Object} pattern - Pattern object
   * @returns {number} Complexity 0-1
   */
  static calculateComplexity(pattern) {
    let complexity = 0;
    
    // Count total hits
    let totalHits = 0;
    Object.values(pattern).forEach(beats => {
      if (Array.isArray(beats)) {
        totalHits += beats.length;
      }
    });
    
    // More hits = more complex
    complexity += Math.min(0.4, totalHits / 50);
    
    // Check for polyrhythmic elements (multiple simultaneous hits)
    const timeMap = new Map();
    Object.values(pattern).forEach(beats => {
      if (Array.isArray(beats)) {
        beats.forEach(beat => {
          const rounded = Math.round(beat * 4) / 4;
          timeMap.set(rounded, (timeMap.get(rounded) || 0) + 1);
        });
      }
    });
    
    // Count simultaneous hits
    let simultaneousHits = 0;
    timeMap.forEach(count => {
      if (count > 1) simultaneousHits += count - 1;
    });
    complexity += Math.min(0.3, simultaneousHits / 20);
    
    // Check for irregular spacing
    const allBeats = [];
    Object.values(pattern).forEach(beats => {
      if (Array.isArray(beats)) {
        allBeats.push(...beats);
      }
    });
    allBeats.sort((a, b) => a - b);
    
    if (allBeats.length > 2) {
      const intervals = [];
      for (let i = 1; i < allBeats.length; i++) {
        intervals.push(allBeats[i] - allBeats[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((sum, interval) => {
        return sum + Math.pow(interval - avgInterval, 2);
      }, 0) / intervals.length;
      
      complexity += Math.min(0.3, variance * 10);
    }
    
    return Math.min(1, complexity);
  }

  /**
   * Identify fill opportunities (places where fills can occur)
   * @param {Object} pattern - Pattern object
   * @param {number} totalBeats - Total beats in pattern
   * @returns {Array<number>} Beat positions suitable for fills
   */
  static identifyFillOpportunities(pattern, totalBeats = 4) {
    const fills = [];
    
    // Fills typically occur at phrase boundaries (every 4 beats)
    for (let i = 3; i < totalBeats; i += 4) {
      fills.push(i);
    }
    
    // Also check for sparse sections (good fill opportunities)
    const energyCurve = this.calculateEnergyCurve(pattern, totalBeats);
    energyCurve.forEach((energy, index) => {
      const beat = index / 4;
      if (energy < 0.3 && beat % 1 === 0 && beat > 0) {
        fills.push(beat);
      }
    });
    
    return [...new Set(fills)].sort((a, b) => a - b);
  }

  /**
   * Identify humanization targets (beats that benefit from timing variation)
   * @param {Object} pattern - Pattern object
   * @returns {Array<number>} Beat positions for humanization
   */
  static identifyHumanizationSpots(pattern) {
    const spots = [];
    
    // Off-beats and ghost notes benefit from humanization
    Object.values(pattern).forEach(beats => {
      if (Array.isArray(beats)) {
        beats.forEach(beat => {
          const beatPosition = beat % 1;
          if (beatPosition > 0.1 && beatPosition < 0.9) {
            spots.push(beat);
          }
        });
      }
    });
    
    return [...new Set(spots)].sort((a, b) => a - b);
  }

  /**
   * Identify showoff moments (places for skilled players to embellish)
   * @param {Object} pattern - Pattern object
   * @param {number} totalBeats - Total beats in pattern
   * @returns {Array<number>} Beat positions for embellishment
   */
  static identifyShowoffOpportunities(pattern, totalBeats = 4) {
    const opportunities = [];
    
    // End of phrases (every 4 beats)
    for (let i = 3.5; i < totalBeats; i += 4) {
      opportunities.push(i);
    }
    
    // High energy sections
    const energyCurve = this.calculateEnergyCurve(pattern, totalBeats);
    energyCurve.forEach((energy, index) => {
      if (energy > 0.7) {
        opportunities.push(index / 4);
      }
    });
    
    return [...new Set(opportunities)].sort((a, b) => a - b);
  }

  /**
   * Identify simplification-safe beats (can be removed for low skill)
   * @param {Object} pattern - Pattern object
   * @returns {Array<number>} Beat positions that can be simplified
   */
  static identifySimplificationSafeBeats(pattern) {
    const safe = [];
    
    // Ghost notes and off-beat hihats can be simplified
    if (pattern.ghostSnare) {
      pattern.ghostSnare.forEach(beat => safe.push(beat));
    }
    
    // Off-beat hihats
    if (pattern.hihat) {
      pattern.hihat.forEach(beat => {
        const beatPosition = beat % 1;
        if (beatPosition > 0.1 && beatPosition < 0.9) {
          safe.push(beat);
        }
      });
    }
    
    return [...new Set(safe)].sort((a, b) => a - b);
  }
}

export default PatternAnalyzer;
