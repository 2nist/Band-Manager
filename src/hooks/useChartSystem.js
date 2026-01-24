import { useMemo } from 'react';
import { ensureRivalHasAlbum } from '../utils/rivalAlbumGenerator';

/**
 * useChartSystem Hook
 * 
 * Calculates and manages all chart rankings:
 * - Top 20 Artist Chart (ranked by fame)
 * - Top 20 Album Chart (ranked by chartScore)
 * - Top 30 Song Chart (ranked by chartScore)
 * 
 * Combines player data with rival data for competitive charts.
 * Automatically generates albums for rivals if needed to populate charts.
 * 
 * @param {Object} gameState - Current game state
 * @param {Array} rivalBands - Array of rival band objects from gameState.rivalBands
 * @param {Object} rivalSongs - Object mapping rival IDs to their songs (from gameState.rivalSongs)
 * @returns {Object} Chart data: { chartLeaders, albumChart, songChart }
 */
export const useChartSystem = (gameState = {}, rivalBands = [], rivalSongs = {}) => {
  // Debug: Log inputs (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('[Chart System] Inputs:', {
      hasGameState: !!gameState,
      bandName: gameState?.bandName,
      fame: gameState?.fame,
      songsCount: gameState?.songs?.length || 0,
      albumsCount: gameState?.albums?.length || 0,
      rivalBandsCount: rivalBands?.length || 0,
      rivalSongsCount: Object.keys(rivalSongs || {}).length
    });
  }
  
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
   * Generate default rival bands if we don't have enough for charts
   * These are auto-populated to ensure charts are always full
   */
  const generateDefaultRivals = useMemo(() => {
    const defaultRivals = [
      { id: 'auto-neon-nights', name: 'Neon Nights', genre: 'Synth-Pop', prestige: 800, fame: 800 },
      { id: 'auto-chrome-echo', name: 'Chrome Echo', genre: 'Electro', prestige: 750, fame: 750 },
      { id: 'auto-velvet-storm', name: 'Velvet Storm', genre: 'Alternative', prestige: 900, fame: 900 },
      { id: 'auto-golden-hour', name: 'Golden Hour', genre: 'Indie Pop', prestige: 700, fame: 700 },
      { id: 'auto-midnight-crew', name: 'Midnight Crew', genre: 'Rock', prestige: 950, fame: 950 },
      { id: 'auto-sonic-wave', name: 'Sonic Wave', genre: 'Electronic', prestige: 850, fame: 850 },
      { id: 'auto-phantom-axis', name: 'Phantom Axis', genre: 'Prog Rock', prestige: 1000, fame: 1000 },
      { id: 'auto-lunar-drift', name: 'Lunar Drift', genre: 'Ambient', prestige: 600, fame: 600 },
      { id: 'auto-cosmic-static', name: 'Cosmic Static', genre: 'Experimental', prestige: 750, fame: 750 },
      { id: 'auto-titan-force', name: 'Titan Force', genre: 'Hard Rock', prestige: 1100, fame: 1100 },
      { id: 'auto-crimson-tide', name: 'Crimson Tide', genre: 'Metal', prestige: 920, fame: 920 },
      { id: 'auto-azure-dreams', name: 'Azure Dreams', genre: 'Dream Pop', prestige: 680, fame: 680 },
      { id: 'auto-shadow-pulse', name: 'Shadow Pulse', genre: 'Dark Wave', prestige: 880, fame: 880 },
      { id: 'auto-solar-flare', name: 'Solar Flare', genre: 'Psychedelic', prestige: 720, fame: 720 },
      { id: 'auto-nebula-core', name: 'Nebula Core', genre: 'Space Rock', prestige: 780, fame: 780 },
      { id: 'auto-void-walker', name: 'Void Walker', genre: 'Industrial', prestige: 860, fame: 860 },
      { id: 'auto-stellar-drift', name: 'Stellar Drift', genre: 'Shoegaze', prestige: 640, fame: 640 },
      { id: 'auto-echo-chamber', name: 'Echo Chamber', genre: 'Post-Rock', prestige: 740, fame: 740 },
      { id: 'auto-neon-glow', name: 'Neon Glow', genre: 'Synthwave', prestige: 690, fame: 690 },
      { id: 'auto-midnight-sonata', name: 'Midnight Sonata', genre: 'Classical Rock', prestige: 810, fame: 810 }
    ];

    // Only add defaults if we have fewer than 20 bands total
    const existingIds = new Set((rivalBands || []).map(r => r.id));
    const playerFame = gameState?.fame || 0;
    
    // Filter defaults that aren't already in rivalBands and are within reasonable range
    const needed = 20 - (rivalBands?.length || 0) - (gameState?.bandName ? 1 : 0);
    
    // Always generate at least 19 defaults if no player band (to fill top 20)
    // If player has band, generate enough to fill remaining slots
    const minNeeded = gameState?.bandName ? Math.max(needed, 0) : Math.max(needed, 19);
    
    if (minNeeded <= 0) return [];
    
    // Filter out existing rivals
    const availableDefaults = defaultRivals.filter(r => !existingIds.has(r.id));
    
    if (availableDefaults.length === 0) {
      // If all defaults are already in rivalBands, return empty (charts will use existing rivals)
      return [];
    }
    
    // Filter by fame range if player has fame
    let filtered = availableDefaults;
    if (playerFame > 0) {
      filtered = availableDefaults.filter(r => {
        // Include if within reasonable range
        return Math.abs(r.prestige - playerFame) <= Math.max(500, playerFame * 2);
      });
    }
    // If playerFame is 0, include all available defaults
    
    // Use filtered if we have enough, otherwise use all available
    const toUse = filtered.length >= minNeeded ? filtered : availableDefaults;
    
    // Take what we need
    const result = toUse.slice(0, minNeeded);
    
    if (process.env.NODE_ENV === 'development' && result.length > 0) {
      console.log('[Chart System] Generated', result.length, 'default rivals (needed:', minNeeded, ', available:', availableDefaults.length, ', filtered:', filtered.length, ')');
    }
    
    return result.map(r => ({
      ...r,
      albums: ensureRivalHasAlbum(r, [], gameState?.week || 0),
      songs: [] // Songs will come from rivalSongs object
    }));
  }, [rivalBands, gameState?.fame, gameState?.bandName, gameState?.week]);

  /**
   * Top 20 Artist Chart - Ranked by fame
   * Shows player band position vs rivals
   * Auto-populates with default rivals if needed to fill top 20
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
    
    // Combine existing rivals with auto-generated defaults
    const allRivals = [...(rivalBands || []), ...generateDefaultRivals];
    
    // Convert rivalBands to chart format
    // Rivals may have fame or prestige property
    const formattedRivals = allRivals.map(rival => {
      // Get songs for this rival from rivalSongs object
      const rivalSong = rivalSongs[rival.id];
      const songs = rivalSong ? [rivalSong] : (rival.songs || []);
      
      // Ensure rival has albums
      const albums = rival.albums || ensureRivalHasAlbum(rival, songs, gameState?.week || 0);
      
      return {
        name: rival.name,
        fame: rival.fame || rival.prestige || 0,
        isPlayer: false,
        songs: songs,
        albums: albums,
        totalStreams: calculateTotalStreams({
          songs: songs,
          albums: albums
        }),
        genre: rival.genre,
        id: rival.id
      };
    });
    
    // Combine player and rivals
    const pool = playerBand ? [...formattedRivals, playerBand] : [...formattedRivals];
    
    // Sort by fame (descending)
    const sortedPool = [...pool];
    sortedPool.sort((a, b) => (b.fame || 0) - (a.fame || 0));
    
    // Take top 20 and add position numbers
    let result = sortedPool.slice(0, 20).map((b, idx) => ({ ...b, position: idx + 1 }));
    
    // Fallback: If we have no data, generate at least 20 placeholder artists
    if (result.length === 0 && generateDefaultRivals.length > 0) {
      result = generateDefaultRivals.slice(0, 20).map((r, idx) => ({
        name: r.name,
        fame: r.fame || r.prestige || 0,
        isPlayer: false,
        songs: [],
        albums: r.albums || [],
        totalStreams: 0,
        genre: r.genre,
        id: r.id,
        position: idx + 1
      }));
    }
    
    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      if (result.length === 0) {
        console.warn('[Chart System] chartLeaders is empty!', {
          playerBand: !!playerBand,
          rivalBandsCount: rivalBands?.length || 0,
          defaultRivalsCount: generateDefaultRivals?.length || 0,
          allRivalsCount: allRivals?.length || 0,
          formattedRivalsCount: formattedRivals?.length || 0,
          poolCount: pool?.length || 0
        });
      } else {
        console.log('[Chart System] chartLeaders generated:', result.length, 'artists');
      }
    }
    
    return result;
  }, [gameState?.bandName, gameState?.fame, gameState?.songs, gameState?.albums, gameState?.week, rivalBands, rivalSongs, generateDefaultRivals]);

  /**
   * Top 20 Album Chart - Ranked by chartScore
   * Combines player albums + rival albums
   * Auto-generates albums for rivals if needed
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
    
    // Combine existing rivals with auto-generated defaults
    const allRivals = [...(rivalBands || []), ...generateDefaultRivals];
    
    // Generate albums for all rivals (including defaults)
    const rivalAlbums = allRivals.flatMap(r => {
      // Get songs for this rival
      const rivalSong = rivalSongs[r.id];
      const songs = rivalSong ? [rivalSong] : (r.songs || []);
      
      // Ensure rival has albums (will generate if needed)
      const albums = r.albums || ensureRivalHasAlbum(r, songs, gameState?.week || 0);
      
      return albums.map(a => ({
        ...a,
        bandName: r.name,
        isPlayer: false,
        chartScore: calculateAlbumChartScore(a),
        totalStreams: calculateAlbumStreams(a),
        genre: r.genre || a.genre
      }));
    });
    
    // Combine and sort by chartScore
    const allAlbums = [...playerAlbums, ...rivalAlbums];
    const sortedAlbums = [...allAlbums];
    sortedAlbums.sort((a, b) => (b.chartScore || 0) - (a.chartScore || 0));
    
    // Take top 20 and add position numbers
    const result = sortedAlbums.slice(0, 20).map((a, idx) => ({ ...a, position: idx + 1 }));
    
    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      if (result.length === 0) {
        console.warn('[Chart System] albumChart is empty!', {
          playerAlbumsCount: playerAlbums?.length || 0,
          rivalAlbumsCount: rivalAlbums?.length || 0,
          allAlbumsCount: allAlbums?.length || 0
        });
      } else {
        console.log('[Chart System] albumChart generated:', result.length, 'albums');
      }
    }
    
    return result;
  }, [gameState?.albums, gameState?.bandName, gameState?.week, rivalBands, rivalSongs, generateDefaultRivals]);

  /**
   * Generate placeholder songs for rivals that don't have songs yet
   * This ensures charts are always populated
   */
  const generatePlaceholderSongs = useMemo(() => {
    const allRivals = [...(rivalBands || []), ...generateDefaultRivals];
    const placeholderSongs = [];
    
    allRivals.forEach(rival => {
      // Skip if rival already has a song in rivalSongs
      if (rivalSongs[rival.id]) return;
      
      // Skip if rival has songs array
      if (rival.songs && rival.songs.length > 0) return;
      
      // Generate placeholder song
      const prestige = rival.prestige || rival.fame || 50;
      const baseQuality = Math.min(100, 40 + (prestige / 10));
      const basePopularity = Math.min(100, 35 + (prestige / 12));
      const weeklyStreams = Math.floor(basePopularity * 10);
      
      const songTitles = {
        'Synth-Pop': ['Electric Dreams', 'Neon Nights', 'Digital Love', 'Cyber Romance'],
        'Electro': ['Pulse', 'Circuit Breaker', 'Digital Storm', 'Electric Shock'],
        'Alternative': ['Breaking Free', 'Edge of Reality', 'Lost in Sound', 'Raw Emotion'],
        'Indie Pop': ['Summer Breeze', 'Golden Hour', 'Soft Glow', 'Gentle Rain'],
        'Rock': ['Thunder Road', 'Rebel Heart', 'Wild Nights', 'Power Drive'],
        'Electronic': ['Synthetic Wave', 'Digital Pulse', 'Electric Flow', 'Tech Dreams'],
        'Prog Rock': ['Epic Journey', 'Complex Minds', 'Time Signatures', 'Musical Odyssey'],
        'Ambient': ['Floating', 'Ethereal', 'Dream State', 'Peaceful Drift'],
        'Experimental': ['Chaos Theory', 'Abstract Forms', 'Unconventional', 'Avant-Garde'],
        'Hard Rock': ['Iron Will', 'Heavy Metal', 'Power Chord', 'Rock Anthem']
      };
      
      const titles = songTitles[rival.genre] || songTitles['Rock'];
      const title = titles[Math.floor(Math.random() * titles.length)];
      
      placeholderSongs.push({
        id: `placeholder-${rival.id}`,
        title: `${rival.name} - ${title}`,
        bandName: rival.name,
        bandId: rival.id,
        isPlayer: false,
        genre: rival.genre,
        popularity: basePopularity,
        quality: baseQuality,
        weeklyStreams: weeklyStreams,
        totalStreams: weeklyStreams * (Math.floor(Math.random() * 10) + 1), // 1-10 weeks old
        chartScore: calculateSongChartScore({
          popularity: basePopularity,
          weeklyStreams: weeklyStreams
        }),
        age: Math.floor(Math.random() * 10),
        isPlaceholder: true
      });
    });
    
    return placeholderSongs;
  }, [rivalBands, rivalSongs, generateDefaultRivals]);

  /**
   * Top 30 Song Chart - Ranked by chartScore
   * Combines player songs + rival songs
   * Auto-generates placeholder songs for rivals if needed
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
    
    // Combine existing rivals with auto-generated defaults
    const allRivals = [...(rivalBands || []), ...generateDefaultRivals];
    
    // Rival songs from rivalBands.songs array
    const rivalSongsFromBands = allRivals.flatMap(r => {
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
    
    // Rival songs from rivalSongs object (from useRadioChartingSystem)
    const rivalSongsFromObject = Object.entries(rivalSongs || {}).flatMap(([rivalId, song]) => {
      // Find the rival band to get name
      const rival = allRivals.find(r => r.id === rivalId);
      if (!rival || !song) return [];
      
      // Convert procedural song format to chart format
      // Extract title from various possible locations
      let songTitle = 'Untitled';
      if (song.title) {
        songTitle = song.title;
      } else if (song.metadata?.name) {
        songTitle = song.metadata.name;
      } else if (song.metadata?.title) {
        songTitle = song.metadata.title;
      } else if (typeof song === 'string') {
        songTitle = song;
      } else if (song.name) {
        songTitle = song.name;
      }
      
      // If title includes band name, extract just the song part
      if (songTitle.includes(' - ')) {
        const parts = songTitle.split(' - ');
        songTitle = parts.length > 1 ? parts[1] : parts[0];
      }
      
      const chartSong = {
        id: song.id || `rival-${rivalId}-${Date.now()}`,
        title: songTitle,
        bandName: rival.name,
        isPlayer: false,
        genre: rival.genre || song.genre || song.metadata?.genre || 'Rock',
        // Map procedural song analysis to chart metrics
        popularity: song.analysis?.commercialViability || song.popularity || 50,
        quality: song.analysis?.qualityScore || song.quality || 50,
        weeklyStreams: song.analysis?.commercialViability 
          ? song.analysis.commercialViability * 10 
          : (song.weeklyStreams || song.totalStreams || 500),
        chartScore: calculateSongChartScore({
          popularity: song.analysis?.commercialViability || song.popularity || 50,
          weeklyStreams: song.analysis?.commercialViability 
            ? song.analysis.commercialViability * 10 
            : (song.weeklyStreams || song.totalStreams || 500)
        }),
        age: song.age || song.metadata?.age || 0,
        // Store original song data
        generatedSong: song
      };
      
      return [chartSong];
    });
    
    // Combine all songs (player + rivals from bands + rivals from object + placeholders)
    const allSongs = [
      ...playerSongs, 
      ...rivalSongsFromBands, 
      ...rivalSongsFromObject,
      ...generatePlaceholderSongs
    ];
    
    // Sort by chartScore (descending)
    const sortedSongs = [...allSongs];
    sortedSongs.sort((a, b) => (b.chartScore || 0) - (a.chartScore || 0));
    
    // Take top 30 and add position numbers
    let result = sortedSongs.slice(0, 30).map((s, idx) => ({ ...s, position: idx + 1 }));
    
    // Fallback: If we have no songs, use placeholder songs
    if (result.length === 0 && generatePlaceholderSongs.length > 0) {
      const sortedPlaceholders = [...generatePlaceholderSongs];
      sortedPlaceholders.sort((a, b) => (b.chartScore || 0) - (a.chartScore || 0));
      result = sortedPlaceholders.slice(0, 30).map((s, idx) => ({ ...s, position: idx + 1 }));
    }
    
    // Debug logging (only in development)
    if (process.env.NODE_ENV === 'development') {
      if (result.length === 0) {
        console.warn('[Chart System] songChart is empty!', {
          playerSongsCount: playerSongs?.length || 0,
          rivalSongsFromBandsCount: rivalSongsFromBands?.length || 0,
          rivalSongsFromObjectCount: rivalSongsFromObject?.length || 0,
          placeholderSongsCount: generatePlaceholderSongs?.length || 0,
          allSongsCount: allSongs?.length || 0
        });
      } else {
        console.log('[Chart System] songChart generated:', result.length, 'songs');
      }
    }
    
    return result;
  }, [gameState?.songs, gameState?.bandName, rivalBands, rivalSongs, generateDefaultRivals, generatePlaceholderSongs]);

  return {
    chartLeaders,
    albumChart,
    songChart
  };
};

export default useChartSystem;
