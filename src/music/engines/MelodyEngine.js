/**
 * MelodyEngine - Melody phrase assembly from processed datasets
 * 
 * Loads processed melody phrases from core dataset and assembles
 * complete melodies using constraint-based selection.
 */

import { SeededRandom } from '../utils/SeededRandom.js';
import { loadDataset } from '../utils/loadDataset.js';

export class MelodyEngine {
  // Loaded phrases from processed dataset
  static phrases = null;

  // Fallback phrases
  static FALLBACK_PHRASES = {
    oneBar: [
      { id: 'stepwise_ascent', scale_degrees: [0, 1, 2, 3, 4], durations: [0.5, 0.5, 0.5, 0.5, 1], style: 'stepwise', range: [0, 4], length_bars: 1 },
      { id: 'stepwise_descent', scale_degrees: [4, 3, 2, 1, 0], durations: [0.5, 0.5, 0.5, 0.5, 1], style: 'stepwise', range: [0, 4], length_bars: 1 },
    ],
    twoBar: [
      { id: 'classic_contour', scale_degrees: [0, 2, 4, 5, 7, 5, 3, 2], durations: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1], style: 'arch', range: [0, 7], length_bars: 2 },
    ],
    fourBar: [
      { id: 'question_answer', scale_degrees: [0, 2, 4, 5, 7, 5, 4, 2, 0], durations: [0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5, 0.5, 1], style: 'phrase', range: [0, 7], length_bars: 4 },
    ]
  };

  /**
   * Load phrases from processed dataset
   */
  static async loadPhrases() {
    if (this.phrases !== null) {
      return this.phrases;
    }

    try {
      // Load dataset (works in both Node.js and browser)
      const data = await loadDataset('phrases');
      
      if (!data) {
        throw new Error('Failed to load dataset');
      }
      
      // Filter out invalid phrases
      this.phrases = (data || []).filter(phrase => {
        return phrase.scale_degrees && 
               Array.isArray(phrase.scale_degrees) && 
               phrase.scale_degrees.length > 0;
      });

      if (this.phrases.length === 0) {
        console.warn('No valid phrases in dataset, using fallback');
        this.phrases = this._convertFallbackToEnhanced();
      } else {
        console.log(`Loaded ${this.phrases.length} melody phrases from dataset`);
      }
    } catch (error) {
      console.error('Failed to load phrases:', error);
      this.phrases = this._convertFallbackToEnhanced();
    }

    return this.phrases;
  }

  /**
   * Convert fallback phrases to enhanced schema format
   */
  static _convertFallbackToEnhanced() {
    const enhanced = [];
    Object.values(this.FALLBACK_PHRASES).forEach(category => {
      category.forEach(phrase => {
        enhanced.push({
          ...phrase,
          difficulty_profile: {
            technical_skill: phrase.scale_degrees.length > 6 ? 0.6 : 0.4,
            timing_precision: 0.5,
            pitch_accuracy: 0.4,
            expression_complexity: 0.5
          },
          emotional_character: {
            triumph: 0.3,
            melancholy: 0.3,
            aggression: 0.3,
            vulnerability: 0.4,
            chaos: 0.3,
            hope: 0.3
          },
          phrase_function: {
            hook_potential: phrase.length_bars <= 1 ? 0.8 : 0.4,
            verse_suitable: phrase.length_bars >= 2 && phrase.length_bars <= 4,
            chorus_suitable: phrase.length_bars <= 2,
            bridge_suitable: phrase.length_bars >= 4,
            solo_potential: 0.3,
            riff_potential: 0.2
          }
        });
      });
    });
    return enhanced;
  }

  /**
   * Organize phrases by length for easy selection
   */
  static _organizePhrasesByLength(phrases) {
    const organized = {
      oneBar: [],
      twoBar: [],
      fourBar: []
    };

    phrases.forEach(phrase => {
      const lengthBars = phrase.length_bars || 1;
      if (lengthBars <= 1) {
        organized.oneBar.push(phrase);
      } else if (lengthBars <= 2) {
        organized.twoBar.push(phrase);
      } else {
        organized.fourBar.push(phrase);
      }
    });

    return organized;
  }

  /**
   * Assemble complete melody from chord progression
   * @param {Object} chordProgression - Chord progression from HarmonyEngine
   * @param {Object} constraints - Constraints from ConstraintEngine
   * @param {string} seed - Random seed for reproducibility
   * @returns {Object} Complete melody
   */
  static async assemble(chordProgression, constraints, seed = '') {
    const rng = new SeededRandom(seed);
    const phrases = await this.loadPhrases();
    const organizedPhrases = this._organizePhrasesByLength(phrases);
    
    const { bandConstraints = {}, psychConstraints = {} } = constraints;
    const { memberSkills = {} } = bandConstraints;
    const guitaristSkill = memberSkills.guitarist || 50;
    
    // Calculate which phrases to use based on skill and burnout
    const phraseOptions = this._calculatePhraseOptions(guitaristSkill, psychConstraints, rng);
    
    // Assemble melody section by section
    const melody = [];
    const progression = chordProgression.progression || chordProgression;
    const chords = progression.chords || ['C', 'G', 'Am', 'F'];
    const songStructure = this._generateSongStructure(chords, rng);
    
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
          organizedPhrases,
          constraints,
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
    
    const clicheReuse = burnout > 50 ? 0.7 : 0.2;
    const phraseComplexity = skill / 100;
    const rareMotifAccess = skill > 70 && burnout < 30;
    
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
   * Select phrase for specific chord context using constraint-based selection
   */
  static _selectPhraseForContext(phraseLength, chord, skill, phraseOptions, organizedPhrases, constraints, rng) {
    const phrasePool = organizedPhrases[phraseLength] || organizedPhrases.oneBar;
    
    if (phrasePool.length === 0) {
      // Fallback to any length
      const allPhrases = [...organizedPhrases.oneBar, ...organizedPhrases.twoBar, ...organizedPhrases.fourBar];
      if (allPhrases.length === 0) {
        return this._getFallbackPhrase(phraseLength);
      }
      return allPhrases[Math.floor(rng.next() * allPhrases.length)];
    }

    // Filter by constraints using enhanced schema fields
    const { psychConstraints = {} } = constraints;
    const { depression = 0, burnout = 0 } = psychConstraints;

    let candidates = phrasePool.filter(phrase => {
      // Filter by skill requirement
      const requiredSkill = (phrase.difficulty_profile?.technical_skill || 0.5) * 100;
      if (skill < requiredSkill * 0.8) {
        return false; // Not skilled enough
      }

      // Filter by style preference
      if (phraseOptions.preferredStyle !== 'mixed' && phrase.style) {
        if (phraseOptions.preferredStyle === 'arch' && phrase.style !== 'arch') {
          // Allow arch style for depression
          if (depression < 60) return false;
        }
      }

      // Filter by emotional character
      if (depression > 60) {
        // Prefer melancholic phrases
        const melancholy = phrase.emotional_character?.melancholy || 0;
        if (melancholy < 0.4) {
          return false; // Not melancholic enough
        }
      }

      // Filter by burnout (prefer simpler phrases)
      if (burnout > 60) {
        const complexity = phrase.difficulty_profile?.technical_skill || 0.5;
        if (complexity > 0.7) {
          return false; // Too complex when burned out
        }
      }

      return true;
    });

    if (candidates.length === 0) {
      candidates = phrasePool; // Fallback to all phrases
    }

    // Weighted selection based on constraint fit
    const weights = candidates.map(phrase => {
      let weight = 1.0;

      // Prefer phrases matching emotional state
      if (depression > 60) {
        const melancholy = phrase.emotional_character?.melancholy || 0;
        weight *= (0.7 + melancholy * 0.3);
      }

      // Prefer phrases matching skill level
      const skillMatch = 1 - Math.abs((phrase.difficulty_profile?.technical_skill || 0.5) - (skill / 100));
      weight *= (0.5 + skillMatch * 0.5);

      // Prefer hook potential for choruses
      const hookPotential = phrase.phrase_function?.hook_potential || 0;
      weight *= (0.7 + hookPotential * 0.3);

      // Add randomness
      weight *= (0.7 + rng.next() * 0.3);

      return weight;
    });

    // Weighted random selection
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let selection = rng.next() * totalWeight;

    for (let i = 0; i < candidates.length; i++) {
      selection -= weights[i];
      if (selection <= 0) {
        return candidates[i];
      }
    }

    return candidates[candidates.length - 1];
  }

  /**
   * Get fallback phrase
   */
  static _getFallbackPhrase(phraseLength) {
    const fallback = this._convertFallbackToEnhanced();
    const lengthMap = { oneBar: 1, twoBar: 2, fourBar: 4 };
    const targetLength = lengthMap[phraseLength] || 1;
    return fallback.find(p => (p.length_bars || 1) === targetLength) || fallback[0];
  }

  /**
   * Map phrase to specific chord (adjust notes to chord tones)
   */
  static _mapPhraseToChord(phrase, chord, index, sectionName) {
    const mapped = { ...phrase };
    mapped.targetChord = chord;
    mapped.sectionContext = sectionName;
    mapped.phraseIndex = index;
    
    // Use scale_degrees directly (already normalized)
    mapped.notes = phrase.scale_degrees || phrase.notes || [];
    
    return mapped;
  }

  /**
   * Generate overall melodic contour for section
   */
  static _generateSectionContour(phrases) {
    if (phrases.length === 0) return 'flat';
    
    const allNotes = phrases.flatMap(p => p.notes || p.scale_degrees || []);
    if (allNotes.length === 0) return 'flat';
    
    const firstNote = allNotes[0];
    const lastNote = allNotes[allNotes.length - 1];
    const highestNote = Math.max(...allNotes);
    const lowestNote = Math.min(...allNotes);
    
    if (highestNote > firstNote + 2 && lastNote < firstNote) {
      return 'arch'; // Up then down
    }
    if (lastNote > firstNote + 1) {
      return 'ascending';
    }
    if (lastNote < firstNote - 1) {
      return 'descending';
    }
    return 'stable';
  }

  /**
   * Generate song structure (verse/chorus/bridge)
   */
  static _generateSongStructure(chords, rng) {
    // Use the actual progression chords
    const progression = Array.isArray(chords) ? chords : (chords.chords || ['C', 'G', 'Am', 'F']);
    
    return [
      { name: 'intro', chords: progression.slice(0, 2) },
      { name: 'verse', chords: progression },
      { name: 'chorus', chords: progression },
      { name: 'verse', chords: progression },
      { name: 'chorus', chords: progression },
      { name: 'bridge', chords: progression.slice(0, 3) },
      { name: 'chorus', chords: progression },
      { name: 'outro', chords: [progression[0]] }
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
