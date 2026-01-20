/**
 * enhancedEventWrapper.js - Converts existing events to enhanced event format
 * 
 * Purpose:
 * - Wrap existing events with enhanced features (optional layer)
 * - Add psychological tracking to current events
 * - Enable content warnings for mature content
 * - Maintain 100% backwards compatibility
 * 
 * Usage:
 * const enhancedEvent = createEnhancedEvent(originalEvent, enhancements);
 */

/**
 * Wrap an existing event with enhanced features
 * 
 * Preserves ALL original properties while adding optional enhanced features
 * 
 * @param {Object} originalEvent - Event from your existing event system
 * @param {Object} enhancements - Optional enhanced features to add
 * @returns {Object} Event with both original and enhanced properties
 */
export const createEnhancedEvent = (originalEvent, enhancements = {}) => {
  return {
    // Preserve all original properties (100% backwards compatible)
    ...originalEvent,

    // Add enhanced features as optional layer
    enhanced: {
      maturityLevel: enhancements.maturityLevel || 'teen', // 'teen' or 'mature'
      category: enhancements.category || 'general',
      contentWarnings: enhancements.contentWarnings || [],
      riskLevel: enhancements.riskLevel || 'low', // 'low', 'medium', 'high', 'extreme'
      
      psychologicalTriggers: enhancements.psychologicalTriggers || [],
    },

    // Preserve original choices, enhance them
    choices: (originalEvent.choices || []).map((choice, idx) => 
      enhanceChoice(choice, enhancements.choiceEnhancements?.[idx] || {})
    )
  };
};

/**
 * Enhance a single choice while preserving original properties
 * 
 * @param {Object} originalChoice - Choice from existing event
 * @param {Object} enhancements - Optional enhancements for this choice
 * @returns {Object} Choice with both original and enhanced properties
 */
export const enhanceChoice = (originalChoice, enhancements = {}) => {
  return {
    // Keep all original choice properties
    ...originalChoice,

    // Add enhanced features as optional layer
    enhanced: {
      riskLevel: enhancements.riskLevel || 'low', // 'low', 'medium', 'high', 'extreme'
      maturityLevel: enhancements.maturityLevel || 'teen',
      
      // Psychological effects: { stress: +10, moral_integrity: -5 }
      psychologicalEffects: enhancements.psychologicalEffects || {},
      
      // Faction effects: { underground_scene: +5, law_enforcement: -10 }
      factionEffects: enhancements.factionEffects || {},
      
      // Long-term consequences that might trigger later
      longTermConsequences: enhancements.longTermConsequences || {},
      
      // Tags for tracking choice types
      tags: enhancements.tags || []
    }
  };
};

/**
 * Example: Enhance an existing drama event
 * 
 * This shows how to take one of your existing band drama events
 * and wrap it with psychological and faction effects
 */
export const ENHANCED_DRAMA_EVENTS = {
  personality_clash: createEnhancedEvent(
    {
      id: 'personality_clash',
      title: 'Band Drama: Personality Clash!',
      description: 'Your guitarist and drummer are arguing about the band\'s direction.',
      choices: [
        {
          text: 'Side with guitarist',
          effects: { money: -50, morale: -10, fame: +5 }
        },
        {
          text: 'Side with drummer',
          effects: { morale: -5 }
        },
        {
          text: 'Call a band meeting',
          effects: { money: -100, morale: +10 }
        }
      ]
    },
    {
      maturityLevel: 'teen',
      category: 'band_management',
      riskLevel: 'medium',
      contentWarnings: [],
      choiceEnhancements: [
        {
          // Siding with guitarist
          riskLevel: 'medium',
          psychologicalEffects: { stress: +10 },
          factionEffects: { underground_scene: +5 },
          tags: ['band_politics', 'loyalty_choice']
        },
        {
          // Siding with drummer
          riskLevel: 'low',
          psychologicalEffects: { stress: +5 },
          factionEffects: {},
          tags: ['band_politics', 'loyalty_choice']
        },
        {
          // Band meeting
          riskLevel: 'low',
          psychologicalEffects: { stress: -5, moral_integrity: +10 },
          factionEffects: {},
          tags: ['leadership', 'conflict_resolution']
        }
      ]
    }
  )
};

/**
 * Example: Enhance a substance-related event
 * (Mature content example - can be toggled off)
 */
export const ENHANCED_SUBSTANCE_EVENTS = {
  drugs_at_party: createEnhancedEvent(
    {
      id: 'drugs_at_party',
      title: 'Drugs at the Party!',
      description: 'Someone\'s passing around drugs backstage. The whole scene is watching you...',
      choices: [
        {
          text: 'Just say no',
          effects: { morale: +5, fame: -5 }
        },
        {
          text: 'Try some (risky)',
          effects: { morale: +10, fame: +10 }
        },
        {
          text: 'Buy your own stash ($500)',
          effects: { money: -500, morale: +20, fame: +5 }
        }
      ]
    },
    {
      maturityLevel: 'mature',
      category: 'substance_abuse',
      contentWarnings: ['drug_use', 'peer_pressure'],
      riskLevel: 'high',
      psychologicalTriggers: ['stress', 'peer_pressure'],
      choiceEnhancements: [
        {
          // Say no
          riskLevel: 'low',
          maturityLevel: 'teen',
          psychologicalEffects: { moral_integrity: +10, stress: -5 },
          factionEffects: { law_enforcement: +10, underground_scene: -5 },
          tags: ['moral_choice', 'substance_refusal']
        },
        {
          // Try some
          riskLevel: 'high',
          maturityLevel: 'mature',
          psychologicalEffects: { 
            addiction_risk: +20,
            moral_integrity: -5,
            stress: -15
          },
          factionEffects: { 
            underground_scene: +15,
            law_enforcement: -15,
            corporate_industry: -10
          },
          longTermConsequences: {
            unlocks: ['addiction_escalation_events'],
            addictionPath: 'experimentation_stage'
          },
          tags: ['substance_use', 'risky_behavior']
        },
        {
          // Buy stash
          riskLevel: 'extreme',
          maturityLevel: 'mature',
          psychologicalEffects: {
            addiction_risk: +35,
            moral_integrity: -15,
            criminal_involvement: +25
          },
          factionEffects: {
            criminal_underworld: +20,
            law_enforcement: -25,
            corporate_industry: -20
          },
          longTermConsequences: {
            unlocks: ['drug_dealer_contact_events'],
            criminalPath: 'drug_dealing_introduction'
          },
          tags: ['substance_use', 'criminal_activity', 'escalation']
        }
      ]
    }
  )
};

/**
 * Example: Enhance a fame/scandal event
 */
export const ENHANCED_SCANDAL_EVENTS = {
  scandalous_photo: createEnhancedEvent(
    {
      id: 'scandalous_photo',
      title: 'Scandalous Photo Goes Viral!',
      description: 'A compromising photo from your wild days just hit social media. The internet is going crazy.',
      choices: [
        {
          text: 'Own it - Post a classy response',
          effects: { morale: +10, fame: +20 }
        },
        {
          text: 'Deny everything',
          effects: { moral_integrity: -10, fame: -5 }
        },
        {
          text: 'Ignore and let it blow over',
          effects: { morale: +5, stress: +15 }
        }
      ]
    },
    {
      maturityLevel: 'teen',
      category: 'fame_scandal',
      riskLevel: 'medium',
      contentWarnings: [],
      choiceEnhancements: [
        {
          // Own it
          riskLevel: 'low',
          psychologicalEffects: { moral_integrity: +5, stress: -10 },
          factionEffects: { underground_scene: +10, mainstream_media: +5 },
          tags: ['authenticity', 'confidence']
        },
        {
          // Deny
          riskLevel: 'medium',
          psychologicalEffects: { stress: +10, moral_integrity: -15 },
          factionEffects: { mainstream_media: +5 },
          tags: ['dishonesty', 'damage_control']
        },
        {
          // Ignore
          riskLevel: 'high',
          psychologicalEffects: { stress: +15, paranoia: +5 },
          factionEffects: { underground_scene: -5 },
          tags: ['avoidance', 'passive']
        }
      ]
    }
  )
};

/**
 * Helper: Auto-detect maturity level from event content
 * 
 * Scans event text for keywords to determine if it's mature content
 */
export const detectMaturityLevel = (event) => {
  const matureKeywords = [
    'drug', 'alcohol', 'high', 'drunk',
    'sex', 'affair', 'strip', 'naked',
    'violence', 'fight', 'murder', 'kill',
    'criminal', 'arrest', 'jail', 'theft',
    'overdose', 'addiction', 'rehab'
  ];
  
  const text = `${event.title} ${event.description} ${(event.choices || []).map(c => c.text).join(' ')}`.toLowerCase();
  
  return matureKeywords.some(keyword => text.includes(keyword)) ? 'mature' : 'teen';
};

/**
 * Helper: Auto-categorize event
 */
export const categorizeEvent = (event) => {
  const title = event.title.toLowerCase();
  
  if (title.includes('drug') || title.includes('alcohol') || title.includes('high')) return 'substance_abuse';
  if (title.includes('scandal') || title.includes('sex') || title.includes('affair')) return 'sexual_content';
  if (title.includes('criminal') || title.includes('arrest') || title.includes('theft')) return 'criminal_activity';
  if (title.includes('drama') || title.includes('fight') || title.includes('conflict')) return 'band_management';
  if (title.includes('photo') || title.includes('viral') || title.includes('scandal')) return 'fame_scandal';
  
  return 'general';
};

/**
 * Helper: Detect content warnings from event
 */
export const detectContentWarnings = (event) => {
  const warnings = [];
  const text = `${event.title} ${event.description}`.toLowerCase();
  
  if (text.includes('drug')) warnings.push('drug_use');
  if (text.includes('alcohol')) warnings.push('alcohol_use');
  if (text.includes('sex') || text.includes('affair') || text.includes('naked')) warnings.push('sexual_content');
  if (text.includes('violence') || text.includes('fight') || text.includes('murder')) warnings.push('violence');
  if (text.includes('overdose')) warnings.push('overdose_references');
  if (text.includes('arrest') || text.includes('jail') || text.includes('criminal')) warnings.push('legal_trouble');
  
  return warnings;
};

/**
 * Batch enhance multiple existing events
 * 
 * Useful for migrating your entire event collection
 */
export const batchEnhanceEvents = (eventMap, enhancements = {}) => {
  const enhanced = {};
  
  Object.keys(eventMap).forEach(eventKey => {
    const original = eventMap[eventKey];
    
    // Use provided enhancements or auto-detect
    const eventEnhancements = enhancements[eventKey] || {
      maturityLevel: detectMaturityLevel(original),
      category: categorizeEvent(original),
      contentWarnings: detectContentWarnings(original)
    };
    
    enhanced[eventKey] = createEnhancedEvent(original, eventEnhancements);
  });
  
  return enhanced;
};

/**
 * Check if event should be shown based on user preferences
 * 
 * @param {Object} event - Enhanced event
 * @param {Object} enhancedFeatures - User's content preferences
 * @returns {boolean} True if event should be shown
 */
export const shouldShowEvent = (event, enhancedFeatures) => {
  if (!enhancedFeatures?.enabled) {
    return true; // If enhanced features disabled, show all events
  }
  
  // Check maturity level
  if (event.enhanced?.maturityLevel === 'mature' && enhancedFeatures.maturityLevel === 'teen') {
    return false;
  }
  
  // Check content preferences
  if (event.enhanced?.contentWarnings?.length > 0) {
    const hasBlockedContent = event.enhanced.contentWarnings.some(warning => {
      if (warning === 'drug_use' && !enhancedFeatures.contentPreferences?.substance_abuse) return true;
      if (warning === 'sexual_content' && !enhancedFeatures.contentPreferences?.sexual_content) return true;
      if ((warning === 'legal_trouble' || warning.includes('criminal')) && !enhancedFeatures.contentPreferences?.criminal_activity) return true;
      if (warning === 'violence' && !enhancedFeatures.contentPreferences?.violence) return true;
      return false;
    });
    
    if (hasBlockedContent) return false;
  }
  
  return true;
};

/**
 * Filter event queue based on content preferences
 * 
 * @param {Array} eventQueue - Array of events
 * @param {Object} enhancedFeatures - User preferences
 * @returns {Array} Filtered events
 */
export const filterEventsByPreferences = (eventQueue, enhancedFeatures) => {
  return eventQueue.filter(event => shouldShowEvent(event, enhancedFeatures));
};
