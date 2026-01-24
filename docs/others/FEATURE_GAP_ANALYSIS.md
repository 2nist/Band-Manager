# Feature Gap Analysis: Original Rockstar Game vs Current Implementation

Based on research of the original **Rockstar!** (1989, DOS) by Wizard Games and analysis of the current codebase.

## ✅ Features Already Implemented

### Core Gameplay
- ✅ **Band Assembly**: Create band members with roles (vocals, guitar, bass, drums, synth, DJ)
- ✅ **Member Stats**: Skill, creativity, stage presence, reliability, morale, drama
- ✅ **Song Recording**: Record songs with quality/popularity metrics
- ✅ **Gigs**: Book gigs at venues with varying sizes and pay
- ✅ **Equipment Upgrades**: Studio tiers, transport tiers, gear tiers
- ✅ **Random Events**: Drama events, drug use, hospital, rehab, police busts
- ✅ **Health/Lifestyle Mechanics**: Morale, burnout, drug consequences
- ✅ **Rehearsal/Practice**: Rehearse to improve skills
- ✅ **Rest System**: Recover morale and reduce drama
- ✅ **Fame System**: Track fame progression
- ✅ **Charts**: Top bands chart, album chart, song chart
- ✅ **Genre Selection**: 16 genres with theme-based UI
- ✅ **Promotion/Publicity**: Radio interviews, media pushes (Radio Tinpot!)
- ✅ **Tour Offers**: Events offering tour opportunities
- ✅ **Merchandise**: Revenue from merch (unlocked at 50+ fame)
- ✅ **Streaming Revenue**: Weekly royalties from streams
- ✅ **Staff**: Manager and lawyer options

---

## ❌ Missing Features from Original Rockstar Game

### 1. **Geographic Touring System** 🔴 HIGH PRIORITY
**Original Game**: Touring in different regions (local → national → Europe → international) with:
- Different costs per region
- Different risks and rewards
- Regional market differences
- Travel costs and logistics

**Current Status**: 
- Only local venues with fame requirements
- No geographic regions or travel mechanics
- Tour offers exist but are event-based only
- `tourCities` array exists in `events.json` but not used for gameplay

**Implementation Suggestion**:
```javascript
const REGIONS = [
  { id: 'local', name: 'Local Scene', cost: 0, fameReq: 0, basePay: 1.0 },
  { id: 'regional', name: 'Regional Tour', cost: 300, fameReq: 50, basePay: 1.5 },
  { id: 'national', name: 'National Tour', cost: 800, fameReq: 150, basePay: 2.0 },
  { id: 'europe', name: 'European Tour', cost: 2000, fameReq: 250, basePay: 2.5 },
  { id: 'world', name: 'World Tour', cost: 5000, fameReq: 400, basePay: 3.5 }
];
```

### 2. **Record Label System** 🔴 HIGH PRIORITY
**Original Game**: 
- Sign with record labels (small → major)
- Contract negotiations
- Label support (marketing, distribution, advances)
- Contract terms and obligations

**Current Status**:
- "Record Label Interest!" event exists but just gives money/fame
- No persistent label contracts
- No label benefits beyond one-time event

**Implementation Suggestion**:
```javascript
const LABELS = [
  { name: 'Indie Label', advance: 500, marketing: 0.1, distribution: 1.0, fameReq: 50 },
  { name: 'Mid-Size Label', advance: 2000, marketing: 0.2, distribution: 1.5, fameReq: 150 },
  { name: 'Major Label', advance: 10000, marketing: 0.4, distribution: 2.0, fameReq: 300 }
];
```

### 3. **Single vs Album Distinction** 🔴 HIGH PRIORITY
**Original Game**:
- Separate mechanics for singles and albums
- Singles are cheaper/quicker but less impactful
- Albums require multiple songs and more investment
- Albums provide larger fame/popularity boosts

**Current Status**:
- `writeSong()` creates individual songs only
- Albums exist in state (`state.albums`) but no function creates them
- Album chart exists but albums are never added
- Music Video can boost albums but albums don't exist to boost

**Implementation Suggestion**:
```javascript
const recordAlbum = () => {
  // Requires 8-12 songs
  // Higher cost than single
  // Combines song qualities
  // Creates album entry with combined popularity
};
```

### 4. **Market Trends & Genre Shifts** 🟡 MEDIUM PRIORITY
**Original Game**:
- Genre popularity shifts over time
- Market trends affect album sales
- Uneasy markets mentioned as a feature

**Current Status**:
- Basic trend system exists (`trend` in state)
- Genre trends give popularity bonuses
- But trends are simple and don't affect market dynamics much

**Implementation Enhancement**: Make trends more impactful with:
- Regional genre preferences
- Trend decay/evolution
- Genre-specific market effects

### 5. **Campaign/Scenario Mode** 🟡 MEDIUM PRIORITY
**Original Game**:
- Goal-oriented gameplay
- Clear win conditions
- Different starting scenarios

**Current Status**:
- Open-ended sandbox only
- No victory conditions
- No objectives or missions

**Implementation Suggestion**:
```javascript
const SCENARIOS = [
  { name: 'Rags to Riches', startMoney: 500, goal: { fame: 500, money: 50000 } },
  { name: 'Indie Success', startMoney: 2000, goal: { albums: 3, fame: 300 } },
  { name: 'World Domination', startMoney: 5000, goal: { worldTour: true, fame: 1000 } }
];
```

### 6. **Recording Scheduling/Time Management** 🟡 MEDIUM PRIORITY
**Original Game**:
- Balance recording time vs touring vs rest
- Scheduling conflicts
- Time as a resource

**Current Status**:
- Weekly turn-based (one action per week)
- No time conflicts or scheduling
- Simple cooldowns only

### 7. **Drug Use Consequences System** 🟢 LOW PRIORITY (Already Partially Implemented)
**Original Game**:
- More nuanced drug mechanics
- Addiction tracking
- Long-term health consequences

**Current Status**:
- Drug events exist (drugUse, drugRefuse, drugBuy)
- Hospital/rehab events
- But no persistent addiction stat or long-term tracking

### 8. **"Laze About" / Do Nothing Option** 🟢 LOW PRIORITY
**Original Game**:
- Explicit option to do nothing for a week
- Sometimes beneficial for morale/health

**Current Status**:
- No explicit "do nothing" action
- Rest exists but costs a week

### 9. **Regional Reputation** 🟡 MEDIUM PRIORITY
**Original Game**:
- Different fame/reputation per region
- Building reputation in specific markets

**Current Status**:
- Single global fame stat
- No regional breakdown

### 10. **Equipment Details** 🟢 LOW PRIORITY
**Original Game**:
- More granular equipment choices
- Used/dodgy gear options mentioned in similar games

**Current Status**:
- Good tier system exists
- Could add more flavor/options

---

## 📊 Priority Ranking

### Must Have (Matches Original Game Core)
1. **Geographic Touring System** - Core to original gameplay
2. **Record Label Contracts** - Major feature of original
3. **Single vs Album Distinction** - Fundamental mechanic (albums partially coded but not functional)

### Should Have (Important for Authenticity)
4. **Campaign/Scenario Mode** - Adds structure and replayability
5. **Regional Reputation** - Enhances touring system
6. **Market Trends Enhancement** - Make existing system more impactful

### Nice to Have (Polish)
7. **Recording Scheduling** - Adds depth to time management
8. **Drug Use Tracking** - Expand existing system
9. **Equipment Expansion** - More options
10. **"Do Nothing" Option** - Complete the action set

---

## 🔧 Implementation Notes

### Albums Are Partially Implemented
The codebase has album support in several places:
- `state.albums` exists in initial state
- `albumChart` computed from albums
- `latestAlbum` memoization
- Album promotion in Music Video action
- BUT: No function to actually create albums!

This suggests albums were planned but never fully implemented. The `recordAlbum()` function needs to be created.

### Tour Cities Exist But Unused
`events.json` has a `tourCities` array with 15 cities, but it's never referenced in the code. This could be used for the geographic touring system.

### Record Label Event Exists
There's a "Record Label Interest!" event, but it's just a one-time payout. This should be expanded into a full label system with contracts.

---

## 🎯 Recommended Implementation Order

1. **Week 1**: Implement Album Recording System (fix existing partial implementation)
2. **Week 2**: Add Geographic Touring with Regions
3. **Week 3**: Implement Record Label Contracts
4. **Week 4**: Add Scenario/Campaign Mode
5. **Week 5**: Enhance Regional Reputation and Market Trends
6. **Week 6**: Polish and balance all new systems

This would bring the game much closer to the original Rockstar! experience while maintaining the modern React UI improvements.
