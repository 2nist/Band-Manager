# Phase 0: Refactoring Plan

## Overview
Current state: **6,117 lines in single App.jsx component**
Goal: **Modularize into scalable architecture**
Timeline: **2 weeks (10 business days)**

---

## STATE BREAKDOWN

### Current State Hook Count: 28 useState declarations

**Game State (Core Logic)**
- `state` (1 huge object with all game data)
- `rivals` (competing bands)
- `selectedVenue`, `currentEvent` (UI selection state)

**UI/Navigation State (10 hooks)**
- `step` (LANDING, SCENARIO, CREATE, LOGO, GAME)
- `currentTab`, `leftTab`, `rightTab` (game tab navigation)
- `gigsView`, `selectedTourType`, `selectedTourRegion` (gig selection)
- `theme`, `darkMode` (appearance)

**Modal/Dialog State (11 hooks)**
- `showStudioModal`, `showTransportModal`, `showGearModal`
- `showAlbumBuilderModal`, `showLabelNegotiation`, `showWriteSongModal`
- `showSaveModal`, `showLoadModal`, `showSettings`
- `showEventPopup`, `showWeeklyPopup` (event dialogs)
- `showTutorial`, `showTooltip` (help/ui)

**Modal Content State (4 hooks)**
- `labelOffer`, `negotiationStep` (label negotiation data)
- `selectedBandStats`, `eventPopupData`, `weeklyPopupData`
- `newSongTitle` (song creation)

**UI Detail State (3 hooks)**
- `customFont`, `fontOptions` (band creation)
- `saveSlots`, `autoSaveEnabled` (persistence)
- `recruitOptions`, `editingMemberId`, `lineupAddRole`, `desiredRoles`

---

## REFACTORING STRATEGY

### Architecture Target

```
src/
├── App.jsx (300 lines - router only)
├── hooks/
│   ├── useGameState.js (NEW - core game state management)
│   ├── useGameLogic.js (NEW - game mechanics/actions)
│   ├── useUIState.js (NEW - UI navigation state)
│   ├── useModalState.js (NEW - modal visibility management)
│   └── useGameData.js (existing)
│
├── components/
│   ├── pages/
│   │   ├── LandingPage.jsx (NEW)
│   │   ├── ScenarioPage.jsx (NEW)
│   │   ├── CreateBandPage.jsx (NEW)
│   │   ├── LogoDesignPage.jsx (NEW)
│   │   └── GamePage.jsx (NEW - main gameplay)
│   │
│   ├── Game/
│   │   ├── GameLayout.jsx (NEW - main game UI structure)
│   │   ├── Tabs/
│   │   │   ├── OverviewTab.jsx (NEW)
│   │   │   ├── ActionsTab.jsx (NEW)
│   │   │   ├── BandTab.jsx (NEW)
│   │   │   ├── MusicTab.jsx (NEW)
│   │   │   ├── GigsTab.jsx (NEW)
│   │   │   ├── UpgradesTab.jsx (NEW)
│   │   │   └── LogTab.jsx (NEW)
│   │   │
│   │   ├── Panels/
│   │   │   ├── LeftPanel.jsx (NEW)
│   │   │   ├── RightPanel.jsx (NEW)
│   │   │   └── TopBar.jsx (NEW)
│   │   │
│   │   └── UI/
│   │       ├── ChartDisplay.jsx (NEW)
│   │       ├── MemberCard.jsx (NEW)
│   │       ├── VenueCard.jsx (NEW)
│   │       └── StatMeters.jsx (NEW)
│   │
│   ├── Modals/
│   │   ├── (existing modals)
│   │   ├── ModalContainer.jsx (NEW - orchestrates all modals)
│   │   └── EventPopup.jsx (NEW)
│   │
│   └── Common/
│       ├── Radar.jsx (NEW - extracted component)
│       └── Sidebar.jsx (NEW)
│
├── utils/
│   ├── constants.js (existing)
│   ├── helpers.js (existing)
│   ├── gameEngine.js (NEW - core game logic)
│   ├── eventSystem.js (NEW - event handling)
│   ├── labelSystem.js (NEW - label negotiations)
│   ├── saveSystem.js (NEW - save/load logic)
│   └── uiHelpers.js (NEW - UI utilities)
│
└── context/
    └── GameContext.jsx (NEW - global game state)
```

---

## PHASE 0 EXECUTION PLAN

### Week 1: State Management & Core Hooks

#### Day 1-2: Create Core Hooks
**Files to create:**
1. `src/hooks/useGameState.js` - Game state management
2. `src/hooks/useGameLogic.js` - Game actions/mechanics
3. `src/hooks/useUIState.js` - UI navigation state
4. `src/hooks/useModalState.js` - Modal management

**Responsibility Split:**
- `useGameState`: Manages `state`, `rivals`, saves/loads
- `useGameLogic`: Functions like `bookGig()`, `writeSong()`, `recordAlbum()`
- `useUIState`: Manages `step`, tabs, view selections
- `useModalState`: Manages all `show*` and modal content states

#### Day 2-3: Extract Game Logic to Utils
**Files to create:**
1. `src/utils/gameEngine.js` - Core mechanics (`processWeekEffects`, `advanceWeek`)
2. `src/utils/eventSystem.js` - Event generation/resolution
3. `src/utils/labelSystem.js` - Label negotiations
4. `src/utils/saveSystem.js` - Save/load logic

#### Day 4-5: Create Game Context
**File to create:**
1. `src/context/GameContext.jsx` - Provider for global game state

**Goal:** By end of Week 1, App.jsx can use new hooks instead of local state

---

### Week 2: Component Extraction

#### Day 6-7: Page Components
**Files to create:**
1. `src/components/pages/LandingPage.jsx`
2. `src/components/pages/ScenarioPage.jsx`
3. `src/components/pages/CreateBandPage.jsx`
4. `src/components/pages/LogoDesignPage.jsx`
5. `src/components/pages/GamePage.jsx`

**Goal:** App.jsx becomes a simple router

#### Day 8: Refactor App.jsx
**Tasks:**
1. Remove all state declarations
2. Import hooks instead
3. Keep only JSX render logic for routing
4. Change from ~6,100 lines to ~300 lines

#### Day 9-10: Game Tabs & UI Components
**Files to create:**
1. Tab components (OverviewTab, ActionsTab, etc.)
2. Panel components (LeftPanel, RightPanel, TopBar)
3. Reusable UI components (ChartDisplay, MemberCard, etc.)
4. Modal orchestration container

---

## DETAILED HOOK SPECIFICATIONS

### useGameState.js
```javascript
/**
 * Core game state management hook
 * Replaces: state, rivals, selectedVenue, currentEvent, fontOptions
 * Manages: all game data persistence
 */
const useGameState = () => {
  const [state, setState] = useState(initialState);
  const [rivals, setRivals] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  
  // Core actions
  const saveGame = (slotName) => { ... };
  const loadGame = (slotName) => { ... };
  const advanceWeek = (updater, entry, context) => { ... };
  const updateGameState = (updates) => { ... };
  
  return {
    // State
    state, setState,
    rivals, setRivals,
    selectedVenue, setSelectedVenue,
    currentEvent, setCurrentEvent,
    
    // Methods
    saveGame, loadGame, advanceWeek, updateGameState
  };
};
```

### useGameLogic.js
```javascript
/**
 * Game mechanics and actions
 * Replaces: bookGig, writeSong, recordAlbum, signLabel, etc.
 */
const useGameLogic = (state, setState, rivals, setRivals) => {
  const bookGig = (venue) => { ... };
  const writeSong = (customTitle) => { ... };
  const recordAlbum = (selectedSongTitles) => { ... };
  const upgradeStudio = (tierId) => { ... };
  const upgradeTransport = (tierId) => { ... };
  const upgradeGear = (tierId) => { ... };
  const rehearse = () => { ... };
  const rest = () => { ... };
  const signLabelDeal = (offer) => { ... };
  const resolveEvent = (choice) => { ... };
  
  return {
    bookGig, writeSong, recordAlbum,
    upgradeStudio, upgradeTransport, upgradeGear,
    rehearse, rest,
    signLabelDeal, resolveEvent
  };
};
```

### useUIState.js
```javascript
/**
 * UI navigation and view state
 * Replaces: step, currentTab, leftTab, rightTab, gigsView, etc.
 */
const useUIState = () => {
  const [step, setStep] = useState(STEPS.LANDING);
  const [currentTab, setCurrentTab] = useState('overview');
  const [leftTab, setLeftTab] = useState('snapshot');
  const [rightTab, setRightTab] = useState('topChart');
  const [gigsView, setGigsView] = useState('local');
  const [selectedTourType, setSelectedTourType] = useState(null);
  const [selectedTourRegion, setSelectedTourRegion] = useState('us');
  const [theme, setTheme] = useState('theme-modern');
  const [darkMode, setDarkMode] = useState(false);
  
  return {
    step, setStep,
    currentTab, setCurrentTab,
    leftTab, setLeftTab,
    rightTab, setRightTab,
    gigsView, setGigsView,
    selectedTourType, setSelectedTourType,
    selectedTourRegion, setSelectedTourRegion,
    theme, setTheme,
    darkMode, setDarkMode
  };
};
```

### useModalState.js
```javascript
/**
 * Modal and dialog visibility/content management
 * Replaces: 11 show* states and modal content states
 */
const useModalState = () => {
  const [modals, setModals] = useState({
    studio: false,
    transport: false,
    gear: false,
    albumBuilder: false,
    labelNegotiation: false,
    writeSong: false,
    save: false,
    load: false,
    settings: false,
    event: false,
    weekly: false,
    tutorial: false,
    tooltip: false
  });
  
  const [modalData, setModalData] = useState({
    labelOffer: null,
    negotiationStep: 'offer',
    selectedBandStats: null,
    eventPopupData: null,
    weeklyPopupData: null,
    newSongTitle: '',
    tooltipData: { visible: null, position: { x: 0, y: 0 } }
  });
  
  const openModal = (modalKey, data = null) => { ... };
  const closeModal = (modalKey) => { ... };
  const updateModalData = (dataKey, value) => { ... };
  
  return {
    modals,
    modalData,
    openModal, closeModal, updateModalData
  };
};
```

---

## INTEGRATION CHECKPOINTS

After each section, verify:
- ✅ No console errors
- ✅ All game state still updates
- ✅ Saves/loads still work
- ✅ UI tabs still render
- ✅ Modals appear/disappear correctly
- ✅ Game week advancement works
- ✅ Charts calculate correctly

---

## SUCCESS CRITERIA FOR PHASE 0

✅ **Completed when:**
1. App.jsx reduced to < 400 lines
2. All 28 useState hooks distributed across purpose-built hooks
3. Game logic extracted to `utils/gameEngine.js`
4. All existing functionality works identically
5. No performance degradation
6. Code easier to navigate and modify

✅ **Validation:**
- Play full game scenario from band creation to chart success
- Test save/load functionality
- Verify all modal dialogs open/close
- Check that events trigger properly
- Confirm stats calculations accurate

---

## MIGRATION GUIDE FOR REMAINING FEATURES (Phase 1+)

Once Phase 0 is complete, Phase 1+ additions become simple:

**Adding new feature (e.g., Merchandise System):**
1. Add game data to state schema (in initialState)
2. Add logic functions to `useGameLogic.js`
3. Create `MerchandiseTab.jsx` component
4. Add event handlers to event system
5. Done in ~2-3 hours vs. needing to navigate 6k lines

**Benefits realized:**
- 50% faster feature development
- Easier testing of isolated logic
- Simpler collaboration (multiple devs per feature)
- Clearer code ownership and responsibility

---

## ROLLBACK PLAN

If issues arise:
- Git branch: `refactoring/phase-0`
- Can revert to main if critical blocking issue
- Incremental commits allow cherry-picking fixes
- Original App.jsx stays in git history

---

**Next Step:** Begin Day 1 - Create `useGameState.js` hook
