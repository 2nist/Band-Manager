// ENHANCED DIALOGUE COMPONENT IMPLEMENTATIONS
// Visual and interactive components for gritty event system

import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Skull, Heart, Shield, Eye, EyeOff, Clock } from 'lucide-react';

// Main Enhanced Event Modal with Cinematic Presentation
export function EnhancedEventModal({ 
  event, 
  onChoiceSelected, 
  onClose, 
  gameState,
  psychologicalState 
}) {
  const [showContentWarning, setShowContentWarning] = useState(event?.maturityLevel === 'mature');
  const [dialogueTypewriterIndex, setDialogueTypewriterIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [showConsequencePreview, setShowConsequencePreview] = useState(false);
  const [atmosphereLevel, setAtmosphereLevel] = useState(event?.intensity || 'medium');

  // Typewriter effect for dialogue
  useEffect(() => {
    if (!showContentWarning && event?.description) {
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
  }, [showContentWarning, event?.description]);

  // Dynamic styling based on event type and intensity
  const getEventStyling = () => {
    const baseStyle = {
      background: '#000000',
      border: '2px solid',
      borderRadius: '12px',
      overflow: 'hidden',
      position: 'relative'
    };

    switch (event?.category) {
      case 'substance_abuse':
        return {
          ...baseStyle,
          borderColor: '#dc2626',
          background: 'linear-gradient(135deg, #000000, #1a0606)',
          boxShadow: '0 0 30px rgba(220, 38, 38, 0.5)'
        };
      case 'criminal_activity':
        return {
          ...baseStyle,
          borderColor: '#7f1d1d',
          background: 'linear-gradient(135deg, #000000, #1c0a00)',
          boxShadow: '0 0 40px rgba(127, 29, 29, 0.7)'
        };
      case 'psychological_horror':
        return {
          ...baseStyle,
          borderColor: '#581c87',
          background: 'linear-gradient(135deg, #000000, #0f0a1a)',
          boxShadow: '0 0 35px rgba(88, 28, 135, 0.6)'
        };
      default:
        return baseStyle;
    }
  };

  if (showContentWarning) {
    return (
      <ContentWarningOverlay
        event={event}
        onProceed={() => setShowContentWarning(false)}
        onSkip={onClose}
      />
    );
  }

  return (
    <div className="modal-overlay enhanced-event-overlay">
      {/* Atmospheric background effects */}
      <AtmosphereRenderer intensity={atmosphereLevel} category={event.category} />
      
      <div 
        className="enhanced-event-modal"
        style={getEventStyling()}
      >
        {/* Event header with dramatic presentation */}
        <EventHeader event={event} psychologicalState={psychologicalState} />
        
        {/* Main event description with typewriter effect */}
        <div className="event-narrative">
          <div className="dialogue-text">
            {event.description.slice(0, dialogueTypewriterIndex)}
            {dialogueTypewriterIndex < event.description.length && (
              <span className="typing-cursor">|</span>
            )}
          </div>
          
          {/* Character dialogue with speech patterns */}
          {event.character && dialogueTypewriterIndex >= event.description.length && (
            <CharacterDialogue 
              character={event.character} 
              psychologicalState={psychologicalState}
            />
          )}
        </div>

        {/* Enhanced choice system */}
        <div className="enhanced-choices">
          {event.choices.map((choice, index) => (
            <EnhancedChoice
              key={choice.id}
              choice={choice}
              index={index}
              psychologicalState={psychologicalState}
              gameState={gameState}
              isSelected={selectedChoice === choice.id}
              onSelect={() => setSelectedChoice(choice.id)}
              onPreview={() => setShowConsequencePreview(choice)}
            />
          ))}
        </div>

        {/* Consequence preview */}
        {showConsequencePreview && (
          <ConsequencePreview
            choice={showConsequencePreview}
            gameState={gameState}
            onClose={() => setShowConsequencePreview(false)}
          />
        )}

        {/* Action buttons */}
        <div className="event-actions">
          <button 
            className="btn-secondary"
            onClick={onClose}
          >
            Walk Away
          </button>
          <button 
            className="btn enhanced-confirm-btn"
            disabled={!selectedChoice}
            onClick={() => {
              const choice = event.choices.find(c => c.id === selectedChoice);
              onChoiceSelected(event, choice);
            }}
          >
            Make Your Choice
          </button>
        </div>

        {/* Psychological state indicator */}
        <PsychologicalStateIndicator state={psychologicalState} />
      </div>
    </div>
  );
}

// Atmospheric background renderer
function AtmosphereRenderer({ intensity, category }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];

    // Create particles based on event category
    const createParticles = () => {
      for (let i = 0; i < (intensity === 'high' ? 50 : 30); i++) {
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

    const getParticleColor = (category) => {
      switch (category) {
        case 'substance_abuse': return '#dc2626';
        case 'criminal_activity': return '#7f1d1d';
        case 'psychological_horror': return '#581c87';
        default: return '#334155';
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fillRect(particle.x, particle.y, 2, 2);
      });
      
      requestAnimationFrame(animate);
    };

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
    animate();

    return () => {
      particles.length = 0;
    };
  }, [intensity, category]);

  return (
    <canvas 
      ref={canvasRef}
      className="atmosphere-canvas"
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

// Enhanced choice component with risk visualization
function EnhancedChoice({ 
  choice, 
  index, 
  psychologicalState, 
  gameState,
  isSelected,
  onSelect,
  onPreview 
}) {
  const [hovered, setHovered] = useState(false);
  const [riskAnalysis, setRiskAnalysis] = useState(null);

  // Calculate choice appeal based on psychology
  const getChoiceAppeal = () => {
    let appeal = 0;
    
    // Addiction affects substance choices
    if (choice.id.includes('drug') && psychologicalState.addiction_risk > 50) {
      appeal += 30;
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
      default: return '#6b7280';
    }
  };

  const appeal = getChoiceAppeal();

  return (
    <div 
      className={`enhanced-choice ${isSelected ? 'selected' : ''} ${hovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
      style={{
        border: `2px solid ${isSelected ? '#10b981' : getRiskColor(choice.riskLevel)}`,
        background: appeal > 50 ? `linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0, 0, 0, 0.8))` : 
                   appeal > 30 ? `linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(0, 0, 0, 0.8))` :
                   'rgba(0, 0, 0, 0.8)',
        transform: isSelected ? 'scale(1.02)' : hovered ? 'scale(1.01)' : 'scale(1)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Choice header with risk indicator */}
      <div className="choice-header">
        <div className="choice-text">{choice.text}</div>
        <div className="risk-indicators">
          <RiskIndicator level={choice.riskLevel} />
          {appeal > 60 && <CompulsionIndicator intensity={appeal} />}
        </div>
      </div>

      {/* Psychological pressure indicator */}
      {appeal > 30 && (
        <div className="psychological-pressure">
          <div 
            className="pressure-bar"
            style={{
              width: `${appeal}%`,
              background: `linear-gradient(90deg, ${getRiskColor(choice.riskLevel)}, #ffffff)`
            }}
          />
          <span className="pressure-text">
            {appeal > 70 ? 'Overwhelming urge' : 
             appeal > 50 ? 'Strong temptation' :
             'Mild attraction'}
          </span>
        </div>
      )}

      {/* Requirements or warnings */}
      {choice.requirements && (
        <div className="choice-requirements">
          <strong>Requires:</strong> {choice.requirements.join(', ')}
        </div>
      )}

      {/* Preview consequences button */}
      <button 
        className="consequence-preview-btn"
        onClick={(e) => {
          e.stopPropagation();
          onPreview();
        }}
      >
        <Eye size={16} />
        Preview Outcome
      </button>
    </div>
  );
}

// Risk indicator component
function RiskIndicator({ level }) {
  const getIcon = () => {
    switch (level) {
      case 'low': return <Shield size={16} color="#10b981" />;
      case 'medium': return <AlertTriangle size={16} color="#f59e0b" />;
      case 'high': return <AlertTriangle size={16} color="#ef4444" />;
      case 'extreme': return <Skull size={16} color="#7f1d1d" />;
      default: return null;
    }
  };

  return (
    <div className="risk-indicator">
      {getIcon()}
      <span className="risk-text">{level.toUpperCase()}</span>
    </div>
  );
}

// Compulsion indicator for psychological pressure
function CompulsionIndicator({ intensity }) {
  return (
    <div 
      className="compulsion-indicator"
      style={{
        animation: `pulse ${3 - (intensity / 50)}s infinite`,
        color: intensity > 80 ? '#dc2626' : '#f59e0b'
      }}
    >
      <Heart size={16} fill="currentColor" />
      <span>Compulsive</span>
    </div>
  );
}

// Character dialogue with personality-based speech patterns
function CharacterDialogue({ character, psychologicalState }) {
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const dialogues = character.speech_patterns || [];

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
    <div className="character-dialogue">
      <div className="dialogue-bubble">
        <div className="character-name">{character.name}</div>
        <div className="dialogue-text">
          "{dialogues[currentDialogueIndex]}"
        </div>
      </div>
    </div>
  );
}

// Consequence preview modal
function ConsequencePreview({ choice, gameState, onClose }) {
  const [timelineStep, setTimelineStep] = useState(0);
  const consequences = choice.longTermEffects || {};

  const timeline = [
    {
      period: 'Immediately',
      effects: choice.immediateEffects,
      probability: 100
    },
    {
      period: 'Next few weeks',
      effects: consequences.shortTerm,
      probability: consequences.shortTermProbability || 80
    },
    {
      period: 'Long term',
      effects: consequences.longTerm,
      probability: consequences.longTermProbability || 60
    }
  ];

  return (
    <div className="consequence-preview-overlay" onClick={onClose}>
      <div className="consequence-preview-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Potential Consequences: "{choice.text}"</h3>
        
        <div className="timeline-container">
          {timeline.map((step, index) => (
            <div 
              key={index}
              className={`timeline-step ${index <= timelineStep ? 'active' : ''}`}
            >
              <div className="timeline-marker">
                <Clock size={16} />
              </div>
              <div className="timeline-content">
                <h4>{step.period}</h4>
                <div className="probability">
                  {step.probability}% chance
                </div>
                <div className="effects-list">
                  {step.effects && Object.entries(step.effects).map(([effect, value]) => (
                    <div key={effect} className="effect-item">
                      <span className="effect-name">{effect.replace(/_/g, ' ')}</span>
                      <span className={`effect-value ${value > 0 ? 'positive' : 'negative'}`}>
                        {value > 0 ? '+' : ''}{value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="preview-actions">
          <button className="btn-secondary" onClick={onClose}>
            Close Preview
          </button>
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
    <div className="psychological-indicators">
      <div className="indicator-row">
        <div className="indicator">
          <span>Stress</span>
          <div 
            className="indicator-bar"
            style={{ 
              width: `${state.stress_level}%`,
              background: getStateColor(state.stress_level)
            }}
          />
        </div>
        <div className="indicator">
          <span>Integrity</span>
          <div 
            className="indicator-bar"
            style={{ 
              width: `${state.moral_integrity}%`,
              background: getStateColor(state.moral_integrity, true)
            }}
          />
        </div>
      </div>
      
      {state.addiction_risk > 0 && (
        <div className="addiction-warning">
          <AlertTriangle size={14} color="#dc2626" />
          <span>Addiction Risk: {state.addiction_risk}%</span>
        </div>
      )}
    </div>
  );
}

// Content warning overlay
function ContentWarningOverlay({ event, onProceed, onSkip }) {
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="content-warning-overlay">
      <div className="content-warning-modal">
        <div className="warning-header">
          <AlertTriangle size={32} color="#dc2626" />
          <h2>Mature Content Warning</h2>
        </div>

        <div className="warning-content">
          <p>This event contains mature themes including:</p>
          <ul>
            {event.contentWarnings.map(warning => (
              <li key={warning}>{warning.replace(/_/g, ' ').toUpperCase()}</li>
            ))}
          </ul>
          
          <div className="maturity-notice">
            <strong>This content is intended for mature audiences.</strong>
            <br />
            The scenarios depicted are fictional and do not represent endorsement of real-world behavior.
          </div>
        </div>

        <div className="acknowledgment">
          <label>
            <input 
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
            />
            I understand this content contains mature themes and I wish to proceed
          </label>
        </div>

        <div className="warning-actions">
          <button className="btn-secondary" onClick={onSkip}>
            Skip This Event
          </button>
          <button 
            className="btn" 
            disabled={!acknowledged}
            onClick={onProceed}
          >
            I Understand - Proceed
          </button>
        </div>
      </div>
    </div>
  );
}

// CSS animations (add to your styles.css)
const additionalStyles = `
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}

@keyframes typing-cursor {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.enhanced-event-overlay {
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(5px);
}

.enhanced-event-modal {
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
  position: relative;
}

.typing-cursor {
  animation: typing-cursor 1s infinite;
  color: #10b981;
}

.enhanced-choice {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  position: relative;
}

.psychological-pressure {
  margin-top: 8px;
  background: rgba(31, 41, 55, 0.5);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  height: 20px;
}

.pressure-bar {
  height: 100%;
  transition: width 0.5s ease;
}

.pressure-text {
  position: absolute;
  top: 50%;
  left: 8px;
  transform: translateY(-50%);
  font-size: 0.8em;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.compulsion-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8em;
}

.consequence-preview-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.timeline-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  opacity: 0.5;
  transition: opacity 0.3s ease;
}

.timeline-step.active {
  opacity: 1;
}

.psychological-indicators {
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.8);
  padding: 8px;
  border-radius: 4px;
  font-size: 0.8em;
}

.indicator-bar {
  height: 4px;
  border-radius: 2px;
  transition: width 0.5s ease;
}
`;

export { additionalStyles };
