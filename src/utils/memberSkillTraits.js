/**
 * Member Skill Traits System
 * 
 * Defines musical skill traits that affect MIDI playback:
 * - Timing: Affects note timing accuracy
 * - Dynamics: Affects velocity variation
 * - Precision: Affects note accuracy (dissonance)
 * - Groove: Affects feel and swing
 * - Technique: Overall technical ability
 */

/**
 * Skill trait definitions for each role
 */
export const ROLE_TRAITS = {
  drummer: {
    timing: { min: 0, max: 100, default: 70, description: 'Beat timing accuracy' },
    dynamics: { min: 0, max: 100, default: 60, description: 'Velocity variation' },
    precision: { min: 0, max: 100, default: 75, description: 'Hit accuracy' },
    groove: { min: 0, max: 100, default: 65, description: 'Feel and swing' },
    technique: { min: 0, max: 100, default: 70, description: 'Overall technical skill' }
  },
  guitarist: {
    timing: { min: 0, max: 100, default: 70, description: 'Note timing accuracy' },
    dynamics: { min: 0, max: 100, default: 65, description: 'Pick attack variation' },
    precision: { min: 0, max: 100, default: 75, description: 'Fret accuracy (dissonance)' },
    groove: { min: 0, max: 100, default: 60, description: 'Rhythmic feel' },
    technique: { min: 0, max: 100, default: 70, description: 'Overall technical skill' }
  },
  'lead-guitar': {
    timing: { min: 0, max: 100, default: 75, description: 'Solo timing accuracy' },
    dynamics: { min: 0, max: 100, default: 70, description: 'Expression variation' },
    precision: { min: 0, max: 100, default: 80, description: 'Note accuracy (dissonance)' },
    groove: { min: 0, max: 100, default: 65, description: 'Melodic feel' },
    technique: { min: 0, max: 100, default: 75, description: 'Overall technical skill' }
  },
  'rhythm-guitar': {
    timing: { min: 0, max: 100, default: 70, description: 'Chord timing accuracy' },
    dynamics: { min: 0, max: 100, default: 60, description: 'Strum variation' },
    precision: { min: 0, max: 100, default: 70, description: 'Chord accuracy' },
    groove: { min: 0, max: 100, default: 70, description: 'Rhythmic feel' },
    technique: { min: 0, max: 100, default: 65, description: 'Overall technical skill' }
  },
  bassist: {
    timing: { min: 0, max: 100, default: 75, description: 'Note timing accuracy' },
    dynamics: { min: 0, max: 100, default: 60, description: 'Pluck variation' },
    precision: { min: 0, max: 100, default: 70, description: 'Fret accuracy' },
    groove: { min: 0, max: 100, default: 80, description: 'Groove and feel' },
    technique: { min: 0, max: 100, default: 70, description: 'Overall technical skill' }
  },
  vocalist: {
    timing: { min: 0, max: 100, default: 70, description: 'Vocal timing accuracy' },
    dynamics: { min: 0, max: 100, default: 75, description: 'Volume variation' },
    precision: { min: 0, max: 100, default: 70, description: 'Pitch accuracy' },
    groove: { min: 0, max: 100, default: 65, description: 'Phrasing feel' },
    technique: { min: 0, max: 100, default: 70, description: 'Overall vocal skill' }
  },
  keyboardist: {
    timing: { min: 0, max: 100, default: 70, description: 'Key timing accuracy' },
    dynamics: { min: 0, max: 100, default: 65, description: 'Touch variation' },
    precision: { min: 0, max: 100, default: 75, description: 'Note accuracy' },
    groove: { min: 0, max: 100, default: 60, description: 'Rhythmic feel' },
    technique: { min: 0, max: 100, default: 70, description: 'Overall technical skill' }
  }
};

/**
 * Generate skill traits for a member based on their overall skill level
 * @param {string} role - Member role
 * @param {number} overallSkill - Overall skill (0-100)
 * @param {Object} options - Generation options
 * @returns {Object} Skill traits
 */
export function generateSkillTraits(role, overallSkill = 50, options = {}) {
  const roleTraits = ROLE_TRAITS[role] || ROLE_TRAITS.guitarist;
  const { variance = 15, seed = null } = options;
  
  // Use seeded random if provided
  const rng = seed ? createSeededRNG(seed) : Math.random;
  
  const traits = {};
  
  Object.keys(roleTraits).forEach(traitName => {
    const traitDef = roleTraits[traitName];
    const baseValue = traitDef.default;
    
    // Scale based on overall skill
    const skillFactor = overallSkill / 100;
    const targetValue = baseValue * skillFactor;
    
    // Add variance
    const varianceAmount = (rng() - 0.5) * variance * 2;
    const finalValue = Math.max(
      traitDef.min,
      Math.min(traitDef.max, targetValue + varianceAmount)
    );
    
    traits[traitName] = Math.round(finalValue);
  });
  
  return traits;
}

/**
 * Create seeded RNG for deterministic generation
 */
function createSeededRNG(seed) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

/**
 * Generate audition candidate with skill traits
 * @param {string} role - Role to audition for
 * @param {Object} options - Generation options
 * @returns {Object} Candidate with traits
 */
export function generateAuditionCandidate(role, options = {}) {
  const {
    skillRange = [30, 90],
    name = null,
    seed = Date.now()
  } = options;
  
  const rng = createSeededRNG(seed);
  const overallSkill = skillRange[0] + (skillRange[1] - skillRange[0]) * rng();
  
  const traits = generateSkillTraits(role, overallSkill, { variance: 20, seed });
  
  // Generate personality quirks based on low traits
  const quirks = [];
  if (traits.timing < 40) quirks.push('Poor timing');
  if (traits.dynamics < 30) quirks.push('No dynamics');
  if (traits.precision < 40) quirks.push('Sloppy playing');
  if (traits.groove < 40) quirks.push('No groove');
  if (traits.technique < 40) quirks.push('Limited technique');
  
  // Positive traits
  const strengths = [];
  if (traits.timing > 80) strengths.push('Great timing');
  if (traits.dynamics > 75) strengths.push('Expressive');
  if (traits.precision > 80) strengths.push('Precise');
  if (traits.groove > 80) strengths.push('Groovy');
  if (traits.technique > 80) strengths.push('Technical');
  
  const candidateName = name || generateRandomName(role, seed);
  const roleArchetype = { drummer: 'drummer', guitarist: 'guitarist', 'lead-guitar': 'guitarist', 'rhythm-guitar': 'guitarist', bassist: 'guitarist', vocalist: 'vocalist', keyboardist: 'synth-nerd', synth: 'synth-nerd', producer: 'producer' }[String(role)] ?? undefined;

  return {
    id: `candidate_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name: candidateName,
    role,
    overallSkill: Math.round(overallSkill),
    traits,
    quirks,
    strengths,
    auditioned: false,
    hired: false,
    avatarSeed: candidateName,
    avatarArchetype: roleArchetype
  };
}

/**
 * Generate random name for candidate
 */
function generateRandomName(role, seed) {
  const firstNames = ['Alex', 'Jamie', 'Riley', 'Casey', 'Morgan', 'Sam', 'Dev', 'Nikki', 'Blake', 'Taylor', 'Jordan', 'Quinn', 'Avery', 'Sage'];
  const lastNames = ['Storm', 'Cross', 'Bass', 'Beat', 'Keys', 'Thunder', 'Synth', 'Pulse', 'Rock', 'Harmony', 'Rhythm', 'Groove', 'Tone', 'Chord'];
  
  const rng = createSeededRNG(seed);
  const firstName = firstNames[Math.floor(rng() * firstNames.length)];
  const lastName = lastNames[Math.floor(rng() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}

/**
 * Get skill description for display
 */
export function getSkillDescription(traitName, value) {
  if (value >= 80) return 'Excellent';
  if (value >= 65) return 'Good';
  if (value >= 50) return 'Average';
  if (value >= 35) return 'Poor';
  return 'Very Poor';
}
