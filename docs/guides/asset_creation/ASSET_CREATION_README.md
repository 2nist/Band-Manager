# Asset Creation - Quick Start

**Goal**: Create 58 PNG assets for police-sketch style avatars.

---

## 🚀 Quick Start (3 Steps)

### Step 1: Setup Directories
```bash
npm run setup-assets
```
Creates all required directories in `public/avatar/assets/`

### Step 2: Create Assets
Follow `ASSET_CREATION_GUIDE.md` for detailed instructions.

**Priority Order**:
1. Start with **minimal set** (9 assets) for testing
2. Expand to **full category coverage** (~30 assets)
3. Complete **full set** (58 assets)

### Step 3: Validate
```bash
npm run validate-assets
```
Checks that all assets are in place and named correctly.

---

## 📚 Documentation

- **`ASSET_CREATION_GUIDE.md`** - Detailed creation guide with visual style rules
- **`ASSET_CREATION_CHECKLIST.md`** - Quick checklist for tracking progress
- **`ART_BIBLE_IMPLEMENTATION.md`** - Art bible specifications
- **`public/avatar/assets/README.md`** - Directory structure reference

---

## 🎨 Visual Style (Quick Reference)

- **Medium**: Pencil/graphite/charcoal
- **Color**: Black & white ONLY
- **Size**: 512×512 pixels
- **Format**: PNG with transparency
- **Alignment**: All assets center at (256, 256)
- **Style**: Police sketch aesthetic (not cartoony!)

---

## ✅ Minimal Test Set

Create these 9 assets first to test the system:

1. `paper/paper_01.png`
2. `heads/head_01.png`
3. `eyes/eyes_tired_01.png`
4. `eyes/eyes_neutral_01.png`
5. `noses/nose_straight_01.png`
6. `noses/nose_neutral_01.png`
7. `mouths/mouth_flat_01.png`
8. `mouths/mouth_neutral_01.png`
9. `hair/hair_neutral_01.png`

Once these work, expand to full set!

---

## 🛠️ Tools & Scripts

- `npm run setup-assets` - Create directory structure
- `npm run validate-assets` - Validate asset structure
- `npm run create-placeholders` - Generate test placeholders (requires `canvas` package)

---

## 📝 Notes

- **Start small**: Test with minimal set first
- **Iterate**: Test composition frequently
- **Reference**: Keep art bible handy
- **Vibe check**: Does it look like a police sketch? ✅

---

**Ready to create!** Start with the minimal set, test, then expand. 🎨
