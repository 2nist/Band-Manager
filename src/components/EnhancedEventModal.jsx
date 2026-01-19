import React, { useState, useEffect } from 'react';
import { AlertCircle, TrendingUp, TrendingDown, Heart, Skull, AlertTriangle } from 'lucide-react';

/**
 * EnhancedEventModal - Cinematic presentation of gritty, mature events
 * 
 * Features:
 * - Atmospheric rendering
 * - Character dialogue
 * - Risk/consequence preview
 * - Psychological state visualization
 * - Real-time consequence estimation
 */
export const EnhancedEventModal = ({ 
  isOpen, 
  event, 
  psychologicalState,
  onChoice,
  onClose 
}) => {
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showConsequences, setShowConsequences] = useState(false);
  const [hoverChoice, setHoverChoice] = useState(null);

  if (!isOpen || !event) return null;

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return '#22c55e';
      case 'medium': return '#eab308';
      case 'high': return '#f97316';
      case 'extreme': return '#dc2626';
      case 'critical': return '#000000';
      default: return '#6b7280';
    }
  };

  const getRiskEmoji = (riskLevel) => {
    switch (riskLevel) {
      case 'low': return '✓';
      case 'medium': return '⚠';
      case 'high': return '⚠⚠';
      case 'extreme': return '☠';
      case 'critical': return '💀';
      default: return '?';
    }
  };

  const formatConsequence = (label, value) => {
    if (value === 0) return null;
    const isPositive = value > 0;
    const symbol = isPositive ? '+' : '';
    const color = isPositive ? '#22c55e' : '#ef4444';
    return (
      <div key={label} style={{ color, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
        {symbol}{value} {label}
      </div>
    );
  };

  const calculateImpact = (choice) => {
    const impacts = {
      immediate: [],
      longTerm: [],
      psychological: []
    };

    if (choice.immediateEffects) {
      Object.entries(choice.immediateEffects).forEach(([key, value]) => {
        impacts.immediate.push(formatConsequence(key, value));
      });
    }

    if (choice.psychologicalEffects) {
      Object.entries(choice.psychologicalEffects).forEach(([key, value]) => {
        impacts.psychological.push(formatConsequence(key, value));
      });
    }

    if (choice.longTermEffects) {
      impacts.longTerm.push(
        <div key="long-term" style={{ color: '#a78bfa', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
          {typeof choice.longTermEffects === 'object' 
            ? Object.keys(choice.longTermEffects).join(', ')
            : 'Long-term consequences'}
        </div>
      );
    }

    return impacts;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      {/* Atmospheric background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at ${Math.random() * 100}% ${Math.random() * 100}%, 
            rgba(139, 92, 246, 0.1) 0%, 
            rgba(0, 0, 0, 0.9) 100%)`,
          animation: 'pulse 4s ease-in-out infinite'
        }}
      />

      {/* Modal content */}
      <div
        style={{
          backgroundColor: '#1f2937',
          borderRadius: '0.5rem',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          zIndex: 1001,
          border: `2px solid ${getRiskColor(event.risk || 'medium')}`,
          animation: 'slideUp 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#111827',
            padding: '1.5rem',
            borderBottom: `2px solid ${getRiskColor(event.risk || 'medium')}`,
            position: 'sticky',
            top: 0
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
            <span
              style={{
                fontSize: '2rem',
                minWidth: '3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {getRiskEmoji(event.risk || 'medium')}
            </span>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                {event.title}
              </h2>
              <p style={{ color: '#9ca3af', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>
                {event.category?.replace('_', ' ')} • Risk: {event.risk?.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Character info */}
          {event.character && (
            <div style={{ 
              backgroundColor: 'rgba(107, 114, 128, 0.3)',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              marginTop: '0.75rem'
            }}>
              <p style={{ color: '#e5e7eb', margin: 0, fontStyle: 'italic' }}>
                <strong>{event.character.name}</strong>: {event.character.dialogue}
              </p>
            </div>
          )}
        </div>

        {/* Event description */}
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #374151' }}>
          <p style={{ color: '#e5e7eb', lineHeight: 1.6, fontSize: '1rem', margin: 0 }}>
            {event.description}
          </p>

          {/* Psychological state indicator */}
          {psychologicalState && (
            <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', padding: '0.75rem', borderRadius: '0.375rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#a78bfa', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Stress Level
                </div>
                <div style={{ height: '0.5rem', backgroundColor: '#374151', borderRadius: '0.25rem', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: psychologicalState.stress_level > 70 ? '#ef4444' : '#f97316',
                      width: `${psychologicalState.stress_level || 0}%`,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', padding: '0.75rem', borderRadius: '0.375rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#a78bfa', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Moral Integrity
                </div>
                <div style={{ height: '0.5rem', backgroundColor: '#374151', borderRadius: '0.25rem', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: psychologicalState.moral_integrity < 40 ? '#ef4444' : psychologicalState.moral_integrity < 70 ? '#f97316' : '#22c55e',
                      width: `${psychologicalState.moral_integrity || 100}%`,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', padding: '0.75rem', borderRadius: '0.375rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#a78bfa', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Addiction Risk
                </div>
                <div style={{ height: '0.5rem', backgroundColor: '#374151', borderRadius: '0.25rem', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: psychologicalState.addiction_risk > 70 ? '#ef4444' : psychologicalState.addiction_risk > 40 ? '#f97316' : '#eab308',
                      width: `${psychologicalState.addiction_risk || 0}%`,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)', padding: '0.75rem', borderRadius: '0.375rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#a78bfa', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Paranoia
                </div>
                <div style={{ height: '0.5rem', backgroundColor: '#374151', borderRadius: '0.25rem', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: psychologicalState.paranoia > 70 ? '#ef4444' : '#f97316',
                      width: `${psychologicalState.paranoia || 0}%`,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Choices */}
        <div style={{ padding: '1.5rem' }}>
          <h3 style={{ color: '#9ca3af', fontSize: '0.875rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
            What do you do?
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {event.choices?.map((choice) => (
              <div
                key={choice.id}
                style={{
                  position: 'relative'
                }}
              >
                <button
                  onClick={() => {
                    setSelectedChoice(choice.id);
                    setShowConsequences(true);
                  }}
                  onMouseEnter={() => setHoverChoice(choice.id)}
                  onMouseLeave={() => setHoverChoice(null)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: selectedChoice === choice.id ? 'rgba(139, 92, 246, 0.3)' : hoverChoice === choice.id ? 'rgba(107, 114, 128, 0.3)' : 'rgba(55, 65, 81, 0.5)',
                    border: `2px solid ${selectedChoice === choice.id ? '#a78bfa' : getRiskColor(choice.riskLevel)}`,
                    borderRadius: '0.375rem',
                    color: '#e5e7eb',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}
                >
                  <span style={{ fontSize: '1.25rem' }}>
                    {getRiskEmoji(choice.riskLevel)}
                  </span>
                  <span style={{ flex: 1 }}>{choice.text}</span>
                  {selectedChoice === choice.id && <AlertTriangle size={18} />}
                </button>

                {/* Consequence preview */}
                {selectedChoice === choice.id && showConsequences && (
                  <div
                    style={{
                      marginTop: '0.75rem',
                      padding: '1rem',
                      backgroundColor: 'rgba(30, 27, 35, 0.8)',
                      borderLeft: `4px solid ${getRiskColor(choice.riskLevel)}`,
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <div style={{ color: '#f3e8ff', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                      Consequences:
                    </div>

                    {(() => {
                      const impacts = calculateImpact(choice);
                      return (
                        <>
                          {impacts.immediate.length > 0 && (
                            <div style={{ marginBottom: '0.75rem' }}>
                              <div style={{ color: '#a78bfa', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                Immediate Effects
                              </div>
                              {impacts.immediate}
                            </div>
                          )}

                          {impacts.psychological.length > 0 && (
                            <div style={{ marginBottom: '0.75rem' }}>
                              <div style={{ color: '#a78bfa', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                Psychological Impact
                              </div>
                              {impacts.psychological}
                            </div>
                          )}

                          {impacts.longTerm.length > 0 && (
                            <div>
                              <div style={{ color: '#a78bfa', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                Long-term Consequences
                              </div>
                              {impacts.longTerm}
                            </div>
                          )}

                          {choice.traumaRisk && (
                            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #4b5563', color: '#fecaca' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                <Skull size={14} />
                                <span style={{ fontWeight: 'bold' }}>Trauma Risk: {(choice.traumaRisk.probability * 100).toFixed(0)}%</span>
                              </div>
                              <div style={{ fontSize: '0.8rem', color: '#f3e8ff' }}>
                                {choice.traumaRisk.description}
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}

                    <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={() => {
                          onChoice(event.id, choice.id, choice.text, calculateImpact(choice));
                          onClose();
                        }}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          backgroundColor: getRiskColor(choice.riskLevel),
                          color: '#fff',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          transition: 'opacity 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = '0.8'}
                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                      >
                        Confirm Choice
                      </button>
                      <button
                        onClick={() => {
                          setSelectedChoice(null);
                          setShowConsequences(false);
                        }}
                        style={{
                          padding: '0.75rem 1rem',
                          backgroundColor: '#374151',
                          color: '#e5e7eb',
                          border: 'none',
                          borderRadius: '0.375rem',
                          cursor: 'pointer',
                          transition: 'opacity 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                        onMouseLeave={(e) => e.target.style.opacity = '1'}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'transparent',
            color: '#9ca3af',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            width: '2rem',
            height: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.color = '#ef4444'}
          onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
        >
          ✕
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(2rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
};

export default EnhancedEventModal;
