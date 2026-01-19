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
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-4 text-primary">
          GigMaster
        </h1>
        <p className="text-xl text-muted-foreground">
          Rise to rock stardom... or crash and burn
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-xl w-full bg-card rounded-2xl p-8 border border-border/20 flex flex-col gap-6">
        {/* New Game Section */}
        {!showLoadMenu && !showSettings && (
          <>
            <div className="flex flex-col gap-4">
              <label className="text-sm text-muted-foreground uppercase font-medium">
                Your Band Name
              </label>
              <input
                type="text"
                value={bandName}
                onChange={(e) => setBandName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleNewGame()}
                placeholder="Enter your band name..."
                className="px-4 py-3 bg-input border border-border/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-colors"
              />
            </div>

            <button
              onClick={handleNewGame}
              disabled={!bandName.trim()}
              className={`px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                bandName.trim()
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
              }`}
            >
              <Play size={20} />
              Start New Game
            </button>

            {/* Secondary Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowLoadMenu(true)}
                disabled={saveSlots.length === 0}
                className={`flex-1 px-4 py-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                  saveSlots.length > 0
                    ? 'bg-secondary/10 border-secondary/30 text-foreground hover:bg-secondary/20 hover:border-secondary/50'
                    : 'bg-muted border-border/20 text-muted-foreground cursor-not-allowed opacity-50'
                }`}
              >
                <Upload size={18} />
                Load Game
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="flex-1 px-4 py-3 rounded-lg border border-secondary/30 bg-secondary/10 text-foreground hover:bg-secondary/20 hover:border-secondary/50 transition-all flex items-center justify-center gap-2"
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
            <h2 className="text-2xl font-bold text-foreground">Load Game</h2>
            <div className="max-h-96 overflow-y-auto flex flex-col gap-2">
              {saveSlots.length > 0 ? (
                saveSlots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => onLoadGame(slot.id)}
                    className="px-4 py-3 bg-input border border-border/30 rounded-lg text-foreground text-left hover:bg-input/80 hover:border-secondary/50 transition-all"
                  >
                    <div className="font-bold">{slot.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Week {slot.week} • ${slot.money} • Fame {slot.fame}
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-muted-foreground text-center py-4">
                  No saved games found
                </div>
              )}
            </div>
            <button
              onClick={() => setShowLoadMenu(false)}
              className="px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-lg text-foreground hover:bg-secondary/20 transition-all"
            >
              Back
            </button>
          </>
        )}

        {/* Settings Menu */}
        {showSettings && (
          <>
            <h2 className="text-2xl font-bold text-foreground">Settings</h2>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Sound: Enabled</p>
              <p>Music: Enabled</p>
              <p>Theme: Dark</p>
              <p>Language: English</p>
              <p className="mt-4 text-xs text-muted-foreground/70">
                Version 1.0.0
              </p>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 bg-secondary/10 border border-secondary/30 rounded-lg text-foreground hover:bg-secondary/20 transition-all"
            >
              Back
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <p className="mt-12 text-muted-foreground text-sm text-center">
        GigMaster © 2026 • A game about chasing dreams in the music industry
      </p>
    </div>
  );
};

export default LandingPage;
