/**
 * GENRE_AUDIO_PROFILES.js - Genre-specific audio templates
 * 
 * Defines instrument configurations, effects, and performance characteristics
 * for each musical genre. These profiles ensure authentic genre sound while
 * allowing individual member skills to modify the performance.
 */

export const GENRE_AUDIO_PROFILES = {
  'Metal': {
    drums: {
      kickType: 'punchy',
      snareType: 'cracky',
      effects: ['gate', 'compression', 'saturation'],
      velocity_boost: 0.3,
      timing_precision: 0.95, // Tight timing required
      complexity_preference: 0.8
    },
    guitar: {
      tone: 'heavy_distortion',
      effects: ['highgain_distortion', 'noise_gate', 'eq_cut_mid'],
      palm_mute_probability: 0.7,
      chord_voicing: 'power_chords',
      timing_precision: 0.9,
      complexity_preference: 0.7
    },
    bass: {
      tone: 'growl',
      effects: ['distortion', 'compressor', 'eq_boost_low'],
      playing_style: 'aggressive_picking',
      timing_precision: 0.9,
      complexity_preference: 0.6
    },
    overall: {
      tempo_range: [120, 180],
      complexity_preference: 0.8,
      reverb_type: 'tight_room',
      master_effects: ['limiter', 'saturation'],
      swing_factor: 0.0 // No swing for metal
    }
  },
  
  'Jazz': {
    drums: {
      kickType: 'warm',
      snareType: 'brushes_available',
      effects: ['vintage_compression', 'room_reverb'],
      swing_factor: 0.3,
      timing_precision: 0.7, // Looser, more human timing
      complexity_preference: 0.9
    },
    guitar: {
      tone: 'clean_warm',
      effects: ['chorus', 'reverb', 'tube_warmth'],
      chord_voicing: 'complex_extensions',
      improvisation_factor: 0.8,
      timing_precision: 0.6,
      complexity_preference: 0.95
    },
    bass: {
      tone: 'woody_upright',
      effects: ['tube_warmth', 'slight_compression'],
      playing_style: 'walking_bass',
      timing_precision: 0.65,
      complexity_preference: 0.85
    },
    overall: {
      tempo_range: [80, 160],
      complexity_preference: 0.9,
      reverb_type: 'hall_reverb',
      master_effects: ['vintage_compressor', 'tape_saturation'],
      swing_factor: 0.3
    }
  },
  
  'Punk': {
    drums: {
      kickType: 'thuddy',
      snareType: 'poppy',
      effects: ['minimal_processing'],
      velocity_boost: 0.4,
      timing_precision: 0.8, // Slightly loose for authenticity
      complexity_preference: 0.3
    },
    guitar: {
      tone: 'mid_distortion',
      effects: ['overdrive', 'slight_delay'],
      chord_voicing: 'open_power_chords',
      strumming_intensity: 0.9,
      timing_precision: 0.75,
      complexity_preference: 0.2
    },
    bass: {
      tone: 'punchy_round',
      effects: ['slight_overdrive'],
      playing_style: 'eighth_note_drive',
      timing_precision: 0.8,
      complexity_preference: 0.3
    },
    overall: {
      tempo_range: [140, 200],
      complexity_preference: 0.4,
      reverb_type: 'garage_reverb',
      master_effects: ['tape_saturation', 'slight_compression'],
      swing_factor: 0.0
    }
  },
  
  'EDM': {
    drums: {
      kickType: 'punchy_electronic',
      snareType: 'clap_layered',
      effects: ['sidechain_compression', 'saturation', 'eq'],
      velocity_boost: 0.5,
      timing_precision: 0.99, // Perfect electronic timing
      complexity_preference: 0.6
    },
    synth: {
      tone: 'saw_lead',
      effects: ['filter_sweep', 'delay', 'reverb', 'chorus'],
      modulation_amount: 0.7,
      timing_precision: 0.95,
      complexity_preference: 0.7
    },
    bass: {
      tone: 'sub_bass_sine',
      effects: ['saturation', 'compression'],
      playing_style: 'sustained_notes',
      timing_precision: 0.95,
      complexity_preference: 0.5
    },
    overall: {
      tempo_range: [120, 140],
      complexity_preference: 0.6,
      reverb_type: 'digital_reverb',
      master_effects: ['multiband_compressor', 'maximizer'],
      swing_factor: 0.0
    }
  },
  
  'Blues': {
    drums: {
      kickType: 'woody',
      snareType: 'snappy',
      effects: ['vintage_compression', 'room_ambience'],
      swing_factor: 0.2,
      timing_precision: 0.7, // Human groove
      complexity_preference: 0.5
    },
    guitar: {
      tone: 'tube_overdrive',
      effects: ['tube_screamer', 'vintage_reverb', 'slight_chorus'],
      bend_probability: 0.6,
      slide_probability: 0.4,
      timing_precision: 0.6,
      complexity_preference: 0.5
    },
    bass: {
      tone: 'warm_fingerstyle',
      effects: ['tube_warmth'],
      playing_style: 'fingerstyle',
      timing_precision: 0.65,
      complexity_preference: 0.4
    },
    overall: {
      tempo_range: [70, 130],
      complexity_preference: 0.5,
      reverb_type: 'spring_reverb',
      master_effects: ['vintage_compressor', 'tape_warmth'],
      swing_factor: 0.2
    }
  },
  
  'Rock': {
    drums: {
      kickType: 'punchy',
      snareType: 'cracky',
      effects: ['compression', 'room_reverb'],
      velocity_boost: 0.2,
      timing_precision: 0.85,
      complexity_preference: 0.6
    },
    guitar: {
      tone: 'crunch',
      effects: ['overdrive', 'reverb', 'delay'],
      chord_voicing: 'power_chords',
      timing_precision: 0.8,
      complexity_preference: 0.5
    },
    bass: {
      tone: 'round',
      effects: ['compression', 'slight_overdrive'],
      playing_style: 'fingerstyle',
      timing_precision: 0.8,
      complexity_preference: 0.4
    },
    overall: {
      tempo_range: [100, 160],
      complexity_preference: 0.6,
      reverb_type: 'room_reverb',
      master_effects: ['compressor', 'saturation'],
      swing_factor: 0.0
    }
  },
  
  'Funk': {
    drums: {
      kickType: 'punchy',
      snareType: 'cracky',
      effects: ['compression', 'gate'],
      velocity_boost: 0.3,
      timing_precision: 0.9,
      complexity_preference: 0.7
    },
    guitar: {
      tone: 'clean_bright',
      effects: ['chorus', 'compression', 'wah'],
      chord_voicing: 'complex_extensions',
      timing_precision: 0.85,
      complexity_preference: 0.7
    },
    bass: {
      tone: 'punchy_slap',
      effects: ['compression', 'eq_boost_mid'],
      playing_style: 'slap_pop',
      timing_precision: 0.9,
      complexity_preference: 0.6
    },
    overall: {
      tempo_range: [90, 130],
      complexity_preference: 0.7,
      reverb_type: 'tight_room',
      master_effects: ['compressor', 'eq'],
      swing_factor: 0.1
    }
  },
  
  'Folk': {
    drums: {
      kickType: 'warm',
      snareType: 'soft',
      effects: ['minimal_processing', 'room_ambience'],
      velocity_boost: 0.1,
      timing_precision: 0.75,
      complexity_preference: 0.4
    },
    guitar: {
      tone: 'acoustic_clean',
      effects: ['reverb', 'slight_compression'],
      chord_voicing: 'open_chords',
      timing_precision: 0.7,
      complexity_preference: 0.4
    },
    bass: {
      tone: 'warm_acoustic',
      effects: ['minimal_processing'],
      playing_style: 'fingerstyle',
      timing_precision: 0.7,
      complexity_preference: 0.3
    },
    overall: {
      tempo_range: [60, 120],
      complexity_preference: 0.4,
      reverb_type: 'hall_reverb',
      master_effects: ['vintage_compressor'],
      swing_factor: 0.0
    }
  }
};

/**
 * Get genre profile, with fallback to Rock
 * Handles case-insensitive matching
 */
export const getGenreProfile = (genre) => {
  if (!genre) return GENRE_AUDIO_PROFILES['Rock'];
  
  // Normalize genre name
  const normalized = genre.charAt(0).toUpperCase() + genre.slice(1).toLowerCase();
  // Special case for EDM
  const finalGenre = normalized.toLowerCase() === 'edm' ? 'EDM' : normalized;
  
  return GENRE_AUDIO_PROFILES[finalGenre] || GENRE_AUDIO_PROFILES['Rock'];
};

/**
 * Get instrument-specific profile for a genre
 */
export const getInstrumentProfile = (genre, instrument) => {
  const profile = getGenreProfile(genre);
  return profile[instrument] || {};
};

/**
 * Get overall genre characteristics
 */
export const getGenreCharacteristics = (genre) => {
  const profile = getGenreProfile(genre);
  return profile.overall || {};
};

export default GENRE_AUDIO_PROFILES;
