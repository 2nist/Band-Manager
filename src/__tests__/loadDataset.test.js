/**
 * Tests for Dataset Loading Utility
 * 
 * Tests the loadDataset function that works in both Node.js and browser
 */

// Mock fs for Node.js environment
jest.mock('fs', () => ({
  readFileSync: jest.fn((path, encoding) => {
    if (path.includes('drums-core.json')) {
      return JSON.stringify([
        { id: 'test-drum-1', beats: { kick: [0, 2], snare: [1, 3], hihat: [0.5, 1.5] } }
      ]);
    }
    if (path.includes('progressions-core.json')) {
      return JSON.stringify([
        { chords: ['C', 'G', 'Am', 'F'], name: 'test-progression-1' }
      ]);
    }
    if (path.includes('phrases-bimmuda.json')) {
      return JSON.stringify([
        { scale_degrees: [0, 1, 2, 3], durations: [0.5, 0.5, 0.5, 0.5] }
      ]);
    }
    throw new Error('File not found');
  })
}));

// Mock path and fileURLToPath
jest.mock('path', () => ({
  resolve: jest.fn((...args) => args.join('/')),
  dirname: jest.fn((path) => path.substring(0, path.lastIndexOf('/')))
}));

jest.mock('url', () => ({
  fileURLToPath: jest.fn((url) => url.replace('file://', ''))
}));

describe('loadDataset', () => {
  // Note: loadDataset uses import.meta which Jest doesn't handle well
  // These tests verify the function exists and can be imported
  // Full testing would require ESM support or refactoring

  it('should export loadDataset function', () => {
    // Dynamic import to handle ESM
    return import('../music/utils/loadDataset.js').then(module => {
      expect(module.loadDataset).toBeDefined();
      expect(typeof module.loadDataset).toBe('function');
    });
  });

  it('should export clearDatasetCache function', () => {
    return import('../music/utils/loadDataset.js').then(module => {
      expect(module.clearDatasetCache).toBeDefined();
      expect(typeof module.clearDatasetCache).toBe('function');
    });
  });
});
