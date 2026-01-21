# Member Skill Traits & Interactive Rehearsal System

## ✅ Implementation Complete

Added a comprehensive system for auditioning band members and rehearsing with your band, where member skill traits directly affect MIDI playback in real-time.

## Features Implemented

### 1. Member Skill Traits System

**File**: `src/utils/memberSkillTraits.js`

**Skill Traits Defined:**
- **Timing** (0-100): Beat/note timing accuracy
- **Dynamics** (0-100): Velocity variation
- **Precision** (0-100): Note accuracy (dissonance)
- **Groove** (0-100): Feel and swing
- **Technique** (0-100): Overall technical ability

**Role-Specific Traits:**
- Drummer: Timing, dynamics, precision, groove, technique
- Guitarist/Lead Guitar/Rhythm Guitar: Timing, dynamics, precision, groove, technique
- Bassist: Timing, dynamics, precision, groove, technique
- Vocalist: Timing, dynamics, precision, groove, technique
- Keyboardist: Timing, dynamics, precision, groove, technique

**Functions:**
- `generateSkillTraits(role, overallSkill, options)` - Generate traits for a role
- `generateAuditionCandidate(role, options)` - Create audition candidate with traits
- `getSkillDescription(traitName, value)` - Human-readable skill level

### 2. Audition System

**File**: `src/components/AuditionPanel.jsx`

**Features:**
- Generate 3 candidates for any role
- View detailed skill traits for each candidate
- Real-time playback to hear skill effects
- Hire candidates directly

**UI Elements:**
- Role selection
- Candidate cards with skill breakdowns
- Strengths/weaknesses display
- Test playback controls
- Hire button

### 3. Rehearsal System

**File**: `src/components/RehearsalPanel.jsx`

**Features:**
- Rehearse with current band members
- Genre selection
- Real-time playback with skill effects
- Progress tracking
- Skill effects visualization

**UI Elements:**
- Band member overview
- Genre selector
- Playback controls
- Progress bar
- Skill effects notice

### 4. Skill-Based Playback

**File**: `src/music/renderers/ToneRenderer.js` (Modified)

**How Skills Affect Playback:**

#### Drummer:
- **Timing < 50**: Beats are noticeably off (up to 50ms variance)
- **Dynamics < 30**: All hits at 100% velocity (no variation)
- **Precision < 50**: Missed hits (up to 10% miss chance)
- **Groove**: Affects feel (future enhancement)

#### Guitarist (Lead/Rhythm):
- **Timing < 50**: Notes are off-beat
- **Dynamics < 30**: All notes at same velocity
- **Precision < 50**: Wrong notes (dissonance, up to 2 semitones off)
- **Groove**: Affects rhythmic feel

#### Bassist:
- **Timing < 50**: Notes are off-beat
- **Dynamics < 30**: All plucks at same velocity
- **Precision < 50**: Wrong notes in chords
- **Groove**: Affects groove feel

### 5. Integration

**File**: `src/components/Tabs/BandTab.jsx` (Modified)

**New Features:**
- "Auditions" button - Opens audition panel
- "Rehearse" button - Opens rehearsal panel
- Modal overlays for panels
- Member hiring integration
- Skill traits display

## Example Scenarios

### Scenario 1: Funk Drummer with Bad Timing
```javascript
{
  name: "Casey Beat",
  role: "drummer",
  overallSkill: 45,
  traits: {
    timing: 30,      // Bad timing
    dynamics: 25,    // No dynamics
    precision: 40,   // Sloppy
    groove: 70,
    technique: 35
  }
}
```
**Playback Effect:**
- Beats are noticeably off (up to 50ms late/early)
- All hits at 100% velocity (no variation)
- Some missed hits (10% miss chance)
- Sounds sloppy and mechanical

### Scenario 2: Rock Drummer with No Dynamics
```javascript
{
  name: "Sam Thunder",
  role: "drummer",
  overallSkill: 60,
  traits: {
    timing: 75,     // Good timing
    dynamics: 25,   // NO DYNAMICS
    precision: 70,  // Decent precision
    groove: 60,
    technique: 65
  }
}
```
**Playback Effect:**
- Beats are on time
- ALL hits at 100% velocity (no variation)
- Sounds mechanical, no expression

### Scenario 3: Sloppy Lead Guitar
```javascript
{
  name: "Alex Storm",
  role: "lead-guitar",
  overallSkill: 50,
  traits: {
    timing: 65,
    dynamics: 70,
    precision: 40,   // SLOPPY
    groove: 60,
    technique: 50
  }
}
```
**Playback Effect:**
- Notes are slightly off-beat
- Some notes are wrong (dissonant, up to 2 semitones off)
- Sounds sloppy and unprofessional

## Technical Details

### Skill Effect Calculations

**Timing Variance:**
```javascript
timingVariance = (100 - timingSkill) / 100 * 0.05; // Max 50ms
actualTime = baseTime + (random - 0.5) * timingVariance;
```

**Dynamics Range:**
```javascript
dynamicsRange = dynamicsSkill / 100; // 0-1
if (dynamicsSkill < 30) {
  velocity = 1.0; // Always 100%
} else {
  velocity = baseVelocity * (0.7 + dynamicsRange * 0.3 * random);
}
```

**Precision (Dissonance):**
```javascript
dissonanceAmount = (100 - precisionSkill) / 100 * 2; // Up to 2 semitones
if (precisionSkill < 50) {
  noteValue += Math.round((random - 0.5) * dissonanceAmount);
}
```

**Miss Chance (Drums):**
```javascript
missChance = (100 - precisionSkill) / 100 * 0.1; // Up to 10%
if (random > missChance) {
  // Play note
} else {
  // Miss (don't play)
}
```

### Seeded Random

Uses `SeededRandom` for deterministic effects:
- Same seed = same skill effects
- Reproducible playback
- Consistent audition results

## Usage Flow

### Auditioning a Member

1. Go to **Band Tab**
2. Click **"Auditions"** button
3. Select role (drummer, guitarist, etc.)
4. Click **"Generate Candidates"**
5. Review candidates and their skill traits
6. Select a candidate
7. Click **"Generate Test Song"**
8. Click **"Play"** to hear their skills
9. Notice timing, dynamics, precision issues
10. Click **"Hire"** if satisfied

### Rehearsing with Band

1. Go to **Band Tab**
2. Click **"Rehearse"** button
3. Select genre
4. Click **"Generate Song"**
5. Click **"Play"** to hear your band
6. Notice how member skills affect playback:
   - Bad timing = off-beat
   - No dynamics = mechanical
   - Sloppy precision = wrong notes

## Files Created/Modified

### New Files
1. `src/utils/memberSkillTraits.js` - Skill traits system
2. `src/components/AuditionPanel.jsx` - Audition interface
3. `src/components/RehearsalPanel.jsx` - Rehearsal interface

### Modified Files
1. `src/music/renderers/ToneRenderer.js` - Skill-based playback
2. `src/music/MusicGenerator.js` - Pass member data
3. `src/components/Tabs/BandTab.jsx` - Integration

## Benefits

1. **Interactive Gameplay**: Hear member skills in real-time
2. **Strategic Decisions**: Choose members based on audible differences
3. **Realistic Simulation**: Skills actually affect music
4. **Engaging**: Makes member selection meaningful
5. **Educational**: Players learn about musical skills
6. **Replayability**: Different members = different sound

## Testing

To test the system:

1. **Test Auditions:**
   - Open Band Tab → Auditions
   - Generate candidates for "drummer"
   - Find one with low timing (30-40)
   - Play test song - hear beats are off

2. **Test Rehearsal:**
   - Have band members with different skills
   - Open Rehearsal
   - Generate and play song
   - Notice skill effects

3. **Test Skill Effects:**
   - Hire drummer with dynamics < 30
   - Rehearse - all hits at 100% velocity
   - Hire guitarist with precision < 40
   - Rehearse - hear wrong notes

## Status

✅ **Complete and Ready to Use**

All features are implemented and integrated. The system allows players to:
- Audition members and hear their skills
- Rehearse with their band
- Experience how member skills affect music playback
- Make informed hiring decisions
