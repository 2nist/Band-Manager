/**
 * eventSystem.js - Event management and handling
 * 
 * Manages regular game events (not dialogue events)
 * Extracted from useGameLogic to provide pure event utilities
 */

// ===== EVENT TYPES =====

export const eventTypes = {
  // Good events
  record_deal: {
    type: 'opportunity',
    category: 'music_business',
    title: 'Record Label Interested',
    description: 'A record label wants to sign you!',
    rarity: 'rare',
    effect: { fame: 50, money: 10000, stressReduction: 20 }
  },

  radio_play: {
    type: 'opportunity',
    category: 'exposure',
    title: 'Radio Airplay',
    description: 'Your song made it to the radio!',
    rarity: 'uncommon',
    effect: { fame: 30, streams: 50000 }
  },

  sponsorship: {
    type: 'opportunity',
    category: 'business',
    title: 'Sponsorship Offer',
    description: 'A brand wants to sponsor your band.',
    rarity: 'rare',
    effect: { money: 20000, fame: 20 }
  },

  viral_hit: {
    type: 'opportunity',
    category: 'luck',
    title: 'Song Goes Viral',
    description: 'Your latest song is trending online!',
    rarity: 'very_rare',
    effect: { fame: 200, streams: 500000, money: 50000 }
  },

  // Bad events
  equipment_damage: {
    type: 'crisis',
    category: 'technical',
    title: 'Equipment Malfunction',
    description: 'Your equipment broke during a show!',
    rarity: 'common',
    effect: { money: -2000, morale: -10 },
    choices: [
      { id: 'repair', text: 'Pay for repairs', cost: 2000, fame: -10 },
      { id: 'replace', text: 'Buy new equipment', cost: 5000, fame: 0 },
      { id: 'borrow', text: 'Borrow from friends', cost: 0, fame: 20 }
    ]
  },

  member_quits: {
    type: 'crisis',
    category: 'band',
    title: 'Band Member Leaves',
    description: 'A band member wants to pursue other projects.',
    rarity: 'uncommon',
    effect: { morale: -25, fame: -20 },
    choices: [
      { id: 'replace', text: 'Find replacement', cost: 5000 },
      { id: 'continue', text: 'Continue as is', cost: 0, morale: -20 },
      { id: 'negotiate', text: 'Negotiate stay', cost: 2000 }
    ]
  },

  bad_review: {
    type: 'crisis',
    category: 'reputation',
    title: 'Bad Review',
    description: 'A major critic gave your album a terrible review.',
    rarity: 'uncommon',
    effect: { fame: -30, morale: -15 },
    choices: [
      { id: 'ignore', text: 'Ignore the review', fame: -30 },
      { id: 'respond', text: 'Respond publicly', fame: 10, stress: 20 },
      { id: 'improve', text: 'Focus on improvement', fame: -10, morale: 10 }
    ]
  },

  lawsuit: {
    type: 'crisis',
    category: 'legal',
    title: 'Copyright Lawsuit',
    description: 'Someone is suing you over a song.',
    rarity: 'rare',
    effect: { money: -50000, stress: 30 },
    choices: [
      { id: 'settle', text: 'Settle out of court', cost: 30000 },
      { id: 'fight', text: 'Fight in court', cost: 75000, fame: 10 },
      { id: 'remove', text: 'Remove the song', fame: -50 }
    ]
  },

  rivalry_challenge: {
    type: 'challenge',
    category: 'competition',
    title: 'Battle of the Bands',
    description: 'Your rival wants to compete at an event.',
    rarity: 'uncommon',
    choices: [
      { id: 'accept', text: 'Accept the challenge', stake: 5000, fameReward: 100 },
      { id: 'decline', text: 'Decline politely', fame: -10 },
      { id: 'trash_talk', text: 'Trash talk publicly', fame: 20, stress: 15 }
    ]
  },

  // Neutral events
  interview: {
    type: 'opportunity',
    category: 'publicity',
    title: 'Interview Request',
    description: 'A magazine wants to interview your band.',
    rarity: 'uncommon',
    effect: { fame: 20, stress: 5 }
  },

  festival_invitation: {
    type: 'opportunity',
    category: 'performance',
    title: 'Festival Lineup',
    description: 'You\'ve been invited to play a major festival!',
    rarity: 'rare',
    effect: { fame: 75, money: 5000 }
  },

  fan_appreciation: {
    type: 'good',
    category: 'social',
    title: 'Fan Event',
    description: 'Fans organized a meet and greet!',
    rarity: 'uncommon',
    effect: { morale: 25, stress: -10 }
  }
};

// ===== EVENT PROBABILITY SYSTEM =====

export const getEventProbability = (week, fame, morale, stress) => {
  // Base probability increases with week, then plateaus
  const weekFactor = Math.min(1, week / 100);
  
  // Fame increases event chance
  const fameFactor = Math.min(0.5, fame / 5000);
  
  // Low morale increases bad events
  const moraleFactor = Math.max(-0.1, (morale - 75) / 500);
  
  // High stress increases bad events
  const stressFactor = Math.max(0, stress / 1000);

  const baseChance = 0.15;
  const totalChance = baseChance + weekFactor + fameFactor + moraleFactor + stressFactor;

  return Math.max(0, Math.min(1, totalChance));
};

export const selectRandomEvent = (gameData) => {
  const eventArray = Object.entries(eventTypes);
  if (eventArray.length === 0) return null;

  // Weight selection by rarity
  const rareWeights = {
    common: 10,
    uncommon: 5,
    rare: 2,
    very_rare: 0.5
  };

  const weightedEvents = eventArray.map(([key, event]) => {
    const weight = rareWeights[event.rarity] || 1;
    return { key, event, weight };
  });

  // Adjust weights based on game state
  const adjustedWeights = weightedEvents.map(({ key, event, weight }) => {
    let adjustedWeight = weight;

    // Good events more likely when morale is low
    if (event.type === 'opportunity' && (gameData.morale || 75) < 50) {
      adjustedWeight *= 2;
    }

    // Bad events more likely when stress is high
    if (event.type === 'crisis' && (gameData.stress || 0) > 50) {
      adjustedWeight *= 1.5;
    }

    // Challenge events more likely when there are rivals
    if (event.type === 'challenge' && (gameData.rivals || []).length > 0) {
      adjustedWeight *= 2;
    }

    return { key, event, weight: adjustedWeight };
  });

  // Select random event based on weights
  const totalWeight = adjustedWeights.reduce((sum, e) => sum + e.weight, 0);
  let random = Math.random() * totalWeight;

  for (const { key, event } of adjustedWeights) {
    random -= event.weight;
    if (random <= 0) {
      return { eventKey: key, eventData: event };
    }
  }

  // Fallback
  const [key, event] = eventArray[Math.floor(Math.random() * eventArray.length)];
  return { eventKey: key, eventData: event };
};

// ===== EVENT HANDLING =====

export const handleEventChoice = (eventKey, choiceId, gameData) => {
  const event = eventTypes[eventKey];
  if (!event) return gameData;

  // Find the choice
  const choice = event.choices?.find(c => c.id === choiceId);
  
  const updates = {
    ...gameData,
    eventHistory: [...(gameData.eventHistory || []), { eventKey, choiceId, week: gameData.week }],
    log: [...(gameData.log || []), `Event: ${event.title} - Choice: ${choice?.text || 'Default'}`]
  };

  // Apply direct effects from event
  if (event.effect) {
    Object.entries(event.effect).forEach(([key, value]) => {
      if (key === 'money') {
        updates.money = Math.max(0, (updates.money || 0) + value);
      } else if (key === 'fame') {
        updates.fame = Math.max(0, (updates.fame || 0) + value);
      } else if (key === 'morale') {
        updates.morale = Math.max(0, Math.min(100, (updates.morale || 50) + value));
      } else if (key === 'stressReduction') {
        updates.stress = Math.max(0, (updates.stress || 0) - value);
      }
    });
  }

  // Apply choice-specific effects
  if (choice) {
    if (choice.cost) {
      updates.money = Math.max(0, (updates.money || 0) - choice.cost);
    }
    if (choice.fame) {
      updates.fame = Math.max(0, (updates.fame || 0) + choice.fame);
    }
    if (choice.morale) {
      updates.morale = Math.max(0, Math.min(100, (updates.morale || 50) + choice.morale));
    }
    if (choice.stress) {
      updates.stress = Math.max(0, (updates.stress || 0) + choice.stress);
    }
  }

  return updates;
};

// ===== RANDOM EVENT GENERATION =====

export const generateRandomEvent = (gameData) => {
  const probability = getEventProbability(
    gameData.week || 0,
    gameData.fame || 0,
    gameData.morale || 75,
    gameData.stress || 0
  );

  if (Math.random() > probability) {
    return null; // No event this week
  }

  return selectRandomEvent(gameData);
};

// ===== EVENT STATISTICS =====

export const getEventStatistics = (gameData) => {
  const eventHistory = gameData.eventHistory || [];

  const eventCounts = {};
  const choiceCounts = {};

  eventHistory.forEach(({ eventKey, choiceId }) => {
    eventCounts[eventKey] = (eventCounts[eventKey] || 0) + 1;
    choiceCounts[`${eventKey}-${choiceId}`] = (choiceCounts[`${eventKey}-${choiceId}`] || 0) + 1;
  });

  return {
    totalEvents: eventHistory.length,
    eventCounts,
    choiceCounts,
    mostCommonEvent: Object.entries(eventCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || null,
    averageEventsPerWeek: eventHistory.length / Math.max(1, gameData.week || 1)
  };
};

export default {
  eventTypes,
  getEventProbability,
  selectRandomEvent,
  handleEventChoice,
  generateRandomEvent,
  getEventStatistics
};
