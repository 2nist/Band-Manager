# Feature Comparison: Original vs Refactored

## Key Missing Features from Original App.jsx.bak

### 1. **processWeekEffects** - Critical Weekly Processing ⚠️
**Status**: MISSING from useGameLogic  
**Location**: Original lines 636-1000+

This massive function handles:
- Weekly expenses (base, member salaries, equipment, transport, staff, label costs)
- Genre trends (dynamic shifts, seasonal boosts, trend strength)
- Album streaming revenue (2026: albums generate sustained streams)
- Song streaming calculations (with decay over time)
- Video boost effects
- Regional boosts from geographic reputation
- Chart progression for songs
- Album charting
- Morale changes from success/failure
- Fan growth from streaming
- Equipment maintenance costs
- Label royalty calculations
- Career stat tracking (legacy tier, hall of fame status)

**Impact**: Without this, weeks don't process correctly - no expenses, no streaming revenue, songs don't age, etc.

### 2. **Enhanced advanceWeek** with processWeekEffects
**Status**: EXISTS but may not call processWeekEffects  
**Location**: useGameLogic.js line 358

The original advanceWeek:
- Calls processWeekEffects to calculate all weekly changes
- Handles song aging and decay
- Processes all revenue streams
- Updates charts

### 3. **More Detailed Game Functions**

#### writeSong (Original lines 1428-1504)
- Has more detailed quality/popularity calculations
- Uses studio tiers correctly
- Handles cost multipliers for difficulty
- Better song initialization

#### recordAlbum (Original lines 1506+)
- Album creation with 8+ songs
- Album release cost calculations
- Album quality based on average song quality
- Album charting system

#### bookGig (Original lines 1750+)
- More detailed performance quality calculations
- Equipment quality impacts
- Morale bonus calculations
- Fan gain calculations
- Better gig descriptions

### 4. **Random Event Functions** (May be in hooks, need to verify)
- `maybeMemberQuit` - Band member leaving events
- `maybeSyncLicensing` - Sync licensing opportunities
- `maybeBrandPartnership` - Brand deal events
- `maybeIndustryAward` - Award show events
- `maybeChartBattle` - Chart competition events
- `maybePlaylistPlacement` - Playlist opportunities
- `maybeModernEvent` - Modern music industry events
- `maybeTroubleEvent` - Drama/crisis events
- `maybeReunionTour` - Tour opportunities
- `maybeSoloCareer` - Member solo career events

### 5. **UI Components Missing**

#### Original had more detailed UI:
- Weekly popups with summaries
- Event popups with choices
- Progress tracking displays
- Chart displays (top charts, album charts, song charts)
- Snapshot panel with quick stats
- Meters panel (morale, fame, money)
- Team panel (band member management)
- Songs panel (song list with details)

### 6. **State Features**
- Tour system (tours, tour bans)
- Equipment tiers (studio, transport, gear)
- Staff (manager, lawyer)
- Label deals with negotiation
- Rival bands system
- Geographic reputation
- Regional boosts
- Difficulty modes

## Action Plan

### Priority 1: Add processWeekEffects ⚠️ CRITICAL
1. Extract processWeekEffects from App.jsx.bak
2. Integrate into useGameLogic's advanceWeek
3. Test that weeks process correctly (expenses, revenue, song aging)

### Priority 2: Verify Game Functions Match
1. Compare writeSong, recordAlbum, bookGig implementations
2. Update useGameLogic versions to match original complexity
3. Ensure all calculations match

### Priority 3: Wire Up UI Components
1. Add buttons/actions in tabs to call gameLogic functions
2. Connect modal states to open/close properly
3. Ensure game state updates reflect in UI immediately

### Priority 4: Add Missing UI Panels
1. Weekly summary popups
2. Chart displays
3. Progress tracking
4. Detailed song/album management

## Files to Check/Update

1. **src/hooks/useGameLogic.js**
   - Add processWeekEffects function
   - Update advanceWeek to call it
   - Verify all game functions match original

2. **src/components/Tabs/**
   - InventoryTab - Wire up song/album creation
   - GigsTab - Wire up gig booking
   - BandTab - Wire up member management
   - UpgradesTab - Wire up equipment upgrades

3. **src/pages/GamePage.jsx**
   - Ensure all modals work
   - Wire up weekly summaries
   - Add chart displays
