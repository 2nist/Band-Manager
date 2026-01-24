/**
 * src/utils/index.js - Barrel exports for utility modules
 * 
 * Provides clean, organized imports for all game utilities
 */

// Game Engine
export {
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
} from './gameEngine';

// Event System
export {
  eventTypes,
  getEventProbability,
  selectRandomEvent,
  handleEventChoice,
  generateRandomEvent,
  getEventStatistics
} from './eventSystem';

// Save System
export {
  getSaveSlots,
  createSaveSlot,
  loadSaveSlot,
  updateSaveSlot,
  deleteSaveSlot,
  renameSaveSlot,
  saveAutoSave,
  loadAutoSave,
  getAutoSaveInfo,
  getGameSettings,
  getDefaultSettings,
  updateGameSettings,
  updateSetting,
  exportGameData,
  importGameData,
  clearAllSaves,
  getStorageStats,
  createBackup,
  restoreBackup,
  prepareCloudSave,
  validateSaveData,
  sanitizeSaveData
} from './saveSystem';

// Rival Song Generation
export {
  generateRivalSong,
  generateRivalSongsForChart,
  generateSongFromContext
} from './rivalSongGenerator';

// Rival Album Generation
export {
  generateRivalAlbum,
  generateRivalAlbumsForCharts,
  ensureRivalHasAlbum
} from './rivalAlbumGenerator';

