import React, { useState } from 'react';
import { Play, Upload, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

/**
 * LandingPage - Main menu for starting/loading games
 * 
 * Shows:
 * - Band name entry
 * - New game button
 * - Load game options
 * - Settings with theme and dark mode controls
 * 
 * Responsive to theme and dark mode changes with CSS variables
 */
export const LandingPage = ({ 
  onNewGame, 
  onLoadGame, 
  onSettings,
  saveSlots = []
}) => {
  const [bandName, setBandName] = useState('');
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { isDarkMode, toggleDarkMode, currentTheme, setTheme, THEME_NAMES, availableThemes } = useTheme();

  const handleNewGame = () => {
    if (bandName.trim()) {
      onNewGame(bandName);
    }
  };

  return (
    <div className="min-h-screen text-foreground flex flex-col items-center justify-center p-8 relative overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: 'var(--background)'
      }}
    >
      {/* Animated background stars */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              backgroundColor: 'var(--secondary)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Geometric background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary via-transparent to-secondary" />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(var(--primary-rgb), .2) 25%, rgba(var(--primary-rgb), .2) 26%, transparent 27%, transparent 74%, rgba(var(--primary-rgb), .2) 75%, rgba(var(--primary-rgb), .2) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(var(--primary-rgb), .2) 25%, rgba(var(--primary-rgb), .2) 26%, transparent 27%, transparent 74%, rgba(var(--primary-rgb), .2) 75%, rgba(var(--primary-rgb), .2) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Neon glow lines */}
      <div className="absolute top-0 left-0 right-0 h-px opacity-20 pointer-events-none" 
        style={{
          background: 'linear-gradient(to right, transparent, var(--primary), transparent)'
        }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-px opacity-20 pointer-events-none"
        style={{
          background: 'linear-gradient(to right, transparent, var(--secondary), transparent)'
        }}
      />

      {/* Top Right - Theme/Dark Mode Controls */}
      <div className="absolute top-6 right-6 z-20 flex gap-3">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-3 rounded-lg border-2 transition-all duration-300"
          style={{
            borderColor: 'var(--primary)',
            backgroundColor: 'rgba(var(--card-rgb), 0.6)',
            color: 'var(--primary)',
            boxShadow: isDarkMode 
              ? '0 0 20px var(--primary)' 
              : '0 0 10px var(--primary)'
          }}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Theme Label */}
        <div className="flex items-center px-4 py-3 rounded-lg border-2"
          style={{
            borderColor: 'var(--secondary)',
            backgroundColor: 'rgba(var(--card-rgb), 0.4)',
            color: 'var(--secondary)',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            letterSpacing: '0.1em'
          }}
        >
          {THEME_NAMES[currentTheme]}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Header with neon glow */}
        <div className="text-center mb-16">
          <h1 
            className="text-7xl font-black mb-4 tracking-widest relative"
            style={{
              color: 'var(--primary)',
              textShadow: `
                0 0 10px var(--primary),
                0 0 20px var(--primary),
                0 0 30px var(--primary),
                0 0 40px var(--primary)
              `,
              letterSpacing: '0.05em',
              fontFamily: 'monospace'
            }}
          >
            GIGMASTER
          </h1>
          <div 
            className="text-sm tracking-widest mt-3"
            style={{
              color: 'var(--secondary)',
              textShadow: `
                0 0 10px var(--secondary),
                0 0 20px var(--secondary)
              `
            }}
          >
            RISE TO STARDOM
          </div>
        </div>

        {/* Main Content Card */}
        <div className="max-w-2xl w-full rounded-lg p-12 border-2 relative transition-all duration-300"
          style={{
            backgroundColor: 'rgba(var(--card-rgb), 0.4)',
            borderColor: 'var(--primary)',
            backdropFilter: 'blur(8px)',
            boxShadow: `
              inset 0 0 20px var(--primary),
              0 0 30px var(--primary),
              0 0 60px var(--primary)
            `
          }}
        >
          {/* New Game Section */}
          {!showLoadMenu && !showSettings && (
            <>
              <div className="flex flex-col gap-6">
                {/* Band Name Input */}
                <div className="flex flex-col gap-3">
                  <label 
                    className="text-xs uppercase font-bold tracking-widest"
                    style={{ color: 'var(--primary)' }}
                  >
                    ENTER BAND NAME
                  </label>
                  <input
                    type="text"
                    value={bandName}
                    onChange={(e) => setBandName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleNewGame()}
                    placeholder="YOUR BAND..."
                    className="px-6 py-4 rounded-lg focus:outline-none focus:ring-2 transition-all font-mono uppercase text-sm border-2"
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderColor: 'var(--primary)',
                      color: 'var(--primary)',
                      '--placeholder-color': 'var(--primary)',
                    }}
                  />
                </div>

                {/* Start Game Button */}
                <button
                  onClick={handleNewGame}
                  disabled={!bandName.trim()}
                  className={`px-8 py-4 rounded-lg font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all border-2`}
                  style={bandName.trim() ? {
                    borderColor: 'var(--primary)',
                    color: 'var(--primary)',
                    backgroundColor: 'rgba(var(--primary-rgb), 0.05)',
                    boxShadow: `
                      0 0 20px var(--primary),
                      inset 0 0 20px var(--primary)
                    `,
                    cursor: 'pointer'
                  } : {
                    borderColor: 'var(--muted)',
                    color: 'var(--muted)',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    cursor: 'not-allowed',
                    opacity: 0.5
                  }}
                >
                  <Play size={24} />
                  START GAME
                </button>

                {/* Secondary Buttons */}
                <div className="flex gap-4 pt-4">
                  {/* Load Game Button */}
                  <button
                    onClick={() => setShowLoadMenu(true)}
                    disabled={saveSlots.length === 0}
                    className={`flex-1 px-6 py-4 rounded-lg border-2 text-lg font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all`}
                    style={saveSlots.length > 0 ? {
                      borderColor: 'var(--secondary)',
                      color: 'var(--secondary)',
                      backgroundColor: 'rgba(var(--secondary-rgb), 0.05)',
                      boxShadow: `
                        0 0 20px var(--secondary),
                        inset 0 0 20px var(--secondary)
                      `,
                      cursor: 'pointer'
                    } : {
                      borderColor: 'var(--muted)',
                      color: 'var(--muted)',
                      backgroundColor: 'rgba(0, 0, 0, 0.2)',
                      cursor: 'not-allowed',
                      opacity: 0.5
                    }}
                  >
                    <Upload size={20} />
                    LOAD GAME
                  </button>

                  {/* Settings Button */}
                  <button
                    onClick={() => setShowSettings(true)}
                    className="px-6 py-4 border-2 rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                    style={{
                      borderColor: 'var(--muted)',
                      color: 'var(--muted)',
                    }}
                  >
                    <Settings size={20} />
                    SETTINGS
                  </button>
                </div>
              </div>

              {/* Difficulty Indicator */}
              <div className="mt-8 pt-8 flex justify-center" style={{ borderTopColor: 'var(--primary)', borderTopWidth: '1px' }}>
                <div 
                  className="px-6 py-2 rounded text-sm uppercase tracking-wider font-mono border"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    borderColor: 'var(--muted)',
                    color: 'var(--muted)'
                  }}
                >
                  Normal
                </div>
              </div>
            </>
          )}

          {/* Load Game Menu */}
          {showLoadMenu && (
            <>
              <h2 className="text-3xl font-black uppercase tracking-widest mb-6" style={{ color: 'var(--primary)' }}>
                LOAD GAME
              </h2>
              <div className="max-h-96 overflow-y-auto flex flex-col gap-3 mb-6">
                {saveSlots.length > 0 ? (
                  saveSlots.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => onLoadGame(slot.id)}
                      className="px-6 py-4 bg-black/60 border-2 rounded-lg text-left hover:border-opacity-100 transition-all text-sm font-mono"
                      style={{
                        borderColor: 'var(--primary)',
                        color: 'var(--primary)',
                      }}
                    >
                      <div className="font-bold text-base">{slot.name}</div>
                      <div className="mt-1" style={{ color: 'var(--primary)', opacity: 0.6 }}>
                        WEEK {slot.week} • ${slot.money} • FAME {slot.fame}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 font-mono" style={{ color: 'var(--muted)' }}>
                    NO SAVED GAMES
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowLoadMenu(false)}
                className="w-full px-6 py-3 border-2 rounded-lg font-bold uppercase transition-all"
                style={{
                  borderColor: 'var(--primary)',
                  color: 'var(--primary)',
                }}
              >
                BACK
              </button>
            </>
          )}

          {/* Settings Menu */}
          {showSettings && (
            <>
              <h2 className="text-3xl font-black uppercase tracking-widest mb-6" style={{ color: 'var(--primary)' }}>
                SETTINGS
              </h2>
              
              {/* Theme Selector */}
              <div className="mb-6 pb-6" style={{ borderBottomWidth: '1px', borderBottomColor: 'var(--primary)' }}>
                <label className="text-sm font-bold uppercase tracking-widest block mb-3" style={{ color: 'var(--primary)' }}>
                  SELECT THEME
                </label>
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {availableThemes.map(theme => (
                    <button
                      key={theme}
                      onClick={() => setTheme(theme)}
                      className={`px-3 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all border-2 ${
                        currentTheme === theme ? 'border-opacity-100' : 'border-opacity-50'
                      }`}
                      style={{
                        backgroundColor: currentTheme === theme ? 'rgba(var(--primary-rgb), 0.2)' : 'rgba(var(--primary-rgb), 0.05)',
                        borderColor: 'var(--primary)',
                        color: 'var(--primary)',
                        boxShadow: currentTheme === theme ? `0 0 15px var(--primary)` : 'none'
                      }}
                    >
                      {THEME_NAMES[theme]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dark Mode Toggle */}
              <div className="mb-6 pb-6" style={{ borderBottomWidth: '1px', borderBottomColor: 'var(--primary)' }}>
                <label className="text-sm font-bold uppercase tracking-widest block mb-3" style={{ color: 'var(--primary)' }}>
                  APPEARANCE
                </label>
                <button
                  onClick={toggleDarkMode}
                  className="w-full px-6 py-3 rounded border-2 font-bold uppercase transition-all flex items-center justify-center gap-2"
                  style={{
                    borderColor: 'var(--primary)',
                    backgroundColor: 'rgba(var(--primary-rgb), 0.05)',
                    color: 'var(--primary)',
                  }}
                >
                  {isDarkMode ? (
                    <>
                      <Sun size={20} /> Light Mode
                    </>
                  ) : (
                    <>
                      <Moon size={20} /> Dark Mode
                    </>
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="text-xs font-mono space-y-3 mb-6" style={{ color: 'var(--muted)' }}>
                <p>SOUND: ENABLED</p>
                <p>MUSIC: ENABLED</p>
                <p>LANGUAGE: ENGLISH</p>
                <p className="mt-6 text-gray-600">
                  VERSION 1.0.0
                </p>
              </div>
              
              <button
                onClick={() => setShowSettings(false)}
                className="w-full px-6 py-3 border-2 rounded-lg font-bold uppercase transition-all"
                style={{
                  borderColor: 'var(--primary)',
                  color: 'var(--primary)',
                }}
              >
                BACK
              </button>
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="mt-16 text-sm text-center font-mono relative z-10" style={{ color: 'var(--muted)' }}>
        GIGMASTER © 2026 • CHASING DREAMS IN THE MUSIC INDUSTRY
      </p>
    </div>
  );
};

export default LandingPage;
