/**
 * Avatar Configuration System
 * 
 * Provides Avataaars-style avatar generation using DiceBear API
 * with comprehensive customization options
 */

/**
 * Avataaars customization options
 */
export const AVATAR_OPTIONS = {
  // Hair styles
  hair: [
    'NoHair', 'Eyepatch', 'Hat', 'Hijab', 'Turban', 
    'WinterHat1', 'WinterHat2', 'WinterHat3', 'WinterHat4',
    'LongHairBigHair', 'LongHairBob', 'LongHairBun', 'LongHairCurly',
    'LongHairCurvy', 'LongHairDreads', 'LongHairFrida', 'LongHairFro',
    'LongHairFroBand', 'LongHairNotTooLong', 'LongHairShavedSides',
    'LongHairMiaWallace', 'LongHairStraight', 'LongHairStraight2',
    'LongHairStraightStrand', 'ShortHairDreads01', 'ShortHairDreads02',
    'ShortHairFrizzle', 'ShortHairShaggyMullet', 'ShortHairShortCurly',
    'ShortHairShortFlat', 'ShortHairShortRound', 'ShortHairShortWaved',
    'ShortHairSides', 'ShortHairTheCaesar', 'ShortHairTheCaesarSidePart'
  ],
  
  // Hair colors
  hairColor: [
    'Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark',
    'PastelPink', 'Blue', 'Platinum', 'Red', 'SilverGray'
  ],
  
  // Accessories
  accessories: [
    'Blank', 'Kurt', 'Prescription01', 'Prescription02', 
    'Round', 'Sunglasses', 'Wayfarers'
  ],
  
  // Facial hair
  facialHair: [
    'Blank', 'BeardMedium', 'BeardLight', 'BeardMajestic',
    'MoustacheFancy', 'MoustacheMagnum'
  ],
  
  // Clothing
  clothing: [
    'BlazerShirt', 'BlazerSweater', 'CollarSweater', 'GraphicShirt',
    'Hoodie', 'Overall', 'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck'
  ],
  
  // Clothing colors
  clothingColor: [
    'Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02',
    'Heather', 'PastelBlue', 'PastelGreen', 'PastelOrange',
    'PastelRed', 'PastelYellow', 'Pink', 'Red', 'White'
  ],
  
  // Eye types
  eyes: [
    'Close', 'Cry', 'Default', 'Dizzy', 'EyeRoll', 'Happy', 'Hearts',
    'Side', 'Squint', 'Surprised', 'Wink', 'WinkWacky'
  ],
  
  // Eyebrow types
  eyebrows: [
    'Angry', 'AngryNatural', 'Default', 'DefaultNatural', 'FlatNatural',
    'RaisedExcited', 'SadConcerned', 'UnibrowNatural', 'UpDown', 'UpDownNatural'
  ],
  
  // Mouth types
  mouth: [
    'Concerned', 'Default', 'Disbelief', 'Eating', 'Grimace', 'Sad',
    'ScreamOpen', 'Serious', 'Smile', 'Tongue', 'Twinkle', 'Vomit'
  ],
  
  // Skin colors
  skin: [
    'Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black'
  ]
};

/**
 * Generate deterministic avatar config from seed
 */
export function generateAvatarConfig(seed, personality = null) {
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Base config
  const config = {
    hair: AVATAR_OPTIONS.hair[hash % AVATAR_OPTIONS.hair.length],
    hairColor: AVATAR_OPTIONS.hairColor[hash % AVATAR_OPTIONS.hairColor.length],
    accessories: AVATAR_OPTIONS.accessories[(hash * 2) % AVATAR_OPTIONS.accessories.length],
    facialHair: AVATAR_OPTIONS.facialHair[(hash * 3) % AVATAR_OPTIONS.facialHair.length],
    clothing: AVATAR_OPTIONS.clothing[(hash * 4) % AVATAR_OPTIONS.clothing.length],
    clothingColor: AVATAR_OPTIONS.clothingColor[(hash * 5) % AVATAR_OPTIONS.clothingColor.length],
    eyes: AVATAR_OPTIONS.eyes[(hash * 6) % AVATAR_OPTIONS.eyes.length],
    eyebrows: AVATAR_OPTIONS.eyebrows[(hash * 7) % AVATAR_OPTIONS.eyebrows.length],
    mouth: AVATAR_OPTIONS.mouth[(hash * 8) % AVATAR_OPTIONS.mouth.length],
    skin: AVATAR_OPTIONS.skin[hash % AVATAR_OPTIONS.skin.length]
  };
  
  // Personality-based adjustments
  if (personality) {
    if (personality.includes('rebellious') || personality.includes('punk')) {
      config.hair = 'LongHairDreads';
      config.accessories = 'Sunglasses';
      config.clothing = 'GraphicShirt';
      config.clothingColor = 'Black';
    } else if (personality.includes('professional') || personality.includes('jazz')) {
      config.clothing = 'BlazerShirt';
      config.accessories = 'Prescription01';
      config.hair = 'ShortHairShortFlat';
    } else if (personality.includes('rock') || personality.includes('metal')) {
      config.hair = 'LongHairStraight';
      config.facialHair = 'BeardMedium';
      config.clothing = 'Hoodie';
    }
  }
  
  return config;
}

/**
 * Generate random avatar config
 */
export function generateRandomAvatarConfig(personality = null) {
  const randomSeed = Math.random().toString(36).substring(7);
  return generateAvatarConfig(randomSeed, personality);
}

/**
 * Get avatar URL from config using DiceBear Avataaars style
 */
export function getAvatarUrlFromConfig(config, size = 200) {
  const params = new URLSearchParams({
    seed: `${config.hair}-${config.hairColor}-${config.skin}`,
    top: config.hair,
    hairColor: config.hairColor,
    accessoriesType: config.accessories,
    facialHairType: config.facialHair,
    facialHairColor: config.hairColor,
    clotheType: config.clothing,
    clotheColor: config.clothingColor,
    eyeType: config.eyes,
    eyebrowType: config.eyebrows,
    mouthType: config.mouth,
    skinColor: config.skin,
    size: size.toString()
  });
  
  return `https://api.dicebear.com/7.x/avataaars/svg?${params.toString()}`;
}

/**
 * Get avatar URL (backward compatible with existing system)
 */
export function getAvatarUrl(seed, style = 'avataaars', role = null, personality = null) {
  if (style === 'avataaars' || style === 'avataaars-style') {
    const config = generateAvatarConfig(seed, personality);
    return getAvatarUrlFromConfig(config);
  }
  
  // Fallback to original DiceBear system
  const avatarStyle = style || 'open-peeps';
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseUrl = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${encodeURIComponent(seed)}`;
  
  if (avatarStyle === 'open-peeps') {
    return `${baseUrl}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
  }
  
  return baseUrl;
}
