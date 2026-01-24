import React, { useState } from 'react';
import { Users, Check, ArrowRight, Music, Zap } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { AuditionPanel } from '../components/AuditionPanel';
import { EnhancedBandFormation } from '../components/EnhancedBandFormation/EnhancedBandFormation.jsx';

/**
 * AuditionFlow.jsx - Audition members for your band
 * 
 * Band Leader Mode step:
 * - Must hire at least one member before starting
 * - Uses the AuditionPanel component
 * - First-person perspective as the band leader
 */
export const AuditionFlow = ({ 
  gameState, 
  onComplete, 
  onBack 
}) => {
  const [useEnhancedSystem, setUseEnhancedSystem] = useState(true); // Default to enhanced
  const [showAuditionPanel, setShowAuditionPanel] = useState(false);
  const [selectedRole, setSelectedRole] = useState('drummer');

  const currentMembers = gameState?.state?.bandMembers || [];
  const leaderName = gameState?.state?.leaderName || 'You';
  const bandName = gameState?.state?.bandName || 'Your Band';
  const minMembers = 2; // Leader + at least 1 member

  const handleHireMember = (member) => {
    const updatedMembers = [...currentMembers, member];
    gameState.updateGameState({
      bandMembers: updatedMembers
    });
    gameState.addLog(`${leaderName} hired ${member.name} as ${member.role}`);
    setShowAuditionPanel(false);
  };

  const roles = [
    { id: 'drummer', name: '🥁 Drummer' },
    { id: 'guitarist', name: '🎸 Guitarist' },
    { id: 'lead-guitar', name: '🎸 Lead Guitar' },
    { id: 'rhythm-guitar', name: '🎸 Rhythm Guitar' },
    { id: 'bassist', name: '🎸 Bassist' },
    { id: 'vocalist', name: '🎤 Vocalist' },
    { id: 'keyboardist', name: '🎹 Keyboardist' }
  ];

  const getMemberCountByRole = (role) => {
    return currentMembers.filter(m => m.role === role).length;
  };

  const canStart = currentMembers.length >= minMembers;

  // Use enhanced system if enabled
  if (useEnhancedSystem) {
    return (
      <EnhancedBandFormation
        gameState={gameState}
        onComplete={(finalBand, bandName, bandLogo) => {
          // Convert enhanced band format to game format
          const gameMembers = finalBand.map(member => ({
            ...member,
            id: member.id || `member-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
            firstName: member.firstName || member.name.split(' ')[0],
            name: member.name,
            role: member.role,
            type: member.role,
            skill: member.skill || 50,
            creativity: member.creativity || 50,
            reliability: member.reliability || 50,
            stagePresence: member.stagePresence || 50,
            morale: 80,
            drama: member.drama || 30,
            experience: member.experience || 1,
            weeklyCost: member.weeklyCost || 50
          }));

          // Update game state
          gameState.updateGameState({
            bandMembers: gameMembers,
            bandName: bandName || gameState.state?.bandName,
            logo: bandLogo || gameState.state?.logo
          });

          // Complete and advance
          onComplete();
        }}
        onBack={onBack}
      />
    );
  }

  // Legacy system (fallback)
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex flex-col p-4">
      <Card className="max-w-4xl w-full mx-auto p-8 border-2 border-primary/30">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users size={48} className="text-primary" />
            <Music size={48} className="text-secondary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Build Your Band
          </h1>
          <p className="text-muted-foreground text-lg">
            <span className="text-primary font-semibold">{leaderName}</span>, it's time to find musicians for{' '}
            <span className="text-secondary font-bold">{bandName}</span>
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            You need at least {minMembers - currentMembers.length} more member{minMembers - currentMembers.length !== 1 ? 's' : ''} to start
          </p>
        </div>

        {/* Current Band */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Your Band ({currentMembers.length} member{currentMembers.length !== 1 ? 's' : ''})</h2>
          {currentMembers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentMembers.map(member => (
                <Card key={member.id} className="p-4 border border-primary/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">
                        {member.name}
                        {member.isLeader && <span className="text-primary ml-2">(You - Leader)</span>}
                      </div>
                      <div className="text-sm text-muted-foreground">{member.type || member.role}</div>
                    </div>
                    <Check size={20} className="text-primary" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-6 text-center border-dashed border-2 border-border/30">
              <p className="text-muted-foreground">No members yet. Start auditioning!</p>
            </Card>
          )}
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Audition for Role</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {roles.map(role => {
              const count = getMemberCountByRole(role.id);
              return (
                <button
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role.id);
                    setShowAuditionPanel(true);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    count > 0
                      ? 'border-secondary/50 bg-secondary/10'
                      : 'border-border/30 hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-2">{role.name}</div>
                  {count > 0 && (
                    <div className="text-xs text-secondary font-semibold">{count} hired</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Instructions */}
        <Card className="p-4 bg-muted/30 border-border/20 mb-6">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">As the band leader,</strong> you'll audition candidates, hear them play,
            and decide who to hire. Each member brings unique skills that affect your band's sound and performance.
          </p>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            onClick={onBack}
            className="px-6 py-3 bg-muted text-muted-foreground hover:bg-muted/80"
          >
            Back
          </Button>
          <Button
            onClick={onComplete}
            disabled={!canStart}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {canStart ? (
              <>
                Start Leading {bandName}
                <ArrowRight size={18} />
              </>
            ) : (
              `Need ${minMembers - currentMembers.length} more member${minMembers - currentMembers.length !== 1 ? 's' : ''}`
            )}
          </Button>
        </div>
      </Card>

      {/* Audition Panel Modal */}
      {showAuditionPanel && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{ maxWidth: '900px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
            <AuditionPanel
              gameState={gameState?.state || gameState}
              onHireMember={handleHireMember}
              onClose={() => setShowAuditionPanel(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditionFlow;
