/**
 * Tests for Procedural Avatar System
 * 
 * Tests:
 * - Seeded RNG determinism
 * - Feature selection
 * - Canvas drawing
 * - Caching
 */

import { mulberry32, seededRNG, jitter, pick, pickWeighted, randomInt, randomFloat } from '../avatar/rng.js';
import { defaultAvatarConfig, getLayerFeatures, getLayerConfig } from '../avatar/avatarConfig.js';
import { selectFeature, selectAllFeatures, selectFeaturesWithArchetype } from '../avatar/selectFeatures.js';
import { loadImage, drawLayer, drawAvatar } from '../avatar/drawAvatar.js';

// Mock canvas for testing
class MockCanvas {
  constructor(width = 512, height = 512) {
    this.width = width;
    this.height = height;
    this.operations = [];
  }

  getContext(type) {
    if (type === '2d') {
      return {
        canvas: this,
        clearRect: jest.fn(),
        fillRect: jest.fn(),
        drawImage: jest.fn(),
        save: jest.fn(),
        restore: jest.fn(),
        translate: jest.fn(),
        rotate: jest.fn(),
        globalAlpha: 1,
        fillStyle: '#FFFFFF'
      };
    }
    return null;
  }
}

describe('Seeded RNG', () => {
  test('mulberry32 generates deterministic numbers', () => {
    const rng1 = mulberry32(12345);
    const rng2 = mulberry32(12345);
    
    // Same seed should produce same sequence
    for (let i = 0; i < 10; i++) {
      expect(rng1()).toBe(rng2());
    }
  });

  test('mulberry32 generates different sequences for different seeds', () => {
    const rng1 = mulberry32(12345);
    const rng2 = mulberry32(67890);
    
    // Different seeds should produce different sequences
    const values1 = Array.from({ length: 10 }, () => rng1());
    const values2 = Array.from({ length: 10 }, () => rng2());
    
    expect(values1).not.toEqual(values2);
  });

  test('seededRNG works with string seeds', () => {
    const rng1 = seededRNG('test-seed');
    const rng2 = seededRNG('test-seed');
    
    // Same string seed should produce same sequence
    for (let i = 0; i < 10; i++) {
      expect(rng1()).toBe(rng2());
    }
  });

  test('jitter generates values in correct range', () => {
    const rng = mulberry32(12345);
    const range = 10;
    
    for (let i = 0; i < 100; i++) {
      const value = jitter(rng, range);
      expect(value).toBeGreaterThanOrEqual(-range / 2);
      expect(value).toBeLessThanOrEqual(range / 2);
    }
  });

  test('pick selects from array', () => {
    const rng = mulberry32(12345);
    const items = ['a', 'b', 'c', 'd'];
    
    const selected = pick(rng, items);
    expect(items).toContain(selected);
  });

  test('pickWeighted respects weights', () => {
    const rng = mulberry32(12345);
    const weighted = [
      ['common', 10],
      ['rare', 1]
    ];
    
    // Run many times and check that common appears more often
    const results = Array.from({ length: 100 }, () => pickWeighted(rng, weighted));
    const commonCount = results.filter(r => r === 'common').length;
    
    expect(commonCount).toBeGreaterThan(50); // Should be much more common
  });

  test('randomInt generates integers in range', () => {
    const rng = mulberry32(12345);
    const min = 5;
    const max = 15;
    
    for (let i = 0; i < 100; i++) {
      const value = randomInt(rng, min, max);
      expect(Number.isInteger(value)).toBe(true);
      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThan(max);
    }
  });

  test('randomFloat generates floats in range', () => {
    const rng = mulberry32(12345);
    const min = 0.5;
    const max = 1.5;
    
    for (let i = 0; i < 100; i++) {
      const value = randomFloat(rng, min, max);
      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThan(max);
    }
  });
});

describe('Avatar Configuration', () => {
  test('defaultAvatarConfig has required structure', () => {
    expect(defaultAvatarConfig).toHaveProperty('canvasSize');
    expect(defaultAvatarConfig).toHaveProperty('layers');
    expect(Array.isArray(defaultAvatarConfig.layers)).toBe(true);
    expect(defaultAvatarConfig.layers.length).toBeGreaterThan(0);
  });

  test('layers have required properties', () => {
    for (const layer of defaultAvatarConfig.layers) {
      expect(layer).toHaveProperty('name');
      expect(layer).toHaveProperty('features');
      expect(layer).toHaveProperty('required');
      expect(layer).toHaveProperty('jitter');
      expect(Array.isArray(layer.features)).toBe(true);
    }
  });

  test('getLayerFeatures returns correct features', () => {
    const headFeatures = getLayerFeatures(defaultAvatarConfig, 'head');
    expect(Array.isArray(headFeatures)).toBe(true);
    expect(headFeatures.length).toBeGreaterThan(0);
  });

  test('getLayerConfig returns layer configuration', () => {
    const headConfig = getLayerConfig(defaultAvatarConfig, 'head');
    expect(headConfig).toBeDefined();
    expect(headConfig?.name).toBe('head');
  });
});

describe('Feature Selection', () => {
  test('selectFeature returns a valid feature', () => {
    const rng = mulberry32(12345);
    const features = getLayerFeatures(defaultAvatarConfig, 'head');
    
    const selected = selectFeature(rng, features);
    expect(features).toContain(selected);
  });

  test('selectAllFeatures returns selections for all layers', () => {
    const rng = mulberry32(12345);
    const selections = selectAllFeatures(rng, defaultAvatarConfig);
    
    // Should have selections for all required layers
    const requiredLayers = defaultAvatarConfig.layers.filter(l => l.required);
    expect(selections.size).toBeGreaterThanOrEqual(requiredLayers.length);
  });

  test('selectFeaturesWithArchetype applies archetype weights', () => {
    const rng = mulberry32(12345);
    const selections = selectFeaturesWithArchetype(rng, defaultAvatarConfig, 'drummer');
    
    expect(selections.size).toBeGreaterThan(0);
    // Archetype should influence selection (hard to test deterministically)
  });

  test('selectFeature handles empty features array', () => {
    const rng = mulberry32(12345);
    expect(() => selectFeature(rng, [])).toThrow('No features available');
  });
});

describe('Canvas Drawing', () => {
  test('loadImage handles empty path', async () => {
    const img = await loadImage('');
    expect(img).toBeDefined();
    expect(img.width).toBe(0);
    expect(img.height).toBe(0);
  });

  test('drawLayer applies jitter correctly', () => {
    const canvas = new MockCanvas();
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.width = 100;
    img.height = 100;
    
    const layer = getLayerConfig(defaultAvatarConfig, 'head');
    if (!layer) {
      throw new Error('Head layer not found');
    }
    
    const rng = mulberry32(12345);
    
    // Should not throw
    expect(() => drawLayer(ctx, img, layer, rng)).not.toThrow();
  });

  test('drawLayer skips empty images', () => {
    const canvas = new MockCanvas();
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.width = 0;
    img.height = 0;
    
    const layer = getLayerConfig(defaultAvatarConfig, 'head');
    if (!layer) {
      throw new Error('Head layer not found');
    }
    
    const rng = mulberry32(12345);
    
    // Should not throw and should not draw
    expect(() => drawLayer(ctx, img, layer, rng)).not.toThrow();
    expect(ctx.drawImage).not.toHaveBeenCalled();
  });
});

describe('Determinism', () => {
  test('same seed produces same feature selections', () => {
    const seed = 12345;
    const rng1 = mulberry32(seed);
    const rng2 = mulberry32(seed);
    
    const selections1 = selectAllFeatures(rng1, defaultAvatarConfig);
    const selections2 = selectAllFeatures(rng2, defaultAvatarConfig);
    
    // Compare selections
    for (const [layerName, feature1] of selections1) {
      const feature2 = selections2.get(layerName);
      expect(feature2).toBeDefined();
      expect(feature2?.id).toBe(feature1.id);
    }
  });
});
