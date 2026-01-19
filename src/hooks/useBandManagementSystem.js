import { useState, useCallback } from 'react';

/**
 * useBandManagementSystem - Band member recruitment, development, and management
 * Handles:
 * - Member hiring with skill/morale/chemistry
 * - Individual stat progression
 * - Band morale and dynamics
 * - Conflict resolution and drama
 * - Member satisfaction and turnover
 */
export const useBandManagementSystem = (gameState, updateGameState, addLog) => {
  const PRE_MADE_CANDIDATES = [
    { id: 'alex-storm', name: 'Alex Storm', role: 'Vocals', skill: 7, morale: 75, creativity: 8, reliability: 7, chemistry: 0 },
    { id: 'jamie-cross', name: 'Jamie Cross', role: 'Lead Guitar', skill: 8, morale: 70, creativity: 9, reliability: 6, chemistry: 0 },
    { id: 'riley-bass', name: 'Riley Bass', role: 'Bass', skill: 7, morale: 80, creativity: 6, reliability: 8, chemistry: 0 },
    { id: 'casey-beat', name: 'Casey Beat', role: 'Drums', skill: 8, morale: 85, creativity: 7, reliability: 7, chemistry: 0 },
    { id: 'morgan-keys', name: 'Morgan Keys', role: 'Keys', skill: 6, morale: 72, creativity: 8, reliability: 8, chemistry: 0 },
    { id: 'sam-thunder', name: 'Sam Thunder', role: 'Lead Guitar', skill: 9, morale: 60, creativity: 10, reliability: 5, chemistry: 0 },
    { id: 'dev-synth', name: 'Dev Synth', role: 'Synth', skill: 7, morale: 78, creativity: 9, reliability: 7, chemistry: 0 },
    { id: 'nikki-percussion', name: 'Nikki Percussion', role: 'Percussion', skill: 6, morale: 82, creativity: 7, reliability: 6, chemistry: 0 },
    { id: 'blake-turntable', name: 'Blake Turntable', role: 'DJ', skill: 8, morale: 75, creativity: 9, reliability: 6, chemistry: 0 },
    { id: 'taylor-harmony', name: 'Taylor Harmony', role: 'Vocals', skill: 7, morale: 77, creativity: 8, reliability: 8, chemistry: 0 },
    { id: 'jordan-rock', name: 'Jordan Rock', role: 'Rhythm Guitar', skill: 6, morale: 73, creativity: 6, reliability: 9, chemistry: 0 },
    { id: 'casey-pulse', name: 'Casey Pulse', role: 'Bass', skill: 7, morale: 79, creativity: 5, reliability: 9, chemistry: 0 }
  ];

  const CONFLICT_TYPES = [
    { type: 'creative-difference', severity: 'medium', resolution: 'collaboration-session' },
    { type: 'ego-clash', severity: 'high', resolution: 'mediation' },
    { type: 'romance-drama', severity: 'high', resolution: 'space' },
    { type: 'substance-issue', severity: 'critical', resolution: 'rehab-counseling' },
    { type: 'payment-dispute', severity: 'medium', resolution: 'renegotiate' },
    { type: 'schedule-conflict', severity: 'low', resolution: 'compromise' },
    { type: 'direction-disagreement', severity: 'medium', resolution: 'vision-discussion' }
  ];

  /**
   * Get available candidates for recruitment
   */
  const getAvailableCandidates = useCallback(() => {
    const currentMembers = gameState.bandMembers || [];
    const currentIds = new Set(currentMembers.map(m => m.id));
    return PRE_MADE_CANDIDATES.filter(c => !currentIds.has(c.id));
  }, [gameState.bandMembers]);

  /**
   * Hire a band member
   */
  const hireMember = useCallback((candidateId) => {
    const candidates = getAvailableCandidates();
    const candidate = candidates.find(c => c.id === candidateId);
    
    if (!candidate) {
      addLog('error', 'Candidate not available for hiring');
      return { success: false, reason: 'not-available' };
    }

    const hireCost = 500 + candidate.skill * 200; // Higher skill = higher hire cost
    const currentMoney = gameState.money || 0;

    if (currentMoney < hireCost) {
      addLog('error', `Need $${hireCost} to hire ${candidate.name} (have $${currentMoney})`);
      return { success: false, reason: 'insufficient-funds', cost: hireCost };
    }

    // Add member to band
    const newMember = {
      ...candidate,
      id: `member-${Date.now()}`,
      originalId: candidateId,
      hireWeek: gameState.week || 0,
      contractLength: 52, // 1 year contract
      salary: 100 + candidate.skill * 50,
      experience: 0,
      experienceNeeded: 100
    };

    const updatedMembers = [...(gameState.bandMembers || []), newMember];

    updateGameState({
      bandMembers: updatedMembers,
      money: currentMoney - hireCost
    });

    addLog('success', `Hired ${candidate.name} (${candidate.role}) for $${hireCost}`);

    return { success: true, member: newMember };
  }, [gameState, updateGameState, addLog, getAvailableCandidates]);

  /**
   * Fire a band member
   */
  const fireMember = useCallback((memberId) => {
    const members = gameState.bandMembers || [];
    const member = members.find(m => m.id === memberId);

    if (!member) {
      addLog('error', 'Member not found');
      return { success: false };
    }

    // Firing cost (severance)
    const severanceCost = Math.floor(member.salary * 2);
    const moralePenalty = 5; // Band morale drops when members are fired

    const updatedMembers = members.filter(m => m.id !== memberId);
    const newMorale = Math.max(0, (gameState.morale || 50) - moralePenalty);

    updateGameState({
      bandMembers: updatedMembers,
      morale: newMorale,
      money: (gameState.money || 0) - severanceCost
    });

    addLog('warning', `Fired ${member.name} (${member.role}). Severance: $${severanceCost}, Morale -${moralePenalty}`);

    return { success: true, severanceCost, moralePenalty };
  }, [gameState, updateGameState, addLog]);

  /**
   * Level up member skill through practice
   */
  const practiceMember = useCallback((memberId, budget = 1000) => {
    const members = gameState.bandMembers || [];
    const memberIndex = members.findIndex(m => m.id === memberId);

    if (memberIndex === -1) {
      addLog('error', 'Member not found');
      return { success: false };
    }

    const currentMoney = gameState.money || 0;
    if (currentMoney < budget) {
      addLog('error', `Need $${budget} for practice session (have $${currentMoney})`);
      return { success: false, reason: 'insufficient-funds' };
    }

    const member = members[memberIndex];
    const skillGain = Math.floor(budget / 500); // $500 = 1 skill point
    const maxSkill = 10;

    const updatedMember = {
      ...member,
      skill: Math.min(maxSkill, member.skill + skillGain),
      morale: Math.min(100, member.morale + 3)
    };

    const updatedMembers = [...members];
    updatedMembers[memberIndex] = updatedMember;

    updateGameState({
      bandMembers: updatedMembers,
      money: currentMoney - budget
    });

    addLog('success', `${member.name} practiced: Skill +${skillGain}, Morale +3`);

    return { success: true, skillGain, member: updatedMember };
  }, [gameState, updateGameState, addLog]);

  /**
   * Improve member morale (bonuses, celebrations)
   */
  const boostMorale = useCallback((memberId, budget = 500) => {
    const members = gameState.bandMembers || [];
    const memberIndex = members.findIndex(m => m.id === memberId);

    if (memberIndex === -1) {
      addLog('error', 'Member not found');
      return { success: false };
    }

    const currentMoney = gameState.money || 0;
    if (currentMoney < budget) {
      addLog('error', `Need $${budget} for morale boost (have $${currentMoney})`);
      return { success: false };
    }

    const member = members[memberIndex];
    const moraleGain = Math.min(100 - member.morale, Math.floor(budget / 100));

    const updatedMember = {
      ...member,
      morale: Math.min(100, member.morale + moraleGain)
    };

    const updatedMembers = [...members];
    updatedMembers[memberIndex] = updatedMember;

    updateGameState({
      bandMembers: updatedMembers,
      money: currentMoney - budget
    });

    addLog('success', `${member.name} morale boosted +${moraleGain}`);

    return { success: true, moraleGain };
  }, [gameState, updateGameState, addLog]);

  /**
   * Generate random conflict between band members
   */
  const generateConflict = useCallback(() => {
    const members = gameState.bandMembers || [];
    if (members.length < 2) return null;

    // Random chance of conflict increases with low morale
    const conflictChance = 0.15 + ((100 - (gameState.morale || 50)) / 500);
    if (Math.random() > conflictChance) return null;

    const member1 = members[Math.floor(Math.random() * members.length)];
    let member2 = member1;
    while (member2.id === member1.id && members.length > 1) {
      member2 = members[Math.floor(Math.random() * members.length)];
    }

    const conflictType = CONFLICT_TYPES[Math.floor(Math.random() * CONFLICT_TYPES.length)];

    const conflict = {
      id: `conflict-${Date.now()}`,
      type: conflictType.type,
      members: [member1.id, member2.id],
      severity: conflictType.severity,
      resolution: conflictType.resolution,
      week: gameState.week || 0,
      resolved: false,
      impact: 'pending'
    };

    return conflict;
  }, [gameState.bandMembers, gameState.morale, gameState.week]);

  /**
   * Resolve a band conflict
   */
  const resolveConflict = useCallback((conflictId, resolutionAction, budget = 0) => {
    const conflict = gameState.activeConflicts?.find(c => c.id === conflictId);

    if (!conflict) {
      addLog('error', 'Conflict not found');
      return { success: false };
    }

    const currentMoney = gameState.money || 0;
    if (currentMoney < budget) {
      addLog('error', `Need $${budget} for resolution (have $${currentMoney})`);
      return { success: false };
    }

    const members = gameState.bandMembers || [];
    const member1 = members.find(m => m.id === conflict.members[0]);
    const member2 = members.find(m => m.id === conflict.members[1]);

    let success = true;
    let moraleLoss = 0;
    let chemistryGain = 0;

    if (resolutionAction === 'mediation') {
      // Professional mediation - high success rate
      success = Math.random() > 0.2;
      moraleLoss = 3;
      chemistryGain = 5;
    } else if (resolutionAction === 'collaboration-session') {
      // Creative collaboration
      success = Math.random() > 0.3;
      moraleLoss = 2;
      chemistryGain = 8;
    } else if (resolutionAction === 'compromise') {
      // Both give ground
      success = Math.random() > 0.25;
      moraleLoss = 1;
      chemistryGain = 3;
    } else if (resolutionAction === 'space') {
      // Time apart
      success = Math.random() > 0.4;
      moraleLoss = 5;
      chemistryGain = 2;
    } else if (resolutionAction === 'rehab-counseling') {
      // Intervention for serious issues
      success = Math.random() > 0.35;
      moraleLoss = 10;
      chemistryGain = 6;
      budget = Math.max(2000, budget);
    }

    const resolvedConflicts = (gameState.activeConflicts || []).map(c =>
      c.id === conflictId ? { ...c, resolved: true, impact: success ? 'resolved' : 'failed' } : c
    );

    const updatedMembers = members.map(m => {
      if (m.id === member1.id || m.id === member2.id) {
        return {
          ...m,
          morale: Math.max(0, m.morale - moraleLoss),
          chemistry: (m.chemistry || 0) + (success ? chemistryGain : 0)
        };
      }
      return m;
    });

    updateGameState({
      bandMembers: updatedMembers,
      activeConflicts: resolvedConflicts,
      money: currentMoney - budget,
      morale: Math.max(0, (gameState.morale || 50) - (success ? 0 : 5))
    });

    const result = success ? 'resolved' : 'unresolved';
    addLog(success ? 'success' : 'warning', 
      `Conflict between ${member1?.name} and ${member2?.name} ${result}. Cost: $${budget}`);

    return { success, cost: budget, moraleLoss };
  }, [gameState, updateGameState, addLog]);

  /**
   * Process weekly band expenses and morale changes
   */
  const processWeeklyBandMaintenance = useCallback(() => {
    const members = gameState.bandMembers || [];
    if (members.length === 0) return;

    let totalSalaries = 0;
    let moraleDelta = 0;

    // Pay salaries
    const updatedMembers = members.map(member => {
      totalSalaries += member.salary;
      
      // Morale naturally decays slightly unless morale boost is recent
      let newMorale = Math.max(0, member.morale - 1);
      
      // Morale improves if band is doing well
      if (gameState.fame > 1000) newMorale += 2;
      if (gameState.recentGigs > 2) newMorale += 1;

      return { ...member, morale: newMorale };
    });

    const currentMoney = gameState.money || 0;
    const insufficientFunds = currentMoney < totalSalaries;

    if (!insufficientFunds) {
      updateGameState({
        bandMembers: updatedMembers,
        money: currentMoney - totalSalaries
      });
      addLog('info', `Paid band salaries: $${totalSalaries}`);
    } else {
      addLog('error', `Insufficient funds for salaries! Need $${totalSalaries - currentMoney} more`);
      // Morale penalty for unpaid salaries
      const penaltyMembers = updatedMembers.map(m => ({
        ...m,
        morale: Math.max(0, m.morale - 15)
      }));
      updateGameState({ bandMembers: penaltyMembers });
    }

    // Check for conflicts
    const conflict = generateConflict();
    if (conflict) {
      updateGameState({
        activeConflicts: [...(gameState.activeConflicts || []), conflict]
      });
      addLog('warning', `Band conflict: ${conflict.type}`);
    }
  }, [gameState, updateGameState, addLog, generateConflict]);

  /**
   * Get band cohesion stat (average chemistry)
   */
  const getBandCohesion = useCallback(() => {
    const members = gameState.bandMembers || [];
    if (members.length === 0) return 50;

    const avgChemistry = members.reduce((sum, m) => sum + (m.chemistry || 0), 0) / members.length;
    const avgMorale = members.reduce((sum, m) => sum + m.morale, 0) / members.length;

    // Cohesion is blend of chemistry and morale
    return Math.floor((avgChemistry * 0.4 + avgMorale * 0.6));
  }, [gameState.bandMembers]);

  /**
   * Get band stats overview
   */
  const getBandStats = useCallback(() => {
    const members = gameState.bandMembers || [];
    
    return {
      memberCount: members.length,
      avgSkill: members.length > 0 
        ? Math.floor(members.reduce((sum, m) => sum + m.skill, 0) / members.length)
        : 0,
      avgMorale: members.length > 0
        ? Math.floor(members.reduce((sum, m) => sum + m.morale, 0) / members.length)
        : 0,
      cohesion: getBandCohesion(),
      totalSalaries: members.reduce((sum, m) => sum + m.salary, 0),
      members: members
    };
  }, [gameState.bandMembers, getBandCohesion]);

  return {
    // Recruitment
    getAvailableCandidates,
    hireMember,
    fireMember,

    // Development
    practiceMember,
    boostMorale,

    // Conflict
    generateConflict,
    resolveConflict,

    // Maintenance
    processWeeklyBandMaintenance,

    // Stats
    getBandCohesion,
    getBandStats
  };
};
