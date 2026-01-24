/**
 * narrativeArcs.js - Multi-part storyline definitions
 * 
 * Defines narrative arcs that span multiple weeks, with stages that unlock
 * specific events. Arcs track player progression through major storylines.
 */

export const NARRATIVE_ARCS = {
  addiction_spiral: {
    id: 'addiction_spiral',
    name: 'Addiction Spiral',
    stages: [
      'first_exposure',
      'regular_use',
      'dependency_development',
      'rock_bottom',
      'intervention_or_death',
      'recovery_attempt',
      'relapse_or_sobriety'
    ],
    stage_events: {
      first_exposure: ['first_hit', 'peer_pressure_drugs', 'party_drugs'],
      regular_use: ['hiding_usage', 'performance_enhancement', 'tolerance_building'],
      dependency_development: ['withdrawal_symptoms', 'stealing_for_drugs', 'relationship_damage'],
      rock_bottom: ['rock_bottom', 'overdose', 'arrest', 'band_ultimatum', 'health_crisis'],
      intervention_or_death: ['family_intervention', 'band_intervention', 'fatal_overdose'],
      recovery_attempt: ['recovery_attempt', 'rehab_entry', 'cold_turkey', 'therapy_start'],
      relapse_or_sobriety: ['sobriety_celebration', 'relapse_trigger', 'sponsor_relationship']
    },
    triggers: {
      start: {
        conditions: {
          addiction_risk: { min: 20 },
          stress_level: { min: 40 }
        },
        probability: 0.3
      }
    }
  },
  
  corruption_path: {
    id: 'corruption_path',
    name: 'Corruption Path',
    stages: [
      'first_compromise',
      'moral_flexibility',
      'active_corruption',
      'deep_involvement',
      'exposure_or_kingpin'
    ],
    stage_events: {
      first_compromise: ['the_offer', 'small_bribe', 'favor_for_friend', 'white_lie'],
      moral_flexibility: ['the_contract', 'bigger_lies', 'looking_other_way', 'cutting_corners'],
      active_corruption: ['payola_scheme', 'taking_bribes', 'illegal_deals', 'blackmail'],
      deep_involvement: ['the_deal', 'criminal_enterprise', 'violence_orders', 'witness_intimidation'],
      exposure_or_kingpin: ['investigation', 'media_exposure', 'criminal_empire']
    },
    triggers: {
      start: {
        conditions: {
          moral_integrity: { max: 80 },
          fame: { min: 30 }
        },
        probability: 0.25
      }
    }
  },
  
  fame_corruption: {
    id: 'fame_corruption',
    name: 'Fame Corruption',
    stages: [
      'ego_inflation',
      'reality_disconnect',
      'complete_narcissism'
    ],
    stage_events: {
      ego_inflation: ['entitlement_events', 'diva_behavior', 'relationship_strain'],
      reality_disconnect: ['isolation_events', 'poor_judgment', 'burned_bridges'],
      complete_narcissism: ['career_destruction', 'loneliness', 'redemption_opportunity']
    },
    triggers: {
      start: {
        conditions: {
          fame: { min: 150 },
          moral_integrity: { max: 60 }
        },
        probability: 0.4
      }
    }
  },
  
  stalker_obsession: {
    id: 'stalker_obsession',
    name: 'Stalker Obsession',
    stages: [
      'first_contact',
      'escalating_interest',
      'dangerous_behavior',
      'crisis_point',
      'resolution'
    ],
    stage_events: {
      first_contact: ['fan_letter', 'backstage_encounter', 'gift_received'],
      escalating_interest: ['repeated_contact', 'personal_details_known', 'unwanted_presence'],
      dangerous_behavior: ['the_shrine', 'stalking_incident', 'threats_made'],
      crisis_point: ['confinement', 'violence', 'authorities_involved'],
      resolution: ['arrest', 'restraining_order', 'tragic_end', 'recovery']
    },
    triggers: {
      start: {
        conditions: {
          fame: { min: 75 }
        },
        probability: 0.2
      }
    }
  }
};

/**
 * Get the current stage of an active arc
 * @param {string} arcId - Arc identifier
 * @param {Object} narrativeState - Current narrative state
 * @returns {string|null} Current stage or null if arc not active
 */
export const getCurrentArcStage = (arcId, narrativeState) => {
  const arc = NARRATIVE_ARCS[arcId];
  if (!arc) return null;
  
  const activeArc = narrativeState.ongoing_storylines?.find(s => s.type === arcId);
  if (!activeArc) return null;
  
  return activeArc.stage || arc.stages[0];
};

/**
 * Get available events for an arc's current stage
 * @param {string} arcId - Arc identifier
 * @param {string} stage - Current stage
 * @returns {Array<string>} Event IDs available at this stage
 */
export const getArcStageEvents = (arcId, stage) => {
  const arc = NARRATIVE_ARCS[arcId];
  if (!arc) return [];
  
  return arc.stage_events[stage] || [];
};

/**
 * Get the next stage in an arc
 * @param {string} arcId - Arc identifier
 * @param {string} currentStage - Current stage
 * @returns {string|null} Next stage or null if at end
 */
export const getNextArcStage = (arcId, currentStage) => {
  const arc = NARRATIVE_ARCS[arcId];
  if (!arc) return null;
  
  const currentIndex = arc.stages.indexOf(currentStage);
  if (currentIndex === -1 || currentIndex === arc.stages.length - 1) {
    return null;
  }
  
  return arc.stages[currentIndex + 1];
};

/**
 * Check if an arc should start based on game state
 * @param {string} arcId - Arc identifier
 * @param {Object} gameState - Current game state
 * @param {Object} psychologicalState - Psychological state
 * @returns {boolean} True if arc should start
 */
export const shouldStartArc = (arcId, gameState, psychologicalState) => {
  const arc = NARRATIVE_ARCS[arcId];
  if (!arc || !arc.triggers?.start) return false;
  
  const trigger = arc.triggers.start;
  const conditions = trigger.conditions || {};
  
  // Check all conditions
  for (const [key, condition] of Object.entries(conditions)) {
    const value = psychologicalState[key] ?? gameState[key] ?? 0;
    
    if (condition.min !== undefined && value < condition.min) {
      return false;
    }
    if (condition.max !== undefined && value > condition.max) {
      return false;
    }
  }
  
  // Check probability
  if (trigger.probability !== undefined) {
    return Math.random() < trigger.probability;
  }
  
  return true;
};

/**
 * Get all active arcs from narrative state
 * @param {Object} narrativeState - Current narrative state
 * @returns {Array<Object>} Active arc objects
 */
export const getActiveArcs = (narrativeState) => {
  if (!narrativeState?.ongoing_storylines) return [];
  
  return narrativeState.ongoing_storylines
    .filter(storyline => NARRATIVE_ARCS[storyline.type])
    .map(storyline => ({
      ...storyline,
      arc: NARRATIVE_ARCS[storyline.type]
    }));
};

/**
 * Check if an event ID belongs to an arc stage
 * @param {string} eventId - Event identifier
 * @param {string} arcId - Arc identifier
 * @param {string} stage - Stage to check
 * @returns {boolean} True if event belongs to this arc stage
 */
export const isArcStageEvent = (eventId, arcId, stage) => {
  const arc = NARRATIVE_ARCS[arcId];
  if (!arc) return false;
  
  const stageEvents = arc.stage_events[stage] || [];
  return stageEvents.some(e => eventId.includes(e) || e.includes(eventId.split('_')[0]));
};

export default NARRATIVE_ARCS;
