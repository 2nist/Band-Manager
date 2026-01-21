/**
 * generateSongFromAnywhere - Universal song generation utility
 * 
 * Allows generating songs from any game context (events, charts, radio, etc.)
 * Works with both player band and rival bands.
 */

import { MusicGenerator } from '../music/MusicGenerator.js';
import { generateRivalSong, generateSongFromContext } from './rivalSongGenerator.js';

/**
 * Generate a song from any game context
 * @param {Object} params - Generation parameters
 * @param {Object} params.bandData - Band data (player or rival)
 * @param {Object} params.context - Context (event, chart, radio, etc.)
 * @param {Object} params.options - Generation options (genre, title, etc.)
 * @returns {Promise<Object>} Generated song
 */
export async function generateSongFromAnywhere({ bandData, context = {}, options = {} }) {
  // Determine if this is a rival band or player band
  const isRival = bandData.isRival || bandData.id?.startsWith('rival-') || false;

  if (isRival) {
    // Use rival song generator
    return generateSongFromContext(context, bandData, options);
  } else {
    // Use player song generator (MusicGenerator)
    const gameState = {
      bandName: bandData.bandName || bandData.name || 'Your Band',
      currentWeek: context.week || bandData.week || 0,
      week: context.week || bandData.week || 0,
      fame: bandData.fame || 0,
      money: bandData.money || 0,
      bandMembers: bandData.bandMembers || [],
      psychState: bandData.psychState || {},
      labelDeal: bandData.labelDeal || null,
      fanbase: bandData.fanbase || {}
    };

    const genre = options.genre || context.genre || 'rock';
    const songName = options.songName || context.songName || null;
    const seed = options.seed || context.seed || `${gameState.bandName}-${gameState.week}-${genre}`;

    return MusicGenerator.generateSong(gameState, genre, {
      seed,
      songName,
      ...options
    });
  }
}

/**
 * Generate multiple songs for a chart or playlist
 * @param {Array} artists - Array of artist/band data
 * @param {Object} options - Generation options
 * @returns {Promise<Array>} Array of generated songs
 */
export async function generateSongsForChart(artists, options = {}) {
  const { week = 0, maxSongs = 20 } = options;

  const songs = await Promise.all(
    artists.slice(0, maxSongs).map(async (artist, index) => {
      return generateSongFromAnywhere({
        bandData: artist,
        context: {
          contextType: 'chart',
          week,
          trigger: `chart-${index}`
        },
        options: {
          genre: artist.genre || 'rock',
          seed: `${artist.id || artist.name}-chart-${week}-${index}`
        }
      });
    })
  );

  return songs.filter(song => song !== null);
}
