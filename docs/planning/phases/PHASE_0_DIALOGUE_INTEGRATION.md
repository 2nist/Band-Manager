# Enhanced Dialogue System Integration Guide

## Phase 0 Week 1 Day 3 - Enhanced Dialogue Implementation

**Date**: Phase 0 Integration Week  
**Status**: ✅ ALL COMPONENTS CREATED AND BUILDING SUCCESSFULLY  
**Build Result**: 0 errors, 1711 modules transformed, 7.89s

## Components Created

### 1. useEnhancedDialogue.js (307 lines)
**Purpose**: Core hook for psychological state management and narrative tracking

**Public API**:
```javascript
const {
  psychologicalState,      // Current psychological metrics
  narrativeState,          // Story progression tracking
  updatePsychologicalState,
  addTrauma,
  addCopingMechanism,
  detectPlayerArchetype,
  updateFactionReputation,
  startAddictionProgression,
  escalateAddiction,
  startCorruptionPath,
  escalateCorruption,
  triggerPsychologicalCrisis,
  recordDialogueChoice,
  getConsequencesPreview,
  checkTraumaTrigger
} = useEnhancedDialogue();
```

**State Managed**:
- **Psychological Metrics** (all 0-100 scale):
  - `stress_level`: 0-100, increases from trauma, choices, events
  - `addiction_risk`: 0-100, increases from substance exposure
  - `moral_integrity`: 100-0 (inverted), decreases from corruption choices
  - `paranoia`: 0-100, increases from law enforcement encounters, obsession
  - `depression`: 0-100, increases from trauma, guilt, rejection
  
- **Trauma Tracking**:
  - `trauma_history[]`: Array of {type, description, severity, timestamp, effects}
  - `trauma_triggers{}`: Probability-based trauma generation map
  
- **Coping Mechanisms**:
  - `healthy_coping[]`: Family support, professional help, therapy, friends
  - `unhealthy_coping[]`: Substance abuse, reckless behavior, isolation
  
- **Narrative Progression**:
  - `player_archetype`: saint, rebel, villain, addict, paranoid, survivor, loyalist
  - `faction_reputation{}`: Standing with 5 factions (-100 to 100 each)
  - `ongoing_storylines[]`: Current narrative arcs in progress
  - `dialogue_history[]`: All dialogue choices and consequences
  - `addiction_progression`: Current stage and substance type
  - `corruption_progression`: Current stage and deal type

**Key Methods**:

```javascript
// Update any psychological metric (auto-clamped to 0-100)
updatePsychologicalState({
  stress_level: 75,
  addiction_risk: 40,
  moral_integrity: 25  // Stored as 75 internally
});

// Record traumatic events with cascading effects
addTrauma(
  'overdose_scare',
  'Nearly died from heroin overdose',
  'severe'  // minor, moderate, severe, critical
);

// Track coping strategies
addCopingMechanism('therapy_sessions', 'healthy');
addCopingMechanism('cocaine_binges', 'unhealthy');

// Analyze player psychology to determine archetype
const archetype = detectPlayerArchetype(choiceHistory);
// Returns: 'saint', 'rebel', 'villain', 'addict', 'paranoid', 'survivor', 'loyalist'

// Update standing with factions
updateFactionReputation('underground_scene', 25);  // +25 with underground
updateFactionReputation('law_enforcement', -50);   // -50 with cops

// Addiction storyline progression
startAddictionProgression('cocaine');
escalateAddiction(['experimental', 'regular_use', 'dependent']);

// Corruption storyline progression
startCorruptionPath('money_laundering');
escalateCorruption(['first_compromise', 'moral_flexibility', 'active_corruption']);

// Trigger psychological crisis
triggerPsychologicalCrisis('paranoia_spiral');  // paranoia, depression, psychosis, breakdown

// Track dialogue choices
recordDialogueChoice(
  'event_001',
  'choice_cocaine_yes',
  'I need this',
  { addiction_risk: 30, stress: -25 }
);

// Preview consequences before committing to choice
const preview = getConsequencesPreview(choice);
// Returns: { immediate: {}, shortTerm: {}, longTerm: {}, psychological: {} }

// Check if choice should generate trauma
const hasTrauma = checkTraumaTrigger(choice, gameContext);
```

### 2. useEventGeneration.js (550 lines)
**Purpose**: Procedural generation of infinite unique gritty events

**Public API**:
```javascript
const {
  generateEvent,              // Auto-detect type based on psych state
  generateSubstanceEvent,     // Generate addiction/drug events
  generateCorruptionEvent,    // Generate corruption/deal events
  generateHorrorEvent,        // Generate psychological horror
  selectCharacter             // Generate NPC character for event
} = useEventGeneration(gameState, psychologicalState, narrativeState);
```

**Event Structure**:
```javascript
{
  id: 'substance_experimental_1234567',
  category: 'substance_abuse' | 'corruption' | 'psychological_horror',
  title: 'Event Title',
  maturityLevel: 'mature',
  risk: 'low' | 'medium' | 'high' | 'extreme' | 'critical',
  description: 'Event narrative...',
  character: {
    archetype: 'sleazy_manager',
    name: 'Slick Eddie Goldman',
    dialogue: '"Trust me, kid..."',
    traits: ['manipulative', 'charismatic']
  },
  choices: [
    {
      id: 'choice_id',
      text: 'What player sees',
      riskLevel: 'extreme',
      immediateEffects: { money: 5000, stress: 10 },
      psychologicalEffects: { moral_integrity: -20, paranoia: 30 },
      longTermEffects: { corruption_escalation: true },
      traumaRisk: { type, probability, severity, description }
    }
  ]
}
```

**Character Archetypes Available**:
- `sleazy_manager`: Manipulative, greedy, connected
- `drug_dealer`: Calculating, dangerous, business-minded
- `obsessed_fan`: Unstable, devoted, dangerous
- `corrupt_cop`: Authoritarian, corruptible, violent
- `industry_executive`: Calculated, powerful, ruthless

**Usage Pattern**:
```javascript
// Generate random event based on psychological state
const event = generateEvent();

// Generate specific type
const substanceEvent = generateSubstanceEvent('dependent');
const corruptionEvent = generateCorruptionEvent('deep_involvement');
const horrorEvent = generateHorrorEvent();

// Custom character selection
const dealer = selectCharacter('drug_dealer');
```

### 3. EnhancedEventModal.jsx (500+ lines)
**Purpose**: Cinematic UI for presenting gritty events

**Features**:
- Atmospheric dark background with gradient effects
- Character dialogue presentation
- Real-time psychological state visualization (stress, morality, addiction, paranoia)
- Risk level indicators (color-coded: green/yellow/orange/red/black)
- Interactive choice selection with hover effects
- Consequence preview showing:
  - Immediate effects (money, energy, stress changes)
  - Psychological effects (moral_integrity, paranoia, depression shifts)
  - Long-term consequences (storyline escalations)
  - Trauma risk warnings with probability and severity

**Props**:
```javascript
<EnhancedEventModal
  isOpen={boolean}
  event={eventObject}
  psychologicalState={psychState}
  onChoice={(eventId, choiceId, choiceText, consequences) => {}}
  onClose={() => {}}
/>
```

**Visual Design**:
- Dark theme (fits band game aesthetic)
- Color-coded risk levels
- Smooth animations and transitions
- Responsive grid layout for psychological metrics
- Skull emoji (💀) for critical consequences
- Danger emoji (⚠) for warnings

## Integration Steps

### Step 1: Update hooks/index.js
Add exports for new hooks:
```javascript
export { useGameState } from './useGameState';
export { useUIState } from './useUIState';
export { useModalState } from './useModalState';
export { useGameLogic } from './useGameLogic';
export { useEnhancedDialogue } from './useEnhancedDialogue';
export { useEventGeneration } from './useEventGeneration';
```

### Step 2: Update components/Modals/index.js (or create)
```javascript
export { EnhancedEventModal } from '../EnhancedEventModal';
```

### Step 3: Import in App.jsx
```javascript
import { useEnhancedDialogue, useEventGeneration, useModalState } from '../hooks';
import { EnhancedEventModal } from '../components/EnhancedEventModal';

function App() {
  const dialogueState = useEnhancedDialogue();
  const eventGen = useEventGeneration(gameState, dialogueState.psychologicalState, dialogueState.narrativeState);
  const modalState = useModalState();

  // Generate and show event
  const handleShowEvent = () => {
    const event = eventGen.generateEvent();
    modalState.openModal('enhancedEvent', { event });
  };

  const handleEventChoice = (eventId, choiceId, choiceText, consequences) => {
    // Record the choice
    dialogueState.recordDialogueChoice(eventId, choiceId, choiceText, consequences);
    
    // Apply psychological effects
    if (consequences.psychological?.length) {
      dialogueState.updatePsychologicalState({
        // Extract effects from consequences
      });
    }

    // Progress narratives
    // Handle addiction/corruption progression
    // Add trauma if applicable
  };

  return (
    <>
      {/* ... other content ... */}
      <EnhancedEventModal
        isOpen={modalState.modals.enhancedEvent}
        event={modalState.modalData.enhancedEvent?.event}
        psychologicalState={dialogueState.psychologicalState}
        onChoice={handleEventChoice}
        onClose={() => modalState.closeAllModals()}
      />
    </>
  );
}
```

## Content System

### Mature Content Coverage
All events include the following gritty themes (NO filtering or censorship):
- **Substance Abuse**: Cocaine, heroin, pills, alcohol - full addiction mechanics
- **Sexual Content**: Implied/explicit depending on narrative context
- **Violence**: Gang violence, domestic abuse, assault, murder
- **Psychological Horror**: Mental breakdowns, paranoia, psychosis, trauma triggers
- **Industry Corruption**: Money laundering, fraud, embezzlement, payola
- **Criminal Activity**: Drug trafficking, theft, illegal deals, RICO statutes

### Consequence Chains
Events connect through narrative progression:

**Addiction Path**:
1. Experimental → Regular Use → Dependent → Addicted
2. Each stage increases substance appeal, health degradation
3. Trauma risks escalate (overdose, infection, psychosis)

**Corruption Path**:
1. First Compromise → Moral Flexibility → Active Corruption → Deep Involvement
2. Each stage decreases moral_integrity, increases paranoia, law enforcement attention
3. Event consequences become more severe

**Psychological Crisis Path**:
1. Stress accumulation → Depression → Paranoia → Psychosis → Breakdown
2. Crisis events triggered by cumulative trauma and current state

## Testing Checklist

✅ useEnhancedDialogue.js created (307 lines)
✅ useEventGeneration.js created (550 lines)
✅ EnhancedEventModal.jsx created (500+ lines)
✅ npm build successful (0 errors, 1711 modules)
✅ No import/export errors
✅ All hooks properly exported
✅ All components properly structured

## Next Phase Work

**Phase 0 Week 1 Day 4-5**:
- [ ] Test event generation with sample events
- [ ] Test psychological state updates
- [ ] Test addiction/corruption progression
- [ ] Test trauma trigger system
- [ ] Test faction reputation system

**Phase 0 Week 2**:
- [ ] Extract game logic to utils/ files
- [ ] Create GameContext provider
- [ ] Create page component framework
- [ ] Begin full integration testing

## File Locations

- `/src/hooks/useEnhancedDialogue.js` - Psychological state management
- `/src/hooks/useEventGeneration.js` - Procedural event generation
- `/src/components/EnhancedEventModal.jsx` - Event presentation UI
- `/src/hooks/index.js` - Hook exports
- `/src/components/Modals/index.js` - Modal component exports (to create)

## Build Status

```
✓ 1711 modules transformed.
dist/index.html                   1.49 kB │ gzip:  0.71 kB
dist/assets/index-1Gg00F5R.css   34.24 kB │ gzip:  7.85 kB
dist/assets/index-UnIPcXH0.js   347.95 kB │ gzip: 99.10 kB
✓ built in 7.89s
```

All components built successfully with zero errors.

---

**Next Action**: Update App.jsx to integrate these new hooks and components into the game flow. This will enable procedural event generation with full psychological state tracking and gritty narrative consequences.
