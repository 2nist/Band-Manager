/**
 * AuditionPanel - Interactive band member audition system
 * 
 * Allows players to audition candidates and hear how their skills
 * affect music playback in real-time.
 */

import React, { useState, useCallback, useRef } from 'react';
import { Music, Play, Pause, Users, X, Check, AlertCircle } from 'lucide-react';
import { generateAuditionCandidate, getSkillDescription, ROLE_TRAITS } from '../utils/memberSkillTraits.js';
import { ToneRenderer } from '../music/renderers/ToneRenderer.js';
import { MusicGenerator } from '../music/MusicGenerator.js';

const ROLES = [
  { id: 'drummer', name: '🥁 Drummer' },
  { id: 'guitarist', name: '🎸 Guitarist' },
  { id: 'lead-guitar', name: '🎸 Lead Guitar' },
  { id: 'rhythm-guitar', name: '🎸 Rhythm Guitar' },
  { id: 'bassist', name: '🎸 Bassist' },
  { id: 'vocalist', name: '🎤 Vocalist' },
  { id: 'keyboardist', name: '🎹 Keyboardist' }
];

export const AuditionPanel = ({ gameState, onHireMember, onClose }) => {
  const [selectedRole, setSelectedRole] = useState('drummer');
  const [candidates, setCandidates] = useState([]);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const rendererRef = useRef(null);
  const testSongRef = useRef(null);

  /**
   * Generate audition candidates for selected role
   */
  const handleGenerateCandidates = useCallback(() => {
    const newCandidates = Array.from({ length: 3 }, (_, i) => 
      generateAuditionCandidate(selectedRole, {
        skillRange: [30, 90],
        seed: Date.now() + i
      })
    );
    setCandidates(newCandidates);
    setCurrentCandidate(null);
  }, [selectedRole]);

  /**
   * Select candidate for audition
   */
  const handleSelectCandidate = useCallback((candidate) => {
    setCurrentCandidate(candidate);
    setIsPlaying(false);
    if (rendererRef.current) {
      rendererRef.current.stop();
    }
  }, []);

  /**
   * Generate test song with candidate's skills
   */
  const handleGenerateTestSong = useCallback(async () => {
    if (!currentCandidate) return;
    
    setIsGenerating(true);
    try {
      // Create mock game state with candidate's skills
      const mockGameState = {
        ...gameState,
        bandName: 'Test Band',
        currentWeek: gameState.week || 1,
        week: gameState.week || 1,
        bandMembers: [{
          id: currentCandidate.id,
          name: currentCandidate.name,
          role: currentCandidate.role,
          skill: currentCandidate.overallSkill,
          traits: currentCandidate.traits
        }],
        gearTier: 1,
        studioTier: 1
      };

      // Generate a short test song
      const song = await MusicGenerator.generateSong(mockGameState, 'rock', {
        songName: `${currentCandidate.name} Audition`,
        seed: `audition-${currentCandidate.id}`
      });

      testSongRef.current = song;
      
      // Initialize renderer with member skills
      if (!rendererRef.current) {
        rendererRef.current = new ToneRenderer();
      }
      
      await rendererRef.current.render(song);
      
    } catch (error) {
      console.error('Failed to generate test song:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [currentCandidate, gameState]);

  /**
   * Play/pause audition
   */
  const handlePlayPause = useCallback(async () => {
    if (!rendererRef.current || !testSongRef.current) {
      await handleGenerateTestSong();
      return;
    }

    if (isPlaying) {
      rendererRef.current.pause();
      setIsPlaying(false);
    } else {
      await rendererRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying, handleGenerateTestSong]);

  /**
   * Stop playback
   */
  const handleStop = useCallback(() => {
    if (rendererRef.current) {
      rendererRef.current.stop();
      setIsPlaying(false);
    }
  }, []);

  /**
   * Hire selected candidate
   */
  const handleHire = useCallback(() => {
    if (!currentCandidate) return;
    
    const member = {
      id: currentCandidate.id,
      name: currentCandidate.name,
      role: currentCandidate.role,
      skill: currentCandidate.overallSkill,
      traits: currentCandidate.traits,
      morale: 75,
      energy: 100
    };
    
    if (onHireMember) {
      onHireMember(member);
    }
    
    // Remove from candidates
    setCandidates(prev => prev.filter(c => c.id !== currentCandidate.id));
    setCurrentCandidate(null);
    handleStop();
  }, [currentCandidate, onHireMember, handleStop]);

  /**
   * Cleanup on unmount
   */
  React.useEffect(() => {
    return () => {
      if (rendererRef.current) {
        rendererRef.current.stop();
        rendererRef.current.dispose();
      }
    };
  }, []);

  const roleTraits = ROLE_TRAITS[currentCandidate?.role] || {};

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#0a0a0a',
      border: '1px solid #333',
      borderRadius: '8px',
      color: '#fff',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#0ff' }}>🎤 Member Auditions</h2>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '1px solid #666',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Role Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', color: '#888' }}>
          Select Role to Audition:
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {ROLES.map(role => (
            <button
              key={role.id}
              onClick={() => {
                setSelectedRole(role.id);
                setCandidates([]);
                setCurrentCandidate(null);
              }}
              style={{
                padding: '10px 15px',
                backgroundColor: selectedRole === role.id ? '#0ff' : '#222',
                color: selectedRole === role.id ? '#000' : '#fff',
                border: '1px solid #0ff',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: selectedRole === role.id ? 'bold' : 'normal'
              }}
            >
              {role.name}
            </button>
          ))}
        </div>
      </div>

      {/* Generate Candidates */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleGenerateCandidates}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0f0',
            color: '#000',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          <Users size={18} style={{ marginRight: '8px', display: 'inline' }} />
          Generate Candidates
        </button>
      </div>

      {/* Candidates List */}
      {candidates.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#0ff', marginBottom: '10px' }}>Candidates:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {candidates.map(candidate => (
              <div
                key={candidate.id}
                onClick={() => handleSelectCandidate(candidate)}
                style={{
                  padding: '15px',
                  backgroundColor: currentCandidate?.id === candidate.id ? '#1a1a2e' : '#111',
                  border: `2px solid ${currentCandidate?.id === candidate.id ? '#0ff' : '#333'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', color: '#0ff' }}>{candidate.name}</h4>
                    <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#888' }}>
                      Overall Skill: {candidate.overallSkill}/100
                    </p>
                    {candidate.strengths.length > 0 && (
                      <p style={{ margin: '5px 0', fontSize: '0.85em', color: '#0f0' }}>
                        Strengths: {candidate.strengths.join(', ')}
                      </p>
                    )}
                    {candidate.quirks.length > 0 && (
                      <p style={{ margin: '5px 0', fontSize: '0.85em', color: '#f00' }}>
                        Issues: {candidate.quirks.join(', ')}
                      </p>
                    )}
                  </div>
                  {currentCandidate?.id === candidate.id && (
                    <Check size={24} color="#0ff" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Candidate Details & Playback */}
      {currentCandidate && (
        <div style={{
          padding: '20px',
          backgroundColor: '#1a1a2e',
          border: '2px solid #0ff',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#0ff' }}>
            Auditioning: {currentCandidate.name}
          </h3>

          {/* Skill Traits */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#fff', marginBottom: '10px' }}>Skill Traits:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {Object.entries(currentCandidate.traits).map(([trait, value]) => {
                const traitDef = roleTraits[trait];
                const description = traitDef?.description || trait;
                const skillDesc = getSkillDescription(trait, value);
                const color = value >= 70 ? '#0f0' : value >= 50 ? '#ff0' : '#f00';
                
                return (
                  <div key={trait} style={{ padding: '10px', backgroundColor: '#0a0a0a', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ color: '#888', fontSize: '0.9em' }}>{description}:</span>
                      <span style={{ color, fontWeight: 'bold' }}>{value}/100</span>
                    </div>
                    <div style={{
                      height: '6px',
                      backgroundColor: '#222',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${value}%`,
                        backgroundColor: color,
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <div style={{ fontSize: '0.8em', color: '#666', marginTop: '3px' }}>
                      {skillDesc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Playback Controls */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#fff', marginBottom: '10px' }}>Test Playback:</h4>
            <p style={{ fontSize: '0.85em', color: '#888', marginBottom: '15px' }}>
              Hear how {currentCandidate.name}'s skills affect the music. 
              {currentCandidate.quirks.length > 0 && (
                <span style={{ color: '#f00' }}>
                  {' '}Notice: {currentCandidate.quirks.join(', ').toLowerCase()}
                </span>
              )}
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleGenerateTestSong}
                disabled={isGenerating}
                style={{
                  padding: '10px 15px',
                  backgroundColor: isGenerating ? '#666' : '#444',
                  color: '#fff',
                  border: '1px solid #666',
                  borderRadius: '4px',
                  cursor: isGenerating ? 'not-allowed' : 'pointer'
                }}
              >
                {isGenerating ? 'Generating...' : 'Generate Test Song'}
              </button>
              <button
                onClick={handlePlayPause}
                disabled={!testSongRef.current && !isGenerating}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#0f0',
                  color: '#000',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button
                onClick={handleStop}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#f00',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Stop
              </button>
            </div>
          </div>

          {/* Hire Button */}
          <button
            onClick={handleHire}
            style={{
              padding: '12px 24px',
              backgroundColor: '#0ff',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '1em',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Check size={20} />
            Hire {currentCandidate.name}
          </button>
        </div>
      )}

      {candidates.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <Users size={48} style={{ opacity: 0.3, marginBottom: '10px' }} />
          <p>Click "Generate Candidates" to start auditioning</p>
        </div>
      )}
    </div>
  );
};
