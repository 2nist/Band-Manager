/**
 * Enhanced Avatar Builder
 * 
 * Creates unique, music-style avatars with extensive customization
 * Much more variety than DiceBear while maintaining visual coherence
 * 
 * Now uses procedural canvas-based avatar generation for police-sketch style
 */

import React from 'react';
import { AvatarCanvas } from '../AvatarCanvas.jsx';

// Face shape variations (SVG paths or CSS-based)
const FACE_SHAPES = ['oval', 'round', 'square', 'heart', 'diamond', 'long', 'wide'];

// Skin tone palette (15 realistic variations)
const SKIN_TONES = [
  '#FDBCB4', '#F8A27B', '#E8996B', '#D08B5B', '#C1785A',
  '#A5694F', '#8B5A3C', '#6F4E37', '#5C4033', '#4A3428',
  '#3D2B1F', '#2F1F15', '#1F140D', '#1A0F08', '#0F0805'
];

// Hair styles (50+ options including music subcultures)
const HAIR_STYLES = {
  natural: ['short_neat', 'medium_wavy', 'long_straight', 'curly', 'afro', 'braids'],
  punk: ['mohawk', 'spiky', 'shaved_sides', 'liberty_spikes', 'faux_hawk'],
  metal: ['long_straight', 'long_wavy', 'shaved', 'wild_long'],
  rock: ['medium_shaggy', 'long_wavy', 'curly_long', 'mullet'],
  jazz: ['slicked_back', 'short_neat', 'pompadour', 'fedora'],
  alternative: ['undercut', 'fade', 'buzz', 'textured']
};

// Hair colors (natural + creative)
const HAIR_COLORS = {
  natural: ['black', 'dark_brown', 'brown', 'light_brown', 'blonde', 'red', 'auburn', 'gray'],
  creative: ['bright_green', 'bright_blue', 'bright_pink', 'purple', 'orange', 'yellow', 'white', 'rainbow']
};

// Clothing styles by genre
const CLOTHING_STYLES = {
  Metal: ['band_tee', 'leather_jacket', 'denim_vest', 'black_jeans'],
  Jazz: ['suit', 'dress_shirt', 'vintage_blazer', 'dress'],
  Punk: ['ripped_jeans', 'band_tee', 'leather_jacket', 'patches'],
  Rock: ['band_tee', 'jeans', 'leather', 'flannel'],
  default: ['casual', 'band_tee', 'jeans', 'jacket']
};

/**
 * Enhanced Avatar Component
 * 
 * Uses procedural canvas-based generation for police-sketch style avatars
 */
export const EnhancedAvatar = ({
  traits,
  expression = 'neutral',
  size = 'medium',
  showAccessories = true,
  seed
}) => {
  // Extract role for archetype mapping
  const role = traits?.role;

  const sizeMap = {
    small: 128,
    medium: 192,
    large: 256,
    xlarge: 384
  };

  // Generate seed from traits if not provided
  const avatarSeed = seed || generateSeedFromTraits(traits);

  // Map role to archetype for weighted feature selection
  const archetype = role ? mapRoleToArchetype(role) : undefined;

  // Debug logging
  if (!avatarSeed || avatarSeed === Date.now()) {
    console.warn('[EnhancedAvatar] Using fallback seed, traits:', traits);
  }

  return (
    <div className={`enhanced-avatar relative`} style={{ width: sizeMap[size], height: sizeMap[size] }}>
      <AvatarCanvas
        seed={avatarSeed}
        archetype={archetype}
        size={sizeMap[size]}
        className="w-full h-full"
      />
    </div>
  );
};

/**
 * Generate numeric seed from traits
 */
function generateSeedFromTraits(traits) {
  if (!traits) return Date.now();
  
  // Use seed from traits if available, otherwise generate from traits
  if (traits?.seed) {
    // If seed is a string, hash it; if number, use directly
    if (typeof traits.seed === 'number') {
      return traits.seed;
    }
    // Hash string seed
    let hash = 0;
    for (let i = 0; i < traits.seed.length; i++) {
      const char = traits.seed.codePointAt(i) || 0;
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash) || Date.now();
  }
  
  // Generate from trait values
  const seedString = [
    traits?.faceShape || '',
    traits?.hairStyle || '',
    traits?.hairColor || '',
    traits?.gender || '',
    traits?.role || '',
    traits?.age || 25
  ].join('-');
  
  // Simple hash
  let hash = 0;
  for (let i = 0; i < seedString.length; i++) {
    const char = seedString.codePointAt(i) || 0;
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash) || Date.now();
}

/**
 * Map role to archetype for feature weighting
 * Based on art bible archetypes: synth-nerd, drummer, guitarist, vocalist, producer
 */
function mapRoleToArchetype(role) {
  const roleMap = {
    'drummer': 'drummer',
    'guitarist': 'guitarist',
    'lead-guitar': 'guitarist',
    'rhythm-guitar': 'guitarist',
    'bassist': 'guitarist',
    'vocalist': 'vocalist',
    'keyboardist': 'synth-nerd',
    'synth': 'synth-nerd',
    'synth-nerd': 'synth-nerd',
    'producer': 'producer',
    'dj': 'producer',
    'engineer': 'producer'
  };
  
  return roleMap[role?.toLowerCase()];
}

// Legacy SVG-based avatar (kept for backward compatibility if needed)
export const LegacySVGAvatar = ({
  traits,
  expression = 'neutral',
  size = 'medium',
  showAccessories = true
}) => {
  const {
    faceShape = 'oval',
    skinTone = 7,
    age = 25,
    gender = 'non-binary',
    hairStyle = 'medium_wavy',
    hairColor = 'brown',
    clothingStyle = 'casual',
    accessories = [],
    mood = 'neutral'
  } = traits || {};

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
    xlarge: 'w-48 h-48'
  };

  const skinColor = SKIN_TONES[Math.min(skinTone - 1, SKIN_TONES.length - 1)] || SKIN_TONES[7];

  return (
    <div className={`enhanced-avatar ${sizeClasses[size]} relative`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
      >
        {/* Face */}
        <ellipse
          cx="50"
          cy="50"
          rx={getFaceWidth(faceShape)}
          ry={getFaceHeight(faceShape)}
          fill={skinColor}
          className="face-base"
        />
        
        {/* Hair */}
        {renderHair(hairStyle, hairColor, faceShape, gender)}
        
        {/* Eyes */}
        {renderEyes(expression, age, gender)}
        
        {/* Nose */}
        {renderNose(faceShape, age)}
        
        {/* Mouth */}
        {renderMouth(expression, mood)}
        
        {/* Accessories */}
        {showAccessories && accessories.map((acc, idx) => renderAccessory(acc, idx))}
        
        {/* Clothing indicator (if visible) */}
        {size === 'large' || size === 'xlarge' && renderClothing(clothingStyle)}
      </svg>
      
      {/* Expression overlay for mood */}
      {expression !== 'neutral' && (
        <div className={`expression-overlay expression-${expression}`} />
      )}
    </div>
  );
};

function getFaceWidth(shape) {
  const widths = {
    oval: 35,
    round: 38,
    square: 40,
    heart: 36,
    diamond: 34,
    long: 32,
    wide: 42
  };
  return widths[shape] || 35;
}

function getFaceHeight(shape) {
  const heights = {
    oval: 45,
    round: 38,
    square: 40,
    heart: 42,
    diamond: 48,
    long: 50,
    wide: 38
  };
  return heights[shape] || 45;
}

function renderHair(style, color, faceShape, gender) {
  const hairColorMap = {
    black: '#1a1a1a',
    dark_brown: '#3d2817',
    brown: '#6b4423',
    light_brown: '#8b6914',
    blonde: '#d4a574',
    red: '#8b4513',
    bright_green: '#00ff00',
    bright_blue: '#0066ff',
    bright_pink: '#ff00ff',
    purple: '#800080',
    gray: '#808080'
  };
  
  const hairColorValue = hairColorMap[color] || hairColorMap.brown;
  
  // Simplified hair rendering - can be expanded
  if (style.includes('long')) {
    return (
      <path
        d="M 20 30 Q 30 15, 50 20 Q 70 15, 80 30 L 75 10 L 25 10 Z"
        fill={hairColorValue}
        className="hair"
      />
    );
  } else if (style.includes('short') || style.includes('neat')) {
    return (
      <ellipse
        cx="50"
        cy="25"
        rx="38"
        ry="20"
        fill={hairColorValue}
        className="hair"
      />
    );
  } else if (style.includes('mohawk') || style.includes('spiky')) {
    return (
      <path
        d="M 40 15 L 50 5 L 60 15 L 55 20 L 45 20 Z"
        fill={hairColorValue}
        className="hair"
      />
    );
  }
  
  // Default medium hair
  return (
    <ellipse
      cx="50"
      cy="28"
      rx="36"
      ry="18"
      fill={hairColorValue}
      className="hair"
    />
  );
}

function renderEyes(expression, age, gender) {
  const eyeY = age > 30 ? 42 : 40;
  const eyeSize = expression === 'focused' ? 4 : 3;
  
  return (
    <>
      {/* Left Eye */}
      <ellipse cx="38" cy={eyeY} rx={eyeSize} ry="2" fill="#1a1a1a" />
      {/* Right Eye */}
      <ellipse cx="62" cy={eyeY} rx={eyeSize} ry="2" fill="#1a1a1a" />
      {/* Eye shine */}
      <circle cx="39" cy={eyeY - 1} r="1" fill="#fff" opacity="0.8" />
      <circle cx="61" cy={eyeY - 1} r="1" fill="#fff" opacity="0.8" />
    </>
  );
}

function renderNose(faceShape, age) {
  const noseY = age > 30 ? 50 : 48;
  const noseSize = age > 40 ? 3 : 2.5;
  
  return (
    <ellipse
      cx="50"
      cy={noseY}
      rx={noseSize}
      ry="4"
      fill="none"
      stroke="#8b6914"
      strokeWidth="0.5"
      opacity="0.3"
    />
  );
}

function renderMouth(expression, mood) {
  const mouthY = 58;
  
  if (expression === 'confident' || mood === 'confident') {
    // Smile
    return (
      <path
        d={`M 42 ${mouthY} Q 50 ${mouthY + 4}, 58 ${mouthY}`}
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    );
  } else if (expression === 'intense' || mood === 'intense') {
    // Neutral/straight
    return (
      <line
        x1="42"
        y1={mouthY}
        x2="58"
        y2={mouthY}
        stroke="#1a1a1a"
        strokeWidth="1.5"
      />
    );
  } else {
    // Slight smile
    return (
      <path
        d={`M 42 ${mouthY} Q 50 ${mouthY + 2}, 58 ${mouthY}`}
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="1"
        strokeLinecap="round"
      />
    );
  }
}

function renderAccessory(accessory, index) {
  const accessories = {
    glasses: (
      <g key="glasses">
        <ellipse cx="38" cy="40" rx="8" ry="6" fill="none" stroke="#333" strokeWidth="1" />
        <ellipse cx="62" cy="40" rx="8" ry="6" fill="none" stroke="#333" strokeWidth="1" />
        <line x1="46" y1="40" x2="54" y2="40" stroke="#333" strokeWidth="1" />
      </g>
    ),
    piercings: (
      <g key="piercings">
        <circle cx="38" cy="40" r="1" fill="#ffd700" />
        <circle cx="62" cy="40" r="1" fill="#ffd700" />
      </g>
    ),
    tattoos: (
      <g key="tattoos" opacity="0.6">
        <path d="M 30 45 Q 35 50, 30 55" stroke="#1a1a1a" strokeWidth="1" fill="none" />
      </g>
    )
  };
  
  return accessories[accessory] || null;
}

function renderClothing(style) {
  // Simplified clothing indicator
  return (
    <rect
      x="25"
      y="75"
      width="50"
      height="20"
      fill="#444"
      className="clothing-indicator"
      opacity="0.5"
    />
  );
}

/**
 * Generate avatar traits procedurally
 */
export function generateAvatarTraits(genre, role, personality, seed = '') {
  // This would use SeededRandom for consistency
  // For now, return a structure that can be used
  return {
    faceShape: 'oval',
    skinTone: 7,
    age: 25,
    gender: 'non-binary',
    hairStyle: 'medium_wavy',
    hairColor: 'brown',
    clothingStyle: 'casual',
    accessories: [],
    mood: personality?.primary || 'neutral',
    expression: 'neutral'
  };
}

export default EnhancedAvatar;
