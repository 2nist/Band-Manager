# Audio Effects Enhancement

## Overview

Added comprehensive audio effects system to `ToneRenderer` that applies genre-specific and instrument-specific effects, integrated with game state.

## What Was Added

### 1. Effects Configuration System (`EffectsConfig.js`)

**Genre-Specific Effects:**
- **Rock**: Reverb, compression, distortion on melody, chorus on harmony
- **Punk**: Heavy distortion, aggressive compression, high-pass filters
- **Metal**: Heavy distortion, delay, chorus, compression
- **Funk**: Chorus, delay, filter sweeps
- **Folk**: Light reverb, delay, warm filters
- **Jazz**: Rich reverb, chorus, compression
- **Pop**: Balanced compression, reverb, chorus

**Instrument-Specific Effects:**
- **Melody**: Distortion, delay, chorus, filter
- **Harmony**: Reverb, chorus, distortion, filter
- **Drums**: Compression, reverb, distortion, filter
- **Master**: Reverb, compression (applied to all)

### 2. Game State Integration

Effects are dynamically adjusted based on:
- **Equipment Quality** (`gearTier`): Better gear = better effect quality
- **Studio Quality** (`studioTier`): Higher tier = more professional effects
- **Stress Level**: Higher stress = more distortion/chaos
- **Substance Use**: Higher use = more extreme effects

### 3. Enhanced ToneRenderer

**New Features:**
- Effect chains for each instrument group
- Genre-based effect presets
- Real-time effect adjustment based on game state
- Proper effect routing and disposal

**Effect Chain Architecture:**
```
Melody: Synth → Filter → Distortion → Delay → Chorus → Master
Harmony: Synth → Filter → Distortion → Chorus → Reverb → Master
Drums: Synth → Filter → Distortion → Compression → Reverb → Master
Master: Compressor → Reverb → Output
```

## Technical Details

### Effects Used

1. **Reverb** (`Tone.Reverb`)
   - Adds spatial depth
   - Genre-specific room sizes
   - Studio quality affects wet amount

2. **Distortion** (`Tone.Distortion`)
   - Adds grit and character
   - Rock/Metal/Punk genres
   - Stress increases distortion

3. **Delay** (`Tone.FeedbackDelay`)
   - Adds echo and space
   - Melody and harmony
   - Substance use increases feedback

4. **Chorus** (`Tone.Chorus`)
   - Adds richness and width
   - Harmony and melody
   - Funk and jazz genres

5. **Filter** (`Tone.Filter`)
   - Shapes tone
   - High-pass for punk/metal
   - Low-pass for warm genres

6. **Compression** (`Tone.Compressor`)
   - Controls dynamics
   - Drums and master bus
   - Equipment quality affects ratio

### Genre Effect Examples

**Rock:**
- Melody: 20% distortion, 15% delay
- Harmony: 20% chorus, 20% reverb
- Drums: Heavy compression, 10% reverb
- Master: 15% reverb, 4:1 compression

**Punk:**
- Melody: 60% distortion, high-pass filter
- Harmony: 40% distortion, high-pass filter
- Drums: 30% distortion, 10:1 compression
- Master: 8:1 compression (aggressive)

**Metal:**
- Melody: 80% distortion, delay, high-pass filter
- Harmony: 70% distortion, chorus
- Drums: 40% distortion, 12:1 compression, reverb
- Master: 10:1 compression, 20% reverb

**Funk:**
- Melody: 30% chorus, 20% delay, low-pass filter
- Harmony: 35% chorus, low-pass filter
- Drums: 4:1 compression, high-pass filter
- Master: 3:1 compression

**Folk:**
- Melody: 20% delay, 30% reverb, low-pass filter
- Harmony: 35% reverb, 15% chorus
- Drums: 20% reverb, 3:1 compression
- Master: 25% reverb

**Jazz:**
- Melody: 40% reverb, 15% delay, 20% chorus
- Harmony: 40% reverb, 25% chorus
- Drums: 25% reverb, 4:1 compression
- Master: 30% reverb, 2.5:1 compression

## Game State Integration

### Equipment Quality Effects
- **Low (0-30)**: Reduced effect quality, basic settings
- **Medium (31-70)**: Standard effects
- **High (71-100)**: Enhanced effects, better compression ratios

### Studio Quality Effects
- **Low (0-30)**: Minimal reverb, basic processing
- **Medium (31-70)**: Standard reverb, good processing
- **High (71-100)**: Rich reverb, professional polish

### Psychological State Effects
- **High Stress**: +30% distortion, increased chaos
- **High Substance Use**: +20% distortion, increased delay feedback
- **Low Stress**: Cleaner sound, less distortion

## Usage

Effects are automatically applied when rendering a song:

```javascript
const renderer = new ToneRenderer();
await renderer.render(song); // Effects applied based on song.genre and song.gameContext
await renderer.play();
```

The system:
1. Detects genre from `song.composition.genre` or `song.metadata.genre`
2. Gets base effects for that genre
3. Adjusts effects based on `song.gameContext` (equipment, studio, psychology)
4. Applies effects to appropriate instrument chains

## Benefits

1. **Genre Distinction**: Each genre sounds unique
2. **Instrument Separation**: Better mix with instrument-specific effects
3. **Game Integration**: Audio reflects player's equipment and state
4. **Professional Sound**: More polished, realistic audio
5. **Dynamic**: Effects change based on game progression

## Files Modified

- `src/music/renderers/ToneRenderer.js` - Enhanced with effects chains
- `src/music/renderers/EffectsConfig.js` - New file with effects configuration

## Testing

To test effects:
1. Generate songs in different genres
2. Compare audio quality between genres
3. Test with different equipment tiers
4. Test with different stress/substance levels
5. Verify effects are applied correctly

## Future Enhancements

- User-adjustable effect parameters
- Real-time effect modification during playback
- More granular genre sub-genres
- Effect presets for different eras
- Visual feedback for active effects
