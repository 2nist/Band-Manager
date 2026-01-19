import React, { useState } from 'react';
import { Play, Upload, Settings } from 'lucide-react';

/**
 * LandingPage - Main menu for starting/loading games
 * 
 * Shows:
 * - Band name entry
 * - New game button
 * - Load game options
 * - Settings
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

  const handleNewGame = () => {
    if (bandName.trim()) {
      onNewGame(bandName);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      padding: '2rem'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 'bold',
          marginBottom: '1rem',
          background: 'linear-gradient(45deg, #ff006e, #8338ec)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          GigMaster
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#aaa' }}>
          Rise to rock stardom... or crash and burn
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '600px',
        width: '100%',
        backgroundColor: 'rgba(30, 30, 50, 0.8)',
        borderRadius: '1rem',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(131, 56, 236, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {/* New Game Section */}
        {!showLoadMenu && !showSettings && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#aaa', textTransform: 'uppercase' }}>
                Your Band Name
              </label>
              <input
                type="text"
                value={bandName}
                onChange={(e) => setBandName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNewGame()}
                placeholder="Enter your band name..."
                style={{
                  padding: '1rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '2px solid rgba(131, 56, 236, 0.3)',
                  borderRadius: '0.5rem',
                  color: '#fff',
                  fontSize: '1rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(131, 56, 236, 0.8)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(131, 56, 236, 0.3)'}
              />
            </div>

            <button
              onClick={handleNewGame}
              disabled={!bandName.trim()}
              style={{
                padding: '1rem 2rem',
                backgroundColor: bandName.trim() ? '#ff006e' : '#666',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: bandName.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                opacity: bandName.trim() ? 1 : 0.5
              }}
              onMouseEnter={(e) => {
                if (bandName.trim()) e.target.style.backgroundColor = '#ff1975';
              }}
              onMouseLeave={(e) => {
                if (bandName.trim()) e.target.style.backgroundColor = '#ff006e';
              }}
            >
              <Play size={20} />
              Start New Game
            </button>

            {/* Secondary Buttons */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowLoadMenu(true)}
                disabled={saveSlots.length === 0}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: saveSlots.length > 0 ? 'rgba(131, 56, 236, 0.3)' : '#444',
                  color: '#fff',
                  border: '2px solid rgba(131, 56, 236, 0.3)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  cursor: saveSlots.length > 0 ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                  opacity: saveSlots.length > 0 ? 1 : 0.5
                }}
                onMouseEnter={(e) => {
                  if (saveSlots.length > 0) e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.6)';
                }}
                onMouseLeave={(e) => {
                  if (saveSlots.length > 0) e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.3)';
                }}
              >
                <Upload size={18} />
                Load Game
              </button>

              <button
                onClick={() => setShowSettings(true)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  backgroundColor: 'rgba(131, 56, 236, 0.3)',
                  color: '#fff',
                  border: '2px solid rgba(131, 56, 236, 0.3)',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.6)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.3)'}
              >
                <Settings size={18} />
                Settings
              </button>
            </div>
          </>
        )}

        {/* Load Game Menu */}
        {showLoadMenu && (
          <>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Load Game</h2>
            <div style={{ 
              maxHeight: '400px', 
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {saveSlots.length > 0 ? (
                saveSlots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => onLoadGame(slot.id)}
                    style={{
                      padding: '1rem',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid rgba(131, 56, 236, 0.3)',
                      borderRadius: '0.5rem',
                      color: '#fff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(131, 56, 236, 0.2)';
                      e.currentTarget.style.borderColor = 'rgba(131, 56, 236, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.borderColor = 'rgba(131, 56, 236, 0.3)';
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{slot.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '0.5rem' }}>
                      Week {slot.week} • ${slot.money} • Fame {slot.fame}
                    </div>
                  </button>
                ))
              ) : (
                <div style={{ color: '#aaa', textAlign: 'center', padding: '1rem' }}>
                  No saved games found
                </div>
              )}
            </div>
            <button
              onClick={() => setShowLoadMenu(false)}
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(131, 56, 236, 0.3)',
                color: '#fff',
                border: '2px solid rgba(131, 56, 236, 0.3)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.6)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.3)'}
            >
              Back
            </button>
          </>
        )}

        {/* Settings Menu */}
        {showSettings && (
          <>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Settings</h2>
            <div style={{ fontSize: '0.9rem', color: '#aaa' }}>
              <p>Sound: Enabled</p>
              <p>Music: Enabled</p>
              <p>Theme: Dark</p>
              <p>Language: English</p>
              <p style={{ marginTop: '1rem', fontSize: '0.8rem' }}>
                Version 1.0.0
              </p>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(131, 56, 236, 0.3)',
                color: '#fff',
                border: '2px solid rgba(131, 56, 236, 0.3)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.6)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.3)'}
            >
              Back
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <p style={{ 
        marginTop: '3rem', 
        color: '#666', 
        fontSize: '0.85rem',
        textAlign: 'center'
      }}>
        GigMaster © 2026 • A game about chasing dreams in the music industry
      </p>
    </div>
  );
};

export default LandingPage;
