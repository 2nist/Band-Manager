/**
 * LakhProcessor - Processes Lakh MIDI dataset melody phrases
 * 
 * Extracts melodic phrases from Lakh dataset and converts them to:
 * - Scale degree sequences (normalized)
 * - Difficulty profiles
 * - Emotional character analysis
 * - Phrase function classification
 * - Contextual fitness (genre, era, instrumentation)
 */

import { PatternAnalyzer } from '../base/PatternAnalyzer.js';
import { GenreClassifier } from '../base/GenreClassifier.js';

export class LakhProcessor {
  /**
   * Process a single melody phrase
   * @param {Object} phraseData - Melody phrase data (MIDI notes or phrase object)
   * @param {Object} options - Processing options
   * @returns {Object} Enhanced melody phrase schema
   */
  static processPhrase(phraseData, options = {}) {
    const {
      id = this._generatePhraseId(phraseData),
      length_bars = 1
    } = options;

    // Step 1: Extract basic phrase structure
    const basicPhrase = this._extractBasicPhrase(phraseData);
    
    // Step 2: Analyze difficulty profile
    const difficultyProfile = this._analyzeDifficulty(basicPhrase);
    
    // Step 3: Analyze emotional character
    const emotionalCharacter = this._analyzeEmotionalCharacter(basicPhrase);
    
    // Step 4: Analyze phrase function
    const phraseFunction = this._analyzePhraseFunction(basicPhrase);
    
    // Step 5: Analyze contextual fitness
    const contextualFitness = this._analyzeContextualFitness(basicPhrase);
    
    // Step 6: Determine style
    const style = this._determineStyle(basicPhrase);

    return {
      // Basic fields
      scale_degrees: basicPhrase.scale_degrees || [],
      durations: basicPhrase.durations || [],
      style,
      range: basicPhrase.range || [0, 7],
      length_bars,

      // Enhanced difficulty profile
      difficulty_profile: difficultyProfile,

      // Emotional character
      emotional_character: emotionalCharacter,

      // Phrase function
      phrase_function: phraseFunction,

      // Contextual fitness
      contextual_fitness: contextualFitness,

      // Metadata
      source: 'Lakh',
      processed_at: Date.now()
    };
  }

  /**
   * Extract basic phrase structure
   * @param {Object} phraseData - Raw phrase data
   * @returns {Object} Basic phrase structure
   */
  static _extractBasicPhrase(phraseData) {
    // If already structured, return it
    if (phraseData.scale_degrees && Array.isArray(phraseData.scale_degrees)) {
      return phraseData;
    }

    // Otherwise, extract from MIDI notes
    // In production, this would parse actual MIDI files
    // For now, return placeholder structure
    return {
      scale_degrees: phraseData.notes || phraseData.scale_degrees || [],
      durations: phraseData.durations || [],
      range: phraseData.range || [0, 7]
    };
  }

  /**
   * Analyze difficulty profile
   * @param {Object} basicPhrase - Basic phrase structure
   * @returns {Object} Difficulty scores
   */
  static _analyzeDifficulty(basicPhrase) {
    const notes = basicPhrase.scale_degrees || [];
    const durations = basicPhrase.durations || [];
    
    // Technical skill: based on range and interval jumps
    const range = this._calculateRange(notes);
    const maxInterval = this._calculateMaxInterval(notes);
    const technicalSkill = Math.min(1, (range / 12) * 0.5 + (maxInterval / 12) * 0.5);
    
    // Timing precision: based on rhythmic complexity
    const timingPrecision = this._calculateTimingComplexity(durations);
    
    // Pitch accuracy: based on interval difficulty
    const pitchAccuracy = this._calculatePitchAccuracy(notes);
    
    // Expression complexity: based on dynamic variation
    const expressionComplexity = this._calculateExpressionComplexity(basicPhrase);

    return {
      technical_skill: technicalSkill,
      timing_precision: timingPrecision,
      pitch_accuracy: pitchAccuracy,
      expression_complexity: expressionComplexity
    };
  }

  /**
   * Analyze emotional character
   * @param {Object} basicPhrase - Basic phrase structure
   * @returns {Object} Emotional character scores
   */
  static _analyzeEmotionalCharacter(basicPhrase) {
    const notes = basicPhrase.scale_degrees || [];
    const contour = this._calculateContour(notes);
    
    return {
      triumph: contour === 'ascending' ? 0.7 : 0.2,
      melancholy: contour === 'descending' ? 0.7 : 0.2,
      aggression: this._calculateAggression(notes),
      vulnerability: this._calculateVulnerability(notes),
      chaos: this._calculateChaos(notes),
      hope: contour === 'ascending' && notes.length > 4 ? 0.6 : 0.3
    };
  }

  /**
   * Analyze phrase function
   * @param {Object} basicPhrase - Basic phrase structure
   * @returns {Object} Phrase function classification
   */
  static _analyzePhraseFunction(basicPhrase) {
    const notes = basicPhrase.scale_degrees || [];
    const length = notes.length;
    const range = this._calculateRange(notes);
    
    // Hook potential: memorable, catchy phrases
    const hookPotential = length <= 8 && range <= 6 ? 0.8 : 0.4;
    
    // Verse suitable: moderate complexity, narrative feel
    const verseSuitable = length >= 4 && length <= 12 && range <= 8;
    
    // Chorus suitable: simpler, more repetitive
    const chorusSuitable = length <= 8 && range <= 5;
    
    // Bridge suitable: more complex, contrasting
    const bridgeSuitable = length >= 6 && range >= 6;
    
    // Solo potential: complex, wide range
    const soloPotential = length >= 8 && range >= 8 ? 0.8 : 0.3;
    
    // Riff potential: short, repetitive
    const riffPotential = length <= 4 && this._isRepetitive(notes) ? 0.9 : 0.2;

    return {
      hook_potential: hookPotential,
      verse_suitable: verseSuitable,
      chorus_suitable: chorusSuitable,
      bridge_suitable: bridgeSuitable,
      solo_potential: soloPotential,
      riff_potential: riffPotential
    };
  }

  /**
   * Analyze contextual fitness
   * @param {Object} basicPhrase - Basic phrase structure
   * @returns {Object} Contextual fitness scores
   */
  static _analyzeContextualFitness(basicPhrase) {
    const notes = basicPhrase.scale_degrees || [];
    const range = this._calculateRange(notes);
    const complexity = this._calculateComplexity(notes);
    
    // Genre weights (simplified)
    const genreWeights = {
      rock: range <= 8 && complexity < 0.7 ? 0.7 : 0.3,
      punk: range <= 5 && complexity < 0.4 ? 0.8 : 0.2,
      folk: range <= 6 && complexity < 0.5 ? 0.7 : 0.3,
      electronic: complexity > 0.6 ? 0.6 : 0.3,
      jazz: range >= 8 && complexity > 0.7 ? 0.8 : 0.3,
      metal: range >= 10 && complexity > 0.6 ? 0.7 : 0.3
    };
    
    // Era authenticity
    const eraAuthenticity = GenreClassifier.classifyEraAuthenticity(
      { notes },
      'melody'
    );
    
    // Instrumentation hints
    const instrumentationHints = {
      guitar: range <= 12 && complexity < 0.8 ? 0.8 : 0.4,
      bass: range <= 5 ? 0.9 : 0.2,
      keyboard: range <= 10 ? 0.7 : 0.3,
      vocal: range <= 8 && complexity < 0.6 ? 0.9 : 0.4
    };

    return {
      genre_weights: genreWeights,
      era_authenticity: eraAuthenticity,
      instrumentation_hints: instrumentationHints
    };
  }

  /**
   * Determine melodic style
   * @param {Object} basicPhrase - Basic phrase structure
   * @returns {string} Style classification
   */
  static _determineStyle(basicPhrase) {
    const notes = basicPhrase.scale_degrees || [];
    const contour = this._calculateContour(notes);
    const maxInterval = this._calculateMaxInterval(notes);
    
    if (maxInterval <= 2) {
      return 'stepwise';
    }
    if (maxInterval >= 5) {
      return 'intervallic';
    }
    if (contour === 'arch') {
      return 'arch';
    }
    return 'mixed';
  }

  // ============ Helper Methods ============

  /**
   * Calculate note range
   */
  static _calculateRange(notes) {
    if (!notes || notes.length === 0) return 0;
    const min = Math.min(...notes);
    const max = Math.max(...notes);
    return max - min;
  }

  /**
   * Calculate maximum interval jump
   */
  static _calculateMaxInterval(notes) {
    if (!notes || notes.length < 2) return 0;
    let maxInterval = 0;
    for (let i = 1; i < notes.length; i++) {
      const interval = Math.abs(notes[i] - notes[i - 1]);
      maxInterval = Math.max(maxInterval, interval);
    }
    return maxInterval;
  }

  /**
   * Calculate timing complexity
   */
  static _calculateTimingComplexity(durations) {
    if (!durations || durations.length === 0) return 0.3;
    
    // More varied durations = more complex
    const uniqueDurations = new Set(durations);
    return Math.min(1, uniqueDurations.size / durations.length);
  }

  /**
   * Calculate pitch accuracy requirements
   */
  static _calculatePitchAccuracy(notes) {
    const maxInterval = this._calculateMaxInterval(notes);
    // Large intervals = harder to hit accurately
    return Math.min(1, maxInterval / 12);
  }

  /**
   * Calculate expression complexity
   */
  static _calculateExpressionComplexity(basicPhrase) {
    // Simplified: based on note count and range
    const notes = basicPhrase.scale_degrees || [];
    const range = this._calculateRange(notes);
    return Math.min(1, (notes.length / 16) * 0.5 + (range / 12) * 0.5);
  }

  /**
   * Calculate melodic contour
   */
  static _calculateContour(notes) {
    if (!notes || notes.length < 2) return 'stable';
    
    const first = notes[0];
    const last = notes[notes.length - 1];
    const max = Math.max(...notes);
    const min = Math.min(...notes);
    
    if (max > first + 2 && last < first) {
      return 'arch'; // Up then down
    }
    if (last > first + 1) {
      return 'ascending';
    }
    if (last < first - 1) {
      return 'descending';
    }
    return 'stable';
  }

  /**
   * Calculate aggression
   */
  static _calculateAggression(notes) {
    const maxInterval = this._calculateMaxInterval(notes);
    const range = this._calculateRange(notes);
    // Large jumps and wide range = aggressive
    return Math.min(1, (maxInterval / 12) * 0.6 + (range / 12) * 0.4);
  }

  /**
   * Calculate vulnerability
   */
  static _calculateVulnerability(notes) {
    const contour = this._calculateContour(notes);
    const range = this._calculateRange(notes);
    // Descending, narrow range = vulnerable
    if (contour === 'descending' && range <= 5) {
      return 0.8;
    }
    return 0.3;
  }

  /**
   * Calculate chaos
   */
  static _calculateChaos(notes) {
    if (!notes || notes.length < 3) return 0.2;
    
    // High variance in intervals = chaotic
    const intervals = [];
    for (let i = 1; i < notes.length; i++) {
      intervals.push(Math.abs(notes[i] - notes[i - 1]));
    }
    
    const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => {
      return sum + Math.pow(interval - avg, 2);
    }, 0) / intervals.length;
    
    return Math.min(1, variance * 2);
  }

  /**
   * Check if phrase is repetitive
   */
  static _isRepetitive(notes) {
    if (!notes || notes.length < 4) return false;
    
    // Check for repeated patterns
    const half = Math.floor(notes.length / 2);
    const firstHalf = notes.slice(0, half);
    const secondHalf = notes.slice(half, half * 2);
    
    // Simple check: are first and second halves similar?
    let matches = 0;
    for (let i = 0; i < Math.min(firstHalf.length, secondHalf.length); i++) {
      if (Math.abs(firstHalf[i] - secondHalf[i]) <= 1) {
        matches++;
      }
    }
    
    return matches / Math.min(firstHalf.length, secondHalf.length) > 0.7;
  }

  /**
   * Calculate complexity
   */
  static _calculateComplexity(notes) {
    if (!notes || notes.length === 0) return 0.3;
    
    const range = this._calculateRange(notes);
    const maxInterval = this._calculateMaxInterval(notes);
    const uniqueNotes = new Set(notes).size;
    
    return Math.min(1, (range / 12) * 0.4 + (maxInterval / 12) * 0.3 + (uniqueNotes / notes.length) * 0.3);
  }

  /**
   * Generate phrase ID
   */
  static _generatePhraseId(phraseData) {
    if (phraseData.id) return phraseData.id;
    const notesStr = (phraseData.scale_degrees || phraseData.notes || []).join('-');
    return `lakh_${notesStr.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  /**
   * Process batch of phrases
   */
  static processBatch(phrases, options = {}) {
    return phrases.map((phrase, index) => {
      return this.processPhrase(phrase, {
        ...options,
        id: phrase.id || `phrase_${index}`
      });
    });
  }
}

export default LakhProcessor;
