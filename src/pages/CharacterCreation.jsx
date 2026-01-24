import React, { useState } from 'react';
import { User, Music, ArrowRight } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';

/**
 * CharacterCreation.jsx - Create your band leader character
 * 
 * First step in Band Leader Mode:
 * 1. Name your character (the band leader)
 * 2. Name your band
 * 3. Choose your role/instrument
 */
export const CharacterCreation = ({ 
  onComplete, 
  onBack,
  gameState
}) => {
  const [leaderName, setLeaderName] = useState('');
  // Use band name from gameState (already set in LandingPage)
  const bandName = gameState?.state?.bandName || '';
  const [leaderRole, setLeaderRole] = useState('vocalist');

  const roles = [
    { id: 'vocalist', name: 'Vocals', icon: '🎤', description: 'Front the band as the lead singer' },
    { id: 'lead-guitar', name: 'Lead Guitar', icon: '🎸', description: 'Lead with powerful guitar solos' },
    { id: 'rhythm-guitar', name: 'Rhythm Guitar', icon: '🎸', description: 'Anchor the band with rhythm' },
    { id: 'bassist', name: 'Bass', icon: '🎸', description: 'Hold down the low end' },
    { id: 'drummer', name: 'Drums', icon: '🥁', description: 'Drive the band with rhythm' },
    { id: 'keyboardist', name: 'Keys', icon: '🎹', description: 'Add texture and melody' }
  ];

  const handleComplete = () => {
    if (!leaderName.trim()) {
      alert('Please enter your character name');
      return;
    }
    if (!bandName || !bandName.trim()) {
      alert('Band name is required. Please go back and enter your band name first.');
      return;
    }

    // Create the player character as band leader
    const playerCharacter = {
      id: 'player-leader',
      name: leaderName.trim(),
      role: leaderRole,
      type: roles.find(r => r.id === leaderRole)?.name || 'Leader',
      skill: 6, // Starting skill
      morale: 85,
      stats: { skill: 6, charisma: 7, creativity: 7 },
      isLeader: true,
      bio: `The leader and founder of ${bandName || 'the band'}.`
    };

    onComplete({
      leaderName: leaderName.trim(),
      bandName: bandName || gameState?.state?.bandName || 'Your Band',
      leaderRole,
      playerCharacter
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex flex-col items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 border-2 border-primary/30">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <User size={48} className="text-primary" />
            <Music size={48} className="text-secondary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Create Your Band Leader
          </h1>
          <p className="text-muted-foreground">
            You're starting your own band. Who are you, and what will you call your band?
          </p>
        </div>

        <div className="space-y-6">
          {/* Leader Name */}
          <div>
            <label className="block mb-2 font-semibold text-foreground">
              Your Name (Band Leader)
            </label>
            <input
              type="text"
              value={leaderName}
              onChange={(e) => setLeaderName(e.target.value)}
              placeholder="Enter your character name..."
              className="w-full px-4 py-3 bg-input border border-border/50 rounded-lg text-foreground placeholder-muted-foreground text-lg"
              autoFocus
            />
            <p className="text-xs text-muted-foreground mt-1">
              This is you - the band leader and founder
            </p>
          </div>

          {/* Band Name Display (read-only, set in LandingPage) */}
          {bandName && (
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <label className="block mb-2 font-semibold text-foreground">
                Band Name
              </label>
              <div className="text-lg font-bold text-primary">
                {bandName}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Set during game setup
              </p>
            </div>
          )}

          {/* Leader Role */}
          <div>
            <label className="block mb-2 font-semibold text-foreground">
              Your Role in the Band
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => setLeaderRole(role.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    leaderRole === role.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border/30 hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{role.icon}</div>
                  <div className="font-semibold text-foreground mb-1">{role.name}</div>
                  <div className="text-xs text-muted-foreground">{role.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {leaderName && (
            <Card className="p-4 bg-muted/30 border-border/20">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              <p className="text-foreground font-medium">
                <span className="text-primary">{leaderName}</span> leads{' '}
                <span className="text-secondary font-bold">{bandName || 'Your Band'}</span> as{' '}
                <span className="text-accent">{roles.find(r => r.id === leaderRole)?.name || 'Leader'}</span>
              </p>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={onBack}
              className="flex-1 px-6 py-3 bg-muted text-muted-foreground hover:bg-muted/80"
            >
              Back
            </Button>
            <Button
              onClick={handleComplete}
              disabled={!leaderName.trim() || !bandName?.trim()}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center gap-2"
            >
              Continue to Auditions
              <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CharacterCreation;
