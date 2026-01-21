/**
 * KeyboardConfig - Genre-to-keyboard type mapping
 * 
 * Maps genres to appropriate keyboard types:
 * - Piano: Acoustic piano for classical, jazz, folk
 * - Electric Piano: Rhodes/Wurlitzer for pop, rock, funk
 * - Synth: Synthesizer for electronic, synth pop, EDM
 */

/**
 * Genre to keyboard type mapping
 */
export const GENRE_KEYBOARD_TYPES = {
  // Piano (acoustic)
  jazz: 'piano',
  folk: 'piano',
  classical: 'piano',
  blues: 'piano',
  soul: 'piano',
  
  // Electric Piano
  pop: 'electric-piano',
  rock: 'electric-piano',
  funk: 'electric-piano',
  'r&b': 'electric-piano',
  reggae: 'electric-piano',
  country: 'electric-piano',
  indie: 'electric-piano',
  'indie-rock': 'electric-piano',
  
  // Synth
  'synth-pop': 'synth',
  edm: 'synth',
  electronic: 'synth',
  experimental: 'synth',
  hiphop: 'synth',
  
  // Default to electric piano
  punk: 'electric-piano',
  metal: 'electric-piano'
};

/**
 * Get keyboard type for genre
 * @param {string} genre - Genre name
 * @returns {string} Keyboard type ('piano', 'electric-piano', 'synth')
 */
export function getKeyboardTypeForGenre(genre) {
  const normalizedGenre = genre.toLowerCase().replace(/\s+/g, '-');
  return GENRE_KEYBOARD_TYPES[normalizedGenre] || 'electric-piano';
}

/**
 * Keyboard type descriptions
 */
export const KEYBOARD_TYPE_DESCRIPTIONS = {
  'piano': {
    name: 'Acoustic Piano',
    description: 'Classic grand piano sound',
    genres: ['jazz', 'folk', 'classical', 'blues', 'soul']
  },
  'electric-piano': {
    name: 'Electric Piano',
    description: 'Rhodes/Wurlitzer style',
    genres: ['pop', 'rock', 'funk', 'r&b', 'reggae', 'country']
  },
  'synth': {
    name: 'Synthesizer',
    description: 'Electronic synthesizer',
    genres: ['synth-pop', 'edm', 'electronic', 'experimental', 'hip-hop']
  }
};
