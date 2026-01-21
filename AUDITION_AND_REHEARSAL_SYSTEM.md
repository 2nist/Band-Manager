# Audition and Rehearsal System

## Overview

Interactive system for auditioning band members and rehearsing with your band, where member skill traits directly affect MIDI playback in real-time.

## Features

### 1. Member Auditions (`AuditionPanel.jsx`)

**What It Does:**
- Generates audition candidates for any role
- Shows detailed skill traits (timing, dynamics, precision, groove, technique)
- Allows real-time playback to hear how candidate's skills affect music
- Hire candidates directly from audition

**Skill Traits:**
- **Timing**: Affects beat/note timing accuracy (bad timing = off-beat)
- **Dynamics**: Affects velocity variation (no dynamics = everything 100% velocity)
- **Precision**: Affects note accuracy (sloppy = dissonant/wrong notes)
- **Groove**: Affects feel and swing
- **Technique**: Overall technical ability

**Example Scenarios:**
- Funk drummer with bad timing (30/100) → Beats are noticeably off
- Rock drummer with no dynamics (25/100) → Everything hits at 100% velocity
- Sloppy lead guitar (40/100 precision) → Dissonant notes come through

### 2. Band Rehearsal (`RehearsalPanel.jsx`)

**What It Does:**
- Rehearse with your current band members
- Hear how their skills affect music playback
- Test different genres
- See real-time skill effects

**Features:**
- Genre selection (rock, punk, metal, funk, folk, jazz, pop)
- Playback controls (play, pause, stop)
- Progress tracking
- Skill effects visualization

### 3. Skill-Based Playback (`ToneRenderer.js`)

**How Member Skills Affect Playback:**

#### Drummer Skills:
- **Timing**: Adds timing variance (bad timing = beats are off)
- **Dynamics**: Varies velocity (no dynamics = all hits at 100%)
- **Precision**: Miss chance (sloppy = missed hits)
- **Groove**: Affects feel (not yet implemented)

#### Guitarist Skills:
- **Timing**: Note timing variance
- **Dynamics**: Pick attack variation
- **Precision**: Dissonance (sloppy = wrong notes, up to 2 semitones off)
- **Groove**: Rhythmic feel

#### Bassist Skills:
- **Timing**: Note timing accuracy
- **Dynamics**: Pluck variation
- **Precision**: Fret accuracy
- **Groove**: Groove and feel (affects timing feel)

## Technical Implementation

### Member Skill Traits System (`memberSkillTraits.js`)

**Functions:**
- `generateSkillTraits(role, overallSkill, options)` - Generate traits for a role
- `generateAuditionCandidate(role, options)` - Create audition candidate
- `getSkillDescription(traitName, value)` - Get human-readable description

**Trait Ranges:**
- All traits: 0-100
- Defaults vary by role
- Variance adds realism (not all traits are equal)

### ToneRenderer Modifications

**New Features:**
- Extracts member traits from `song.gameContext.bandMembers`
- Applies timing variance based on timing skill
- Applies velocity variation based on dynamics skill
- Applies note accuracy (dissonance) based on precision skill
- Uses seeded RNG for deterministic effects

**Effect Calculations:**
```javascript
// Timing variance
timingVariance = (100 - timingSkill) / 100 * 0.05; // Max 50ms

// Dynamics range
dynamicsRange = dynamicsSkill / 100; // 0-1

// Precision (dissonance)
dissonanceAmount = (100 - precisionSkill) / 100 * 2; // Up to 2 semitones

// Miss chance (drums)
missChance = (100 - precisionSkill) / 100 * 0.1; // Up to 10%
```

## Usage

### Auditioning Members

1. Go to Band Tab
2. Click "Auditions" button
3. Select role to audition for
4. Click "Generate Candidates"
5. Select a candidate
6. Click "Generate Test Song"
7. Click "Play" to hear their skills
8. Click "Hire" if satisfied

### Rehearsing with Band

1. Go to Band Tab
2. Click "Rehearse" button
3. Select genre
4. Click "Generate Song"
5. Click "Play" to hear your band
6. Notice how member skills affect playback

## Integration Points

### BandTab Integration
- Added "Auditions" and "Rehearse" buttons
- Modal overlays for panels
- Member hiring integration

### MusicGenerator Integration
- Passes `bandMembers` in `gameContext`
- Includes member traits in song data

### ToneRenderer Integration
- Extracts traits during render
- Applies traits during note scheduling
- Uses seeded RNG for consistency

## Example Member Traits

**Good Drummer:**
```javascript
{
  timing: 85,
  dynamics: 80,
  precision: 90,
  groove: 85,
  technique: 88
}
```

**Bad Drummer (Funk with bad timing):**
```javascript
{
  timing: 30,  // Bad timing
  dynamics: 25, // No dynamics
  precision: 40, // Sloppy
  groove: 70,
  technique: 35
}
```

**Sloppy Lead Guitar:**
```javascript
{
  timing: 65,
  dynamics: 70,
  precision: 40, // Sloppy - wrong notes
  groove: 60,
  technique: 50
}
```

## Benefits

1. **Interactive Gameplay**: Hear member skills in real-time
2. **Strategic Decisions**: Choose members based on audible differences
3. **Realistic Simulation**: Skills actually affect music
4. **Engaging**: Makes member selection meaningful
5. **Educational**: Players learn about musical skills

## Files Created/Modified

### New Files
- `src/utils/memberSkillTraits.js` - Skill traits system
- `src/components/AuditionPanel.jsx` - Audition interface
- `src/components/RehearsalPanel.jsx` - Rehearsal interface

### Modified Files
- `src/music/renderers/ToneRenderer.js` - Skill-based playback
- `src/music/MusicGenerator.js` - Pass member data
- `src/components/Tabs/BandTab.jsx` - Integration

## Future Enhancements

- Practice system to improve member skills
- Skill progression over time
- Member chemistry affecting group performance
- Genre-specific skill requirements
- Visual feedback for skill effects
- Recording rehearsal sessions
- Comparison mode (A/B test members)
