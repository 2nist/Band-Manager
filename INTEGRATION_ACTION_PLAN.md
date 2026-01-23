# Integration Action Plan
## Restoring Chart System & Procedural Music Generation

**Created**: January 2026  
**Priority**: HIGH - Core features missing from game

---

## Overview

Two critical systems need integration:
1. **Chart Display System** (6-8 hours) - #1 Priority
2. **Procedural Music Generation** (4-6 hours) - #2 Priority

---

## Part 1: Chart Display System Restoration

### Step 1: Create Chart Calculation Hook (2 hours)

**File**: `src/hooks/useChartSystem.js` (NEW)

**Purpose**: Centralize all chart calculation logic

**Implementation**:
```javascript
import { useMemo } from 'react';

export const useChartSystem = (gameState, rivals = []) => {
  // Top 20 Artist Chart - Ranked by fame
  const chartLeaders = useMemo(() => {
    const playerBand = gameState?.bandName ? {
      name: gameState.bandName,
      fame: gameState.fame || 0,
      isPlayer: true,
      songs: gameState.songs || [],
      albums: gameState.albums || [],
      totalStreams: calculateTotalStreams(gameState)
    } : null;
    
    const pool = playerBand ? [...rivals, playerBand] : [...rivals];
    const sorted = [...pool].sort((a, b) => b.fame - a.fame);
    return sorted.slice(0, 20).map((b, idx) => ({ ...b, position: idx + 1 }));
  }, [gameState, rivals]);

  // Top 20 Album Chart - Ranked by chartScore
  const albumChart = useMemo(() => {
    const playerAlbums = (gameState?.albums || []).map(a => ({
      ...a,
      bandName: gameState.bandName || 'Your Band',
      isPlayer: true,
      chartScore: a.chartScore ?? calculateAlbumChartScore(a),
      totalStreams: calculateAlbumStreams(a)
    }));
    
    const rivalAlbums = rivals.flatMap(r => 
      (r.albums || []).map(a => ({
        ...a,
        bandName: r.name,
        isPlayer: false,
        chartScore: a.chartScore ?? calculateAlbumChartScore(a),
        totalStreams: calculateAlbumStreams(a)
      }))
    );
    
    const allAlbums = [...playerAlbums, ...rivalAlbums];
    const sorted = allAlbums.sort((a, b) => (b.chartScore || 0) - (a.chartScore || 0));
    return sorted.slice(0, 20).map((a, idx) => ({ ...a, position: idx + 1 }));
  }, [gameState, rivals]);

  // Top 30 Song Chart - Ranked by chartScore
  const songChart = useMemo(() => {
    const playerSongs = (gameState?.songs || []).map(s => ({
      ...s,
      bandName: gameState.bandName || 'Your Band',
      isPlayer: true,
      chartScore: calculateSongChartScore(s)
    }));
    
    const rivalSongs = rivals.flatMap(r => 
      (r.songs || []).map(s => ({
        ...s,
        bandName: r.name,
        isPlayer: false,
        chartScore: calculateSongChartScore(s)
      }))
    );
    
    const allSongs = [...playerSongs, ...rivalSongs];
    const sorted = allSongs.sort((a, b) => (b.chartScore || 0) - (a.chartScore || 0));
    return sorted.slice(0, 30).map((s, idx) => ({ ...s, position: idx + 1 }));
  }, [gameState, rivals]);

  return { chartLeaders, albumChart, songChart };
};

// Helper functions
function calculateTotalStreams(gameState) {
  const songStreams = (gameState.songs || []).reduce((sum, s) => 
    sum + (s.weeklyStreams || 0), 0
  );
  const albumStreams = (gameState.albums || []).reduce((sum, a) => 
    sum + calculateAlbumStreams(a), 0
  );
  return songStreams + albumStreams;
}

function calculateAlbumChartScore(album) {
  return Math.max(0, Math.floor((album.quality || 0) * 0.8 + (album.popularity || 0) * 0.3));
}

function calculateAlbumStreams(album) {
  return Math.floor((album.quality || 0) * 150 + (album.popularity || 0) * 80) * 
         Math.max(0.3, 1 - (album.age || 0) * 0.02);
}

function calculateSongChartScore(song) {
  return (song.popularity || 0) * 10 + (song.weeklyStreams || 0) * 0.1;
}
```

**Action Items**:
- [ ] Create `src/hooks/useChartSystem.js`
- [ ] Add helper functions for calculations
- [ ] Export from `src/hooks/index.js`

---

### Step 2: Update Chart Panel Components (2 hours)

**Files to Update**:
- `src/components/Panels/TopChartPanel.jsx`
- `src/components/Panels/AlbumsPanel.jsx`
- `src/components/Panels/SongChartPanel.jsx`

**TopChartPanel.jsx** - Update to show artist rankings:
```javascript
export const TopChartPanel = ({ chartLeaders, onBandClick }) => (
  <div className="bg-card border border-primary/30 p-4 rounded-lg">
    <h3 className="text-lg font-bold text-foreground mb-4">Top 20 Artists</h3>
    {chartLeaders?.length > 0 ? (
      <ol className="space-y-2">
        {chartLeaders.map((band) => (
          <li
            key={band.name}
            onClick={() => onBandClick?.(band)}
            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
              band.isPlayer 
                ? 'bg-primary/20 border-primary' 
                : 'bg-card border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-muted-foreground">#{band.position}</span>
                <div>
                  <div className="font-semibold text-foreground">{band.name}</div>
                  {band.isPlayer && (
                    <span className="text-xs text-primary">Your Band</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-accent">{band.fame || 0}</div>
                <div className="text-xs text-muted-foreground">Fame</div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    ) : (
      <p className="text-muted-foreground">No artists on chart yet.</p>
    )}
  </div>
);
```

**AlbumsPanel.jsx** - Update to show album chart:
```javascript
export const AlbumsPanel = ({ albumChart }) => (
  <div className="bg-card border border-secondary/30 p-4 rounded-lg">
    <h3 className="text-lg font-bold text-foreground mb-4">Top 20 Albums</h3>
    {albumChart?.length > 0 ? (
      <ol className="space-y-2">
        {albumChart.map((album) => (
          <li
            key={`${album.name}-${album.bandName}`}
            className={`p-3 rounded-lg border-2 ${
              album.isPlayer 
                ? 'bg-secondary/20 border-secondary' 
                : 'bg-card border-border'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-bold text-muted-foreground">#{album.position}</span>
                <span className="ml-2 font-semibold text-foreground">{album.name}</span>
              </div>
              <div className="text-right text-sm">
                <div className="font-bold text-secondary">Score: {album.chartScore || 0}</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              by {album.bandName} • Q{album.quality || 0} • Pop {album.popularity || 0} • 
              {album.totalStreams ? ` ${(album.totalStreams / 1000).toFixed(1)}k streams/wk` : ' 0 streams'} • 
              Age {album.age || 0}w
            </div>
          </li>
        ))}
      </ol>
    ) : (
      <p className="text-muted-foreground">No albums on chart yet.</p>
    )}
  </div>
);
```

**SongChartPanel.jsx** - Update to show song chart:
```javascript
export const SongChartPanel = ({ songChart }) => (
  <div className="bg-card border border-accent/30 p-4 rounded-lg">
    <h3 className="text-lg font-bold text-foreground mb-4">Top 30 Songs</h3>
    {songChart?.length > 0 ? (
      <ol className="space-y-2 max-h-[600px] overflow-y-auto">
        {songChart.map((song) => (
          <li
            key={`${song.title}-${song.bandName}`}
            className={`p-3 rounded-lg border-2 ${
              song.isPlayer 
                ? 'bg-accent/20 border-accent' 
                : 'bg-card border-border'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-bold text-muted-foreground">#{song.position}</span>
                <span className="ml-2 font-semibold text-foreground">{song.title}</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              by {song.bandName} • Pop {song.popularity || 0} • Q{song.quality || 0} • 
              {song.weeklyStreams ? ` ${(song.weeklyStreams / 1000).toFixed(1)}k` : ' 0'} streams/wk • 
              Age {song.age || 0}w
            </div>
          </li>
        ))}
      </ol>
    ) : (
      <p className="text-muted-foreground">No songs on chart yet.</p>
    )}
  </div>
);
```

**Action Items**:
- [ ] Update TopChartPanel.jsx with artist chart
- [ ] Update AlbumsPanel.jsx with album chart rankings
- [ ] Update SongChartPanel.jsx with song chart rankings
- [ ] Add proper styling and player highlighting

---

### Step 3: Update RightPanel Component (1 hour)

**File**: `src/components/Panels/RightPanel.jsx`

**Update to use new chart data**:
```javascript
import { TopChartPanel } from './TopChartPanel';
import { AlbumsPanel } from './AlbumsPanel';
import { SongChartPanel } from './SongChartPanel';

export const RightPanel = ({ 
  activeTab = 'topChart', 
  onTabChange,
  chartLeaders,
  albumChart,
  songChart,
  onBandClick
}) => {
  const tabs = [
    { id: 'topChart', label: 'Top 20 Artists' },
    { id: 'albums', label: 'Top 20 Albums' },
    { id: 'songChart', label: 'Top 30 Songs' }
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border/20">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={`px-4 py-2 font-medium transition-all ${
              activeTab === tab.id
                ? 'border-b-2 border-primary text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'topChart' && (
          <TopChartPanel chartLeaders={chartLeaders} onBandClick={onBandClick} />
        )}
        {activeTab === 'albums' && (
          <AlbumsPanel albumChart={albumChart} />
        )}
        {activeTab === 'songChart' && (
          <SongChartPanel songChart={songChart} />
        )}
      </div>
    </div>
  );
};
```

**Action Items**:
- [ ] Update RightPanel.jsx to accept chart data props
- [ ] Add tab navigation with state management
- [ ] Wire up all three chart panels

---

### Step 4: Integrate into GamePage (2 hours)

**File**: `src/pages/GamePage.jsx`

**Add chart system**:
```javascript
// At top of file
import { useChartSystem } from '../hooks/useChartSystem';
import { RightPanel } from '../components/Panels/RightPanel';

// Inside GamePage component
export const GamePage = ({ ... }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chartTab, setChartTab] = useState('topChart'); // NEW
  
  // Get rivals from gameState or rivalCompetition system
  const rivals = rivalCompetition?.getRivals?.() || gameState?.state?.rivals || [];
  
  // Calculate charts
  const { chartLeaders, albumChart, songChart } = useChartSystem(
    gameState?.state || {},
    rivals
  );

  // ... existing code ...

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header, Tabs, Content - existing code */}
      </div>

      {/* Right Sidebar - Charts */}
      <div className="w-80 border-l border-border/20 bg-card/50 p-4">
        <RightPanel
          activeTab={chartTab}
          onTabChange={setChartTab}
          chartLeaders={chartLeaders}
          albumChart={albumChart}
          songChart={songChart}
          onBandClick={(band) => {
            // Open band stats modal or navigate
            if (band.isPlayer) {
              // Show player stats
            } else {
              // Show rival stats
            }
          }}
        />
      </div>
    </div>
  );
};
```

**Action Items**:
- [ ] Import useChartSystem hook
- [ ] Import RightPanel component
- [ ] Get rivals data (check where rivals are stored)
- [ ] Add chart tab state
- [ ] Add RightPanel to GamePage layout
- [ ] Wire up chart data props
- [ ] Test chart display

---

### Step 5: Get Rivals Data (1 hour)

**Rivals Data Structure**:
- Rivals are stored in `gameState.state.rivalBands` (not `rivals`)
- Rivals have: `id`, `name`, `genre`, `prestige`, `rivalryLevel`, etc.
- **IMPORTANT**: Rivals may not have `songs`/`albums` properties yet
- Need to check if `useRadioChartingSystem` generates rival songs

**Check Required**:
- Verify `useRadioChartingSystem.ensureRivalSongsGenerated()` exists
- Check if rival songs are stored in `gameState.state.rivalSongs`
- May need to generate rival songs/albums for chart display

**Action Items**:
- [ ] Get rivals from `gameState.state.rivalBands`
- [ ] Check if `radioCharting.ensureRivalSongsGenerated()` exists
- [ ] Generate rival songs/albums if needed
- [ ] Map rival data to chart format (may need to combine with rivalSongs)
- [ ] Wire rivals into chart system
- [ ] Test with rival data

**Note**: If rivals don't have songs/albums, we may need to:
1. Use `useRadioChartingSystem` to generate them
2. Or create a simplified chart that only shows player content initially
3. Or generate rival songs on-the-fly for chart display

---

## Part 2: Procedural Music Generation Integration

### Step 1: Add Hook to GamePage (30 minutes)

**File**: `src/pages/GamePage.jsx`

```javascript
// Add import
import { useMusicGeneration } from '../hooks/useMusicGeneration';

// Inside GamePage component
const musicGeneration = useMusicGeneration();

// Pass to InventoryTab
<InventoryTab
  // ... existing props
  musicGeneration={musicGeneration}
/>
```

**Action Items**:
- [ ] Import useMusicGeneration
- [ ] Initialize hook in GamePage
- [ ] Pass to InventoryTab

---

### Step 2: Update InventoryTab (2 hours)

**File**: `src/components/Tabs/InventoryTab.jsx`

**Add procedural generation**:
```javascript
import { SongGenerationPanel } from '../SongGenerationPanel';
import { SongPlaybackPanel } from '../SongPlaybackPanel';
import { useMusicGeneration } from '../../hooks/useMusicGeneration';

export const InventoryTab = ({ 
  gameData, 
  recordingSystem, 
  gameState, 
  gameLogic, 
  modalState,
  musicGeneration // NEW
}) => {
  const [generatingMode, setGeneratingMode] = useState('legacy');
  const [generatedSong, setGeneratedSong] = useState(null);
  const [showPlaybackPanel, setShowPlaybackPanel] = useState(false);

  // When procedural mode selected
  const handleProceduralGenerate = async (genre) => {
    if (!songName.trim()) {
      alert('Enter a song name');
      return;
    }

    setIsGenerating(true);
    try {
      const song = await musicGeneration.generateSong({
        title: songName,
        genre: genre,
        gameState: gameState?.state || {}
      });
      
      if (song) {
        setGeneratedSong(song);
        setShowPlaybackPanel(true);
      }
    } catch (error) {
      console.error('Song generation failed:', error);
      alert('Error generating song: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // In the form section, add procedural mode UI
  {generatingMode === 'procedural' && (
    <SongGenerationPanel
      gameState={gameState?.state || {}}
      onSongGenerated={handleProceduralGenerate}
      disabled={isGenerating}
      cost={recordCost}
    />
  )}

  // Add playback panel modal
  {generatedSong && showPlaybackPanel && (
    <SongPlaybackPanel
      song={generatedSong}
      gameState={gameState?.state || {}}
      onAccept={() => {
        // Save song to game state
        const analysis = generatedSong.analysis || {};
        gameLogic.writeSong({
          title: generatedSong.title,
          genre: generatedSong.genre,
          quality: Math.round(analysis.qualityScore || 50),
          energy: Math.floor((analysis.originalityScore || 50) / 10),
          generatedData: generatedSong
        });
        setShowPlaybackPanel(false);
        setGeneratedSong(null);
      }}
      onClose={() => {
        setShowPlaybackPanel(false);
        setGeneratedSong(null);
      }}
    />
  )}
};
```

**Action Items**:
- [ ] Import SongGenerationPanel and SongPlaybackPanel
- [ ] Add procedural generation handler
- [ ] Add playback panel modal
- [ ] Wire up song acceptance to gameLogic
- [ ] Test procedural generation flow

---

### Step 3: Connect Fan Reactions (1 hour)

**File**: `src/components/Tabs/InventoryTab.jsx`

**Add fan reaction system**:
```javascript
import { FanReactionSystem } from '../../music/FanReactionSystem';

// In onAccept handler
onAccept={() => {
  // Save song
  gameLogic.writeSong({...});
  
  // Apply fan reactions
  const reactionData = FanReactionSystem.generateReactions(
    generatedSong,
    gameState?.state?.fanbase || {}
  );
  
  if (reactionData?.impact && gameState?.updateGameState) {
    const updates = {};
    if (reactionData.impact.fameGain) {
      updates.fame = (gameState.state?.fame || 0) + reactionData.impact.fameGain;
    }
    if (reactionData.impact.moneyGain) {
      updates.money = (gameState.state?.money || 0) + reactionData.impact.moneyGain;
    }
    if (Object.keys(updates).length > 0) {
      gameState.updateGameState(updates);
    }
  }
  
  setShowPlaybackPanel(false);
  setGeneratedSong(null);
}}
```

**Action Items**:
- [ ] Import FanReactionSystem
- [ ] Generate reactions after song creation
- [ ] Apply fame/money gains
- [ ] Test fan reaction integration

---

### Step 4: Test Audio Playback (30 minutes)

**Action Items**:
- [ ] Test Tone.js audio context initialization
- [ ] Verify song playback works
- [ ] Test play/pause/stop controls
- [ ] Check MIDI export functionality
- [ ] Verify TrackPlayer component works

---

## Implementation Order

### Phase 1: Chart System (6-8 hours)
1. ✅ Create useChartSystem hook
2. ✅ Update chart panel components
3. ✅ Update RightPanel
4. ✅ Integrate into GamePage
5. ✅ Get rivals data
6. ✅ Test chart display

### Phase 2: Music Generation (4-6 hours)
1. ✅ Add hook to GamePage
2. ✅ Update InventoryTab
3. ✅ Connect fan reactions
4. ✅ Test audio playback

---

## Testing Checklist

### Chart System
- [ ] Top 20 Artists chart displays correctly
- [ ] Top 20 Albums chart displays correctly
- [ ] Top 30 Songs chart displays correctly
- [ ] Player content highlighted
- [ ] Rival content included
- [ ] Chart positions update correctly
- [ ] Tab navigation works
- [ ] Charts update on week advancement

### Music Generation
- [ ] Procedural mode available in InventoryTab
- [ ] Song generation works
- [ ] Audio playback works
- [ ] Song acceptance saves to game state
- [ ] Fan reactions apply correctly
- [ ] MIDI export works
- [ ] Cost deduction works

---

## Files to Create/Modify

### New Files
- `src/hooks/useChartSystem.js`

### Files to Modify
- `src/components/Panels/TopChartPanel.jsx`
- `src/components/Panels/AlbumsPanel.jsx`
- `src/components/Panels/SongChartPanel.jsx`
- `src/components/Panels/RightPanel.jsx`
- `src/pages/GamePage.jsx`
- `src/components/Tabs/InventoryTab.jsx`
- `src/hooks/index.js` (export useChartSystem)

---

## Estimated Time

- **Chart System**: 6-8 hours
- **Music Generation**: 4-6 hours
- **Total**: 10-14 hours

---

## Next Steps

1. Start with Chart System (Step 1: Create useChartSystem hook)
2. Test each step before moving to next
3. Verify rivals data source before Step 4
4. Then move to Music Generation integration

---

**Ready to start?** Begin with Step 1 of Chart System restoration.

---

## Quick Start Guide

### Option A: Start with Chart System (Recommended)
1. **Create `useChartSystem` hook** - Extract chart logic from App.jsx.bak
2. **Update chart panels** - Make them display real chart data
3. **Integrate into GamePage** - Add right sidebar with charts
4. **Test and iterate**

### Option B: Start with Music Generation (Faster)
1. **Add hook to GamePage** - Initialize useMusicGeneration
2. **Update InventoryTab** - Add procedural mode UI
3. **Test generation** - Verify it works end-to-end
4. **Add fan reactions** - Connect to game state

### Recommended Approach
**Start with Chart System** because:
- It's a core feature that was in original
- More visible impact for players
- Foundation for chart battle events
- Can be done incrementally (show player-only charts first, add rivals later)

---

## Getting Started Right Now

### Immediate Next Steps:

1. **Create the hook file**:
   ```bash
   # Create new file
   touch src/hooks/useChartSystem.js
   ```

2. **Copy chart logic from App.jsx.bak** (lines 315-406)

3. **Adapt to new architecture**:
   - Use `gameState.state` instead of `state`
   - Use `gameState.state.rivalBands` for rivals
   - Export as hook

4. **Test in GamePage**:
   - Import hook
   - Call with gameState
   - Log results to console
   - Verify calculations work

5. **Then integrate UI**:
   - Update panels
   - Add to GamePage
   - Test display

---

## Common Issues & Solutions

### Issue: Rivals don't have songs/albums
**Solution**: 
- Check `useRadioChartingSystem.ensureRivalSongsGenerated()`
- Or generate on-the-fly for chart display
- Or show player-only charts initially

### Issue: Chart calculations slow
**Solution**: 
- Use `useMemo` (already in plan)
- Cache results
- Only recalculate when gameState changes

### Issue: Right sidebar breaks layout
**Solution**: 
- Use flexbox layout
- Make sidebar collapsible
- Responsive: hide on mobile

### Issue: Music generation fails
**Solution**: 
- Check Tone.js initialization
- Verify audio context started
- Add error handling
- Fallback to basic mode

---

**Let's begin!** Start with creating `useChartSystem.js` hook.
