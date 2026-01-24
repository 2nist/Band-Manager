/**
 * Avatar Configuration
 * 
 * Defines available features, layers, and generation rules for procedural avatars.
 */

/**
 * Default avatar configuration
 * Assumes assets are in public/avatar/assets/ directory
 */
export const defaultAvatarConfig = {
  canvasSize: 512,
  layers: [
    {
      name: 'paper',
      features: [
        { id: 'paper_1', path: '/avatar/assets/paper/paper_1.png', weight: 1 }
      ],
      required: true,
      jitter: { x: 0, y: 0, rotation: 0, opacity: [1, 1] } // No jitter for background
    },
    {
      name: 'head',
      features: [
        { id: 'head_1', path: '/avatar/assets/heads/head_1.png', weight: 1 },
        { id: 'head_2', path: '/avatar/assets/heads/head_2.png', weight: 1 },
        { id: 'head_3', path: '/avatar/assets/heads/head_3.png', weight: 1 },
        { id: 'head_4', path: '/avatar/assets/heads/head_4.png', weight: 1 },
        { id: 'head_5', path: '/avatar/assets/heads/head_5.png', weight: 1 }
      ],
      required: true,
      jitter: { x: 2, y: 2, rotation: 0.01, opacity: [0.95, 1.0] }
    },
    {
      name: 'eyes',
      features: [
        // Tired eyes
        { id: 'eyes_tired_01', path: '/avatar/assets/eyes/eyes_tired_01.png', weight: 1, category: 'tired' },
        { id: 'eyes_tired_02', path: '/avatar/assets/eyes/eyes_tired_02.png', weight: 1, category: 'tired' },
        { id: 'eyes_tired_03', path: '/avatar/assets/eyes/eyes_tired_03.png', weight: 1, category: 'tired' },
        // Narrow eyes
        { id: 'eyes_narrow_01', path: '/avatar/assets/eyes/eyes_narrow_01.png', weight: 1, category: 'narrow' },
        { id: 'eyes_narrow_02', path: '/avatar/assets/eyes/eyes_narrow_02.png', weight: 1, category: 'narrow' },
        // Heavy lid eyes
        { id: 'eyes_heavyLid_01', path: '/avatar/assets/eyes/eyes_heavyLid_01.png', weight: 1, category: 'heavyLid' },
        { id: 'eyes_heavyLid_02', path: '/avatar/assets/eyes/eyes_heavyLid_02.png', weight: 1, category: 'heavyLid' },
        // Squinting eyes
        { id: 'eyes_squinting_01', path: '/avatar/assets/eyes/eyes_squinting_01.png', weight: 1, category: 'squinting' },
        { id: 'eyes_squinting_02', path: '/avatar/assets/eyes/eyes_squinting_02.png', weight: 1, category: 'squinting' },
        // Open/wide eyes
        { id: 'eyes_open_01', path: '/avatar/assets/eyes/eyes_open_01.png', weight: 1, category: 'open' },
        { id: 'eyes_open_02', path: '/avatar/assets/eyes/eyes_open_02.png', weight: 1, category: 'open' },
        { id: 'eyes_wide_01', path: '/avatar/assets/eyes/eyes_wide_01.png', weight: 1, category: 'wide' },
        // Neutral eyes
        { id: 'eyes_neutral_01', path: '/avatar/assets/eyes/eyes_neutral_01.png', weight: 1, category: 'neutral' },
        { id: 'eyes_neutral_02', path: '/avatar/assets/eyes/eyes_neutral_02.png', weight: 1, category: 'neutral' },
        { id: 'eyes_neutral_03', path: '/avatar/assets/eyes/eyes_neutral_03.png', weight: 1, category: 'neutral' },
        // Angry/intense eyes
        { id: 'eyes_angry_01', path: '/avatar/assets/eyes/eyes_angry_01.png', weight: 1, category: 'angry' },
        { id: 'eyes_intense_01', path: '/avatar/assets/eyes/eyes_intense_01.png', weight: 1, category: 'intense' },
        // Sad/droopy eyes
        { id: 'eyes_sad_01', path: '/avatar/assets/eyes/eyes_sad_01.png', weight: 1, category: 'sad' },
        { id: 'eyes_droopy_01', path: '/avatar/assets/eyes/eyes_droopy_01.png', weight: 1, category: 'droopy' },
        // Asymmetric eyes
        { id: 'eyes_asymmetric_01', path: '/avatar/assets/eyes/eyes_asymmetric_01.png', weight: 1, category: 'asymmetric' }
      ],
      required: true,
      jitter: { x: 2, y: 2, rotation: 0.01, opacity: [0.92, 1.0] }
    },
    {
      name: 'nose',
      features: [
        // Narrow noses
        { id: 'nose_narrow_01', path: '/avatar/assets/noses/nose_narrow_01.png', weight: 1, category: 'narrow' },
        { id: 'nose_narrow_02', path: '/avatar/assets/noses/nose_narrow_02.png', weight: 1, category: 'narrow' },
        // Crooked noses
        { id: 'nose_crooked_left_01', path: '/avatar/assets/noses/nose_crooked_left_01.png', weight: 1, category: 'crooked' },
        { id: 'nose_crooked_right_01', path: '/avatar/assets/noses/nose_crooked_right_01.png', weight: 1, category: 'crooked' },
        { id: 'nose_crooked_left_02', path: '/avatar/assets/noses/nose_crooked_left_02.png', weight: 1, category: 'crooked' },
        { id: 'nose_crooked_right_02', path: '/avatar/assets/noses/nose_crooked_right_02.png', weight: 1, category: 'crooked' },
        // Wide noses
        { id: 'nose_wide_01', path: '/avatar/assets/noses/nose_wide_01.png', weight: 1, category: 'wide' },
        { id: 'nose_wide_02', path: '/avatar/assets/noses/nose_wide_02.png', weight: 1, category: 'wide' },
        // Hooked noses
        { id: 'nose_hooked_01', path: '/avatar/assets/noses/nose_hooked_01.png', weight: 1, category: 'hooked' },
        { id: 'nose_hooked_02', path: '/avatar/assets/noses/nose_hooked_02.png', weight: 1, category: 'hooked' },
        // Straight noses
        { id: 'nose_straight_01', path: '/avatar/assets/noses/nose_straight_01.png', weight: 1, category: 'straight' },
        { id: 'nose_straight_02', path: '/avatar/assets/noses/nose_straight_02.png', weight: 1, category: 'straight' },
        // Prominent noses
        { id: 'nose_prominent_01', path: '/avatar/assets/noses/nose_prominent_01.png', weight: 1, category: 'prominent' },
        { id: 'nose_prominent_02', path: '/avatar/assets/noses/nose_prominent_02.png', weight: 1, category: 'prominent' },
        // Neutral noses
        { id: 'nose_neutral_01', path: '/avatar/assets/noses/nose_neutral_01.png', weight: 1, category: 'neutral' },
        { id: 'nose_neutral_02', path: '/avatar/assets/noses/nose_neutral_02.png', weight: 1, category: 'neutral' },
        // Upturned noses
        { id: 'nose_upturned_01', path: '/avatar/assets/noses/nose_upturned_01.png', weight: 1, category: 'upturned' },
        { id: 'nose_upturned_02', path: '/avatar/assets/noses/nose_upturned_02.png', weight: 1, category: 'upturned' },
        // Button noses
        { id: 'nose_button_01', path: '/avatar/assets/noses/nose_button_01.png', weight: 1, category: 'button' },
        { id: 'nose_button_02', path: '/avatar/assets/noses/nose_button_02.png', weight: 1, category: 'button' },
        // Broken noses
        { id: 'nose_broken_01', path: '/avatar/assets/noses/nose_broken_01.png', weight: 1, category: 'broken' }
      ],
      required: true,
      jitter: { x: 2, y: 2, rotation: 0.01, opacity: [0.92, 1.0] }
    },
    {
      name: 'mouth',
      features: [
        // Flat mouths
        { id: 'mouth_flat_01', path: '/avatar/assets/mouths/mouth_flat_01.png', weight: 1, category: 'flat' },
        { id: 'mouth_flat_02', path: '/avatar/assets/mouths/mouth_flat_02.png', weight: 1, category: 'flat' },
        { id: 'mouth_flat_03', path: '/avatar/assets/mouths/mouth_flat_03.png', weight: 1, category: 'flat' },
        // Downturned mouths
        { id: 'mouth_downturned_01', path: '/avatar/assets/mouths/mouth_downturned_01.png', weight: 1, category: 'downturned' },
        { id: 'mouth_downturned_02', path: '/avatar/assets/mouths/mouth_downturned_02.png', weight: 1, category: 'downturned' },
        // Smirk mouths
        { id: 'mouth_smirk_01', path: '/avatar/assets/mouths/mouth_smirk_01.png', weight: 1, category: 'smirk' },
        { id: 'mouth_smirk_02', path: '/avatar/assets/mouths/mouth_smirk_02.png', weight: 1, category: 'smirk' },
        { id: 'mouth_smirk_left_01', path: '/avatar/assets/mouths/mouth_smirk_left_01.png', weight: 1, category: 'smirk' },
        { id: 'mouth_smirk_right_01', path: '/avatar/assets/mouths/mouth_smirk_right_01.png', weight: 1, category: 'smirk' },
        // Neutral mouths
        { id: 'mouth_neutral_01', path: '/avatar/assets/mouths/mouth_neutral_01.png', weight: 1, category: 'neutral' },
        { id: 'mouth_neutral_02', path: '/avatar/assets/mouths/mouth_neutral_02.png', weight: 1, category: 'neutral' },
        { id: 'mouth_neutral_03', path: '/avatar/assets/mouths/mouth_neutral_03.png', weight: 1, category: 'neutral' },
        // Thin mouths
        { id: 'mouth_thin_01', path: '/avatar/assets/mouths/mouth_thin_01.png', weight: 1, category: 'thin' },
        { id: 'mouth_thin_02', path: '/avatar/assets/mouths/mouth_thin_02.png', weight: 1, category: 'thin' },
        // Wide mouths
        { id: 'mouth_wide_01', path: '/avatar/assets/mouths/mouth_wide_01.png', weight: 1, category: 'wide' },
        { id: 'mouth_wide_02', path: '/avatar/assets/mouths/mouth_wide_02.png', weight: 1, category: 'wide' },
        // Smiling mouths
        { id: 'mouth_smile_01', path: '/avatar/assets/mouths/mouth_smile_01.png', weight: 1, category: 'smile' },
        { id: 'mouth_smile_02', path: '/avatar/assets/mouths/mouth_smile_02.png', weight: 1, category: 'smile' },
        { id: 'mouth_smile_wide_01', path: '/avatar/assets/mouths/mouth_smile_wide_01.png', weight: 1, category: 'smile' },
        // Frowning mouths
        { id: 'mouth_frown_01', path: '/avatar/assets/mouths/mouth_frown_01.png', weight: 1, category: 'frown' },
        { id: 'mouth_frown_02', path: '/avatar/assets/mouths/mouth_frown_02.png', weight: 1, category: 'frown' },
        // Open mouths (singing/shouting)
        { id: 'mouth_open_01', path: '/avatar/assets/mouths/mouth_open_01.png', weight: 1, category: 'open' },
        { id: 'mouth_open_02', path: '/avatar/assets/mouths/mouth_open_02.png', weight: 1, category: 'open' },
        { id: 'mouth_open_singing_01', path: '/avatar/assets/mouths/mouth_open_singing_01.png', weight: 1, category: 'open' },
        // Asymmetric mouths
        { id: 'mouth_asymmetric_01', path: '/avatar/assets/mouths/mouth_asymmetric_01.png', weight: 1, category: 'asymmetric' },
        // Lips variations
        { id: 'mouth_fullLips_01', path: '/avatar/assets/mouths/mouth_fullLips_01.png', weight: 1, category: 'fullLips' },
        { id: 'mouth_thinLips_01', path: '/avatar/assets/mouths/mouth_thinLips_01.png', weight: 1, category: 'thinLips' }
      ],
      required: true,
      jitter: { x: 2, y: 2, rotation: 0.01, opacity: [0.92, 1.0] }
    },
    {
      name: 'facialHair',
      features: [
        { id: 'none', path: '', weight: 3, category: 'none' }, // Higher weight for no facial hair
        // Patchy facial hair
        { id: 'facialHair_patchy_01', path: '/avatar/assets/facialHair/facialHair_patchy_01.png', weight: 1, category: 'patchy' },
        { id: 'facialHair_patchy_02', path: '/avatar/assets/facialHair/facialHair_patchy_02.png', weight: 1, category: 'patchy' },
        { id: 'facialHair_patchy_03', path: '/avatar/assets/facialHair/facialHair_patchy_03.png', weight: 1, category: 'patchy' },
        // Heavy stubble
        { id: 'facialHair_heavyStubble_01', path: '/avatar/assets/facialHair/facialHair_heavyStubble_01.png', weight: 1, category: 'heavyStubble' },
        { id: 'facialHair_heavyStubble_02', path: '/avatar/assets/facialHair/facialHair_heavyStubble_02.png', weight: 1, category: 'heavyStubble' },
        // Full beards
        { id: 'facialHair_beard_01', path: '/avatar/assets/facialHair/facialHair_beard_01.png', weight: 1, category: 'beard' },
        { id: 'facialHair_beard_02', path: '/avatar/assets/facialHair/facialHair_beard_02.png', weight: 1, category: 'beard' },
        { id: 'facialHair_beard_03', path: '/avatar/assets/facialHair/facialHair_beard_03.png', weight: 1, category: 'beard' },
        { id: 'facialHair_beard_long_01', path: '/avatar/assets/facialHair/facialHair_beard_long_01.png', weight: 1, category: 'beard' },
        { id: 'facialHair_beard_short_01', path: '/avatar/assets/facialHair/facialHair_beard_short_01.png', weight: 1, category: 'beard' },
        // Stubble
        { id: 'facialHair_stubble_01', path: '/avatar/assets/facialHair/facialHair_stubble_01.png', weight: 1, category: 'stubble' },
        { id: 'facialHair_stubble_02', path: '/avatar/assets/facialHair/facialHair_stubble_02.png', weight: 1, category: 'stubble' },
        // Mustaches
        { id: 'facialHair_mustache_01', path: '/avatar/assets/facialHair/facialHair_mustache_01.png', weight: 1, category: 'mustache' },
        { id: 'facialHair_mustache_02', path: '/avatar/assets/facialHair/facialHair_mustache_02.png', weight: 1, category: 'mustache' },
        { id: 'facialHair_mustache_thin_01', path: '/avatar/assets/facialHair/facialHair_mustache_thin_01.png', weight: 1, category: 'mustache' },
        { id: 'facialHair_mustache_thick_01', path: '/avatar/assets/facialHair/facialHair_mustache_thick_01.png', weight: 1, category: 'mustache' },
        // Goatees
        { id: 'facialHair_goatee_01', path: '/avatar/assets/facialHair/facialHair_goatee_01.png', weight: 1, category: 'goatee' },
        { id: 'facialHair_goatee_02', path: '/avatar/assets/facialHair/facialHair_goatee_02.png', weight: 1, category: 'goatee' },
        // Sideburns
        { id: 'facialHair_sideburns_01', path: '/avatar/assets/facialHair/facialHair_sideburns_01.png', weight: 1, category: 'sideburns' },
        { id: 'facialHair_sideburns_long_01', path: '/avatar/assets/facialHair/facialHair_sideburns_long_01.png', weight: 1, category: 'sideburns' }
      ],
      required: false,
      jitter: { x: 2, y: 2, rotation: 0.01, opacity: [0.90, 1.0] }
    },
    {
      name: 'hair',
      features: [
        // Messy hair
        { id: 'hair_messy_01', path: '/avatar/assets/hair/hair_messy_01.png', weight: 1, category: 'messy' },
        { id: 'hair_messy_02', path: '/avatar/assets/hair/hair_messy_02.png', weight: 1, category: 'messy' },
        { id: 'hair_messy_03', path: '/avatar/assets/hair/hair_messy_03.png', weight: 1, category: 'messy' },
        // Pulled back hair
        { id: 'hair_pulledBack_01', path: '/avatar/assets/hair/hair_pulledBack_01.png', weight: 1, category: 'pulledBack' },
        { id: 'hair_pulledBack_02', path: '/avatar/assets/hair/hair_pulledBack_02.png', weight: 1, category: 'pulledBack' },
        { id: 'hair_ponytail_01', path: '/avatar/assets/hair/hair_ponytail_01.png', weight: 1, category: 'pulledBack' },
        { id: 'hair_bun_01', path: '/avatar/assets/hair/hair_bun_01.png', weight: 1, category: 'pulledBack' },
        // Beanie/hat hair
        { id: 'hair_beanie_low_01', path: '/avatar/assets/hair/hair_beanie_low_01.png', weight: 1, category: 'beanie' },
        { id: 'hair_beanie_low_02', path: '/avatar/assets/hair/hair_beanie_low_02.png', weight: 1, category: 'beanie' },
        { id: 'hair_cap_01', path: '/avatar/assets/hair/hair_cap_01.png', weight: 1, category: 'beanie' },
        // Wild hair
        { id: 'hair_wild_01', path: '/avatar/assets/hair/hair_wild_01.png', weight: 1, category: 'wild' },
        { id: 'hair_wild_02', path: '/avatar/assets/hair/hair_wild_02.png', weight: 1, category: 'wild' },
        { id: 'hair_wild_03', path: '/avatar/assets/hair/hair_wild_03.png', weight: 1, category: 'wild' },
        { id: 'hair_curly_wild_01', path: '/avatar/assets/hair/hair_curly_wild_01.png', weight: 1, category: 'wild' },
        // Clean hair
        { id: 'hair_clean_01', path: '/avatar/assets/hair/hair_clean_01.png', weight: 1, category: 'clean' },
        { id: 'hair_clean_02', path: '/avatar/assets/hair/hair_clean_02.png', weight: 1, category: 'clean' },
        { id: 'hair_clean_03', path: '/avatar/assets/hair/hair_clean_03.png', weight: 1, category: 'clean' },
        { id: 'hair_short_clean_01', path: '/avatar/assets/hair/hair_short_clean_01.png', weight: 1, category: 'clean' },
        // Bald
        { id: 'hair_bald_01', path: '/avatar/assets/hair/hair_bald_01.png', weight: 1, category: 'bald' },
        { id: 'hair_bald_02', path: '/avatar/assets/hair/hair_bald_02.png', weight: 1, category: 'bald' },
        // Neutral hair
        { id: 'hair_neutral_01', path: '/avatar/assets/hair/hair_neutral_01.png', weight: 1, category: 'neutral' },
        { id: 'hair_neutral_02', path: '/avatar/assets/hair/hair_neutral_02.png', weight: 1, category: 'neutral' },
        { id: 'hair_neutral_03', path: '/avatar/assets/hair/hair_neutral_03.png', weight: 1, category: 'neutral' },
        // Long hair
        { id: 'hair_long_01', path: '/avatar/assets/hair/hair_long_01.png', weight: 1, category: 'long' },
        { id: 'hair_long_02', path: '/avatar/assets/hair/hair_long_02.png', weight: 1, category: 'long' },
        { id: 'hair_long_straight_01', path: '/avatar/assets/hair/hair_long_straight_01.png', weight: 1, category: 'long' },
        // Short hair
        { id: 'hair_short_01', path: '/avatar/assets/hair/hair_short_01.png', weight: 1, category: 'short' },
        { id: 'hair_short_02', path: '/avatar/assets/hair/hair_short_02.png', weight: 1, category: 'short' },
        { id: 'hair_short_spiky_01', path: '/avatar/assets/hair/hair_short_spiky_01.png', weight: 1, category: 'short' },
        // Curly hair
        { id: 'hair_curly_01', path: '/avatar/assets/hair/hair_curly_01.png', weight: 1, category: 'curly' },
        { id: 'hair_curly_02', path: '/avatar/assets/hair/hair_curly_02.png', weight: 1, category: 'curly' },
        // Wavy hair
        { id: 'hair_wavy_01', path: '/avatar/assets/hair/hair_wavy_01.png', weight: 1, category: 'wavy' },
        { id: 'hair_wavy_02', path: '/avatar/assets/hair/hair_wavy_02.png', weight: 1, category: 'wavy' },
        // Mohawk/punk styles
        { id: 'hair_mohawk_01', path: '/avatar/assets/hair/hair_mohawk_01.png', weight: 1, category: 'mohawk' },
        { id: 'hair_mohawk_02', path: '/avatar/assets/hair/hair_mohawk_02.png', weight: 1, category: 'mohawk' },
        // Fade/undercut
        { id: 'hair_fade_01', path: '/avatar/assets/hair/hair_fade_01.png', weight: 1, category: 'fade' },
        { id: 'hair_undercut_01', path: '/avatar/assets/hair/hair_undercut_01.png', weight: 1, category: 'undercut' }
      ],
      required: true,
      jitter: { x: 3, y: 3, rotation: 0.02, opacity: [0.92, 1.0] }
    },
    {
      name: 'accessories',
      features: [
        { id: 'none', path: '', weight: 5, category: 'none' }, // Much higher weight for no accessories
        // Headphones
        { id: 'accessory_headphones_01', path: '/avatar/assets/accessories/accessory_headphones_01.png', weight: 1, category: 'headphones' },
        { id: 'accessory_headphones_02', path: '/avatar/assets/accessories/accessory_headphones_02.png', weight: 1, category: 'headphones' },
        { id: 'accessory_headphones_over_ear_01', path: '/avatar/assets/accessories/accessory_headphones_over_ear_01.png', weight: 1, category: 'headphones' },
        // Pencil behind ear
        { id: 'accessory_pencil_behind_ear_01', path: '/avatar/assets/accessories/accessory_pencil_behind_ear.png', weight: 1, category: 'pencilBehindEar' },
        // Glasses
        { id: 'accessory_glasses_crooked_01', path: '/avatar/assets/accessories/accessory_glasses_crooked_01.png', weight: 1, category: 'glasses' },
        { id: 'accessory_glasses_02', path: '/avatar/assets/accessories/accessory_glasses_02.png', weight: 1, category: 'glasses' },
        { id: 'accessory_glasses_round_01', path: '/avatar/assets/accessories/accessory_glasses_round_01.png', weight: 1, category: 'glasses' },
        { id: 'accessory_glasses_sunglasses_01', path: '/avatar/assets/accessories/accessory_glasses_sunglasses_01.png', weight: 1, category: 'glasses' },
        { id: 'accessory_glasses_aviator_01', path: '/avatar/assets/accessories/accessory_glasses_aviator_01.png', weight: 1, category: 'glasses' },
        // Earplugs
        { id: 'accessory_earplug_01', path: '/avatar/assets/accessories/accessory_earplug_01.png', weight: 1, category: 'earplug' },
        { id: 'accessory_earplug_02', path: '/avatar/assets/accessories/accessory_earplug_02.png', weight: 1, category: 'earplug' },
        // Scars
        { id: 'accessory_scar_01', path: '/avatar/assets/accessories/accessory_scar_01.png', weight: 1, category: 'scar' },
        { id: 'accessory_scar_02', path: '/avatar/assets/accessories/accessory_scar_02.png', weight: 1, category: 'scar' },
        // Coffee stains
        { id: 'accessory_coffee_stain_01', path: '/avatar/assets/accessories/accessory_coffee_stain_01.png', weight: 1, category: 'coffeeStain' },
        // Earrings
        { id: 'accessory_earring_01', path: '/avatar/assets/accessories/accessory_earring_01.png', weight: 1, category: 'earring' },
        { id: 'accessory_earring_02', path: '/avatar/assets/accessories/accessory_earring_02.png', weight: 1, category: 'earring' },
        { id: 'accessory_earring_stud_01', path: '/avatar/assets/accessories/accessory_earring_stud_01.png', weight: 1, category: 'earring' },
        // Piercings
        { id: 'accessory_piercing_nose_01', path: '/avatar/assets/accessories/accessory_piercing_nose_01.png', weight: 1, category: 'piercing' },
        { id: 'accessory_piercing_lip_01', path: '/avatar/assets/accessories/accessory_piercing_lip_01.png', weight: 1, category: 'piercing' },
        { id: 'accessory_piercing_eyebrow_01', path: '/avatar/assets/accessories/accessory_piercing_eyebrow_01.png', weight: 1, category: 'piercing' },
        // Bandanas/headbands
        { id: 'accessory_bandana_01', path: '/avatar/assets/accessories/accessory_bandana_01.png', weight: 1, category: 'bandana' },
        { id: 'accessory_headband_01', path: '/avatar/assets/accessories/accessory_headband_01.png', weight: 1, category: 'headband' }
      ],
      required: false,
      jitter: { x: 2, y: 2, rotation: 0.01, opacity: [0.90, 1.0] }
    },
    {
      name: 'shading',
      features: [
        { id: 'shading_1', path: '/avatar/assets/shading/shading_1.png', weight: 1 },
        { id: 'shading_2', path: '/avatar/assets/shading/shading_2.png', weight: 1 }
      ],
      required: false,
      jitter: { x: 1, y: 1, rotation: 0, opacity: [0.85, 0.95] } // Subtle shading
    }
  ],
  archetypes: {
    'synth-nerd': {
      eyes: {
        narrow: 1.4,
        tired: 1.3
      },
      nose: {
        narrow: 1.2
      },
      mouth: {
        flat: 1.4
      },
      hair: {
        pulledBack: 1.3,
        messy: 1.1
      },
      facialHair: {
        patchy: 1.2
      },
      accessories: {
        headphones: 1.6,
        pencilBehindEar: 1.5,
        glasses: 1.4
      }
    },
    drummer: {
      eyes: {
        heavyLid: 1.3,
        tired: 1.2
      },
      nose: {
        crooked: 1.5,
        wide: 1.3,
        broken: 1.2
      },
      mouth: {
        downturned: 1.2,
        open: 1.3
      },
      hair: {
        messy: 1.5,
        wild: 1.3,
        short: 1.2
      },
      facialHair: {
        heavyStubble: 1.4,
        stubble: 1.3
      },
      accessories: {
        earplug: 1.6,
        bandana: 1.3
      }
    },
    guitarist: {
      eyes: {
        squinting: 1.3,
        intense: 1.2
      },
      nose: {
        hooked: 1.2,
        broken: 1.3
      },
      mouth: {
        smirk: 1.3,
        open: 1.2
      },
      hair: {
        beanie: 1.4,
        wild: 1.3,
        mohawk: 1.5,
        messy: 1.2
      },
      facialHair: {
        beard: 1.5,
        stubble: 1.3
      },
      accessories: {
        scar: 1.3,
        piercing: 1.4,
        earring: 1.3
      }
    },
    vocalist: {
      eyes: {
        open: 1.3,
        wide: 1.2
      },
      nose: {
        straight: 1.3,
        neutral: 1.2
      },
      mouth: {
        neutral: 1.4,
        open: 1.5,
        smile: 1.3
      },
      hair: {
        clean: 1.4,
        long: 1.3,
        wavy: 1.2
      },
      facialHair: {
        none: 1.3
      },
      accessories: {
        glasses: 1.2,
        earring: 1.3
      }
    },
    producer: {
      eyes: {
        tired: 1.5,
        narrow: 1.3
      },
      nose: {
        prominent: 1.2,
        straight: 1.2
      },
      mouth: {
        flat: 1.5,
        thin: 1.3
      },
      hair: {
        bald: 1.4,
        pulledBack: 1.3,
        short: 1.2
      },
      facialHair: {
        stubble: 1.3,
        goatee: 1.2
      },
      accessories: {
        headphones: 1.7,
        coffeeStain: 1.4,
        glasses: 1.5,
        pencilBehindEar: 1.3
      }
    }
  }
};

/**
 * Get feature list for a layer
 * @param {Object} config - Avatar configuration
 * @param {string} layerName - Layer name
 * @returns {Array} Feature list
 */
export function getLayerFeatures(config, layerName) {
  const layer = config.layers.find(l => l.name === layerName);
  return layer?.features || [];
}

/**
 * Get layer configuration
 * @param {Object} config - Avatar configuration
 * @param {string} layerName - Layer name
 * @returns {Object|undefined} Layer configuration
 */
export function getLayerConfig(config, layerName) {
  return config.layers.find(l => l.name === layerName);
}
