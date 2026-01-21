#!/usr/bin/env node
/**
 * ingest-chords.js - CLI tool for processing Chordonomicon progressions
 * 
 * Usage:
 *   node scripts/ingest-chords.js --input src/music/datasets/Chordonomicon-partial --output src/music/assets/core/progressions-core.json --limit 30
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import processor
import { ChordonomiconProcessor } from '../src/music/preprocessing/harmony/ChordonomiconProcessor.js';

/**
 * Recursively find all JSON files in a directory
 */
function findJsonFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findJsonFiles(filePath, fileList);
    } else if (file.endsWith('.json')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

/**
 * Parse Chordonomicon JSON file and extract progressions
 */
function parseChordonomiconFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    const progressions = [];
    
    // Extract progressions from sections
    if (data.sections && Array.isArray(data.sections)) {
      data.sections.forEach((section, index) => {
        if (section.chords && Array.isArray(section.chords) && section.chords.length > 0) {
          // Use rawChords if available, otherwise use chords
          const chords = section.rawChords || section.chords;
          
          // Filter out invalid chords and normalize
          const validChords = chords
            .filter(c => c && typeof c === 'string' && c.trim().length > 0)
            .map(c => c.trim());
          
          if (validChords.length > 0) {
            progressions.push({
              chords: validChords,
              name: section.type || `section_${index}`,
              sourceFile: path.basename(filePath),
              songTitle: data.title || data.songID || 'Unknown',
              artist: data.artist || 'Unknown'
            });
          }
        }
      });
    }
    
    return progressions;
  } catch (error) {
    console.warn(`Failed to parse ${filePath}: ${error.message}`);
    return [];
  }
}

/**
 * Process Chordonomicon progressions
 */
async function processChordProgressions(inputDir, outputFile, options = {}) {
  const { limit = 30 } = options;
  
  console.log(`\n🎹 Processing Chordonomicon progressions from: ${inputDir}`);
  console.log(`📁 Output: ${outputFile}`);
  console.log(`🔢 Limit: ${limit} progressions for core set\n`);
  
  // Resolve paths
  const inputPath = path.resolve(__dirname, '..', inputDir);
  const outputPath = path.resolve(__dirname, '..', outputFile);
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Find all JSON files
  console.log('🔍 Scanning for JSON files...');
  const jsonFiles = findJsonFiles(inputPath);
  console.log(`   Found ${jsonFiles.length} JSON files\n`);
  
  if (jsonFiles.length === 0) {
    console.error('❌ No JSON files found!');
    process.exit(1);
  }
  
  // Process JSON files
  console.log('⚙️  Processing JSON files...');
  const allProgressions = [];
  let processedCount = 0;
  let failedCount = 0;
  
  for (const jsonFile of jsonFiles) {
    const progressions = parseChordonomiconFile(jsonFile);
    if (progressions.length === 0) {
      failedCount++;
      continue;
    }
    
    allProgressions.push(...progressions);
    processedCount++;
    
    if (processedCount % 100 === 0) {
      process.stdout.write(`   Processed ${processedCount} files...\r`);
    }
  }
  
  console.log(`\n✅ Extracted ${allProgressions.length} progressions from ${processedCount} files`);
  if (failedCount > 0) {
    console.log(`⚠️  Failed to process ${failedCount} files`);
  }
  
  // Process through ChordonomiconProcessor
  console.log('\n⚙️  Processing through ChordonomiconProcessor...');
  const processedProgressions = [];
  
  for (const progression of allProgressions) {
    try {
      const processed = ChordonomiconProcessor.processProgression(progression, {
        id: progression.sourceFile.replace(/[^a-zA-Z0-9]/g, '_') + '_' + progression.name,
        name: progression.name
      });
      processedProgressions.push(processed);
    } catch (error) {
      console.warn(`   Warning: Failed to process progression: ${error.message}`);
    }
  }
  
  console.log(`✅ Processed ${processedProgressions.length} progressions\n`);
  
  // Select top quality progressions for core set
  console.log('🎯 Selecting core set...');
  
  // Sort by quality (catchiness + familiarity)
  const scored = processedProgressions.map(prog => ({
    progression: prog,
    score: (prog.catchiness || 0) + (prog.familiarity || 0)
  }));
  
  scored.sort((a, b) => b.score - a.score);
  
  // Select diverse set
  const coreSet = [];
  const chordPatterns = new Set();
  
  for (const { progression } of scored) {
    if (coreSet.length >= limit) break;
    
    // Check for diversity (avoid exact duplicates)
    const chordStr = progression.chords.join('-');
    if (!chordPatterns.has(chordStr)) {
      coreSet.push(progression);
      chordPatterns.add(chordStr);
    }
  }
  
  console.log(`   Selected ${coreSet.length} progressions for core set\n`);
  
  // Write core set
  fs.writeFileSync(outputPath, JSON.stringify(coreSet, null, 2));
  console.log(`✅ Core set written to: ${outputPath}`);
  console.log(`   Progressions: ${coreSet.length}`);
  console.log(`   File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB\n`);
}

// CLI argument parsing
const args = process.argv.slice(2);
const inputIndex = args.indexOf('--input');
const outputIndex = args.indexOf('--output');
const limitIndex = args.indexOf('--limit');

const inputDir = inputIndex >= 0 ? args[inputIndex + 1] : 'src/music/datasets/Chordonomicon-partial';
const outputFile = outputIndex >= 0 ? args[outputIndex + 1] : 'src/music/assets/core/progressions-core.json';
const limit = limitIndex >= 0 ? parseInt(args[limitIndex + 1]) : 30;

processChordProgressions(inputDir, outputFile, { limit }).catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
