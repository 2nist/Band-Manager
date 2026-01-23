/**
 * EffectsConfig - Audio effects configuration for genres and instruments
 * 
 * Defines genre-specific and instrument-specific audio effects using Tone.js
 */

/**
 * Genre-specific effect presets
 */
export const GENRE_EFFECTS = {
  rock: {
    master: {
      reverb: { roomSize: 0.3, dampening: 2000, wet: 0.15 },
      compression: { threshold: -24, ratio: 4, attack: 0.003, release: 0.1 }
    },
    melody: {
      distortion: { distortion: 0.2, wet: 0.3 },
      delay: { delayTime: '8n', feedback: 0.2, wet: 0.15 }
    },
    harmony: {
      chorus: { frequency: 1.5, delayTime: 3.5, depth: 0.7, wet: 0.2 },
      reverb: { roomSize: 0.4, wet: 0.2 }
    },
    drums: {
      compression: { threshold: -20, ratio: 6, attack: 0.001, release: 0.1 },
      reverb: { roomSize: 0.2, wet: 0.1 }
    }
  },

  punk: {
    master: {
      compression: { threshold: -18, ratio: 8, attack: 0.001, release: 0.05 }
    },
    melody: {
      distortion: { distortion: 0.6, wet: 0.5 },
      filter: { frequency: 3000, type: 'highpass', Q: 1 }
    },
    harmony: {
      distortion: { distortion: 0.4, wet: 0.4 },
      filter: { frequency: 2000, type: 'highpass', Q: 1 }
    },
    drums: {
      distortion: { distortion: 0.3, wet: 0.3 },
      compression: { threshold: -16, ratio: 10, attack: 0.001, release: 0.03 }
    }
  },

  metal: {
    master: {
      compression: { threshold: -20, ratio: 10, attack: 0.001, release: 0.05 },
      reverb: { roomSize: 0.5, dampening: 3000, wet: 0.2 }
    },
    melody: {
      distortion: { distortion: 0.8, wet: 0.6 },
      delay: { delayTime: '8n', feedback: 0.3, wet: 0.2 },
      filter: { frequency: 4000, type: 'highpass', Q: 2 }
    },
    harmony: {
      distortion: { distortion: 0.7, wet: 0.5 },
      chorus: { frequency: 2, delayTime: 4, depth: 0.8, wet: 0.25 }
    },
    drums: {
      distortion: { distortion: 0.4, wet: 0.4 },
      compression: { threshold: -18, ratio: 12, attack: 0.001, release: 0.02 },
      reverb: { roomSize: 0.3, wet: 0.15 }
    }
  },

  funk: {
    master: {
      compression: { threshold: -22, ratio: 3, attack: 0.01, release: 0.15 }
    },
    melody: {
      chorus: { frequency: 1.2, delayTime: 2.5, depth: 0.6, wet: 0.3 },
      delay: { delayTime: '16n', feedback: 0.25, wet: 0.2 },
      filter: { frequency: 800, type: 'lowpass', Q: 1 }
    },
    harmony: {
      chorus: { frequency: 1.5, delayTime: 3, depth: 0.7, wet: 0.35 },
      filter: { frequency: 2000, type: 'lowpass', Q: 1.5 }
    },
    drums: {
      compression: { threshold: -20, ratio: 4, attack: 0.002, release: 0.1 },
      filter: { frequency: 5000, type: 'highpass', Q: 1 }
    }
  },

  folk: {
    master: {
      reverb: { roomSize: 0.6, dampening: 1500, wet: 0.25 }
    },
    melody: {
      delay: { delayTime: '4n', feedback: 0.15, wet: 0.2 },
      reverb: { roomSize: 0.5, wet: 0.3 },
      filter: { frequency: 4000, type: 'lowpass', Q: 1 }
    },
    harmony: {
      reverb: { roomSize: 0.6, wet: 0.35 },
      chorus: { frequency: 0.8, delayTime: 2, depth: 0.4, wet: 0.15 }
    },
    drums: {
      reverb: { roomSize: 0.4, wet: 0.2 },
      compression: { threshold: -24, ratio: 3, attack: 0.005, release: 0.2 }
    }
  },

  jazz: {
    master: {
      reverb: { roomSize: 0.7, dampening: 2000, wet: 0.3 },
      compression: { threshold: -26, ratio: 2.5, attack: 0.01, release: 0.2 }
    },
    melody: {
      reverb: { roomSize: 0.6, wet: 0.4 },
      delay: { delayTime: '8n', feedback: 0.2, wet: 0.15 },
      chorus: { frequency: 1, delayTime: 2, depth: 0.5, wet: 0.2 }
    },
    harmony: {
      reverb: { roomSize: 0.65, wet: 0.4 },
      chorus: { frequency: 0.9, delayTime: 2.5, depth: 0.6, wet: 0.25 }
    },
    drums: {
      reverb: { roomSize: 0.5, wet: 0.25 },
      compression: { threshold: -22, ratio: 4, attack: 0.003, release: 0.15 }
    }
  },

  pop: {
    master: {
      compression: { threshold: -20, ratio: 5, attack: 0.005, release: 0.1 },
      reverb: { roomSize: 0.4, dampening: 2500, wet: 0.2 }
    },
    melody: {
      chorus: { frequency: 1.5, delayTime: 3, depth: 0.6, wet: 0.25 },
      delay: { delayTime: '8n', feedback: 0.2, wet: 0.15 },
      filter: { frequency: 5000, type: 'lowpass', Q: 1 }
    },
    harmony: {
      chorus: { frequency: 1.2, delayTime: 2.5, depth: 0.5, wet: 0.2 },
      reverb: { roomSize: 0.35, wet: 0.15 }
    },
    drums: {
      compression: { threshold: -18, ratio: 6, attack: 0.002, release: 0.08 },
      reverb: { roomSize: 0.3, wet: 0.1 }
    }
  }
};

/**
 * Default effects (used when genre not specified)
 */
export const DEFAULT_EFFECTS = {
  master: {
    reverb: { roomSize: 0.3, dampening: 2000, wet: 0.1 },
    compression: { threshold: -22, ratio: 4, attack: 0.005, release: 0.1 }
  },
  melody: {
    delay: { delayTime: '8n', feedback: 0.15, wet: 0.1 }
  },
  harmony: {
    reverb: { roomSize: 0.3, wet: 0.15 }
  },
  drums: {
    compression: { threshold: -20, ratio: 5, attack: 0.002, release: 0.1 }
  }
};

/**
 * Get effects configuration for a genre
 * @param {string} genre - Genre name
 * @returns {Object} Effects configuration
 */
export function getGenreEffects(genre) {
  return GENRE_EFFECTS[genre] || DEFAULT_EFFECTS;
}

/**
 * Adjust effects based on game state
 * @param {Object} effectsConfig - Base effects configuration
 * @param {Object} gameState - Game state (equipment, studio, psychology)
 * @returns {Object} Adjusted effects configuration
 */
export function adjustEffectsForGameState(effectsConfig, gameState = {}) {
  // Ensure effectsConfig exists and has required structure
  if (!effectsConfig || typeof effectsConfig !== 'object') {
    console.warn('adjustEffectsForGameState: Invalid effectsConfig, using DEFAULT_EFFECTS');
    effectsConfig = DEFAULT_EFFECTS;
  }
  
  const adjusted = JSON.parse(JSON.stringify(effectsConfig));
  
  // Ensure all required top-level properties exist
  if (!adjusted.master) adjusted.master = {};
  if (!adjusted.melody) adjusted.melody = {};
  if (!adjusted.harmony) adjusted.harmony = {};
  if (!adjusted.drums) adjusted.drums = {};
  
  // Extract equipment/studio quality (handle multiple possible locations)
  const equipmentQuality = gameState.equipmentQuality || 
    (gameState.gearTier ? gameState.gearTier * 20 : null) ||
    (gameState.contextConstraints?.equipmentQuality) ||
    (gameState.constraints?.contextConstraints?.equipmentQuality) ||
    50;
  
  const studioQuality = gameState.studioQuality || 
    (gameState.studioTier ? gameState.studioTier * 20 : null) ||
    (gameState.contextConstraints?.studioQuality) ||
    (gameState.constraints?.contextConstraints?.studioQuality) ||
    50;
  
  // Extract psychological state (multiple possible locations)
  const psychState = gameState.psychState || 
    gameState.psychologicalState || 
    gameState.psychConstraints ||
    gameState.constraints?.psychConstraints ||
    {};
  
  const stress = gameState.stress || 
    psychState.stress || 
    psychState.stress_level ||
    0;
  
  const substanceUse = gameState.substanceUse || 
    psychState.substance_use || 
    psychState.substanceUse ||
    0;
  
  // Equipment quality affects overall effect quality
  const qualityMultiplier = equipmentQuality / 100;
  
  // Studio quality affects reverb and overall polish
  const studioMultiplier = studioQuality / 100;
  
  // Stress adds chaos/distortion
  const stressAmount = stress / 100;
  
  // Substance use adds more extreme effects
  const substanceAmount = substanceUse / 100;
  
  // Adjust master effects
  if (adjusted.master.reverb) {
    adjusted.master.reverb.wet = (adjusted.master.reverb.wet || 0.1) * studioMultiplier;
  }
  if (adjusted.master.compression) {
    adjusted.master.compression.ratio = (adjusted.master.compression.ratio || 4) * (1 + qualityMultiplier * 0.5);
  }
  
  // Adjust melody effects
  if (adjusted.melody.distortion) {
    adjusted.melody.distortion.distortion = Math.min(1, (adjusted.melody.distortion.distortion || 0) + stressAmount * 0.3 + substanceAmount * 0.2);
    adjusted.melody.distortion.wet = Math.min(1, (adjusted.melody.distortion.wet || 0) + stressAmount * 0.2);
  }
  if (adjusted.melody.delay) {
    adjusted.melody.delay.feedback = Math.min(0.9, (adjusted.melody.delay.feedback || 0) + substanceAmount * 0.1);
  }
  
  // Adjust harmony effects
  if (adjusted.harmony.distortion) {
    adjusted.harmony.distortion.distortion = Math.min(1, (adjusted.harmony.distortion.distortion || 0) + stressAmount * 0.2);
  }
  
  // Adjust drum effects
  if (adjusted.drums.compression) {
    adjusted.drums.compression.ratio = (adjusted.drums.compression.ratio || 5) * (1 + qualityMultiplier * 0.3);
  }
  if (adjusted.drums.distortion) {
    adjusted.drums.distortion.distortion = Math.min(1, (adjusted.drums.distortion.distortion || 0) + stressAmount * 0.2);
  }
  
  return adjusted;
}
