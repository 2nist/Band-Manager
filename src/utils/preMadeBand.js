/**
 * preMadeBand.js - Pre-made band setup for first-person mode
 * 
 * Creates an established band that the player joins as a member
 */

export const PRE_MADE_BANDS = {
  'midnight-echoes': {
    name: 'Midnight Echoes',
    genre: 'Alternative Rock',
    description: 'A tight-knit alternative rock band on the rise. You play rhythm guitar.',
    members: [
      {
        id: 1,
        name: 'Jake "Thunder" Morrison',
        role: 'lead-guitar',
        type: 'Lead Guitar',
        skill: 7,
        morale: 75,
        stats: { skill: 7, charisma: 6, creativity: 8 },
        bio: 'The band leader and primary songwriter. Intense and driven.'
      },
      {
        id: 2,
        name: 'Sarah "Vox" Chen',
        role: 'vocalist',
        type: 'Vocals',
        skill: 8,
        morale: 80,
        stats: { skill: 8, charisma: 9, creativity: 7 },
        bio: 'Powerful vocalist with incredible stage presence. The face of the band.'
      },
      {
        id: 3,
        name: 'Marcus "Groove" Williams',
        role: 'bassist',
        type: 'Bass',
        skill: 6,
        morale: 70,
        stats: { skill: 6, charisma: 5, creativity: 6 },
        bio: 'Solid bass player, keeps the rhythm tight. Quiet but reliable.'
      },
      {
        id: 4,
        name: 'Danny "Sticks" Rodriguez',
        role: 'drummer',
        type: 'Drums',
        skill: 7,
        morale: 85,
        stats: { skill: 7, charisma: 6, creativity: 7 },
        bio: 'Energetic drummer, always positive. The band\'s morale booster.'
      },
      {
        id: 5,
        name: 'You', // Player character
        role: 'rhythm-guitar',
        type: 'Rhythm Guitar',
        skill: 6,
        morale: 80,
        stats: { skill: 6, charisma: 5, creativity: 6 },
        bio: 'The newest member. Still finding your place in the band.'
      }
    ],
    established: true,
    reputation: 25,
    relationships: {
      jake: { trust: 60, respect: 50 },
      sarah: { trust: 55, respect: 60 },
      marcus: { trust: 50, respect: 45 },
      danny: { trust: 70, respect: 55 }
    }
  },
  'neon-dreams': {
    name: 'Neon Dreams',
    genre: 'Synth Pop',
    description: 'An electronic pop band with a dark edge. You play synth.',
    members: [
      {
        id: 1,
        name: 'Luna "Star" Black',
        role: 'vocalist',
        type: 'Vocals',
        skill: 8,
        morale: 70,
        stats: { skill: 8, charisma: 9, creativity: 8 },
        bio: 'Mysterious frontwoman with a haunting voice. Complex personality.'
      },
      {
        id: 2,
        name: 'Zane "Pulse" Cross',
        role: 'dj',
        type: 'DJ',
        skill: 7,
        morale: 75,
        stats: { skill: 7, charisma: 6, creativity: 9 },
        bio: 'The producer and DJ. Creative genius but sometimes volatile.'
      },
      {
        id: 3,
        name: 'Raven "Shadow" Moon',
        role: 'bassist',
        type: 'Bass',
        skill: 6,
        morale: 65,
        stats: { skill: 6, charisma: 5, creativity: 7 },
        bio: 'Dark and brooding bassist. Keeps to themselves mostly.'
      },
      {
        id: 4,
        name: 'You',
        role: 'synth',
        type: 'Synth',
        skill: 6,
        morale: 80,
        stats: { skill: 6, charisma: 5, creativity: 7 },
        bio: 'The synth player. Still learning the band\'s dynamic.'
      }
    ],
    established: true,
    reputation: 20,
    relationships: {
      luna: { trust: 50, respect: 55 },
      zane: { trust: 45, respect: 50 },
      raven: { trust: 40, respect: 45 }
    }
  }
};

/**
 * Get a pre-made band by ID
 */
export const getPreMadeBand = (bandId = 'midnight-echoes') => {
  return PRE_MADE_BANDS[bandId] || PRE_MADE_BANDS['midnight-echoes'];
};

/**
 * Initialize game state with pre-made band
 */
export const initializeFirstPersonMode = (bandId = 'midnight-echoes') => {
  const band = getPreMadeBand(bandId);
  
  return {
    bandName: band.name,
    genre: band.genre,
    bandMembers: band.members,
    firstPersonMode: true,
    preMadeBand: bandId,
    playerCharacter: band.members.find(m => m.name === 'You'),
    bandRelationships: band.relationships,
    establishedBand: true
  };
};
