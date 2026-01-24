/**
 * enhancedCopy.js - Enhanced narrative copy for gigs, consequences, and other gameplay
 *
 * Sourced from GAME_EVENT_COPY.md and enhanced dialogue design.
 * Use these strings for addLog, modal descriptions, and narrative UI.
 */

import { randomFrom } from './helpers';

/** Gig performance tier thresholds (quality 0–100) */
export const GIG_TIER = {
  SUCCESS: 70,
  OKAY: 45
  // below OKAY = poor
};

const GIG_SUCCESS = [
  'The {crowd} screaming fans at {venue} went absolutely wild! Your band tore through the set with precision and fire. Crowd surfing, encores, the whole nine yards. The promoter counted out ${pay} and grinned—"We\'ll definitely book you again." You gained {fame} fame.',
  '{venue} was packed to the gills! The energy was electric, and your performance was flawless. Security could barely hold back the fans. Merch sold out. You walked away with ${pay} and serious street cred.',
  'The crowd at {venue} ate it up. Every song landed perfectly, and the mosh pit was absolutely bonkers. This kind of show is what rock and roll is made of. ${pay} richer and {fame} fame points up.',
  'Standing ovation at {venue}! The {crowd} fans chanted for an encore. Your band delivered. The venue owner handed you ${pay} and already wants to book you for a bigger slot next month.'
];

const GIG_OKAY = [
  'The set at {venue} went alright, though the crowd was a bit lukewarm. You made ${pay}, but felt like something was off. Maybe the gear, maybe the mood. You\'ll do better next time.',
  '{venue} was half-full. You played competently, but the energy didn\'t quite ignite. The promoter paid you ${pay}, but seemed unimpressed.',
  'The gig at {venue} was... fine. Nothing terrible, nothing spectacular. ${pay} for a solid evening. Time to upgrade something and come back stronger.'
];

const GIG_POOR = [
  'Oof. The set at {venue} was rough. Your timing was off, the crowd was thin, and you only scraped together ${pay}. The promoter looked disappointed. You need better gear and tighter rehearsals.',
  '{venue} was nearly empty. Your band sounded sloppy, and you barely earned ${pay}. Time to get back in the woodshed.',
  'The performance at {venue} was forgettable. You earned ${pay} and the crowd\'s indifference. This is a wake-up call to practice harder.'
];

/**
 * Pick and interpolate a gig performance description
 * @param {number} performanceQuality - 0–100
 * @param {Object} ctx - { venue, attendance, pay, fame }
 * @returns {string}
 */
export function getGigPerformanceCopy(performanceQuality, ctx) {
  const { venue = 'the venue', attendance = 0, pay = 0, fame = 0 } = ctx;
  const crowd = attendance > 0 ? `${attendance.toLocaleString()} ` : '';
  const payStr = typeof pay === 'number' ? pay.toLocaleString() : String(pay);
  const fameStr = typeof fame === 'number' ? fame : String(fame);

  let template;
  if (performanceQuality >= GIG_TIER.SUCCESS) {
    template = randomFrom(GIG_SUCCESS);
  } else if (performanceQuality >= GIG_TIER.OKAY) {
    template = randomFrom(GIG_OKAY);
  } else {
    template = randomFrom(GIG_POOR);
  }

  return template
    .replaceAll('{venue}', venue)
    .replaceAll('{crowd}', crowd)
    .replaceAll('${pay}', payStr)
    .replaceAll('{fame}', fameStr);
}

/**
 * Build a consequence event for EnhancedEventModal (has title, description, choices)
 * @param {Object} data - { consequenceId?, id?, description }
 * @param {'escalation'|'resurfaced'} kind
 * @returns {Object} event shape for modal
 */
export function buildConsequenceEvent(data, kind) {
  const id = data?.consequenceId || data?.id || `consequence-${kind}-${Date.now()}`;
  const title = kind === 'escalation' ? 'Consequence Escalated' : 'Consequence Resurfaced';
  const description = data?.description || (kind === 'escalation'
    ? 'A past decision has caught up with you...'
    : 'The past returns to haunt you...');

  return {
    id,
    type: 'consequence',
    title,
    description,
    category: 'consequence',
    risk: 'low',
    choices: [
      {
        id: 'continue',
        text: 'Continue',
        effects: {}
      }
    ],
    data
  };
}
