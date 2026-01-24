/**
 * EnhancedSongGenerator.js - Skill and genre-responsive song generation
 * 
 * Wraps the existing MusicGenerator to add:
 * - Genre-specific audio characteristics
 * - Individual member skill processing
 * - Enhanced audio generation with skill effects
 * - Performance quality metrics
 */

import { MusicGenerator } from './MusicGenerator.js';
import { getGenreProfile } from './profiles/GENRE_AUDIO_PROFILES.js';
import { SkillResponsiveAudioEngine } from './engines/SkillResponsiveAudioEngine.js';

export class EnhancedSongGenerator {
  constructor(gameState, genre = null) {
    this.gameState = gameState;
    // Use provided genre or from gameState, default to rock
    this.genre = genre || gameState.genre || 'rock';
    // Normalize genre to match profile keys (capitalize first letter)
    this.genre = this.genre.charAt(0).toUpperCase() + this.genre.slice(1).toLowerCase();
    // Special case for EDM (all caps)
    if (this.genre.toLowerCase() === 'edm') {
      this.genre = 'EDM';
    }
    this.genreProfile = getGenreProfile(this.genre);
    this.bandMembers = gameState.bandMembers || gameState.members || [];
    this.audioEngine = null;
  }

  /**
   * Generate enhanced song with skill and genre processing
   * @param {string} songTitle - Song title
   * @param {Object} userPreferences - User preferences (optional)
   * @returns {Promise<Object>} Enhanced song data
   */
  async generateEnhancedSong(songTitle, userPreferences = {}) {
    // 1. Generate base song using existing system
    const baseSong = await MusicGenerator.generateSong(
      this.gameState,
      this.genre,
      {
        songName: songTitle,
        seed: userPreferences.seed
      }
    );
    
    // 2. Initialize skill-responsive audio engine
    const seed = baseSong.metadata.seed || `${this.gameState.bandName}-${Date.now()}`;
    this.audioEngine = new SkillResponsiveAudioEngine(
      this.genreProfile,
      this.bandMembers,
      seed
    );
    
    // 3. Apply genre-specific processing
    const genreProcessedData = this.applyGenreCharacteristics(baseSong);
    
    // 4. Apply individual member skill processing
    const skillProcessedData = this.applyMemberSkills(genreProcessedData);
    
    // 5. Calculate performance metrics
    const skillInfluence = this.audioEngine.calculateSkillInfluence();
    const genreAuthenticity = this.calculateGenreAuthenticity();
    const performanceQuality = this.calculateOverallQuality();
    
    // 6. Enhance song object with skill data
    return {
      ...baseSong,
      enhanced: {
        skillInfluence,
        genreAuthenticity,
        performanceQuality,
        genreProfile: this.genreProfile,
        memberSkillModifiers: this.getMemberSkillModifiers()
      },
      musicalContent: skillProcessedData.musicalContent || baseSong.musicalContent
    };
  }

  /**
   * Apply genre-specific characteristics to song
   */
  applyGenreCharacteristics(song) {
    const processed = { ...song };
    const { musicalContent } = processed;
    
    if (!musicalContent) return processed;
    
    // Apply genre characteristics to each instrument
    const genreDrums = this.applyGenreDrumCharacteristics(musicalContent.drums);
    const genreHarmony = this.applyGenreHarmonyCharacteristics(musicalContent.harmony);
    const genreMelody = this.applyGenreMelodyCharacteristics(musicalContent.melody);
    
    processed.musicalContent = {
      ...musicalContent,
      drums: genreDrums,
      harmony: genreHarmony,
      melody: genreMelody
    };
    
    // Update composition tempo based on genre
    const tempoRange = this.genreProfile.overall.tempo_range || [100, 160];
    if (processed.composition) {
      processed.composition.tempo = this.clampTempo(
        processed.composition.tempo || 120,
        tempoRange
      );
    }
    
    return processed;
  }

  /**
   * Apply member skills to musical content
   */
  applyMemberSkills(song) {
    const processed = { ...song };
    const { musicalContent } = processed;
    
    if (!musicalContent || !this.audioEngine) return processed;
    
    // Process each instrument with member skills
    const processedContent = { ...musicalContent };
    
    this.bandMembers.forEach(member => {
      const role = member.role || member.type || member.instrument;
      
      // Map roles to musical content
      let contentKey = null;
      if (role === 'drummer') {
        contentKey = 'drums';
      } else if (role === 'bassist') {
        contentKey = 'harmony'; // Bass plays harmony
      } else if (role === 'guitarist' || role === 'lead-guitar' || role === 'keyboardist') {
        contentKey = 'melody';
      }
      
      if (contentKey && processedContent[contentKey]) {
        // Convert musical content to processable format
        const musicalData = this.convertToProcessableFormat(processedContent[contentKey], role);
        
        // Process with skill engine (result used for skill modifiers)
        this.audioEngine.processInstrumentPerformance(
          member,
          musicalData,
          0
        );
        
        // Store skill modifiers in metadata
        if (!processedContent[contentKey].skillModifiers) {
          processedContent[contentKey].skillModifiers = 
            this.audioEngine.getSkillModifiers(member);
        }
      }
    });
    
    processed.musicalContent = processedContent;
    return processed;
  }

  /**
   * Convert musical content to processable format
   */
  convertToProcessableFormat(content, role) {
    // Extract notes, timing, dynamics from content
    // This is a simplified conversion - actual implementation would depend on content structure
    return {
      notes: content.notes || [],
      timing: content.timing || [],
      dynamics: content.dynamics || [],
      effects: content.effects || []
    };
  }

  /**
   * Apply genre-specific drum characteristics
   */
  applyGenreDrumCharacteristics(drums) {
    if (!drums) return drums;
    
    const genreConfig = this.genreProfile.drums || {};
    const processed = { ...drums };
    
    // Apply genre timing precision
    if (genreConfig.timing_precision) {
      processed.genreTimingPrecision = genreConfig.timing_precision;
    }
    
    // Apply complexity preference
    if (genreConfig.complexity_preference) {
      processed.genreComplexity = genreConfig.complexity_preference;
    }
    
    // Apply swing factor if applicable
    if (genreConfig.swing_factor) {
      processed.swingFactor = genreConfig.swing_factor;
    }
    
    return processed;
  }

  /**
   * Apply genre-specific harmony characteristics
   */
  applyGenreHarmonyCharacteristics(harmony) {
    if (!harmony) return harmony;
    
    const genreConfig = this.genreProfile.guitar || this.genreProfile.bass || {};
    const processed = { ...harmony };
    
    // Apply chord voicing preference
    if (genreConfig.chord_voicing) {
      processed.genreVoicing = genreConfig.chord_voicing;
    }
    
    // Apply complexity preference
    if (genreConfig.complexity_preference) {
      processed.genreComplexity = genreConfig.complexity_preference;
    }
    
    return processed;
  }

  /**
   * Apply genre-specific melody characteristics
   */
  applyGenreMelodyCharacteristics(melody) {
    if (!melody) return melody;
    
    const genreConfig = this.genreProfile.guitar || {};
    const processed = { ...melody };
    
    // Apply improvisation factor
    if (genreConfig.improvisation_factor) {
      processed.genreImprovisation = genreConfig.improvisation_factor;
    }
    
    // Apply complexity preference
    if (genreConfig.complexity_preference) {
      processed.genreComplexity = genreConfig.complexity_preference;
    }
    
    return processed;
  }

  /**
   * Clamp tempo to genre range
   */
  clampTempo(tempo, range) {
    return Math.max(range[0], Math.min(range[1], tempo));
  }

  /**
   * Calculate genre authenticity score
   */
  calculateGenreAuthenticity() {
    if (!this.audioEngine) return 0.5;
    
    const memberSkillMatch = this.bandMembers.map(member => {
      const role = member.role || member.type || member.instrument;
      const requiredPrecision = this.genreProfile[role]?.timing_precision || 0.8;
      const memberPrecision = (member.skill || 50) / 100;
      return Math.min(1, memberPrecision / requiredPrecision);
    });
    
    if (memberSkillMatch.length === 0) return 0.5;
    
    return memberSkillMatch.reduce((a, b) => a + b, 0) / memberSkillMatch.length;
  }

  /**
   * Calculate overall performance quality
   */
  calculateOverallQuality() {
    if (this.bandMembers.length === 0) return 0.5;
    
    const avgSkill = this.bandMembers.reduce((sum, m) => sum + (m.skill || 50), 0) / this.bandMembers.length;
    const avgReliability = this.bandMembers.reduce((sum, m) => sum + (m.reliability || 50), 0) / this.bandMembers.length;
    const avgMorale = this.bandMembers.reduce((sum, m) => sum + (m.morale || 50), 0) / this.bandMembers.length;
    
    return (avgSkill * 0.4 + avgReliability * 0.3 + avgMorale * 0.3) / 100;
  }

  /**
   * Get skill modifiers for all members
   */
  getMemberSkillModifiers() {
    if (!this.audioEngine) return {};
    
    const modifiers = {};
    this.bandMembers.forEach(member => {
      const role = member.role || member.type || member.instrument;
      const mods = this.audioEngine.getSkillModifiers(member);
      if (mods) {
        modifiers[role] = mods;
      }
    });
    
    return modifiers;
  }
}

export default EnhancedSongGenerator;
