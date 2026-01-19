import { useCallback, useMemo } from 'react';

/**
 * useEventGeneration - Procedural generation of gritty, mature events
 * 
 * Generates infinite unique events based on:
 * - Game state (fame, money, week, band status)
 * - Psychological state (stress, addiction, moral integrity)
 * - Narrative context (ongoing storylines, faction standing)
 * - Player archetype (detected psychological profile)
 * 
 * @param {Object} gameState - Current game state
 * @param {Object} psychologicalState - Player's psychological profile
 * @param {Object} narrativeState - Story progression tracking
 * @returns {Object} Event generation methods
 */
export const useEventGeneration = (gameState, psychologicalState, narrativeState) => {
  
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

  const selectCharacter = useCallback((archetypeKey) => {
    const archetype = CHARACTER_ARCHETYPES[archetypeKey];
    if (!archetype) return null;
    
    const name = archetype.names[Math.floor(Math.random() * archetype.names.length)];
    const dialogue = archetype.dialogues[Math.floor(Math.random() * archetype.dialogues.length)];
    
    return {
      archetype: archetypeKey,
      name,
      dialogue,
      traits: archetype.traits
    };
  }, [CHARACTER_ARCHETYPES]);

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
        description: `Your guitarist comes to you after the show, eyes dilated, movements jittery. "Dude, you HAVE to try this. I've never felt so... connected to the music. Like I could see the sound waves." They hold out a small baggie. Several industry people are watching.`
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
  }, [psychologicalState.addiction_risk, selectCharacter]);

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
   * Generate event based on current state
   */
  const generateEvent = useCallback((eventType = 'random') => {
    if (eventType === 'random') {
      const roll = Math.random();
      
      // Probability affected by psychological state and game progress
      if (psychologicalState.addiction_risk > 50) {
        if (roll < 0.4) eventType = 'substance';
      }
      if (psychologicalState.moral_integrity < 40) {
        if (roll < 0.4) eventType = 'corruption';
      }
      if (psychologicalState.stress_level > 70) {
        if (roll < 0.3) eventType = 'horror';
      }
      
      if (eventType === 'random') {
        const types = ['substance', 'corruption', 'horror'];
        eventType = types[Math.floor(Math.random() * types.length)];
      }
    }
    
    switch (eventType) {
      case 'substance':
        const subStage = narrativeState.addiction_progression?.stage || 'experimental';
        return generateSubstanceEvent(subStage);
        
      case 'corruption':
        const corruptStage = narrativeState.corruption_progression?.stage || 'first_compromise';
        return generateCorruptionEvent(corruptStage);
        
      case 'horror':
        return generateHorrorEvent();
        
      default:
        return generateSubstanceEvent();
    }
  }, [psychologicalState, narrativeState, generateSubstanceEvent, generateCorruptionEvent, generateHorrorEvent]);

  return {
    generateEvent,
    generateSubstanceEvent,
    generateCorruptionEvent,
    generateHorrorEvent,
    selectCharacter
  };
};

export default useEventGeneration;
