/**
 * saveSystem.js - Save/load game functionality
 * 
 * Handles game state persistence to localStorage
 * Extracted from useGameState to provide pure utility functions
 */

const STORAGE_KEY_PREFIX = 'gigmaster_';
const SAVE_SLOT_KEY = `${STORAGE_KEY_PREFIX}saves`;
const AUTO_SAVE_KEY = `${STORAGE_KEY_PREFIX}autosave`;
const SETTINGS_KEY = `${STORAGE_KEY_PREFIX}settings`;

// ===== SAVE SLOT MANAGEMENT =====

export const getSaveSlots = () => {
  try {
    const data = localStorage.getItem(SAVE_SLOT_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading save slots:', error);
    return [];
  }
};

export const createSaveSlot = (gameData, slotName = `Save ${new Date().toLocaleString()}`) => {
  const slots = getSaveSlots();
  
  const newSlot = {
    id: `slot_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name: slotName,
    timestamp: new Date().toISOString(),
    week: gameData.week || 0,
    fame: gameData.fame || 0,
    money: gameData.money || 0,
    bandName: gameData.bandName || 'Unnamed Band',
    data: gameData
  };

  const updatedSlots = [...slots, newSlot];
  
  try {
    localStorage.setItem(SAVE_SLOT_KEY, JSON.stringify(updatedSlots));
    return newSlot;
  } catch (error) {
    console.error('Error saving game:', error);
    return null;
  }
};

export const loadSaveSlot = (slotId) => {
  const slots = getSaveSlots();
  const slot = slots.find(s => s.id === slotId);
  
  if (!slot) {
    console.error('Save slot not found:', slotId);
    return null;
  }

  return slot.data;
};

export const updateSaveSlot = (slotId, gameData) => {
  const slots = getSaveSlots();
  const slotIndex = slots.findIndex(s => s.id === slotId);
  
  if (slotIndex === -1) {
    console.error('Save slot not found:', slotId);
    return null;
  }

  slots[slotIndex] = {
    ...slots[slotIndex],
    timestamp: new Date().toISOString(),
    week: gameData.week || 0,
    fame: gameData.fame || 0,
    money: gameData.money || 0,
    data: gameData
  };

  try {
    localStorage.setItem(SAVE_SLOT_KEY, JSON.stringify(slots));
    return slots[slotIndex];
  } catch (error) {
    console.error('Error updating save slot:', error);
    return null;
  }
};

export const deleteSaveSlot = (slotId) => {
  const slots = getSaveSlots();
  const filteredSlots = slots.filter(s => s.id !== slotId);
  
  try {
    localStorage.setItem(SAVE_SLOT_KEY, JSON.stringify(filteredSlots));
    return true;
  } catch (error) {
    console.error('Error deleting save slot:', error);
    return false;
  }
};

export const renameSaveSlot = (slotId, newName) => {
  const slots = getSaveSlots();
  const slot = slots.find(s => s.id === slotId);
  
  if (!slot) {
    console.error('Save slot not found:', slotId);
    return null;
  }

  slot.name = newName;
  
  try {
    localStorage.setItem(SAVE_SLOT_KEY, JSON.stringify(slots));
    return slot;
  } catch (error) {
    console.error('Error renaming save slot:', error);
    return null;
  }
};

// ===== AUTO-SAVE FUNCTIONALITY =====

export const saveAutoSave = (gameData) => {
  try {
    const autoSave = {
      timestamp: new Date().toISOString(),
      week: gameData.week || 0,
      fame: gameData.fame || 0,
      money: gameData.money || 0,
      data: gameData
    };

    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(autoSave));
    return autoSave;
  } catch (error) {
    console.error('Error auto-saving game:', error);
    return null;
  }
};

export const loadAutoSave = () => {
  try {
    const data = localStorage.getItem(AUTO_SAVE_KEY);
    return data ? JSON.parse(data).data : null;
  } catch (error) {
    console.error('Error loading auto-save:', error);
    return null;
  }
};

export const getAutoSaveInfo = () => {
  try {
    const data = localStorage.getItem(AUTO_SAVE_KEY);
    if (!data) return null;
    
    const autoSave = JSON.parse(data);
    return {
      timestamp: autoSave.timestamp,
      week: autoSave.week,
      fame: autoSave.fame,
      money: autoSave.money
    };
  } catch (error) {
    console.error('Error getting auto-save info:', error);
    return null;
  }
};

// ===== GAME SETTINGS =====

export const getGameSettings = () => {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data ? JSON.parse(data) : getDefaultSettings();
  } catch (error) {
    console.error('Error loading settings:', error);
    return getDefaultSettings();
  }
};

export const getDefaultSettings = () => {
  return {
    theme: 'dark',
    soundEnabled: true,
    musicEnabled: true,
    autoSaveInterval: 5, // minutes
    language: 'en',
    difficultyMode: 'normal', // easy, normal, hard, ironman
    notifications: true,
    showTutorial: true
  };
};

export const updateGameSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return settings;
  } catch (error) {
    console.error('Error saving settings:', error);
    return null;
  }
};

export const updateSetting = (key, value) => {
  const settings = getGameSettings();
  settings[key] = value;
  return updateGameSettings(settings);
};

// ===== EXPORT/IMPORT =====

export const exportGameData = (gameData, slotName = 'exported_save') => {
  try {
    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      slotName,
      gameData
    };

    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = url;
    link.download = `${slotName}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    return true;
  } catch (error) {
    console.error('Error exporting game data:', error);
    return false;
  }
};

export const importGameData = (jsonString) => {
  try {
    const importData = JSON.parse(jsonString);

    if (importData.version !== '1.0') {
      console.error('Unsupported save version:', importData.version);
      return null;
    }

    return {
      gameData: importData.gameData,
      slotName: importData.slotName,
      exportDate: importData.exportDate
    };
  } catch (error) {
    console.error('Error importing game data:', error);
    return null;
  }
};

// ===== STORAGE UTILITIES =====

export const clearAllSaves = () => {
  try {
    localStorage.removeItem(SAVE_SLOT_KEY);
    localStorage.removeItem(AUTO_SAVE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing saves:', error);
    return false;
  }
};

export const getStorageStats = () => {
  try {
    const slots = getSaveSlots();
    const autoSave = localStorage.getItem(AUTO_SAVE_KEY);
    const settings = localStorage.getItem(SETTINGS_KEY);

    let totalSize = 0;
    if (autoSave) totalSize += new Blob([autoSave]).size;
    if (settings) totalSize += new Blob([settings]).size;
    
    slots.forEach(slot => {
      totalSize += new Blob([JSON.stringify(slot)]).size;
    });

    return {
      totalSaveSlots: slots.length,
      autoSaveExists: !!autoSave,
      totalStorageUsed: Math.round(totalSize / 1024), // KB
      storageQuota: 5120 // 5MB typical localStorage limit
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    return null;
  }
};

// ===== BACKUP & RECOVERY =====

export const createBackup = () => {
  try {
    const backup = {
      timestamp: new Date().toISOString(),
      version: '1.0',
      saves: getSaveSlots(),
      autoSave: localStorage.getItem(AUTO_SAVE_KEY) ? JSON.parse(localStorage.getItem(AUTO_SAVE_KEY)) : null,
      settings: getGameSettings()
    };

    return backup;
  } catch (error) {
    console.error('Error creating backup:', error);
    return null;
  }
};

export const restoreBackup = (backupData) => {
  try {
    if (backupData.version !== '1.0') {
      console.error('Unsupported backup version');
      return false;
    }

    // Restore saves
    localStorage.setItem(SAVE_SLOT_KEY, JSON.stringify(backupData.saves));

    // Restore auto-save if exists
    if (backupData.autoSave) {
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(backupData.autoSave));
    }

    // Restore settings
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(backupData.settings));

    return true;
  } catch (error) {
    console.error('Error restoring backup:', error);
    return false;
  }
};

// ===== CLOUD SAVE (Future Implementation) =====

export const prepareCloudSave = (gameData) => {
  // Placeholder for future cloud save implementation
  return {
    version: '1.0',
    timestamp: new Date().toISOString(),
    gameData,
    userId: null // Would be populated by auth system
  };
};

// ===== VALIDATION =====

export const validateSaveData = (gameData) => {
  const required = ['week', 'bandName', 'money', 'fame'];
  const missing = required.filter(key => !(key in gameData));

  if (missing.length > 0) {
    console.warn('Save data missing required fields:', missing);
    return false;
  }

  return true;
};

export const sanitizeSaveData = (gameData) => {
  // Ensure critical values are in valid ranges
  return {
    ...gameData,
    week: Math.max(0, Math.floor(gameData.week || 0)),
    money: Math.max(0, Math.floor(gameData.money || 0)),
    fame: Math.max(0, Math.floor(gameData.fame || 0)),
    bandName: String(gameData.bandName || 'Unnamed Band').slice(0, 50),
    songs: Array.isArray(gameData.songs) ? gameData.songs : [],
    albums: Array.isArray(gameData.albums) ? gameData.albums : [],
    bandMembers: Array.isArray(gameData.bandMembers) ? gameData.bandMembers : []
  };
};

export default {
  // Save slots
  getSaveSlots,
  createSaveSlot,
  loadSaveSlot,
  updateSaveSlot,
  deleteSaveSlot,
  renameSaveSlot,
  
  // Auto-save
  saveAutoSave,
  loadAutoSave,
  getAutoSaveInfo,
  
  // Settings
  getGameSettings,
  getDefaultSettings,
  updateGameSettings,
  updateSetting,
  
  // Import/Export
  exportGameData,
  importGameData,
  
  // Storage
  clearAllSaves,
  getStorageStats,
  
  // Backup
  createBackup,
  restoreBackup,
  
  // Cloud (future)
  prepareCloudSave,
  
  // Validation
  validateSaveData,
  sanitizeSaveData
};
