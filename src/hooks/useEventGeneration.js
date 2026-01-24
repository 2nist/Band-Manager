import { useCallback, useMemo } from 'react';
import {
  createEnhancedEvent,
  shouldShowEvent,
  detectMaturityLevel,
  categorizeEvent,
  detectContentWarnings
} from '../utils/enhancedEventWrapper';
import {
  getActiveArcs,
  getCurrentArcStage,
  getArcStageEvents
} from '../utils/narrativeArcs';
import { generateFromTemplate } from '../utils/proceduralTemplates';
import {
  getFactionModifiedEvents,
  isChoiceAvailable,
  getFactionProbabilityModifier
} from '../utils/factionSystem';
import { adaptEventToArchetype } from '../utils/psychologicalProfiles';

/**
 * useEventGeneration - Procedural generation of gritty, mature events
 * 
 * Generates infinite unique events based on:
 * - Game state (fame, money, week, band status)
 * - Psychological state (stress, addiction, moral integrity)
 * - Narrative context (ongoing storylines, faction standing)
 * - Player archetype (detected psychological profile)
 * - Content preferences (enhanced features system)
 * 
 * @param {Object} gameState - Current game state
 * @param {Object} psychologicalState - Player's psychological profile
 * @param {Object} narrativeState - Story progression tracking
 * @param {Object} enhancedFeatures - Content preference settings (optional)
 * @returns {Object} Event generation methods
 */
export const useEventGeneration = (gameState, psychologicalState, narrativeState, enhancedFeatures = null) => {
  // Check if we're in band leader mode (first-person narrative)
  const isBandLeaderMode = gameState?.selectedScenario?.specialRules?.bandLeaderMode || gameState?.bandLeaderMode;
  
  // Character archetypes
  const CHARACTER_ARCHETYPES = useMemo(() => ({
    sleazy_manager: {
      names: ['Slick Eddie Goldman', 'Fast Tony Sterling', 'Lucky Diamond', 'Sharp Mickey Cross', 'Big Sal Stone'],
      traits: ['manipulative', 'charismatic', 'greedy', 'connected'],
      dialogues: [
        '"Trust me, kid, I know what I\'m talking about."',
        '"This is how the business works."',
        '"You scratch my back, I scratch yours."',
        '"Everybody wins in this deal."'
      ]
    },
    
    drug_dealer: {
      names: ['The Connection', 'Marco', 'Vince', 'D', 'Rex'],
      traits: ['calculating', 'dangerous', 'business_minded', 'territorial'],
      dialogues: [
        '"First taste is free, after that we talk business."',
        '"I provide a service to creative people."',
        '"You want to reach new heights? I got your elevation."',
        '"Cash only, no questions, no problems."'
      ]
    },
    
    obsessed_fan: {
      names: ['Anonymous Admirer', 'The One', 'Your Shadow', 'Forever Devoted', 'Connected Soul'],
      traits: ['unstable', 'devoted', 'intelligent', 'dangerous'],
      dialogues: [
        '"You saved my life with your music."',
        '"We\'re connected on a spiritual level."',
        '"I understand you better than anyone."',
        '"If I can\'t have you, no one can."'
      ]
    },
    
    corrupt_cop: {
      names: ['Detective Marcus', 'Officer Walsh', 'Sergeant Price', 'Captain Collins', 'Detective Blake'],
      traits: ['authoritarian', 'corruptible', 'violent', 'cynical'],
      dialogues: [
        '"We can do this the easy way or the hard way."',
        '"I didn\'t see nothing if you didn\'t see nothing."',
        '"This badge gives me options you don\'t have."',
        '"Around here, I AM the law."'
      ]
    },
    
    industry_executive: {
      names: ['Richard Sterling', 'David Chen', 'Alexandra Moore', 'James Mitchell', 'Victoria Banks'],
      traits: ['calculated', 'powerful', 'ruthless', 'experienced'],
      dialogues: [
        '"This is a business, not a hobby."',
        '"Your talent is valuable, but replaceable."',
        '"The market decides your worth."',
        '"Sign or walk, but don\'t waste my time."'
      ]
    }
  }), []);

  /**
   * Calculate event probability weights based on psychological state
   * Higher stress/addiction/paranoia = more likely those themed events
   * Prevents events player is psychologically unfit for
   * @param {Object} psychState - Current psychological state
   * @returns {Object} Weights and filters for event generation
   */
  const calculateEventWeights = useCallback((psychState) => {
    if (!psychState) return { substance: 0.33, corruption: 0.33, horror: 0.34, filters: {} };
    
    const weights = {
      substance: 0.1,      // Base weight for substance events
      corruption: 0.1,     // Base weight for corruption events
      horror: 0.1          // Base weight for horror/psychological events
    };
    
    const filters = {
      maxStressIncrease: 100 - psychState.stress_level,
      maxAddictionIncrease: 100 - psychState.addiction_risk,
      minMoralityDecrease: psychState.moral_integrity,
      minParanoiaIncrease: 100 - psychState.paranoia
    };
    
    // High stress increases horror/psychological events
    if (psychState.stress_level > 60) {
      weights.horror += (psychState.stress_level - 60) * 0.01;
    }
    
    // High addiction risk increases substance events
    if (psychState.addiction_risk > 40) {
      weights.substance += (psychState.addiction_risk - 40) * 0.01;
    }
    
    // Low moral integrity increases corruption events
    if (psychState.moral_integrity < 60) {
      weights.corruption += (60 - psychState.moral_integrity) * 0.01;
    }
    
    // High paranoia increases horror events
    if (psychState.paranoia > 40) {
      weights.horror += (psychState.paranoia - 40) * 0.008;
    }
    
    // High depression increases horror events (mental health crises)
    if (psychState.depression > 50) {
      weights.horror += (psychState.depression - 50) * 0.01;
    }
    
    // Very high stress can trigger mental breakdown events
    if (psychState.stress_level > 85) {
      weights.horror += 0.2;
      filters.mentalBreakdownRisk = true;
    }
    
    // Very high addiction increases substance escalation
    if (psychState.addiction_risk > 80) {
      weights.substance += 0.15;
      filters.addictionCrisisRisk = true;
    }
    
    // Normalize weights to sum to 1.0
    const total = weights.substance + weights.corruption + weights.horror;
    return {
      substance: weights.substance / total,
      corruption: weights.corruption / total,
      horror: weights.horror / total,
      filters: filters
    };
  }, []);

  /**
   * Select a random character from an archetype
   * @param {string} archetype - Character archetype key
   * @returns {Object} Random character from that archetype
   */
  const selectCharacter = useCallback((archetype) => {
    const arch = CHARACTER_ARCHETYPES[archetype];
    if (!arch) return { name: 'Unknown', traits: [], dialogue: 'You meet someone.' };
    
    const randomName = arch.names[Math.floor(Math.random() * arch.names.length)];
    const randomDialogue = arch.dialogues[Math.floor(Math.random() * arch.dialogues.length)];
    
    return {
      name: randomName,
      archetype,
      traits: arch.traits,
      dialogue: randomDialogue,
      avatarSeed: randomName
    };
  }, [CHARACTER_ARCHETYPES]);

  /**
   * Select event type based on psychological weights
   * @param {Object} weights - Event type weights
   * @returns {string} Selected event type
   */
  const selectEventTypeByWeights = useCallback((weights) => {
    const rand = Math.random();
    let cumulative = 0;
    
    if (rand < (cumulative += weights.substance)) return 'substance';
    if (rand < (cumulative += weights.corruption)) return 'corruption';
    return 'horror';
  }, []);

  /**
   * Apply psychological effects from player choice
   * Updates psychological state based on choice consequences
   * @param {Object} choiceEffects - Effects from the choice
   * @param {Function} updatePsych - Callback to apply psychological updates
   * @returns {Object} Applied effects for logging
   */
  const applyPsychologicalEffects = useCallback((choiceEffects, updatePsych) => {
    if (!choiceEffects || typeof updatePsych !== 'function') {
      return { success: false, message: 'Missing choice effects or update function' };
    }
    
    const updates = {};
    const appliedEffects = [];
    
    // Map choice effects to psychological state updates
    if (typeof choiceEffects.stress === 'number' && choiceEffects.stress !== 0) {
      updates.stress_level = choiceEffects.stress;
      appliedEffects.push(`Stress ${choiceEffects.stress > 0 ? '+' : ''}${choiceEffects.stress}`);
    }
    
    if (typeof choiceEffects.morality === 'number' && choiceEffects.morality !== 0) {
      updates.moral_integrity = choiceEffects.morality;
      appliedEffects.push(`Morality ${choiceEffects.morality > 0 ? '+' : ''}${choiceEffects.morality}`);
    }
    
    if (typeof choiceEffects.addiction === 'number' && choiceEffects.addiction !== 0) {
      updates.addiction_risk = choiceEffects.addiction;
      appliedEffects.push(`Addiction Risk ${choiceEffects.addiction > 0 ? '+' : ''}${choiceEffects.addiction}`);
    }
    
    if (typeof choiceEffects.paranoia === 'number' && choiceEffects.paranoia !== 0) {
      updates.paranoia = choiceEffects.paranoia;
      appliedEffects.push(`Paranoia ${choiceEffects.paranoia > 0 ? '+' : ''}${choiceEffects.paranoia}`);
    }
    
    if (typeof choiceEffects.depression === 'number' && choiceEffects.depression !== 0) {
      updates.depression = choiceEffects.depression;
      appliedEffects.push(`Depression ${choiceEffects.depression > 0 ? '+' : ''}${choiceEffects.depression}`);
    }
    
    if (Object.keys(updates).length > 0) {
      updatePsych(updates);
      return { success: true, applied: appliedEffects };
    }
    
    return { success: false, message: 'No psychological effects to apply' };
  }, []);

  /**
   * Generate substance temptation event
   */
  const generateSubstanceEvent = useCallback((stage = 'experimental') => {
    const substances = {
      experimental: {
        name: 'First Hit',
        substance: 'cocaine',
        risk: 'high',
        appeal: psychologicalState.addiction_risk,
        description: isBandLeaderMode 
          ? `After the show, your guitarist approaches you, eyes dilated, movements jittery. "Dude, you HAVE to try this. I've never felt so... connected to the music. Like I could see the sound waves." They hold out a small baggie. Several industry people are watching. As the band leader, all eyes are on you.`
          : `Your guitarist comes to you after the show, eyes dilated, movements jittery. "Dude, you HAVE to try this. I've never felt so... connected to the music. Like I could see the sound waves." They hold out a small baggie. Several industry people are watching.`
      },
      regular_use: {
        name: 'The Routine',
        substance: 'cocaine',
        risk: 'high',
        appeal: Math.min(100, psychologicalState.addiction_risk + 30),
        description: `Your bassist casually leaves a small packet on the studio console. "For the long sessions," they say with a knowing smile. It's becoming normal now. The creative sessions without it feel flat.`
      },
      dependent: {
        name: 'Can\'t Stop',
        substance: 'various',
        risk: 'extreme',
        appeal: Math.min(100, psychologicalState.addiction_risk + 50),
        description: `You\'re shaking. The tour doesn't start for three days but you feel like you\'re crawling out of your skin. You know exactly where to get what you need. The only question is: do you reach out?`
      },
      addicted: {
        name: 'Rock Bottom',
        substance: 'heroin',
        risk: 'extreme',
        appeal: 100,
        description: `You wake up in a bathroom you don't recognize. There's blood on your arm. You can't remember last night. Your phone has 47 missed calls and a dozen voicemails from increasingly panicked band members and your manager.`
      }
    };
    
    const substance = substances[stage] || substances.experimental;
    const character = selectCharacter('drug_dealer');
    
    return {
      id: `substance_${stage}_${Date.now()}`,
      category: 'substance_abuse',
      title: substance.name,
      maturityLevel: 'mature',
      risk: substance.risk,
      substance: substance.substance,
      description: substance.description,
      character,
      choices: [
        {
          id: 'use_substance',
          text: `"I need this" (Use ${substance.substance})`,
          riskLevel: substance.risk,
          immediateEffects: {
            creativity: stage === 'experimental' ? 15 : stage === 'regular_use' ? 12 : stage === 'dependent' ? 10 : -5,
            energy: stage === 'addicted' ? 20 : 25,
            stress: -25
          },
          longTermEffects: {
            addiction_escalation: 0.25,
            tolerance_increase: 0.15,
            health_degradation: 10
          },
          psychologicalEffects: {
            addiction_risk: 30,
            moral_integrity: stage === 'experimental' ? -10 : stage === 'regular_use' ? -15 : stage === 'dependent' ? -20 : -30
          },
          traumaRisk: stage === 'addicted' ? { type: 'overdose_scare', probability: 0.4, severity: 'severe', description: 'Near-death experience from overdose' } : null
        },
        {
          id: 'refuse',
          text: '"Not happening"',
          riskLevel: 'low',
          immediateEffects: {
            stress: stage === 'dependent' ? 30 : stage === 'addicted' ? 50 : 10
          },
          longTermEffects: {
            withdrawal_risk: stage === 'dependent' ? 0.6 : stage === 'addicted' ? 0.8 : 0
          },
          psychologicalEffects: {
            moral_integrity: 10
          }
        },
        {
          id: 'seek_help',
          text: 'Call a support hotline',
          riskLevel: stage === 'addicted' ? 'low' : 'medium',
          immediateEffects: {},
          longTermEffects: {
            recovery_path: true,
            relapse_risk: -0.2
          },
          psychologicalEffects: {
            stress: -20,
            depression: -15
          }
        }
      ]
    };
  }, [psychologicalState, selectCharacter]);

  /**
   * Generate corruption opportunity
   */
  const generateCorruptionEvent = useCallback((stage = 'first_compromise') => {
    const opportunities = {
      first_compromise: {
        name: 'The Offer',
        description: `A smooth-talking executive takes you aside. "Look, we want to add your song to rotation, but radio doesn't work like it used to. There's a fee - $5000 upfront, and we'll make sure you get heavy play."`,
        money: 5000,
        risk: 'medium'
      },
      
      moral_flexibility: {
        name: 'The Bigger Deal',
        description: `Your manager presents a new deal: $50,000 advance, but the label keeps 80% of streaming revenue. "Everyone does it this way," they say. You know it's predatory. You also know you need the money.`,
        money: 50000,
        risk: 'high'
      },
      
      active_corruption: {
        name: 'The Criminal Connection',
        description: `A man in expensive clothes approaches you after the show. "Transport packages during your tour. $10,000 per city, no questions asked." You know exactly what this means.`,
        money: 100000,
        risk: 'extreme'
      },
      
      deep_involvement: {
        name: 'The Point of No Return',
        description: `Your contact makes you an offer you can't refuse - literally. "You\'re in this with us now. We've got investments. We need guaranteed returns." They explain a scheme that would make you hundreds of thousands but commit you to serious federal crimes.`,
        money: 500000,
        risk: 'extreme'
      }
    };
    
    const opportunity = opportunities[stage] || opportunities.first_compromise;
    const character = selectCharacter(stage === 'active_corruption' ? 'drug_dealer' : stage === 'deep_involvement' ? 'corrupt_cop' : 'industry_executive');
    
    return {
      id: `corruption_${stage}_${Date.now()}`,
      category: 'corruption',
      title: opportunity.name,
      maturityLevel: 'mature',
      risk: opportunity.risk,
      description: opportunity.description,
      character,
      choices: [
        {
          id: 'accept_deal',
          text: `Accept (Get $${opportunity.money})`,
          riskLevel: opportunity.risk,
          immediateEffects: {
            money: opportunity.money
          },
          psychologicalEffects: {
            moral_integrity: stage === 'first_compromise' ? -20 : stage === 'moral_flexibility' ? -30 : stage === 'active_corruption' ? -40 : -50,
            paranoia: stage === 'active_corruption' ? 30 : stage === 'deep_involvement' ? 50 : 10,
            stress: 15
          },
          longTermEffects: {
            corruption_escalation: true,
            law_enforcement_attention: stage === 'active_corruption' ? 0.3 : stage === 'deep_involvement' ? 0.8 : 0.05
          }
        },
        {
          id: 'refuse',
          text: 'Walk away',
          riskLevel: 'low',
          psychologicalEffects: {
            moral_integrity: 15
          },
          longTermEffects: {
            enemy: character.name,
            enemy_type: stage === 'deep_involvement' ? 'dangerous' : 'business'
          }
        },
        {
          id: 'report_authorities',
          text: 'Report to authorities',
          riskLevel: 'extreme',
          psychologicalEffects: {
            moral_integrity: 30,
            paranoia: 40
          },
          longTermEffects: {
            protection: 'witness_protection',
            career_impact: 'severe',
            enemies: stage === 'deep_involvement' ? ['criminal_organization'] : [character.name]
          }
        }
      ]
    };
  }, [selectCharacter]);

  /**
   * Generate psychological horror event
   */
  const generateHorrorEvent = useCallback(() => {
    const horrors = [
      {
        name: 'The Shrine',
        description: `A fan invites you to their apartment. When you arrive, the walls are covered - thousands of photos of you, some taken with telephoto lenses from outside your home. A lock of hair in a frame. Lyrics written on the walls in what looks like blood. "We're meant to be together," they whisper as they lock the door.`,
        threat_level: 'critical',
        threat_type: 'stalker'
      },
      {
        name: 'The Voice',
        description: `You're alone in your hotel room when you hear it - whispers that aren't there. Conversations in languages you don't speak. At first you think it's the walls, but the voice gets clearer: "They don't really love you. When they find out who you are, they'll leave. Everyone always does."`,
        threat_level: 'severe',
        threat_type: 'psychotic_break'
      },
      {
        name: 'The Letter',
        description: `A fan letter arrives that makes your blood run cold. They know details about your childhood trauma you've never spoken about publicly. They describe their suicide attempt, the scars on their wrists, how your music saved them. But then it gets disturbing - they know where you live, what route you take to the studio, what you ate for lunch yesterday.`,
        threat_level: 'severe',
        threat_type: 'obsession'
      },
      {
        name: 'The Overdose',
        description: `During your stadium show, a kid in the front row collapses - purple lips, not breathing. The paramedics are fighting to keep them alive. They're wearing your merchandise. As they're wheeled out, you realize you could've done something to prevent this. You could have warned people about the dangers. Instead you've been glamorizing exactly this lifestyle.`,
        threat_level: 'severe',
        threat_type: 'guilt_trauma'
      }
    ];
    
    const horror = horrors[Math.floor(Math.random() * horrors.length)];
    
    return {
      id: `horror_${Date.now()}`,
      category: 'psychological_horror',
      title: horror.name,
      maturityLevel: 'mature',
      threat_level: horror.threat_level,
      description: horror.description,
      choices: [
        {
          id: 'confront',
          text: 'Confront directly',
          riskLevel: 'extreme',
          psychologicalEffects: {
            stress: 40,
            paranoia: horror.threat_type === 'stalker' ? 50 : 20
          },
          traumaRisk: { type: horror.threat_type, probability: 0.6, severity: 'severe', description: horror.description }
        },
        {
          id: 'seek_help',
          text: 'Report to authorities',
          riskLevel: 'high',
          psychologicalEffects: {
            stress: 20,
            paranoia: 15
          },
          longTermEffects: {
            legal_protection: true,
            media_attention: true
          }
        },
        {
          id: 'ignore',
          text: 'Pretend it isn\'t happening',
          riskLevel: 'extreme',
          psychologicalEffects: {
            depression: 30,
            stress: 50
          },
          longTermEffects: {
            problem_escalation: true
          }
        }
      ]
    };
  }, []);

  /**
   * Generate specific "Rock Bottom" event (addiction consequence)
   */
  const generateRockBottomEvent = useCallback(() => {
    const bandMembers = gameState?.bandMembers || [];
    const bassist = bandMembers.find(m => m.type === 'bassist' || m.role === 'bassist') || bandMembers[0];
    const memberName = bassist?.name || 'Your bassist';
    
    return {
      id: `rock_bottom_${Date.now()}`,
      category: 'substance_abuse',
      title: 'Rock Bottom',
      maturityLevel: 'mature',
      risk: 'extreme',
      contentWarnings: ['drug_use', 'addiction', 'overdose'],
      description: `${memberName} hasn't shown up to rehearsal in three days. You find them passed out in a dive bar bathroom with track marks up their arms and an empty wallet. The bartender knows them by name. "They've been here every night this week, begging for drinks." There's a show tomorrow night. A sold-out show. The press will be there.`,
      choices: [
        {
          id: 'cancel_and_help',
          text: '"We\'re canceling everything and getting you help"',
          riskLevel: 'medium',
          immediateEffects: {
            money: -5000,
            morale: 20,
            fame: 15
          },
          longTermEffects: {
            recovery_chance: 0.5,
            fan_respect: 15
          },
          psychologicalEffects: {
            moral_integrity: 20,
            stress: 10
          }
        },
        {
          id: 'ultimatum_24h',
          text: '"You have 24 hours to get clean for the show"',
          riskLevel: 'high',
          immediateEffects: {
            stress: 30
          },
          longTermEffects: {
            overdose_chance: 0.3,
            functional_chance: 0.4,
            recovery_chance: 0.3
          },
          psychologicalEffects: {
            moral_integrity: -10,
            stress: 25
          }
        },
        {
          id: 'replace_member',
          text: '"We\'re replacing you tonight"',
          riskLevel: 'extreme',
          immediateEffects: {
            bandMembers: -1
          },
          longTermEffects: {
            death_risk: 0.6,
            addiction_continues: true
          },
          psychologicalEffects: {
            moral_integrity: -30,
            depression: 20
          }
        },
        {
          id: 'all_go_down',
          text: '"Fuck it, we\'re all going down together"',
          riskLevel: 'extreme',
          immediateEffects: {
            creativity: 30
          },
          longTermEffects: {
            career_destruction: true,
            final_album_potential: true
          },
          psychologicalEffects: {
            addiction_risk: 50,
            moral_integrity: -40
          }
        }
      ]
    };
  }, [gameState]);

  /**
   * Generate "Recovery Attempt" event
   */
  const generateRecoveryAttemptEvent = useCallback(() => {
    return {
      id: `recovery_attempt_${Date.now()}`,
      category: 'substance_abuse',
      title: 'Recovery Attempt',
      maturityLevel: 'mature',
      risk: 'medium',
      contentWarnings: ['addiction', 'recovery'],
      description: `You've been clean for ${narrativeState.addiction_progression?.weeks_clean || 0} weeks. The cravings are still there, but you're managing. Your support system is checking in. But then you get the call - your old dealer is in town. "Just one more time," they say. "For old times' sake."`,
      choices: [
        {
          id: 'stay_strong',
          text: 'Stay strong - refuse',
          riskLevel: 'low',
          immediateEffects: {
            stress: 15
          },
          longTermEffects: {
            relapse_risk: -0.1,
            weeks_clean: 1
          },
          psychologicalEffects: {
            moral_integrity: 15,
            stress: 10
          }
        },
        {
          id: 'just_once',
          text: '"Just once more, then I\'m done"',
          riskLevel: 'extreme',
          immediateEffects: {
            stress: -30,
            creativity: 20
          },
          longTermEffects: {
            relapse: true,
            weeks_clean: 0,
            recovery_difficulty: 0.2
          },
          psychologicalEffects: {
            addiction_risk: 40,
            moral_integrity: -25,
            depression: 30
          }
        },
        {
          id: 'call_support',
          text: 'Call your support person',
          riskLevel: 'low',
          immediateEffects: {},
          longTermEffects: {
            support_strengthened: true,
            relapse_risk: -0.3
          },
          psychologicalEffects: {
            stress: -20,
            depression: -15
          }
        }
      ]
    };
  }, [narrativeState]);

  /**
   * Generate "The Deal" event (drug transport offer)
   */
  const generateTheDealEvent = useCallback(() => {
    const character = selectCharacter('drug_dealer');
    const venueName = gameState?.currentVenue?.name || 'the abandoned warehouse';
    
    return {
      id: `the_deal_${Date.now()}`,
      category: 'criminal_activity',
      title: 'The Deal',
      maturityLevel: 'mature',
      risk: 'high',
      contentWarnings: ['criminal_activity', 'drug_use'],
      description: `After your gig at ${venueName}, a guy in expensive clothes approaches you. "Nice set. I run some... entrepreneurial operations in this area. I could use people like you - good reputation, travel a lot, access to young customers who like to party." He slides a business card across the sticky table. "Transport some packages on your tour. Easy money. $5000 per city, no questions asked. What you don't know can't hurt you, right?"`,
      character,
      choices: [
        {
          id: 'refuse_criminals',
          text: '"We\'re not criminals"',
          riskLevel: 'low',
          immediateEffects: {},
          longTermEffects: {
            enemy: character.name,
            enemy_type: 'powerful'
          },
          psychologicalEffects: {
            moral_integrity: 10
          }
        },
        {
          id: 'ask_details',
          text: '"What kind of packages?"',
          riskLevel: 'high',
          immediateEffects: {},
          longTermEffects: {
            drug_dealer_path: true,
            criminal_involvement: 'low_risk'
          },
          psychologicalEffects: {
            moral_integrity: -15,
            paranoia: 10
          }
        },
        {
          id: 'think_about_it',
          text: '"Give us time to think"',
          riskLevel: 'medium',
          immediateEffects: {},
          longTermEffects: {
            decision_deadline: 1,
            weakness_shown: true
          },
          psychologicalEffects: {
            stress: 15
          }
        },
        {
          id: 'double_or_nothing',
          text: '"Double or nothing"',
          riskLevel: 'extreme',
          immediateEffects: {
            money: 10000
          },
          longTermEffects: {
            major_drug_distribution: true,
            extreme_risk: true
          },
          psychologicalEffects: {
            moral_integrity: -30,
            paranoia: 30,
            stress: 25
          }
        }
      ]
    };
  }, [gameState, selectCharacter]);

  /**
   * Generate "The Contract" event (predatory label deal)
   */
  const generateTheContractEvent = useCallback(() => {
    const character = selectCharacter('industry_executive');
    
    return {
      id: `the_contract_${Date.now()}`,
      category: 'industry_corruption',
      title: 'The Contract',
      maturityLevel: 'mature',
      risk: 'high',
      contentWarnings: ['financial_exploitation', 'corruption'],
      description: `The A&R rep slides a 47-page contract across the mahogany table. "Standard deal," ${character.name} says with a smile that doesn't reach their eyes. "Seven albums, full creative control for the label, and we own your masters in perpetuity. But hey, $50,000 advance!" Your lawyer (if you have one) points out the hidden clauses: You pay for everything - recording, promotion, videos - out of future royalties. The label can drop you anytime but you can't leave. If the album doesn't recoup costs, you owe them money. "Take it or leave it. There's a dozen bands in the lobby waiting for this opportunity."`,
      character,
      choices: [
        {
          id: 'sign_immediately',
          text: 'Sign immediately - "We need this break"',
          riskLevel: 'high',
          immediateEffects: {
            money: 50000,
            fame: 20
          },
          longTermEffects: {
            indentured_servitude: true,
            financial_disaster: true,
            label_control: true
          },
          psychologicalEffects: {
            moral_integrity: -20,
            stress: 15
          }
        },
        {
          id: 'think_week',
          text: '"Give us a week to think"',
          riskLevel: 'medium',
          immediateEffects: {},
          longTermEffects: {
            offer_withdrawn: true
          },
          psychologicalEffects: {
            stress: 10
          }
        },
        {
          id: 'negotiate',
          text: 'Negotiate specific clauses',
          riskLevel: 'medium',
          immediateEffects: {},
          longTermEffects: {
            negotiation_success: 0.6,
            label_angered: 0.3
          },
          psychologicalEffects: {
            stress: 20
          }
        },
        {
          id: 'walk_away',
          text: 'Walk away and stay independent',
          riskLevel: 'low',
          immediateEffects: {},
          longTermEffects: {
            dignity_preserved: true,
            masters_owned: true,
            label_support_lost: true
          },
          psychologicalEffects: {
            moral_integrity: 15,
            stress: -10
          }
        }
      ]
    };
  }, [selectCharacter]);

  /**
   * Generate "The Payola Scheme" event
   */
  const generatePayolaSchemeEvent = useCallback(() => {
    return {
      id: `payola_scheme_${Date.now()}`,
      category: 'industry_corruption',
      title: 'The Payola Scheme',
      maturityLevel: 'mature',
      risk: 'high',
      contentWarnings: ['corruption', 'financial_exploitation'],
      description: `Your label's radio promoter pulls you aside at an industry mixer. "Look, I like you kids. But radio play doesn't just happen anymore. The DJ at KROQ wants $5,000 to add your song to rotation. The program director at SiriusXM wants concert tickets and backstage passes for his daughter's sweet sixteen." "This is how the game is played. You want your music heard, you pay to play. The label can front the money, but it comes out of your royalties. What they don't tell you is that your competition is already paying double."`,
      choices: [
        {
          id: 'refuse_illegal',
          text: '"That\'s illegal, we won\'t participate"',
          riskLevel: 'low',
          immediateEffects: {},
          longTermEffects: {
            no_radio_play: true,
            limited_commercial_success: true
          },
          psychologicalEffects: {
            moral_integrity: 20
          }
        },
        {
          id: 'pay_reluctantly',
          text: 'Pay the bribes reluctantly',
          riskLevel: 'high',
          immediateEffects: {
            radio_play: true,
            fame: 10
          },
          longTermEffects: {
            label_debt: 5000,
            complicit_corruption: true
          },
          psychologicalEffects: {
            moral_integrity: -15,
            stress: 10
          }
        },
        {
          id: 'find_another_way',
          text: '"Let\'s find another way"',
          riskLevel: 'medium',
          immediateEffects: {},
          longTermEffects: {
            alternative_promotion: true,
            ethics_maintained: true,
            success_chance: 0.4
          },
          psychologicalEffects: {
            moral_integrity: 10,
            stress: 15
          }
        },
        {
          id: 'expose_system',
          text: 'Document everything and expose the system',
          riskLevel: 'extreme',
          immediateEffects: {},
          longTermEffects: {
            industry_reform: true,
            career_destruction: true,
            powerful_enemies: true
          },
          psychologicalEffects: {
            moral_integrity: 30,
            paranoia: 40,
            stress: 30
          }
        }
      ]
    };
  }, []);

  /**
   * Generate "The Skim" event (manager betrayal)
   */
  const generateTheSkimEvent = useCallback(() => {
    const character = selectCharacter('sleazy_manager');
    
    return {
      id: `the_skim_${Date.now()}`,
      category: 'industry_corruption',
      title: 'The Skim',
      maturityLevel: 'mature',
      risk: 'high',
      contentWarnings: ['financial_exploitation', 'betrayal'],
      description: `You're reviewing financial statements when something doesn't add up. ${character.name} has been taking 30% instead of the agreed 15%. But it's worse than that - they've been booking you at their friend's venues, inflating costs, and taking kickbacks from everyone. The tour that you thought broke even? You actually lost $25,000. The "expensive" studio time? They got it half-price and pocketed the difference. They've stolen at least $100,000 over two years. When confronted, they're unapologetic: "You'd still be playing coffee shops without me. This is the cost of success."`,
      character,
      choices: [
        {
          id: 'fire_and_charge',
          text: '"You\'re fired, and we\'re pressing charges"',
          riskLevel: 'high',
          immediateEffects: {
            money: -10000
          },
          longTermEffects: {
            legal_battle: true,
            funds_recovery: 0.4,
            industry_retaliation: true
          },
          psychologicalEffects: {
            moral_integrity: 20,
            stress: 25
          }
        },
        {
          id: 'fire_keep_money',
          text: '"We\'re done, keep the money"',
          riskLevel: 'medium',
          immediateEffects: {},
          longTermEffects: {
            clean_break: true,
            expensive_lesson: true,
            manager_continues: true
          },
          psychologicalEffects: {
            stress: 15
          }
        },
        {
          id: 'cut_in',
          text: '"Cut us in on the side deals"',
          riskLevel: 'extreme',
          immediateEffects: {
            money: 50000
          },
          longTermEffects: {
            corruption_partnership: true,
            more_money: true
          },
          psychologicalEffects: {
            moral_integrity: -30,
            paranoia: 20
          }
        },
        {
          id: 'gather_evidence',
          text: 'Gather evidence before confronting',
          riskLevel: 'medium',
          immediateEffects: {},
          longTermEffects: {
            legal_success: 0.7,
            evidence_destruction_risk: 0.3
          },
          psychologicalEffects: {
            stress: 20
          }
        }
      ]
    };
  }, [selectCharacter]);

  /**
   * Generate "The Groupie Situation" event
   */
  const generateGroupieSituationEvent = useCallback(() => {
    const venueName = gameState?.currentVenue?.name || 'the venue';
    
    return {
      id: `groupie_situation_${Date.now()}`,
      category: 'sexual_content',
      title: 'The Groupie Situation',
      maturityLevel: 'mature',
      risk: 'high',
      contentWarnings: ['sexual_content', 'age_gaps', 'power_dynamics'],
      description: `After your show at ${venueName}, a young fan approaches you. They can't be older than 17, but they're throwing themselves at you like you're their salvation. "I've been following your tour," they breathe. "I have a hotel room. I have... things that might interest you." Your manager sees what's happening and pulls you aside: "Kid, this could destroy everything. But... some of the biggest rock stars in history had their share of young admirers. Your call, but think about the optics."`,
      choices: [
        {
          id: 'walk_away',
          text: 'Walk away immediately',
          riskLevel: 'low',
          immediateEffects: {},
          longTermEffects: {
            fan_respect: 10
          },
          psychologicalEffects: {
            moral_integrity: 25,
            stress: -5
          }
        },
        {
          id: 'come_back_21',
          text: '"Come back when you\'re 21"',
          riskLevel: 'medium',
          immediateEffects: {},
          longTermEffects: {
            obsessed_stalker: 0.4,
            harassment_issues: true
          },
          psychologicalEffects: {
            moral_integrity: 10,
            paranoia: 15
          }
        },
        {
          id: 'take_offer',
          text: 'Take them up on the offer',
          riskLevel: 'extreme',
          immediateEffects: {
            stress: -20
          },
          longTermEffects: {
            scandal_chance: 0.7,
            criminal_charges: 0.3
          },
          psychologicalEffects: {
            moral_integrity: -30,
            paranoia: 25,
            stress: 20
          }
        },
        {
          id: 'just_talk',
          text: '"Let\'s just talk" (Safe middle ground)',
          riskLevel: 'low',
          immediateEffects: {
            songwriting_inspiration: 5
          },
          longTermEffects: {
            fan_insight: true
          },
          psychologicalEffects: {
            moral_integrity: 10,
            stress: -5
          }
        }
      ]
    };
  }, [gameState]);

  /**
   * Generate "The Scandal" event (public exposure)
   */
  const generateTheScandalEvent = useCallback(() => {
    const bandMembers = gameState?.bandMembers || [];
    const singer = bandMembers.find(m => m.type === 'vocalist' || m.role === 'vocalist' || m.isLeader) || bandMembers[0];
    const singerName = singer?.name || 'Your lead singer';
    
    return {
      id: `the_scandal_${Date.now()}`,
      category: 'sexual_content',
      title: 'The Scandal',
      maturityLevel: 'mature',
      risk: 'extreme',
      contentWarnings: ['sexual_content', 'public_exposure', 'media_scandal'],
      description: `Photos have surfaced. ${singerName} in a compromising position with someone who isn't their partner. The images are grainy but unmistakable. They're being shared across social media, picked up by gossip sites, and your label is panicking. "We need damage control NOW," your manager says. "This could destroy everything we've built." The press is calling. Fans are taking sides. Your band's reputation hangs in the balance.`,
      choices: [
        {
          id: 'deny_everything',
          text: 'Deny everything and threaten legal action',
          riskLevel: 'high',
          immediateEffects: {},
          longTermEffects: {
            legal_battle: true,
            credibility_risk: 0.6,
            media_war: true
          },
          psychologicalEffects: {
            stress: 25,
            paranoia: 20
          }
        },
        {
          id: 'admit_apologize',
          text: 'Admit and apologize publicly',
          riskLevel: 'medium',
          immediateEffects: {
            fame: -20
          },
          longTermEffects: {
            reputation_damage: true,
            redemption_possible: true,
            fan_forgiveness: 0.5
          },
          psychologicalEffects: {
            stress: 15,
            depression: 10
          }
        },
        {
          id: 'spin_story',
          text: 'Spin it as a positive story',
          riskLevel: 'high',
          immediateEffects: {
            fame: 10
          },
          longTermEffects: {
            media_manipulation: true,
            authenticity_questioned: true,
            short_term_gain: true
          },
          psychologicalEffects: {
            moral_integrity: -15,
            stress: 20
          }
        },
        {
          id: 'ignore_media',
          text: 'Ignore the media and focus on music',
          riskLevel: 'low',
          immediateEffects: {},
          longTermEffects: {
            media_fade: true,
            fan_respect: 10,
            slow_recovery: true
          },
          psychologicalEffects: {
            stress: 10
          }
        }
      ]
    };
  }, [gameState]);

  /**
   * Generate "The Affair" event
   */
  const generateTheAffairEvent = useCallback(() => {
    const bandMembers = gameState?.bandMembers || [];
    const singer = bandMembers.find(m => m.type === 'vocalist' || m.role === 'vocalist' || m.isLeader) || bandMembers[0];
    const singerName = singer?.name || 'Your lead singer';
    
    return {
      id: `the_affair_${Date.now()}`,
      category: 'sexual_content',
      title: 'The Affair',
      maturityLevel: 'mature',
      risk: 'high',
      contentWarnings: ['sexual_content', 'relationship_drama'],
      description: `${singerName} has been having an affair with your opening act's bassist. It started as tour bus chemistry, but now there are real feelings involved. Both are talking about leaving their partners. The spouse found out. They're threatening to go to the press with photos, texts, everything. "Either ${singerName} comes home NOW and we work this out privately, or I make sure everyone knows what kind of person they really are."`,
      choices: [
        {
          id: 'support_affair',
          text: 'Support the affair - "Follow your heart"',
          riskLevel: 'high',
          immediateEffects: {},
          longTermEffects: {
            messy_divorce: 0.6,
            relationship_destroyers: true,
            passionate_artists: true
          },
          psychologicalEffects: {
            stress: 15
          }
        },
        {
          id: 'ultimatum',
          text: '"Choose your family or choose the band"',
          riskLevel: 'medium',
          immediateEffects: {},
          longTermEffects: {
            quit_music: 0.4,
            affair_ends: 0.6,
            resentment: true
          },
          psychologicalEffects: {
            stress: 20
          }
        },
        {
          id: 'pay_off',
          text: 'Pay off the spouse ($10,000)',
          riskLevel: 'high',
          immediateEffects: {
            money: -10000
          },
          longTermEffects: {
            silence_bought: 6,
            escalating_costs: true
          },
          psychologicalEffects: {
            moral_integrity: -15,
            stress: 10
          }
        },
        {
          id: 'not_my_business',
          text: '"This is none of my business"',
          riskLevel: 'medium',
          immediateEffects: {},
          longTermEffects: {
            scandal_breaks: true,
            fame: -30,
            authenticity_appreciated: 15
          },
          psychologicalEffects: {
            stress: 10
          }
        }
      ]
    };
  }, [gameState]);

  /**
   * Generate "The Fight" event (venue violence)
   */
  const generateTheFightEvent = useCallback(() => {
    const venueName = gameState?.currentVenue?.name || 'the venue';
    
    return {
      id: `the_fight_${Date.now()}`,
      category: 'violence',
      title: 'The Fight',
      maturityLevel: 'mature',
      risk: 'high',
      contentWarnings: ['violence', 'injury'],
      description: `During your set at ${venueName}, some drunk asshole starts heckling your drummer about their gender/race/sexuality. It escalates fast. The heckler throws a beer bottle that hits your drummer in the face, cutting them badly. Your guitarist jumps off stage and tackles the guy. Now there's a full brawl in the pit. Blood on the floor. Someone's screaming. The bouncer is nowhere to be found.`,
      choices: [
        {
          id: 'jump_in',
          text: 'Jump in and help your bandmate',
          riskLevel: 'high',
          immediateEffects: {},
          longTermEffects: {
            injury_chance: 0.4,
            loyalty_shown: true
          },
          psychologicalEffects: {
            stress: 20
          }
        },
        {
          id: 'keep_playing',
          text: 'Keep playing to distract the crowd',
          riskLevel: 'medium',
          immediateEffects: {},
          longTermEffects: {
            drummer_resentment: true,
            band_chemistry: -25
          },
          psychologicalEffects: {
            moral_integrity: -10,
            stress: 15
          }
        },
        {
          id: 'stop_show',
          text: 'Stop the show and call for help',
          riskLevel: 'low',
          immediateEffects: {},
          longTermEffects: {
            look_weak: true,
            some_respect: true
          },
          psychologicalEffects: {
            stress: 10
          }
        },
        {
          id: 'shame_attacker',
          text: 'Use your mic to publicly shame the attacker',
          riskLevel: 'high',
          immediateEffects: {},
          longTermEffects: {
            mob_justice: true,
            legal_consequences: 0.3
          },
          psychologicalEffects: {
            stress: 15,
            paranoia: 10
          }
        }
      ]
    };
  }, [gameState]);

  /**
   * Generate "The Raid" event (police raid at warehouse)
   */
  const generateTheRaidEvent = useCallback(() => {
    return {
      id: `the_raid_${Date.now()}`,
      category: 'criminal_activity',
      title: 'The Raid',
      maturityLevel: 'mature',
      risk: 'extreme',
      contentWarnings: ['criminal_activity', 'arrest', 'violence'],
      description: `You're two songs into your set at the underground venue when someone screams "COPS!" through a megaphone. The warehouse erupts in panic. People are running everywhere. You see someone shoving drug baggies down their pants. Someone else is smashing bottles against the wall. The police lights are flashing outside, getting closer. Your gear is still plugged in. Your van is parked right out front with all your equipment inside.`,
      choices: [
        {
          id: 'grab_gear_run',
          text: 'Grab your gear and run',
          riskLevel: 'high',
          immediateEffects: {},
          longTermEffects: {
            escape_chance: 0.6,
            equipment_damage: 0.4
          },
          psychologicalEffects: {
            stress: 25,
            paranoia: 15
          }
        },
        {
          id: 'keep_playing',
          text: 'Keep playing until they shut you down',
          riskLevel: 'extreme',
          immediateEffects: {},
          longTermEffects: {
            arrest: true,
            underground_folklore: true
          },
          psychologicalEffects: {
            stress: 30,
            paranoia: 20
          }
        },
        {
          id: 'help_escape',
          text: 'Help people escape through back exit',
          riskLevel: 'high',
          immediateEffects: {},
          longTermEffects: {
            heroism: true,
            risk_to_self: true
          },
          psychologicalEffects: {
            moral_integrity: 20,
            stress: 20
          }
        },
        {
          id: 'surrender',
          text: 'Surrender immediately and cooperate',
          riskLevel: 'low',
          immediateEffects: {},
          longTermEffects: {
            snitch_label: true,
            legal_safety: true
          },
          psychologicalEffects: {
            moral_integrity: -15,
            stress: 15
          }
        }
      ]
    };
  }, []);

  /**
   * Generate "The Regular" event (dive bar confrontation)
   */
  const generateTheRegularEvent = useCallback(() => {
    const venueName = gameState?.currentVenue?.name || 'the dive bar';
    
    return {
      id: `the_regular_${Date.now()}`,
      category: 'violence',
      title: 'The Regular',
      maturityLevel: 'mature',
      risk: 'high',
      contentWarnings: ['violence', 'threats'],
      description: `You're setting up at ${venueName} when the bartender warns you: "Watch out for Big Mike. He's been drinking since noon and he hates musicians. Last band that played here, he threw a chair at their amp." Sure enough, ten minutes into your set, a massive drunk guy starts yelling: "TURN THAT NOISE DOWN!" When you keep playing, he starts pushing toward the stage. The bartender is tiny. The bouncer called in sick. There are about thirty people in the bar, and they're all watching to see what happens. Big Mike is six-foot-six and has prison tattoos.`,
      choices: [
        {
          id: 'keep_playing',
          text: 'Keep playing and hope for the best',
          riskLevel: 'medium',
          immediateEffects: {},
          longTermEffects: {
            violence_escalation: 0.4,
            boredom_leaves: 0.6
          },
          psychologicalEffects: {
            stress: 15
          }
        },
        {
          id: 'address_directly',
          text: 'Stop and address him directly from stage',
          riskLevel: 'high',
          immediateEffects: {},
          longTermEffects: {
            defuse_chance: 0.5,
            target_chance: 0.5
          },
          psychologicalEffects: {
            stress: 20
          }
        },
        {
          id: 'play_requests',
          text: 'Play his requests',
          riskLevel: 'low',
          immediateEffects: {},
          longTermEffects: {
            crowd_loves: true,
            feel_like_jukebox: true
          },
          psychologicalEffects: {
            stress: -5
          }
        },
        {
          id: 'crowd_handle',
          text: 'Get the crowd to handle him',
          riskLevel: 'extreme',
          immediateEffects: {},
          longTermEffects: {
            backfire_spectacular: 0.5,
            crowd_police: 0.5
          },
          psychologicalEffects: {
            stress: 25
          }
        }
      ]
    };
  }, [gameState]);

  /**
   * Generate "The Stadium Crisis" event (fan overdose at major show)
   */
  const generateStadiumCrisisEvent = useCallback(() => {
    return {
      id: `stadium_crisis_${Date.now()}`,
      category: 'substance_abuse',
      title: 'The Overdose',
      maturityLevel: 'mature',
      risk: 'extreme',
      contentWarnings: ['overdose', 'death', 'trauma'],
      description: `You're playing to 50,000 people when your security chief interrupts your soundcheck: "We have a situation. Kid collapsed in the front row. Looks like an overdose. Paramedics are working on them, but..." He shakes his head. The kid is wearing your band t-shirt. They're maybe sixteen. The ambulance is pulling up to the venue entrance. Local news crews are arriving. Your show starts in thirty minutes. If they die, it will be connected to your concert forever.`,
      choices: [
        {
          id: 'cancel_respect',
          text: 'Cancel the show out of respect',
          riskLevel: 'medium',
          immediateEffects: {
            money: -500000
          },
          longTermEffects: {
            humanity_shown: true,
            respect_for_life: true
          },
          psychologicalEffects: {
            moral_integrity: 25,
            stress: 15
          }
        },
        {
          id: 'dedicate_show',
          text: 'Dedicate the show to them',
          riskLevel: 'medium',
          immediateEffects: {},
          longTermEffects: {
            exploitation_seen: 0.5,
            honoring_seen: 0.5
          },
          psychologicalEffects: {
            stress: 20
          }
        },
        {
          id: 'no_statement',
          text: 'No official statement, play as planned',
          riskLevel: 'high',
          immediateEffects: {},
          longTermEffects: {
            callous_appearance: true,
            media_narrative: true
          },
          psychologicalEffects: {
            moral_integrity: -15,
            stress: 25
          }
        },
        {
          id: 'visit_hospital',
          text: 'Visit the hospital after the show',
          riskLevel: 'low',
          immediateEffects: {},
          longTermEffects: {
            private_gesture: true,
            publicity_stunt_seen: 0.3
          },
          psychologicalEffects: {
            moral_integrity: 10,
            stress: 10
          }
        }
      ]
    };
  }, []);

  /**
   * Generate "The Pressure Cooker" event (tour burnout)
   */
  const generatePressureCookerEvent = useCallback(() => {
    return {
      id: `pressure_cooker_${Date.now()}`,
      category: 'psychological_horror',
      title: 'The Pressure Cooker',
      maturityLevel: 'mature',
      risk: 'high',
      contentWarnings: ['mental_health', 'breakdown'],
      description: `You're three months into a world tour. Sold-out shows every night. Everyone wants a piece of you - interviews, photo shoots, meet-and-greets. You haven't slept more than 4 hours straight in weeks. You haven't been alone in months. You're in your hotel room in Tokyo, and you can't remember what city you were in yesterday. Your hands are shaking. You catch yourself in the mirror and don't recognize the person staring back. Your phone has 47 missed calls. Your manager is pounding on the door. There's a show in 3 hours.`,
      choices: [
        {
          id: 'uppers_push',
          text: 'Take a handful of uppers and push through',
          riskLevel: 'extreme',
          immediateEffects: {
            energy: 50
          },
          longTermEffects: {
            breakdown_risk_exponential: true,
            manic_legendary_performance: true
          },
          psychologicalEffects: {
            addiction_risk: 30,
            stress: 40,
            paranoia: 20
          }
        },
        {
          id: 'cancel_sleep',
          text: 'Cancel the show and sleep',
          riskLevel: 'medium',
          immediateEffects: {
            money: -50000
          },
          longTermEffects: {
            fans_disappointed: 20000,
            mental_collapse_prevented: true
          },
          psychologicalEffects: {
            stress: -30,
            depression: -10
          }
        },
        {
          id: 'call_family',
          text: 'Call your family/support system',
          riskLevel: 'low',
          immediateEffects: {},
          longTermEffects: {
            stability_provided: true,
            vulnerability_revealed: true,
            industry_vultures: true
          },
          psychologicalEffects: {
            stress: -20,
            depression: -15
          }
        },
        {
          id: 'trash_room',
          text: 'Trash the hotel room and see what happens',
          riskLevel: 'high',
          immediateEffects: {
            money: -5000
          },
          longTermEffects: {
            temporary_relief: true,
            expensive_problems: true,
            tabloid_coverage: true
          },
          psychologicalEffects: {
            stress: -15,
            paranoia: 10
          }
        }
      ]
    };
  }, []);

  /**
   * Generate "The Fan Letter" event (stalking escalation)
   */
  const generateFanLetterEvent = useCallback(() => {
    return {
      id: `fan_letter_${Date.now()}`,
      category: 'psychological_horror',
      title: 'The Fan Letter',
      maturityLevel: 'mature',
      risk: 'severe',
      contentWarnings: ['stalking', 'obsession', 'mental_health'],
      description: `You receive a letter from a fan that stops you cold. They write about how your music saved their life during their darkest moment. They were planning suicide, but your song gave them hope. They include a photo of scars on their wrists and say "Every time I want to hurt myself, I listen to your voice instead." But the letter is too detailed. Too intimate. They know things about you that weren't public. They mention your childhood trauma that you've never spoken about publicly. They say they feel "connected" to you in ways that make your skin crawl.`,
      choices: [
        {
          id: 'write_back',
          text: 'Write back personally',
          riskLevel: 'high',
          immediateEffects: {},
          longTermEffects: {
            dangerous_stalker: 0.5,
            obsessive_behavior: true
          },
          psychologicalEffects: {
            moral_integrity: 10,
            paranoia: 25,
            stress: 15
          }
        },
        {
          id: 'ignore_letter',
          text: 'Ignore it completely',
          riskLevel: 'medium',
          immediateEffects: {},
          longTermEffects: {
            guilt: true,
            mental_health_affected: true,
            songwriting_inspiration: -5
          },
          psychologicalEffects: {
            depression: 15,
            stress: 10
          }
        },
        {
          id: 'share_anonymously',
          text: 'Share their story (anonymously) to help others',
          riskLevel: 'medium',
          immediateEffects: {},
          longTermEffects: {
            positive_impact: true,
            privacy_betrayed: true
          },
          psychologicalEffects: {
            moral_integrity: 15,
            stress: 10
          }
        },
        {
          id: 'contact_authorities',
          text: 'Contact authorities',
          riskLevel: 'low',
          immediateEffects: {},
          longTermEffects: {
            professional_response: true,
            revenge_behavior: 0.3
          },
          psychologicalEffects: {
            stress: 15,
            paranoia: 10
          }
        }
      ]
    };
  }, []);

  /**
   * Check for active arcs and prioritize continuing storylines
   * Returns event from active arc if available, null otherwise
   */
  const checkActiveArcs = useCallback(() => {
    if (!narrativeState?.ongoing_storylines) return null;
    
    const activeArcs = getActiveArcs(narrativeState);
    
    // Prioritize arcs that need continuation
    for (const activeArc of activeArcs) {
      const currentStage = getCurrentArcStage(activeArc.type, narrativeState);
      if (!currentStage) continue;
      
      const stageEvents = getArcStageEvents(activeArc.type, currentStage);
      if (stageEvents.length === 0) continue;
      
      // Select a random event from this stage
      const eventId = stageEvents[Math.floor(Math.random() * stageEvents.length)];
      
      // Map event ID to generator function
      let event = null;
      switch (eventId) {
        case 'rock_bottom':
          event = generateRockBottomEvent();
          break;
        case 'recovery_attempt':
          event = generateRecoveryAttemptEvent();
          break;
        case 'the_deal':
          event = generateTheDealEvent();
          break;
        case 'the_contract':
          event = generateTheContractEvent();
          break;
        case 'payola_scheme':
          event = generatePayolaSchemeEvent();
          break;
        case 'fan_letter':
          event = generateFanLetterEvent();
          break;
        case 'pressure_cooker':
          event = generatePressureCookerEvent();
          break;
        case 'the_shrine':
          // Use existing horror event generator
          const horrors = generateHorrorEvent();
          if (horrors.title === 'The Shrine') {
            event = horrors;
          }
          break;
        default:
          // Try procedural generation for this event type
          if (activeArc.type === 'addiction_spiral') {
            const subStage = currentStage === 'rock_bottom' ? 'addicted' : 
                           currentStage === 'dependency_development' ? 'dependent' :
                           currentStage === 'regular_use' ? 'regular_use' : 'experimental';
            event = generateSubstanceEvent(subStage);
          } else if (activeArc.type === 'corruption_path') {
            event = generateCorruptionEvent(currentStage);
          }
      }
      
      if (event) {
        // Tag event with arc information
        event.arcId = activeArc.type;
        event.arcStage = currentStage;
        return event;
      }
    }
    
    return null;
  }, [narrativeState, generateRockBottomEvent, generateRecoveryAttemptEvent, generateTheDealEvent, generateTheContractEvent, generatePayolaSchemeEvent, generateFanLetterEvent, generatePressureCookerEvent, generateHorrorEvent, generateSubstanceEvent, generateCorruptionEvent]);

  /**
   * Select a specific event based on game state and context
   * Returns event ID string or null if no specific event matches
   */
  const selectSpecificEvent = useCallback((eventType, context) => {
    const specificEvents = [];

    // Post-gig context: bias toward venue-appropriate events
    if (context?.type === 'post_gig' && context?.venue) {
      const v = (context.venue || '').toLowerCase();
      const venueEvents = [];
      if (v.includes('stadium') || v.includes('arena') || v.includes('festival')) venueEvents.push('stadium_crisis');
      if (v.includes('club') || v.includes('coffee') || v.includes('dive') || v.includes('small')) venueEvents.push('the_regular');
      if (v.includes('warehouse')) venueEvents.push('the_deal', 'the_raid');
      if (v.includes('medium') || v.includes('large') || v.includes('venue')) venueEvents.push('pressure_cooker', 'fan_letter');
      specificEvents.push(...venueEvents);
    }

    // Substance abuse events
    if (eventType === 'substance' || eventType === 'random') {
      const subStage = narrativeState.addiction_progression?.stage || 'experimental';
      const weeksClean = narrativeState.addiction_progression?.weeks_clean || 0;
      
      if (subStage === 'addicted' || psychologicalState.addiction_risk > 80) {
        specificEvents.push('rock_bottom');
      }
      if (weeksClean > 4 && psychologicalState.addiction_risk > 20) {
        specificEvents.push('recovery_attempt');
      }
    }
    
    // Corruption events
    if (eventType === 'corruption' || eventType === 'random') {
      const corruptStage = narrativeState.corruption_progression?.stage || 'innocent';
      const fame = gameState?.fame || 0;
      const money = gameState?.money || 0;
      
      if (fame > 100 && money < 100000) {
        specificEvents.push('the_contract');
      }
      if (fame > 50 && gameState?.labelDeal) {
        specificEvents.push('payola_scheme');
      }
      if (corruptStage !== 'innocent' && money > 50000) {
        specificEvents.push('the_skim');
      }
      if (gameState?.currentVenue?.type === 'warehouse' || gameState?.currentVenue?.name?.toLowerCase().includes('warehouse')) {
        specificEvents.push('the_deal');
      }
    }
    
    // Horror/psychological events
    if (eventType === 'horror' || eventType === 'random') {
      const stress = psychologicalState.stress_level || 0;
      const fame = gameState?.fame || 0;
      
      if (stress > 85 && fame > 100) {
        specificEvents.push('pressure_cooker');
      }
      if (fame > 75) {
        specificEvents.push('fan_letter');
      }
    }
    
    // Sexual/relationship events
    if (eventType === 'random') {
      const fame = gameState?.fame || 0;
      const week = gameState?.week || 0;
      
      if (fame > 50 && week > 20) {
        specificEvents.push('groupie_situation');
      }
      if (fame > 100 && week > 40) {
        specificEvents.push('the_affair');
      }
      if (fame > 75 && week > 30) {
        specificEvents.push('the_scandal');
      }
    }
    
    // Violence/conflict events
    if (eventType === 'random') {
      const venueType = gameState?.currentVenue?.type || '';
      const venueName = gameState?.currentVenue?.name || '';
      
      if (venueType === 'dive_bar' || venueName?.toLowerCase().includes('dive')) {
        specificEvents.push('the_regular');
      }
      if (venueType === 'warehouse' || venueName?.toLowerCase().includes('warehouse')) {
        specificEvents.push('the_raid');
      }
      if (venueType === 'stadium' || venueName?.toLowerCase().includes('stadium')) {
        specificEvents.push('stadium_crisis');
      }
      if (Math.random() < 0.3) {
        specificEvents.push('the_fight');
      }
    }
    
    // Randomly select from available specific events
    // Higher chance when post_gig context (venue-appropriate events)
    const useSpecificChance = context?.type === 'post_gig' && specificEvents.length > 0 ? 0.5 : 0.3;
    if (specificEvents.length > 0 && Math.random() < useSpecificChance) {
      return specificEvents[Math.floor(Math.random() * specificEvents.length)];
    }
    
    return null;
  }, [gameState, psychologicalState, narrativeState, generateRockBottomEvent, generateRecoveryAttemptEvent, generateTheDealEvent, generateTheContractEvent, generatePayolaSchemeEvent, generateTheSkimEvent, generateGroupieSituationEvent, generateTheAffairEvent, generateTheScandalEvent, generateTheFightEvent, generateTheRaidEvent, generateTheRegularEvent, generateStadiumCrisisEvent, generatePressureCookerEvent, generateFanLetterEvent]);

  const generateEvent = useCallback((eventType = 'random', context = {}) => {
    // First priority: Check for active arcs that need continuation
    const arcEvent = checkActiveArcs();
    if (arcEvent) {
      // Apply archetype adaptations
      if (narrativeState?.player_archetype?.detected) {
        const adaptedArcEvent = adaptEventToArchetype(arcEvent, narrativeState.player_archetype.detected);
        Object.assign(arcEvent, adaptedArcEvent);
      }
      
      // Apply faction modifications
      if (narrativeState?.faction_standings) {
        const modifiedArcEvent = getFactionModifiedEvents(arcEvent, gameState, narrativeState.faction_standings);
        if (modifiedArcEvent.choices) {
          modifiedArcEvent.choices = modifiedArcEvent.choices.filter(choice => 
            isChoiceAvailable(choice, narrativeState.faction_standings)
          );
        }
        Object.assign(arcEvent, modifiedArcEvent);
      }
      
      // Enhance and filter the arc event
      if (enhancedFeatures?.enabled) {
        const enhancements = {
          maturityLevel: arcEvent.maturityLevel || detectMaturityLevel(arcEvent),
          category: arcEvent.category || categorizeEvent(arcEvent),
          contentWarnings: arcEvent.contentWarnings || detectContentWarnings(arcEvent)
        };
        arcEvent.enhanced = createEnhancedEvent(arcEvent, enhancements).enhanced;
        
        if (!shouldShowEvent(arcEvent, enhancedFeatures)) {
          // If blocked, fall through to other generation
        } else {
          return arcEvent;
        }
      } else {
        arcEvent.enhanced = createEnhancedEvent(arcEvent, {
          maturityLevel: arcEvent.maturityLevel || 'teen',
          category: arcEvent.category || 'general'
        }).enhanced;
        return arcEvent;
      }
    }
    
    // Second priority: Try to select a specific event
    const specificEventId = selectSpecificEvent(eventType, context);
    
    if (specificEventId) {
      let event;
      switch (specificEventId) {
        case 'rock_bottom':
          event = generateRockBottomEvent();
          break;
        case 'recovery_attempt':
          event = generateRecoveryAttemptEvent();
          break;
        case 'the_deal':
          event = generateTheDealEvent();
          break;
        case 'the_contract':
          event = generateTheContractEvent();
          break;
        case 'payola_scheme':
          event = generatePayolaSchemeEvent();
          break;
        case 'the_skim':
          event = generateTheSkimEvent();
          break;
        case 'groupie_situation':
          event = generateGroupieSituationEvent();
          break;
        case 'the_affair':
          event = generateTheAffairEvent();
          break;
        case 'the_fight':
          event = generateTheFightEvent();
          break;
        case 'the_raid':
          event = generateTheRaidEvent();
          break;
        case 'the_regular':
          event = generateTheRegularEvent();
          break;
        case 'stadium_crisis':
          event = generateStadiumCrisisEvent();
          break;
        case 'pressure_cooker':
          event = generatePressureCookerEvent();
          break;
        case 'fan_letter':
          event = generateFanLetterEvent();
          break;
        default:
          event = null;
      }
      
      if (event) {
        // Enhance and filter the specific event
        if (enhancedFeatures?.enabled) {
          const enhancements = {
            maturityLevel: event.maturityLevel || detectMaturityLevel(event),
            category: event.category || categorizeEvent(event),
            contentWarnings: event.contentWarnings || detectContentWarnings(event)
          };
          event = createEnhancedEvent(event, enhancements);
          
          if (!shouldShowEvent(event, enhancedFeatures)) {
            // If blocked, fall through to procedural generation
            event = null;
          }
        } else if (event) {
          event = createEnhancedEvent(event, {
            maturityLevel: event.maturityLevel || 'teen',
            category: event.category || 'general'
          });
        }
        
        if (event) return event;
      }
    }
    
    // Fall back to procedural generation if no specific event selected or blocked
    if (eventType === 'random') {
      // Use psychological weighting to select event type
      const weights = calculateEventWeights(psychologicalState);
      eventType = selectEventTypeByWeights(weights);
    }
    
    // Generate base event
    let event;
    switch (eventType) {
      case 'substance':
        const subStage = narrativeState.addiction_progression?.stage || 'experimental';
        event = generateSubstanceEvent(subStage);
        break;
        
      case 'corruption':
        const corruptStage = narrativeState.corruption_progression?.stage || 'first_compromise';
        event = generateCorruptionEvent(corruptStage);
        break;
        
      case 'horror':
        event = generateHorrorEvent();
        break;
        
      default:
        event = generateSubstanceEvent();
    }
    
    // If no event generated yet, try template-based generation (30% chance)
    if (!event && Math.random() < 0.3) {
      const templateTypes = ['corruption_offer', 'substance_temptation', 'moral_crossroads', 'venue_incident'];
      const templateType = templateTypes[Math.floor(Math.random() * templateTypes.length)];
      const templateEvent = generateFromTemplate(templateType, gameState, {
        psychologicalState,
        narrativeState,
        venue: gameState?.currentVenue
      });
      
      if (templateEvent) {
        event = templateEvent;
      }
    }
    // Apply archetype adaptations
    if (event && narrativeState?.player_archetype?.detected) {
      event = adaptEventToArchetype(event, narrativeState.player_archetype.detected);
    }
    
    // Apply faction modifications before enhancing
    if (event && narrativeState?.faction_standings) {
      event = getFactionModifiedEvents(event, gameState, narrativeState.faction_standings);
      
      // Filter choices based on faction requirements
      if (event.choices) {
        event.choices = event.choices.filter(choice => 
          isChoiceAvailable(choice, narrativeState.faction_standings)
        );
      }
    }
    
    // Enhance event with enhanced features wrapper
    if (event && enhancedFeatures?.enabled) {
      // Auto-detect maturity level and category if not already set
      const enhancements = {
        maturityLevel: event.maturityLevel || detectMaturityLevel(event),
        category: event.category || categorizeEvent(event),
        contentWarnings: event.contentWarnings || detectContentWarnings(event)
      };
      
      event = createEnhancedEvent(event, enhancements);
      
      // Filter by user preferences
      if (!shouldShowEvent(event, enhancedFeatures)) {
        // Event blocked by preferences - recursively generate another
        // Prevent infinite loops with max recursion
        if (!generateEvent.recursionDepth) {
          generateEvent.recursionDepth = 0;
        }
        
        if (generateEvent.recursionDepth < 5) {
          generateEvent.recursionDepth++;
          const alternative = generateEvent('random');
          generateEvent.recursionDepth--;
          return alternative;
        } else {
          // Fallback: return event anyway after 5 recursions
          generateEvent.recursionDepth = 0;
          return event;
        }
      }
    } else if (event && !enhancedFeatures?.enabled) {
      // If enhanced features disabled, still wrap but don't filter
      event = createEnhancedEvent(event, {
        maturityLevel: event.maturityLevel || 'teen',
        category: event.category || 'general'
      });
    }
    
    return event;
  }, [
    psychologicalState,
    narrativeState,
    enhancedFeatures,
    gameState,
    selectSpecificEvent,
    generateRockBottomEvent,
    generateRecoveryAttemptEvent,
    generateTheDealEvent,
    generateTheContractEvent,
    generatePayolaSchemeEvent,
    generateTheSkimEvent,
    generateGroupieSituationEvent,
    generateTheAffairEvent,
    generateTheScandalEvent,
    generateTheFightEvent,
    generateTheRaidEvent,
    generateTheRegularEvent,
    generateStadiumCrisisEvent,
    generatePressureCookerEvent,
    generateFanLetterEvent,
    generateSubstanceEvent,
    generateCorruptionEvent,
    generateHorrorEvent,
    calculateEventWeights,
    selectEventTypeByWeights,
    checkActiveArcs,
    createEnhancedEvent,
    detectMaturityLevel,
    categorizeEvent,
    detectContentWarnings,
    shouldShowEvent,
    generateFromTemplate,
    getFactionModifiedEvents,
    isChoiceAvailable,
    adaptEventToArchetype
  ]);

  return {
    generateEvent,
    generateSubstanceEvent,
    generateCorruptionEvent,
    generateHorrorEvent,
    // Specific event generators
    generateRockBottomEvent,
    generateRecoveryAttemptEvent,
    generateTheDealEvent,
    generateTheContractEvent,
    generatePayolaSchemeEvent,
    generateTheSkimEvent,
    generateGroupieSituationEvent,
    generateTheAffairEvent,
    generateTheScandalEvent,
    generateTheFightEvent,
    generateTheRaidEvent,
    generateTheRegularEvent,
    generateStadiumCrisisEvent,
    generatePressureCookerEvent,
    generateFanLetterEvent,
    selectCharacter,
    applyPsychologicalEffects,
    calculateEventWeights,
    selectEventTypeByWeights
  };
};

export default useEventGeneration;
