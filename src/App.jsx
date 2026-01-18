import React, { useEffect, useMemo, useState } from 'react';
import './styles.css';
import { Activity, Zap, Music, Mic, Gem, FileText, AlertTriangle, Ambulance, AlertCircle, Guitar, Headphones, Radio, Trophy, Users, TrendingUp, DollarSign, BarChart3, ListMusic } from 'lucide-react';

const STEPS = {
  WELCOME: 'WELCOME',
  CREATE: 'CREATE',
  LOGO: 'LOGO',
  GAME: 'GAME'
};

const STUDIO_TIERS = [
  { id: 0, name: 'Demo Studio', cost: 0, qualityBonus: 0, popBonus: 0, freshnessBonus: 0, recordCost: 80, desc: 'Basic 4-track recording' },
  { id: 1, name: 'Professional Studio', cost: 600, qualityBonus: 8, popBonus: 1, freshnessBonus: 0, recordCost: 150, desc: '24-track with Pro Tools' },
  { id: 2, name: 'Manor Residential', cost: 1500, qualityBonus: 15, popBonus: 2, freshnessBonus: 0.5, recordCost: 300, desc: 'Legendary analog suite' }
];

const TRANSPORT_TIERS = [
  { id: 0, name: 'On Foot', cost: 0, gigBonus: 1.0, venueMult: 1.0, desc: 'Walking to local gigs', venueMin: 0 },
  { id: 1, name: 'Beat-Up Van', cost: 800, gigBonus: 1.15, venueMult: 1.25, desc: 'Old but reliable transport', venueMin: 0 },
  { id: 2, name: 'Tour Bus', cost: 2500, gigBonus: 1.35, venueMult: 1.6, desc: 'Professional touring vehicle', venueMin: 50 },
  { id: 3, name: 'Luxury Coach', cost: 5000, gigBonus: 1.5, venueMult: 2.0, desc: 'Premium tour experience', venueMin: 150 }
];

const GEAR_TIERS = [
  { id: 0, name: 'Pawn Shop Gear', cost: 0, qualityBonus: 0, soundBonus: 0, gigBonus: 1.0, desc: 'Borrowed instruments and cheap PA system', icon: Guitar },
  { id: 1, name: 'Semi-Pro Equipment', cost: 700, qualityBonus: 5, soundBonus: 3, gigBonus: 1.12, desc: 'Decent guitars, drums, and decent sound system', icon: Mic },
  { id: 2, name: 'Professional Gear', cost: 1800, qualityBonus: 12, soundBonus: 8, gigBonus: 1.25, desc: 'Quality instruments, pro-grade PA system', icon: Headphones },
  { id: 3, name: 'Studio-Grade Instruments', cost: 4000, qualityBonus: 22, soundBonus: 15, gigBonus: 1.4, desc: 'Top-tier instruments and world-class equipment', icon: Trophy }
];

// Event description templates for vivid, engaging storytelling
const GIG_SUCCESS_DESCRIPTIONS = [
  (venue, crowd, pay, fame) => `The ${crowd} screaming fans at ${venue.name} went absolutely wild! Your band tore through the set with precision and fire. Crowd surfing, encores, the whole nine yards. The promoter counted out $${pay} and grinned—"We'll definitely book you again." You gained ${fame} fame.`,
  (venue, crowd, pay, fame) => `${venue.name} was packed to the gills! The energy was electric, and your performance was flawless. Security could barely hold back the fans. Merch sold out. You walked away with $${pay} and serious street cred.`,
  (venue, crowd, pay, fame) => `The crowd at ${venue.name} ate it up. Every song landed perfectly, and the mosh pit was absolutely bonkers. This kind of show is what rock and roll is made of. $${pay} richer and ${fame} fame points up.`,
  (venue, crowd, pay, fame) => `Standing ovation at ${venue.name}! The ${crowd} fans chanted for an encore. Your band delivered. The venue owner handed you $${pay} and already wants to book you for a bigger slot next month.`
];

const GIG_OKAY_DESCRIPTIONS = [
  (venue, crowd, pay, fame) => `The set at ${venue.name} went alright, though the crowd was a bit lukewarm. You made $${pay}, but felt like something was off. Maybe the gear, maybe the mood. You'll do better next time.`,
  (venue, crowd, pay, fame) => `${venue.name} was half-full. You played competently, but the energy didn't quite ignite. The promoter paid you $${pay}, but seemed unimpressed.`,
  (venue, crowd, pay, fame) => `The gig at ${venue.name} was... fine. Nothing terrible, nothing spectacular. $${pay} for a solid evening. Time to upgrade something and come back stronger.`
];

const GIG_POOR_DESCRIPTIONS = [
  (venue, crowd, pay, fame) => `Oof. The set at ${venue.name} was rough. Your timing was off, the crowd was thin, and you only scraped together $${pay}. The promoter looked disappointed. You need better gear and tighter rehearsals.`,
  (venue, crowd, pay, fame) => `${venue.name} was nearly empty. Your band sounded sloppy, and you barely earned $${pay}. Time to get back in the woodshed.`,
  (venue, crowd, pay, fame) => `The performance at ${venue.name} was forgettable. You earned $${pay} and the crowd's indifference. This is a wake-up call to practice harder.`
];

const initialState = {
  week: 1,
  money: 1000,
  fame: 0,
  morale: 70,
  fans: 0,
  trainingCooldown: 0,
  promoteCooldown: 0,
  trend: null,
  tourBan: 0,
  staffManager: 'none', // none | dodgy | pro
  staffLawyer: false,
  studioTier: 0, // 0=demo, 1=pro, 2=manor
  transportTier: 0, // 0=foot, 1=van, 2=bus, 3=coach
  gearTier: 0, // 0=pawn, 1=semi, 2=pro, 3=studio
  bandName: '',
  genre: 'Synth Pop',
  members: [],
  songs: [],
  equipment: {
    instruments: 'basic',
    soundSystem: 'basic',
    transport: 'none'
  },
  log: [],
  weeklyExpenses: 100,
  totalRevenue: 0,
  totalAlbumSales: 0,
  totalMerchandise: 0,
  logoFont: 'Arial',
  logoBgColor: '#1a1a2e',
  logoTextColor: '#ff6b6b'
};

const ROLE_OPTIONS = [
  { key: 'vocals', label: 'Vocals' },
  { key: 'guitar', label: 'Guitar' },
  { key: 'bass', label: 'Bass' },
  { key: 'drums', label: 'Drums' },
  { key: 'synth', label: 'Synth' },
  { key: 'dj', label: 'DJ' }
];

const GENRES = ['Synth Pop', 'Indie Rock', 'Hip-Hop', 'Metal', 'Blues', 'Pop', 'EDM', 'Experimental', 'Punk', 'Country', 'R&B', 'Funk', 'Jazz', 'Soul', 'Reggae', 'Classical'];

const GENRE_THEMES = {
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

const FIRST_NAMES = ['Alex','Sam','Jordan','Taylor','Riley','Casey','Jamie','Logan','Quinn','Drew','Kai','Morgan','Reese','Jules','Avery'];
const LAST_NAMES = ['Stone','Vale','Hart','Kade','Rex','Wilde','Fox','Storm','Ray','Knight','Cross','Shade','Frost','Voss','Lake'];

function useGameData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [game, events] = await Promise.all([
          fetch('/data/gameData.json').then(r => r.json()),
          fetch('/data/events.json').then(r => r.json())
        ]);
        setData({ ...game, ...events });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { data, loading, error };
}

function App() {
  const { data, loading, error } = useGameData();
  const [step, setStep] = useState(STEPS.WELCOME);
  const [state, setState] = useState(initialState);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [customFont, setCustomFont] = useState('');
  const [rivals, setRivals] = useState([]);
  const [desiredRoles, setDesiredRoles] = useState(['vocals', 'guitar', 'bass', 'drums']);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [lineupAddRole, setLineupAddRole] = useState('vocals');
  const [recruitOptions, setRecruitOptions] = useState([]);
  const [showStudioModal, setShowStudioModal] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [showGearModal, setShowGearModal] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview'); // overview, actions, band, music, upgrades, log
  const [leftTab, setLeftTab] = useState('snapshot'); // snapshot, meters, team, songs
  const [rightTab, setRightTab] = useState('topChart'); // topChart, albums, songChart
  const [theme, setTheme] = useState('theme-modern'); // theme-warm, theme-neon, theme-pop, theme-modern
  const [darkMode, setDarkMode] = useState(false);

  // Apply theme to body
  useEffect(() => {
    document.body.className = `${theme} ${darkMode ? 'dark' : ''}`;
  }, [theme, darkMode]);

  const [fontOptions, setFontOptions] = useState([
    'Arial',
    'Anton',
    'Oswald',
    'Metal Mania',
    'Righteous',
    'Montserrat',
    'Poppins',
    'Syncopate',
    'Syne',
    'Playfair Display',
    'Lobster',
    'Abril Fatface',
    'Bungee',
    'Lora',
    'Libre Baskerville',
    'Cormorant',
    'Pacifico',
    'Orbitron',
    'Unbounded',
    'Creepster',
    'Bangers',
    'Inter',
    'Roboto',
    'Space Grotesk',
    'Press Start 2P',
    'Fira Sans',
    'Nunito',
    'Work Sans',
    'Manrope',
    'Barlow',
    'Sora',
    'Kanit'
  ]);

  useEffect(() => {
    if (!data) return;
    const fallbackNames = [
      'Neon Owls', 'Static Bloom', 'Velvet Volt', 'City Sirens', 'Moonlit Riot',
      'Crimson Echo', 'Glass Tiger', 'Royal Static', 'Analog Hearts', 'Shadow Parade',
      'Aurora Flux', 'Golden Alley', 'Paper Satellites', 'Silver Stereo', 'Echo Arcade',
      'Night Mechanics', 'Carbon Bloom', 'Gilded Youth', 'Starlit Exit', 'Metro Ghosts',
      'Satellite Choir', 'Neon District', 'Midnight Tenors'
    ];
    const pool = [...(data.bandNames || []), ...fallbackNames];
    const seeded = pool.slice(0, 24).map(name => ({
      name,
      fame: Math.floor(Math.random() * 200) + 50,
      chartPosition: null,
      songs: Math.floor(Math.random() * 5) + 1
    }));
    setRivals(seeded);
  }, [data]);

  const availableVenues = useMemo(() => {
    if (!data) return [];
    return (data.venues || []).filter(v => state.fame >= v.fameRequired).slice(0, 3);
  }, [data, state.fame]);

  const chartLeaders = useMemo(() => {
    const pool = state.bandName
      ? [...rivals, { name: state.bandName, fame: state.fame, isPlayer: true }]
      : [...rivals];
    const sorted = [...pool].sort((a, b) => b.fame - a.fame);
    return sorted.slice(0, 20).map((b, idx) => ({ ...b, position: idx + 1 }));
  }, [rivals, state.bandName, state.fame]);

  const albumChart = useMemo(() => {
    const scored = (state.albums || []).map((a) => ({
      ...a,
      chartScore: a.chartScore ?? Math.max(0, Math.floor((a.quality || 0) * 0.6))
    }));
    const sorted = scored.sort((a, b) => (b.chartScore || 0) - (a.chartScore || 0));
    return sorted.slice(0, 10).map((a, idx) => ({ ...a, position: idx + 1 }));
  }, [state.albums]);

  useEffect(() => {
    if (availableVenues.length && !selectedVenue) {
      setSelectedVenue(availableVenues[0]);
    }
    if (!availableVenues.length) {
      setSelectedVenue(null);
    }
  }, [availableVenues, selectedVenue]);

  const addLog = (entry) => {
    setState((s) => ({
      ...s,
      log: [entry, ...s.log].slice(0, 12)
    }));
  };

  const ensureFontLoaded = (fontName) => {
    if (!fontName) return;
    const id = `font-${fontName.replace(/\s+/g, '-')}`;
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;700;900&display=swap`;
    document.head.appendChild(link);
  };

  const clampMorale = (value) => Math.max(0, Math.min(100, value));

  const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const randStat = (min = 2.5, max = 6) => Math.round((min + Math.random() * (max - min)) * 10) / 10;
  const clampStat = (v) => Math.max(1, Math.min(10, Math.round(v * 10) / 10));
  const buildCandidate = (role, personalities = []) => buildMember(role, personalities);
  const buildMember = (role, personalities = []) => {
    const firstName = randomFrom(FIRST_NAMES);
    const lastName = randomFrom(LAST_NAMES);
    const personality = personalities.length ? randomFrom(personalities) : 'steady';
    const stats = {
      skill: randStat(2.5, 6),
      creativity: randStat(2.5, 6),
      stagePresence: randStat(2, 5.5),
      reliability: randStat(2.5, 6),
      morale: randStat(3, 6.5),
      drama: randStat(2.5, 6)
    };
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    return {
      id,
      role,
      firstName,
      lastName,
      nickname: '',
      personality,
      stats,
      name: `${firstName} ${lastName}`
    };
  };

  const memberDisplayName = (m) => {
    const base = [m.firstName, m.lastName].filter(Boolean).join(' ').trim();
    return m.nickname?.trim() || base || m.name || 'Bandmate';
  };

  const renderInstrumentIcon = (role) => {
    const stroke = '#c084fc';
    const fill = '#1f2937';
    switch (role) {
      case 'drums':
        return (
          <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden>
            <circle cx="20" cy="32" r="12" fill={fill} stroke={stroke} strokeWidth="3" />
            <circle cx="44" cy="32" r="12" fill={fill} stroke={stroke} strokeWidth="3" />
            <rect x="14" y="28" width="36" height="8" fill={stroke} opacity="0.5" />
          </svg>
        );
      case 'bass':
        return (
          <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden>
            <rect x="12" y="10" width="8" height="44" fill={stroke} opacity="0.5" />
            <rect x="44" y="10" width="4" height="44" fill={stroke} />
            <rect x="22" y="22" width="12" height="20" fill={fill} stroke={stroke} strokeWidth="2" />
          </svg>
        );
      case 'guitar':
        return (
          <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden>
            <rect x="40" y="8" width="4" height="32" fill={stroke} />
            <path d="M20 26c6-6 14-6 20 0s6 14 0 20-14 6-20 0-6-14 0-20z" fill={fill} stroke={stroke} strokeWidth="3" />
          </svg>
        );
      case 'synth':
        return (
          <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden>
            <rect x="10" y="18" width="44" height="24" rx="4" fill={fill} stroke={stroke} strokeWidth="3" />
            <rect x="14" y="24" width="4" height="12" fill={stroke} />
            <rect x="22" y="24" width="4" height="12" fill={stroke} />
            <rect x="30" y="24" width="4" height="12" fill={stroke} />
            <rect x="38" y="24" width="4" height="12" fill={stroke} />
            <rect x="46" y="24" width="4" height="12" fill={stroke} />
          </svg>
        );
      case 'dj':
        return (
          <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden>
            <circle cx="24" cy="32" r="12" fill={fill} stroke={stroke} strokeWidth="3" />
            <circle cx="40" cy="32" r="12" fill={fill} stroke={stroke} strokeWidth="3" />
            <circle cx="24" cy="32" r="4" fill={stroke} />
            <circle cx="40" cy="32" r="4" fill={stroke} />
          </svg>
        );
      default:
        return (
          <svg width="36" height="36" viewBox="0 0 64 64" aria-hidden>
            <path d="M20 20h24v24H20z" fill={fill} stroke={stroke} strokeWidth="3" />
          </svg>
        );
    }
  };

  const renderRadar = (stats) => {
    const axes = [
      { key: 'skill', label: 'Skill' },
      { key: 'creativity', label: 'Creativity' },
      { key: 'stagePresence', label: 'Stage' },
      { key: 'reliability', label: 'Reliability' }
    ];
    const center = 60;
    const radius = 42;
    const base = 12; // inner padding

    const pointFor = (pct, idx) => {
      const r = base + radius * pct;
      const angle = (-Math.PI / 2) + (idx * (Math.PI * 2) / axes.length);
      const x = center + r * Math.cos(angle);
      const y = center + r * Math.sin(angle);
      return { x, y };
    };

    const ringPoints = (pct) => axes.map((_, idx) => {
      const p = pointFor(pct, idx);
      return `${p.x},${p.y}`;
    }).join(' ');

    const dataPoints = axes.map((entry, idx) => {
      const pct = Math.max(0, Math.min(10, stats?.[entry.key] ?? 0)) / 10;
      const p = pointFor(pct, idx);
      return `${p.x},${p.y}`;
    }).join(' ');

    return (
      <div className="radar-wrap">
        <svg width="240" height="240" viewBox="0 0 120 120" className="radar" aria-hidden>
          <polygon points={ringPoints(1)} fill="#0d1324" stroke="#1f2937" strokeWidth="2" />
          {Array.from({ length: 9 }).map((_, i) => {
            const pct = (i + 1) / 10;
            return (
              <polygon key={pct} points={ringPoints(pct)} fill="none" stroke="#334155" strokeDasharray="3 3" />
            );
          })}
          {axes.map((entry, idx) => {
            const end = pointFor(1, idx);
            return (
              <g key={entry.key}>
                <line x1={center} y1={center} x2={end.x} y2={end.y} stroke="#475569" strokeWidth="1" />
                <text x={end.x} y={end.y} className="radar-label" textAnchor="middle" dominantBaseline="middle">{entry.label}</text>
              </g>
            );
          })}
          <polygon points={dataPoints} fill="rgba(124,58,237,0.32)" stroke="#c084fc" strokeWidth="2.5" />
        </svg>
      </div>
    );
  };

  const logoStyle = useMemo(() => {
    const bg = state.logoGradient
      ? `linear-gradient(135deg, ${state.logoBgColor}, ${state.logoBgColor2 || state.logoBgColor})`
      : state.logoBgColor;
    const shadow = state.logoShadow === 'soft'
      ? '0 2px 6px rgba(0,0,0,0.35)'
      : state.logoShadow === 'strong'
        ? '0 4px 12px rgba(0,0,0,0.5)'
        : 'none';
    const outline = state.logoOutline
      ? `${state.logoOutlineWidth || 1}px ${state.logoOutlineColor || '#000'}`
      : null;
    return {
      background: bg,
      color: state.logoTextColor,
      fontFamily: `'${state.logoFont}', Arial, sans-serif`,
      textTransform: state.logoUpper ? 'uppercase' : 'none',
      fontWeight: state.logoWeight || 700,
      fontSize: `${state.logoSize || 28}px`,
      letterSpacing: `${state.logoLetter || 0}px`,
      lineHeight: state.logoLineHeight || 1.1,
      textShadow: shadow,
      WebkitTextStroke: outline,
      fontVariationSettings: `'wght' ${state.logoWeight || 700}`
    };
  }, [state.logoBgColor, state.logoBgColor2, state.logoGradient, state.logoTextColor, state.logoFont, state.logoUpper, state.logoWeight, state.logoSize, state.logoLetter, state.logoLineHeight, state.logoShadow, state.logoOutline, state.logoOutlineWidth, state.logoOutlineColor]);

  const processWeekEffects = (s) => {
    const baseExpenses = 100;
    const memberSalaries = s.members.length * 50;
    const equipmentCosts = { basic: 20, good: 50, professional: 100 }[s.equipment.instruments] || 20;
    const transportCosts = { none: 0, van: 50, bus: 150, tourBus: 300 }[s.equipment.transport] || 0;
    const staffCosts =
      (s.staffManager === 'dodgy' ? 80 : s.staffManager === 'pro' ? 150 : 0) +
      (s.staffLawyer ? 90 : 0);
    const weeklyExpenses = baseExpenses + memberSalaries + equipmentCosts + transportCosts;

    // Lightweight genre trend system that lasts a few weeks
    let newTrend = s.trend;
    const trendNotes = [];
    if (!newTrend || newTrend.weeks <= 0) {
      if (Math.random() < 0.12) {
        const genre = randomFrom(data?.genres || GENRES);
        newTrend = { genre, modifier: 12 + Math.floor(Math.random() * 6), weeks: 4 + Math.floor(Math.random() * 3) };
        trendNotes.push(`New trend: ${genre} hype for ${newTrend.weeks} weeks (+${newTrend.modifier}% popularity).`);
      }
    } else {
      newTrend = { ...newTrend, weeks: newTrend.weeks - 1 };
      if (newTrend.weeks === 0) {
        trendNotes.push(`${newTrend.genre} trend cooled off.`);
        newTrend = null;
      }
    }

    let totalRoyalty = 0;
    const seasonalBoost = (() => {
      const phase = s.week % 13; // pseudo-season cycle
      if (phase >= 9) return 6; // festival season spike
      if (phase >= 5) return 3; // warm-up buzz
      return 0;
    })();

    const albums = (s.albums || []).map((album) => {
      const age = (album.age || 0) + 1;
      const decay = Math.max(0, 14 - age); // stronger early weeks
      const promo = Math.max(0, (album.promoBoost || 0) - 1);
      const score = Math.max(0, Math.floor(album.quality * 0.8 + decay + promo));
      return { ...album, age, promoBoost: promo, chartScore: score };
    });

    const songs = s.songs.map((song) => {
      const basePopularity = song.popularity ?? Math.floor(song.quality * 0.6);
      const decayed = Math.max(0, basePopularity - 5 + Math.floor(Math.random() * 3));
      const freshness = Math.max(0, 100 - (song.age || 0) * 3);

      const trendBonus = newTrend && song.genre === newTrend.genre ? newTrend.modifier : 0;
      const seasonal = seasonalBoost;
      let popularity = Math.max(0, Math.floor((decayed + freshness) / 2 + trendBonus + seasonal));

      // Rare viral spike
      if (Math.random() < 0.03) {
        popularity = Math.min(100, popularity + 25);
        trendNotes.push(`Viral spike: "${song.title}" jumps in buzz!`);
      }

      const freshnessWeight = Math.max(0, 1 - ((song.age || 0) * 0.05));
      const streamBase = popularity * 60;
      const streamFresh = Math.floor(freshness * 6 * freshnessWeight);
      const streamBonus = song.videoBoost ? 400 : 0;
      const weeklyStreams = Math.max(0, Math.floor(streamBase + streamFresh + streamBonus));
      const streamRevenue = Math.floor(weeklyStreams * 0.004); // ~$0.004 per stream

      const radioPlays = Math.floor(popularity / 12);
      const royalty = radioPlays * 2;
      totalRoyalty += royalty + streamRevenue;
      return {
        ...song,
        popularity,
        age: (song.age || 0) + 1,
        earnings: (song.earnings || 0) + royalty + streamRevenue,
        plays: (song.plays || 0) + radioPlays,
        streams: (song.streams || 0) + weeklyStreams,
        weeklyStreams
      };
    });

    const fameGrowth = Math.floor(s.fame / 10);
    const songBonus = songs.length > 0 ? 5 : 0;
    const fanGrowth = fameGrowth + songBonus;

    // Merchandise sales (unlocks at 50 fame)
    const merchandiseRevenue = s.fame >= 50 ? Math.floor((s.fame * 0.25) + (s.fans * 0.15)) : 0;
    const merchandiseNote = merchandiseRevenue > 0 ? `, merch $${merchandiseRevenue}` : '';

    const summary = [`Week ${s.week}: expenses $${weeklyExpenses}, royalties $${totalRoyalty}${merchandiseNote}, fans +${fanGrowth}`, ...trendNotes].join(' | ');

    return {
      next: {
        ...s,
        albums,
        songs,
        weeklyExpenses: weeklyExpenses + staffCosts,
        money: s.money - (weeklyExpenses + staffCosts) + totalRoyalty + merchandiseRevenue,
        fans: s.fans + fanGrowth,
        totalRevenue: (s.totalRevenue || 0) + totalRoyalty + merchandiseRevenue,
        totalMerchandise: (s.totalMerchandise || 0) + merchandiseRevenue,
        trend: newTrend && newTrend.weeks > 0 ? newTrend : null,
        trainingCooldown: Math.max(0, (s.trainingCooldown || 0) - 1),
        promoteCooldown: Math.max(0, (s.promoteCooldown || 0) - 1),
        tourBan: Math.max(0, (s.tourBan || 0) - 1)
      },
      summary
    };
  };

  const maybeTriggerEvent = (chance) => {
    if (!data?.dramaEvents || !data.dramaEvents.length) return;
    const roll = Math.random();
    if (roll < chance) {
      const pick = data.dramaEvents[Math.floor(Math.random() * data.dramaEvents.length)];
      setCurrentEvent(pick);
      addLog(`Drama: ${pick.title}`);
    }
  };

  const driftRivalsWeekly = () => {
    setRivals((prev) => prev.map((r) => {
      const smallDrift = (Math.random() * 12) - 6; // -6 to +6
      const surge = Math.random() < 0.12 ? Math.random() * 25 : 0;
      const slump = Math.random() < 0.1 ? -(Math.random() * 18) : 0;
      const nextFame = Math.max(20, Math.floor(r.fame + smallDrift + surge + slump));
      return { ...r, fame: nextFame };
    }));
  };

  const dramaChance = useMemo(() => {
    const sizeFactor = Math.min(0.05, Math.max(0, (state.members.length - 2) * 0.02));
    const moraleFactor = state.morale < 40 ? 0.18 : state.morale < 60 ? 0.1 : 0.0;
    const weekFactor = Math.min(0.1, Math.max(0, (state.week - 1) * 0.004));
    const base = 0.18;
    const chance = base + sizeFactor + moraleFactor + weekFactor;
    return Math.min(0.65, Math.max(0.05, chance));
  }, [state.members.length, state.morale, state.week]);

  const riskMeter = useMemo(() => {
    const avgDrama = state.members.length
      ? state.members.reduce((sum, m) => sum + (m.stats?.drama ?? 5), 0) / state.members.length
      : 5;
    const fameHeat = Math.min(0.1, Math.max(0, (state.fame - 80) / 800));
    const moraleDrag = state.morale < 50 ? (50 - state.morale) / 500 : 0;
    const banPressure = state.tourBan > 0 ? 0.04 : 0;
    const base = 0.06 + fameHeat + moraleDrag + banPressure + Math.max(0, (avgDrama - 5) * 0.02);
    const clamped = Math.min(0.28, Math.max(0.02, base));
    return { value: clamped, label: `${Math.round(clamped * 100)}%`, avgDrama: Math.round(avgDrama * 10) / 10 };
  }, [state.members, state.fame, state.morale, state.tourBan]);

  const advanceWeek = (updater, entry, context = 'neutral') => {
    let weeklySummary = null;
    setState((s) => {
      const withWeek = { ...s, week: s.week + 1 };
      const updated = updater(withWeek);
      updated.members = adjustMemberStats(updated.members, updated.morale, context);
      const { next, summary } = processWeekEffects(updated);
      weeklySummary = summary;
      return next;
    });
    if (entry) addLog(entry);
    if (weeklySummary) addLog(weeklySummary);
    driftRivalsWeekly();
    maybeTriggerEvent(dramaChance);
    maybeMemberQuit();
    maybeTroubleEvent();
  };

  const startGame = () => setStep(STEPS.CREATE);
  const toggleRole = (role) => {
    setDesiredRoles((prev) => {
      if (prev.includes(role)) {
        if (prev.length <= 2) return prev; // keep minimum of 2
        return prev.filter((r) => r !== role);
      }
      if (prev.length >= 6) return prev; // cap at 6
      return [...prev, role];
    });
  };

  const addLineupRole = (role) => {
    setDesiredRoles((prev) => {
      if (prev.length >= 6) return prev;
      return [...prev, role];
    });
  };

  const applyLineupPreset = (roles) => {
    setDesiredRoles(roles.slice(0, 6));
  };

  const createBand = () => {
    if (desiredRoles.length < 2) {
      alert('Pick at least 2 band members.');
      return;
    }
    const personalities = data?.memberPersonalities || ['creative', 'technical', 'charismatic', 'rebel'];
    const built = desiredRoles.map((role) => buildMember(role, personalities));
    setState(s => ({
      ...s,
      bandName: s.bandName || 'Your Band',
      members: built,
      log: ['Band formed and ready to rock.']
    }));
    setEditingMemberId(null);
    setStep(STEPS.LOGO);
  };

  const finishLogo = () => setStep(STEPS.GAME);

  const setFont = (font) => {
    ensureFontLoaded(font);
    setState((s) => ({ ...s, logoFont: font }));
  };
  const addFontOption = (fontName) => {
    if (!fontName) return;
    const normalized = fontName.trim();
    if (!normalized) return;
    ensureFontLoaded(normalized);
    setFontOptions((opts) => (opts.includes(normalized) ? opts : [...opts, normalized]));
    setFont(normalized);
  };
  const loadCustomFont = () => {
    addFontOption(customFont);
    setCustomFont('');
  };

  useEffect(() => {
    // Preload initial Google fonts (skip Arial)
    fontOptions.filter((f) => f.toLowerCase() !== 'arial').forEach(ensureFontLoaded);
  }, [fontOptions]);

  const writeSong = () => {
    const studio = STUDIO_TIERS[state.studioTier];
    const cost = studio.recordCost;
    
    if (state.money < cost) {
      setState((s) => ({ ...s, log: [...s.log, `Not enough money to record (need $${cost})`] }));
      return;
    }

    const titles = data?.songTitles || ['New Song'];
    const unusedTitles = titles.filter((t) => !state.songs.find((s) => s.title === t));
    const title = unusedTitles.length
      ? unusedTitles[Math.floor(Math.random() * unusedTitles.length)]
      : titles[Math.floor(Math.random() * titles.length)] + ' (Remix)';
    
    const baseQuality = Math.floor(58 + Math.random() * 26);
    const quality = Math.min(100, baseQuality + studio.qualityBonus);
    const popularity = Math.floor(quality * 0.6) + studio.popBonus;
    
    advanceWeek(
      (s) => ({
        ...s,
        money: s.money - cost,
        songs: [...s.songs, { 
          title, 
          quality, 
          popularity, 
          earnings: 0, 
          plays: 0, 
          age: 0,
          streams: 0,
          weeklyStreams: 0,
          freshness: 80 + studio.freshnessBonus * 10,
          videoBoost: false
        }],
        morale: clampMorale(s.morale + 4)
      }),
      `Laid down "${title}" at ${studio.name}. The track has solid quality (${quality}%) and should get decent radio play. -$${cost}`,
      'write'
    );
  };

  const upgradeStudio = (tierId) => {
    const studio = STUDIO_TIERS[tierId];
    if (state.studioTier >= tierId) {
      setState((s) => ({ ...s, log: [...s.log, `Already own ${studio.name} or better`] }));
      return;
    }
    if (state.money < studio.cost) {
      setState((s) => ({ ...s, log: [...s.log, `Need $${studio.cost} to upgrade to ${studio.name}`] }));
      return;
    }
    setState((s) => ({
      ...s,
      money: s.money - studio.cost,
      studioTier: tierId,
      log: [...s.log, `Upgraded to ${studio.name}! Now recording at ${studio.recordCost}/song`]
    }));
    setShowStudioModal(false);
  };

  const upgradeTransport = (tierId) => {
    const transport = TRANSPORT_TIERS[tierId];
    if (state.transportTier >= tierId) {
      setState((s) => ({ ...s, log: [...s.log, `Already own ${transport.name} or better`] }));
      return;
    }
    if (state.money < transport.cost) {
      setState((s) => ({ ...s, log: [...s.log, `Need $${transport.cost} to upgrade to ${transport.name}`] }));
      return;
    }
    setState((s) => ({
      ...s,
      money: s.money - transport.cost,
      transportTier: tierId,
      log: [...s.log, `Upgraded to ${transport.name}! Gig earnings +${Math.round((transport.gigBonus - 1) * 100)}%`]
    }));
    setShowTransportModal(false);
  };

  const upgradeGear = (tierId) => {
    const gear = GEAR_TIERS[tierId];
    if (state.gearTier >= tierId) {
      setState((s) => ({ ...s, log: [...s.log, `Already own ${gear.name} or better`] }));
      return;
    }
    if (state.money < gear.cost) {
      setState((s) => ({ ...s, log: [...s.log, `Need $${gear.cost} to upgrade to ${gear.name}`] }));
      return;
    }
    setState((s) => ({
      ...s,
      money: s.money - gear.cost,
      gearTier: tierId,
      log: [...s.log, `Upgraded to ${gear.name}! Quality +${gear.qualityBonus}%, Sound +${gear.soundBonus}%, Gig earnings +${Math.round((gear.gigBonus - 1) * 100)}%`]
    }));
    setShowGearModal(false);
  };

  const rehearse = () => {
    const moraleGain = 6;
    const fameGain = Math.floor(Math.random() * 3); // softer fame trickle
    advanceWeek(
      (s) => ({
        ...s,
        morale: clampMorale(s.morale + moraleGain),
        fame: s.fame + fameGain
      }),
      `Rehearsed hard. Morale +${moraleGain}${fameGain ? `, Fame +${fameGain}` : ''}`,
      'rehearse'
    );
  };

  const rest = () => {
    advanceWeek(
      (s) => ({
        ...s,
        morale: clampMorale(s.morale + 10)
      }),
      'Took a breather. Morale +10',
      'rest'
    );
  };

  const bookGig = (venue) => {
    const transport = TRANSPORT_TIERS[state.transportTier];
    const gear = GEAR_TIERS[state.gearTier];
    const basePay = venue.basePay + Math.floor(state.fame * 1.5);
    const transportMultiplier = transport.gigBonus;
    const gearMultiplier = gear.gigBonus;
    const pay = Math.floor(basePay * transportMultiplier * gearMultiplier);
    const fameGain = Math.max(2, Math.floor(venue.capacity / 80) + 3);
    const fanGain = Math.floor(venue.capacity / 28);
    
    // Calculate performance quality based on equipment, morale, and band state
    const equipmentQuality = (state.gearTier * 0.25) + (state.transportTier * 0.1);
    const moraleBonus = Math.max(-1, (state.morale - 50) / 50); // -1 to +1
    const bandQuality = Math.min(1, Math.max(0, equipmentQuality + moraleBonus * 0.2 + Math.random() * 0.2));
    
    // Select description based on performance quality
    let description;
    if (bandQuality > 0.65) {
      description = randomFrom(GIG_SUCCESS_DESCRIPTIONS)(venue, venue.capacity, pay, fameGain);
    } else if (bandQuality > 0.35) {
      description = randomFrom(GIG_OKAY_DESCRIPTIONS)(venue, venue.capacity, pay, fameGain);
    } else {
      description = randomFrom(GIG_POOR_DESCRIPTIONS)(venue, venue.capacity, pay, fameGain);
    }
    
    advanceWeek(
      (s) => ({
        ...s,
        money: s.money + pay,
        fame: s.fame + fameGain,
        morale: clampMorale(s.morale + 4),
        fans: s.fans + fanGain
      }),
      description,
      'gig'
    );
  };

  const resolveEvent = (choice) => {
    const applySpecial = (special) => {
      if (!special) return { money: 0, morale: 0, fame: 0, note: null };
      switch (special) {
        case 'royalties':
          return { money: 300, morale: 5, fame: 5, note: 'Bonus royalties hit your account.' };
        case 'tour':
          return { money: 0, morale: -5, fame: 18, note: 'Tour hype boosts fame over time.' };
        case 'drugUse':
          return { money: 0, morale: -8, fame: 5, note: 'Hangover hurts morale.' };
        case 'drugRefuse':
          return { money: 0, morale: 5, fame: -2, note: 'Clean reputation steadies morale.' };
        case 'drugBuy':
          return { money: -200, morale: 0, fame: 0, note: 'Costly vice, no real upside.' };
        case 'hospitalCare':
          return { money: -200, morale: -6, fame: 0, note: 'Paid hospital bill. Member recovers.' };
        case 'hospitalSkip':
          return { money: 0, morale: -12, fame: -6, note: 'Skipping care hurt your reputation.' };
        case 'rehabPay':
          return { money: -400, morale: -4, fame: 0, note: 'Member in rehab; drama eased.' };
        case 'rehabSkip':
          return { money: 0, morale: -8, fame: -4, note: 'Ignored rehab; drama worsens.' };
        case 'bustedFine':
          return { money: -350, morale: -4, fame: 4, note: 'Paid fine, press coverage boosts notoriety.' };
        case 'bustedFight':
          return { money: -500, morale: -6, fame: 6, note: 'Legal fight; short ban applied.' };
        default:
          return { money: 0, morale: 0, fame: 0, note: null };
      }
    };

    const special = applySpecial(choice.special);
    const memberId = currentEvent?.memberId;

    const adjustMembers = (members) => {
      if (!memberId) return members;
      return members.map((m) => {
        if (m.id !== memberId) return m;
        const stats = { ...m.stats };
        switch (choice.special) {
          case 'hospitalCare':
            stats.drama = clampStat((stats.drama ?? 5) - 0.3);
            stats.reliability = clampStat((stats.reliability ?? 5.5) + 0.1);
            break;
          case 'hospitalSkip':
            stats.reliability = clampStat((stats.reliability ?? 5.5) - 0.4);
            stats.drama = clampStat((stats.drama ?? 5) + 0.2);
            break;
          case 'rehabPay':
            stats.drama = clampStat((stats.drama ?? 5) - 0.8);
            stats.reliability = clampStat((stats.reliability ?? 5.5) + 0.2);
            break;
          case 'rehabSkip':
            stats.drama = clampStat((stats.drama ?? 5) + 0.6);
            stats.reliability = clampStat((stats.reliability ?? 5.5) - 0.2);
            break;
          default:
            break;
        }
        return { ...m, stats };
      });
    };

    setState((s) => ({
      ...s,
      money: s.money + (choice.fineOverride ? -choice.fineOverride : 0) + (choice.money || 0) + (special.money || 0),
      morale: clampMorale(s.morale + (choice.morale || 0) + (special.morale || 0)),
      fame: s.fame + (choice.fame || 0) + (special.fame || 0),
      tourBan: choice.specialBan ? Math.max(s.tourBan || 0, choice.specialBan) : s.tourBan,
      members: adjustMembers(s.members)
    }));

    const logNote = special.note ? ` (${special.note})` : '';
    addLog(`${currentEvent.title}: ${choice.text}${logNote}`);
    setCurrentEvent(null);
  };

  const maybeMemberQuit = () => {
    if (!state.members.length) return;
    const lowMoraleBand = state.morale < 30;
    const candidates = state.members.filter((m) => {
      const personalMorale = m.stats?.morale ?? 5;
      const dramaProne = m.stats?.drama ?? 5;
      const base = lowMoraleBand ? 0.03 : 0.01;
      const moralePenalty = personalMorale < 4 ? (4 - personalMorale) * 0.01 : 0;
      const dramaPenalty = dramaProne > 7 ? (dramaProne - 7) * 0.008 : 0;
      const quitChance = base + moralePenalty + dramaPenalty;
      return Math.random() < quitChance;
    });
    if (candidates.length === 0) return;
    const quitter = candidates[Math.floor(Math.random() * candidates.length)];
    setState((s) => ({ ...s, members: s.members.filter((m) => m.id !== quitter.id) }));
    const personalities = data?.memberPersonalities || ['creative', 'technical', 'charismatic', 'rebel'];
    const options = [
      buildCandidate(randomFrom(ROLE_OPTIONS).key, personalities),
      buildCandidate(randomFrom(ROLE_OPTIONS).key, personalities)
    ];
    setRecruitOptions(options);
    addLog(`${memberDisplayName(quitter)} quit the band due to tension. Two candidates are available to audition.`);
  };

  const maybeTroubleEvent = () => {
    if (!state.members.length) return;
    const avgDrama = state.members.reduce((sum, m) => sum + (m.stats?.drama ?? 5), 0) / state.members.length;
    const lowMorale = state.morale < 40;
    const fameHeat = state.fame > 140 ? 0.05 : 0;
    const base = 0.06 + fameHeat + (lowMorale ? 0.05 : 0) + Math.max(0, (avgDrama - 5) * 0.015);
    const chance = Math.min(0.22, base);
    if (Math.random() >= chance) return;

    const member = randomFrom(state.members);
    const crisisRoll = Math.random();
    if (crisisRoll < 0.5) {
      setCurrentEvent({
        title: 'HOSPITAL RUN',
        titleIcon: Ambulance,
        description: `${memberDisplayName(member)} collapsed after a rough night of partying. The rest of the band found them passed out backstage. Get them proper medical attention ($200), or risk serious backlash and health problems.`,
        memberId: member.id,
        choices: [
          { text: 'Pay Hospital ($200)', money: 0, morale: 0, fame: 0, special: 'hospitalCare' },
          { text: 'Skip the Bill', money: 0, morale: 0, fame: 0, special: 'hospitalSkip' }
        ]
      });
    } else if (crisisRoll < 0.8) {
      setCurrentEvent({
        title: 'REHAB INTERVENTION',
        titleIcon: AlertTriangle,
        description: `${memberDisplayName(member)}'s substance abuse is spiraling out of control. They're missing rehearsals, showing up late to gigs, and the drama is affecting everyone. A close friend suggests professional rehab ($400). It'll cost time and money, but could save the band.`,
        memberId: member.id,
        choices: [
          { text: 'Send to Rehab ($400)', money: 0, morale: 0, fame: 0, special: 'rehabPay' },
          { text: 'Let Them Figure It Out', money: 0, morale: 0, fame: 0, special: 'rehabSkip' }
        ]
      });
    } else {
      const managerFactor = state.staffManager === 'pro' ? 0.9 : state.staffManager === 'dodgy' ? 1.1 : 1;
      const lawyerFactor = state.staffLawyer ? 0.8 : 1;
      const fineFactor = managerFactor * lawyerFactor;
      const banReduce = state.staffLawyer ? 1 : 0;
      const finePay = Math.max(150, Math.round(350 * fineFactor));
      const fineFight = Math.max(200, Math.round(500 * fineFactor));
      setCurrentEvent({
        title: 'BUSTED BY POLICE',
        titleIcon: AlertCircle,
        description: `Vice squad raided the tour van outside a nightclub. Found some controlled substances. The tabloids are already on it. The cops want money NOW. You can pay the fine and move on, or fight it in court—which will be messier but might reduce the ban.`,
        choices: [
          { text: `Pay Fine ($${finePay}) - Quick Resolution`, money: 0, morale: 0, fame: 0, special: 'bustedFine', specialBan: Math.max(0, 1 - banReduce), fineOverride: finePay },
          { text: `Fight in Court ($${fineFight}) - Risky But Defiant`, money: 0, morale: 0, fame: 0, special: 'bustedFight', specialBan: Math.max(0, 2 - banReduce), fineOverride: fineFight }
        ]
      });
    }
  };

  const latestAlbum = useMemo(() => {
    if (!state.albums?.length) return null;
    return [...state.albums].sort((a, b) => (b.week || 0) - (a.week || 0))[0];
  }, [state.albums]);

  const adjustMemberStats = (members, bandMorale, context) => {
    return members.map((m) => {
      const stats = { ...m.stats };
      const moraleNow = stats.morale ?? 5;
      const dramaNow = stats.drama ?? 5;

      // Band morale pulls member morale slightly toward it (normalize band 0-100 to 1-10 scale)
      const bandMoraleScaled = bandMorale / 10;
      const moralePull = (bandMoraleScaled - moraleNow) * 0.12;
      stats.morale = clampStat(moraleNow + moralePull + (context === 'rest' ? 0.4 : 0));

      // Reliability shifts with morale and drama
      const moraleInfluence = (stats.morale - 6) * 0.035;
      const dramaDrag = (dramaNow - 5) * 0.06;
      stats.reliability = clampStat((stats.reliability ?? 5.5) + moraleInfluence - dramaDrag);

      // Contextual boosts
      if (context === 'rehearse') {
        stats.stagePresence = clampStat((stats.stagePresence ?? 5) + 0.2);
        stats.skill = clampStat((stats.skill ?? 5) + 0.08);
      }
      if (context === 'gig') {
        stats.stagePresence = clampStat((stats.stagePresence ?? 5) + 0.3);
        stats.skill = clampStat((stats.skill ?? 5) + 0.12);
        stats.drama = clampStat((stats.drama ?? 5) + 0.1); // gigs can be stressful
      }
      if (context === 'write') {
        stats.creativity = clampStat((stats.creativity ?? 5) + 0.18);
        stats.drama = clampStat((stats.drama ?? 5) + 0.04);
      }
      if (context === 'rest') {
        stats.drama = clampStat((stats.drama ?? 5) - 0.35);
      }

      // Gentle weekly drift to keep it dynamic
      const decay = 0.12;
      stats.stagePresence = clampStat((stats.stagePresence ?? 5) - decay + (Math.random() * 0.26 - 0.1));
      stats.skill = clampStat((stats.skill ?? 5) - decay + (Math.random() * 0.22 - 0.08));
      stats.creativity = clampStat((stats.creativity ?? 5) - 0.08 + (Math.random() * 0.22 - 0.08));
      stats.drama = clampStat((stats.drama ?? 5) - 0.05 + (Math.random() * 0.18 - 0.08));
      stats.reliability = clampStat((stats.reliability ?? 5.5) - 0.07 + (Math.random() * 0.18 - 0.08));

      return { ...m, stats };
    });
  };

  const hireCandidate = (candidate) => {
    setState((s) => {
      if (s.members.length >= 6) return s;
      return { ...s, members: [...s.members, candidate] };
    });
    setRecruitOptions([]);
    addLog(`Hired ${memberDisplayName(candidate)} as ${candidate.role}.`);
  };

  const skipRecruit = () => {
    setRecruitOptions([]);
    addLog('Skipped recruiting new members this week.');
  };

  const updateMember = (id, updates) => {
    setState((s) => ({
      ...s,
      members: s.members.map((m) => {
        if (m.id !== id) return m;
        const next = { ...m, ...updates };
        next.name = `${next.firstName} ${next.lastName}`;
        return next;
      })
    }));
  };

  const removeMember = (id) => {
    setState((s) => {
      if (s.members.length <= 2) return s;
      return { ...s, members: s.members.filter((m) => m.id !== id) };
    });
    if (editingMemberId === id) setEditingMemberId(null);
  };

  const addMember = () => {
    setState((s) => {
      if (s.members.length >= 6) return s;
      const personalities = data?.memberPersonalities || ['creative', 'technical', 'charismatic', 'rebel'];
      const nextRole = ROLE_OPTIONS.find((r) => !s.members.some((m) => m.role === r.key))?.key || 'vocals';
      return { ...s, members: [...s.members, buildMember(nextRole, personalities)] };
    });
  };

  if (loading) return <div className="screen"><p>Loading game data...</p></div>;
  if (error) return <div className="screen"><p>Error loading data: {error.message}</p></div>;

  return (
    <div className="app">
      <header className="header">
        <h1 style={logoStyle}>{state.bandName || 'Rockstar Band Manager'}</h1>
        <p className="subtitle">Welcome → Band → Logo → Game</p>
      </header>

      {step === STEPS.WELCOME && (
        <section className="screen card">
          <h2>Welcome</h2>
          <p>Create your band, design your logo, and hit the stage.</p>
          
          <button className="btn" onClick={startGame}>Start New Game</button>
        </section>
      )}

      {step === STEPS.CREATE && (
        <section className="screen card">
          <h2>Band Creation</h2>
          <label>Band Name</label>
          <input
            value={state.bandName}
            onChange={(e) => setState({ ...state, bandName: e.target.value })}
            placeholder="Enter band name"
          />
          <label>Genre</label>
          <select value={state.genre} onChange={(e) => {
            const newGenre = e.target.value;
            const newTheme = GENRE_THEMES[newGenre] || 'theme-modern';
            setState({ ...state, genre: newGenre });
            setTheme(newTheme);
          }}>
            {(data?.genres || GENRES).map(g => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <div className="card" style={{ marginTop: 8 }}>
            <h3>Band Setup (2-6)</h3>
            <p style={{ color: '#94a3b8' }}>Click to toggle roles. Current count: {desiredRoles.length}</p>
            <div className="role-grid">
              {ROLE_OPTIONS.map((role) => {
                const active = desiredRoles.includes(role.key);
                return (
                  <button
                    key={role.key}
                    className={`btn role-btn ${active ? 'active' : ''}`}
                    onClick={() => toggleRole(role.key)}
                    type="button"
                  >
                    {role.label}
                  </button>
                );
              })}
            </div>
            <div className="preset-row">
              <select value={lineupAddRole} onChange={(e) => setLineupAddRole(e.target.value)} style={{ maxWidth: 200 }}>
                {ROLE_OPTIONS.map((r) => <option key={r.key} value={r.key}>{r.label}</option>)}
              </select>
              <button className="btn" type="button" onClick={() => addLineupRole(lineupAddRole)} disabled={desiredRoles.length >= 6}>Add Slot</button>
              <span style={{ color: '#94a3b8', fontSize: 12 }}>Duplicates allowed (e.g., dual vocals)</span>
            </div>
            <div className="preset-row">
              <span>Presets:</span>
              <div className="preset-buttons">
                <button className="btn" onClick={() => applyLineupPreset(['vocals','guitar','bass','drums'])} type="button">Rock 4-piece</button>
                <button className="btn" onClick={() => applyLineupPreset(['vocals','vocals','synth','dj'])} type="button">Dual Vox + DJ</button>
                <button className="btn" onClick={() => applyLineupPreset(['vocals','guitar','synth','bass','drums'])} type="button">Electro Band</button>
                <button className="btn" onClick={() => applyLineupPreset(['vocals','vocals','guitar','bass','drums','synth'])} type="button">Big 6-piece</button>
              </div>
            </div>
          </div>
          <button className="btn" onClick={createBand}>Create Band & Design Logo</button>
        </section>
      )}

      {step === STEPS.LOGO && (
        <section className="screen card">
          <h2>Logo Designer</h2>
          <div className="logo-preview" style={logoStyle}>{state.bandName || 'Your Band'}</div>
          <div className="card" style={{ marginBottom: 12 }}>
            <h3>Logo Designer</h3>
            <div className="grid" style={{ marginBottom: 8 }}>
              <div className="mini-card">
                <p><strong>Font</strong></p>
                <select
                  value={state.logoFont}
                  onChange={(e) => setFont(e.target.value)}
                  style={{ width: '100%', marginBottom: 6 }}
                >
                  {fontOptions.map((font) => (
                    <option key={font} value={font} style={{ fontFamily: `'${font}', Arial` }}>
                      {font}
                    </option>
                  ))}
                </select>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12 }}>
                  <label>Weight</label>
                  <select value={state.logoWeight || 700} onChange={(e) => setState((s) => ({ ...s, logoWeight: Number(e.target.value) }))}>
                    {[400,500,600,700,800,900].map((w) => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, marginTop: 6 }}>
                  <label>Size</label>
                  <input type="range" min="18" max="72" value={state.logoSize || 32} onChange={(e) => setState((s) => ({ ...s, logoSize: Number(e.target.value) }))} />
                  <span>{state.logoSize || 32}px</span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, marginTop: 6 }}>
                  <label>Letter</label>
                  <input type="range" min="-2" max="12" step="0.5" value={state.logoLetter || 0} onChange={(e) => setState((s) => ({ ...s, logoLetter: Number(e.target.value) }))} />
                  <span>{state.logoLetter || 0}px</span>
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, marginTop: 6 }}>
                  <label>Line</label>
                  <input type="range" min="0.8" max="1.6" step="0.05" value={state.logoLineHeight || 1.1} onChange={(e) => setState((s) => ({ ...s, logoLineHeight: Number(e.target.value) }))} />
                  <span>{state.logoLineHeight || 1.1}</span>
                </div>
                <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, marginTop: 6 }}>
                  <input type="checkbox" checked={!!state.logoUpper} onChange={(e) => setState((s) => ({ ...s, logoUpper: e.target.checked }))} />
                  Uppercase
                </label>
              </div>
              <div className="mini-card">
                <p><strong>Colors</strong></p>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12 }}>
                  <span>Text</span>
                  <input type="color" value={state.logoTextColor} onChange={(e) => setState((s) => ({ ...s, logoTextColor: e.target.value }))} />
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, marginTop: 6 }}>
                  <span>Background</span>
                  <input type="color" value={state.logoBgColor} onChange={(e) => setState((s) => ({ ...s, logoBgColor: e.target.value }))} />
                </div>
                <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, marginTop: 6 }}>
                  <input type="checkbox" checked={!!state.logoGradient} onChange={(e) => setState((s) => ({ ...s, logoGradient: e.target.checked }))} />
                  Gradient
                </label>
                {state.logoGradient && (
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, marginTop: 6 }}>
                    <span>To</span>
                    <input type="color" value={state.logoBgColor2 || '#1e293b'} onChange={(e) => setState((s) => ({ ...s, logoBgColor2: e.target.value }))} />
                  </div>
                )}
              </div>
              <div className="mini-card">
                <p><strong>Effects</strong></p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['none','soft','strong'].map((sfx) => (
                    <button key={sfx} className="btn" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => setState((s) => ({ ...s, logoShadow: sfx }))}>
                      Shadow: {sfx}
                    </button>
                  ))}
                </div>
                <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, marginTop: 6 }}>
                  <input type="checkbox" checked={!!state.logoOutline} onChange={(e) => setState((s) => ({ ...s, logoOutline: e.target.checked }))} />
                  Outline
                </label>
                {state.logoOutline && (
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, marginTop: 6 }}>
                    <span>Width</span>
                    <input type="range" min="0" max="4" step="0.2" value={state.logoOutlineWidth || 1} onChange={(e) => setState((s) => ({ ...s, logoOutlineWidth: Number(e.target.value) }))} />
                    <span>{state.logoOutlineWidth || 1}px</span>
                    <input type="color" value={state.logoOutlineColor || '#000000'} onChange={(e) => setState((s) => ({ ...s, logoOutlineColor: e.target.value }))} />
                  </div>
                )}
              </div>
              <div className="mini-card">
                <p><strong>Add Google Font</strong></p>
                <input
                  value={customFont}
                  onChange={(e) => setCustomFont(e.target.value)}
                  placeholder="Type any Google font name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      loadCustomFont();
                    }
                  }}
                />
                <button className="btn" onClick={loadCustomFont}>Add & Use</button>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  {['Inter','Roboto','Space Grotesk','Playfair Display','Press Start 2P','Poppins','Fira Sans','Kanit'].map((f) => (
                    <button key={f} className="btn" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => addFontOption(f)}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
              {[
                { name: 'Bold Neon', cfg: { logoWeight: 800, logoSize: 36, logoTextColor: '#f472b6', logoBgColor: '#111827', logoShadow: 'strong', logoUpper: true, logoLetter: 1 } },
                { name: 'Retro Wave', cfg: { logoWeight: 700, logoSize: 32, logoTextColor: '#7dd3fc', logoBgColor: '#0f172a', logoBgColor2: '#312e81', logoGradient: true, logoShadow: 'soft', logoLetter: 2 } },
                { name: 'Clean Sans', cfg: { logoWeight: 600, logoSize: 28, logoTextColor: '#e2e8f0', logoBgColor: '#0b1220', logoShadow: 'none', logoLetter: 0, logoUpper: false } },
                { name: 'Outline Pop', cfg: { logoWeight: 800, logoSize: 34, logoTextColor: '#ffffff', logoBgColor: '#0f172a', logoShadow: 'soft', logoOutline: true, logoOutlineColor: '#0ea5e9', logoOutlineWidth: 1.5 } },
                { name: 'Serif Luxe', cfg: { logoWeight: 700, logoSize: 30, logoTextColor: '#fef3c7', logoBgColor: '#111827', logoShadow: 'soft', logoUpper: false, logoLetter: 0.5 } }
              ].map((tpl) => (
                <button
                  key={tpl.name}
                  className="btn"
                  style={{ padding: '8px 12px', fontSize: '12px' }}
                  onClick={() => setState((s) => ({ ...s, ...tpl.cfg }))}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>
          <button className="btn" onClick={finishLogo}>Finish Logo & Start Career</button>
        </section>
      )}

      {step === STEPS.GAME && (
        <section className="screen">
          <div className="main-layout">
            <aside className="sidebar">
              {/* Left Sidebar Tabs */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {[
                  { id: 'snapshot', label: 'Snapshot', icon: Activity },
                  { id: 'meters', label: 'Meters', icon: BarChart3 },
                  { id: 'team', label: 'Team', icon: Users },
                  { id: 'songs', label: 'Songs', icon: ListMusic }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setLeftTab(tab.id)}
                    style={{
                      flex: 1,
                      minWidth: '70px',
                      padding: '6px 8px',
                      border: 'none',
                      background: leftTab === tab.id ? '#1e40af' : '#334155',
                      color: '#fff',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      fontSize: '0.75em',
                      fontWeight: leftTab === tab.id ? 'bold' : 'normal',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <tab.icon size={12} />
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* SNAPSHOT TAB */}
              {leftTab === 'snapshot' && (
                <div className="card">
                  <h2>Band Snapshot</h2>
                  <p>{state.bandName} • {state.genre}</p>
                  <div className="sidebar-stats">
                    <div><span>Week</span><strong>{state.week}</strong></div>
                    <div><span>Money</span><strong>${state.money}</strong></div>
                    <div><span>Fame</span><strong>{state.fame}</strong></div>
                    <div><span>Fans</span><strong>{state.fans}</strong></div>
                    <div><span>Morale</span><strong>{state.morale}%</strong></div>
                    <div><span>Expenses</span><strong>${state.weeklyExpenses}</strong></div>
                    <div><span>Staff</span><strong>{state.staffManager !== 'none' ? `${state.staffManager} mgr` : 'none'}{state.staffLawyer ? ' + lawyer' : ''}</strong></div>
                    <div><span>Transport</span><strong>{TRANSPORT_TIERS[state.transportTier].name}</strong></div>
                    <div><span>Studio</span><strong>{STUDIO_TIERS[state.studioTier].name}</strong></div>
                    {state.fame >= 50 && (
                      <div style={{ gridColumn: '1 / -1', background: '#064e3b', borderColor: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign size={12} /> Merch Sales</span>
                        <strong>${Math.floor((state.fame * 0.25) + (state.fans * 0.15))}/wk</strong>
                      </div>
                    )}
                    {state.fame >= 45 && state.fame < 50 && (
                      <div style={{ gridColumn: '1 / -1', background: '#422006', borderColor: '#fbbf24', fontSize: '0.85em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>🎯 Unlock at 50 fame!</span>
                        <strong>{state.fame}/50</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* METERS TAB */}
              {leftTab === 'meters' && (
                <>
                  <div className="card">
                    <h3>Drama Meter</h3>
                    <p style={{ color: '#94a3b8', marginTop: -4 }}>Chance of a drama event this week.</p>
                    <div className="meter">
                      <div className="meter-fill" style={{ width: `${Math.round(dramaChance * 100)}%` }} />
                    </div>
                    <p style={{ fontWeight: 700 }}>{Math.round(dramaChance * 100)}% chance</p>
                    <p style={{ color: '#94a3b8', fontSize: 12 }}>Low morale and bigger bands increase drama.</p>
                  </div>
                  <div className="card">
                    <h3>Risk Meter</h3>
                    <p style={{ color: '#94a3b8', marginTop: -4 }}>Trouble odds (hospital/rehab/busted).</p>
                    <div className="meter">
                      <div className="meter-fill" style={{ width: `${Math.round(riskMeter.value * 100)}%`, background: '#f97316' }} />
                    </div>
                    <p style={{ fontWeight: 700 }}>{riskMeter.label} risk • Avg drama {riskMeter.avgDrama}</p>
                    <p style={{ color: '#94a3b8', fontSize: 12 }}>Higher drama, fame heat, and low morale raise risk.</p>
                  </div>
                </>
              )}
              
              {/* TEAM TAB */}
              {leftTab === 'team' && (
                <>
                  <div className="card">
                    <h3>Staffing</h3>
                    <p style={{ color: '#94a3b8', marginTop: -4 }}>Hire help; increases weekly expenses.</p>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
                      <div>
                        <p><strong>Manager</strong></p>
                        <button className="btn btn-small" onClick={() => setState((s) => ({ ...s, staffManager: 'none' }))} disabled={state.staffManager === 'none'}>None</button>
                        <button className="btn btn-small" onClick={() => setState((s) => ({ ...s, staffManager: 'dodgy' }))} disabled={state.staffManager === 'dodgy'}>Dodgy ($80/wk)</button>
                        <button className="btn btn-small" onClick={() => setState((s) => ({ ...s, staffManager: 'pro' }))} disabled={state.staffManager === 'pro'}>Pro ($150/wk)</button>
                      </div>
                      <div>
                        <p><strong>Lawyer</strong></p>
                        <button className="btn btn-small" onClick={() => setState((s) => ({ ...s, staffLawyer: false }))} disabled={!state.staffLawyer}>None</button>
                        <button className="btn btn-small" onClick={() => setState((s) => ({ ...s, staffLawyer: true }))} disabled={state.staffLawyer}>Hire ($90/wk)</button>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <h3>Band Members</h3>
                    <div className="member-actions">
                      <button className="btn" onClick={addMember} disabled={state.members.length >= 6}>Add Member</button>
                      <span style={{ color: '#94a3b8', fontSize: 12 }}>2-6 members • click a card to edit</span>
                    </div>
                    <div className="members members-cards">
                      {state.members.map((m) => {
                        const editing = editingMemberId === m.id;
                        const roleLabel = ROLE_OPTIONS.find((r) => r.key === m.role)?.label || m.role;
                        return (
                          <div
                            key={m.id}
                            className={`member-card ${editing ? 'editing' : ''}`}
                            onClick={() => setEditingMemberId(editing ? null : m.id)}
                          >
                            <div className="member-top">
                              <div className="instrument-icon">{renderInstrumentIcon(m.role)}</div>
                              <div>
                                <div className="member-name">{memberDisplayName(m)}</div>
                                <div className="member-role">{roleLabel} • {m.personality}</div>
                              </div>
                            </div>
                            <div className="member-radar">{renderRadar(m.stats || {})}</div>
                            {editing && (
                              <div className="member-edit" onClick={(e) => e.stopPropagation()}>
                                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}>
                                  <div>
                                    <label>First</label>
                                    <input value={m.firstName} onChange={(e) => updateMember(m.id, { firstName: e.target.value })} />
                                  </div>
                                  <div>
                                    <label>Last</label>
                                    <input value={m.lastName} onChange={(e) => updateMember(m.id, { lastName: e.target.value })} />
                                  </div>
                                  <div>
                                    <label>Nickname</label>
                                    <input value={m.nickname} onChange={(e) => updateMember(m.id, { nickname: e.target.value })} placeholder="Optional" />
                                  </div>
                                  <div>
                                    <label>Instrument</label>
                                    <select value={m.role} onChange={(e) => updateMember(m.id, { role: e.target.value })}>
                                      {ROLE_OPTIONS.map((r) => (
                                        <option key={r.key} value={r.key}>{r.label}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="member-edit-actions">
                                  <button className="btn" onClick={() => setEditingMemberId(null)}>Done</button>
                                  <button className="btn danger" onClick={() => removeMember(m.id)} disabled={state.members.length <= 2}>Remove</button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
              
              {/* SONGS TAB */}
              {leftTab === 'songs' && (
                <div className="card">
                  <h3>Your Songs</h3>
                  {state.songs.length === 0 && <p>No songs yet. Write something!</p>}
                  {state.songs.length > 0 && (
                    <div className="members">
                      {[...state.songs].sort((a,b) => (b.popularity||0) - (a.popularity||0)).map((s) => (
                        <div key={s.title} className="member">
                          <div><strong>{s.title}</strong></div>
                          <div style={{ fontSize: 12, color: '#94a3b8' }}>
                            Q{Math.round(s.quality)} • Pop {s.popularity || 0} • Age {s.age || 0}w • Streams {s.streams || 0} (wk {s.weeklyStreams || 0}) • Plays {s.plays || 0}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </aside>

            <div className="center-column">
              <div className="card" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', borderBottom: '1px solid #334155', paddingBottom: '12px' }}>
                  {[
                    { id: 'overview', label: 'Overview', icon: Activity },
                    { id: 'actions', label: 'Actions', icon: Zap },
                    { id: 'music', label: 'Music', icon: Music },
                    { id: 'gigs', label: 'Gigs', icon: Mic },
                    { id: 'upgrades', label: 'Upgrades', icon: Gem },
                    { id: 'log', label: 'Log', icon: FileText }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setCurrentTab(tab.id)}
                      style={{
                        padding: '8px 12px',
                        border: 'none',
                        background: currentTab === tab.id ? '#1e40af' : '#334155',
                        color: '#fff',
                        cursor: 'pointer',
                        borderRadius: '4px',
                        fontSize: '0.9em',
                        fontWeight: currentTab === tab.id ? 'bold' : 'normal',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <tab.icon size={16} />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* OVERVIEW TAB */}
              {currentTab === 'overview' && (
                <>
                  <div className="stats">
                    <div className="stat">Money: ${state.money}</div>
                    <div className="stat">Fame: {state.fame}</div>
                    <div className="stat">Morale: {state.morale}%</div>
                    <div className="stat">Fans: {state.fans}</div>
                    <div className="stat">Week: {state.week}</div>
                    <div className="stat">Weekly Expenses: ${state.weeklyExpenses}</div>
                    {state.totalMerchandise > 0 && (
                      <div className="stat" style={{ background: '#064e3b', borderColor: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <DollarSign size={16} /> Merch: ${state.totalMerchandise} total
                      </div>
                    )}
                  </div>
                  <div className="card">
                    <h2>Upgrades Summary</h2>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
                      <div style={{ padding: '12px', background: '#1e293b', borderRadius: '4px', border: '1px solid #334155' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.9em', display: 'flex', alignItems: 'center', gap: '6px' }}><Radio size={14} /> Studio</p>
                        <p style={{ fontWeight: 'bold' }}>{STUDIO_TIERS[state.studioTier].name}</p>
                        <p style={{ fontSize: '0.85em', color: '#94a3b8' }}>Quality +{STUDIO_TIERS[state.studioTier].qualityBonus}%</p>
                      </div>
                      <div style={{ padding: '12px', background: '#1e293b', borderRadius: '4px', border: '1px solid #334155' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.9em', display: 'flex', alignItems: 'center', gap: '6px' }}><TrendingUp size={14} /> Transport</p>
                        <p style={{ fontWeight: 'bold' }}>{TRANSPORT_TIERS[state.transportTier].name}</p>
                        <p style={{ fontSize: '0.85em', color: '#94a3b8' }}>Earnings ×{TRANSPORT_TIERS[state.transportTier].gigBonus.toFixed(2)}</p>
                      </div>
                      <div style={{ padding: '12px', background: '#1e293b', borderRadius: '4px', border: '1px solid #334155' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.9em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {React.createElement(GEAR_TIERS[state.gearTier].icon, { size: 14 })} Gear
                        </p>
                        <p style={{ fontWeight: 'bold' }}>{GEAR_TIERS[state.gearTier].name}</p>
                        <p style={{ fontSize: '0.85em', color: '#94a3b8' }}>Earnings ×{GEAR_TIERS[state.gearTier].gigBonus.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card">
                    <h2>Band Status</h2>
                    <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                      <div>
                        <p><strong>Members:</strong> {state.members.length} / 6</p>
                        <p><strong>Songs:</strong> {state.songs.length}</p>
                        <p><strong>Manager:</strong> {state.staffManager !== 'none' ? `${state.staffManager} (${state.staffManager === 'dodgy' ? '$80' : '$150'}/wk)` : 'None'}</p>
                      </div>
                      <div>
                        <p><strong>Lawyer:</strong> {state.staffLawyer ? 'Yes ($90/wk)' : 'No'}</p>
                        <p><strong>Albums:</strong> {(state.albums || []).length}</p>
                        <p><strong>Tour Ban:</strong> {state.tourBan > 0 ? `${state.tourBan} week(s)` : 'None'}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ACTIONS TAB */}
              {currentTab === 'actions' && (
                <div className="card">
                  <h2>Weekly Actions</h2>
                  <div className="grid">
                    <div className="mini-card">
                      <h3>Record Song</h3>
                      <p>Record at {STUDIO_TIERS[state.studioTier].name}</p>
                      <p style={{ fontSize: '0.85em', color: '#94a3b8' }}>Cost: ${STUDIO_TIERS[state.studioTier].recordCost} | Quality +{STUDIO_TIERS[state.studioTier].qualityBonus}</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn" onClick={writeSong} style={{ flex: 1 }}>Record</button>
                        <button className="btn-secondary" onClick={() => setShowStudioModal(true)}>Studios</button>
                      </div>
                    </div>
                    <div className="mini-card">
                      <h3>Rehearse</h3>
                      <p>Sharpen performance. Small fame bump.</p>
                      <button className="btn" onClick={rehearse}>Rehearse</button>
                    </div>
                    <div className="mini-card">
                      <h3>Rest</h3>
                      <p>Recover morale to keep the band happy.</p>
                      <button className="btn" onClick={rest}>Rest</button>
                    </div>
                    <div className="mini-card">
                      <h3>Training</h3>
                      <p>Paid coaching gives a modest bump to one stat across the band. No back-to-back weeks.</p>
                      <select onChange={(e) => setState((s) => ({ ...s, trainingFocus: e.target.value }))} value={state.trainingFocus || 'stagePresence'}>
                        <option value="stagePresence">Stage</option>
                        <option value="skill">Skill</option>
                        <option value="creativity">Creativity</option>
                        <option value="reliability">Reliability</option>
                      </select>
                      <button className="btn" onClick={() => {
                        if (state.trainingCooldown > 0) return;
                        const focus = state.trainingFocus || 'stagePresence';
                        const baseCost = 220 + Math.max(0, state.members.length - 3) * 35;
                        advanceWeek(
                          (s) => ({
                            ...s,
                            money: s.money - baseCost,
                            trainingCooldown: 2,
                            members: s.members.map((m) => {
                              const current = m.stats?.[focus] ?? 5;
                              const diminishing = Math.max(0.05, 0.26 - current * 0.025);
                              return {
                                ...m,
                                stats: { ...m.stats, [focus]: clampStat(current + diminishing) }
                              };
                            })
                          }),
                          `Training focused on ${focus}. Cost $${baseCost}. Diminishing gains at higher stats.`,
                          'train'
                        );
                      }} disabled={state.trainingCooldown > 0}>
                        {state.trainingCooldown > 0 ? `Cooldown (${state.trainingCooldown}w)` : 'Train'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MUSIC TAB */}
              {currentTab === 'music' && (
                <>
                  <div className="card">
                    <h2>Your Songs</h2>
                    {state.songs.length === 0 && <p>No songs yet. Record something in the Actions tab!</p>}
                    {state.songs.length > 0 && (
                      <div className="members">
                        {[...state.songs].sort((a,b) => (b.popularity||0) - (a.popularity||0)).map((s) => (
                          <div key={s.title} className="member">
                            <div><strong>{s.title}</strong></div>
                            <div style={{ fontSize: 12, color: '#94a3b8' }}>
                              Q{Math.round(s.quality)} • Pop {s.popularity || 0} • Age {s.age || 0}w • Streams {s.streams || 0} (wk {s.weeklyStreams || 0}) • Plays {s.plays || 0}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="card">
                    <h2>Music Promotion</h2>
                    <div className="grid">
                      <div className="mini-card">
                        <h3>Promote Single</h3>
                        <p>Light promotion nudges your strongest song forward. No back-to-back runs.</p>
                        <button className="btn" onClick={() => {
                          const top = state.songs[0];
                          if (!top || state.promoteCooldown > 0) return;
                          advanceWeek(
                            (s) => {
                              const boosted = [...s.songs].sort((a,b) => (b.popularity||0) - (a.popularity||0));
                              if (boosted.length) {
                                const currentPop = boosted[0].popularity || 0;
                                const popGain = Math.max(3, Math.round(10 - currentPop * 0.05));
                                boosted[0] = {
                                  ...boosted[0],
                                  popularity: Math.min(100, currentPop + popGain),
                                  age: Math.max(0, (boosted[0].age || 0) - 0.5)
                                };
                              }
                              const promoCost = 170 + Math.max(0, boosted.length - 3) * 18;
                              return { ...s, songs: boosted, money: s.money - promoCost, fame: s.fame + 1, promoteCooldown: 2 };
                            },
                            'Promoted your top single. Smaller bump with diminishing returns and a cooldown.',
                            'promote'
                          );
                        }} disabled={!state.songs.length || state.promoteCooldown > 0}>
                          {state.promoteCooldown > 0 ? `Cooldown (${state.promoteCooldown}w)` : 'Promote'}
                        </button>
                      </div>
                      <div className="mini-card">
                        <h3>Music Video</h3>
                        <p>Film a video for your top single to slow decay.</p>
                        <button className="btn" onClick={() => {
                          if (!state.songs.length) return;
                          const cost = 400;
                          advanceWeek(
                            (s) => {
                              const songs = [...s.songs].sort((a,b) => (b.popularity||0) - (a.popularity||0));
                              if (songs.length) {
                                songs[0] = { ...songs[0], popularity: Math.min(100, (songs[0].popularity || 0) + 10), age: Math.max(0, (songs[0].age || 0) - 1), videoBoost: true };
                              }
                              const albums = [...(s.albums || [])];
                              if (albums.length) {
                                const latest = [...albums].sort((a,b) => (b.week||0) - (a.week||0))[0];
                                latest.promoBoost = Math.min(18, (latest.promoBoost || 0) + 6);
                              }
                              return { ...s, songs, albums, money: s.money - cost, fame: s.fame + 4 };
                            },
                            'Shot a music video: top single gains popularity and freshness. +$400 cost, +4 fame.',
                            'video'
                          );
                        }} disabled={!state.songs.length}>
                          Shoot Video (-$400)
                        </button>
                      </div>
                      <div className="mini-card">
                        <h3>Media Push</h3>
                        <p>Climb the media ladder (radio → TV → satellite).</p>
                        <select value={state.mediaTier || 'tinpot'} onChange={(e) => setState((s) => ({ ...s, mediaTier: e.target.value }))}>
                          <option value="tinpot">Radio Tinpot (cost $120, fame +3, fans +40)</option>
                          <option value="regional">Regional Radio Tour (cost $260, fame +6, fans +120)</option>
                          <option value="tv">National TV (cost $520, fame +12, fans +260)</option>
                          <option value="satellite">World Satellite (cost $900, fame +20, fans +420)</option>
                        </select>
                        <button className="btn" onClick={() => {
                          const tier = state.mediaTier || 'tinpot';
                          const cfg = {
                            tinpot: { cost: 120, fame: 3, fans: 40, req: 0 },
                            regional: { cost: 260, fame: 6, fans: 120, req: 50 },
                            tv: { cost: 520, fame: 12, fans: 260, req: 120 },
                            satellite: { cost: 900, fame: 20, fans: 420, req: 220 }
                          }[tier];
                          if (!cfg) return;
                          if (state.fame < cfg.req) {
                            alert(`Need ${cfg.req} fame for this tier.`);
                            return;
                          }
                          advanceWeek(
                            (s) => ({
                              ...s,
                              money: s.money - cfg.cost,
                              fame: s.fame + cfg.fame,
                              fans: s.fans + cfg.fans,
                              songs: s.songs.map((song, idx) => idx === 0 ? { ...song, popularity: Math.min(100, (song.popularity || 0) + Math.ceil(cfg.fame / 2)) } : song)
                            }),
                            `${tier === 'tinpot' ? 'Radio Tinpot' : tier === 'regional' ? 'Regional radio' : tier === 'tv' ? 'National TV' : 'World Satellite'} push: +${cfg.fame} fame, +${cfg.fans} fans, top song boosted.`
                          );
                        }}>
                          Run Push
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* GIGS TAB */}
              {currentTab === 'gigs' && (
                <>
                  <div className="card">
                    <h2>Book Gig</h2>
                    <p style={{ fontSize: '0.85em', color: '#94a3b8' }}>Transport: {TRANSPORT_TIERS[state.transportTier].name} • Gear: {GEAR_TIERS[state.gearTier].name}</p>
                    {state.tourBan > 0 && <p style={{ color: '#f97316' }}>Gig booking locked for {state.tourBan} week(s) after a bust.</p>}
                    {availableVenues.length === 0 && <p>No venues yet. Build fame!</p>}
                    {availableVenues.length > 0 && (
                      <>
                        <select
                          value={selectedVenue?.name || ''}
                          onChange={(e) => {
                            const v = availableVenues.find((vn) => vn.name === e.target.value);
                            setSelectedVenue(v || null);
                          }}
                        >
                          {availableVenues.map((v) => {
                            const transport = TRANSPORT_TIERS[state.transportTier];
                            const gear = GEAR_TIERS[state.gearTier];
                            const basePay = v.basePay + Math.floor(state.fame * 1.5);
                            const finalPay = Math.floor(basePay * transport.gigBonus * gear.gigBonus);
                            return (
                              <option key={v.name} value={v.name}>
                                {v.name} — ${finalPay} ({transport.name} ×{transport.gigBonus.toFixed(2)} × {gear.name} ×{gear.gigBonus.toFixed(2)})
                              </option>
                            );
                          })}
                        </select>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <button className="btn" onClick={() => selectedVenue && bookGig(selectedVenue)} disabled={!selectedVenue || state.tourBan > 0} style={{ flex: 1 }}>
                            Play Gig
                          </button>
                          <button className="btn-secondary" onClick={() => setShowTransportModal(true)}>Transport</button>
                          <button className="btn-secondary" onClick={() => setShowGearModal(true)}>Gear</button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="card">
                    <h2>Available Venues</h2>
                    {availableVenues.length === 0 && <p>No venues yet. Build fame!</p>}
                    <div className="grid">
                      {availableVenues.map((v) => (
                        <div key={v.name} className="mini-card">
                          <h3>{v.name}</h3>
                          <p>{v.size} • Cap: {v.capacity}</p>
                          <p>Pay: ${v.basePay + Math.floor(state.fame * 2)}</p>
                          <button className="btn" onClick={() => bookGig(v)}>Book Gig</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* UPGRADES TAB */}
              {currentTab === 'upgrades' && (
                <div className="card">
                  <h2>Upgrade Summary</h2>
                  <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Click any category to open the upgrade shop.</p>
                  <div className="grid">
                    <button 
                      className="mini-card"
                      onClick={() => setShowStudioModal(true)}
                      style={{ cursor: 'pointer', border: '2px solid #10b981', background: '#064e3b' }}
                    >
                      <h3>🎙️ Recording Studios</h3>
                      <p><strong>Current:</strong> {STUDIO_TIERS[state.studioTier].name}</p>
                      <p style={{ fontSize: '0.85em', color: '#94a3b8' }}>Quality +{STUDIO_TIERS[state.studioTier].qualityBonus}% • Record cost ${STUDIO_TIERS[state.studioTier].recordCost}</p>
                    </button>
                    <button 
                      className="mini-card"
                      onClick={() => setShowTransportModal(true)}
                      style={{ cursor: 'pointer', border: '2px solid #3b82f6', background: '#1e3a8a' }}
                    >
                      <h3>🚐 Transportation</h3>
                      <p><strong>Current:</strong> {TRANSPORT_TIERS[state.transportTier].name}</p>
                      <p style={{ fontSize: '0.85em', color: '#94a3b8' }}>Earnings ×{TRANSPORT_TIERS[state.transportTier].gigBonus.toFixed(2)} • Capacity ×{TRANSPORT_TIERS[state.transportTier].venueMult.toFixed(2)}</p>
                    </button>
                    <button 
                      className="mini-card"
                      onClick={() => setShowGearModal(true)}
                      style={{ cursor: 'pointer', border: '2px solid #a855f7', background: '#581c87' }}
                    >
                      <h3>🎸 Equipment & Gear</h3>
                      <p><strong>Current:</strong> {GEAR_TIERS[state.gearTier].name}</p>
                      <p style={{ fontSize: '0.85em', color: '#94a3b8' }}>Quality +{GEAR_TIERS[state.gearTier].qualityBonus}% • Earnings ×{GEAR_TIERS[state.gearTier].gigBonus.toFixed(2)}</p>
                    </button>
                  </div>
                </div>
              )}

              {/* LOG TAB */}
              {currentTab === 'log' && (
                <>
                  {currentEvent && (
                    <div className="card">
                      <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {currentEvent.titleIcon && React.createElement(currentEvent.titleIcon, { size: 24, color: '#f59e0b' })}
                        Ongoing Event: {currentEvent.title}
                      </h2>
                      <p>{currentEvent.description}</p>
                      <div className="grid">
                        {currentEvent.choices.map((c, idx) => (
                          <div key={idx} className="mini-card">
                            <p><strong>{c.text}</strong></p>
                            <p>Money {c.money || 0} • Morale {c.morale || 0} • Fame {c.fame || 0}</p>
                            <button className="btn" onClick={() => resolveEvent(c)}>Choose</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="card">
                    <h2>Recent Activity</h2>
                    {state.log.length === 0 && <p>No events yet.</p>}
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                      {state.log.map((entry, idx) => {
                        const logItem = typeof entry === 'string' ? entry : entry.text || entry;
                        return (
                          <li 
                            key={idx}
                            style={{
                              padding: '12px',
                              marginBottom: '8px',
                              backgroundColor: '#0f172a',
                              borderLeft: '3px solid #3b82f6',
                              borderRadius: '4px',
                              fontSize: '0.9em',
                              lineHeight: '1.5',
                              color: '#e2e8f0'
                            }}
                          >
                            {logItem}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              )}

              {recruitOptions.length > 0 && (
                <div className="card">
                  <h2>Audition Candidates</h2>
                  <div className="grid">
                    {recruitOptions.map((c) => (
                      <div key={c.id} className="mini-card">
                        <div className="member-top" style={{ marginBottom: 6 }}>
                          <div className="instrument-icon">{renderInstrumentIcon(c.role)}</div>
                          <div>
                            <div className="member-name">{memberDisplayName(c)}</div>
                            <div className="member-role">{ROLE_OPTIONS.find((r) => r.key === c.role)?.label || c.role}</div>
                          </div>
                        </div>
                        {renderRadar(c.stats)}
                        <button className="btn" style={{ marginTop: 6 }} onClick={() => hireCandidate(c)}>
                          Hire
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className="btn" style={{ marginTop: 8 }} onClick={skipRecruit}>Skip for now</button>
                </div>
              )}
            </div>

            <aside className="sidebar sidebar-right">
              {/* Right Sidebar Tabs */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', flexWrap: 'wrap' }}>
                {[
                  { id: 'topChart', label: 'Top 20', icon: TrendingUp },
                  { id: 'albums', label: 'Albums', icon: Music },
                  { id: 'songChart', label: 'Songs', icon: ListMusic }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setRightTab(tab.id)}
                    style={{
                      flex: 1,
                      minWidth: '70px',
                      padding: '6px 8px',
                      border: 'none',
                      background: rightTab === tab.id ? '#1e40af' : '#334155',
                      color: '#fff',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      fontSize: '0.75em',
                      fontWeight: rightTab === tab.id ? 'bold' : 'normal',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px'
                    }}
                  >
                    <tab.icon size={12} />
                    {tab.label}
                  </button>
                ))}
              </div>
              
              {/* TOP CHART TAB */}
              {rightTab === 'topChart' && (
                <div className="card">
                  <h2>Top 20 Chart</h2>
                  <ol className="chart-list">
                    {chartLeaders.map((b) => (
                      <li key={b.name} className={`chart-row ${b.isPlayer ? 'active' : ''}`}>
                        <div className="chart-line">
                          <span className="chart-rank">#{b.position}</span>
                          <span className="chart-name">{b.name}</span>
                        </div>
                        <span className="chart-meta">Fame {b.fame}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              
              {/* ALBUM CHART TAB */}
              {rightTab === 'albums' && (
                <div className="card">
                  <h2>Album Chart</h2>
                  {albumChart.length === 0 && <p>No albums yet.</p>}
                  {albumChart.length > 0 && (
                    <ol className="chart-list">
                      {albumChart.map((a) => (
                        <li key={a.name + a.week} className={`chart-row ${latestAlbum && a.name === latestAlbum.name ? 'active' : ''}`}>
                          <div className="chart-line">
                            <span className="chart-rank">#{a.position}</span>
                            <span className="chart-name">{a.name}</span>
                          </div>
                          <span className="chart-meta">Score {a.chartScore || 0} • Age {a.age || 0}w{a.promoBoost ? ` • Promo +${a.promoBoost}` : ''}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              )}
              
              {/* SONG CHART TAB */}
              {rightTab === 'songChart' && (
                <div className="card">
                  <h2>Song Chart</h2>
                  {state.songs.length === 0 && <p>No tracks released yet.</p>}
                  {state.songs.length > 0 && (
                    <ol className="chart-list">
                      {[...state.songs]
                        .sort((a,b) => (b.popularity||0) - (a.popularity||0))
                        .slice(0, 10)
                        .map((s, idx) => (
                          <li key={s.title} className="chart-row active">
                            <div className="chart-line">
                              <span className="chart-rank">#{idx + 1}</span>
                              <span className="chart-name">{s.title}</span>
                            </div>
                            <span className="chart-meta">
                              Pop {s.popularity || 0} • Age {s.age || 0}w • Streams {s.weeklyStreams || 0}/wk
                            </span>
                          </li>
                        ))}
                    </ol>
                  )}
                </div>
              )}
            </aside>
          </div>
        </section>
      )}

      {/* Studio Upgrade Modal */}
      {showStudioModal && (
        <div className="modal-overlay" onClick={() => setShowStudioModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <h2 style={{ marginBottom: '12px' }}>Recording Studios</h2>
            <p style={{ marginBottom: '20px', color: '#94a3b8' }}>Upgrade your studio to record higher quality songs with better bonuses.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {STUDIO_TIERS.map((studio) => (
                <div 
                  key={studio.id}
                  className="mini-card"
                  style={{
                    border: state.studioTier === studio.id ? '2px solid #10b981' : '1px solid #334155',
                    backgroundColor: state.studioTier === studio.id ? '#064e3b' : '#1e293b',
                    position: 'relative'
                  }}
                >
                  {state.studioTier === studio.id && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '8px', 
                      right: '8px', 
                      backgroundColor: '#10b981',
                      color: '#fff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75em',
                      fontWeight: 'bold'
                    }}>
                      OWNED
                    </div>
                  )}
                  <h3 style={{ fontSize: '1.1em', marginBottom: '8px' }}>{studio.name}</h3>
                  <p style={{ fontSize: '0.85em', color: '#94a3b8', marginBottom: '12px' }}>{studio.desc}</p>
                  
                  <div style={{ fontSize: '0.9em', marginBottom: '12px' }}>
                    <div style={{ marginBottom: '4px' }}>💿 Record Cost: <strong>${studio.recordCost}</strong></div>
                    {studio.qualityBonus > 0 && <div style={{ marginBottom: '4px', color: '#10b981' }}>✨ Quality: <strong>+{studio.qualityBonus}%</strong></div>}
                    {studio.popBonus > 0 && <div style={{ marginBottom: '4px', color: '#3b82f6' }}>📈 Popularity: <strong>+{studio.popBonus}</strong></div>}
                    {studio.freshnessBonus > 0 && <div style={{ color: '#a855f7' }}>🎵 Freshness: <strong>+{studio.freshnessBonus * 10}</strong></div>}
                  </div>

                  {studio.id === 0 ? (
                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9em' }}>Starting studio</div>
                  ) : state.studioTier >= studio.id ? (
                    <div style={{ textAlign: 'center', color: '#10b981', fontSize: '0.9em', fontWeight: 'bold' }}>Unlocked ✓</div>
                  ) : (
                    <button 
                      className="btn"
                      onClick={() => upgradeStudio(studio.id)}
                      disabled={state.money < studio.cost}
                      style={{ width: '100%' }}
                    >
                      Upgrade ${studio.cost}
                      {state.money < studio.cost && ' (Need more $)'}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button 
              className="btn-secondary" 
              onClick={() => setShowStudioModal(false)}
              style={{ marginTop: '20px', width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Transport Upgrade Modal */}
      {showTransportModal && (
        <div className="modal-overlay" onClick={() => setShowTransportModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <h2 style={{ marginBottom: '12px' }}>Transportation Fleet</h2>
            <p style={{ marginBottom: '20px', color: '#94a3b8' }}>Upgrade your transport to increase gig earnings and unlock better venues.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {TRANSPORT_TIERS.map((transport) => (
                <div 
                  key={transport.id}
                  className="mini-card"
                  style={{
                    border: state.transportTier === transport.id ? '2px solid #3b82f6' : '1px solid #334155',
                    backgroundColor: state.transportTier === transport.id ? '#1e3a8a' : '#1e293b',
                    position: 'relative'
                  }}
                >
                  {state.transportTier === transport.id && (
                    <div style={{ 
                      position: 'absolute', 
                      top: '8px', 
                      right: '8px', 
                      backgroundColor: '#3b82f6',
                      color: '#fff',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75em',
                      fontWeight: 'bold'
                    }}>
                      IN USE
                    </div>
                  )}
                  <h3 style={{ fontSize: '1.1em', marginBottom: '8px' }}>🚐 {transport.name}</h3>
                  <p style={{ fontSize: '0.85em', color: '#94a3b8', marginBottom: '12px' }}>{transport.desc}</p>
                  
                  <div style={{ fontSize: '0.9em', marginBottom: '12px' }}>
                    {transport.id > 0 && <div style={{ marginBottom: '4px' }}>💰 Cost: <strong>${transport.cost}</strong></div>}
                    <div style={{ marginBottom: '4px', color: '#f59e0b' }}>💵 Gig Earnings: <strong>×{transport.gigBonus.toFixed(2)}</strong></div>
                    <div style={{ color: '#8b5cf6' }}>🎪 Venue Capacity: <strong>×{transport.venueMult.toFixed(2)}</strong></div>
                  </div>

                  {transport.id === 0 ? (
                    <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9em' }}>Starting option</div>
                  ) : state.transportTier >= transport.id ? (
                    <div style={{ textAlign: 'center', color: '#3b82f6', fontSize: '0.9em', fontWeight: 'bold' }}>Owned ✓</div>
                  ) : (
                    <button 
                      className="btn"
                      onClick={() => upgradeTransport(transport.id)}
                      disabled={state.money < transport.cost}
                      style={{ width: '100%' }}
                    >
                      Upgrade ${transport.cost}
                      {state.money < transport.cost && ' (Need more $)'}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.85em', color: '#94a3b8', marginTop: '16px' }}>💡 Better transport multiplies gig earnings and allows access to bigger venues with higher capacity rewards.</p>
            <button 
              className="btn-secondary" 
              onClick={() => setShowTransportModal(false)}
              style={{ marginTop: '20px', width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Gear Upgrade Modal */}
      {showGearModal && (
        <div className="modal-overlay" onClick={() => setShowGearModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <h2 style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Guitar size={24} /> Equipment & Gear
            </h2>
            <p style={{ marginBottom: '20px', color: '#94a3b8' }}>Upgrade your instruments and sound system to improve recordings and gig earnings.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {GEAR_TIERS.map((gear) => {
                const GearIcon = gear.icon;
                return (
                  <div 
                    key={gear.id}
                    className="mini-card"
                    style={{
                      border: state.gearTier === gear.id ? '2px solid #a855f7' : '1px solid #334155',
                      backgroundColor: state.gearTier === gear.id ? '#581c87' : '#1e293b',
                      position: 'relative'
                    }}
                  >
                    {state.gearTier === gear.id && (
                      <div style={{ 
                        position: 'absolute', 
                        top: '8px', 
                        right: '8px', 
                        backgroundColor: '#a855f7',
                        color: '#fff',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.75em',
                        fontWeight: 'bold'
                      }}>
                        EQUIPPED
                      </div>
                    )}
                    <h3 style={{ fontSize: '1.1em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <GearIcon size={18} /> {gear.name}
                    </h3>
                    <p style={{ fontSize: '0.85em', color: '#94a3b8', marginBottom: '12px' }}>{gear.desc}</p>
                    
                    <div style={{ fontSize: '0.9em', marginBottom: '12px' }}>
                      {gear.id > 0 && <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}><DollarSign size={14} /> Cost: <strong>${gear.cost}</strong></div>}
                      {gear.qualityBonus > 0 && <div style={{ marginBottom: '4px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}><Gem size={14} /> Quality: <strong>+{gear.qualityBonus}%</strong></div>}
                      {gear.soundBonus > 0 && <div style={{ marginBottom: '4px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}><Radio size={14} /> Sound: <strong>+{gear.soundBonus}%</strong></div>}
                      <div style={{ color: '#8b5cf6', display: 'flex', alignItems: 'center', gap: '4px' }}><TrendingUp size={14} /> Gig Earnings: <strong>×{gear.gigBonus.toFixed(2)}</strong></div>
                    </div>

                    {gear.id === 0 ? (
                      <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9em' }}>Starting gear</div>
                    ) : state.gearTier >= gear.id ? (
                      <div style={{ textAlign: 'center', color: '#a855f7', fontSize: '0.9em', fontWeight: 'bold' }}>Owned ✓</div>
                    ) : (
                      <button 
                        className="btn"
                        onClick={() => upgradeGear(gear.id)}
                        disabled={state.money < gear.cost}
                        style={{ width: '100%' }}
                      >
                        Upgrade ${gear.cost}
                        {state.money < gear.cost && ' (Need more $)'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
            <p style={{ fontSize: '0.85em', color: '#94a3b8', marginTop: '16px' }}>💡 Better gear increases the quality of your recordings and directly multiplies gig earnings. Invest wisely!</p>
            <button 
              className="btn-secondary" 
              onClick={() => setShowGearModal(false)}
              style={{ marginTop: '20px', width: '100%' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
