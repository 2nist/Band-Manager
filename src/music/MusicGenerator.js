/**
 * MusicGenerator - Orchestrates complete song generation
 * 
 * Coordinates all engines (Constraints, Drums, Harmony, Melody)
 * to produce complete instrumental tracks from game state.
 * 
 * Phase 1: Instrumental only (vocals added in Phase 2)
 */

import { ConstraintEngine } from './engines/ConstraintEngine.js';
import { DrumEngine } from './engines/DrumEngine.js';
import { HarmonyEngine } from './engines/HarmonyEngine.js';
import { MelodyEngine } from './engines/MelodyEngine.js';
import { SeededRandom } from './utils/SeededRandom.js';

export class MusicGenerator {
  /**
   * Generate complete instrumental song from game state
   * @param {Object} gameState - Current game state
   * @param {string} genre - Musical genre (rock, punk, funk, metal, folk, jazz)
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Complete song data
   */
  static async generateSong(gameState, genre = 'rock', options = {}) {
    const {
      seed = '',
      songName = `${gameState.bandName || 'Untitled'} - ${new Date().toLocaleDateString()}`,
      timestamp = Date.now()
    } = options;

    // Generate master seed for reproducibility
    const masterSeed = seed || `${gameState.bandName}-${gameState.currentWeek}-${genre}`;

    // Step 1: Extract constraints from game state
    const constraints = ConstraintEngine.generateConstraints(gameState);

    // Step 2: Generate individual components with derived seeds (parallel for speed)
    const [drums, harmony] = await Promise.all([
      DrumEngine.generate(constraints, genre, `${masterSeed}-drums`),
      HarmonyEngine.generate(constraints, genre, `${masterSeed}-harmony`)
    ]);

    const melody = await MelodyEngine.assemble(
      harmony,
      constraints,
      `${masterSeed}-melody`
    );

    // Step 3: Combine into complete song structure
    const song = {
      metadata: {
        name: songName,
        genre,
        band: gameState.bandName,
        week: gameState.currentWeek,
        seed: masterSeed,
        generatedAt: timestamp
      },

      gameContext: {
        constraints,
        bandSkill: constraints.bandConstraints.overallSkill,
        bandConfidence: constraints.bandConstraints.confidence,
        psychologicalState: constraints.psychConstraints,
        industryPressure: constraints.industryConstraints,
        bandMembers: gameState.bandMembers || gameState.members || [],
        members: gameState.bandMembers || gameState.members || []
      },

      musicalContent: {
        drums,
        harmony,
        melody
      },

      composition: {
        tempo: drums.tempo,
        key: 'C', // Placeholder - would be derived from harmony
        mode: harmony.mode,
        genre,
        structure: melody.songStructure
      },

      analysis: {
        commercialViability: this._analyzeCommercialViability(harmony, constraints),
        originalityScore: this._analyzeOriginality(constraints),
        qualityScore: this._analyzeQualityScore(constraints, drums, harmony, melody),
        emotionalTone: constraints.narrativeConstraints?.emotionalTone || { positivity: 0, intensity: 0, darkness: 0 }
      }
    };

    return song;
  }

  /**
   * Generate multiple songs for album
   */
  static async generateAlbum(gameState, genre = 'rock', options = {}) {
    const { trackCount = 10 } = options;
    
    const tracks = [];
    
    for (let i = 0; i < trackCount; i++) {
      const trackSeed = `${options.seed || gameState.bandName}-track-${i}`;
      const track = await this.generateSong(gameState, genre, {
        ...options,
        seed: trackSeed,
        songName: `Track ${i + 1}`
      });
      tracks.push(track);
    }

    return {
      metadata: {
        albumName: options.albumName || `${gameState.bandName} Album`,
        genre,
        trackCount,
        generatedAt: Date.now()
      },
      tracks
    };
  }

  /**
   * Analyze commercial viability
   */
  static _analyzeCommercialViability(harmony, constraints) {
    const { industryConstraints = {} } = constraints;
    
    // Base score from progression
    let score = HarmonyEngine.calculateCommercialViability(harmony.progression);

    // Adjust for label pressure
    if (industryConstraints.labelPressure > 70) {
      score *= 1.2; // Label-approved music scores higher
    }

    // Adjust for fan expectations
    if (industryConstraints.fanExpectations?.catchiness) {
      score *= (0.5 + industryConstraints.fanExpectations.catchiness);
    }

    return Math.max(0, Math.min(100, score * 100));
  }

  /**
   * Analyze originality score
   */
  static _analyzeOriginality(constraints) {
    const { bandConstraints = {}, psychConstraints = {}, narrativeConstraints = {} } = constraints;

    let score = 50; // Base originality

    // Confidence enables originality
    score += (bandConstraints.confidence - 50) * 0.3;

    // Burnout reduces originality
    score -= psychConstraints.burnout * 0.3;

    // Unique events unlock originality
    if (narrativeConstraints.lyricThemes?.length > 2) {
      score += 15;
    }

    // Unlocked genres boost originality
    if (Object.keys(narrativeConstraints.unlockedGenres || {}).length > 0) {
      score += 20;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate overall quality score
   */
  static _analyzeQualityScore(constraints, drums, harmony, melody) {
    const { bandConstraints = {}, contextConstraints = {} } = constraints;

    // Skill affects quality
    let score = bandConstraints.overallSkill * 0.5;

    // Equipment/studio quality affects production
    const productionQuality = (contextConstraints.equipmentQuality + contextConstraints.studioQuality) / 2;
    score += productionQuality * 0.3;

    // Band chemistry affects cohesion
    score += bandConstraints.chemistry * 0.2;

    return Math.round(score);
  }

  /**
   * Export song for rendering/MIDI
   */
  static exportForRendering(song) {
    return {
      metadata: song.metadata,
      tempo: song.composition.tempo,
      key: song.composition.key,
      mode: song.composition.mode,
      drums: song.musicalContent.drums,
      harmony: song.musicalContent.harmony,
      melody: song.musicalContent.melody
    };
  }
}

export default MusicGenerator;
