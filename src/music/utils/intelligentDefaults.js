/**
 * Intelligent Defaults System
 * 
 * Generates smart, genre-aware, skill-responsive instrument configurations
 */

import { getGenreProfile } from '../profiles/GENRE_AUDIO_PROFILES.js';

/**
 * Instrument-specific defaults by genre
 */
export const INSTRUMENT_DEFAULTS = {
  guitar: {
    'Metal': {
      oscillator: {
        simpleType: 'sawtooth',
        complexType: 'fatsawtooth',
        baseQ: 6,
        skillBonus: 4
      },
      effects: ['highgain_distortion', 'noise_gate', 'eq_cut_mid'],
      tone: 'aggressive',
      distortion: 0.7,
      gating: true,
      eq: 'cut_mids_boost_presence'
    },
    'Jazz': {
      oscillator: {
        simpleType: 'triangle',
        complexType: 'fmtriangle',
        baseQ: 3,
        skillBonus: 2
      },
      effects: ['tube_warmth', 'chorus', 'hall_reverb'],
      tone: 'clean_warm',
      distortion: 0.1,
      chorus: 0.3,
      reverb: 'hall_reverb'
    },
    'Punk': {
      oscillator: {
        simpleType: 'sawtooth',
        complexType: 'sawtooth',
        baseQ: 4,
        skillBonus: 1
      },
      effects: ['overdrive', 'slight_delay'],
      tone: 'raw_energy',
      distortion: 0.4,
      delay: 0.2
    },
    'Rock': {
      oscillator: {
        simpleType: 'sawtooth',
        complexType: 'fatsawtooth',
        baseQ: 5,
        skillBonus: 3
      },
      effects: ['tube_overdrive', 'reverb', 'eq'],
      tone: 'classic_rock',
      distortion: 0.5,
      reverb: 0.25
    },
    'Blues': {
      oscillator: {
        simpleType: 'triangle',
        complexType: 'fmtriangle',
        baseQ: 4,
        skillBonus: 2
      },
      effects: ['tube_screamer', 'vintage_reverb', 'slight_chorus'],
      tone: 'warm_overdrive',
      distortion: 0.3,
      reverb: 0.3
    },
    'Funk': {
      oscillator: {
        simpleType: 'square',
        complexType: 'fatsquare',
        baseQ: 4,
        skillBonus: 2
      },
      effects: ['clean_compression', 'chorus', 'wah'],
      tone: 'clean_punchy',
      distortion: 0.1,
      chorus: 0.4
    },
    'Folk': {
      oscillator: {
        simpleType: 'triangle',
        complexType: 'triangle',
        baseQ: 3,
        skillBonus: 1
      },
      effects: ['natural_reverb', 'light_compression'],
      tone: 'acoustic_simulation',
      distortion: 0,
      reverb: 0.2
    },
    'EDM': {
      oscillator: {
        simpleType: 'sawtooth',
        complexType: 'fatsawtooth',
        baseQ: 6,
        skillBonus: 3
      },
      effects: ['filter_sweep', 'delay', 'reverb', 'chorus'],
      tone: 'electronic_lead',
      distortion: 0.2,
      delay: 0.3
    },
    default: {
      oscillator: {
        simpleType: 'sawtooth',
        complexType: 'fatsawtooth',
        baseQ: 5,
        skillBonus: 2
      },
      effects: ['reverb', 'eq'],
      tone: 'balanced'
    }
  },
  drums: {
    'Metal': {
      samples: 'tight_punchy',
      processing: ['gate', 'compression', 'saturation'],
      velocity_curve: 'aggressive',
      reverb: 'minimal_room',
      compression: 'heavy'
    },
    'Jazz': {
      samples: 'warm_natural',
      processing: ['vintage_compression', 'room_reverb'],
      velocity_curve: 'expressive',
      reverb: 'ambient_hall',
      compression: 'gentle'
    },
    'Punk': {
      samples: 'raw_thuddy',
      processing: ['minimal_processing'],
      velocity_curve: 'aggressive',
      reverb: 'garage',
      compression: 'light'
    },
    'Rock': {
      samples: 'punchy_balanced',
      processing: ['compression', 'eq', 'slight_reverb'],
      velocity_curve: 'balanced',
      reverb: 'room',
      compression: 'medium'
    },
    default: {
      samples: 'balanced',
      processing: ['compression', 'eq'],
      velocity_curve: 'balanced'
    }
  },
  bass: {
    'Metal': {
      tone: 'growl',
      distortion: 0.4,
      compression: 'heavy',
      eq: 'boost_low_cut_high',
      effects: ['distortion', 'compressor', 'eq_boost_low']
    },
    'Jazz': {
      tone: 'woody_upright',
      distortion: 0,
      compression: 'vintage_tube',
      eq: 'natural_warmth',
      effects: ['tube_warmth', 'slight_compression']
    },
    'Punk': {
      tone: 'punchy_round',
      distortion: 0.2,
      compression: 'light',
      eq: 'boost_mid',
      effects: ['slight_overdrive']
    },
    'Rock': {
      tone: 'warm_fingerstyle',
      distortion: 0.1,
      compression: 'medium',
      eq: 'balanced',
      effects: ['compression', 'eq']
    },
    default: {
      tone: 'balanced',
      distortion: 0,
      compression: 'medium',
      eq: 'balanced'
    }
  }
};

/**
 * Generate intelligent defaults for all band members
 */
export function generateIntelligentDefaults(bandMembers, genre, gameState = {}) {
  const defaults = {};

  bandMembers.forEach(member => {
    const role = member.role || member.type || member.instrument;
    defaults[role] = {
      synthesis: generateSynthDefaults(role, genre, member.skill || 50),
      effects: generateEffectDefaults(role, genre, member),
      performance: generatePerformanceDefaults(member),
      autoAdjust: true,
      complexity: calculateOptimalComplexity(member.skill || 50, genre),
      qualityTarget: calculateQualityTarget(member, gameState.studioTier || 0)
    };
  });

  return defaults;
}

/**
 * Generate synthesis defaults based on role, genre, and skill
 */
export function generateSynthDefaults(role, genre, skillLevel) {
  const roleDefaults = INSTRUMENT_DEFAULTS[role];
  if (!roleDefaults) {
    return getGenericDefaults(role);
  }

  const baseParams = roleDefaults[genre] || roleDefaults.default || {};
  
  if (!baseParams.oscillator) {
    return getGenericDefaults(role);
  }

  const baseFilter = baseParams.filter || {};
  const baseOscillator = baseParams.oscillator || {};

  return {
    oscillator: {
      ...baseOscillator,
      type: skillLevel > 70 
        ? (baseOscillator.complexType || baseOscillator.simpleType || 'sawtooth')
        : (baseOscillator.simpleType || 'sawtooth')
    },
    filter: {
      ...baseFilter,
      Q: (baseFilter.baseQ || 5) + ((skillLevel / 100) * (baseFilter.skillBonus || 2)),
      frequency: baseFilter.frequency || 8000,
      type: baseFilter.type || 'lowpass'
    },
    envelope: {
      attack: 0.01 * (1 + (100 - skillLevel) / 500),
      decay: 0.2,
      sustain: 0.7 * (skillLevel / 100),
      release: 0.5
    }
  };
}

/**
 * Generate effect defaults
 */
export function generateEffectDefaults(role, genre, member) {
  const roleDefaults = INSTRUMENT_DEFAULTS[role];
  if (!roleDefaults) {
    return [];
  }

  const baseParams = roleDefaults[genre] || roleDefaults.default || {};
  const effects = baseParams.effects || [];

  // Filter effects based on skill
  return effects.filter(effect => {
    const skillRequirement = getEffectSkillRequirement(effect);
    return !skillRequirement || (member.skill || 50) >= skillRequirement;
  });
}

/**
 * Generate performance defaults
 */
export function generatePerformanceDefaults(member) {
  const skillFactor = (member.skill || 50) / 100;
  const reliabilityFactor = (member.reliability || 50) / 100;

  return {
    timing: {
      precision: Math.min(0.98, skillFactor * 0.7 + reliabilityFactor * 0.3),
      humanization: Math.max(0.02, 1 - skillFactor)
    },
    dynamics: {
      range: Math.min(1, (member.creativity || 50) / 100),
      consistency: Math.min(1, reliabilityFactor)
    }
  };
}

/**
 * Calculate optimal complexity based on skill and genre
 */
export function calculateOptimalComplexity(skill, genre) {
  const genreProfile = getGenreProfile(genre);
  const genreComplexity = genreProfile.overall?.complexity_preference || 0.5;
  const skillFactor = skill / 100;
  
  return Math.min(1, genreComplexity * (0.7 + skillFactor * 0.3));
}

/**
 * Calculate quality target based on member and studio tier
 */
export function calculateQualityTarget(member, studioTier) {
  const memberQuality = (member.skill || 50) * 0.4 + (member.reliability || 50) * 0.3 + (member.morale || 50) * 0.3;
  const studioBonus = studioTier * 10;
  
  return Math.min(100, memberQuality + studioBonus);
}

/**
 * Adjust configuration for member skill
 */
export function adjustForMemberSkill(baseConfig, member) {
  const skillFactor = (member.skill || 50) / 100;
  const reliabilityFactor = (member.reliability || 50) / 100;

  return {
    ...baseConfig,
    timing: {
      precision: Math.min(0.98, skillFactor * 0.7 + reliabilityFactor * 0.3),
      humanization: Math.max(0.02, 1 - skillFactor)
    },
    effects: baseConfig.effects.filter(effect => 
      !effect.skillRequirement || (member.skill || 50) >= effect.skillRequirement
    )
  };
}

/**
 * Get effect skill requirement
 */
function getEffectSkillRequirement(effectName) {
  const skillRequirements = {
    'highgain_distortion': 60,
    'filter_sweep': 70,
    'fmtriangle': 75,
    'fatsawtooth': 70,
    'fatsquare': 70
  };
  
  return skillRequirements[effectName] || 0;
}

/**
 * Get generic defaults for unknown roles
 */
function getGenericDefaults(role) {
  return {
    oscillator: {
      type: 'sawtooth',
      simpleType: 'sawtooth',
      complexType: 'sawtooth',
      baseQ: 5,
      skillBonus: 2
    },
    filter: {
      Q: 5,
      baseQ: 5,
      skillBonus: 2,
      frequency: 8000,
      type: 'lowpass'
    },
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.7,
      release: 0.5
    }
  };
}

/**
 * Calculate member skill levels for view level unlocking
 */
export function calculateMemberSkillLevels(bandMembers) {
  if (!bandMembers || bandMembers.length === 0) {
    return { average: 0, highest: 0, lowest: 0 };
  }

  const skills = bandMembers.map(m => m.skill || 50);
  const average = skills.reduce((a, b) => a + b, 0) / skills.length;
  const highest = Math.max(...skills);
  const lowest = Math.min(...skills);

  return { average, highest, lowest };
}
