/**
 * DrumEngine - E-GMD-based drum pattern generation
 * 
 * Loads processed drum patterns from core dataset and applies
 * constraint-based selection based on game psychology and band state.
 */

import { SeededRandom } from '../utils/SeededRandom.js';
import { loadDataset } from '../utils/loadDataset.js';

export class DrumEngine {
  // Loaded patterns from processed dataset
  static patterns = null;
  
  // Fallback patterns (used if dataset loading fails or patterns are invalid)
  static FALLBACK_PATTERNS = {
    slow: {
      bpm: [60, 90],
      patterns: [
        { id: 'slow_1', signature: '4/4', complexity: 'simple', beats: { kick: [0, 2], snare: [1, 3], hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], ghostSnare: [] } },
        { id: 'slow_2', signature: '4/4', complexity: 'simple', beats: { kick: [0, 1.5, 2, 3.5], snare: [1, 3], hihat: [0, 1, 2, 3], ghostSnare: [] } },
      ]
    },
    medium: {
      bpm: [90, 130],
      patterns: [
        { id: 'medium_1', signature: '4/4', complexity: 'medium', beats: { kick: [0, 0.5, 2, 2.5, 3.5], snare: [1, 3], hihat: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75], ghostSnare: [] } },
        { id: 'rock_groove', signature: '4/4', complexity: 'medium', beats: { kick: [0, 2], snare: [1, 3], hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], ghostSnare: [] } },
      ]
    },
    fast: {
      bpm: [130, 180],
      patterns: [
        { id: 'fast_1', signature: '4/4', complexity: 'complex', beats: { kick: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], snare: [1, 1.5, 2.5, 3], hihat: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75], ghostSnare: [] } },
      ]
    }
  };

  /**
   * Load patterns from processed dataset
   */
  static async loadPatterns() {
    if (this.patterns !== null) {
      return this.patterns;
    }

    try {
      // Load dataset (works in both Node.js and browser)
      const data = await loadDataset('drums');
      
      if (!data) {
        throw new Error('Failed to load dataset');
      }
      
      // Filter out patterns with empty beats (MIDI parsing issue)
      this.patterns = (data || []).filter(pattern => {
        const beats = pattern.beats || {};
        const hasBeats = (beats.kick && beats.kick.length > 0) || 
                        (beats.snare && beats.snare.length > 0) ||
                        (beats.hihat && beats.hihat.length > 0);
        return hasBeats;
      });

      // If no valid patterns, use fallback
      if (this.patterns.length === 0) {
        console.warn('No valid patterns in dataset, using fallback');
        this.patterns = this._convertFallbackToEnhanced();
      } else {
        console.log(`Loaded ${this.patterns.length} drum patterns from dataset`);
      }
    } catch (error) {
      console.error('Failed to load drum patterns:', error);
      this.patterns = this._convertFallbackToEnhanced();
    }

    return this.patterns;
  }

  /**
   * Convert fallback patterns to enhanced schema format
   */
  static _convertFallbackToEnhanced() {
    const enhanced = [];
    Object.values(this.FALLBACK_PATTERNS).forEach(bucket => {
      bucket.patterns.forEach(pattern => {
        enhanced.push({
          ...pattern,
          bpmRange: bucket.bpm,
          psychological_tags: {
            stress_appropriate: pattern.complexity === 'simple',
            chaos_level: pattern.complexity === 'complex' ? 0.6 : 0.2,
            confidence_required: pattern.complexity === 'complex' ? 0.7 : 0.3,
            substance_vulnerability: pattern.complexity === 'complex' ? 0.6 : 0.3,
            emotional_intensity: 0.5
          },
          genre_weights: {
            rock: 0.7,
            punk: 0.3,
            folk: 0.3,
            electronic: 0.2,
            jazz: 0.2,
            metal: 0.2
          },
          gameplay_hooks: {
            fills: [3, 7],
            humanization_targets: [],
            showoff_moments: [3.5, 7.5],
            simplification_safe: []
          }
        });
      });
    });
    return enhanced;
  }

  /**
   * Generate drum pattern based on game constraints
   * @param {Object} gameConstraints - Constraints from ConstraintEngine
   * @param {string} genre - Genre to generate for
   * @param {string} seed - Random seed for reproducibility
   * @returns {Object} Generated drum pattern
   */
  static async generate(gameConstraints, genre = 'rock', seed = '') {
    const rng = new SeededRandom(seed);
    const patterns = await this.loadPatterns();
    
    // Select tempo based on constraints
    const tempo = this._selectTempo(gameConstraints, rng);
    
    // Filter patterns by constraints
    const candidates = this._filterByConstraints(patterns, gameConstraints, genre, tempo, rng);
    
    if (candidates.length === 0) {
      // Fallback: use any pattern
      const selected = patterns[Math.floor(rng.next() * patterns.length)] || this._getFallbackPattern(tempo);
      return this._applyMutations(selected, gameConstraints, tempo, genre, rng);
    }
    
    // Select from candidates using weighted random
    const selected = this._selectWeightedPattern(candidates, gameConstraints, rng);
    
    // Apply mutations based on skill and psychology
    return this._applyMutations(selected, gameConstraints, tempo, genre, rng);
  }

  /**
   * Filter patterns by constraints using enhanced schema fields
   */
  static _filterByConstraints(patterns, constraints, genre, tempo, rng) {
    const { psychConstraints = {}, bandConstraints = {} } = constraints;
    const { stress = 0, substanceUse = 0, depression = 0 } = psychConstraints;
    const { memberSkills = {}, overallSkill = 50 } = bandConstraints;
    const drummerSkill = memberSkills.drummer || overallSkill;

    return patterns.filter(pattern => {
      // Filter by tempo range
      const [minBpm, maxBpm] = pattern.bpmRange || [60, 180];
      if (tempo < minBpm || tempo > maxBpm) {
        return false;
      }

      // Filter by genre weights
      const genreWeight = pattern.genre_weights?.[genre] || 0;
      if (genreWeight < 0.2) {
        return false; // Pattern doesn't fit genre
      }

      // Filter by stress tolerance
      if (stress > 70 && !pattern.psychological_tags?.stress_appropriate) {
        return false; // High stress needs stress-appropriate patterns
      }

      // Filter by skill requirement
      const requiredSkill = (pattern.psychological_tags?.confidence_required || 0) * 100;
      if (drummerSkill < requiredSkill) {
        return false; // Drummer not skilled enough
      }

      // Filter by substance vulnerability (if high substance use, avoid vulnerable patterns)
      if (substanceUse > 60 && (pattern.psychological_tags?.substance_vulnerability || 0) > 0.7) {
        return false; // High substance use + vulnerable pattern = bad combination
      }

      return true;
    });
  }

  /**
   * Select pattern using weighted random based on constraint fit
   */
  static _selectWeightedPattern(candidates, constraints, rng) {
    const { psychConstraints = {}, bandConstraints = {} } = constraints;
    const { stress = 0, depression = 0 } = psychConstraints;
    const { memberSkills = {}, overallSkill = 50 } = bandConstraints;
    const drummerSkill = memberSkills.drummer || overallSkill;

    // Calculate weights for each candidate
    const weights = candidates.map(pattern => {
      let weight = 1.0;

      // Prefer patterns that match psychological state
      if (stress > 50 && pattern.psychological_tags?.stress_appropriate) {
        weight *= 1.5;
      }

      // Prefer patterns matching skill level
      const skillMatch = 1 - Math.abs((pattern.psychological_tags?.confidence_required || 0) - (drummerSkill / 100));
      weight *= (0.5 + skillMatch * 0.5);

      // Prefer lower chaos if depressed
      if (depression > 60) {
        weight *= (1 - (pattern.psychological_tags?.chaos_level || 0) * 0.5);
      }

      // Add some randomness
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
   * Apply mutations to selected pattern
   */
  static _applyMutations(pattern, constraints, tempo, genre, rng) {
    const { psychConstraints = {}, bandConstraints = {}, contextConstraints = {} } = constraints;
    const { memberSkills = {}, overallSkill = 50 } = bandConstraints;
    const drummerSkill = memberSkills.drummer || overallSkill;
    const { stress = 0, substanceUse = 0, depression = 0 } = psychConstraints;
    const { equipmentQuality = 50 } = contextConstraints;

    // Start with pattern copy
    let mutated = JSON.parse(JSON.stringify(pattern));
    
    // Ensure beats structure exists
    if (!mutated.beats) {
      mutated.beats = { kick: [], snare: [], hihat: [], ghostSnare: [] };
    }

    // Apply skill-based timing variations
    const timingVariance = (100 - drummerSkill) * 0.005;
    if (mutated.beats.kick) {
      mutated.beats.kick = mutated.beats.kick.map(beat => beat + (rng.next() - 0.5) * timingVariance);
    }
    if (mutated.beats.snare) {
      mutated.beats.snare = mutated.beats.snare.map(beat => beat + (rng.next() - 0.5) * timingVariance);
    }
    
    // Add ghost notes if skilled enough
    if (drummerSkill > 60 && mutated.beats.snare && mutated.beats.snare.length > 0) {
      const ghostNoteChance = (drummerSkill - 60) / 40 * 0.3;
      if (!mutated.beats.ghostSnare) mutated.beats.ghostSnare = [];
      mutated.beats.snare.forEach(snareBeat => {
        if (rng.next() < ghostNoteChance) {
          mutated.beats.ghostSnare.push(snareBeat + (rng.next() - 0.5) * 0.2);
        }
      });
    }

    // Apply stress-based chaos
    if (stress > 50) {
      const chaosAmount = (stress - 50) * 0.01;
      if (mutated.beats.kick) {
        mutated.beats.kick = mutated.beats.kick.map(beat => beat + (rng.next() - 0.5) * chaosAmount);
      }
      if (mutated.beats.snare) {
        mutated.beats.snare = mutated.beats.snare.map(beat => beat + (rng.next() - 0.5) * chaosAmount);
      }
    }

    // Apply substance use effects
    if (substanceUse > 40) {
      const impulsiveness = substanceUse * 0.005;
      if (rng.next() < impulsiveness && mutated.beats.kick && mutated.beats.kick.length > 0) {
        const randomBeat = mutated.beats.kick[Math.floor(rng.next() * mutated.beats.kick.length)];
        mutated.beats.kick.push(randomBeat + 0.1);
        mutated.beats.kick.sort((a, b) => a - b);
      }
    }

    // Apply depression (simplify)
    if (depression > 60 && mutated.beats.hihat) {
      mutated.beats.hihat = mutated.beats.hihat.slice(0, Math.ceil(mutated.beats.hihat.length * 0.7));
    }

    // Apply equipment quality effects
    const precisionLoss = (100 - equipmentQuality) * 0.002;
    if (mutated.beats.kick) {
      mutated.beats.kick = mutated.beats.kick.map(beat => beat + (rng.next() - 0.5) * precisionLoss);
    }

    return {
      pattern: mutated,
      tempo,
      genre,
      timestamp: Date.now()
    };
  }

  /**
   * Select appropriate tempo based on constraints
   */
  static _selectTempo(constraints, rng) {
    const { psychConstraints = {}, bandConstraints = {} } = constraints;
    const { depression = 0, substanceUse = 0 } = psychConstraints;
    const { confidence = 50 } = bandConstraints;
    
    let baseTempo = 120;
    baseTempo -= depression * 0.2; // Depression = slower
    baseTempo += substanceUse * 0.1; // Substances = faster/chaotic
    
    if (confidence > 75) {
      baseTempo += rng.next() * 20;
    } else if (confidence < 35) {
      baseTempo -= rng.next() * 15;
    }
    
    return Math.max(60, Math.min(180, baseTempo));
  }

  /**
   * Get fallback pattern for tempo
   */
  static _getFallbackPattern(tempo) {
    let bucket = 'medium';
    if (tempo < 90) bucket = 'slow';
    else if (tempo >= 130) bucket = 'fast';
    
    const patterns = this.FALLBACK_PATTERNS[bucket].patterns;
    return this._convertFallbackToEnhanced().find(p => 
      patterns.some(fp => fp.id === p.id)
    ) || this._convertFallbackToEnhanced()[0];
  }

  /**
   * Get skill-based gameplay hooks
   */
  static getGameplayHooks(skill) {
    return {
      grooveStability: skill / 100,
      fillComplexity: Math.max(0, (skill - 30) / 70),
      timingPrecision: skill / 100,
      ghostNoteChance: Math.max(0, (skill - 60) / 40)
    };
  }
}

export default DrumEngine;
