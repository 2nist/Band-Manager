#!/usr/bin/env node
/**
 * ingest-egmd.js - CLI tool for processing E-GMD drum patterns
 * 
 * Usage:
 *   node scripts/ingest-egmd.js --input src/music/datasets/e-gmd --output src/music/assets/core/drums-core.json --limit 24
 * 
 * Processes E-GMD MIDI files and generates constraint-ready drum pattern schemas.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import MidiParser from 'midi-parser-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import processor
import { EGMDProcessor } from '../src/music/preprocessing/drums/EGMDProcessor.js';

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
 * Parse MIDI file and extract drum pattern
 */
function parseMidiFile(filePath) {
  try {
    const midiBuffer = fs.readFileSync(filePath);
    const midiData = MidiParser.parse(midiBuffer);
    
    // Extract tempo from first track
    let tempo = 120; // Default
    if (midiData.track && midiData.track[0] && midiData.track[0].event) {
      const tempoEvent = midiData.track[0].event.find(e => e.type === 255 && e.metaType === 81);
      if (tempoEvent && tempoEvent.data) {
        // Convert microseconds per quarter note to BPM
        const microsecondsPerQuarter = (tempoEvent.data[0] << 16) | (tempoEvent.data[1] << 8) | tempoEvent.data[2];
        tempo = Math.round(60000000 / microsecondsPerQuarter);
      }
    }
    
    // Extract drum notes (channel 9, notes 35-81)
    // MIDI drum notes: 35=kick, 38=snare, 42=hihat closed, 46=hihat open, etc.
    const drumNotes = {
      kick: [],      // Note 35, 36
      snare: [],     // Note 38, 40
      hihat: [],     // Note 42, 44, 46
      ghostSnare: [] // Note 38 with low velocity
    };
    
    const ticksPerQuarter = midiData.timeDivision || 480;
    const ticksPerBeat = ticksPerQuarter / 4; // Assuming 4/4 time
    let totalTicks = 0;
    
    // Find drum track - check all tracks for channel 9 events
    let foundDrumEvents = false;
    
    midiData.track.forEach(track => {
      if (!track.event) return;
      
      let currentTick = 0;
      track.event.forEach(event => {
        // Update current tick
        if (event.deltaTime !== undefined) {
          currentTick += event.deltaTime;
        }
        
        // Check for note-on events (type 9) on channel 9 (drums)
        // Also check if event has channel property or if it's in the data
        let channel = event.channel;
        let noteOn = false;
        let note = null;
        let velocity = null;
        
        // Handle different MIDI parser output formats
        if (event.type === 9) {
          // Note-on event
          noteOn = true;
          if (event.data && event.data.length >= 2) {
            note = event.data[0];
            velocity = event.data[1];
            // Channel might be in event.channel or derived from type
            if (channel === undefined) {
              channel = 9; // Assume drums if not specified
            }
          }
        } else if (event.type === 8) {
          // Note-off event - skip
          return;
        } else if (event.type === undefined && event.note !== undefined) {
          // Alternative format
          note = event.note;
          velocity = event.velocity || 100;
          channel = event.channel || 9;
          noteOn = velocity > 0;
        }
        
        // Process drum notes on channel 9
        if (noteOn && channel === 9 && note !== null && velocity > 0) {
          foundDrumEvents = true;
          const beatPosition = currentTick / ticksPerBeat;
          
          // Map MIDI notes to drum sounds (extended mapping)
          if (note === 35 || note === 36) {
            // Kick drum
            drumNotes.kick.push(beatPosition);
          } else if (note === 38 || note === 40) {
            // Snare drum
            if (velocity < 60) {
              drumNotes.ghostSnare.push(beatPosition);
            } else {
              drumNotes.snare.push(beatPosition);
            }
          } else if (note === 42 || note === 44 || note === 46 || note === 49) {
            // Hihat (closed, open, pedal)
            drumNotes.hihat.push(beatPosition);
          } else if (note >= 35 && note <= 81) {
            // Other percussion - try to categorize
            if (note <= 37) {
              // Low drums - treat as kick
              drumNotes.kick.push(beatPosition);
            } else if (note >= 38 && note <= 40) {
              // Snare variants
              if (velocity < 60) {
                drumNotes.ghostSnare.push(beatPosition);
              } else {
                drumNotes.snare.push(beatPosition);
              }
            } else if (note >= 42 && note <= 46) {
              // Hihat variants
              drumNotes.hihat.push(beatPosition);
            }
          }
        }
        
        totalTicks = Math.max(totalTicks, currentTick);
      });
    });
    
    // If no drum events found, try alternative parsing
    if (!foundDrumEvents || (drumNotes.kick.length === 0 && drumNotes.snare.length === 0 && drumNotes.hihat.length === 0)) {
      // Try parsing all tracks for any percussion-like notes
      midiData.track.forEach(track => {
        if (!track.event) return;
        
        let currentTick = 0;
        track.event.forEach(event => {
          if (event.deltaTime !== undefined) {
            currentTick += event.deltaTime;
          }
          
          // Look for any note events in percussion range
          if (event.type === 9 && event.data && event.data.length >= 2) {
            const note = event.data[0];
            const velocity = event.data[1];
            
            if (note >= 35 && note <= 81 && velocity > 0) {
              const beatPosition = currentTick / ticksPerBeat;
              
              // Categorize by note range
              if (note <= 37) {
                drumNotes.kick.push(beatPosition);
              } else if (note >= 38 && note <= 40) {
                if (velocity < 60) {
                  drumNotes.ghostSnare.push(beatPosition);
                } else {
                  drumNotes.snare.push(beatPosition);
                }
              } else if (note >= 42 && note <= 46) {
                drumNotes.hihat.push(beatPosition);
              }
            }
          }
        });
      });
    }
    
    // Normalize beat positions to 4-bar pattern (0-16 beats)
    const totalBeats = totalTicks / ticksPerBeat;
    const bars = Math.ceil(totalBeats / 4);
    
    // Normalize to first 4 bars (or pattern length)
    const normalizeBeats = (beats) => {
      return beats
        .map(beat => beat % 4) // Wrap to 4-beat pattern
        .filter((beat, index, arr) => arr.indexOf(beat) === index) // Remove duplicates
        .sort((a, b) => a - b);
    };
    
    return {
      beats: {
        kick: normalizeBeats(drumNotes.kick),
        snare: normalizeBeats(drumNotes.snare),
        hihat: normalizeBeats(drumNotes.hihat),
        ghostSnare: normalizeBeats(drumNotes.ghostSnare)
      },
      bpm: tempo,
      signature: '4/4',
      sourceFile: path.basename(filePath)
    };
  } catch (error) {
    console.warn(`Failed to parse ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Process E-GMD patterns
 */
async function processEGMDPatterns(inputDir, outputFile, options = {}) {
  const { limit = 24, generateCoreSet = true } = options;
  
  console.log(`\n🎵 Processing E-GMD patterns from: ${inputDir}`);
  console.log(`📁 Output: ${outputFile}`);
  console.log(`🔢 Limit: ${limit} patterns for core set\n`);
  
  // Resolve paths
  const inputPath = path.resolve(__dirname, '..', inputDir);
  const outputPath = path.resolve(__dirname, '..', outputFile);
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Find all MIDI files
  console.log('🔍 Scanning for MIDI files...');
  const midiFiles = findMidiFiles(inputPath);
  console.log(`   Found ${midiFiles.length} MIDI files\n`);
  
  if (midiFiles.length === 0) {
    console.error('❌ No MIDI files found!');
    process.exit(1);
  }
  
  // Process MIDI files
  console.log('⚙️  Processing MIDI files...');
  const processedPatterns = [];
  let processedCount = 0;
  let failedCount = 0;
  
  for (const midiFile of midiFiles) {
    const parsed = parseMidiFile(midiFile);
    if (!parsed) {
      failedCount++;
      continue;
    }
    
    // Extract genre and tempo from file path
    const relativePath = path.relative(inputPath, midiFile);
    const pathParts = relativePath.split(path.sep);
    const genre = pathParts[0] || 'unknown';
    const tempoCategory = pathParts[1] || 'medium';
    
    // Extract BPM range from tempo category
    let bpmRange = [100, 120];
    if (tempoCategory.includes('slow')) bpmRange = [60, 80];
    else if (tempoCategory.includes('fast')) bpmRange = [120, 140];
    else if (tempoCategory.includes('very_fast')) bpmRange = [140, 200];
    else if (tempoCategory.includes('medium_80')) bpmRange = [80, 100];
    else if (tempoCategory.includes('medium_100')) bpmRange = [100, 120];
    
    // Generate pattern ID from file path
    const patternId = relativePath
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_mid$/, '')
      .toLowerCase();
    
    // Process through EGMDProcessor
    try {
      const processed = EGMDProcessor.processPattern(parsed, {
        id: patternId,
        signature: parsed.signature || '4/4',
        bpm: parsed.bpm || (bpmRange[0] + bpmRange[1]) / 2
      });
      
      processedPatterns.push(processed);
      processedCount++;
      
      if (processedCount % 100 === 0) {
        process.stdout.write(`   Processed ${processedCount} files...\r`);
      }
    } catch (error) {
      console.warn(`\n   Warning: Failed to process ${midiFile}: ${error.message}`);
      failedCount++;
    }
  }
  
  console.log(`\n✅ Processed ${processedCount} patterns successfully`);
  if (failedCount > 0) {
    console.log(`⚠️  Failed to process ${failedCount} files`);
  }
  
  // Generate core set if requested
  if (generateCoreSet && processedPatterns.length > 0) {
    console.log('\n🎯 Curating core set...');
    const coreSet = EGMDProcessor.curateCoreSet(processedPatterns);
    console.log(`   Selected ${coreSet.length} patterns for core set\n`);
    
    // Write core set
    fs.writeFileSync(outputPath, JSON.stringify(coreSet, null, 2));
    console.log(`✅ Core set written to: ${outputPath}`);
    console.log(`   Patterns: ${coreSet.length}`);
    console.log(`   File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB\n`);
  } else if (processedPatterns.length > 0) {
    // Write all processed patterns
    const limited = processedPatterns.slice(0, limit);
    fs.writeFileSync(outputPath, JSON.stringify(limited, null, 2));
    console.log(`✅ Processed patterns written to: ${outputPath}`);
    console.log(`   Patterns: ${limited.length}\n`);
  }
}

// CLI argument parsing
const args = process.argv.slice(2);
const inputIndex = args.indexOf('--input');
const outputIndex = args.indexOf('--output');
const limitIndex = args.indexOf('--limit');
const noCoreSetIndex = args.indexOf('--no-core-set');

const inputDir = inputIndex >= 0 ? args[inputIndex + 1] : 'src/music/datasets/e-gmd';
const outputFile = outputIndex >= 0 ? args[outputIndex + 1] : 'src/music/assets/core/drums-core.json';
const limit = limitIndex >= 0 ? parseInt(args[limitIndex + 1]) : 24;
const generateCoreSet = noCoreSetIndex === -1;

processEGMDPatterns(inputDir, outputFile, { limit, generateCoreSet }).catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
