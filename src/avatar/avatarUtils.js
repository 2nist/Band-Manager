/**
 * Avatar utilities – seed derivation, role→archetype mapping, and display helpers.
 * Use with the procedural (police-sketch) avatar system.
 */

/** Role → avatar archetype (must exist in avatarConfig.archetypes) */
const ROLE_TO_ARCHETYPE = {
  drummer: 'drummer',
  guitarist: 'guitarist',
  'lead-guitar': 'guitarist',
  'rhythm-guitar': 'guitarist',
  bassist: 'guitarist',
  vocalist: 'vocalist',
  keyboardist: 'synth-nerd',
  synth: 'synth-nerd',
  producer: 'producer',
  dj: 'synth-nerd',
  percussion: 'drummer',
  vocal: 'vocalist',
  guitar: 'guitarist',
  bass: 'guitarist',
  drums: 'drummer',
  keyboard: 'synth-nerd',
  production: 'producer',
  /* Event character archetypes */
  drug_dealer: 'guitarist',
  industry_executive: 'producer',
  sleazy_manager: 'producer',
  corrupt_cop: 'drummer'
};

/** Size presets for AvatarDisplay (pixels) */
export const AVATAR_SIZES = {
  xs: 40,
  sm: 64,
  md: 96,
  lg: 128,
  xl: 192
};

/**
 * Resolve numeric size from preset or number
 * @param {number|'xs'|'sm'|'md'|'lg'|'xl'} size
 * @returns {number}
 */
export function resolveAvatarSize(size) {
  if (typeof size === 'number' && size > 0) return size;
  return AVATAR_SIZES[size] ?? AVATAR_SIZES.md;
}

/**
 * Get archetype for avatar feature selection (from role, type, or explicit)
 * @param {Object} entity - { role?, type?, archetype?, avatarArchetype? }
 * @returns {string|undefined}
 */
export function getAvatarArchetype(entity) {
  if (entity?.avatarArchetype) return entity.avatarArchetype;
  const role = entity?.role ?? entity?.type ?? entity?.archetype ?? '';
  const r = typeof role === 'string' ? role.toLowerCase() : '';
  return ROLE_TO_ARCHETYPE[r] || undefined;
}

/**
 * Get deterministic seed for avatar generation
 * @param {Object} entity - { id?, name?, avatarSeed? }
 * @returns {string|number}
 */
export function getAvatarSeed(entity) {
  if (entity?.avatarSeed != null) return String(entity.avatarSeed);
  const name = entity?.name ?? entity?.firstName ?? '';
  const id = entity?.id ?? '';
  const combined = [name, id].filter(Boolean).join('-') || 'unknown';
  return combined;
}

/**
 * Simple string hash for numeric seed when AvatarCanvas expects number
 * @param {string} s
 * @returns {number}
 */
export function hashSeed(s) {
  const str = String(s);
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) - h + str.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}
