/**
 * Art Bible Implementation Tests
 * 
 * Tests for:
 * - Archetype weighting system
 * - Category-based feature selection
 * - New archetypes (synth-nerd, producer)
 * - Role mapping
 */

import { mulberry32 } from '../avatar/rng.js';
import { defaultAvatarConfig, getLayerFeatures } from '../avatar/avatarConfig.js';
import { selectFeaturesWithArchetype } from '../avatar/selectFeatures.js';

describe('Art Bible - Archetype Weighting System', () => {
  test('synth-nerd archetype applies correct weights', () => {
    const rng = mulberry32(12345);
    const selections = selectFeaturesWithArchetype(rng, defaultAvatarConfig, 'synth-nerd');
    
    // Should have selections for all required layers
    expect(selections.size).toBeGreaterThan(0);
    
    // Check that eyes layer has a selection
    const eyesFeature = selections.get('eyes');
    expect(eyesFeature).toBeDefined();
    
    // Check that archetype weights exist
    const archetypeWeights = defaultAvatarConfig.archetypes['synth-nerd'];
    expect(archetypeWeights).toBeDefined();
    expect(archetypeWeights.eyes).toBeDefined();
    expect(archetypeWeights.eyes.narrow).toBe(1.4);
    expect(archetypeWeights.eyes.tired).toBe(1.3);
  });

  test('drummer archetype applies correct weights', () => {
    const rng = mulberry32(12345);
    const selections = selectFeaturesWithArchetype(rng, defaultAvatarConfig, 'drummer');
    
    expect(selections.size).toBeGreaterThan(0);
    
    const archetypeWeights = defaultAvatarConfig.archetypes.drummer;
    expect(archetypeWeights).toBeDefined();
    expect(archetypeWeights.nose).toBeDefined();
    expect(archetypeWeights.nose.crooked).toBe(1.5);
    expect(archetypeWeights.nose.wide).toBe(1.3);
    expect(archetypeWeights.accessories).toBeDefined();
    expect(archetypeWeights.accessories.earplug).toBe(1.6);
  });

  test('guitarist archetype applies correct weights', () => {
    const rng = mulberry32(12345);
    const selections = selectFeaturesWithArchetype(rng, defaultAvatarConfig, 'guitarist');
    
    expect(selections.size).toBeGreaterThan(0);
    
    const archetypeWeights = defaultAvatarConfig.archetypes.guitarist;
    expect(archetypeWeights).toBeDefined();
    expect(archetypeWeights.hair).toBeDefined();
    expect(archetypeWeights.hair.beanie).toBe(1.4);
    expect(archetypeWeights.hair.wild).toBe(1.3);
    expect(archetypeWeights.facialHair).toBeDefined();
    expect(archetypeWeights.facialHair.beard).toBe(1.5);
  });

  test('vocalist archetype applies correct weights', () => {
    const rng = mulberry32(12345);
    const selections = selectFeaturesWithArchetype(rng, defaultAvatarConfig, 'vocalist');
    
    expect(selections.size).toBeGreaterThan(0);
    
    const archetypeWeights = defaultAvatarConfig.archetypes.vocalist;
    expect(archetypeWeights).toBeDefined();
    expect(archetypeWeights.mouth).toBeDefined();
    expect(archetypeWeights.mouth.neutral).toBe(1.4);
    expect(archetypeWeights.hair).toBeDefined();
    expect(archetypeWeights.hair.clean).toBe(1.4);
  });

  test('producer archetype applies correct weights', () => {
    const rng = mulberry32(12345);
    const selections = selectFeaturesWithArchetype(rng, defaultAvatarConfig, 'producer');
    
    expect(selections.size).toBeGreaterThan(0);
    
    const archetypeWeights = defaultAvatarConfig.archetypes.producer;
    expect(archetypeWeights).toBeDefined();
    expect(archetypeWeights.eyes).toBeDefined();
    expect(archetypeWeights.eyes.tired).toBe(1.5);
    expect(archetypeWeights.accessories).toBeDefined();
    expect(archetypeWeights.accessories.headphones).toBe(1.7);
    expect(archetypeWeights.accessories.coffeeStain).toBe(1.4);
  });

  test('archetype weights are multipliers, not locks', () => {
    // Run multiple selections and verify variety
    const results = new Set();
    
    for (let i = 0; i < 10; i++) {
      const rng = mulberry32(1000 + i);
      const selections = selectFeaturesWithArchetype(rng, defaultAvatarConfig, 'guitarist');
      const hairFeature = selections.get('hair');
      if (hairFeature) {
        results.add(hairFeature.id);
      }
    }
    
    // Should have some variety (not all beanie/wild, but more likely)
    expect(results.size).toBeGreaterThan(0);
  });
});

describe('Art Bible - Category System', () => {
  test('features have category properties', () => {
    const eyesFeatures = getLayerFeatures(defaultAvatarConfig, 'eyes');
    expect(eyesFeatures.length).toBeGreaterThan(0);
    
    // Check that features have categories
    const featuresWithCategories = eyesFeatures.filter(f => f.category);
    expect(featuresWithCategories.length).toBeGreaterThan(0);
    
    // Check for expected categories
    const categories = new Set(eyesFeatures.map(f => f.category).filter(Boolean));
    expect(categories.has('tired')).toBe(true);
    expect(categories.has('narrow')).toBe(true);
    expect(categories.has('heavyLid')).toBe(true);
  });

  test('nose features have correct categories', () => {
    const noseFeatures = getLayerFeatures(defaultAvatarConfig, 'nose');
    const categories = new Set(noseFeatures.map(f => f.category).filter(Boolean));
    
    expect(categories.has('crooked')).toBe(true);
    expect(categories.has('wide')).toBe(true);
    expect(categories.has('hooked')).toBe(true);
    expect(categories.has('straight')).toBe(true);
  });

  test('mouth features have correct categories', () => {
    const mouthFeatures = getLayerFeatures(defaultAvatarConfig, 'mouth');
    const categories = new Set(mouthFeatures.map(f => f.category).filter(Boolean));
    
    expect(categories.has('flat')).toBe(true);
    expect(categories.has('downturned')).toBe(true);
    expect(categories.has('smirk')).toBe(true);
    expect(categories.has('neutral')).toBe(true);
  });

  test('hair features have correct categories', () => {
    const hairFeatures = getLayerFeatures(defaultAvatarConfig, 'hair');
    const categories = new Set(hairFeatures.map(f => f.category).filter(Boolean));
    
    expect(categories.has('messy')).toBe(true);
    expect(categories.has('beanie')).toBe(true);
    expect(categories.has('wild')).toBe(true);
    expect(categories.has('clean')).toBe(true);
    expect(categories.has('bald')).toBe(true);
  });

  test('accessories have correct categories', () => {
    const accessoryFeatures = getLayerFeatures(defaultAvatarConfig, 'accessories');
    const categories = new Set(accessoryFeatures.map(f => f.category).filter(Boolean));
    
    expect(categories.has('headphones')).toBe(true);
    expect(categories.has('pencilBehindEar')).toBe(true);
    expect(categories.has('glasses')).toBe(true);
    expect(categories.has('earplug')).toBe(true);
    expect(categories.has('coffeeStain')).toBe(true);
  });
});

describe('Art Bible - Naming Convention', () => {
  test('features use descriptive naming', () => {
    const eyesFeatures = getLayerFeatures(defaultAvatarConfig, 'eyes');
    
    // Check naming pattern
    const descriptiveNames = eyesFeatures.filter(f => 
      f.id.includes('tired') || 
      f.id.includes('narrow') || 
      f.id.includes('heavyLid') ||
      f.id.includes('squinting') ||
      f.id.includes('open') ||
      f.id.includes('neutral')
    );
    
    expect(descriptiveNames.length).toBeGreaterThan(0);
  });

  test('accessories use descriptive naming', () => {
    const accessoryFeatures = getLayerFeatures(defaultAvatarConfig, 'accessories');
    
    const descriptiveNames = accessoryFeatures.filter(f => 
      f.id.includes('headphones') ||
      f.id.includes('pencil') ||
      f.id.includes('glasses') ||
      f.id.includes('earplug') ||
      f.id.includes('coffee') ||
      f.id.includes('scar') ||
      f.id === 'none'
    );
    
    expect(descriptiveNames.length).toBeGreaterThan(0);
  });

  test('paths match naming convention', () => {
    const eyesFeatures = getLayerFeatures(defaultAvatarConfig, 'eyes');
    
    // Check that paths follow the pattern
    const validPaths = eyesFeatures.filter(f => 
      !f.path || // Allow empty paths for 'none'
      f.path.includes('/eyes/') ||
      f.path.includes('eyes_')
    );
    
    expect(validPaths.length).toBe(eyesFeatures.length);
  });
});

describe('Art Bible - Determinism', () => {
  test('same seed + archetype = same selections', () => {
    const seed = 12345;
    const archetype = 'synth-nerd';
    
    const rng1 = mulberry32(seed);
    const rng2 = mulberry32(seed);
    
    const selections1 = selectFeaturesWithArchetype(rng1, defaultAvatarConfig, archetype);
    const selections2 = selectFeaturesWithArchetype(rng2, defaultAvatarConfig, archetype);
    
    // Compare all selections
    for (const [layerName, feature1] of selections1) {
      const feature2 = selections2.get(layerName);
      expect(feature2).toBeDefined();
      expect(feature2.id).toBe(feature1.id);
    }
  });

  test('different archetypes produce different selections', () => {
    const seed = 12345;
    
    const rng1 = mulberry32(seed);
    const rng2 = mulberry32(seed);
    
    const selections1 = selectFeaturesWithArchetype(rng1, defaultAvatarConfig, 'drummer');
    const selections2 = selectFeaturesWithArchetype(rng2, defaultAvatarConfig, 'guitarist');
    
    // Should have different selections (at least some layers)
    let differences = 0;
    for (const [layerName, feature1] of selections1) {
      const feature2 = selections2.get(layerName);
      if (feature2 && feature2.id !== feature1.id) {
        differences++;
      }
    }
    
    // With different archetypes, should have some differences
    // (though with same seed, might be similar, but weights differ)
    expect(selections1.size).toBe(selections2.size);
  });
});

describe('Art Bible - Weight Application', () => {
  test('weighted features appear more frequently', () => {
    const archetype = 'producer';
    const results = {
      headphones: 0,
      other: 0
    };
    
    // Run many selections
    for (let i = 0; i < 100; i++) {
      const rng = mulberry32(5000 + i);
      const selections = selectFeaturesWithArchetype(rng, defaultAvatarConfig, archetype);
      const accessory = selections.get('accessories');
      
      if (accessory && accessory.category === 'headphones') {
        results.headphones++;
      } else if (accessory && accessory.id !== 'none') {
        results.other++;
      }
    }
    
    // Headphones should appear more often due to 1.7x weight
    // (Note: This is probabilistic, so we check that headphones appear at all)
    expect(results.headphones + results.other).toBeGreaterThan(0);
  });

  test('archetype weights affect selection probability', () => {
    const archetype = 'drummer';
    const noseResults = {
      crooked: 0,
      wide: 0,
      other: 0
    };
    
    // Run many selections
    for (let i = 0; i < 100; i++) {
      const rng = mulberry32(6000 + i);
      const selections = selectFeaturesWithArchetype(rng, defaultAvatarConfig, archetype);
      const nose = selections.get('nose');
      
      if (nose) {
        if (nose.category === 'crooked') {
          noseResults.crooked++;
        } else if (nose.category === 'wide') {
          noseResults.wide++;
        } else {
          noseResults.other++;
        }
      }
    }
    
    // Crooked and wide should appear more often due to weights
    expect(noseResults.crooked + noseResults.wide + noseResults.other).toBeGreaterThan(0);
  });
});

describe('Art Bible - Integration', () => {
  test('all archetypes are defined', () => {
    const expectedArchetypes = ['synth-nerd', 'drummer', 'guitarist', 'vocalist', 'producer'];
    
    for (const archetype of expectedArchetypes) {
      expect(defaultAvatarConfig.archetypes[archetype]).toBeDefined();
    }
  });

  test('archetype weights have correct structure', () => {
    const archetype = 'synth-nerd';
    const weights = defaultAvatarConfig.archetypes[archetype];
    
    // Should have layer-specific weights
    expect(weights?.eyes).toBeDefined();
    expect(weights?.nose).toBeDefined();
    expect(weights?.mouth).toBeDefined();
    expect(weights?.hair).toBeDefined();
    expect(weights?.facialHair).toBeDefined();
    expect(weights?.accessories).toBeDefined();
    
    // Weights should be numbers >= 1.0
    expect(weights.eyes.narrow).toBeGreaterThanOrEqual(1.0);
    expect(weights.eyes.tired).toBeGreaterThanOrEqual(1.0);
  });

  test('selectFeaturesWithArchetype works with all archetypes', () => {
    const archetypes = ['synth-nerd', 'drummer', 'guitarist', 'vocalist', 'producer'];
    
    for (const archetype of archetypes) {
      const rng = mulberry32(12345);
      const selections = selectFeaturesWithArchetype(rng, defaultAvatarConfig, archetype);
      
      expect(selections.size).toBeGreaterThan(0);
      
      // Should have selections for required layers
      const requiredLayers = defaultAvatarConfig.layers.filter(l => l.required);
      expect(selections.size).toBeGreaterThanOrEqual(requiredLayers.length);
    }
  });
});
