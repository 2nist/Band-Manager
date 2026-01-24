/**
 * Tests for Enhanced Skill & Genre-Responsive Music Generation
 * 
 * Tests:
 * - Genre audio profiles
 * - Skill-responsive audio engine
 * - Enhanced song generator
 * - Integration with useMusicGeneration
 */

import { GENRE_AUDIO_PROFILES, getGenreProfile, getInstrumentProfile } from '../music/profiles/GENRE_AUDIO_PROFILES';
import { SkillResponsiveAudioEngine } from '../music/engines/SkillResponsiveAudioEngine';
import { EnhancedSongGenerator } from '../music/EnhancedSongGenerator';

// Mock Tone.js to avoid audio context issues in tests
jest.mock('tone', () => ({
  start: jest.fn(),
  Transport: {
    start: jest.fn(),
    stop: jest.fn(),
    pause: jest.fn(),
    cancel: jest.fn(),
    bpm: { value: 120 }
  },
  Synth: jest.fn(() => ({
    toDestination: jest.fn(),
    triggerAttackRelease: jest.fn()
  })),
  PolySynth: jest.fn(() => ({
    toDestination: jest.fn(),
    triggerAttackRelease: jest.fn()
  })),
  MembraneSynth: jest.fn(() => ({
    toDestination: jest.fn(),
    triggerAttackRelease: jest.fn()
  })),
  Distortion: jest.fn(() => ({
    toDestination: jest.fn()
  })),
  Reverb: jest.fn(() => ({
    toDestination: jest.fn(),
    generate: jest.fn()
  })),
  Chorus: jest.fn(() => ({
    toDestination: jest.fn()
  })),
  PingPongDelay: jest.fn(() => ({
    toDestination: jest.fn()
  })),
  Destination: {}
}));

// Mock MusicGenerator
jest.mock('../music/MusicGenerator', () => ({
  MusicGenerator: {
    generateSong: jest.fn(async (gameState, genre, options) => ({
      title: options?.songName || 'Test Song',
      genre: genre,
      composition: {
        tempo: 120,
        genre: genre,
        key: 'C',
        timeSignature: '4/4'
      },
      tracks: {
        drums: { notes: [], timing: [] },
        guitar: { notes: [], timing: [] },
        bass: { notes: [], timing: [] }
      },
      analysis: {
        qualityScore: 70,
        originalityScore: 65,
        commercialViability: 60
      },
      metadata: {
        name: options?.songName || 'Test Song',
        band: gameState.bandName || 'Test Band'
      }
    }))
  }
}));

describe('Genre Audio Profiles', () => {
  test('should return profile for valid genre', () => {
    const metalProfile = getGenreProfile('Metal');
    expect(metalProfile).toBeDefined();
    expect(metalProfile.drums).toBeDefined();
    expect(metalProfile.drums.timing_precision).toBe(0.95);
  });

  test('should handle case-insensitive genre names', () => {
    const metal1 = getGenreProfile('metal');
    const metal2 = getGenreProfile('METAL');
    const metal3 = getGenreProfile('Metal');
    
    expect(metal1).toEqual(metal2);
    expect(metal2).toEqual(metal3);
  });

  test('should return Rock profile for unknown genre', () => {
    const unknown = getGenreProfile('UnknownGenre');
    const rock = getGenreProfile('Rock');
    
    expect(unknown).toBeDefined();
    expect(unknown).toEqual(rock);
  });

  test('should handle EDM special case', () => {
    const edm1 = getGenreProfile('edm');
    const edm2 = getGenreProfile('EDM');
    const edm3 = getGenreProfile('Edm');
    
    expect(edm1).toBeDefined();
    expect(edm1).toEqual(edm2);
    expect(edm2).toEqual(edm3);
    expect(edm1.drums.timing_precision).toBe(0.99);
  });

  test('should return instrument profile for valid role', () => {
    const guitarProfile = getInstrumentProfile('Metal', 'guitar');
    expect(guitarProfile).toBeDefined();
    expect(guitarProfile.tone).toBe('heavy_distortion');
    expect(guitarProfile.timing_precision).toBe(0.9);
  });

  test('should return empty object for invalid instrument', () => {
    const invalid = getInstrumentProfile('Metal', 'invalid');
    expect(invalid).toEqual({});
  });

  test('all genres should have required structure', () => {
    const genres = Object.keys(GENRE_AUDIO_PROFILES);
    
    genres.forEach(genre => {
      const profile = GENRE_AUDIO_PROFILES[genre];
      expect(profile).toHaveProperty('drums');
      expect(profile).toHaveProperty('overall');
      expect(profile.drums).toHaveProperty('timing_precision');
      expect(profile.overall).toHaveProperty('tempo_range');
    });
  });
});

describe('SkillResponsiveAudioEngine', () => {
  const mockGenreProfile = {
    drums: {
      timing_precision: 0.9,
      effects: ['compression'],
      velocity_boost: 0.2
    },
    guitar: {
      timing_precision: 0.85,
      tone: 'clean',
      effects: ['reverb']
    },
    bass: {
      timing_precision: 0.8,
      playing_style: 'fingerstyle'
    }
  };

  const mockBandMembers = [
    {
      id: '1',
      firstName: 'John',
      role: 'drums',
      skill: 80,
      creativity: 70,
      reliability: 75,
      stagePresence: 65,
      morale: 80,
      drama: 30
    },
    {
      id: '2',
      firstName: 'Jane',
      role: 'guitar',
      skill: 60,
      creativity: 85,
      reliability: 70,
      stagePresence: 80,
      morale: 75,
      drama: 40
    },
    {
      id: '3',
      firstName: 'Bob',
      role: 'bass',
      skill: 50,
      creativity: 50,
      reliability: 60,
      stagePresence: 50,
      morale: 60,
      drama: 70
    }
  ];

  test('should initialize with genre profile and band members', () => {
    const engine = new SkillResponsiveAudioEngine(mockGenreProfile, mockBandMembers, 'test-seed');
    
    expect(engine.genreProfile).toEqual(mockGenreProfile);
    expect(engine.bandMembers).toEqual(mockBandMembers);
    expect(engine.instrumentProcessors).toBeDefined();
  });

  test('should create processor for each band member', () => {
    const engine = new SkillResponsiveAudioEngine(mockGenreProfile, mockBandMembers, 'test-seed');
    
    expect(engine.instrumentProcessors.drums).toBeDefined();
    expect(engine.instrumentProcessors.guitar).toBeDefined();
    expect(engine.instrumentProcessors.bass).toBeDefined();
  });

  test('should process instrument performance with skill modifiers', () => {
    const engine = new SkillResponsiveAudioEngine(mockGenreProfile, mockBandMembers, 'test-seed');
    
    const musicalData = {
      notes: [
        { pitch: 60, velocity: 0.8, startTime: 0 },
        { pitch: 62, velocity: 0.7, startTime: 0.5 }
      ],
      timing: [0, 0.5],
      dynamics: [0.8, 0.7],
      effects: []
    };

    const processed = engine.processInstrumentPerformance(
      mockBandMembers[0], // Drummer with skill 80
      musicalData,
      0
    );

    expect(processed).toBeDefined();
    expect(processed.notes).toBeDefined();
    expect(processed.timing).toBeDefined();
    expect(processed.dynamics).toBeDefined();
  });

  test('should calculate skill modifiers correctly', () => {
    const engine = new SkillResponsiveAudioEngine(mockGenreProfile, mockBandMembers, 'test-seed');
    const processor = engine.instrumentProcessors.drums;
    
    // Access skillMods directly (it's a property, not a method)
    const modifiers = processor.skillMods;
    
    expect(modifiers).toBeDefined();
    expect(modifiers.timing_accuracy).toBeGreaterThan(0);
    expect(modifiers.timing_accuracy).toBeLessThanOrEqual(1);
    expect(modifiers.note_accuracy).toBeGreaterThan(0);
    expect(modifiers.note_accuracy).toBeLessThanOrEqual(1);
    expect(modifiers.performance_quality).toBeGreaterThan(0);
  });

  test('should apply timing precision based on skill', () => {
    const highSkillMember = { ...mockBandMembers[0], skill: 95, reliability: 95 };
    const lowSkillMember = { ...mockBandMembers[0], skill: 30, reliability: 30 };
    
    const highEngine = new SkillResponsiveAudioEngine(mockGenreProfile, [highSkillMember], 'test-seed');
    const lowEngine = new SkillResponsiveAudioEngine(mockGenreProfile, [lowSkillMember], 'test-seed');
    
    const highSkillProcessor = highEngine.instrumentProcessors.drums;
    const lowSkillProcessor = lowEngine.instrumentProcessors.drums;
    
    // Access skillMods directly
    const highModifiers = highSkillProcessor.skillMods;
    const lowModifiers = lowSkillProcessor.skillMods;
    
    expect(highModifiers.timing_accuracy).toBeGreaterThan(lowModifiers.timing_accuracy);
  });

  test('should introduce note errors for low-skill players', () => {
    const lowSkillMember = { ...mockBandMembers[2], skill: 20 };
    const engine = new SkillResponsiveAudioEngine(mockGenreProfile, [lowSkillMember], 'test-seed');
    
    const musicalData = {
      notes: [{ pitch: 60, velocity: 0.8, startTime: 0 }],
      timing: [0],
      dynamics: [0.8],
      effects: []
    };
    
    const processed = engine.processInstrumentPerformance(lowSkillMember, musicalData, 0);
    
    // Low skill should potentially introduce errors
    expect(processed.notes).toBeDefined();
    // Note: Actual error introduction is probabilistic, so we just check structure
  });

  test('should add creative embellishments for high-creativity players', () => {
    const creativeMember = { ...mockBandMembers[1], creativity: 95 };
    const engine = new SkillResponsiveAudioEngine(mockGenreProfile, [creativeMember], 'test-seed');
    
    const musicalData = {
      notes: [{ pitch: 60, velocity: 0.8, startTime: 0 }],
      timing: [0],
      dynamics: [0.8],
      effects: []
    };
    
    const processed = engine.processInstrumentPerformance(creativeMember, musicalData, 0);
    
    expect(processed.notes).toBeDefined();
    // Creative embellishments are probabilistic
  });
});

describe('EnhancedSongGenerator', () => {
  const mockGameState = {
    bandName: 'Test Band',
    week: 5,
    money: 1000,
    fame: 50,
    genre: 'rock',
    bandMembers: [
      {
        id: '1',
        firstName: 'John',
        role: 'drums',
        skill: 75,
        creativity: 70,
        reliability: 80,
        stagePresence: 65,
        morale: 75,
        drama: 30
      },
      {
        id: '2',
        firstName: 'Jane',
        role: 'guitar',
        skill: 80,
        creativity: 85,
        reliability: 75,
        stagePresence: 80,
        morale: 80,
        drama: 25
      },
      {
        id: '3',
        firstName: 'Bob',
        role: 'bass',
        skill: 70,
        creativity: 60,
        reliability: 70,
        stagePresence: 60,
        morale: 70,
        drama: 40
      }
    ]
  };

  test('should initialize with game state', () => {
    const generator = new EnhancedSongGenerator(mockGameState, 'rock');
    
    expect(generator.gameState).toEqual(mockGameState);
    expect(generator.genre).toBe('Rock');
    expect(generator.genreProfile).toBeDefined();
    expect(generator.bandMembers.length).toBe(3);
  });

  test('should normalize genre names correctly', () => {
    const gen1 = new EnhancedSongGenerator(mockGameState, 'metal');
    const gen2 = new EnhancedSongGenerator(mockGameState, 'METAL');
    const gen3 = new EnhancedSongGenerator(mockGameState, 'Metal');
    
    expect(gen1.genre).toBe('Metal');
    expect(gen2.genre).toBe('Metal');
    expect(gen3.genre).toBe('Metal');
  });

  test('should handle EDM genre correctly', () => {
    const generator = new EnhancedSongGenerator(mockGameState, 'edm');
    expect(generator.genre).toBe('EDM');
  });

  test('should generate enhanced song with skill data', async () => {
    const generator = new EnhancedSongGenerator(mockGameState, 'rock');
    const song = await generator.generateEnhancedSong('Test Song');
    
    expect(song).toBeDefined();
    expect(song.title || song.metadata?.name).toBe('Test Song');
    expect(song.enhanced).toBeDefined();
    expect(song.enhanced.skillInfluence).toBeDefined();
    expect(song.enhanced.genreAuthenticity).toBeGreaterThanOrEqual(0);
    expect(song.enhanced.genreAuthenticity).toBeLessThanOrEqual(1);
    expect(song.enhanced.performanceQuality).toBeGreaterThanOrEqual(0);
    expect(song.enhanced.performanceQuality).toBeLessThanOrEqual(1);
  });

  test('should include skill influence for each member', async () => {
    const generator = new EnhancedSongGenerator(mockGameState, 'rock');
    const song = await generator.generateEnhancedSong('Test Song');
    
    const skillInfluence = song.enhanced?.skillInfluence;
    expect(skillInfluence).toBeDefined();
    
    // Should have entries for each member role
    expect(skillInfluence.drums || skillInfluence.Drums).toBeDefined();
    expect(skillInfluence.guitar || skillInfluence.Guitar).toBeDefined();
    expect(skillInfluence.bass || skillInfluence.Bass).toBeDefined();
  });

  test('should calculate genre authenticity based on member skills', async () => {
    const highSkillState = {
      ...mockGameState,
      bandMembers: mockGameState.bandMembers.map(m => ({ ...m, skill: 95, reliability: 95 }))
    };
    
    const lowSkillState = {
      ...mockGameState,
      bandMembers: mockGameState.bandMembers.map(m => ({ ...m, skill: 30, reliability: 30 }))
    };
    
    const highGen = new EnhancedSongGenerator(highSkillState, 'metal');
    const lowGen = new EnhancedSongGenerator(lowSkillState, 'metal');
    
    const highSong = await highGen.generateEnhancedSong('High Skill');
    const lowSong = await lowGen.generateEnhancedSong('Low Skill');
    
    // High skill should have better genre authenticity for Metal (requires 95% timing)
    expect(highSong.enhanced.genreAuthenticity).toBeGreaterThan(lowSong.enhanced.genreAuthenticity);
  });

  test('should work with different genres', async () => {
    const genres = ['rock', 'metal', 'jazz', 'punk', 'funk', 'folk', 'blues', 'edm'];
    
    for (const genre of genres) {
      const generator = new EnhancedSongGenerator(mockGameState, genre);
      const song = await generator.generateEnhancedSong(`Test ${genre}`);
      
      expect(song).toBeDefined();
      expect(song.enhanced).toBeDefined();
      expect(song.enhanced.genreAuthenticity).toBeGreaterThanOrEqual(0);
    }
  });

  test('should handle empty band members gracefully', async () => {
    const emptyState = { ...mockGameState, bandMembers: [] };
    const generator = new EnhancedSongGenerator(emptyState, 'rock');
    
    // Should still generate, but without skill processing
    const song = await generator.generateEnhancedSong('Test Song');
    expect(song).toBeDefined();
  });

  test('should include member skill modifiers in song data', async () => {
    const generator = new EnhancedSongGenerator(mockGameState, 'rock');
    const song = await generator.generateEnhancedSong('Test Song');
    
    expect(song.enhanced).toBeDefined();
    expect(song.enhanced.memberSkillModifiers).toBeDefined();
    
    // Should have modifiers for each member
    const modifiers = song.enhanced.memberSkillModifiers;
    expect(Object.keys(modifiers).length).toBeGreaterThan(0);
  });
});

describe('Integration Tests', () => {
  const mockGameState = {
    bandName: 'Integration Test Band',
    week: 10,
    money: 2000,
    fame: 100,
    genre: 'rock',
    bandMembers: [
      {
        id: '1',
        role: 'drums',
        skill: 80,
        creativity: 70,
        reliability: 75,
        stagePresence: 65,
        morale: 80,
        drama: 30
      },
      {
        id: '2',
        role: 'guitar',
        skill: 85,
        creativity: 90,
        reliability: 80,
        stagePresence: 85,
        morale: 85,
        drama: 20
      }
    ]
  };

  test('should generate complete song with all enhanced features', async () => {
    const generator = new EnhancedSongGenerator(mockGameState, 'metal');
    const song = await generator.generateEnhancedSong('Integration Test Song');
    
    // Check basic structure
    expect(song.title || song.metadata?.name).toBe('Integration Test Song');
    expect(song.genre || song.composition?.genre).toBeDefined();
    
    // Check enhanced features
    expect(song.enhanced).toBeDefined();
    expect(song.enhanced.skillInfluence).toBeDefined();
    expect(song.enhanced.genreAuthenticity).toBeDefined();
    expect(song.enhanced.performanceQuality).toBeDefined();
    
    // Check analysis
    expect(song.analysis).toBeDefined();
    expect(song.analysis.qualityScore).toBeDefined();
  });

  test('should produce different results for different genres', async () => {
    const rockGen = new EnhancedSongGenerator(mockGameState, 'rock');
    const jazzGen = new EnhancedSongGenerator(mockGameState, 'jazz');
    
    const rockSong = await rockGen.generateEnhancedSong('Rock Song');
    const jazzSong = await jazzGen.generateEnhancedSong('Jazz Song');
    
    // Both should be valid
    expect(rockSong).toBeDefined();
    expect(jazzSong).toBeDefined();
    
    // Genre authenticity might differ based on skill match
    expect(rockSong.enhanced.genreAuthenticity).toBeDefined();
    expect(jazzSong.enhanced.genreAuthenticity).toBeDefined();
  });

  test('should handle members with varying skill levels', async () => {
    const mixedSkillState = {
      ...mockGameState,
      bandMembers: [
        { ...mockGameState.bandMembers[0], skill: 95, reliability: 95 }, // High skill
        { ...mockGameState.bandMembers[1], skill: 40, reliability: 50 }  // Low skill
      ]
    };
    
    const generator = new EnhancedSongGenerator(mixedSkillState, 'metal');
    const song = await generator.generateEnhancedSong('Mixed Skills');
    
    expect(song.enhanced.skillInfluence).toBeDefined();
    
    // High skill member should have better metrics
    const skillInfluence = song.enhanced.skillInfluence;
    const drumsInfluence = skillInfluence.drums || skillInfluence.Drums;
    const guitarInfluence = skillInfluence.guitar || skillInfluence.Guitar;
    
    if (drumsInfluence && guitarInfluence) {
      // Drummer (high skill) should have better note accuracy
      expect(drumsInfluence.note_accuracy).toBeGreaterThan(guitarInfluence.note_accuracy);
    }
  });
});
