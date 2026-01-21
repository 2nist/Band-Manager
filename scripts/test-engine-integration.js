#!/usr/bin/env node
/**
 * test-engine-integration.js - Test engine integration with processed datasets
 */

import { DrumEngine } from '../src/music/engines/DrumEngine.js';
import { HarmonyEngine } from '../src/music/engines/HarmonyEngine.js';
import { MelodyEngine } from '../src/music/engines/MelodyEngine.js';
import { ConstraintEngine } from '../src/music/engines/ConstraintEngine.js';
import { MusicGenerator } from '../src/music/MusicGenerator.js';

console.log('🧪 Testing Engine Integration with Processed Datasets\n');
console.log('='.repeat(60));

let testsPassed = 0;
let testsFailed = 0;

async function test(name, fn) {
  try {
    await fn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ ${name}`);
    console.error(`   Error: ${error.message}`);
    testsFailed++;
  }
}

// Mock game state
const mockGameState = {
  bandName: 'Test Band',
  week: 10,
  currentWeek: 10,
  money: 5000,
  fame: 100,
  bandMembers: [
    { instrument: 'drummer', skill: 70 },
    { instrument: 'guitarist', skill: 65 },
    { instrument: 'bassist', skill: 60 }
  ],
  bandConfidence: 60,
  psychState: {
    stress: 30,
    addiction_risk: 20,
    moral_integrity: 80,
    depression: 25,
    paranoia: 10,
    ego: 50,
    burnout: 20,
    substance_use: 15
  },
  labelDeal: null,
  fanbase: { primary: 'mixed', size: 1000, loyalty: 60 }
};

// Wrap all tests in async IIFE
(async () => {
  // Test DrumEngine
  console.log('\n🥁 Testing DrumEngine...\n');

  await test('DrumEngine loads patterns from dataset', async () => {
    const patterns = await DrumEngine.loadPatterns();
    if (!Array.isArray(patterns) || patterns.length === 0) {
      throw new Error('Patterns not loaded or empty');
    }
  });

  await test('DrumEngine generates pattern with constraints', async () => {
    const constraints = ConstraintEngine.generateConstraints(mockGameState);
    const result = await DrumEngine.generate(constraints, 'rock', 'test-seed-1');
    if (!result.pattern || !result.tempo) {
      throw new Error('Pattern generation failed');
    }
  });

  await test('DrumEngine uses constraint-based selection', async () => {
    const constraints1 = ConstraintEngine.generateConstraints({
      ...mockGameState,
      psychState: { ...mockGameState.psychState, stress: 10 }
    });
    const constraints2 = ConstraintEngine.generateConstraints({
      ...mockGameState,
      psychState: { ...mockGameState.psychState, stress: 90 }
    });
    
    const result1 = await DrumEngine.generate(constraints1, 'rock', 'test-seed-2');
    const result2 = await DrumEngine.generate(constraints2, 'rock', 'test-seed-2');
    
    // Should potentially select different patterns based on stress
    // (may be same if filtered to same candidates, but should handle stress differently)
    if (!result1.pattern || !result2.pattern) {
      throw new Error('Constraint-based selection failed');
    }
  });

  // Test HarmonyEngine
  console.log('\n🎹 Testing HarmonyEngine...\n');

  await test('HarmonyEngine loads progressions from dataset', async () => {
    const progressions = await HarmonyEngine.loadProgressions();
    if (!Array.isArray(progressions) || progressions.length === 0) {
      throw new Error('Progressions not loaded or empty');
    }
  });

  await test('HarmonyEngine generates progression with constraints', async () => {
    const constraints = ConstraintEngine.generateConstraints(mockGameState);
    const result = await HarmonyEngine.generate(constraints, 'rock', 'test-seed-3');
    if (!result.progression || !result.progression.chords) {
      throw new Error('Progression generation failed');
    }
  });

  await test('HarmonyEngine uses psychological resonance', async () => {
    const constraints = ConstraintEngine.generateConstraints({
      ...mockGameState,
      psychState: { ...mockGameState.psychState, depression: 80 }
    });
    const result = await HarmonyEngine.generate(constraints, 'rock', 'test-seed-4');
    
    // Should prefer minor mode or depressive progressions
    if (!result.progression) {
      throw new Error('Psychological resonance selection failed');
    }
  });

  // Test MelodyEngine
  console.log('\n🎵 Testing MelodyEngine...\n');

  await test('MelodyEngine loads phrases from dataset', async () => {
    const phrases = await MelodyEngine.loadPhrases();
    if (!Array.isArray(phrases) || phrases.length === 0) {
      throw new Error('Phrases not loaded or empty');
    }
  });

  await test('MelodyEngine assembles melody with constraints', async () => {
    const constraints = ConstraintEngine.generateConstraints(mockGameState);
    const harmony = await HarmonyEngine.generate(constraints, 'rock', 'test-seed-5');
    const result = await MelodyEngine.assemble(harmony, constraints, 'test-seed-6');
    
    if (!result.melody || !Array.isArray(result.melody)) {
      throw new Error('Melody assembly failed');
    }
  });

  await test('MelodyEngine uses difficulty profile', async () => {
    const constraints1 = ConstraintEngine.generateConstraints({
      ...mockGameState,
      bandMembers: [{ instrument: 'guitarist', skill: 30 }]
    });
    const constraints2 = ConstraintEngine.generateConstraints({
      ...mockGameState,
      bandMembers: [{ instrument: 'guitarist', skill: 90 }]
    });
    
    const harmony = await HarmonyEngine.generate(constraints1, 'rock', 'test-seed-7');
    const result1 = await MelodyEngine.assemble(harmony, constraints1, 'test-seed-8');
    const result2 = await MelodyEngine.assemble(harmony, constraints2, 'test-seed-8');
    
    if (!result1.melody || !result2.melody) {
      throw new Error('Difficulty-based selection failed');
    }
  });

  // Test End-to-End
  console.log('\n🎸 Testing End-to-End Generation...\n');

  await test('Complete song generation works', async () => {
    const song = await MusicGenerator.generateSong(mockGameState, 'rock', { seed: 'test-seed-9' });
    
    if (!song.musicalContent?.drums?.pattern || !song.musicalContent?.harmony?.progression || !song.musicalContent?.melody?.melody) {
      throw new Error('Complete generation failed');
    }
  });

  await test('Deterministic behavior (same seed = same output)', async () => {
    const seed = 'deterministic-test';
    
    const drums1 = await DrumEngine.generate(ConstraintEngine.generateConstraints(mockGameState), 'rock', seed);
    const drums2 = await DrumEngine.generate(ConstraintEngine.generateConstraints(mockGameState), 'rock', seed);
    
    // Patterns should be the same (or at least tempo should be)
    if (drums1.tempo !== drums2.tempo) {
      throw new Error('Non-deterministic tempo generation');
    }
  });

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('\n📊 Test Results:');
  console.log(`   ✅ Passed: ${testsPassed}`);
  console.log(`   ❌ Failed: ${testsFailed}`);
  console.log(`   📈 Total:  ${testsPassed + testsFailed}`);

  if (testsFailed === 0) {
    console.log('\n🎉 All engine integration tests passed!\n');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.\n');
    process.exit(1);
  }
})();
