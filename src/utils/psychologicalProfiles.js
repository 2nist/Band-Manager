/**
 * psychologicalProfiles.js - Player archetype definitions
 * 
 * Defines psychological profiles that adapt events to player playstyle
 * and detected psychology.
 */

export const PSYCHOLOGICAL_PROFILES = {
  risk_seeker: {
    id: 'risk_seeker',
    name: 'Risk Seeker',
    description: 'Thrives on danger and extreme choices',
    choice_preferences: {
      risky: 30,
      safe: -20,
      extreme: 40
    },
    event_magnets: ['substance_opportunities', 'dangerous_venues', 'criminal_offers', 'violence'],
    psychological_traits: {
      stress_tolerance: 'high',
      addiction_susceptibility: 'high',
      moral_flexibility: 'high'
    },
    event_modifications: {
      increase_risk_appeal: true,
      amplify_consequences: false,
      unlock_extreme_choices: true
    }
  },
  
  people_pleaser: {
    id: 'people_pleaser',
    name: 'People Pleaser',
    description: 'Avoids conflict and seeks harmony',
    choice_preferences: {
      confrontational: -30,
      harmonious: 25,
      diplomatic: 20
    },
    event_magnets: ['manipulation_attempts', 'peer_pressure', 'relationship_drama', 'social_conflicts'],
    psychological_traits: {
      stress_tolerance: 'low',
      addiction_susceptibility: 'medium',
      moral_flexibility: 'medium'
    },
    event_modifications: {
      increase_risk_appeal: false,
      amplify_consequences: true,
      unlock_extreme_choices: false
    }
  },
  
  moral_compass: {
    id: 'moral_compass',
    name: 'Moral Compass',
    description: 'Strong ethical principles guide decisions',
    choice_preferences: {
      ethical: 30,
      corrupt: -40,
      principled: 25
    },
    event_magnets: ['moral_dilemmas', 'ethical_tests', 'corruption_offers', 'justice_opportunities'],
    psychological_traits: {
      stress_tolerance: 'medium',
      addiction_susceptibility: 'low',
      moral_flexibility: 'low'
    },
    event_modifications: {
      increase_risk_appeal: false,
      amplify_consequences: true,
      unlock_extreme_choices: false
    }
  },
  
  pragmatist: {
    id: 'pragmatist',
    name: 'Pragmatist',
    description: 'Makes decisions based on practical outcomes',
    choice_preferences: {
      practical: 25,
      idealistic: -15,
      calculated: 20
    },
    event_magnets: ['business_opportunities', 'financial_decisions', 'strategic_choices', 'resource_management'],
    psychological_traits: {
      stress_tolerance: 'medium',
      addiction_susceptibility: 'medium',
      moral_flexibility: 'high'
    },
    event_modifications: {
      increase_risk_appeal: false,
      amplify_consequences: false,
      unlock_extreme_choices: false
    }
  },
  
  self_destructive: {
    id: 'self_destructive',
    name: 'Self-Destructive',
    description: 'Consistently makes choices that harm themselves',
    choice_preferences: {
      harmful: 35,
      healthy: -25,
      extreme: 30
    },
    event_magnets: ['substance_abuse', 'dangerous_behavior', 'relationship_sabotage', 'career_destruction'],
    psychological_traits: {
      stress_tolerance: 'low',
      addiction_susceptibility: 'very_high',
      moral_flexibility: 'medium'
    },
    event_modifications: {
      increase_risk_appeal: true,
      amplify_consequences: true,
      unlock_extreme_choices: true
    }
  },
  
  survivor: {
    id: 'survivor',
    name: 'Survivor',
    description: 'Adapts and overcomes challenges',
    choice_preferences: {
      adaptive: 25,
      rigid: -20,
      resilient: 20
    },
    event_magnets: ['crisis_events', 'recovery_opportunities', 'adaptation_challenges', 'resilience_tests'],
    psychological_traits: {
      stress_tolerance: 'very_high',
      addiction_susceptibility: 'low',
      moral_flexibility: 'medium'
    },
    event_modifications: {
      increase_risk_appeal: false,
      amplify_consequences: false,
      unlock_extreme_choices: false
    }
  }
};

/**
 * Analyze choice history to detect player archetype
 * @param {Array} choiceHistory - History of player choices
 * @param {Object} psychologicalState - Current psychological state
 * @returns {Object|null} Detected archetype or null
 */
export const detectArchetypeFromChoices = (choiceHistory, psychologicalState) => {
  if (!choiceHistory || choiceHistory.length === 0) return null;
  
  const scores = {};
  
  // Initialize scores
  Object.keys(PSYCHOLOGICAL_PROFILES).forEach(profileId => {
    scores[profileId] = 0;
  });
  
  // Analyze choice patterns
  choiceHistory.forEach(choice => {
    const riskLevel = choice.riskLevel || 'medium';
    const effects = choice.psychologicalEffects || {};
    
    // Risk Seeker indicators
    if (riskLevel === 'extreme' || riskLevel === 'high') {
      scores.risk_seeker += 2;
    }
    if (effects.addiction_risk > 0) {
      scores.risk_seeker += 1;
      scores.self_destructive += 1;
    }
    
    // People Pleaser indicators
    if (choice.text?.toLowerCase().includes('avoid') || 
        choice.text?.toLowerCase().includes('diplomatic') ||
        choice.text?.toLowerCase().includes('harmony')) {
      scores.people_pleaser += 2;
    }
    
    // Moral Compass indicators
    if (effects.moral_integrity > 0) {
      scores.moral_compass += 2;
    }
    if (effects.moral_integrity < 0) {
      scores.moral_compass -= 1;
      scores.pragmatist += 1;
    }
    
    // Pragmatist indicators
    if (choice.immediateEffects?.money > 0 || 
        choice.immediateEffects?.fame > 0) {
      scores.pragmatist += 1;
    }
    
    // Self-Destructive indicators
    if (effects.stress > 20 || effects.depression > 20) {
      scores.self_destructive += 1;
    }
    if (effects.health < 0 || effects.addiction_risk > 30) {
      scores.self_destructive += 2;
    }
    
    // Survivor indicators
    if (choice.text?.toLowerCase().includes('recover') ||
        choice.text?.toLowerCase().includes('adapt') ||
        choice.text?.toLowerCase().includes('overcome')) {
      scores.survivor += 2;
    }
  });
  
  // Factor in psychological state
  if (psychologicalState) {
    if (psychologicalState.stress_level > 80) {
      scores.self_destructive += 2;
    }
    if (psychologicalState.moral_integrity > 70) {
      scores.moral_compass += 2;
    }
    if (psychologicalState.addiction_risk > 60) {
      scores.risk_seeker += 2;
      scores.self_destructive += 2;
    }
    if (psychologicalState.stress_level < 40 && psychologicalState.moral_integrity > 50) {
      scores.survivor += 2;
    }
  }
  
  // Find highest scoring archetype
  let maxScore = -Infinity;
  let detectedArchetype = null;
  
  Object.entries(scores).forEach(([profileId, score]) => {
    if (score > maxScore) {
      maxScore = score;
      detectedArchetype = PSYCHOLOGICAL_PROFILES[profileId];
    }
  });
  
  // Only return if score is significant (at least 3 points)
  return maxScore >= 3 ? detectedArchetype : null;
};

/**
 * Adapt event choices to detected archetype
 * @param {Object} event - Event object
 * @param {Object} archetype - Detected archetype
 * @returns {Object} Modified event
 */
export const adaptEventToArchetype = (event, archetype) => {
  if (!event || !archetype) return event;
  
  const modifiedEvent = { ...event };
  const modifiedChoices = [...(event.choices || [])];
  
  // Adjust choice appeal based on archetype preferences
  modifiedChoices.forEach(choice => {
    const riskLevel = choice.riskLevel || 'medium';
    const choiceText = (choice.text || '').toLowerCase();
    
    // Risk Seeker modifications
    if (archetype.id === 'risk_seeker') {
      if (riskLevel === 'extreme' || riskLevel === 'high') {
        // Increase appeal of risky choices
        if (!choice.psychologicalEffects) choice.psychologicalEffects = {};
        choice.psychologicalEffects.stress = (choice.psychologicalEffects.stress || 0) - 5;
        choice.appeal_boost = 20;
      }
      if (riskLevel === 'low' || riskLevel === 'safe') {
        // Decrease appeal of safe choices
        choice.appeal_boost = -15;
      }
    }
    
    // People Pleaser modifications
    if (archetype.id === 'people_pleaser') {
      if (choiceText.includes('confront') || choiceText.includes('fight') || choiceText.includes('refuse')) {
        choice.appeal_boost = -20;
        if (!choice.psychologicalEffects) choice.psychologicalEffects = {};
        choice.psychologicalEffects.stress = (choice.psychologicalEffects.stress || 0) + 10;
      }
      if (choiceText.includes('diplomatic') || choiceText.includes('harmony') || choiceText.includes('compromise')) {
        choice.appeal_boost = 15;
      }
    }
    
    // Moral Compass modifications
    if (archetype.id === 'moral_compass') {
      const moralEffect = choice.psychologicalEffects?.moral_integrity || 0;
      if (moralEffect > 0) {
        choice.appeal_boost = 20;
      }
      if (moralEffect < -10) {
        choice.appeal_boost = -25;
      }
    }
    
    // Pragmatist modifications
    if (archetype.id === 'pragmatist') {
      const moneyGain = choice.immediateEffects?.money || 0;
      const fameGain = choice.immediateEffects?.fame || 0;
      if (moneyGain > 0 || fameGain > 0) {
        choice.appeal_boost = 15;
      }
    }
    
    // Self-Destructive modifications
    if (archetype.id === 'self_destructive') {
      const harm = (choice.psychologicalEffects?.stress || 0) + 
                   (choice.psychologicalEffects?.depression || 0) +
                   (choice.psychologicalEffects?.addiction_risk || 0);
      if (harm > 20) {
        choice.appeal_boost = 15;
      }
      if (harm < 0) {
        choice.appeal_boost = -20;
      }
    }
    
    // Survivor modifications
    if (archetype.id === 'survivor') {
      if (choiceText.includes('recover') || choiceText.includes('adapt') || choiceText.includes('overcome')) {
        choice.appeal_boost = 20;
      }
    }
  });
  
  modifiedEvent.choices = modifiedChoices;
  
  // Increase probability of archetype-magnet events
  if (archetype.event_magnets?.some(magnet => event.category?.includes(magnet))) {
    modifiedEvent.archetype_boost = true;
  }
  
  return modifiedEvent;
};

export default PSYCHOLOGICAL_PROFILES;
