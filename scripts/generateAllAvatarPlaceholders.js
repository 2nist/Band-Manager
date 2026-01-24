/**
 * Generate All Avatar Placeholder Assets
 * 
 * Creates placeholder PNG files for ALL avatar assets (142 total).
 * These are simple black shapes on transparent backgrounds for testing.
 * 
 * Usage: 
 *   Option 1 (with canvas): npm install canvas && node scripts/generateAllAvatarPlaceholders.js
 *   Option 2 (without canvas): Creates minimal transparent PNGs that work but show placeholders
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, '../public/avatar/assets');

// Complete asset list from expanded avatarConfig.js
const ASSET_STRUCTURE = {
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

/**
 * Create a minimal transparent PNG (1x1 pixel, fully transparent)
 * This is a valid PNG that won't break the system but will show placeholders
 */
function createMinimalPNG() {
  // Base64 encoded 1x1 transparent PNG
  return Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );
}

/**
 * Try to create a proper placeholder using canvas if available
 */
async function createPlaceholderWithCanvas(id, category, size = 512) {
  try {
    const { createCanvas } = await import('canvas');
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Clear to transparent
    ctx.clearRect(0, 0, size, size);
    
    const centerX = size / 2;
    const centerY = size / 2;
    
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#000000';
    ctx.lineWidth = 3;
    
    // Draw different shapes based on category
    if (category === 'paper') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);
    } else if (category === 'heads') {
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, size * 0.35, size * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (category === 'eyes') {
      // Two eyes
      ctx.beginPath();
      ctx.ellipse(centerX - size * 0.12, centerY - size * 0.08, size * 0.05, size * 0.03, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(centerX + size * 0.12, centerY - size * 0.08, size * 0.05, size * 0.03, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (category === 'noses') {
      // Nose shape
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - size * 0.04);
      ctx.lineTo(centerX - size * 0.02, centerY + size * 0.08);
      ctx.lineTo(centerX + size * 0.02, centerY + size * 0.08);
      ctx.closePath();
      ctx.stroke();
    } else if (category === 'mouths') {
      // Mouth line
      ctx.beginPath();
      ctx.moveTo(centerX - size * 0.15, centerY + size * 0.2);
      ctx.quadraticCurveTo(centerX, centerY + size * 0.22, centerX + size * 0.15, centerY + size * 0.2);
      ctx.stroke();
    } else if (category === 'hair') {
      // Hair arc
      ctx.beginPath();
      ctx.arc(centerX, centerY - size * 0.3, size * 0.4, Math.PI, 0, false);
      ctx.stroke();
    } else if (category === 'facialHair') {
      // Beard area
      ctx.beginPath();
      ctx.arc(centerX, centerY + size * 0.3, size * 0.15, 0, Math.PI * 2);
      ctx.stroke();
    } else if (category === 'accessories') {
      // Generic accessory shape
      if (id.includes('glasses')) {
        ctx.beginPath();
        ctx.ellipse(centerX - size * 0.12, centerY - size * 0.08, size * 0.07, size * 0.04, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(centerX + size * 0.12, centerY - size * 0.08, size * 0.07, size * 0.04, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(centerX - size * 0.05, centerY - size * 0.08);
        ctx.lineTo(centerX + size * 0.05, centerY - size * 0.08);
        ctx.stroke();
      } else if (id.includes('headphones')) {
        ctx.beginPath();
        ctx.arc(centerX - size * 0.12, centerY - size * 0.08, size * 0.08, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX + size * 0.12, centerY - size * 0.08, size * 0.08, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(centerX, centerY - size * 0.15, size * 0.2, Math.PI, 0, false);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(centerX, centerY, size * 0.06, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (category === 'shading') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + size * 0.04, size * 0.2, size * 0.16, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    
    return canvas.toBuffer('image/png');
  } catch (error) {
    // Canvas not available, return minimal PNG
    return createMinimalPNG();
  }
}

/**
 * Ensure directory exists
 */
function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Generate all placeholder assets
 */
async function generateAllPlaceholders() {
  const baseDir = assetsDir;
  let created = 0;
  let skipped = 0;
  let hasCanvas = false;
  let createCanvasFn = null;
  
  // Check if canvas is available
  try {
    const canvasModule = await import('canvas');
    createCanvasFn = canvasModule.createCanvas;
    hasCanvas = true;
    console.log('✅ Canvas package found - generating proper placeholder shapes\n');
  } catch {
    console.log('⚠️  Canvas package not found - creating minimal transparent PNGs');
    console.log('   Install with: npm install canvas (optional, for better placeholders)\n');
  }
  
  console.log('🎨 Generating placeholder avatar assets...\n');
  
  for (const [category, files] of Object.entries(ASSET_STRUCTURE)) {
    const categoryDir = path.join(baseDir, category);
    ensureDirectory(categoryDir);
    
    for (const filename of files) {
      const filePath = path.join(categoryDir, filename);
      
      // Delete existing placeholder to regenerate with canvas
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      
      try {
        const size = 512;
        let imageBuffer;
        if (hasCanvas && createCanvasFn) {
          const canvas = createCanvasFn(size, size);
          const ctx = canvas.getContext('2d');
          
          // Clear to transparent
          ctx.clearRect(0, 0, size, size);
          
          const centerX = size / 2;
          const centerY = size / 2;
          
          ctx.strokeStyle = '#000000';
          ctx.fillStyle = '#000000';
          ctx.lineWidth = 3;
          
          // Draw different shapes based on category
          if (category === 'paper') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, size, size);
          } else if (category === 'heads') {
            ctx.beginPath();
            ctx.ellipse(centerX, centerY, size * 0.35, size * 0.4, 0, 0, Math.PI * 2);
            ctx.stroke();
          } else if (category === 'eyes') {
            // Two eyes
            ctx.beginPath();
            ctx.ellipse(centerX - size * 0.12, centerY - size * 0.08, size * 0.05, size * 0.03, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(centerX + size * 0.12, centerY - size * 0.08, size * 0.05, size * 0.03, 0, 0, Math.PI * 2);
            ctx.stroke();
          } else if (category === 'noses') {
            // Nose shape
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - size * 0.04);
            ctx.lineTo(centerX - size * 0.02, centerY + size * 0.08);
            ctx.lineTo(centerX + size * 0.02, centerY + size * 0.08);
            ctx.closePath();
            ctx.stroke();
          } else if (category === 'mouths') {
            // Mouth line
            ctx.beginPath();
            ctx.moveTo(centerX - size * 0.15, centerY + size * 0.2);
            ctx.quadraticCurveTo(centerX, centerY + size * 0.22, centerX + size * 0.15, centerY + size * 0.2);
            ctx.stroke();
          } else if (category === 'hair') {
            // Hair arc
            ctx.beginPath();
            ctx.arc(centerX, centerY - size * 0.3, size * 0.4, Math.PI, 0, false);
            ctx.stroke();
          } else if (category === 'facialHair') {
            // Beard area
            ctx.beginPath();
            ctx.arc(centerX, centerY + size * 0.3, size * 0.15, 0, Math.PI * 2);
            ctx.stroke();
          } else if (category === 'accessories') {
            // Generic accessory shape
            const assetId = filename.replace('.png', '');
            if (assetId.includes('glasses')) {
              ctx.beginPath();
              ctx.ellipse(centerX - size * 0.12, centerY - size * 0.08, size * 0.07, size * 0.04, 0, 0, Math.PI * 2);
              ctx.stroke();
              ctx.beginPath();
              ctx.ellipse(centerX + size * 0.12, centerY - size * 0.08, size * 0.07, size * 0.04, 0, 0, Math.PI * 2);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(centerX - size * 0.05, centerY - size * 0.08);
              ctx.lineTo(centerX + size * 0.05, centerY - size * 0.08);
              ctx.stroke();
            } else if (assetId.includes('headphones')) {
              ctx.beginPath();
              ctx.arc(centerX - size * 0.12, centerY - size * 0.08, size * 0.08, 0, Math.PI * 2);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(centerX + size * 0.12, centerY - size * 0.08, size * 0.08, 0, Math.PI * 2);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(centerX, centerY - size * 0.15, size * 0.2, Math.PI, 0, false);
              ctx.stroke();
            } else {
              ctx.beginPath();
              ctx.arc(centerX, centerY, size * 0.06, 0, Math.PI * 2);
              ctx.stroke();
            }
          } else if (category === 'shading') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.beginPath();
            ctx.ellipse(centerX, centerY + size * 0.04, size * 0.2, size * 0.16, 0, 0, Math.PI * 2);
            ctx.fill();
          }
          
          imageBuffer = canvas.toBuffer('image/png');
        } else {
          imageBuffer = createMinimalPNG();
        }
        
        fs.writeFileSync(filePath, imageBuffer);
        created++;
        if (created % 20 === 0) {
          process.stdout.write(`  Generated ${created}...\r`);
        }
      } catch (error) {
        console.error(`\n❌ Error creating ${category}/${filename}:`, error.message);
      }
    }
  }
  
  const total = Object.values(ASSET_STRUCTURE).flat().length;
  console.log(`\n✅ Generated ${created} new assets (${skipped} already existed)`);
  console.log(`📊 Total assets configured: ${total}`);
  console.log(`\n📝 Note: These are PLACEHOLDER assets for testing!`);
  console.log(`   Replace with actual police-sketch style assets when ready.`);
  console.log(`   See AVATAR_ASSETS_EXPANSION.md for the complete asset list.\n`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.includes('generateAllAvatarPlaceholders')) {
  generateAllPlaceholders().catch(console.error);
}

export { generateAllPlaceholders, createPlaceholderWithCanvas };
