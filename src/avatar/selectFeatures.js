/**
 * Feature Selection Logic
 * 
 * Handles weighted selection of avatar features based on seed and archetype.
 */

import { pick, pickWeighted } from './rng.js';

/**
 * Select a feature for a layer
 * @param {Function} rng - Seeded random number generator
 * @param {Array} features - Available features for the layer
 * @param {string} [archetype] - Optional archetype for weighted selection
 * @returns {Object} Selected feature
 */
export function selectFeature(rng, features, archetype) {
  if (features.length === 0) {
    throw new Error('No features available for selection');
  }

  // Filter out 'none' features if they exist
  const validFeatures = features.filter(f => f.id !== 'none' || f.path === '');
  
  if (validFeatures.length === 0) {
    // Only 'none' features available
    return features[0];
  }

  // If archetype weighting is needed, use weighted selection
  // For now, use simple weighted selection based on feature weights
  const weightedFeatures = validFeatures.map(f => [
    f,
    f.weight || 1
  ]);

  return pickWeighted(rng, weightedFeatures);
}

/**
 * Select features for all layers
 * @param {Function} rng - Seeded random number generator
 * @param {Object} config - Avatar configuration
 * @param {string} [archetype] - Optional archetype for weighted selection
 * @returns {Map} Map of layer name to selected feature
 */
export function selectAllFeatures(rng, config, archetype) {
  const selections = new Map();

  for (const layer of config.layers) {
    // Skip optional layers based on probability
    if (!layer.required && rng() < 0.3) {
      // 30% chance to skip optional layers
      const noneFeature = layer.features.find(f => f.id === 'none');
      if (noneFeature) {
        selections.set(layer.name, noneFeature);
        continue;
      }
    }

    const feature = selectFeature(rng, layer.features, archetype);
    selections.set(layer.name, feature);
  }

  return selections;
}

/**
 * Generate feature selections with archetype bias
 * @param {Function} rng - Seeded random number generator
 * @param {Object} config - Avatar configuration
 * @param {string} archetype - Archetype name (e.g., 'drummer', 'guitarist', 'synth-nerd', 'producer')
 * @returns {Map} Map of layer name to selected feature
 */
export function selectFeaturesWithArchetype(rng, config, archetype) {
  const selections = new Map();
  const archetypeWeights = config.archetypes?.[archetype] || {};

  for (const layer of config.layers) {
    // Apply archetype weights to features
    const weightedFeatures = layer.features.map(f => {
      let weight = f.weight || 1;
      
      // Apply archetype multiplier based on layer name and feature category
      // Archetype weights are structured as: { eyes: { narrow: 1.4, ... }, nose: { ... }, ... }
      const layerWeights = archetypeWeights[layer.name];
      if (layerWeights && f.category) {
        // Check if this feature category has a weight multiplier
        const categoryWeight = layerWeights[f.category];
        if (categoryWeight) {
          weight *= categoryWeight;
        }
      }
      
      return [f, weight];
    });

    // Skip optional layers
    if (!layer.required && rng() < 0.3) {
      const noneFeature = layer.features.find(f => f.id === 'none');
      if (noneFeature) {
        selections.set(layer.name, noneFeature);
        continue;
      }
    }

    const feature = pickWeighted(rng, weightedFeatures);
    selections.set(layer.name, feature);
  }

  return selections;
}
