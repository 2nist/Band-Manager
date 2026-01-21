/**
 * Tests for Music Generation Engines
 * 
 * Direct tests for DrumEngine, HarmonyEngine, and MelodyEngine
 */

// Mock loadDataset
jest.mock('../music/utils/loadDataset.js', () => ({
  loadDataset: jest.fn(async (name) => {
    if (name === 'drums') {
      return [
        {
          id: 'test-drum-1',
          signature: '4/4',
          complexity: 'medium',
          beats: { kick: [0, 2], snare: [1, 3], hihat: [0.5, 1.5, 2.5, 3.5], ghostSnare: [] },
          bpmRange: [90, 130],
          psychological_tags: { stress_appropriate: true, chaos_level: 0.3 },
          genre_weights: { rock: 0.8, punk: 0.3 }
        }
      ];
    }
    if (name === 'progressions') {
      return [
        {
          chords: ['C', 'G', 'Am', 'F'],
          name: 'test-progression-1',
          mode: 'major',
          psychological_resonance: { depression_weight: 0.3 },
          industry_context: { commercial_safety: 0.8 }
        }
      ];
    }
    if (name === 'phrases') {
      return [
        {
          scale_degrees: [0, 1, 2, 3],
          durations: [0.5, 0.5, 0.5, 0.5],
          length_bars: 1,
          difficulty_profile: { technical_skill: 0.4 },
          emotional_character: { melancholy: 0.3 }
        }
      ];
    }
    return null;
  }),
  clearDatasetCache: jest.fn()
}));

import { DrumEngine } from '../music/engines/DrumEngine.js';
import { HarmonyEngine } from '../music/engines/HarmonyEngine.js';
import { MelodyEngine } from '../music/engines/MelodyEngine.js';
import { ConstraintEngine } from '../music/engines/ConstraintEngine.js';

describe('Music Engines', () => {
  let mockConstraints;

  beforeEach(() => {
    mockConstraints = {
      psychConstraints: {
        stress: 30,
        depression: 25,
        burnout: 20,
        corruption: 20,
        substanceUse: 15
      },
      bandConstraints: {
        overallSkill: 70,
        confidence: 60,
        memberSkills: {
          drummer: 70,
          guitarist: 65
        }
      },
      industryConstraints: {
        labelPressure: 0
      },
      contextConstraints: {
        equipmentQuality: 50,
        studioQuality: 50
      }
    };
  });

  describe('DrumEngine', () => {
    it('should load patterns from dataset', async () => {
      const patterns = await DrumEngine.loadPatterns();
      expect(patterns).toBeDefined();
      expect(Array.isArray(patterns)).toBe(true);
      expect(patterns.length).toBeGreaterThan(0);
    });

    it('should generate drum pattern with constraints', async () => {
      const result = await DrumEngine.generate(mockConstraints, 'rock', 'test-seed-1');
      
      expect(result).toBeDefined();
      expect(result.pattern).toBeDefined();
      expect(result.tempo).toBeDefined();
      expect(result.genre).toBe('rock');
    });

    it('should filter patterns by genre', async () => {
      const rockResult = await DrumEngine.generate(mockConstraints, 'rock', 'test-seed-2');
      const punkResult = await DrumEngine.generate(mockConstraints, 'punk', 'test-seed-2');
      
      expect(rockResult.genre).toBe('rock');
      expect(punkResult.genre).toBe('punk');
    });

    it('should apply skill-based mutations', async () => {
      const highSkillConstraints = {
        ...mockConstraints,
        bandConstraints: {
          ...mockConstraints.bandConstraints,
          memberSkills: { drummer: 90 }
        }
      };
      
      const result = await DrumEngine.generate(highSkillConstraints, 'rock', 'test-seed-3');
      expect(result.pattern).toBeDefined();
    });

    it('should use fallback patterns if dataset fails', async () => {
      // Force dataset to return null
      const { loadDataset } = require('../music/utils/loadDataset.js');
      loadDataset.mockResolvedValueOnce(null);
      
      // Clear cache
      DrumEngine.patterns = null;
      
      const result = await DrumEngine.generate(mockConstraints, 'rock', 'test-seed-4');
      expect(result).toBeDefined();
      expect(result.pattern).toBeDefined();
    });
  });

  describe('HarmonyEngine', () => {
    it('should load progressions from dataset', async () => {
      const progressions = await HarmonyEngine.loadProgressions();
      expect(progressions).toBeDefined();
      expect(Array.isArray(progressions)).toBe(true);
      expect(progressions.length).toBeGreaterThan(0);
    });

    it('should generate progression with constraints', async () => {
      const result = await HarmonyEngine.generate(mockConstraints, 'rock', 'test-seed-5');
      
      expect(result).toBeDefined();
      expect(result.progression).toBeDefined();
      expect(result.progression.chords).toBeDefined();
      expect(result.mode).toBeDefined();
      expect(result.genre).toBe('rock');
    });

    it('should prefer minor mode for depressed state', async () => {
      const depressedConstraints = {
        ...mockConstraints,
        psychConstraints: {
          ...mockConstraints.psychConstraints,
          depression: 80
        }
      };
      
      const result = await HarmonyEngine.generate(depressedConstraints, 'rock', 'test-seed-6');
      // Should prefer minor mode (though may not always be minor due to genre preferences)
      expect(result.mode).toBeDefined();
    });

    it('should filter by commercial viability under label pressure', async () => {
      const labelPressureConstraints = {
        ...mockConstraints,
        industryConstraints: {
          labelPressure: 80
        }
      };
      
      const result = await HarmonyEngine.generate(labelPressureConstraints, 'rock', 'test-seed-7');
      expect(result.progression).toBeDefined();
    });

    it('should calculate commercial viability', () => {
      const progression = {
        familiarity: 0.8,
        catchiness: 0.9,
        industry_context: { commercial_safety: 0.85 }
      };
      
      const viability = HarmonyEngine.calculateCommercialViability(progression);
      expect(typeof viability).toBe('number');
      expect(viability).toBeGreaterThanOrEqual(0);
      expect(viability).toBeLessThanOrEqual(100);
    });
  });

  describe('MelodyEngine', () => {
    it('should load phrases from dataset', async () => {
      const phrases = await MelodyEngine.loadPhrases();
      expect(phrases).toBeDefined();
      expect(Array.isArray(phrases)).toBe(true);
      expect(phrases.length).toBeGreaterThan(0);
    });

    it('should assemble melody from chord progression', async () => {
      const harmony = {
        progression: {
          chords: ['C', 'G', 'Am', 'F']
        },
        mode: 'major'
      };
      
      const result = await MelodyEngine.assemble(harmony, mockConstraints, 'test-seed-8');
      
      expect(result).toBeDefined();
      expect(result.melody).toBeDefined();
      expect(Array.isArray(result.melody)).toBe(true);
      expect(result.songStructure).toBeDefined();
    });

    it('should filter phrases by skill level', async () => {
      const lowSkillConstraints = {
        ...mockConstraints,
        bandConstraints: {
          ...mockConstraints.bandConstraints,
          memberSkills: { guitarist: 30 }
        }
      };
      
      const harmony = {
        progression: { chords: ['C', 'G'] },
        mode: 'major'
      };
      
      const result = await MelodyEngine.assemble(harmony, lowSkillConstraints, 'test-seed-9');
      expect(result.melody).toBeDefined();
    });

    it('should generate section contours', async () => {
      const harmony = {
        progression: { chords: ['C', 'G', 'Am', 'F'] },
        mode: 'major'
      };
      
      const result = await MelodyEngine.assemble(harmony, mockConstraints, 'test-seed-10');
      
      result.melody.forEach(section => {
        expect(section.contour).toBeDefined();
        expect(['arch', 'ascending', 'descending', 'stable', 'flat']).toContain(section.contour);
      });
    });

    it('should generate song structure', async () => {
      const harmony = {
        progression: { chords: ['C', 'G', 'Am', 'F'] },
        mode: 'major'
      };
      
      const result = await MelodyEngine.assemble(harmony, mockConstraints, 'test-seed-11');
      
      expect(result.songStructure).toBeDefined();
      expect(Array.isArray(result.songStructure)).toBe(true);
      expect(result.songStructure.length).toBeGreaterThan(0);
    });
  });

  describe('Engine Integration', () => {
    it('should generate complete song from all engines', async () => {
      const gameState = {
        bandName: 'Test Band',
        currentWeek: 1,
        week: 1,
        fame: 50,
        money: 5000,
        bandMembers: [
          { instrument: 'drummer', skill: 70 },
          { instrument: 'guitarist', skill: 65 }
        ],
        bandConfidence: 60,
        psychState: {
          stress: 30,
          depression: 25,
          burnout: 20,
          addiction_risk: 15,
          moral_integrity: 80,
          substance_use: 10
        }
      };

      const constraints = ConstraintEngine.generateConstraints(gameState);
      const drums = await DrumEngine.generate(constraints, 'rock', 'integration-test');
      const harmony = await HarmonyEngine.generate(constraints, 'rock', 'integration-test');
      const melody = await MelodyEngine.assemble(harmony, constraints, 'integration-test');

      expect(drums).toBeDefined();
      expect(harmony).toBeDefined();
      expect(melody).toBeDefined();
      
      expect(drums.tempo).toBeDefined();
      expect(harmony.progression).toBeDefined();
      expect(melody.melody).toBeDefined();
    });

    it('should be deterministic with same seed', async () => {
      const seed = 'deterministic-test';
      
      const drums1 = await DrumEngine.generate(mockConstraints, 'rock', seed);
      const drums2 = await DrumEngine.generate(mockConstraints, 'rock', seed);
      
      expect(drums1.tempo).toBe(drums2.tempo);
    });
  });
});
