import { useMemo } from 'react';

/**
 * useChartSystem Hook
 * 
 * Calculates and manages all chart rankings:
 * - Top 20 Artist Chart (ranked by fame)
 * - Top 20 Album Chart (ranked by chartScore)
 * - Top 30 Song Chart (ranked by chartScore)
 * 
 * Combines player data with rival data for competitive charts.
 * 
 * @param {Object} gameState - Current game state
 * @param {Array} rivalBands - Array of rival band objects from gameState.rivalBands
 * @param {Object} rivalSongs - Object mapping rival IDs to their songs (from gameState.rivalSongs)
 * @returns {Object} Chart data: { chartLeaders, albumChart, songChart }
 */
export const useChartSystem = (gameState = {}, rivalBands = [], rivalSongs = {}) => {
  
  /**
   * Calculate total streams for a band
   */
  const calculateTotalStreams = (bandData) => {
    const songStreams = (bandData.songs || []).reduce((sum, s) => 
      sum + (s.weeklyStreams || s.totalStreams || 0), 0
    );
    const albumStreams = (bandData.albums || []).reduce((sum, a) => 
      sum + calculateAlbumStreams(a), 0
    );
    return songStreams + albumStreams;
  };

  /**
   * Calculate album chart score
   */
  const calculateAlbumChartScore = (album) => {
    if (album.chartScore !== undefined) {
      return album.chartScore;
    }
    return Math.max(0, Math.floor((album.quality || 0) * 0.8 + (album.popularity || 0) * 0.3));
  };

  /**
   * Calculate album streams per week
   */
  const calculateAlbumStreams = (album) => {
    const baseStreams = Math.floor((album.quality || 0) * 150 + (album.popularity || 0) * 80);
    const ageMultiplier = Math.max(0.3, 1 - (album.age || 0) * 0.02);
    return Math.floor(baseStreams * ageMultiplier);
  };

  /**
   * Calculate song chart score
   */
  const calculateSongChartScore = (song) => {
    // Use existing chartScore if available, otherwise calculate
    if (song.chartScore !== undefined) {
      return song.chartScore;
    }
    // Original formula: popularity * 10 + weeklyStreams * 0.1
    return (song.popularity || 0) * 10 + (song.weeklyStreams || 0) * 0.1;
  };

  /**
   * Top 20 Artist Chart - Ranked by fame
   * Shows player band position vs rivals
   */
  const chartLeaders = useMemo(() => {
    const playerBand = gameState?.bandName
      ? {
          name: gameState.bandName,
          fame: gameState.fame || 0,
          isPlayer: true,
          songs: gameState.songs || [],
          albums: gameState.albums || [],
          totalStreams: calculateTotalStreams({
            songs: gameState.songs || [],
            albums: gameState.albums || []
          })
        }
      : null;
    
    // Convert rivalBands to chart format
    // Rivals may have fame or prestige property
    const formattedRivals = (rivalBands || []).map(rival => ({
      name: rival.name,
      fame: rival.fame || rival.prestige || 0,
      isPlayer: false,
      songs: rival.songs || [],
      albums: rival.albums || [],
      totalStreams: calculateTotalStreams({
        songs: rival.songs || [],
        albums: rival.albums || []
      }),
      genre: rival.genre,
      id: rival.id
    }));
    
    // Combine player and rivals
    const pool = playerBand ? [...formattedRivals, playerBand] : [...formattedRivals];
    
    // Sort by fame (descending)
    const sorted = [...pool].sort((a, b) => (b.fame || 0) - (a.fame || 0));
    
    // Take top 20 and add position numbers
    const result = sorted.slice(0, 20).map((b, idx) => ({ ...b, position: idx + 1 }));
    
    return result;
  }, [gameState?.bandName, gameState?.fame, gameState?.songs, gameState?.albums, rivalBands]);

  /**
   * Top 20 Album Chart - Ranked by chartScore
   * Combines player albums + rival albums
   */
  const albumChart = useMemo(() => {
    // Player albums
    const playerAlbums = (Array.isArray(gameState?.albums) ? gameState.albums : []).map((a) => ({
      ...a,
      bandName: gameState?.bandName || 'Your Band',
      isPlayer: true,
      chartScore: calculateAlbumChartScore(a),
      totalStreams: calculateAlbumStreams(a)
    }));
    
    // Rival albums
    // Note: Rivals may not have albums yet - we'll handle that gracefully
    const rivalAlbums = (rivalBands || []).flatMap(r => {
      const albums = r.albums || [];
      return albums.map(a => ({
        ...a,
        bandName: r.name,
        isPlayer: false,
        chartScore: calculateAlbumChartScore(a),
        totalStreams: calculateAlbumStreams(a),
        genre: r.genre
      }));
    });
    
    // Combine and sort by chartScore
    const allAlbums = [...playerAlbums, ...rivalAlbums];
    const sorted = allAlbums.sort((a, b) => (b.chartScore || 0) - (a.chartScore || 0));
    
    // Take top 20 and add position numbers
    const result = sorted.slice(0, 20).map((a, idx) => ({ ...a, position: idx + 1 }));
    
    return result;
  }, [gameState?.albums, gameState?.bandName, rivalBands]);

  /**
   * Top 30 Song Chart - Ranked by chartScore
   * Combines player songs + rival songs
   */
  const songChart = useMemo(() => {
    // Player songs
    const playerSongs = (Array.isArray(gameState?.songs) ? gameState.songs : []).map(s => ({
      ...s,
      bandName: gameState?.bandName || 'Your Band',
      isPlayer: true,
      chartScore: calculateSongChartScore(s),
      // Ensure title property exists (may be name in some formats)
      title: s.title || s.name || 'Untitled'
    }));
    
    // Rival songs
    // Check both rivalBands.songs and rivalSongs object
    const rivalSongsFromBands = (rivalBands || []).flatMap(r => {
      const songs = r.songs || [];
      return songs.map(s => ({
        ...s,
        bandName: r.name,
        isPlayer: false,
        chartScore: calculateSongChartScore(s),
        title: s.title || s.name || 'Untitled',
        genre: r.genre
      }));
    });
    
    // Also check rivalSongs object (from useRadioChartingSystem)
    const rivalSongsFromObject = Object.entries(rivalSongs || {}).flatMap(([rivalId, song]) => {
      // Find the rival band to get name
      const rival = (rivalBands || []).find(r => r.id === rivalId);
      if (!rival || !song) return [];
      
      // Convert procedural song format to chart format
      const chartSong = {
        id: song.id || `rival-${rivalId}-${Date.now()}`,
        title: song.title || song.metadata?.name || 'Untitled',
        bandName: rival.name,
        isPlayer: false,
        genre: rival.genre || song.genre || 'Rock',
        // Map procedural song analysis to chart metrics
        popularity: song.analysis?.commercialViability || 50,
        quality: song.analysis?.qualityScore || 50,
        weeklyStreams: song.analysis?.commercialViability ? song.analysis.commercialViability * 10 : 500,
        chartScore: calculateSongChartScore({
          popularity: song.analysis?.commercialViability || 50,
          weeklyStreams: song.analysis?.commercialViability ? song.analysis.commercialViability * 10 : 500
        }),
        age: 0,
        // Store original song data
        generatedSong: song
      };
      
      return [chartSong];
    });
    
    // Combine all songs
    const allSongs = [...playerSongs, ...rivalSongsFromBands, ...rivalSongsFromObject];
    
    // Sort by chartScore (descending)
    const sorted = allSongs.sort((a, b) => (b.chartScore || 0) - (a.chartScore || 0));
    
    // Take top 30 and add position numbers
    const result = sorted.slice(0, 30).map((s, idx) => ({ ...s, position: idx + 1 }));
    
    return result;
  }, [gameState?.songs, gameState?.bandName, rivalBands, rivalSongs]);

  return {
    chartLeaders,
    albumChart,
    songChart
  };
};

export default useChartSystem;
