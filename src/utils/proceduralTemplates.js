/**
 * proceduralTemplates.js - Template-based scenario generation
 * 
 * Provides infinite event variety through template variable substitution.
 * Templates mix and match components based on game state and context.
 */

/**
 * Scenario templates with variable placeholders
 * Variables are replaced with contextual elements during generation
 */
export const SCENARIO_TEMPLATES = {
  corruption_offer: {
    setup_patterns: [
      'A %authority_figure% approaches you %location% and makes an offer.',
      'Your %business_contact% pulls you aside and suggests a %scheme_type%.',
      'After your show, a %mysterious_person% slips you a business card.',
      'During a meeting about %legitimate_business%, the conversation turns dark.'
    ],
    authority_figures: ['record executive', 'radio programmer', 'venue owner', 'booking agent', 'promoter'],
    locations: ['backstage', 'at a fancy restaurant', 'in a parking garage', 'in their office', 'at an industry party'],
    scheme_types: ['payola scheme', 'tax evasion plan', 'drug distribution network', 'money laundering operation', 'kickback arrangement'],
    mysterious_persons: ['well-dressed stranger', 'person in expensive clothes', 'someone with mob connections', 'shadowy figure'],
    legitimate_business: ['radio promotion', 'tour booking', 'album distribution', 'merchandise deals']
  },
  
  substance_temptation: {
    setup_patterns: [
      'At the %venue_type%, someone offers your band %substance%.',
      'Your %band_member% comes to you with %substance% they got from %source%.',
      'The stress of %stressor% has %band_member% asking about %substance%.',
      'After a %performance_type% performance, %tempter% suggests celebrating with %substance%.'
    ],
    substances: [
      { name: 'cocaine', risk_level: 'high', effects: { energy: 20, addiction: 30 }},
      { name: 'heroin', risk_level: 'extreme', effects: { creativity: 15, health: -40, addiction: 60 }},
      { name: 'prescription pills', risk_level: 'medium', effects: { stress: -15, addiction: 15 }},
      { name: 'ecstasy', risk_level: 'medium', effects: { social: 20, crash: 25 }},
      { name: 'methamphetamine', risk_level: 'extreme', effects: { energy: 40, addiction: 50, health: -30 }}
    ],
    venue_types: ['dive bar', 'warehouse rave', 'underground club', 'festival', 'afterparty'],
    band_members: ['guitarist', 'bassist', 'drummer', 'keyboardist'],
    sources: ['a friend', 'a dealer', 'another band', 'a groupie', 'an industry contact'],
    stressors: ['touring pressure', 'creative block', 'relationship problems', 'financial stress', 'band conflict'],
    performance_types: ['amazing', 'disastrous', 'mediocre', 'legendary', 'controversial'],
    tempters: ['groupie', 'industry insider', 'rival band member', 'venue regular', 'tour manager']
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
      'violence against a fan',
      'corruption in the industry'
    ],
    action_choices: ['intervene', 'look the other way', 'report it', 'exploit it'],
    vulnerable_persons: ['young fan', 'struggling musician', 'abuse victim', 'whistleblower', 'intern'],
    problems: ['harassment', 'exploitation', 'addiction', 'financial trouble', 'legal issues'],
    risks: ['career damage', 'industry retaliation', 'legal trouble', 'personal danger'],
    crime_types: ['financial fraud', 'sexual assault', 'drug trafficking', 'tax evasion', 'money laundering'],
    consequences: ['destroy your career', 'make powerful enemies', 'endanger your safety', 'ruin relationships'],
    unethical_actions: ['lie to the police', 'destroy evidence', 'threaten a witness', 'launder money', 'cover up a crime'],
    justifications: ['loyalty', 'money', 'career protection', 'fear', 'power']
  },
  
  faction_encounter: {
    setup_patterns: [
      'A representative from %faction% approaches you %location%.',
      'Your standing with %faction% has opened new opportunities.',
      'Your reputation with %faction% has created complications.',
      '%faction% wants something from you in exchange for %benefit%.'
    ],
    factions: ['underground_scene', 'industry_insiders', 'mainstream_media', 'law_enforcement', 'criminal_underworld'],
    locations: ['backstage', 'at a meeting', 'after a show', 'in private'],
    benefits: ['radio play', 'venue access', 'industry connections', 'protection', 'financial support']
  },
  
  venue_incident: {
    setup_patterns: [
      'At %venue_name%, %incident_type% occurs.',
      'During your set at %venue_name%, %incident_type% interrupts the show.',
      'After your performance at %venue_name%, %incident_type% happens.',
      'While setting up at %venue_name%, you discover %incident_type%.'
    ],
    venue_names: ['the dive bar', 'the warehouse', 'the stadium', 'the club', 'the festival'],
    incident_types: [
      'a fight breaks out',
      'someone collapses',
      'police arrive',
      'equipment fails',
      'a fire starts',
      'someone gets arrested',
      'violence escalates'
    ]
  }
};

/**
 * Contextual elements for template variable substitution
 */
export const CONTEXTUAL_ELEMENTS = {
  venue_atmosphere: {
    dive_bar: {
      ambient_details: ['sticky floors', 'cigarette smoke', 'neon beer signs', 'dim lighting'],
      crowd_descriptions: ['drunk regulars', 'rowdy bikers', 'desperate locals', 'barflies'],
      sensory_details: ['smell of stale beer', 'sound of breaking glass', 'dim lighting', 'loud jukebox']
    },
    warehouse_rave: {
      ambient_details: ['pounding bass', 'strobing lights', 'concrete walls', 'graffiti'],
      crowd_descriptions: ['sweaty dancers', 'drug dealers', 'underground scene', 'ravers'],
      sensory_details: ['overwhelming music', 'chemical smells', 'body heat', 'bass vibrations']
    },
    luxury_venue: {
      ambient_details: ['marble floors', 'crystal chandeliers', 'velvet curtains', 'polished surfaces'],
      crowd_descriptions: ['industry executives', 'wealthy patrons', 'social climbers', 'celebrities'],
      sensory_details: ['expensive perfume', 'hushed conversations', 'soft lighting', 'ambient music']
    },
    stadium: {
      ambient_details: ['massive stage', 'huge screens', 'thousands of lights', 'professional sound'],
      crowd_descriptions: ['thousands of fans', 'security teams', 'media crews', 'VIP sections'],
      sensory_details: ['roaring crowd', 'stadium lights', 'professional sound', 'backstage luxury']
    }
  }
};

/**
 * Generate an event from a template
 * @param {string} templateName - Template identifier
 * @param {Object} gameState - Current game state
 * @param {Object} context - Additional context (venue, psychological state, etc.)
 * @returns {Object|null} Generated event or null if template not found
 */
export const generateFromTemplate = (templateName, gameState, context = {}) => {
  const template = SCENARIO_TEMPLATES[templateName];
  if (!template) return null;
  
  // Select random setup pattern
  const pattern = template.setup_patterns[Math.floor(Math.random() * template.setup_patterns.length)];
  
  // Replace variables in pattern
  let description = pattern;
  const variables = pattern.match(/%\w+%/g) || [];
  
  for (const variable of variables) {
    const varName = variable.replace(/%/g, '');
    let replacement = '';
    
    // Get replacement based on variable name
    switch (varName) {
      case 'authority_figure':
        replacement = template.authority_figures?.[Math.floor(Math.random() * template.authority_figures.length)] || 'someone';
        break;
      case 'location':
        replacement = template.locations?.[Math.floor(Math.random() * template.locations.length)] || 'somewhere';
        break;
      case 'scheme_type':
        replacement = template.scheme_types?.[Math.floor(Math.random() * template.scheme_types.length)] || 'a scheme';
        break;
      case 'mysterious_person':
        replacement = template.mysterious_persons?.[Math.floor(Math.random() * template.mysterious_persons.length)] || 'someone';
        break;
      case 'legitimate_business':
        replacement = template.legitimate_business?.[Math.floor(Math.random() * template.legitimate_business.length)] || 'business';
        break;
      case 'venue_type':
        replacement = template.venue_types?.[Math.floor(Math.random() * template.venue_types.length)] || 'venue';
        break;
      case 'substance':
        const substance = template.substances?.[Math.floor(Math.random() * template.substances.length)];
        replacement = substance?.name || 'something';
        break;
      case 'band_member':
        replacement = template.band_members?.[Math.floor(Math.random() * template.band_members.length)] || 'band member';
        break;
      case 'source':
        replacement = template.sources?.[Math.floor(Math.random() * template.sources.length)] || 'someone';
        break;
      case 'stressor':
        replacement = template.stressors?.[Math.floor(Math.random() * template.stressors.length)] || 'stress';
        break;
      case 'performance_type':
        replacement = template.performance_types?.[Math.floor(Math.random() * template.performance_types.length)] || 'performance';
        break;
      case 'tempter':
        replacement = template.tempters?.[Math.floor(Math.random() * template.tempters.length)] || 'someone';
        break;
      case 'witnessed_action':
        replacement = template.witnessed_actions?.[Math.floor(Math.random() * template.witnessed_actions.length)] || 'something';
        break;
      case 'action_choices':
        replacement = template.action_choices?.[Math.floor(Math.random() * template.action_choices.length)] || 'act';
        break;
      case 'vulnerable_person':
        replacement = template.vulnerable_persons?.[Math.floor(Math.random() * template.vulnerable_persons.length)] || 'someone';
        break;
      case 'problem':
        replacement = template.problems?.[Math.floor(Math.random() * template.problems.length)] || 'a problem';
        break;
      case 'risk':
        replacement = template.risks?.[Math.floor(Math.random() * template.risks.length)] || 'risk';
        break;
      case 'crime_type':
        replacement = template.crime_types?.[Math.floor(Math.random() * template.crime_types.length)] || 'a crime';
        break;
      case 'consequence':
        replacement = template.consequences?.[Math.floor(Math.random() * template.consequences.length)] || 'consequences';
        break;
      case 'unethical_action':
        replacement = template.unethical_actions?.[Math.floor(Math.random() * template.unethical_actions.length)] || 'something unethical';
        break;
      case 'justification':
        replacement = template.justifications?.[Math.floor(Math.random() * template.justifications.length)] || 'a reason';
        break;
      case 'faction':
        replacement = template.factions?.[Math.floor(Math.random() * template.factions.length)] || 'a faction';
        break;
      case 'benefit':
        replacement = template.benefits?.[Math.floor(Math.random() * template.benefits.length)] || 'benefits';
        break;
      case 'venue_name':
        replacement = template.venue_names?.[Math.floor(Math.random() * template.venue_names.length)] || 'the venue';
        break;
      case 'incident_type':
        replacement = template.incident_types?.[Math.floor(Math.random() * template.incident_types.length)] || 'an incident';
        break;
      default:
        replacement = 'something';
    }
    
    description = description.replace(variable, replacement);
  }
  
  // Generate choices based on template type
  const choices = generateTemplateChoices(templateName, gameState, context);
  
  return {
    id: `template_${templateName}_${Date.now()}`,
    category: getTemplateCategory(templateName),
    title: getTemplateTitle(templateName),
    maturityLevel: 'mature',
    risk: 'medium',
    description,
    choices
  };
};

/**
 * Generate choices for a template-based event
 */
const generateTemplateChoices = (templateName, gameState, context) => {
  const baseChoices = [
    {
      id: 'ethical_choice',
      text: 'Take the ethical path',
      riskLevel: 'low',
      immediateEffects: {},
      psychologicalEffects: {
        moral_integrity: 15,
        stress: 5
      }
    },
    {
      id: 'pragmatic_choice',
      text: 'Be pragmatic',
      riskLevel: 'medium',
      immediateEffects: {},
      psychologicalEffects: {
        stress: 10
      }
    },
    {
      id: 'corrupt_choice',
      text: 'Accept the offer',
      riskLevel: 'high',
      immediateEffects: {},
      psychologicalEffects: {
        moral_integrity: -20,
        paranoia: 15,
        stress: 15
      }
    }
  ];
  
  // Customize based on template type
  if (templateName === 'substance_temptation') {
    return [
      {
        id: 'refuse',
        text: 'Refuse',
        riskLevel: 'low',
        psychologicalEffects: { moral_integrity: 10 }
      },
      {
        id: 'try_once',
        text: 'Try it once',
        riskLevel: 'high',
        immediateEffects: { creativity: 15, stress: -20 },
        psychologicalEffects: { addiction_risk: 25, moral_integrity: -10 }
      },
      {
        id: 'embrace',
        text: 'Embrace it',
        riskLevel: 'extreme',
        immediateEffects: { creativity: 25, stress: -30 },
        psychologicalEffects: { addiction_risk: 40, moral_integrity: -25 }
      }
    ];
  }
  
  return baseChoices;
};

/**
 * Get category for template
 */
const getTemplateCategory = (templateName) => {
  const categoryMap = {
    corruption_offer: 'criminal_activity',
    substance_temptation: 'substance_abuse',
    moral_crossroads: 'general',
    faction_encounter: 'general',
    venue_incident: 'violence'
  };
  return categoryMap[templateName] || 'general';
};

/**
 * Get title for template
 */
const getTemplateTitle = (templateName) => {
  const titleMap = {
    corruption_offer: 'An Offer',
    substance_temptation: 'Temptation',
    moral_crossroads: 'A Choice',
    faction_encounter: 'Faction Contact',
    venue_incident: 'Venue Incident'
  };
  return titleMap[templateName] || 'An Event';
};

export default SCENARIO_TEMPLATES;
