/**
 * EMGD Drum Mapping - Roland TD-11 to GM/Paper Mapping
 * 
 * Maps Roland TD-11 MIDI pitches (used in E-GMD dataset) to General MIDI (GM) 
 * and the simplified Paper mapping for more realistic drum patterns.
 * 
 * Based on the Electronic Music Generation Dataset (E-GMD) drum mapping specification.
 * 
 * Reference:
 * - Roland TD-11: Electronic drum kit used to record performances
 * - GM Mapping: General MIDI standard pitch values
 * - Paper Mapping: Simplified mapping used in the E-GMD paper
 */

/**
 * EMGD Drum Mapping Table
 * Maps Roland TD-11 pitch -> GM pitch -> Paper mapping
 */
export const EMGD_DRUM_MAPPING = {
  // Kick Drum
  36: { roland: 'Kick', gm: 36, paper: 36, name: 'Bass Drum 1', frequency: 88067 },
  
  // Snare Drum (all variants map to GM 38 / Paper 38)
  38: { roland: 'Snare (Head)', gm: 38, paper: 38, name: 'Acoustic Snare', frequency: 102787 },
  40: { roland: 'Snare (Rim)', gm: 38, paper: 38, name: 'Acoustic Snare', frequency: 22262 },
  37: { roland: 'Snare X-Stick', gm: 37, paper: 38, name: 'Acoustic Snare', frequency: 9696 },
  
  // Hi-Hat Closed (all variants map to GM 42 / Paper 42)
  42: { roland: 'HH Closed (Bow)', gm: 42, paper: 42, name: 'Closed Hi-Hat', frequency: 31691 },
  22: { roland: 'HH Closed (Edge)', gm: 42, paper: 42, name: 'Closed Hi-Hat', frequency: 34764 },
  44: { roland: 'HH Pedal', gm: 44, paper: 42, name: 'Closed Hi-Hat', frequency: 52343 },
  
  // Hi-Hat Open (all variants map to GM 46 / Paper 46)
  46: { roland: 'HH Open (Bow)', gm: 46, paper: 46, name: 'Open Hi-Hat', frequency: 3905 },
  26: { roland: 'HH Open (Edge)', gm: 46, paper: 46, name: 'Open Hi-Hat', frequency: 10243 },
  
  // Toms (for completeness, though not focus)
  48: { roland: 'Tom 1', gm: 50, paper: 50, name: 'High Tom', frequency: 13145 },
  50: { roland: 'Tom 1 (Rim)', gm: 50, paper: 50, name: 'High Tom', frequency: 1561 },
  45: { roland: 'Tom 2', gm: 47, paper: 47, name: 'Low-Mid Tom', frequency: 3935 },
  47: { roland: 'Tom 2 (Rim)', gm: 47, paper: 47, name: 'Low-Mid Tom', frequency: 1322 },
  43: { roland: 'Tom 3 (Head)', gm: 43, paper: 43, name: 'High Floor Tom', frequency: 11260 },
  58: { roland: 'Tom 3 (Rim)', gm: 43, paper: 43, name: 'High Floor Tom', frequency: 1003 },
  
  // Cymbals (for completeness)
  49: { roland: 'Crash 1 (Bow)', gm: 49, paper: 49, name: 'Crash Cymbal', frequency: 720 },
  55: { roland: 'Crash 1 (Edge)', gm: 49, paper: 49, name: 'Crash Cymbal', frequency: 5567 },
  57: { roland: 'Crash 2 (Bow)', gm: 49, paper: 49, name: 'Crash Cymbal', frequency: 1832 },
  52: { roland: 'Crash 2 (Edge)', gm: 49, paper: 49, name: 'Crash Cymbal', frequency: 1046 },
  51: { roland: 'Ride (Bow)', gm: 51, paper: 51, name: 'Ride Cymbal', frequency: 43847 },
  59: { roland: 'Ride (Edge)', gm: 51, paper: 51, name: 'Ride Cymbal', frequency: 2220 },
  53: { roland: 'Ride (Bell)', gm: 53, paper: 51, name: 'Ride Cymbal', frequency: 5567 },
};

/**
 * Map Roland TD-11 pitch to Paper mapping (simplified)
 * This is the primary mapping used for realistic drum patterns
 * 
 * @param {number} rolandPitch - MIDI pitch from Roland TD-11
 * @returns {number|null} Paper mapping pitch, or null if not mapped
 */
export function mapRolandToPaper(rolandPitch) {
  const mapping = EMGD_DRUM_MAPPING[rolandPitch];
  return mapping ? mapping.paper : null;
}

/**
 * Map Roland TD-11 pitch to GM mapping
 * 
 * @param {number} rolandPitch - MIDI pitch from Roland TD-11
 * @returns {number|null} GM mapping pitch, or null if not mapped
 */
export function mapRolandToGM(rolandPitch) {
  const mapping = EMGD_DRUM_MAPPING[rolandPitch];
  return mapping ? mapping.gm : null;
}

/**
 * Map Roland TD-11 pitch to drum type (kick, snare, hihat, etc.)
 * Focuses on kick, snare, and hi-hat for realistic patterns
 * 
 * @param {number} rolandPitch - MIDI pitch from Roland TD-11
 * @returns {string|null} Drum type ('kick', 'snare', 'hihat', 'hihatOpen', etc.) or null
 */
export function mapRolandToDrumType(rolandPitch) {
  const mapping = EMGD_DRUM_MAPPING[rolandPitch];
  if (!mapping) return null;
  
  const paper = mapping.paper;
  
  // Focus on kick, snare, and hi-hat
  if (paper === 36) return 'kick';
  if (paper === 38) return 'snare';
  if (paper === 42) return 'hihat'; // Closed hi-hat
  if (paper === 46) return 'hihatOpen'; // Open hi-hat
  
  // Other drums (toms, cymbals) for completeness
  if (paper >= 43 && paper <= 50) return 'tom';
  if (paper === 49 || paper === 51 || paper === 53) return 'cymbal';
  
  return null;
}

/**
 * Get all Roland pitches that map to a specific drum type
 * 
 * @param {string} drumType - Drum type ('kick', 'snare', 'hihat', 'hihatOpen')
 * @returns {number[]} Array of Roland TD-11 pitches
 */
export function getRolandPitchesForDrumType(drumType) {
  const pitches = [];
  for (const [rolandPitch, mapping] of Object.entries(EMGD_DRUM_MAPPING)) {
    const type = mapRolandToDrumType(parseInt(rolandPitch));
    if (type === drumType || 
        (drumType === 'hihat' && type === 'hihat') ||
        (drumType === 'hihatOpen' && type === 'hihatOpen')) {
      pitches.push(parseInt(rolandPitch));
    }
  }
  return pitches;
}

/**
 * Paper mapping constants (for export/playback)
 * These are the simplified pitches used in the paper
 */
export const PAPER_DRUM_MAPPING = {
  KICK: 36,      // Bass Drum 1
  SNARE: 38,     // Acoustic Snare
  HIHAT_CLOSED: 42,  // Closed Hi-Hat
  HIHAT_OPEN: 46,    // Open Hi-Hat
};

/**
 * Control Change 4: Hi-Hat Pedal Position
 * The TD-11 records hi-hat pedal position on control change 4
 * This can be used to determine if hi-hat should be open or closed
 */
export const HIHAT_PEDAL_CC = 4;

export default {
  EMGD_DRUM_MAPPING,
  mapRolandToPaper,
  mapRolandToGM,
  mapRolandToDrumType,
  getRolandPitchesForDrumType,
  PAPER_DRUM_MAPPING,
  HIHAT_PEDAL_CC
};
