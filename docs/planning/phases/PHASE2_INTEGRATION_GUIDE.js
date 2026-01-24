/**
 * PHASE 2 INTEGRATION GUIDE
 * 
 * This document shows how useConsequenceSystem integrates with useGameState
 * in your existing App.jsx structure
 */

// ==================== IN YOUR EXISTING App.jsx ====================

import { useGameState } from './hooks/useGameState';
import { useConsequenceSystem } from './hooks/useConsequenceSystem';

function App() {
  // Your existing game state
  const gameStateHook = useGameState();
  const { state, setState, saveGame, loadGame } = gameStateHook;

  // NEW: Phase 2 consequence system
  const consequenceHook = useConsequenceSystem(state);
  const {
    consequences,
    factions,
    psychologicalEvolution,
    addActiveConsequence,
    addDormantConsequence,
    processEscalations,
    checkResurfacing,
    updateFactionStandings,
    updatePsychology,
    getFactionInfluencedEvents,
    getFactionStatus
  } = consequenceHook;

  // ==================== WEEKLY UPDATE INTEGRATION ====================
  // This goes in your existing week advancement function

  const advanceWeek = () => {
    // 1. Existing weekly updates (money, fame, etc.)
    setState(prevState => ({
      ...prevState,
      week: prevState.week + 1,
      // ... your existing weekly updates
    }));

    // 2. NEW: Process consequence escalations
    const escalations = processEscalations();
    if (escalations.length > 0) {
      escalations.forEach(esc => {
        console.log(`Consequence "${esc.consequenceId}" escalated to ${esc.stage}`);
        // Queue these as events to show player
        queueEventForDisplay({
          type: 'consequence_escalation',
          consequenceId: esc.consequenceId,
          event: esc.event,
          intensity: esc.intensity
        });
      });
    }

    // 3. NEW: Check for resurfacing dormant consequences
    const resurfaced = checkResurfacing();
    if (resurfaced.length > 0) {
      resurfaced.forEach(res => {
        console.log(`Dormant consequence "${res.consequenceId}" has resurfaced!`);
        queueEventForDisplay({
          type: 'consequence_resurfaced',
          consequenceId: res.consequenceId,
          event: res.event
        });
      });
    }

    // 4. NEW: Apply faction decay (if inactive)
    applyFactionDecay();
  };

  // ==================== CHOICE HANDLING INTEGRATION ====================
  // This goes in your existing choice/dialogue handler

  const handleDialogueChoice = async (choice) => {
    // 1. Your existing choice effects
    applyChoiceEffects(choice);

    // 2. NEW: Update faction standings based on choice
    if (choice.factionEffects) {
      updateFactionStandings(choice);
      
      // Show player the faction impact
      showNotification(`Faction reactions to your choice`, choice.factionEffects);
    }

    // 3. NEW: Handle consequence triggers
    if (choice.triggerConsequence) {
      const consequence = choice.triggerConsequence;
      
      if (consequence.type === 'active') {
        addActiveConsequence(consequence);
      } else if (consequence.type === 'dormant') {
        addDormantConsequence(consequence);
      }
    }

    // 4. NEW: Update psychological evolution
    if (choice.psychologyEffects) {
      Object.entries(choice.psychologyEffects).forEach(([path, changes]) => {
        Object.entries(changes).forEach(([stat, amount]) => {
          updatePsychology(path, stat, amount);
        });
      });
    }

    // 5. Existing: show next dialogue
    showNextDialogue();
  };

  // ==================== SAVE/LOAD INTEGRATION ====================

  const createSaveFile = () => {
    return {
      // Existing save data
      state,
      timestamp: new Date().toISOString(),

      // NEW: Phase 2 data
      consequences: consequences,
      factions: factions,
      psychologicalEvolution: psychologicalEvolution
    };
  };

  const loadFromSaveFile = (saveData) => {
    // Restore game state
    setState(saveData.state);

    // NEW: Restore Phase 2 systems (these handle their own localStorage)
    // The hooks will auto-restore from localStorage on mount
    // But you can optionally override:
    if (saveData.consequences) {
      // Manually restore if needed
      localStorage.setItem('gigmaster_consequences', JSON.stringify(saveData.consequences));
    }
    if (saveData.factions) {
      localStorage.setItem('gigmaster_factions', JSON.stringify(saveData.factions));
    }
    if (saveData.psychologicalEvolution) {
      localStorage.setItem('gigmaster_psychology', JSON.stringify(saveData.psychologicalEvolution));
    }
  };

  // ==================== EVENT GENERATION INTEGRATION ====================

  const generateEvents = () => {
    const events = [];

    // Your existing event generation...
    const baseEvents = generateBaseEvents(state);
    events.push(...baseEvents);

    // NEW: Get faction-influenced events
    const factionEvents = getFactionInfluencedEvents();
    factionEvents.forEach(factionEvent => {
      // Map faction events to actual event data
      const eventData = mapFactionEventToData(factionEvent, state);
      if (eventData) events.push(eventData);
    });

    // NEW: Include queued consequence events
    const consequenceEvents = getQueuedConsequenceEvents();
    events.push(...consequenceEvents);

    return events;
  };

  // ==================== DIALOGUE OPTION FILTERING ====================

  const filterDialogueChoices = (allChoices) => {
    return allChoices.filter(choice => {
      // Existing filters...

      // NEW: Filter based on faction standing
      if (choice.requiredFaction) {
        const factionStatus = getFactionStatus(choice.requiredFaction.id);
        if (choice.requiredFaction.minStatus) {
          const statusLevels = ['enemy', 'hostile', 'wary', 'neutral', 'ally'];
          const requiredLevel = statusLevels.indexOf(choice.requiredFaction.minStatus);
          const currentLevel = statusLevels.indexOf(factionStatus);
          if (currentLevel < requiredLevel) return false;
        }
      }

      // NEW: Filter based on psychological state
      if (choice.requiredPsychology) {
        if (choice.requiredPsychology.minCorruption) {
          if (psychologicalEvolution.corruptionPath.currentLevel < choice.requiredPsychology.minCorruption) {
            return false;
          }
        }
        if (choice.requiredPsychology.addictionStage) {
          if (psychologicalEvolution.addictionPath.currentStage !== choice.requiredPsychology.addictionStage) {
            return false;
          }
        }
      }

      // NEW: Filter based on consequences
      if (choice.lockedByConsequence) {
        const consequence = consequences.active.find(c => c.id === choice.lockedByConsequence);
        if (!consequence) return true; // Choice available
        return false; // Consequence locks this choice
      }

      return true;
    });
  };

  // Return component with integrated state
  return (
    <GameComponent
      gameState={state}
      consequences={consequences}
      factions={factions}
      psychology={psychologicalEvolution}
      onChoice={handleDialogueChoice}
      onAdvanceWeek={advanceWeek}
      // ... other props
    />
  );
}

export default App;
