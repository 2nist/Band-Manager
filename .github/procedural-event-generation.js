# PROCEDURAL EVENT GENERATION DATA
## Building Blocks for Infinite Gritty Scenarios

This system allows for procedural generation of thousands of unique events by mixing and matching components based on current game state, player choices, and narrative context.

---

## EVENT COMPONENT LIBRARY

### Character Archetypes
```javascript
const CHARACTER_ARCHETYPES = {
  // Industry figures
  sleazy_manager: {
    name_patterns: ['%adjective% %surname%', 'Big %nickname%'],
    adjectives: ['Slick', 'Smooth', 'Fast', 'Lucky', 'Sharp'],
    surnames: ['Goldman', 'Sterling', 'Diamond', 'Cross', 'Stone'],
    nicknames: ['Eddie', 'Tony', 'Sal', 'Mickey', 'Jimmy'],
    personality_traits: ['manipulative', 'charismatic', 'greedy', 'connected'],
    speech_patterns: [
      '"Trust me, kid, I know what I\'m talking about."',
      '"This is how the business works."',
      '"You scratch my back, I scratch yours."',
      '"Everybody wins in this deal."'
    ]
  },
  
  corrupt_cop: {
    personality_traits: ['authoritarian', 'corruptible', 'violent', 'cynical'],
    speech_patterns: [
      '"We can do this the easy way or the hard way."',
      '"I didn\'t see nothing if you didn\'t see nothing."',
      '"This badge gives me options you don\'t have."',
      '"Around here, I AM the law."'
    ]
  },
  
  obsessed_fan: {
    personality_traits: ['unstable', 'devoted', 'intelligent', 'dangerous'],
    escalation_levels: ['admiring', 'intrusive', 'stalking', 'threatening', 'violent'],
    speech_patterns: [
      '"You saved my life with your music."',
      '"We\'re connected on a spiritual level."',
      '"I understand you better than anyone."',
      '"If I can\'t have you, no one can."'
    ]
  },
  
  drug_dealer: {
    personality_traits: ['calculating', 'dangerous', 'business_minded', 'territorial'],
    product_types: ['party_drugs', 'performance_enhancers', 'hard_drugs', 'prescription'],
    speech_patterns: [
      '"First taste is free, after that we talk business."',
      '"I provide a service to creative people."',
      '"You want to reach new heights? I got your elevation."',
      '"Cash only, no questions, no problems."'
    ]
  }
};
```

### Scenario Templates
```javascript
const SCENARIO_TEMPLATES = {
  corruption_offer: {
    setup_patterns: [
      'A %authority_figure% approaches you %location% and makes an offer.',
      'Your %business_contact% pulls you aside and suggests a %scheme_type%.',
      'After your show, a %mysterious_person% slips you a business card.',
      'During a meeting about %legitimate_business%, the conversation turns dark.'
    ],
    
    authority_figures: ['record executive', 'radio programmer', 'venue owner', 'booking agent'],
    locations: ['backstage', 'at a fancy restaurant', 'in a parking garage', 'in their office'],
    scheme_types: ['payola scheme', 'tax evasion plan', 'drug distribution network', 'money laundering operation'],
    mysterious_persons: ['well-dressed stranger', 'person in expensive clothes', 'someone with mob connections']
  },
  
  substance_temptation: {
    setup_patterns: [
      'At the %venue_type%, someone offers your band %substance%.',
      'Your %band_member% comes to you with %substance% they got from %source%.',
      'The stress of %stressor% has %band_member% asking about %substance%.',
      'After a %performance_type% performance, %tempter% suggests celebrating with %substance%.'
    ],
    
    substances: [
      { name: 'cocaine', risk_level: 'high', effects: { energy: +20, addiction: +30 }},
      { name: 'heroin', risk_level: 'extreme', effects: { creativity: +15, health: -40, addiction: +60 }},
      { name: 'prescription pills', risk_level: 'medium', effects: { stress: -15, addiction: +15 }},
      { name: 'ecstasy', risk_level: 'medium', effects: { social: +20, crash: +25 }}
    ],
    
    stressors: ['touring pressure', 'creative block', 'relationship problems', 'financial stress'],
    tempters: ['groupie', 'industry insider', 'rival band member', 'venue regular']
  },
  
  moral_crossroads: {
    setup_patterns: [
      'You witness %witnessed_action% and must decide whether to %action_choices%.',
      'A %vulnerable_person% asks for your help with %problem%, but helping means %risk%.',
      'You have evidence of %crime_type% but revealing it would %consequence%.',
      'Someone you trust asks you to %unethical_action% for %justification%.'
    ],
    
    witnessed_actions: [
      'your manager stealing from the band',
      'a label executive sexually harassing an intern',
      'drug dealing in your venue',
      'violence against a fan'
    ],
    
    vulnerable_persons: ['young fan', 'struggling musician', 'abuse victim', 'whistleblower'],
    crime_types: ['financial fraud', 'sexual assault', 'drug trafficking', 'tax evasion'],
    unethical_actions: ['lie to the police', 'destroy evidence', 'threaten a witness', 'launder money']
  }
};
```

### Consequence Chains
```javascript
const CONSEQUENCE_CHAINS = {
  addiction_spiral: {
    stages: [
      {
        name: 'experimentation',
        duration: { min: 2, max: 8 },
        effects: { creativity: +10, risk_taking: +15 },
        next_stage_triggers: ['regular_use', 'escalation', 'awakening']
      },
      {
        name: 'regular_use',
        duration: { min: 8, max: 20 },
        effects: { tolerance: +20, financial_drain: +15, lying: +25 },
        next_stage_triggers: ['dependency', 'intervention', 'overdose_scare']
      },
      {
        name: 'dependency',
        duration: { min: 12, max: 52 },
        effects: { health: -30, relationships: -40, performance: -20 },
        next_stage_triggers: ['rock_bottom', 'death', 'recovery_attempt']
      }
    ]
  },
  
  corruption_path: {
    stages: [
      {
        name: 'first_compromise',
        effects: { moral_flexibility: +15, guilt: +20, financial_gain: +1000 },
        unlock_events: ['bigger_offers', 'blackmail_vulnerability']
      },
      {
        name: 'regular_corruption',
        effects: { conscience_numbing: +25, paranoia: +30, wealth: +5000 },
        unlock_events: ['criminal_associates', 'law_enforcement_attention']
      },
      {
        name: 'deep_involvement',
        effects: { point_of_no_return: true, criminal_contacts: +3 },
        unlock_events: ['investigation', 'violent_consequences', 'empire_building']
      }
    ]
  },
  
  fame_corruption: {
    stages: [
      {
        name: 'ego_inflation',
        effects: { humility: -20, entitlement: +30, isolation: +15 }
      },
      {
        name: 'reality_disconnect',
        effects: { empathy: -25, paranoia: +20, poor_judgment: +35 }
      },
      {
        name: 'complete_narcissism',
        effects: { relationship_destruction: true, self_awareness: 0 }
      }
    ]
  }
};
```

### Dynamic Dialogue Generation
```javascript
const DIALOGUE_COMPONENTS = {
  // Emotional states affect dialogue tone
  emotional_modifiers: {
    desperate: {
      speech_patterns: [
        '"Please, you have to understand..."',
        '"I\'m running out of options here."',
        '"This is life or death for me."'
      ],
      word_choices: ['beg', 'plead', 'desperate', 'last chance', 'no choice']
    },
    
    threatening: {
      speech_patterns: [
        '"It would be a shame if something happened to..."',
        '"You know what happens to people who cross me."',
        '"I hope you make the smart choice here."'
      ],
      word_choices: ['consequences', 'unfortunate accidents', 'wouldn\'t want']
    },
    
    manipulative: {
      speech_patterns: [
        '"Think about your future..."',
        '"This could be really good for you."',
        '"Smart people like you understand that..."'
      ],
      word_choices: ['opportunity', 'future', 'smart move', 'everyone wins']
    }
  },
  
  // Context-aware dialogue
  contextual_elements: {
    venue_atmosphere: {
      dive_bar: {
        ambient_details: ['sticky floors', 'cigarette smoke', 'neon beer signs'],
        crowd_descriptions: ['drunk regulars', 'rowdy bikers', 'desperate locals'],
        sensory_details: ['smell of stale beer', 'sound of breaking glass', 'dim lighting']
      },
      
      warehouse_rave: {
        ambient_details: ['pounding bass', 'strobing lights', 'concrete walls'],
        crowd_descriptions: ['sweaty dancers', 'drug dealers', 'underground scene'],
        sensory_details: ['overwhelming music', 'chemical smells', 'body heat']
      },
      
      luxury_venue: {
        ambient_details: ['marble floors', 'crystal chandeliers', 'velvet curtains'],
        crowd_descriptions: ['industry executives', 'wealthy patrons', 'social climbers'],
        sensory_details: ['expensive perfume', 'hushed conversations', 'soft lighting']
      }
    }
  }
};
```

### Procedural Event Generator
```javascript
const ProceduralEventGenerator = {
  generateEvent: (gameState, eventType, intensity = 'medium') => {
    const template = SCENARIO_TEMPLATES[eventType];
    const character = selectCharacterArchetype(eventType);
    const setting = selectSetting(gameState.currentVenue, gameState.fame);
    
    // Generate base scenario
    const scenario = {
      id: `procedural_${eventType}_${Date.now()}`,
      title: generateTitle(template, character, intensity),
      description: generateDescription(template, character, setting, gameState),
      choices: generateChoices(template, character, gameState, intensity)
    };
    
    return scenario;
  },
  
  generateDescription: (template, character, setting, gameState) => {
    let description = randomFrom(template.setup_patterns);
    
    // Replace template variables
    description = description.replace(/%(\w+)%/g, (match, variable) => {
      return selectContextualElement(variable, character, setting, gameState);
    });
    
    // Add atmospheric details
    const atmosphere = DIALOGUE_COMPONENTS.contextual_elements.venue_atmosphere[setting.type];
    const atmosphericDetail = randomFrom(atmosphere.sensory_details);
    
    // Combine into full description
    return `${description} ${generateAtmosphericSetting(setting, atmosphere)}`;
  },
  
  generateChoices: (template, character, gameState, intensity) => {
    const choices = [];
    
    // Generate moral spectrum choices
    choices.push(generateMoralChoice('ethical', template, gameState));
    choices.push(generateMoralChoice('pragmatic', template, gameState));
    choices.push(generateMoralChoice('corrupt', template, gameState));
    
    // Add intensity-specific choice
    if (intensity === 'high') {
      choices.push(generateMoralChoice('extreme', template, gameState));
    }
    
    return choices.filter(choice => choice.available);
  }
};

// Example usage
const generateCorruptionEvent = (gameState) => {
  if (gameState.psychological.moral_integrity < 70) {
    return ProceduralEventGenerator.generateEvent(gameState, 'corruption_offer', 'high');
  } else {
    return ProceduralEventGenerator.generateEvent(gameState, 'corruption_offer', 'medium');
  }
};
```

### Reputation System Integration
```javascript
const REPUTATION_FACTIONS = {
  underground_scene: {
    values: ['authenticity', 'rebellion', 'anti_establishment'],
    hates: ['selling_out', 'mainstream_success', 'corporate_deals'],
    events_generated: ['underground_venue_offers', 'street_cred_opportunities', 'anti_establishment_choices']
  },
  
  industry_insiders: {
    values: ['profitability', 'marketability', 'business_savvy'],
    hates: ['unpredictability', 'scandal', 'anti_industry_stance'],
    events_generated: ['business_opportunities', 'label_negotiations', 'industry_politics']
  },
  
  mainstream_media: {
    values: ['controversy', 'scandal', 'clickbait_potential'],
    hates: ['boring_behavior', 'privacy', 'media_avoidance'],
    events_generated: ['interview_requests', 'scandal_investigations', 'publicity_stunts']
  },
  
  law_enforcement: {
    values: ['law_and_order', 'cooperation', 'clean_image'],
    hates: ['criminal_activity', 'drug_use', 'violence'],
    events_generated: ['investigation_events', 'cooperation_requests', 'legal_consequences']
  }
};

// Events change based on faction relationships
const getFactionModifiedEvents = (baseEvent, gameState) => {
  const modifiedEvent = { ...baseEvent };
  
  // Modify based on faction standings
  REPUTATION_FACTIONS.forEach((faction, name) => {
    const standing = gameState.reputation[name] || 0;
    
    if (standing > 70) {
      // High standing unlocks beneficial choices
      modifiedEvent.choices.push(...faction.beneficial_choices);
    } else if (standing < -70) {
      // Low standing creates hostile situations
      modifiedEvent.complications.push(...faction.hostile_complications);
    }
  });
  
  return modifiedEvent;
};
```

### Psychological Profile Adaptation
```javascript
const PSYCHOLOGICAL_PROFILES = {
  risk_seeker: {
    choice_preferences: {
      'risky': +30,
      'safe': -20,
      'extreme': +40
    },
    event_magnets: ['substance_opportunities', 'dangerous_venues', 'criminal_offers'],
    dialogue_style: 'bold_and_reckless'
  },
  
  people_pleaser: {
    choice_preferences: {
      'confrontational': -30,
      'harmonious': +25,
      'conflict_avoidance': +35
    },
    event_magnets: ['manipulation_attempts', 'peer_pressure', 'exploitation'],
    dialogue_style: 'accommodating_and_nervous'
  },
  
  control_freak: {
    choice_preferences: {
      'delegation': -25,
      'micromanagement': +30,
      'independent': +20
    },
    event_magnets: ['power_struggles', 'authority_challenges', 'control_loss'],
    dialogue_style: 'commanding_and_decisive'
  }
};

// Events adapt to player's demonstrated psychology
const getPersonalityAdaptedEvent = (baseEvent, playerHistory) => {
  const detectedProfile = analyzePlayerPsychology(playerHistory);
  const profile = PSYCHOLOGICAL_PROFILES[detectedProfile];
  
  // Modify event to target player's psychological triggers
  const adaptedEvent = { ...baseEvent };
  
  // Adjust choice appeal based on psychological profile
  adaptedEvent.choices.forEach(choice => {
    const categoryBonus = profile.choice_preferences[choice.psychological_category] || 0;
    choice.appeal_modifier = categoryBonus;
    choice.narrative_weight += Math.abs(categoryBonus) * 0.1;
  });
  
  return adaptedEvent;
};
```

### Emergent Storylines
```javascript
const EmergentNarrativeEngine = {
  // Tracks player choices to create personalized story arcs
  analyzeChoicePatterns: (playerHistory) => {
    const patterns = {
      moral_direction: calculateMoralTrajectory(playerHistory),
      risk_tolerance: calculateRiskTolerance(playerHistory),
      loyalty_vs_ambition: calculateLoyaltyScore(playerHistory),
      substance_vulnerability: calculateSubstanceRisk(playerHistory)
    };
    
    return patterns;
  },
  
  generatePersonalizedArc: (patterns, gameState) => {
    // Create storyline based on player's demonstrated behavior
    if (patterns.moral_direction < -50 && patterns.risk_tolerance > 70) {
      return createCorruptionArc('criminal_mastermind', gameState);
    }
    
    if (patterns.substance_vulnerability > 60 && patterns.stress_level > 80) {
      return createAddictionArc('stress_coping', gameState);
    }
    
    if (patterns.loyalty_vs_ambition < -30 && gameState.fame > 200) {
      return createBetrayalArc('success_corruption', gameState);
    }
    
    return createGrowthArc('character_development', gameState);
  },
  
  // Dynamic antagonist generation based on player choices
  createPersonalizedAntagonist: (playerHistory, gameState) => {
    const nemesis = {
      personality: inversePlayerTraits(playerHistory),
      motivation: targetPlayerWeaknesses(playerHistory),
      resources: scaleToPlayerSuccess(gameState.fame, gameState.money),
      personal_connection: createConnectionToPlayer(playerHistory)
    };
    
    return nemesis;
  }
};
```

This procedural system can generate thousands of unique events that feel personally crafted for each player's specific journey through fame, corruption, and redemption. Every playthrough becomes a unique psychological thriller based on the player's own choices and moral development.
