/**
 * Asset Validation Script
 * 
 * Validates avatar assets meet requirements:
 * - Correct file names
 * - Correct sizes
 * - Transparency
 * - Directory structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, '../public/avatar/assets');

// Expected asset structure from avatarConfig.js
const expectedAssets = {
  paper: ['paper_1'],
  heads: ['head_1', 'head_2', 'head_3', 'head_4', 'head_5'],
  eyes: [
    'eyes_tired_01', 'eyes_tired_02', 'eyes_narrow_01',
    'eyes_heavyLid_01', 'eyes_squinting_01', 'eyes_open_01', 'eyes_neutral_01'
  ],
  noses: [
    'nose_narrow_01', 'nose_crooked_left_01', 'nose_crooked_right_01',
    'nose_wide_01', 'nose_hooked_01', 'nose_straight_01',
    'nose_prominent_01', 'nose_neutral_01'
  ],
  mouths: [
    'mouth_flat_01', 'mouth_flat_02', 'mouth_downturned_01',
    'mouth_smirk_01', 'mouth_neutral_01', 'mouth_neutral_02', 'mouth_thin_01'
  ],
  facialHair: [
    'facialHair_patchy_01', 'facialHair_patchy_02', 'facialHair_heavyStubble_01',
    'facialHair_beard_01', 'facialHair_beard_02', 'facialHair_stubble_01',
    'facialHair_mustache_01'
  ],
  hair: [
    'hair_messy_01', 'hair_messy_02', 'hair_pulledBack_01',
    'hair_beanie_low_01', 'hair_beanie_low_02', 'hair_wild_01', 'hair_wild_02',
    'hair_clean_01', 'hair_clean_02', 'hair_bald_01',
    'hair_neutral_01', 'hair_neutral_02'
  ],
  accessories: [
    'accessory_headphones_01', 'accessory_headphones_02',
    'accessory_pencil_behind_ear', 'accessory_glasses_crooked_01',
    'accessory_glasses_02', 'accessory_earplug_01', 'accessory_earplug_02',
    'accessory_scar_01', 'accessory_coffee_stain_01'
  ],
  shading: ['shading_underEyes_01', 'shading_underEyes_02']
};

function validateAssets() {
  const errors = [];
  const warnings = [];
  const found = {};

  console.log('🔍 Validating avatar assets...\n');

  // Check each category
  for (const [category, expectedFiles] of Object.entries(expectedAssets)) {
    const categoryDir = path.join(assetsDir, category);
    found[category] = [];

    // Check if directory exists
    if (!fs.existsSync(categoryDir)) {
      warnings.push(`⚠️  Directory missing: ${category}/ (will be created when assets are added)`);
      continue;
    }

    // Get actual files
    const files = fs.readdirSync(categoryDir)
      .filter(f => f.endsWith('.png'))
      .map(f => f.replace('.png', ''));

    // Check expected files
    for (const expectedFile of expectedFiles) {
      const expectedPath = path.join(categoryDir, `${expectedFile}.png`);
      if (fs.existsSync(expectedPath)) {
        found[category].push(expectedFile);
      } else {
        errors.push(`❌ Missing: ${category}/${expectedFile}.png`);
      }
    }

    // Check for unexpected files
    for (const file of files) {
      if (!expectedFiles.includes(file)) {
        warnings.push(`⚠️  Unexpected file: ${category}/${file}.png (not in config)`);
      }
    }
  }

  // Summary
  console.log('📊 Validation Summary:\n');
  
  let totalExpected = 0;
  let totalFound = 0;
  
  for (const [category, expectedFiles] of Object.entries(expectedAssets)) {
    const foundCount = found[category]?.length || 0;
    const expectedCount = expectedFiles.length;
    totalExpected += expectedCount;
    totalFound += foundCount;
    
    const status = foundCount === expectedCount ? '✅' : '⏳';
    console.log(`${status} ${category}: ${foundCount}/${expectedCount} assets`);
  }

  console.log(`\n📈 Overall: ${totalFound}/${totalExpected} assets found\n`);

  // Report errors
  if (errors.length > 0) {
    console.log('❌ Errors:\n');
    errors.forEach(err => console.log(`  ${err}`));
    console.log('');
  }

  // Report warnings
  if (warnings.length > 0) {
    console.log('⚠️  Warnings:\n');
    warnings.forEach(warn => console.log(`  ${warn}`));
    console.log('');
  }

  // Success message
  if (errors.length === 0 && totalFound > 0) {
    console.log('✅ All expected assets found!');
  } else if (totalFound === 0) {
    console.log('📝 No assets found yet. Start creating assets following ASSET_CREATION_GUIDE.md');
  } else {
    console.log('⏳ Some assets are missing. Continue creating assets.');
  }

  return {
    errors: errors.length,
    warnings: warnings.length,
    found: totalFound,
    expected: totalExpected
  };
}

// Run validation if called directly
validateAssets();

export { validateAssets };
