import { useCallback } from 'react';
import { STUDIO_TIERS } from '../utils/constants';
import { randomFrom, clampMorale } from '../utils/helpers';

/**
 * useRecordingSystem - Comprehensive music recording and streaming revenue system
 * 
 * Handles:
 * - Writing/Recording individual songs with quality system
 * - Building and releasing albums
 * - Streaming revenue generation
 * - Chart performance and popularity mechanics
 * - Song freshness decay
 * - Album promotion and marketing
 * - Video releases for hit songs
 * 
 * Integrates with useGameLogic and Phase 2 consequence system
 */
export function useRecordingSystem(gameState, updateGameState, addLog) {
  
  // ==================== SONG RECORDING ====================

  /**
   * Record a new song with full mechanics
   * @param {Object} songData - Song creation parameters
   * @param {string} songData.title - Song title
   * @param {string} songData.genre - Song genre
   * @param {number} songData.energy - Energy level 1-10
   * @param {number} songData.quality - Base quality setting
   * @param {Array<string>} songData.themes - Song themes/topics
   */
  const recordSong = useCallback((songData = {}) => {
    const studio = STUDIO_TIERS[gameState.studioTier || 0];
    if (!studio) {
      addLog('No studio available for recording.');
      return { success: false, reason: 'no_studio' };
    }

    const difficulty = gameState.difficulty || 'normal';
    const costMultiplier = difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.2 : 1;
    const recordingCost = Math.floor(studio.recordCost * costMultiplier);

    if (gameState.money < recordingCost) {
      addLog(`Insufficient funds to record song. Need $${recordingCost}, have $${gameState.money}.`, 'warning');
      return { success: false, reason: 'insufficient_funds', cost: recordingCost };
    }

    // Validate song data
    const title = songData.title?.trim() || 'Untitled Track';
    
    // Check for duplicate titles
    if (gameState.songs && gameState.songs.find(s => s.title === title)) {
      addLog(`Song "${title}" already exists. Choose a different name.`, 'warning');
      return { success: false, reason: 'duplicate_title' };
    }

    // Calculate quality based on studio tier and input
    const studioQualityBonus = studio.qualityBonus || 8;
    const baseQuality = 55 + Math.random() * 25; // 55-80 base
    const userQualityInput = Math.min(10, Math.max(1, songData.quality || 5));
    const qualityMultiplier = userQualityInput / 10; // 0.1 to 1.0
    
    const finalQuality = Math.min(100, Math.floor(baseQuality + studioQualityBonus * qualityMultiplier));
    
    // Calculate popularity (based on quality and band fame)
    const basePopularity = Math.floor(finalQuality * 0.65);
    const fameBonus = Math.floor((gameState.fame || 0) * 0.001); // 0.1% of fame as bonus
    const finalPopularity = Math.min(100, basePopularity + fameBonus);

    // Calculate initial streams
    const initialStreams = Math.floor(finalPopularity * 100);
    const streamingRevenue = Math.floor(initialStreams * 0.001); // $0.001 per stream average

    // Create song object
    const newSong = {
      id: `song-${Date.now()}`,
      title,
      genre: songData.genre || 'Pop',
      quality: finalQuality,
      popularity: finalPopularity,
      energy: songData.energy || 5,
      themes: songData.themes || [],
      recordedWeek: gameState.week || 0,
      
      // Streaming metrics
      totalStreams: initialStreams,
      weeklyStreams: initialStreams,
      totalEarnings: streamingRevenue,
      chartPosition: 100, // Start at position 100
      
      // Progression
      age: 0, // Weeks since release
      freshness: 100, // Freshness decay over time
      videoBoost: false, // Whether has music video
      inAlbum: false, // Part of an album
      
      // Performance tracking
      peakPosition: 100,
      peakStreamsPerWeek: initialStreams,
      virality: Math.random() < 0.1 ? true : false // 10% chance to go viral
    };

    // Update game state
    updateGameState({
      money: gameState.money - recordingCost,
      songs: [...(gameState.songs || []), newSong],
      morale: clampMorale((gameState.morale || 70) + 3),
      totalEarnings: (gameState.totalEarnings || 0) + streamingRevenue
    });

    addLog(
      `Recorded "${title}" at ${studio.name}. Quality: ${finalQuality}%, ` +
      `Initial Popularity: ${finalPopularity}%. Est. Revenue: $${streamingRevenue}. -$${recordingCost}`
    );

    return {
      success: true,
      song: newSong,
      cost: recordingCost,
      revenue: streamingRevenue
    };
  }, [gameState.studioTier, gameState.difficulty, gameState.money, gameState.songs, gameState.fame, gameState.week, gameState.morale, updateGameState, addLog]);

  // ==================== ALBUM CREATION ====================

  /**
   * Compile songs into an album
   * @param {Object} albumData - Album creation parameters
   * @param {Array<string>} albumData.songIds - Song IDs to include
   * @param {string} albumData.name - Album name
   * @param {string} albumData.concept - Album concept/theme
   */
  const createAlbum = useCallback((albumData = {}) => {
    const studio = STUDIO_TIERS[gameState.studioTier || 0];
    if (!studio) {
      addLog('No studio available for album creation.');
      return { success: false };
    }

    const songIds = albumData.songIds || [];
    
    // Validate song count
    if (songIds.length < 8) {
      addLog('Albums require at least 8 songs.', 'warning');
      return { success: false, reason: 'insufficient_songs' };
    }
    
    if (songIds.length > 12) {
      addLog('Albums can contain maximum 12 songs.', 'warning');
      return { success: false, reason: 'too_many_songs' };
    }

    // Get song data and validate
    const selectedSongs = gameState.songs.filter(s => songIds.includes(s.id) || songIds.includes(s.title));
    
    if (selectedSongs.length !== songIds.length) {
      addLog('One or more selected songs not found.', 'warning');
      return { success: false, reason: 'songs_not_found' };
    }

    // Check songs aren't already in albums
    if (selectedSongs.some(s => s.inAlbum)) {
      addLog('Cannot include songs already in another album.', 'warning');
      return { success: false, reason: 'songs_in_album' };
    }

    // Calculate album quality/popularity from songs
    const avgQuality = selectedSongs.reduce((sum, s) => sum + (s.quality || 0), 0) / selectedSongs.length;
    const studioBonus = studio.qualityBonus * 1.5;
    const albumQuality = Math.min(100, Math.floor(avgQuality + studioBonus));

    const avgPopularity = selectedSongs.reduce((sum, s) => sum + (s.popularity || 0), 0) / selectedSongs.length;
    const albumPopularity = Math.min(100, Math.floor(avgPopularity * 1.2 + (studio.popBonus || 0) * 2));

    // Calculate release cost
    const baseCost = studio.recordCost * selectedSongs.length * 0.8; // Mastering + mixing
    const marketingCost = Math.floor(baseCost * 0.5); // Marketing budget
    const releaseCost = Math.floor(baseCost + marketingCost);

    if (gameState.money < releaseCost) {
      addLog(`Need $${releaseCost} to release album.`, 'warning');
      return { success: false, reason: 'insufficient_funds', cost: releaseCost };
    }

    // Generate album name if not provided
    let albumName = albumData.name?.trim();
    
    if (!albumName) {
      const nameOptions = [
        `${gameState.bandName || 'Band'} - Self-Titled`,
        `${gameState.bandName || 'Band'} Vol. ${(gameState.albums?.length || 0) + 1}`,
        selectedSongs[0].title, // Use first song title
        `${['Midnight', 'Dawn', 'Twilight', 'Sunset', 'Rising'][Math.floor(Math.random() * 5)]} Sessions`,
        `The ${['Great', 'Lost', 'Electric', 'Sonic'][Math.floor(Math.random() * 4)]} Album`
      ];
      albumName = randomFrom(nameOptions);
    }

    // Check for duplicate album names
    if (gameState.albums && gameState.albums.find(a => a.name === albumName)) {
      albumName = `${albumName} (${new Date().getFullYear()})`;
    }

    // Calculate initial streaming from album release
    const albumStreams = Math.floor(albumPopularity * 500);
    const albumRevenue = Math.floor(albumStreams * 0.001);

    // Create album object
    const newAlbum = {
      id: `album-${Date.now()}`,
      name: albumName,
      concept: albumData.concept || '',
      songIds,
      songCount: selectedSongs.length,
      releasedWeek: gameState.week || 0,
      
      // Quality metrics
      quality: albumQuality,
      popularity: albumPopularity,
      
      // Streaming metrics
      totalStreams: albumStreams,
      weeklyStreams: albumStreams,
      totalEarnings: albumRevenue,
      chartPosition: 200,
      
      // Progression
      age: 0,
      freshness: 100,
      promoWeeksRemaining: 12, // 12 weeks of promotion
      
      // Marketing
      hasVideo: false,
      marketingBudget: marketingCost,
      chartPerformance: 'rising' // rising, stable, declining
    };

    // Mark songs as in album
    const updatedSongs = gameState.songs.map(song =>
      songIds.includes(song.id) || songIds.includes(song.title)
        ? { ...song, inAlbum: true }
        : song
    );

    // Update game state
    updateGameState({
      money: gameState.money - releaseCost,
      songs: updatedSongs,
      albums: [...(gameState.albums || []), newAlbum],
      morale: clampMorale((gameState.morale || 70) + 8),
      fame: (gameState.fame || 0) + Math.floor(albumPopularity * 0.2),
      totalEarnings: (gameState.totalEarnings || 0) + albumRevenue
    });

    addLog(
      `Released album "${albumName}" with ${selectedSongs.length} songs! ` +
      `Quality: ${albumQuality}%, Est. Weekly Streams: ${albumStreams.toLocaleString()}. ` +
      `-$${releaseCost}`
    );

    return {
      success: true,
      album: newAlbum,
      cost: releaseCost,
      revenue: albumRevenue,
      initialStreams: albumStreams
    };
  }, [gameState.studioTier, gameState.money, gameState.songs, gameState.albums, gameState.week, gameState.morale, gameState.fame, gameState.bandName, updateGameState, addLog]);

  // ==================== STREAMING REVENUE ====================

  /**
   * Process weekly streaming revenue for all songs and albums
   * Called during week advancement
   */
  const processStreamingRevenue = useCallback(() => {
    const songs = gameState.songs || [];
    const albums = gameState.albums || [];
    
    let totalNewRevenue = 0;
    const updatedSongs = [];
    const updatedAlbums = [];

    // Process individual songs
    songs.forEach(song => {
      const freshness = Math.max(5, 100 - song.age * 3); // Freshness decay
      const baseStreams = song.popularity * 10;
      const ageMultiplier = Math.max(0.1, 1 - song.age * 0.05); // Decline over time
      const viralityBoost = song.virality ? 1.5 : 1;
      
      const weeklyStreams = Math.floor(baseStreams * ageMultiplier * viralityBoost);
      const revenue = Math.floor(weeklyStreams * 0.001);

      // Update chart position based on streams
      const streamPercentage = weeklyStreams / (song.peakStreamsPerWeek || weeklyStreams + 1);
      let newChartPosition = song.chartPosition || 100;
      
      if (streamPercentage > 0.8) {
        newChartPosition = Math.max(1, Math.floor(newChartPosition * 0.95));
      } else if (streamPercentage < 0.3) {
        newChartPosition = Math.min(200, Math.floor(newChartPosition * 1.1));
      }

      totalNewRevenue += revenue;

      updatedSongs.push({
        ...song,
        age: song.age + 1,
        freshness,
        weeklyStreams,
        totalStreams: (song.totalStreams || 0) + weeklyStreams,
        totalEarnings: (song.totalEarnings || 0) + revenue,
        chartPosition: newChartPosition,
        peakPosition: Math.min(song.peakPosition || newChartPosition, newChartPosition),
        peakStreamsPerWeek: Math.max(song.peakStreamsPerWeek || weeklyStreams, weeklyStreams)
      });
    });

    // Process albums
    albums.forEach(album => {
      const promoBoost = album.promoWeeksRemaining > 0 ? 1.3 : 0.8;
      const freshness = Math.max(5, 100 - album.age * 2);
      const baseStreams = album.popularity * 20;
      const ageMultiplier = Math.max(0.2, 1 - album.age * 0.03);
      
      const weeklyStreams = Math.floor(baseStreams * ageMultiplier * promoBoost);
      const revenue = Math.floor(weeklyStreams * 0.001);

      totalNewRevenue += revenue;

      updatedAlbums.push({
        ...album,
        age: album.age + 1,
        freshness,
        weeklyStreams,
        totalStreams: (album.totalStreams || 0) + weeklyStreams,
        totalEarnings: (album.totalEarnings || 0) + revenue,
        promoWeeksRemaining: Math.max(0, album.promoWeeksRemaining - 1),
        chartPerformance: weeklyStreams > (album.peakStreamsPerWeek || 0) ? 'rising' : 'declining'
      });
    });

    // Update game state
    updateGameState({
      songs: updatedSongs,
      albums: updatedAlbums,
      money: (gameState.money || 0) + totalNewRevenue,
      totalEarnings: (gameState.totalEarnings || 0) + totalNewRevenue
    });

    if (totalNewRevenue > 0) {
      addLog(`Streaming revenue: +$${totalNewRevenue.toLocaleString()}`);
    }

    return totalNewRevenue;
  }, [gameState.songs, gameState.albums, gameState.money, gameState.totalEarnings, updateGameState, addLog]);

  // ==================== MUSIC VIDEO ====================

  /**
   * Release a music video for a song to boost streams
   * @param {string} songId - Song ID
   * @param {number} budget - Marketing budget for video
   */
  const releaseVideoForSong = useCallback((songId, budget = 5000) => {
    if (gameState.money < budget) {
      addLog(`Need $${budget} for music video production.`, 'warning');
      return { success: false };
    }

    const song = gameState.songs?.find(s => s.id === songId);
    if (!song) {
      addLog('Song not found.', 'error');
      return { success: false };
    }

    const updatedSongs = gameState.songs.map(s =>
      s.id === songId
        ? {
            ...s,
            videoBoost: true,
            popularity: Math.min(100, s.popularity + 15),
            weeklyStreams: Math.floor(s.weeklyStreams * 1.4)
          }
        : s
    );

    updateGameState({
      songs: updatedSongs,
      money: gameState.money - budget
    });

    addLog(`Released music video for "${song.title}". +15% popularity. -$${budget}`);

    return { success: true, song: song.id };
  }, [gameState.money, gameState.songs, updateGameState, addLog]);

  // Return public API
  return {
    recordSong,
    createAlbum,
    processStreamingRevenue,
    releaseVideoForSong
  };
}

export default useRecordingSystem;
