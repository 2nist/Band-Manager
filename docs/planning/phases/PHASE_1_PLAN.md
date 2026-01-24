# Phase 1: Component Extraction & Optimization

**Goal**: Extract tabs and panels into reusable components, creating a more granular component hierarchy for easier testing and maintenance.

**Current State**:
- ✅ Phase 0: Monolithic App.jsx (6,117 lines) → Modular (140 lines)
- ✅ State: 5 specialized hooks (1,565 lines)
- ✅ Logic: 3 utility modules (978 lines)
- ✅ Pages: 2 page components (810+ lines)
- ⏳ Components: Need to extract tabs & panels from GamePage

---

## Phase 1 Tasks

### 1. Extract Tab Components (Estimated: 3-4 hours)

**Current Structure** (in GamePage.jsx):
```
GamePage
  └─ currentTab determines which content to show
     ├─ Overview Tab
     ├─ Actions Tab
     ├─ Band Tab
     ├─ Music Tab
     ├─ Upgrades Tab
     └─ Log Tab
```

**Target Structure**:
```
GamePage
  ├─ TabNavigation component
  └─ Tab content components:
     ├─ OverviewTab.jsx (200 lines)
     ├─ ActionsTab.jsx (250 lines)
     ├─ BandTab.jsx (200 lines)
     ├─ MusicTab.jsx (200 lines)
     ├─ UpgradesTab.jsx (180 lines)
     └─ LogTab.jsx (120 lines)
```

**Files to Create**:
- `src/components/Tabs/TabNavigation.jsx` - Tab switching UI
- `src/components/Tabs/OverviewTab.jsx` - Game overview & stats
- `src/components/Tabs/ActionsTab.jsx` - Available game actions
- `src/components/Tabs/BandTab.jsx` - Band roster & management
- `src/components/Tabs/MusicTab.jsx` - Songs & albums
- `src/components/Tabs/UpgradesTab.jsx` - Equipment & skills
- `src/components/Tabs/LogTab.jsx` - Event log & history
- `src/components/Tabs/index.js` - Barrel exports

**Benefits**:
- ✅ Each tab is independently testable
- ✅ Easier to maintain and modify individual tabs
- ✅ Reduce GamePage from 500+ lines to ~150 lines
- ✅ Reusable tab navigation pattern

---

### 2. Extract Panel Components (Estimated: 2-3 hours)

**Current Structure** (in GamePage.jsx):
```
GamePage
  ├─ Left Panel (leftTab determines content)
  │  ├─ Snapshot view
  │  ├─ Meters view
  │  ├─ Team view
  │  └─ Songs view
  └─ Right Panel (rightTab determines content)
     ├─ Top Chart
     ├─ Albums
     └─ Song Chart
```

**Target Structure**:
```
GamePage
  ├─ LeftPanel.jsx
  │  ├─ SnapshotPanel.jsx (120 lines)
  │  ├─ MetersPanel.jsx (100 lines)
  │  ├─ TeamPanel.jsx (150 lines)
  │  └─ SongsPanel.jsx (130 lines)
  └─ RightPanel.jsx
     ├─ TopChartPanel.jsx (110 lines)
     ├─ AlbumsPanel.jsx (100 lines)
     └─ SongChartPanel.jsx (110 lines)
```

**Files to Create**:
- `src/components/Panels/LeftPanel.jsx` - Left panel wrapper
- `src/components/Panels/RightPanel.jsx` - Right panel wrapper
- `src/components/Panels/SnapshotPanel.jsx` - Band snapshot
- `src/components/Panels/MetersPanel.jsx` - Skill/morale meters
- `src/components/Panels/TeamPanel.jsx` - Band roster display
- `src/components/Panels/SongsPanel.jsx` - Songs list
- `src/components/Panels/TopChartPanel.jsx` - Chart display
- `src/components/Panels/AlbumsPanel.jsx` - Albums list
- `src/components/Panels/SongChartPanel.jsx` - Song chart
- `src/components/Panels/index.js` - Barrel exports

**Benefits**:
- ✅ Left/Right panels independently testable
- ✅ Easy to add new panel views
- ✅ Cleaner data flow (props from GamePage → Panels)
- ✅ Reusable panel patterns

---

### 3. Create Modal Wrappers (Estimated: 2 hours)

**Current State**: Modal logic in GamePage and App.jsx

**Target State**: Dedicated modal components with clear interfaces

**Files to Create**:
- `src/components/Modals/UpgradesModal.jsx` - Equipment/skill upgrades
- `src/components/Modals/GigsModal.jsx` - Gig booking
- `src/components/Modals/ToursModal.jsx` - Tour management
- `src/components/Modals/SettingsModal.jsx` - Game settings
- `src/components/Modals/index.js` - Barrel exports

**Benefits**:
- ✅ Consistent modal UI patterns
- ✅ Modals are self-contained and reusable
- ✅ Easier to add new modals in future phases
- ✅ Clear modal state management

---

### 4. Integration Testing (Estimated: 1 hour)

**Verify**:
- ✅ All tabs render correctly
- ✅ Tab switching works smoothly
- ✅ Panel state updates properly
- ✅ Modals open/close correctly
- ✅ Game logic triggers from components
- ✅ Build passes with 0 errors

**Testing Commands**:
```bash
npm run build  # Verify all imports resolve
npm run dev    # Test in dev environment
```

---

## Implementation Strategy

### Week Timeline
- **Day 1-2**: Extract tab components (6-8 hours)
- **Day 3**: Extract panel components (4-5 hours)
- **Day 4**: Create modal wrappers (2-3 hours)
- **Day 5**: Integration testing & Polish (2-3 hours)

### Code Quality Standards
- ✅ All components have JSDoc comments
- ✅ Props are clearly documented
- ✅ Each component < 300 lines
- ✅ Barrel exports for easy importing
- ✅ Consistent naming conventions
- ✅ Build passes with 0 errors

### Expected Outcomes

**Before Phase 1**:
- GamePage.jsx: 500+ lines
- Modal logic: Scattered across App.jsx
- Tab/Panel logic: Embedded in GamePage

**After Phase 1**:
- GamePage.jsx: ~150 lines (30% of original)
- Tabs/: 7 components (~1,150 lines)
- Panels/: 9 components (~1,100 lines)
- Modals/: 5 new wrappers (~600 lines)
- Total new code: ~2,850 lines (well-organized)

**Improvements**:
- ✅ 95% reduction in GamePage complexity
- ✅ 100% increase in component reusability
- ✅ Clear component hierarchy
- ✅ Easier to test and maintain
- ✅ Better code organization

---

## Next Steps
1. Start with Tab extraction (highest impact)
2. Move to Panel extraction (good ROI)
3. Wrap up with Modal components
4. Comprehensive integration testing
5. Commit and prepare for Phase 2

**Phase 2 Preview**: 
- Hook optimization (memoization, performance)
- Animation system for transitions
- Advanced theming system
- Keyboard shortcuts & accessibility
