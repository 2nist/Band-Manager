# Asset Creation Checklist

Quick reference checklist for creating avatar assets.

---

## 📋 Pre-Creation Setup

- [ ] Run `npm run setup-assets` to create directories
- [ ] Read `ASSET_CREATION_GUIDE.md` for detailed instructions
- [ ] Review art bible visual style requirements
- [ ] Set up your drawing tool (Photoshop, Procreate, etc.)

---

## 🎨 Asset Creation Progress

### Paper/Background
- [ ] `paper/paper_01.png` - White/off-white paper texture

### Heads (5 required)
- [ ] `heads/head_01.png`
- [ ] `heads/head_02.png`
- [ ] `heads/head_03.png`
- [ ] `heads/head_04.png`
- [ ] `heads/head_05.png`

### Eyes (7 required - all categories)
- [ ] `eyes/eyes_tired_01.png` (category: tired)
- [ ] `eyes/eyes_tired_02.png` (category: tired)
- [ ] `eyes/eyes_narrow_01.png` (category: narrow)
- [ ] `eyes/eyes_heavyLid_01.png` (category: heavyLid)
- [ ] `eyes/eyes_squinting_01.png` (category: squinting)
- [ ] `eyes/eyes_open_01.png` (category: open)
- [ ] `eyes/eyes_neutral_01.png` (category: neutral)

### Noses (8 required - all categories)
- [ ] `noses/nose_narrow_01.png` (category: narrow)
- [ ] `noses/nose_crooked_left_01.png` (category: crooked)
- [ ] `noses/nose_crooked_right_01.png` (category: crooked)
- [ ] `noses/nose_wide_01.png` (category: wide)
- [ ] `noses/nose_hooked_01.png` (category: hooked)
- [ ] `noses/nose_straight_01.png` (category: straight)
- [ ] `noses/nose_prominent_01.png` (category: prominent)
- [ ] `noses/nose_neutral_01.png` (category: neutral)

### Mouths (7 required - all categories)
- [ ] `mouths/mouth_flat_01.png` (category: flat)
- [ ] `mouths/mouth_flat_02.png` (category: flat)
- [ ] `mouths/mouth_downturned_01.png` (category: downturned)
- [ ] `mouths/mouth_smirk_01.png` (category: smirk)
- [ ] `mouths/mouth_neutral_01.png` (category: neutral)
- [ ] `mouths/mouth_neutral_02.png` (category: neutral)
- [ ] `mouths/mouth_thin_01.png` (category: neutral)

### Facial Hair (7 required)
- [ ] `facialHair/facialHair_patchy_01.png` (category: patchy)
- [ ] `facialHair/facialHair_patchy_02.png` (category: patchy)
- [ ] `facialHair/facialHair_heavyStubble_01.png` (category: heavyStubble)
- [ ] `facialHair/facialHair_beard_01.png` (category: beard)
- [ ] `facialHair/facialHair_beard_02.png` (category: beard)
- [ ] `facialHair/facialHair_stubble_01.png` (category: stubble)
- [ ] `facialHair/facialHair_mustache_01.png` (category: mustache)

### Hair (12 required - all categories)
- [ ] `hair/hair_messy_01.png` (category: messy)
- [ ] `hair/hair_messy_02.png` (category: messy)
- [ ] `hair/hair_pulledBack_01.png` (category: pulledBack)
- [ ] `hair/hair_beanie_low_01.png` (category: beanie)
- [ ] `hair/hair_beanie_low_02.png` (category: beanie)
- [ ] `hair/hair_wild_01.png` (category: wild)
- [ ] `hair/hair_wild_02.png` (category: wild)
- [ ] `hair/hair_clean_01.png` (category: clean)
- [ ] `hair/hair_clean_02.png` (category: clean)
- [ ] `hair/hair_bald_01.png` (category: bald)
- [ ] `hair/hair_neutral_01.png` (category: neutral)
- [ ] `hair/hair_neutral_02.png` (category: neutral)

### Accessories (9 required)
- [ ] `accessories/accessory_headphones_01.png` (category: headphones)
- [ ] `accessories/accessory_headphones_02.png` (category: headphones)
- [ ] `accessories/accessory_pencil_behind_ear.png` (category: pencilBehindEar)
- [ ] `accessories/accessory_glasses_crooked_01.png` (category: glasses)
- [ ] `accessories/accessory_glasses_02.png` (category: glasses)
- [ ] `accessories/accessory_earplug_01.png` (category: earplug)
- [ ] `accessories/accessory_earplug_02.png` (category: earplug)
- [ ] `accessories/accessory_scar_01.png` (category: scar)
- [ ] `accessories/accessory_coffee_stain_01.png` (category: coffeeStain)

### Shading (2 required)
- [ ] `shading/shading_underEyes_01.png`
- [ ] `shading/shading_underEyes_02.png`

---

## ✅ Quality Check (Per Asset)

Before finalizing each asset:

- [ ] Size: Exactly 512×512 pixels
- [ ] Format: PNG with transparency
- [ ] Alignment: Center point matches reference (256, 256)
- [ ] Style: Pencil/graphite look (not digital/clean)
- [ ] Color: Black & white only
- [ ] Naming: Matches convention exactly
- [ ] No baked shadows: Shadows in separate layer
- [ ] Transparency: Proper alpha channel
- [ ] File size: Reasonable (< 500KB)

---

## 🧪 Testing

After creating assets:

- [ ] Run `npm run validate-assets` to check structure
- [ ] Test avatar generation in browser
- [ ] Verify alignment (features line up)
- [ ] Test each archetype (drummer, guitarist, etc.)
- [ ] Check determinism (same seed = same avatar)

---

## 📊 Progress Tracking

**Total Assets Required**: 58
- Paper: 1
- Heads: 5
- Eyes: 7
- Noses: 8
- Mouths: 7
- Facial Hair: 7
- Hair: 12
- Accessories: 9
- Shading: 2

**Current Progress**: 0/58 (0%)

---

## 🚀 Quick Start Priority

1. **Minimal Set** (for initial testing):
   - 1 paper
   - 1 head
   - 2 eyes (tired, neutral)
   - 2 noses (straight, neutral)
   - 2 mouths (flat, neutral)
   - 1 hair (neutral)
   - **Total: 9 assets**

2. **Full Category Coverage**:
   - Complete all categories with at least 1 variant
   - **Total: ~30 assets**

3. **Full Set**:
   - All variants as specified
   - **Total: 58 assets**

---

**Start with minimal set, test, then expand!** 🎨
