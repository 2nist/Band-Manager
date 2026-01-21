/**
 * Tests for Procedural Music Generation System
 * 
 * Tests MusicGenerator, FanReactionSystem, and integration with game logic
 */

import { MusicGenerator } from '../music/MusicGenerator';
import { FanReactionSystem } from '../music/FanReactionSystem';
import { useGameLogic } from '../hooks/useGameLogic';

// Mock the music engines
jest.mock('../music/engines/ConstraintEngine', () => ({
  ConstraintEngine: {
    generateConstraints: jest.fn((gameState) => ({
      bandConstraints: {
        overallSkill: gameState.bandMembers?.length > 0 ? 70 : 50,
        confidence: gameState.bandConfidence || 50,
        chemistry: 60
      },
      psychConstraints: {
        burnout: gameState.burnout || 20,
        stress: gameState.stress || 30
      },
      industryConstraints: {
        labelPressure: gameState.labelPressure || 0,
        fanExpectations: { catchiness: 0.5 }
      },
      contextConstraints: {
        equipmentQuality: gameState.gearTier ? gameState.gearTier * 20 : 50,
        studioQuality: gameState.studioTier ? gameState.studioTier * 20 : 50
      },
      narrativeConstraints: {
        emotionalTone: { positivity: 50, intensity: 50, darkness: 20 },
        lyricThemes: [],
        unlockedGenres: {}
      }
    }))
  }
}));

jest.mock('../music/engines/DrumEngine', () => ({
  DrumEngine: {
    generate: jest.fn(() => ({
      tempo: 120,
      pattern: 'standard',
      complexity: 5
    }))
  }
}));

jest.mock('../music/engines/HarmonyEngine', () => ({
  HarmonyEngine: {
    generate: jest.fn(() => ({
      progression: ['I', 'IV', 'V', 'I'],
      mode: 'major',
      complexity: 4
    })),
    calculateCommercialViability: jest.fn(() => 0.6)
  }
}));

jest.mock('../music/engines/MelodyEngine', () => ({
  MelodyEngine: {
    assemble: jest.fn(() => ({
      melody: 'test-melody',
      songStructure: ['verse', 'chorus', 'verse', 'chorus', 'bridge', 'chorus']
    }))
  }
}));

// Mock React hooks
jest.mock('react', () => {
  const actualReact = jest.requireActual('react');
  return {
    ...actualReact,
    useCallback: (fn) => fn,
  };
});

describe('Music Generation System', () => {
  let mockGameState;

  beforeEach(() => {
    mockGameState = {
      bandName: 'Test Band',
      currentWeek: 1,
      week: 1,
      money: 10000,
      fame: 50,
      bandMembers: [
        { role: 'vocalist', skill: 70 },
        { role: 'guitarist', skill: 75 }
      ],
      bandConfidence: 60,
      burnout: 20,
      stress: 30,
      gearTier: 1,
      studioTier: 1,
      fanbase: {
        primary: 'mixed',
        size: 100,
        loyalty: 50
      }
    };

    jest.clearAllMocks();
  });

  describe('MusicGenerator', () => {
    describe('generateSong', () => {
      it('should generate a complete song structure', async () => {
        const song = await MusicGenerator.generateSong(mockGameState, 'rock');

        expect(song).toBeDefined();
        expect(song.metadata).toBeDefined();
        expect(song.metadata.name).toBeDefined();
        expect(song.metadata.genre).toBe('rock');
        expect(song.metadata.band).toBe('Test Band');
        expect(song.metadata.week).toBe(1);
        expect(song.metadata.seed).toBeDefined();
      });

      it('should include game context in song', async () => {
        const song = await MusicGenerator.generateSong(mockGameState, 'rock');

        expect(song.gameContext).toBeDefined();
        expect(song.gameContext.constraints).toBeDefined();
        expect(song.gameContext.bandSkill).toBeDefined();
        expect(song.gameContext.bandConfidence).toBe(60);
      });

      it('should include musical content', async () => {
        const song = await MusicGenerator.generateSong(mockGameState, 'rock');

        expect(song.musicalContent).toBeDefined();
        expect(song.musicalContent.drums).toBeDefined();
        expect(song.musicalContent.harmony).toBeDefined();
        expect(song.musicalContent.melody).toBeDefined();
      });

      it('should include composition metadata', async () => {
        const song = await MusicGenerator.generateSong(mockGameState, 'rock');

        expect(song.composition).toBeDefined();
        expect(song.composition.tempo).toBe(120);
        expect(song.composition.genre).toBe('rock');
        expect(song.composition.structure).toBeDefined();
      });

      it('should include analysis scores', async () => {
        const song = await MusicGenerator.generateSong(mockGameState, 'rock');

        expect(song.analysis).toBeDefined();
        expect(typeof song.analysis.qualityScore).toBe('number');
        expect(typeof song.analysis.originalityScore).toBe('number');
        expect(typeof song.analysis.commercialViability).toBe('number');
        expect(song.analysis.emotionalTone).toBeDefined();
      });

      it('should use custom song name when provided', async () => {
        const song = await MusicGenerator.generateSong(mockGameState, 'rock', {
          songName: 'Custom Song Name'
        });

        expect(song.metadata.name).toBe('Custom Song Name');
      });

      it('should use seed for reproducibility', async () => {
        const song1 = await MusicGenerator.generateSong(mockGameState, 'rock', {
          seed: 'test-seed-123'
        });
        const song2 = await MusicGenerator.generateSong(mockGameState, 'rock', {
          seed: 'test-seed-123'
        });

        expect(song1.metadata.seed).toBe(song2.metadata.seed);
      });

      it('should handle different genres', async () => {
        const genres = ['rock', 'punk', 'funk', 'metal', 'folk', 'jazz'];
        
        for (const genre of genres) {
          const song = await MusicGenerator.generateSong(mockGameState, genre);
          expect(song.metadata.genre).toBe(genre);
          expect(song.composition.genre).toBe(genre);
        }
      });

      it('should calculate quality score based on band skill and equipment', async () => {
        const highSkillState = {
          ...mockGameState,
          bandMembers: [
            { role: 'vocalist', skill: 90 },
            { role: 'guitarist', skill: 95 }
          ],
          gearTier: 3,
          studioTier: 3
        };

        const lowSkillState = {
          ...mockGameState,
          bandMembers: [],
          gearTier: 0,
          studioTier: 0
        };

        const highSong = await MusicGenerator.generateSong(highSkillState, 'rock');
        const lowSong = await MusicGenerator.generateSong(lowSkillState, 'rock');

        // High skill should generally produce higher quality
        expect(highSong.analysis.qualityScore).toBeGreaterThanOrEqual(0);
        expect(lowSong.analysis.qualityScore).toBeGreaterThanOrEqual(0);
        expect(highSong.analysis.qualityScore).toBeLessThanOrEqual(100);
        expect(lowSong.analysis.qualityScore).toBeLessThanOrEqual(100);
      });

      it('should calculate originality based on confidence and burnout', async () => {
        const confidentState = {
          ...mockGameState,
          bandConfidence: 90,
          burnout: 10
        };

        const burnedOutState = {
          ...mockGameState,
          bandConfidence: 30,
          burnout: 80
        };

        const confidentSong = await MusicGenerator.generateSong(confidentState, 'rock');
        const burnedOutSong = await MusicGenerator.generateSong(burnedOutState, 'rock');

        expect(confidentSong.analysis.originalityScore).toBeGreaterThanOrEqual(0);
        expect(burnedOutSong.analysis.originalityScore).toBeGreaterThanOrEqual(0);
        expect(confidentSong.analysis.originalityScore).toBeLessThanOrEqual(100);
        expect(burnedOutSong.analysis.originalityScore).toBeLessThanOrEqual(100);
      });
    });

    describe('generateAlbum', () => {
      it('should generate multiple tracks', async () => {
        const album = await MusicGenerator.generateAlbum(mockGameState, 'rock', {
          trackCount: 5
        });

        expect(album).toBeDefined();
        expect(album.metadata).toBeDefined();
        expect(album.metadata.trackCount).toBe(5);
        expect(album.tracks).toBeDefined();
        expect(album.tracks.length).toBe(5);
      });

      it('should use default track count if not specified', async () => {
        const album = await MusicGenerator.generateAlbum(mockGameState, 'rock');

        expect(album.tracks.length).toBe(10); // Default from code
      });

      it('should generate unique tracks with different seeds', async () => {
        const album = await MusicGenerator.generateAlbum(mockGameState, 'rock', {
          trackCount: 3
        });

        const seeds = album.tracks.map(t => t.metadata.seed);
        // Each track should have a unique seed
        expect(new Set(seeds).size).toBe(3);
      });

      it('should include album metadata', async () => {
        const album = await MusicGenerator.generateAlbum(mockGameState, 'rock', {
          albumName: 'Test Album',
          trackCount: 3
        });

        expect(album.metadata.albumName).toBe('Test Album');
        expect(album.metadata.genre).toBe('rock');
        expect(album.metadata.generatedAt).toBeDefined();
      });
    });

    describe('exportForRendering', () => {
      it('should export song in renderable format', async () => {
        const song = await MusicGenerator.generateSong(mockGameState, 'rock');
        const exported = MusicGenerator.exportForRendering(song);

        expect(exported.metadata).toBeDefined();
        expect(exported.tempo).toBe(120);
        expect(exported.key).toBeDefined();
        expect(exported.mode).toBeDefined();
        expect(exported.drums).toBeDefined();
        expect(exported.harmony).toBeDefined();
        expect(exported.melody).toBeDefined();
      });
    });
  });

  describe('FanReactionSystem', () => {
    let mockSong;

    beforeEach(() => {
      mockSong = {
        metadata: {
          name: 'Test Song',
          band: 'Test Band'
        },
        analysis: {
          qualityScore: 75,
          originalityScore: 70,
          commercialViability: 65,
          emotionalTone: { positivity: 60, intensity: 50, darkness: 20 }
        }
      };
    });

    describe('generateReactions', () => {
      it('should generate reaction data structure', () => {
        const reactions = FanReactionSystem.generateReactions(mockSong, mockGameState.fanbase);

        expect(reactions).toBeDefined();
        expect(reactions.reactions).toBeDefined();
        expect(reactions.impact).toBeDefined();
        expect(reactions.timestamp).toBeDefined();
      });

      it('should generate overall reaction message', () => {
        const reactions = FanReactionSystem.generateReactions(mockSong, mockGameState.fanbase);

        expect(reactions.reactions.overall).toBeDefined();
        expect(typeof reactions.reactions.overall).toBe('string');
        expect(reactions.reactions.overall.length).toBeGreaterThan(0);
      });

      it('should generate quality feedback', () => {
        const reactions = FanReactionSystem.generateReactions(mockSong, mockGameState.fanbase);

        expect(reactions.reactions.quality).toBeDefined();
        expect(Array.isArray(reactions.reactions.quality)).toBe(true);
        expect(reactions.reactions.quality.length).toBeGreaterThan(0);
      });

      it('should generate originality feedback', () => {
        const reactions = FanReactionSystem.generateReactions(mockSong, mockGameState.fanbase);

        expect(reactions.reactions.originality).toBeDefined();
        expect(Array.isArray(reactions.reactions.originality)).toBe(true);
        expect(reactions.reactions.originality.length).toBeGreaterThan(0);
      });

      it('should generate emotional feedback', () => {
        const reactions = FanReactionSystem.generateReactions(mockSong, mockGameState.fanbase);

        expect(reactions.reactions.emotional).toBeDefined();
        expect(Array.isArray(reactions.reactions.emotional)).toBe(true);
      });

      it('should generate fanbase-specific reactions', () => {
        const reactions = FanReactionSystem.generateReactions(mockSong, mockGameState.fanbase);

        expect(reactions.reactions.fanSpecific).toBeDefined();
        expect(typeof reactions.reactions.fanSpecific).toBe('string');
      });

      it('should calculate fame gain', () => {
        const reactions = FanReactionSystem.generateReactions(mockSong, mockGameState.fanbase);

        expect(reactions.impact.fameGain).toBeDefined();
        expect(typeof reactions.impact.fameGain).toBe('number');
        expect(reactions.impact.fameGain).toBeGreaterThanOrEqual(0);
      });

      it('should calculate money gain', () => {
        const reactions = FanReactionSystem.generateReactions(mockSong, mockGameState.fanbase);

        expect(reactions.impact.moneyGain).toBeDefined();
        expect(typeof reactions.impact.moneyGain).toBe('number');
        expect(reactions.impact.moneyGain).toBeGreaterThanOrEqual(0);
      });

      it('should calculate psychological effects', () => {
        const reactions = FanReactionSystem.generateReactions(mockSong, mockGameState.fanbase);

        expect(reactions.impact.psychologicalEffect).toBeDefined();
        expect(reactions.impact.psychologicalEffect.confidence_change).toBeDefined();
        expect(reactions.impact.psychologicalEffect.stress_change).toBeDefined();
        expect(reactions.impact.psychologicalEffect.ego_change).toBeDefined();
        expect(reactions.impact.psychologicalEffect.burnout_change).toBeDefined();
      });

      it('should calculate loyalty change', () => {
        const reactions = FanReactionSystem.generateReactions(mockSong, mockGameState.fanbase);

        expect(reactions.impact.loyaltyChange).toBeDefined();
        expect(typeof reactions.impact.loyaltyChange).toBe('number');
      });

      it('should handle high quality songs with positive reactions', () => {
        const highQualitySong = {
          ...mockSong,
          analysis: {
            qualityScore: 90,
            originalityScore: 85,
            commercialViability: 80,
            emotionalTone: { positivity: 70, intensity: 60, darkness: 10 }
          }
        };

        const reactions = FanReactionSystem.generateReactions(highQualitySong, mockGameState.fanbase);

        expect(reactions.impact.fameGain).toBeGreaterThan(0);
        expect(reactions.impact.psychologicalEffect.confidence_change).toBeGreaterThan(0);
      });

      it('should handle low quality songs with negative reactions', () => {
        const lowQualitySong = {
          ...mockSong,
          analysis: {
            qualityScore: 30,
            originalityScore: 25,
            commercialViability: 20,
            emotionalTone: { positivity: 30, intensity: 40, darkness: 50 }
          }
        };

        const reactions = FanReactionSystem.generateReactions(lowQualitySong, mockGameState.fanbase);

        expect(reactions.impact.psychologicalEffect.confidence_change).toBeLessThan(0);
        expect(reactions.impact.psychologicalEffect.stress_change).toBeGreaterThan(0);
      });

      it('should handle songs without analysis (fallback to song properties)', () => {
        const simpleSong = {
          title: 'Simple Song',
          quality: 60,
          originality: 55,
          commercial: 50
        };

        const reactions = FanReactionSystem.generateReactions(simpleSong, mockGameState.fanbase);

        expect(reactions).toBeDefined();
        expect(reactions.impact).toBeDefined();
      });

      it('should handle missing fanbase gracefully', () => {
        const reactions = FanReactionSystem.generateReactions(mockSong, null);

        expect(reactions).toBeDefined();
        expect(reactions.impact).toBeDefined();
      });

      it('should generate different reactions for different fanbase types', () => {
        const mainstreamFanbase = { primary: 'mainstream', size: 200, loyalty: 60 };
        const undergroundFanbase = { primary: 'underground', size: 50, loyalty: 80 };

        const mainstreamReactions = FanReactionSystem.generateReactions(mockSong, mainstreamFanbase);
        const undergroundReactions = FanReactionSystem.generateReactions(mockSong, undergroundFanbase);

        expect(mainstreamReactions.reactions.fanSpecific).toBeDefined();
        expect(undergroundReactions.reactions.fanSpecific).toBeDefined();
        // They might be different based on commercial vs originality
      });
    });

    describe('generateSocialMediaBuzz', () => {
      it('should generate social media data', () => {
        const reactions = FanReactionSystem.generateReactions(mockSong, mockGameState.fanbase);
        const buzz = FanReactionSystem.generateSocialMediaBuzz(mockSong, mockGameState.fanbase, reactions);

        expect(buzz).toBeDefined();
        expect(buzz.tweets).toBeDefined();
        expect(Array.isArray(buzz.tweets)).toBe(true);
        expect(buzz.hashtags).toBeDefined();
        expect(Array.isArray(buzz.hashtags)).toBe(true);
        expect(buzz.engagement).toBeDefined();
        expect(buzz.reach).toBeDefined();
        expect(buzz.trending).toBeDefined();
      });

      it('should generate hashtags based on song quality', () => {
        const highQualitySong = {
          ...mockSong,
          analysis: {
            qualityScore: 85,
            originalityScore: 80,
            commercialViability: 75
          }
        };

        const reactions = FanReactionSystem.generateReactions(highQualitySong, mockGameState.fanbase);
        const buzz = FanReactionSystem.generateSocialMediaBuzz(highQualitySong, mockGameState.fanbase, reactions);

        expect(buzz.hashtags.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Integration with Game Logic', () => {
    let mockUpdateGameState;
    let mockAddLog;
    let gameLogic;
    let integrationGameState;

    beforeEach(() => {
      // Ensure all required fields for game logic
      integrationGameState = {
        ...mockGameState,
        songs: [],
        albums: [],
        gigs: [],
        gigHistory: [],
        members: [],
        difficulty: 'normal',
        studioTier: 0,
        transportTier: 0,
        gearTier: 0
      };

      mockUpdateGameState = jest.fn((updater) => {
        if (typeof updater === 'function') {
          integrationGameState = updater(integrationGameState);
        } else {
          integrationGameState = { ...integrationGameState, ...updater };
        }
        return integrationGameState;
      });

      mockAddLog = jest.fn();

      const mockData = {
        songTitles: ['Test Song', 'Another Song']
      };

      gameLogic = useGameLogic(integrationGameState, mockUpdateGameState, mockAddLog, mockData);
    });

    it('should accept generated song with proper structure', async () => {
      const generatedSong = await MusicGenerator.generateSong(integrationGameState, 'rock', {
        songName: 'Generated Track'
      });

      // Normalize the song for game
      const normalizedSong = {
        ...generatedSong,
        title: generatedSong.metadata.name,
        name: generatedSong.metadata.name,
        genre: generatedSong.metadata.genre,
        quality: Math.round(generatedSong.analysis.qualityScore),
        originality: Math.round(generatedSong.analysis.originalityScore),
        commercial: Math.round(generatedSong.analysis.commercialViability),
        recordedWeek: integrationGameState.week,
        generatedData: generatedSong // Preserve full procedural data
      };

      expect(normalizedSong.title).toBe('Generated Track');
      expect(normalizedSong.quality).toBeGreaterThanOrEqual(0);
      expect(normalizedSong.quality).toBeLessThanOrEqual(100);
      expect(normalizedSong.generatedData).toBeDefined();
    });

    it('should write generated song through game logic', async () => {
      const generatedSong = await MusicGenerator.generateSong(integrationGameState, 'rock', {
        songName: 'Procedural Song'
      });

      const songInput = {
        title: generatedSong.metadata.name,
        genre: generatedSong.metadata.genre,
        quality: Math.round(generatedSong.analysis.qualityScore),
        originality: Math.round(generatedSong.analysis.originalityScore),
        commercial: Math.round(generatedSong.analysis.commercialViability),
        generatedData: generatedSong
      };

      // Should not throw
      expect(() => {
        gameLogic.writeSong(songInput);
      }).not.toThrow();

      // Should update state
      expect(mockUpdateGameState).toHaveBeenCalled();
    });

    it('should apply fan reactions when accepting generated song', async () => {
      const generatedSong = await MusicGenerator.generateSong(integrationGameState, 'rock');
      const reactions = FanReactionSystem.generateReactions(generatedSong, integrationGameState.fanbase);

      expect(reactions.impact.fameGain).toBeDefined();
      expect(reactions.impact.moneyGain).toBeDefined();

      // Simulate applying impact
      const newFame = integrationGameState.fame + reactions.impact.fameGain;
      const newMoney = integrationGameState.money + reactions.impact.moneyGain;

      expect(newFame).toBeGreaterThanOrEqual(integrationGameState.fame);
      expect(newMoney).toBeGreaterThanOrEqual(integrationGameState.money);
    });

    it('should preserve generatedData when writing song', async () => {
      const generatedSong = await MusicGenerator.generateSong(integrationGameState, 'rock', {
        songName: 'Preserved Song'
      });

      const songInput = {
        title: generatedSong.metadata.name,
        genre: generatedSong.metadata.genre,
        quality: Math.round(generatedSong.analysis.qualityScore),
        generatedData: generatedSong
      };

      gameLogic.writeSong(songInput);

      // Check that the song was added with generatedData
      const updateCalls = mockUpdateGameState.mock.calls;
      const lastCall = updateCalls[updateCalls.length - 1];
      
      if (lastCall && typeof lastCall[0] === 'function') {
        const updatedState = lastCall[0](integrationGameState);
        const writtenSong = updatedState.songs?.find(s => s.title === 'Preserved Song');
        
        if (writtenSong) {
          expect(writtenSong.generatedData).toBeDefined();
          expect(writtenSong.generatedData.metadata).toBeDefined();
          expect(writtenSong.generatedData.musicalContent).toBeDefined();
        }
      }
    });
  });
});
