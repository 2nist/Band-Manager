# Avatar Asset Creation Guide

## Quick Answer: Who Creates the Assets?

**I've created placeholder PNG files** (155 total) that will work for testing, but they're just minimal transparent files. 

**For the final assets**, you have two options:

### Option 1: Use AI Image Generation (Recommended for Quick Start)
I can generate example assets using AI image generation. These will be in a police sketch style and can serve as:
- Reference examples for the style
- Starting point assets that you can refine
- Complete set if you want to use them directly

**Would you like me to generate example assets for all 142 variations?**

### Option 2: Create Them Yourself (Recommended for Final Polish)
For the best results matching your exact vision, you should create them using:
- **Digital drawing software** (Photoshop, Procreate, Krita, etc.)
- **Traditional scanning** (draw on paper, scan, clean up)
- **Commission an artist** familiar with police sketch style

## What I've Done

✅ **Created 155 placeholder PNG files** - These work for testing but are just transparent placeholders
✅ **Expanded configuration** to support 142 asset variations
✅ **Created generation script** (`npm run generate-all-placeholders`)
✅ **Documented all assets** in `AVATAR_ASSETS_EXPANSION.md`

## Next Steps

### Batch Generator (avatar-gen)
We've integrated the batch avatar generator at `tools/avatar-gen` for fast, deterministic police-sketch assets.

**Location:** `tools/avatar-gen` (mirrors the upstream repo)

**Quick start:**
1. Start Automatic1111 WebUI with API enabled:
   - `webui-user.bat --api`
   - Verify: `http://127.0.0.1:7860/docs`
2. Install dependencies:
   - `cd tools/avatar-gen`
   - `npm install`
3. Generate assets:
   - `npm run avatar:gen` (from repo root)
   - Or with alpha removal: `npm run avatar:gen:alpha`
4. Copy output PNGs into `public/avatar/assets/<category>/`:
   - `npm run avatar:sync`
   - Or alpha outputs: `npm run avatar:sync:alpha`
5. One-shot (generate + sync):
   - `npm run avatar:gen:sync`
   - Or alpha: `npm run avatar:gen:alpha:sync`

**Notes:**
- Outputs are written to `tools/avatar-gen/outputs/<category>/` (and `outputs/<category>/alpha` if `--alpha` is used).
- `rembg` is required for `--alpha`: `pip install rembg`.
- Prompts and batches are in `tools/avatar-gen/prompts/` and `tools/avatar-gen/batches/`.

### If You Want Me to Generate Example Assets:
I can use AI image generation to create police-sketch style examples for:
- All 20 eye variations
- All 20 nose variations  
- All 25 mouth variations
- All 20 facial hair variations
- All 35 hair variations
- All 22 accessory variations

**Just say "yes, generate example assets" and I'll create them!**

### If You Want to Create Them Yourself:
1. **Reference the style**: Police sketch aesthetic (black & white, pencil/graphite look)
2. **Follow the naming**: All filenames are listed in `AVATAR_ASSETS_EXPANSION.md`
3. **Use the specs**: 512×512 PNG, transparent background, centered at (256, 256)
4. **Test frequently**: Place assets in `public/avatar/assets/` and test avatar generation

## Current Status

- ✅ **Configuration**: Complete (142 assets configured)
- ✅ **Placeholders**: Created (155 minimal PNGs)
- ⏳ **Final Assets**: Need to be created (either by me via AI or by you)

The system is ready to use - it will show placeholders until you add the actual assets!
