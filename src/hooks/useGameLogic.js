import { useCallback } from 'react';
import { STUDIO_TIERS, TRANSPORT_TIERS, GEAR_TIERS, SCENARIOS } from '../utils/constants';
import { buildMember, randomFrom, clampMorale } from '../utils/helpers';
import { processWeekEffects } from '../utils/processWeekEffects';

const VENUES = {
  coffeeShop: { name: 'Coffee Shop', capacity: 50, basePayout: 100, ticketPrice: 15 },
  smallClub: { name: 'Small Club', capacity: 150, basePayout: 250, ticketPrice: 18 },
  mediumVenue: { name: 'Medium Venue', capacity: 400, basePayout: 700, ticketPrice: 20 },
  largeVenue: { name: 'Large Venue', capacity: 1000, basePayout: 1800, ticketPrice: 25 },
  arena: { name: 'Arena', capacity: 5000, basePayout: 8000, ticketPrice: 30 },
  festival: { name: 'Music Festival', capacity: 10000, basePayout: 12000, ticketPrice: 35 },
  stadium: { name: 'Stadium', capacity: 20000, basePayout: 45000, ticketPrice: 40 }
};

/**
 * useGameLogic - Manages all core game mechanics and actions
 * 
 * Consolidates ~80 game action functions from App.jsx including:
 * - Song/Album management (write, record, publish)
 * - Gig booking and touring
 * - Equipment upgrades
 * - Label deal negotiation
 * - Band member management
 * - Game progression (week advancement, effects)
 * - Save/Load system
 * - Event triggers and handlers
 * 
 * @param {Object} gameState - Current game state from useGameState
 * @param {Function} updateGameState - Function to update game state
 * @param {Function} addLog - Function to add log entries from useGameState
 * @param {Object} data - Game data (genres, titles, etc.)
 * @returns {Object} Game logic methods and utilities
 */
export function useGameLogic(gameState, updateGameState, addLog, data = {}) {
  const normalizeTitle = (value, fallback = 'Untitled Track') => {
    const title = value && typeof value === 'string' ? value.trim() : '';
    return title || fallback;
  };

  const normalizeSong = (song, index = 0, state = {}) => {
    const title = normalizeTitle(song.title || song.name);
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const id = song.id || `song-${slug || 'track'}-${index}`;

    let quality = song.quality ?? 60;
    if (quality <= 10) {
      quality = Math.round(quality * 10);
    }
    quality = Math.min(100, Math.max(1, Math.floor(quality)));

    let popularity = song.popularity ?? Math.floor(quality * 0.6);
    if (popularity <= 10) {
      popularity = Math.round(popularity * 10);
    }
    popularity = Math.min(100, Math.max(0, Math.floor(popularity)));

    const genre = song.genre || state.genre || 'Pop';

    const base = {
      id,
      title,
      genre,
      quality,
      popularity,
      age: song.age ?? 0,
      streams: song.streams ?? song.totalStreams ?? 0,
      weeklyStreams: song.weeklyStreams ?? 0,
      earnings: song.earnings ?? song.totalEarnings ?? 0,
      plays: song.plays ?? 0,
      freshness: song.freshness ?? 100,
      videoBoost: song.videoBoost ?? false,
      inAlbum: song.inAlbum ?? false,
      recordedWeek: song.recordedWeek ?? state.week ?? 0,
      totalStreams: song.totalStreams ?? song.streams ?? 0,
      totalEarnings: song.totalEarnings ?? song.earnings ?? 0,
      chartPosition: song.chartPosition ?? 100,
      peakPosition: song.peakPosition ?? song.chartPosition ?? 100,
      peakStreamsPerWeek: song.peakStreamsPerWeek ?? song.weeklyStreams ?? 0,
      virality: song.virality ?? false
    };

    return {
      ...base,
      ...song,
      id,
      title,
      genre,
      quality,
      popularity
    };
  };

  const normalizeSongs = (songs = [], state = {}) =>
    songs.map((song, index) => normalizeSong(song, index, state));

  const normalizeAlbums = (albums = [], songs = []) => {
    const songIdByTitle = songs.reduce((acc, song) => {
      acc[song.title] = song.id;
      return acc;
    }, {});

    return albums.map((album, index) => {
      const name = normalizeTitle(album.name || album.title, `Album ${index + 1}`);
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const id = album.id || `album-${slug || 'release'}-${index}`;

      let quality = album.quality ?? 60;
      if (quality <= 10) {
        quality = Math.round(quality * 10);
      }
      quality = Math.min(100, Math.max(1, Math.floor(quality)));

      let popularity = album.popularity ?? Math.floor(quality * 0.7);
      if (popularity <= 10) {
        popularity = Math.round(popularity * 10);
      }
      popularity = Math.min(100, Math.max(0, Math.floor(popularity)));

      const rawSongIds = album.songIds
        || album.songTitles?.map((title) => songIdByTitle[title]).filter(Boolean)
        || album.songs
        || [];
      const songIds = Array.isArray(rawSongIds) ? rawSongIds : [];

      const base = {
        id,
        name,
        songIds,
        songTitles: album.songTitles || songIds.map((songId) => songs.find((s) => s.id === songId)?.title).filter(Boolean),
        quality,
        popularity,
        age: album.age ?? 0,
        promoBoost: album.promoBoost ?? 12,
        chartScore: album.chartScore ?? popularity,
        totalEarnings: album.totalEarnings ?? album.totalRevenue ?? 0,
        totalStreams: album.totalStreams ?? 0,
        weeklyStreams: album.weeklyStreams ?? 0,
        releasedWeek: album.releasedWeek ?? album.week ?? 0
      };

      return {
        ...base,
        ...album,
        id,
        name,
        songIds,
        quality,
        popularity
      };
    });
  };
  
  // ==================== SONG MANAGEMENT ====================

  /**
   * Write a new song
   * @param {string|object|null} songInput - Optional song data or title
   */
  const writeSong = useCallback((songInput = null) => {
    const input = (songInput && typeof songInput === 'object')
      ? songInput
      : { title: songInput };

    const studio = STUDIO_TIERS[gameState.studioTier || 0];
    if (!studio) {
      addLog('No studio available for recording.', 'error');
      return;
    }

    const difficulty = gameState.difficulty || 'normal';
    const costMultiplier = difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.2 : 1;
    const cost = Math.floor(studio.recordCost * costMultiplier);

    if (gameState.money < cost) {
      addLog(`Not enough money to record (need $${cost})`, 'warning', {
        title: 'Insufficient Funds',
        message: `You need $${cost} to record a song at ${studio.name}.`
      });
      return;
    }

    const titles = data?.songTitles || ['New Song'];
    const unusedTitles = titles.filter((t) => !gameState.songs.find((s) => s.title === t));
    const defaultTitle = unusedTitles.length
      ? unusedTitles[Math.floor(Math.random() * unusedTitles.length)]
      : titles[Math.floor(Math.random() * titles.length)] + ' (Remix)';

    const title = normalizeTitle(input.title, defaultTitle);

    // Check if title already exists
    if (gameState.songs && gameState.songs.find((s) => s.title === title)) {
      addLog(`A song with the title "${title}" already exists.`, 'warning', {
        title: 'Duplicate Title',
        message: `A song with the title "${title}" already exists. Please choose a different title.`
      });
      return;
    }

    const baseQuality = Math.floor(55 + Math.random() * 26);
    let finalQuality;
    if (typeof input.quality === 'number' && input.quality > 10) {
      finalQuality = Math.min(100, Math.max(1, Math.floor(input.quality)));
    } else {
      const qualityInput = Math.min(10, Math.max(1, input.quality || 5));
      const qualityMultiplier = qualityInput / 10;
      finalQuality = Math.min(100, Math.floor(baseQuality + studio.qualityBonus * qualityMultiplier));
    }

    const popularity = Math.min(
      100,
      Math.floor(finalQuality * 0.6) + (studio.popBonus || 0) + Math.floor((gameState.fame || 0) * 0.001)
    );

    const newSong = normalizeSong({
      id: `song-${Date.now()}`,
      title,
      genre: input.genre || gameState.genre || 'Pop',
      quality: finalQuality,
      popularity,
      energy: input.energy || 5,
      themes: input.themes || [],
      recordedWeek: gameState.week || 0,
      totalStreams: 0,
      weeklyStreams: 0,
      totalEarnings: 0,
      chartPosition: 100,
      peakPosition: 100,
      peakStreamsPerWeek: 0,
      virality: Math.random() < 0.1,
      generatedData: input.generatedData || null
    }, (gameState.songs || []).length, gameState);

    advanceWeek(
      (s) => {
        const currentSongs = Array.isArray(s.songs) ? s.songs : [];
        return {
          ...s,
          money: s.money - cost,
          songs: [...currentSongs, newSong],
          morale: clampMorale(s.morale + 4)
        };
      },
      `Laid down "${title}" at ${studio.name}. Quality: ${finalQuality}%. -$${cost}`,
      'write'
    );
  }, [gameState.money, gameState.studioTier, gameState.difficulty, gameState.songs, gameState.fame, gameState.genre, gameState.week, data, addLog]);

  /**
   * Record an album from selected songs
   * @param {string[]} selectedSongIds - Array of song IDs or titles to include
   */
  const recordAlbum = useCallback((selectedSongIds = []) => {
    if (selectedSongIds.length < 8) {
      alert('Need at least 8 songs to release an album.');
      return;
    }
    if (selectedSongIds.length > 12) {
      alert('Albums can have at most 12 songs.');
      return;
    }

    const studio = STUDIO_TIERS[gameState.studioTier || 0];
    const normalizedSongs = normalizeSongs(gameState.songs || [], gameState);
    const selectedSongs = normalizedSongs.filter(
      (song) => selectedSongIds.includes(song.id) || selectedSongIds.includes(song.title)
    );
    const songIds = selectedSongs.map((song) => song.id);
    
    if (selectedSongs.length < 8) {
      alert('Need at least 8 songs to release an album.');
      return;
    }

    const alreadyInAlbum = selectedSongs.some(s => s.inAlbum);
    if (alreadyInAlbum) {
      alert('One or more selected songs are already part of another album.');
      return;
    }

    const avgQuality = selectedSongs.reduce((sum, s) => sum + (s.quality || 0), 0) / selectedSongs.length;
    const albumQuality = Math.min(100, Math.floor(avgQuality + studio.qualityBonus * 1.5));
    
    const avgPopularity = selectedSongs.reduce((sum, s) => sum + (s.popularity || 0), 0) / selectedSongs.length;
    const albumPopularity = Math.min(100, Math.floor(avgPopularity * 1.2 + studio.popBonus * 2));
    
    const baseCost = studio.recordCost * selectedSongs.length * 0.8;
    const albumReleaseCost = Math.floor(baseCost * 1.5);
    
    if (gameState.money < albumReleaseCost) {
      alert(`Need $${albumReleaseCost} to release an album.`);
      return;
    }

    // Generate album name
    const albumType = Math.random();
    let albumName;
    
    if (albumType < 0.33) {
      const variants = [
        `${gameState.bandName}`,
        `${gameState.bandName} - Self-Titled`,
        `${gameState.bandName} Vol. ${(gameState.albums?.length || 0) + 1}`
      ];
      albumName = randomFrom(variants);
    } else if (albumType < 0.66) {
      const titleSong = randomFrom(selectedSongs);
      albumName = titleSong.title;
    } else {
      const madeUpTitles = [
        `The ${gameState.genre} Sessions`,
        `Live at Studio ${Math.floor(Math.random() * 100)}`,
        `${randomFrom(['Midnight', 'Dawn', 'Twilight'])} ${randomFrom(['Sessions', 'Tales'])}`,
        `The ${randomFrom(['Great', 'Long', 'Strange'])} ${randomFrom(['Road', 'Trip', 'Night'])}`
      ];
      albumName = randomFrom(madeUpTitles);
    }

    advanceWeek(
      (s) => {
        const updatedSongs = normalizeSongs(s.songs || [], s).map((song) =>
          songIds.includes(song.id)
            ? { ...song, inAlbum: true }
            : song
        );

        const newAlbum = normalizeAlbums([{
          id: `album-${Date.now()}`,
          name: albumName,
          releasedWeek: s.week,
          quality: albumQuality,
          popularity: albumPopularity,
          chartScore: albumPopularity,
          age: 0,
          promoBoost: 12,
          songIds,
          songTitles: selectedSongs.map((song) => song.title),
          totalEarnings: 0,
          totalStreams: 0,
          weeklyStreams: 0
        }], updatedSongs)[0];

        return {
          ...s,
          money: s.money - albumReleaseCost,
          songs: updatedSongs,
          albums: [...(s.albums || []), newAlbum],
          morale: clampMorale(s.morale + 8),
          fame: s.fame + Math.floor(albumPopularity * 0.15)
        };
      },
      `Released "${albumName}"! ${songIds.length} tracks, quality ${albumQuality}%. -$${albumReleaseCost}`,
      'album'
    );
  }, [gameState.studioTier, gameState.songs, gameState.money, gameState.bandName, gameState.genre, gameState.albums, addLog]);

  // ==================== GIG MANAGEMENT ====================

  /**
   * Get available venues for booking based on band stats
   * @returns {Array} List of available venues
   */
  const getAvailableVenues = useCallback(() => {
    const fame = gameState.fame || 0;
    const morale = gameState.morale || 70;
    const bandMembers = gameState.bandMembers || gameState.members || [];
    const bandSkill = bandMembers.length
      ? bandMembers.reduce((sum, member) => sum + (member.stats?.skill || 5), 0) / bandMembers.length
      : 5;

    let maxTier = 1;
    if (fame > 100) maxTier = 2;
    if (fame > 500) maxTier = 3;
    if (fame > 1500) maxTier = 4;
    if (fame > 5000) maxTier = 5;
    if (fame > 15000) maxTier = 6;

    const venueList = Object.entries(VENUES).filter(([key, venue]) => {
      const venueTier = Math.min(6, Math.ceil(venue.capacity / 400));
      const requiresMorale = venueTier * 10 + 40;
      return venueTier <= maxTier && morale >= requiresMorale && bandSkill >= 3;
    });

    return venueList.map(([id, venue]) => ({ id, ...venue }));
  }, [gameState.fame, gameState.morale, gameState.bandMembers, gameState.members]);

  /**
   * Book a gig at a venue
   * @param {string} venueId - Venue identifier
   * @param {number} advanceMultiplier - Payment multiplier for advance
   */
  const bookGig = useCallback((venueId, advanceMultiplier = 1) => {
    const venue = VENUES[venueId];
    if (!venue) {
      addLog(`Venue "${venueId}" not found.`, 'error');
      return;
    }

    const transport = TRANSPORT_TIERS[gameState.transportTier || 0];
    const travelCost = transport?.travelCost || 0;

    if (gameState.money < travelCost) {
      addLog(`Need $${travelCost} for travel to ${venue.name}.`, 'warning');
      return;
    }

    const basePayout = venue.basePayout || 100;
    const maxAttendance = venue.capacity || 500;
    const ticketPrice = venue.ticketPrice || 15;
    
    const fame = gameState.fame || 0;
    const drawFactor = Math.min(1, fame / 2000);
    const attendance = Math.floor(maxAttendance * (0.3 + drawFactor * 0.7));
    const revenue = attendance * ticketPrice;
    const advance = Math.floor(basePayout * advanceMultiplier);
    const totalPayout = advance + Math.floor(revenue * 0.6); // Band gets 60% of ticket sales
    
    advanceWeek(
      (s) => {
        const gig = {
          id: `gig-${Date.now()}`,
          venueId,
          venueName: venue.name,
          week: s.week || 0,
          attendance,
          capacity: venue.capacity,
          ticketRevenue: Math.floor(revenue * 0.6),
          advance,
          totalRevenue: totalPayout,
          fameGain: Math.floor(attendance / 50)
        };

        return {
          ...s,
          money: s.money - travelCost + totalPayout,
          gigs: (s.gigs || 0) + 1,
          morale: clampMorale(s.morale + 3),
          fame: s.fame + Math.floor(attendance / 50),
          gigHistory: [...(s.gigHistory || []), gig],
          gigEarnings: (s.gigEarnings || 0) + totalPayout,
          totalEarnings: (s.totalEarnings || 0) + totalPayout
        };
      },
      `Played ${venue.name} with ${attendance} fans. Revenue: $${totalPayout}. Travel: -$${travelCost}`,
      'gig'
    );
  }, [gameState.fame, gameState.money, gameState.transportTier, addLog]);

  // ==================== EQUIPMENT UPGRADES ====================

  /**
   * Upgrade studio tier
   */
  const upgradeStudio = useCallback(() => {
    const nextTier = (gameState.studioTier || 0) + 1;
    if (nextTier >= 3) {
      addLog('Your studio is already at max tier.');
      return;
    }

    const nextStudio = STUDIO_TIERS[nextTier];
    if (!nextStudio) return;

    if (gameState.money < nextStudio.upgradeCost) {
      addLog(`Need $${nextStudio.upgradeCost} to upgrade to ${nextStudio.name}.`, 'warning');
      return;
    }

    updateGameState({
      studioTier: nextTier,
      money: gameState.money - nextStudio.upgradeCost
    });
    
    addLog(`Upgraded studio to ${nextStudio.name}. -$${nextStudio.upgradeCost}`);
  }, [gameState.studioTier, gameState.money, addLog, updateGameState]);

  /**
   * Upgrade transport
   */
  const upgradeTransport = useCallback(() => {
    const nextTier = (gameState.transportTier || 0) + 1;
    if (nextTier >= TRANSPORT_TIERS.length) {
      addLog('Your transport is already at max tier.');
      return;
    }

    const nextTransport = TRANSPORT_TIERS[nextTier];
    if (!nextTransport) return;

    if (gameState.money < nextTransport.upgradeCost) {
      addLog(`Need $${nextTransport.upgradeCost} to upgrade transport.`, 'warning');
      return;
    }

    updateGameState({
      transportTier: nextTier,
      money: gameState.money - nextTransport.upgradeCost
    });
    
    addLog(`Upgraded transport to ${nextTransport.name}. -$${nextTransport.upgradeCost}`);
  }, [gameState.transportTier, gameState.money, addLog, updateGameState]);

  /**
   * Upgrade gear/equipment
   */
  const upgradeGear = useCallback(() => {
    const nextTier = (gameState.gearTier || 0) + 1;
    if (nextTier >= GEAR_TIERS.length) {
      addLog('Your gear is already at max tier.');
      return;
    }

    const nextGear = GEAR_TIERS[nextTier];
    if (!nextGear) return;

    if (gameState.money < nextGear.upgradeCost) {
      addLog(`Need $${nextGear.upgradeCost} to upgrade gear.`, 'warning');
      return;
    }

    updateGameState({
      gearTier: nextTier,
      money: gameState.money - nextGear.upgradeCost
    });
    
    addLog(`Upgraded gear to ${nextGear.name}. -$${nextGear.upgradeCost}`);
  }, [gameState.gearTier, gameState.money, addLog, updateGameState]);

  // ==================== MEMBER MANAGEMENT ====================

  /**
   * Add a new band member
   * @param {string} role - Member role (guitar, drums, bass, synth, dj)
   * @param {string[]} personalities - Member personalities
   */
  const addMember = useCallback((role, personalities = []) => {
    if ((gameState.members || []).length >= 6) {
      addLog('Band is at maximum size (6 members).');
      return;
    }

    const newMember = buildMember(role, personalities);
    updateGameState({
      members: [...(gameState.members || []), newMember]
    });
    
    addLog(`${newMember.name} joined the band!`);
  }, [gameState.members, addLog, updateGameState]);

  /**
   * Fire a band member
   * @param {string} memberId - Member ID to remove
   */
  const fireMember = useCallback((memberId) => {
    const member = (gameState.members || []).find(m => m.id === memberId);
    if (!member) return;

    updateGameState({
      members: gameState.members.filter(m => m.id !== memberId),
      morale: clampMorale(gameState.morale - 10)
    });
    
    addLog(`${member.name} left the band. Band morale decreased.`);
  }, [gameState.members, gameState.morale, addLog, updateGameState]);

  // ==================== WEEK PROGRESSION ====================

  /**
   * Advance the game week with updater function and optional log entry
   * @param {Function} updater - State updater function
   * @param {string} entry - Log message
   * @param {string} context - Context for member stat adjustments
   */
  const advanceWeek = useCallback((updater, entry = '', context = 'neutral') => {
    try {
      let updated = updater(gameState);

      // Normalize core data models before processing
      const normalizedSongs = normalizeSongs(updated.songs || [], updated);
      const normalizedAlbums = normalizeAlbums(updated.albums || [], normalizedSongs);
      updated = { ...updated, songs: normalizedSongs, albums: normalizedAlbums };
      
      // Ensure members is always an array
      if (!updated.members || !Array.isArray(updated.members)) {
        updated.members = gameState.members || gameState.bandMembers || [];
      }
      
      // Ensure bandMembers is set for processWeekEffects
      if (!updated.bandMembers && updated.members) {
        updated.bandMembers = updated.members;
      }
      
      // Increment week before processing
      const nextWeek = (updated.week || 0) + 1;
      updated = { ...updated, week: nextWeek };
      
      const { next: processedState, summary, detailedSummary } = processWeekEffects(updated, data);

      updateGameState(processedState);
      if (entry) addLog(entry);
      if (summary) addLog(summary);

      return detailedSummary;
    } catch (error) {
      console.error('Error in advanceWeek:', error);
      addLog(`Error advancing week: ${error.message}`);
      return null;
    }
  }, [gameState, addLog, updateGameState, data]);

  // ==================== UTILITIES ====================

  /**
   * Rehearse to improve member stats
   */
  const rehearse = useCallback(() => {
    if (gameState.money < 100) {
      addLog('Need $100 to rehearse.');
      return;
    }

    advanceWeek(
      (s) => ({
        ...s,
        money: s.money - 100,
        morale: clampMorale(s.morale + 5)
      }),
      'Band rehearsed. Member stats improved. -$100',
      'rehearse'
    );
  }, [gameState.money, addLog]);

  /**
   * Rest to restore morale
   */
  const rest = useCallback(() => {
    advanceWeek(
      (s) => ({
        ...s,
        morale: clampMorale(s.morale + 15)
      }),
      'Band took a break. Morale improved.',
      'rest'
    );
  }, [addLog]);

  /**
   * Start a tour
   * @param {string} tourType - Type of tour (regional, national, world)
   * @param {number} weeks - Number of weeks
   */
  const startTour = useCallback((tourType = 'regional', weeks = 4) => {
    const tourCosts = {
      regional: 500,
      national: 1500,
      world: 5000
    };

    const cost = tourCosts[tourType] || 500;
    if (gameState.money < cost) {
      addLog(`Need $${cost} to start a ${tourType} tour.`, 'warning');
      return;
    }

    updateGameState({
      activeTour: tourType,
      tourWeeksRemaining: weeks,
      money: gameState.money - cost
    });

    addLog(`Started ${tourType} tour for ${weeks} weeks. -$${cost}`);
  }, [gameState.money, addLog, updateGameState]);

  // Return public API
  return {
    writeSong,
    recordAlbum,
    getAvailableVenues,
    bookGig,
    upgradeStudio,
    upgradeTransport,
    upgradeGear,
    addMember,
    fireMember,
    advanceWeek,
    rehearse,
    rest,
    startTour
  };
}

export default useGameLogic;
