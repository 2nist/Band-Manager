/**
 * loadDataset - Load JSON datasets in both Node.js and browser environments
 * 
 * Handles loading JSON files for music generation engines.
 * In Node.js: uses fs.readFileSync
 * In browser: uses dynamic import with fetch fallback
 */

let drumPatternsCache = null;
let progressionsCache = null;
let phrasesCache = null;

/**
 * Check if running in Node.js
 */
function isNode() {
  return typeof process !== 'undefined' && process.versions && process.versions.node;
}

/**
 * Load dataset (Node.js or browser)
 */
export async function loadDataset(datasetName) {
  // Check cache first
  if (datasetName === 'drums' && drumPatternsCache) return drumPatternsCache;
  if (datasetName === 'progressions' && progressionsCache) return progressionsCache;
  if (datasetName === 'phrases' && phrasesCache) return phrasesCache;

  let data = null;

  if (isNode()) {
    // Node.js: use fs
    try {
      const fs = await import('fs');
      const path = await import('path');
      const { fileURLToPath } = await import('url');
      
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      
      const fileMap = {
        drums: path.resolve(__dirname, '../assets/core/drums-core.json'),
        progressions: path.resolve(__dirname, '../assets/core/progressions-core.json'),
        phrases: path.resolve(__dirname, '../assets/core/phrases-bimmuda.json')
      };
      
      const filePath = fileMap[datasetName];
      if (filePath) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        data = JSON.parse(fileContent);
      }
    } catch (error) {
      console.warn(`Failed to load ${datasetName} in Node.js:`, error);
      return null;
    }
  } else {
    // Browser: use fetch
    try {
      const fileMap = {
        drums: '/src/music/assets/core/drums-core.json',
        progressions: '/src/music/assets/core/progressions-core.json',
        phrases: '/src/music/assets/core/phrases-bimmuda.json'
      };
      
      const filePath = fileMap[datasetName];
      if (filePath) {
        const response = await fetch(filePath);
        if (response.ok) {
          data = await response.json();
        }
      }
    } catch (error) {
      console.warn(`Failed to load ${datasetName} in browser:`, error);
      return null;
    }
  }

  // Cache result
  if (data) {
    if (datasetName === 'drums') drumPatternsCache = data;
    if (datasetName === 'progressions') progressionsCache = data;
    if (datasetName === 'phrases') phrasesCache = data;
  }

  return data;
}

/**
 * Clear all caches
 */
export function clearDatasetCache() {
  drumPatternsCache = null;
  progressionsCache = null;
  phrasesCache = null;
}
