# ENHANCED EVENT SYSTEM IMPLEMENTATION GUIDE
## Integrating Gritty Dialogue with Game Mechanics

This guide shows how to implement the enhanced dialogue system with proper content warnings, consequence tracking, and psychological depth.

---

## EVENT STRUCTURE & CATEGORIZATION

### Event Categories with Maturity Levels
```javascript
const EVENT_CATEGORIES = {
  // Base game events (existing system)
  equipment: { maturityLevel: 'teen', contentWarning: null },
  business: { maturityLevel: 'teen', contentWarning: null },
  creative: { maturityLevel: 'teen', contentWarning: null },
  
  // Enhanced gritty events
  substance_abuse: { 
    maturityLevel: 'mature', 
    contentWarning: ['drug_use', 'addiction', 'overdose'],
    unlockRequirement: { fame: 50, playerConsent: true }
  },
  sexual_content: { 
    maturityLevel: 'mature', 
    contentWarning: ['sexual_situations', 'power_dynamics', 'age_gaps'],
    unlockRequirement: { fame: 75, playerConsent: true }
  },
  criminal_activity: { 
    maturityLevel: 'mature', 
    contentWarning: ['illegal_activity', 'violence', 'moral_corruption'],
    unlockRequirement: { fame: 100, playerConsent: true }
  },
  psychological_horror: { 
    maturityLevel: 'mature', 
    contentWarning: ['stalking', 'mental_illness', 'psychological_abuse'],
    unlockRequirement: { fame: 150, playerConsent: true }
  },
  industry_corruption: { 
    maturityLevel: 'mature', 
    contentWarning: ['financial_exploitation', 'corruption'],
    unlockRequirement: { labelDeal: true, playerConsent: true }
  }
};
```

### Enhanced Event Object Structure
```javascript
const ENHANCED_EVENT_TEMPLATE = {
  id: 'event_substance_first_hit',
  category: 'substance_abuse',
  title: 'First Hit',
  maturityLevel: 'mature',
  contentWarnings: ['drug_use', 'peer_pressure'],
  
  // Trigger conditions
  triggers: {
    fame: { min: 30, max: 100 },
    venue_types: ['dive_bar', 'warehouse_rave'],
    band_personalities: ['party_animal', 'rebel'],
    required_choices: [], // Previous choices that must have been made
    cooldown: 12 // weeks before this can trigger again
  },
  
  // Event text with dynamic elements
  description: `Your guitarist comes up to you after the show, pupils dilated, talking faster than usual. "Dude, you HAVE to try this. I've never felt so... connected to the music. Like I could see the sound waves, you know?" 

They're holding out a small baggie. The venue's still buzzing with post-show energy, and several industry people are watching your interaction.`,
  
  // Enhanced choice system
  choices: [
    {
      id: 'take_drugs',
      text: '"Just a taste" (Risky)',
      riskLevel: 'high',
      requirements: null,
      
      // Immediate effects
      immediateEffects: {
        bandStats: { creativity: +15 },
        memberStats: { 
          guitarist: { addiction_risk: +20, creativity: +10 },
          player: { addiction_risk: +20, creativity: +10 }
        },
        reputation: { underground: +5, mainstream: -2 }
      },
      
      // Long-term consequences
      longTermEffects: {
        duration: 21, // weeks
        recurringEvents: ['substance_use_opportunity'],
        addiction_escalation: 0.15, // 15% chance per week of escalation
        unlock_events: ['rock_bottom', 'overdose_scare']
      },
      
      // Narrative tracking
      narrativeTags: ['drug_user', 'risk_taker', 'peer_influenced'],
      
      logMessage: "You and your guitarist shared something stronger than music tonight. The creative high was incredible, but at what cost?"
    },
    
    {
      id: 'refuse_personally',
      text: '"Not my thing, but you do you"',
      riskLevel: 'low',
      
      immediateEffects: {
        memberStats: { 
          guitarist: { addiction_risk: +10, loyalty: -5 },
          player: { moral_integrity: +5 }
        },
        bandChemistry: -10
      },
      
      longTermEffects: {
        duration: 8,
        recurringEvents: ['member_solo_drug_use'],
        unlock_events: ['intervention_needed']
      },
      
      narrativeTags: ['moral_restraint', 'non_user', 'observer'],
      
      logMessage: "You stayed clean while your guitarist explored new highs. The divide in the band is subtle but growing."
    }
    // ... more choices
  ],
  
  // Follow-up events based on choices
  followUpEvents: {
    'take_drugs': ['addiction_escalation', 'creative_breakthrough', 'industry_scrutiny'],
    'refuse_personally': ['guitarist_resentment', 'moral_authority'],
    'intervention': ['band_meeting', 'relationship_strain']
  }
};
```

---

## CONTENT WARNING SYSTEM

### Player Consent & Filtering
```javascript
// Content preferences stored in player profile
const ContentPreferences = {
  // Initial setup screen
  showContentWarnings: true,
  
  // Granular control over mature themes
  allowedContent: {
    substance_abuse: false,  // Player opts in
    sexual_content: false,
    criminal_activity: false,
    psychological_themes: true,
    violence: false,
    financial_corruption: true
  },
  
  // Replacement behavior for filtered content
  replacementMode: 'fade_to_black', // 'skip_entirely', 'sanitized_version', 'fade_to_black'
  
  // Age verification (required for mature content)
  ageVerified: false,
  birthYear: null
};

// Content warning modal component
const ContentWarningModal = ({ event, onProceed, onSkip, onDisableCategory }) => {
  const warnings = event.contentWarnings.map(warning => CONTENT_WARNING_DESCRIPTIONS[warning]);
  
  return (
    <div className="content-warning-modal">
      <div className="warning-header">
        <AlertTriangle size={24} color="#f59e0b" />
        <h3>Content Warning</h3>
      </div>
      
      <div className="warning-content">
        <p>This event contains mature themes including:</p>
        <ul>
          {warnings.map(warning => (
            <li key={warning.id}>{warning.description}</li>
          ))}
        </ul>
        
        <div className="maturity-rating">
          <strong>Maturity Rating: {event.maturityLevel.toUpperCase()}</strong>
        </div>
      </div>
      
      <div className="warning-choices">
        <button className="btn-secondary" onClick={onSkip}>
          Skip This Event
        </button>
        <button className="btn danger" onClick={onDisableCategory}>
          Disable All {event.category} Events
        </button>
        <button className="btn" onClick={onProceed}>
          I Understand - Proceed
        </button>
      </div>
      
      <div className="disclaimer">
        <small>
          This content is fictional and not an endorsement of real-world behavior. 
          If you're struggling with similar issues, resources are available at [support links].
        </small>
      </div>
    </div>
  );
};

const CONTENT_WARNING_DESCRIPTIONS = {
  drug_use: { 
    id: 'drug_use',
    description: "Depictions of illegal drug use and substance abuse"
  },
  addiction: { 
    id: 'addiction',
    description: "Realistic portrayals of addiction and its consequences"
  },
  sexual_situations: { 
    id: 'sexual_situations',
    description: "Adult sexual situations and relationships"
  },
  violence: { 
    id: 'violence',
    description: "Physical violence and aggressive confrontations"
  },
  psychological_abuse: { 
    id: 'psychological_abuse',
    description: "Manipulative behavior and psychological trauma"
  },
  financial_exploitation: { 
    id: 'financial_exploitation',
    description: "Industry corruption and financial manipulation"
  }
};
```

### Age-Appropriate Alternatives
```javascript
// Sanitized versions for younger players
const SanitizedEvents = {
  'substance_abuse': {
    'first_hit': {
      description: "Your guitarist suggests trying an energy drink mix that's popular with other musicians. 'It really helps with focus and creativity,' they say.",
      choices: [
        { text: "Try the energy drink", effects: { energy: +10, crash_risk: +5 }},
        { text: "Stick to coffee", effects: { steady_energy: true }},
      ]
    }
  },
  
  'sexual_content': {
    'groupie_situation': {
      description: "A young fan wants to hang out after the show, but they seem overly attached and their behavior makes you uncomfortable.",
      choices: [
        { text: "Politely decline and suggest they talk to security", effects: { safety: +10, fan_respect: +5 }},
        { text: "Chat briefly but maintain boundaries", effects: { fan_connection: +5 }}
      ]
    }
  }
};
```

---

## PSYCHOLOGICAL STATE TRACKING

### Mental Health System
```javascript
const PsychologicalState = {
  // Core mental health metrics
  stress_level: 0,        // 0-100, affects decision making
  addiction_risk: 0,      // 0-100, susceptibility to substances
  moral_integrity: 100,   // 100-0, willingness to compromise ethics
  paranoia: 0,           // 0-100, affects trust and relationships
  depression: 0,         // 0-100, affects motivation and creativity
  
  // Specific trauma tracking
  trauma_history: [],     // Events that caused lasting psychological impact
  coping_mechanisms: [],  // Healthy/unhealthy ways player has dealt with stress
  
  // Support system
  support_network: {
    family_contact: 100,    // 100-0, relationship with family
    friend_relationships: 100, // 100-0, maintain non-industry friendships
    professional_help: false,  // Has therapist/counselor
    mentor_figures: []          // Industry mentors or role models
  }
};

// Mental health affects event outcomes
const applyPsychologicalModifiers = (event, choice, playerState) => {
  let modifiedEffects = { ...choice.effects };
  
  // High stress makes bad decisions more likely
  if (playerState.psychological.stress_level > 70) {
    modifiedEffects.risk_multiplier = 1.5;
    modifiedEffects.poor_judgment_chance = 0.3;
  }
  
  // Addiction affects decision making
  if (playerState.psychological.addiction_risk > 50) {
    // More likely to choose substance-related options
    if (choice.id.includes('drug') || choice.id.includes('alcohol')) {
      modifiedEffects.compulsion_bonus = 0.4;
    }
  }
  
  // Moral integrity affects available choices
  if (playerState.psychological.moral_integrity < 30) {
    // Unlock criminal/corrupt options that weren't available before
    event.choices.forEach(choice => {
      if (choice.requiredMorality && choice.requiredMorality < playerState.psychological.moral_integrity) {
        choice.available = true;
      }
    });
  }
  
  return modifiedEffects;
};
```

### Consequence Tracking System
```javascript
const ConsequenceTracker = {
  // Short-term effects (1-4 weeks)
  immediate: {
    active_effects: [], // Currently affecting player
    expiring_effects: [] // Will end soon
  },
  
  // Long-term consequences (months to years)
  permanent: {
    reputation_changes: [], // Industry perception shifts
    relationship_damage: [], // Burned bridges
    health_effects: [],      // Lasting physical/mental health impacts
    legal_issues: []         // Criminal records, lawsuits, etc.
  },
  
  // Narrative threads
  ongoing_storylines: [], // Multi-part story arcs
  dormant_storylines: [], // Inactive threads that could resurface
  
  // Player archetype tracking
  player_archetype: {
    primary: null, // 'saint', 'rebel', 'sellout', 'addict', 'survivor', etc.
    secondary: null,
    reputation_modifiers: {} // How different groups perceive you
  }
};

// Example: Tracking addiction progression
const AddictionProgression = {
  stages: {
    experimental: { threshold: 0, effects: { creativity: +5, risk: 0.1 }},
    regular_use: { threshold: 30, effects: { creativity: +10, reliability: -10, risk: 0.25 }},
    dependent: { threshold: 60, effects: { creativity: +15, health: -20, reliability: -25, risk: 0.5 }},
    addicted: { threshold: 85, effects: { creativity: -10, health: -40, reliability: -50, risk: 0.8 }}
  },
  
  // Recovery tracking
  recovery: {
    clean_time: 0, // weeks clean
    relapse_risk: 0.8, // starts high
    support_factors: [], // therapy, family, etc.
    trigger_events: [] // situations that increase relapse risk
  }
};
```

---

## EVENT PROGRESSION & NARRATIVE ARCS

### Multi-Part Storylines
```javascript
const NARRATIVE_ARCS = {
  addiction_spiral: {
    stages: [
      'first_exposure',
      'regular_use', 
      'dependency_development',
      'rock_bottom',
      'intervention_or_death',
      'recovery_attempt',
      'relapse_or_sobriety'
    ],
    
    // Each stage unlocks specific events
    stage_events: {
      first_exposure: ['peer_pressure_drugs', 'party_drugs', 'prescription_abuse'],
      regular_use: ['hiding_usage', 'performance_enhancement', 'tolerance_building'],
      dependency_development: ['withdrawl_symptoms', 'stealing_for_drugs', 'relationship_damage'],
      rock_bottom: ['overdose', 'arrest', 'band_ultimatum', 'health_crisis'],
      intervention_or_death: ['family_intervention', 'band_intervention', 'fatal_overdose'],
      recovery_attempt: ['rehab_entry', 'cold_turkey', 'therapy_start'],
      relapse_or_sobriety: ['sobriety_celebration', 'relapse_trigger', 'sponsor_relationship']
    }
  },
  
  corruption_path: {
    stages: [
      'first_compromise',
      'moral_flexibility', 
      'active_corruption',
      'deep_involvement',
      'exposure_or_kingpin'
    ],
    
    stage_events: {
      first_compromise: ['small_bribe', 'favor_for_friend', 'white_lie'],
      moral_flexibility: ['bigger_lies', 'looking_other_way', 'cutting_corners'],
      active_corruption: ['taking_bribes', 'illegal_deals', 'blackmail'],
      deep_involvement: ['criminal_enterprise', 'violence_orders', 'witness_intimidation'],
      exposure_or_kingpin: ['investigation', 'media_exposure', 'criminal_empire']
    }
  }
};

// Dynamic event selection based on narrative state
const selectNextEvent = (gameState, narrativeState) => {
  // Check for continuing storylines first
  const activeArcs = narrativeState.ongoing_storylines;
  
  for (let arc of activeArcs) {
    const nextStageEvents = NARRATIVE_ARCS[arc.type].stage_events[arc.current_stage];
    const availableEvents = nextStageEvents.filter(eventId => 
      checkEventTriggers(EVENTS[eventId], gameState)
    );
    
    if (availableEvents.length > 0) {
      return selectRandomEvent(availableEvents, arc.urgency_weight);
    }
  }
  
  // Otherwise, check for new storyline triggers
  return selectRandomEvent(getTriggeredEvents(gameState));
};
```

---

## IMPLEMENTATION IN YOUR EXISTING SYSTEM

### Integration with Current App.jsx
```javascript
// Add these new state variables to your existing useState declarations
const [playerContentPrefs, setPlayerContentPrefs] = useState(ContentPreferences);
const [psychologicalState, setPsychologicalState] = useState(PsychologicalState);
const [narrativeTracker, setNarrativeTracker] = useState(ConsequenceTracker);
const [showContentWarning, setShowContentWarning] = useState(false);
const [pendingMatureEvent, setPendingMatureEvent] = useState(null);

// Enhanced event handling function
const handleEnhancedEvent = (event) => {
  // Check content filtering
  if (event.maturityLevel === 'mature') {
    if (!playerContentPrefs.allowedContent[event.category]) {
      // Show sanitized version or skip
      const sanitizedEvent = SanitizedEvents[event.category]?.[event.id];
      if (sanitizedEvent && playerContentPrefs.replacementMode === 'sanitized_version') {
        handleEvent(sanitizedEvent);
        return;
      } else {
        // Skip entirely
        return;
      }
    } else {
      // Show content warning
      setPendingMatureEvent(event);
      setShowContentWarning(true);
      return;
    }
  }
  
  // Process normal event
  processEvent(event);
};

const processEvent = (event) => {
  // Apply psychological modifiers
  const modifiedEvent = applyPsychologicalModifiers(event, psychologicalState);
  
  // Set current event with enhanced tracking
  setCurrentEvent({
    ...modifiedEvent,
    timestamp: Date.now(),
    gameWeek: state.week,
    narrativeContext: narrativeTracker.ongoing_storylines
  });
};

// Enhanced choice handling
const handleEventChoice = (event, choice) => {
  // Apply immediate effects
  const modifiedEffects = applyPsychologicalModifiers(event, choice, state);
  
  setState(prev => {
    const newState = { ...prev };
    
    // Apply standard effects (existing system)
    applyStandardEffects(newState, modifiedEffects);
    
    // Apply psychological effects
    if (modifiedEffects.psychological) {
      Object.keys(modifiedEffects.psychological).forEach(key => {
        newState.psychological[key] = Math.max(0, Math.min(100, 
          newState.psychological[key] + modifiedEffects.psychological[key]
        ));
      });
    }
    
    // Update narrative tracking
    updateNarrativeTracking(choice, event);
    
    return newState;
  });
  
  // Schedule long-term consequences
  if (choice.longTermEffects) {
    scheduleLongTermEffects(choice.longTermEffects, event.id, choice.id);
  }
  
  // Update storyline progression
  progressNarrativeArcs(choice, event);
};
```

### Enhanced Logging System
```javascript
const EnhancedLogEntry = {
  id: 'log_entry_id',
  week: state.week,
  type: 'event_outcome', // 'event_outcome', 'consequence', 'milestone'
  severity: 'major', // 'minor', 'moderate', 'major', 'critical'
  category: 'substance_abuse',
  
  // Rich text with emotional context
  message: "You and your guitarist shared something stronger than music tonight.",
  emotional_tone: 'ominous', // 'positive', 'negative', 'neutral', 'ominous', 'tragic'
  
  // Consequence tracking
  immediate_effects: { creativity: +15, addiction_risk: +20 },
  long_term_implications: ['addiction_spiral', 'creative_breakthrough'],
  
  // Narrative significance
  narrative_weight: 'high', // 'low', 'medium', 'high', 'critical'
  character_development: ['risk_taking', 'peer_influence'],
  
  // UI presentation
  icon: 'substance_warning',
  color_theme: 'danger',
  persistent: true // Show in timeline permanently
};
```

---

This implementation guide ensures that your enhanced gritty dialogue integrates seamlessly with your existing game while adding sophisticated psychological depth, proper content filtering, and meaningful long-term consequences that make every choice feel weighty and important.

The system transforms your game from a music business simulation into a psychological character study about the price of fame and the choices that define who we become.
