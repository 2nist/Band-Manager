import { useState, useEffect } from 'react';
import { STEPS } from '../utils/constants';

/**
 * useUIState Hook
 * 
 * Manages all UI-related state that doesn't affect game logic.
 * Handles:
 * - Page navigation (step)
 * - Tab selection
 * - View modes
 * - Theme/appearance settings
 * - UI preferences
 * 
 * Replaces 10+ individual useState calls for UI state
 */

export const useUIState = () => {
  // Page navigation
  const [step, setStep] = useState(STEPS.LANDING);

  // Game view tabs
  const [currentTab, setCurrentTab] = useState('overview');
  const [leftTab, setLeftTab] = useState('snapshot');
  const [rightTab, setRightTab] = useState('topChart');

  // Gigs/touring view
  const [gigsView, setGigsView] = useState('local');
  const [selectedTourType, setSelectedTourType] = useState(null);
  const [selectedTourRegion, setSelectedTourRegion] = useState('us');

  // Appearance
  const [theme, setTheme] = useState('theme-modern');
  const [darkMode, setDarkMode] = useState(false);

  // Font customization (for band logo)
  const [customFont, setCustomFont] = useState('');
  const [fontOptions, setFontOptions] = useState([
    'Arial',
    // Heavy Metal & Hard Rock
    'Metal Mania',
    'New Rocker',
    'Creepster',
    'Russo One',
    'Ultra',
    'Shojumaru',
    'Pirata One',
    // Punk, Grunge & Garage Rock
    'Underdog',
    'Rock Salt',
    'Special Elite',
    'Bungee',
    'Road Rage',
    'Permanent Marker',
    'Bangers',
    // Indie, Alternative & Folk
    'Syne',
    'Space Grotesk',
    'Indie Flower',
    'Eczar',
    'Arapey',
    'Spectral',
    'Smythe',
    'Cormorant',
    // Electronic, Synthwave & Pop
    'Orbitron',
    'Monoton',
    'Righteous',
    'DotGothic16',
    'Tourney',
    'Exo 2',
    'Gugi',
    'RocknRoll One',
    // Modern Rock & Classic Professional
    'Bebas Neue',
    'Anton',
    'Oswald',
    'Montserrat',
    'Raleway',
    'Archivo Black',
    'Fjalla One',
    'Alfa Slab One',
    // Additional fonts
    'Poppins',
    'Syncopate',
    'Playfair Display',
    'Lobster',
    'Abril Fatface',
    'Lora',
    'Libre Baskerville',
    'Pacifico',
    'Unbounded',
    'Inter',
    'Roboto',
    'Press Start 2P',
    'Fira Sans',
    'Nunito',
    'Work Sans',
    'Manrope',
    'Barlow',
    'Sora',
    'Kanit'
  ]);

  // Help/Tutorial
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);

  // Tooltips
  const [showTooltip, setShowTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Settings
  const [showSettings, setShowSettings] = useState(false);

  /**
   * Apply theme to document
   * Runs whenever theme or darkMode changes
   */
  useEffect(() => {
    document.body.className = `${theme} ${darkMode ? 'dark' : ''}`;
  }, [theme, darkMode]);

  /**
   * Navigate to a specific step/page
   * @param {string} newStep - Target step from STEPS constant
   */
  const navigateTo = (newStep) => {
    setStep(newStep);
  };

  /**
   * Switch current game tab
   * @param {string} tabName - Tab identifier
   */
  const switchTab = (tabName) => {
    setCurrentTab(tabName);
  };

  /**
   * Switch left sidebar tab
   * @param {string} tabName - Sidebar tab identifier
   */
  const switchLeftTab = (tabName) => {
    setLeftTab(tabName);
  };

  /**
   * Switch right sidebar tab
   * @param {string} tabName - Sidebar tab identifier
   */
  const switchRightTab = (tabName) => {
    setRightTab(tabName);
  };

  /**
   * Set gigs/touring view mode
   * @param {string} view - 'local' or 'tours'
   */
  const setGigsViewMode = (view) => {
    setGigsView(view);
  };

  /**
   * Select tour configuration
   * @param {string} tourType - Tour type identifier
   * @param {string} region - Geographic region
   */
  const selectTour = (tourType, region) => {
    setSelectedTourType(tourType);
    setSelectedTourRegion(region);
  };

  /**
   * Toggle dark mode
   */
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  /**
   * Change application theme
   * @param {string} themeName - Theme identifier
   */
  const changeTheme = (themeName) => {
    setTheme(themeName);
  };

  /**
   * Show tooltip at specific position
   * @param {string} content - Tooltip text/key
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  const showTooltipAt = (content, x, y) => {
    setShowTooltip(content);
    setTooltipPosition({ x, y });
  };

  /**
   * Hide any visible tooltip
   */
  const hideTooltip = () => {
    setShowTooltip(null);
  };

  /**
   * Advance tutorial to next step
   */
  const nextTutorialStep = () => {
    setTutorialStep(prev => prev + 1);
  };

  /**
   * Reset tutorial to beginning
   */
  const resetTutorial = () => {
    setTutorialStep(0);
    setShowTutorial(true);
  };

  /**
   * Add a font to available options
   * @param {string} fontName - Font name to add
   */
  const addFontOption = (fontName) => {
    if (fontName && !fontOptions.includes(fontName)) {
      setFontOptions(prev => [...prev, fontName]);
    }
  };

  /**
   * Reset all UI to defaults (for testing or new game)
   */
  const resetUI = () => {
    setStep(STEPS.LANDING);
    setCurrentTab('overview');
    setLeftTab('snapshot');
    setRightTab('topChart');
    setGigsView('local');
    setSelectedTourType(null);
    setSelectedTourRegion('us');
    setTheme('theme-modern');
    setDarkMode(false);
    setShowTutorial(false);
    setTutorialStep(0);
    setShowSettings(false);
  };

  // Public API
  return {
    // State accessors
    step,
    currentTab,
    leftTab,
    rightTab,
    gigsView,
    selectedTourType,
    selectedTourRegion,
    theme,
    darkMode,
    customFont,
    fontOptions,
    showTutorial,
    tutorialStep,
    showTooltip,
    tooltipPosition,
    showSettings,

    // Setters (for direct access when needed)
    setStep,
    setCurrentTab,
    setLeftTab,
    setRightTab,
    setGigsView,
    setSelectedTourType,
    setSelectedTourRegion,
    setTheme,
    setDarkMode,
    setCustomFont,
    setFontOptions,
    setShowTutorial,
    setTutorialStep,
    setShowTooltip,
    setTooltipPosition,
    setShowSettings,

    // Helper methods
    navigateTo,
    switchTab,
    switchLeftTab,
    switchRightTab,
    setGigsViewMode,
    selectTour,
    toggleDarkMode,
    changeTheme,
    showTooltipAt,
    hideTooltip,
    nextTutorialStep,
    resetTutorial,
    addFontOption,
    resetUI
  };
};

export default useUIState;
