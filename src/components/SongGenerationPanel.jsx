/**
 * SongGenerationPanel - In-game interface for song generation
 * 
 * Allows player to generate songs with choice of genre and style
 */

import React, { useState, useMemo } from 'react';
import { Music, Loader, AlertCircle } from 'lucide-react';
import { getGenreProfile } from '../music/profiles/GENRE_AUDIO_PROFILES.js';

export const SongGenerationPanel = ({ 
  gameState, 
  onSongGenerated,
  disabled = false,
  cost = 500
}) => {
  const [selectedGenre, setSelectedGenre] = useState('rock');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const genres = [
    { value: 'rock', label: 'Rock', description: 'Classic guitar-driven sound' },
    { value: 'punk', label: 'Punk', description: 'Fast, aggressive, energetic' },
    { value: 'funk', label: 'Funk', description: 'Groovy, soulful, rhythmic' },
    { value: 'metal', label: 'Metal', description: 'Heavy, intense, dark' },
    { value: 'folk', label: 'Folk', description: 'Acoustic, storytelling, intimate' },
    { value: 'jazz', label: 'Jazz', description: 'Complex, improvisational, sophisticated' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Call the callback with genre - parent component will handle generation
      if (onSongGenerated) {
        await onSongGenerated(selectedGenre);
      }
    } catch (err) {
      setError(err.message);
      console.error('Song generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Check if band can generate (no skill requirement - anyone can write songs)
  const bandSkill = gameState.bandMembers?.reduce((sum, m) => sum + (m.skill || 50), 0) / (gameState.bandMembers?.length || 1) || 50;
  const hasRequiredMoney = gameState.money >= cost;

  const canGenerate = hasRequiredMoney && !disabled && !isGenerating;
  
  // Get genre profile for skill predictions
  const genreProfile = useMemo(() => getGenreProfile(selectedGenre), [selectedGenre]);
  
  // Calculate expected performance impact for each member
  const memberPerformancePredictions = useMemo(() => {
    if (!gameState.bandMembers) return [];
    
    return gameState.bandMembers.map(member => {
      const role = member.role || member.type || member.instrument;
      const genreConfig = genreProfile[role] || {};
      const requiredPrecision = genreConfig.timing_precision || 0.8;
      const memberPrecision = (member.skill || 50) / 100;
      
      return {
        member,
        role,
        timingPrecision: Math.round((member.skill * 0.6 + (member.reliability || 50) * 0.4)),
        noteAccuracy: member.skill || 50,
        creativeInput: member.creativity || 50,
        genreMatch: Math.min(100, Math.round((memberPrecision / requiredPrecision) * 100)),
        expectedQuality: Math.round(
          (member.skill * 0.4 + (member.reliability || 50) * 0.3 + (member.morale || 50) * 0.3)
        )
      };
    });
  }, [gameState.bandMembers, genreProfile]);

  return (
    <div style={{
      backgroundColor: '#1a1a1a',
      border: '2px solid #0ff',
      borderRadius: '8px',
      padding: '20px',
      color: '#fff'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
        <Music size={24} color='#0ff' />
        <h2 style={{ margin: 0, color: '#0ff' }}>Create New Song</h2>
      </div>

      {/* Status Checks */}
      <div style={{ marginBottom: '15px', fontSize: '0.9em' }}>
        {!hasRequiredMoney && (
          <div style={{ color: '#f00', marginBottom: '5px' }}>
            ❌ Insufficient studio time budget (minimum ${cost}, you have ${gameState.money})
          </div>
        )}
        {hasRequiredMoney && (
          <div style={{ color: '#0f0', marginBottom: '5px' }}>
            ✅ Ready to record (Band skill: {Math.round(bandSkill)}/100)
          </div>
        )}
      </div>

      {/* Member Skill Impact Preview */}
      {gameState.bandMembers && gameState.bandMembers.length > 0 && (
        <div style={{ 
          marginBottom: '15px', 
          padding: '12px',
          backgroundColor: 'rgba(0, 255, 255, 0.05)',
          border: '1px solid rgba(0, 255, 255, 0.2)',
          borderRadius: '4px'
        }}>
          <div style={{ 
            fontSize: '0.85em', 
            fontWeight: 'bold', 
            color: '#0ff', 
            marginBottom: '10px' 
          }}>
            Expected Performance Impact ({selectedGenre.toUpperCase()})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {memberPerformancePredictions.map((pred, idx) => (
              <div 
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8em',
                  padding: '6px',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '3px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', color: '#fff' }}>
                    {pred.member.firstName || pred.member.name || pred.role} ({pred.role})
                  </div>
                  <div style={{ fontSize: '0.75em', color: '#aaa', marginTop: '2px' }}>
                    Timing: {pred.timingPrecision}% • Accuracy: {pred.noteAccuracy}% • Genre Match: {pred.genreMatch}%
                  </div>
                </div>
                <div style={{ 
                  padding: '4px 8px',
                  borderRadius: '3px',
                  backgroundColor: pred.expectedQuality >= 70 ? 'rgba(0, 255, 0, 0.2)' : 
                                   pred.expectedQuality >= 50 ? 'rgba(255, 255, 0, 0.2)' : 
                                   'rgba(255, 0, 0, 0.2)',
                  color: pred.expectedQuality >= 70 ? '#0f0' : 
                         pred.expectedQuality >= 50 ? '#ff0' : '#f00',
                  fontWeight: 'bold',
                  fontSize: '0.9em'
                }}>
                  {pred.expectedQuality}%
                </div>
              </div>
            ))}
          </div>
          <div style={{ 
            marginTop: '10px', 
            fontSize: '0.75em', 
            color: '#888',
            fontStyle: 'italic'
          }}>
            * Performance quality reflects skill, reliability, and morale. Genre match shows how well 
            member skills align with {selectedGenre} requirements.
          </div>
        </div>
      )}

      {/* Genre Selection */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9em', color: '#0ff' }}>
          CHOOSE GENRE
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '10px'
        }}>
          {genres.map(genre => (
            <button
              key={genre.value}
              onClick={() => setSelectedGenre(genre.value)}
              disabled={!canGenerate}
              style={{
                padding: '12px',
                backgroundColor: selectedGenre === genre.value ? 'rgba(0, 255, 255, 0.2)' : '#222',
                border: `2px solid ${selectedGenre === genre.value ? '#0ff' : '#444'}`,
                borderRadius: '4px',
                color: selectedGenre === genre.value ? '#0ff' : '#888',
                cursor: canGenerate ? 'pointer' : 'not-allowed',
                fontWeight: selectedGenre === genre.value ? 'bold' : 'normal',
                opacity: canGenerate ? 1 : 0.5,
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontWeight: 'bold' }}>{genre.label}</div>
              <div style={{ fontSize: '0.75em', marginTop: '5px', opacity: 0.7 }}>
                {genre.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          border: '1px solid #f00',
          borderRadius: '4px',
          padding: '10px',
          marginBottom: '15px',
          color: '#ff8888',
          display: 'flex',
          gap: '10px'
        }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <div>{error}</div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={!canGenerate}
        style={{
          width: '100%',
          padding: '15px',
          backgroundColor: canGenerate ? '#0ff' : '#444',
          color: canGenerate ? '#000' : '#888',
          border: 'none',
          borderRadius: '4px',
          fontSize: '1em',
          fontWeight: 'bold',
          cursor: canGenerate ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          transition: 'all 0.2s',
          opacity: canGenerate ? 1 : 0.5
        }}
      >
        {isGenerating ? (
          <>
            <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
            Recording in studio...
          </>
        ) : (
          <>
            <Music size={20} />
            Record Song (Cost: ${cost} Studio Time)
          </>
        )}
      </button>

      {/* Info Text */}
      <p style={{ marginTop: '15px', fontSize: '0.85em', color: '#666' }}>
        Studio time is required to record high-quality tracks. Your band's skill and 
        psychological state will influence the generated song's quality and originality.
      </p>
    </div>
  );
};

export default SongGenerationPanel;
