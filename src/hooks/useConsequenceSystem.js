import { useState, useCallback, useEffect } from 'react';

/**
 * useConsequenceSystem Hook
 * 
 * Manages all consequence tracking for Phase 2:
 * - Active consequences (currently escalating)
 * - Dormant consequences (can resurface)
 * - Psychological evolution (corruption, addiction, mental health)
 * - Faction standings (affects event generation and dialogue options)
 * 
 * Works alongside useGameState but handles narrative consequences
 */

export const useConsequenceSystem = (gameState) => {
  // Initialize consequence state
  const [consequences, setConsequences] = useState(() => {
    try {
      const saved = localStorage.getItem('gigmaster_consequences');
      return saved ? JSON.parse(saved) : { active: [], dormant: [] };
    } catch {
      return { active: [], dormant: [] };
    }
  });

  const [factions, setFactions] = useState(() => {
    try {
      const saved = localStorage.getItem('gigmaster_factions');
      return saved ? JSON.parse(saved) : initializeFactions();
    } catch {
      return initializeFactions();
    }
  });

  const [psychologicalEvolution, setPsychologicalEvolution] = useState(() => {
    try {
      const saved = localStorage.getItem('gigmaster_psychology');
      return saved ? JSON.parse(saved) : initializePsychology();
    } catch {
      return initializePsychology();
    }
  });

  // Initialize default faction standings
  function initializeFactions() {
    return {
      underground_scene: {
        name: 'Underground Scene',
        currentStanding: 50,
        values: ['authenticity', 'anti_establishment', 'artistic_integrity'],
        maxStanding: 100,
        minStanding: -100,
        decayPerWeek: 1,
        lastActivityWeek: 0
      },
      corporate_industry: {
        name: 'Corporate Music Industry',
        currentStanding: 50,
        values: ['profitability', 'marketability', 'brand_safety'],
        maxStanding: 100,
        minStanding: -100,
        decayPerWeek: 1,
        lastActivityWeek: 0
      },
      criminal_underworld: {
        name: 'Criminal Networks',
        currentStanding: 0,
        values: ['loyalty', 'silence', 'mutual_benefit'],
        maxStanding: 100,
        minStanding: 0,
        decayPerWeek: 0, // Criminal contacts don't forget
        lastActivityWeek: null
      },
      law_enforcement: {
        name: 'Law Enforcement',
        currentStanding: 50,
        values: ['law_and_order', 'cooperation', 'public_safety'],
        maxStanding: 100,
        minStanding: -100,
        decayPerWeek: 0.5,
        lastActivityWeek: 0
      }
    };
  }

  // Initialize psychological evolution tracking
  function initializePsychology() {
    return {
      corruptionPath: {
        currentLevel: 0,
        stage: null,
        milestones: [
          { threshold: 25, stage: 'minor_temptation', unlocks: ['minor_criminal_offers'] },
          { threshold: 50, stage: 'moral_compromise', unlocks: ['major_criminal_offers'] },
          { threshold: 75, stage: 'no_turning_back', unlocks: ['criminal_empire_options'] },
          { threshold: 100, stage: 'fully_corrupted', unlocks: ['no_redemption_paths'] }
        ],
        evolutionRate: 1.5,
        recoveryAttempts: 0
      },
      addictionPath: {
        stages: ['clean', 'experimentation', 'regular_use', 'dependency', 'addiction', 'rock_bottom'],
        currentStage: 'clean',
        severity: 0,
        escalationTriggers: ['stress_events', 'peer_pressure', 'creative_blocks'],
        recoveryAttempts: 0,
        relapseProbability: 0.8
      },
      mentalHealth: {
        stressLevel: 30,
        paranoia: 0,
        isolation: 0,
        depression: 0,
        hopelessness: 0
      }
    };
  }

  /**
   * Add a new active consequence
   */
  const addActiveConsequence = useCallback((consequence) => {
    const newConsequence = {
      id: consequence.id || `consequence_${Date.now()}`,
      triggerChoice: consequence.triggerChoice,
      triggerWeek: gameState.week,
      currentStage: consequence.currentStage || 'initial',
      nextEscalation: gameState.week + (consequence.escalationDelay || 8),
      escalationEvents: consequence.escalationEvents || [],
      recoveryPossible: consequence.recoveryPossible !== false,
      recoveryDifficulty: consequence.recoveryDifficulty || 0.3,
      severity: consequence.severity || 'medium',
      tags: consequence.tags || [],
      metadata: consequence.metadata || {}
    };

    setConsequences(prev => ({
      ...prev,
      active: [...prev.active, newConsequence]
    }));

    return newConsequence;
  }, [gameState.week]);

  /**
   * Add a dormant consequence that can resurface later
   */
  const addDormantConsequence = useCallback((consequence) => {
    const dormant = {
      id: consequence.id || `dormant_${Date.now()}`,
      triggerChoice: consequence.triggerChoice,
      triggerWeek: gameState.week,
      resurfaceConditions: consequence.resurfaceConditions || {},
      resurfaceEvents: consequence.resurfaceEvents || [],
      resurrectProbability: consequence.resurrectProbability || 0.5,
      timesResurfaced: 0,
      metadata: consequence.metadata || {}
    };

    setConsequences(prev => ({
      ...prev,
      dormant: [...prev.dormant, dormant]
    }));

    return dormant;
  }, [gameState.week]);

  /**
   * Check and escalate active consequences
   */
  const processEscalations = useCallback(() => {
    if (!gameState) return [];

    const escalatedConsequences = [];

    setConsequences(prev => {
      const updated = { ...prev };
      
      updated.active = updated.active.map(consequence => {
        if (gameState.week >= consequence.nextEscalation) {
          // Escalate this consequence
          const nextStage = getNextStage(consequence.currentStage);
          const escalationEvent = consequence.escalationEvents[0];
          
          escalatedConsequences.push({
            consequenceId: consequence.id,
            event: escalationEvent,
            stage: nextStage,
            intensity: 'escalated'
          });

          return {
            ...consequence,
            currentStage: nextStage,
            nextEscalation: gameState.week + 8,
            recoveryPossible: nextStage !== 'point_of_no_return' ? consequence.recoveryPossible : false
          };
        }
        return consequence;
      });

      return updated;
    });

    return escalatedConsequences;
  }, [gameState]);

  /**
   * Check for dormant consequences that should resurface
   */
  const checkResurfacing = useCallback((eventType = null) => {
    if (!gameState) return [];

    const resurfacedConsequences = [];

    setConsequences(prev => {
      const updated = { ...prev };

      updated.dormant = updated.dormant
        .map(dormant => {
          const conditions = dormant.resurfaceConditions;
          let shouldResurface = false;

          // Check fame thresholds
          if (conditions.fameLevels) {
            shouldResurface = conditions.fameLevels.some(
              threshold => Math.abs(gameState.fame - threshold) < 5
            );
          }

          // Check event type match
          if (conditions.eventTypes && eventType) {
            shouldResurface = shouldResurface || conditions.eventTypes.includes(eventType);
          }

          // Probability check
          if (shouldResurface && Math.random() > (dormant.resurrectProbability || 0.5)) {
            shouldResurface = false;
          }

          if (shouldResurface) {
            const event = dormant.resurfaceEvents[Math.floor(Math.random() * dormant.resurfaceEvents.length)];
            resurfacedConsequences.push({
              consequenceId: dormant.id,
              event: event,
              timesResurfaced: dormant.timesResurfaced + 1
            });

            return {
              ...dormant,
              timesResurfaced: dormant.timesResurfaced + 1,
              nextResurfaceWindow: gameState.week + 20 // Dormant consequence won't return for 20 weeks
            };
          }

          return dormant;
        })
        // Move activated dormant consequences to active
        .filter(dormant => {
          if (resurfacedConsequences.some(r => r.consequenceId === dormant.id)) {
            // Move to active
            updated.active.push({
              ...dormant,
              currentStage: 'resurfaced',
              nextEscalation: gameState.week + 5
            });
            return false;
          }
          return true;
        });

      return updated;
    });

    return resurfacedConsequences;
  }, [gameState]);

  /**
   * Update faction standings based on a choice
   */
  const updateFactionStandings = useCallback((choice) => {
    if (!choice.factionEffects) return;

    setFactions(prev => {
      const updated = { ...prev };

      Object.entries(choice.factionEffects).forEach(([factionId, change]) => {
        if (updated[factionId]) {
          const faction = updated[factionId];
          faction.currentStanding = Math.max(
            faction.minStanding,
            Math.min(faction.maxStanding, faction.currentStanding + change)
          );
          faction.lastActivityWeek = gameState.week;
        }
      });

      // Persist to localStorage
      localStorage.setItem('gigmaster_factions', JSON.stringify(updated));
      return updated;
    });
  }, [gameState.week]);

  /**
   * Update psychological evolution
   */
  const updatePsychology = useCallback((path, value, amount) => {
    setPsychologicalEvolution(prev => {
      const updated = JSON.parse(JSON.stringify(prev));

      if (path === 'corruption') {
        updated.corruptionPath.currentLevel = Math.min(
          100,
          updated.corruptionPath.currentLevel + amount
        );
        // Update stage based on thresholds
        const milestone = updated.corruptionPath.milestones.find(
          m => m.threshold <= updated.corruptionPath.currentLevel
        );
        updated.corruptionPath.stage = milestone?.stage || null;
      } else if (path === 'addiction') {
        const stages = updated.addictionPath.stages;
        const currentIndex = stages.indexOf(updated.addictionPath.currentStage);
        if (amount > 0 && currentIndex < stages.length - 1) {
          updated.addictionPath.currentStage = stages[currentIndex + 1];
        } else if (amount < 0 && currentIndex > 0) {
          updated.addictionPath.currentStage = stages[Math.max(0, currentIndex + amount)];
        }
      } else if (path === 'mentalHealth') {
        if (updated.mentalHealth[value] !== undefined) {
          updated.mentalHealth[value] = Math.max(0, Math.min(100, updated.mentalHealth[value] + amount));
        }
      }

      localStorage.setItem('gigmaster_psychology', JSON.stringify(updated));
      return updated;
    });
  }, []);

  /**
   * Get all faction-influenced events available
   */
  const getFactionInfluencedEvents = useCallback(() => {
    const availableEvents = [];

    Object.entries(factions).forEach(([factionId, faction]) => {
      if (faction.currentStanding > 70) {
        // High standing events
        availableEvents.push({
          type: 'faction_benefit',
          faction: factionId,
          factionName: faction.name,
          intensity: 'positive',
          probability: 0.7
        });
      } else if (faction.currentStanding < -70) {
        // Low standing events
        availableEvents.push({
          type: 'faction_threat',
          faction: factionId,
          factionName: faction.name,
          intensity: 'negative',
          probability: 0.8
        });
      }
    });

    return availableEvents;
  }, [factions]);

  /**
   * Clear old consequences (for save file cleanup)
   */
  const clearOldConsequences = useCallback(() => {
    setConsequences(prev => ({
      ...prev,
      active: prev.active.filter(c => gameState.week - c.triggerWeek < 100),
      dormant: prev.dormant.filter(c => gameState.week - c.triggerWeek < 150)
    }));
  }, [gameState.week]);

  /**
   * Apply faction decay over time (for inactive factions)
   */
  const applyFactionDecay = useCallback(() => {
    setFactions(prev => {
      const updated = { ...prev };

      Object.entries(updated).forEach(([factionId, faction]) => {
        if (faction.lastActivityWeek !== null) {
          const weeksInactive = gameState.week - faction.lastActivityWeek;
          if (weeksInactive > 0) {
            const decay = faction.decayPerWeek * weeksInactive;
            faction.currentStanding = Math.max(
              faction.minStanding,
              faction.currentStanding - decay
            );
          }
        }
      });

      return updated;
    });
  }, [gameState.week]);

  /**
   * Process weekly consequence escalation
   * Called each game week to check and escalate active consequences
   * Returns escalations and resurfaced consequences for event queueing
   */
  const processWeeklyConsequences = useCallback(() => {
    const escalations = [];
    const resurfaced = [];
    const currentWeek = gameState.week;

    // Process active consequences
    setConsequences(prev => {
      const updated = { ...prev, active: [], dormant: prev.dormant || [] };

      prev.active.forEach(consequence => {
        // Check if should escalate
        if (currentWeek >= consequence.nextEscalation) {
          // Mark for escalation event
          escalations.push({
            consequenceId: consequence.id,
            previousStage: consequence.currentStage,
            newStage: getNextStage(consequence.currentStage),
            description: consequence.escalationEvents[0]?.description || 'Consequence escalated',
            severity: consequence.severity
          });

          // Update consequence stage
          const nextStage = getNextStage(consequence.currentStage);
          const escalationDelay = consequence.escalationEvents.length > 0 
            ? consequence.escalationEvents[0].escalationDelay 
            : 8;

          const updatedConsequence = {
            ...consequence,
            currentStage: nextStage,
            nextEscalation: currentWeek + escalationDelay
          };

          // If fully escalated or resolved, move to dormant
          if (nextStage === 'resolved' || nextStage === 'critical') {
            updated.dormant.push(updatedConsequence);
          } else {
            updated.active.push(updatedConsequence);
          }
        } else {
          // Keep active, not escalating yet
          updated.active.push(consequence);
        }
      });

      return updated;
    });

    // Check for resurfacing dormant consequences
    setConsequences(prev => {
      const updated = { ...prev, active: prev.active || [], dormant: [] };

      prev.dormant.forEach(dormant => {
        // Random 5% chance per week for dormant consequences to resurface
        if (dormant.resurfaceProbability && Math.random() < dormant.resurfaceProbability) {
          resurfaced.push({
            consequenceId: dormant.id,
            description: dormant.description || 'A past consequence returns to haunt you',
            severity: dormant.severity
          });

          // Move back to active
          updated.active.push({
            ...dormant,
            currentStage: 'resurfaced',
            nextEscalation: currentWeek + 6
          });
        } else {
          // Keep dormant
          updated.dormant.push(dormant);
        }
      });

      return updated;
    });

    // Apply faction decay each week
    applyFactionDecay();

    return { escalations, resurfaced };
  }, [gameState.week, applyFactionDecay]);

  // Auto-save consequence data when it changes
  useEffect(() => {
    localStorage.setItem('gigmaster_consequences', JSON.stringify(consequences));
  }, [consequences]);

  // Auto-save faction data when it changes
  useEffect(() => {
    localStorage.setItem('gigmaster_factions', JSON.stringify(factions));
  }, [factions]);

  // Auto-save psychology data when it changes
  useEffect(() => {
    localStorage.setItem('gigmaster_psychology', JSON.stringify(psychologicalEvolution));
  }, [psychologicalEvolution]);

  return {
    // State
    consequences,
    factions,
    psychologicalEvolution,

    // Active consequence management
    addActiveConsequence,
    addDormantConsequence,
    processEscalations,
    checkResurfacing,
    processWeeklyConsequences,

    // Faction management
    updateFactionStandings,
    getFactionInfluencedEvents,
    applyFactionDecay,

    // Psychology
    updatePsychology,

    // Utilities
    clearOldConsequences,

    // Data access
    getActiveConsequences: () => consequences.active,
    getDormantConsequences: () => consequences.dormant,
    getFactionInfluencedEvents,
    getFactionStanding: (factionId) => factions[factionId]?.currentStanding || 0,
    getFactionStatus: (factionId) => {
      const standing = factions[factionId]?.currentStanding || 0;
      if (standing > 70) return 'ally';
      if (standing > 30) return 'neutral';
      if (standing > -30) return 'wary';
      if (standing > -70) return 'hostile';
      return 'enemy';
    }
  };
};

// Helper function to get next stage
function getNextStage(currentStage) {
  const stages = [
    'initial',
    'developing',
    'escalating',
    'critical',
    'point_of_no_return',
    'irreversible'
  ];
  const currentIndex = stages.indexOf(currentStage);
  return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : currentStage;
}
