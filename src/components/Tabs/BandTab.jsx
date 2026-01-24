import React, { useState } from 'react';
import { Users, Plus, Trash2, Zap, Music, Mic, Settings } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { AuditionPanel } from '../AuditionPanel.jsx';
import { RehearsalPanel } from '../RehearsalPanel.jsx';
import { MemberToneSettingsPanel } from '../MemberToneSettingsPanel.jsx';
import { InstrumentCustomizer } from '../InstrumentCustomizer/InstrumentCustomizer.jsx';
import { AvatarDisplay } from '../AvatarDisplay.jsx';
import { generateSkillTraits } from '../../utils/memberSkillTraits.js';
import { getAvatarArchetype } from '../../avatar/avatarUtils.js';

/**
 * BandTab.jsx - Band roster and member management
 * 
 * Displays:
 * - Band member list with roles
 * - Member skill levels and morale
 * - Recruitment options
 * - Member training/practice
 * - Member removal
 */
export const BandTab = ({ 
  gameData, 
  gameState,
  bandManagement,
  onAdvanceWeek
}) => {
  const [showRecruitment, setShowRecruitment] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAuditions, setShowAuditions] = useState(false);
  const [showRehearsal, setShowRehearsal] = useState(false);
  const [showToneSettings, setShowToneSettings] = useState(false);
  const [toneSettingsMember, setToneSettingsMember] = useState(null);
  const [showInstrumentCustomizer, setShowInstrumentCustomizer] = useState(false);

  const MUSICIAN_ROLES = [
    { id: 'vocal', name: 'Vocalist', cost: 500 },
    { id: 'guitar', name: 'Guitarist', cost: 600 },
    { id: 'bass', name: 'Bassist', cost: 500 },
    { id: 'drums', name: 'Drummer', cost: 550 },
    { id: 'keyboard', name: 'Keyboardist', cost: 600 },
    { id: 'production', name: 'Producer', cost: 800 }
  ];

  const handleRecruitMember = (role) => {
    const roleData = MUSICIAN_ROLES.find(r => r.id === role);
    if (!roleData) return;

    const money = gameState?.state?.money || 0;
    if (money < roleData.cost) {
      gameState?.addLog?.(`Not enough money to recruit a ${roleData.name} (need $${roleData.cost})`);
      return;
    }

    // Add member through band management system
    if (bandManagement?.recruitMember) {
      bandManagement.recruitMember(role);
    } else {
      // Fallback: create member manually with skill traits
      const overallSkill = 5 + Math.floor(Math.random() * 4); // 5-8
      const roleMap = {
        'vocal': 'vocalist',
        'guitar': 'guitarist',
        'bass': 'bassist',
        'drums': 'drummer',
        'keyboard': 'keyboardist'
      };
      const mappedRole = roleMap[role] || role;
      const traits = generateSkillTraits(mappedRole, overallSkill * 10, {
        variance: 15,
        seed: Date.now()
      });
      
      const name = `New ${roleData.name}`;
      const newMember = {
        id: Date.now().toString(),
        name,
        type: mappedRole,
        role: mappedRole,
        skill: overallSkill,
        overallSkill: overallSkill * 10,
        morale: 80,
        traits,
        avatarSeed: name,
        avatarArchetype: getAvatarArchetype({ role: mappedRole })
      };
      
      gameState?.updateGameState?.({
        bandMembers: [...(gameState?.state?.bandMembers || []), newMember],
        money: money - roleData.cost
      });
    }

    gameState?.addLog?.(`Recruited a ${roleData.name} for $${roleData.cost}`);
    setShowRecruitment(false);
  };

  const handleFireMember = (memberId) => {
    const members = gameState?.state?.bandMembers || [];
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    gameState?.updateGameState?.({
      bandMembers: members.filter(m => m.id !== memberId),
      morale: Math.max(0, (gameState?.state?.morale || 50) - 10)
    });

    gameState?.addLog?.(`${member.name} left the band. Band morale decreased.`);
    setSelectedMember(null);
  };

  const handlePracticeMember = (memberId) => {
    const cost = 500; // $500 = 1 skill point gain
    const money = gameState?.state?.money || 0;
    
    if (money < cost) {
      gameState?.addLog?.(`Not enough money to practice (need $${cost})`);
      return;
    }

    if (bandManagement?.practiceMember) {
      const result = bandManagement.practiceMember(memberId, cost);
      if (result?.success) {
        // Force UI update by refreshing member list
        const members = gameState?.state?.bandMembers || [];
        const member = members.find(m => m.id === memberId);
        if (member) {
          gameState?.updateGameState?.({
            bandMembers: members.map(m => 
              m.id === memberId ? { ...m, skill: result.member.skill } : m
            )
          });
        }
      }
    } else {
      // Fallback if bandManagement not available
      const members = gameState?.state?.bandMembers || [];
      const memberIndex = members.findIndex(m => m.id === memberId);
      if (memberIndex !== -1) {
        const member = members[memberIndex];
        const skillGain = 1; // $500 = 1 skill point
        const updatedMembers = [...members];
        updatedMembers[memberIndex] = {
          ...member,
          skill: Math.min(10, (member.skill || 5) + skillGain),
          morale: Math.min(100, (member.morale || 80) + 3)
        };
        gameState?.updateGameState?.({
          bandMembers: updatedMembers,
          money: money - cost
        });
        gameState?.addLog?.(`${member.name} practiced: Skill +${skillGain}, Morale +3. -$${cost}`);
      }
    }

    onAdvanceWeek?.();
  };

  const members = gameData?.bandMembers || gameState?.state?.bandMembers || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-xl font-bold text-foreground">
          <Users size={24} />
          Band Members ({members.length}/6)
        </h3>
        <div className="flex gap-2">
          <Button onClick={() => setShowRehearsal(true)} disabled={members.length === 0} className="flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground">
            <Music size={16} />
            Rehearse
          </Button>
          <Button onClick={() => setShowAuditions(true)} className="flex items-center gap-2 px-4 py-2 rounded-md bg-secondary text-secondary-foreground">
            <Mic size={16} />
            Auditions
          </Button>
          <Button onClick={() => setShowRecruitment(!showRecruitment)} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground">
            <Plus size={16} />
            Recruit
          </Button>
        </div>
      </div>

      {/* Recruitment Panel */}
      {showRecruitment && members.length < 6 && (
        <div className="p-6 mb-6 border-2 rounded-lg bg-primary/10 border-primary/30">
          <h4 className="mb-4 text-lg font-semibold text-foreground">Recruit a Musician</h4>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {MUSICIAN_ROLES.map(role => (
              <Card key={role.id} className="p-3 text-left transition-all border rounded-md cursor-pointer border-primary/30 hover:border-primary/60 hover:bg-primary/5" onClick={() => handleRecruitMember(role.id)}>
                <div className="font-semibold text-foreground">{role.name}</div>
                <div className="text-sm text-muted-foreground">${role.cost}</div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Member List */}
      {members.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {members.map(member => (
            <Card 
              key={member.id}
              onClick={() => setSelectedMember(selectedMember?.id === member.id ? null : member)}
              className="p-4 transition-all border-2 rounded-lg cursor-pointer border-primary/30 hover:border-primary/60"
            >
              <div className="flex items-start gap-3 mb-2">
                <AvatarDisplay entity={member} size="sm" alt={member.name} />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-foreground">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">Role: <span className="font-medium text-primary">{member.type}</span></p>
                </div>
              </div>

              {/* Stats */}
              <div className="mb-3 space-y-2 text-sm">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Skill Rating</span>
                    <span className="text-secondary font-bold text-base">{member.skill || 5}/10</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded bg-input">
                    <div className="h-full bg-secondary transition-all" style={{ width: `${(member.skill || 5) * 10}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Practice to increase skill</p>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">Morale</span>
                    <span className="text-accent font-bold text-base">{member.morale || 80}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded bg-input">
                    <div className="h-full bg-accent transition-all" style={{ width: `${member.morale || 80}%` }} />
                  </div>
                </div>
              </div>

              {/* Skill Traits */}
              {member.traits && typeof member.traits === 'object' && !Array.isArray(member.traits) && Object.keys(member.traits).length > 0 && (
                <div className="pt-2 mb-3 text-xs border-t text-muted-foreground/70 border-border/20">
                  <div className="mb-1 font-semibold">Skills:</div>
                  {Object.entries(member.traits).slice(0, 3).map(([trait, value]) => (
                    <div key={trait} className="text-xs">
                      {trait}: {value}/100
                    </div>
                  ))}
                </div>
              )}
              {/* Legacy traits array */}
              {member.traits && Array.isArray(member.traits) && member.traits.length > 0 && (
                <div className="pt-2 mb-3 text-xs border-t text-muted-foreground/70 border-border/20">
                  Traits: {member.traits.join(', ')}
                </div>
              )}

              {/* Expanded View */}
              {selectedMember?.id === member.id && (
                <div className="pt-3 mt-3 space-y-2 border-t border-border/20">
                  <Button onClick={(e) => { e.stopPropagation(); setToneSettingsMember(member); setShowToneSettings(true); }} className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium rounded-md bg-primary/20 text-primary">
                    <Settings size={14} />
                    Tone Settings
                  </Button>
                  <Button onClick={(e) => { e.stopPropagation(); handlePracticeMember(member.id); }} className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium rounded-md bg-secondary/20 text-secondary">
                    <Zap size={14} />
                    Practice ($100)
                  </Button>
                  <Button onClick={(e) => { e.stopPropagation(); handleFireMember(member.id); }} className="flex items-center justify-center w-full gap-2 px-3 py-2 text-sm font-medium rounded-md bg-destructive/20 text-destructive">
                    <Trash2 size={14} />
                    Fire
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center border-2 rounded-lg border-border/20">
          <p className="mb-4 text-muted-foreground">No band members yet. Recruit some musicians to get started!</p>
          <Button onClick={() => setShowRecruitment(true)} className="flex items-center gap-2 px-6 py-2 mx-auto rounded-md bg-primary text-primary-foreground">
            <Plus size={16} />
            Recruit First Member
          </Button>
        </Card>
      )}

      {/* Audition Panel Modal */}
      {showAuditions && (
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
              onHireMember={(member) => {
                const currentMembers = gameState?.state?.bandMembers || gameState?.bandMembers || [];
                gameState?.updateGameState?.({
                  bandMembers: [...currentMembers, member]
                });
                gameState?.addLog?.(`Hired ${member.name} as ${member.role}`);
                setShowAuditions(false);
              }}
              onClose={() => setShowAuditions(false)}
            />
          </div>
        </div>
      )}

      {/* Rehearsal Panel Modal */}
      {showRehearsal && (
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
            <RehearsalPanel
              gameState={gameState?.state || gameState}
              onClose={() => setShowRehearsal(false)}
            />
          </div>
        </div>
      )}

      {/* Tone Settings Modal */}
      {showToneSettings && toneSettingsMember && (
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
          <div style={{ maxWidth: '700px', width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
            <MemberToneSettingsPanel
              member={toneSettingsMember}
              gameState={gameState?.state || gameState}
              onSave={(memberId, settings) => {
                const currentMembers = gameState?.state?.bandMembers || gameState?.bandMembers || [];
                const updatedMembers = currentMembers.map(m => 
                  m.id === memberId ? { ...m, toneSettings: settings } : m
                );
                gameState?.updateGameState?.({
                  bandMembers: updatedMembers
                });
                gameState?.addLog?.(`Updated tone settings for ${toneSettingsMember.name}`);
                setShowToneSettings(false);
                setToneSettingsMember(null);
              }}
              onClose={() => {
                setShowToneSettings(false);
                setToneSettingsMember(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Instrument Customizer Modal */}
      {showInstrumentCustomizer && (
        <InstrumentCustomizer
          bandMembers={members}
          currentGenre={gameState?.state?.genre || 'Rock'}
          gameState={gameState?.state || gameState}
          isOpen={showInstrumentCustomizer}
          onClose={() => setShowInstrumentCustomizer(false)}
          onConfigChange={(role, config) => {
            // Save configs to member data
            const currentMembers = gameState?.state?.bandMembers || [];
            const updatedMembers = currentMembers.map(m => {
              const memberRole = m.role || m.type;
              if (memberRole === role) {
                return {
                  ...m,
                  instrumentConfig: config
                };
              }
              return m;
            });
            gameState?.updateGameState?.({
              bandMembers: updatedMembers
            });
          }}
        />
      )}
    </div>
  );
};
