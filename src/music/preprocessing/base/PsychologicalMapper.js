/**
 * PsychologicalMapper - Maps musical patterns to psychological characteristics
 * 
 * Analyzes patterns for psychological suitability based on the enhanced schema:
 * - Stress tolerance
 * - Chaos level
 * - Confidence requirements
 * - Substance vulnerability
 * - Emotional intensity
 */

import { PatternAnalyzer } from './PatternAnalyzer.js';

export class PsychologicalMapper {
  /**
   * Analyze stress tolerance of a pattern
   * @param {Object} pattern - Pattern to analyze
   * @returns {boolean} Can handle high-stress performance
   */
  static analyzeStressTolerance(pattern) {
    const complexity = PatternAnalyzer.calculateComplexity(pattern);
    const density = PatternAnalyzer.calculateRhythmicDensity(
      pattern.kick?.concat(pattern.snare || []) || [],
      4
    );
    
    // Simple, stable patterns handle stress better
    // Complex, dense patterns are more vulnerable to stress
    return complexity < 0.5 && density < 0.6;
  }

  /**
   * Calculate chaos level (how chaotic/loose the pattern is)
   * @param {Object} beats - Beat arrays from pattern
   * @returns {number} Chaos level 0-1
   */
  static calculateChaosLevel(beats) {
    if (!beats || Object.keys(beats).length === 0) return 0;
    
    const allBeats = [];
    Object.values(beats).forEach(beatArray => {
      if (Array.isArray(beatArray)) {
        allBeats.push(...beatArray);
      }
    });
    
    if (allBeats.length < 2) return 0;
    
    allBeats.sort((a, b) => a - b);
    
    // Calculate timing variance
    const intervals = [];
    for (let i = 1; i < allBeats.length; i++) {
      intervals.push(allBeats[i] - allBeats[i - 1]);
    }
    
    if (intervals.length === 0) return 0;
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((sum, interval) => {
      return sum + Math.pow(interval - avgInterval, 2);
    }, 0) / intervals.length;
    
    // High variance = high chaos
    return Math.min(1, variance * 5);
  }

  /**
   * Calculate skill requirement (minimum skill to execute well)
   * @param {number} complexity - Pattern complexity 0-1
   * @returns {number} Confidence required 0-1
   */
  static calculateSkillRequirement(complexity) {
    // Linear mapping: complexity directly maps to skill requirement
    return complexity;
  }

  /**
   * Analyze timing sensitivity (how drugs/alcohol affect this pattern)
   * @param {Object} pattern - Pattern to analyze
   * @returns {number} Substance vulnerability 0-1
   */
  static analyzeTimingSensitivity(pattern) {
    const complexity = PatternAnalyzer.calculateComplexity(pattern);
    const density = PatternAnalyzer.calculateRhythmicDensity(
      pattern.kick?.concat(pattern.snare || []) || [],
      4
    );
    
    // High complexity + high density = more vulnerable to timing issues
    return Math.min(1, (complexity * 0.6 + density * 0.4));
  }

  /**
   * Calculate emotional intensity
   * @param {Object} pattern - Pattern to analyze
   * @returns {number} Emotional intensity 0-1
   */
  static calculateEmotionalIntensity(pattern) {
    const energyCurve = PatternAnalyzer.calculateEnergyCurve(pattern, 4);
    const avgEnergy = energyCurve.reduce((a, b) => a + b, 0) / energyCurve.length;
    const maxEnergy = Math.max(...energyCurve);
    
    // High average + high peaks = high emotional intensity
    return Math.min(1, (avgEnergy * 0.6 + maxEnergy * 0.4));
  }

  /**
   * Analyze harmonic darkness (for chord progressions)
   * @param {Array<string>} chords - Chord symbols
   * @returns {number} Darkness level 0-1
   */
  static analyzeHarmonicDarkness(chords) {
    if (!chords || chords.length === 0) return 0;
    
    let darkness = 0;
    let minorCount = 0;
    let diminishedCount = 0;
    let dissonantCount = 0;
    
    chords.forEach(chord => {
      const chordStr = chord.toLowerCase();
      
      if (chordStr.includes('m') && !chordStr.includes('maj')) {
        minorCount++;
      }
      if (chordStr.includes('dim') || chordStr.includes('°')) {
        diminishedCount++;
      }
      if (chordStr.includes('7') || chordStr.includes('9') || chordStr.includes('11')) {
        dissonantCount++;
      }
    });
    
    darkness += (minorCount / chords.length) * 0.4;
    darkness += (diminishedCount / chords.length) * 0.5;
    darkness += (dissonantCount / chords.length) * 0.3;
    
    return Math.min(1, darkness);
  }

  /**
   * Analyze repetitive elements (suitability for addiction narratives)
   * @param {Object} pattern - Pattern to analyze
   * @returns {number} Repetitiveness 0-1
   */
  static analyzeRepetitiveElements(pattern) {
    // Check if pattern repeats (simplified - would need full pattern analysis)
    const complexity = PatternAnalyzer.calculateComplexity(pattern);
    
    // Simple patterns are more repetitive
    return 1 - complexity;
  }

  /**
   * Analyze dynamic range
   * @param {Object} pattern - Pattern to analyze
   * @returns {number} Dynamic range 0-1
   */
  static analyzeDynamicRange(pattern) {
    const energyCurve = PatternAnalyzer.calculateEnergyCurve(pattern, 4);
    const minEnergy = Math.min(...energyCurve);
    const maxEnergy = Math.max(...energyCurve);
    
    // Large difference between min and max = high dynamic range
    return Math.min(1, (maxEnergy - minEnergy) * 2);
  }
}

export default PsychologicalMapper;
