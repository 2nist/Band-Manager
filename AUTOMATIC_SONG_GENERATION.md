# Automatic Song Generation System

## Overview

The procedural music generation system now **automatically generates songs for rival bands** and can generate songs **from any game context**. This means:

1. ✅ **Top 20 Chart Songs**: When you view charts, the system automatically generates unique songs for up to 20 different rival artists
2. ✅ **On-Demand Generation**: Songs can be generated from any game context (events, radio, charts, gigs, etc.)

## How It Works

### Automatic Rival Song Generation

When you view charts or rankings, the system:

1. **Checks for existing songs**: Looks for already-generated songs for each rival band
2. **Generates missing songs**: Automatically creates new songs for rivals that don't have songs or whose songs are older than 4 weeks
3. **Stores songs**: Saves generated songs in `gameState.rivalSongs` for reuse
4. **Uses real music**: Each rival song is a fully generated procedural song with:
   - Unique drum patterns
   - Chord progressions matching the rival's psychology
   - Melody phrases based on their skill level
   - Analysis scores (quality, originality, commercial viability)

### Song Generation from Any Context

You can generate songs from anywhere in the game using:

```javascript
import { generateSongFromAnywhere } from './utils/generateSongFromAnywhere.js';

// Generate for a rival band
const rivalSong = await generateSongFromAnywhere({
  bandData: rivalBand,
  context: { contextType: 'chart', week: currentWeek },
  options: { genre: 'rock' }
});

// Generate for player band from an event
const eventSong = await generateSongFromAnywhere({
  bandData: playerBandState,
  context: { 
    contextType: 'event', 
    eventData: { songName: 'Event Song', genre: 'punk' },
    week: currentWeek 
  }
});
```

## Files Created

1. **`src/utils/rivalSongGenerator.js`**
   - `generateRivalSong()` - Generate song for a single rival band
   - `generateRivalSongsForChart()` - Generate songs for multiple rivals
   - `generateSongFromContext()` - Generate song from game context

2. **`src/utils/generateSongFromAnywhere.js`**
   - `generateSongFromAnywhere()` - Universal song generation utility
   - `generateSongsForChart()` - Generate multiple songs for charts

## Integration Points

### Chart System (`useRadioChartingSystem.js`)

- **`ensureRivalSongsGenerated()`**: Automatically called when charts are viewed
- **`getChartRankings()`**: Now async, generates rival songs before building chart
- Rival songs are stored in `gameState.rivalSongs` and reused until they're 4+ weeks old

### Chart Display

When viewing charts:
- Top 20 songs include both your songs and rival songs
- Each rival song is a real, playable procedural song
- Songs reflect each rival's:
  - Genre preference
  - Skill level (affects complexity)
  - Psychology (affects emotional tone)
  - Prestige (affects quality)

## Usage Examples

### Viewing Charts

```javascript
// In your component
const chartRankings = await radioCharting.getChartRankings('combined-chart');

// chartRankings now includes:
// - Your songs (from gameState.songs)
// - Rival songs (automatically generated, stored in gameState.rivalSongs)
// - Each entry has full song data in `generatedSong` property
```

### Generating Songs from Events

```javascript
// In an event handler
import { generateSongFromAnywhere } from '../utils/generateSongFromAnywhere.js';

const eventSong = await generateSongFromAnywhere({
  bandData: gameState,
  context: {
    contextType: 'event',
    eventData: {
      songName: 'The Big Gig',
      genre: 'rock'
    },
    week: gameState.week
  }
});
```

### Generating Songs for Radio

```javascript
// When a rival's song plays on radio
const radioSong = await generateSongFromAnywhere({
  bandData: rivalBand,
  context: {
    contextType: 'radio',
    station: 'beat-radio',
    week: gameState.week
  },
  options: {
    genre: rivalBand.genre
  }
});
```

## Song Storage

- **Player songs**: Stored in `gameState.songs` (as before)
- **Rival songs**: Stored in `gameState.rivalSongs` as an object:
  ```javascript
  {
    'rival-id-1': { /* full song object */ },
    'rival-id-2': { /* full song object */ },
    // ...
  }
  ```

## Performance

- Songs are generated **on-demand** when charts are viewed
- Songs are **cached** in game state for 4 weeks
- Generation happens **asynchronously** so it doesn't block the UI
- Only generates songs for **top 20 rivals** to limit processing

## Future Enhancements

- Generate songs for specific events (e.g., "Rival releases new single")
- Generate songs when rivals appear in radio rotations
- Allow players to "listen" to rival songs from charts
- Export rival songs to MIDI/TrackDraft format
