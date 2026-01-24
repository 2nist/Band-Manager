# Asset Creation Guide - Police Sketch Avatars

**Purpose**: Create PNG assets for procedural avatar generation following the art bible specifications.

---

## 🎨 Visual Style Requirements

### Non-Negotiable Rules
- **Medium**: Pencil/graphite/charcoal look
- **Color**: Black & white or warm sepia ONLY
- **Background**: White or off-white paper
- **No gradients**: Cross-hatching only
- **Line quality**: Uneven stroke width, slight wobble, occasional broken lines
- **No perfect symmetry**: Imperfection is intentional
- **Shading**: Cross-hatching only, directional (under eyes, nose, jaw, hat brim)

### Expressions
- ✅ Neutral, tired, judgmental, thinking
- ❌ No big smiles
- ❌ No teeth
- ❌ No exaggerated emotions

---

## 📐 Technical Specifications

### Canvas Size
- **Standard**: 512×512 pixels
- **High Quality**: 1024×1024 pixels (optional)
- **All assets must be the same size**

### Alignment
- **Face Center**: All assets must align to the same center point
- **For 512×512**: Center at (256, 256)
- **For 1024×1024**: Center at (512, 512)

### File Format
- **Format**: PNG
- **Background**: Transparent (alpha channel)
- **Color Mode**: Grayscale or RGB (will be rendered as grayscale)
- **No baked shadows**: Shadows should be separate shading layers

---

## 📁 Required Asset List

### Paper/Background (1 asset)
```
paper/paper_01.png
```
- White or off-white paper texture
- Subtle grain/noise
- No jitter needed (background layer)

### Heads (5+ assets)
```
heads/head_01.png
heads/head_02.png
heads/head_03.png
heads/head_04.png
heads/head_05.png
```
- Face shapes: oval, round, square, heart, diamond, long, wide
- Basic head outline
- No features (eyes, nose, mouth drawn separately)
- Center-aligned

### Eyes (7+ assets)
```
eyes/eyes_tired_01.png      (category: tired)
eyes/eyes_tired_02.png      (category: tired)
eyes/eyes_narrow_01.png     (category: narrow)
eyes/eyes_heavyLid_01.png   (category: heavyLid)
eyes/eyes_squinting_01.png  (category: squinting)
eyes/eyes_open_01.png       (category: open)
eyes/eyes_neutral_01.png    (category: neutral)
```
- **Tired**: Heavy lids, slight bags
- **Narrow**: Thin, focused
- **Heavy Lid**: Droopy, sleepy
- **Squinting**: Partially closed, intense
- **Open**: Wide, alert
- **Neutral**: Standard, balanced

### Noses (8+ assets)
```
noses/nose_narrow_01.png         (category: narrow)
noses/nose_crooked_left_01.png   (category: crooked)
noses/nose_crooked_right_01.png  (category: crooked)
noses/nose_wide_01.png           (category: wide)
noses/nose_hooked_01.png         (category: hooked)
noses/nose_straight_01.png       (category: straight)
noses/nose_prominent_01.png      (category: prominent)
noses/nose_neutral_01.png         (category: neutral)
```
- **Narrow**: Thin, refined
- **Crooked**: Asymmetric, broken (left/right variants)
- **Wide**: Broad, flat
- **Hooked**: Curved downward
- **Straight**: Classic, balanced
- **Prominent**: Large, noticeable
- **Neutral**: Standard

### Mouths (7+ assets)
```
mouths/mouth_flat_01.png         (category: flat)
mouths/mouth_flat_02.png         (category: flat)
mouths/mouth_downturned_01.png   (category: downturned)
mouths/mouth_smirk_01.png         (category: smirk)
mouths/mouth_neutral_01.png      (category: neutral)
mouths/mouth_neutral_02.png      (category: neutral)
mouths/mouth_thin_01.png         (category: neutral)
```
- **Flat**: Straight line, no expression
- **Downturned**: Frown, sad
- **Smirk**: Slight upward curve, one side
- **Neutral**: Balanced, minimal expression
- **Thin**: Narrow, tight

### Facial Hair (7+ assets)
```
facialHair/facialHair_patchy_01.png        (category: patchy)
facialHair/facialHair_patchy_02.png        (category: patchy)
facialHair/facialHair_heavyStubble_01.png  (category: heavyStubble)
facialHair/facialHair_beard_01.png         (category: beard)
facialHair/facialHair_beard_02.png         (category: beard)
facialHair/facialHair_stubble_01.png       (category: stubble)
facialHair/facialHair_mustache_01.png      (category: mustache)
```
- **Patchy**: Uneven, sparse
- **Heavy Stubble**: Thick, rough
- **Beard**: Full, well-defined
- **Stubble**: Light, short
- **Mustache**: Upper lip only

### Hair (12+ assets)
```
hair/hair_messy_01.png          (category: messy)
hair/hair_messy_02.png          (category: messy)
hair/hair_pulledBack_01.png     (category: pulledBack)
hair/hair_beanie_low_01.png     (category: beanie)
hair/hair_beanie_low_02.png     (category: beanie)
hair/hair_wild_01.png           (category: wild)
hair/hair_wild_02.png           (category: wild)
hair/hair_clean_01.png          (category: clean)
hair/hair_clean_02.png          (category: clean)
hair/hair_bald_01.png           (category: bald)
hair/hair_neutral_01.png        (category: neutral)
hair/hair_neutral_02.png        (category: neutral)
```
- **Messy**: Unkempt, tousled
- **Pulled Back**: Slicked back, ponytail, bun
- **Beanie**: Hat covering hair
- **Wild**: Untamed, voluminous
- **Clean**: Neat, styled
- **Bald**: No hair or very short
- **Neutral**: Standard, medium length

### Accessories (9+ assets)
```
accessories/accessory_headphones_01.png         (category: headphones)
accessories/accessory_headphones_02.png         (category: headphones)
accessories/accessory_pencil_behind_ear.png    (category: pencilBehindEar)
accessories/accessory_glasses_crooked_01.png    (category: glasses)
accessories/accessory_glasses_02.png            (category: glasses)
accessories/accessory_earplug_01.png           (category: earplug)
accessories/accessory_earplug_02.png           (category: earplug)
accessories/accessory_scar_01.png              (category: scar)
accessories/accessory_coffee_stain_01.png      (category: coffeeStain)
```
- **Headphones**: Over-ear, studio style
- **Pencil Behind Ear**: Simple line, behind ear
- **Glasses**: Crooked or straight frames
- **Earplug**: Small, in ear
- **Scar**: Facial scar, subtle line
- **Coffee Stain**: Clothing stain, subtle

### Shading (2+ assets)
```
shading/shading_underEyes_01.png
shading/shading_underEyes_02.png
```
- Cross-hatching under eyes
- Subtle, not too dark
- Directional shading

---

## 🎯 Creation Workflow

### Step 1: Setup
1. Create directory structure: `public/avatar/assets/`
2. Create subdirectories: `paper/`, `heads/`, `eyes/`, `noses/`, `mouths/`, `facialHair/`, `hair/`, `accessories/`, `shading/`

### Step 2: Reference Grid
- Create a 512×512 canvas
- Mark center point (256, 256)
- Add alignment guides for eyes, nose, mouth positions
- Use this as a template for all assets

### Step 3: Drawing Guidelines
- **Start with heads**: Establish base shapes
- **Add features**: Eyes, nose, mouth (separate files)
- **Layer order matters**: Draw in the order they'll be composited
- **Test alignment**: Overlay assets to ensure they align

### Step 4: Style Consistency
- Use same pencil/brush tool throughout
- Maintain consistent line weight (with intentional variation)
- Use same cross-hatching pattern for shading
- Keep expressions subtle

### Step 5: Export
- Export as PNG with transparency
- Ensure all assets are same size
- Verify center alignment
- Test in composition

---

## ✅ Quality Checklist

Before finalizing each asset:

- [ ] **Size**: Exactly 512×512 (or 1024×1024)
- [ ] **Format**: PNG with transparency
- [ ] **Alignment**: Center point matches reference
- [ ] **Style**: Matches art bible (pencil/graphite)
- [ ] **Color**: Black & white only
- [ ] **Naming**: Follows convention (`eyes_tired_01.png`)
- [ ] **No baked shadows**: Shadows in separate layer
- [ ] **Transparency**: Proper alpha channel
- [ ] **File size**: Reasonable (< 500KB per asset)

---

## 🧪 Testing Assets

Once assets are created:

1. **Place in correct directories**
2. **Run validation script** (see `validateAssets.js`)
3. **Test in browser** - Generate avatars
4. **Check alignment** - Features should line up
5. **Verify archetype weighting** - Test each archetype

---

## 📝 Notes

- **Start small**: Create 1-2 variants per category first, test, then expand
- **Iterate**: Test composition frequently
- **Reference**: Keep art bible handy
- **Vibe check**: Does it look like a police sketch? ✅

---

## 🚀 Quick Start

1. Create `public/avatar/assets/` directory structure
2. Start with minimal set: 1 head, 2 eyes, 2 noses, 2 mouths, 1 hair, 1 paper
3. Test the system works
4. Expand gradually

**Priority Order**:
1. Paper background
2. Heads (5 variants)
3. Eyes (7 variants - all categories)
4. Noses (8 variants - all categories)
5. Mouths (7 variants - all categories)
6. Hair (12 variants - all categories)
7. Facial Hair (7 variants)
8. Accessories (9 variants)
9. Shading (2 variants)

---

**Ready to create assets!** Follow this guide and the art bible for consistent, professional police-sketch style avatars. 🎨
