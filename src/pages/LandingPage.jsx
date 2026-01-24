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

  // Force re-render when theme changes to update styles
  React.useEffect(() => {
    // Trigger a rerender by updating document
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <div 
      key={`${currentTheme}-${isDarkMode}`}
      className="min-h-screen text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden transition-colors duration-300"
      style={{
        backgroundColor: '#000000'
      }}
    >
      {/* Top-left spotlight – white, bright */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 75% 60% at 0% 0%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.22) 20%, rgba(255, 255, 255, 0.08) 45%, transparent 70%)'
        }}
      />

      {/* Animated background stars */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-pulse"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.6)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Grid pattern overlay – very subtle */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, 0.3) 25%, rgba(255, 255, 255, 0.3) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.3) 75%, rgba(255, 255, 255, 0.3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, 0.3) 25%, rgba(255, 255, 255, 0.3) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, 0.3) 75%, rgba(255, 255, 255, 0.3) 76%, transparent 77%, transparent)',
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

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Header with neon glow - TOP 20, Tilt Neon, neon blue, random flicker */}
        <div className="text-center mb-8">
          <h1 
            className="welcome-logo-neon text-7xl font-black mb-2 tracking-widest relative"
            style={{
              fontFamily: "'Tilt Neon', sans-serif"
            }}
          >
            TOP 20
          </h1>
          <div 
            className="text-sm tracking-widest mt-1.5"
            style={{
              color: 'var(--secondary)',
              textShadow: `
                0 0 10px var(--secondary),
                0 0 20px var(--secondary)
              `
            }}
          >
            RISE & FALL
          </div>
        </div>

        {/* Main Content Card */}
        <div className="max-w-2xl w-full rounded-lg p-6 border-2 relative transition-all duration-300"
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
              <div className="flex flex-col gap-3">
                {/* Band Name Input */}
                <div className="flex flex-col gap-1.5">
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
                    className="px-3 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all font-mono uppercase text-sm border-2"
                    style={{
                      backgroundColor: 'rgba(var(--card-rgb), 0.3)',
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
                  className={`px-4 py-2 rounded-lg font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all border-2`}
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
                    backgroundColor: 'rgba(var(--card-rgb), 0.15)',
                    cursor: 'not-allowed',
                    opacity: 0.5
                  }}
                >
                  <Play size={24} />
                  START GAME
                </button>

                {/* Secondary Buttons */}
                <div className="flex gap-2 pt-2">
                  {/* Load Game Button */}
                  <button
                    onClick={() => setShowLoadMenu(true)}
                    disabled={saveSlots.length === 0}
                    className={`flex-1 px-3 py-2 rounded-lg border-2 text-lg font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all`}
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
                      backgroundColor: 'rgba(var(--card-rgb), 0.15)',
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
                    className="px-3 py-2 border-2 rounded-lg font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
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
              <div className="mt-4 pt-4 flex justify-center" style={{ borderTopColor: 'var(--primary)', borderTopWidth: '1px' }}>
                <div 
                  className="px-3 py-1 rounded text-sm uppercase tracking-wider font-mono border"
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
              <h2 className="text-3xl font-black uppercase tracking-widest mb-3" style={{ color: 'var(--primary)' }}>
                LOAD GAME
              </h2>
              <div className="max-h-96 overflow-y-auto flex flex-col gap-1.5 mb-3">
                {saveSlots.length > 0 ? (
                  saveSlots.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => onLoadGame(slot.id)}
                      className="px-3 py-2 bg-black/60 border-2 rounded-lg text-left hover:border-opacity-100 transition-all text-sm font-mono"
                      style={{
                        borderColor: 'var(--primary)',
                        color: 'var(--primary)',
                      }}
                    >
                      <div className="font-bold text-base">{slot.name}</div>
                      <div className="mt-0.5" style={{ color: 'var(--primary)', opacity: 0.6 }}>
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
                className="w-full px-3 py-2 border-2 rounded-lg font-bold uppercase transition-all"
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
              <h2 className="text-3xl font-black uppercase tracking-widest mb-3" style={{ color: 'var(--primary)' }}>
                SETTINGS
              </h2>
              
              {/* Theme Selector */}
              <div className="mb-3 pb-3" style={{ borderBottomWidth: '1px', borderBottomColor: 'var(--primary)' }}>
                <label className="text-sm font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--primary)' }}>
                  SELECT THEME
                </label>
                <div className="grid grid-cols-3 gap-1 max-h-48 overflow-y-auto">
                  {availableThemes.map(theme => (
                    <button
                      key={theme}
                      onClick={() => setTheme(theme)}
                      className={`px-1.5 py-1 rounded text-xs font-bold uppercase tracking-wider transition-all border-2 ${
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
              <div className="mb-3 pb-3" style={{ borderBottomWidth: '1px', borderBottomColor: 'var(--primary)' }}>
                <label className="text-sm font-bold uppercase tracking-widest block mb-1.5" style={{ color: 'var(--primary)' }}>
                  APPEARANCE
                </label>
                <button
                  onClick={toggleDarkMode}
                  className="w-full px-3 py-2 rounded border-2 font-bold uppercase transition-all flex items-center justify-center gap-2"
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
              <div className="text-xs font-mono space-y-1.5 mb-3" style={{ color: 'var(--muted)' }}>
                <p>SOUND: ENABLED</p>
                <p>MUSIC: ENABLED</p>
                <p>LANGUAGE: ENGLISH</p>
                <p className="mt-6 text-gray-600">
                  VERSION 1.0.0
                </p>
              </div>
              
              <button
                onClick={() => setShowSettings(false)}
                className="w-full px-3 py-2 border-2 rounded-lg font-bold uppercase transition-all"
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
      <p className="mt-8 text-sm text-center font-mono relative z-10" style={{ color: 'var(--muted)' }}>
        TOP 20 Music Industry Simulator 2026
      </p>
    </div>
  );
};

export default LandingPage;
