/**
 * FirstRehearsal - First band rehearsal and finalization
 */

import React, { useState } from 'react';
import { Music, Check, ArrowLeft, Play, Pause } from 'lucide-react';
import { EnhancedAvatar } from './EnhancedAvatar.jsx';

export const FirstRehearsal = ({
  band,
  bandName,
  onComplete,
  onBack,
  gameState
}) => {
  const [rehearsalStarted, setRehearsalStarted] = useState(false);
  const [rehearsalComplete, setRehearsalComplete] = useState(false);
  const [rehearsalNotes, setRehearsalNotes] = useState([]);

  const handleStartRehearsal = () => {
    setRehearsalStarted(true);
    
    // Simulate rehearsal and generate notes
    setTimeout(() => {
      const notes = generateRehearsalNotes(band);
      setRehearsalNotes(notes);
      setRehearsalComplete(true);
    }, 2000);
  };

  const handleComplete = () => {
    // Finalize band members with game stats
    const finalizedBand = band.map(member => ({
      ...member,
      id: member.id || `member-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      firstName: member.firstName || member.name.split(' ')[0],
      name: member.name,
      role: member.role,
      skill: member.skill || 50,
      creativity: member.creativity || 50,
      reliability: member.reliability || 50,
      stagePresence: member.stagePresence || 50,
      morale: 80,
      drama: member.drama || 30,
      experience: member.experience || 1,
      weeklyCost: member.weeklyCost || 50,
      instrumentConfig: null, // Will be set by instrument customizer
      toneSettings: null // Will be set by tone settings
    }));
    
    onComplete(finalizedBand, bandName);
  };

  return (
    <div className="first-rehearsal space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-cyan-400 mb-2">First Rehearsal</h2>
        <p className="text-gray-400">
          {bandName ? `${bandName}'s` : 'Your'} first practice session together
        </p>
      </div>

      {/* Band Lineup */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-cyan-500/20">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Band Lineup</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {band.map(member => (
            <div key={member.id} className="text-center">
              <EnhancedAvatar
                traits={member.appearance}
                expression="focused"
                size="large"
                seed={member.appearance?.seed || member.id}
              />
              <div className="mt-2">
                <div className="text-cyan-400 font-semibold">{member.name}</div>
                <div className="text-xs text-gray-400">{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rehearsal Status */}
      {!rehearsalStarted ? (
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-cyan-500/20 text-center">
          <Music size={48} className="mx-auto mb-4 text-cyan-400" />
          <h3 className="text-xl font-semibold text-cyan-400 mb-2">Ready to Rehearse?</h3>
          <p className="text-gray-400 mb-6">
            This is your first practice session together. See how the band performs as a unit.
          </p>
          <button
            onClick={handleStartRehearsal}
            className="px-8 py-3 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 transition-colors flex items-center gap-2 mx-auto"
          >
            <Play size={20} />
            Start Rehearsal
          </button>
        </div>
      ) : !rehearsalComplete ? (
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-cyan-500/20 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
            <span className="text-cyan-400">Rehearsal in progress...</span>
          </div>
          <p className="text-gray-400">The band is practicing together for the first time.</p>
        </div>
      ) : (
        <div className="bg-[#1a1a1a] p-6 rounded-lg border border-green-500/30">
          <div className="flex items-center gap-3 mb-4">
            <Check size={24} className="text-green-400" />
            <h3 className="text-xl font-semibold text-green-400">Rehearsal Complete!</h3>
          </div>
          
          {/* Rehearsal Notes */}
          {rehearsalNotes.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-cyan-400">Rehearsal Notes</h4>
              <ul className="space-y-2">
                {rehearsalNotes.map((note, idx) => (
                  <li key={idx} className="text-gray-300 flex items-start gap-2">
                    <span className="text-cyan-400 mt-1">•</span>
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded">
            <p className="text-green-400 font-semibold">
              ✓ Your band is ready to start their journey!
            </p>
            <p className="text-sm text-gray-400 mt-2">
              You can now customize instruments, write songs, and book gigs.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-6 border-t border-cyan-500/20">
        <button
          onClick={onBack}
          disabled={rehearsalStarted}
          className={`
            px-6 py-3 rounded-lg transition-colors flex items-center gap-2
            ${rehearsalStarted
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }
          `}
        >
          <ArrowLeft size={18} />
          Back to Chemistry Check
        </button>
        <button
          onClick={handleComplete}
          disabled={!rehearsalComplete}
          className={`
            px-8 py-3 rounded-lg font-semibold text-lg transition-all flex items-center gap-2
            ${rehearsalComplete
              ? 'bg-cyan-500 text-black hover:bg-cyan-400'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <Check size={20} />
          Start Your Journey
        </button>
      </div>
    </div>
  );
};

/**
 * Generate rehearsal notes
 */
function generateRehearsalNotes(band) {
  const notes = [];
  const avgSkill = band.reduce((sum, m) => sum + (m.skill || 50), 0) / band.length;
  const avgChemistry = 75; // Would calculate from chemistry check

  if (avgSkill > 70) {
    notes.push('Band shows strong technical ability');
  } else if (avgSkill < 50) {
    notes.push('Band needs more practice to improve');
  }

  if (avgChemistry > 75) {
    notes.push('Great chemistry and communication');
  }

  if (band.length >= 4) {
    notes.push('Good band size for dynamic performances');
  }

  notes.push('First rehearsal complete - ready for more practice');
  notes.push('Band members are getting comfortable with each other');

  return notes;
}
