# Avatar Assets Expansion Guide

## Overview
This document lists all the new avatar assets that have been added to the configuration. The system now supports a much wider variety of facial features for more diverse and interesting procedural avatars.

## New Asset Counts

### Eyes: **20 variations** (was 7)
- **Tired**: 3 variations
- **Narrow**: 2 variations
- **Heavy Lid**: 2 variations
- **Squinting**: 2 variations
- **Open/Wide**: 3 variations
- **Neutral**: 3 variations
- **Angry/Intense**: 2 variations
- **Sad/Droopy**: 2 variations
- **Asymmetric**: 1 variation

### Noses: **20 variations** (was 8)
- **Narrow**: 2 variations
- **Crooked**: 4 variations (left/right variants)
- **Wide**: 2 variations
- **Hooked**: 2 variations
- **Straight**: 2 variations
- **Prominent**: 2 variations
- **Neutral**: 2 variations
- **Upturned**: 2 variations
- **Button**: 2 variations
- **Broken**: 1 variation

### Mouths: **25 variations** (was 7)
- **Flat**: 3 variations
- **Downturned**: 2 variations
- **Smirk**: 4 variations (left/right variants)
- **Neutral**: 3 variations
- **Thin**: 2 variations
- **Wide**: 2 variations
- **Smile**: 3 variations
- **Frown**: 2 variations
- **Open**: 3 variations (including singing)
- **Asymmetric**: 1 variation
- **Full/Thin Lips**: 2 variations

### Facial Hair: **20 variations** (was 7)
- **None**: 1 (weighted higher)
- **Patchy**: 3 variations
- **Heavy Stubble**: 2 variations
- **Beard**: 5 variations (long, short, full)
- **Stubble**: 2 variations
- **Mustache**: 4 variations (thin, thick)
- **Goatee**: 2 variations
- **Sideburns**: 2 variations

### Hair: **35 variations** (was 12)
- **Messy**: 3 variations
- **Pulled Back**: 4 variations (ponytail, bun)
- **Beanie/Cap**: 3 variations
- **Wild**: 4 variations (including curly wild)
- **Clean**: 4 variations (including short clean)
- **Bald**: 2 variations
- **Neutral**: 3 variations
- **Long**: 3 variations
- **Short**: 3 variations
- **Curly**: 2 variations
- **Wavy**: 2 variations
- **Mohawk**: 2 variations
- **Fade/Undercut**: 2 variations

### Accessories: **22 variations** (was 9)
- **None**: 1 (weighted higher)
- **Headphones**: 3 variations (including over-ear)
- **Glasses**: 5 variations (round, sunglasses, aviator)
- **Earplugs**: 2 variations
- **Scars**: 2 variations
- **Earrings**: 3 variations
- **Piercings**: 3 variations (nose, lip, eyebrow)
- **Bandanas/Headbands**: 2 variations
- **Pencil Behind Ear**: 1 variation
- **Coffee Stain**: 1 variation
- **Messy**: 3 variations
- **Pulled Back**: 4 variations (ponytail, bun)
- **Beanie/Cap**: 3 variations
- **Wild**: 4 variations (including curly wild)
- **Clean**: 4 variations (including short clean)
- **Bald**: 2 variations
- **Neutral**: 3 variations
- **Long**: 3 variations
- **Short**: 3 variations
- **Curly**: 2 variations
- **Wavy**: 2 variations
- **Mohawk**: 2 variations
- **Fade/Undercut**: 2 variations

## Total Asset Count

| Category | Previous | New | Total |
|----------|----------|-----|-------|
| Eyes | 7 | +13 | **20** |
| Noses | 8 | +12 | **20** |
| Mouths | 7 | +18 | **25** |
| Facial Hair | 7 | +13 | **20** |
| Hair | 12 | +23 | **35** |
| Accessories | 9 | +13 | **22** |
| **TOTAL** | **50** | **+92** | **142** |

## Asset File Structure

All assets should be placed in `public/avatar/assets/` with the following structure:

```
public/avatar/assets/
├── eyes/
│   ├── eyes_tired_01.png
│   ├── eyes_tired_02.png
│   ├── eyes_tired_03.png
│   ├── eyes_narrow_01.png
│   ├── eyes_narrow_02.png
│   ├── eyes_heavyLid_01.png
│   ├── eyes_heavyLid_02.png
│   ├── eyes_squinting_01.png
│   ├── eyes_squinting_02.png
│   ├── eyes_open_01.png
│   ├── eyes_open_02.png
│   ├── eyes_wide_01.png
│   ├── eyes_neutral_01.png
│   ├── eyes_neutral_02.png
│   ├── eyes_neutral_03.png
│   ├── eyes_angry_01.png
│   ├── eyes_intense_01.png
│   ├── eyes_sad_01.png
│   ├── eyes_droopy_01.png
│   └── eyes_asymmetric_01.png
├── noses/
│   ├── nose_narrow_01.png
│   ├── nose_narrow_02.png
│   ├── nose_crooked_left_01.png
│   ├── nose_crooked_left_02.png
│   ├── nose_crooked_right_01.png
│   ├── nose_crooked_right_02.png
│   ├── nose_wide_01.png
│   ├── nose_wide_02.png
│   ├── nose_hooked_01.png
│   ├── nose_hooked_02.png
│   ├── nose_straight_01.png
│   ├── nose_straight_02.png
│   ├── nose_prominent_01.png
│   ├── nose_prominent_02.png
│   ├── nose_neutral_01.png
│   ├── nose_neutral_02.png
│   ├── nose_upturned_01.png
│   ├── nose_upturned_02.png
│   ├── nose_button_01.png
│   ├── nose_button_02.png
│   └── nose_broken_01.png
├── mouths/
│   ├── mouth_flat_01.png
│   ├── mouth_flat_02.png
│   ├── mouth_flat_03.png
│   ├── mouth_downturned_01.png
│   ├── mouth_downturned_02.png
│   ├── mouth_smirk_01.png
│   ├── mouth_smirk_02.png
│   ├── mouth_smirk_left_01.png
│   ├── mouth_smirk_right_01.png
│   ├── mouth_neutral_01.png
│   ├── mouth_neutral_02.png
│   ├── mouth_neutral_03.png
│   ├── mouth_thin_01.png
│   ├── mouth_thin_02.png
│   ├── mouth_wide_01.png
│   ├── mouth_wide_02.png
│   ├── mouth_smile_01.png
│   ├── mouth_smile_02.png
│   ├── mouth_smile_wide_01.png
│   ├── mouth_frown_01.png
│   ├── mouth_frown_02.png
│   ├── mouth_open_01.png
│   ├── mouth_open_02.png
│   ├── mouth_open_singing_01.png
│   ├── mouth_asymmetric_01.png
│   ├── mouth_fullLips_01.png
│   └── mouth_thinLips_01.png
├── facialHair/
│   ├── facialHair_patchy_01.png
│   ├── facialHair_patchy_02.png
│   ├── facialHair_patchy_03.png
│   ├── facialHair_heavyStubble_01.png
│   ├── facialHair_heavyStubble_02.png
│   ├── facialHair_beard_01.png
│   ├── facialHair_beard_02.png
│   ├── facialHair_beard_03.png
│   ├── facialHair_beard_long_01.png
│   ├── facialHair_beard_short_01.png
│   ├── facialHair_stubble_01.png
│   ├── facialHair_stubble_02.png
│   ├── facialHair_mustache_01.png
│   ├── facialHair_mustache_02.png
│   ├── facialHair_mustache_thin_01.png
│   ├── facialHair_mustache_thick_01.png
│   ├── facialHair_goatee_01.png
│   ├── facialHair_goatee_02.png
│   ├── facialHair_sideburns_01.png
│   └── facialHair_sideburns_long_01.png
└── hair/
    ├── hair_messy_01.png
    ├── hair_messy_02.png
    ├── hair_messy_03.png
    ├── hair_pulledBack_01.png
    ├── hair_pulledBack_02.png
    ├── hair_ponytail_01.png
    ├── hair_bun_01.png
    ├── hair_beanie_low_01.png
    ├── hair_beanie_low_02.png
    ├── hair_cap_01.png
    ├── hair_wild_01.png
    ├── hair_wild_02.png
    ├── hair_wild_03.png
    ├── hair_curly_wild_01.png
    ├── hair_clean_01.png
    ├── hair_clean_02.png
    ├── hair_clean_03.png
    ├── hair_short_clean_01.png
    ├── hair_bald_01.png
    ├── hair_bald_02.png
    ├── hair_neutral_01.png
    ├── hair_neutral_02.png
    ├── hair_neutral_03.png
    ├── hair_long_01.png
    ├── hair_long_02.png
    ├── hair_long_straight_01.png
    ├── hair_short_01.png
    ├── hair_short_02.png
    ├── hair_short_spiky_01.png
    ├── hair_curly_01.png
    ├── hair_curly_02.png
    ├── hair_wavy_01.png
    ├── hair_wavy_02.png
    ├── hair_mohawk_01.png
    ├── hair_mohawk_02.png
    ├── hair_fade_01.png
    └── hair_undercut_01.png
```

## Asset Requirements

All assets must:
- Be **512×512 pixels** (or 1024×1024 for higher quality)
- Have **transparent backgrounds**
- Share the **same face center** (approximately 256, 256 for 512×512)
- Be **black and white** (police sketch aesthetic)
- Use **proper transparency** (no white pixels pretending to be transparent)
- Match the **naming convention** exactly as listed above

## Implementation Notes

1. **Missing Assets**: The system gracefully handles missing assets by showing placeholders
2. **Weighted Selection**: All assets have equal weight (1) by default, but can be adjusted
3. **Archetype Support**: New categories are automatically supported by the archetype system
4. **Backward Compatible**: Existing assets continue to work

## Next Steps

1. Create the actual PNG assets following the naming convention
2. Place them in the appropriate directories
3. Test avatar generation to ensure proper layering
4. Adjust weights if certain variations should be more/less common
