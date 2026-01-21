/**
 * MelodyEngine - Lakh-based melodic phrase assembly
 * 
 * Treats Lakh dataset as phrase library. Extracts motifs, normalizes
 * them to scale degrees, and assembles complete melodies by combining
 * appropriate phrases based on skill, burnout, and inspiration.
 */

import { SeededRandom } from '../utils/SeededRandom';

export class MelodyEngine {
  // Curated phrase library extracted from Lakh-style patterns
  static PHRASE_LIBRARY = {
    oneBar: [
      { id: 'stepwise_ascent', notes: [0, 1, 2, 3, 4], durations: [0.5, 0.5, 0.5, 0.5, 1], style: 'stepwise', range: 5 },
      { id: 'stepwise_descent', notes: [4, 3, 2, 1, 0], durations: [0.5, 0.5, 0.5, 0.5, 1], style: 'stepwise', range: 5 },
      { id: 'arpeggio_up', notes: [0, 2, 4, 5, 7], durations: [0.25, 0.25, 0.25, 0.25, 1], style: 'arpeggiated', range: 8 },
    ],
    twoBar: [
      { id: 'classic_contour', notes: [0, 2, 4, 5, 7, 5, 3, 2], durations: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1], style: 'arch', range: 8 },
      { id: 'jump_resolve', notes: [0, 5, 4, 3, 2, 1, 0], durations: [0.25, 0.5, 0.5, 0.5, 0.5, 0.5, 1], style: 'intervallic', range: 6 },
    ],
    fourBar: [
      { id: 'question_answer', notes: [0, 2, 4, 5, 7, 5, 4, 2, 0], durations: [0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 1], style: 'phrase', range: 8 },
      { id: 'riff_loop', notes: [0, 0, 2, 3, 2, 0, 0, 0], durations: [0.5, 0.25, 0.25, 0.5, 0.25, 0.25, 0.5, 1], style: 'rhythmic', range: 4 },
    ]
  };

  /**
   * Assemble complete melody from chord progression
   * @param {Object} chordProgression - Chord progression from HarmonyEngine
   * @param {Object} constraints - Constraints from ConstraintEngine
   * @param {string} seed - Random seed for reproducibility
   * @returns {Object} Complete melody
   */
  static assemble(chordProgression, constraints, seed = '') {
    const rng = new SeededRandom(seed);
    
    const { bandConstraints = {}, psychConstraints = {} } = constraints;
    const { memberSkills = {} } = bandConstraints;
    const guitaristSkill = memberSkills.guitarist || 50;
    
    // Calculate which phrases to use based on skill and burnout
    const phraseOptions = this._calculatePhraseOptions(guitaristSkill, psychConstraints, rng);
    
    // Assemble melody section by section
    const melody = [];
    const songStructure = this._generateSongStructure(chordProgression.chords.length, rng);
    
    songStructure.forEach(section => {
      const sectionMelody = [];
      
      section.chords.forEach((chord, chordIndex) => {
        // Select appropriate phrase for this chord
        const phraseLength = this._selectPhraseLength(phraseOptions, rng);
        const selectedPhrase = this._selectPhraseForContext(
          phraseLength,
          chord,
          guitaristSkill,
          phraseOptions,
          rng
        );
        
        // Map phrase to chord
        const mappedPhrase = this._mapPhraseToChord(selectedPhrase, chord, chordIndex, section.name);
        sectionMelody.push(mappedPhrase);
      });
      
      melody.push({
        section: section.name,
        phrases: sectionMelody,
        contour: this._generateSectionContour(sectionMelody)
      });
    });
    
    return {
      melody,
      songStructure,
      characteristicStyle: phraseOptions.preferredStyle,
      timestamp: Date.now()
    };
  }

  /**
   * Calculate phrase options based on skill and burnout
   */
  static _calculatePhraseOptions(skill, psychConstraints, rng) {
    const { burnout = 0, depression = 0 } = psychConstraints;
    
    const clicheReuse = burnout > 50 ? 0.7 : 0.2; // Burnout = rely on clichés
    const phraseComplexity = skill / 100; // Skilled players can handle complex phrases
    const rareMotifAccess = skill > 70 && burnout < 30; // Advanced + fresh = rare motifs
    
    // Determine preferred melodic style
    let preferredStyle = 'stepwise';
    if (rareMotifAccess && rng.next() > 0.5) {
      preferredStyle = 'arpeggiated';
    }
    if (depression > 60) {
      preferredStyle = 'arch'; // Melancholic contours
    }
    
    return {
      clicheReuse,
      phraseComplexity,
      rareMotifAccess,
      preferredStyle
    };
  }

  /**
   * Select phrase length (1-bar, 2-bar, 4-bar)
   */
  static _selectPhraseLength(phraseOptions, rng) {
    const { phraseComplexity } = phraseOptions;
    
    const roll = rng.next();
    if (phraseComplexity > 0.7 && roll > 0.6) {
      return 'fourBar';
    }
    if (roll > 0.4) {
      return 'twoBar';
    }
    return 'oneBar';
  }

  /**
   * Select phrase for specific chord context
   */
  static _selectPhraseForContext(phraseLength, chord, skill, phraseOptions, rng) {
    const phrasePool = this.PHRASE_LIBRARY[phraseLength] || this.PHRASE_LIBRARY.oneBar;
    
    // Filter by preference
    let candidates = phrasePool;
    if (phraseOptions.preferredStyle !== 'mixed') {
      candidates = phrasePool.filter(p => p.style === phraseOptions.preferredStyle);
      if (candidates.length === 0) candidates = phrasePool; // Fallback
    }
    
    // Low skill = simpler phrases
    if (skill < 40) {
      candidates = candidates.filter(p => p.range < 6);
    }
    
    // Select randomly from candidates
    return candidates[Math.floor(rng.next() * candidates.length)];
  }

  /**
   * Map phrase to specific chord (adjust notes to chord tones)
   */
  static _mapPhraseToChord(phrase, chord, index, sectionName) {
    // Simplified: map phrase notes to chord context
    const mapped = { ...phrase };
    mapped.targetChord = chord;
    mapped.sectionContext = sectionName;
    mapped.phraseIndex = index;
    
    // In a full implementation, would adjust notes to chord tones
    // and ensure resolution on chord root/third/fifth
    
    return mapped;
  }

  /**
   * Generate overall melodic contour for section
   */
  static _generateSectionContour(phrases) {
    if (phrases.length === 0) return 'flat';
    
    // Calculate overall pitch movement
    const firstNote = phrases[0]?.notes?.[0] || 0;
    const lastNote = phrases[phrases.length - 1]?.notes?.[phrases[phrases.length - 1].notes.length - 1] || 0;
    const highestNote = Math.max(...phrases.flatMap(p => p.notes || [0]));
    
    if (highestNote > firstNote + 2 && lastNote < firstNote) {
      return 'arch'; // Up then down
    }
    if (lastNote > firstNote) {
      return 'ascending';
    }
    if (lastNote < firstNote) {
      return 'descending';
    }
    return 'stable';
  }

  /**
   * Generate song structure (verse/chorus/bridge)
   */
  static _generateSongStructure(progressionLength, rng) {
    return [
      { name: 'intro', chords: ['C', 'G'] },
      { name: 'verse', chords: ['C', 'Am', 'F', 'G'] },
      { name: 'chorus', chords: ['C', 'G', 'Am', 'F'] },
      { name: 'verse', chords: ['C', 'Am', 'F', 'G'] },
      { name: 'chorus', chords: ['C', 'G', 'Am', 'F'] },
      { name: 'bridge', chords: ['F', 'G', 'C'] },
      { name: 'chorus', chords: ['C', 'G', 'Am', 'F'] },
      { name: 'outro', chords: ['C'] }
    ];
  }

  /**
   * Get gameplay hooks for melody
   */
  static getGameplayHooks(skill, burnout) {
    return {
      clicheReuse: burnout > 50 ? 0.7 : 0.2,
      creativeFluency: Math.max(0.3, 1 - burnout * 0.007),
      phraseComplexity: skill / 100,
      rareMotifsUnlocked: skill > 70 && burnout < 30
    };
  }
}

export default MelodyEngine;
