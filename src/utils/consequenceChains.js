/**
 * consequenceChains.js - Consequence chain definitions
 * 
 * Defines multi-stage consequence chains that progress over time
 * and unlock continuation events.
 */

export const CONSEQUENCE_CHAINS = {
  addiction_spiral: {
    id: 'addiction_spiral',
    name: 'Addiction Spiral',
    stages: [
      {
        id: 'experimentation',
        duration: { min: 1, max: 3 }, // weeks
        effects: {
          addiction_risk: 10,
          creativity: 5,
          stress: -5
        },
        triggers: ['substance_use'],
        continuation_events: ['tolerance_building', 'hiding_usage']
      },
      {
        id: 'regular_use',
        duration: { min: 2, max: 5 },
        effects: {
          addiction_risk: 20,
          creativity: 10,
          health: -5,
          stress: -10
        },
        triggers: ['continued_use', 'tolerance_increase'],
        continuation_events: ['dependency_warning', 'relationship_strain']
      },
      {
        id: 'dependency',
        duration: { min: 3, max: 8 },
        effects: {
          addiction_risk: 40,
          health: -15,
          stress: 20,
          depression: 10
        },
        triggers: ['withdrawal_symptoms', 'failed_attempts_to_quit'],
        continuation_events: ['rock_bottom', 'intervention_opportunity']
      },
      {
        id: 'crisis',
        duration: { min: 1, max: 4 },
        effects: {
          addiction_risk: 60,
          health: -30,
          stress: 40,
          depression: 25
        },
        triggers: ['overdose_scare', 'arrest', 'health_crisis'],
        continuation_events: ['recovery_attempt', 'fatal_outcome']
      }
    ]
  },
  
  corruption_path: {
    id: 'corruption_path',
    name: 'Corruption Path',
    stages: [
      {
        id: 'first_compromise',
        duration: { min: 1, max: 2 },
        effects: {
          moral_integrity: -10,
          money: 5000,
          paranoia: 5
        },
        triggers: ['accept_bribe', 'small_corruption'],
        continuation_events: ['bigger_offer', 'guilt_opportunity']
      },
      {
        id: 'moral_flexibility',
        duration: { min: 2, max: 4 },
        effects: {
          moral_integrity: -20,
          money: 15000,
          paranoia: 15
        },
        triggers: ['repeated_corruption', 'escalating_deals'],
        continuation_events: ['criminal_connection', 'redemption_opportunity']
      },
      {
        id: 'active_corruption',
        duration: { min: 3, max: 6 },
        effects: {
          moral_integrity: -35,
          money: 50000,
          paranoia: 30,
          stress: 20
        },
        triggers: ['major_crime', 'criminal_involvement'],
        continuation_events: ['deep_involvement', 'investigation_risk']
      },
      {
        id: 'deep_involvement',
        duration: { min: 4, max: 10 },
        effects: {
          moral_integrity: -50,
          money: 200000,
          paranoia: 50,
          stress: 40
        },
        triggers: ['criminal_enterprise', 'violence_orders'],
        continuation_events: ['exposure', 'criminal_empire']
      }
    ]
  },
  
  fame_corruption: {
    id: 'fame_corruption',
    name: 'Fame Corruption',
    stages: [
      {
        id: 'ego_inflation',
        duration: { min: 2, max: 4 },
        effects: {
          stress: -10,
          fame: 20
        },
        triggers: ['success', 'media_attention'],
        continuation_events: ['entitlement_events', 'diva_behavior']
      },
      {
        id: 'reality_disconnect',
        duration: { min: 3, max: 6 },
        effects: {
          stress: 15,
          depression: 10,
          paranoia: 20
        },
        triggers: ['isolation', 'poor_judgment'],
        continuation_events: ['burned_bridges', 'loneliness_events']
      },
      {
        id: 'complete_narcissism',
        duration: { min: 4, max: 12 },
        effects: {
          stress: 30,
          depression: 25,
          paranoia: 35
        },
        triggers: ['career_destruction', 'relationship_loss'],
        continuation_events: ['redemption_opportunity', 'rock_bottom']
      }
    ]
  },
  
  stalker_obsession: {
    id: 'stalker_obsession',
    name: 'Stalker Obsession',
    stages: [
      {
        id: 'first_contact',
        duration: { min: 1, max: 2 },
        effects: {
          paranoia: 5,
          stress: 5
        },
        triggers: ['fan_letter', 'backstage_encounter'],
        continuation_events: ['repeated_contact', 'escalating_interest']
      },
      {
        id: 'escalating_interest',
        duration: { min: 2, max: 4 },
        effects: {
          paranoia: 15,
          stress: 15
        },
        triggers: ['personal_details_known', 'unwanted_presence'],
        continuation_events: ['dangerous_behavior', 'threats_made']
      },
      {
        id: 'dangerous_behavior',
        duration: { min: 2, max: 5 },
        effects: {
          paranoia: 30,
          stress: 30,
          depression: 15
        },
        triggers: ['stalking_incident', 'the_shrine'],
        continuation_events: ['crisis_point', 'violence_risk']
      },
      {
        id: 'crisis_point',
        duration: { min: 1, max: 3 },
        effects: {
          paranoia: 50,
          stress: 50,
          depression: 30
        },
        triggers: ['confinement', 'violence'],
        continuation_events: ['resolution', 'tragic_end']
      }
    ]
  }
};

/**
 * Get current stage of a consequence chain
 * @param {string} chainId - Chain identifier
 * @param {Object} consequenceState - Current consequence state
 * @returns {Object|null} Current stage or null
 */
export const getChainStage = (chainId, consequenceState) => {
  const chain = CONSEQUENCE_CHAINS[chainId];
  if (!chain) return null;
  
  const activeChain = consequenceState.active_chains?.find(c => c.chainId === chainId);
  if (!activeChain) return null;
  
  return chain.stages.find(s => s.id === activeChain.currentStage) || chain.stages[0];
};

/**
 * Progress a consequence chain to the next stage
 * @param {string} chainId - Chain identifier
 * @param {Object} consequenceState - Current consequence state
 * @param {string} trigger - Trigger that caused progression
 * @returns {Object} Updated consequence state
 */
export const progressChain = (chainId, trigger, consequenceState) => {
  const chain = CONSEQUENCE_CHAINS[chainId];
  if (!chain) return consequenceState;
  
  const activeChains = consequenceState.active_chains || [];
  const existingChain = activeChains.find(c => c.chainId === chainId);
  
  let updatedChain;
  
  if (existingChain) {
    const currentStageIndex = chain.stages.findIndex(s => s.id === existingChain.currentStage);
    const nextStageIndex = currentStageIndex + 1;
    
    if (nextStageIndex < chain.stages.length) {
      const nextStage = chain.stages[nextStageIndex];
      
      // Check if trigger matches
      if (nextStage.triggers.includes(trigger)) {
        updatedChain = {
          ...existingChain,
          currentStage: nextStage.id,
          stageStartWeek: consequenceState.currentWeek || 0,
          triggers: [...(existingChain.triggers || []), trigger]
        };
      } else {
        updatedChain = existingChain;
      }
    } else {
      // Chain complete
      updatedChain = {
        ...existingChain,
        completed: true,
        completedWeek: consequenceState.currentWeek || 0
      };
    }
  } else {
    // Start new chain
    const firstStage = chain.stages[0];
    if (firstStage.triggers.includes(trigger)) {
      updatedChain = {
        chainId,
        currentStage: firstStage.id,
        stageStartWeek: consequenceState.currentWeek || 0,
        triggers: [trigger]
      };
    } else {
      return consequenceState;
    }
  }
  
  // Update active chains
  const updatedActiveChains = existingChain
    ? activeChains.map(c => c.chainId === chainId ? updatedChain : c)
    : [...activeChains, updatedChain];
  
  return {
    ...consequenceState,
    active_chains: updatedActiveChains
  };
};

/**
 * Get continuation events for active chains
 * @param {Object} consequenceState - Current consequence state
 * @returns {Array<string>} Event IDs that should be generated
 */
export const getChainContinuationEvents = (consequenceState) => {
  const continuationEvents = [];
  
  if (!consequenceState.active_chains) return continuationEvents;
  
  consequenceState.active_chains.forEach(activeChain => {
    const chain = CONSEQUENCE_CHAINS[activeChain.chainId];
    if (!chain || activeChain.completed) return;
    
    const currentStage = chain.stages.find(s => s.id === activeChain.currentStage);
    if (currentStage && currentStage.continuation_events) {
      continuationEvents.push(...currentStage.continuation_events);
    }
  });
  
  return continuationEvents;
};

/**
 * Check if chain should auto-progress based on time
 * @param {string} chainId - Chain identifier
 * @param {Object} activeChain - Active chain state
 * @param {number} currentWeek - Current game week
 * @returns {boolean} True if chain should progress
 */
export const shouldAutoProgressChain = (chainId, activeChain, currentWeek) => {
  const chain = CONSEQUENCE_CHAINS[chainId];
  if (!chain || !activeChain) return false;
  
  const currentStage = chain.stages.find(s => s.id === activeChain.currentStage);
  if (!currentStage) return false;
  
  const weeksInStage = currentWeek - (activeChain.stageStartWeek || 0);
  const maxDuration = currentStage.duration.max;
  
  return weeksInStage >= maxDuration;
};

export default CONSEQUENCE_CHAINS;
