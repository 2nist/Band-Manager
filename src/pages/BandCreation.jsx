import React, { useState, useCallback } from 'react';
import { getAvatarUrl } from '../utils/helpers';

const ROLES = [
  { id: 'vocalist', name: '🎤 Vocals' },
  { id: 'lead-guitar', name: '🎸 Lead Guitar' },
  { id: 'rhythm-guitar', name: '🎸 Rhythm Guitar' },
  { id: 'bassist', name: '🎸 Bass' },
  { id: 'drummer', name: '🥁 Drums' },
  { id: 'keyboardist', name: '🎹 Keys' },
  { id: 'synth', name: '🎹 Synth' },
  { id: 'percussion', name: '🥁 Percussion' },
  { id: 'dj', name: '🎚️ DJ' },
];

// Pre-made band candidates
const BAND_CANDIDATES = [
  { name: 'Alex Storm', specialty: 'lead-guitar', bio: 'Shredding virtuoso with wild energy' },
  { name: 'Jamie Cross', specialty: 'vocalist', bio: 'Powerful voice with stage presence' },
  { name: 'Riley Bass', specialty: 'bassist', bio: 'Groovy bass lines and solid foundation' },
  { name: 'Casey Beat', specialty: 'drummer', bio: 'Tight rhythms and incredible timing' },
  { name: 'Morgan Keys', specialty: 'keyboardist', bio: 'Melodic keyboard master' },
  { name: 'Sam Thunder', specialty: 'rhythm-guitar', bio: 'Groove-oriented rhythm guitarist' },
  { name: 'Dev Synth', specialty: 'synth', bio: 'Synth wizard with electronic beats' },
  { name: 'Nikki Percussion', specialty: 'percussion', bio: 'Percussionist adds texture and color' },
  { name: 'Blake Turntable', specialty: 'dj', bio: 'DJ master of mixing and blending' },
  { name: 'Taylor Harmony', specialty: 'vocalist', bio: 'Harmonies and vocal arrangements' },
  { name: 'Jordan Rock', specialty: 'lead-guitar', bio: 'Rock solid guitar tones and solos' },
  { name: 'Casey Pulse', specialty: 'drummer', bio: 'Precision drummer with modern style' },
];

const BandCreation = ({ onComplete, bandName, logo }) => {
  const [phase, setPhase] = useState('rehearsal'); // 'rehearsal' or 'assembly'
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [members, setMembers] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMember = members[currentIndex];
  const currentRole = currentMember ? ROLES.find(r => r.id === currentMember.role) : null;

  // Rehearsal phase - select pre-made candidates
  const handleSelectCandidate = useCallback((candidate) => {
    const newMember = {
      id: Math.max(0, ...selectedCandidates.map(c => c.id), 0) + 1,
      name: candidate.name,
      role: candidate.specialty,
    };
    setSelectedCandidates(prev => [...prev, newMember]);
  }, [selectedCandidates]);

  const handleRemoveSelected = useCallback((idx) => {
    setSelectedCandidates(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const handleStartAssembly = useCallback(() => {
    if (selectedCandidates.length < 2) {
      alert('Select at least 2 band members to continue');
      return;
    }
    setMembers(selectedCandidates);
    setPhase('assembly');
    setCurrentIndex(0);
  }, [selectedCandidates]);

  // Assembly phase - customize members
  const updateMember = useCallback((field, value) => {
    setMembers(prev => {
      const updated = [...prev];
      updated[currentIndex] = { ...updated[currentIndex], [field]: value };
      return updated;
    });
  }, [currentIndex]);

  const addMember = useCallback(() => {
    const newId = Math.max(...members.map(m => m.id), 0) + 1;
    setMembers(prev => [...prev, { id: newId, name: '', role: 'vocalist' }]);
  }, [members]);

  const removeMember = useCallback(() => {
    if (members.length > 2) {
      const newMembers = members.filter((_, i) => i !== currentIndex);
      setMembers(newMembers);
      setCurrentIndex(Math.min(currentIndex, newMembers.length - 1));
    }
  }, [members, currentIndex]);

  const handleComplete = useCallback(() => {
    if (members.length < 2) {
      alert('Your band needs at least 2 members');
      return;
    }
    onComplete(members);
  }, [members, onComplete]);

  const handlePrevious = () => {
    if (phase === 'assembly' && currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (phase === 'assembly' && currentIndex < members.length - 1) setCurrentIndex(currentIndex + 1);
  };

  // Rehearsal Phase UI
  if (phase === 'rehearsal') {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-black mb-4 text-primary">
              Rehearsal
            </h1>
            <p className="text-foreground/70 text-lg">
              Scout talented musicians for <span className="font-bold text-primary">{bandName}</span>
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-card text-card-foreground rounded-2xl p-8 shadow-lg border border-border/20">
            {/* Logo Display */}
            {logo && (
              <div className="mb-8 p-6 bg-muted/30 rounded-xl border border-border/20">
                <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Band Logo</p>
                <div
                  style={logo.style}
                  className="text-center py-4 rounded-lg bg-muted/20"
                >
                  {bandName}
                </div>
              </div>
            )}

            {/* Selected Members */}
            {selectedCandidates.length > 0 && (
              <div className="mb-8">
                <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
                  Selected Members ({selectedCandidates.length})
                </p>
                <div className="space-y-2">
                  {selectedCandidates.map((member, idx) => {
                    const role = ROLES.find(r => r.id === member.role);
                    return (
                      <div key={idx} className="p-4 rounded-lg bg-muted/30 border border-border/20 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <img
                            src={getAvatarUrl(member.name, 'open-peeps')}
                            alt={member.name}
                            className="w-10 h-10 rounded-full border-2 border-primary"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                          <div>
                            <p className="font-bold">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{role.name}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveSelected(idx)}
                          className="px-3 py-1 text-xs bg-destructive/20 text-destructive rounded hover:bg-destructive/30 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Candidates Grid */}
            <div className="mb-8">
              <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">Available Musicians</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {BAND_CANDIDATES.map((candidate, idx) => {
                  const isSelected = selectedCandidates.some(m => m.name === candidate.name);
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectCandidate(candidate)}
                      disabled={isSelected}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? 'bg-primary/20 border-primary opacity-60 cursor-not-allowed'
                          : 'bg-muted/20 border-border/30 hover:border-primary/50 hover:bg-muted/40'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={getAvatarUrl(candidate.name, 'open-peeps')}
                          alt={candidate.name}
                          className="w-12 h-12 rounded-full border-2 border-border/50"
                          onError={(e) => e.target.style.display = 'none'}
                        />
                        <div className="flex-1">
                          <p className="font-bold">{candidate.name}</p>
                          <p className="text-xs text-muted-foreground mb-1">
                            {ROLES.find(r => r.id === candidate.specialty)?.name}
                          </p>
                          <p className="text-xs text-muted-foreground/70">{candidate.bio}</p>
                        </div>
                        {isSelected && <span className="text-lg">✓</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleStartAssembly}
              disabled={selectedCandidates.length < 2}
              className="w-full py-4 px-6 bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Assemble Your Band ({selectedCandidates.length}/∞)
            </button>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Select at least 2 musicians to proceed • You can customize their roles next
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Assembly Phase UI
  if (phase !== 'assembly' || members.length === 0) {
    return null; // Don't render assembly until members exist
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 text-primary">
            Assemble Your Band
          </h1>
          <p className="text-foreground/70 text-lg">
            Finalize your musical crew for <span className="font-bold text-primary">{bandName}</span>
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card text-card-foreground rounded-2xl p-8 shadow-lg border border-border/20">
          {/* Logo Display */}
          {logo && (
            <div className="mb-8 p-6 bg-muted/30 rounded-xl border border-border/20">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Band Logo</p>
              <div
                style={logo.style}
                className="text-center py-4 rounded-lg bg-muted/20"
              >
                {bandName}
              </div>
            </div>
          )}

          {/* Member Editor */}
          <div className="mb-8">
            <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider">
              Member {currentIndex + 1} of {members.length}
            </p>

            {/* Member Avatar */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <img
                  src={getAvatarUrl(currentMember?.name || 'member', 'open-peeps')}
                  alt={currentMember?.name || 'member'}
                  className="w-24 h-24 rounded-full border-4 border-primary shadow-lg"
                  onError={(e) => e.target.style.opacity = '0.3'}
                />
                <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full px-3 py-1 text-xs font-bold border-2 border-card">
                  {currentRole?.name.split(' ')[0] || '?'}
                </div>
              </div>
            </div>

            {/* Role Selector */}
            <div className="mb-6">
              <label className="text-sm font-semibold mb-3 block">
                Instrument
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(role => (
                  <button
                    key={role.id}
                    onClick={() => updateMember('role', role.id)}
                    className={`py-3 px-2 rounded-lg text-xs font-bold transition-all ${
                      currentMember?.role === role.id
                        ? 'bg-primary text-primary-foreground ring-2 ring-primary scale-105'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                    title={role.name}
                  >
                    {role.name.split(' ').slice(1).join(' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="mb-6">
              <label className="text-sm font-semibold mb-3 block">
                Member Name
              </label>
              <input
                type="text"
                value={currentMember?.name || ''}
                onChange={(e) => updateMember('name', e.target.value)}
                placeholder="e.g., Alex Storm"
                className="w-full px-4 py-3 bg-input text-card-foreground border border-border rounded-lg placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
            </div>

            {/* Current Role Display */}
            {currentRole && (
              <div className="p-4 bg-muted/30 rounded-lg border border-border/20 mb-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Current Position</p>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-primary" />
                  <p className="text-lg font-bold text-primary">{currentRole.name}</p>
                </div>
              </div>
            )}

            {/* Navigation Controls */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex-1 py-3 px-4 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                ← Previous
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === members.length - 1}
                className="flex-1 py-3 px-4 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                Next →
              </button>
            </div>

            {/* Member Roster */}
            <div className="mb-8">
              <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">Band Roster</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {members.map((member, idx) => {
                  const role = ROLES.find(r => r.id === member.role);
                  const isActive = idx === currentIndex;
                  return (
                    <div
                      key={member.id}
                      onClick={() => setCurrentIndex(idx)}
                      className={`p-3 rounded-lg cursor-pointer transition-all flex items-center gap-3 ${
                        isActive
                          ? 'bg-primary/20 border border-primary ring-1 ring-primary'
                          : 'bg-muted/20 border border-border/30 hover:bg-muted/40'
                      }`}
                    >
                      <img
                        src={getAvatarUrl(member.name || 'member', 'open-peeps')}
                        alt={member.name}
                        className="w-8 h-8 rounded-full border border-border/50"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">
                          {member.name || '(Empty)'}
                        </p>
                        <p className="text-xs text-muted-foreground">{role.name}</p>
                      </div>
                      {members.length > 2 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newMembers = members.filter((_, i) => i !== idx);
                            setMembers(newMembers);
                            setCurrentIndex(Math.min(currentIndex, newMembers.length - 1));
                          }}
                          className="text-xs px-2 py-1 bg-destructive/20 text-destructive rounded hover:bg-destructive/30 transition-colors whitespace-nowrap"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Member Button */}
            <button
              onClick={addMember}
              className="w-full py-3 px-4 mb-6 bg-muted text-muted-foreground border border-dashed border-muted-foreground rounded-lg hover:bg-muted/80 hover:border-primary transition-all font-semibold"
            >
              + Add New Member
            </button>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setPhase('rehearsal')}
                className="flex-1 py-3 px-6 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 font-bold transition-all"
              >
                Back to Rehearsal
              </button>
              <button
                onClick={handleComplete}
                className="flex-1 py-3 px-6 bg-primary text-primary-foreground hover:opacity-90 font-bold rounded-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg"
              >
                Start Your Career
              </button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Minimum 2 members required • You can customize their roles here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BandCreation;
