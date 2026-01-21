/**
 * Tests for Rival Song Generation System
 * 
 * Tests automatic song generation for rival bands and chart integration
 */

import { 
  generateRivalSong, 
  generateRivalSongsForChart,
  generateSongFromContext 
} from '../utils/rivalSongGenerator.js';
import { generateSongFromAnywhere, generateSongsForChart } from '../utils/generateSongFromAnywhere.js';

// Mock MusicGenerator
jest.mock('../music/MusicGenerator.js', () => ({
  MusicGenerator: {
    generateSong: jest.fn(async (gameState, genre, options) => ({
      metadata: {
        name: options?.songName || `${gameState.bandName} - Generated Song`,
        genre,
        band: gameState.bandName,
        week: gameState.week || 0,
        seed: options?.seed || 'test-seed'
      },
      analysis: {
        qualityScore: 70,
        originalityScore: 65,
        commercialViability: 60
      },
      composition: {
        tempo: 120,
        genre,
        mode: 'major'
      },
      musicalContent: {
        drums: { pattern: {}, tempo: 120 },
        harmony: { progression: { chords: ['C', 'G', 'Am', 'F'] } },
        melody: { melody: [] }
      }
    }))
  }
}));

describe('Rival Song Generator', () => {
  let mockRivalBand;
  let MusicGenerator;

  beforeEach(() => {
    mockRivalBand = {
      id: 'rival-1',
      name: 'Test Rivals',
      genre: 'rock',
      prestige: 100,
      rivalryLevel: 'competing',
      lastSongWeek: 0
    };

    MusicGenerator = require('../music/MusicGenerator.js').MusicGenerator;
    jest.clearAllMocks();
  });

  describe('generateRivalSong', () => {
    it('should generate a song for a rival band', async () => {
      const song = await generateRivalSong(mockRivalBand, {
        week: 1,
        genre: 'rock'
      });

      expect(song).toBeDefined();
      expect(song.metadata).toBeDefined();
      expect(song.metadata.band).toBe('Test Rivals');
      expect(song.metadata.bandId).toBe('rival-1');
      expect(song.metadata.isRivalSong).toBe(true);
    });

    it('should use provided song name', async () => {
      const song = await generateRivalSong(mockRivalBand, {
        week: 1,
        songName: 'Custom Rival Song',
        genre: 'rock'
      });

      expect(song.metadata.name).toBe('Custom Rival Song');
    });

    it('should generate song name if not provided', async () => {
      const song = await generateRivalSong(mockRivalBand, {
        week: 1,
        genre: 'rock'
      });

      expect(song.metadata.name).toBeDefined();
      expect(song.metadata.name).toContain('Test Rivals');
    });

    it('should include band psychology in generated song', async () => {
      const song = await generateRivalSong(mockRivalBand, {
        week: 1,
        genre: 'rock'
      });

      expect(song.metadata.originalBandData).toBeDefined();
      expect(song.metadata.originalBandData.prestige).toBe(100);
      expect(song.metadata.originalBandData.genre).toBe('rock');
    });

    it('should handle different genres', async () => {
      const genres = ['rock', 'punk', 'metal', 'folk', 'jazz'];
      
      for (const genre of genres) {
        const song = await generateRivalSong({ ...mockRivalBand, genre }, {
          week: 1,
          genre
        });
        expect(song.metadata.genre).toBe(genre);
      }
    });

    it('should use seed for reproducibility', async () => {
      const song1 = await generateRivalSong(mockRivalBand, {
        week: 1,
        genre: 'rock',
        seed: 'test-seed-123'
      });
      
      const song2 = await generateRivalSong(mockRivalBand, {
        week: 1,
        genre: 'rock',
        seed: 'test-seed-123'
      });

      expect(song1.metadata.seed).toBe(song2.metadata.seed);
    });

    it('should handle missing band data gracefully', async () => {
      const minimalBand = { id: 'rival-2', name: 'Minimal Band' };
      const song = await generateRivalSong(minimalBand, {
        week: 1
      });

      expect(song).toBeDefined();
      expect(song.metadata.band).toBe('Minimal Band');
    });

    it('should return fallback song on generation error', async () => {
      // Mock MusicGenerator to throw error
      MusicGenerator.generateSong.mockRejectedValueOnce(new Error('Generation failed'));

      const song = await generateRivalSong(mockRivalBand, {
        week: 1,
        genre: 'rock'
      });

      expect(song).toBeDefined();
      expect(song.metadata.isRivalSong).toBe(true);
      expect(song.analysis).toBeDefined();
      
      // Reset mock to default implementation
      MusicGenerator.generateSong.mockResolvedValue({
        metadata: {
          name: 'Generated Song',
          genre: 'rock',
          band: 'Test Rivals',
          week: 1,
          seed: 'test-seed'
        },
        analysis: {
          qualityScore: 70,
          originalityScore: 65,
          commercialViability: 60
        },
        composition: {
          tempo: 120,
          genre: 'rock',
          mode: 'major'
        },
        musicalContent: {
          drums: { pattern: {}, tempo: 120 },
          harmony: { progression: { chords: ['C', 'G', 'Am', 'F'] } },
          melody: { melody: [] }
        }
      });
    });
  });

  describe('generateRivalSongsForChart', () => {
    it('should generate songs for multiple rival bands', async () => {
      const rivalBands = [
        { ...mockRivalBand, id: 'rival-1', name: 'Rival 1' },
        { ...mockRivalBand, id: 'rival-2', name: 'Rival 2' },
        { ...mockRivalBand, id: 'rival-3', name: 'Rival 3' }
      ];

      const songs = await generateRivalSongsForChart(rivalBands, {
        week: 1,
        maxSongs: 3
      });

      expect(songs).toBeDefined();
      expect(Array.isArray(songs)).toBe(true);
      expect(songs.length).toBe(3);
      expect(songs[0].metadata.band).toBe('Rival 1');
      expect(songs[1].metadata.band).toBe('Rival 2');
      expect(songs[2].metadata.band).toBe('Rival 3');
    });

    it('should respect maxSongs limit', async () => {
      const rivalBands = Array.from({ length: 30 }, (_, i) => ({
        ...mockRivalBand,
        id: `rival-${i}`,
        name: `Rival ${i}`
      }));

      const songs = await generateRivalSongsForChart(rivalBands, {
        week: 1,
        maxSongs: 20
      });

      expect(songs.length).toBeLessThanOrEqual(20);
    });

    it('should handle empty rival bands array', async () => {
      const songs = await generateRivalSongsForChart([], {
        week: 1
      });

      expect(songs).toBeDefined();
      expect(songs.length).toBe(0);
    });

    it('should vary genres when genres array provided', async () => {
      const rivalBands = [
        { ...mockRivalBand, id: 'rival-1' },
        { ...mockRivalBand, id: 'rival-2' },
        { ...mockRivalBand, id: 'rival-3' }
      ];

      // Make mock use the genre from options
      MusicGenerator.generateSong.mockImplementation(async (gameState, genre, options) => ({
        metadata: {
          name: options?.songName || `${gameState.bandName} - Generated Song`,
          genre: genre || options?.genre || 'rock',
          band: gameState.bandName,
          week: gameState.week || 0,
          seed: options?.seed || 'test-seed'
        },
        analysis: {
          qualityScore: 70,
          originalityScore: 65,
          commercialViability: 60
        },
        composition: {
          tempo: 120,
          genre: genre || options?.genre || 'rock',
          mode: 'major'
        },
        musicalContent: {
          drums: { pattern: {}, tempo: 120 },
          harmony: { progression: { chords: ['C', 'G', 'Am', 'F'] } },
          melody: { melody: [] }
        }
      }));

      const songs = await generateRivalSongsForChart(rivalBands, {
        week: 1,
        genres: ['rock', 'punk', 'metal']
      });

      expect(songs[0].metadata.genre).toBe('rock');
      expect(songs[1].metadata.genre).toBe('punk');
      expect(songs[2].metadata.genre).toBe('metal');
    });
  });

  describe('generateSongFromContext', () => {
    it('should generate song from chart context', async () => {
      const context = {
        contextType: 'chart',
        week: 1,
        trigger: 'chart-view'
      };

      const song = await generateSongFromContext(context, mockRivalBand, {
        genre: 'rock'
      });

      expect(song).toBeDefined();
      expect(song.metadata.isRivalSong).toBe(true);
    });

    it('should generate song from event context', async () => {
      const context = {
        contextType: 'event',
        eventData: {
          songName: 'Event Song',
          genre: 'punk'
        },
        week: 1
      };

      // Make mock use songName and genre from options
      MusicGenerator.generateSong.mockImplementationOnce(async (gameState, genre, options) => ({
        metadata: {
          name: options?.songName || `${gameState.bandName} - Generated Song`,
          genre: genre || options?.genre || 'rock',
          band: gameState.bandName,
          week: gameState.week || 0,
          seed: options?.seed || 'test-seed'
        },
        analysis: {
          qualityScore: 70,
          originalityScore: 65,
          commercialViability: 60
        },
        composition: {
          tempo: 120,
          genre: genre || options?.genre || 'rock',
          mode: 'major'
        },
        musicalContent: {
          drums: { pattern: {}, tempo: 120 },
          harmony: { progression: { chords: ['C', 'G', 'Am', 'F'] } },
          melody: { melody: [] }
        }
      }));

      const song = await generateSongFromContext(context, mockRivalBand);

      expect(song).toBeDefined();
      expect(song.metadata.name).toBe('Event Song');
      expect(song.metadata.genre).toBe('punk');
    });

    it('should use band genre as fallback', async () => {
      const context = {
        contextType: 'radio',
        week: 1
      };

      const song = await generateSongFromContext(context, mockRivalBand);

      expect(song.metadata.genre).toBe('rock'); // From mockRivalBand.genre
    });
  });
});

describe('generateSongFromAnywhere', () => {
  let mockPlayerBand;
  let mockRivalBand;

  beforeEach(() => {
    mockPlayerBand = {
      bandName: 'Player Band',
      week: 1,
      fame: 50,
      money: 5000,
      bandMembers: [
        { instrument: 'guitarist', skill: 70 }
      ]
    };

    mockRivalBand = {
      id: 'rival-1',
      name: 'Rival Band',
      genre: 'rock',
      prestige: 100,
      isRival: true
    };

    jest.clearAllMocks();
  });

  describe('generateSongFromAnywhere', () => {
    it('should generate song for player band', async () => {
      const song = await generateSongFromAnywhere({
        bandData: mockPlayerBand,
        context: { week: 1 },
        options: { genre: 'rock' }
      });

      expect(song).toBeDefined();
      expect(song.metadata.band).toBe('Player Band');
      expect(song.metadata.isRivalSong).toBeUndefined();
    });

    it('should generate song for rival band', async () => {
      const song = await generateSongFromAnywhere({
        bandData: mockRivalBand,
        context: { contextType: 'chart', week: 1 },
        options: { genre: 'rock' }
      });

      expect(song).toBeDefined();
      expect(song.metadata.band).toBe('Rival Band');
      expect(song.metadata.isRivalSong).toBe(true);
    });

    it('should handle event context', async () => {
      const song = await generateSongFromAnywhere({
        bandData: mockPlayerBand,
        context: {
          contextType: 'event',
          eventData: {
            songName: 'Event Song',
            genre: 'punk'
          },
          week: 1
        }
      });

      expect(song).toBeDefined();
      expect(song.metadata.name).toBe('Event Song');
      expect(song.metadata.genre).toBe('punk');
    });

    it('should use default values when options missing', async () => {
      const song = await generateSongFromAnywhere({
        bandData: mockPlayerBand,
        context: { week: 1 }
      });

      expect(song).toBeDefined();
      expect(song.metadata.genre).toBe('rock'); // Default
    });
  });

  describe('generateSongsForChart', () => {
    it('should generate songs for multiple artists', async () => {
      const artists = [
        mockPlayerBand,
        mockRivalBand,
        { ...mockRivalBand, id: 'rival-2', name: 'Rival 2' }
      ];

      const songs = await generateSongsForChart(artists, {
        week: 1,
        maxSongs: 3
      });

      expect(songs).toBeDefined();
      expect(songs.length).toBe(3);
      expect(songs[0].metadata.band).toBe('Player Band');
      expect(songs[1].metadata.band).toBe('Rival Band');
    });

    it('should respect maxSongs limit', async () => {
      const artists = Array.from({ length: 30 }, (_, i) => ({
        ...mockRivalBand,
        id: `rival-${i}`,
        name: `Rival ${i}`
      }));

      const songs = await generateSongsForChart(artists, {
        week: 1,
        maxSongs: 20
      });

      expect(songs.length).toBeLessThanOrEqual(20);
    });

    it('should handle empty artists array', async () => {
      const songs = await generateSongsForChart([], {
        week: 1
      });

      expect(songs).toBeDefined();
      expect(songs.length).toBe(0);
    });
  });
});
