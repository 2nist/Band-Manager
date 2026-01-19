import React, { useMemo } from 'react';
import { ChevronLeft, Copy, RotateCcw } from 'lucide-react';
import { calculateLogoStyle, ensureFontLoaded } from '../utils/helpers';

/**
 * LogoDesigner - Band logo customization screen
 * 
 * Allows customization of:
 * - Font (Arial, Georgia, Impact, Courier, Trebuchet, Verdana)
 * - Font weight (400-900)
 * - Size (18-72px)
 * - Letter spacing
 * - Line height
 * - Text and background colors
 * - Gradient backgrounds
 * - Shadow effects
 * - Outline effects
 * - Uppercase toggle
 */
export const LogoDesigner = ({ 
  bandName = 'Your Band',
  logoState = {},
  onLogoChange,
  onComplete,
  onBack 
}) => {
  const FONT_OPTIONS = [
    'Arial',
    'Georgia',
    'Impact',
    'Courier New',
    'Trebuchet MS',
    'Verdana',
    'Comic Sans MS'
  ];

  const LOGO_PRESETS = [
    { 
      name: 'Bold Neon', 
      cfg: { logoWeight: 800, logoSize: 36, logoTextColor: '#f472b6', logoBgColor: '#111827', logoShadow: 'strong', logoUpper: true, logoLetter: 1 } 
    },
    { 
      name: 'Retro Wave', 
      cfg: { logoWeight: 700, logoSize: 32, logoTextColor: '#7dd3fc', logoBgColor: '#0f172a', logoBgColor2: '#312e81', logoGradient: true, logoShadow: 'soft', logoLetter: 2 } 
    },
    { 
      name: 'Clean Sans', 
      cfg: { logoWeight: 600, logoSize: 28, logoTextColor: '#e2e8f0', logoBgColor: '#0b1220', logoShadow: 'none', logoLetter: 0, logoUpper: false } 
    },
    { 
      name: 'Outline Pop', 
      cfg: { logoWeight: 800, logoSize: 34, logoTextColor: '#ffffff', logoBgColor: '#0f172a', logoShadow: 'soft', logoOutline: true, logoOutlineColor: '#0ea5e9', logoOutlineWidth: 1.5 } 
    },
    { 
      name: 'Serif Luxe', 
      cfg: { logoWeight: 700, logoSize: 30, logoTextColor: '#fef3c7', logoBgColor: '#111827', logoShadow: 'soft', logoUpper: false, logoLetter: 0.5 } 
    }
  ];

  const logoStyle = useMemo(() => {
    if (logoState.logoFont) {
      ensureFontLoaded(logoState.logoFont);
    }
    return calculateLogoStyle(logoState);
  }, [logoState]);

  const handleLogoChange = (updates) => {
    onLogoChange({ ...logoState, ...updates });
  };

  const applyPreset = (preset) => {
    onLogoChange(preset.cfg);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      padding: '2rem',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        <button
          onClick={onBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(131, 56, 236, 0.3)',
            color: '#fff',
            border: '2px solid rgba(131, 56, 236, 0.3)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '1rem'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.6)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.3)'}
        >
          <ChevronLeft size={18} />
          Back
        </button>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>Logo Designer</h1>
        <div style={{ width: '120px' }} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Preview */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{
            backgroundColor: 'rgba(30, 30, 50, 0.8)',
            borderRadius: '1rem',
            padding: '2rem',
            border: '2px solid rgba(131, 56, 236, 0.3)',
            minHeight: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div
              style={{
                ...logoStyle,
                textAlign: 'center',
                wordBreak: 'break-word',
                maxWidth: '100%'
              }}
            >
              {bandName || 'Your Band'}
            </div>
          </div>

          {/* Presets */}
          <div style={{
            backgroundColor: 'rgba(30, 30, 50, 0.8)',
            borderRadius: '1rem',
            padding: '1.5rem',
            border: '2px solid rgba(131, 56, 236, 0.3)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Quick Presets</h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              {LOGO_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  style={{
                    padding: '0.75rem 1rem',
                    backgroundColor: 'rgba(131, 56, 236, 0.2)',
                    color: '#fff',
                    border: '2px solid rgba(131, 56, 236, 0.3)',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.2)';
                  }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div style={{
          backgroundColor: 'rgba(30, 30, 50, 0.8)',
          borderRadius: '1rem',
          padding: '2rem',
          border: '2px solid rgba(131, 56, 236, 0.3)',
          maxHeight: '800px',
          overflowY: 'auto'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem' }}>Customization</h3>

          {/* Font */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>
              Font
            </label>
            <select
              value={logoState.logoFont || 'Arial'}
              onChange={(e) => handleLogoChange({ logoFont: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(131, 56, 236, 0.3)',
                borderRadius: '0.5rem',
                color: '#fff',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              {FONT_OPTIONS.map((font) => (
                <option key={font} value={font} style={{ backgroundColor: '#1a1a2e', color: '#fff' }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Weight */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Weight</label>
              <span style={{ fontSize: '0.85rem' }}>{logoState.logoWeight || 700}</span>
            </div>
            <select
              value={logoState.logoWeight || 700}
              onChange={(e) => handleLogoChange({ logoWeight: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(131, 56, 236, 0.3)',
                borderRadius: '0.5rem',
                color: '#fff',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              {[400, 500, 600, 700, 800, 900].map((w) => (
                <option key={w} value={w} style={{ backgroundColor: '#1a1a2e' }}>
                  {w}
                </option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Size</label>
              <span style={{ fontSize: '0.85rem' }}>{logoState.logoSize || 32}px</span>
            </div>
            <input
              type="range"
              min="18"
              max="72"
              value={logoState.logoSize || 32}
              onChange={(e) => handleLogoChange({ logoSize: Number(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>

          {/* Letter Spacing */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Letter Spacing</label>
              <span style={{ fontSize: '0.85rem' }}>{logoState.logoLetter || 0}px</span>
            </div>
            <input
              type="range"
              min="-2"
              max="12"
              step="0.5"
              value={logoState.logoLetter || 0}
              onChange={(e) => handleLogoChange({ logoLetter: Number(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>

          {/* Line Height */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Line Height</label>
              <span style={{ fontSize: '0.85rem' }}>{(logoState.logoLineHeight || 1.1).toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.8"
              max="1.6"
              step="0.05"
              value={logoState.logoLineHeight || 1.1}
              onChange={(e) => handleLogoChange({ logoLineHeight: Number(e.target.value) })}
              style={{ width: '100%' }}
            />
          </div>

          {/* Uppercase */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={!!logoState.logoUpper}
                onChange={(e) => handleLogoChange({ logoUpper: e.target.checked })}
              />
              <span style={{ fontSize: '0.9rem' }}>Uppercase</span>
            </label>
          </div>

          {/* Text Color */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
              Text Color
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="color"
                value={logoState.logoTextColor || '#ff6b6b'}
                onChange={(e) => handleLogoChange({ logoTextColor: e.target.value })}
                style={{
                  width: '60px',
                  height: '40px',
                  border: '2px solid rgba(131, 56, 236, 0.3)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                {logoState.logoTextColor || '#ff6b6b'}
              </span>
            </div>
          </div>

          {/* Background Color */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
              Background Color
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="color"
                value={logoState.logoBgColor || '#1a1a2e'}
                onChange={(e) => handleLogoChange({ logoBgColor: e.target.value })}
                style={{
                  width: '60px',
                  height: '40px',
                  border: '2px solid rgba(131, 56, 236, 0.3)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                {logoState.logoBgColor || '#1a1a2e'}
              </span>
            </div>
          </div>

          {/* Gradient */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '0.75rem' }}>
              <input
                type="checkbox"
                checked={!!logoState.logoGradient}
                onChange={(e) => handleLogoChange({ logoGradient: e.target.checked })}
              />
              <span style={{ fontSize: '0.9rem' }}>Gradient Background</span>
            </label>

            {logoState.logoGradient && (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <label style={{ fontSize: '0.9rem', color: '#aaa' }}>To</label>
                <input
                  type="color"
                  value={logoState.logoBgColor2 || '#1e293b'}
                  onChange={(e) => handleLogoChange({ logoBgColor2: e.target.value })}
                  style={{
                    width: '60px',
                    height: '40px',
                    border: '2px solid rgba(131, 56, 236, 0.3)',
                    borderRadius: '0.5rem',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>
                  {logoState.logoBgColor2 || '#1e293b'}
                </span>
              </div>
            )}
          </div>

          {/* Shadow */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.9rem', color: '#aaa', display: 'block', marginBottom: '0.5rem' }}>
              Shadow Effect
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['none', 'soft', 'strong'].map((sfx) => (
                <button
                  key={sfx}
                  onClick={() => handleLogoChange({ logoShadow: sfx })}
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    backgroundColor: logoState.logoShadow === sfx ? '#ff006e' : 'rgba(131, 56, 236, 0.2)',
                    color: '#fff',
                    border: '2px solid rgba(131, 56, 236, 0.3)',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    textTransform: 'capitalize'
                  }}
                  onMouseEnter={(e) => {
                    if (logoState.logoShadow !== sfx) {
                      e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.5)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (logoState.logoShadow !== sfx) {
                      e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.2)';
                    }
                  }}
                >
                  {sfx}
                </button>
              ))}
            </div>
          </div>

          {/* Outline */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', marginBottom: '0.75rem' }}>
              <input
                type="checkbox"
                checked={!!logoState.logoOutline}
                onChange={(e) => handleLogoChange({ logoOutline: e.target.checked })}
              />
              <span style={{ fontSize: '0.9rem' }}>Text Outline</span>
            </label>

            {logoState.logoOutline && (
              <>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Width</label>
                    <span style={{ fontSize: '0.85rem' }}>{logoState.logoOutlineWidth || 1}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="0.2"
                    value={logoState.logoOutlineWidth || 1}
                    onChange={(e) => handleLogoChange({ logoOutlineWidth: Number(e.target.value) })}
                    style={{ width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <label style={{ fontSize: '0.9rem', color: '#aaa' }}>Color</label>
                  <input
                    type="color"
                    value={logoState.logoOutlineColor || '#000000'}
                    onChange={(e) => handleLogoChange({ logoOutlineColor: e.target.value })}
                    style={{
                      width: '60px',
                      height: '40px',
                      border: '2px solid rgba(131, 56, 236, 0.3)',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  />
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button
              onClick={() => handleLogoChange({})}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                backgroundColor: 'rgba(131, 56, 236, 0.3)',
                color: '#fff',
                border: '2px solid rgba(131, 56, 236, 0.3)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.6)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.3)'}
            >
              <RotateCcw size={16} />
              Reset
            </button>

            <button
              onClick={onComplete}
              style={{
                flex: 2,
                padding: '0.75rem 1rem',
                backgroundColor: '#ff006e',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#ff1975'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#ff006e'}
            >
              Save Logo & Start Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoDesigner;
