/**
 * Setup Asset Directories
 * 
 * Creates the directory structure for avatar assets.
 * Run this before creating assets.
 * 
 * Usage: node scripts/setupAssetDirectories.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.join(__dirname, '../public/avatar/assets');

const directories = [
  'paper',
  'heads',
  'eyes',
  'noses',
  'mouths',
  'facialHair',
  'hair',
  'accessories',
  'shading'
];

function setupDirectories() {
  console.log('📁 Setting up avatar asset directories...\n');

  // Create base directory
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
    console.log(`✅ Created: public/avatar/assets/`);
  }

  // Create subdirectories
  for (const dir of directories) {
    const dirPath = path.join(assetsDir, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`✅ Created: public/avatar/assets/${dir}/`);
    } else {
      console.log(`⏭️  Exists: public/avatar/assets/${dir}/`);
    }
  }

  // Create README in assets directory
  const readmePath = path.join(assetsDir, 'README.md');
  if (!fs.existsSync(readmePath)) {
    const readmeContent = `# Avatar Assets

Place your PNG assets in the appropriate subdirectories.

See ASSET_CREATION_GUIDE.md for detailed instructions.

## Directory Structure

- \`paper/\` - Background paper textures
- \`heads/\` - Head/face shapes
- \`eyes/\` - Eye styles
- \`noses/\` - Nose styles
- \`mouths/\` - Mouth expressions
- \`facialHair/\` - Beards, mustaches
- \`hair/\` - Hairstyles
- \`accessories/\` - Glasses, headphones, etc.
- \`shading/\` - Shading overlays

## Requirements

- All assets must be 512×512 pixels (or 1024×1024)
- PNG format with transparency
- Aligned to same center point
- Black & white only (police sketch style)
`;
    fs.writeFileSync(readmePath, readmeContent);
    console.log(`✅ Created: public/avatar/assets/README.md`);
  }

  console.log('\n✅ Directory structure ready!');
  console.log('📝 Next: Create assets following ASSET_CREATION_GUIDE.md\n');
}

setupDirectories();
