/**
 * HarmonyEngine - Chordonomicon-based progression generation
 * 
 * Loads processed chord progressions from core dataset and applies
 * constraint-based selection using psychological resonance and industry context.
 */

import { SeededRandom } from '../utils/SeededRandom.js';
import { loadDataset } from '../utils/loadDataset.js';

export class HarmonyEngine {
  // Loaded progressions from processed dataset
  static progressions = null;

  // Fallback progressions
  static FALLBACK_PROGRESSIONS = {
    major: {
      happy: [
        { chords: ['C', 'G', 'Am', 'F'], name: 'vi-IV-I-V', catchiness: 0.9, familiarity: 0.95, era: 'classic' },
        { chords: ['C', 'Am', 'F', 'G'], name: 'i-vi-IV-V', catchiness: 0.85, familiarity: 0.9, era: 'classic' },
      ]
    },
    minor: {
      melancholic: [
        { chords: ['Am', 'F', 'C', 'G'], name: 'minor-classic', catchiness: 0.85, familiarity: 0.9, era: 'classic' },
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
   * Load progressions from processed dataset
   */
  static async loadProgressions() {
    if (this.progressions !== null) {
      return this.progressions;
    }

    try {
      // Load dataset (works in both Node.js and browser)
      const data = await loadDataset('progressions');
      
      if (!data) {
        throw new Error('Failed to load dataset');
      }
      
      this.progressions = (data || []).filter(prog => {
        // Filter out invalid progressions
        return prog.chords && Array.isArray(prog.chords) && prog.chords.length > 0;
      });

      if (this.progressions.length === 0) {
        console.warn('No valid progressions in dataset, using fallback');
        this.progressions = this._convertFallbackToEnhanced();
      } else {
        console.log(`Loaded ${this.progressions.length} progressions from dataset`);
      }
    } catch (error) {
      console.error('Failed to load progressions:', error);
      this.progressions = this._convertFallbackToEnhanced();
    }

    return this.progressions;
  }

  /**
   * Convert fallback progressions to enhanced schema format
   */
  static _convertFallbackToEnhanced() {
    const enhanced = [];
    Object.values(this.FALLBACK_PROGRESSIONS).forEach(modeData => {
      Object.values(modeData).forEach(category => {
        category.forEach(prog => {
          enhanced.push({
            ...prog,
            mode: prog.mode || 'major',
            psychological_resonance: {
              corruption_level: prog.mode === 'minor' ? 0.6 : 0.2,
              addiction_spiral: 0.4,
              depression_weight: prog.mode === 'minor' ? 0.7 : 0.3,
              manic_energy: 0.4,
              paranoia_tension: 0.3,
              redemption_potential: prog.mode === 'major' ? 0.8 : 0.4
            },
            industry_context: {
              commercial_safety: prog.catchiness > 0.8 ? 0.9 : 0.6,
              underground_cred: prog.catchiness < 0.6 ? 0.7 : 0.3,
              label_friendly: prog.catchiness > 0.7 ? 0.9 : 0.4,
              experimental_factor: 0.2
            }
          });
        });
      });
    });
    return enhanced;
  }

  /**
   * Generate chord progression based on constraints
   * @param {Object} constraints - Constraints from ConstraintEngine
   * @param {string} genre - Genre to generate for
   * @param {string} seed - Random seed for reproducibility
   * @returns {Object} Generated progression
   */
  static async generate(constraints, genre = 'rock', seed = '') {
    const rng = new SeededRandom(seed);
    const progressions = await this.loadProgressions();
    
    // Get genre preferences
    const genrePrefs = this.GENRE_PREFERENCES[genre] || this.GENRE_PREFERENCES.rock;
    
    // Select mode based on genre and emotional state
    const mode = this._selectMode(genrePrefs, constraints, rng);
    
    // Filter progressions by constraints using enhanced schema
    let candidates = this._filterByConstraints(progressions, mode, constraints, genrePrefs, rng);
    
    if (candidates.length === 0) {
      // Fallback: use any progression in the mode
      candidates = progressions.filter(p => (p.mode || 'major') === mode);
      if (candidates.length === 0) {
        candidates = this._convertFallbackToEnhanced();
      }
    }
    
    // Weight and select progression
    const progression = this._selectWeightedProgression(candidates, constraints, rng);
    
    // Customize based on band psychology
    const customized = this._customizeProgression(progression, constraints, rng);
    
    return {
      progression: customized,
      mode: customized.mode || mode,
      genre,
      timestamp: Date.now()
    };
  }

  /**
   * Filter progressions by constraints using enhanced schema fields
   */
  static _filterByConstraints(progressions, mode, constraints, genrePrefs, rng) {
    const { bandConstraints = {}, psychConstraints = {}, industryConstraints = {} } = constraints;
    const { confidence = 50 } = bandConstraints;
    const { labelPressure = 0 } = industryConstraints;
    const { depression = 0, burnout = 0 } = psychConstraints;
    const corruption = psychConstraints.corruption || 0;

    return progressions.filter(prog => {
      // Filter by mode
      if ((prog.mode || 'major') !== mode) {
        return false;
      }

      // Filter by complexity (genre preferences)
      const progComplexity = prog.complexity || 0.5;
      if (genrePrefs.complexity === 'simple' && progComplexity > 0.6) {
        return false;
      }
      if (genrePrefs.complexity === 'high' && progComplexity < 0.4) {
        return false;
      }

      // Filter by confidence level
      if (confidence < 30) {
        // Low confidence = stick to familiar progressions
        if ((prog.familiarity || 0.5) < 0.7) {
          return false;
        }
      }

      // Filter by label pressure (commercial viability)
      if (labelPressure > 70) {
        const commercialSafety = prog.industry_context?.commercial_safety || 0.5;
        if (commercialSafety < 0.6) {
          return false; // Need commercially safe progressions
        }
      }

      // Filter by psychological resonance
      if (depression > 60) {
        // Prefer progressions with higher depression_weight
        const depWeight = prog.psychological_resonance?.depression_weight || 0;
        if (depWeight < 0.4) {
          return false; // Not depressive enough
        }
      }

      const corruption = psychConstraints.corruption || 0;
      if (corruption > 60) {
        // Prefer progressions with higher corruption_level
        const corrLevel = prog.psychological_resonance?.corruption_level || 0;
        if (corrLevel < 0.4) {
          return false; // Not dark enough
        }
      }

      // Filter by burnout (prefer familiar if burned out)
      if (burnout > 60) {
        if ((prog.familiarity || 0.5) < 0.6) {
          return false; // Need familiar progressions
        }
      }

      return true;
    });
  }

  /**
   * Select progression using weighted random based on constraint fit
   */
  static _selectWeightedProgression(candidates, constraints, rng) {
    if (candidates.length === 0) {
      return { chords: ['C', 'G', 'Am', 'F'], name: 'default', mode: 'major' };
    }

    const { psychConstraints = {}, industryConstraints = {} } = constraints;
    const { burnout = 0, depression = 0 } = psychConstraints;
    const corruption = psychConstraints.corruption || 0;
    const { labelPressure = 0 } = industryConstraints;

    // Calculate weights for each candidate
    const weights = candidates.map(prog => {
      let weight = 1.0;

      // Prefer progressions matching label expectations
      if (labelPressure > 50) {
        const commercialSafety = prog.industry_context?.commercial_safety || 0.5;
        weight *= (0.5 + commercialSafety);
      }

      // Prefer familiar progressions if burned out
      if (burnout > 60) {
        weight *= (0.5 + (prog.familiarity || 0.5) * 1.5);
      }

      // Prefer catchiness for commercial appeal
      if (labelPressure > 70) {
        weight *= (0.5 + (prog.catchiness || 0.5));
      }

      // Match psychological resonance
      if (depression > 60) {
        const depWeight = prog.psychological_resonance?.depression_weight || 0;
        weight *= (0.7 + depWeight * 0.3);
      }

      if (corruption > 60) {
        const corrLevel = prog.psychological_resonance?.corruption_level || 0;
        weight *= (0.7 + corrLevel * 0.3);
      }

      // Add randomness
      weight *= (0.7 + rng.next() * 0.3);

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
   * Customize progression based on psychology
   */
  static _customizeProgression(progression, constraints, rng) {
    const { psychConstraints = {} } = constraints;
    const { paranoia = 0, addictionRisk = 0 } = psychConstraints;
    
    const customized = { ...progression };
    
    // High paranoia might add harmonic tension
    if (paranoia > 75) {
      customized.harmonic_tension = 'high';
      // Increase dissonance if not already high
      if (customized.harmonic_analysis) {
        customized.harmonic_analysis.dissonance_level = Math.min(1, 
          (customized.harmonic_analysis.dissonance_level || 0) + 0.3
        );
      }
    }
    
    // Addiction can create chaotic harmonic choices
    if (addictionRisk > 60) {
      customized.has_unusual_substitution = true;
    }
    
    return customized;
  }

  /**
   * Calculate commercial viability score
   */
  static calculateCommercialViability(progression) {
    const familiarity = progression.familiarity || 0.5;
    const catchiness = progression.catchiness || 0.5;
    const commercialSafety = progression.industry_context?.commercial_safety || 0.5;
    return (familiarity * 0.3 + catchiness * 0.4 + commercialSafety * 0.3);
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
