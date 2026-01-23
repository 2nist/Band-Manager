/**
 * EnhancedEventModal - Full Cinematic Presentation of Gritty Events
 * 
 * Features:
 * - Typewriter dialogue effects
 * - Content warning system
 * - Atmospheric background rendering
 * - Character dialogue with speech patterns
 * - Enhanced choice presentation with psychological pressure
 * - Consequence preview with timeline
 * - Psychological state visualization
 */

import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Skull, Heart, Shield, Eye, EyeOff, Clock, X } from 'lucide-react';

export const EnhancedEventModal = ({ 
  isOpen,
  event, 
  psychologicalState,
  gameState,
  onChoice, 
  onClose 
}) => {
  const [showContentWarning, setShowContentWarning] = useState(
    event?.maturityLevel === 'mature' || event?.contentWarnings?.length > 0
  );
  const [dialogueTypewriterIndex, setDialogueTypewriterIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showConsequencePreview, setShowConsequencePreview] = useState(null);
  const [atmosphereLevel, setAtmosphereLevel] = useState(event?.intensity || 'medium');

  // Reset typewriter when event changes
  useEffect(() => {
    if (event && !showContentWarning) {
      setDialogueTypewriterIndex(0);
    }
  }, [event?.id, showContentWarning]);

  // Typewriter effect for dialogue
  useEffect(() => {
    if (!showContentWarning && event?.description && isOpen) {
      const timer = setInterval(() => {
        setDialogueTypewriterIndex(prev => {
          if (prev < event.description.length) {
            return prev + 1;
          }
          clearInterval(timer);
          return prev;
        });
      }, 30); // Adjust speed for tension

      return () => clearInterval(timer);
    }
  }, [showContentWarning, event?.description, isOpen]);

  if (!isOpen || !event) return null;

  // Show content warning first if needed
  if (showContentWarning) {
    return (
      <ContentWarningOverlay
        event={event}
        onProceed={() => setShowContentWarning(false)}
        onSkip={onClose}
      />
    );
  }

  // Dynamic styling based on event type and intensity
  const getEventStyling = () => {
    const baseStyle = {
      background: 'var(--background)',
      border: '2px solid',
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative',
      maxWidth: '800px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto'
    };

    switch (event?.category) {
      case 'substance_abuse':
        return {
          ...baseStyle,
          borderColor: 'hsl(var(--destructive))',
          background: 'linear-gradient(135deg, var(--background), hsl(var(--destructive) / 0.1))',
          boxShadow: '0 0 30px hsl(var(--destructive) / 0.5)'
        };
      case 'criminal_activity':
        return {
          ...baseStyle,
          borderColor: 'hsl(var(--destructive))',
          background: 'linear-gradient(135deg, var(--background), hsl(var(--destructive) / 0.15))',
          boxShadow: '0 0 40px hsl(var(--destructive) / 0.7)'
        };
      case 'psychological_horror':
        return {
          ...baseStyle,
          borderColor: 'hsl(var(--accent))',
          background: 'linear-gradient(135deg, var(--background), hsl(var(--accent) / 0.1))',
          boxShadow: '0 0 35px hsl(var(--accent) / 0.6)'
        };
      default:
        return {
          ...baseStyle,
          borderColor: 'hsl(var(--primary))',
          background: 'linear-gradient(135deg, var(--background), hsl(var(--primary) / 0.05))',
          boxShadow: '0 0 20px hsl(var(--primary) / 0.3)'
        };
    }
  };

  const handleChoiceSelected = (choice) => {
    if (onChoice) {
      onChoice(event.id, choice.id, choice.text, {
        immediate: choice.immediateEffects || {},
        psychological: choice.psychologicalEffects || {},
        longTerm: choice.longTermEffects || {}
      });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-[1000] p-4"
      style={{ backdropFilter: 'blur(5px)' }}
      onClick={onClose}
    >
      {/* Atmospheric background effects */}
      <AtmosphereRenderer intensity={atmosphereLevel} category={event.category} />
      
      {/* Modal content */}
      <div 
        style={getEventStyling()}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <EventHeader event={event} psychologicalState={psychologicalState} />
        
        {/* Main event description with typewriter effect */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div 
            style={{ 
              color: 'var(--foreground)', 
              fontSize: '1.1em', 
              lineHeight: '1.6',
              minHeight: '100px'
            }}
          >
            {event.description?.slice(0, dialogueTypewriterIndex)}
            {dialogueTypewriterIndex < (event.description?.length || 0) && (
              <span style={{ 
                color: 'hsl(var(--primary))', 
                animation: 'typing-cursor 1s infinite',
                marginLeft: '2px'
              }}>|</span>
            )}
          </div>
          
          {/* Character dialogue with speech patterns */}
          {event.character && dialogueTypewriterIndex >= (event.description?.length || 0) && (
            <CharacterDialogue 
              character={event.character} 
              psychologicalState={psychologicalState}
            />
          )}
        </div>

        {/* Enhanced choice system */}
        <div style={{ padding: '24px' }}>
          <h3 style={{ 
            color: '#888', 
            fontSize: '0.75em', 
            textTransform: 'uppercase', 
            marginBottom: '16px',
            fontWeight: 'bold'
          }}>
            What do you do?
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {event.choices?.map((choice, index) => (
              <EnhancedChoice
                key={choice.id || index}
                choice={choice}
                index={index}
                psychologicalState={psychologicalState || {}}
                gameState={gameState}
                isSelected={selectedChoice === choice.id}
                onSelect={() => setSelectedChoice(choice.id)}
                onPreview={() => setShowConsequencePreview(choice)}
                onConfirm={() => handleChoiceSelected(choice)}
              />
            ))}
          </div>
        </div>

        {/* Consequence preview */}
        {showConsequencePreview && (
          <ConsequencePreview
            choice={showConsequencePreview}
            gameState={gameState}
            onClose={() => setShowConsequencePreview(null)}
            onConfirm={() => {
              handleChoiceSelected(showConsequencePreview);
              setShowConsequencePreview(null);
            }}
          />
        )}

        {/* Psychological state indicator */}
        {psychologicalState && (
          <PsychologicalStateIndicator state={psychologicalState} />
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: '1px solid #666',
            color: '#fff',
            width: '32px',
            height: '32px',
            borderRadius: '4px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>
      </div>

      <style>{`
        @keyframes typing-cursor {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

// Atmospheric background renderer
function AtmosphereRenderer({ intensity, category }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];

    const getParticleColor = (category) => {
      switch (category) {
        case 'substance_abuse': return '#dc2626';
        case 'criminal_activity': return '#7f1d1d';
        case 'psychological_horror': return '#581c87';
        default: return '#0ff';
      }
    };

    const createParticles = () => {
      const count = intensity === 'high' ? 50 : intensity === 'extreme' ? 80 : 30;
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5,
          color: getParticleColor(category)
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        const alpha = Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fillStyle = `${particle.color}${alpha}`;
        ctx.fillRect(particle.x, particle.y, 2, 2);
      });
      
      requestAnimationFrame(animate);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.length = 0;
      createParticles();
    };

    resize();
    animate();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      particles.length = 0;
    };
  }, [intensity, category]);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: 0.3,
        zIndex: -1
      }}
    />
  );
}

// Event header component
function EventHeader({ event, psychologicalState }) {
  const getRiskEmoji = (risk) => {
    switch (risk) {
      case 'low': return '✓';
      case 'medium': return '⚠';
      case 'high': return '⚠⚠';
      case 'extreme': return '☠';
      case 'critical': return '💀';
      default: return '?';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'extreme': return '#7f1d1d';
      case 'critical': return '#7f1d1d';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      padding: '24px',
      borderBottom: '2px solid',
      borderColor: getRiskColor(event.risk || event.riskLevel || 'medium'),
      background: 'rgba(0, 0, 0, 0.5)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
        <span style={{ fontSize: '2em' }}>
          {getRiskEmoji(event.risk || event.riskLevel || 'medium')}
        </span>
        <div style={{ flex: 1 }}>
          <h2 style={{ 
            margin: 0, 
            color: '#fff', 
            fontSize: '1.5em',
            fontWeight: 'bold'
          }}>
            {event.title}
          </h2>
          <p style={{ 
            margin: '4px 0 0 0', 
            color: '#888', 
            fontSize: '0.9em' 
          }}>
            {event.category?.replace(/_/g, ' ')} • Risk: {(event.risk || event.riskLevel || 'medium').toUpperCase()}
          </p>
        </div>
      </div>

      {/* Character info */}
      {event.character && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '4px',
          borderLeft: '3px solid #0ff'
        }}>
          <p style={{ margin: 0, color: 'hsl(var(--foreground))', fontStyle: 'italic' }}>
            <strong style={{ color: 'hsl(var(--primary))' }}>{event.character.name}</strong>: {event.character.dialogue || event.character.speech}
          </p>
        </div>
      )}
    </div>
  );
}

// Enhanced choice component with risk visualization
function EnhancedChoice({ 
  choice, 
  index, 
  psychologicalState, 
  gameState,
  isSelected,
  onSelect,
  onPreview,
  onConfirm
}) {
  const [hovered, setHovered] = useState(false);

  // Calculate choice appeal based on psychology
  const getChoiceAppeal = () => {
    let appeal = 0;
    
    // Addiction affects substance choices
    if (choice.text?.toLowerCase().includes('drug') || choice.text?.toLowerCase().includes('substance')) {
      if (psychologicalState.addiction_risk > 50) appeal += 30;
    }
    
    // Stress affects risk-taking
    if (choice.riskLevel === 'high' && psychologicalState.stress_level > 70) {
      appeal += 20;
    }
    
    // Moral integrity affects corrupt choices
    if (choice.ethical_rating === 'corrupt' && psychologicalState.moral_integrity < 40) {
      appeal += 25;
    }

    return Math.min(100, Math.max(0, appeal));
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'extreme': return '#7f1d1d';
      case 'critical': return '#7f1d1d';
      default: return '#6b7280';
    }
  };

  const appeal = getChoiceAppeal();
  const riskLevel = choice.riskLevel || choice.risk || 'medium';

  return (
    <div 
      style={{
        border: `2px solid ${isSelected ? '#10b981' : getRiskColor(riskLevel)}`,
        background: appeal > 50 
          ? `linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0, 0, 0, 0.8))` 
          : appeal > 30 
          ? `linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(0, 0, 0, 0.8))`
          : 'rgba(0, 0, 0, 0.8)',
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        transform: isSelected ? 'scale(1.02)' : hovered ? 'scale(1.01)' : 'scale(1)',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      {/* Choice header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <RiskIndicator level={riskLevel} />
        <div style={{ flex: 1, color: '#fff', fontWeight: '500' }}>
          {choice.text}
        </div>
        {appeal > 60 && <CompulsionIndicator intensity={appeal} />}
      </div>

      {/* Psychological pressure indicator */}
      {appeal > 30 && (
        <div style={{
          marginTop: '8px',
          background: 'rgba(31, 41, 55, 0.5)',
          borderRadius: '4px',
          overflow: 'hidden',
          position: 'relative',
          height: '20px'
        }}>
          <div
            style={{
              height: '100%',
              width: `${appeal}%`,
              background: `linear-gradient(90deg, ${getRiskColor(riskLevel)}, #ffffff)`,
              transition: 'width 0.5s ease'
            }}
          />
          <span style={{
            position: 'absolute',
            top: '50%',
            left: '8px',
            transform: 'translateY(-50%)',
            fontSize: '0.8em',
            color: '#fff',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)'
          }}>
            {appeal > 70 ? 'Overwhelming urge' : 
             appeal > 50 ? 'Strong temptation' :
             'Mild attraction'}
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          style={{
            padding: '6px 12px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            color: 'hsl(var(--foreground))',
            cursor: 'pointer',
            fontSize: '0.85em',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Eye size={14} />
          Preview
        </button>
        {isSelected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onConfirm();
            }}
            style={{
              padding: '6px 12px',
              background: 'hsl(var(--primary))',
              border: 'none',
              borderRadius: '4px',
              color: 'hsl(var(--primary-foreground))',
              cursor: 'pointer',
              fontSize: '0.85em',
              fontWeight: 'bold',
              flex: 1
            }}
          >
            Confirm Choice
          </button>
        )}
      </div>
    </div>
  );
}

// Risk indicator component
function RiskIndicator({ level }) {
  const getIcon = () => {
    switch (level) {
      case 'low': return <Shield size={16} style={{ color: 'hsl(var(--secondary))' }} />;
      case 'medium': return <AlertTriangle size={16} style={{ color: 'hsl(var(--accent))' }} />;
      case 'high': return <AlertTriangle size={16} style={{ color: 'hsl(var(--destructive))' }} />;
      case 'extreme': return <Skull size={16} style={{ color: 'hsl(var(--destructive))' }} />;
      case 'critical': return <Skull size={16} style={{ color: 'hsl(var(--destructive))' }} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {getIcon()}
      <span style={{ fontSize: '0.75em', color: 'hsl(var(--muted-foreground))', textTransform: 'uppercase' }}>
        {level}
      </span>
    </div>
  );
}

// Compulsion indicator for psychological pressure
function CompulsionIndicator({ intensity }) {
  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.8em',
        color: intensity > 80 ? '#dc2626' : '#f59e0b',
        animation: `pulse ${3 - (intensity / 50)}s infinite`
      }}
    >
      <Heart size={14} fill="currentColor" />
      <span>Compulsive</span>
    </div>
  );
}

// Character dialogue with personality-based speech patterns
function CharacterDialogue({ character, psychologicalState }) {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const dialogues = character.speech_patterns || (character.dialogue ? [character.dialogue] : []);

  useEffect(() => {
    if (dialogues.length > 1) {
      const interval = setInterval(() => {
        setCurrentDialogueIndex(prev => (prev + 1) % dialogues.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [dialogues.length]);

  if (!dialogues.length) return null;

  return (
    <div style={{
      marginTop: '16px',
      padding: '16px',
      background: 'rgba(0, 255, 255, 0.1)',
      borderRadius: '8px',
      borderLeft: '3px solid #0ff'
    }}>
      <div style={{ fontWeight: 'bold', color: 'hsl(var(--primary))', marginBottom: '8px' }}>
        {character.name}
      </div>
      <div style={{ color: 'hsl(var(--foreground))', fontStyle: 'italic' }}>
        "{dialogues[currentDialogueIndex]}"
      </div>
    </div>
  );
}

// Consequence preview modal
function ConsequencePreview({ choice, gameState, onClose, onConfirm }) {
  const formatEffect = (key, value) => {
    if (value === 0 || !value) return null;
    const isPositive = value > 0;
    return (
      <div key={key} style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4px 0',
        color: isPositive ? 'hsl(var(--secondary))' : 'hsl(var(--destructive))',
        fontSize: '0.9em'
      }}>
        <span>{key.replace(/_/g, ' ')}</span>
        <span>{isPositive ? '+' : ''}{value}</span>
      </div>
    );
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1001,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'hsl(var(--card))',
          border: '2px solid hsl(var(--primary))',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
          color: 'hsl(var(--card-foreground))'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ color: '#0ff', marginTop: 0, marginBottom: '20px' }}>
          Potential Consequences: "{choice.text}"
        </h3>
        
        {/* Immediate Effects */}
        {choice.immediateEffects && Object.keys(choice.immediateEffects).length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#fff', fontSize: '0.9em', marginBottom: '10px', textTransform: 'uppercase' }}>
              Immediate Effects
            </h4>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '4px' }}>
              {Object.entries(choice.immediateEffects).map(([key, value]) => formatEffect(key, value))}
            </div>
          </div>
        )}

        {/* Psychological Effects */}
        {choice.psychologicalEffects && Object.keys(choice.psychologicalEffects).length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: 'hsl(var(--foreground))', fontSize: '0.9em', marginBottom: '10px', textTransform: 'uppercase' }}>
              Psychological Impact
            </h4>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '4px' }}>
              {Object.entries(choice.psychologicalEffects).map(([key, value]) => formatEffect(key, value))}
            </div>
          </div>
        )}

        {/* Long-term Effects */}
        {choice.longTermEffects && (
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#fff', fontSize: '0.9em', marginBottom: '10px', textTransform: 'uppercase' }}>
              Long-term Consequences
            </h4>
            <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '4px', color: '#a78bfa' }}>
              {typeof choice.longTermEffects === 'object' 
                ? Object.keys(choice.longTermEffects).join(', ')
                : choice.longTermEffects}
            </div>
          </div>
        )}

        {/* Trauma Risk */}
        {choice.traumaRisk && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            background: 'rgba(220, 38, 38, 0.1)',
            borderLeft: '3px solid #dc2626',
            borderRadius: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Skull size={16} color="hsl(var(--destructive))" />
              <span style={{ color: 'hsl(var(--destructive))', fontWeight: 'bold' }}>
                Trauma Risk: {((choice.traumaRisk.probability || 0) * 100).toFixed(0)}%
              </span>
            </div>
            <div style={{ color: 'hsl(var(--muted-foreground))', fontSize: '0.85em' }}>
              {choice.traumaRisk.description}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              background: 'hsl(var(--muted))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '4px',
              color: 'hsl(var(--muted-foreground))',
              cursor: 'pointer',
              flex: 1
            }}
          >
            Close Preview
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              style={{
                padding: '10px 20px',
                background: 'hsl(var(--primary))',
                border: 'none',
                borderRadius: '4px',
                color: 'hsl(var(--primary-foreground))',
                cursor: 'pointer',
                fontWeight: 'bold',
                flex: 1
              }}
            >
              Confirm Choice
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Psychological state indicator
function PsychologicalStateIndicator({ state }) {
  const getStateColor = (value, inverted = false) => {
    const threshold = inverted ? 
      (value < 30 ? '#dc2626' : value < 60 ? '#f59e0b' : '#10b981') :
      (value > 70 ? '#dc2626' : value > 40 ? '#f59e0b' : '#10b981');
    return threshold;
  };

  return (
    <div style={{
      position: 'absolute',
      bottom: '16px',
      right: '16px',
      background: 'hsl(var(--card) / 0.8)',
      padding: '12px',
      borderRadius: '4px',
      fontSize: '0.8em',
      minWidth: '200px',
      border: '1px solid hsl(var(--border))'
    }}>
      <div style={{ color: '#0ff', fontWeight: 'bold', marginBottom: '8px' }}>
        Psychological State
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span style={{ color: '#888' }}>Stress</span>
            <span style={{ color: '#fff' }}>{Math.round(state.stress_level || 0)}%</span>
          </div>
          <div style={{ height: '4px', background: '#222', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${state.stress_level || 0}%`,
              background: getStateColor(state.stress_level || 0),
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
            <span style={{ color: '#888' }}>Integrity</span>
            <span style={{ color: '#fff' }}>{Math.round(state.moral_integrity || 100)}%</span>
          </div>
          <div style={{ height: '4px', background: '#222', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${state.moral_integrity || 100}%`,
              background: getStateColor(state.moral_integrity || 100, true),
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
        {(state.addiction_risk || 0) > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span style={{ color: 'hsl(var(--muted-foreground))' }}>Addiction Risk</span>
              <span style={{ color: 'hsl(var(--destructive))' }}>{Math.round(state.addiction_risk || 0)}%</span>
            </div>
            <div style={{ height: '4px', background: 'hsl(var(--muted))', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${state.addiction_risk || 0}%`,
                background: getStateColor(state.addiction_risk || 0),
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Content warning overlay
function ContentWarningOverlay({ event, onProceed, onSkip }) {
  const [acknowledged, setAcknowledged] = useState(false);

  const warnings = event.contentWarnings || 
    (event.maturityLevel === 'mature' ? ['mature_themes'] : []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1002,
      padding: '20px'
    }}>
      <div style={{
        background: '#0a0a0a',
        border: '2px solid #dc2626',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '600px',
        width: '100%',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '24px' }}>
          <AlertTriangle size={48} color="#dc2626" style={{ marginBottom: '16px' }} />
          <h2 style={{ color: '#dc2626', margin: 0, fontSize: '1.5em' }}>
            Mature Content Warning
          </h2>
        </div>

        <div style={{ color: '#fff', marginBottom: '24px', textAlign: 'left' }}>
          <p style={{ marginBottom: '12px' }}>This event contains mature themes including:</p>
          <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
            {warnings.map(warning => (
              <li key={warning} style={{ marginBottom: '8px', textTransform: 'capitalize' }}>
                {warning.replace(/_/g, ' ')}
              </li>
            ))}
          </ul>
          
          <div style={{
            padding: '12px',
            background: 'rgba(220, 38, 38, 0.1)',
            borderRadius: '4px',
            fontSize: '0.9em',
            color: '#888'
          }}>
            <strong style={{ color: '#fff' }}>This content is intended for mature audiences.</strong>
            <br />
            The scenarios depicted are fictional and do not represent endorsement of real-world behavior.
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: '#fff',
            cursor: 'pointer',
            justifyContent: 'center'
          }}>
            <input 
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span>I understand this content contains mature themes and I wish to proceed</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={onSkip}
            style={{
              padding: '12px 24px',
              background: '#444',
              border: '1px solid #666',
              borderRadius: '4px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Skip This Event
          </button>
          <button
            onClick={onProceed}
            disabled={!acknowledged}
            style={{
              padding: '12px 24px',
              background: acknowledged ? '#dc2626' : '#333',
              border: 'none',
              borderRadius: '4px',
              color: '#fff',
              cursor: acknowledged ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
              opacity: acknowledged ? 1 : 0.5
            }}
          >
            I Understand - Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export default EnhancedEventModal;
