/**
 * ChordonomiconProcessor - Processes Chordonomicon chord progressions
 * 
 * Converts chord progressions into constraint-ready schemas with:
 * - Basic progression data (chords, mode, key)
 * - Psychological resonance analysis
 * - Industry context classification
 * - Harmonic analysis
 * - Gameplay adaptation hints
 */

import { PsychologicalMapper } from '../base/PsychologicalMapper.js';
import { GenreClassifier } from '../base/GenreClassifier.js';

export class ChordonomiconProcessor {
  /**
   * Process a single chord progression
   * @param {Object} progressionData - Chord progression data
   * @param {Object} options - Processing options
   * @returns {Object} Enhanced progression schema
   */
  static processProgression(progressionData, options = {}) {
    const {
      id = this._generateProgressionId(progressionData),
      name = 'Unnamed Progression'
    } = options;

    // Step 1: Extract basic progression
    const basicProgression = this._extractBasicProgression(progressionData);
    
    // Step 2: Analyze psychological resonance
    const psychologicalResonance = this._analyzePsychologicalResonance(basicProgression);
    
    // Step 3: Analyze industry context
    const industryContext = this._analyzeIndustryContext(basicProgression);
    
    // Step 4: Harmonic analysis
    const harmonicAnalysis = this._analyzeHarmony(basicProgression);
    
    // Step 5: Gameplay adaptations
    const gameplayAdaptations = this._analyzeGameplayAdaptations(basicProgression);
    
    // Step 6: Calculate catchiness and familiarity
    const catchiness = this._calculateCatchiness(basicProgression);
    const familiarity = this._calculateFamiliarity(basicProgression);
    const complexity = this._calculateComplexity(basicProgression);
    
    // Step 7: Determine mode and vibe
    const mode = this._determineMode(basicProgression.chords);
    const vibe = this._determineVibe(basicProgression, psychologicalResonance);
    const era = this._determineEra(basicProgression);

    return {
      // Basic fields
      chords: basicProgression.chords,
      name,
      catchiness,
      familiarity,
      complexity,
      vibe,
      era,
      mode,

      // Enhanced psychological resonance
      psychological_resonance: psychologicalResonance,

      // Industry context
      industry_context: industryContext,

      // Harmonic analysis
      harmonic_analysis: harmonicAnalysis,

      // Gameplay adaptations
      gameplay_adaptations: gameplayAdaptations,

      // Metadata
      source: 'Chordonomicon',
      processed_at: Date.now()
    };
  }

  /**
   * Extract basic progression structure
   * @param {Object} progressionData - Raw progression data
   * @returns {Object} Basic progression
   */
  static _extractBasicProgression(progressionData) {
    // If already structured, return it
    if (progressionData.chords && Array.isArray(progressionData.chords)) {
      return progressionData;
    }

    // Otherwise, extract from various formats
    return {
      chords: progressionData.chords || progressionData.progression || [],
      name: progressionData.name || 'Unnamed'
    };
  }

  /**
   * Analyze psychological resonance
   * @param {Object} progression - Basic progression
   * @returns {Object} Psychological resonance scores
   */
  static _analyzePsychologicalResonance(progression) {
    const darkness = PsychologicalMapper.analyzeHarmonicDarkness(progression.chords);
    const repetitiveness = this._calculateRepetitiveness(progression.chords);
    
    return {
      corruption_level: darkness * 0.8, // Dark progressions = corruption
      addiction_spiral: repetitiveness * 0.7, // Repetitive = addictive
      depression_weight: darkness * 0.9, // Dark = depressive
      manic_energy: this._calculateEnergy(progression.chords),
      paranoia_tension: this._calculateTension(progression.chords),
      redemption_potential: this._calculateRedemptionPotential(progression.chords)
    };
  }

  /**
   * Analyze industry context
   * @param {Object} progression - Basic progression
   * @returns {Object} Industry context scores
   */
  static _analyzeIndustryContext(progression) {
    const catchiness = this._calculateCatchiness(progression);
    const familiarity = this._calculateFamiliarity(progression);
    const complexity = this._calculateComplexity(progression);
    
    return {
      commercial_safety: (catchiness + familiarity) / 2, // Safe = catchy + familiar
      underground_cred: (1 - catchiness) * 0.6 + (1 - familiarity) * 0.4, // Underground = not commercial
      label_friendly: catchiness > 0.7 && familiarity > 0.6 ? 0.9 : 0.3,
      experimental_factor: complexity > 0.6 ? 0.8 : 0.2
    };
  }

  /**
   * Analyze harmonic properties
   * @param {Object} progression - Basic progression
   * @returns {Object} Harmonic analysis
   */
  static _analyzeHarmony(progression) {
    const chords = progression.chords;
    
    return {
      key_center_stability: this._calculateKeyStability(chords),
      modulation_complexity: this._calculateModulationComplexity(chords),
      resolution_strength: this._calculateResolutionStrength(chords),
      dissonance_level: this._calculateDissonance(chords),
      voice_leading_quality: this._calculateVoiceLeading(chords)
    };
  }

  /**
   * Analyze gameplay adaptations
   * @param {Object} progression - Basic progression
   * @returns {Object} Adaptation hints
   */
  static _analyzeGameplayAdaptations(progression) {
    const complexity = this._calculateComplexity(progression);
    
    return {
      skill_scalable: complexity > 0.3, // Can be simplified if complex
      tempo_flexible: true, // Most progressions work at different tempos
      arrangement_hints: this._suggestArrangements(progression.chords),
      emotional_pivot_points: this._identifyPivotPoints(progression.chords)
    };
  }

  /**
   * Calculate catchiness (0-1)
   */
  static _calculateCatchiness(progression) {
    const chords = progression.chords;
    if (!chords || chords.length === 0) return 0.5;
    
    // Common catchy progressions
    const catchyPatterns = [
      ['C', 'G', 'Am', 'F'], // vi-IV-I-V
      ['C', 'Am', 'F', 'G'], // i-vi-IV-V
      ['Am', 'F', 'C', 'G'], // vi-IV-I-V in minor
    ];
    
    const chordStr = chords.join('-');
    for (const pattern of catchyPatterns) {
      if (chordStr.includes(pattern.join('-'))) {
        return 0.9;
      }
    }
    
    // Simpler progressions tend to be catchier
    const complexity = this._calculateComplexity(progression);
    return Math.max(0.3, 1 - complexity * 0.5);
  }

  /**
   * Calculate familiarity (0-1)
   */
  static _calculateFamiliarity(progression) {
    const chords = progression.chords;
    if (!chords || chords.length === 0) return 0.5;
    
    // Very common progressions
    const commonPatterns = [
      ['C', 'G', 'Am', 'F'],
      ['C', 'Am', 'F', 'G'],
      ['Am', 'F', 'C', 'G'],
      ['C', 'F', 'G', 'C'],
      ['C', 'G', 'F', 'C']
    ];
    
    const chordStr = chords.join('-');
    for (const pattern of commonPatterns) {
      if (chordStr === pattern.join('-')) {
        return 0.95;
      }
    }
    
    // Shorter progressions are more familiar
    return Math.max(0.3, 1 - (chords.length - 3) * 0.1);
  }

  /**
   * Calculate complexity (0-1)
   */
  static _calculateComplexity(progression) {
    const chords = progression.chords;
    if (!chords || chords.length === 0) return 0.5;
    
    let complexity = 0;
    
    // More chords = more complex
    complexity += Math.min(0.3, (chords.length - 3) * 0.1);
    
    // Extended chords = more complex
    chords.forEach(chord => {
      if (chord.includes('7') || chord.includes('9') || chord.includes('11')) {
        complexity += 0.15;
      }
      if (chord.includes('dim') || chord.includes('aug')) {
        complexity += 0.1;
      }
    });
    
    return Math.min(1, complexity);
  }

  /**
   * Calculate repetitiveness
   */
  static _calculateRepetitiveness(chords) {
    if (!chords || chords.length < 2) return 0.5;
    
    // Check for repeated patterns
    const uniqueChords = new Set(chords);
    return 1 - (uniqueChords.size / chords.length);
  }

  /**
   * Calculate energy level
   */
  static _calculateEnergy(chords) {
    if (!chords || chords.length === 0) return 0.5;
    
    // Major chords = more energy
    let majorCount = 0;
    chords.forEach(chord => {
      if (!chord.toLowerCase().includes('m') || chord.toLowerCase().includes('maj')) {
        majorCount++;
      }
    });
    
    return majorCount / chords.length;
  }

  /**
   * Calculate harmonic tension
   */
  static _calculateTension(chords) {
    if (!chords || chords.length < 2) return 0.3;
    
    // Dissonant intervals and unresolved progressions = tension
    let tension = 0;
    
    for (let i = 0; i < chords.length - 1; i++) {
      const chord1 = chords[i];
      const chord2 = chords[i + 1];
      
      // Tritone relationships = high tension
      if (this._hasTritoneRelationship(chord1, chord2)) {
        tension += 0.3;
      }
      
      // Dissonant chords
      if (chord2.includes('dim') || chord2.includes('aug')) {
        tension += 0.2;
      }
    }
    
    return Math.min(1, tension);
  }

  /**
   * Calculate redemption potential (can resolve to hopeful)
   */
  static _calculateRedemptionPotential(chords) {
    if (!chords || chords.length === 0) return 0.5;
    
    const lastChord = chords[chords.length - 1];
    const firstChord = chords[0];
    
    // Ends on major = redemption potential
    if (!lastChord.toLowerCase().includes('m') || lastChord.toLowerCase().includes('maj')) {
      return 0.8;
    }
    
    // Starts minor, ends major = redemption arc
    if (firstChord.toLowerCase().includes('m') && 
        (!lastChord.toLowerCase().includes('m') || lastChord.toLowerCase().includes('maj'))) {
      return 0.9;
    }
    
    return 0.4;
  }

  /**
   * Calculate key stability
   */
  static _calculateKeyStability(chords) {
    // Simplified: shorter progressions = more stable
    return Math.max(0.5, 1 - (chords.length - 3) * 0.1);
  }

  /**
   * Calculate modulation complexity
   */
  static _calculateModulationComplexity(chords) {
    // Simplified: more chords = potential for modulation
    return Math.min(1, (chords.length - 3) * 0.2);
  }

  /**
   * Calculate resolution strength
   */
  static _calculateResolutionStrength(chords) {
    if (!chords || chords.length < 2) return 0.5;
    
    // V-I or V-i cadence = strong resolution
    const lastTwo = chords.slice(-2);
    // Simplified check
    return 0.7;
  }

  /**
   * Calculate dissonance level
   */
  static _calculateDissonance(chords) {
    let dissonance = 0;
    chords.forEach(chord => {
      if (chord.includes('dim') || chord.includes('aug')) {
        dissonance += 0.3;
      }
      if (chord.includes('7') && !chord.includes('maj7')) {
        dissonance += 0.2;
      }
    });
    return Math.min(1, dissonance / chords.length);
  }

  /**
   * Calculate voice leading quality
   */
  static _calculateVoiceLeading(chords) {
    // Simplified: shorter progressions = smoother voice leading
    return Math.max(0.6, 1 - (chords.length - 3) * 0.1);
  }

  /**
   * Determine musical mode
   */
  static _determineMode(chords) {
    if (!chords || chords.length === 0) return 'major';
    
    const minorCount = chords.filter(c => 
      c.toLowerCase().includes('m') && !c.toLowerCase().includes('maj')
    ).length;
    
    if (minorCount > chords.length / 2) {
      return 'minor';
    }
    return 'major';
  }

  /**
   * Determine vibe/emotional character
   */
  static _determineVibe(progression, psychologicalResonance) {
    if (psychologicalResonance.depression_weight > 0.7) return 'melancholic';
    if (psychologicalResonance.manic_energy > 0.7) return 'energetic';
    if (psychologicalResonance.corruption_level > 0.7) return 'dark';
    if (psychologicalResonance.redemption_potential > 0.7) return 'hopeful';
    return 'neutral';
  }

  /**
   * Determine era
   */
  static _determineEra(progression) {
    const complexity = this._calculateComplexity(progression);
    const familiarity = this._calculateFamiliarity(progression);
    
    if (familiarity > 0.9) return 'classic';
    if (complexity > 0.7) return 'modern';
    return 'contemporary';
  }

  /**
   * Suggest arrangements
   */
  static _suggestArrangements(chords) {
    const hints = [];
    if (chords.length <= 4) {
      hints.push('acoustic', 'stripped_down');
    }
    if (chords.length > 4) {
      hints.push('full_band', 'orchestral');
    }
    return hints;
  }

  /**
   * Identify emotional pivot points
   */
  static _identifyPivotPoints(chords) {
    // Middle of progression is often a pivot point
    return [Math.floor(chords.length / 2)];
  }

  /**
   * Check for tritone relationship
   */
  static _hasTritoneRelationship(chord1, chord2) {
    // Simplified: check for common tritone progressions
    return false; // Would need actual chord analysis
  }

  /**
   * Generate progression ID
   */
  static _generateProgressionId(progressionData) {
    if (progressionData.id) return progressionData.id;
    const chordStr = (progressionData.chords || []).join('-');
    return `chord_${chordStr.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  /**
   * Process batch of progressions
   */
  static processBatch(progressions, options = {}) {
    return progressions.map((prog, index) => {
      return this.processProgression(prog, {
        ...options,
        id: prog.id || `progression_${index}`
      });
    });
  }
}

export default ChordonomiconProcessor;
