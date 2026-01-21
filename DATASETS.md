# Music Datasets for GigMaster

This document explains how to acquire, process, and use music datasets for the GigMaster procedural music generation system.

## Overview

GigMaster uses three main datasets for music generation:
- **E-GMD** (Extended Groove MIDI Dataset) - Drum patterns
- **Chordonomicon** - Chord progressions
- **Lakh MIDI Dataset** - Melody phrases

## Repository Strategy

Following the "Core sets in-repo + remote full sets" approach:

- **In Repository**: Curated core sets (12-24 drum patterns, 20-30 progressions, 30-50 phrases) as processed JSON files
- **Excluded from Repository**: Raw MIDI files (large datasets, stored locally only)
- **Location**: 
  - Processed core sets: `src/music/assets/core/`
  - Raw datasets: `src/music/datasets/` (gitignored)

## E-GMD Dataset

### Acquisition

1. **Download E-GMD**
   - Source: [Extended Groove MIDI Dataset](https://github.com/CPJKU/groove)
   - License: CC0 (Public Domain)
   - Size: ~45,000+ MIDI files

2. **Place in Repository**
   ```
   src/music/datasets/e-gmd/
   ├── afrobeat/
   ├── hiphop/
   ├── jazz/
   ├── latin/
   ├── soul/
   └── unknown/
   ```

### Processing

Process raw MIDI files into constraint-ready schemas:

```bash
node scripts/ingest-egmd.js \
  --input src/music/datasets/e-gmd \
  --output src/music/assets/core/drums-core.json \
  --limit 24
```

**Options:**
- `--input`: Directory containing E-GMD MIDI files
- `--output`: Output JSON file path
- `--limit`: Number of patterns for core set (default: 24)
- `--no-core-set`: Generate full processed dataset instead of curated core set

**Output:**
- Generates `drums-core.json` with 12-24 curated, high-quality patterns
- Each pattern includes enhanced schema fields (psychological tags, genre weights, gameplay hooks)

### Usage

The processed core set is automatically loaded by `DrumEngine`:

```javascript
import { DrumEngine } from './src/music/engines/DrumEngine.js';

// Engine automatically loads from src/music/assets/core/drums-core.json
const drums = DrumEngine.generate(constraints, genre, seed);
```

## Chordonomicon Dataset

### Acquisition

1. **Download Chordonomicon**
   - Source: [Chordonomicon Dataset](https://github.com/keunwoochoi/chordonomicon)
   - License: Check repository for current license
   - Format: JSON files with chord progressions
   - **Status**: Partial dataset included (5,356 JSON files)

2. **Place in Repository**
   ```
   src/music/datasets/Chordonomicon-partial/
   └── [JSON files with sections and chords]
   ```

### Processing

```bash
node scripts/ingest-chords.js \
  --input src/music/datasets/Chordonomicon-partial \
  --output src/music/assets/core/progressions-core.json \
  --limit 30
```

**Output:**
- Generates `progressions-core.json` with 30 curated chord progressions
- Extracts progressions from song sections
- Each progression includes enhanced schema fields

## Melody Datasets

### BIMMUDA Dataset (Pop Songs)

1. **BIMMUDA Dataset**
   - Source: BIMMUDA (Billboard MIDI Music Dataset)
   - License: Check dataset source for current license
   - Format: MIDI files organized by year (1950-2024)
   - **Status**: Included (1,538 MIDI files)

2. **Place in Repository**
   ```
   src/music/datasets/bimmuda_dataset/
   └── [year folders]/
       └── [MIDI files]
   ```

3. **Processing**
   ```bash
   node scripts/ingest-melodies.js \
     --input src/music/datasets/bimmuda_dataset \
     --output src/music/assets/core/phrases-bimmuda.json \
     --limit 30
   ```

### Classical MIDI Dataset

1. **When in Rome Classical-curated**
   - Source: Classical music dataset
   - Format: JSON files with chord/section information
   - **Status**: Included (324 JSON files)
   - **Note**: JSON format contains chord data but not note sequences - may need different processing

2. **Place in Repository**
   ```
   src/music/datasets/When in Rome Classical-curated/
   └── [JSON files]
   ```

3. **Processing**
   ```bash
   node scripts/ingest-melodies.js \
     --input "src/music/datasets/When in Rome Classical-curated" \
     --output src/music/assets/core/phrases-classical.json \
     --limit 30
   ```

### Lakh MIDI Dataset (Optional)

1. **Download Lakh MIDI Dataset**
   - Source: [Lakh MIDI Dataset](https://colinraffel.com/projects/lmd/)
   - License: Check dataset website for current license
   - Size: Very large (~176,000 MIDI files)

2. **Place in Repository**
   ```
   src/music/datasets/lakh/
   └── [MIDI files]
   ```

3. **Processing**
   ```bash
   node scripts/ingest-melodies.js \
     --input src/music/datasets/lakh \
     --output src/music/assets/core/phrases-lakh.json \
     --limit 50
   ```

## Regenerating Core Sets

To regenerate core sets with updated curation algorithms:

1. Ensure raw datasets are in `src/music/datasets/`
2. Run the appropriate ingest script
3. Core sets are automatically updated in `src/music/assets/core/`

## File Structure

```
src/music/
├── datasets/              # .gitignored - raw files (local only)
│   ├── e-gmd/            # E-GMD dataset (45,547 MIDI files)
│   ├── Chordonomicon-partial/  # Chordonomicon (5,356 JSON files)
│   ├── bimmuda_dataset/  # BIMMUDA pop songs (1,538 MIDI files)
│   ├── When in Rome Classical-curated/  # Classical (324 JSON files)
│   └── lakh/             # Lakh dataset (optional, very large)
├── assets/                # In repository - processed JSON
│   └── core/
│       ├── drums-core.json         # 12 curated drum patterns (21 KB)
│       ├── progressions-core.json  # 30 curated progressions (33 KB)
│       ├── phrases-bimmuda.json    # 30 pop song phrases (102 KB)
│       └── phrases-classical.json  # Classical phrases (if processed)
└── preprocessing/         # Processing pipeline
    ├── drums/
    ├── harmony/
    └── melody/
```

## Licensing

### E-GMD
- **License**: CC0 (Public Domain)
- **Redistribution**: Allowed
- **Attribution**: Not required but appreciated

### Chordonomicon
- **License**: Check repository for current license
- **Usage**: Verify license before redistribution
- **Status**: Partial dataset included (5,356 files)

### BIMMUDA Dataset
- **License**: Check dataset source for current license
- **Usage**: Verify license before redistribution
- **Status**: Included (1,538 MIDI files from 1950-2024)

### Classical Dataset
- **License**: Check dataset source for current license
- **Usage**: Verify license before redistribution
- **Status**: Included (324 JSON files)
- **Note**: JSON format may require different processing for melody extraction

### Lakh MIDI Dataset
- **License**: Check dataset website
- **Usage**: Verify license before redistribution
- **Status**: Not included (very large, optional)

## Troubleshooting

### MIDI Parsing Errors

Some MIDI files may fail to parse (corrupt or non-standard format). This is normal with large datasets. The ingest scripts will:
- Skip invalid files with warnings
- Continue processing remaining files
- Report success/failure counts

### Empty Beat Patterns

If generated patterns have empty beats arrays, this may indicate:
- MIDI files don't use channel 9 for drums (some use channel 10 or other channels)
- MIDI event structure differs from expected format
- Files contain only non-drum instruments

**Solution**: Review MIDI parsing logic in `scripts/ingest-egmd.js` and adjust channel/event detection as needed. The preprocessing pipeline will still generate psychological tags and genre weights even with empty beats.

### Large Dataset Processing

Processing 45,000+ MIDI files can take time:
- Progress is shown every 100 files
- Processing is single-threaded (can be optimized if needed)
- Memory usage is reasonable (files processed sequentially)

### Core Set Size

If core set has fewer patterns than requested:
- Dataset may not have enough diverse patterns
- Quality filters may be too strict
- Try adjusting curation parameters in `EGMDProcessor.curateCoreSet()`

## Next Steps

1. **Acquire Datasets**: Download E-GMD, Chordonomicon, and Lakh datasets
2. **Process Datasets**: Run ingest scripts to generate core sets
3. **Verify Output**: Check that core sets are generated correctly
4. **Update Engines**: Ensure engines load from `src/music/assets/core/`

## References

- [E-GMD Repository](https://github.com/CPJKU/groove)
- [Chordonomicon Repository](https://github.com/keunwoochoi/chordonomicon)
- [Lakh MIDI Dataset](https://colinraffel.com/projects/lmd/)
- [Enhanced Music Generation Plan](./enhancedmusicgenerationplan.md)
