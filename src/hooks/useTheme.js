import { useState, useEffect, useCallback } from 'react';

/**
 * useTheme - Theme management hook
 * Handles:
 * - Light/Dark mode toggle
 * - Theme selection (LOUD, SONGWRITER, YACHT_ROCK, etc.)
 * - LocalStorage persistence
 * - System preference detection
 */
export const useTheme = () => {
  // Available themes
  const THEMES = {
    LOUD: 'loud',
    SONGWRITER: 'songwriter',
    YACHT_ROCK: 'yacht-rock',
    RAGTIME: 'ragtime',
    BUBBLEGUM: 'bubblegum',
    COFFEESHOP: 'coffeeshop',
    PURPLEHAZE: 'purplehaze',
    SYNTHWAVE: 'synthwave',
    OLYMPIA: 'olympia',
    DOOM: 'doom',
    CHRONIC: 'chronic'
  };

  const THEME_NAMES = {
    loud: 'LOUD',
    songwriter: 'Songwriter',
    'yacht-rock': 'Yacht Rock',
    ragtime: 'Ragtime',
    bubblegum: 'Bubblegum',
    coffeeshop: 'Coffee Shop',
    purplehaze: 'Purple Haze',
    synthwave: 'Synthwave',
    olympia: 'Olympia',
    doom: 'DOOM',
    chronic: 'Chronic'
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('gigmaster_darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('gigmaster_theme');
    return saved || THEMES.SYNTHWAVE;
  });

  // Persist dark mode setting
  useEffect(() => {
    localStorage.setItem('gigmaster_darkMode', isDarkMode);
  }, [isDarkMode]);

  // Persist theme setting
  useEffect(() => {
    localStorage.setItem('gigmaster_theme', currentTheme);
  }, [currentTheme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    Object.values(THEMES).forEach(theme => {
      root.classList.remove(`theme-${theme}`);
    });
    
    // Add current theme class
    root.classList.add(`theme-${currentTheme}`);
    
    // Add dark mode class
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [currentTheme, isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const setTheme = useCallback((theme) => {
    // Simple validation - just set the theme
    setCurrentTheme(theme);
  }, []);

  return {
    isDarkMode,
    toggleDarkMode,
    currentTheme,
    setTheme,
    THEMES,
    THEME_NAMES,
    availableThemes: Object.values(THEMES)
  };
};

export default useTheme;
