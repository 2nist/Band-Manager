/**
 * EGMDProcessor - Processes E-GMD (Extended Groove MIDI Dataset) patterns
 * 
 * Converts raw MIDI drum patterns into constraint-ready schemas with:
 * - Basic pattern extraction (kick, snare, hihat, ghost notes)
 * - Psychological tag analysis
 * - Genre classification
 * - Gameplay hook identification
 * - Era authenticity detection
 * 
 * Note: This is a template processor. In production, you would:
 * 1. Load actual E-GMD MIDI files
 * 2. Parse MIDI data using a library like 'midi-parser-js' or 'jsmidgen'
 * 3. Extract drum notes (MIDI channel 9, notes 35-81)
 * 4. Convert to beat positions
 */

import { PatternAnalyzer } from '../base/PatternAnalyzer.js';
import { PsychologicalMapper } from '../base/PsychologicalMapper.js';
import { GenreClassifier } from '../base/GenreClassifier.js';

export class EGMDProcessor {
  /**
   * Process a single E-GMD pattern from MIDI data
   * @param {Object} midiData - Parsed MIDI data or pattern object
   * @param {Object} options - Processing options
   * @returns {Object} Enhanced drum pattern schema
   */
  static processPattern(midiData, options = {}) {
    const {
      id = this._generatePatternId(midiData),
      signature = '4/4',
      bpm = 120
    } = options;

    // Step 1: Extract basic pattern structure
    const basicPattern = this._extractBasicPattern(midiData);
    
    // Step 2: Analyze psychological suitability
    const psychologicalTags = this._analyzePsychologicalFitness(basicPattern);
    
    // Step 3: Classify genre weights
    const genreWeights = GenreClassifier.classifyDrumGenreWeights(
      basicPattern,
      [bpm * 0.9, bpm * 1.1] // BPM range
    );
    
    // Step 4: Identify gameplay hooks
    const gameplayHooks = this._generateGameplayHooks(basicPattern);
    
    // Step 5: Advanced analysis
    const energyCurve = PatternAnalyzer.calculateEnergyCurve(basicPattern, 4);
    const rhythmicDensity = PatternAnalyzer.calculateRhythmicDensity(
      basicPattern.kick?.concat(basicPattern.snare || []) || [],
      4
    );
    const swingFactor = PatternAnalyzer.detectSwingFactor(basicPattern.hihat || []);
    const eraAuthenticity = GenreClassifier.classifyEraAuthenticity(basicPattern, 'drums');
    
    // Step 6: Calculate complexity
    const complexity = PatternAnalyzer.calculateComplexity(basicPattern);
    const complexityLabel = complexity < 0.33 ? 'simple' : complexity < 0.67 ? 'medium' : 'complex';

    return {
      // Basic fields
      id,
      signature,
      complexity: complexityLabel,
      beats: {
        kick: basicPattern.kick || [],
        snare: basicPattern.snare || [],
        hihat: basicPattern.hihat || [],
        ghostSnare: basicPattern.ghostSnare || []
      },
      bpmRange: [bpm * 0.9, bpm * 1.1],

      // Enhanced psychological tags
      psychological_tags: psychologicalTags,

      // Genre classification
      genre_weights: genreWeights,

      // Gameplay integration points
      gameplay_hooks: gameplayHooks,

      // Advanced analysis
      energy_curve: energyCurve,
      rhythmic_density: rhythmicDensity,
      swing_factor: swingFactor,
      era_authenticity: eraAuthenticity,

      // Metadata
      source: 'E-GMD',
      processed_at: Date.now()
    };
  }

  /**
   * Extract basic pattern structure from MIDI data
   * @param {Object} midiData - MIDI data or pattern object
   * @returns {Object} Basic pattern with beat arrays
   */
  static _extractBasicPattern(midiData) {
    // If already a pattern object, return it
    if (midiData.beats || midiData.kick) {
      return midiData;
    }

    // Otherwise, extract from MIDI structure
    // In production, this would parse actual MIDI files
    // For now, return a placeholder structure
    return {
      kick: midiData.kick || [],
      snare: midiData.snare || [],
      hihat: midiData.hihat || [],
      ghostSnare: midiData.ghostSnare || []
    };
  }

  /**
   * Analyze psychological fitness
   * @param {Object} basicPattern - Basic pattern structure
   * @returns {Object} Psychological tags
   */
  static _analyzePsychologicalFitness(basicPattern) {
    return {
      stress_appropriate: PsychologicalMapper.analyzeStressTolerance(basicPattern),
      chaos_level: PsychologicalMapper.calculateChaosLevel(basicPattern.beats || basicPattern),
      confidence_required: PsychologicalMapper.calculateSkillRequirement(
        PatternAnalyzer.calculateComplexity(basicPattern)
      ),
      substance_vulnerability: PsychologicalMapper.analyzeTimingSensitivity(basicPattern),
      emotional_intensity: PsychologicalMapper.calculateEmotionalIntensity(basicPattern)
    };
  }

  /**
   * Generate gameplay hooks (fill opportunities, humanization targets, etc.)
   * @param {Object} basicPattern - Basic pattern structure
   * @returns {Object} Gameplay hooks
   */
  static _generateGameplayHooks(basicPattern) {
    return {
      fills: PatternAnalyzer.identifyFillOpportunities(basicPattern, 4),
      humanization_targets: PatternAnalyzer.identifyHumanizationSpots(basicPattern),
      showoff_moments: PatternAnalyzer.identifyShowoffOpportunities(basicPattern, 4),
      simplification_safe: PatternAnalyzer.identifySimplificationSafeBeats(basicPattern)
    };
  }

  /**
   * Generate unique pattern ID
   * @param {Object} midiData - MIDI data
   * @returns {string} Pattern ID
   */
  static _generatePatternId(midiData) {
    if (midiData.id) return midiData.id;
    if (midiData.filename) {
      return `egmd_${midiData.filename.replace(/[^a-zA-Z0-9]/g, '_')}`;
    }
    return `egmd_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Process multiple patterns (batch processing)
   * @param {Array<Object>} patterns - Array of MIDI data or pattern objects
   * @param {Object} options - Processing options
   * @returns {Array<Object>} Processed patterns
   */
  static processBatch(patterns, options = {}) {
    return patterns.map((pattern, index) => {
      return this.processPattern(pattern, {
        ...options,
        id: pattern.id || `pattern_${index}`
      });
    });
  }

  /**
   * Filter patterns by quality criteria
   * @param {Array<Object>} processedPatterns - Processed patterns
   * @param {Object} criteria - Quality criteria
   * @returns {Array<Object>} Filtered patterns
   */
  static filterByQuality(processedPatterns, criteria = {}) {
    const {
      minComplexity = 0,
      maxComplexity = 1,
      requiredGenres = [],
      minStressTolerance = false,
      maxChaosLevel = 1
    } = criteria;

    return processedPatterns.filter(pattern => {
      const complexity = PatternAnalyzer.calculateComplexity(pattern.beats);
      
      if (complexity < minComplexity || complexity > maxComplexity) {
        return false;
      }

      if (minStressTolerance && !pattern.psychological_tags.stress_appropriate) {
        return false;
      }

      if (pattern.psychological_tags.chaos_level > maxChaosLevel) {
        return false;
      }

      if (requiredGenres.length > 0) {
        const hasGenre = requiredGenres.some(genre => 
          pattern.genre_weights[genre] > 0.2
        );
        if (!hasGenre) return false;
      }

      return true;
    });
  }

  /**
   * Curate core set (12-24 high-quality patterns)
   * @param {Array<Object>} processedPatterns - All processed patterns
   * @returns {Array<Object>} Curated core set
   */
  static curateCoreSet(processedPatterns) {
    // Sort by quality score
    const scored = processedPatterns.map(pattern => {
      const complexity = PatternAnalyzer.calculateComplexity(pattern.beats);
      const quality = 
        (1 - Math.abs(complexity - 0.5)) * 0.3 + // Prefer medium complexity
        pattern.psychological_tags.stress_appropriate ? 0.2 : 0 +
        (1 - pattern.psychological_tags.chaos_level) * 0.2 + // Prefer stable patterns
        Object.values(pattern.genre_weights).reduce((a, b) => Math.max(a, b), 0) * 0.3; // Genre clarity

      return { pattern, quality };
    });

    scored.sort((a, b) => b.quality - a.quality);

    // Select diverse set (12-24 patterns)
    const curated = [];
    const genreCounts = {};
    const complexityCounts = { simple: 0, medium: 0, complex: 0 };
    const targetSize = Math.min(24, Math.max(12, Math.floor(processedPatterns.length * 0.3)));

    for (const { pattern } of scored) {
      if (curated.length >= targetSize) break;

      // Ensure genre diversity (relaxed limits)
      const primaryGenre = Object.entries(pattern.genre_weights)
        .sort((a, b) => b[1] - a[1])[0][0];
      
      const maxGenreCount = Math.ceil(targetSize / 3); // Allow up to 1/3 per genre
      if (genreCounts[primaryGenre] && genreCounts[primaryGenre] >= maxGenreCount) {
        // Still allow if we don't have enough total patterns yet
        if (curated.length < 12) {
          // Allow it to reach minimum size
        } else {
          continue; // Already have enough of this genre
        }
      }

      // Ensure complexity diversity (relaxed limits)
      const maxComplexityCount = Math.ceil(targetSize / 2); // Allow up to 1/2 per complexity
      if (complexityCounts[pattern.complexity] >= maxComplexityCount) {
        // Still allow if we don't have enough total patterns yet
        if (curated.length < 12) {
          // Allow it to reach minimum size
        } else {
          continue; // Already have enough of this complexity
        }
      }

      curated.push(pattern);
      genreCounts[primaryGenre] = (genreCounts[primaryGenre] || 0) + 1;
      complexityCounts[pattern.complexity] = (complexityCounts[pattern.complexity] || 0) + 1;
    }

    // If we still don't have enough, fill with top quality patterns
    if (curated.length < 12) {
      for (const { pattern } of scored) {
        if (curated.length >= 12) break;
        if (!curated.includes(pattern)) {
          curated.push(pattern);
        }
      }
    }

    return curated;
  }
}

export default EGMDProcessor;
