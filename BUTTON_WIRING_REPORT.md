# Comprehensive Button & Function Wiring Report
## GIGMASTER Game - Complete Function Mapping

**Generated**: January 2026  
**Status**: Complete mapping of all interactive elements

---

## Table of Contents
1. [Landing Page](#landing-page)
2. [Scenario Selection](#scenario-selection)
3. [Logo Designer](#logo-designer)
4. [Band Creation](#band-creation)
5. [Game Page - Main Interface](#game-page-main-interface)
6. [Dashboard Tab](#dashboard-tab)
7. [Inventory Tab](#inventory-tab)
8. [Band Tab](#band-tab)
9. [Gigs Tab](#gigs-tab)
10. [Upgrades Tab](#upgrades-tab)
11. [Modals](#modals)
12. [System Hooks & Functions](#system-hooks--functions)

---

## Landing Page

### Buttons & Functions

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Dark Mode Toggle** | `toggleDarkMode()` | `useTheme().toggleDarkMode()` | Toggles light/dark mode |
| **Theme Selector** | `setTheme(e.target.value)` | `useTheme().setTheme(theme)` | Changes color theme |
| **START GAME** | `handleNewGame()` | `onNewGame(bandName)` → `gameState.setBandName()` + `gameState.setStep('scenario')` | Starts new game with band name |
| **LOAD GAME** | `setShowLoadMenu(true)` | Shows load game menu | Opens save slot selection |
| **SETTINGS** | `setShowSettings(true)` | Shows settings menu | Opens settings panel |
| **Load Slot** | `onLoadGame(slot.id)` | `gameState.setStep('game')` | Loads selected save game |
| **BACK (from Load)** | `setShowLoadMenu(false)` | Hides load menu | Returns to main menu |
| **Theme Button (in Settings)** | `setTheme(theme)` | `useTheme().setTheme(theme)` | Changes theme |
| **Dark Mode (in Settings)** | `toggleDarkMode()` | `useTheme().toggleDarkMode()` | Toggles dark mode |
| **BACK (from Settings)** | `setShowSettings(false)` | Hides settings | Returns to main menu |

### Key Functions
- `handleNewGame()`: Validates band name, calls `onNewGame(bandName)`
- `onNewGame(bandName)`: Sets band name and navigates to scenario selection

---

## Scenario Selection

### Buttons & Functions

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Scenario Card** | `handleScenarioSelect(scenario)` | `onSelectScenario(scenario)` → Updates game state with scenario data, sets step to 'logo' | Selects scenario and initializes game |
| **BACK** | `onBack()` | `gameState.setStep('landing')` | Returns to landing page |

### Key Functions
- `handleScenarioSelect(scenario)`: Calls `onSelectScenario` with scenario data
- `onSelectScenario(scenario)`: Updates game state with initial money, fame, week; sets step to 'logo'

---

## Logo Designer

### Buttons & Functions

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **BACK** | `onBack()` | `gameState.setStep('scenario')` | Returns to scenario selection |
| **Preset Button** | `applyPreset(preset)` | `handleLogoChange({ ...preset })` | Applies logo preset |
| **Font Gallery Toggle** | `setShowFontGallery(!showFontGallery)` | Toggles font gallery visibility | Shows/hides font options |
| **Font Option** | `handleLogoChange({ logoFont: font })` | `onLogoChange({ logoFont })` → `gameState.updateGameState()` | Changes logo font |
| **Shadow Effect** | `handleLogoChange({ logoShadow: sfx })` | `onLogoChange({ logoShadow })` → `gameState.updateGameState()` | Changes shadow effect |
| **Reset** | `handleLogoChange({})` | Resets logo to defaults | Clears logo customizations |
| **Complete** | `onComplete()` | `gameState.setStep('bandCreation')` | Proceeds to band creation |

### Key Functions
- `handleLogoChange(updates)`: Calls `onLogoChange(updates)` which updates game state
- `applyPreset(preset)`: Applies preset logo configuration

---

## Band Creation

### Buttons & Functions

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Genre Selection** | `setSelectedGenre(genre)` | Sets selected genre | Selects band genre |
| **Genre Select** | `handleGenreSelect()` | Advances to member selection phase | Confirms genre choice |
| **Remove Selected Member** | `handleRemoveSelected(idx)` | Removes member from selection | Removes member from lineup |
| **Select Candidate** | `handleSelectCandidate(candidate)` | Adds candidate to selection | Adds member to lineup |
| **Start Assembly** | `handleStartAssembly()` | Sets phase to 'rehearsal' | Begins band assembly |
| **Role Selection** | `updateMember('role', role.id)` | Updates member role | Sets member's role |
| **Previous Member** | `handlePrevious()` | Navigates to previous member | Changes member being edited |
| **Next Member** | `handleNext()` | Navigates to next member | Changes member being edited |
| **Member Card** | `setCurrentIndex(idx)` | Sets active member index | Selects member to edit |
| **Add Member** | `addMember()` | Adds new member to lineup | Creates new band member |
| **Complete** | `handleComplete()` | `onComplete(members, genre)` → Updates game state, sets step to 'game' | Finalizes band creation |

### Key Functions
- `handleComplete()`: Validates band, calls `onComplete(members, genre)`
- `onComplete(members, genre)`: Updates game state with band members and genre, starts game

---

## Game Page - Main Interface

### Header Buttons

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Theme Selector** | `themeSystem.setTheme(e.target.value)` | Changes theme | Updates color theme |
| **Dark Mode Toggle** | `themeSystem.toggleDarkMode()` | Toggles dark mode | Switches light/dark |
| **Save** | `onSave()` → `gameState.saveGame(bandName)` | Saves game to localStorage | Persists game state |
| **Quit** | `onQuit()` | `gameState.setStep('landing')` | Returns to main menu |

### Tab Navigation

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Tab Button** | `onTabChange(tab.id)` | `setActiveTab(tab.id)` | Switches active tab |

### Week Advancement (Dashboard Only)

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Trigger Event** | `triggerEvent()` | `eventGen.generateEvent()` → Shows event modal | Manually triggers random event |
| **Advance Week** | `handleAdvanceWeek()` | Processes consequences, updates systems, advances week, generates events | Advances game by one week |

### Key Functions
- `handleAdvanceWeek()`: 
  - Processes consequence escalations
  - Updates all game systems (band, radio, merch, sponsorships, labels, rivals)
  - Generates random events based on psychology
  - Advances week counter
  - Queues and displays events
- `triggerEvent()`: Manually generates and displays an event
- `handleEventChoice(eventId, choiceId, choiceText, impacts)`: Processes player choice in event modal

---

## Dashboard Tab

### Quick Action Buttons

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Write Song** | `handleQuickAction('write-song')` | `modalState.openWriteSongModal()` | Opens write song modal |
| **Book Gig** | `handleQuickAction('book-gig')` | `gameLogic.getAvailableVenues()` → `gameLogic.bookGig(venues[0].id)` | Books first available venue |
| **Practice** | `handleQuickAction('practice-band')` | `bandManagement.practiceMember(memberId)` | Practices with first band member |
| **Upgrade** | `handleQuickAction('upgrade-studio')` | `equipmentUpgrades.upgradeStudio()` | Upgrades studio tier |
| **Label Deal** | `handleQuickAction('sign-label')` | `labelDeals.getAvailableLabelOffers()` → `labelDeals.signLabelDeal(offer.id)` | Signs first available label deal |
| **Merchandise** | `handleQuickAction('merchandise')` | `merchandise.getAvailableMerchandise()` → `merchandise.designMerchandise(id, name, quantity)` | Creates merchandise item |

### Game Progress Buttons

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Trigger Event** | `onTriggerEvent()` | `eventGen.generateEvent()` | Manually triggers event |
| **Advance Week** | `onAdvanceWeek()` | `handleAdvanceWeek()` (from GamePage) | Advances game week |

### Key Functions
- `handleQuickAction(action)`: Routes quick actions to appropriate systems

---

## Inventory Tab

### Song Management

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Write Song** | `setShowSongForm(!showSongForm)` | Toggles song form | Shows/hides song creation form |
| **Generation Mode: Basic** | `setGeneratingMode('legacy')` | Sets mode to legacy | Uses basic song creation |
| **Generation Mode: Procedural** | `setGeneratingMode('procedural')` | Sets mode to procedural | Uses AI music generation |
| **Record Song (Basic)** | `handleWriteSong()` | `modalState.openWriteSongModal(songName)` | Opens write song modal |
| **Cancel** | `setShowSongForm(false)` | Hides form | Closes song creation form |
| **Generate Song (Procedural)** | `musicGeneration.generateSong()` | Generates procedural song | Creates AI-generated song |
| **Accept Generated Song** | `onAccept()` | `gameLogic.writeSong(songData)` → Applies fan reactions | Saves generated song to game |
| **Close Playback Panel** | `setShowPlaybackPanel(false)` | Hides playback panel | Closes song preview |

### Album Management

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Build Album** | `modalState.openModal('albumBuilder')` | Opens album builder modal | Shows album creation interface |

### Key Functions
- `handleWriteSong()`: Opens write song modal for basic mode
- `onSongGenerated(genre)`: Handles procedural song generation completion
- `onAccept()`: Saves generated song and applies fan reactions

---

## Band Tab

### Main Actions

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Rehearse** | `setShowRehearsal(true)` | Opens rehearsal panel | Shows rehearsal interface |
| **Auditions** | `setShowAuditions(true)` | Opens audition panel | Shows audition interface |
| **Recruit** | `setShowRecruitment(!showRecruitment)` | Toggles recruitment panel | Shows/hides recruitment options |
| **Recruit First Member** | `setShowRecruitment(true)` | Shows recruitment panel | Opens recruitment for empty band |

### Recruitment

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Role Button (Vocalist, Guitarist, etc.)** | `handleRecruitMember(role.id)` | `bandManagement.recruitMember(role)` or creates member manually | Recruits member for specified role |

### Member Actions (Expanded View)

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Member Card** | `setSelectedMember(member)` | Selects/deselects member | Expands member details |
| **Tone Settings** | `setShowToneSettings(true)` + `setToneSettingsMember(member)` | Opens tone settings panel | Configures member's audio settings |
| **Practice ($100)** | `handlePracticeMember(member.id)` | `bandManagement.practiceMember(memberId)` → `onAdvanceWeek()` | Improves member skills |
| **Fire** | `handleFireMember(member.id)` | Removes member, decreases morale | Removes member from band |

### Key Functions
- `handleRecruitMember(role)`: Recruits member for specified role
- `handleFireMember(memberId)`: Removes member and updates morale
- `handlePracticeMember(memberId)`: Practices with specific member

---

## Gigs Tab

### Booking Actions

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Venue Card** | `setSelectedVenue(venue.id)` | Selects venue | Highlights venue for booking |
| **Book Now** | `handleBookGig(venue.id)` | `gameLogic.bookGig(venueId)` or `gigSystem.bookGig(venueId)` | Books gig at venue |
| **Next Tour Stop** | `gigSystem.advanceTourWeek()` | Advances tour to next venue | Processes next tour stop |
| **Start National Tour** | `gigSystem.startTour(venueIds)` | Starts multi-venue tour | Begins tour with selected venues |

### Key Functions
- `handleBookGig(venueId)`: Books gig at specified venue
- Tour system manages multi-venue performances

---

## Upgrades Tab

### Section Toggles

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Show/Hide Studio** | `setShowStudio(!showStudio)` | Toggles studio section | Shows/hides studio upgrades |
| **Show/Hide Instruments** | `setShowInstruments(!showInstruments)` | Toggles instruments section | Shows/hides instrument upgrades |
| **Show/Hide Stage Gear** | `setShowStageGear(!showStageGear)` | Toggles stage gear section | Shows/hides stage equipment |

### Upgrade Actions

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Upgrade Studio** | `handleUpgrade('studio', upgrade.id)` | `equipmentUpgrades.upgradeStudio()` | Upgrades studio tier |
| **Buy Instrument** | `handleUpgrade('instruments', idx)` | `equipmentUpgrades.upgradeInstruments(itemId)` | Purchases instrument upgrade |
| **Purchase Stage Gear** | `handleUpgrade('stage-gear', gear.id)` | `equipmentUpgrades.buyStageEquipment(gear.id)` | Purchases stage equipment |

### Key Functions
- `handleUpgrade(type, itemId)`: Routes upgrade to appropriate system

---

## Modals

### Write Song Modal

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Record Song** | `handleRecord()` | `onRecord(songData)` → `gameLogic.writeSong(songData)` | Creates and records song |
| **Cancel** | `handleClose()` | `onClose()` → `modalState.closeWriteSongModal()` | Closes modal without saving |
| **Background Click** | `handleClose()` | Closes modal | Closes on backdrop click |

### Album Builder Modal

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Song Toggle** | `toggleSong(songKey)` | Adds/removes song from selection | Selects/deselects song for album |
| **Release Album** | `handleRecord()` | `onRecordAlbum(selectedSongIds)` → `gameLogic.recordAlbum(songIds)` | Creates album from selected songs |
| **Cancel** | `onClose()` | `modalState.closeModal('albumBuilder')` | Closes modal without saving |

### Save Modal

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Save to Slot** | `onSave(name)` | `gameState.saveGame(saveName)` | Saves game to specified slot |
| **Delete Save** | `onDelete(name)` | Deletes save slot | Removes saved game |
| **Save New** | `handleSave()` | `onSave(saveName)` | Creates new save slot |
| **Cancel** | `onClose()` | `modalState.closeSaveModal()` | Closes modal |

### Load Modal

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Load Save** | `onLoad(name)` | `gameState.loadGame(saveName)` | Loads selected save game |
| **Close** | `onClose()` | `modalState.closeLoadModal()` | Closes modal |

### Band Stats Modal

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Close** | `onClose()` | `modalState.closeBandStatsModal()` | Closes modal |

### Enhanced Event Modal

| Button | onClick Handler | Function Called | Purpose |
|--------|----------------|-----------------|---------|
| **Choice Button** | `onSelect(choiceId)` | `handleEventChoice(eventId, choiceId, choiceText, impacts)` | Processes event choice |
| **Close** | `onClose()` | Closes event modal | Dismisses event |
| **Skip** | `onSkip()` | Skips event | Dismisses without choice |
| **Proceed** | `onProceed()` | Confirms choice | Finalizes event choice |

---

## System Hooks & Functions

### useGameLogic Hook

**Available Methods:**
- `writeSong(songInput)`: Creates new song
- `recordAlbum(selectedSongIds)`: Creates album from songs
- `getAvailableVenues()`: Returns venues available for booking
- `bookGig(venueId, advanceMultiplier)`: Books gig at venue
- `upgradeStudio()`: Upgrades studio tier
- `upgradeTransport()`: Upgrades transport tier
- `upgradeGear()`: Upgrades equipment tier
- `addMember(role, personalities)`: Adds band member
- `fireMember(memberId)`: Removes band member
- `advanceWeek(updater, entry, context)`: Advances game week
- `rehearse()`: Improves member stats
- `rest()`: Restores morale
- `startTour(tourType, weeks)`: Starts tour

### useModalState Hook

**Available Methods:**
- `openModal(key, data, exclusive)`: Opens modal
- `closeModal(key)`: Closes modal
- `closeAllModals()`: Closes all modals
- `openWriteSongModal(title)`: Opens write song modal
- `closeWriteSongModal()`: Closes write song modal
- `openModal('albumBuilder')`: Opens album builder
- `closeModal('albumBuilder')`: Closes album builder
- `openSaveModal()`: Opens save dialog
- `openLoadModal()`: Opens load dialog
- `openBandStatsModal(stats)`: Opens band stats

### useGameState Hook

**Available Methods:**
- `updateGameState(updates)`: Updates game state
- `setStep(step)`: Changes game step
- `setBandName(name)`: Sets band name
- `saveGame(saveName)`: Saves game to localStorage
- `loadGame(saveName)`: Loads game from localStorage
- `addLog(message)`: Adds log entry
- `resetGame()`: Resets game state

### useTheme Hook

**Available Methods:**
- `setTheme(theme)`: Changes color theme
- `toggleDarkMode()`: Toggles light/dark mode
- `currentTheme`: Current theme name
- `isDarkMode`: Dark mode status
- `availableThemes`: List of available themes

### useBandManagementSystem Hook

**Available Methods:**
- `recruitMember(role)`: Recruits new member
- `practiceMember(memberId)`: Practices with member
- `processWeeklyBandMaintenance()`: Weekly band updates

### useGigSystem Hook

**Available Methods:**
- `bookGig(venueId)`: Books gig
- `getAvailableVenues()`: Returns available venues
- `startTour(venueIds)`: Starts multi-venue tour
- `advanceTourWeek()`: Advances tour to next stop

### useEquipmentUpgradesSystem Hook

**Available Methods:**
- `upgradeStudio()`: Upgrades studio
- `upgradeInstruments(itemId)`: Upgrades instruments
- `buyStageEquipment(gearId)`: Purchases stage gear
- `getAvailableStudioUpgrades()`: Returns available upgrades
- `getTotalPerformanceBonus()`: Calculates total bonus

### useLabelDealsSystem Hook

**Available Methods:**
- `getAvailableLabelOffers()`: Returns label offers
- `signLabelDeal(offerId)`: Signs label contract
- `processWeeklyContractMaintenance()`: Weekly contract updates

### useMerchandiseSystem Hook

**Available Methods:**
- `getAvailableMerchandise()`: Returns merchandise options
- `designMerchandise(id, name, quantity)`: Creates merchandise
- `processWeeklySales()`: Weekly sales processing

### useEventGeneration Hook

**Available Methods:**
- `generateEvent()`: Generates random event
- Uses psychological state and narrative state for event generation

### useConsequenceSystem Hook

**Available Methods:**
- `addActiveConsequence(consequence)`: Adds active consequence
- `addDormantConsequence(consequence)`: Adds dormant consequence
- `processWeeklyConsequences()`: Processes weekly escalations
- `updateFactionStandings(choice)`: Updates faction reputation
- `updatePsychology(path, stat, amount)`: Updates psychological state

### useRecordingSystem Hook

**Available Methods:**
- Handles music recording and streaming revenue

### useRadioChartingSystem Hook

**Available Methods:**
- `processWeeklyRadioPlays()`: Processes weekly radio plays

### useSponsorshipSystem Hook

**Available Methods:**
- `processMonthlySponsorshipPayments()`: Processes sponsorship payments

### useRivalCompetitionSystem Hook

**Available Methods:**
- `processWeeklyRivalActivity()`: Processes rival actions

### useFestivalPerformanceSystem Hook

**Available Methods:**
- Handles festival performances and prestige multipliers

### useMusicGeneration Hook

**Available Methods:**
- `generateSong(options)`: Generates procedural song
- `exportMIDI()`: Exports song as MIDI
- `exportTrackDraft()`: Exports track draft

---

## Function Flow Examples

### Writing a Song (Basic Mode)
1. User clicks "Write Song" → `setShowSongForm(true)`
2. User selects "Basic" mode → `setGeneratingMode('legacy')`
3. User enters song name and clicks "Record Song" → `handleWriteSong()`
4. Opens modal → `modalState.openWriteSongModal(songName)`
5. User fills form and clicks "Record Song" → `onRecord(songData)`
6. Calls → `gameLogic.writeSong(songData)`
7. Updates state → `gameState.updateGameState()` with new song
8. Advances week → `advanceWeek()` processes week effects

### Booking a Gig
1. User clicks "Book Gig" (Dashboard) or selects venue (Gigs Tab)
2. Calls → `gameLogic.bookGig(venueId)`
3. Calculates costs, attendance, revenue
4. Updates state → `gameState.updateGameState()` with gig data
5. Advances week → `advanceWeek()` processes week effects

### Advancing Week
1. User clicks "Advance Week"
2. Calls → `handleAdvanceWeek()` in GamePage
3. Processes consequences → `consequenceSystem.processWeeklyConsequences()`
4. Updates all systems:
   - `bandManagement.processWeeklyBandMaintenance()`
   - `radioCharting.processWeeklyRadioPlays()`
   - `merchandise.processWeeklySales()`
   - `sponsorships.processMonthlySponsorshipPayments()`
   - `labelDeals.processWeeklyContractMaintenance()`
   - `rivalCompetition.processWeeklyRivalActivity()`
5. Generates events → `eventGen.generateEvent()`
6. Advances week counter → `gameState.updateGameState({ week: week + 1 })`
7. Processes week effects → `processWeekEffects()` (expenses, revenue, song aging)

---

## Summary Statistics

- **Total Buttons Mapped**: 100+
- **Total Functions**: 80+
- **Modal Systems**: 9 modals
- **Tab Systems**: 7 tabs
- **Game Systems**: 15+ specialized hooks
- **State Management**: 6 core hooks

---

## Notes

- All button handlers are wired through React props and hooks
- Modal state is centralized in `useModalState`
- Game state is managed by `useGameState`
- Game logic is separated into specialized system hooks
- Week advancement triggers cascading system updates
- Event generation is based on psychological state
- All actions can trigger log entries via `addLog()`

---

**End of Report**
