/**
 * DrumEngine - E-GMD-based drum pattern generation
 * 
 * Treats E-GMD dataset as probability fields for rhythm generation,
 * not raw playback. Extracts useful drum patterns and applies
 * skill-based mutations tied to gameplay psychology.
 */

import { SeededRandom } from '../utils/SeededRandom';

export class DrumEngine {
  // Preprocessed drum pattern templates organized by characteristics
  static DRUM_PATTERNS = {
    // Tempo buckets for different speeds
    slow: {
      bpm: [60, 90],
      patterns: [
        { id: 'slow_1', signature: '4/4', complexity: 'simple', kick: [0, 2], snare: [1, 3], hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] },
        { id: 'slow_2', signature: '4/4', complexity: 'simple', kick: [0, 1.5, 2, 3.5], snare: [1, 3], hihat: [0, 1, 2, 3] },
      ]
    },
    medium: {
      bpm: [90, 130],
      patterns: [
        { id: 'medium_1', signature: '4/4', complexity: 'medium', kick: [0, 0.5, 2, 2.5, 3.5], snare: [1, 3], hihat: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75] },
        { id: 'medium_2', signature: '4/4', complexity: 'medium', kick: [0, 1, 2, 3], snare: [1, 2.5, 3], hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] },
        { id: 'rock_groove', signature: '4/4', complexity: 'medium', kick: [0, 2], snare: [1, 3], hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] },
      ]
    },
    fast: {
      bpm: [130, 180],
      patterns: [
        { id: 'fast_1', signature: '4/4', complexity: 'complex', kick: [0, 0.33, 0.67, 1, 1.33, 1.67, 2, 2.5, 3, 3.5], snare: [1, 2, 3], hihat: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75] },
        { id: 'fast_2', signature: '4/4', complexity: 'complex', kick: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5], snare: [1, 1.5, 2.5, 3], hihat: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75] },
        { id: 'blast_beat', signature: '4/4', complexity: 'complex', kick: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75], snare: [1, 3], hihat: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1, 1.125, 1.25, 1.375, 1.5, 1.625, 1.75, 1.875, 2, 2.125, 2.25, 2.375, 2.5, 2.625, 2.75, 2.875, 3, 3.125, 3.25, 3.375, 3.5, 3.625, 3.75, 3.875] },
      ]
    }
  };

  // Genre-specific pattern collections
  static GENRE_PATTERNS = {
    rock: {
      signatures: ['4/4'],
      complexity: 'medium',
      patternIds: ['rock_groove', 'medium_1', 'medium_2'],
      characteristics: { swingAmount: 0, timingTightness: 0.9 }
    },
    punk: {
      signatures: ['4/4'],
      complexity: 'simple',
      patternIds: ['medium_2', 'slow_2'],
      characteristics: { swingAmount: 0, timingTightness: 0.7, energyLevel: 0.9 }
    },
    funk: {
      signatures: ['4/4'],
      complexity: 'high',
      patternIds: ['fast_1', 'medium_1'],
      characteristics: { swingAmount: 0.3, timingTightness: 0.6, grooveFeeling: 0.9 }
    },
    metal: {
      signatures: ['4/4'],
      complexity: 'complex',
      patternIds: ['fast_2', 'blast_beat'],
      characteristics: { swingAmount: 0, timingTightness: 0.95, powerLevel: 1.0 }
    },
    folk: {
      signatures: ['4/4'],
      complexity: 'simple',
      patternIds: ['slow_1', 'slow_2', 'medium_2'],
      characteristics: { swingAmount: 0.1, timingTightness: 0.8, organicFeeling: 0.8 }
    },
    jazz: {
      signatures: ['4/4', '3/4'],
      complexity: 'complex',
      patternIds: ['medium_1', 'fast_1'],
      characteristics: { swingAmount: 0.4, timingTightness: 0.5, improvisationSpace: 0.7 }
    }
  };

  /**
   * Generate drum pattern based on game constraints
   * @param {Object} gameConstraints - Constraints from ConstraintEngine
   * @param {string} genre - Genre to generate for
   * @param {string} seed - Random seed for reproducibility
   * @returns {Object} Generated drum pattern
   */
  static generate(gameConstraints, genre = 'rock', seed = '') {
    const rng = new SeededRandom(seed);
    
    // Select pattern family based on tempo and genre
    const tempo = this._selectTempo(gameConstraints, rng);
    const patternFamily = this._selectPatternFamily(tempo, genre, rng);
    
    // Start with base pattern
    let pattern = JSON.parse(JSON.stringify(patternFamily));
    
    // Apply skill-based mutations
    pattern = this._applySkillMutations(pattern, gameConstraints, rng);
    
    // Apply psychological mutations
    pattern = this._applyPsychMutations(pattern, gameConstraints, rng);
    
    // Apply context-based adjustments
    pattern = this._applyContextAdjustments(pattern, gameConstraints, rng);
    
    return {
      pattern,
      tempo,
      genre,
      timestamp: Date.now()
    };
  }

  /**
   * Select appropriate tempo based on constraints
   */
  static _selectTempo(constraints, rng) {
    const { psychConstraints = {}, bandConstraints = {}, industryConstraints = {} } = constraints;
    
    // Base tempo influenced by depression and substance use
    let baseTempo = 120;
    baseTempo -= psychConstraints.depression * 0.2; // Depression = slower
    baseTempo += psychConstraints.substanceUse * 0.1; // Substances = faster/chaotic
    
    // Confidence affects tempo choice
    if (bandConstraints.confidence > 75) {
      baseTempo += rng.next() * 20; // Confident bands play faster
    } else if (bandConstraints.confidence < 35) {
      baseTempo -= rng.next() * 15; // Lacking confidence = slower
    }
    
    return Math.max(60, Math.min(180, baseTempo));
  }

  /**
   * Select pattern family from genre and tempo
   */
  static _selectPatternFamily(tempo, genre, rng) {
    const genrePatterns = this.GENRE_PATTERNS[genre] || this.GENRE_PATTERNS.rock;
    const patternId = genrePatterns.patternIds[Math.floor(rng.next() * genrePatterns.patternIds.length)];
    
    // Find pattern in tempo buckets
    for (const [bucket, data] of Object.entries(this.DRUM_PATTERNS)) {
      const [minTempo, maxTempo] = data.bpm;
      if (tempo >= minTempo && tempo < maxTempo) {
        const basePattern = data.patterns.find(p => p.id === patternId);
        return basePattern || data.patterns[0];
      }
    }
    
    return this.DRUM_PATTERNS.medium.patterns[0];
  }

  /**
   * Apply skill-based mutations to pattern
   */
  static _applySkillMutations(pattern, constraints, rng) {
    const { memberSkills = {}, overallSkill = 50 } = constraints.bandConstraints || {};
    const drummersKill = memberSkills.drummer || overallSkill;
    
    // Timing precision based on skill
    const timingVariance = (100 - drummersKill) * 0.005; // Unskilled = wobbly
    pattern.kick = pattern.kick.map(beat => beat + (rng.next() - 0.5) * timingVariance);
    pattern.snare = pattern.snare.map(beat => beat + (rng.next() - 0.5) * timingVariance);
    
    // Add ghost notes if skilled enough
    if (drummersKill > 60) {
      const ghostNoteChance = (drummersKill - 60) / 40 * 0.3; // 0-30% ghost notes
      pattern.ghostSnare = [];
      for (let i = 0; i < 4; i++) {
        if (rng.next() < ghostNoteChance) {
          pattern.ghostSnare.push(i + (rng.next() - 0.5) * 0.2);
        }
      }
    }
    
    // Add fills if very skilled
    if (drummersKill > 70) {
      pattern.hasCreativeFill = true;
      pattern.fillComplexity = (drummersKill - 70) / 30; // 0-1
    }
    
    return pattern;
  }

  /**
   * Apply psychological mutations to pattern
   */
  static _applyPsychMutations(pattern, constraints, rng) {
    const { psychConstraints = {} } = constraints;
    const { stress = 0, substanceUse = 0, depression = 0 } = psychConstraints;
    
    // Stress adds timing chaos
    if (stress > 50) {
      const chaosAmount = (stress - 50) * 0.01;
      pattern.kick = pattern.kick.map(beat => beat + (rng.next() - 0.5) * chaosAmount);
      pattern.snare = pattern.snare.map(beat => beat + (rng.next() - 0.5) * chaosAmount);
    }
    
    // Substance use creates interesting (chaotic) patterns
    if (substanceUse > 40) {
      const impulsiveness = substanceUse * 0.005;
      // Randomly double-hit some beats
      if (rng.next() < impulsiveness) {
        const randomBeat = Math.floor(rng.next() * pattern.kick.length);
        pattern.kick.push(pattern.kick[randomBeat] + 0.1);
        pattern.kick.sort();
      }
    }
    
    // Depression slows and simplifies
    if (depression > 60) {
      pattern.hihat = pattern.hihat.slice(0, Math.ceil(pattern.hihat.length * 0.7));
    }
    
    return pattern;
  }

  /**
   * Apply context-based adjustments
   */
  static _applyContextAdjustments(pattern, constraints, rng) {
    const { contextConstraints = {} } = constraints;
    const { equipmentQuality = 50 } = contextConstraints;
    
    // Poor equipment = less precise timing
    const precisionLoss = (100 - equipmentQuality) * 0.002;
    pattern.kick = pattern.kick.map(beat => beat + (rng.next() - 0.5) * precisionLoss);
    
    return pattern;
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
