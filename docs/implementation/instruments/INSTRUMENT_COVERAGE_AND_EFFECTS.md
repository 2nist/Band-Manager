# Instrument Coverage and Skill Effects

## Current Instrument Coverage

### ✅ Fully Implemented (Affect Playback)

#### 1. **Drummer** 🥁
**Playback Implementation**: ✅ Full
**Affects**: Drums (kick, snare, hihat, ghost snare)

**Skill Traits:**
- **Timing** (0-100): Beat timing accuracy
- **Dynamics** (0-100): Velocity variation
- **Precision** (0-100): Hit accuracy
- **Groove** (0-100): Feel and swing *(not yet applied)*
- **Technique** (0-100): Overall technical skill *(not yet applied)*

**How Traits Affect Playback:**
- **Timing < 50**: Beats are off (up to 50ms variance)
  - Formula: `timingVariance = (100 - timingSkill) / 100 * 0.05`
  - Effect: Kick, snare, hihat hit early/late
  - Example: Timing 30 → ±35ms variance (noticeably off-beat)

- **Dynamics < 30**: All hits at 100% velocity (no variation)
  - Formula: `if (dynamicsSkill < 30) velocity = 1.0`
  - Effect: All drum hits sound the same volume
  - Example: Dynamics 25 → Everything hits at 100% (mechanical)

- **Precision < 50**: Missed hits (up to 10% miss chance)
  - Formula: `missChance = (100 - precisionSkill) / 100 * 0.1`
  - Effect: Some beats don't play
  - Example: Precision 40 → 6% miss chance (sloppy, inconsistent)

**Audio Synthesis:**
- Kick: `Tone.Synth` (sine wave, C1)
- Snare: `Tone.MembraneSynth` (C2)
- Hihat: `Tone.MetalSynth` (high-frequency click)

---

#### 2. **Lead Guitar** 🎸
**Playback Implementation**: ✅ Full
**Affects**: Melody line

**Skill Traits:**
- **Timing** (0-100): Solo timing accuracy
- **Dynamics** (0-100): Expression variation
- **Precision** (0-100): Note accuracy (dissonance)
- **Groove** (0-100): Melodic feel *(not yet applied)*
- **Technique** (0-100): Overall technical skill *(not yet applied)*

**How Traits Affect Playback:**
- **Timing < 50**: Notes are off-beat
  - Formula: `timingVariance = (100 - timingSkill) / 100 * 0.03`
  - Effect: Melody notes hit early/late
  - Example: Timing 40 → ±18ms variance

- **Dynamics < 30**: All notes at same velocity
  - Formula: `if (dynamicsSkill < 30) velocity = 0.8`
  - Effect: No expression, all notes same volume
  - Example: Dynamics 25 → Flat, unexpressive

- **Precision < 50**: Wrong notes (dissonance, up to 2 semitones off)
  - Formula: `dissonanceAmount = (100 - precisionSkill) / 100 * 2`
  - Effect: Some notes are wrong (dissonant)
  - Example: Precision 40 → Up to ±1.2 semitones off (sloppy, wrong notes)

**Audio Synthesis:**
- Melody: `Tone.PolySynth(Tone.Synth)` (triangle oscillator)

---

#### 3. **Rhythm Guitar** 🎸
**Playback Implementation**: ✅ Full
**Affects**: Harmony (chord progressions)

**Skill Traits:**
- **Timing** (0-100): Chord timing accuracy
- **Dynamics** (0-100): Strum variation
- **Precision** (0-100): Chord accuracy
- **Groove** (0-100): Rhythmic feel *(not yet applied)*
- **Technique** (0-100): Overall technical skill *(not yet applied)*

**How Traits Affect Playback:**
- **Timing < 50**: Chords are off-beat
  - Formula: `timingVariance = (100 - timingSkill) / 100 * 0.02`
  - Effect: Chord changes hit early/late
  - Example: Timing 40 → ±12ms variance

- **Precision < 50**: Wrong notes in chords
  - Formula: `if (precisionSkill < 50 && random > chordAccuracy) note += semitoneOffset`
  - Effect: Some chord notes are wrong (dissonant)
  - Example: Precision 40 → Occasionally wrong notes in chords

**Audio Synthesis:**
- Harmony: 4x `Tone.Synth` (sine waves, one per voice)

---

#### 4. **Bassist** 🎸
**Playback Implementation**: ✅ Full
**Affects**: Harmony (chord progressions) - *Currently shares harmony track*

**Skill Traits:**
- **Timing** (0-100): Note timing accuracy
- **Dynamics** (0-100): Pluck variation
- **Precision** (0-100): Fret accuracy
- **Groove** (0-100): Groove and feel *(not yet applied)*
- **Technique** (0-100): Overall technical skill *(not yet applied)*

**How Traits Affect Playback:**
- **Timing < 50**: Notes are off-beat
  - Formula: `timingVariance = (100 - timingSkill) / 100 * 0.02`
  - Effect: Bass notes hit early/late
  - Example: Timing 40 → ±12ms variance

- **Precision < 50**: Wrong notes
  - Formula: Same as rhythm guitar
  - Effect: Some bass notes are wrong
  - Example: Precision 40 → Dissonant bass notes

**Audio Synthesis:**
- Harmony: 4x `Tone.Synth` (sine waves) - *Currently shares with rhythm guitar*

**Note**: Bass currently shares the harmony track. Could be separated in future.

---

### ⚠️ Partially Implemented (Traits Defined, Not Yet Affecting Playback)

#### 5. **Vocalist** 🎤
**Playback Implementation**: ❌ Not yet (no vocal synthesis)
**Traits Defined**: ✅ Yes
**Current Status**: Traits exist but vocals aren't synthesized yet

**Skill Traits:**
- **Timing** (0-100): Vocal timing accuracy
- **Dynamics** (0-100): Volume variation
- **Precision** (0-100): Pitch accuracy
- **Groove** (0-100): Phrasing feel
- **Technique** (0-100): Overall vocal skill

**Future Implementation:**
- When vocals are added, traits will affect:
  - Timing: Vocal entry timing
  - Dynamics: Volume variation
  - Precision: Pitch accuracy (off-key notes)
  - Groove: Phrasing and feel

---

#### 6. **Keyboardist** 🎹
**Playback Implementation**: ❌ Not yet (no keyboard synthesis)
**Traits Defined**: ✅ Yes
**Current Status**: Traits exist but keyboard isn't synthesized yet

**Skill Traits:**
- **Timing** (0-100): Key timing accuracy
- **Dynamics** (0-100): Touch variation
- **Precision** (0-100): Note accuracy
- **Groove** (0-100): Rhythmic feel
- **Technique** (0-100): Overall technical skill

**Future Implementation:**
- When keyboard is added, traits will affect:
  - Timing: Key press timing
  - Dynamics: Touch sensitivity
  - Precision: Wrong notes
  - Groove: Rhythmic feel

---

## Current Playback Architecture

### Instrument Mapping

```
Generated Song Structure:
├── Drums (musicalContent.drums)
│   └── Affected by: drummer traits
│   └── Synthesis: Tone.Synth, Tone.MembraneSynth, Tone.MetalSynth
│
├── Harmony (musicalContent.harmony)
│   └── Affected by: bassist OR rhythm-guitar OR guitarist traits
│   └── Synthesis: 4x Tone.Synth (chord voices)
│
└── Melody (musicalContent.melody)
    └── Affected by: lead-guitar OR rhythm-guitar OR guitarist traits
    └── Synthesis: Tone.PolySynth (melody line)
```

### Trait Priority

**Harmony (Chords):**
1. `bassist` traits (if present)
2. `rhythm-guitar` traits (if present)
3. `guitarist` traits (fallback)

**Melody (Lead):**
1. `lead-guitar` traits (if present)
2. `rhythm-guitar` traits (if present)
3. `guitarist` traits (fallback)

**Drums:**
1. `drummer` traits (if present)
2. Default values (if not present)

---

## Skill Effect Summary

### Timing Effects
| Instrument | Variance Range | Effect |
|------------|---------------|--------|
| Drummer | 0-50ms | Beats are off-beat |
| Lead Guitar | 0-30ms | Melody notes are off-beat |
| Rhythm Guitar | 0-20ms | Chord changes are off-beat |
| Bassist | 0-20ms | Bass notes are off-beat |

### Dynamics Effects
| Instrument | Range | Effect |
|------------|-------|--------|
| Drummer | 0-100% | Velocity variation (0% = always 100%) |
| Lead Guitar | 0-100% | Expression variation (0% = flat) |
| Rhythm Guitar | N/A | *Not yet applied* |
| Bassist | N/A | *Not yet applied* |

### Precision Effects
| Instrument | Range | Effect |
|------------|-------|--------|
| Drummer | 0-10% miss | Missed hits |
| Lead Guitar | 0-2 semitones | Wrong notes (dissonance) |
| Rhythm Guitar | 0-2 semitones | Wrong chord notes |
| Bassist | 0-2 semitones | Wrong bass notes |

---

## Coverage Gaps

### ❌ Not Yet Implemented

1. **Vocalist Playback**
   - Traits defined but no vocal synthesis
   - Would need: Vocal synthesis or sample playback
   - Future: Add vocal track with pitch/timing effects

2. **Keyboardist Playback**
   - Traits defined but no keyboard synthesis
   - Would need: Keyboard synth or piano samples
   - Future: Add keyboard track

3. **Separate Bass Track**
   - Currently shares harmony track
   - Would need: Dedicated bass synth
   - Future: Separate bass from harmony

4. **Groove Effects**
   - Defined but not applied
   - Would affect: Swing, feel, rhythmic variation
   - Future: Apply groove to timing feel

5. **Technique Effects**
   - Defined but not applied
   - Would affect: Overall quality, complexity
   - Future: Apply technique to note selection/complexity

---

## Example Scenarios

### Scenario 1: Funk Drummer with Bad Timing
```javascript
{
  role: 'drummer',
  traits: { timing: 30, dynamics: 25, precision: 40 }
}
```
**Playback Effect:**
- Beats are ±35ms off (noticeably off-beat)
- All hits at 100% velocity (no dynamics)
- 6% miss chance (sloppy, inconsistent)
- **Sounds**: Sloppy, mechanical, off-beat

### Scenario 2: Rock Drummer with No Dynamics
```javascript
{
  role: 'drummer',
  traits: { timing: 75, dynamics: 25, precision: 70 }
}
```
**Playback Effect:**
- Beats are on time (±12.5ms)
- ALL hits at 100% velocity (no variation)
- Low miss chance (2%)
- **Sounds**: On-time but mechanical, no expression

### Scenario 3: Sloppy Lead Guitar
```javascript
{
  role: 'lead-guitar',
  traits: { timing: 65, dynamics: 70, precision: 40 }
}
```
**Playback Effect:**
- Notes slightly off-beat (±10.5ms)
- Good dynamics (expressive)
- Wrong notes (up to ±1.2 semitones)
- **Sounds**: Expressive but sloppy, dissonant notes

### Scenario 4: Tight Rhythm Guitar
```javascript
{
  role: 'rhythm-guitar',
  traits: { timing: 85, dynamics: 70, precision: 90 }
}
```
**Playback Effect:**
- Chords on time (±3ms)
- Good dynamics
- Accurate chords (no wrong notes)
- **Sounds**: Tight, professional, expressive

---

## Recommendations

### Immediate Improvements

1. **Separate Bass Track**
   - Create dedicated bass synth
   - Apply bassist traits separately
   - Better instrument separation

2. **Apply Groove Trait**
   - Add swing to timing
   - Affect rhythmic feel
   - Make groove audible

3. **Apply Technique Trait**
   - Affect note complexity
   - Limit advanced techniques for low skill
   - Make technique audible

### Future Enhancements

1. **Vocal Synthesis**
   - Add vocal track
   - Apply vocalist traits
   - Pitch accuracy, timing, dynamics

2. **Keyboard Synthesis**
   - Add keyboard track
   - Apply keyboardist traits
   - Piano/organ sounds

3. **More Instruments**
   - Synth/electronic instruments
   - Percussion (beyond drums)
   - Horns/brass
   - Strings

---

## Current Status Summary

| Instrument | Traits Defined | Playback | Skill Effects |
|------------|---------------|----------|---------------|
| **Drummer** | ✅ | ✅ | ✅ Timing, Dynamics, Precision |
| **Lead Guitar** | ✅ | ✅ | ✅ Timing, Dynamics, Precision |
| **Rhythm Guitar** | ✅ | ✅ | ✅ Timing, Precision |
| **Bassist** | ✅ | ✅ | ✅ Timing, Precision |
| **Vocalist** | ✅ | ❌ | ❌ (No vocal synthesis yet) |
| **Keyboardist** | ✅ | ❌ | ❌ (No keyboard synthesis yet) |

**Overall Coverage**: 4/6 instruments fully functional (67%)
