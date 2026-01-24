/**
 * EnhancedBandFormation - Multi-phase band formation system
 * 
 * Flow: Auditions → Assembly → Chemistry Check → First Rehearsal
 */

import React, { useState, useEffect } from 'react';
import { generateCompleteAuditionPool } from '../../utils/proceduralMusicianGenerator.js';
import { AuditionPhase } from './AuditionPhase.jsx';
import { AssemblyPhase } from './AssemblyPhase.jsx';
import { ChemistryCheck } from './ChemistryCheck.jsx';
import { FirstRehearsal } from './FirstRehearsal.jsx';

export const EnhancedBandFormation = ({
  gameState,
  onComplete,
  onBack
}) => {
  const [phase, setPhase] = useState('auditions');
  const [auditionPool, setAuditionPool] = useState({});
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [finalBand, setFinalBand] = useState([]);
  // Use band name from gameState (already set in LandingPage/LogoDesigner)
  const [bandName, setBandName] = useState(gameState?.state?.bandName || '');
  const [bandLogo, setBandLogo] = useState(gameState?.state?.logo || null);

  const location = gameState?.state?.location || 'Unknown City';
  const genre = gameState?.state?.genre || 'Rock';
  const budget = gameState?.state?.money || 1000;

  // Generate audition pool on mount
  useEffect(() => {
    const pool = generateCompleteAuditionPool(location, genre, budget);
    setAuditionPool(pool);
  }, [location, genre, budget]);

  const handleCandidateSelect = (candidate) => {
    if (!selectedCandidates.find(c => c.id === candidate.id)) {
      setSelectedCandidates(prev => [...prev, candidate]);
    }
  };

  const handleCandidateRemove = (candidateId) => {
    setSelectedCandidates(prev => prev.filter(c => c.id !== candidateId));
  };

  const handleFormBand = (band, name, logo) => {
    setFinalBand(band);
    setBandName(name);
    setBandLogo(logo);
    setPhase('chemistry');
  };

  const handleChemistryComplete = () => {
    setPhase('rehearsal');
  };

  const handleRehearsalComplete = () => {
    // Finalize band and advance to game
    if (onComplete) {
      onComplete(finalBand, bandName, bandLogo);
    }
  };

  return (
    <div className="enhanced-band-formation min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      {/* Phase Progress Indicator */}
      <div className="phase-progress p-4 bg-[#1a1a1a] border-b border-cyan-500/20">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {['auditions', 'assembly', 'chemistry', 'rehearsal'].map((p, idx) => (
            <React.Fragment key={p}>
              <div className={`
                flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all
                ${phase === p 
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' 
                  : phaseIndex(phase) > idx
                    ? 'border-green-500/50 bg-green-500/5 text-green-400'
                    : 'border-gray-700 bg-gray-800/50 text-gray-500'
                }
              `}>
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${phase === p 
                    ? 'bg-cyan-500 text-black' 
                    : phaseIndex(phase) > idx
                      ? 'bg-green-500 text-black'
                      : 'bg-gray-700 text-gray-400'
                  }
                `}>
                  {phaseIndex(phase) > idx ? '✓' : idx + 1}
                </div>
                <div className="text-xs font-medium">{getPhaseName(p)}</div>
              </div>
              {idx < 3 && (
                <div className={`
                  h-1 w-8 transition-colors
                  ${phaseIndex(phase) > idx ? 'bg-green-500' : 'bg-gray-700'}
                `} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Phase Content */}
      <div className="phase-content p-6">
        {phase === 'auditions' && (
          <AuditionPhase
            pool={auditionPool}
            selectedCandidates={selectedCandidates}
            onSelect={handleCandidateSelect}
            onRemove={handleCandidateRemove}
            onComplete={() => {
              if (selectedCandidates.length >= 2) {
                setPhase('assembly');
              } else {
                alert('Select at least 2 candidates to continue');
              }
            }}
            gameState={gameState}
          />
        )}

        {phase === 'assembly' && (
          <AssemblyPhase
            candidates={selectedCandidates}
            onFormBand={handleFormBand}
            onBack={() => setPhase('auditions')}
            gameState={gameState}
          />
        )}

        {phase === 'chemistry' && (
          <ChemistryCheck
            band={finalBand}
            bandName={bandName}
            onComplete={handleChemistryComplete}
            onBack={() => setPhase('assembly')}
          />
        )}

        {phase === 'rehearsal' && (
          <FirstRehearsal
            band={finalBand}
            bandName={bandName}
            onComplete={handleRehearsalComplete}
            onBack={() => setPhase('chemistry')}
            gameState={gameState}
          />
        )}
      </div>
    </div>
  );
};

function phaseIndex(phase) {
  const phases = ['auditions', 'assembly', 'chemistry', 'rehearsal'];
  return phases.indexOf(phase);
}

function getPhaseName(phase) {
  const names = {
    auditions: 'Auditions',
    assembly: 'Assembly',
    chemistry: 'Chemistry',
    rehearsal: 'First Rehearsal'
  };
  return names[phase] || phase;
}

export default EnhancedBandFormation;
