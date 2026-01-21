/**
 * GenreClassifier - Classifies musical patterns by genre characteristics
 * 
 * Analyzes patterns and assigns genre weights based on:
 * - Rhythmic characteristics
 * - Harmonic content
 * - Tempo ranges
 * - Stylistic markers
 */

export class GenreClassifier {
  /**
   * Classify genre weights for drum patterns
   * @param {Object} pattern - Drum pattern with beats
   * @param {Array<number>} bpmRange - [min, max] BPM range
   * @returns {Object} Genre weights 0-1
   */
  static classifyDrumGenreWeights(pattern, bpmRange) {
    const [minBpm, maxBpm] = bpmRange || [100, 120];
    const avgBpm = (minBpm + maxBpm) / 2;
    
    const weights = {
      rock: 0,
      punk: 0,
      folk: 0,
      electronic: 0,
      jazz: 0,
      metal: 0
    };
    
    // Analyze kick/snare pattern
    const kickSnare = (pattern.kick || []).concat(pattern.snare || []);
    const density = kickSnare.length / 8; // Normalize to 8 beats
    
    // Rock: Medium tempo, 4/4 backbeat
    if (avgBpm >= 100 && avgBpm <= 140) {
      if (pattern.snare && pattern.snare.some(b => Math.abs(b % 1 - 0.5) < 0.1)) {
        weights.rock = 0.8;
      }
    }
    
    // Punk: Fast tempo, simple patterns
    if (avgBpm >= 140 && avgBpm <= 200 && density < 0.5) {
      weights.punk = 0.9;
    }
    
    // Folk: Slow tempo, simple patterns
    if (avgBpm >= 60 && avgBpm <= 100 && density < 0.4) {
      weights.folk = 0.8;
    }
    
    // Electronic: High hihat density
    if (pattern.hihat && pattern.hihat.length > 8) {
      weights.electronic = 0.7;
    }
    
    // Jazz: Swing feel, complex patterns
    const swingFactor = PatternAnalyzer.detectSwingFactor(pattern.hihat || []);
    if (swingFactor > 0.3 && density > 0.6) {
      weights.jazz = 0.7;
    }
    
    // Metal: Very fast, blast beats
    if (avgBpm >= 160 && density > 0.8) {
      weights.metal = 0.9;
    }
    
    // Normalize weights
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    if (total > 0) {
      Object.keys(weights).forEach(key => {
        weights[key] = weights[key] / total;
      });
    } else {
      // Default to rock if no match
      weights.rock = 1.0;
    }
    
    return weights;
  }

  /**
   * Classify genre weights for chord progressions
   * @param {Array<string>} chords - Chord symbols
   * @param {string} mode - Musical mode (major, minor, etc.)
   * @returns {Object} Genre weights 0-1
   */
  static classifyHarmonyGenreWeights(chords, mode) {
    const weights = {
      rock: 0,
      punk: 0,
      folk: 0,
      electronic: 0,
      jazz: 0,
      metal: 0
    };
    
    const complexity = chords.length;
    const hasMinor = chords.some(c => c.toLowerCase().includes('m') && !c.toLowerCase().includes('maj'));
    const hasSevenths = chords.some(c => c.includes('7'));
    
    // Rock: Simple major/minor progressions
    if (complexity <= 4 && !hasSevenths) {
      weights.rock = 0.8;
    }
    
    // Punk: Very simple, power chords
    if (complexity <= 3 && mode === 'major') {
      weights.punk = 0.9;
    }
    
    // Folk: Simple, often minor
    if (complexity <= 4 && hasMinor && !hasSevenths) {
      weights.folk = 0.7;
    }
    
    // Jazz: Complex, extended chords
    if (hasSevenths && complexity > 4) {
      weights.jazz = 0.8;
    }
    
    // Metal: Minor, power chords
    if (mode === 'minor' && complexity <= 4) {
      weights.metal = 0.7;
    }
    
    // Normalize
    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    if (total > 0) {
      Object.keys(weights).forEach(key => {
        weights[key] = weights[key] / total;
      });
    } else {
      weights.rock = 1.0;
    }
    
    return weights;
  }

  /**
   * Classify era authenticity
   * @param {Object} pattern - Pattern to analyze
   * @param {string} type - 'drums', 'harmony', or 'melody'
   * @returns {Object} Era weights 0-1
   */
  static classifyEraAuthenticity(pattern, type = 'drums') {
    const eras = {
      '60s': 0,
      '70s': 0,
      '80s': 0,
      '90s': 0,
      '2000s': 0
    };
    
    if (type === 'drums') {
      const complexity = PatternAnalyzer.calculateComplexity(pattern);
      const density = PatternAnalyzer.calculateRhythmicDensity(
        pattern.kick?.concat(pattern.snare || []) || [],
        4
      );
      
      // 60s: Simple, swing-influenced
      if (complexity < 0.3) {
        eras['60s'] = 0.6;
      }
      
      // 70s: Rock patterns, medium complexity
      if (complexity >= 0.3 && complexity < 0.6) {
        eras['70s'] = 0.7;
      }
      
      // 80s: Electronic, high hihat
      if (pattern.hihat && pattern.hihat.length > 12) {
        eras['80s'] = 0.8;
      }
      
      // 90s: Alternative, varied
      if (complexity >= 0.5 && complexity < 0.8) {
        eras['90s'] = 0.6;
      }
      
      // 2000s: Complex, technical
      if (complexity >= 0.8) {
        eras['2000s'] = 0.7;
      }
    }
    
    // Normalize
    const total = Object.values(eras).reduce((a, b) => a + b, 0);
    if (total > 0) {
      Object.keys(eras).forEach(key => {
        eras[key] = eras[key] / total;
      });
    } else {
      eras['70s'] = 1.0; // Default
    }
    
    return eras;
  }
}

// Import PatternAnalyzer
import { PatternAnalyzer } from './PatternAnalyzer.js';

export default GenreClassifier;
