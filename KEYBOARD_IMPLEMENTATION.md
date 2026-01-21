# Keyboard Implementation

## ✅ Implementation Complete

Added keyboard support with genre-specific types (Piano, Electric Piano, Synth) that automatically select based on song genre.

## Features

### 1. Genre-to-Keyboard Type Mapping

**Piano** (Acoustic):
- Jazz
- Folk
- Classical
- Blues
- Soul

**Electric Piano** (Rhodes/Wurlitzer):
- Pop
- Rock
- Funk
- R&B
- Reggae
- Country
- Indie Rock
- Punk
- Metal

**Synth** (Electronic):
- Synth Pop
- EDM
- Electronic
- Experimental
- Hip-Hop

### 2. Keyboard Synthesis

**Piano:**
- Uses `Tone.FMSynth` for acoustic piano sound
- Rich harmonics, natural decay
- More reverb (30% wet)
- Light chorus (15% wet)

**Electric Piano:**
- Uses `Tone.Synth` with triangle oscillator
- Rhodes/Wurlitzer style
- Chorus effect (30% wet)
- Light reverb (20% wet)

**Synth:**
- Uses `Tone.Synth` with sawtooth oscillator
- Electronic synthesizer sound
- Filter sweeps
- Delay and chorus effects

### 3. Skill Trait Integration

Keyboardist traits affect playback:
- **Timing**: Note timing accuracy (off-beat if low)
- **Dynamics**: Touch variation (flat if low)
- **Precision**: Note accuracy (wrong notes if low)
- **Groove**: Rhythmic feel (not yet applied)
- **Technique**: Overall skill (not yet applied)

### 4. Automatic Selection

- If band has keyboardist → Uses keyboard for melody
- If no keyboardist → Falls back to guitar for melody
- Keyboard type automatically selected based on genre

## Technical Details

### Keyboard Initialization

```javascript
_initializeKeyboard(genre) {
  const keyboardType = getKeyboardTypeForGenre(genre);
  
  switch (keyboardType) {
    case 'piano': // FM synth for acoustic
    case 'electric-piano': // Triangle synth
    case 'synth': // Sawtooth synth
  }
}
```

### Effect Chains

**Piano:**
```
Keyboard → Filter → Chorus → Delay → Reverb → Master
```

**Electric Piano:**
```
Keyboard → Filter → Chorus → Delay → Reverb → Master
```

**Synth:**
```
Keyboard → Filter → Chorus → Delay → Reverb → Master
```

### Skill Effects

Same as melody (guitar):
- Timing: ±30ms variance
- Dynamics: 0-100% velocity
- Precision: Up to 2 semitones dissonance

## Usage

Keyboard automatically activates when:
1. Band has a keyboardist member
2. Song is generated with a genre
3. Keyboard type is selected based on genre

**Example:**
```javascript
// Jazz song with keyboardist → Piano
// Pop song with keyboardist → Electric Piano
// Synth Pop song with keyboardist → Synth
```

## Files Created/Modified

### New Files
- `src/music/renderers/KeyboardConfig.js` - Genre-to-keyboard mapping

### Modified Files
- `src/music/renderers/ToneRenderer.js` - Keyboard synthesis and playback

## Status

✅ **Complete and Ready to Use**

Keyboard support is fully implemented. When a band has a keyboardist, the melody will be played on the appropriate keyboard type based on the song's genre.
