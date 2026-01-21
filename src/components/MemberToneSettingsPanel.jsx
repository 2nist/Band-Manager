/**
 * MemberToneSettingsPanel - Tone and effects settings for individual band members
 * 
 * Allows players to customize instrument volume, effects (reverb, distortion, delay, chorus, filter)
 * for each band member. Settings are saved to member data and applied during playback.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { X, Volume2, Radio, Waves, Zap, Filter, Save, RotateCcw } from 'lucide-react';
import { ROLE_TRAITS } from '../utils/memberSkillTraits.js';

/**
 * Get available effects for a role
 */
function getEffectsForRole(role) {
  const roleMap = {
    'drummer': {
      effects: ['compression', 'reverb', 'distortion', 'filter'],
      instrument: 'Drums'
    },
    'guitarist': {
      effects: ['distortion', 'delay', 'chorus', 'filter'],
      instrument: 'Guitar'
    },
    'lead-guitar': {
      effects: ['distortion', 'delay', 'chorus', 'filter'],
      instrument: 'Lead Guitar'
    },
    'rhythm-guitar': {
      effects: ['reverb', 'chorus', 'distortion', 'filter'],
      instrument: 'Rhythm Guitar'
    },
    'bassist': {
      effects: ['reverb', 'chorus', 'filter'],
      instrument: 'Bass'
    },
    'keyboardist': {
      effects: ['reverb', 'chorus', 'delay', 'filter'],
      instrument: 'Keyboard'
    },
    'vocalist': {
      effects: ['reverb', 'delay', 'chorus', 'filter'],
      instrument: 'Vocals'
    }
  };
  
  return roleMap[role] || {
    effects: ['reverb', 'chorus'],
    instrument: 'Instrument'
  };
}

/**
 * Default tone settings for a role
 */
function getDefaultToneSettings(role) {
  return {
    volume: 0.8, // 0-1
    effects: {
      reverb: { enabled: false, wet: 0.2, roomSize: 0.4 },
      distortion: { enabled: false, amount: 0.3, wet: 0.3 },
      delay: { enabled: false, delayTime: '8n', feedback: 0.2, wet: 0.15 },
      chorus: { enabled: false, frequency: 1.5, delayTime: 3, depth: 0.6, wet: 0.2 },
      filter: { enabled: false, frequency: 8000, type: 'lowpass', Q: 1 },
      compression: { enabled: false, threshold: -20, ratio: 4, attack: 0.003, release: 0.1 }
    }
  };
}

export const MemberToneSettingsPanel = ({ member, gameState, onSave, onClose }) => {
  const [toneSettings, setToneSettings] = useState(() => {
    // Load existing settings or use defaults
    return member.toneSettings || getDefaultToneSettings(member.role || member.type);
  });
  
  const [hasChanges, setHasChanges] = useState(false);
  const role = member.role || member.type;
  const { effects: availableEffects, instrument } = getEffectsForRole(role);

  /**
   * Update a tone setting
   */
  const updateSetting = useCallback((path, value) => {
    setToneSettings(prev => {
      const newSettings = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      setHasChanges(true);
      return newSettings;
    });
  }, []);

  /**
   * Toggle effect on/off
   */
  const toggleEffect = useCallback((effectName) => {
    updateSetting(`effects.${effectName}.enabled`, !toneSettings.effects[effectName]?.enabled);
  }, [toneSettings, updateSetting]);

  /**
   * Reset to defaults
   */
  const handleReset = useCallback(() => {
    const defaults = getDefaultToneSettings(role);
    setToneSettings(defaults);
    setHasChanges(true);
  }, [role]);

  /**
   * Save settings
   */
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(member.id, toneSettings);
    }
    setHasChanges(false);
  }, [member.id, toneSettings, onSave]);

  /**
   * Format effect parameter value for display
   */
  const formatValue = (value, type) => {
    if (type === 'frequency') {
      return `${Math.round(value)} Hz`;
    }
    if (type === 'time') {
      return value;
    }
    if (type === 'ratio') {
      return `${value}:1`;
    }
    if (type === 'threshold') {
      return `${value} dB`;
    }
    return typeof value === 'number' ? value.toFixed(2) : value;
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#0a0a0a',
      border: '2px solid #0ff',
      borderRadius: '8px',
      color: '#fff',
      maxWidth: '700px',
      maxHeight: '90vh',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', color: '#0ff' }}>🎛️ Tone Settings</h2>
          <p style={{ margin: 0, fontSize: '0.9em', color: '#888' }}>
            {member.name} - {instrument}
          </p>
        </div>
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

      {/* Volume Control */}
      <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#111', borderRadius: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Volume2 size={20} color="#0ff" />
          <label style={{ fontWeight: 'bold', color: '#0ff' }}>Volume</label>
          <span style={{ marginLeft: 'auto', fontFamily: 'monospace', color: '#888' }}>
            {Math.round(toneSettings.volume * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={toneSettings.volume}
          onChange={(e) => updateSetting('volume', parseFloat(e.target.value))}
          style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#222',
            borderRadius: '3px',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75em', color: '#666', marginTop: '5px' }}>
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Effects */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ color: '#0ff', marginBottom: '15px', fontSize: '1.1em' }}>Effects</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {availableEffects.map(effectName => {
            const effect = toneSettings.effects[effectName] || {};
            const enabled = effect.enabled || false;
            
            return (
              <div
                key={effectName}
                style={{
                  padding: '15px',
                  backgroundColor: enabled ? '#1a1a2e' : '#111',
                  border: `2px solid ${enabled ? '#0ff' : '#333'}`,
                  borderRadius: '4px',
                  transition: 'all 0.2s'
                }}
              >
                {/* Effect Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: enabled ? '15px' : '0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {effectName === 'reverb' && <Waves size={18} color={enabled ? '#0ff' : '#666'} />}
                    {effectName === 'distortion' && <Zap size={18} color={enabled ? '#0ff' : '#666'} />}
                    {effectName === 'delay' && <Radio size={18} color={enabled ? '#0ff' : '#666'} />}
                    {effectName === 'chorus' && <Waves size={18} color={enabled ? '#0ff' : '#666'} />}
                    {effectName === 'filter' && <Filter size={18} color={enabled ? '#0ff' : '#666'} />}
                    {effectName === 'compression' && <Zap size={18} color={enabled ? '#0ff' : '#666'} />}
                    <label style={{ fontWeight: 'bold', color: enabled ? '#0ff' : '#888', textTransform: 'capitalize' }}>
                      {effectName}
                    </label>
                  </div>
                  <button
                    onClick={() => toggleEffect(effectName)}
                    style={{
                      padding: '5px 15px',
                      backgroundColor: enabled ? '#0ff' : '#333',
                      color: enabled ? '#000' : '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '0.85em'
                    }}
                  >
                    {enabled ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Effect Parameters */}
                {enabled && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #333' }}>
                    {effectName === 'reverb' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Wet Mix: {Math.round((effect.wet || 0) * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={effect.wet || 0.2}
                            onChange={(e) => updateSetting(`effects.${effectName}.wet`, parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Room Size: {(effect.roomSize || 0.4).toFixed(2)}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={effect.roomSize || 0.4}
                            onChange={(e) => updateSetting(`effects.${effectName}.roomSize`, parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    )}

                    {effectName === 'distortion' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Amount: {(effect.amount || 0.3).toFixed(2)}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={effect.amount || 0.3}
                            onChange={(e) => updateSetting(`effects.${effectName}.amount`, parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Wet Mix: {Math.round((effect.wet || 0) * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={effect.wet || 0.3}
                            onChange={(e) => updateSetting(`effects.${effectName}.wet`, parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    )}

                    {effectName === 'delay' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Delay Time: {effect.delayTime || '8n'}
                          </label>
                          <select
                            value={effect.delayTime || '8n'}
                            onChange={(e) => updateSetting(`effects.${effectName}.delayTime`, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              backgroundColor: '#222',
                              color: '#fff',
                              border: '1px solid #444',
                              borderRadius: '4px'
                            }}
                          >
                            <option value="4n">Quarter Note</option>
                            <option value="8n">Eighth Note</option>
                            <option value="16n">Sixteenth Note</option>
                            <option value="8t">Eighth Triplet</option>
                            <option value="16t">Sixteenth Triplet</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Feedback: {Math.round((effect.feedback || 0) * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="0.9"
                            step="0.01"
                            value={effect.feedback || 0.2}
                            onChange={(e) => updateSetting(`effects.${effectName}.feedback`, parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Wet Mix: {Math.round((effect.wet || 0) * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={effect.wet || 0.15}
                            onChange={(e) => updateSetting(`effects.${effectName}.wet`, parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    )}

                    {effectName === 'chorus' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Frequency: {(effect.frequency || 1.5).toFixed(1)} Hz
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="5"
                            step="0.1"
                            value={effect.frequency || 1.5}
                            onChange={(e) => updateSetting(`effects.${effectName}.frequency`, parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Depth: {(effect.depth || 0.6).toFixed(2)}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={effect.depth || 0.6}
                            onChange={(e) => updateSetting(`effects.${effectName}.depth`, parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Wet Mix: {Math.round((effect.wet || 0) * 100)}%
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={effect.wet || 0.2}
                            onChange={(e) => updateSetting(`effects.${effectName}.wet`, parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    )}

                    {effectName === 'filter' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Frequency: {formatValue(effect.frequency || 8000, 'frequency')}
                          </label>
                          <input
                            type="range"
                            min="200"
                            max="20000"
                            step="100"
                            value={effect.frequency || 8000}
                            onChange={(e) => updateSetting(`effects.${effectName}.frequency`, parseInt(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Type
                          </label>
                          <select
                            value={effect.type || 'lowpass'}
                            onChange={(e) => updateSetting(`effects.${effectName}.type`, e.target.value)}
                            style={{
                              width: '100%',
                              padding: '8px',
                              backgroundColor: '#222',
                              color: '#fff',
                              border: '1px solid #444',
                              borderRadius: '4px'
                            }}
                          >
                            <option value="lowpass">Low Pass</option>
                            <option value="highpass">High Pass</option>
                            <option value="bandpass">Band Pass</option>
                            <option value="notch">Notch</option>
                          </select>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Q (Resonance): {(effect.Q || 1).toFixed(1)}
                          </label>
                          <input
                            type="range"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={effect.Q || 1}
                            onChange={(e) => updateSetting(`effects.${effectName}.Q`, parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    )}

                    {effectName === 'compression' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Threshold: {formatValue(effect.threshold || -20, 'threshold')}
                          </label>
                          <input
                            type="range"
                            min="-40"
                            max="0"
                            step="1"
                            value={effect.threshold || -20}
                            onChange={(e) => updateSetting(`effects.${effectName}.threshold`, parseInt(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Ratio: {formatValue(effect.ratio || 4, 'ratio')}
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="20"
                            step="0.5"
                            value={effect.ratio || 4}
                            onChange={(e) => updateSetting(`effects.${effectName}.ratio`, parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Attack: {(effect.attack || 0.003).toFixed(3)}s
                          </label>
                          <input
                            type="range"
                            min="0.001"
                            max="0.1"
                            step="0.001"
                            value={effect.attack || 0.003}
                            onChange={(e) => updateSetting(`effects.${effectName}.attack`, parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                            Release: {(effect.release || 0.1).toFixed(2)}s
                          </label>
                          <input
                            type="range"
                            min="0.01"
                            max="1"
                            step="0.01"
                            value={effect.release || 0.1}
                            onChange={(e) => updateSetting(`effects.${effectName}.release`, parseFloat(e.target.value))}
                            style={{ width: '100%' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button
          onClick={handleReset}
          style={{
            padding: '10px 20px',
            backgroundColor: '#444',
            color: '#fff',
            border: '1px solid #666',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1
          }}
        >
          <RotateCcw size={16} />
          Reset
        </button>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          style={{
            padding: '10px 20px',
            backgroundColor: hasChanges ? '#0f0' : '#333',
            color: hasChanges ? '#000' : '#666',
            border: 'none',
            borderRadius: '4px',
            cursor: hasChanges ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flex: 1
          }}
        >
          <Save size={16} />
          Save Settings
        </button>
      </div>

      {hasChanges && (
        <p style={{ fontSize: '0.85em', color: '#ff0', marginTop: '10px', textAlign: 'center' }}>
          * You have unsaved changes
        </p>
      )}
    </div>
  );
};
