import { useState, useEffect } from 'react';
import { initialState } from '../utils/constants';

/**
 * useGameState Hook
 * 
 * Central state management for GigMaster game logic.
 * Manages:
 * - Main game state (bands, songs, albums, money, fame, etc.)
 * - Rival bands and competition
 * - Persistence (save/load game)
 * - Week advancement and effects
 * 
 * Replaces individual useState calls scattered throughout App.jsx
 */

export const useGameState = () => {
  // Core game state
  const [state, setState] = useState(initialState);
  const [rivals, setRivals] = useState([]);
  
  // Current selections
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  
  // Save slot management
  const [saveSlots, setSaveSlots] = useState(() => {
    try {
      const saved = localStorage.getItem('bandManager_saveSlots');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('bandManager_autoSave');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  // Game log for tracking events
  const [gameLog, setGameLog] = useState([]);

  /**
   * Save game to named slot
   * @param {string} slotName - Unique identifier for save slot
   * @returns {boolean} Success status
   */
  const saveGame = (slotName) => {
    if (!state.bandName || state.bandName.trim() === '') {
      console.warn('Cannot save: no band name');
      return false;
    }

    const saveData = {
      state,
      rivals,
      gameLog,
      timestamp: new Date().toISOString(),
      weekNumber: state.week,
      bandName: state.bandName
    };

    try {
      const currentSlots = JSON.parse(localStorage.getItem('bandManager_saveSlots') || '{}');
      currentSlots[slotName] = saveData;
      localStorage.setItem('bandManager_saveSlots', JSON.stringify(currentSlots));
      setSaveSlots(currentSlots);
      return true;
    } catch (err) {
      console.error('Save failed:', err);
      return false;
    }
  };

  /**
   * Load game from named slot
   * @param {string} slotName - Identifier of slot to load
   * @returns {boolean} Success status
   */
  const loadGame = (slotName) => {
    try {
      const slots = JSON.parse(localStorage.getItem('bandManager_saveSlots') || '{}');
      const saveData = slots[slotName];
      
      if (!saveData) {
        console.warn(`Save slot "${slotName}" not found`);
        return false;
      }

      setState(saveData.state);
      setRivals(saveData.rivals || []);
      setGameLog(saveData.gameLog || []);
      return true;
    } catch (err) {
      console.error('Load failed:', err);
      return false;
    }
  };

  /**
   * Delete a save slot
   * @param {string} slotName - Slot to delete
   */
  const deleteSave = (slotName) => {
    try {
      const currentSlots = JSON.parse(localStorage.getItem('bandManager_saveSlots') || '{}');
      delete currentSlots[slotName];
      localStorage.setItem('bandManager_saveSlots', JSON.stringify(currentSlots));
      setSaveSlots(currentSlots);
    } catch (err) {
      console.error('Delete save failed:', err);
    }
  };

  /**
   * Update game state with partial updates
   * Useful for applying changes without replacing entire state
   * @param {object} updates - Partial state updates
   */
  const updateGameState = (updates) => {
    setState(prevState => ({
      ...prevState,
      ...updates
    }));
  };

  /**
   * Add entry to game log
   * @param {string} message - Log entry text
   * @param {string} type - Entry type: 'info', 'success', 'warning', 'error'
   * @param {*} data - Optional data to attach to log entry
   */
  const addLog = (message, type = 'info', data = null) => {
    const logEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: new Date().toISOString(),
      week: state.week,
      message,
      type,
      data
    };
    
    setGameLog(prevLog => [logEntry, ...prevLog].slice(0, 500)); // Keep last 500 entries
  };

  /**
   * Reset game to initial state (new game)
   */
  const resetGame = () => {
    setState(initialState);
    setRivals([]);
    setGameLog([]);
    setSelectedVenue(null);
    setCurrentEvent(null);
  };

  /**
   * Auto-save functionality
   * Saves game periodically if enabled
   */
  useEffect(() => {
    if (!autoSaveEnabled || !state.bandName) return;
    
    const autoSaveData = {
      state,
      rivals,
      gameLog,
      timestamp: new Date().toISOString()
    };
    
    try {
      localStorage.setItem('bandManager_autoSave', JSON.stringify(autoSaveData));
    } catch (err) {
      console.warn('Auto-save failed:', err);
    }
  }, [state.week, state.money, state.fame, autoSaveEnabled, state.bandName, state, rivals, gameLog]);

  /**
   * Load auto-saved game if available
   */
  const loadAutoSave = () => {
    try {
      const autoSaveData = localStorage.getItem('bandManager_autoSave');
      if (autoSaveData) {
        const data = JSON.parse(autoSaveData);
        setState(data.state);
        setRivals(data.rivals || []);
        setGameLog(data.gameLog || []);
        return true;
      }
    } catch (err) {
      console.warn('Auto-load failed:', err);
    }
    return false;
  };

  // Public API
  return {
    // State accessors
    state,
    setState,
    rivals,
    setRivals,
    selectedVenue,
    setSelectedVenue,
    currentEvent,
    setCurrentEvent,
    gameLog,
    setGameLog,
    saveSlots,
    autoSaveEnabled,
    setAutoSaveEnabled,

    // State management methods
    saveGame,
    loadGame,
    deleteSave,
    updateGameState,
    addLog,
    resetGame,
    loadAutoSave
  };
};

export default useGameState;
