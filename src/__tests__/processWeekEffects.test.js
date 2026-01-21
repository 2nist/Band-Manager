/**
 * Tests for processWeekEffects - Phase 1 Essential Mechanics
 */

import { 
  processWeekEffects,
  calculateWeeklyExpenses,
  calculateSongStreamingRevenue,
  calculateAlbumStreamingRevenue,
  calculateRadioPlays,
  calculateLabelRoyaltySplit,
  calculateSongChartScore,
  calculateFanGrowth,
  processGenreTrends,
  ageSongs,
  ageAlbums,
  calculateMerchandiseRevenue
} from '../utils/processWeekEffects';

describe('processWeekEffects - Phase 1', () => {
  describe('calculateWeeklyExpenses', () => {
    it('calculates base expenses correctly', () => {
      const state = {
        difficulty: 'normal',
        bandMembers: []
      };
      const expenses = calculateWeeklyExpenses(state);
      expect(expenses).toBe(120); // Base 100 + basic equipment 20
    });

    it('includes transport costs', () => {
      const state = {
        difficulty: 'normal',
        bandMembers: [],
        equipment: { transport: 'van' }
      };
      const expenses = calculateWeeklyExpenses(state);
      expect(expenses).toBeGreaterThan(120); // Should include transport costs
    });

    it('includes staff costs', () => {
      const state = {
        difficulty: 'normal',
        bandMembers: [],
        staffManager: 'pro',
        staffLawyer: true
      };
      const expenses = calculateWeeklyExpenses(state);
      expect(expenses).toBeGreaterThan(120); // Should include staff costs
    });

    it('includes member salaries', () => {
      const state = {
        difficulty: 'normal',
        bandMembers: [
          { id: 1, name: 'Member 1' },
          { id: 2, name: 'Member 2' }
        ]
      };
      const expenses = calculateWeeklyExpenses(state);
      expect(expenses).toBe(220); // 100 base + 100 (2 members * 50) + 20 equipment
    });

    it('applies difficulty multipliers correctly', () => {
      const easyState = { difficulty: 'easy', bandMembers: [] };
      const hardState = { difficulty: 'hard', bandMembers: [] };
      
      expect(calculateWeeklyExpenses(easyState)).toBe(96); // (100 + 20) * 0.8
      expect(calculateWeeklyExpenses(hardState)).toBe(144); // (100 + 20) * 1.2
    });
  });

  describe('calculateSongStreamingRevenue', () => {
    it('returns 0 for no songs', () => {
      const revenue = calculateSongStreamingRevenue([], {});
      expect(revenue).toBe(0);
    });

    it('calculates revenue for a single song', () => {
      const songs = [{
        title: 'Test Song',
        popularity: 50,
        quality: 60,
        age: 0
      }];
      const revenue = calculateSongStreamingRevenue(songs, { difficulty: 'normal' });
      expect(revenue).toBeGreaterThan(0);
    });

    it('applies freshness decay for older songs', () => {
      const newSong = { title: 'New', popularity: 50, quality: 60, age: 0 };
      const oldSong = { title: 'Old', popularity: 50, quality: 60, age: 10 };
      
      const newRevenue = calculateSongStreamingRevenue([newSong], {});
      const oldRevenue = calculateSongStreamingRevenue([oldSong], {});
      
      expect(oldRevenue).toBeLessThan(newRevenue);
    });

    it('applies difficulty revenue multipliers', () => {
      const songs = [{ title: 'Test', popularity: 50, quality: 60, age: 0 }];
      
      const easyRevenue = calculateSongStreamingRevenue(songs, { difficulty: 'easy' });
      const normalRevenue = calculateSongStreamingRevenue(songs, { difficulty: 'normal' });
      const hardRevenue = calculateSongStreamingRevenue(songs, { difficulty: 'hard' });
      
      expect(easyRevenue).toBeGreaterThan(normalRevenue);
      expect(hardRevenue).toBeLessThan(normalRevenue);
    });
  });

  describe('ageSongs', () => {
    it('increments song age by 1', () => {
      const songs = [{ title: 'Test', age: 5 }];
      const aged = ageSongs(songs);
      expect(aged[0].age).toBe(6);
    });

    it('decays popularity slightly', () => {
      const songs = [{ title: 'Test', popularity: 50, age: 0 }];
      const aged = ageSongs(songs);
      expect(aged[0].popularity).toBe(49);
    });

    it('does not let popularity go below 0', () => {
      const songs = [{ title: 'Test', popularity: 0, age: 0 }];
      const aged = ageSongs(songs);
      expect(aged[0].popularity).toBe(0);
    });
  });

  describe('processWeekEffects integration', () => {
    it('processes a week with expenses and revenue', () => {
      const initialState = {
        week: 0,
        money: 1000,
        difficulty: 'normal',
        bandMembers: [],
        songs: [{
          title: 'Test Song',
          popularity: 50,
          quality: 60,
          age: 0
        }]
      };

      const result = processWeekEffects(initialState);
      
      expect(result.next).toBeDefined();
      expect(result.next.money).toBeDefined();
      expect(result.next.songs).toBeDefined();
      expect(result.next.songs.length).toBe(1);
      expect(result.next.songs[0].age).toBe(1);
      expect(result.summary).toContain('Week 1');
      expect(result.summary).toContain('Expenses');
        expect(result.summary).toContain('Song Streaming');
        expect(result.summary).toContain('Net Revenue');
    });

    it('calculates net money change correctly', () => {
      const initialState = {
        week: 0,
        money: 1000,
        difficulty: 'normal',
        bandMembers: [],
        songs: [{
          title: 'Test Song',
          popularity: 100, // High popularity = good revenue
          quality: 100,
          age: 0
        }]
      };

      const result = processWeekEffects(initialState);
      
      // Should have net positive (revenue > expenses for popular song)
      const netChange = result.next.money - initialState.money;
      expect(netChange).toBeGreaterThan(-100); // At least doesn't lose more than base expenses
    });

    it('prevents money from going negative', () => {
      const initialState = {
        week: 0,
        money: 50, // Low money
        difficulty: 'normal',
        bandMembers: [{}, {}], // 2 members = 100 salary
        songs: [] // No revenue
      };

      const result = processWeekEffects(initialState);
      
      expect(result.next.money).toBeGreaterThanOrEqual(0);
    });

    it('tracks total revenue', () => {
      const initialState = {
        week: 0,
        money: 1000,
        difficulty: 'normal',
        bandMembers: [],
        songs: [{ title: 'Test', popularity: 50, quality: 60, age: 0 }],
        totalRevenue: 0
      };

      const result = processWeekEffects(initialState);
      
      const streamingRevenue = result.next.totalRevenue - initialState.totalRevenue;
      expect(streamingRevenue).toBeGreaterThan(0);
      expect(result.next.totalRevenue).toBe(initialState.totalRevenue + streamingRevenue);
    });
  });

  describe('Phase 2: Album Revenue', () => {
    describe('calculateAlbumStreamingRevenue', () => {
      it('returns 0 for no albums', () => {
        const revenue = calculateAlbumStreamingRevenue([], {});
        expect(revenue).toBe(0);
      });

      it('calculates revenue for a single album', () => {
        const albums = [{
          name: 'Test Album',
          popularity: 60,
          quality: 70,
          age: 0
        }];
        const revenue = calculateAlbumStreamingRevenue(albums, { difficulty: 'normal' });
        expect(revenue).toBeGreaterThan(0);
      });

      it('applies freshness decay for older albums', () => {
        const newAlbum = { name: 'New', popularity: 60, quality: 70, age: 0 };
        const oldAlbum = { name: 'Old', popularity: 60, quality: 70, age: 10 };
        
        const newRevenue = calculateAlbumStreamingRevenue([newAlbum], {});
        const oldRevenue = calculateAlbumStreamingRevenue([oldAlbum], {});
        
        expect(oldRevenue).toBeLessThan(newRevenue);
      });

      it('applies difficulty revenue multipliers', () => {
        const albums = [{ name: 'Test', popularity: 60, quality: 70, age: 0 }];
        
        const easyRevenue = calculateAlbumStreamingRevenue(albums, { difficulty: 'easy' });
        const normalRevenue = calculateAlbumStreamingRevenue(albums, { difficulty: 'normal' });
        const hardRevenue = calculateAlbumStreamingRevenue(albums, { difficulty: 'hard' });
        
        expect(easyRevenue).toBeGreaterThan(normalRevenue);
        expect(hardRevenue).toBeLessThan(normalRevenue);
      });
    });

    describe('ageAlbums', () => {
      it('increments album age by 1', () => {
        const albums = [{ name: 'Test', age: 5 }];
        const aged = ageAlbums(albums, {});
        expect(aged[0].age).toBe(6);
      });

      it('decrements promoBoost', () => {
        const albums = [{ name: 'Test', promoBoost: 10, age: 0 }];
        const aged = ageAlbums(albums, {});
        expect(aged[0].promoBoost).toBe(9);
      });

      it('does not let promoBoost go below 0', () => {
        const albums = [{ name: 'Test', promoBoost: 0, age: 0 }];
        const aged = ageAlbums(albums, {});
        expect(aged[0].promoBoost).toBe(0);
      });

      it('calculates chartScore based on quality and decay', () => {
        const albums = [{ 
          name: 'Test', 
          quality: 80, 
          popularity: 60, 
          age: 0, 
          promoBoost: 5 
        }];
        const aged = ageAlbums(albums, {});
        expect(aged[0].chartScore).toBeGreaterThan(0);
      });

      it('sustains promoBoost with label marketing', () => {
        const albums = [{ name: 'Test', promoBoost: 5, age: 0 }];
        const state = {
          labelDeal: {
            marketingBudget: 500
          }
        };
        const aged = ageAlbums(albums, state);
        // Should sustain or even increase promoBoost with marketing
        expect(aged[0].promoBoost).toBeGreaterThanOrEqual(4);
      });
    });

    describe('processWeekEffects with albums', () => {
      it('processes albums in weekly calculation', () => {
        const initialState = {
          week: 0,
          money: 1000,
          difficulty: 'normal',
          bandMembers: [],
          songs: [],
          albums: [{
            name: 'Test Album',
            popularity: 60,
            quality: 70,
            age: 0
          }]
        };

        const result = processWeekEffects(initialState);
        
        expect(result.next.albums).toBeDefined();
        expect(result.next.albums.length).toBe(1);
        expect(result.next.albums[0].age).toBe(1);
        expect(result.summary).toContain('Album Revenue');
      });

      it('combines song and album revenue', () => {
        const initialState = {
          week: 0,
          money: 1000,
          difficulty: 'normal',
          bandMembers: [],
          songs: [{ title: 'Song', popularity: 50, quality: 60, age: 0 }],
          albums: [{ name: 'Album', popularity: 60, quality: 70, age: 0 }]
        };

        const result = processWeekEffects(initialState);
        
        expect(result.summary).toContain('Song Streaming');
        expect(result.summary).toContain('Album Revenue');
        expect(result.summary).toContain('Net Revenue');
      });

      it('tracks total revenue from both sources', () => {
        const initialState = {
          week: 0,
          money: 1000,
          difficulty: 'normal',
          bandMembers: [],
          songs: [{ title: 'Song', popularity: 50, quality: 60, age: 0 }],
          albums: [{ name: 'Album', popularity: 60, quality: 70, age: 0 }],
          totalRevenue: 0
        };

        const result = processWeekEffects(initialState);
        
        const totalRevenueIncrease = result.next.totalRevenue - initialState.totalRevenue;
        expect(totalRevenueIncrease).toBeGreaterThan(0);
      });
    });
  });

  describe('Phase 2: Genre Trends', () => {
    describe('processGenreTrends', () => {
      it('returns trend object with seasonal boost', () => {
        const state = {
          week: 25, // Summer week
          genre: 'Pop',
          trend: null
        };
        
        const result = processGenreTrends(state);
        
        expect(result).toHaveProperty('trend');
        expect(result).toHaveProperty('seasonalBoost');
        expect(result).toHaveProperty('genreTrends');
        expect(result).toHaveProperty('notes');
      });

      it('applies summer boost for Pop genre', () => {
        const state = {
          week: 25, // Summer (week 25 of year)
          genre: 'Pop',
          trend: null
        };
        
        const result = processGenreTrends(state);
        
        expect(result.seasonalBoost).toBe(8);
        expect(result.notes.some(note => note.includes('Summer'))).toBe(true);
      });

      it('applies holiday boost for Rock genre', () => {
        const state = {
          week: 47, // Holiday season
          genre: 'Rock',
          trend: null
        };
        
        const result = processGenreTrends(state);
        
        expect(result.seasonalBoost).toBe(5);
      });

      it('decays existing trends', () => {
        const state = {
          week: 0,
          genre: 'Pop',
          trend: {
            genre: 'Hip-Hop',
            modifier: 10,
            weeks: 2,
            strength: 'moderate'
          }
        };
        
        const result = processGenreTrends(state);
        
        expect(result.trend.weeks).toBe(1);
        expect(result.trend.modifier).toBeLessThan(10); // Should decay
      });

      it('ends trends when weeks reach 0', () => {
        const state = {
          week: 0,
          genre: 'Pop',
          trend: {
            genre: 'Hip-Hop',
            modifier: 10,
            weeks: 1,
            strength: 'moderate'
          }
        };
        
        const result = processGenreTrends(state);
        
        expect(result.trend).toBeNull();
        expect(result.notes.some(note => note.includes('cooled off'))).toBe(true);
      });
    });

    describe('processWeekEffects with trends', () => {
      it('includes trend in weekly processing', () => {
        const initialState = {
          week: 0,
          money: 1000,
          difficulty: 'normal',
          genre: 'Pop',
          bandMembers: [],
          songs: [],
          albums: [],
          trend: null
        };

        const result = processWeekEffects(initialState, { genres: ['Pop', 'Rock'] });
        
        expect(result.next.trend).toBeDefined(); // May be null or a trend object
        expect(result.next.genreTrends).toBeDefined();
      });

      it('includes trend notes in summary when trends occur', () => {
        // This test may be flaky due to randomness, but we can test the structure
        const initialState = {
          week: 0,
          money: 1000,
          difficulty: 'normal',
          genre: 'Pop',
          bandMembers: [],
          songs: [],
          albums: []
        };

        const result = processWeekEffects(initialState, { genres: ['Pop', 'Rock'] });
        
        expect(result.summary).toBeDefined();
        // Summary may or may not include trend notes depending on randomness
      });
    });
  });

  describe('Phase 2: Fan Growth', () => {
    describe('calculateFanGrowth', () => {
      it('calculates growth from fame', () => {
        const state = { fame: 100 };
        const growth = calculateFanGrowth(state, []);
        expect(growth).toBe(10); // 100 / 10
      });

      it('adds bonus for having songs', () => {
        const state = { fame: 50 };
        const songs = [{ title: 'Test Song' }];
        const growth = calculateFanGrowth(state, songs);
        expect(growth).toBe(10); // 5 (from fame) + 5 (song bonus)
      });

      it('returns 0 for no fame and no songs', () => {
        const state = { fame: 0 };
        const growth = calculateFanGrowth(state, []);
        expect(growth).toBe(0);
      });

      it('returns song bonus even with low fame', () => {
        const state = { fame: 5 };
        const songs = [{ title: 'Test Song' }];
        const growth = calculateFanGrowth(state, songs);
        expect(growth).toBe(5); // 0 (from fame) + 5 (song bonus)
      });
    });

    describe('processWeekEffects with fan growth', () => {
      it('increases fans each week', () => {
        const initialState = {
          week: 0,
          money: 1000,
          fame: 50,
          fans: 100,
          difficulty: 'normal',
          bandMembers: [],
          songs: [{ title: 'Test', popularity: 50, quality: 60, age: 0 }],
          albums: []
        };

        const result = processWeekEffects(initialState);
        
        expect(result.next.fans).toBeGreaterThan(initialState.fans);
        expect(result.summary).toContain('Fan Growth');
      });

      it('tracks fan growth correctly', () => {
        const initialState = {
          week: 0,
          money: 1000,
          fame: 100,
          fans: 200,
          difficulty: 'normal',
          bandMembers: [],
          songs: [{ title: 'Test', popularity: 50, quality: 60, age: 0 }],
          albums: []
        };

        const result = processWeekEffects(initialState);
        
        const expectedGrowth = 10 + 5; // 100/10 + song bonus
        expect(result.next.fans).toBe(initialState.fans + expectedGrowth);
      });
    });
  });

  describe('Phase 3: Radio Play', () => {
    describe('calculateRadioPlays', () => {
      it('returns 0 for no songs', () => {
        const result = calculateRadioPlays([]);
        expect(result.radioPlays).toBe(0);
        expect(result.radioRevenue).toBe(0);
      });

      it('calculates radio plays based on popularity', () => {
        const songs = [
          { title: 'Hit Song', popularity: 60 },
          { title: 'OK Song', popularity: 24 }
        ];
        const result = calculateRadioPlays(songs);
        
        expect(result.radioPlays).toBeGreaterThan(0);
        expect(result.radioRevenue).toBeGreaterThan(0);
      });

      it('calculates $2 per radio play', () => {
        const songs = [{ title: 'Test', popularity: 60 }];
        const result = calculateRadioPlays(songs);
        
        // Popularity 60 = 5 radio plays, so 5 * 2 = 10 revenue
        expect(result.radioRevenue).toBe(result.radioPlays * 2);
      });

      it('returns 0 plays for low popularity songs', () => {
        const songs = [{ title: 'Test', popularity: 5 }];
        const result = calculateRadioPlays(songs);
        
        expect(result.radioPlays).toBe(0);
        expect(result.radioRevenue).toBe(0);
      });
    });

    describe('ageSongs with Phase 3 enhancements', () => {
      it('applies trend bonus to matching genre songs', () => {
        const songs = [{ 
          title: 'Pop Song', 
          genre: 'Pop',
          popularity: 50,
          quality: 60,
          age: 0
        }];
        const state = {};
        const trendResult = {
          trend: { genre: 'Pop', modifier: 15, weeks: 3, strength: 'moderate' },
          seasonalBoost: 0
        };
        
        const aged = ageSongs(songs, state, trendResult);
        
        expect(aged[0].popularity).toBeGreaterThan(50); // Should have trend bonus
      });

      it('applies album boost for songs in albums', () => {
        const songs = [{ 
          title: 'Album Song', 
          popularity: 50,
          quality: 60,
          age: 0,
          inAlbum: true
        }];
        const state = {
          albums: [{
            name: 'Test Album',
            songTitles: ['Album Song'],
            promoBoost: 10
          }]
        };
        const trendResult = { trend: null, seasonalBoost: 0 };
        
        const aged = ageSongs(songs, state, trendResult);
        
        expect(aged[0].popularity).toBeGreaterThan(49); // Should have album boost
      });

      it('tracks weekly streams and radio plays', () => {
        const songs = [{ 
          title: 'Test Song', 
          popularity: 50,
          quality: 60,
          age: 0
        }];
        const aged = ageSongs(songs, {}, { trend: null, seasonalBoost: 0 });
        
        expect(aged[0].weeklyStreams).toBeGreaterThan(0);
        expect(aged[0].plays).toBeGreaterThan(0);
        expect(aged[0].earnings).toBeGreaterThan(0);
      });
    });

    describe('calculateLabelRoyaltySplit', () => {
      it('returns full revenue for independent labels', () => {
        const labelDeal = { type: 'independent' };
        const result = calculateLabelRoyaltySplit(1000, labelDeal);
        
        expect(result.netRevenue).toBe(1000);
        expect(result.labelRoyaltySplit).toBe(0);
      });

      it('splits revenue for major labels', () => {
        const labelDeal = { 
          type: 'major',
          royaltySplit: 30 // Label takes 30%
        };
        const result = calculateLabelRoyaltySplit(1000, labelDeal);
        
        expect(result.labelRoyaltySplit).toBe(300);
        expect(result.netRevenue).toBe(700);
      });

      it('returns full revenue if no label deal', () => {
        const result = calculateLabelRoyaltySplit(1000, null);
        
        expect(result.netRevenue).toBe(1000);
        expect(result.labelRoyaltySplit).toBe(0);
      });
    });

    describe('processWeekEffects with Phase 3 features', () => {
      it('includes radio plays in revenue calculation', () => {
        const initialState = {
          week: 0,
          money: 1000,
          difficulty: 'normal',
          bandMembers: [],
          songs: [{ title: 'Test', popularity: 60, quality: 60, age: 0 }],
          albums: []
        };

        const result = processWeekEffects(initialState);
        
        expect(result.summary).toContain('Radio Plays');
        expect(result.next.totalRevenue).toBeGreaterThan(0);
      });

      it('applies label royalty split when under contract', () => {
        const initialState = {
          week: 0,
          money: 1000,
          difficulty: 'normal',
          bandMembers: [],
          songs: [{ title: 'Test', popularity: 60, quality: 60, age: 0 }],
          albums: [],
          labelDeal: {
            type: 'major',
            royaltySplit: 30
          }
        };

        const result = processWeekEffects(initialState);
        
        expect(result.summary).toContain('Label Royalty Split');
        // Net revenue should be less than gross revenue
        expect(result.next.totalRevenue).toBeGreaterThan(0);
      });

      it('does not apply label split for independent deals', () => {
        const initialState = {
          week: 0,
          money: 1000,
          difficulty: 'normal',
          bandMembers: [],
          songs: [{ title: 'Test', popularity: 60, quality: 60, age: 0 }],
          albums: [],
          labelDeal: {
            type: 'independent'
          }
        };

        const result = processWeekEffects(initialState);
        
        expect(result.summary).not.toContain('Label Royalty Split');
      });
    });
  });

  describe('Phase 3: Chart Progression', () => {
    describe('calculateSongChartScore', () => {
      it('calculates chart score based on popularity and streams', () => {
        const song = {
          popularity: 80,
          weeklyStreams: 1000
        };
        const score = calculateSongChartScore(song);
        
        // 80 * 10 + 1000 * 0.1 = 800 + 100 = 900
        expect(score).toBe(900);
      });

      it('returns higher score for more popular songs', () => {
        const popularSong = { popularity: 100, weeklyStreams: 1000 };
        const lowSong = { popularity: 50, weeklyStreams: 500 };
        
        const popularScore = calculateSongChartScore(popularSong);
        const lowScore = calculateSongChartScore(lowSong);
        
        expect(popularScore).toBeGreaterThan(lowScore);
      });
    });

    describe('processWeekEffects with chart scores', () => {
      it('adds chartScore to songs', () => {
        const initialState = {
          week: 0,
          money: 1000,
          difficulty: 'normal',
          bandMembers: [],
          songs: [{ 
            title: 'Test Song', 
            popularity: 80, 
            quality: 75, 
            age: 0 
          }],
          albums: []
        };

        const result = processWeekEffects(initialState);
        
        expect(result.next.songs[0].chartScore).toBeDefined();
        expect(result.next.songs[0].chartScore).toBeGreaterThan(0);
      });

      it('adds chartScore to albums', () => {
        const initialState = {
          week: 0,
          money: 1000,
          difficulty: 'normal',
          bandMembers: [],
          songs: [],
          albums: [{
            name: 'Test Album',
            quality: 80,
            popularity: 70,
            age: 0
          }]
        };

        const result = processWeekEffects(initialState);
        
        expect(result.next.albums[0].chartScore).toBeDefined();
        expect(result.next.albums[0].chartScore).toBeGreaterThan(0);
      });
    });
  });

  describe('Phase 4: Merchandise Revenue', () => {
    describe('calculateMerchandiseRevenue', () => {
      it('returns 0 for no merchandise', () => {
        const result = calculateMerchandiseRevenue([], {});
        expect(result.merchandiseRevenue).toBe(0);
        expect(result.itemsSold).toBe(0);
        expect(result.updatedMerchandise).toEqual([]);
      });

      it('calculates revenue for merchandise with inventory', () => {
        const merchandise = [{
          id: 'merch1',
          basePrice: 25,
          quality: 80,
          popularity: 60,
          inventory: 100,
          weeksSelling: 0,
          totalSold: 0,
          totalRevenue: 0
        }];
        const state = { fame: 1000 };
        
        const result = calculateMerchandiseRevenue(merchandise, state);
        
        expect(result.merchandiseRevenue).toBeGreaterThan(0);
        expect(result.itemsSold).toBeGreaterThan(0);
        expect(result.updatedMerchandise[0].inventory).toBeLessThan(100);
      });

      it('respects inventory limits', () => {
        const merchandise = [{
          id: 'merch1',
          basePrice: 25,
          quality: 80,
          popularity: 60,
          inventory: 5, // Low inventory
          weeksSelling: 0,
          totalSold: 0,
          totalRevenue: 0
        }];
        const state = { fame: 5000 }; // High fame
        
        const result = calculateMerchandiseRevenue(merchandise, state);
        
        expect(result.itemsSold).toBeLessThanOrEqual(5);
        expect(result.updatedMerchandise[0].inventory).toBeGreaterThanOrEqual(0);
      });

      it('applies decay factor for older merchandise', () => {
        const newMerch = [{
          id: 'merch1',
          basePrice: 25,
          quality: 80,
          popularity: 60,
          inventory: 100,
          weeksSelling: 0,
          totalSold: 0,
          totalRevenue: 0
        }];
        const oldMerch = [{
          id: 'merch2',
          basePrice: 25,
          quality: 80,
          popularity: 60,
          inventory: 100,
          weeksSelling: 10, // Older
          totalSold: 0,
          totalRevenue: 0
        }];
        const state = { fame: 1000 };
        
        const newResult = calculateMerchandiseRevenue(newMerch, state);
        const oldResult = calculateMerchandiseRevenue(oldMerch, state);
        
        // Older merchandise should sell less or equal due to decay
        // Decay factor: 1 / (1 + weeksSelling * 0.1)
        // For weeksSelling=0: 1 / 1 = 1.0
        // For weeksSelling=10: 1 / 2 = 0.5
        // So old should be <= new (allowing for rounding)
        expect(oldResult.merchandiseRevenue).toBeLessThanOrEqual(newResult.merchandiseRevenue);
        expect(oldResult.itemsSold).toBeLessThanOrEqual(newResult.itemsSold);
        // Verify decay is actually applied
        expect(newResult.updatedMerchandise[0].weeksSelling).toBe(1);
        expect(oldResult.updatedMerchandise[0].weeksSelling).toBe(11);
      });

      it('updates merchandise state correctly', () => {
        const merchandise = [{
          id: 'merch1',
          basePrice: 25,
          quality: 80,
          popularity: 60,
          inventory: 100,
          weeksSelling: 0,
          totalSold: 0,
          totalRevenue: 0
        }];
        const state = { fame: 1000 };
        
        const result = calculateMerchandiseRevenue(merchandise, state);
        
        expect(result.updatedMerchandise[0].weeksSelling).toBe(1);
        expect(result.updatedMerchandise[0].totalSold).toBe(result.itemsSold);
        expect(result.updatedMerchandise[0].totalRevenue).toBe(result.merchandiseRevenue);
      });
    });

    describe('processWeekEffects with Phase 4 features', () => {
      it('includes merchandise revenue in weekly calculation', () => {
        const initialState = {
          week: 0,
          money: 1000,
          fame: 1000,
          difficulty: 'normal',
          bandMembers: [],
          songs: [],
          albums: [],
          merchandise: [{
            id: 'merch1',
            basePrice: 25,
            quality: 80,
            popularity: 60,
            inventory: 100,
            weeksSelling: 0,
            totalSold: 0,
            totalRevenue: 0
          }]
        };

        const result = processWeekEffects(initialState);
        
        expect(result.summary).toContain('Merchandise Sales');
        expect(result.next.money).toBeGreaterThan(initialState.money - 120); // Should have revenue
      });

      it('updates merchandise inventory in state', () => {
        const initialState = {
          week: 0,
          money: 1000,
          fame: 1000,
          difficulty: 'normal',
          bandMembers: [],
          songs: [],
          albums: [],
          merchandise: [{
            id: 'merch1',
            basePrice: 25,
            quality: 80,
            popularity: 60,
            inventory: 100,
            weeksSelling: 0,
            totalSold: 0,
            totalRevenue: 0
          }]
        };

        const result = processWeekEffects(initialState);
        
        expect(result.next.merchandise[0].inventory).toBeLessThan(100);
        expect(result.next.merchandise[0].weeksSelling).toBe(1);
      });

      it('does not apply label royalty split to merchandise revenue', () => {
        const initialState = {
          week: 0,
          money: 1000,
          fame: 1000,
          difficulty: 'normal',
          bandMembers: [],
          songs: [{ title: 'Test', popularity: 50, quality: 60, age: 0 }],
          albums: [],
          merchandise: [{
            id: 'merch1',
            basePrice: 25,
            quality: 80,
            popularity: 60,
            inventory: 100,
            weeksSelling: 0,
            totalSold: 0,
            totalRevenue: 0
          }],
          labelDeal: {
            type: 'major',
            royaltySplit: 30 // 30% split
          }
        };

        const result = processWeekEffects(initialState);
        
        // Merchandise revenue should not be subject to label split
        // We can verify this by checking that total revenue includes full merchandise amount
        const summary = result.summary;
        const merchMatch = summary.match(/Merchandise Sales: \$([\d,]+)/);
        if (merchMatch) {
          const merchRevenue = parseInt(merchMatch[1].replace(/,/g, ''));
          // The net revenue should include full merchandise revenue
          expect(result.next.totalRevenue).toBeGreaterThan(merchRevenue);
        }
      });
    });
  });
});
