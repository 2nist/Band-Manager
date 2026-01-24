# Development Plan: Modernized Band Manager 2026
## Phase 2 Implementation Roadmap

---

## 🎯 Design Principles

### Modernization Goals (1989 → 2026)
- **Streaming-First**: Spotify, Apple Music, TikTok, YouTube Music dominance
- **Social Media Integration**: Instagram, TikTok, Twitter/X as core promotion channels
- **Algorithm-Driven Discovery**: Playlists, viral moments, algorithm favor
- **Diverse Revenue Streams**: Sync licensing, brand deals, Patreon, NFTs/Web3, virtual concerts
- **Modern Label Landscape**: Distribution deals, 360 deals, independent vs major
- **Global Digital Reach**: Geographic touring remains but digital global presence is primary
- **Real-time Analytics**: Engagement metrics, streaming data, social metrics

### UX Principles
- **Information Hierarchy**: Most important actions accessible within 2 clicks
- **Progressive Disclosure**: Advanced features revealed as player progresses
- **Visual Feedback**: Clear indicators for cooldowns, requirements, and outcomes
- **Mobile-Friendly**: Responsive design (though desktop-first for complexity)
- **Contextual Help**: Tooltips and inline explanations for new systems
- **Consistent Patterns**: Reuse existing modal/tab patterns

---

## 📅 Phase 2 Implementation Plan

### **Sprint 1: Albums & Singles System** (Week 1-2)
**Priority**: 🔴 Critical (Foundation for other features)

#### Features
1. **Album Recording**
   - Create albums from 8-12 existing songs
   - Album quality = average of song qualities + bonus
   - Album release cost (higher than singles)
   - Albums provide sustained streaming revenue

2. **Single vs Album UI**
   - Update "Record Song" action to show options: "Single" or "Add to Album Collection"
   - New "Release Album" button (enabled when 8+ songs ready)
   - Album builder modal: Select songs, preview quality, set release date

3. **Modern Streaming Mechanics**
   - Albums provide "album streams" multiplier
   - Playlist consideration (chance based on album quality)
   - Album release boost to all contained songs

#### UX Considerations
- Use existing modal pattern for album builder
- Visual song selection with checkboxes
- Preview stats before release
- Clear cost breakdown

#### Technical Tasks
- [ ] Create `recordAlbum()` function
- [ ] Add album builder modal component
- [ ] Update song recording UI with single/album toggle
- [ ] Enhance streaming revenue calculation for albums
- [ ] Update music tab to show albums separately

---

### **Sprint 2: Modern Distribution & Labels** (Week 3-4)
**Priority**: 🔴 Critical (Core business mechanic)

#### Features
1. **Distribution Tiers** (2026 model)
   - **Independent (Distrokid/CD Baby)**: Low cost, keep all royalties, no advances
   - **Distribution Deal**: Label handles distribution, you keep ownership
   - **360 Deal**: Full label support, shared revenue from all sources
   - **Major Label**: Highest support, largest advances, but restrictive

2. **Label Contract System**
   - Multi-turn negotiation (offer → counter → accept/reject)
   - Contract terms: advance, royalty split, marketing budget, contract length
   - Label benefits: playlist pitches, sync opportunities, radio promotion
   - Contract fulfillment obligations (album delivery, touring requirements)

3. **Modern Revenue Streams**
   - **Sync Licensing**: Songs placed in TV/film/games (unlocks with label or independent hustle)
   - **Brand Partnerships**: Sponsored content, product placement
   - **Virtual Concerts**: Livestream shows (lower cost, global reach)
   - **Merch Store Enhancement**: Online store with better margins

#### UX Considerations
- Label negotiation as a multi-step modal/wizard
- Visual contract comparison before signing
- Clear indicator of current label status in sidebar
- Revenue streams shown in new "Revenue" tab or expanded overview

#### Technical Tasks
- [ ] Create label data structure and contract system
- [ ] Build label negotiation UI (wizard pattern)
- [ ] Add label benefits to gameplay calculations
- [ ] Implement sync licensing and brand deal events
- [ ] Create revenue breakdown view
- [ ] Update weekly expenses to include label obligations

---

### **Sprint 3: Social Media & Virality** (Week 5-6)
**Priority**: 🟡 High (Modern music industry essential)

#### Features
1. **Social Media Platforms**
   - **TikTok**: Viral potential, algorithm-driven discovery
   - **Instagram**: Visual branding, fan engagement
   - **Twitter/X**: Direct fan communication, news/controversy
   - Each platform has different engagement mechanics

2. **Content Creation**
   - Post content (costs time/money for quality content)
   - Viral moments (random chance based on content quality + algorithm favor)
   - Trending sounds/challenges (align with genre trends)
   - Influencer collaborations (unlock with fame)

3. **Algorithm & Playlist System**
   - **Spotify Playlists**: Editorial, algorithmic, user-generated
   - Algorithm favor score (increases with engagement, consistency)
   - Playlist placement dramatically boosts streams
   - Discover Weekly, Release Radar mechanics

4. **Engagement Metrics**
   - Monthly listeners, followers, engagement rate
   - Social media metrics affect algorithm favor
   - Negative engagement (controversy) can hurt or help

#### UX Considerations
- New "Social" tab or expand "Promotion" section
- Visual social feed showing recent posts/events
- Algorithm favor meter (similar to existing meters)
- Playlist placement shown as special event/achievement

#### Technical Tasks
- [ ] Create social media state management
- [ ] Build social content creation UI
- [ ] Implement algorithm favor system
- [ ] Add playlist placement events
- [ ] Create engagement metrics display
- [ ] Add viral moment mechanics

---

### **Sprint 4: Modern Touring & Geographic Reach** (Week 7-8)
**Priority**: 🟡 High (Core gameplay loop)

#### Features
1. **Tour Types** (2026 model)
   - **Local Gigs**: Existing system (keep as-is)
   - **Regional Tours**: 3-5 cities, moderate cost
   - **National Tours**: 10-15 cities, high cost, high reward
   - **International Tours**: Europe, Asia, etc. (unlock with streaming success)
   - **Virtual Tours**: Livestream concerts (lower cost, global audience)
   - **Festival Circuits**: Summer festivals, higher exposure

2. **Geographic Reputation**
   - Track reputation per region (US, UK, Europe, Asia, etc.)
   - Streaming success in region unlocks touring opportunities
   - Regional fan bases grow independently
   - Cultural fit affects reception

3. **Tour Planning**
   - Plan multi-week tours (cost vs revenue optimization)
   - Route optimization (reduce travel costs)
   - Venue selection within regions
   - Tour fatigue mechanics (band needs rest between legs)

4. **Modern Tour Revenue**
   - Ticket sales (venue capacity × ticket price)
   - VIP packages, meet & greets
   - Merchandise sales at shows
   - Streaming revenue boost during active tour

#### UX Considerations
- New "Tours" tab (or expand "Gigs" tab)
- Tour planner interface (map view or list)
- Tour calendar showing planned dates
- Cost/revenue preview before booking

#### Technical Tasks
- [ ] Create geographic region system
- [ ] Build tour planning UI
- [ ] Implement multi-week tour mechanics
- [ ] Add regional reputation tracking
- [ ] Create tour calendar visualization
- [ ] Update venue system for geographic regions

---

### **Sprint 5: Scenarios & Goals** (Week 9)
**Priority**: 🟢 Medium (Replayability)

#### Features
1. **Scenario System**
   - **Indie Hustle**: Start with $500, goal: 1M streams independently
   - **Major Label Dream**: Get signed to major, goal: #1 album
   - **World Tour Challenge**: Complete tours in 5+ regions
   - **Viral Sensation**: Go viral on TikTok, goal: 50M streams in 6 months
   - **Legacy Builder**: Maintain success over 100+ weeks

2. **Goals & Achievements**
   - Track progress toward scenario goals
   - Achievement badges (e.g., "First Million Streams", "Sold Out Arena")
   - Progress indicators in UI

3. **Sandbox Mode**
   - Keep existing open-ended play as default
   - Scenarios as optional challenge modes

#### UX Considerations
- Scenario selection on new game screen
- Progress indicator in sidebar or header
- Achievement notifications
- Scenario completion screen

#### Technical Tasks
- [ ] Create scenario data structure
- [ ] Add scenario selection to new game flow
- [ ] Build goal tracking system
- [ ] Create achievement system
- [ ] Add progress indicators

---

### **Sprint 6: Enhanced Market Dynamics** (Week 10)
**Priority**: 🟢 Medium (Depth & Realism)

#### Features
1. **Genre Trends Enhancement**
   - More dynamic genre popularity shifts
   - Cross-genre fusion opportunities
   - Genre-specific streaming advantages
   - Regional genre preferences

2. **Music Industry Events**
   - Award shows (Grammys, etc.) - nomination and win events
   - Industry conferences and networking
   - Music festivals as events (not just tours)
   - Seasonal trends (summer hits, holiday albums)

3. **Competition System**
   - Rival bands' actions affect market
   - Chart battles (compete for #1)
   - Genre dominance competition

#### UX Considerations
- Enhanced trend visualization
- Industry event notifications
- Chart battle UI when close to #1
- Genre trend graph/history

#### Technical Tasks
- [ ] Enhance trend system with more dynamics
- [ ] Add industry events to event pool
- [ ] Create chart battle mechanics
- [ ] Build trend visualization components

---

## 🎨 UI/UX Improvements Across All Sprints

### Consistent Patterns
- **Modals**: Reuse existing modal pattern for all new dialogs
- **Tabs**: Use existing tab system, add new tabs as needed
- **Cards**: Mini-cards for actions, full cards for detailed views
- **Tooltips**: Add contextual help for new features

### New UI Components Needed
1. **Tour Planner Modal**: Multi-step wizard for planning tours
2. **Album Builder Modal**: Song selection and album configuration
3. **Label Negotiation Wizard**: Multi-step contract negotiation
4. **Social Feed Component**: Timeline of social posts and events
5. **Revenue Breakdown View**: Pie chart or breakdown of income sources
6. **Algorithm Meter**: Visual indicator of algorithm favor (like morale meter)

### Navigation Structure
```
Main Tabs (existing):
- Overview
- Actions
- Music (enhance with albums)
- Gigs → Tours (expand)
- Upgrades
- Log

New/Enhanced Tabs:
- Social (new) OR expand Actions with social section
- Revenue (new) OR expand Overview with detailed breakdown

Sidebar (existing):
- Left: Snapshot, Meters, Team, Songs (add Albums sub-section)
- Right: Top Chart, Albums, Song Chart
```

---

## 🔄 State Management Updates

### New State Properties
```javascript
state: {
  // Existing properties...
  
  // Albums & Singles
  albumCollection: [], // Songs waiting to be compiled
  albums: [], // Already enhanced, needs creation function
  
  // Labels & Distribution
  labelDeal: null | {
    type: 'independent' | 'distribution' | '360' | 'major',
    name: string,
    advance: number,
    royaltySplit: number, // percentage label takes
    marketingBudget: number,
    contractLength: number, // weeks
    obligations: { albums: number, tours: number }
  },
  
  // Social Media
  socialMedia: {
    tiktok: { followers: number, engagement: number },
    instagram: { followers: number, engagement: number },
    twitter: { followers: number, engagement: number }
  },
  algorithmFavor: number, // 0-100
  playlists: [], // Active playlist placements
  
  // Geographic
  regionalReputation: {
    us: number,
    uk: number,
    europe: number,
    asia: number,
    // etc.
  },
  
  // Tours
  activeTour: null | {
    cities: string[],
    startWeek: number,
    endWeek: number,
    expectedRevenue: number
  },
  plannedTours: [],
  
  // Revenue Streams
  syncLicenses: [],
  brandDeals: [],
  
  // Scenarios
  scenario: null | {
    name: string,
    goals: object,
    progress: object
  }
}
```

---

## 📊 Data Structure Additions

### New JSON Data Files (or additions to existing)

#### `modernMusicIndustry.json`
```json
{
  "streamingPlatforms": [
    { "name": "Spotify", "marketShare": 0.31, "royaltyPerStream": 0.003 },
    { "name": "Apple Music", "marketShare": 0.15, "royaltyPerStream": 0.007 },
    { "name": "YouTube Music", "marketShare": 0.08, "royaltyPerStream": 0.0007 },
    { "name": "TikTok", "marketShare": 0.05, "royaltyPerStream": 0.0005 }
  ],
  "playlistTypes": [
    { "name": "Today's Top Hits", "followers": 30000000, "impact": 5.0 },
    { "name": "RapCaviar", "followers": 15000000, "impact": 4.5 },
    { "name": "Discover Weekly", "followers": 100000000, "impact": 3.0 }
  ],
  "socialPlatforms": [
    { "name": "TikTok", "viralPotential": 0.15, "algorithmComplexity": 0.8 },
    { "name": "Instagram", "viralPotential": 0.08, "algorithmComplexity": 0.6 },
    { "name": "Twitter", "viralPotential": 0.05, "algorithmComplexity": 0.4 }
  ],
  "regions": [
    { "id": "us", "name": "United States", "streamingBonus": 1.0 },
    { "id": "uk", "name": "United Kingdom", "streamingBonus": 0.8 },
    { "id": "europe", "name": "Europe", "streamingBonus": 0.7 },
    { "id": "asia", "name": "Asia", "streamingBonus": 0.6 }
  ]
}
```

---

## ✅ Definition of Done for Each Sprint

### Checklist for Feature Completion
- [ ] Feature implemented and functional
- [ ] UI follows existing design patterns
- [ ] Tooltips/help text added for new features
- [ ] Mobile responsive (or graceful degradation)
- [ ] Integrated with existing game balance
- [ ] Tested with various game states
- [ ] No console errors or warnings
- [ ] State properly persisted (if needed)
- [ ] Visual feedback for all actions
- [ ] Accessible (keyboard navigation, screen reader friendly)

---

## 🎮 Balancing Considerations

### Economic Balance
- Ensure new revenue streams don't break economy
- Label advances should feel substantial but not game-breaking
- Tour costs should scale appropriately
- Social media should complement, not replace, traditional promotion

### Progression Balance
- New features unlock naturally with fame/money
- Early game shouldn't be overwhelming with options
- Late game should have depth and choices
- Power creep: ensure new features add depth, not just power

### Time Balance
- Weekly actions should remain meaningful
- Not too many actions competing for same week
- Some actions can be queued (tours span multiple weeks)
- Cooldowns remain important for balance

---

## 🚀 Quick Wins (Can be done alongside sprints)

These are small improvements that can be added incrementally:

1. **Enhanced Tooltips**: Add helpful explanations throughout
2. **Keyboard Shortcuts**: Power users can navigate faster
3. **Save/Load**: Persist game state to localStorage
4. **Achievement Notifications**: Visual feedback for milestones
5. **Statistics Screen**: Track lifetime stats
6. **Export/Share**: Share band progress (screenshot or data)

---

## 📝 Next Steps

1. **Review this plan** - Adjust priorities and scope as needed
2. **Start Sprint 1** - Begin with Albums & Singles (quick win, foundation)
3. **Gather feedback** - Playtest each sprint before moving to next
4. **Iterate** - Adjust balance and UX based on testing

---

## 🎯 Success Metrics

After Phase 2, the game should:
- ✅ Feel modern and relevant to 2026 music industry
- ✅ Have clear progression paths (independent vs label routes)
- ✅ Provide meaningful choices each week
- ✅ Maintain the charm of the original while feeling fresh
- ✅ Be intuitive for new players but deep for veterans
- ✅ Have replayability through scenarios and different strategies

---

**Ready to begin Sprint 1?** Albums are partially implemented, so this is a perfect starting point to complete existing infrastructure while establishing patterns for future features.
