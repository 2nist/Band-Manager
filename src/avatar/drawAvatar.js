/**
 * Canvas Composition Engine
 * 
 * Handles drawing avatar layers to canvas with jitter and opacity variations.
 */

import { jitter, randomFloat } from './rng.js';

/**
 * Create a placeholder shape for missing assets
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {string} layerName - Name of the layer
 * @param {number} size - Canvas size
 */
function drawPlaceholder(ctx, layerName, size, rng) {
  const centerX = size / 2;
  const centerY = size / 2;

  ctx.save();
  ctx.strokeStyle = '#666666';
  ctx.fillStyle = 'transparent';
  ctx.lineWidth = Math.max(1, Math.floor(size / 170));
  ctx.globalAlpha = 0.9;

  switch (layerName) {
    case 'paper':
      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(0, 0, size, size);
      ctx.strokeStyle = '#e0e0e0';
      ctx.strokeRect(0, 0, size, size);
      break;
    case 'head':
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, size * 0.2, size * 0.25, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'eyes':
      ctx.beginPath();
      ctx.arc(centerX - size * 0.1, centerY - size * 0.05, size * 0.03, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(centerX + size * 0.1, centerY - size * 0.05, size * 0.03, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'nose':
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - size * 0.02);
      ctx.lineTo(centerX - size * 0.03, centerY + size * 0.05);
      ctx.lineTo(centerX + size * 0.03, centerY + size * 0.05);
      ctx.closePath();
      ctx.stroke();
      break;
    case 'mouth':
      ctx.beginPath();
      ctx.moveTo(centerX - size * 0.08, centerY + size * 0.1);
      ctx.lineTo(centerX + size * 0.08, centerY + size * 0.1);
      ctx.stroke();
      break;
    case 'hair':
      ctx.beginPath();
      ctx.arc(centerX, centerY - size * 0.15, size * 0.2, Math.PI, 0, false);
      ctx.stroke();
      break;
    case 'facialHair':
      ctx.beginPath();
      ctx.arc(centerX, centerY + size * 0.15, size * 0.08, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'accessories':
      ctx.beginPath();
      ctx.arc(centerX, centerY - size * 0.05, size * 0.06, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'shading':
      ctx.fillStyle = 'rgba(0,0,0,0.04)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + size * 0.05, size * 0.22, size * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    default:
      ctx.beginPath();
      ctx.arc(centerX, centerY, size * 0.05, 0, Math.PI * 2);
      ctx.stroke();
  }

  ctx.restore();
}

/**
 * Load image from path
 * @param {string} path - Image path
 * @returns {Promise<HTMLImageElement>} Promise resolving to HTMLImageElement
 */
export async function loadImage(path) {
  return new Promise((resolve, reject) => {
    if (!path) {
      // Empty path means no image (e.g., 'none' feature)
      const emptyImg = new Image();
      emptyImg.width = 0;
      emptyImg.height = 0;
      resolve(emptyImg);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Silently handle missing assets - placeholders will be drawn
      // Only log once per unique path to reduce console noise
      if (!window._avatarAssetWarnings) {
        window._avatarAssetWarnings = new Set();
      }
      if (!window._avatarAssetWarnings.has(path)) {
        window._avatarAssetWarnings.add(path);
        console.log(`[Avatar] Missing asset: ${path} (will use placeholder)`);
      }
      // Return empty image instead of rejecting
      const emptyImg = new Image();
      emptyImg.width = 0;
      emptyImg.height = 0;
      resolve(emptyImg);
    };
    img.src = path;
  });
}

/**
 * Draw a single layer with jitter
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {HTMLImageElement} img - Image to draw
 * @param {Object} layer - Layer configuration
 * @param {Function} rng - Random number generator for jitter
 */
export function drawLayer(ctx, img, layer, rng) {
  // Skip if image has no dimensions (empty/placeholder)
  if (img.width === 0 || img.height === 0) {
    return;
  }

  const canvasWidth = ctx.canvas.width;
  const canvasHeight = ctx.canvas.height;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;

  // Calculate jitter values
  const jitterX = jitter(rng, layer.jitter.x);
  const jitterY = jitter(rng, layer.jitter.y);
  const jitterRot = jitter(rng, layer.jitter.rotation);
  const opacity = randomFloat(
    rng,
    layer.jitter.opacity[0],
    layer.jitter.opacity[1]
  );

  // Calculate position (centered with jitter)
  const x = centerX - img.width / 2 + jitterX;
  const y = centerY - img.height / 2 + jitterY;

  // Save context state
  ctx.save();

  // Apply opacity
  ctx.globalAlpha = opacity;

  // Apply rotation around center
  ctx.translate(centerX, centerY);
  ctx.rotate(jitterRot);
  ctx.translate(-centerX, -centerY);

  // Draw image
  ctx.drawImage(img, x, y);

  // Restore context state
  ctx.restore();
}

/**
 * Draw complete avatar from feature selections
 * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
 * @param {Object} config - Avatar configuration
 * @param {Map} selections - Map of layer name to selected feature
 * @param {Function} rng - Random number generator for jitter
 */
export async function drawAvatar(ctx, config, selections, rng) {
  // Clear canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Set canvas size
  ctx.canvas.width = config.canvasSize;
  ctx.canvas.height = config.canvasSize;

  // Set background to white (for police sketch aesthetic)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Draw paper texture if available (or skip if missing)
  const paperFeature = selections.get('paper');
  if (paperFeature?.path) {
    const paperImg = await loadImage(paperFeature.path);
    if (paperImg.width > 0 && paperImg.height > 0) {
      ctx.drawImage(paperImg, 0, 0);
    }
  }

  // Draw layers in order
  for (const layer of config.layers) {
    const feature = selections.get(layer.name);
    if (!feature) {
      continue;
    }

    // Skip 'none' features
    if (feature.id === 'none' || !feature.path) {
      continue;
    }

    // Load and draw feature
    const img = await loadImage(feature.path);
    
    // If image failed to load (width/height is 0), draw placeholder
    if (img.width === 0 || img.height === 0) {
      drawPlaceholder(ctx, layer.name, config.canvasSize, rng);
    } else {
      drawLayer(ctx, img, layer, rng);
    }
  }
}

/**
 * Generate avatar as data URL for caching
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @returns {string} Data URL string
 */
export function canvasToDataURL(canvas) {
  return canvas.toDataURL('image/png');
}

/**
 * Generate avatar as blob for download
 * @param {HTMLCanvasElement} canvas - Canvas element
 * @returns {Promise<Blob>} Promise resolving to Blob
 */
export function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to convert canvas to blob'));
      }
    }, 'image/png');
  });
}
