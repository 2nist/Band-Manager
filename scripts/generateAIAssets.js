/**
 * Generate AI-Generated Avatar Assets
 * 
 * This script generates police-sketch style avatar assets using AI image generation.
 * Note: This requires manual execution as AI image generation needs to be done
 * through the generate_image tool in the conversation.
 * 
 * This file serves as a reference for which assets need to be generated.
 */

// Complete list of all assets that need to be generated
export const ASSETS_TO_GENERATE = {
  paper: ['paper_1.png'],
  heads: ['head_1.png', 'head_2.png', 'head_3.png', 'head_4.png', 'head_5.png'],
  eyes: [
    'eyes_tired_01.png', 'eyes_tired_02.png', 'eyes_tired_03.png',
    'eyes_narrow_01.png', 'eyes_narrow_02.png',
    'eyes_heavyLid_01.png', 'eyes_heavyLid_02.png',
    'eyes_squinting_01.png', 'eyes_squinting_02.png',
    'eyes_open_01.png', 'eyes_open_02.png', 'eyes_wide_01.png',
    'eyes_neutral_01.png', 'eyes_neutral_02.png', 'eyes_neutral_03.png',
    'eyes_angry_01.png', 'eyes_intense_01.png',
    'eyes_sad_01.png', 'eyes_droopy_01.png',
    'eyes_asymmetric_01.png'
  ],
  noses: [
    'nose_narrow_01.png', 'nose_narrow_02.png',
    'nose_crooked_left_01.png', 'nose_crooked_left_02.png',
    'nose_crooked_right_01.png', 'nose_crooked_right_02.png',
    'nose_wide_01.png', 'nose_wide_02.png',
    'nose_hooked_01.png', 'nose_hooked_02.png',
    'nose_straight_01.png', 'nose_straight_02.png',
    'nose_prominent_01.png', 'nose_prominent_02.png',
    'nose_neutral_01.png', 'nose_neutral_02.png',
    'nose_upturned_01.png', 'nose_upturned_02.png',
    'nose_button_01.png', 'nose_button_02.png',
    'nose_broken_01.png'
  ],
  mouths: [
    'mouth_flat_01.png', 'mouth_flat_02.png', 'mouth_flat_03.png',
    'mouth_downturned_01.png', 'mouth_downturned_02.png',
    'mouth_smirk_01.png', 'mouth_smirk_02.png',
    'mouth_smirk_left_01.png', 'mouth_smirk_right_01.png',
    'mouth_neutral_01.png', 'mouth_neutral_02.png', 'mouth_neutral_03.png',
    'mouth_thin_01.png', 'mouth_thin_02.png',
    'mouth_wide_01.png', 'mouth_wide_02.png',
    'mouth_smile_01.png', 'mouth_smile_02.png', 'mouth_smile_wide_01.png',
    'mouth_frown_01.png', 'mouth_frown_02.png',
    'mouth_open_01.png', 'mouth_open_02.png', 'mouth_open_singing_01.png',
    'mouth_asymmetric_01.png',
    'mouth_fullLips_01.png', 'mouth_thinLips_01.png'
  ],
  facialHair: [
    'facialHair_patchy_01.png', 'facialHair_patchy_02.png', 'facialHair_patchy_03.png',
    'facialHair_heavyStubble_01.png', 'facialHair_heavyStubble_02.png',
    'facialHair_beard_01.png', 'facialHair_beard_02.png', 'facialHair_beard_03.png',
    'facialHair_beard_long_01.png', 'facialHair_beard_short_01.png',
    'facialHair_stubble_01.png', 'facialHair_stubble_02.png',
    'facialHair_mustache_01.png', 'facialHair_mustache_02.png',
    'facialHair_mustache_thin_01.png', 'facialHair_mustache_thick_01.png',
    'facialHair_goatee_01.png', 'facialHair_goatee_02.png',
    'facialHair_sideburns_01.png', 'facialHair_sideburns_long_01.png'
  ],
  hair: [
    'hair_messy_01.png', 'hair_messy_02.png', 'hair_messy_03.png',
    'hair_pulledBack_01.png', 'hair_pulledBack_02.png',
    'hair_ponytail_01.png', 'hair_bun_01.png',
    'hair_beanie_low_01.png', 'hair_beanie_low_02.png', 'hair_cap_01.png',
    'hair_wild_01.png', 'hair_wild_02.png', 'hair_wild_03.png', 'hair_curly_wild_01.png',
    'hair_clean_01.png', 'hair_clean_02.png', 'hair_clean_03.png', 'hair_short_clean_01.png',
    'hair_bald_01.png', 'hair_bald_02.png',
    'hair_neutral_01.png', 'hair_neutral_02.png', 'hair_neutral_03.png',
    'hair_long_01.png', 'hair_long_02.png', 'hair_long_straight_01.png',
    'hair_short_01.png', 'hair_short_02.png', 'hair_short_spiky_01.png',
    'hair_curly_01.png', 'hair_curly_02.png',
    'hair_wavy_01.png', 'hair_wavy_02.png',
    'hair_mohawk_01.png', 'hair_mohawk_02.png',
    'hair_fade_01.png', 'hair_undercut_01.png'
  ],
  accessories: [
    'accessory_headphones_01.png', 'accessory_headphones_02.png',
    'accessory_headphones_over_ear_01.png',
    'accessory_pencil_behind_ear.png',
    'accessory_glasses_crooked_01.png', 'accessory_glasses_02.png',
    'accessory_glasses_round_01.png', 'accessory_glasses_sunglasses_01.png',
    'accessory_glasses_aviator_01.png',
    'accessory_earplug_01.png', 'accessory_earplug_02.png',
    'accessory_scar_01.png', 'accessory_scar_02.png',
    'accessory_coffee_stain_01.png',
    'accessory_earring_01.png', 'accessory_earring_02.png', 'accessory_earring_stud_01.png',
    'accessory_piercing_nose_01.png', 'accessory_piercing_lip_01.png',
    'accessory_piercing_eyebrow_01.png',
    'accessory_bandana_01.png', 'accessory_headband_01.png'
  ],
  shading: ['shading_1.png', 'shading_2.png']
};

// Helper function to generate description for AI image generation
export function getAssetDescription(filename, category) {
  const baseStyle = 'Police sketch style, black and white pencil drawing, simple line art, transparent background, 512x512 pixels, centered on canvas';
  
  const descriptions = {
    paper: 'White paper texture with subtle grid lines, police sketch pad aesthetic',
    heads: 'Face outline, oval head shape, simple contour lines',
    eyes: {
      tired: 'Two tired eyes with heavy lids, droopy appearance',
      narrow: 'Two narrow eyes, slanted appearance',
      heavyLid: 'Two eyes with heavy upper eyelids',
      squinting: 'Two squinting eyes, partially closed',
      open: 'Two open eyes, alert expression',
      wide: 'Two wide open eyes, surprised expression',
      neutral: 'Two neutral eyes, calm expression',
      angry: 'Two angry eyes, furrowed brows',
      intense: 'Two intense eyes, focused expression',
      sad: 'Two sad eyes, downturned',
      droopy: 'Two droopy eyes, tired appearance',
      asymmetric: 'Two asymmetric eyes, different sizes or positions'
    },
    noses: {
      narrow: 'Narrow nose, thin profile',
      crooked: 'Crooked nose, bent to one side',
      wide: 'Wide nose, broad nostrils',
      hooked: 'Hooked nose, curved downward',
      straight: 'Straight nose, classic profile',
      prominent: 'Prominent nose, large and noticeable',
      neutral: 'Neutral nose, average size',
      upturned: 'Upturned nose, slightly raised tip',
      button: 'Button nose, small and rounded',
      broken: 'Broken nose, crooked from injury'
    },
    mouths: {
      flat: 'Flat mouth, neutral horizontal line',
      downturned: 'Downturned mouth, sad expression',
      smirk: 'Smirking mouth, slight smile on one side',
      neutral: 'Neutral mouth, calm expression',
      thin: 'Thin mouth, narrow lips',
      wide: 'Wide mouth, broad smile',
      smile: 'Smiling mouth, upturned corners',
      frown: 'Frowning mouth, downturned corners',
      open: 'Open mouth, speaking or singing',
      asymmetric: 'Asymmetric mouth, uneven',
      fullLips: 'Full lips, prominent',
      thinLips: 'Thin lips, minimal'
    },
    facialHair: {
      patchy: 'Patchy facial hair, uneven growth',
      heavyStubble: 'Heavy stubble, thick short beard',
      beard: 'Full beard, complete coverage',
      stubble: 'Light stubble, short growth',
      mustache: 'Mustache only, upper lip hair',
      goatee: 'Goatee, chin and mustache',
      sideburns: 'Sideburns, hair on sides of face'
    },
    hair: {
      messy: 'Messy hair, unkempt appearance',
      pulledBack: 'Hair pulled back, neat style',
      beanie: 'Hair under beanie or cap',
      wild: 'Wild hair, untamed appearance',
      clean: 'Clean hair, well-groomed',
      bald: 'Bald head, no hair',
      neutral: 'Neutral hair, average style',
      long: 'Long hair, flowing',
      short: 'Short hair, cropped',
      curly: 'Curly hair, wavy texture',
      wavy: 'Wavy hair, medium texture',
      mohawk: 'Mohawk hairstyle, punk style',
      fade: 'Fade haircut, graduated length',
      undercut: 'Undercut hairstyle, short sides'
    },
    accessories: {
      headphones: 'Headphones over ears, audio equipment',
      glasses: 'Eyeglasses, frames around eyes',
      earplug: 'Earplug in ear, small device',
      scar: 'Facial scar, mark on face',
      coffeeStain: 'Coffee stain on clothing',
      earring: 'Earring in ear, jewelry',
      piercing: 'Facial piercing, metal jewelry',
      bandana: 'Bandana on head, cloth wrap',
      headband: 'Headband on head, fabric band',
      pencilBehindEar: 'Pencil behind ear, writing tool'
    },
    shading: 'Subtle shading, cross-hatching texture, under eyes or jaw'
  };
  
  // Extract feature type from filename
  const getFeatureType = (name) => {
    if (name.includes('tired')) return 'tired';
    if (name.includes('narrow')) return 'narrow';
    if (name.includes('heavyLid')) return 'heavyLid';
    if (name.includes('squinting')) return 'squinting';
    if (name.includes('open') && !name.includes('singing')) return 'open';
    if (name.includes('wide')) return 'wide';
    if (name.includes('neutral')) return 'neutral';
    if (name.includes('angry')) return 'angry';
    if (name.includes('intense')) return 'intense';
    if (name.includes('sad')) return 'sad';
    if (name.includes('droopy')) return 'droopy';
    if (name.includes('asymmetric')) return 'asymmetric';
    if (name.includes('crooked')) return 'crooked';
    if (name.includes('hooked')) return 'hooked';
    if (name.includes('straight')) return 'straight';
    if (name.includes('prominent')) return 'prominent';
    if (name.includes('upturned')) return 'upturned';
    if (name.includes('button')) return 'button';
    if (name.includes('broken')) return 'broken';
    if (name.includes('flat')) return 'flat';
    if (name.includes('downturned')) return 'downturned';
    if (name.includes('smirk')) return 'smirk';
    if (name.includes('thin') && name.includes('Lips')) return 'thinLips';
    if (name.includes('fullLips')) return 'fullLips';
    if (name.includes('smile')) return 'smile';
    if (name.includes('frown')) return 'frown';
    if (name.includes('open')) return 'open';
    if (name.includes('patchy')) return 'patchy';
    if (name.includes('heavyStubble')) return 'heavyStubble';
    if (name.includes('beard')) return 'beard';
    if (name.includes('stubble')) return 'stubble';
    if (name.includes('mustache')) return 'mustache';
    if (name.includes('goatee')) return 'goatee';
    if (name.includes('sideburns')) return 'sideburns';
    if (name.includes('ponytail') || name.includes('bun')) return 'pulledBack';
    if (name.includes('bald')) return 'bald';
    if (name.includes('mohawk')) return 'mohawk';
    if (name.includes('fade')) return 'fade';
    if (name.includes('undercut')) return 'undercut';
    if (name.includes('headphones')) return 'headphones';
    if (name.includes('glasses') || name.includes('sunglasses') || name.includes('aviator')) return 'glasses';
    if (name.includes('earplug')) return 'earplug';
    if (name.includes('scar')) return 'scar';
    if (name.includes('coffee')) return 'coffeeStain';
    if (name.includes('earring')) return 'earring';
    if (name.includes('piercing')) return 'piercing';
    if (name.includes('bandana')) return 'bandana';
    if (name.includes('headband')) return 'headband';
    if (name.includes('pencil')) return 'pencilBehindEar';
    return 'neutral';
  };
  
  const featureType = getFeatureType(filename);
  const categoryDesc = descriptions[category];
  
  if (typeof categoryDesc === 'object' && categoryDesc[featureType]) {
    return `${categoryDesc[featureType]}, ${baseStyle}`;
  } else if (typeof categoryDesc === 'string') {
    return `${categoryDesc}, ${baseStyle}`;
  }
  
  return `${category} feature, ${baseStyle}`;
}
