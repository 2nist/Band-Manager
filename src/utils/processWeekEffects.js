/**
 * processWeekEffects - Core weekly game processing
 * 
 * Phase 1: Essential mechanics only
 * - Weekly expenses calculation
 * - Basic song streaming revenue
 * - Song aging
 * 
 * Phase 2: Albums & Trends
 * - Album revenue
 * - Genre trends
 * - Fan growth
 * 
 * Phase 3: Enhanced Systems
 * - Radio plays
 * - Label deals & royalty splits
 * - Chart progression
 * - Equipment costs
 * 
 * Phase 4: Advanced Systems
 * - Merchandise revenue integration
 * - Social media growth (coming)
 * - Tour revenue (coming)
 * - Geographic reputation (coming)
 * - Career stats (coming)
 */

import { clampStat } from './helpers';
import { GENRES } from './constants';
import { randomFrom } from './helpers';

/**
 * Calculate weekly expenses (Phase 3: Enhanced with equipment tiers)
 * @param {Object} state - Game state
 * @returns {number} Total weekly expenses
 */
export function calculateWeeklyExpenses(state) {
  const difficulty = state.difficulty || 'normal';
  const costMultiplier = difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.2 : 1;
  
  // Base expenses
  const baseExpenses = Math.floor(100 * costMultiplier);
  
  // Member salaries (50 per member per week)
  const members = state.bandMembers || state.members || [];
  const memberSalaries = Math.floor(members.length * 50 * costMultiplier);
  
  // Equipment costs based on tiers (Phase 3)
  const equipmentTierMap = {
    basic: 20,
    good: 50,
    professional: 100
  };
  
  const equipmentLevel = state.equipment?.instruments || 'basic';
  const baseEquipmentCost = equipmentTierMap[equipmentLevel] || 20;
  const equipmentCosts = Math.floor(baseEquipmentCost * costMultiplier);
  
  // Transport costs
  const transportTierMap = {
    none: 0,
    van: 50,
    bus: 150,
    tourBus: 300
  };
  
  const transportLevel = state.equipment?.transport || state.transportTier || 'none';
  const baseTransportCost = typeof transportLevel === 'number' 
    ? [0, 50, 150, 300][transportLevel] || 0
    : transportTierMap[transportLevel] || 0;
  const transportCosts = Math.floor(baseTransportCost * costMultiplier);
  
  // Staff costs
  const managerCost = state.staffManager === 'dodgy' ? 80 : state.staffManager === 'pro' ? 150 : 0;
  const lawyerCost = state.staffLawyer ? 90 : 0;
  const staffCosts = Math.floor((managerCost + lawyerCost) * costMultiplier);
  
  // Label costs (independent has monthly fee)
  let labelCosts = 0;
  if (state.labelDeal && state.labelDeal.type === 'independent') {
    labelCosts = Math.floor((state.labelDeal.monthlyFee || 20) * costMultiplier);
  }
  
  return baseExpenses + memberSalaries + equipmentCosts + transportCosts + staffCosts + labelCosts;
}

/**
 * Calculate radio plays and revenue for songs
 * @param {Array} songs - Array of song objects
 * @returns {Object} { radioPlays: number, radioRevenue: number }
 */
export function calculateRadioPlays(songs) {
  if (!songs || songs.length === 0) return { radioPlays: 0, radioRevenue: 0 };
  
  let totalPlays = 0;
  let totalRevenue = 0;
  
  songs.forEach(song => {
    const popularity = song.popularity || 0;
    const plays = Math.floor(popularity / 12); // More popular = more radio plays
    const revenue = plays * 2; // $2 per radio play
    
    totalPlays += plays;
    totalRevenue += revenue;
  });
  
  return { radioPlays: totalPlays, radioRevenue: totalRevenue };
}

/**
 * Calculate song streaming revenue (Phase 3: Enhanced with radio)
 * @param {Array} songs - Array of song objects
 * @param {Object} state - Game state (for difficulty multiplier)
 * @returns {number} Total streaming revenue (excluding radio, which is separate)
 */
export function calculateSongStreamingRevenue(songs, state) {
  if (!songs || songs.length === 0) return 0;
  
  const difficulty = state.difficulty || 'normal';
  const revenueMultiplier = difficulty === 'easy' ? 1.2 : difficulty === 'hard' ? 0.8 : 1;
  
  const totalRevenue = songs.reduce((total, song) => {
    const popularity = song.popularity || 0;
    const quality = song.quality || 0;
    const age = song.age || 0;
    
    // Base streams based on popularity and quality
    const baseStreams = Math.floor((popularity * 60) + (quality * 40));
    
    // Freshness decay (songs get less streams as they age)
    const freshness = Math.max(0.3, 1 - (age * 0.02));
    
    // Calculate streams
    const streams = Math.floor(baseStreams * freshness);
    
    // Revenue: $0.004 per stream
    const revenue = Math.floor(streams * 0.004);
    
    return total + revenue;
  }, 0);
  
  return Math.floor(totalRevenue * revenueMultiplier);
}

/**
 * Calculate chart score for a song (Phase 3)
 * @param {Object} song - Song object
 * @returns {number} Chart score
 */
export function calculateSongChartScore(song) {
  const popularity = song.popularity || 0;
  const weeklyStreams = song.weeklyStreams || 0;
  // Chart score: popularity * 10 + streams * 0.1
  return Math.floor(popularity * 10 + weeklyStreams * 0.1);
}

/**
 * Age songs by one week (Phase 3: Enhanced with trend bonuses, label effects, and chart scores)
 * @param {Array} songs - Array of song objects
 * @param {Object} state - Game state (for trends, label deals, etc.)
 * @param {Object} trendResult - Result from processGenreTrends
 * @returns {Array} Updated songs with age incremented and popularity adjusted
 */
export function ageSongs(songs, state = {}, trendResult = {}) {
  if (!songs || songs.length === 0) return [];
  
  const currentTrend = trendResult.trend || state.trend;
  const seasonalBoost = trendResult.seasonalBoost || 0;
  
  return songs.map(song => {
    const basePopularity = song.popularity || Math.floor((song.quality || 0) * 0.6);
    const age = (song.age || 0) + 1;
    
    // Base decay
    const decayed = Math.max(0, basePopularity - 1);
    
    // Trend bonus if song matches current trend genre
    const trendBonus = currentTrend && song.genre === currentTrend.genre 
      ? currentTrend.modifier || 0 
      : 0;
    
    // Album boost (if song is in an album)
    let albumBoost = 0;
    if (song.inAlbum && state.albums && state.albums.length > 0) {
      const containingAlbum = state.albums.find(a => 
        a.songTitles && a.songTitles.includes(song.title)
      );
      if (containingAlbum) {
        albumBoost = Math.floor((containingAlbum.promoBoost || 0) * 0.5);
      }
    }
    
    // Calculate new popularity with all bonuses
    let popularity = Math.max(0, Math.floor(
      decayed + trendBonus + seasonalBoost + albumBoost
    ));
    
    // Label effects (playlist pitches, radio promo) - Phase 3
    if (state.labelDeal) {
      if (state.labelDeal.playlistPitch && Math.random() < 0.15) {
        const playlistBoost = Math.floor(Math.random() * 15) + 5;
        popularity = Math.min(100, popularity + playlistBoost);
      }
      if (state.labelDeal.radioPromo && Math.random() < 0.12) {
        const radioBoost = Math.floor(Math.random() * 8) + 3;
        popularity = Math.min(100, popularity + radioBoost);
      }
    }
    
    // Rare viral spike (3% chance)
    if (Math.random() < 0.03) {
      popularity = Math.min(100, popularity + 25);
    }
    
    // Calculate streams for this song
    const freshness = Math.max(0, 100 - (age * 3));
    const freshnessWeight = Math.max(0, 1 - (age * 0.05));
    const streamBase = popularity * 60;
    const streamFresh = Math.floor(freshness * 6 * freshnessWeight);
    
    // Album boost for streaming
    let streamBonus = song.videoBoost ? 400 : 0;
    if (song.inAlbum) {
      streamBonus += Math.floor(streamBase * 0.15); // 15% boost for being in an album
    }
    
    const weeklyStreams = Math.max(0, Math.floor(streamBase + streamFresh + streamBonus));
    const streamRevenue = Math.floor(weeklyStreams * 0.004);
    
    // Radio plays
    const radioPlays = Math.floor(popularity / 12);
    const radioRevenue = radioPlays * 2;
    
    // Calculate chart score (Phase 3)
    const chartScore = calculateSongChartScore({
      popularity,
      weeklyStreams
    });
    
    return {
      ...song,
      age,
      popularity,
      streams: (song.streams || 0) + weeklyStreams,
      weeklyStreams,
      plays: (song.plays || 0) + radioPlays,
      earnings: (song.earnings || 0) + streamRevenue + radioRevenue,
      chartScore // Phase 3: Add chart score
    };
  });
}

/**
 * Calculate album streaming revenue
 * @param {Array} albums - Array of album objects
 * @param {Object} state - Game state (for difficulty multiplier)
 * @returns {number} Total album streaming revenue
 */
export function calculateAlbumStreamingRevenue(albums, state) {
  if (!albums || albums.length === 0) return 0;
  
  const difficulty = state.difficulty || 'normal';
  const revenueMultiplier = difficulty === 'easy' ? 1.2 : difficulty === 'hard' ? 0.8 : 1;
  
  const totalRevenue = albums.reduce((total, album) => {
    const albumAge = album.age || 0;
    const albumPopularity = album.popularity || 0;
    const albumQuality = album.quality || 0;
    
    // Albums generate streams based on quality and popularity
    // Newer albums generate more streams (decay over time)
    const freshness = Math.max(0.3, 1 - (albumAge * 0.02)); // Slow decay
    const baseAlbumStreams = Math.floor((albumQuality * 150) + (albumPopularity * 80));
    const albumStreams = Math.floor(baseAlbumStreams * freshness);
    
    // Revenue: $0.004 per stream
    const albumStreamRevenue = Math.floor(albumStreams * 0.004);
    
    return total + albumStreamRevenue;
  }, 0);
  
  return Math.floor(totalRevenue * revenueMultiplier);
}

/**
 * Age albums by one week (Phase 3: Enhanced with chart progression)
 * @param {Array} albums - Array of album objects
 * @param {Object} state - Game state (for label marketing)
 * @returns {Array} Updated albums with age incremented and chart scores
 */
export function ageAlbums(albums, state = {}) {
  if (!albums || albums.length === 0) return [];
  
  // Label marketing boost
  let labelMarketingBoost = 0;
  if (state.labelDeal && state.labelDeal.marketingBudget > 0) {
    labelMarketingBoost = Math.floor(state.labelDeal.marketingBudget / 10);
  }
  
  return albums.map(album => {
    const age = (album.age || 0) + 1;
    let promoBoost = Math.max(0, (album.promoBoost || 0) - 1);
    
    // Label marketing sustains promo boost
    if (state.labelDeal && state.labelDeal.marketingBudget > 0) {
      promoBoost = Math.min(20, promoBoost + Math.floor(state.labelDeal.marketingBudget / 100));
    }
    
    // Album decay calculation (stronger in early weeks)
    const decay = Math.max(0, 14 - age);
    
    // Calculate chart score (Phase 3: Enhanced)
    const quality = album.quality || 0;
    const popularity = album.popularity || 0;
    const score = Math.max(0, Math.floor(quality * 0.8 + decay + promoBoost + labelMarketingBoost));
    
    return {
      ...album,
      age,
      promoBoost,
      chartScore: score
    };
  });
}

/**
 * Process genre trends - Phase 2
 * Handles dynamic genre trends and seasonal boosts
 * @param {Object} state - Current game state
 * @param {Array} availableGenres - Available genres (from gameData or constants)
 * @returns {Object} { trend: trendObject, seasonalBoost: number, notes: string[] }
 */
export function processGenreTrends(state, availableGenres = GENRES) {
  let newTrend = state.trend;
  const trendNotes = [];
  const updatedGenreTrends = { ...(state.genreTrends || {}) };
  
  // Track current genre popularity
  const currentGenre = state.genre || 'Pop';
  if (!updatedGenreTrends[currentGenre]) {
    updatedGenreTrends[currentGenre] = { popularity: 50, weeks: 0 };
  }
  
  // Seasonal boosts
  const weekOfYear = (state.week || 0) % 52;
  let seasonalBoost = 0;
  const seasonalNote = [];
  
  // Summer (weeks 20-35): Pop, Dance, Electronic get boost
  if (weekOfYear >= 20 && weekOfYear <= 35) {
    if (currentGenre === 'Pop' || currentGenre === 'Dance' || currentGenre === 'EDM') {
      seasonalBoost = 8;
      seasonalNote.push('Summer boost');
    }
  }
  
  // Holiday season (weeks 45-52, 1-5): Holiday music boost
  if ((weekOfYear >= 45 && weekOfYear <= 52) || (weekOfYear >= 1 && weekOfYear <= 5)) {
    if (currentGenre === 'Pop' || currentGenre === 'Rock') {
      seasonalBoost = 5;
      seasonalNote.push('Holiday season boost');
    }
  }
  
  // Dynamic genre trend system
  if (!newTrend || newTrend.weeks <= 0) {
    // 15% chance of new trend
    if (Math.random() < 0.15 && availableGenres.length > 0) {
      const genre = randomFrom(availableGenres);
      // Trends can be stronger or weaker
      const trendStrength = Math.random() < 0.3 ? 'major' : Math.random() < 0.6 ? 'moderate' : 'minor';
      const modifier = trendStrength === 'major' ? 18 + Math.floor(Math.random() * 8) :
                      trendStrength === 'moderate' ? 12 + Math.floor(Math.random() * 6) :
                      6 + Math.floor(Math.random() * 4);
      const weeks = trendStrength === 'major' ? 6 + Math.floor(Math.random() * 3) :
                   trendStrength === 'moderate' ? 4 + Math.floor(Math.random() * 2) :
                   2 + Math.floor(Math.random() * 2);
      newTrend = { genre, modifier, weeks, strength: trendStrength };
      trendNotes.push(`${trendStrength === 'major' ? '🔥 Major' : trendStrength === 'moderate' ? '📈' : '📊'} ${genre} trend! Lasts ${weeks} weeks (+${modifier}% popularity).`);
      
      // Update genre popularity tracking
      if (!updatedGenreTrends[genre]) {
        updatedGenreTrends[genre] = { popularity: 50, weeks: 0 };
      }
      updatedGenreTrends[genre].popularity = Math.min(100, updatedGenreTrends[genre].popularity + 10);
      updatedGenreTrends[genre].weeks = newTrend.weeks;
    }
  } else {
    newTrend = { ...newTrend, weeks: newTrend.weeks - 1 };
    if (newTrend.weeks === 0) {
      trendNotes.push(`${newTrend.genre} trend cooled off.`);
      // Genre popularity decays when trend ends
      if (updatedGenreTrends[newTrend.genre]) {
        updatedGenreTrends[newTrend.genre].popularity = Math.max(30, updatedGenreTrends[newTrend.genre].popularity - 5);
      }
      newTrend = null;
    } else {
      // Gradually reduce trend strength
      const decayRate = newTrend.strength === 'major' ? 1.5 : newTrend.strength === 'moderate' ? 1 : 0.5;
      newTrend.modifier = Math.max(2, newTrend.modifier - decayRate);
    }
  }
  
  return {
    trend: newTrend,
    seasonalBoost,
    genreTrends: updatedGenreTrends,
    notes: [...trendNotes, ...seasonalNote]
  };
}

/**
 * Calculate fan growth based on fame and songs
 * @param {Object} state - Current game state
 * @param {Array} songs - Array of songs
 * @returns {number} Fan growth amount
 */
export function calculateFanGrowth(state, songs) {
  // Base fan growth from fame (10% of fame)
  const fameGrowth = Math.floor((state.fame || 0) / 10);
  
  // Bonus for having songs (5 fans per week if you have songs)
  const songBonus = songs.length > 0 ? 5 : 0;
  
  return fameGrowth + songBonus;
}

/**
 * Calculate label royalty split (Phase 3)
 * @param {number} grossRevenue - Total revenue before label split
 * @param {Object} labelDeal - Label deal object
 * @returns {Object} { netRevenue: number, labelRoyaltySplit: number }
 */
export function calculateLabelRoyaltySplit(grossRevenue, labelDeal) {
  if (!labelDeal || labelDeal.type === 'independent') {
    return { netRevenue: grossRevenue, labelRoyaltySplit: 0 };
  }
  
  const royaltySplit = labelDeal.royaltySplit || 0;
  const labelRoyaltySplit = Math.floor(grossRevenue * royaltySplit / 100);
  const netRevenue = grossRevenue - labelRoyaltySplit;
  
  return { netRevenue, labelRoyaltySplit };
}

/**
 * Calculate merchandise revenue (Phase 4)
 * @param {Array} merchandise - Array of merchandise objects
 * @param {Object} state - Game state (for fame, etc.)
 * @returns {Object} { merchandiseRevenue: number, itemsSold: number, updatedMerchandise: Array }
 */
export function calculateMerchandiseRevenue(merchandise, state) {
  if (!merchandise || merchandise.length === 0) {
    return { merchandiseRevenue: 0, itemsSold: 0, updatedMerchandise: [] };
  }
  
  let totalRevenue = 0;
  let totalItemsSold = 0;
  const fame = state.fame || 0;
  
  const updatedMerch = merchandise.map(m => {
    // Calculate weekly sales based on:
    // - Band fame (draw factor)
    // - Merchandise popularity
    // - Inventory availability
    // - Design quality
    
    const fameDraw = Math.min(1, fame / 5000);
    const qualityFactor = (m.quality || 50) / 100;
    const weeksSelling = (m.weeksSelling || 0) + 1;
    const decayFactor = 1 / (1 + weeksSelling * 0.1); // Sales decay over time
    
    const baseWeeklySales = Math.floor(50 * (m.popularity || 50) * fameDraw * qualityFactor * decayFactor);
    const unitsSold = Math.min(baseWeeklySales, m.inventory || 0);
    
    if (unitsSold > 0) {
      const revenuePerUnit = (m.basePrice || 20) * (0.7 + qualityFactor * 0.3); // Quality affects profit margin
      const weeklyRevenue = Math.floor(unitsSold * revenuePerUnit);
      
      totalRevenue += weeklyRevenue;
      totalItemsSold += unitsSold;
      
      return {
        ...m,
        inventory: (m.inventory || 0) - unitsSold,
        totalSold: (m.totalSold || 0) + unitsSold,
        totalRevenue: (m.totalRevenue || 0) + weeklyRevenue,
        weeksSelling: weeksSelling
      };
    }
    
    return { ...m, weeksSelling: weeksSelling };
  });
  
  return {
    merchandiseRevenue: totalRevenue,
    itemsSold: totalItemsSold,
    updatedMerchandise: updatedMerch
  };
}

/**
 * Process week effects - Phase 3 (Added radio play, label deals, enhanced song processing)
 * @param {Object} state - Current game state
 * @param {Object} gameData - Game data (for genres, etc.)
 * @returns {Object} { next: updatedState, summary: summaryString }
 */
export function processWeekEffects(state, gameData = {}) {
  // Calculate expenses
  const weeklyExpenses = calculateWeeklyExpenses(state);
  
  // Process genre trends
  const availableGenres = gameData.genres || GENRES;
  const trendResult = processGenreTrends(state, availableGenres);
  
  // Age songs with enhanced processing (trends, label effects)
  const agedSongs = ageSongs(state.songs || [], state, trendResult);
  const agedAlbums = ageAlbums(state.albums || [], state);
  
  // Calculate revenue from different sources
  const songStreamingRevenue = calculateSongStreamingRevenue(agedSongs, state);
  const { radioPlays, radioRevenue } = calculateRadioPlays(agedSongs);
  const albumRevenue = calculateAlbumStreamingRevenue(agedAlbums, state);
  const { merchandiseRevenue, itemsSold, updatedMerchandise } = calculateMerchandiseRevenue(
    state.merchandise || [],
    state
  );
  
  // Calculate gross music revenue (before label split) - merchandise is separate
  const grossMusicRevenue = songStreamingRevenue + radioRevenue + albumRevenue;
  
  // Apply label royalty split if under contract (only to music revenue, not merchandise)
  const { netRevenue: netMusicRevenue, labelRoyaltySplit } = calculateLabelRoyaltySplit(
    grossMusicRevenue, 
    state.labelDeal
  );
  
  // Total net revenue (music + merchandise)
  const netRevenue = netMusicRevenue + merchandiseRevenue;
  
  // Calculate fan growth
  const fanGrowth = calculateFanGrowth(state, agedSongs);
  const newFans = (state.fans || 0) + fanGrowth;
  
  // Calculate net change
  const netChange = netRevenue - weeklyExpenses;
  const newMoney = Math.max(0, (state.money || 0) + netChange);
  
  // Build summary with trend notes
  const trendSummary = trendResult.notes.length > 0 
    ? '\n- ' + trendResult.notes.join('\n- ')
    : '';
  
  const labelNote = labelRoyaltySplit > 0 
    ? `\n- Label Royalty Split: -$${labelRoyaltySplit.toLocaleString()}`
    : '';
  
  const merchandiseNote = merchandiseRevenue > 0
    ? `\n- Merchandise Sales: $${merchandiseRevenue.toLocaleString()} (${itemsSold} items)`
    : '';
  
  const summary = `Week ${(state.week || 0) + 1} Summary:
- Expenses: $${weeklyExpenses.toLocaleString()}
- Song Streaming: $${songStreamingRevenue.toLocaleString()}
- Radio Plays: ${radioPlays} ($${radioRevenue.toLocaleString()})
- Album Revenue: $${albumRevenue.toLocaleString()}${merchandiseNote}${labelNote}
- Net Revenue: $${netRevenue.toLocaleString()}
- Net: ${netChange >= 0 ? '+' : ''}$${netChange.toLocaleString()}
- Fan Growth: +${fanGrowth}
- New Balance: $${newMoney.toLocaleString()}${trendSummary}`;
  
  // Return updated state
  return {
    next: {
      ...state,
      money: newMoney,
      fans: newFans,
      songs: agedSongs,
      albums: agedAlbums,
      merchandise: updatedMerchandise,
      trend: trendResult.trend,
      genreTrends: trendResult.genreTrends,
      weeklyExpenses,
      totalRevenue: (state.totalRevenue || 0) + netRevenue
    },
    summary
  };
}
