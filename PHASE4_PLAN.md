# Phase 4: Advanced Systems Implementation Plan

**Status**: 🚀 Starting  
**Goal**: Add advanced revenue streams and tracking systems to enhance gameplay depth

---

## Overview

Phase 4 builds on the foundation of Phases 0-3 by adding:
1. **Merchandise Revenue Integration** - Connect existing merchandise system to weekly processing
2. **Social Media Growth** - Track followers and engagement across platforms
3. **Tour Revenue** - Calculate income from active tours
4. **Geographic Reputation** - Track fame in different regions
5. **Career Stats Tracking** - Lifetime statistics and achievements

---

## Phase 4 Features

### 1. Merchandise Revenue Integration ✅ (Hook exists, needs integration)

**Current State**:
- `useMerchandiseSystem` hook exists with `processWeeklySales()` function
- Merchandise system tracks inventory, sales, revenue
- **Missing**: Integration into `processWeekEffects.js`

**Implementation**:
- Add merchandise revenue to weekly processing
- Include in weekly summary
- Track merchandise revenue separately in stats

**Files to Modify**:
- `src/utils/processWeekEffects.js` - Add merchandise processing
- `src/hooks/useGameLogic.js` - Ensure merchandise hook is called

---

### 2. Social Media Growth System

**Features**:
- Track followers on TikTok, Instagram, Twitter/X
- Calculate engagement rates
- Social media growth based on:
  - Band fame
  - Recent releases (songs/albums)
  - Viral moments
  - Active promotion
- Social media metrics affect:
  - Algorithm favor (for streaming)
  - Merchandise sales
  - Tour ticket sales

**Implementation**:
- Add `socialMedia` state property
- Create `calculateSocialMediaGrowth()` function
- Integrate into weekly processing
- Display in UI (new panel or expand existing)

**State Structure**:
```javascript
socialMedia: {
  tiktok: { followers: 0, engagement: 0, growth: 0 },
  instagram: { followers: 0, engagement: 0, growth: 0 },
  twitter: { followers: 0, engagement: 0, growth: 0 }
}
```

---

### 3. Tour Revenue System

**Features**:
- Calculate revenue from active tours
- Tour revenue based on:
  - Venue capacity
  - Ticket price
  - Regional reputation
  - Band fame
  - Merchandise sales at shows
- Track active tours in state
- Tour fatigue mechanics (band needs rest)

**Implementation**:
- Add `activeTours` state property
- Create `calculateTourRevenue()` function
- Integrate into weekly processing
- Update tour management UI

**State Structure**:
```javascript
activeTours: [{
  name: string,
  cities: string[],
  startWeek: number,
  endWeek: number,
  expectedRevenue: number,
  currentWeek: number
}]
```

---

### 4. Geographic Reputation System

**Features**:
- Track reputation in different regions:
  - United States
  - United Kingdom
  - Europe
  - Asia
  - Other regions
- Reputation affects:
  - Tour booking opportunities
  - Streaming revenue (regional preferences)
  - Merchandise sales
- Reputation grows from:
  - Streaming success in region
  - Touring in region
  - Chart performance

**Implementation**:
- Add `regionalReputation` state property
- Create `calculateRegionalReputation()` function
- Update based on streaming/touring activity
- Display in UI (map or list view)

**State Structure**:
```javascript
regionalReputation: {
  us: 0,      // 0-100
  uk: 0,
  europe: 0,
  asia: 0,
  other: 0
}
```

---

### 5. Career Stats Tracking

**Features**:
- Lifetime statistics:
  - Total streams
  - Total revenue
  - Albums released
  - Songs released
  - Tours completed
  - Weeks active
  - Peak chart positions
  - Social media milestones
- Achievement system:
  - "First Million Streams"
  - "Chart Topper" (reached #1)
  - "World Traveler" (toured 5+ regions)
  - "Social Media Star" (1M+ followers)
  - "Merch Mogul" ($100K+ merch sales)

**Implementation**:
- Add `careerStats` state property
- Update stats on key events
- Create achievement checking system
- Display in UI (new "Stats" tab or panel)

**State Structure**:
```javascript
careerStats: {
  totalStreams: 0,
  totalRevenue: 0,
  albumsReleased: 0,
  songsReleased: 0,
  toursCompleted: 0,
  weeksActive: 0,
  peakChartPosition: 100,
  achievements: []
}
```

---

## Implementation Order

### Sprint 1: Merchandise Integration (Quick Win) ✅ COMPLETE
1. ✅ Integrate merchandise revenue into `processWeekEffects.js`
2. ✅ Add to weekly summary
3. ✅ Test with existing merchandise system
4. ✅ **Completed**: ~2 hours
5. ✅ See `PHASE4_SPRINT1_COMPLETE.md` for details

### Sprint 2: Social Media Growth
1. Add social media state structure
2. Create growth calculation function
3. Integrate into weekly processing
4. Add UI display
5. **Estimated**: 4-5 hours

### Sprint 3: Tour Revenue
1. Add tour state structure
2. Create revenue calculation function
3. Integrate into weekly processing
4. Update tour management
5. **Estimated**: 4-5 hours

### Sprint 4: Geographic Reputation
1. Add regional reputation state
2. Create reputation calculation function
3. Update based on activity
4. Add UI display
5. **Estimated**: 3-4 hours

### Sprint 5: Career Stats
1. Add career stats state
2. Create stat tracking functions
3. Add achievement system
4. Create stats UI
5. **Estimated**: 4-5 hours

**Total Estimated Time**: 17-22 hours

---

## Files to Create/Modify

### New Files
- `src/utils/socialMediaGrowth.js` - Social media calculations
- `src/utils/tourRevenue.js` - Tour revenue calculations
- `src/utils/geographicReputation.js` - Regional reputation
- `src/utils/careerStats.js` - Career statistics tracking
- `src/__tests__/processWeekEffects.test.js` - Add Phase 4 tests

### Modified Files
- `src/utils/processWeekEffects.js` - Integrate all Phase 4 systems
- `src/hooks/useGameLogic.js` - Ensure all hooks are connected
- `src/components/Panels/` - Add new panels for stats/reputation
- `src/components/Tabs/` - Add stats tab or expand existing

---

## Testing Requirements

Each feature needs:
- Unit tests for calculation functions
- Integration tests with `processWeekEffects`
- Edge case handling (empty state, missing data)
- Balance testing (revenue amounts, growth rates)

**Test Coverage Goal**: 80%+ for new code

---

## Success Criteria

Phase 4 is complete when:
- ✅ Merchandise revenue integrated into weekly processing
- ✅ Social media growth calculated and displayed
- ✅ Tour revenue calculated for active tours
- ✅ Geographic reputation tracked and updated
- ✅ Career stats tracked and displayed
- ✅ All features have tests
- ✅ UI displays all new information
- ✅ Build passes with 0 errors
- ✅ All tests passing

---

## Next Steps After Phase 4

**Phase 5 Potential Features**:
- Advanced AI event generation
- Multiplayer/leaderboards
- Visual enhancements (charts, graphs)
- Scenario system expansion
- Advanced label negotiations

---

## Notes

- Merchandise system already exists, just needs integration
- Social media should feel modern (2026 focus)
- Tour revenue should scale appropriately with fame
- Geographic reputation unlocks new opportunities
- Career stats provide long-term goals and replayability

---

**Ready to begin Sprint 1: Merchandise Integration** 🚀
