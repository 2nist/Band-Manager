import { Activity, Zap, Music, Mic, Gem, FileText, AlertTriangle, Ambulance, AlertCircle, Guitar, Headphones, Radio, Trophy } from 'lucide-react';

export const STEPS = {
  LANDING: 'LANDING',
  SCENARIO: 'SCENARIO',
  CREATE: 'CREATE',
  LOGO: 'LOGO',
  GAME: 'GAME'
};

export const SCENARIOS = [
  {
    id: 'sandbox',
    name: 'Sandbox Mode',
    description: 'Free play with no specific goals. Build your band however you want!',
    initialMoney: 1000,
    initialFame: 0,
    goals: [],
    specialRules: {}
  },
  {
    id: 'indie-hustle',
    name: 'Indie Hustle',
    description: 'Start with just $500. Goal: Reach 1 million total streams while staying independent (no label deals).',
    initialMoney: 500,
    initialFame: 0,
    goals: [
      { id: 'streams', type: 'totalStreams', target: 1000000, label: '1M Total Streams' },
      { id: 'independent', type: 'stayIndependent', target: true, label: 'Stay Independent' }
    ],
    specialRules: { mustStayIndependent: true }
  },
  {
    id: 'major-label-dream',
    name: 'Major Label Dream',
    description: 'Get signed to a major label and release a #1 album on the charts.',
    initialMoney: 2000,
    initialFame: 50,
    goals: [
      { id: 'majorLabel', type: 'signMajorLabel', target: true, label: 'Sign Major Label Deal' },
      { id: 'numberOne', type: 'numberOneAlbum', target: true, label: '#1 Album on Charts' }
    ],
    specialRules: {}
  },
  {
    id: 'world-tour',
    name: 'World Tour Challenge',
    description: 'Complete tours in at least 4 different geographic regions (US, UK, Europe, Asia).',
    initialMoney: 1500,
    initialFame: 30,
    goals: [
      { id: 'tours', type: 'tourRegions', target: 4, label: 'Tour 4 Different Regions' }
    ],
    specialRules: {}
  },
  {
    id: 'viral-sensation',
    name: 'Viral Sensation',
    description: 'Go viral on TikTok and reach 50 million total streams within 6 months (24 weeks).',
    initialMoney: 800,
    initialFame: 20,
    goals: [
      { id: 'viral', type: 'goViral', target: true, label: 'Go Viral on TikTok' },
      { id: 'streams', type: 'totalStreams', target: 50000000, label: '50M Total Streams' },
      { id: 'time', type: 'withinWeeks', target: 24, label: 'Within 24 Weeks' }
    ],
    specialRules: { timeLimit: 24 }
  },
  {
    id: 'legacy-builder',
    name: 'Legacy Builder',
    description: 'Maintain success for 100+ weeks and build a lasting career with multiple hits.',
    initialMoney: 1200,
    initialFame: 40,
    goals: [
      { id: 'weeks', type: 'surviveWeeks', target: 100, label: 'Reach Week 100' },
      { id: 'fame', type: 'maintainFame', target: 150, label: 'Maintain 150+ Fame' },
      { id: 'hits', type: 'totalHits', target: 10, label: '10+ Popular Songs' }
    ],
    specialRules: {}
  },
  {
    id: 'social-media-star',
    name: 'Social Media Star',
    description: 'Build your career through social media. Reach 500k followers across all platforms and get featured on major playlists.',
    initialMoney: 600,
    initialFame: 10,
    goals: [
      { id: 'followers', type: 'socialFollowers', target: 500000, label: '500K Total Followers' },
      { id: 'playlists', type: 'playlistPlacements', target: 10, label: '10 Major Playlist Placements' }
    ],
    specialRules: { socialMediaBoost: 1.5 }
  },
  {
    id: 'one-hit-wonder',
    name: 'One Hit Wonder Challenge',
    description: 'Try to avoid being a one-hit wonder. Get 3 songs into the top 10 and maintain fame above 200 for 20 weeks.',
    initialMoney: 1500,
    initialFame: 60,
    goals: [
      { id: 'top10s', type: 'topTenHits', target: 3, label: '3 Songs in Top 10' },
      { id: 'fame', type: 'maintainFame', target: 200, label: 'Maintain 200+ Fame' },
      { id: 'weeks', type: 'surviveWeeks', target: 20, label: 'Maintain for 20 Weeks' }
    ],
    specialRules: {}
  },
  {
    id: 'underground-legend',
    name: 'Underground Legend',
    description: 'Build a cult following without mainstream success. Stay independent, reach 100k fans, but keep fame under 100.',
    initialMoney: 300,
    initialFame: 0,
    goals: [
      { id: 'fans', type: 'totalFans', target: 100000, label: '100K Fans' },
      { id: 'independent', type: 'stayIndependent', target: true, label: 'Stay Independent' },
      { id: 'fame', type: 'keepFameLow', target: 100, label: 'Fame Under 100' }
    ],
    specialRules: { mustStayIndependent: true, maxFame: 100 }
  },
  {
    id: 'comeback-story',
    name: 'The Comeback',
    description: 'Start with high fame but no money. Rebuild your career from the ashes. Get back to 200+ fame and $10k.',
    initialMoney: 50,
    initialFame: 150,
    goals: [
      { id: 'fame', type: 'reachFame', target: 200, label: 'Reach 200 Fame' },
      { id: 'money', type: 'saveMoney', target: 10000, label: 'Save $10,000' }
    ],
    specialRules: {}
  },
  {
    id: 'studio-perfectionist',
    name: 'Studio Perfectionist',
    description: 'Focus on studio work. Release 5 albums with average quality above 80. No touring until you hit this goal.',
    initialMoney: 2000,
    initialFame: 30,
    goals: [
      { id: 'albums', type: 'highQualityAlbums', target: 5, label: '5 Albums with 80+ Quality' }
    ],
    specialRules: { noTouring: true }
  }
];

export const STUDIO_TIERS = [
  { id: 0, name: 'Demo Studio', cost: 0, qualityBonus: 0, popBonus: 0, freshnessBonus: 0, recordCost: 80, desc: 'Basic 4-track recording' },
  { id: 1, name: 'Professional Studio', cost: 600, qualityBonus: 8, popBonus: 1, freshnessBonus: 0, recordCost: 150, desc: '24-track with Pro Tools' },
  { id: 2, name: 'Manor Residential', cost: 1500, qualityBonus: 15, popBonus: 2, freshnessBonus: 0.5, recordCost: 300, desc: 'Legendary analog suite' }
];

export const TRANSPORT_TIERS = [
  { id: 0, name: 'On Foot', cost: 0, gigBonus: 1.0, venueMult: 1.0, desc: 'Walking to local gigs', venueMin: 0 },
  { id: 1, name: 'Beat-Up Van', cost: 800, gigBonus: 1.15, venueMult: 1.25, desc: 'Old but reliable transport', venueMin: 0 },
  { id: 2, name: 'Tour Bus', cost: 2500, gigBonus: 1.35, venueMult: 1.6, desc: 'Professional touring vehicle', venueMin: 50 },
  { id: 3, name: 'Luxury Coach', cost: 5000, gigBonus: 1.5, venueMult: 2.0, desc: 'Premium tour experience', venueMin: 150 }
];

export const GEAR_TIERS = [
  { id: 0, name: 'Pawn Shop Gear', cost: 0, qualityBonus: 0, soundBonus: 0, gigBonus: 1.0, desc: 'Borrowed instruments and cheap PA system', icon: Guitar },
  { id: 1, name: 'Semi-Pro Equipment', cost: 700, qualityBonus: 5, soundBonus: 3, gigBonus: 1.12, desc: 'Decent guitars, drums, and decent sound system', icon: Mic },
  { id: 2, name: 'Professional Gear', cost: 1800, qualityBonus: 12, soundBonus: 8, gigBonus: 1.25, desc: 'Quality instruments, pro-grade PA system', icon: Headphones },
  { id: 3, name: 'Studio-Grade Instruments', cost: 4000, qualityBonus: 22, soundBonus: 15, gigBonus: 1.4, desc: 'Top-tier instruments and world-class equipment', icon: Trophy }
];

export const TOUR_TYPES = [
  {
    id: 'local',
    name: 'Local Gig',
    cost: 0,
    cities: 1,
    duration: 1,
    fameReq: 0,
    desc: 'Single local venue performance',
    unlockReq: null
  },
  {
    id: 'regional',
    name: 'Regional Tour',
    cost: 800,
    cities: 4,
    duration: 4,
    fameReq: 30,
    desc: '3-5 city tour in your region',
    unlockReq: { reputation: 'us', value: 20 }
  },
  {
    id: 'national',
    name: 'National Tour',
    cost: 2500,
    cities: 12,
    duration: 12,
    fameReq: 100,
    desc: '10-15 city tour across the country',
    unlockReq: { reputation: 'us', value: 50 }
  },
  {
    id: 'international',
    name: 'International Tour',
    cost: 5000,
    cities: 8,
    duration: 8,
    fameReq: 200,
    desc: 'Tour Europe, Asia, or other regions',
    unlockReq: { reputation: 'us', value: 80 }
  },
  {
    id: 'virtual',
    name: 'Virtual Tour',
    cost: 600,
    cities: 1,
    duration: 1,
    fameReq: 50,
    desc: 'Livestream concert, global audience',
    unlockReq: null
  },
  {
    id: 'festival',
    name: 'Festival Circuit',
    cost: 1500,
    cities: 6,
    duration: 6,
    fameReq: 80,
    desc: 'Summer festival circuit, high exposure',
    unlockReq: { reputation: 'us', value: 40 }
  }
];

export const GEOGRAPHIC_REGIONS = [
  { id: 'us', name: 'United States', cities: ['New York', 'Los Angeles', 'Chicago', 'Austin', 'Seattle', 'Nashville', 'Boston', 'Miami', 'Denver', 'Portland'] },
  { id: 'uk', name: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham', 'Glasgow', 'Liverpool', 'Bristol', 'Leeds', 'Edinburgh'] },
  { id: 'europe', name: 'Europe', cities: ['Berlin', 'Paris', 'Amsterdam', 'Barcelona', 'Milan', 'Vienna', 'Stockholm', 'Copenhagen', 'Brussels', 'Dublin'] },
  { id: 'asia', name: 'Asia', cities: ['Tokyo', 'Seoul', 'Singapore', 'Bangkok', 'Hong Kong', 'Taipei', 'Manila', 'Jakarta'] }
];

export const DISTRIBUTION_TIERS = [
  {
    id: 'independent',
    name: 'Independent (Distrokid/CD Baby)',
    cost: 0,
    monthlyFee: 20,
    advance: 0,
    royaltySplit: 0,
    marketingBudget: 0,
    playlistPitch: false,
    syncLicensing: false,
    radioPromo: false,
    contractLength: 0,
    fameReq: 0,
    desc: 'DIY distribution. Keep all royalties but handle everything yourself.',
    benefits: ['100% royalty retention', 'Full creative control', 'No long-term commitment']
  },
  {
    id: 'distribution',
    name: 'Distribution Deal',
    cost: 0,
    monthlyFee: 0,
    advance: 500,
    royaltySplit: 15,
    marketingBudget: 200,
    playlistPitch: true,
    syncLicensing: false,
    radioPromo: false,
    contractLength: 24,
    fameReq: 50,
    desc: 'Label handles distribution & playlists. You keep ownership and most royalties.',
    benefits: ['Playlist pitches', 'Distribution handled', '85% royalties', 'Small marketing budget']
  },
  {
    id: '360',
    name: '360 Deal',
    cost: 0,
    monthlyFee: 0,
    advance: 2000,
    royaltySplit: 30,
    marketingBudget: 600,
    playlistPitch: true,
    syncLicensing: true,
    radioPromo: true,
    contractLength: 52,
    fameReq: 150,
    desc: 'Full label support across all revenue streams. Shared profits, major backing.',
    benefits: ['Playlist pitches', 'Sync licensing', 'Radio promotion', 'Larger marketing budget', 'Higher advance']
  },
  {
    id: 'major',
    name: 'Major Label',
    cost: 0,
    monthlyFee: 0,
    advance: 10000,
    royaltySplit: 50,
    marketingBudget: 2000,
    playlistPitch: true,
    syncLicensing: true,
    radioPromo: true,
    contractLength: 104,
    fameReq: 300,
    desc: 'Major label backing. Huge advances and marketing, but they take half of everything.',
    benefits: ['Massive advance', 'Huge marketing budget', 'Top-tier playlist access', 'Best sync opportunities', 'Major radio push']
  }
];

export const GIG_SUCCESS_DESCRIPTIONS = [
  (venue, crowd, pay, fame) => `The ${crowd} screaming fans at ${venue.name} went absolutely wild! Your band tore through the set with precision and fire. Crowd surfing, encores, the whole nine yards. The promoter counted out $${pay} and grinned—"We'll definitely book you again." You gained ${fame} fame.`,
  (venue, crowd, pay, fame) => `${venue.name} was packed to the gills! The energy was electric, and your performance was flawless. Security could barely hold back the fans. Merch sold out. You walked away with $${pay} and serious street cred.`,
  (venue, crowd, pay, fame) => `The crowd at ${venue.name} ate it up. Every song landed perfectly, and the mosh pit was absolutely bonkers. This kind of show is what rock and roll is made of. $${pay} richer and ${fame} fame points up.`,
  (venue, crowd, pay, fame) => `Standing ovation at ${venue.name}! The ${crowd} fans chanted for an encore. Your band delivered. The venue owner handed you $${pay} and already wants to book you for a bigger slot next month.`
];

export const GIG_OKAY_DESCRIPTIONS = [
  (venue, crowd, pay, fame) => `The set at ${venue.name} went alright, though the crowd was a bit lukewarm. You made $${pay}, but felt like something was off. Maybe the gear, maybe the mood. You'll do better next time.`,
  (venue, crowd, pay, fame) => `${venue.name} was half-full. You played competently, but the energy didn't quite ignite. The promoter paid you $${pay}, but seemed unimpressed.`,
  (venue, crowd, pay, fame) => `The gig at ${venue.name} was... fine. Nothing terrible, nothing spectacular. $${pay} for a solid evening. Time to upgrade something and come back stronger.`
];

export const GIG_POOR_DESCRIPTIONS = [
  (venue, crowd, pay, fame) => `Oof. The set at ${venue.name} was rough. Your timing was off, the crowd was thin, and you only scraped together $${pay}. The promoter looked disappointed. You need better gear and tighter rehearsals.`,
  (venue, crowd, pay, fame) => `${venue.name} was nearly empty. Your band sounded sloppy, and you barely earned $${pay}. Time to get back in the woodshed.`,
  (venue, crowd, pay, fame) => `The performance at ${venue.name} was forgettable. You earned $${pay} and the crowd's indifference. This is a wake-up call to practice harder.`
];

export const ROLE_OPTIONS = [
  { key: 'vocals', label: 'Vocals' },
  { key: 'guitar', label: 'Guitar' },
  { key: 'bass', label: 'Bass' },
  { key: 'drums', label: 'Drums' },
  { key: 'synth', label: 'Synth' },
  { key: 'dj', label: 'DJ' }
];

export const GENRES = ['Synth Pop', 'Indie Rock', 'Hip-Hop', 'Metal', 'Blues', 'Pop', 'EDM', 'Experimental', 'Punk', 'Country', 'R&B', 'Funk', 'Jazz', 'Soul', 'Reggae', 'Classical'];

export const GENRE_THEMES = {
  'Synth Pop': 'theme-neon',
  'Indie Rock': 'theme-modern',
  'Hip-Hop': 'theme-pop',
  'Metal': 'theme-pop',
  'Blues': 'theme-warm',
  'Pop': 'theme-pop',
  'EDM': 'theme-neon',
  'Experimental': 'theme-neon',
  'Punk': 'theme-pop',
  'Country': 'theme-warm',
  'R&B': 'theme-warm',
  'Funk': 'theme-pop',
  'Jazz': 'theme-modern',
  'Soul': 'theme-warm',
  'Reggae': 'theme-pop',
  'Classical': 'theme-modern'
};

// Expanded name lists for band members
export const FIRST_NAMES = [
  // Gender-neutral / Modern
  'Alex', 'Sam', 'Jordan', 'Taylor', 'Riley', 'Casey', 'Jamie', 'Logan', 'Quinn', 'Drew', 
  'Kai', 'Morgan', 'Reese', 'Jules', 'Avery', 'River', 'Phoenix', 'Skylar', 'Rowan', 'Sage',
  
  // Male names
  'Marcus', 'Jake', 'Noah', 'Liam', 'Ethan', 'Mason', 'Lucas', 'Owen', 'Aiden', 'Carter',
  'Sebastian', 'Henry', 'Jackson', 'Wyatt', 'Grayson', 'Leo', 'Mason', 'Logan', 'Caleb', 'Ryan',
  'Nathan', 'Isaac', 'Eli', 'Landon', 'Hunter', 'Connor', 'Aaron', 'Adrian', 'Blake', 'Colin',
  'Dylan', 'Evan', 'Gavin', 'Ian', 'Jaden', 'Kyle', 'Max', 'Nolan', 'Parker', 'Quinn',
  'Riley', 'Tyler', 'Zachary', 'Asher', 'Bennett', 'Brody', 'Cameron', 'Cooper', 'Declan', 'Finn',
  'Harrison', 'Jasper', 'Kai', 'Luca', 'Miles', 'Oscar', 'Preston', 'Reid', 'Sawyer', 'Theo',
  
  // Female names
  'Emma', 'Olivia', 'Sophia', 'Isabella', 'Ava', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn',
  'Abigail', 'Emily', 'Ella', 'Elizabeth', 'Camila', 'Luna', 'Sofia', 'Avery', 'Mila', 'Aria',
  'Scarlett', 'Penelope', 'Layla', 'Chloe', 'Victoria', 'Madison', 'Eleanor', 'Grace', 'Nora', 'Riley',
  'Zoey', 'Hannah', 'Lillian', 'Addison', 'Aubrey', 'Ellie', 'Stella', 'Natalie', 'Zoe', 'Leah',
  'Hazel', 'Violet', 'Aurora', 'Savannah', 'Audrey', 'Brooklyn', 'Bella', 'Claire', 'Skylar', 'Lucy',
  'Paisley', 'Everly', 'Anna', 'Caroline', 'Nova', 'Genesis', 'Aaliyah', 'Kennedy', 'Kinsley', 'Allison',
  
  // Rock/Music themed
  'Axel', 'Jett', 'Ryder', 'Steele', 'Blaze', 'Phoenix', 'Raven', 'Storm', 'Vex', 'Zane',
  'Luna', 'Raven', 'Star', 'Melody', 'Harmony', 'Lyric', 'Cadence', 'Aria', 'Jazz', 'Roxy'
];

export const LAST_NAMES = [
  // Classic rock/music surnames
  'Stone', 'Vale', 'Hart', 'Kade', 'Rex', 'Wilde', 'Fox', 'Storm', 'Ray', 'Knight',
  'Cross', 'Shade', 'Frost', 'Voss', 'Lake', 'Rivers', 'Black', 'Steel', 'Reed', 'Marsh',
  
  // Strong surnames
  'Anderson', 'Bennett', 'Brooks', 'Carter', 'Cooper', 'Davis', 'Edwards', 'Foster', 'Gray', 'Harris',
  'Hughes', 'Jackson', 'Johnson', 'Kelly', 'Lewis', 'Martinez', 'Mitchell', 'Murphy', 'Parker', 'Powell',
  'Roberts', 'Robinson', 'Rodriguez', 'Scott', 'Smith', 'Taylor', 'Thomas', 'Thompson', 'Walker', 'White',
  'Williams', 'Wilson', 'Wood', 'Wright', 'Young', 'Adams', 'Baker', 'Bell', 'Brown', 'Clark',
  'Collins', 'Cook', 'Evans', 'Green', 'Hall', 'Hill', 'Howard', 'James', 'King', 'Lee',
  'Martin', 'Miller', 'Moore', 'Morgan', 'Morris', 'Nelson', 'Parker', 'Phillips', 'Reed', 'Richardson',
  
  // Edgy/rock surnames
  'Blade', 'Crow', 'Dagger', 'Fang', 'Hawk', 'Iron', 'Knight', 'Raven', 'Shadow', 'Steel',
  'Thorn', 'Vex', 'Wolfe', 'Zephyr', 'Ash', 'Blaze', 'Cinder', 'Ember', 'Flame', 'Frost',
  'Glacier', 'Hail', 'Ice', 'Lightning', 'Mist', 'Nova', 'Phoenix', 'Storm', 'Thunder', 'Tornado',
  'Vortex', 'Wild', 'Zenith', 'Apex', 'Crest', 'Peak', 'Summit', 'Tide', 'Wave', 'Current',
  
  // Music industry surnames
  'Bass', 'Chord', 'Harmony', 'Lyric', 'Melody', 'Note', 'Rhythm', 'Scale', 'Tempo', 'Tune',
  'Verse', 'Bridge', 'Chorus', 'Hook', 'Riff', 'Solo', 'Stanza', 'Coda', 'Crescendo', 'Forte'
];

// Expanded nickname/stage name list
export const NICKNAMES = [
  // Classic Rock
  'Ace', 'Thunder', 'Lightning', 'Storm', 'Blaze', 'Flame', 'Fire', 'Ice', 'Frost', 'Shadow',
  'Steel', 'Iron', 'Rock', 'Stone', 'Metal', 'Blade', 'Edge', 'Razor', 'Fang', 'Claw',
  
  // Cool/Edgy
  'Vex', 'Rex', 'Zed', 'Zane', 'Zephyr', 'Zen', 'Nova', 'Nyx', 'Raven', 'Crow',
  'Wolf', 'Fox', 'Hawk', 'Eagle', 'Falcon', 'Phoenix', 'Dragon', 'Tiger', 'Lion', 'Bear',
  
  // Music Themed
  'Riff', 'Chord', 'Beat', 'Rhythm', 'Tempo', 'Harmony', 'Melody', 'Lyric', 'Verse', 'Bridge',
  'Solo', 'Hook', 'Groove', 'Vibe', 'Tune', 'Note', 'Scale', 'Key', 'Tone', 'Pitch',
  
  // Badass
  'Reaper', 'Viper', 'Cobra', 'Scorpion', 'Venom', 'Toxin', 'Plague', 'Pestilence', 'War', 'Chaos',
  'Rage', 'Fury', 'Wrath', 'Doom', 'Grim', 'Death', 'Hell', 'Demon', 'Devil', 'Satan',
  
  // Mystical
  'Mystic', 'Oracle', 'Sage', 'Wizard', 'Sorcerer', 'Mage', 'Witch', 'Warlock', 'Shaman', 'Druid',
  'Spirit', 'Ghost', 'Phantom', 'Specter', 'Wraith', 'Banshee', 'Siren', 'Harpy', 'Valkyrie', 'Vampire',
  
  // Cool Single Names
  'Jax', 'Max', 'Zed', 'Rex', 'Ace', 'Jett', 'Blaze', 'Kai', 'Rio', 'Nico',
  'Zane', 'Axel', 'Ryder', 'Steele', 'Cruz', 'Dash', 'Jet', 'Fox', 'Wolf', 'Bear',
  
  // The [Name]
  'The Rock', 'The Hammer', 'The Axe', 'The Blade', 'The Edge', 'The Storm', 'The Thunder', 'The Lightning',
  'The Fire', 'The Ice', 'The Shadow', 'The Ghost', 'The Phantom', 'The Reaper', 'The Viper', 'The Wolf',
  
  // Descriptive
  'Wild', 'Savage', 'Fierce', 'Bold', 'Brave', 'Fierce', 'Mighty', 'Powerful', 'Strong', 'Tough',
  'Smooth', 'Cool', 'Sharp', 'Fast', 'Quick', 'Swift', 'Rapid', 'Turbo', 'Nitro', 'Speed',
  
  // Color Based
  'Black', 'White', 'Red', 'Blue', 'Green', 'Gold', 'Silver', 'Copper', 'Bronze', 'Platinum',
  'Crimson', 'Scarlet', 'Azure', 'Emerald', 'Ruby', 'Sapphire', 'Amber', 'Onyx', 'Jade', 'Pearl'
];

export const initialState = {
  week: 1,
  money: 1000,
  fame: 0,
  morale: 70,
  fans: 0,
  trainingCooldown: 0,
  promoteCooldown: 0,
  trend: null,
  tourBan: 0,
  staffManager: 'none',
  staffLawyer: false,
  labelDeal: null,
  studioTier: 0,
  transportTier: 0,
  gearTier: 0,
  bandName: '',
  genre: 'Synth Pop',
  members: [],
  songs: [],
  albums: [],
  gigs: 0,
  gigHistory: [],
  gigEarnings: 0,
  equipment: {
    instruments: 'basic',
    soundSystem: 'basic',
    transport: 'none'
  },
  log: [],
  weeklyExpenses: 100,
  totalRevenue: 0,
  totalEarnings: 0,
  totalAlbumSales: 0,
  totalMerchandise: 0,
  logoFont: 'Arial',
  logoBgColor: '#1a1a2e',
  logoTextColor: '#ff6b6b',
  socialMedia: {
    tiktok: { followers: 0, engagementRate: 0, lastPost: 0 },
    instagram: { followers: 0, engagementRate: 0, lastPost: 0 },
    twitter: { followers: 0, engagementRate: 0, lastPost: 0 }
  },
  algorithmFavor: 0,
  monthlyListeners: 0,
  playlistPlacements: [],
  viralMoments: [],
  geographicReputation: {
    us: 0,
    uk: 0,
    europe: 0,
    asia: 0
  },
  activeTour: null,
  tourHistory: [],
  scenario: null,
  goals: [],
  achievements: [],
  scenarioStartWeek: 1,
  scenarioComplete: false,
  genreTrends: {},
  regionalGenrePreferences: { us: {}, uk: {}, europe: {}, asia: {} },
  industryEvents: [],
  chartBattles: [],
  careerStats: {
    totalWeeks: 0,
    totalRevenue: 0,
    totalStreams: 0,
    albumsReleased: 0,
    songsReleased: 0,
    toursCompleted: 0,
    awardsWon: 0,
    peakFame: 0,
    peakFans: 0,
    peakChartPosition: 0
  },
  hallOfFame: false,
  bandStatus: 'active',
  legacyTier: 'none',
  reunionTours: [],
  collaborations: [],
  musicVideos: [],
  difficulty: 'normal',
  tutorialCompleted: false
};
