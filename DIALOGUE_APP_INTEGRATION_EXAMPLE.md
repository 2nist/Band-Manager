# Enhanced Dialogue Integration - App.jsx Implementation Example

This document shows how to integrate the Enhanced Dialogue System into your App.jsx.

## Basic Integration Structure

```jsx
import React, { useState, useCallback } from 'react';
import {
  useGameState,
  useUIState,
  useModalState,
  useGameLogic,
  useEnhancedDialogue,
  useEventGeneration
} from './hooks';
import { EnhancedEventModal } from './components/EnhancedEventModal';

function App() {
  // Core state hooks
  const gameState = useGameState();
  const uiState = useUIState();
  const modalState = useModalState();
  const gameLogic = useGameLogic(gameState);
  
  // Enhanced dialogue system
  const dialogueState = useEnhancedDialogue();
  const eventGen = useEventGeneration(
    gameState.gameData,
    dialogueState.psychologicalState,
    dialogueState.narrativeState
  );

  // Handle event choice
  const handleEventChoice = useCallback((eventId, choiceId, choiceText, consequences) => {
    // 1. Record the dialogue choice
    dialogueState.recordDialogueChoice(eventId, choiceId, choiceText, consequences);

    // 2. Apply immediate effects to game state
    if (consequences.immediate) {
      Object.entries(consequences.immediate).forEach(([effect, value]) => {
        switch (effect) {
          case 'money':
            gameState.updateGameState({ money: gameState.gameData.money + value });
            break;
          case 'stress':
            dialogueState.updatePsychologicalState({ stress_level: value });
            break;
          case 'energy':
            // Update game energy if applicable
            break;
        }
      });
    }

    // 3. Apply psychological effects
    if (consequences.psychological) {
      dialogueState.updatePsychologicalState(consequences.psychological);
    }

    // 4. Check for trauma triggers
    const traumaRisk = consequences.trauma;
    if (traumaRisk && Math.random() < traumaRisk.probability) {
      dialogueState.addTrauma(
        traumaRisk.type,
        traumaRisk.description,
        traumaRisk.severity
      );
    }

    // 5. Handle long-term consequences
    if (consequences.longTerm) {
      // Addiction progression
      if (consequences.longTerm.addiction_escalation) {
        if (!dialogueState.narrativeState.addiction_progression) {
          dialogueState.startAddictionProgression('substance');
        }
      }

      // Corruption progression
      if (consequences.longTerm.corruption_escalation) {
        if (!dialogueState.narrativeState.corruption_progression) {
          dialogueState.startCorruptionPath('money_laundering');
        }
      }

      // Law enforcement attention
      if (consequences.longTerm.law_enforcement_attention) {
        dialogueState.updateFactionReputation(
          'law_enforcement',
          -Math.floor(consequences.longTerm.law_enforcement_attention * 100)
        );
      }
    }

    // 6. Log the event to game history
    gameState.addLog(`Event: ${choiceText}`, 'event');

    // 7. Close the modal
    modalState.closeAllModals();
  }, [gameState, dialogueState, modalState]);

  // Generate and show an event
  const handleTriggerEvent = useCallback(() => {
    const event = eventGen.generateEvent();
    modalState.openModal('enhancedEvent', { event });
  }, [eventGen, modalState]);

  // Example: Trigger event when band completes a show
  const handleBookGig = useCallback((gigType) => {
    // Perform normal gig logic
    gameLogic.bookGig(gigType);

    // Randomly trigger enhanced dialogue event (20% chance)
    if (Math.random() < 0.2) {
      setTimeout(handleTriggerEvent, 1000); // Show after completion animation
    }
  }, [gameLogic, handleTriggerEvent]);

  return (
    <div className="app">
      {/* Your existing UI components */}

      {/* Enhanced Event Modal */}
      <EnhancedEventModal
        isOpen={modalState.modals.enhancedEvent}
        event={modalState.modalData.enhancedEvent?.event}
        psychologicalState={dialogueState.psychologicalState}
        onChoice={handleEventChoice}
        onClose={() => modalState.closeAllModals()}
      />

      {/* Debug Info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 999 }}>
          <details style={{ 
            backgroundColor: 'rgba(0,0,0,0.8)', 
            color: '#fff', 
            padding: '1rem',
            borderRadius: '0.5rem',
            maxWidth: '400px'
          }}>
            <summary>Debug: Psychological State</summary>
            <div style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
              <div>Stress: {dialogueState.psychologicalState.stress_level}/100</div>
              <div>Addiction Risk: {dialogueState.psychologicalState.addiction_risk}/100</div>
              <div>Moral Integrity: {dialogueState.psychologicalState.moral_integrity}/100</div>
              <div>Paranoia: {dialogueState.psychologicalState.paranoia}/100</div>
              <div>Depression: {dialogueState.psychologicalState.depression}/100</div>
              <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #444' }}>
                Archetype: {dialogueState.narrativeState.player_archetype || 'unknown'}
              </div>
              <button 
                onClick={handleTriggerEvent}
                style={{
                  marginTop: '0.5rem',
                  padding: '0.5rem',
                  backgroundColor: '#8b5cf6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.25rem',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Trigger Event
              </button>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

export default App;
```

## Integration by Game Action

### When Player Uses Substance

```javascript
const handleUseSubstance = useCallback((substance) => {
  // Trigger substance event based on current addiction stage
  const currentStage = dialogueState.narrativeState.addiction_progression?.stage || 'experimental';
  const event = eventGen.generateSubstanceEvent(currentStage);
  
  modalState.openModal('enhancedEvent', { event });
}, [dialogueState, eventGen, modalState]);
```

### When Player Gets Corrupt Offer

```javascript
const handleCorruptionOpportunity = useCallback((dealType) => {
  // Increase corruption event likelihood as moral integrity drops
  if (dialogueState.psychologicalState.moral_integrity < 50) {
    const stage = dialogueState.narrativeState.corruption_progression?.stage || 'first_compromise';
    const event = eventGen.generateCorruptionEvent(stage);
    
    modalState.openModal('enhancedEvent', { event });
  }
}, [dialogueState, eventGen, modalState]);
```

### When Player Experiences High Stress

```javascript
const handleStressAccumulation = useCallback(() => {
  // If stress is very high, trigger psychological horror event
  if (dialogueState.psychologicalState.stress_level > 80) {
    const event = eventGen.generateHorrorEvent();
    
    modalState.openModal('enhancedEvent', { event });
  }
}, [dialogueState, eventGen, modalState]);
```

### During Weekly Progression

```javascript
const handleAdvanceWeek = useCallback(() => {
  // Existing logic
  gameLogic.advanceWeek();

  // Update archetype based on dialogue history
  const archetype = dialogueState.detectPlayerArchetype(
    dialogueState.narrativeState.dialogue_history
  );
  if (archetype && archetype !== dialogueState.narrativeState.player_archetype) {
    // Archetype changed - could trigger narrative event
    console.log(`Player archetype changed to: ${archetype}`);
  }

  // Escalate addiction if in progression
  if (dialogueState.narrativeState.addiction_progression?.stage === 'regular_use') {
    if (Math.random() < 0.4) {
      dialogueState.escalateAddiction(['dependent']);
    }
  }

  // Escalate corruption if in progression
  if (dialogueState.narrativeState.corruption_progression?.stage === 'first_compromise') {
    if (Math.random() < 0.3) {
      dialogueState.escalateCorruption(['moral_flexibility']);
    }
  }

  // Random event trigger based on psychological state
  const eventProb = (dialogueState.psychologicalState.stress_level / 100) * 0.3; // 0-30% chance
  if (Math.random() < eventProb) {
    const event = eventGen.generateEvent();
    modalState.openModal('enhancedEvent', { event });
  }
}, [gameLogic, dialogueState, eventGen, modalState]);
```

## State Flow Diagram

```
Game Action (e.g., Book Gig)
  ↓
Check Event Trigger Probability
  ↓
IF TRIGGERED:
  ↓
  generateEvent() → Consider:
  - Current stress level
  - Current addiction risk
  - Current moral integrity
  - Ongoing storylines (addiction/corruption progression)
  - Faction reputation
  ↓
  Select appropriate event type:
  - Substance event (if addiction_risk high)
  - Corruption event (if moral_integrity low)
  - Horror event (if stress_level high)
  ↓
Show EnhancedEventModal
  ↓
Player Selects Choice
  ↓
recordDialogueChoice() → Update dialogue history
↓
Apply Consequences:
  - Immediate effects (money, stress changes)
  - Psychological effects (state updates)
  - Trauma risk checks
  - Long-term progression (addiction/corruption escalation)
  ↓
Update Game State
  ↓
Close Modal
  ↓
Continue Game
```

## Psychological State Auto-Progression

These can be automated during weekly advancement:

```javascript
// In handleAdvanceWeek or periodic update
const manageStressProgression = useCallback(() => {
  const { stress_level, paranoia, depression } = dialogueState.psychologicalState;
  
  // Stress naturally decreases over time (unless reasons to maintain it)
  if (stress_level > 0) {
    dialogueState.updatePsychologicalState({
      stress_level: Math.max(0, stress_level - 5)
    });
  }
  
  // High stress can spiral into paranoia/depression
  if (stress_level > 70 && paranoia < 100) {
    dialogueState.updatePsychologicalState({
      paranoia: Math.min(100, paranoia + 10)
    });
  }
  
  if (stress_level > 75 && depression < 100) {
    dialogueState.updatePsychologicalState({
      depression: Math.min(100, depression + 8)
    });
  }
}, [dialogueState]);
```

## Testing the Integration

```javascript
// Add to App.jsx temporarily for testing
useEffect(() => {
  window.testDialogueSystem = {
    triggerEvent: handleTriggerEvent,
    triggerSubstanceEvent: () => {
      const event = eventGen.generateSubstanceEvent('experimental');
      modalState.openModal('enhancedEvent', { event });
    },
    triggerCorruptionEvent: () => {
      const event = eventGen.generateCorruptionEvent('first_compromise');
      modalState.openModal('enhancedEvent', { event });
    },
    triggerHorrorEvent: () => {
      const event = eventGen.generateHorrorEvent();
      modalState.openModal('enhancedEvent', { event });
    },
    increasStress: () => {
      dialogueState.updatePsychologicalState({
        stress_level: Math.min(100, dialogueState.psychologicalState.stress_level + 25)
      });
    },
    decreaseMorality: () => {
      dialogueState.updatePsychologicalState({
        moral_integrity: Math.max(0, dialogueState.psychologicalState.moral_integrity - 25)
      });
    },
    getState: () => ({
      psychological: dialogueState.psychologicalState,
      narrative: dialogueState.narrativeState
    })
  };
}, []);

// In browser console: window.testDialogueSystem.triggerEvent()
```

## Key Integration Points

1. **useEnhancedDialogue** - Initialize once per app, holds all psychological state
2. **useEventGeneration** - Pass psychological state to generate appropriate events
3. **EnhancedEventModal** - Wire to modalState for show/hide
4. **handleEventChoice** - Central hub for consequence application
5. **Game progression** - Hook into weekly advancement for escalation checks

This modular approach keeps concerns separated while allowing deep integration with game systems.
