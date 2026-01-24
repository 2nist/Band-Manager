/**
 * AvatarCanvas Component
 * 
 * React component for rendering procedural avatars using canvas.
 */

import React, { useEffect, useRef, useState } from 'react';
import { seededRNG } from '../avatar/rng.js';
import { defaultAvatarConfig } from '../avatar/avatarConfig.js';
import { selectAllFeatures, selectFeaturesWithArchetype } from '../avatar/selectFeatures.js';
import { drawAvatar, canvasToDataURL } from '../avatar/drawAvatar.js';

/**
 * AvatarCanvas - Procedural avatar generator component
 * @param {Object} props - Component props
 * @param {number|string} props.seed - Seed for deterministic generation
 * @param {string} [props.archetype] - Archetype for weighted selection
 * @param {number} [props.size] - Canvas size in pixels
 * @param {string} [props.className] - Additional CSS classes
 * @param {Function} [props.onGenerated] - Callback with generated avatar data URL
 */
export function AvatarCanvas({
  seed,
  archetype,
  size = 512,
  className = '',
  onGenerated
}) {
  const canvasRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setError('Failed to get canvas context');
      return;
    }

    // Check cache first (simple in-memory cache)
    // In production, use IndexedDB or similar
    const cacheKey = `avatar_${seed}_${archetype || 'default'}`;
    
    // TEMPORARY: Clear cache to force regeneration with placeholders
    // Remove this after testing
    const CACHE_VERSION = 'v3-integration';
    const cacheVersionKey = `avatar_cache_version`;
    const currentVersion = sessionStorage.getItem(cacheVersionKey);
    if (currentVersion !== CACHE_VERSION) {
      // Clear all avatar caches
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('avatar_')) {
          sessionStorage.removeItem(key);
        }
      });
      sessionStorage.setItem(cacheVersionKey, CACHE_VERSION);
    }
    
    const cached = sessionStorage.getItem(cacheKey);
    
    // Generate avatar function
    const generateAvatar = async () => {
      setIsGenerating(true);
      setError(null);
      
      try {
        // Create seeded RNG
        const rng = seededRNG(seed);

        // Select features
        const selections = archetype
          ? selectFeaturesWithArchetype(rng, defaultAvatarConfig, archetype)
          : selectAllFeatures(rng, defaultAvatarConfig);

        console.log('[AvatarCanvas] Feature selections:', Array.from(selections.keys()));

        // Draw avatar (will show placeholders if assets missing)
        await drawAvatar(ctx, defaultAvatarConfig, selections, rng);

        // Cache result
        const dataURL = canvasToDataURL(canvas);
        sessionStorage.setItem(cacheKey, dataURL);
        console.log('[AvatarCanvas] Avatar generated and cached');
        onGenerated?.(dataURL);
      } catch (err) {
        console.error('Avatar generation error:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate avatar');
        
        // Draw error placeholder
        ctx.fillStyle = '#F5F5F5';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#999999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Avatar', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillText('Error', canvas.width / 2, canvas.height / 2 + 10);
      } finally {
        setIsGenerating(false);
      }
    };
    
    if (cached) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        onGenerated?.(cached);
      };
      img.onerror = () => {
        // Cache invalid, regenerate
        generateAvatar();
      };
      img.src = cached;
      return;
    }

    // Generate new avatar
    generateAvatar();
  }, [seed, archetype, onGenerated]);

  return (
    <div className={`avatar-canvas-wrapper ${className}`} style={{ position: 'relative', width: size, height: size, overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        width={512}
        height={512}
        className="avatar-canvas"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          imageRendering: 'crisp-edges',
          backgroundColor: '#FFFFFF'
        }}
      />
      {isGenerating && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          Generating...
        </div>
      )}
      {error && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(255, 0, 0, 0.7)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default AvatarCanvas;
