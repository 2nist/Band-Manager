/**
 * PHASE 2: WEEK 1 CONSEQUENCE-BASED EVENTS
 * 
 * 5 foundational events that test the consequence system
 * These events create cascading effects throughout the game
 */

export const WEEK1_CONSEQUENCE_EVENTS = {
  // ========== EVENT 1: Small Bribe Offer ==========
  small_bribe_offer: {
    id: 'small_bribe_offer',
    title: 'Easy Money',
    category: 'moral_choice',
    maturityLevel: 'teen',
    week: 10,
    
    description: `A promoter at the venue after your show pulls you aside. "Look, you guys played great tonight. Got a real following here." He slides an envelope across the table. "5 grand. Just one small favor - tomorrow night, let some friends of mine use your van to transport 'merchandise.'"

He's not specific about what the merchandise is. You don't want to know.

"No questions, no risk. Van returns in the morning, untouched. Then we never talk about this again."

Your bassist is in the corner, desperate for new equipment. Your guitarist needs rent money.`,

    choices: [
      {
        id: 'accept_small_bribe',
        text: 'Take the money - $5,000',
        consequences: {
          immediate: {
            money: +5000
          },
          psychological: {
            moral_integrity: -15,
            stress: +10
          },
          narrative: {
            firstStepIntoUnderworld: true
          }
        },
        triggerConsequence: {
          id: 'corruption_path_started',
          type: 'active',
          triggerChoice: 'accept_small_bribe',
          currentStage: 'minor_temptation',
          escalationDelay: 10,
          escalationEvents: ['bigger_bribe_offer', 'criminal_contact', 'subtle_threats'],
          recoveryPossible: true,
          recoveryDifficulty: 0.3,
          severity: 'low',
          tags: ['corruption', 'criminal', 'morally_questionable']
        },
        addDormantConsequence: {
          id: 'law_enforcement_suspicious',
          type: 'dormant',
          resurfaceConditions: {
            fameLevels: [200],
            eventTypes: ['police_inquiry', 'investigation_started'],
            probability: 0.4
          },
          resurfaceEvents: ['police_investigation_begins', 'witness_questioned', 'criminal_ties_exposed'],
          resurrectProbability: 0.5
        },
        factionEffects: {
          criminal_underworld: +20,
          law_enforcement: -5,
          corporate_industry: -10
        },
        psychologyEffects: {
          corruption: { currentLevel: 15 }
        },
        riskLevel: 'moderate',
        pointOfNoReturn: false
      },

      {
        id: 'refuse_bribe',
        text: 'Refuse - "We don\'t do that"',
        consequences: {
          psychological: {
            moral_integrity: +10,
            stress: -5
          }
        },
        factionEffects: {
          law_enforcement: +5,
          criminal_underworld: -10
        },
        riskLevel: 'low',
        immediateConsequence: 'The promoter nods slowly. "That\'s unfortunate. But people remember those who help them... and those who don\'t."'
      },

      {
        id: 'negotiate_terms',
        text: 'Negotiate for more money',
        requirements: {
          reputation: { confidence: 30 }
        },
        consequences: {
          money: +8500,
          psychological: {
            moral_integrity: -20,
            stress: +20
          }
        },
        factionEffects: {
          criminal_underworld: +35,
          law_enforcement: -15
        },
        triggerConsequence: {
          id: 'corruption_path_started',
          type: 'active',
          currentStage: 'accelerated_corruption',
          escalationDelay: 6, // Escalates faster if you negotiate
          severity: 'medium'
        },
        riskLevel: 'high',
        specialEffect: 'You\'ve made them respect you. Now they expect more.'
      }
    ]
  },

  // ========== EVENT 2: Band Intervention Crisis ==========
  band_intervention: {
    id: 'band_intervention',
    title: 'The Confrontation',
    category: 'relationship_crisis',
    maturityLevel: 'mature',
    week: 20,
    
    prerequisites: {
      psychologicalState: {
        stressLevel: 60, // Player needs to be stressed
        moraleIntegrity: 60 // Below this triggers intervention pressure
      },
      bandRelationship: { loyalty: 40 },
      eventHistory: ['missed_shows', 'unreliable_behavior']
    },

    description: `You wake up in your apartment to an unwelcome surprise. Your drummer, bassist, and guitarist are sitting in your living room with your manager and a woman in professional clothing.

"We can't do this anymore," your drummer says, and their voice breaks. "Three shows last month. Two of them you were... not yourself."

The woman stands up. "I'm Dr. Sarah Chen. I'm an addictions specialist. Your friends contacted me because they're worried about you."

Your manager slides a folder across the table. Photos. Videos. You, stumbling off stage. You, missing soundcheck. You, saying things you don't remember.

"You have two choices," the doctor says quietly. "Get help, or we're done. All of us. That's what they came here to tell you."

The guitarist can't meet your eyes. They've already made their choice.`,

    choices: [
      {
        id: 'accept_treatment',
        text: 'Accept help - Check into rehab',
        consequences: {
          immediate: {
            weeksInTreatment: 8,
            money: -25000, // Treatment cost
            bandLeadership: 'temporary_leave'
          },
          psychological: {
            addiction_risk: -40,
            stress: -30,
            hope: +50
          },
          narrative: {
            recoveryJourneyStarted: true,
            choiceType: 'redemption_path'
          }
        },
        triggerConsequence: {
          id: 'recovery_journey_active',
          type: 'active',
          currentStage: 'treatment_phase',
          escalationEvents: ['treatment_progress', 'challenging_moment', 'breakthrough'],
          recoveryPossible: true,
          severity: 'high'
        },
        factionEffects: {
          law_enforcement: +10,
          corporate_industry: +15,
          underground_scene: +5
        },
        psychologyEffects: {
          addiction: { stages: ['clean'], severity: -40 }
        },
        bandRelationshipEffect: { loyalty: +50, respect: +40 },
        riskLevel: 'low',
        pointOfNoReturn: false,
        specialStatus: 'in_recovery'
      },

      {
        id: 'refuse_angrily',
        text: '"This is betrayal! I don\'t need help!"',
        consequences: {
          psychological: {
            addiction_risk: +15,
            paranoia: +30,
            isolation: +40,
            bitterness: +50
          },
          narrative: {
            bandDamaged: true,
            choiceType: 'downward_spiral'
          }
        },
        triggerConsequence: {
          id: 'band_dissolution_threat',
          type: 'active',
          currentStage: 'critical',
          escalationEvents: ['band_breaks_up', 'solo_addiction_spiral', 'overdose_scare'],
          recoveryPossible: false,
          severity: 'extreme'
        },
        addDormantConsequence: {
          id: 'bandmate_guilt_later',
          type: 'dormant',
          resurfaceConditions: {
            eventTypes: ['success_achieved', 'bandmate_encounter', 'fame_peak'],
            probability: 0.8
          },
          resurfaceEvents: ['regret_and_remorse', 'reconciliation_attempt', 'bittersweet_reunion']
        },
        factionEffects: {
          underground_scene: -20,
          corporate_industry: -30
        },
        bandRelationshipEffect: { loyalty: -60, respect: -50, trust: -70 },
        riskLevel: 'extreme',
        pointOfNoReturn: true,
        specialEffect: 'You\'ve burned a bridge that may never be repaired.'
      },

      {
        id: 'promise_self_recovery',
        text: 'Promise to quit on your own',
        consequences: {
          psychological: {
            addiction_risk: +5, // Minimal immediate change
            willpower: -10 // Self-directed recovery is harder
          },
          narrative: {
            choiceType: 'false_hope'
          }
        },
        triggerConsequence: {
          id: 'failed_self_recovery',
          type: 'dormant',
          resurfaceConditions: {
            eventTypes: ['stress_event', 'creative_block', 'peer_pressure'],
            probability: 0.8
          },
          resurfaceEvents: ['relapse_happens', 'addiction_escalates', 'rock_bottom'],
          resurrectProbability: 0.85 // Very high chance of failure
        },
        factionEffects: {
          underground_scene: -10
        },
        bandRelationshipEffect: { trust: -20 },
        riskLevel: 'high',
        specialEffect: 'They want to believe you. But you can see the doubt in their eyes.'
      }
    ]
  },

  // ========== EVENT 3: Criminal Contact Escalation ==========
  criminal_escalation_offer: {
    id: 'criminal_escalation_offer',
    title: 'Big Money Offer',
    category: 'criminal_activity',
    maturityLevel: 'mature',
    week: 25,
    
    prerequisites: {
      consequences: {
        hasActive: 'corruption_path_started'
      },
      psychologicalState: {
        corruptionLevel: 20 // Must have started corruption path
      },
      factionStanding: {
        criminal_underworld: 20 // Criminals trust you somewhat
      },
      minWeeksSince: 10 // At least 10 weeks since small bribe
    },

    description: `The man in the expensive suit doesn't look like the small-time operators you've dealt with before. His office overlooks the city. The view alone costs more than you've made in your entire career.

He doesn't shake your hand. Just gestures to a chair.

"You've been reliable. That matters in my line of work. Reliability is rarer than talent." He slides a briefcase across his desk. "Fifty thousand a month. All you do is let us use your tour buses. Equipment transports, nothing more."

You both know that's a lie. These aren't tour supplies.

"Of course," he continues, "once you're in at this level, walking away becomes complicated. But look around. Does this look like poverty?"

Through the window, you see a black sedan with tinted windows. Two men in dark suits lean against it, watching your building.`,

    choices: [
      {
        id: 'accept_major_crime',
        text: 'Accept - $50,000/month income',
        consequences: {
          immediate: {
            monthlyIncome: +50000,
            money: +50000
          },
          psychological: {
            moral_integrity: -35,
            paranoia: +25,
            stress: +30
          },
          narrative: {
            pointOfNoReturn: true,
            choiceType: 'criminal_commitment'
          }
        },
        triggerConsequence: {
          id: 'criminal_partnership_active',
          type: 'active',
          currentStage: 'criminal_lieutenant',
          escalationDelay: 12,
          escalationEvents: ['violent_enforcement', 'federal_investigation', 'betrayal_threat'],
          recoveryPossible: false,
          severity: 'extreme'
        },
        addDormantConsequence: {
          id: 'federal_investigation_threat',
          type: 'dormant',
          resurfaceConditions: {
            fameLevels: [250],
            eventTypes: ['police_activity', 'investigation_launched'],
            probability: 0.7
          },
          resurfaceEvents: ['fbi_investigation_begins', 'criminal_asset_seized', 'arrest_warrant'],
          resurrectProbability: 0.9
        },
        factionEffects: {
          criminal_underworld: +50,
          law_enforcement: -60,
          corporate_industry: -40,
          underground_scene: -30
        },
        psychologyEffects: {
          corruption: { currentLevel: 50 }
        },
        bandRelationshipEffect: { trust: -40, loyalty: -30 },
        riskLevel: 'extreme',
        pointOfNoReturn: true,
        specialEffect: 'You\'ve crossed a line you can\'t uncross.'
      },

      {
        id: 'negotiate_protection',
        text: 'Negotiate for exit clause and protection',
        requirements: { reputation: { streetCred: 50 } },
        consequences: {
          monthlyIncome: +75000,
          psychological: {
            moral_integrity: -30,
            confidence: +20,
            paranoia: +35
          }
        },
        triggerConsequence: {
          id: 'criminal_lieutenant_status',
          type: 'active',
          currentStage: 'valued_partner',
          escalationDelay: 14,
          severity: 'extreme'
        },
        factionEffects: {
          criminal_underworld: +65,
          law_enforcement: -70
        },
        riskLevel: 'extreme',
        specialEffect: 'They respect your ambition. But you\'re still trapped.'
      },

      {
        id: 'refuse_and_report',
        text: 'Refuse and go to the police',
        consequences: {
          psychological: {
            moral_integrity: +50,
            stress: +80,
            paranoia: +60
          },
          narrative: {
            witnessProgramConsideration: true
          }
        },
        triggerConsequence: {
          id: 'criminal_retaliation_threat',
          type: 'active',
          currentStage: 'target',
          escalationDelay: 2,
          escalationEvents: ['violent_retaliation', 'witness_threats', 'property_damage'],
          recoveryPossible: false,
          severity: 'extreme'
        },
        factionEffects: {
          criminal_underworld: -100,
          law_enforcement: +50
        },
        riskLevel: 'extreme',
        specialEffect: 'You\'ve made a dangerous enemy. Running might be your only option.'
      }
    ]
  },

  // ========== EVENT 4: Underground Respect Event ==========
  underground_legend_recognition: {
    id: 'underground_legend_recognition',
    title: 'Street Cred Legend',
    category: 'faction_recognition',
    maturityLevel: 'teen',
    week: 18,
    
    prerequisites: {
      factionStanding: {
        underground_scene: 70
      },
      venueHistory: ['warehouse_rave', 'dive_bar', 'basement'],
      authenticationScore: 70
    },

    description: `You're loading out after your basement show when someone approaches you. Maya "Riot" Rodriguez. You recognize her immediately - the legendary promoter who discovered half the underground scene.

She's been booking illegal shows for twenty years. Never sold out.

"Kid," she says, shaking your hand firmly, "I've been watching you. You play real music in real places for real people. That's rare these days." 

She hands you a black card with no text, just a symbol.

"This gets you into any underground show in the country. More than that - it means the scene accepts you as family. We take care of our own."

Behind her, a group of scene veterans nod in approval. You recognize a few - people who've been building the underground for decades.`,

    choices: [
      {
        id: 'accept_legend_status',
        text: 'Accept the recognition',
        consequences: {
          narrative: {
            undergroundLegendStatus: true
          },
          reputation: {
            underground: +50,
            authenticity: +30
          }
        },
        triggerConsequence: {
          id: 'underground_protection_active',
          type: 'active',
          currentStage: 'established_legend',
          escalationEvents: ['scene_mentorship', 'legacy_building', 'underground_empire'],
          recoveryPossible: true,
          severity: 'positive'
        },
        factionEffects: {
          underground_scene: +40
        },
        specialBenefits: [
          'Free access to underground venues worldwide',
          'Underground scene protection from violence',
          'Authentic collaboration opportunities',
          'Resistance to corporate pressure'
        ],
        riskLevel: 'none',
        specialStatus: 'underground_legend'
      }
    ]
  },

  // ========== EVENT 5: Industry Scandal Exposure ==========
  industry_scandal_exposure: {
    id: 'industry_scandal_exposure',
    title: 'Exposed',
    category: 'reputation_damage',
    maturityLevel: 'mature',
    week: 22,
    
    prerequisites: {
      factionStanding: {
        corporate_industry: 10 // Low corporate standing helps
      },
      fameThreshold: 150,
      scandalouspastBehavior: true
    },

    description: `Your manager calls at 2 AM, which is never good.

"We have a problem," she says, and you can hear her crying. "Major industry publication just dropped a story. It's about... everything. The money you stole from the old manager. The drugs at the Vegas show. The assault allegation from three years ago."

You feel your stomach drop.

"The streaming platforms are removing your music. Radio stations are dropping you. Every corporate sponsor is backing out. Your tour is being cancelled."

In the background, you can hear her scrolling through angry Twitter threads. Your photo is trending. Not in a good way.

The industry has made a decision: you're toxic. And they're cutting you loose completely.`,

    choices: [
      {
        id: 'embrace_outlaw_status',
        text: 'Become an industry outlaw',
        consequences: {
          reputation: {
            underground: +40,
            authenticity: +50,
            mainstream: -100
          },
          revenue: {
            corporateDealsLost: -100,
            radioRoyaltiesLost: -80,
            streamingCutoff: -60
          },
          narrative: {
            outlaw_status: true,
            industryExile: true
          }
        },
        triggerConsequence: {
          id: 'outlaw_career_path',
          type: 'active',
          currentStage: 'exile',
          escalationEvents: ['independent_empire_building', 'antiestablishment_hero', 'legend_status'],
          recoveryPossible: false,
          severity: 'high'
        },
        factionEffects: {
          underground_scene: +50,
          corporate_industry: -100,
          criminal_underworld: +20
        },
        riskLevel: 'medium',
        specialEffect: 'You\'ve lost the mainstream, but gained the underground.'
      },

      {
        id: 'attempt_redemption',
        text: 'Try to rebuild your reputation',
        consequences: {
          money: -50000, // PR campaign
          psychological: {
            dignity: -20,
            stress: +40
          }
        },
        triggerConsequence: {
          id: 'redemption_attempt',
          type: 'dormant',
          resurfaceConditions: {
            eventTypes: ['public_good_deed', 'charity_work', 'apology_accepted'],
            probability: 0.3
          },
          resurfaceEvents: ['reputation_repair_progress', 'public_forgiveness', 'comeback_opportunity'],
          resurrectProbability: 0.3 // Only 30% chance of redemption
        },
        factionEffects: {
          corporate_industry: +10 // Slight improvement
        },
        riskLevel: 'high',
        specialEffect: 'The industry is willing to listen... but trust is harder to rebuild than destroy.'
      }
    ]
  }
};

// ==================== WEEK 1 EVENT INTEGRATION ====================

/**
 * Function to queue Week 1 events based on player choices and game state
 */
export const initializeWeek1Events = (gameState) => {
  const eventsToQueue = [];

  // Always available after first few weeks
  if (gameState.week >= 10) {
    eventsToQueue.push(WEEK1_CONSEQUENCE_EVENTS.small_bribe_offer);
  }

  // Available when player shows stress
  if (gameState.week >= 20 && gameState.psychologicalState?.stressLevel > 50) {
    eventsToQueue.push(WEEK1_CONSEQUENCE_EVENTS.band_intervention);
  }

  // Available after first bribe
  if (gameState.week >= 25 && gameState.psychologicalEvolution?.corruptionPath.currentLevel > 15) {
    eventsToQueue.push(WEEK1_CONSEQUENCE_EVENTS.criminal_escalation_offer);
  }

  // Available for underground-focused players
  if (gameState.week >= 18 && gameState.factions?.underground_scene.currentStanding > 70) {
    eventsToQueue.push(WEEK1_CONSEQUENCE_EVENTS.underground_legend_recognition);
  }

  // Available for high-fame players with scandals
  if (gameState.week >= 22 && gameState.fame > 150 && gameState.hasScandals) {
    eventsToQueue.push(WEEK1_CONSEQUENCE_EVENTS.industry_scandal_exposure);
  }

  return eventsToQueue;
};
