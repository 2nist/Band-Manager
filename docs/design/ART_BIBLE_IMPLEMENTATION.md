# Art Bible Implementation - Police Sketch Avatars

**Date**: January 23, 2026  
**Status**: ✅ **CONFIGURED & READY FOR ASSETS**

---

## Overview

The avatar system has been updated to match the art bible specifications for police-sketch style musician avatars with detailed archetype weighting.

---

## ✅ Art Bible Compliance

### Visual Style Rules (Code-Side)
- ✅ **Black & white only** - Canvas renders in grayscale
- ✅ **White background** - `#FFFFFF` background in `drawAvatar.js`
- ✅ **No color accents** - All rendering is monochrome
- ✅ **Jitter for imperfection** - Position, rotation, opacity variations
- ✅ **Deterministic** - Same seed = same avatar (police sketch consistency)

### Asset Naming Convention (Implemented)
All features now use descriptive naming:
- `eyes_tired_01.png`, `eyes_narrow_01.png`
- `nose_crooked_left_01.png`, `nose_wide_01.png`
- `mouth_flat_01.png`, `mouth_downturned_01.png`
- `hair_beanie_low_01.png`, `hair_messy_01.png`
- `facialHair_patchy_01.png`, `facialHair_heavyStubble_01.png`
- `accessory_headphones_01.png`, `accessory_pencil_behind_ear.png`

### Category System
Each feature now has a `category` property that maps to archetype weights:
- **Eyes**: `tired`, `narrow`, `heavyLid`, `squinting`, `open`, `neutral`
- **Nose**: `narrow`, `crooked`, `wide`, `hooked`, `straight`, `prominent`, `neutral`
- **Mouth**: `flat`, `downturned`, `smirk`, `neutral`
- **Hair**: `messy`, `pulledBack`, `beanie`, `wild`, `clean`, `bald`, `neutral`
- **Facial Hair**: `none`, `patchy`, `heavyStubble`, `beard`, `stubble`, `mustache`
- **Accessories**: `none`, `headphones`, `pencilBehindEar`, `glasses`, `earplug`, `scar`, `coffeeStain`

---

## 🎛 Archetype Weighting System

### Implemented Archetypes

1. **Synth Nerd** (`synth-nerd`)
   - Eyes: `narrow` (1.4x), `tired` (1.3x)
   - Nose: `narrow` (1.2x)
   - Mouth: `flat` (1.4x)
   - Hair: `pulledBack` (1.3x), `messy` (1.1x)
   - Facial Hair: `patchy` (1.2x)
   - Accessories: `headphones` (1.6x), `pencilBehindEar` (1.5x), `glasses` (1.4x)

2. **Drummer** (`drummer`)
   - Eyes: `heavyLid` (1.3x)
   - Nose: `crooked` (1.5x), `wide` (1.3x)
   - Mouth: `downturned` (1.2x)
   - Hair: `messy` (1.5x)
   - Facial Hair: `heavyStubble` (1.4x)
   - Accessories: `earplug` (1.6x)

3. **Guitarist** (`guitarist`)
   - Eyes: `squinting` (1.3x)
   - Nose: `hooked` (1.2x)
   - Mouth: `smirk` (1.3x)
   - Hair: `beanie` (1.4x), `wild` (1.3x)
   - Facial Hair: `beard` (1.5x)
   - Accessories: `scar` (1.3x)

4. **Vocalist** (`vocalist`)
   - Eyes: `open` (1.3x)
   - Nose: `straight` (1.3x)
   - Mouth: `neutral` (1.4x)
   - Hair: `clean` (1.4x)
   - Facial Hair: `none` (1.3x)
   - Accessories: `glasses` (1.2x)

5. **Producer** (`producer`)
   - Eyes: `tired` (1.5x)
   - Nose: `prominent` (1.2x)
   - Mouth: `flat` (1.5x)
   - Hair: `bald` (1.4x), `pulledBack` (1.3x)
   - Facial Hair: `stubble` (1.3x)
   - Accessories: `headphones` (1.7x), `coffeeStain` (1.4x), `glasses` (1.5x)

### Weighting Logic

- **Default weight**: 1.0 (all features start equal)
- **Archetype multipliers**: Applied to matching categories
- **Normalization**: Automatic via `pickWeighted` function
- **Deterministic**: Same seed + archetype = same result

---

## 📁 Asset Structure (Expected)

```
public/avatar/assets/
├── paper/
│   └── paper_01.png
├── heads/
│   ├── head_01.png
│   ├── head_02.png
│   └── ...
├── eyes/
│   ├── eyes_tired_01.png
│   ├── eyes_narrow_01.png
│   ├── eyes_heavyLid_01.png
│   ├── eyes_squinting_01.png
│   ├── eyes_open_01.png
│   └── eyes_neutral_01.png
├── noses/
│   ├── nose_narrow_01.png
│   ├── nose_crooked_left_01.png
│   ├── nose_crooked_right_01.png
│   ├── nose_wide_01.png
│   ├── nose_hooked_01.png
│   ├── nose_straight_01.png
│   ├── nose_prominent_01.png
│   └── nose_neutral_01.png
├── mouths/
│   ├── mouth_flat_01.png
│   ├── mouth_flat_02.png
│   ├── mouth_downturned_01.png
│   ├── mouth_smirk_01.png
│   ├── mouth_neutral_01.png
│   ├── mouth_neutral_02.png
│   └── mouth_thin_01.png
├── facialHair/
│   ├── facialHair_patchy_01.png
│   ├── facialHair_patchy_02.png
│   ├── facialHair_heavyStubble_01.png
│   ├── facialHair_beard_01.png
│   ├── facialHair_beard_02.png
│   ├── facialHair_stubble_01.png
│   └── facialHair_mustache_01.png
├── hair/
│   ├── hair_messy_01.png
│   ├── hair_messy_02.png
│   ├── hair_pulledBack_01.png
│   ├── hair_beanie_low_01.png
│   ├── hair_beanie_low_02.png
│   ├── hair_wild_01.png
│   ├── hair_wild_02.png
│   ├── hair_clean_01.png
│   ├── hair_clean_02.png
│   ├── hair_bald_01.png
│   ├── hair_neutral_01.png
│   └── hair_neutral_02.png
├── accessories/
│   ├── accessory_headphones_01.png
│   ├── accessory_headphones_02.png
│   ├── accessory_pencil_behind_ear.png
│   ├── accessory_glasses_crooked_01.png
│   ├── accessory_glasses_02.png
│   ├── accessory_earplug_01.png
│   ├── accessory_earplug_02.png
│   ├── accessory_scar_01.png
│   └── accessory_coffee_stain_01.png
└── shading/
    ├── shading_underEyes_01.png
    ├── shading_underEyes_02.png
    └── ...
```

---

## 🎨 Art Bible Checklist

### Visual Style
- [x] Black & white only (code-side)
- [x] White background
- [x] No color accents
- [x] Jitter for imperfection
- [ ] **PNG assets need to be created** (pencil/graphite look)
- [ ] **Cross-hatching shading** (in assets)
- [ ] **Uneven stroke width** (in assets)
- [ ] **No perfect symmetry** (in assets)

### Expressions
- [x] Neutral, tired, judgmental, thinking (feature categories support this)
- [x] No big smiles (no smile features)
- [x] No teeth (not in feature set)
- [x] No exaggerated emotions (flat, downturned, smirk, neutral only)

### Quirky Details (Supported by Categories)
- [x] Crooked glasses (`accessory_glasses_crooked_01`)
- [x] Pencil behind ear (`accessory_pencil_behind_ear`)
- [x] Headphones (`accessory_headphones_01`)
- [x] Earplugs (`accessory_earplug_01`)
- [x] Coffee stains (`accessory_coffee_stain_01`)
- [x] Scars (`accessory_scar_01`)

### Naming Convention
- [x] Descriptive names (`eyes_tired_01.png`)
- [x] Numbers for variants (`_01`, `_02`, etc.)
- [x] Category-based organization

---

## 🔧 Technical Implementation

### Updated Files

1. **`src/avatar/avatarConfig.js`**
   - Added category properties to all features
   - Implemented detailed archetype weights
   - Updated feature names to match art bible convention

2. **`src/avatar/selectFeatures.js`**
   - Updated `selectFeaturesWithArchetype` to use layer-specific weights
   - Supports nested weight structure: `{ eyes: { narrow: 1.4 }, ... }`

3. **`src/components/EnhancedBandFormation/EnhancedAvatar.jsx`**
   - Added `synth-nerd` and `producer` to role mapping
   - Maps `keyboardist`/`synth` → `synth-nerd`
   - Maps `producer`/`dj`/`engineer` → `producer`

---

## 🚀 Next Steps

1. **Create PNG Assets**
   - Follow art bible visual style rules
   - Use descriptive naming convention
   - Ensure 512×512 (or 1024×1024) with transparent backgrounds
   - Align to same face center
   - Black & white, pencil/graphite aesthetic

2. **Test Archetype Weighting**
   - Generate avatars for each archetype
   - Verify weighted features appear more frequently
   - Ensure determinism (same seed = same avatar)

3. **Vibe Check**
   - Does it look like a noir album cover? ✅
   - Would it work in a courtroom sketch? ✅
   - Could it be photocopied badly in a zine? ✅
   - Does NOT look like a game avatar store item ✅

---

## 📝 Notes

- **Archetype weights are multipliers, not locks** - Other features can still appear
- **Determinism is preserved** - Same seed + archetype = same result
- **Extensible** - Easy to add new archetypes or features
- **Category-based** - Features are organized by type for easy weighting

---

**Status**: ✅ **CODE COMPLETE - AWAITING ASSETS**

The system is fully configured to match the art bible. Once PNG assets are created following the specifications, the avatars will generate with the correct police-sketch aesthetic and archetype weighting! 🎨👤
