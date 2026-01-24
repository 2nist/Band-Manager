/**
 * AvatarDisplay – Unified procedural (police-sketch) avatar display
 *
 * Use for any avatar instance: band members, audition candidates, event characters.
 * Supports size presets, placeholders for missing assets, and appropriate scaling.
 */

import React from 'react';
import { AvatarCanvas } from './AvatarCanvas';
import { getAvatarSeed, getAvatarArchetype, resolveAvatarSize } from '../avatar/avatarUtils';

/**
 * @param {Object} props
 * @param {Object} [props.entity] - Member, character, or candidate { id, name, role?, type?, avatarSeed?, avatarArchetype? }
 * @param {string|number} [props.seed] - Override seed (ignored if entity provided)
 * @param {string} [props.archetype] - Override archetype (ignored if entity provided)
 * @param {number|'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md'] - Display size
 * @param {string} [props.className]
 * @param {string} [props.alt] - Accessible label
 */
export function AvatarDisplay({ entity, seed, archetype, size = 'md', className = '', alt }) {
  const resolvedSeed = entity == null ? (seed ?? 'unknown') : getAvatarSeed(entity);
  const resolvedArchetype = entity == null ? archetype : getAvatarArchetype(entity);
  const resolvedSize = resolveAvatarSize(size);

  return (
    <div
      className={`avatar-display ${className}`.trim()}
      style={{
        width: resolvedSize,
        height: resolvedSize,
        minWidth: resolvedSize,
        minHeight: resolvedSize,
        flexShrink: 0,
        overflow: 'hidden',
        borderRadius: '4px',
        backgroundColor: '#fff'
      }}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
    >
      <AvatarCanvas
        seed={resolvedSeed}
        archetype={resolvedArchetype}
        size={resolvedSize}
        className="avatar-display-canvas"
      />
    </div>
  );
}

export default AvatarDisplay;
