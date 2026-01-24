import { useState, useCallback, useEffect } from 'react';
import { detectArchetypeFromChoices } from '../utils/psychologicalProfiles';

/**
 * useEnhancedDialogue - Psychological state and consequence tracking for gritty events
 * 
 * Manages:
 * - Psychological state (stress, addiction risk, moral integrity, paranoia, depression)
 * - Dialogue history and narrative arc progression
 * - Long-term consequence tracking
 * - Player archetype detection
 * - Faction reputation system
 * 
 * @param {Object} gameState - Current game state from useGameState
 * @param {Function} updateGameState - Function to update game state
 * @returns {Object} Dialogue management methods and state
 */
export const useEnhancedDialogue = (gameState, updateGameState) => {
  // Core psychological state
  const [psychologicalState, setPsychologicalState] = useState(() => ({
    stress_level: 20,           // 0-100
    addiction_risk: 0,          // 0-100
    moral_integrity: 100,       // 100-0
    paranoia: 0,               // 0-100
    depression: 0,             // 0-100
    
    // Trauma tracking
    trauma_history: [],
    coping_mechanisms: [],
    
    // Support system
    support_network: {
      family_contact: 100,
      friend_relationships: 100,
      professional_help: false,
      mentor_figures: []
    }
  }));

  // Narrative and consequence tracking
  const [narrativeState, setNarrativeState] = useState(() => ({
    ongoing_storylines: [],
    dormant_storylines: [],
    immediate_effects: [],
    permanent_effects: [],
    
    // Player archetype
    player_archetype: {
      primary: null,
      secondary: null,
      reputation_modifiers: {}
    },
    
    // Faction reputation (using plural for consistency with other systems)
    faction_standings: {
      underground_scene: 0,      // -100 to 100
      industry_insiders: 0,
      mainstream_media: 0,
      law_enforcement: 0,
      criminal_underworld: 0
    },
    
    // Consequence tracking
    addiction_progression: {
      stage: 'none',
      weeks_clean: 0,
      relapse_risk: 0,
      support_factors: []
    },
    
    corruption_progression: {
      stage: 'innocent',
      deals_made: [],
      crimes_committed: []
    }
  }));

  // Dialogue history for continuity
  const [dialogueHistory, setDialogueHistory] = useState([]);

  /**
   * Update psychological metrics
   */
  const updatePsychologicalState = useCallback((updates) => {
    setPsychologicalState(prev => {
      const newState = { ...prev };
      
      Object.keys(updates).forEach(key => {
        if (typeof newState[key] === 'number') {
          newState[key] = Math.max(0, Math.min(100, prev[key] + updates[key]));
        } else {
          newState[key] = updates[key];
        }
      });
      
      return newState;
    });
  }, []);

  /**
   * Add trauma event
   */
  const addTrauma = useCallback((traumaType, description, severity = 'moderate') => {
    const trauma = {
      id: `trauma_${Date.now()}`,
      type: traumaType,
      description,
      severity, // 'minor', 'moderate', 'severe', 'critical'
      week: gameState.week,
      effects: {
        stress: severity === 'critical' ? 40 : severity === 'severe' ? 30 : 15,
        paranoia: severity === 'critical' ? 30 : severity === 'severe' ? 20 : 10,
        depression: severity === 'critical' ? 25 : severity === 'severe' ? 15 : 5
      }
    };
    
    setPsychologicalState(prev => ({
      ...prev,
      trauma_history: [...prev.trauma_history, trauma]
    }));
    
    // Apply immediate effects
    updatePsychologicalState(trauma.effects);
  }, [gameState.week, updatePsychologicalState]);

  /**
   * Add coping mechanism (healthy or unhealthy)
   */
  const addCopingMechanism = useCallback((mechanism, type = 'unhealthy') => {
    setPsychologicalState(prev => ({
      ...prev,
      coping_mechanisms: [...prev.coping_mechanisms, { mechanism, type, week: gameState.week }]
    }));
    
    // Healthy mechanisms reduce stress, unhealthy ones temporarily reduce stress but increase other issues
    if (type === 'healthy') {
      updatePsychologicalState({ stress_level: -15, depression: -10 });
    } else {
      updatePsychologicalState({ stress_level: -20, paranoia: +10, addiction_risk: +5 });
    }
  }, [gameState.week, updatePsychologicalState]);

  /**
   * Detect player archetype based on choice history
   */
  const detectPlayerArchetype = useCallback((choiceHistory) => {
    // Use enhanced archetype detection from psychologicalProfiles
    const detectedArchetype = detectArchetypeFromChoices(choiceHistory, psychologicalState);
    
    let primary = 'survivor';
    let secondary = null;
    
    if (detectedArchetype) {
      primary = detectedArchetype.id;
      
      // Determine secondary based on psychological state
      if (psychologicalState.moral_integrity > 70 && primary !== 'moral_compass') {
        secondary = 'moral_compass';
      } else if (psychologicalState.addiction_risk > 60 && primary !== 'self_destructive') {
        secondary = 'self_destructive';
      } else if (psychologicalState.stress_level < 40 && primary !== 'survivor') {
        secondary = 'survivor';
      }
    } else {
      // Fallback to legacy detection for compatibility
      const moralChoices = choiceHistory.filter(c => c.type === 'moral');
      const riskChoices = choiceHistory.filter(c => c.type === 'risk');
      const loyaltyChoices = choiceHistory.filter(c => c.type === 'loyalty');
      
      const moralScore = moralChoices.reduce((sum, c) => sum + (c.ethical ? 1 : -1), 0);
      const riskScore = riskChoices.reduce((sum, c) => sum + (c.risky ? 1 : -1), 0);
      const loyaltyScore = loyaltyChoices.reduce((sum, c) => sum + (c.loyal ? 1 : -1), 0);
      
      if (moralScore < -30 && riskScore > 20) {
        primary = 'risk_seeker';
      } else if (moralScore < -50 && psychologicalState.moral_integrity < 30) {
        primary = 'self_destructive';
      } else if (riskScore < -20) {
        primary = 'people_pleaser';
      } else if (loyaltyScore > 30) {
        primary = 'pragmatist';
      } else if (psychologicalState.addiction_risk > 70) {
        primary = 'self_destructive';
      } else if (psychologicalState.paranoia > 60) {
        primary = 'people_pleaser';
      }
      
      if (Math.abs(moralScore) > 20) {
        secondary = moralScore > 0 ? 'moral_compass' : 'pragmatist';
      }
    }
    
    setNarrativeState(prev => ({
      ...prev,
      player_archetype: {
        primary,
        secondary,
        detected: detectedArchetype,
        reputation_modifiers: {}
      }
    }));
    
    return { primary, secondary, detected: detectedArchetype };
  }, [psychologicalState]);

  /**
   * Update faction reputation
   */
  const updateFactionReputation = useCallback((faction, change) => {
    setNarrativeState(prev => ({
      ...prev,
      faction_standings: {
        ...prev.faction_standings || {},
        [faction]: Math.max(-100, Math.min(100, (prev.faction_standings?.[faction] || 0) + change))
      }
    }));
  }, []);

  /**
   * Start addiction progression
   */
  const startAddictionProgression = useCallback((substance) => {
    setNarrativeState(prev => ({
      ...prev,
      addiction_progression: {
        ...prev.addiction_progression,
        stage: 'experimental',
        weeks_clean: 0,
        relapse_risk: 0.15,
        support_factors: []
      },
      ongoing_storylines: [
        ...prev.ongoing_storylines,
        {
          type: 'addiction_spiral',
          substance,
          stage: 'experimental',
          start_week: gameState.week,
          last_use_week: gameState.week
        }
      ]
    }));
    
    updatePsychologicalState({
      addiction_risk: 20,
      stress_level: -10 // Immediate relief from substance use
    });
  }, [gameState.week, updatePsychologicalState]);

  /**
   * Escalate addiction stage
   */
  const escalateAddiction = useCallback((stages = 1) => {
    const stageProgression = ['experimental', 'regular_use', 'dependent', 'addicted'];
    
    setNarrativeState(prev => {
      const storyline = prev.ongoing_storylines.find(s => s.type === 'addiction_spiral');
      if (!storyline) return prev;
      
      const currentIndex = stageProgression.indexOf(storyline.stage);
      const newIndex = Math.min(currentIndex + stages, stageProgression.length - 1);
      const newStage = stageProgression[newIndex];
      
      return {
        ...prev,
        addiction_progression: {
          ...prev.addiction_progression,
          stage: newStage,
          relapse_risk: Math.min(1, 0.15 + newIndex * 0.25)
        },
        ongoing_storylines: prev.ongoing_storylines.map(s =>
          s.type === 'addiction_spiral'
            ? { ...s, stage: newStage, last_use_week: gameState.week }
            : s
        )
      };
    });
    
    // Effects scale with addiction stage
    const effects = {
      experimental: { creativity: 10, addiction_risk: 20 },
      regular_use: { creativity: 15, addiction_risk: 30, health: -10 },
      dependent: { creativity: 10, health: -30, reliability: -20, addiction_risk: 40 },
      addicted: { creativity: -10, health: -50, reliability: -40, addiction_risk: 50 }
    };
    
    const currentStageIndex = stageProgression.indexOf(stageProgression[newIndex]);
    updatePsychologicalState(effects[stageProgression[Math.min(currentStageIndex + stages, 3)]]);
  }, [gameState.week, updatePsychologicalState]);

  /**
   * Start corruption path
   */
  const startCorruptionPath = useCallback((dealType) => {
    setNarrativeState(prev => ({
      ...prev,
      corruption_progression: {
        ...prev.corruption_progression,
        stage: 'first_compromise',
        deals_made: [{ type: dealType, week: gameState.week }]
      },
      ongoing_storylines: [
        ...prev.ongoing_storylines,
        {
          type: 'corruption_spiral',
          stage: 'first_compromise',
          start_week: gameState.week,
          deal_count: 1
        }
      ]
    }));
    
    updatePsychologicalState({
      moral_integrity: -20,
      stress_level: 15, // Guilt and anxiety
      paranoia: 10
    });
  }, [gameState.week, updatePsychologicalState]);

  /**
   * Escalate corruption
   */
  const escalateCorruption = useCallback((newDealType) => {
    setNarrativeState(prev => {
      const stageProgression = ['first_compromise', 'moral_flexibility', 'active_corruption', 'deep_involvement'];
      const current = prev.corruption_progression;
      const currentIndex = stageProgression.indexOf(current.stage);
      const newIndex = Math.min(currentIndex + 1, stageProgression.length - 1);
      const newStage = stageProgression[newIndex];
      
      return {
        ...prev,
        corruption_progression: {
          ...prev.corruption_progression,
          stage: newStage,
          deals_made: [...current.deals_made, { type: newDealType, week: gameState.week }]
        }
      };
    });
    
    const effects = {
      first_compromise: { moral_integrity: -20 },
      moral_flexibility: { moral_integrity: -25, paranoia: 15 },
      active_corruption: { moral_integrity: -30, paranoia: 25 },
      deep_involvement: { moral_integrity: -40, paranoia: 35 }
    };
    
    updatePsychologicalState(effects[stageProgression[newIndex]] || {});
  }, [gameState.week, updatePsychologicalState]);

  /**
   * Trigger psychological crisis
   */
  const triggerPsychologicalCrisis = useCallback((crisisType) => {
    const crisisEffects = {
      paranoia: { paranoia: 40, stress_level: 35 },
      depression: { depression: 50, stress_level: 30, addiction_risk: 15 },
      psychosis: { paranoia: 50, depression: 40, stress_level: 50 },
      breakdown: { stress_level: 100, depression: 60, paranoia: 30 }
    };
    
    const effects = crisisEffects[crisisType] || { stress_level: 30 };
    updatePsychologicalState(effects);
    
    addTrauma(`psychological_${crisisType}`, `Suffered from ${crisisType}`, 'severe');
  }, [updatePsychologicalState, addTrauma]);

  /**
   * Track dialogue choice
   */
  const recordDialogueChoice = useCallback((eventId, choiceId, choiceText, consequences) => {
    const entry = {
      id: `dialogue_${Date.now()}`,
      week: gameState.week,
      eventId,
      choiceId,
      choiceText,
      consequences,
      timestamp: new Date().toISOString()
    };
    
    setDialogueHistory(prev => [...prev, entry]);
  }, [gameState.week]);

  /**
   * Get current stage of an active narrative arc
   * @param {string} arcType - Arc type identifier
   * @returns {string|null} Current stage or null if arc not active
   */
  const getCurrentArcStage = useCallback((arcType) => {
    const storyline = narrativeState.ongoing_storylines?.find(s => s.type === arcType);
    return storyline?.stage || null;
  }, [narrativeState]);

  /**
   * Progress an arc to the next stage
   * @param {string} arcType - Arc type identifier
   * @param {string} newStage - New stage to progress to
   */
  const progressArc = useCallback((arcType, newStage) => {
    setNarrativeState(prev => {
      const updated = { ...prev };
      const storylines = updated.ongoing_storylines || [];
      
      const existingIndex = storylines.findIndex(s => s.type === arcType);
      
      if (existingIndex >= 0) {
        // Update existing arc
        storylines[existingIndex] = {
          ...storylines[existingIndex],
          stage: newStage,
          last_progress_week: gameState.week
        };
      } else {
        // Start new arc
        storylines.push({
          type: arcType,
          stage: newStage,
          start_week: gameState.week,
          last_progress_week: gameState.week
        });
      }
      
      return {
        ...updated,
        ongoing_storylines: storylines
      };
    });
  }, [gameState.week]);

  /**
   * Get consequences preview
   */
  const getConsequencesPreview = useCallback((choice) => {
    const immediateEffects = choice.immediateEffects || {};
    const longTermEffects = choice.longTermEffects || {};
    
    return {
      immediate: immediateEffects,
      shortTerm: longTermEffects.shortTerm || {},
      longTerm: longTermEffects.longTerm || {},
      psychological: choice.psychologicalEffects || {}
    };
  }, []);

  /**
   * Check if choice triggers trauma
   */
  const checkTraumaTrigger = useCallback((choice, context) => {
    if (choice.traumaRisk) {
      const roll = Math.random();
      if (roll < choice.traumaRisk.probability) {
        addTrauma(
          choice.traumaRisk.type,
          choice.traumaRisk.description,
          choice.traumaRisk.severity
        );
        return true;
      }
    }
    return false;
  }, [addTrauma]);

  // Return public API
  return {
    // State
    psychologicalState,
    narrativeState,
    dialogueHistory,
    
    // Psychological management
    updatePsychologicalState,
    addTrauma,
    addCopingMechanism,
    triggerPsychologicalCrisis,
    
    // Narrative tracking
    detectPlayerArchetype,
    updateFactionReputation,
    recordDialogueChoice,
    
    // Storyline progression
    startAddictionProgression,
    escalateAddiction,
    startCorruptionPath,
    escalateCorruption,
    
    // Arc management
    getCurrentArcStage,
    progressArc,
    
    // Utilities
    getConsequencesPreview,
    checkTraumaTrigger
  };
};

export default useEnhancedDialogue;
