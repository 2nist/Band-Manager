/**
 * factionSystem.js - Faction reputation system
 * 
 * Defines factions, their values, and how they affect event generation
 * and available choices.
 */

export const REPUTATION_FACTIONS = {
  underground_scene: {
    id: 'underground_scene',
    name: 'Underground Scene',
    values: ['authenticity', 'rebellion', 'anti_establishment', 'artistic_integrity'],
    hates: ['selling_out', 'mainstream_success', 'corporate_deals', 'commercialization'],
    events_generated: ['underground_venue_offers', 'street_cred_opportunities', 'anti_establishment_choices'],
    beneficial_choices: [
      {
        id: 'underground_support',
        text: 'Get support from underground scene',
        requiresStanding: 70,
        effects: { fame: 10, money: 5000 }
      }
    ],
    hostile_complications: [
      {
        id: 'underground_rejection',
        text: 'Underground scene rejects you',
        triggersAtStanding: -70,
        effects: { fame: -15, money: -2000 }
      }
    ]
  },
  
  industry_insiders: {
    id: 'industry_insiders',
    name: 'Corporate Music Industry',
    values: ['profitability', 'marketability', 'business_savvy', 'brand_safety'],
    hates: ['unpredictability', 'scandal', 'anti_industry_stance', 'artistic_purity'],
    events_generated: ['business_opportunities', 'label_negotiations', 'industry_politics'],
    beneficial_choices: [
      {
        id: 'industry_backing',
        text: 'Get industry backing',
        requiresStanding: 70,
        effects: { money: 25000, fame: 20 }
      }
    ],
    hostile_complications: [
      {
        id: 'industry_blacklist',
        text: 'Industry blacklists you',
        triggersAtStanding: -70,
        effects: { money: -10000, fame: -25 }
      }
    ]
  },
  
  mainstream_media: {
    id: 'mainstream_media',
    name: 'Mainstream Media',
    values: ['controversy', 'scandal', 'clickbait_potential', 'drama'],
    hates: ['boring_behavior', 'privacy', 'media_avoidance', 'no_drama'],
    events_generated: ['interview_requests', 'scandal_investigations', 'publicity_stunts'],
    beneficial_choices: [
      {
        id: 'media_coverage',
        text: 'Get positive media coverage',
        requiresStanding: 70,
        effects: { fame: 30 }
      }
    ],
    hostile_complications: [
      {
        id: 'negative_press',
        text: 'Negative press campaign',
        triggersAtStanding: -70,
        effects: { fame: -20, money: -5000 }
      }
    ]
  },
  
  law_enforcement: {
    id: 'law_enforcement',
    name: 'Law Enforcement',
    values: ['law_and_order', 'cooperation', 'clean_image', 'public_safety'],
    hates: ['criminal_activity', 'drug_use', 'violence', 'non_cooperation'],
    events_generated: ['investigation_events', 'cooperation_requests', 'legal_consequences'],
    beneficial_choices: [
      {
        id: 'police_protection',
        text: 'Receive police protection',
        requiresStanding: 70,
        effects: { safety: true }
      }
    ],
    hostile_complications: [
      {
        id: 'police_scrutiny',
        text: 'Increased police scrutiny',
        triggersAtStanding: -70,
        effects: { paranoia: 30, stress: 25 }
      }
    ]
  },
  
  criminal_underworld: {
    id: 'criminal_underworld',
    name: 'Criminal Networks',
    values: ['loyalty', 'silence', 'mutual_benefit', 'respect'],
    hates: ['snitching', 'betrayal', 'law_cooperation', 'weakness'],
    events_generated: ['criminal_offers', 'protection_requests', 'illegal_opportunities'],
    beneficial_choices: [
      {
        id: 'criminal_protection',
        text: 'Get criminal protection',
        requiresStanding: 70,
        effects: { money: 15000, safety: true }
      }
    ],
    hostile_complications: [
      {
        id: 'criminal_threat',
        text: 'Criminal threats',
        triggersAtStanding: -70,
        effects: { paranoia: 40, stress: 35 }
      }
    ]
  }
};

/**
 * Get faction standing status
 * @param {number} standing - Current standing value (-100 to 100)
 * @returns {string} Status: 'ally', 'friendly', 'neutral', 'wary', 'hostile', 'enemy'
 */
export const getFactionStatus = (standing) => {
  if (standing > 70) return 'ally';
  if (standing > 30) return 'friendly';
  if (standing > -30) return 'neutral';
  if (standing > -70) return 'wary';
  return 'enemy';
};

/**
 * Modify event based on faction standings
 * @param {Object} baseEvent - Base event to modify
 * @param {Object} gameState - Current game state
 * @param {Object} factionStandings - Current faction standings
 * @returns {Object} Modified event
 */
export const getFactionModifiedEvents = (baseEvent, gameState, factionStandings = {}) => {
  if (!baseEvent || !factionStandings) return baseEvent;
  
  const modifiedEvent = { ...baseEvent };
  const newChoices = [...(baseEvent.choices || [])];
  
  // Check each faction
  Object.entries(REPUTATION_FACTIONS).forEach(([factionId, faction]) => {
    const standing = factionStandings[factionId] || 0;
    const status = getFactionStatus(standing);
    
    // High standing unlocks beneficial choices
    if (status === 'ally' && faction.beneficial_choices) {
      faction.beneficial_choices.forEach(benefit => {
        // Add beneficial choice if not already present
        if (!newChoices.find(c => c.id === benefit.id)) {
          newChoices.push({
            ...benefit,
            id: `${factionId}_${benefit.id}`,
            text: benefit.text,
            riskLevel: 'low',
            immediateEffects: benefit.effects || {},
            psychologicalEffects: {
              stress: -5
            }
          });
        }
      });
    }
    
    // Low standing creates hostile complications
    if (status === 'enemy' && faction.hostile_complications) {
      faction.hostile_complications.forEach(complication => {
        // Add complication choice or modify existing choices
        if (complication.triggersAtStanding && standing <= complication.triggersAtStanding) {
          // Add a complication choice
          newChoices.push({
            id: `${factionId}_complication`,
            text: complication.text,
            riskLevel: 'high',
            immediateEffects: complication.effects || {},
            psychologicalEffects: {
              stress: 20,
              paranoia: 15
            }
          });
        }
      });
    }
    
    // Filter choices based on faction requirements
    if (faction.hates) {
      // Remove or disable choices that faction hates
      const eventCategory = baseEvent.category;
      const eventKeywords = `${baseEvent.title} ${baseEvent.description}`.toLowerCase();
      
      faction.hates.forEach(hated => {
        if (eventKeywords.includes(hated.replace(/_/g, ' '))) {
          // This event type is hated - add negative effects to all choices
          newChoices.forEach(choice => {
            if (!choice.psychologicalEffects) choice.psychologicalEffects = {};
            choice.psychologicalEffects[factionId] = -10;
          });
        }
      });
    }
  });
  
  modifiedEvent.choices = newChoices;
  return modifiedEvent;
};

/**
 * Check if a choice requires minimum faction standing
 * @param {Object} choice - Choice object
 * @param {Object} factionStandings - Current standings
 * @returns {boolean} True if choice is available
 */
export const isChoiceAvailable = (choice, factionStandings) => {
  if (!choice.requiredFactionStanding) return true;
  
  const { faction, minStanding } = choice.requiredFactionStanding;
  const standing = factionStandings[faction] || 0;
  
  return standing >= minStanding;
};

/**
 * Get faction-specific event probability modifier
 * @param {string} eventCategory - Event category
 * @param {Object} factionStandings - Current standings
 * @returns {number} Probability multiplier (0-2.0)
 */
export const getFactionProbabilityModifier = (eventCategory, factionStandings) => {
  let modifier = 1.0;
  
  Object.entries(REPUTATION_FACTIONS).forEach(([factionId, faction]) => {
    const standing = factionStandings[factionId] || 0;
    const status = getFactionStatus(standing);
    
    // High standing increases probability of faction-favored events
    if (status === 'ally' && faction.events_generated?.some(e => eventCategory.includes(e))) {
      modifier *= 1.5;
    }
    
    // Low standing decreases probability
    if (status === 'enemy' && faction.hates?.some(h => eventCategory.includes(h))) {
      modifier *= 0.5;
    }
  });
  
  return Math.min(2.0, Math.max(0.1, modifier));
};

export default REPUTATION_FACTIONS;
