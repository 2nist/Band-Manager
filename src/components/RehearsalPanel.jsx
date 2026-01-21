/**
 * RehearsalPanel - Interactive band rehearsal system
 * 
 * Allows players to rehearse with their current band members
 * and hear how their skills affect music playback in real-time.
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Music, Play, Pause, Square, Users, Volume2 } from 'lucide-react';
import { ToneRenderer } from '../music/renderers/ToneRenderer.js';
import { MusicGenerator } from '../music/MusicGenerator.js';
import { getSkillDescription, ROLE_TRAITS } from '../utils/memberSkillTraits.js';
import { getAvatarUrl } from '../utils/helpers.js';

export const RehearsalPanel = ({ gameState, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState('rock');
  
  const rendererRef = useRef(null);
  const testSongRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const genres = ['rock', 'punk', 'metal', 'funk', 'folk', 'jazz', 'pop'];

  /**
   * Generate test song with current band members
   */
  const handleGenerateSong = useCallback(async () => {
    setIsGenerating(true);
    setCurrentTime(0);
    try {
      // Ensure gameState has bandMembers
      const fullGameState = {
        ...gameState,
        bandMembers: gameState.bandMembers || gameState.members || [],
        bandName: gameState.bandName || 'Your Band',
        currentWeek: gameState.currentWeek || gameState.week || 1
      };

      const song = await MusicGenerator.generateSong(fullGameState, selectedGenre, {
        songName: `${fullGameState.bandName} - Rehearsal`,
        seed: `rehearsal-${Date.now()}`
      });

      testSongRef.current = song;
      
      // Initialize renderer if needed
      if (!rendererRef.current) {
        rendererRef.current = new ToneRenderer();
        await rendererRef.current.initialize(song);
      }
      
      // Render the song
      const renderResult = await rendererRef.current.render(song);
      setDuration(renderResult.duration || 32); // Default to 32 seconds if not provided
      
    } catch (error) {
      console.error('Failed to generate rehearsal song:', error);
      alert('Failed to generate song. Check console for details.');
    } finally {
      setIsGenerating(false);
    }
  }, [gameState, selectedGenre]);

  /**
   * Play/pause rehearsal
   */
  const handlePlayPause = useCallback(async () => {
    if (!rendererRef.current || !testSongRef.current) {
      await handleGenerateSong();
      // Wait a moment for generation to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      if (!testSongRef.current) return;
    }

    if (isPlaying) {
      rendererRef.current.pause();
      setIsPlaying(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    } else {
      try {
        await rendererRef.current.play();
        setIsPlaying(true);
        
        // Track progress using Tone.Transport
        progressIntervalRef.current = setInterval(() => {
          if (window.Tone?.Transport) {
            const transportTime = window.Tone.Transport.seconds;
            setCurrentTime(transportTime);
            
            // Stop if we've reached the end
            if (duration > 0 && transportTime >= duration) {
              handleStop();
            }
          }
        }, 100);
      } catch (error) {
        console.error('Failed to play:', error);
        setIsPlaying(false);
      }
    }
  }, [isPlaying, handleGenerateSong, duration]);

  /**
   * Stop playback
   */
  const handleStop = useCallback(() => {
    if (rendererRef.current) {
      rendererRef.current.stop();
      setIsPlaying(false);
      setCurrentTime(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  }, []);

  /**
   * Format time display
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (rendererRef.current) {
        rendererRef.current.stop();
        rendererRef.current.dispose();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const bandMembers = gameState.bandMembers || gameState.members || [];

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#0a0a0a',
      border: '1px solid #333',
      borderRadius: '8px',
      color: '#fff',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#0ff' }}>🎵 Band Rehearsal</h2>
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
          ✕
        </button>
      </div>

      {/* Band Members Overview */}
      {bandMembers.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#111', borderRadius: '4px' }}>
          <h3 style={{ color: '#0ff', marginBottom: '10px' }}>Current Band Members:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {bandMembers.map(member => {
              const roleTraits = ROLE_TRAITS[member.role] || {};
              const traits = member.traits || {};
              
              return (
                <div key={member.id} style={{ padding: '10px', backgroundColor: '#0a0a0a', borderRadius: '4px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img
                    src={getAvatarUrl(member.name, 'open-peeps')}
                    alt={member.name}
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '50%',
                      border: '2px solid #0ff',
                      flexShrink: 0
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', color: '#0ff', marginBottom: '5px' }}>
                      {member.name}
                    </div>
                  <div style={{ fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                    {member.role}
                  </div>
                  {Object.keys(traits).length > 0 && (
                    <div style={{ fontSize: '0.75em', color: '#666' }}>
                      {Object.entries(traits).slice(0, 2).map(([trait, value]) => (
                        <div key={trait} style={{ marginTop: '3px' }}>
                          {trait}: {value}/100
                        </div>
                      ))}
                    </div>
                  )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Genre Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', color: '#888' }}>
          Rehearsal Genre:
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => {
                setSelectedGenre(genre);
                handleStop();
              }}
              style={{
                padding: '8px 15px',
                backgroundColor: selectedGenre === genre ? '#0ff' : '#222',
                color: selectedGenre === genre ? '#000' : '#fff',
                border: '1px solid #0ff',
                borderRadius: '4px',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontWeight: selectedGenre === genre ? 'bold' : 'normal'
              }}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Playback Controls */}
      <div style={{
        padding: '20px',
        backgroundColor: '#1a1a2e',
        border: '2px solid #0ff',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#0ff' }}>Rehearsal Playback</h3>
        
        <p style={{ fontSize: '0.85em', color: '#888', marginBottom: '15px' }}>
          Hear how your band members' skills affect the music. Notice timing, dynamics, and precision differences.
        </p>

        {/* Song Status */}
        {testSongRef.current && (
          <div style={{
            padding: '10px',
            backgroundColor: '#0a0a0a',
            borderRadius: '4px',
            marginBottom: '15px',
            border: '1px solid #0f0',
            color: '#0f0',
            fontSize: '0.85em'
          }}>
            ✓ Song ready: {testSongRef.current.metadata?.name || 'Rehearsal Song'}
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
          <button
            onClick={handleGenerateSong}
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
            {isGenerating ? 'Generating...' : 'Generate Song'}
          </button>
          
          <button
            onClick={handlePlayPause}
            disabled={isGenerating}
            style={{
              padding: '12px 20px',
              backgroundColor: isGenerating || (!testSongRef.current && !isPlaying) ? '#666' : '#0f0',
              color: isGenerating || (!testSongRef.current && !isPlaying) ? '#999' : '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: isGenerating ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            {isGenerating ? 'Generating...' : isPlaying ? 'Pause' : 'Play'}
          </button>
          
          <button
            onClick={handleStop}
            style={{
              padding: '12px 20px',
              backgroundColor: '#f00',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Square size={18} />
            Stop
          </button>

          {/* Time Display */}
          <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '0.9em' }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          height: '6px',
          backgroundColor: '#222',
          borderRadius: '3px',
          overflow: 'hidden',
          marginBottom: '15px'
        }}>
          <div
            style={{
              height: '100%',
              backgroundColor: '#0f0',
              width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
              transition: 'width 0.1s linear'
            }}
          />
        </div>

        {/* Skill Effects Notice */}
        {bandMembers.some(m => m.traits) && (
          <div style={{
            padding: '10px',
            backgroundColor: '#0a0a0a',
            borderRadius: '4px',
            fontSize: '0.85em',
            color: '#888'
          }}>
            <strong style={{ color: '#0ff' }}>Notice:</strong> Member skill traits are affecting playback:
            <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
              {bandMembers.filter(m => m.traits).map(member => {
                const traits = member.traits;
                const issues = [];
                if (traits.timing < 50) issues.push(`${member.name} has poor timing`);
                if (traits.dynamics < 30) issues.push(`${member.name} has no dynamics`);
                if (traits.precision < 50) issues.push(`${member.name} plays sloppily`);
                return issues.length > 0 ? (
                  <li key={member.id} style={{ color: '#f00' }}>
                    {issues.join(', ')}
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        )}
      </div>

      {bandMembers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <Users size={48} style={{ opacity: 0.3, marginBottom: '10px' }} />
          <p>No band members to rehearse with. Recruit members first!</p>
        </div>
      )}
    </div>
  );
};
