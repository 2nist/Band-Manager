# Avatar Assets Directory

This directory contains PNG assets for procedural avatar generation.

## Directory Structure

```
avatar/assets/
├── paper/          # Background paper textures
├── heads/          # Head/face shapes (5+ variations)
├── eyes/           # Eye styles (5+ variations)
├── noses/          # Nose styles (4+ variations)
├── mouths/         # Mouth expressions (5+ variations)
├── facialHair/    # Beards, mustaches (optional)
├── hair/           # Hairstyles (6+ variations)
├── accessories/    # Glasses, hats (optional)
└── shading/        # Shading/lighting overlays (optional)
```

## Asset Requirements

All PNG assets must:
- Be **512×512 pixels** (or 1024×1024 for higher quality)
- Have **transparent backgrounds**
- Share the **same face center** (approximately 256, 256 for 512×512)
- Be **black and white** (police sketch aesthetic)
- Have **no baked-in shadows** that overlap other layers
- Use **proper transparency** (no white pixels pretending to be transparent)

## Layer Order

Assets are drawn in this order:
1. Paper (background)
2. Head
3. Eyes
4. Nose
5. Mouth
6. Facial Hair (optional)
7. Hair
8. Accessories (optional)
9. Shading (optional)

## Placeholder Assets

Until real assets are created, the system will gracefully handle missing files by:
- Logging warnings for missing assets
- Continuing with available layers
- Rendering a white canvas if no assets are available

## Asset Naming Convention

- Use descriptive names: `head_1.png`, `eyes_2.png`, etc.
- Match the IDs in `avatarConfig.js`
- Keep filenames lowercase with underscores
