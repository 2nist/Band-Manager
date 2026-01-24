/**
 * SkillResponsiveAudioEngine.js - Processes music based on individual member skills
 * 
 * Applies genre-specific characteristics while modifying performance based on
 * each band member's skill, creativity, reliability, and other attributes.
 */

import { SeededRandom } from '../utils/SeededRandom.js';

export class SkillResponsiveAudioEngine {
  constructor(genreProfile, bandMembers, seed = '') {
    this.genreProfile = genreProfile;
    this.bandMembers = bandMembers || [];
    this.instrumentProcessors = {};
    this.rng = new SeededRandom(seed || Date.now().toString());
    this.setupInstrumentProcessors();
  }

  setupInstrumentProcessors() {
    this.bandMembers.forEach(member => {
      const role = member.role || member.type || member.instrument;
      const genreConfig = this.genreProfile[role] || {};
      const processor = new MemberAudioProcessor(member, genreConfig, this.rng);
      this.instrumentProcessors[role] = processor;
    });
  }

  /**
   * Process instrument performance with skill effects
   * @param {Object} member - Band member object
   * @param {Object} musicalData - Musical data for this instrument
   * @param {number} measureNumber - Current measure number
   * @returns {Object} Processed musical data
   */
  processInstrumentPerformance(member, musicalData, measureNumber = 0) {
    const role = member.role || member.type || member.instrument;
    const processor = this.instrumentProcessors[role];
    
    if (!processor) {
      console.warn(`No processor found for role: ${role}`);
      return musicalData;
    }

    return processor.applySkillEffects(musicalData, measureNumber);
  }

  /**
   * Get skill modifiers for a member
   */
  getSkillModifiers(member) {
    const role = member.role || member.type || member.instrument;
    const processor = this.instrumentProcessors[role];
    return processor ? processor.skillMods : null;
  }

  /**
   * Calculate overall skill influence on the song
   */
  calculateSkillInfluence() {
    const influence = {};
    
    this.bandMembers.forEach(member => {
      const role = member.role || member.type || member.instrument;
      const processor = this.instrumentProcessors[role];
      
      if (processor) {
        influence[role] = {
          timing_impact: (100 - (member.skill || 50)) / 100,
          note_accuracy: (member.skill || 50) / 100,
          creativity_factor: (member.creativity || 50) / 100,
          consistency: (member.reliability || 50) / 100,
          performance_quality: processor.skillMods.performance_quality
        };
      }
    });
    
    return influence;
  }
}

/**
 * MemberAudioProcessor - Processes individual member's performance
 */
class MemberAudioProcessor {
  constructor(member, genreConfig, rng) {
    this.member = member;
    this.genreConfig = genreConfig;
    this.rng = rng || { next: () => Math.random() };
    this.calculateSkillModifiers();
  }

  calculateSkillModifiers() {
    const skill = this.member.skill || 50;
    const reliability = this.member.reliability || 50;
    const creativity = this.member.creativity || 50;
    const stagePresence = this.member.stagePresence || 50;
    const morale = this.member.morale || 50;
    const drama = this.member.drama || 50;
    
    const genreTimingPrecision = this.genreConfig.timing_precision || 0.8;
    
    // Timing precision based on skill, reliability, and genre requirements
    this.skillMods = {
      // Timing accuracy - combines skill, reliability, and genre precision
      timing_accuracy: Math.min(0.99, 
        (skill * 0.6 + reliability * 0.4) / 100 * genreTimingPrecision
      ),
      
      // Note accuracy based on skill
      note_accuracy: Math.min(1.0, skill / 80),
      
      // Dynamic expression based on creativity and stage presence
      expression_range: Math.min(1.0, 
        (creativity * 0.7 + stagePresence * 0.3) / 100
      ),
      
      // Consistency based on reliability
      consistency: Math.min(1.0, reliability / 100),
      
      // Creative variations based on creativity
      improvisation_factor: Math.min(0.8, creativity / 100),
      
      // Drama affects performance volatility
      volatility: Math.max(0, (drama - 50) / 100),
      
      // Morale affects overall performance quality
      performance_quality: Math.max(0.3, morale / 100),
      
      // Genre-specific modifiers
      genre_timing_precision: genreTimingPrecision,
      genre_complexity: this.genreConfig.complexity_preference || 0.5
    };
  }

  applySkillEffects(musicalData, measureNumber) {
    if (!musicalData) return musicalData;
    
    return {
      notes: this.processNotes(musicalData.notes || [], measureNumber),
      timing: this.processTiming(musicalData.timing || []),
      dynamics: this.processDynamics(musicalData.dynamics || []),
      effects: this.processEffects(musicalData.effects || [])
    };
  }

  processNotes(notes, measureNumber) {
    if (!Array.isArray(notes)) return notes;
    
    return notes.map((note, index) => {
      let processedNote = { ...note };
      
      // Note accuracy - skilled players hit right notes
      if (this.rng.next() > this.skillMods.note_accuracy) {
        processedNote = this.introduceNoteError(processedNote);
      }
      
      // Creative variations - high creativity adds embellishments
      if (this.rng.next() < this.skillMods.improvisation_factor * 0.1) {
        processedNote = this.addCreativeEmbellishment(processedNote, measureNumber);
      }
      
      // Drama creates performance inconsistencies
      if (this.rng.next() < this.skillMods.volatility * 0.05) {
        const velocityMultiplier = 0.7 + this.rng.next() * 0.6; // 0.7 to 1.3
        processedNote.velocity = (processedNote.velocity || 0.8) * velocityMultiplier;
      }
      
      return processedNote;
    });
  }

  processTiming(timing) {
    if (!Array.isArray(timing)) return timing;
    
    // Apply timing precision based on skill
    const jitterAmount = (1 - this.skillMods.timing_accuracy) * 0.02; // Up to 20ms jitter
    
    return timing.map(time => {
      const jitter = (this.rng.next() - 0.5) * jitterAmount;
      return Math.max(0, time + jitter);
    });
  }

  processDynamics(dynamics) {
    if (!Array.isArray(dynamics)) return dynamics;
    
    // Skilled players have better dynamic control
    const baseDynamicRange = 0.3 + (this.skillMods.expression_range * 0.6);
    
    return dynamics.map((velocity, index) => {
      // Base velocity modified by performance quality
      let processedVelocity = (velocity || 0.8) * this.skillMods.performance_quality;
      
      // Add expressive variation for skilled players
      if (this.skillMods.expression_range > 0.7) {
        const expressiveVariation = Math.sin(index * 0.3) * 0.1 * this.skillMods.expression_range;
        processedVelocity += expressiveVariation;
      }
      
      // Consistency affects velocity steadiness
      const consistencyJitter = (1 - this.skillMods.consistency) * 0.15;
      processedVelocity += (this.rng.next() - 0.5) * consistencyJitter;
      
      return Math.max(0.1, Math.min(1.0, processedVelocity));
    });
  }

  processEffects(effects) {
    if (!Array.isArray(effects)) return effects;
    
    // Skilled players use effects more effectively
    return effects.map(effect => ({
      ...effect,
      // More skilled players have better effect timing
      precision: (effect.precision || 1) * this.skillMods.timing_accuracy,
      // Creative players use more varied effects
      variation: (effect.variation || 0.5) * this.skillMods.improvisation_factor,
      // Quality affects overall effect quality
      quality: (effect.quality || 1) * this.skillMods.performance_quality
    }));
  }

  introduceNoteError(note) {
    // Low-skill players might hit adjacent notes
    const errorTypes = ['flat', 'sharp', 'muted'];
    const errorType = errorTypes[Math.floor(this.rng.next() * errorTypes.length)];
    
    switch (errorType) {
      case 'flat':
        return { ...note, pitch: (note.pitch || 60) - 1, velocity: (note.velocity || 0.8) * 0.8 };
      case 'sharp':
        return { ...note, pitch: (note.pitch || 60) + 1, velocity: (note.velocity || 0.8) * 0.8 };
      case 'muted':
        return { ...note, velocity: (note.velocity || 0.8) * 0.3, muted: true };
      default:
        return note;
    }
  }

  addCreativeEmbellishment(note, measureNumber) {
    const embellishments = ['bend', 'slide', 'hammer_on', 'grace_note'];
    const embellishment = embellishments[Math.floor(this.rng.next() * embellishments.length)];
    
    return {
      ...note,
      embellishment,
      embellishment_strength: this.skillMods.improvisation_factor
    };
  }
}

export default SkillResponsiveAudioEngine;
