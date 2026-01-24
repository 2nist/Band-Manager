/**
 * SongPlaybackPanel - In-game playback and fan reaction display
 * 
 * Shows song analysis, fan reactions, and gameplay impact
 */

import React, { useEffect, useState } from 'react';
import { Play, Pause, Square, Download, Share2, TrendingUp } from 'lucide-react';
import TrackPlayer from './TrackPlayer';
import { FanReactionSystem } from '../music/FanReactionSystem';

export const SongPlaybackPanel = ({ 
  song,
  gameState,
  onApplyGameEffects,
  onAccept,
  onExport
}) => {
  const [reactionData, setReactionData] = useState(null);
  const [showReactions, setShowReactions] = useState(true);

  // Generate reactions when song loads
  useEffect(() => {
    if (song && gameState) {
      const reactions = FanReactionSystem.generateReactions(
        song,
        gameState.fanbase,
        gameState.psychologicalState || gameState.psychState,
        gameState
      );
      setReactionData(reactions);

      // Apply game effects automatically
      if (onApplyGameEffects && reactions.impact) {
        onApplyGameEffects(reactions.impact);
      }
    }
  }, [song, gameState, onApplyGameEffects]);

  if (!song) {
    return (
      <div style={{ padding: '20px', color: '#888' }}>
        No song to display
      </div>
    );
  }

  const { reactions, impact } = reactionData || {};
  const analysis = song.analysis || {};
  const enhanced = song.enhanced || {};
  const skillInfluence = enhanced.skillInfluence || {};
  const genreAuthenticity = enhanced.genreAuthenticity || 0;
  const performanceQuality = enhanced.performanceQuality || 0;

  return (
    <div style={{
      backgroundColor: '#0a0a0a',
      border: '1px solid #333',
      borderRadius: '8px',
      color: '#fff'
    }}>
      {/* Song Info Header */}
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '15px',
        borderBottom: '1px solid #333',
        borderRadius: '8px 8px 0 0'
      }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#0ff' }}>
          {song.metadata?.name || song.title || song.name || 'Untitled Track'}
        </h2>
        <p style={{ margin: '5px 0', color: '#888', fontSize: '0.9em' }}>
          {song.metadata?.band || gameState?.bandName || 'Your Band'} • {song.composition?.genre || song.genre || 'Unknown'} • {song.composition?.tempo || '120'} BPM
        </p>
      </div>

      {/* Player */}
      <div style={{ padding: '15px', borderBottom: '1px solid #333' }}>
        <TrackPlayer song={song} onExport={onExport} />
      </div>

      {/* Analysis Metrics */}
      <div style={{
        padding: '15px',
        borderBottom: '1px solid #333',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '15px'
      }}>
        {/* Quality Score */}
        <div style={{
          backgroundColor: 'rgba(0, 255, 255, 0.05)',
          border: '1px solid #0ff',
          borderRadius: '4px',
          padding: '12px'
        }}>
          <div style={{ fontSize: '0.85em', color: '#0ff' }}>QUALITY</div>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#0ff' }}>
            {Math.round(analysis.qualityScore || song.quality || 50)}
          </div>
          <div style={{ fontSize: '0.75em', color: '#666', marginTop: '5px' }}>
            Production & performance
          </div>
        </div>

        {/* Originality Score */}
        <div style={{
          backgroundColor: 'rgba(0, 255, 0, 0.05)',
          border: '1px solid #0f0',
          borderRadius: '4px',
          padding: '12px'
        }}>
          <div style={{ fontSize: '0.85em', color: '#0f0' }}>ORIGINALITY</div>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#0f0' }}>
            {Math.round(analysis.originalityScore || song.originality || 50)}
          </div>
          <div style={{ fontSize: '0.75em', color: '#666', marginTop: '5px' }}>
            Freshness & innovation
          </div>
        </div>

        {/* Commercial Viability */}
        <div style={{
          backgroundColor: 'rgba(255, 150, 0, 0.05)',
          border: '1px solid #ff9600',
          borderRadius: '4px',
          padding: '12px'
        }}>
          <div style={{ fontSize: '0.85em', color: '#ff9600' }}>COMMERCIAL</div>
          <div style={{ fontSize: '2em', fontWeight: 'bold', color: '#ff9600' }}>
            {Math.round(analysis.commercialViability || song.commercial || 50)}
          </div>
          <div style={{ fontSize: '0.75em', color: '#666', marginTop: '5px' }}>
            Radio/chart potential
          </div>
        </div>
      </div>

      {/* Enhanced Skill & Genre Data */}
      {enhanced && Object.keys(enhanced).length > 0 && (
        <div style={{
          padding: '15px',
          borderBottom: '1px solid #333',
          backgroundColor: 'rgba(0, 255, 255, 0.02)'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#0ff', fontSize: '1em' }}>
            Performance Analysis
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
            marginBottom: '10px'
          }}>
            {genreAuthenticity > 0 && (
              <div style={{
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
                border: '1px solid #0ff',
                borderRadius: '4px',
                padding: '10px'
              }}>
                <div style={{ fontSize: '0.85em', color: '#0ff' }}>Genre Authenticity</div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#0ff' }}>
                  {Math.round(genreAuthenticity * 100)}%
                </div>
                <div style={{ fontSize: '0.75em', color: '#666' }}>
                  How well skills match genre requirements
                </div>
              </div>
            )}
            
            {performanceQuality > 0 && (
              <div style={{
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
                border: '1px solid #0f0',
                borderRadius: '4px',
                padding: '10px'
              }}>
                <div style={{ fontSize: '0.85em', color: '#0f0' }}>Performance Quality</div>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#0f0' }}>
                  {Math.round(performanceQuality * 100)}%
                </div>
                <div style={{ fontSize: '0.75em', color: '#666' }}>
                  Overall band performance level
                </div>
              </div>
            )}
          </div>
          
          {skillInfluence && Object.keys(skillInfluence).length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <div style={{ fontSize: '0.85em', color: '#888', marginBottom: '8px' }}>
                Member Skill Impact:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {Object.entries(skillInfluence).map(([role, influence]) => (
                  <div 
                    key={role}
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      padding: '8px',
                      borderRadius: '4px',
                      fontSize: '0.8em'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </div>
                    <div style={{ color: '#aaa', fontSize: '0.85em' }}>
                      Timing: {Math.round((1 - influence.timing_impact) * 100)}% • 
                      Accuracy: {Math.round(influence.note_accuracy * 100)}% • 
                      Creativity: {Math.round(influence.creativity_factor * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fan Reactions */}
      {reactionData && showReactions && (
        <div style={{
          padding: '15px',
          borderBottom: '1px solid #333',
          backgroundColor: 'rgba(0, 255, 0, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <TrendingUp size={18} color='#0f0' />
            <h3 style={{ margin: 0, color: '#0f0' }}>Fan Reaction</h3>
          </div>

          {/* Overall Reaction */}
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '12px',
            borderLeft: '4px solid #0f0'
          }}>
            <p style={{ margin: 0, fontSize: '0.95em', lineHeight: '1.5' }}>
              {reactions.overall}
            </p>
          </div>

          {/* Feedback Points */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px'
          }}>
            {/* Quality Feedback */}
            <div>
              <div style={{ fontSize: '0.85em', color: '#0ff', marginBottom: '5px', fontWeight: 'bold' }}>
                Production
              </div>
              {reactions.quality.map((point, idx) => (
                <div key={idx} style={{ fontSize: '0.8em', color: '#888', marginBottom: '3px' }}>
                  {point}
                </div>
              ))}
            </div>

            {/* Originality Feedback */}
            <div>
              <div style={{ fontSize: '0.85em', color: '#0ff', marginBottom: '5px', fontWeight: 'bold' }}>
                Sound
              </div>
              {reactions.originality.map((point, idx) => (
                <div key={idx} style={{ fontSize: '0.8em', color: '#888', marginBottom: '3px' }}>
                  {point}
                </div>
              ))}
            </div>

            {/* Emotional Feedback */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '0.85em', color: '#0ff', marginBottom: '5px', fontWeight: 'bold' }}>
                Impact
              </div>
              {reactions.emotional.map((point, idx) => (
                <div key={idx} style={{ fontSize: '0.8em', color: '#888', marginBottom: '3px' }}>
                  {point}
                </div>
              ))}
            </div>
          </div>

          {/* Fan Quote */}
          <div style={{
            backgroundColor: '#222',
            padding: '10px',
            borderRadius: '4px',
            marginTop: '12px',
            borderLeft: `3px solid ${reactionData?.gritty ? '#dc2626' : '#0f0'}`,
            fontSize: '0.85em',
            fontStyle: 'italic',
            color: '#aaa'
          }}>
            "{reactions.fanSpecific}"
          </div>

          {/* Social Media Reactions (if gritty) */}
          {reactionData?.gritty && reactions.socialMedia && (
            <div style={{
              marginTop: '12px',
              padding: '12px',
              backgroundColor: 'rgba(220, 38, 38, 0.1)',
              borderRadius: '4px',
              border: '1px solid rgba(220, 38, 38, 0.3)'
            }}>
              <div style={{ fontSize: '0.85em', color: '#dc2626', marginBottom: '8px', fontWeight: 'bold' }}>
                Social Media Buzz
              </div>
              {reactions.socialMedia.tweets?.slice(0, 2).map((tweet, idx) => (
                <div key={idx} style={{
                  fontSize: '0.75em',
                  color: '#888',
                  marginBottom: '6px',
                  padding: '6px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '4px',
                  fontStyle: 'italic'
                }}>
                  "{tweet}"
                </div>
              ))}
              {reactions.socialMedia.controversial && (
                <div style={{
                  marginTop: '8px',
                  padding: '6px',
                  background: 'rgba(220, 38, 38, 0.2)',
                  borderRadius: '4px',
                  fontSize: '0.75em',
                  color: '#dc2626'
                }}>
                  ⚠️ Controversial - This is generating heated debate
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Game Impact */}
      {impact && (
        <div style={{
          padding: '15px',
          backgroundColor: 'rgba(255, 150, 0, 0.02)'
        }}>
          <h3 style={{ margin: '0 0 12px 0', color: '#ff9600' }}>
            Game Impact
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px'
          }}>
            {/* Fame Gain */}
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '10px',
              borderRadius: '4px',
              borderLeft: '3px solid #0f0'
            }}>
              <div style={{ fontSize: '0.8em', color: '#666' }}>FAME GAIN</div>
              <div style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#0f0' }}>
                +{impact.fameGain}
              </div>
            </div>

            {/* Money Gain */}
            <div style={{
              backgroundColor: '#1a1a1a',
              padding: '10px',
              borderRadius: '4px',
              borderLeft: '3px solid #0ff'
            }}>
              <div style={{ fontSize: '0.8em', color: '#666' }}>REVENUE</div>
              <div style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#0ff' }}>
                +${impact.moneyGain}
              </div>
            </div>

            {/* Obsession Change (if gritty) */}
            {reactionData?.gritty && impact.obsessionChange > 0 && (
              <div style={{
                backgroundColor: '#1a1a1a',
                padding: '10px',
                borderRadius: '4px',
                borderLeft: '3px solid #dc2626'
              }}>
                <div style={{ fontSize: '0.8em', color: '#666' }}>OBSESSION LEVEL</div>
                <div style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#dc2626' }}>
                  +{impact.obsessionChange}%
                </div>
              </div>
            )}

            {/* Controversy Level (if gritty) */}
            {reactionData?.gritty && impact.controversyLevel > 0 && (
              <div style={{
                backgroundColor: '#1a1a1a',
                padding: '10px',
                borderRadius: '4px',
                borderLeft: '3px solid #f59e0b'
              }}>
                <div style={{ fontSize: '0.8em', color: '#666' }}>CONTROVERSY</div>
                <div style={{ fontSize: '1.3em', fontWeight: 'bold', color: '#f59e0b' }}>
                  {impact.controversyLevel}%
                </div>
              </div>
            )}

            {/* Band Effects */}
            <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontSize: '0.8em', color: '#666', marginBottom: '8px' }}>
                BAND MORALE
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '8px'
              }}>
                {impact.psychologicalEffect.confidence_change !== 0 && (
                  <div style={{
                    fontSize: '0.75em',
                    color: impact.psychologicalEffect.confidence_change > 0 ? '#0f0' : '#f00'
                  }}>
                    Confidence {impact.psychologicalEffect.confidence_change > 0 ? '+' : ''}{Math.round(impact.psychologicalEffect.confidence_change)}
                  </div>
                )}
                {impact.psychologicalEffect.stress_change !== 0 && (
                  <div style={{
                    fontSize: '0.75em',
                    color: impact.psychologicalEffect.stress_change > 0 ? '#f00' : '#0f0'
                  }}>
                    Stress {impact.psychologicalEffect.stress_change > 0 ? '+' : ''}{Math.round(impact.psychologicalEffect.stress_change)}
                  </div>
                )}
                {impact.psychologicalEffect.burnout_change !== 0 && (
                  <div style={{
                    fontSize: '0.75em',
                    color: impact.psychologicalEffect.burnout_change > 0 ? '#f00' : '#0f0'
                  }}>
                    Burnout {impact.psychologicalEffect.burnout_change > 0 ? '+' : ''}{Math.round(impact.psychologicalEffect.burnout_change)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accept Button */}
      {onAccept && (
        <div style={{
          padding: '15px',
          backgroundColor: 'rgba(0, 255, 0, 0.05)',
          borderTop: '1px solid #333',
          display: 'flex',
          gap: '10px'
        }}>
          <button
            onClick={onAccept}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#0f0',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1em',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.9'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            ✓ Accept Song
          </button>
        </div>
      )}
    </div>
  );
};

export default SongPlaybackPanel;
