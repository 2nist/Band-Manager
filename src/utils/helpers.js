import { FIRST_NAMES, LAST_NAMES } from './constants';
import { getAvatarUrl as getAvataaarsUrl, generateAvatarConfig, getAvatarUrlFromConfig } from './avatarConfig.js';

// Font loading utility
export const ensureFontLoaded = (fontName) => {
  if (!fontName) return;
  const id = `font-${fontName.replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;
  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;700;900&display=swap`;
  document.head.appendChild(link);
};

// Stat clamping and random utilities
export const clampMorale = (value) => Math.max(0, Math.min(100, value));
export const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const randStat = (min = 2.5, max = 6) => Math.round((min + Math.random() * (max - min)) * 10) / 10;
export const clampStat = (v) => Math.max(1, Math.min(10, Math.round(v * 10) / 10));

// Avatar URL generation (enhanced with Avataaars support)
export const getAvatarUrl = (seed, style = 'avataaars', role = null, personality = null) => {
  // Use new Avataaars system by default
  if (style === 'avataaars' || style === 'avataaars-style' || !style) {
    return getAvataaarsUrl(seed, style, role, personality);
  }
  
  // Fallback to original DiceBear system for other styles
  const avatarStyle = style || 'open-peeps';
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hairColors = ['1b1b1b', '2c1810', '8b4513', '4a3728', '000000', '3d2817', '5d4037'];
  const selectedHairColor = hairColors[hash % hairColors.length];
  const baseUrl = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${encodeURIComponent(seed)}`;
  
  if (avatarStyle === 'open-peeps') {
    return `${baseUrl}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  } else {
    const hairVariants = ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10'];
    const selectedHair = hairVariants[hash % hairVariants.length];
    const params = [
      `backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
      `hair=${selectedHair}`,
      `hairColor=${selectedHairColor}`,
      `skinColor=fdbcb4,ffdbac,ffd5dc,ffcccc`
    ];
    return `${baseUrl}&${params.join('&')}`;
  }
};

// Band logo style generation for charts
export const getBandLogoStyle = (bandName, fontOptions = []) => {
  const hash = bandName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const fonts = fontOptions.length > 0 ? fontOptions : [
    'Arial', 'Anton', 'Oswald', 'Metal Mania', 'Righteous', 'Montserrat',
    'Poppins', 'Syncopate', 'Syne', 'Playfair Display', 'Lobster',
    'Abril Fatface', 'Bungee', 'Lora', 'Inter', 'Roboto', 'Space Grotesk'
  ];
  const selectedFont = fonts[hash % fonts.length];
  const useUppercase = (hash % 2) === 0;
  const fontWeight = [600, 700, 800][hash % 3];
  
  if (selectedFont !== 'Arial') {
    ensureFontLoaded(selectedFont);
  }
  
  return {
    background: 'transparent',
    color: '#ffffff',
    fontFamily: `'${selectedFont}', Arial, sans-serif`,
    textTransform: useUppercase ? 'uppercase' : 'none',
    fontWeight: fontWeight,
    fontSize: '16px',
    lineHeight: 1.2,
    padding: '2px 4px',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%'
  };
};

// Member building utilities
export const buildMember = (role, personalities = []) => {
  const firstName = randomFrom(FIRST_NAMES);
  const lastName = randomFrom(LAST_NAMES);
  const personality = personalities.length ? randomFrom(personalities) : 'steady';
  const stats = {
    skill: randStat(2.5, 6),
    creativity: randStat(2.5, 6),
    stagePresence: randStat(2, 5.5),
    reliability: randStat(2.5, 6),
    morale: randStat(3, 6.5),
    drama: randStat(2.5, 6)
  };
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const fullName = `${firstName} ${lastName}`;
  
  // Generate avatar config based on name and personality
  const avatarConfig = generateAvatarConfig(fullName, personality);
  const roleArchetype = { drummer: 'drummer', guitarist: 'guitarist', 'lead-guitar': 'guitarist', 'rhythm-guitar': 'guitarist', bassist: 'guitarist', vocalist: 'vocalist', keyboardist: 'synth-nerd', synth: 'synth-nerd', producer: 'producer', vocal: 'vocalist', guitar: 'guitarist', bass: 'guitarist', drums: 'drummer', keyboard: 'synth-nerd', production: 'producer' }[String(role)] ?? undefined;

  return {
    id,
    role,
    firstName,
    lastName,
    nickname: '',
    personality,
    stats,
    name: fullName,
    avatarSeed: fullName,
    avatarArchetype: roleArchetype,
    avatarStyle: 'avataaars',
    avatarConfig: avatarConfig
  };
};

export const memberDisplayName = (m) => {
  const base = [m.firstName, m.lastName].filter(Boolean).join(' ').trim();
  return m.nickname?.trim() || base || m.name || 'Bandmate';
};

// Logo style calculation (for useMemo)
export const calculateLogoStyle = (logoState) => {
  const bg = logoState.logoGradient
    ? `linear-gradient(135deg, ${logoState.logoBgColor}, ${logoState.logoBgColor2 || logoState.logoBgColor})`
    : logoState.logoBgColor;
  // Calculate shadow with custom color support
  let shadow = 'none';
  if (logoState.logoShadow && logoState.logoShadow !== 'none') {
    const shadowColor = logoState.logoShadowColor || '#000000';
    // Convert hex to rgba for shadow
    const hexToRgba = (hex, alpha) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };
    if (logoState.logoShadow === 'soft') {
      shadow = `0 2px 6px ${hexToRgba(shadowColor, 0.35)}`;
    } else if (logoState.logoShadow === 'strong') {
      shadow = `0 4px 12px ${hexToRgba(shadowColor, 0.5)}`;
    }
  }
  const outline = logoState.logoOutline
    ? `${logoState.logoOutlineWidth || 1}px ${logoState.logoOutlineColor || '#000'}`
    : null;
  return {
    background: bg,
    color: logoState.logoTextColor,
    fontFamily: `'${logoState.logoFont}', Arial, sans-serif`,
    textTransform: logoState.logoUpper ? 'uppercase' : 'none',
    fontWeight: logoState.logoWeight || 700,
    fontSize: `${logoState.logoSize || 28}px`,
    letterSpacing: `${logoState.logoLetter || 0}px`,
    lineHeight: logoState.logoLineHeight || 1.1,
    textShadow: shadow,
    WebkitTextStroke: outline,
    fontVariationSettings: `'wght' ${logoState.logoWeight || 700}`
  };
};
