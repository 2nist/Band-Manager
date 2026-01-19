/**
 * PHASE 2 SAVE/LOAD FORMAT SPECIFICATION
 * 
 * Complete guide for saving and loading games with consequence system
 */

// ==================== SAVE FILE STRUCTURE ====================

const PHASE2_SAVE_FORMAT = {
  version: '2.0',
  
  // Game identification
  metadata: {
    bandName: 'The Broken Strings',
    scenario: 'indie-hustle',
    difficulty: 'medium',
    week: 42,
    timestamp: '2026-01-19T14:35:22Z',
    playtimeMSeconds: 3600000, // 1 hour
    completionPercentage: 35
  },

  // PHASE 1: Core game state (existing)
  gameState: {
    week: 42,
    money: 15000,
    fame: 350,
    bandName: 'The Broken Strings',
    bandMembers: [...],
    songs: [...],
    albums: [...],
    rivals: [...],
    gameLog: [...]
    // ... all existing game data
  },

  // PHASE 2: Consequence tracking
  consequences: {
    active: [
      {
        id: 'corruption_path_started',
        triggerChoice: 'accepted_small_bribe',
        triggerWeek: 15,
        currentStage: 'moral_flexibility',
        nextEscalation: 25,
        escalationEvents: ['bigger_bribe_offer', 'criminal_contact', 'blackmail_material'],
        recoveryPossible: true,
        recoveryDifficulty: 0.3,
        severity: 'medium',
        tags: ['corruption', 'criminal'],
        metadata: {
          consequenceChainId: 'corruption_storyline_v1',
          choiceText: 'Accept the $10,000 cash payment',
          factionAffected: 'criminal_underworld'
        }
      },
      // ... more active consequences
    ],
    
    dormant: [
      {
        id: 'burned_bridge_manager',
        triggerChoice: 'fired_stealing_manager',
        triggerWeek: 8,
        resurfaceConditions: {
          fameLevels: [200, 500],
          eventTypes: ['manager_search', 'industry_networking'],
          probability: 0.6
        },
        resurfaceEvents: ['former_manager_sabotage', 'industry_blacklist', 'reputation_damage'],
        resurrectProbability: 0.5,
        timesResurfaced: 0,
        nextResurfaceWindow: null,
        metadata: {
          originalContext: 'Fired manager for stealing band funds'
        }
      },
      // ... more dormant consequences
    ]
  },

  // PHASE 2: Faction reputation system
  factions: {
    underground_scene: {
      name: 'Underground Scene',
      currentStanding: 75,
      values: ['authenticity', 'anti_establishment', 'artistic_integrity'],
      maxStanding: 100,
      minStanding: -100,
      decayPerWeek: 1,
      lastActivityWeek: 40,
      standingHistory: [
        { week: 0, standing: 50 },
        { week: 15, standing: 55, changeReason: 'authentic_collaboration' },
        { week: 22, standing: 65, changeReason: 'rejected_major_label' },
        { week: 40, standing: 75, changeReason: 'supported_local_venues' }
      ]
    },
    
    corporate_industry: {
      name: 'Corporate Music Industry',
      currentStanding: -20,
      values: ['profitability', 'marketability', 'brand_safety'],
      maxStanding: 100,
      minStanding: -100,
      decayPerWeek: 1,
      lastActivityWeek: 35,
      standingHistory: [
        { week: 0, standing: 50 },
        { week: 12, standing: 35, changeReason: 'rejected_sponsorship' },
        { week: 35, standing: -20, changeReason: 'scandal_involvement' }
      ]
    },
    
    criminal_underworld: {
      name: 'Criminal Networks',
      currentStanding: 15,
      values: ['loyalty', 'silence', 'mutual_benefit'],
      maxStanding: 100,
      minStanding: 0,
      decayPerWeek: 0,
      lastActivityWeek: 15,
      standingHistory: [
        { week: 15, standing: 15, changeReason: 'accepted_small_bribe' }
      ]
    },
    
    law_enforcement: {
      name: 'Law Enforcement',
      currentStanding: 45,
      values: ['law_and_order', 'cooperation', 'public_safety'],
      maxStanding: 100,
      minStanding: -100,
      decayPerWeek: 0.5,
      lastActivityWeek: 38,
      standingHistory: [
        { week: 0, standing: 50 },
        { week: 38, standing: 45, changeReason: 'minor_incident' }
      ]
    }
  },

  // PHASE 2: Psychological evolution
  psychologicalEvolution: {
    corruptionPath: {
      currentLevel: 15,
      stage: 'minor_temptation',
      milestones: [
        { threshold: 25, stage: 'minor_temptation', unlocks: ['minor_criminal_offers'], reached: false },
        { threshold: 50, stage: 'moral_compromise', unlocks: ['major_criminal_offers'], reached: false },
        { threshold: 75, stage: 'no_turning_back', unlocks: ['criminal_empire_options'], reached: false },
        { threshold: 100, stage: 'fully_corrupted', unlocks: ['no_redemption_paths'], reached: false }
      ],
      evolutionRate: 1.5,
      recoveryAttempts: 0,
      progressionHistory: [
        { week: 15, newLevel: 15, reason: 'accepted_bribe' }
      ]
    },
    
    addictionPath: {
      stages: ['clean', 'experimentation', 'regular_use', 'dependency', 'addiction', 'rock_bottom'],
      currentStage: 'clean',
      severity: 0,
      escalationTriggers: ['stress_events', 'peer_pressure', 'creative_blocks'],
      recoveryAttempts: 0,
      relapseProbability: 0.8,
      progressionHistory: []
    },
    
    mentalHealth: {
      stressLevel: 35,
      paranoia: 5,
      isolation: 0,
      depression: 0,
      hopelessness: 0,
      healthHistory: [
        { week: 20, metric: 'stressLevel', value: 20 },
        { week: 30, metric: 'stressLevel', value: 30 },
        { week: 40, metric: 'stressLevel', value: 35 },
        { week: 40, metric: 'paranoia', value: 5 }
      ]
    }
  },

  // Questline tracking (new)
  questlines: {
    'corruption_storyline_v1': {
      status: 'in_progress',
      startWeek: 15,
      triggers: ['accepted_small_bribe'],
      currentStage: 'moral_flexibility',
      nextStage: 'bigger_offer',
      stageReachedWeek: 25,
      consequences: ['corruption_path_started'],
      factionInvolved: ['criminal_underworld', 'law_enforcement'],
      playerChoices: [
        { week: 15, choice: 'Accept the $10,000 cash payment', outcome: 'accepted' }
      ]
    }
  }
};

// ==================== SAVE/LOAD IMPLEMENTATION ====================

/**
 * Enhanced save function that includes Phase 2 data
 */
export const enhancedSaveGame = (gameStateHook, consequenceHook, slotName) => {
  const saveData = {
    version: '2.0',
    
    metadata: {
      bandName: gameStateHook.state.bandName,
      scenario: gameStateHook.state.scenario,
      week: gameStateHook.state.week,
      timestamp: new Date().toISOString()
    },
    
    // Phase 1 data
    gameState: gameStateHook.state,
    rivals: gameStateHook.rivals || [],
    gameLog: gameStateHook.gameLog || [],
    
    // Phase 2 data
    consequences: consequenceHook.consequences,
    factions: consequenceHook.factions,
    psychologicalEvolution: consequenceHook.psychologicalEvolution
  };

  try {
    const currentSlots = JSON.parse(localStorage.getItem('gigmaster_saveSlots') || '{}');
    currentSlots[slotName] = saveData;
    localStorage.setItem('gigmaster_saveSlots', JSON.stringify(currentSlots));
    
    console.log(`Game saved to slot: ${slotName}`);
    return true;
  } catch (err) {
    console.error('Save failed:', err);
    return false;
  }
};

/**
 * Enhanced load function that restores Phase 2 data
 */
export const enhancedLoadGame = (slotName, gameStateHook, consequenceHook) => {
  try {
    const slots = JSON.parse(localStorage.getItem('gigmaster_saveSlots') || '{}');
    const saveData = slots[slotName];
    
    if (!saveData) {
      console.warn(`Save slot "${slotName}" not found`);
      return false;
    }

    // Validate version compatibility
    if (saveData.version !== '2.0') {
      console.warn(`Save file version mismatch. Expected 2.0, got ${saveData.version}`);
      // Could implement migration logic here
    }

    // Restore Phase 1 data
    gameStateHook.setState(saveData.gameState);
    
    // Restore Phase 2 data (hooks auto-load from localStorage)
    localStorage.setItem('gigmaster_consequences', JSON.stringify(saveData.consequences));
    localStorage.setItem('gigmaster_factions', JSON.stringify(saveData.factions));
    localStorage.setItem('gigmaster_psychology', JSON.stringify(saveData.psychologicalEvolution));
    
    // Reload hooks will pick up from localStorage
    console.log(`Game loaded from slot: ${slotName}`);
    return true;
  } catch (err) {
    console.error('Load failed:', err);
    return false;
  }
};

/**
 * Migration function for upgrading Phase 1 saves to Phase 2
 */
export const migratePhase1ToPhase2 = (phase1SaveData) => {
  return {
    version: '2.0',
    
    metadata: {
      ...phase1SaveData.metadata,
      migratedFromVersion: '1.0',
      migrationDate: new Date().toISOString()
    },
    
    // Keep Phase 1 data unchanged
    gameState: phase1SaveData.state,
    rivals: phase1SaveData.rivals || [],
    gameLog: phase1SaveData.gameLog || [],
    
    // Initialize Phase 2 data as empty/default
    consequences: {
      active: [],
      dormant: []
    },
    
    factions: {
      underground_scene: {
        name: 'Underground Scene',
        currentStanding: 50,
        values: ['authenticity', 'anti_establishment', 'artistic_integrity'],
        maxStanding: 100,
        minStanding: -100,
        decayPerWeek: 1,
        lastActivityWeek: phase1SaveData.state?.week || 0
      },
      corporate_industry: {
        name: 'Corporate Music Industry',
        currentStanding: 50,
        values: ['profitability', 'marketability', 'brand_safety'],
        maxStanding: 100,
        minStanding: -100,
        decayPerWeek: 1,
        lastActivityWeek: phase1SaveData.state?.week || 0
      },
      criminal_underworld: {
        name: 'Criminal Networks',
        currentStanding: 0,
        values: ['loyalty', 'silence', 'mutual_benefit'],
        maxStanding: 100,
        minStanding: 0,
        decayPerWeek: 0,
        lastActivityWeek: null
      },
      law_enforcement: {
        name: 'Law Enforcement',
        currentStanding: 50,
        values: ['law_and_order', 'cooperation', 'public_safety'],
        maxStanding: 100,
        minStanding: -100,
        decayPerWeek: 0.5,
        lastActivityWeek: phase1SaveData.state?.week || 0
      }
    },
    
    psychologicalEvolution: {
      corruptionPath: {
        currentLevel: 0,
        stage: null,
        milestones: [
          { threshold: 25, stage: 'minor_temptation', unlocks: ['minor_criminal_offers'] },
          { threshold: 50, stage: 'moral_compromise', unlocks: ['major_criminal_offers'] },
          { threshold: 75, stage: 'no_turning_back', unlocks: ['criminal_empire_options'] },
          { threshold: 100, stage: 'fully_corrupted', unlocks: ['no_redemption_paths'] }
        ],
        evolutionRate: 1.5,
        recoveryAttempts: 0
      },
      addictionPath: {
        stages: ['clean', 'experimentation', 'regular_use', 'dependency', 'addiction', 'rock_bottom'],
        currentStage: 'clean',
        severity: 0,
        escalationTriggers: ['stress_events', 'peer_pressure', 'creative_blocks'],
        recoveryAttempts: 0,
        relapseProbability: 0.8
      },
      mentalHealth: {
        stressLevel: 30,
        paranoia: 0,
        isolation: 0,
        depression: 0,
        hopelessness: 0
      }
    }
  };
};

/**
 * Export save data as JSON file (for backup/sharing)
 */
export const exportSaveAsJSON = (slotName) => {
  try {
    const slots = JSON.parse(localStorage.getItem('gigmaster_saveSlots') || '{}');
    const saveData = slots[slotName];
    
    if (!saveData) return null;

    const dataStr = JSON.stringify(saveData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gigmaster_save_${slotName}_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('Export failed:', err);
    return false;
  }
};

/**
 * Import save data from JSON file
 */
export const importSaveFromJSON = async (file, slotName) => {
  try {
    const text = await file.text();
    const saveData = JSON.parse(text);
    
    // Validate structure
    if (!saveData.gameState || !saveData.version) {
      throw new Error('Invalid save file format');
    }

    const currentSlots = JSON.parse(localStorage.getItem('gigmaster_saveSlots') || '{}');
    currentSlots[slotName] = saveData;
    localStorage.setItem('gigmaster_saveSlots', JSON.stringify(currentSlots));
    
    return true;
  } catch (err) {
    console.error('Import failed:', err);
    return false;
  }
};
