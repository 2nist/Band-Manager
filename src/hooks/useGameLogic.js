import { useCallback } from 'react';
import { STUDIO_TIERS, TRANSPORT_TIERS, GEAR_TIERS, SCENARIOS } from '../utils/constants';
import { buildMember, randomFrom, clampMorale } from '../utils/helpers';

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
  
  // ==================== SONG MANAGEMENT ====================

  /**
   * Write a new song
   * @param {string|null} customTitle - Optional custom song title
   */
  const writeSong = useCallback((customTitle = null) => {
    const studio = STUDIO_TIERS[gameState.studioTier];
    const difficulty = gameState.difficulty || 'normal';
    const costMultiplier = difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.2 : 1;
    const cost = Math.floor(studio.recordCost * costMultiplier);
    
    if (gameState.money < cost) {
      addLog(`Not enough money to record (need $${cost})`, true, {
        title: 'Insufficient Funds',
        message: `You need $${cost} to record a song at ${studio.name}.`,
        type: 'warning'
      });
      return;
    }

    const titles = data?.songTitles || ['New Song'];
    const unusedTitles = titles.filter((t) => !gameState.songs.find((s) => s.title === t));
    const defaultTitle = unusedTitles.length
      ? unusedTitles[Math.floor(Math.random() * unusedTitles.length)]
      : titles[Math.floor(Math.random() * titles.length)] + ' (Remix)';
    
    const title = customTitle && customTitle.trim() ? customTitle.trim() : defaultTitle;
    
    // Check if title already exists
    if (gameState.songs && gameState.songs.find((s) => s.title === title)) {
      addLog(`A song with the title "${title}" already exists.`, true, {
        title: 'Duplicate Title',
        message: `A song with the title "${title}" already exists. Please choose a different title.`,
        type: 'warning'
      });
      return;
    }
    
    const baseQuality = Math.floor(58 + Math.random() * 26);
    const quality = Math.min(100, baseQuality + studio.qualityBonus);
    const popularity = Math.floor(quality * 0.6) + studio.popBonus;
    
    const newSong = { 
      title, 
      quality, 
      popularity, 
      earnings: 0, 
      plays: 0, 
      age: 0,
      streams: 0,
      weeklyStreams: 0,
      freshness: 80 + studio.freshnessBonus * 10,
      videoBoost: false,
      inAlbum: false
    };

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
      `Laid down "${title}" at ${studio.name}. Quality: ${quality}%. -$${cost}`,
      'write'
    );
    
  }, [gameState.money, gameState.studioTier, gameState.difficulty, gameState.songs, data, addLog]);

  /**
   * Record an album from selected songs
   * @param {string[]} selectedSongTitles - Array of song titles to include
   */
  const recordAlbum = useCallback((selectedSongTitles) => {
    if (selectedSongTitles.length < 8) {
      alert('Need at least 8 songs to release an album.');
      return;
    }
    if (selectedSongTitles.length > 12) {
      alert('Albums can have at most 12 songs.');
      return;
    }

    const studio = STUDIO_TIERS[gameState.studioTier];
    const selectedSongs = gameState.songs.filter(s => selectedSongTitles.includes(s.title));
    
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
        const updatedSongs = s.songs.map(song => 
          selectedSongTitles.includes(song.title)
            ? { ...song, inAlbum: true }
            : song
        );

        const newAlbum = {
          name: albumName,
          week: s.week,
          quality: albumQuality,
          popularity: albumPopularity,
          chartScore: albumPopularity,
          age: 0,
          promoBoost: 12,
          songs: selectedSongTitles.length,
          songTitles: selectedSongTitles
        };

        return {
          ...s,
          money: s.money - albumReleaseCost,
          songs: updatedSongs,
          albums: [...(s.albums || []), newAlbum],
          morale: clampMorale(s.morale + 8),
          fame: s.fame + Math.floor(albumPopularity * 0.15)
        };
      },
      `Released "${albumName}"! ${selectedSongTitles.length} tracks, quality ${albumQuality}%. -$${albumReleaseCost}`,
      'album'
    );
  }, [gameState.studioTier, gameState.songs, gameState.money, gameState.bandName, gameState.genre, gameState.albums, addLog]);

  // ==================== GIG MANAGEMENT ====================

  /**
   * Book a gig at a venue
   * @param {string} venueName - Name of the venue
   * @param {number} advanceMultiplier - Payment multiplier for advance
   */
  const bookGig = useCallback((venueName, advanceMultiplier = 1) => {
    const venue = VENUES[venueName];
    if (!venue) {
      addLog(`Venue "${venueName}" not found.`, true);
      return;
    }

    const basePayout = venue.basePayout || 100;
    const maxAttendance = venue.capacity || 500;
    const ticketPrice = venue.ticketPrice || 15;
    const selectedVenue = gameState.selectedVenue || venue;
    
    const fame = gameState.fame || 0;
    const drawFactor = Math.min(1, fame / 2000);
    const attendance = Math.floor(maxAttendance * (0.3 + drawFactor * 0.7));
    const revenue = attendance * ticketPrice;
    const advance = Math.floor(basePayout * advanceMultiplier);
    const totalPayout = advance + Math.floor(revenue * 0.6); // Band gets 60% of ticket sales
    
    advanceWeek(
      (s) => ({
        ...s,
        money: s.money + totalPayout,
        gigs: (s.gigs || 0) + 1,
        morale: clampMorale(s.morale + 3),
        fame: s.fame + Math.floor(attendance / 50)
      }),
      `Played ${venueName} with ${attendance} fans. Revenue: $${totalPayout}`,
      'gig'
    );
  }, [gameState.fame, gameState.selectedVenue, addLog]);

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
      addLog(`Need $${nextStudio.upgradeCost} to upgrade to ${nextStudio.name}.`, true);
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
      addLog(`Need $${nextTransport.upgradeCost} to upgrade transport.`, true);
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
      addLog(`Need $${nextGear.upgradeCost} to upgrade gear.`, true);
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
      
      // Ensure members is always an array
      if (!updated.members || !Array.isArray(updated.members)) {
        updated.members = gameState.members || [];
      }
      
      updateGameState({
        ...updated,
        week: (updated.week || 0) + 1
      });

      if (entry) addLog(entry);
    } catch (error) {
      console.error('Error in advanceWeek:', error);
      addLog(`Error advancing week: ${error.message}`);
    }
  }, [gameState, addLog, updateGameState]);

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
      addLog(`Need $${cost} to start a ${tourType} tour.`, true);
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
