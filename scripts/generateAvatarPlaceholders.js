/**
 * Generate Placeholder Avatar Assets
 * 
 * Creates placeholder PNG files for the avatar system.
 * These are simple black shapes on transparent backgrounds that match
 * the art bible naming convention.
 * 
 * Run with: node scripts/generateAvatarPlaceholders.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Asset structure based on avatarConfig.js
const ASSET_STRUCTURE = {
  paper: ['paper_01.png'],
  heads: ['head_01.png', 'head_02.png', 'head_03.png', 'head_04.png', 'head_05.png'],
  eyes: [
    'eyes_tired_01.png',
    'eyes_tired_02.png',
    'eyes_narrow_01.png',
    'eyes_heavyLid_01.png',
    'eyes_squinting_01.png',
    'eyes_open_01.png',
    'eyes_neutral_01.png'
  ],
  noses: [
    'nose_narrow_01.png',
    'nose_crooked_left_01.png',
    'nose_crooked_right_01.png',
    'nose_wide_01.png',
    'nose_hooked_01.png',
    'nose_straight_01.png',
    'nose_prominent_01.png',
    'nose_neutral_01.png'
  ],
  mouths: [
    'mouth_flat_01.png',
    'mouth_flat_02.png',
    'mouth_downturned_01.png',
    'mouth_smirk_01.png',
    'mouth_neutral_01.png',
    'mouth_neutral_02.png',
    'mouth_thin_01.png'
  ],
  facialHair: [
    'facialHair_patchy_01.png',
    'facialHair_patchy_02.png',
    'facialHair_heavyStubble_01.png',
    'facialHair_beard_01.png',
    'facialHair_beard_02.png',
    'facialHair_stubble_01.png',
    'facialHair_mustache_01.png'
  ],
  hair: [
    'hair_messy_01.png',
    'hair_messy_02.png',
    'hair_pulledBack_01.png',
    'hair_beanie_low_01.png',
    'hair_beanie_low_02.png',
    'hair_wild_01.png',
    'hair_wild_02.png',
    'hair_clean_01.png',
    'hair_clean_02.png',
    'hair_bald_01.png',
    'hair_neutral_01.png',
    'hair_neutral_02.png'
  ],
  accessories: [
    'accessory_headphones_01.png',
    'accessory_headphones_02.png',
    'accessory_pencil_behind_ear.png',
    'accessory_glasses_crooked_01.png',
    'accessory_glasses_02.png',
    'accessory_earplug_01.png',
    'accessory_earplug_02.png',
    'accessory_scar_01.png',
    'accessory_coffee_stain_01.png'
  ],
  shading: [
    'shading_underEyes_01.png',
    'shading_underEyes_02.png',
    'shading_nose_01.png',
    'shading_jaw_01.png'
  ]
};

/**
 * Generate a simple SVG placeholder
 * Since we can't easily generate PNGs without canvas library,
 * we'll create SVG placeholders that can be converted to PNG
 */
function generateSVGPlaceholder(name, type, width = 512, height = 512) {
  // Center point for face alignment
  const centerX = width / 2;
  const centerY = height / 2;
  
  let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="none"/>
`;

  // Generate different shapes based on type
  if (type === 'paper') {
    // Paper texture - subtle grid
    svgContent += `  <rect width="${width}" height="${height}" fill="#FFFFFF" opacity="0.95"/>
  <defs>
    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E0E0E0" stroke-width="0.5" opacity="0.3"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>`;
  } else if (type === 'head') {
    // Head shape - oval
    svgContent += `  <ellipse cx="${centerX}" cy="${centerY}" rx="180" ry="220" fill="none" stroke="#000000" stroke-width="3" opacity="0.8"/>`;
  } else if (type === 'eyes') {
    // Eyes - two ovals
    svgContent += `  <ellipse cx="${centerX - 60}" cy="${centerY - 40}" rx="25" ry="15" fill="none" stroke="#000000" stroke-width="2" opacity="0.9"/>
  <ellipse cx="${centerX + 60}" cy="${centerY - 40}" rx="25" ry="15" fill="none" stroke="#000000" stroke-width="2" opacity="0.9"/>`;
  } else if (type === 'nose') {
    // Nose - simple line/curve
    svgContent += `  <path d="M ${centerX} ${centerY - 20} Q ${centerX} ${centerY + 20} ${centerX + 10} ${centerY + 40}" fill="none" stroke="#000000" stroke-width="2" opacity="0.8"/>`;
  } else if (type === 'mouth') {
    // Mouth - horizontal line or curve
    svgContent += `  <path d="M ${centerX - 40} ${centerY + 60} Q ${centerX} ${centerY + 70} ${centerX + 40} ${centerY + 60}" fill="none" stroke="#000000" stroke-width="2" opacity="0.8"/>`;
  } else if (type === 'hair') {
    // Hair - top curve
    svgContent += `  <path d="M ${centerX - 150} ${centerY - 200} Q ${centerX} ${centerY - 250} ${centerX + 150} ${centerY - 200} L ${centerX + 140} ${centerY - 180} Q ${centerX} ${centerY - 220} ${centerX - 140} ${centerY - 180} Z" fill="#000000" opacity="0.7"/>`;
  } else if (type === 'facialHair') {
    // Facial hair - beard area
    svgContent += `  <path d="M ${centerX - 80} ${centerY + 40} Q ${centerX} ${centerY + 100} ${centerX + 80} ${centerY + 40}" fill="none" stroke="#000000" stroke-width="3" opacity="0.6"/>`;
  } else if (type === 'accessories') {
    // Accessories - glasses shape
    if (name.includes('glasses')) {
      svgContent += `  <ellipse cx="${centerX - 60}" cy="${centerY - 40}" rx="35" ry="20" fill="none" stroke="#000000" stroke-width="2" opacity="0.8"/>
  <ellipse cx="${centerX + 60}" cy="${centerY - 40}" rx="35" ry="20" fill="none" stroke="#000000" stroke-width="2" opacity="0.8"/>
  <line x1="${centerX - 25}" y1="${centerY - 40}" x2="${centerX + 25}" y2="${centerY - 40}" stroke="#000000" stroke-width="2" opacity="0.8"/>`;
    } else if (name.includes('headphones')) {
      svgContent += `  <ellipse cx="${centerX - 60}" cy="${centerY - 40}" rx="40" ry="30" fill="none" stroke="#000000" stroke-width="3" opacity="0.7"/>
  <ellipse cx="${centerX + 60}" cy="${centerY - 40}" rx="40" ry="30" fill="none" stroke="#000000" stroke-width="3" opacity="0.7"/>
  <path d="M ${centerX - 100} ${centerY - 40} Q ${centerX} ${centerY - 60} ${centerX + 100} ${centerY - 40}" fill="none" stroke="#000000" stroke-width="3" opacity="0.7"/>`;
    } else {
      // Generic accessory
      svgContent += `  <circle cx="${centerX}" cy="${centerY}" r="30" fill="none" stroke="#000000" stroke-width="2" opacity="0.6"/>`;
    }
  } else if (type === 'shading') {
    // Shading - subtle gradient area
    svgContent += `  <ellipse cx="${centerX}" cy="${centerY + 20}" rx="100" ry="80" fill="#000000" opacity="0.1"/>`;
  }

  svgContent += `\n</svg>`;
  return svgContent;
}

/**
 * Create directory if it doesn't exist
 */
function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
}

/**
 * Generate all placeholder assets
 */
function generatePlaceholders() {
  const baseDir = path.join(__dirname, '..', 'public', 'avatar', 'assets');
  
  console.log('Generating placeholder avatar assets...\n');
  
  // Generate assets for each category
  for (const [category, files] of Object.entries(ASSET_STRUCTURE)) {
    const categoryDir = path.join(baseDir, category);
    ensureDirectory(categoryDir);
    
    for (const filename of files) {
      const filePath = path.join(categoryDir, filename);
      
      // Generate SVG placeholder
      const svgContent = generateSVGPlaceholder(filename, category);
      
      // Write SVG file (can be converted to PNG later)
      fs.writeFileSync(filePath.replace('.png', '.svg'), svgContent, 'utf8');
      
      // Also create a simple 1x1 transparent PNG as placeholder
      // (Base64 encoded minimal PNG)
      const minimalPNG = Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64'
      );
      fs.writeFileSync(filePath, minimalPNG);
      
      console.log(`  ✓ ${category}/${filename}`);
    }
  }
  
  console.log(`\n✅ Generated ${Object.values(ASSET_STRUCTURE).flat().length} placeholder assets`);
  console.log(`\n📝 Note: These are minimal placeholders. Replace with actual art bible assets:`);
  console.log(`   - Black & white, pencil/graphite aesthetic`);
  console.log(`   - 512×512 PNG with transparent background`);
  console.log(`   - Aligned to same face center`);
  console.log(`   - Cross-hatching shading only`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generatePlaceholders();
}

export { generatePlaceholders, generateSVGPlaceholder };
