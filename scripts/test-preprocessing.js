#!/usr/bin/env node
/**
 * test-preprocessing.js - Test suite for preprocessing pipeline
 * 
 * Tests all processors and utilities to ensure they work correctly.
 */

import { PatternAnalyzer } from '../src/music/preprocessing/base/PatternAnalyzer.js';
import { PsychologicalMapper } from '../src/music/preprocessing/base/PsychologicalMapper.js';
import { GenreClassifier } from '../src/music/preprocessing/base/GenreClassifier.js';
import { EGMDProcessor } from '../src/music/preprocessing/drums/EGMDProcessor.js';
import { ChordonomiconProcessor } from '../src/music/preprocessing/harmony/ChordonomiconProcessor.js';
import { LakhProcessor } from '../src/music/preprocessing/melody/LakhProcessor.js';

console.log('🧪 Testing Music Generation Preprocessing Pipeline\n');
console.log('='.repeat(60));

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   Error: ${error.message}`);
    testsFailed++;
  }
}

// ============ Test PatternAnalyzer ============

console.log('\n📊 Testing PatternAnalyzer...\n');

test('calculateRhythmicDensity - basic calculation', () => {
  const beats = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5];
  const density = PatternAnalyzer.calculateRhythmicDensity(beats, 4);
  if (density < 0 || density > 1) {
    throw new Error(`Density out of range: ${density}`);
  }
});

test('calculateEnergyCurve - generates curve', () => {
  const pattern = {
    kick: [0, 2],
    snare: [1, 3],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
  };
  const curve = PatternAnalyzer.calculateEnergyCurve(pattern, 4);
  if (!Array.isArray(curve) || curve.length === 0) {
    throw new Error('Energy curve not generated');
  }
});

test('detectSwingFactor - detects swing', () => {
  const beats = [0, 0.33, 0.67, 1, 1.33, 1.67, 2];
  const swing = PatternAnalyzer.detectSwingFactor(beats);
  if (swing < 0 || swing > 1) {
    throw new Error(`Swing factor out of range: ${swing}`);
  }
});

test('calculateComplexity - calculates complexity', () => {
  const pattern = {
    kick: [0, 2],
    snare: [1, 3],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
  };
  const complexity = PatternAnalyzer.calculateComplexity(pattern);
  if (complexity < 0 || complexity > 1) {
    throw new Error(`Complexity out of range: ${complexity}`);
  }
});

test('identifyFillOpportunities - finds fills', () => {
  const pattern = {
    kick: [0, 2],
    snare: [1, 3]
  };
  const fills = PatternAnalyzer.identifyFillOpportunities(pattern, 4);
  if (!Array.isArray(fills)) {
    throw new Error('Fills not an array');
  }
});

// ============ Test PsychologicalMapper ============

console.log('\n🧠 Testing PsychologicalMapper...\n');

test('analyzeStressTolerance - analyzes stress tolerance', () => {
  const pattern = {
    kick: [0, 2],
    snare: [1, 3]
  };
  const tolerance = PsychologicalMapper.analyzeStressTolerance(pattern);
  if (typeof tolerance !== 'boolean') {
    throw new Error('Stress tolerance not boolean');
  }
});

test('calculateChaosLevel - calculates chaos', () => {
  const beats = {
    kick: [0, 2],
    snare: [1, 3]
  };
  const chaos = PsychologicalMapper.calculateChaosLevel(beats);
  if (chaos < 0 || chaos > 1) {
    throw new Error(`Chaos level out of range: ${chaos}`);
  }
});

test('calculateSkillRequirement - calculates skill', () => {
  const skill = PsychologicalMapper.calculateSkillRequirement(0.5);
  if (skill < 0 || skill > 1) {
    throw new Error(`Skill requirement out of range: ${skill}`);
  }
});

test('analyzeTimingSensitivity - analyzes timing', () => {
  const pattern = {
    kick: [0, 2],
    snare: [1, 3],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
  };
  const sensitivity = PsychologicalMapper.analyzeTimingSensitivity(pattern);
  if (sensitivity < 0 || sensitivity > 1) {
    throw new Error(`Timing sensitivity out of range: ${sensitivity}`);
  }
});

test('analyzeHarmonicDarkness - analyzes harmony', () => {
  const chords = ['Am', 'F', 'C', 'G'];
  const darkness = PsychologicalMapper.analyzeHarmonicDarkness(chords);
  if (darkness < 0 || darkness > 1) {
    throw new Error(`Harmonic darkness out of range: ${darkness}`);
  }
});

// ============ Test GenreClassifier ============

console.log('\n🎸 Testing GenreClassifier...\n');

test('classifyDrumGenreWeights - classifies genres', () => {
  const pattern = {
    kick: [0, 2],
    snare: [1, 3],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
  };
  const weights = GenreClassifier.classifyDrumGenreWeights(pattern, [100, 120]);
  if (!weights.rock && !weights.punk && !weights.folk) {
    throw new Error('No genre weights generated');
  }
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  if (Math.abs(total - 1.0) > 0.1) {
    throw new Error(`Genre weights don't sum to 1: ${total}`);
  }
});

test('classifyHarmonyGenreWeights - classifies harmony', () => {
  const weights = GenreClassifier.classifyHarmonyGenreWeights(['C', 'G', 'Am', 'F'], 'major');
  if (!weights.rock && !weights.punk) {
    throw new Error('No harmony genre weights generated');
  }
});

test('classifyEraAuthenticity - classifies era', () => {
  const pattern = {
    kick: [0, 2],
    snare: [1, 3]
  };
  const eras = GenreClassifier.classifyEraAuthenticity(pattern, 'drums');
  if (!eras['60s'] && !eras['70s'] && !eras['80s']) {
    throw new Error('No era weights generated');
  }
});

// ============ Test EGMDProcessor ============

console.log('\n🥁 Testing EGMDProcessor...\n');

test('processPattern - processes drum pattern', () => {
  const midiData = {
    kick: [0, 2],
    snare: [1, 3],
    hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5]
  };
  const processed = EGMDProcessor.processPattern(midiData, {
    id: 'test_pattern',
    signature: '4/4',
    bpm: 120
  });
  
  if (!processed.id || !processed.beats || !processed.psychological_tags) {
    throw new Error('Pattern not fully processed');
  }
  if (!processed.genre_weights || !processed.gameplay_hooks) {
    throw new Error('Enhanced fields missing');
  }
});

test('processBatch - processes multiple patterns', () => {
  const patterns = [
    { kick: [0, 2], snare: [1, 3] },
    { kick: [0, 1, 2, 3], snare: [1, 3] }
  ];
  const processed = EGMDProcessor.processBatch(patterns);
  if (processed.length !== 2) {
    throw new Error(`Expected 2 patterns, got ${processed.length}`);
  }
});

test('filterByQuality - filters patterns', () => {
  const patterns = [
    EGMDProcessor.processPattern({ kick: [0, 2], snare: [1, 3] }, { id: 'simple', bpm: 120 }),
    EGMDProcessor.processPattern({ kick: [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 2.75, 3, 3.25, 3.5, 3.75], snare: [1, 3] }, { id: 'complex', bpm: 120 })
  ];
  const filtered = EGMDProcessor.filterByQuality(patterns, { maxComplexity: 0.5 });
  if (filtered.length === 0) {
    throw new Error('Quality filter too strict');
  }
});

test('curateCoreSet - curates diverse set', () => {
  const patterns = [];
  for (let i = 0; i < 50; i++) {
    patterns.push(EGMDProcessor.processPattern(
      { kick: [0, 2], snare: [1, 3], hihat: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] },
      { id: `pattern_${i}`, bpm: 100 + i }
    ));
  }
  const curated = EGMDProcessor.curateCoreSet(patterns);
  if (curated.length < 12 || curated.length > 24) {
    throw new Error(`Curated set size unexpected: ${curated.length}`);
  }
});

// ============ Test ChordonomiconProcessor ============

console.log('\n🎹 Testing ChordonomiconProcessor...\n');

test('processProgression - processes chord progression', () => {
  const progressionData = {
    chords: ['C', 'G', 'Am', 'F'],
    name: 'vi-IV-I-V'
  };
  const processed = ChordonomiconProcessor.processProgression(progressionData);
  
  if (!processed.chords || !processed.psychological_resonance) {
    throw new Error('Progression not fully processed');
  }
  if (!processed.industry_context || !processed.harmonic_analysis) {
    throw new Error('Enhanced fields missing');
  }
});

test('processBatch - processes multiple progressions', () => {
  const progressions = [
    { chords: ['C', 'G', 'Am', 'F'] },
    { chords: ['Am', 'F', 'C', 'G'] }
  ];
  const processed = ChordonomiconProcessor.processBatch(progressions);
  if (processed.length !== 2) {
    throw new Error(`Expected 2 progressions, got ${processed.length}`);
  }
});

test('calculateCatchiness - calculates catchiness', () => {
  const progression = { chords: ['C', 'G', 'Am', 'F'] };
  const catchiness = ChordonomiconProcessor._calculateCatchiness(progression);
  if (catchiness < 0 || catchiness > 1) {
    throw new Error(`Catchiness out of range: ${catchiness}`);
  }
});

test('calculateFamiliarity - calculates familiarity', () => {
  const progression = { chords: ['C', 'G', 'Am', 'F'] };
  const familiarity = ChordonomiconProcessor._calculateFamiliarity(progression);
  if (familiarity < 0 || familiarity > 1) {
    throw new Error(`Familiarity out of range: ${familiarity}`);
  }
});

// ============ Test LakhProcessor ============

console.log('\n🎵 Testing LakhProcessor...\n');

test('processPhrase - processes melody phrase', () => {
  const phraseData = {
    scale_degrees: [0, 1, 2, 3, 4],
    durations: [0.5, 0.5, 0.5, 0.5, 1]
  };
  const processed = LakhProcessor.processPhrase(phraseData, {
    id: 'test_phrase',
    length_bars: 1
  });
  
  if (!processed.scale_degrees || !processed.difficulty_profile) {
    throw new Error('Phrase not fully processed');
  }
  if (!processed.emotional_character || !processed.phrase_function) {
    throw new Error('Enhanced fields missing');
  }
});

test('processBatch - processes multiple phrases', () => {
  const phrases = [
    { scale_degrees: [0, 1, 2, 3, 4], durations: [0.5, 0.5, 0.5, 0.5, 1] },
    { scale_degrees: [0, 2, 4, 5, 7], durations: [0.25, 0.25, 0.25, 0.25, 1] }
  ];
  const processed = LakhProcessor.processBatch(phrases);
  if (processed.length !== 2) {
    throw new Error(`Expected 2 phrases, got ${processed.length}`);
  }
});

test('_calculateRange - calculates range', () => {
  const range = LakhProcessor._calculateRange([0, 2, 4, 7, 9]);
  if (range !== 9) {
    throw new Error(`Range calculation incorrect: ${range}`);
  }
});

test('_calculateContour - calculates contour', () => {
  const contour = LakhProcessor._calculateContour([0, 2, 4, 3, 2, 1, 0]);
  if (!['ascending', 'descending', 'arch', 'stable'].includes(contour)) {
    throw new Error(`Invalid contour: ${contour}`);
  }
});

// ============ Test Schema Validation ============

console.log('\n📋 Testing Schema Validation...\n');

test('Drum pattern schema completeness', () => {
  const pattern = EGMDProcessor.processPattern(
    { kick: [0, 2], snare: [1, 3] },
    { id: 'test', bpm: 120 }
  );
  
  const requiredFields = [
    'id', 'signature', 'complexity', 'beats', 'bpmRange',
    'psychological_tags', 'genre_weights', 'gameplay_hooks',
    'energy_curve', 'rhythmic_density', 'swing_factor', 'era_authenticity'
  ];
  
  for (const field of requiredFields) {
    if (!(field in pattern)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
});

test('Progression schema completeness', () => {
  const progression = ChordonomiconProcessor.processProgression({
    chords: ['C', 'G', 'Am', 'F']
  });
  
  const requiredFields = [
    'chords', 'catchiness', 'familiarity', 'complexity',
    'psychological_resonance', 'industry_context',
    'harmonic_analysis', 'gameplay_adaptations'
  ];
  
  for (const field of requiredFields) {
    if (!(field in progression)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
});

test('Phrase schema completeness', () => {
  const phrase = LakhProcessor.processPhrase({
    scale_degrees: [0, 1, 2, 3, 4],
    durations: [0.5, 0.5, 0.5, 0.5, 1]
  });
  
  const requiredFields = [
    'scale_degrees', 'durations', 'style', 'range',
    'difficulty_profile', 'emotional_character',
    'phrase_function', 'contextual_fitness'
  ];
  
  for (const field of requiredFields) {
    if (!(field in phrase)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
});

// ============ Summary ============

console.log('\n' + '='.repeat(60));
console.log('\n📊 Test Results:');
console.log(`   ✅ Passed: ${testsPassed}`);
console.log(`   ❌ Failed: ${testsFailed}`);
console.log(`   📈 Total:  ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
  console.log('\n🎉 All tests passed! The preprocessing pipeline is working correctly.\n');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Please review the errors above.\n');
  process.exit(1);
}
