/**
 * rivalAlbumGenerator - Generate albums for rival bands
 * 
 * Automatically generates albums for rival bands to populate charts.
 * Creates albums from their generated songs.
 */

/**
 * Generate an album for a rival band
 * @param {Object} rivalBand - Rival band data
 * @param {Array} rivalSongs - Array of songs for this rival (from rivalSongs object or generated)
 * @param {Object} options - Generation options
 * @returns {Object} Generated album
 */
export function generateRivalAlbum(rivalBand, rivalSongs = [], options = {}) {
  const {
    week = 0,
    minSongs = 8,
    maxSongs = 12
  } = options;

  // Need at least minSongs to create an album
  if (!rivalSongs || rivalSongs.length < minSongs) {
    return null;
  }

  // Select songs for album (8-12 songs)
  const songsForAlbum = rivalSongs.slice(0, Math.min(maxSongs, rivalSongs.length));
  
  // Calculate album metrics from songs
  const avgQuality = songsForAlbum.reduce((sum, s) => {
    const quality = s.analysis?.qualityScore || s.quality || 50;
    return sum + quality;
  }, 0) / songsForAlbum.length;

  const avgPopularity = songsForAlbum.reduce((sum, s) => {
    const pop = s.analysis?.commercialViability || s.popularity || 50;
    return sum + pop;
  }, 0) / songsForAlbum.length;

  // Generate album name
  const albumNames = [
    `${rivalBand.name} - Self-Titled`,
    `${rivalBand.name} - ${['Midnight', 'Dawn', 'Electric', 'Sonic', 'Eternal'][Math.floor(Math.random() * 5)]}`,
    `The ${rivalBand.genre} Sessions`,
    `${rivalBand.name} Vol. ${Math.floor(Math.random() * 3) + 1}`,
    `${['Rising', 'Falling', 'Breaking', 'Burning'][Math.floor(Math.random() * 4)]} ${rivalBand.genre}`
  ];
  const albumName = albumNames[Math.floor(Math.random() * albumNames.length)];

  // Calculate chart score
  const chartScore = Math.floor(avgQuality * 0.8 + avgPopularity * 0.3);
  const totalStreams = Math.floor(avgPopularity * 500);

  return {
    id: `rival-album-${rivalBand.id}-${week}-${Date.now()}`,
    name: albumName,
    bandName: rivalBand.name,
    bandId: rivalBand.id,
    songIds: songsForAlbum.map(s => s.id || s.metadata?.name || 'unknown'),
    songCount: songsForAlbum.length,
    releasedWeek: week,
    quality: Math.floor(avgQuality),
    popularity: Math.floor(avgPopularity),
    chartScore,
    totalStreams,
    weeklyStreams: totalStreams,
    age: 0,
    genre: rivalBand.genre,
    isRivalAlbum: true
  };
}

/**
 * Generate albums for multiple rival bands
 * @param {Array} rivalBands - Array of rival bands
 * @param {Object} rivalSongsMap - Object mapping rival IDs to their songs
 * @param {Object} options - Generation options
 * @returns {Array} Array of generated albums
 */
export function generateRivalAlbumsForCharts(rivalBands = [], rivalSongsMap = {}, options = {}) {
  const { week = 0 } = options;
  const albums = [];

  rivalBands.forEach(rival => {
    // Get songs for this rival
    const rivalSong = rivalSongsMap[rival.id];
    const songs = rivalSong ? [rivalSong] : (rival.songs || []);
    
    // If we have enough songs, create an album
    if (songs.length >= 8) {
      const album = generateRivalAlbum(rival, songs, { week });
      if (album) {
        albums.push(album);
      }
    } else if (songs.length > 0) {
      // If we have some songs but not enough, create a smaller album or EP
      const album = generateRivalAlbum(rival, songs, { week, minSongs: 3, maxSongs: 7 });
      if (album) {
        album.name = `${album.name} (EP)`;
        albums.push(album);
      }
    }
  });

  return albums;
}

/**
 * Ensure a rival band has at least one album for charts
 * Creates album from their existing songs or generates placeholder
 */
export function ensureRivalHasAlbum(rival, rivalSongs = [], week = 0) {
  // Check if rival already has albums
  if (rival.albums && rival.albums.length > 0) {
    return rival.albums;
  }

  // Try to create album from existing songs
  if (rivalSongs.length >= 3) {
    const album = generateRivalAlbum(rival, rivalSongs, { week, minSongs: 3 });
    if (album) {
      return [album];
    }
  }

  // Create a placeholder album if no songs available
  const prestige = rival.prestige || rival.fame || 50;
  const baseQuality = Math.min(100, 40 + (prestige / 10));
  const basePopularity = Math.min(100, 35 + (prestige / 12));

  return [{
    id: `rival-album-${rival.id}-placeholder`,
    name: `${rival.name} - ${rival.genre} Collection`,
    bandName: rival.name,
    bandId: rival.id,
    songIds: [],
    songCount: 0,
    releasedWeek: week - Math.floor(Math.random() * 20), // Released in the past
    quality: baseQuality,
    popularity: basePopularity,
    chartScore: Math.floor(baseQuality * 0.8 + basePopularity * 0.3),
    totalStreams: Math.floor(basePopularity * 400),
    weeklyStreams: Math.floor(basePopularity * 50),
    age: Math.floor(Math.random() * 20),
    genre: rival.genre,
    isRivalAlbum: true,
    isPlaceholder: true
  }];
}
