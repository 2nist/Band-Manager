#!/usr/bin/env node
/**
 * ingest-melodies.js - CLI tool for processing melody phrases
 * 
 * Supports:
 * - Classical MIDI JSON files (When in Rome Classical-curated)
 * - BIMMUDA MIDI files (pop songs)
 * 
 * Usage:
 *   node scripts/ingest-melodies.js --input src/music/datasets/When\ in\ Rome\ Classical-curated --output src/music/assets/core/phrases-core.json --limit 50
 *   node scripts/ingest-melodies.js --input src/music/datasets/bimmuda_dataset --output src/music/assets/core/phrases-bimmuda.json --limit 50
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import MidiParser from 'midi-parser-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import processor
import { LakhProcessor } from '../src/music/preprocessing/melody/LakhProcessor.js';

/**
 * Recursively find all MIDI files in a directory
 */
function findMidiFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findMidiFiles(filePath, fileList);
    } else if (file.endsWith('.mid') || file.endsWith('.midi')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

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
 * Parse MIDI file and extract melody
 */
function parseMidiMelody(filePath) {
  try {
    const midiBuffer = fs.readFileSync(filePath);
    const midiData = MidiParser.parse(midiBuffer);
    
    // Extract melody notes (non-drum tracks, typically channel 0-8)
    const melodyNotes = [];
    const ticksPerQuarter = midiData.timeDivision || 480;
    const ticksPerBeat = ticksPerQuarter / 4;
    
    // Find melody track (usually first non-drum track)
    midiData.track.forEach(track => {
      if (!track.event) return;
      
      let currentTick = 0;
      const trackNotes = [];
      
      track.event.forEach(event => {
        if (event.deltaTime !== undefined) {
          currentTick += event.deltaTime;
        }
        
        // Check for note-on events (not channel 9/drums)
        if (event.type === 9 && event.channel !== 9 && event.data && event.data[1] > 0) {
          const note = event.data[0];
          const velocity = event.data[1];
          const beatPosition = currentTick / ticksPerBeat;
          
          trackNotes.push({
            note,
            beat: beatPosition,
            velocity
          });
        }
      });
      
      if (trackNotes.length > 0) {
        melodyNotes.push(...trackNotes);
      }
    });
    
    if (melodyNotes.length === 0) return null;
    
    // Convert MIDI notes to scale degrees (simplified - relative to C)
    // Find the most common note as root (simplified approach)
    const noteCounts = {};
    melodyNotes.forEach(n => {
      noteCounts[n.note] = (noteCounts[n.note] || 0) + 1;
    });
    const rootNote = parseInt(Object.entries(noteCounts)
      .sort((a, b) => b[1] - a[1])[0][0]);
    
    // Convert to scale degrees (0-11, then normalize to 0-7)
    const scaleDegrees = melodyNotes
      .map(n => (n.note - rootNote) % 12)
      .filter(n => n <= 7); // Keep within one octave
    
    // Calculate durations (simplified - equal durations)
    const durations = Array(scaleDegrees.length).fill(0.5);
    
    return {
      scale_degrees: scaleDegrees,
      durations,
      sourceFile: path.basename(filePath)
    };
  } catch (error) {
    console.warn(`Failed to parse MIDI ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Parse Classical JSON file and extract melody phrases
 */
function parseClassicalJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Classical JSON has sections with chord information
    // For melody extraction, we'd need note data which may not be in this format
    // For now, return null - this format may need different handling
    return null;
  } catch (error) {
    console.warn(`Failed to parse JSON ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Process melody phrases
 */
async function processMelodyPhrases(inputDir, outputFile, options = {}) {
  const { limit = 50 } = options;
  
  console.log(`\n🎵 Processing melody phrases from: ${inputDir}`);
  console.log(`📁 Output: ${outputFile}`);
  console.log(`🔢 Limit: ${limit} phrases for core set\n`);
  
  // Resolve paths
  const inputPath = path.resolve(__dirname, '..', inputDir);
  const outputPath = path.resolve(__dirname, '..', outputFile);
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Find files
  console.log('🔍 Scanning for files...');
  const midiFiles = findMidiFiles(inputPath);
  const jsonFiles = findJsonFiles(inputPath);
  console.log(`   Found ${midiFiles.length} MIDI files and ${jsonFiles.length} JSON files\n`);
  
  if (midiFiles.length === 0 && jsonFiles.length === 0) {
    console.error('❌ No files found!');
    process.exit(1);
  }
  
  // Process files
  console.log('⚙️  Processing files...');
  const allPhrases = [];
  let processedCount = 0;
  let failedCount = 0;
  
  // Process MIDI files
  for (const midiFile of midiFiles) {
    const phrase = parseMidiMelody(midiFile);
    if (!phrase) {
      failedCount++;
      continue;
    }
    
    allPhrases.push(phrase);
    processedCount++;
    
    if (processedCount % 100 === 0) {
      process.stdout.write(`   Processed ${processedCount} files...\r`);
    }
  }
  
  // Process JSON files (if any)
  for (const jsonFile of jsonFiles) {
    const phrase = parseClassicalJson(jsonFile);
    if (!phrase) {
      // JSON format may not have melody data - skip for now
      continue;
    }
    
    allPhrases.push(phrase);
    processedCount++;
  }
  
  console.log(`\n✅ Extracted ${allPhrases.length} phrases from ${processedCount} files`);
  if (failedCount > 0) {
    console.log(`⚠️  Failed to process ${failedCount} files`);
  }
  
  // Process through LakhProcessor
  console.log('\n⚙️  Processing through LakhProcessor...');
  const processedPhrases = [];
  
  for (const phrase of allPhrases) {
    if (!phrase.scale_degrees || phrase.scale_degrees.length === 0) continue;
    
    try {
      const processed = LakhProcessor.processPhrase(phrase, {
        id: phrase.sourceFile ? phrase.sourceFile.replace(/[^a-zA-Z0-9]/g, '_') : `phrase_${processedPhrases.length}`,
        length_bars: Math.ceil(phrase.scale_degrees.length / 4)
      });
      processedPhrases.push(processed);
    } catch (error) {
      console.warn(`   Warning: Failed to process phrase: ${error.message}`);
    }
  }
  
  console.log(`✅ Processed ${processedPhrases.length} phrases\n`);
  
  // Select diverse set
  console.log('🎯 Selecting core set...');
  
  // Sort by quality (hook potential + phrase function)
  const scored = processedPhrases.map(phrase => ({
    phrase,
    score: (phrase.phrase_function?.hook_potential || 0) + 
           (phrase.phrase_function?.solo_potential || 0)
  }));
  
  scored.sort((a, b) => b.score - a.score);
  
  // Select diverse set
  const coreSet = [];
  const phrasePatterns = new Set();
  
  for (const { phrase } of scored) {
    if (coreSet.length >= limit) break;
    
    // Check for diversity
    const patternStr = phrase.scale_degrees.join('-');
    if (!phrasePatterns.has(patternStr)) {
      coreSet.push(phrase);
      phrasePatterns.add(patternStr);
    }
  }
  
  console.log(`   Selected ${coreSet.length} phrases for core set\n`);
  
  // Write core set
  fs.writeFileSync(outputPath, JSON.stringify(coreSet, null, 2));
  console.log(`✅ Core set written to: ${outputPath}`);
  console.log(`   Phrases: ${coreSet.length}`);
  console.log(`   File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB\n`);
}

// CLI argument parsing
const args = process.argv.slice(2);
const inputIndex = args.indexOf('--input');
const outputIndex = args.indexOf('--output');
const limitIndex = args.indexOf('--limit');

const inputDir = inputIndex >= 0 ? args[inputIndex + 1] : 'src/music/datasets/When in Rome Classical-curated';
const outputFile = outputIndex >= 0 ? args[outputIndex + 1] : 'src/music/assets/core/phrases-core.json';
const limit = limitIndex >= 0 ? parseInt(args[limitIndex + 1]) : 50;

processMelodyPhrases(inputDir, outputFile, { limit }).catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
