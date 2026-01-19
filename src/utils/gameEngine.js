/**
 * gameEngine.js - Core game mechanics and calculations
 * 
 * Extracted from useGameLogic hook to provide pure utility functions
 * for game calculations and state updates
 */

// ===== SONG MECHANICS =====

export const createSong = (name, genre, quality = 5) => {
  return {
    id: `song_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name,
    genre,
    quality: Math.max(1, Math.min(10, quality)),
    completedDate: new Date().toISOString(),
    royalties: 0,
    streams: 0
  };
};

export const calculateSongValue = (song, fame, genre = 'rock') => {
  if (!song) return 0;
  
  const baseValue = song.quality * 500;
  const fameMultiplier = 1 + (fame / 100);
  const qualityBonus = (song.quality / 10) * 1000;
  
  return Math.floor((baseValue + qualityBonus) * fameMultiplier);
};

export const improveSongQuality = (song, improvement = 1) => {
  if (!song) return null;
  return {
    ...song,
    quality: Math.max(1, Math.min(10, song.quality + improvement))
  };
};

// ===== ALBUM MECHANICS =====

export const createAlbum = (name, songs = [], label = 'independent') => {
  if (!Array.isArray(songs) || songs.length === 0) {
    throw new Error('Album must contain at least one song');
  }

  const avgQuality = songs.reduce((sum, s) => sum + (s.quality || 5), 0) / songs.length;
  const totalRoyalties = songs.reduce((sum, s) => sum + (s.royalties || 0), 0);

  return {
    id: `album_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name,
    songs: songs.map(s => s.id),
    label,
    releaseDate: new Date().toISOString(),
    avgQuality: Math.round(avgQuality * 10) / 10,
    totalRoyalties,
    streams: 0,
    chartPosition: null
  };
};

export const calculateAlbumValue = (album, songs = [], fame = 0) => {
  const albumSongs = songs.filter(s => album.songs?.includes(s.id));
  if (albumSongs.length === 0) return 0;

  const songValues = albumSongs.map(s => calculateSongValue(s, fame));
  const totalValue = songValues.reduce((sum, v) => sum + v, 0);
  const albumBonus = albumSongs.length * 1000; // Bonus for multiple songs

  return Math.floor(totalValue + albumBonus);
};

// ===== GIG/PERFORMANCE MECHANICS =====

export const gigTypes = {
  garage: { money: 200, fame: 5, cost: 50, description: 'Small garage venue' },
  club: { money: 500, fame: 15, cost: 150, description: 'Local club' },
  venue: { money: 1200, fame: 30, cost: 400, description: 'Concert venue' },
  festival: { money: 3000, fame: 75, cost: 1000, description: 'Music festival' },
  arena: { money: 8000, fame: 150, cost: 3000, description: 'Arena show' },
  stadium: { money: 20000, fame: 300, cost: 8000, description: 'Stadium tour' }
};

export const calculateGigRewards = (gigType, fame, bandMembers = 4) => {
  const gig = gigTypes[gigType];
  if (!gig) throw new Error(`Unknown gig type: ${gigType}`);

  const fameMultiplier = 1 + (fame / 200);
  const memberModifier = bandMembers / 4; // Base is 4 members

  return {
    money: Math.floor(gig.money * fameMultiplier * memberModifier),
    fame: Math.floor(gig.fame * fameMultiplier),
    cost: Math.floor(gig.cost * memberModifier),
    description: gig.description
  };
};

export const canBookGig = (money, gigType) => {
  const gig = gigTypes[gigType];
  return money >= gig.cost;
};

// ===== BAND MEMBER MECHANICS =====

export const memberTypes = {
  guitarist: { salary: 200, contribution: { creativity: 3, professionalism: 1 } },
  bassist: { salary: 180, contribution: { stability: 3, creativity: 1 } },
  drummer: { salary: 200, contribution: { energy: 3, stability: 1 } },
  vocalist: { salary: 250, contribution: { fame: 2, creativity: 2, charisma: 2 } },
  keyboardist: { salary: 200, contribution: { complexity: 3, creativity: 1 } }
};

export const createBandMember = (name, type, skill = 5) => {
  const memberType = memberTypes[type];
  if (!memberType) throw new Error(`Unknown member type: ${type}`);

  return {
    id: `member_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name,
    type,
    skill: Math.max(1, Math.min(10, skill)),
    salary: memberType.salary,
    contribution: memberType.contribution,
    joinedWeek: 0,
    morale: 75,
    contracts: 0
  };
};

export const calculateBandMorale = (members = [], money = 0) => {
  if (members.length === 0) return 50;

  const avgMorale = members.reduce((sum, m) => sum + (m.morale || 75), 0) / members.length;
  const wealthModifier = Math.min(20, money / 5000); // Max +20 from wealth
  
  return Math.max(0, Math.min(100, Math.round(avgMorale + wealthModifier)));
};

export const calculateMemberCost = (members = []) => {
  return members.reduce((sum, member) => {
    return sum + (member.salary || 0);
  }, 0);
};

// ===== UPGRADE MECHANICS =====

export const upgrades = {
  studio: {
    name: 'Recording Studio',
    cost: 5000,
    description: 'Improve song quality',
    effect: { songQuality: 2, creativityBoost: 10 }
  },
  equipment: {
    name: 'Better Equipment',
    cost: 3000,
    description: 'Improve band performance',
    effect: { performanceBoost: 15, durability: 100 }
  },
  marketing: {
    name: 'Marketing Campaign',
    cost: 2000,
    description: 'Increase fame faster',
    effect: { fameMultiplier: 1.5, duration: 3 }
  },
  venue_connection: {
    name: 'Venue Connections',
    cost: 4000,
    description: 'Unlock better venues',
    effect: { unlocksVenues: ['venue', 'festival'] }
  },
  producer: {
    name: 'Hire Producer',
    cost: 6000,
    description: 'Professional production',
    effect: { songQuality: 3, albumValue: 25 }
  },
  management: {
    name: 'Hire Manager',
    cost: 5000,
    description: 'Better business deals',
    effect: { dealNegotiation: 20, workload: -15 }
  }
};

export const canBuyUpgrade = (money, upgradeKey) => {
  const upgrade = upgrades[upgradeKey];
  return upgrade && money >= upgrade.cost;
};

export const applyUpgrade = (gameData, upgradeKey) => {
  const upgrade = upgrades[upgradeKey];
  if (!upgrade) return gameData;

  return {
    ...gameData,
    money: gameData.money - upgrade.cost,
    upgrades: [...(gameData.upgrades || []), upgradeKey],
    upgradeHistory: [...(gameData.upgradeHistory || []), { upgrade: upgradeKey, week: gameData.week }]
  };
};

// ===== WEEK PROGRESSION =====

export const advanceWeekCalculations = (gameData, earnings = 0) => {
  const memberCost = calculateMemberCost(gameData.bandMembers || []);
  const weekExpenses = memberCost + (gameData.baseExpenses || 1000);
  const weekMoney = gameData.money + earnings - weekExpenses;

  // Check for bankruptcy
  const bankrupt = weekMoney < 0;

  // Increase experience
  const newExperience = (gameData.experience || 0) + 1;

  // Random events chance increases with stress/other factors
  const eventChance = 0.15 + ((gameData.stress || 0) / 1000);

  return {
    weekAdvanced: true,
    newWeek: gameData.week + 1,
    newMoney: Math.max(0, weekMoney),
    newExperience,
    bankrupt,
    weekCost: weekExpenses,
    eventChance: Math.min(0.8, eventChance),
    shouldCheckBankruptcy: bankrupt
  };
};

// ===== RIVAL MECHANICS =====

export const createRival = (name, baseSkill = 5) => {
  return {
    id: `rival_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name,
    skill: Math.max(1, Math.min(10, baseSkill)),
    fame: 10,
    hostility: 0,
    competition: [],
    introducedWeek: 0
  };
};

export const calculateCompetitionOutcome = (playerFame, rivalFame, playerSkill, rivalSkill) => {
  const fameAdvantage = (playerFame - rivalFame) / 100;
  const skillAdvantage = (playerSkill - rivalSkill) / 10;
  const playerScore = 50 + (fameAdvantage * 50) + (skillAdvantage * 50);
  
  return {
    playerScore: Math.max(0, Math.min(100, playerScore)),
    won: playerScore > 50,
    playerGainsFame: playerScore > 50 ? Math.floor(playerScore / 5) : 0,
    rivalGainsFame: playerScore <= 50 ? Math.floor((100 - playerScore) / 5) : 0
  };
};

// ===== DIFFICULTY SCALING =====

export const calculateDifficulty = (week, fame = 0) => {
  // Difficulty increases over time and with fame
  const weekScale = week / 50;
  const fameScale = fame / 1000;
  const difficulty = Math.min(10, 2 + weekScale + fameScale);
  
  return {
    difficulty: Math.round(difficulty * 10) / 10,
    eventFrequency: 0.1 + (difficulty * 0.05),
    rivalAggression: Math.max(1, difficulty - 2),
    costOfLiving: 1000 + (difficulty * 500)
  };
};

// ===== ACHIEVEMENT MECHANICS =====

export const achievements = {
  first_song: {
    id: 'first_song',
    name: 'Songwriter',
    description: 'Write your first song',
    condition: (gameData) => (gameData.songs || []).length > 0
  },
  first_album: {
    id: 'first_album',
    name: 'Producer',
    description: 'Record your first album',
    condition: (gameData) => (gameData.albums || []).length > 0
  },
  thousand_fans: {
    id: 'thousand_fans',
    name: 'Rising Star',
    description: 'Reach 1000 fame',
    condition: (gameData) => gameData.fame >= 1000
  },
  five_thousand_fans: {
    id: 'five_thousand_fans',
    name: 'Celebrity',
    description: 'Reach 5000 fame',
    condition: (gameData) => gameData.fame >= 5000
  },
  millionaire: {
    id: 'millionaire',
    name: 'Rock Star',
    description: 'Earn $1 million',
    condition: (gameData) => gameData.totalEarnings >= 1000000
  },
  complete_band: {
    id: 'complete_band',
    name: 'Full Band',
    description: 'Have 5 band members',
    condition: (gameData) => (gameData.bandMembers || []).length >= 5
  }
};

export const checkAchievements = (gameData) => {
  const earned = [];
  const alreadyEarned = gameData.achievements || [];

  Object.values(achievements).forEach(achievement => {
    if (!alreadyEarned.includes(achievement.id) && achievement.condition(gameData)) {
      earned.push(achievement.id);
    }
  });

  return earned;
};

// ===== UTILITY CALCULATIONS =====

export const calculateTotalAssets = (gameData) => {
  const songValue = (gameData.songs || []).reduce((sum, song) => {
    return sum + calculateSongValue(song, gameData.fame || 0);
  }, 0);

  const albumValue = (gameData.albums || []).reduce((sum, album) => {
    return sum + calculateAlbumValue(album, gameData.songs || [], gameData.fame || 0);
  }, 0);

  return gameData.money + songValue + albumValue;
};

export const calculateStatistics = (gameData) => {
  return {
    totalSongs: (gameData.songs || []).length,
    totalAlbums: (gameData.albums || []).length,
    avgSongQuality: gameData.songs?.length 
      ? Math.round((gameData.songs.reduce((sum, s) => sum + (s.quality || 5), 0) / gameData.songs.length) * 10) / 10
      : 0,
    totalGigs: gameData.gigHistory?.length || 0,
    bandSize: (gameData.bandMembers || []).length,
    totalAssets: calculateTotalAssets(gameData),
    weeksPlayed: gameData.week || 0,
    averageEarningsPerWeek: ((gameData.totalEarnings || 0) / Math.max(1, gameData.week || 1))
  };
};

export default {
  createSong,
  calculateSongValue,
  improveSongQuality,
  createAlbum,
  calculateAlbumValue,
  gigTypes,
  calculateGigRewards,
  canBookGig,
  memberTypes,
  createBandMember,
  calculateBandMorale,
  calculateMemberCost,
  upgrades,
  canBuyUpgrade,
  applyUpgrade,
  advanceWeekCalculations,
  createRival,
  calculateCompetitionOutcome,
  calculateDifficulty,
  achievements,
  checkAchievements,
  calculateTotalAssets,
  calculateStatistics
};
