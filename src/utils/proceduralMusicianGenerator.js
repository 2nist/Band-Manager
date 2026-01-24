/**
 * Procedural Musician Generator
 * 
 * Generates hundreds of unique musicians with varied skills, backgrounds, and personalities
 * Organized by audition source (local scene, music school, craigslist, etc.)
 */

import { SeededRandom } from '../music/utils/SeededRandom.js';
import { generateMusicianName } from './nameGenerator.js';

// Helper functions for SeededRandom
function choice(rng, array) {
  return array[rng.nextInt(0, array.length)];
}

function range(rng, min, max) {
  return rng.nextInt(min, max + 1);
}

function sample(rng, array, count) {
  const shuffled = [...array].sort(() => rng.next() - 0.5);
  return shuffled.slice(0, count);
}

// Instrument roles
const INSTRUMENT_ROLES = [
  'drummer', 'guitarist', 'lead-guitar', 'rhythm-guitar', 'bassist',
  'vocalist', 'keyboardist', 'synth', 'dj', 'percussion'
];

// Audition source definitions
export const AUDITION_SOURCES = {
  local_scene: {
    name: 'Local Scene',
    description: 'Musicians from local venues and open mics',
    costRange: [50, 80],
    skillRange: [30, 70],
    reliabilityRange: [40, 80],
    creativityRange: [50, 90],
    count: 50,
    traits: ['varied_skill', 'passionate', 'networked']
  },
  music_school: {
    name: 'Music School',
    description: 'Students and recent graduates',
    costRange: [20, 30],
    skillRange: [60, 85],
    reliabilityRange: [70, 90],
    creativityRange: [40, 70],
    count: 30,
    traits: ['high_skill', 'less_experience', 'teachable']
  },
  craigslist_ads: {
    name: 'Craigslist',
    description: 'Wild card personalities from online ads',
    costRange: [30, 50],
    skillRange: [20, 80],
    reliabilityRange: [20, 70],
    creativityRange: [30, 95],
    count: 40,
    traits: ['unpredictable', 'varied', 'cheap']
  },
  referrals: {
    name: 'Referrals',
    description: 'Recommended by contacts',
    costRange: [60, 100],
    skillRange: [50, 85],
    reliabilityRange: [70, 95],
    creativityRange: [50, 85],
    count: 20,
    traits: ['reliable', 'vetted', 'expensive']
  },
  session_pros: {
    name: 'Session Pros',
    description: 'Professional studio musicians',
    costRange: [100, 200],
    skillRange: [80, 95],
    reliabilityRange: [85, 100],
    creativityRange: [60, 90],
    count: 15,
    traits: ['high_skill', 'expensive', 'professional']
  },
  former_band_members: {
    name: 'Former Band Members',
    description: 'Musicians from previous bands',
    costRange: [40, 70],
    skillRange: [40, 75],
    reliabilityRange: [30, 80],
    creativityRange: [50, 85],
    count: 10,
    traits: ['complex_history', 'baggage', 'experience']
  },
  up_and_coming: {
    name: 'Up & Coming',
    description: 'Rising talent with growth potential',
    costRange: [30, 60],
    skillRange: [50, 75],
    reliabilityRange: [50, 80],
    creativityRange: [70, 95],
    count: 20,
    traits: ['growth_potential', 'creative', 'ambitious']
  },
  washed_up: {
    name: 'Veterans',
    description: 'Experienced but with baggage',
    costRange: [25, 50],
    skillRange: [35, 70],
    reliabilityRange: [30, 65],
    creativityRange: [40, 75],
    count: 15,
    traits: ['experience', 'baggage', 'cheap']
  }
};

/**
 * Generate a pool of musicians for a specific audition source
 */
export function generateAuditionPool(sourceKey, location = 'Unknown', genre = 'Rock', budget = 1000, usedNames = new Set()) {
  const source = AUDITION_SOURCES[sourceKey];
  if (!source) {
    return [];
  }

  const rng = new SeededRandom(`${sourceKey}-${location}-${Date.now()}`);
  const musicians = [];
  // Use the same Set reference to ensure global uniqueness
  const sharedUsedNames = usedNames;

  for (let i = 0; i < source.count; i++) {
    const musician = generateMusician(source, location, genre, budget, rng, i, sourceKey, sharedUsedNames);
    musicians.push(musician);
  }

  return musicians;
}

/**
 * Generate a single musician based on source characteristics
 */
function generateMusician(source, location, genre, budget, rng, index, sourceKey, usedNames = new Set()) {
  // Generate personality first (needed for name generation)
  const personality = generatePersonality(source, rng);
  
  // Determine if stage name is preferred based on source and personality
  const preferStageName = source.traits.includes('unpredictable') || 
                          personality.primary === 'rebellious' ||
                          sourceKey === 'craigslist_ads';
  
  // Generate name using enhanced name generator
  const nameData = generateMusicianName({
    rng,
    genre,
    personality,
    source: sourceKey,
    location,
    preferStageName,
    usedNames
  });
  
  const firstName = nameData.firstName;
  const lastName = nameData.lastName;
  const role = choice(rng, INSTRUMENT_ROLES);
  
  // Generate stats based on source ranges
  const skill = range(rng, source.skillRange[0], source.skillRange[1]);
  const reliability = range(rng, source.reliabilityRange[0], source.reliabilityRange[1]);
  const creativity = range(rng, source.creativityRange[0], source.creativityRange[1]);
  const stagePresence = range(rng, 40, 90);
  const experience = range(rng, 1, 20);
  
  // Calculate cost based on skill and source
  const baseCost = range(rng, source.costRange[0], source.costRange[1]);
  const skillMultiplier = 1 + (skill / 100) * 0.5;
  const weeklyCost = Math.round(baseCost * skillMultiplier);
  
  // Generate background
  const background = generateBackground(source, role, experience, location, rng, sourceKey);
  
  // Generate special traits
  const specialTraits = generateSpecialTraits(source, skill, creativity, rng);
  
  // Generate appearance traits for avatar
  const appearance = generateAppearanceTraits(genre, role, personality, rng);
  
  const avatarSeed = `${sourceKey}-${index}-${nameData.fullName}-${Date.now()}`;
  const roleArchetype = { drummer: 'drummer', guitarist: 'guitarist', 'lead-guitar': 'guitarist', 'rhythm-guitar': 'guitarist', bassist: 'guitarist', vocalist: 'vocalist', keyboardist: 'synth-nerd', synth: 'synth-nerd', producer: 'producer' }[String(role)] ?? undefined;

  return {
    id: `${sourceKey}-${index}-${Date.now()}`,
    name: nameData.fullName,
    firstName,
    lastName,
    role,
    primaryInstrument: role,
    skill,
    creativity,
    reliability,
    stagePresence,
    morale: range(rng, 60, 90),
    drama: range(rng, 10, 50),
    experience,
    weeklyCost,
    availability: generateAvailability(rng),
    personality,
    background,
    specialTraits,
    avatarSeed,
    avatarArchetype: roleArchetype,
    appearance: {
      ...appearance,
      seed: avatarSeed,
      role
    },
    source: sourceKey,
    auditioned: false,
    chemistry: 0,
    redFlags: generateRedFlags(source, personality, rng),
    growthPotential: source.traits.includes('growth_potential') ? range(rng, 60, 90) : range(rng, 30, 70)
  };
}

/**
 * Generate personality traits
 */
function generatePersonality(source, rng) {
  const personalities = [
    'confident', 'shy', 'intense', 'chill', 'driven', 'laid_back',
    'perfectionist', 'experimental', 'traditional', 'rebellious'
  ];
  
  const primary = choice(rng, personalities);
  const secondary = choice(rng, personalities.filter(p => p !== primary));
  
  return {
    primary,
    secondary,
    traits: source.traits,
    workStyle: choice(rng, ['collaborative', 'independent', 'leadership', 'supportive'])
  };
}

/**
 * Generate musician background story
 */
function generateBackground(source, role, experience, location, rng, sourceKey) {
  const backgrounds = {
    local_scene: [
      `Regular performer at ${location} venues`,
      `Open mic night regular`,
      `Local band scene veteran`,
      `Garage band enthusiast`
    ],
    music_school: [
      `Music school student`,
      `Recent conservatory graduate`,
      `Classically trained, exploring ${role}`,
      `Music theory major`
    ],
    craigslist_ads: [
      `Responded to your online ad`,
      `Looking for new opportunities`,
      `Between bands`,
      `Freelance musician`
    ],
    referrals: [
      `Recommended by industry contact`,
      `Former bandmate of a friend`,
      `Studio engineer recommendation`,
      `Producer's suggestion`
    ],
    session_pros: [
      `Professional session musician`,
      `Studio recording veteran`,
      `Touring musician`,
      `Established professional`
    ],
    former_band_members: [
      `Former member of ${choice(rng, ['The', 'A'])} ${choice(rng, ['Crimson', 'Midnight', 'Wild', 'Electric'])} ${choice(rng, ['Wolves', 'Storm', 'Fire', 'Shadows'])}`,
      `Left previous band due to creative differences`,
      `Band broke up, looking for new project`,
      `Former touring musician`
    ],
    up_and_coming: [
      `Rising talent in ${location}`,
      `Gaining local recognition`,
      `Recent breakthrough performance`,
      `On the verge of something big`
    ],
    washed_up: [
      `Formerly in successful band`,
      `Touring veteran`,
      `Seen it all, done it all`,
      `Industry veteran`
    ]
  };
  
      return choice(rng, backgrounds[sourceKey] || backgrounds.local_scene);
}

/**
 * Generate special traits/abilities
 */
function generateSpecialTraits(source, skill, creativity, rng) {
  const traits = [];
  
  // Skill-based traits
  if (skill > 80) {
    traits.push({
      id: 'virtuoso',
      name: 'Virtuoso',
      description: 'Exceptional technical ability',
      icon: '⭐',
      type: 'skill'
    });
  }
  
  if (creativity > 85) {
    traits.push({
      id: 'innovator',
      name: 'Innovator',
      description: 'Highly creative and experimental',
      icon: '💡',
      type: 'creativity'
    });
  }
  
  // Source-specific traits
  if (source.traits.includes('growth_potential')) {
    traits.push({
      id: 'rising_star',
      name: 'Rising Star',
      description: 'High growth potential',
      icon: '📈',
      type: 'potential'
    });
  }
  
  if (source.traits.includes('experience')) {
    traits.push({
      id: 'veteran',
      name: 'Veteran',
      description: 'Years of experience',
      icon: '🎖️',
      type: 'experience'
    });
  }
  
  // Random positive traits
  const positiveTraits = [
    { id: 'quick_learner', name: 'Quick Learner', icon: '🧠' },
    { id: 'team_player', name: 'Team Player', icon: '🤝' },
    { id: 'stage_presence', name: 'Stage Presence', icon: '🎭' },
    { id: 'songwriter', name: 'Songwriter', icon: '✍️' },
    { id: 'multi_instrumentalist', name: 'Multi-Instrumentalist', icon: '🎹' }
  ];
  
  if (rng.next() < 0.3) {
    traits.push({
      ...choice(rng, positiveTraits),
      description: 'Special ability',
      type: 'ability'
    });
  }
  
  return traits;
}

/**
 * Generate red flags/potential issues
 */
function generateRedFlags(source, personality, rng) {
  const flags = [];
  
  if (source.traits.includes('baggage')) {
    if (rng.next() < 0.4) {
      flags.push({
        severity: 'medium',
        issue: 'Previous band conflicts',
        description: 'Has history of band drama'
      });
    }
  }
  
  if (source.traits.includes('unpredictable')) {
    if (rng.next() < 0.3) {
      flags.push({
        severity: 'low',
        issue: 'Unreliable schedule',
        description: 'May have scheduling conflicts'
      });
    }
  }
  
  if (personality.primary === 'rebellious' && rng.next() < 0.3) {
    flags.push({
      severity: 'low',
      issue: 'Strong opinions',
      description: 'May clash with creative direction'
    });
  }
  
  return flags;
}

/**
 * Generate availability status
 */
function generateAvailability(rng) {
  const options = [
    'Available immediately',
    'Available in 1 week',
    'Available in 2 weeks',
    'Part-time availability',
    'Weekends only'
  ];
  
  return choice(rng, options);
}

/**
 * Generate appearance traits for avatar system
 */
function generateAppearanceTraits(genre, role, personality, rng) {
  // Genre influences appearance
  const genreStyles = {
    'Metal': {
      hairStyles: ['long_straight', 'mohawk', 'shaved', 'wild'],
      hairColors: ['black', 'dark_brown', 'unnatural_black'],
      clothing: ['band_tee', 'leather', 'denim'],
      accessories: ['tattoos', 'piercings', 'chains']
    },
    'Jazz': {
      hairStyles: ['short_neat', 'slicked_back', 'curly', 'wavy'],
      hairColors: ['brown', 'black', 'gray'],
      clothing: ['suit', 'dress_shirt', 'vintage'],
      accessories: ['glasses', 'hat', 'watch']
    },
    'Punk': {
      hairStyles: ['mohawk', 'spiky', 'shaved', 'dyed_wild'],
      hairColors: ['bright_green', 'bright_blue', 'bright_pink', 'black'],
      clothing: ['ripped_jeans', 'band_tee', 'leather_jacket'],
      accessories: ['piercings', 'tattoos', 'patches']
    },
    'Rock': {
      hairStyles: ['long_wavy', 'medium_shaggy', 'curly', 'straight'],
      hairColors: ['brown', 'blonde', 'black', 'red'],
      clothing: ['band_tee', 'jeans', 'leather'],
      accessories: ['sunglasses', 'tattoos']
    }
  };
  
  const style = genreStyles[genre] || genreStyles['Rock'];
  
  return {
    faceShape: choice(rng, ['oval', 'round', 'square', 'heart', 'diamond']),
    skinTone: range(rng, 1, 15), // 15 skin tone variations
    age: range(rng, 18, 45),
    gender: choice(rng, ['male', 'female', 'non-binary']),
    hairStyle: choice(rng, style.hairStyles),
    hairColor: choice(rng, style.hairColors),
    clothingStyle: choice(rng, style.clothing),
    accessories: sample(rng, style.accessories, range(rng, 0, 2)),
    expression: (() => {
      if (personality.primary === 'confident') return 'confident';
      if (personality.primary === 'shy') return 'reserved';
      if (personality.primary === 'intense') return 'focused';
      return 'neutral';
    })(),
    mood: personality.primary
  };
}

/**
 * Generate complete audition pool for all sources
 */
export function generateCompleteAuditionPool(location, genre, budget) {
  const pool = {};
  const globalUsedNames = new Set(); // Track names across all sources to ensure uniqueness
  
  // Generate all pools with shared usedNames set to ensure global uniqueness
  Object.keys(AUDITION_SOURCES).forEach(sourceKey => {
    pool[sourceKey] = generateAuditionPool(sourceKey, location, genre, budget, globalUsedNames);
  });
  
  return pool;
}

/**
 * Conduct an audition and reveal detailed information
 */
export function conductAudition(candidate, position, currentBand = []) {
  // Perform skill test (reveals actual skill vs advertised)
  const skillVariance = Math.random() * 10 - 5; // ±5 skill variance
  const actualSkill = Math.max(10, Math.min(100, candidate.skill + skillVariance));
  
  // Check chemistry with current band
  const chemistry = calculateChemistry(candidate, currentBand);
  
  // Check schedule compatibility
  const scheduleCompatibility = candidate.availability?.includes('immediately') ? 1 : 0.7;
  
  // Calculate final cost (may negotiate)
  const finalCost = candidate.weeklyCost * (0.9 + Math.random() * 0.2);
  
  // Reveal special abilities
  const revealedTraits = (candidate.specialTraits || []).filter(() => Math.random() < 0.7);
  
  // Identify potential issues
  const revealedRedFlags = (candidate.redFlags || []).filter(() => Math.random() < 0.6);
  
  return {
    candidate,
    technical_skill: Math.round(actualSkill),
    chemistry: Math.round(chemistry),
    availability: scheduleCompatibility,
    cost: Math.round(finalCost),
    special_traits: revealedTraits,
    red_flags: revealedRedFlags,
    audition_notes: generateAuditionNotes(candidate, actualSkill, chemistry)
  };
}

/**
 * Calculate chemistry with current band
 */
function calculateChemistry(candidate, currentBand) {
  if (currentBand.length === 0) return 70; // Neutral if no band yet
  
  let totalChemistry = 0;
  let count = 0;
  
  currentBand.forEach(member => {
    // Similar personalities = better chemistry
    if (member.personality?.primary === candidate.personality?.primary) {
      totalChemistry += 80;
    } else if (member.personality?.secondary === candidate.personality?.primary) {
      totalChemistry += 70;
    } else {
      totalChemistry += 50;
    }
    count++;
  });
  
  return count > 0 ? totalChemistry / count : 70;
}

/**
 * Generate audition notes/feedback
 */
function generateAuditionNotes(candidate, actualSkill, chemistry) {
  const notes = [];
  
  if (actualSkill > 80) {
    notes.push('Exceptional technical ability');
  } else if (actualSkill > 60) {
    notes.push('Solid technical skills');
  } else if (actualSkill < 40) {
    notes.push('Needs improvement technically');
  }
  
  if (chemistry > 75) {
    notes.push('Great fit with current band members');
  } else if (chemistry < 50) {
    notes.push('Potential personality conflicts');
  }
  
  if (candidate.creativity > 85) {
    notes.push('Highly creative and experimental');
  }
  
  if (candidate.reliability < 50) {
    notes.push('Reliability concerns');
  }
  
  return notes;
}
