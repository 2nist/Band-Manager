/**
 * Name Generator - Robust name generation system for musicians
 * 
 * Generates thousands of unique, culturally diverse, and music-appropriate names
 * with support for stage names, nicknames, and genre-specific naming.
 */

// Helper functions for SeededRandom
function choice(rng, array) {
  return array[rng.nextInt(0, array.length)];
}

function range(rng, min, max) {
  return rng.nextInt(min, max + 1);
}

// Comprehensive First Names Database (200+ names)
const FIRST_NAMES = {
  // Common English names
  english: [
    'Alex', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Quinn', 'Avery',
    'Jamie', 'Blake', 'Cameron', 'Dakota', 'Skylar', 'River', 'Phoenix',
    'Sam', 'Chris', 'Drew', 'Kai', 'Noah', 'Maya', 'Zoe', 'Luna', 'Aria',
    'Max', 'Leo', 'Finn', 'Eli', 'Ava', 'Emma', 'Olivia', 'Sophia',
    'Marcus', 'Jake', 'Dylan', 'Ryan', 'Tyler', 'Brandon', 'Connor',
    'Nina', 'Lila', 'Ivy', 'Ruby', 'Mia', 'Chloe', 'Lily', 'Grace',
    'Harper', 'Evelyn', 'Charlotte', 'Amelia', 'Isabella', 'Scarlett',
    'Lucas', 'Mason', 'Logan', 'Ethan', 'Oliver', 'Jackson', 'Aiden',
    'Sebastian', 'Carter', 'Wyatt', 'Owen', 'Luke', 'Henry', 'Jack',
    'Julian', 'Levi', 'Isaac', 'Gabriel', 'Nathan', 'Daniel', 'Matthew',
    'Benjamin', 'James', 'William', 'Alexander', 'Michael', 'David'
  ],
  
  // Spanish/Latin names
  spanish: [
    'Carlos', 'Diego', 'Santiago', 'Mateo', 'Sebastian', 'Andres', 'Javier',
    'Alejandro', 'Miguel', 'Ricardo', 'Fernando', 'Rafael', 'Eduardo',
    'Gabriel', 'Manuel', 'Luis', 'Jose', 'Antonio', 'Francisco', 'Pedro',
    'Sofia', 'Isabella', 'Valentina', 'Camila', 'Lucia', 'Emma', 'Maria',
    'Elena', 'Carmen', 'Ana', 'Laura', 'Paula', 'Daniela', 'Andrea',
    'Natalia', 'Gabriela', 'Mariana', 'Alejandra', 'Catalina', 'Juliana'
  ],
  
  // Italian names
  italian: [
    'Marco', 'Luca', 'Alessandro', 'Matteo', 'Leonardo', 'Francesco', 'Andrea',
    'Giovanni', 'Antonio', 'Stefano', 'Gabriele', 'Davide', 'Riccardo',
    'Federico', 'Lorenzo', 'Simone', 'Edoardo', 'Giacomo', 'Niccolo', 'Tommaso',
    'Sofia', 'Giulia', 'Aurora', 'Alice', 'Ginevra', 'Emma', 'Giorgia',
    'Beatrice', 'Vittoria', 'Chiara', 'Francesca', 'Martina', 'Elena', 'Anna',
    'Sara', 'Elisa', 'Valentina', 'Rebecca', 'Alessia', 'Camilla'
  ],
  
  // French names
  french: [
    'Lucas', 'Louis', 'Hugo', 'Gabriel', 'Raphael', 'Leo', 'Nathan', 'Noah',
    'Ethan', 'Arthur', 'Jules', 'Mael', 'Paul', 'Gabin', 'Nolan', 'Eden',
    'Liam', 'Axel', 'Timeo', 'Marius', 'Eliott', 'Theo', 'Antoine', 'Maxime',
    'Emma', 'Jade', 'Louise', 'Ambre', 'Alice', 'Chloe', 'Lina', 'Mila',
    'Rose', 'Anna', 'Lena', 'Julia', 'Ines', 'Lea', 'Manon', 'Zoe'
  ],
  
  // German names
  german: [
    'Maximilian', 'Alexander', 'Paul', 'Leon', 'Luka', 'Luis', 'Felix', 'Noah',
    'Emil', 'Anton', 'Theo', 'Ben', 'Finn', 'Elias', 'Henry', 'Oskar',
    'Matteo', 'Liam', 'Milan', 'Jakob', 'Samuel', 'David', 'Julian', 'Mats',
    'Emma', 'Hannah', 'Mia', 'Sophia', 'Emilia', 'Lina', 'Ella', 'Mila',
    'Clara', 'Lea', 'Mathilda', 'Ida', 'Luisa', 'Anna', 'Frieda', 'Marie'
  ],
  
  // Japanese names
  japanese: [
    'Hiroshi', 'Kenji', 'Takeshi', 'Yuki', 'Satoshi', 'Ryo', 'Daiki', 'Kaito',
    'Ren', 'Haruto', 'Sota', 'Yuto', 'Hayato', 'Sora', 'Aoi', 'Minato',
    'Akio', 'Taro', 'Jiro', 'Ichiro', 'Shinji', 'Makoto', 'Kazuki', 'Ryota',
    'Sakura', 'Yuki', 'Hana', 'Aoi', 'Mei', 'Yui', 'Rin', 'Akari',
    'Emi', 'Mio', 'Kana', 'Maya', 'Nana', 'Rika', 'Saki', 'Mika'
  ],
  
  // Music-themed names
  music: [
    'Melody', 'Harmony', 'Jazz', 'Rhythm', 'Lyric', 'Cadence', 'Chord',
    'Aria', 'Sonata', 'Octave', 'Tempo', 'Vibrato', 'Staccato', 'Forte',
    'Piano', 'Allegro', 'Adagio', 'Crescendo', 'Diminuendo', 'Fermata'
  ],
  
  // Unique/Creative names
  unique: [
    'Raven', 'Storm', 'Phoenix', 'River', 'Sky', 'Ocean', 'Blaze', 'Ember',
    'Jade', 'Onyx', 'Crystal', 'Diamond', 'Amber', 'Sage', 'Indigo', 'Violet',
    'Zephyr', 'Orion', 'Atlas', 'Nova', 'Luna', 'Stella', 'Aurora', 'Celeste',
    'Jax', 'Zane', 'Kai', 'Rex', 'Vex', 'Zed', 'Nyx', 'Rex', 'Ace', 'Blade'
  ]
};

// Comprehensive Last Names Database (300+ names)
const LAST_NAMES = {
  // Common English surnames
  english: [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Wilson',
    'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee',
    'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis',
    'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott',
    'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson',
    'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
    'Storm', 'Cross', 'Rivers', 'Stone', 'Wilde', 'Fox', 'Hart', 'Knight',
    'Reed', 'Black', 'Gray', 'Blue', 'Green', 'Brown', 'White', 'Silver',
    'Gold', 'Steel', 'Iron', 'Wood', 'Field', 'Lake', 'Mountain', 'Valley',
    'Brooks', 'Marsh', 'Forrest', 'Park', 'Bridge', 'Lane', 'Street', 'Road'
  ],
  
  // Spanish/Latin surnames
  spanish: [
    'Garcia', 'Rodriguez', 'Martinez', 'Lopez', 'Gonzalez', 'Perez', 'Sanchez',
    'Ramirez', 'Torres', 'Flores', 'Rivera', 'Gomez', 'Diaz', 'Cruz',
    'Morales', 'Ortiz', 'Gutierrez', 'Chavez', 'Ramos', 'Reyes', 'Mendoza',
    'Moreno', 'Alvarez', 'Romero', 'Jimenez', 'Ruiz', 'Vargas', 'Castillo',
    'Fernandez', 'Herrera', 'Medina', 'Aguilar', 'Vega', 'Castro', 'Mendez',
    'Guerrero', 'Rojas', 'Contreras', 'Delgado', 'Ortega', 'Sandoval'
  ],
  
  // Italian surnames
  italian: [
    'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo',
    'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca',
    'Costa', 'Fontana', 'Caruso', 'Mancini', 'Rizzo', 'Lombardi', 'Moretti',
    'Barbieri', 'Lombardo', 'Giordano', 'Cassano', 'Longo', 'Conte', 'Serra',
    'Martini', 'Gatti', 'Ferretti', 'Leone', 'Mancuso', 'Rinaldi', 'Vitale',
    'Coppola', 'De Angelis', 'Marchetti', 'Parisi', 'Ferrara'
  ],
  
  // French surnames
  french: [
    'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit',
    'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel',
    'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel',
    'Girard', 'Bonnet', 'Dupont', 'Lambert', 'Fontaine', 'Rousseau', 'Vincent',
    'Muller', 'Lefevre', 'Faure', 'Andre', 'Mercier', 'Blanc', 'Guerin',
    'Boyer', 'Garnier', 'Chevalier', 'Francois', 'Legrand'
  ],
  
  // German surnames
  german: [
    'Muller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner',
    'Becker', 'Schulz', 'Hoffmann', 'Schafer', 'Koch', 'Bauer', 'Richter',
    'Klein', 'Wolf', 'Schroder', 'Neumann', 'Schwarz', 'Zimmermann', 'Braun',
    'Hofmann', 'Kruger', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz',
    'Krause', 'Meier', 'Lehmann', 'Schmid', 'Schulze', 'Maier', 'Kohler',
    'Herrmann', 'Konig', 'Walter', 'Huber', 'Kaiser'
  ],
  
  // Japanese surnames
  japanese: [
    'Tanaka', 'Sato', 'Suzuki', 'Takahashi', 'Watanabe', 'Ito', 'Yamamoto',
    'Nakamura', 'Kobayashi', 'Kato', 'Yoshida', 'Yamada', 'Sasaki', 'Yamaguchi',
    'Saito', 'Matsumoto', 'Inoue', 'Kimura', 'Hayashi', 'Shimizu', 'Yamazaki',
    'Mori', 'Abe', 'Ikeda', 'Hashimoto', 'Yamashita', 'Ishikawa', 'Nakajima',
    'Maeda', 'Fujita', 'Ogawa', 'Goto', 'Okada', 'Hasegawa', 'Murakami',
    'Kondo', 'Ishii', 'Saito', 'Sakamoto', 'Endo'
  ],
  
  // Music-related surnames
  music: [
    'Rhythm', 'Chord', 'Harmony', 'Melody', 'Lyric', 'Cadence', 'Tempo',
    'Octave', 'Staccato', 'Forte', 'Piano', 'Crescendo', 'Vibrato', 'Allegro',
    'Adagio', 'Sonata', 'Aria', 'Symphony', 'Concerto', 'Overture'
  ],
  
  // Stage-name friendly surnames
  stage: [
    'Stone', 'Steel', 'Iron', 'Blade', 'Cross', 'Storm', 'Raven', 'Fox',
    'Wolf', 'Hawk', 'Eagle', 'Falcon', 'Phoenix', 'Dragon', 'Tiger', 'Lion',
    'Shadow', 'Night', 'Dark', 'Light', 'Star', 'Moon', 'Sun', 'Sky',
    'Fire', 'Ice', 'Thunder', 'Lightning', 'Wind', 'Storm', 'Rain', 'Snow'
  ]
};

// Stage Names Database (100+ names)
const STAGE_NAMES = {
  // Single-word stage names
  single: [
    'Raven', 'Storm', 'Vex', 'Jax', 'Zed', 'Nyx', 'Rex', 'Ace', 'Blade',
    'Phoenix', 'Raven', 'Shadow', 'Vortex', 'Nova', 'Orion', 'Atlas', 'Zephyr',
    'Blaze', 'Ember', 'Frost', 'Thunder', 'Lightning', 'Tempest', 'Vortex',
    'Rage', 'Fury', 'Chaos', 'Void', 'Echo', 'Reverb', 'Distortion', 'Feedback',
    'Static', 'Noise', 'Pulse', 'Rhythm', 'Beat', 'Groove', 'Flow', 'Drift',
    'Luna', 'Stella', 'Aurora', 'Celeste', 'Nova', 'Lyra', 'Vega', 'Sirius'
  ],
  
  // Compound stage names
  compound: [
    'Jax Stone', 'Luna Moon', 'Raven Cross', 'Storm Rider', 'Blaze Walker',
    'Shadow Fox', 'Night Wolf', 'Dark Star', 'Light Echo', 'Fire Storm',
    'Ice Blade', 'Thunder Strike', 'Lightning Bolt', 'Wind Chaser', 'Rain Maker',
    'Snow Drift', 'Vortex Prime', 'Nova Star', 'Orion Black', 'Atlas Strong',
    'Zephyr Wind', 'Ember Fire', 'Frost Bite', 'Rage Storm', 'Fury Road',
    'Chaos Theory', 'Void Walker', 'Echo Chamber', 'Reverb Echo', 'Static Shock',
    'Noise Maker', 'Pulse Beat', 'Rhythm Master', 'Groove King', 'Flow State',
    'Drift Away', 'Luna Light', 'Stella Star', 'Aurora Borealis', 'Celeste Sky'
  ],
  
  // Genre-specific stage names
  punk: [
    'Rage', 'Vex', 'Spike', 'Razor', 'Blade', 'Thrash', 'Punk', 'Rebel',
    'Anarchy', 'Chaos', 'Riot', 'Crash', 'Slam', 'Mosh', 'Pit', 'Graffiti'
  ],
  
  metal: [
    'Raven', 'Shadow', 'Vortex', 'Void', 'Dark', 'Night', 'Storm', 'Thunder',
    'Lightning', 'Fire', 'Ice', 'Steel', 'Iron', 'Blade', 'Fury', 'Rage'
  ],
  
  jazz: [
    'Miles', 'Duke', 'Bird', 'Trane', 'Satchmo', 'Dizzy', 'Ella', 'Billie',
    'Nina', 'Sarah', 'Etta', 'Dinah', 'Chet', 'Wes', 'Pat', 'Herbie'
  ],
  
  rock: [
    'Ace', 'Slash', 'Axel', 'Jett', 'Rex', 'Zed', 'Jax', 'Blaze', 'Storm',
    'Raven', 'Fox', 'Wolf', 'Hawk', 'Eagle', 'Phoenix', 'Dragon'
  ]
};

// Nicknames Database
const NICKNAMES = [
  'Ace', 'Blade', 'Blaze', 'Crash', 'Dash', 'Flash', 'Jax', 'Rex', 'Zed',
  'Vex', 'Nyx', 'Rage', 'Fury', 'Storm', 'Raven', 'Fox', 'Wolf', 'Hawk',
  'Eagle', 'Phoenix', 'Shadow', 'Night', 'Dark', 'Light', 'Star', 'Moon',
  'Sun', 'Sky', 'Fire', 'Ice', 'Thunder', 'Lightning', 'Wind', 'Rain',
  'Snow', 'Stone', 'Steel', 'Iron', 'Cross', 'Knight', 'King', 'Queen',
  'Prince', 'Princess', 'Duke', 'Earl', 'Baron', 'Lord', 'Lady', 'Sir'
];

/**
 * Get cultural name set based on location
 */
function getCulturalNameSet(location) {
  const locationLower = (location || '').toLowerCase();
  
  // US cities with diverse populations
  if (locationLower.includes('los angeles') || locationLower.includes('la') ||
      locationLower.includes('new york') || locationLower.includes('nyc') ||
      locationLower.includes('miami') || locationLower.includes('houston')) {
    return ['english', 'spanish', 'italian', 'french', 'german'];
  }
  
  // Spanish-speaking regions
  if (locationLower.includes('mexico') || locationLower.includes('spain') ||
      locationLower.includes('argentina') || locationLower.includes('chile')) {
    return ['spanish', 'english'];
  }
  
  // European cities
  if (locationLower.includes('london') || locationLower.includes('paris') ||
      locationLower.includes('berlin') || locationLower.includes('rome')) {
    return ['english', 'french', 'german', 'italian'];
  }
  
  // Japanese cities
  if (locationLower.includes('tokyo') || locationLower.includes('osaka') ||
      locationLower.includes('kyoto')) {
    return ['japanese', 'english'];
  }
  
  // Default: mix of all
  return ['english', 'spanish', 'italian', 'french', 'german', 'japanese'];
}

/**
 * Generate name based on strategy
 */
function generateNameByStrategy(nameStrategy, genreStyle, culturalSets, rng) {
  if (nameStrategy === 'stage') {
    return generateStageName(genreStyle, rng);
  } else if (nameStrategy === 'nickname') {
    return generateNicknameName(culturalSets, rng);
  } else {
    return generateStandardName(culturalSets, rng);
  }
}

/**
 * Generate stage name
 */
function generateStageName(genreStyle, rng) {
  if (genreStyle === 'punk' && STAGE_NAMES.punk.length > 0) {
    const fullName = choice(rng, STAGE_NAMES.punk);
    return { fullName, firstName: fullName, lastName: '' };
  } else if (genreStyle === 'metal' && STAGE_NAMES.metal.length > 0) {
    const fullName = choice(rng, STAGE_NAMES.metal);
    return { fullName, firstName: fullName, lastName: '' };
  } else if (genreStyle === 'jazz' && STAGE_NAMES.jazz.length > 0) {
    const fullName = choice(rng, STAGE_NAMES.jazz);
    return { fullName, firstName: fullName, lastName: '' };
  } else if (rng.next() < 0.5 && STAGE_NAMES.compound.length > 0) {
    const fullName = choice(rng, STAGE_NAMES.compound);
    const parts = fullName.split(' ');
    return { fullName, firstName: parts[0], lastName: parts[1] || '' };
  } else {
    const fullName = choice(rng, STAGE_NAMES.single);
    return { fullName, firstName: fullName, lastName: '' };
  }
}

/**
 * Generate nickname variant name
 */
function generateNicknameName(culturalSets, rng) {
  const culturalSet = choice(rng, culturalSets);
  const firstNames = FIRST_NAMES[culturalSet] || FIRST_NAMES.english;
  const lastNames = LAST_NAMES[culturalSet] || LAST_NAMES.english;
  
  const firstName = choice(rng, firstNames);
  const nickname = choice(rng, NICKNAMES);
  const lastName = choice(rng, lastNames);
  const fullName = `${firstName} '${nickname}' ${lastName}`;
  
  return { fullName, firstName, lastName };
}

/**
 * Generate standard name
 */
function generateStandardName(culturalSets, rng) {
  const culturalSet = choice(rng, culturalSets);
  const firstNames = FIRST_NAMES[culturalSet] || FIRST_NAMES.english;
  const lastNames = LAST_NAMES[culturalSet] || LAST_NAMES.english;
  
  // Sometimes mix cultural sets for diversity
  const mixCultures = rng.next() < 0.2;
  let firstName, lastName;
  
  if (mixCultures) {
    const firstNameSet = choice(rng, culturalSets);
    const lastNameSet = choice(rng, culturalSets);
    firstName = choice(rng, FIRST_NAMES[firstNameSet] || FIRST_NAMES.english);
    lastName = choice(rng, LAST_NAMES[lastNameSet] || LAST_NAMES.english);
  } else {
    firstName = choice(rng, firstNames);
    lastName = choice(rng, lastNames);
  }
  
  // Occasionally add music-themed names
  if (rng.next() < 0.05 && FIRST_NAMES.music.length > 0) {
    firstName = choice(rng, FIRST_NAMES.music);
  }
  
  const fullName = `${firstName} ${lastName}`;
  return { fullName, firstName, lastName };
}

/**
 * Get genre-appropriate name style
 */
function getGenreNameStyle(genre) {
  const genreLower = (genre || '').toLowerCase();
  
  if (genreLower.includes('punk') || genreLower.includes('hardcore')) {
    return 'punk';
  }
  if (genreLower.includes('metal') || genreLower.includes('death') || genreLower.includes('black')) {
    return 'metal';
  }
  if (genreLower.includes('jazz') || genreLower.includes('bebop') || genreLower.includes('swing')) {
    return 'jazz';
  }
  if (genreLower.includes('rock') || genreLower.includes('alternative')) {
    return 'rock';
  }
  
  return 'standard';
}

/**
 * Generate a musician name with context awareness
 */
export function generateMusicianName({
  rng,
  genre = 'Rock',
  personality = {},
  source = 'local_scene',
  location = 'Unknown',
  preferStageName = false,
  usedNames = new Set()
}) {
  const genreStyle = getGenreNameStyle(genre);
  const culturalSets = getCulturalNameSet(location);
  const isRebellious = personality.primary === 'rebellious' || personality.secondary === 'rebellious';
  
  // Determine name generation strategy
  let nameStrategy = 'standard';
  
  // Stage names for rebellious personalities or certain sources
  if (preferStageName || isRebellious || source === 'craigslist_ads' || 
      (genreStyle === 'punk' && rng.next() < 0.3) ||
      (genreStyle === 'metal' && rng.next() < 0.25)) {
    nameStrategy = 'stage';
  }
  
  // Nickname variants for certain personalities
  if (!preferStageName && !isRebellious && rng.next() < 0.15) {
    nameStrategy = 'nickname';
  }
  
  let fullName = '';
  let firstName = '';
  let lastName = '';
  let attempts = 0;
  const maxAttempts = 50;
  
  // Generate unique name
  do {
    const nameResult = generateNameByStrategy(nameStrategy, genreStyle, culturalSets, rng);
    fullName = nameResult.fullName;
    firstName = nameResult.firstName;
    lastName = nameResult.lastName;
    
    attempts++;
    
    // If name is unique or we've tried enough, break
    if (!usedNames.has(fullName) || attempts >= maxAttempts) {
      break;
    }
  } while (attempts < maxAttempts);
  
  // Add to used names set
  usedNames.add(fullName);
  
  return {
    fullName,
    firstName: firstName || fullName.split(' ')[0],
    lastName: lastName || (fullName.includes(' ') ? fullName.split(' ').slice(1).join(' ') : ''),
    isStageName: nameStrategy === 'stage',
    hasNickname: nameStrategy === 'nickname'
  };
}

/**
 * Generate multiple unique names for an audition pool
 */
export function generateUniqueNames(count, options = {}) {
  const {
    rng,
    genre = 'Rock',
    location = 'Unknown',
    usedNames = new Set()
  } = options;
  
  const names = [];
  const localUsedNames = new Set(usedNames);
  
  for (let i = 0; i < count; i++) {
    const nameData = generateMusicianName({
      rng,
      genre,
      location,
      usedNames: localUsedNames,
      ...options
    });
    names.push(nameData);
  }
  
  return names;
}
