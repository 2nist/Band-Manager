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
 * - Phase 2 Consequence tracking (consequences, factions, psychology)
 * 
 * Replaces individual useState calls scattered throughout App.jsx
 */

export const useGameState = () => {
  // Core game state
  const [state, setState] = useState(initialState);
  const [rivals, setRivals] = useState([]);
  
  // Game flow step tracking (landing, logo, bandCreation, game)
  const [step, setStep] = useState('landing');
  
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
   * @param {object} phase2Data - Optional Phase 2 consequence system data
   * @returns {boolean} Success status
   */
  const saveGame = (slotName, phase2Data = {}) => {
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
      bandName: state.bandName,
      // Phase 2: Include consequence system data
      consequences: phase2Data.consequences || [],
      factions: phase2Data.factions || {},
      psychologicalEvolution: phase2Data.psychologicalEvolution || {}
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
   * @returns {object} Load result with game data and Phase 2 systems
   */
  const loadGame = (slotName) => {
    try {
      const slots = JSON.parse(localStorage.getItem('bandManager_saveSlots') || '{}');
      const saveData = slots[slotName];
      
      if (!saveData) {
        console.warn(`Save slot "${slotName}" not found`);
        return { success: false };
      }

      setState(saveData.state);
      setRivals(saveData.rivals || []);
      setGameLog(saveData.gameLog || []);
      
      // Phase 2: Restore consequence system data
      const phase2Data = {
        consequences: saveData.consequences || [],
        factions: saveData.factions || {},
        psychologicalEvolution: saveData.psychologicalEvolution || {}
      };
      
      // Store in localStorage for consequence system to restore
      if (saveData.consequences) {
        localStorage.setItem('gigmaster_consequences', JSON.stringify(saveData.consequences));
      }
      if (saveData.factions) {
        localStorage.setItem('gigmaster_factions', JSON.stringify(saveData.factions));
      }
      if (saveData.psychologicalEvolution) {
        localStorage.setItem('gigmaster_psychology', JSON.stringify(saveData.psychologicalEvolution));
      }
      
      return { success: true, phase2Data };
    } catch (err) {
      console.error('Load failed:', err);
      return { success: false };
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
   * Set band name and update state
   * @param {string} bandName - Name of the band
   */
  const setBandName = (bandName) => {
    setState(prevState => ({
      ...prevState,
      bandName: bandName.trim()
    }));
  };

  /**
   * Add entry to game log
   * @param {string} message - Log entry text
   * @param {string} type - Entry type: 'info', 'success', 'warning', 'error'
   * @param {*} data - Optional data to attach to log entry
   */
  const addLog = (message, type = 'info', data = null, options = {}) => {
    // Enhanced log entry with emotional tone, narrative weight, category, and icon
    const logEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: new Date().toISOString(),
      week: state.week,
      message,
      type,
      data,
      // Enhanced fields
      emotional_tone: options.emotional_tone || detectEmotionalTone(message, type),
      narrative_weight: options.narrative_weight || detectNarrativeWeight(message, type),
      category: options.category || detectCategory(message, type),
      icon: options.icon || detectIcon(type, options.category),
      persistent: options.persistent || (options.narrative_weight === 'critical' || options.narrative_weight === 'high')
    };
    
    setGameLog(prevLog => [logEntry, ...prevLog].slice(0, 500)); // Keep last 500 entries
  };

  /**
   * Detect emotional tone from message and type
   */
  const detectEmotionalTone = (message, type) => {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('death') || messageLower.includes('died') || messageLower.includes('fatal')) {
      return 'tragic';
    }
    if (messageLower.includes('arrest') || messageLower.includes('raid') || messageLower.includes('police')) {
      return 'ominous';
    }
    if (messageLower.includes('success') || messageLower.includes('won') || messageLower.includes('achieved')) {
      return 'positive';
    }
    if (messageLower.includes('failed') || messageLower.includes('lost') || messageLower.includes('disaster')) {
      return 'negative';
    }
    if (messageLower.includes('warning') || messageLower.includes('danger') || messageLower.includes('risk')) {
      return 'ominous';
    }
    
    // Default based on type
    if (type === 'error' || type === 'warning') return 'ominous';
    if (type === 'success') return 'positive';
    return 'neutral';
  };

  /**
   * Detect narrative weight from message and type
   */
  const detectNarrativeWeight = (message, type) => {
    const messageLower = message.toLowerCase();
    const criticalKeywords = ['death', 'arrest', 'overdose', 'fatal', 'criminal', 'betrayal', 'scandal'];
    const highKeywords = ['addiction', 'corruption', 'breakdown', 'crisis', 'intervention'];
    
    if (criticalKeywords.some(keyword => messageLower.includes(keyword))) {
      return 'critical';
    }
    if (highKeywords.some(keyword => messageLower.includes(keyword))) {
      return 'high';
    }
    if (type === 'error' || type === 'warning') {
      return 'medium';
    }
    return 'low';
  };

  /**
   * Detect category from message and type
   */
  const detectCategory = (message, type) => {
    const messageLower = message.toLowerCase();
    
    if (messageLower.includes('drug') || messageLower.includes('addiction') || messageLower.includes('substance')) {
      return 'substance_abuse';
    }
    if (messageLower.includes('corruption') || messageLower.includes('bribe') || messageLower.includes('criminal')) {
      return 'corruption';
    }
    if (messageLower.includes('violence') || messageLower.includes('fight') || messageLower.includes('attack')) {
      return 'violence';
    }
    if (messageLower.includes('relationship') || messageLower.includes('affair') || messageLower.includes('romance')) {
      return 'relationship';
    }
    if (messageLower.includes('mental') || messageLower.includes('breakdown') || messageLower.includes('stress')) {
      return 'mental_health';
    }
    if (messageLower.includes('gig') || messageLower.includes('show') || messageLower.includes('performance')) {
      return 'performance';
    }
    if (messageLower.includes('money') || messageLower.includes('deal') || messageLower.includes('contract')) {
      return 'business';
    }
    
    return 'general';
  };

  /**
   * Detect icon from type and category
   */
  const detectIcon = (type, category) => {
    if (category) {
      const iconMap = {
        substance_abuse: 'substance_warning',
        corruption: 'corruption_alert',
        violence: 'violence_warning',
        relationship: 'relationship_icon',
        mental_health: 'mental_health_icon',
        performance: 'performance_icon',
        business: 'business_icon'
      };
      if (iconMap[category]) return iconMap[category];
    }
    
    const typeIconMap = {
      error: 'error_icon',
      warning: 'warning_icon',
      success: 'success_icon',
      info: 'info_icon'
    };
    
    return typeIconMap[type] || 'info_icon';
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
    step,
    setStep,

    // State management methods
    saveGame,
    loadGame,
    deleteSave,
    updateGameState,
    setBandName,
    addLog,
    resetGame,
    loadAutoSave
  };
};

export default useGameState;
