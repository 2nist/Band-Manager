import React, { useState } from 'react';
import { Users, Plus, Trash2, Zap, Music, Mic, Settings } from 'lucide-react';
import { AuditionPanel } from '../AuditionPanel.jsx';
import { RehearsalPanel } from '../RehearsalPanel.jsx';
import { MemberToneSettingsPanel } from '../MemberToneSettingsPanel.jsx';
import { generateSkillTraits } from '../../utils/memberSkillTraits.js';

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
      
      const newMember = {
        id: Date.now().toString(),
        name: `New ${roleData.name}`,
        type: mappedRole,
        role: mappedRole,
        skill: overallSkill,
        overallSkill: overallSkill * 10,
        morale: 80,
        traits: traits
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
    const cost = 100;
    const money = gameState?.state?.money || 0;
    
    if (money < cost) {
      gameState?.addLog?.(`Not enough money to practice (need $${cost})`);
      return;
    }

    if (bandManagement?.practiceMember) {
      bandManagement.practiceMember(memberId);
    }

    gameState?.updateGameState?.({
      money: money - cost
    });

    gameState?.addLog?.(`Band practiced. Member skills improved. -$${cost}`);
    onAdvanceWeek?.();
  };

  const members = gameData?.bandMembers || gameState?.state?.bandMembers || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Users size={24} />
          Band Members ({members.length}/6)
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowRehearsal(true)}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-md cursor-pointer hover:opacity-90 transition-all flex items-center gap-2"
            disabled={members.length === 0}
          >
            <Music size={16} />
            Rehearse
          </button>
          <button
            onClick={() => setShowAuditions(true)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md cursor-pointer hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Mic size={16} />
            Auditions
          </button>
          <button
            onClick={() => setShowRecruitment(!showRecruitment)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            Recruit
          </button>
        </div>
      </div>

      {/* Recruitment Panel */}
      {showRecruitment && members.length < 6 && (
        <div className="bg-primary/10 border-2 border-primary/30 p-6 rounded-lg mb-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">Recruit a Musician</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {MUSICIAN_ROLES.map(role => (
              <button
                key={role.id}
                onClick={() => handleRecruitMember(role.id)}
                className="p-3 bg-card border border-primary/30 rounded-md hover:border-primary/60 hover:bg-primary/5 transition-all text-left cursor-pointer"
              >
                <div className="font-semibold text-foreground">{role.name}</div>
                <div className="text-sm text-muted-foreground">${role.cost}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Member List */}
      {members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map(member => (
            <div 
              key={member.id}
              onClick={() => setSelectedMember(selectedMember?.id === member.id ? null : member)}
              className="bg-card border-2 border-primary/30 p-4 rounded-lg hover:border-primary/60 transition-all cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-foreground font-semibold">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">Role: <span className="text-primary font-medium">{member.type}</span></p>
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2 text-sm mb-3">
                <div>
                  <div className="text-muted-foreground mb-1">Skill ({member.skill || 5}/10)</div>
                  <div className="h-2 bg-input rounded overflow-hidden">
                    <div className="h-full bg-secondary" style={{ width: `${(member.skill || 5) * 10}%` }} />
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1">Morale ({member.morale || 80}%)</div>
                  <div className="h-2 bg-input rounded overflow-hidden">
                    <div className="h-full bg-accent" style={{ width: `${member.morale || 80}%` }} />
                  </div>
                </div>
              </div>

              {/* Skill Traits */}
              {member.traits && typeof member.traits === 'object' && !Array.isArray(member.traits) && Object.keys(member.traits).length > 0 && (
                <div className="text-xs text-muted-foreground/70 pt-2 border-t border-border/20 mb-3">
                  <div className="font-semibold mb-1">Skills:</div>
                  {Object.entries(member.traits).slice(0, 3).map(([trait, value]) => (
                    <div key={trait} className="text-xs">
                      {trait}: {value}/100
                    </div>
                  ))}
                </div>
              )}
              {/* Legacy traits array */}
              {member.traits && Array.isArray(member.traits) && member.traits.length > 0 && (
                <div className="text-xs text-muted-foreground/70 pt-2 border-t border-border/20 mb-3">
                  Traits: {member.traits.join(', ')}
                </div>
              )}

              {/* Expanded View */}
              {selectedMember?.id === member.id && (
                <div className="border-t border-border/20 pt-3 mt-3 space-y-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setToneSettingsMember(member);
                      setShowToneSettings(true);
                    }}
                    className="w-full px-3 py-2 bg-primary/20 text-primary hover:bg-primary/40 rounded-md cursor-pointer text-sm font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    <Settings size={14} />
                    Tone Settings
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePracticeMember(member.id);
                    }}
                    className="w-full px-3 py-2 bg-secondary/20 text-secondary hover:bg-secondary/40 rounded-md cursor-pointer text-sm font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    <Zap size={14} />
                    Practice ($100)
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFireMember(member.id);
                    }}
                    className="w-full px-3 py-2 bg-destructive/20 text-destructive hover:bg-destructive/40 rounded-md cursor-pointer text-sm font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    <Trash2 size={14} />
                    Fire
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border-2 border-border/20 p-8 rounded-lg text-center">
          <p className="text-muted-foreground mb-4">No band members yet. Recruit some musicians to get started!</p>
          <button
            onClick={() => setShowRecruitment(true)}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:opacity-90 transition-all flex items-center gap-2 mx-auto"
          >
            <Plus size={16} />
            Recruit First Member
          </button>
        </div>
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
    </div>
  );
};
