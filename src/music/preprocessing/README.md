# Music Generation Preprocessing Pipeline

This directory contains the preprocessing pipeline for converting raw music datasets (E-GMD, Chordonomicon, Lakh) into constraint-ready schemas for the GigMaster procedural music generation system.

## Architecture

### Base Utilities (`base/`)
- **PatternAnalyzer.js** - Core analysis functions (rhythmic density, energy curves, swing detection, etc.)
- **PsychologicalMapper.js** - Maps musical patterns to psychological characteristics
- **GenreClassifier.js** - Classifies patterns by genre and era

### Dataset Processors
- **drums/EGMDProcessor.js** - Processes E-GMD drum patterns
- **harmony/ChordonomiconProcessor.js** - Processes Chordonomicon chord progressions
- **melody/LakhProcessor.js** - Processes Lakh melody phrases

## Enhanced Schema Design

All processors output schemas with enhanced fields for constraint-based generation:

### Drum Patterns
```javascript
{
  id: string,
  signature: string,
  complexity: 'simple' | 'medium' | 'complex',
  beats: { kick: [], snare: [], hihat: [], ghostSnare: [] },
  bpmRange: [min, max],
  psychological_tags: {
    stress_appropriate: boolean,
    chaos_level: 0-1,
    confidence_required: 0-1,
    substance_vulnerability: 0-1,
    emotional_intensity: 0-1
  },
  genre_weights: { rock: 0-1, punk: 0-1, ... },
  gameplay_hooks: {
    fills: [],
    humanization_targets: [],
    showoff_moments: [],
    simplification_safe: []
  },
  energy_curve: number[],
  rhythmic_density: number,
  swing_factor: number,
  era_authenticity: { '60s': 0-1, ... }
}
```

### Chord Progressions
```javascript
{
  chords: string[],
  name: string,
  catchiness: 0-1,
  familiarity: 0-1,
  complexity: 0-1,
  vibe: string,
  era: string,
  mode: string,
  psychological_resonance: {
    corruption_level: 0-1,
    addiction_spiral: 0-1,
    depression_weight: 0-1,
    manic_energy: 0-1,
    paranoia_tension: 0-1,
    redemption_potential: 0-1
  },
  industry_context: {
    commercial_safety: 0-1,
    underground_cred: 0-1,
    label_friendly: 0-1,
    experimental_factor: 0-1
  },
  harmonic_analysis: { ... },
  gameplay_adaptations: { ... }
}
```

### Melody Phrases
```javascript
{
  scale_degrees: number[],
  durations: number[],
  style: string,
  range: [low, high],
  length_bars: number,
  difficulty_profile: {
    technical_skill: 0-1,
    timing_precision: 0-1,
    pitch_accuracy: 0-1,
    expression_complexity: 0-1
  },
  emotional_character: {
    triumph: 0-1,
    melancholy: 0-1,
    aggression: 0-1,
    vulnerability: 0-1,
    chaos: 0-1,
    hope: 0-1
  },
  phrase_function: {
    hook_potential: 0-1,
    verse_suitable: boolean,
    chorus_suitable: boolean,
    bridge_suitable: boolean,
    solo_potential: 0-1,
    riff_potential: 0-1
  },
  contextual_fitness: {
    genre_weights: { ... },
    era_authenticity: { ... },
    instrumentation_hints: { ... }
  }
}
```

## Usage

### Processing Datasets

Use the CLI tools in `scripts/`:

```bash
# Process E-GMD drum patterns
node scripts/ingest-egmd.js --input drums/ --output core-drums.json --limit 12

# Process Chordonomicon progressions
node scripts/ingest-chords.js --input progressions/ --output core-progressions.json --limit 20

# Process Lakh melody phrases
node scripts/ingest-melodies.js --input melodies/ --output core-phrases.json --limit 30
```

### Programmatic Usage

```javascript
import { EGMDProcessor } from './drums/EGMDProcessor.js';
import { ChordonomiconProcessor } from './harmony/ChordonomiconProcessor.js';
import { LakhProcessor } from './melody/LakhProcessor.js';

// Process single pattern
const drumPattern = EGMDProcessor.processPattern(midiData, {
  id: 'pattern_1',
  signature: '4/4',
  bpm: 120
});

// Process batch
const progressions = ChordonomiconProcessor.processBatch(rawProgressions);

// Curate core set
const coreDrums = EGMDProcessor.curateCoreSet(allProcessedPatterns);
```

## Next Steps

1. **Integrate Real MIDI Parsing** - Replace template functions with actual MIDI file parsing
2. **Dataset Acquisition** - Download and organize E-GMD, Chordonomicon, and Lakh datasets
3. **Quality Filtering** - Implement advanced curation algorithms
4. **Engine Integration** - Update DrumEngine, HarmonyEngine, MelodyEngine to use processed data

## Notes

- Current implementation uses template/placeholder data
- In production, you'll need MIDI parsing libraries (e.g., `midi-parser-js`, `jsmidgen`)
- Processing large datasets may require streaming/batching for memory efficiency
- Quality curation is critical - better to have 20 great patterns than 200 mediocre ones
