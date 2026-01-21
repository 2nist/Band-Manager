/**
 * HarmonyEngine - Chordonomicon-based progression generation
 * 
 * Aggressively filters chord progressions by mode, valence, era, and
 * complexity. Applies gameplay constraints to select and customize
 * progressions based on band confidence, label pressure, and audience.
 */

import { SeededRandom } from '../utils/SeededRandom';

export class HarmonyEngine {
  // Curated chord progressions categorized by characteristics
  static PROGRESSIONS = {
    major: {
      happy: [
        { chords: ['C', 'G', 'Am', 'F'], name: 'vi-IV-I-V', catchiness: 0.9, familiarity: 0.95, era: 'classic' },
        { chords: ['I', 'V', 'vi', 'IV'], name: 'pop-progression', catchiness: 0.95, familiarity: 0.98, era: 'modern' },
        { chords: ['C', 'Am', 'F', 'G'], name: 'i-vi-IV-V', catchiness: 0.85, familiarity: 0.9, era: 'classic' },
      ],
      triumphant: [
        { chords: ['C', 'F', 'C', 'G'], name: 'power-progression', catchiness: 0.8, familiarity: 0.75, era: 'rock' },
        { chords: ['I', 'IV', 'V', 'I'], name: 'heroic-movement', catchiness: 0.75, familiarity: 0.8, era: 'classic' },
      ],
      complex: [
        { chords: ['C', 'Em7', 'Am7', 'Dm7', 'G7'], name: 'jazz-standard', catchiness: 0.5, familiarity: 0.6, complexity: 'high' },
        { chords: ['CM7', 'Bm7b5', 'E7', 'Am'], name: 'modal-interchange', catchiness: 0.4, familiarity: 0.5, complexity: 'high' },
      ]
    },
    minor: {
      melancholic: [
        { chords: ['Am', 'F', 'C', 'G'], name: 'minor-classic', catchiness: 0.85, familiarity: 0.9, era: 'classic' },
        { chords: ['Em', 'Am', 'D', 'G'], name: 'folk-minor', catchiness: 0.75, familiarity: 0.8, era: 'folk' },
      ],
      dark: [
        { chords: ['Am', 'G', 'F', 'E'], name: 'descending-minor', catchiness: 0.7, familiarity: 0.75, darkness: 0.8 },
        { chords: ['Em', 'Bb', 'F#m', 'B'], name: 'tritone-walk', catchiness: 0.5, familiarity: 0.4, darkness: 0.95 },
      ],
      complex: [
        { chords: ['Am(maj7)', 'Bbmaj7', 'Am(maj7)', 'Gm7'], name: 'advanced-modal', catchiness: 0.4, familiarity: 0.3, complexity: 'high' },
      ]
    },
    mixolydian: {
      funky: [
        { chords: ['D', 'D', 'A', 'D'], name: 'dominant-groove', catchiness: 0.8, familiarity: 0.7, genre: 'funk' },
      ]
    },
    dorian: {
      sultry: [
        { chords: ['Dm', 'G', 'Dm', 'A'], name: 'dorian-groove', catchiness: 0.75, familiarity: 0.6, genre: 'jazz' },
      ]
    }
  };

  // Genre-specific chord preferences
  static GENRE_PREFERENCES = {
    rock: { modes: ['major', 'minor'], complexity: 'medium', riskTaking: 0.6 },
    punk: { modes: ['major'], complexity: 'simple', riskTaking: 0.8, simplicity: 0.9 },
    funk: { modes: ['mixolydian', 'dorian'], complexity: 'high', riskTaking: 0.7, groove: 0.9 },
    metal: { modes: ['minor'], complexity: 'high', darkness: 0.9, riskTaking: 0.9 },
    folk: { modes: ['major', 'minor'], complexity: 'simple', familiarity: 0.9 },
    jazz: { modes: ['dorian', 'mixolydian'], complexity: 'high', sophistication: 0.9 },
    pop: { modes: ['major'], complexity: 'simple', catchiness: 0.95, familiarity: 0.9 },
    indie: { modes: ['major', 'minor'], complexity: 'medium', originality: 0.8 }
  };

  /**
   * Generate chord progression based on constraints
   * @param {Object} constraints - Constraints from ConstraintEngine
   * @param {string} genre - Genre to generate for
   * @param {string} seed - Random seed for reproducibility
   * @returns {Object} Generated progression
   */
  static generate(constraints, genre = 'rock', seed = '') {
    const rng = new SeededRandom(seed);
    
    // Get genre preferences
    const genrePrefs = this.GENRE_PREFERENCES[genre] || this.GENRE_PREFERENCES.rock;
    
    // Select mode based on genre and emotional state
    const mode = this._selectMode(genrePrefs, constraints, rng);
    
    // Filter progressions by mode and constraints
    let candidates = this._filterProgressions(mode, constraints, genrePrefs, rng);
    
    if (candidates.length === 0) {
      // Fallback if no progressions match
      const allModes = this.PROGRESSIONS[mode] || {};
      const allProgs = Object.values(allModes).flat();
      candidates = allProgs;
    }
    
    // Weight and select progression
    const progression = this._selectProgression(candidates, constraints, rng);
    
    // Customize based on band psychology
    const customized = this._customizeProgression(progression, constraints, rng);
    
    return {
      progression: customized,
      mode,
      genre,
      timestamp: Date.now()
    };
  }

  /**
   * Select mode based on genre and emotion
   */
  static _selectMode(genrePrefs, constraints, rng) {
    const { psychConstraints = {} } = constraints;
    const { depression = 0, paranoia = 0 } = psychConstraints;
    
    // Prefer minor if depressed or paranoid
    if (depression > 60 || paranoia > 70) {
      if (genrePrefs.modes.includes('minor')) {
        return 'minor';
      }
    }
    
    // Select from genre preferences
    const mode = genrePrefs.modes[Math.floor(rng.next() * genrePrefs.modes.length)];
    return mode || 'major';
  }

  /**
   * Filter progressions by multiple criteria
   */
  static _filterProgressions(mode, constraints, genrePrefs, rng) {
    const { bandConstraints = {}, psychConstraints = {}, industryConstraints = {} } = constraints;
    const { confidence = 50 } = bandConstraints;
    const { labelPressure = 0 } = industryConstraints;
    
    const modeProgressions = this.PROGRESSIONS[mode] || {};
    let candidates = [];
    
    // Collect all progressions in this mode
    Object.values(modeProgressions).forEach(category => {
      candidates = candidates.concat(category);
    });
    
    // Filter by confidence level
    if (confidence < 30) {
      // Low confidence = stick to simple, familiar progressions
      candidates = candidates.filter(p => p.familiarity > 0.8 && p.complexity !== 'high');
    } else if (confidence > 75) {
      // High confidence = can attempt experimental progressions
      candidates = candidates.concat(this._getExperimentalProgressions(mode));
    }
    
    // Filter by label pressure (commercial viability)
    if (labelPressure > 70) {
      candidates = candidates.filter(p => p.catchiness > 0.6 && p.familiarity > 0.5);
    }
    
    // Filter by genre preferences
    if (genrePrefs.complexity === 'simple') {
      candidates = candidates.filter(p => p.complexity !== 'high');
    } else if (genrePrefs.complexity === 'high') {
      candidates = candidates.filter(p => p.complexity !== 'simple' || p.familiarity < 0.5);
    }
    
    return candidates;
  }

  /**
   * Weight and select progression from candidates
   */
  static _selectProgression(candidates, constraints, rng) {
    if (candidates.length === 0) {
      return { chords: ['C', 'G', 'Am', 'F'], name: 'default' };
    }
    
    // Calculate weights for each candidate
    const weights = candidates.map(progression => {
      let weight = 1.0;
      
      // Prefer progressions matching label expectations
      if (constraints.industryConstraints?.labelPressure > 50) {
        weight *= progression.catchiness || 0.5;
      }
      
      // Prefer familiar progressions if burned out
      if (constraints.psychConstraints?.burnout > 60) {
        weight *= (progression.familiarity || 0.5) * 1.5;
      }
      
      // Some randomness in selection
      weight *= rng.next() * 0.5 + 0.5;
      
      return weight;
    });
    
    // Weighted random selection
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let selection = rng.next() * totalWeight;
    
    for (let i = 0; i < candidates.length; i++) {
      selection -= weights[i];
      if (selection <= 0) {
        return candidates[i];
      }
    }
    
    return candidates[candidates.length - 1];
  }

  /**
   * Customize progression based on psychology
   */
  static _customizeProgression(progression, constraints, rng) {
    const { psychConstraints = {} } = constraints;
    const { paranoia = 0, addiction = 0 } = psychConstraints;
    
    const customized = { ...progression };
    
    // High paranoia might add tritone/dissonant intervals
    if (paranoia > 75) {
      // Add harmonic tension (simplified - just note for now)
      customized.harmonic_tension = 'high';
    }
    
    // Addiction can create chaotic harmonic choices
    if (addiction > 60) {
      customized.has_unusual_substitution = true;
    }
    
    return customized;
  }

  /**
   * Get experimental progressions for confident bands
   */
  static _getExperimentalProgressions(mode) {
    return [
      { chords: ['Cmaj7', 'D7alt', 'Gm7', 'C'], name: 'experimental-1', complexity: 'high', catchiness: 0.4 },
      { chords: ['Am', 'B7b9', 'E7', 'Am'], name: 'experimental-2', complexity: 'high', catchiness: 0.3 },
      { chords: ['Dm7', 'Eb7', 'Cm7', 'B7'], name: 'chromatic-descent', complexity: 'high', darkness: 0.7 },
    ];
  }

  /**
   * Calculate commercial viability score
   */
  static calculateCommercialViability(progression) {
    const familiarity = progression.familiarity || 0.5;
    const catchiness = progression.catchiness || 0.5;
    return familiarity * 0.4 + catchiness * 0.6;
  }

  /**
   * Get gameplay hooks for harmony
   */
  static getGameplayHooks(labelType) {
    return {
      major: { safeProgressions: 0.8, experimentalBonus: 0.1 },
      indie: { safeProgressions: 0.3, experimentalBonus: 0.7 },
      punk: { safeProgressions: 0.2, experimentalBonus: 0.6, simplicity: 0.8 }
    }[labelType] || { safeProgressions: 0.5, experimentalBonus: 0.4 };
  }
}

export default HarmonyEngine;
