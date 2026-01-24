/**
 * Create Placeholder Assets
 * 
 * Generates simple placeholder PNG files for testing the avatar system.
 * These are NOT final assets - they're just colored rectangles for testing.
 * 
 * Usage: node scripts/createPlaceholderAssets.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, '../public/avatar/assets');

// Asset definitions from avatarConfig.js
const assetsToCreate = {
  paper: [
    { id: 'paper_1', color: '#F5F5F5', label: 'Paper' }
  ],
  heads: [
    { id: 'head_1', color: '#E0E0E0', label: 'Head 1' },
    { id: 'head_2', color: '#D0D0D0', label: 'Head 2' },
    { id: 'head_3', color: '#E5E5E5', label: 'Head 3' },
    { id: 'head_4', color: '#DDDDDD', label: 'Head 4' },
    { id: 'head_5', color: '#D5D5D5', label: 'Head 5' }
  ],
  eyes: [
    { id: 'eyes_tired_01', color: '#000000', label: 'Tired' },
    { id: 'eyes_tired_02', color: '#111111', label: 'Tired 2' },
    { id: 'eyes_narrow_01', color: '#000000', label: 'Narrow' },
    { id: 'eyes_heavyLid_01', color: '#000000', label: 'Heavy Lid' },
    { id: 'eyes_squinting_01', color: '#000000', label: 'Squinting' },
    { id: 'eyes_open_01', color: '#000000', label: 'Open' },
    { id: 'eyes_neutral_01', color: '#000000', label: 'Neutral' }
  ],
  noses: [
    { id: 'nose_narrow_01', color: '#333333', label: 'Narrow' },
    { id: 'nose_crooked_left_01', color: '#333333', label: 'Crooked L' },
    { id: 'nose_crooked_right_01', color: '#333333', label: 'Crooked R' },
    { id: 'nose_wide_01', color: '#333333', label: 'Wide' },
    { id: 'nose_hooked_01', color: '#333333', label: 'Hooked' },
    { id: 'nose_straight_01', color: '#333333', label: 'Straight' },
    { id: 'nose_prominent_01', color: '#333333', label: 'Prominent' },
    { id: 'nose_neutral_01', color: '#333333', label: 'Neutral' }
  ],
  mouths: [
    { id: 'mouth_flat_01', color: '#222222', label: 'Flat' },
    { id: 'mouth_flat_02', color: '#222222', label: 'Flat 2' },
    { id: 'mouth_downturned_01', color: '#222222', label: 'Downturned' },
    { id: 'mouth_smirk_01', color: '#222222', label: 'Smirk' },
    { id: 'mouth_neutral_01', color: '#222222', label: 'Neutral' },
    { id: 'mouth_neutral_02', color: '#222222', label: 'Neutral 2' },
    { id: 'mouth_thin_01', color: '#222222', label: 'Thin' }
  ],
  facialHair: [
    { id: 'facialHair_patchy_01', color: '#1a1a1a', label: 'Patchy' },
    { id: 'facialHair_patchy_02', color: '#1a1a1a', label: 'Patchy 2' },
    { id: 'facialHair_heavyStubble_01', color: '#1a1a1a', label: 'Heavy Stubble' },
    { id: 'facialHair_beard_01', color: '#1a1a1a', label: 'Beard' },
    { id: 'facialHair_beard_02', color: '#1a1a1a', label: 'Beard 2' },
    { id: 'facialHair_stubble_01', color: '#1a1a1a', label: 'Stubble' },
    { id: 'facialHair_mustache_01', color: '#1a1a1a', label: 'Mustache' }
  ],
  hair: [
    { id: 'hair_messy_01', color: '#0a0a0a', label: 'Messy' },
    { id: 'hair_messy_02', color: '#0a0a0a', label: 'Messy 2' },
    { id: 'hair_pulledBack_01', color: '#0a0a0a', label: 'Pulled Back' },
    { id: 'hair_beanie_low_01', color: '#2a2a2a', label: 'Beanie' },
    { id: 'hair_beanie_low_02', color: '#2a2a2a', label: 'Beanie 2' },
    { id: 'hair_wild_01', color: '#0a0a0a', label: 'Wild' },
    { id: 'hair_wild_02', color: '#0a0a0a', label: 'Wild 2' },
    { id: 'hair_clean_01', color: '#0a0a0a', label: 'Clean' },
    { id: 'hair_clean_02', color: '#0a0a0a', label: 'Clean 2' },
    { id: 'hair_bald_01', color: '#FFFFFF', label: 'Bald' },
    { id: 'hair_neutral_01', color: '#0a0a0a', label: 'Neutral' },
    { id: 'hair_neutral_02', color: '#0a0a0a', label: 'Neutral 2' }
  ],
  accessories: [
    { id: 'accessory_headphones_01', color: '#444444', label: 'Headphones' },
    { id: 'accessory_headphones_02', color: '#444444', label: 'Headphones 2' },
    { id: 'accessory_pencil_behind_ear', color: '#666666', label: 'Pencil' },
    { id: 'accessory_glasses_crooked_01', color: '#555555', label: 'Glasses Crooked' },
    { id: 'accessory_glasses_02', color: '#555555', label: 'Glasses' },
    { id: 'accessory_earplug_01', color: '#333333', label: 'Earplug' },
    { id: 'accessory_earplug_02', color: '#333333', label: 'Earplug 2' },
    { id: 'accessory_scar_01', color: '#111111', label: 'Scar' },
    { id: 'accessory_coffee_stain_01', color: '#3a3a3a', label: 'Coffee Stain' }
  ],
  shading: [
    { id: 'shading_underEyes_01', color: '#CCCCCC', label: 'Shading 1' },
    { id: 'shading_underEyes_02', color: '#BBBBBB', label: 'Shading 2' }
  ]
};

function createPlaceholderImage(id, color, label, size = 512) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Fill with transparent background
  ctx.clearRect(0, 0, size, size);

  // Draw a simple shape in the center (for testing alignment)
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.1;

  // Draw circle/ellipse based on category
  if (id.includes('head')) {
    // Head: larger ellipse
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius * 2, radius * 2.5, 0, 0, Math.PI * 2);
    ctx.fill();
  } else if (id.includes('eyes')) {
    // Eyes: two small circles
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX - radius, centerY, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + radius, centerY, radius * 0.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (id.includes('nose')) {
    // Nose: small triangle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius);
    ctx.lineTo(centerX - radius * 0.5, centerY + radius);
    ctx.lineTo(centerX + radius * 0.5, centerY + radius);
    ctx.closePath();
    ctx.fill();
  } else if (id.includes('mouth')) {
    // Mouth: horizontal line/ellipse
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.3, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (id.includes('hair') || id.includes('beanie')) {
    // Hair: arc on top
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY - radius * 1.5, radius * 2, Math.PI, 0, false);
    ctx.fill();
  } else if (id.includes('paper')) {
    // Paper: full background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);
  } else {
    // Default: small circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add label text (for debugging)
  ctx.fillStyle = '#000000';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(label, centerX, size - 10);

  return canvas.toBuffer('image/png');
}

function createPlaceholderAssets() {
  console.log('🎨 Creating placeholder avatar assets...\n');

  let created = 0;
  let skipped = 0;

  // Create directories and assets
  for (const [category, assets] of Object.entries(assetsToCreate)) {
    const categoryDir = path.join(assetsDir, category);

    // Create directory if it doesn't exist
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
      console.log(`📁 Created directory: ${category}/`);
    }

    // Create assets
    for (const asset of assets) {
      const filePath = path.join(categoryDir, `${asset.id}.png`);

      // Skip if file already exists
      if (fs.existsSync(filePath)) {
        skipped++;
        continue;
      }

      try {
        const imageBuffer = createPlaceholderImage(asset.id, asset.color, asset.label);
        fs.writeFileSync(filePath, imageBuffer);
        created++;
        console.log(`✅ Created: ${category}/${asset.id}.png`);
      } catch (error) {
        console.error(`❌ Error creating ${category}/${asset.id}.png:`, error.message);
      }
    }
  }

  console.log(`\n📊 Summary: ${created} created, ${skipped} skipped`);
  console.log('\n⚠️  NOTE: These are PLACEHOLDER assets for testing only!');
  console.log('   Replace with actual police-sketch style assets following ASSET_CREATION_GUIDE.md\n');
}

// Check if canvas package is available
try {
  createPlaceholderAssets();
} catch (error) {
  if (error.message.includes('canvas')) {
    console.error('❌ Error: "canvas" package not installed.');
    console.error('   Install with: npm install canvas');
    console.error('   Or create assets manually following ASSET_CREATION_GUIDE.md');
  } else {
    throw error;
  }
}
