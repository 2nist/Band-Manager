import React, { useMemo, useState } from 'react';
import { ChevronLeft, Copy, RotateCcw } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { calculateLogoStyle, ensureFontLoaded } from '../utils/helpers';

/**
 * LogoDesigner - Band logo customization screen
 * 
 * Allows customization of:
 * - Font (18+ Google Fonts optimized for logos)
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
    { name: 'Metal Mania', family: 'Metal Mania' },
    { name: 'New Rocker', family: 'New Rocker' },
    { name: 'Creepster', family: 'Creepster' },
    { name: 'Russo One', family: 'Russo One' },
    { name: 'Ultra', family: 'Ultra' },
    { name: 'Shojumaru', family: 'Shojumaru' },
    { name: 'Pirata One', family: 'Pirata One' },
    { name: 'Road Rage', family: 'Road Rage' },
    { name: 'Permanent Marker', family: 'Permanent Marker' },
    { name: 'Bangers', family: 'Bangers' },
    { name: 'Space Grotesk', family: 'Space Grotesk' },
    { name: 'Bungee', family: 'Bungee' },
    { name: 'Righteous', family: 'Righteous' },
    { name: 'DotGothic16', family: 'DotGothic16' },
    { name: 'Tourney', family: 'Tourney' },
    { name: 'Exo 2', family: 'Exo 2' },
    { name: 'RocknRoll One', family: 'RocknRoll One' },
    { name: 'Bebas Neue', family: 'Bebas Neue' },
    { name: 'Anton', family: 'Anton' },
    { name: 'Oswald', family: 'Oswald' }
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

  const [showFontGallery, setShowFontGallery] = useState(false);

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
    <div className="min-h-screen bg-background text-foreground overflow-auto p-4">
      {/* Header - Compact */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3 py-2 bg-secondary/10 border border-secondary/30 rounded-lg text-foreground hover:bg-secondary/20 transition-all text-sm"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <h1 className="text-2xl font-bold text-primary">Logo Designer</h1>
        <div className="w-24" />
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-7xl mx-auto">
        {/* Preview - Left Column */}
        <div className="col-span-1 flex flex-col gap-3">
          <Card className="rounded-lg p-4 h-48 flex items-center justify-center shadow-lg" style={{ borderColor: 'var(--border)' }}>
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
          </Card>

          {/* Presets - Compact */}
          <Card className="rounded-lg p-3 shadow-lg" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold mb-2 text-foreground">Quick Presets</h3>
            <div className="space-y-1">
              {LOGO_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className="w-full px-2 py-1.5 bg-primary/10 border border-primary/30 rounded text-foreground text-left hover:bg-primary/20 hover:border-primary/50 transition-all text-xs"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Controls - Middle & Right Columns */}
        <Card className="col-span-2 rounded-lg p-4 shadow-lg overflow-y-auto max-h-[calc(100vh-120px)]">
          <h3 className="text-lg font-bold mb-3 text-foreground">Customization</h3>
          
          {/* Two-column grid for controls */}
          <div className="grid grid-cols-2 gap-4">

            {/* Font - Full Width */}
            <div className="col-span-2">
              <label className="block text-xs font-semibold mb-2 text-muted-foreground">
                Font
              </label>
              <button
                onClick={() => setShowFontGallery(!showFontGallery)}
                className="w-full px-3 py-2 bg-input border border-border rounded text-foreground text-left hover:border-primary/50 transition-all text-sm"
              >
                {logoState.logoFont || 'Metal Mania'} {showFontGallery ? '▼' : '▶'}
              </button>

              {showFontGallery && (
                <div className="mt-2 bg-muted/20 border border-primary/30 rounded p-3 max-h-64 overflow-y-auto grid grid-cols-3 gap-2">
                  {FONT_OPTIONS.map((font) => (
                    <button
                      key={font.family}
                      onClick={() => {
                        handleLogoChange({ logoFont: font.family });
                        setShowFontGallery(false);
                      }}
                      className={`p-2 rounded cursor-pointer transition-all text-center ${
                        logoState.logoFont === font.family
                          ? 'bg-primary/20 border-2 border-primary'
                          : 'bg-muted/10 border-2 border-border/30 hover:bg-muted/20'
                      }`}
                    >
                      <div
                        style={{
                          fontFamily: font.family,
                          fontSize: '14px',
                          fontWeight: 700,
                          color: 'var(--primary)',
                          marginBottom: '0.25rem',
                          wordBreak: 'break-word'
                        }}
                      >
                        {bandName.substring(0, 10)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {font.name}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Weight */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-muted-foreground">Weight</label>
                <span className="text-xs">{logoState.logoWeight || 700}</span>
              </div>
              <select
                value={logoState.logoWeight || 700}
                onChange={(e) => handleLogoChange({ logoWeight: Number(e.target.value) })}
                className="w-full px-2 py-1.5 bg-input border border-border rounded text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              >
                {[400, 500, 600, 700, 800, 900].map((w) => (
                  <option key={w} value={w} className="bg-background">
                    {w}
                  </option>
                ))}
              </select>
            </div>

            {/* Size */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-muted-foreground">Size</label>
                <span className="text-xs">{logoState.logoSize || 32}px</span>
              </div>
              <input
                type="range"
                min="18"
                max="72"
                value={logoState.logoSize || 32}
                onChange={(e) => handleLogoChange({ logoSize: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>

            {/* Letter Spacing */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-muted-foreground">Letter Spacing</label>
                <span className="text-xs">{logoState.logoLetter || 0}px</span>
              </div>
              <input
                type="range"
                min="-2"
                max="12"
                step="0.5"
                value={logoState.logoLetter || 0}
                onChange={(e) => handleLogoChange({ logoLetter: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>

            {/* Line Height */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-muted-foreground">Line Height</label>
                <span className="text-xs">{(logoState.logoLineHeight || 1.1).toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.6"
                step="0.05"
                value={logoState.logoLineHeight || 1.1}
                onChange={(e) => handleLogoChange({ logoLineHeight: Number(e.target.value) })}
                className="w-full accent-primary"
              />
            </div>

            {/* Uppercase */}
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!logoState.logoUpper}
                  onChange={(e) => handleLogoChange({ logoUpper: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-xs font-semibold">Uppercase</span>
              </label>
            </div>

            {/* Text Color */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                Text Color
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={logoState.logoTextColor || '#ff6b6b'}
                  onChange={(e) => handleLogoChange({ logoTextColor: e.target.value })}
                  className="w-12 h-8 rounded cursor-pointer border border-border"
                />
                <span className="text-xs font-mono">
                  {logoState.logoTextColor || '#ff6b6b'}
                </span>
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                Background Color
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={logoState.logoBgColor || '#1a1a2e'}
                  onChange={(e) => handleLogoChange({ logoBgColor: e.target.value })}
                  className="w-12 h-8 rounded cursor-pointer border border-border"
                />
                <span className="text-xs font-mono">
                  {logoState.logoBgColor || '#1a1a2e'}
                </span>
              </div>
            </div>

            {/* Gradient */}
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={!!logoState.logoGradient}
                  onChange={(e) => handleLogoChange({ logoGradient: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-xs font-semibold">Gradient Background</span>
              </label>

              {logoState.logoGradient && (
                <div className="flex gap-2 items-center ml-6">
                  <label className="text-xs font-semibold text-muted-foreground">To</label>
                  <input
                    type="color"
                    value={logoState.logoBgColor2 || '#1e293b'}
                    onChange={(e) => handleLogoChange({ logoBgColor2: e.target.value })}
                    className="w-12 h-8 rounded cursor-pointer border border-border"
                  />
                  <span className="text-xs font-mono">
                    {logoState.logoBgColor2 || '#1e293b'}
                  </span>
                </div>
              )}
            </div>

            {/* Shadow */}
            <div className="col-span-2">
              <label className="text-xs font-semibold text-muted-foreground block mb-2">
                Shadow Effect
              </label>
              <div className="flex gap-2">
                {['none', 'soft', 'strong'].map((sfx) => (
                  <button
                    key={sfx}
                    onClick={() => handleLogoChange({ logoShadow: sfx })}
                    className={`flex-1 px-2 py-1.5 rounded text-xs font-semibold transition-all ${
                      logoState.logoShadow === sfx
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {sfx}
                  </button>
                ))}
              </div>
            </div>

            {/* Outline */}
            <div className="col-span-2">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={!!logoState.logoOutline}
                  onChange={(e) => handleLogoChange({ logoOutline: e.target.checked })}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-xs font-semibold">Text Outline</span>
              </label>

              {logoState.logoOutline && (
                <div className="ml-6 space-y-2">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-semibold text-muted-foreground">Width</label>
                      <span className="text-xs">{logoState.logoOutlineWidth || 1}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="4"
                      step="0.2"
                      value={logoState.logoOutlineWidth || 1}
                      onChange={(e) => handleLogoChange({ logoOutlineWidth: Number(e.target.value) })}
                      className="w-full accent-primary"
                    />
                  </div>

                  <div className="flex gap-2 items-center">
                    <label className="text-xs font-semibold text-muted-foreground">Color</label>
                    <input
                      type="color"
                      value={logoState.logoOutlineColor || '#000000'}
                      onChange={(e) => handleLogoChange({ logoOutlineColor: e.target.value })}
                      className="w-12 h-8 rounded cursor-pointer border border-border"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="col-span-2 flex gap-3 mt-4">
              <button
                onClick={() => handleLogoChange({})}
                className="flex-1 px-3 py-2 bg-muted text-muted-foreground border border-muted hover:bg-muted/80 rounded transition-all flex items-center justify-center gap-2 font-semibold text-sm"
              >
                <RotateCcw size={14} />
                Reset
              </button>

              <button
                onClick={onComplete}
                className="flex-1 px-3 py-2 bg-primary text-primary-foreground hover:opacity-90 rounded transition-all font-bold text-sm"
              >
                Save Logo & Start Game
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LogoDesigner;
