/**
 * rivalSongGenerator - Generate songs for rival bands and other artists
 * 
 * Automatically generates songs for rival bands using the procedural
 * music generation system, creating unique songs based on each band's
 * characteristics and psychology.
 */

import { MusicGenerator } from '../music/MusicGenerator.js';

/**
 * Generate a song for a rival band or artist
 * @param {Object} bandData - Band/artist data (rival band or custom artist)
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Generated song with band metadata
 */
export async function generateRivalSong(bandData, options = {}) {
  const {
    songName = null,
    genre = null,
    week = 0,
    seed = null
  } = options;

  // Create game state for this band
  const bandGameState = {
    bandName: bandData.name || 'Unknown Artist',
    currentWeek: week || bandData.lastSongWeek || 0,
    week: week || bandData.lastSongWeek || 0,
    fame: bandData.prestige || bandData.fame || 50,
    money: bandData.money || 5000,
    bandMembers: bandData.bandMembers || generateDefaultBandMembers(bandData),
    bandConfidence: bandData.confidence || 60,
    psychState: bandData.psychState || generateBandPsychology(bandData),
    labelDeal: bandData.labelDeal || null,
    fanbase: bandData.fanbase || { primary: 'mixed', size: 1000, loyalty: 50 }
  };

  // Determine genre if not provided
  const songGenre = genre || bandData.genre || 'rock';

  // Generate song name if not provided
  const generatedSongName = songName || generateSongName(bandData, songGenre);

  // Generate seed for reproducibility
  const songSeed = seed || `${bandData.id || bandData.name}-${bandGameState.week}-${songGenre}`;

  try {
    // Generate the song using MusicGenerator
    const song = await MusicGenerator.generateSong(bandGameState, songGenre, {
      seed: songSeed,
      songName: generatedSongName,
      timestamp: Date.now()
    });

    // Add band-specific metadata
    return {
      ...song,
      metadata: {
        ...song.metadata,
        band: bandData.name,
        bandId: bandData.id,
        isRivalSong: true,
        originalBandData: {
          prestige: bandData.prestige,
          genre: bandData.genre,
          rivalryLevel: bandData.rivalryLevel
        }
      }
    };
  } catch (error) {
    console.error(`Failed to generate song for ${bandData.name}:`, error);
    // Return a fallback song structure
    return createFallbackSong(bandData, songGenre, generatedSongName);
  }
}

/**
 * Generate songs for multiple rival bands (for charts)
 * @param {Array} rivalBands - Array of rival band data
 * @param {Object} options - Generation options
 * @returns {Promise<Array>} Array of generated songs
 */
export async function generateRivalSongsForChart(rivalBands, options = {}) {
  const {
    week = 0,
    maxSongs = 20,
    genres = null
  } = options;

  if (!rivalBands || rivalBands.length === 0) {
    return [];
  }

  // Generate songs for each rival (up to maxSongs)
  const bandsToGenerate = rivalBands.slice(0, maxSongs);
  const songs = await Promise.all(
    bandsToGenerate.map(async (band, index) => {
      // Vary genres if not specified
      const genre = genres 
        ? genres[index % genres.length]
        : band.genre || ['rock', 'punk', 'pop', 'metal', 'folk'][index % 5];

      return generateRivalSong(band, {
        week,
        genre,
        seed: `${band.id}-chart-${week}-${index}`
      });
    })
  );

  return songs.filter(song => song !== null);
}

/**
 * Generate default band members for a rival band
 */
function generateDefaultBandMembers(bandData) {
  const baseSkill = Math.floor((bandData.prestige || 50) / 10);
  return [
    { instrument: 'drummer', skill: baseSkill + Math.floor(Math.random() * 20) },
    { instrument: 'guitarist', skill: baseSkill + Math.floor(Math.random() * 20) },
    { instrument: 'bassist', skill: baseSkill + Math.floor(Math.random() * 20) }
  ];
}

/**
 * Generate psychology state for a rival band based on their characteristics
 */
function generateBandPsychology(bandData) {
  // Base psychology on rivalry level and prestige
  const rivalryLevel = bandData.rivalryLevel || 'neutral';
  const prestige = bandData.prestige || 50;

  const psychologyMap = {
    neutral: { stress: 20, depression: 15, burnout: 10, ego: 40 },
    aware: { stress: 30, depression: 20, burnout: 15, ego: 50 },
    competing: { stress: 50, depression: 25, burnout: 30, ego: 70 },
    fierce: { stress: 70, depression: 40, burnout: 50, ego: 85 },
    bitter: { stress: 85, depression: 60, burnout: 70, ego: 95 }
  };

  const basePsych = psychologyMap[rivalryLevel] || psychologyMap.neutral;

  // Adjust based on prestige (higher prestige = more confidence, less stress)
  return {
    stress: Math.max(0, basePsych.stress - (prestige / 10)),
    depression: Math.max(0, basePsych.depression - (prestige / 15)),
    burnout: Math.max(0, basePsych.burnout - (prestige / 20)),
    ego: Math.min(100, basePsych.ego + (prestige / 10)),
    addiction_risk: Math.floor(Math.random() * 30),
    moral_integrity: 100 - Math.floor(Math.random() * 40),
    paranoia: basePsych.stress * 0.3,
    substance_use: Math.floor(Math.random() * 20)
  };
}

/**
 * Generate a song name for a band
 */
function generateSongName(bandData, genre) {
  const genreNames = {
    rock: ['Thunder Road', 'Electric Storm', 'Rebel Heart', 'Wild Nights', 'Power Drive', 'Rock Anthem', 'Heavy Metal', 'Guitar Hero'],
    punk: ['Riot', 'Break Free', 'No Rules', 'Chaos Theory', 'Revolution', 'Anarchy', 'Rebel Yell', 'Punk Rock'],
    metal: ['Dark Descent', 'Iron Will', 'Shadow Realm', 'Eternal Fire', 'Doom', 'Metal Storm', 'Iron Fist', 'Death March'],
    folk: ['Mountain Song', 'River Road', 'Harvest Moon', 'Prairie Wind', 'Old Times', 'Country Road', 'Homeward Bound', 'Acoustic Dreams'],
    jazz: ['Midnight Blues', 'Smooth Groove', 'City Lights', 'Cool Breeze', 'Jazz Night', 'Saxophone Dreams', 'Piano Bar', 'Swing Time'],
    pop: ['Shine Bright', 'Dance All Night', 'Summer Love', 'Radio Star', 'Hit Song', 'Pop Sensation', 'Chart Topper', 'Catchy Tune'],
    'Synth-Pop': ['Electric Dreams', 'Neon Nights', 'Digital Love', 'Cyber Romance', 'Synthetic Heart', 'Electric Pulse', 'Neon Glow'],
    'Electro': ['Pulse', 'Circuit Breaker', 'Digital Storm', 'Electric Shock', 'Tech Beat', 'Digital Wave', 'Electric Flow'],
    'Alternative': ['Breaking Free', 'Edge of Reality', 'Lost in Sound', 'Raw Emotion', 'Alternative Truth', 'Underground', 'Indie Spirit'],
    'Indie Pop': ['Summer Breeze', 'Golden Hour', 'Soft Glow', 'Gentle Rain', 'Indie Dreams', 'Quiet Storm', 'Soft Focus'],
    'Electronic': ['Synthetic Wave', 'Digital Pulse', 'Electric Flow', 'Tech Dreams', 'Cyber Space', 'Digital Realm'],
    'Prog Rock': ['Epic Journey', 'Complex Minds', 'Time Signatures', 'Musical Odyssey', 'Progressive Dreams', 'Complexity'],
    'Ambient': ['Floating', 'Ethereal', 'Dream State', 'Peaceful Drift', 'Ambient Space', 'Calm Waters'],
    'Experimental': ['Chaos Theory', 'Abstract Forms', 'Unconventional', 'Avant-Garde', 'Experimental Sound', 'Abstract Art'],
    'Hard Rock': ['Iron Will', 'Heavy Metal', 'Power Chord', 'Rock Anthem', 'Hard Core', 'Metal Thunder']
  };

  const genreKey = genre?.toLowerCase() || 'rock';
  const names = genreNames[genreKey] || genreNames[Object.keys(genreNames).find(k => genreKey.includes(k.toLowerCase()))] || genreNames.rock;
  const randomName = names[Math.floor(Math.random() * names.length)];
  return randomName; // Return just the song name, not with band name
}

/**
 * Create a fallback song if generation fails
 */
function createFallbackSong(bandData, genre, songName) {
  return {
    metadata: {
      name: songName || `${bandData.name} - Untitled`,
      genre,
      band: bandData.name,
      bandId: bandData.id,
      isRivalSong: true
    },
    analysis: {
      qualityScore: 50 + Math.floor(Math.random() * 30),
      originalityScore: 40 + Math.floor(Math.random() * 30),
      commercialViability: 45 + Math.floor(Math.random() * 30)
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
  };
}

/**
 * Generate a song on-demand from any game context
 * @param {Object} context - Context data (event, chart entry, etc.)
 * @param {Object} bandData - Band data (can be player or rival)
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Generated song
 */
export async function generateSongFromContext(context, bandData, options = {}) {
  const {
    contextType = 'general', // 'event', 'chart', 'radio', 'gig', etc.
    trigger = null,
    week = 0
  } = context;

  // Customize generation based on context
  const contextOptions = {
    ...options,
    week,
    seed: options.seed || `${contextType}-${bandData.id || bandData.name}-${week}-${trigger || Date.now()}`
  };

  // Event-based songs might have specific themes
  if (contextType === 'event' && context.eventData) {
    contextOptions.songName = context.eventData.songName || null;
    contextOptions.genre = context.eventData.genre || bandData.genre || 'rock';
  }

  return generateRivalSong(bandData, contextOptions);
}
