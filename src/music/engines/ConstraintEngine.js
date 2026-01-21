/**
 * ConstraintEngine - Maps game state to music generation constraints
 * 
 * Core philosophy: Same seed + different psychology = different music
 * This engine extracts gameplay state into constraint parameters that
 * drive generation throughout all music subsystems.
 */

export class ConstraintEngine {
  /**
   * Generate comprehensive constraints from game state
   * @param {Object} gameState - Current game state object
   * @returns {Object} Structured constraints for music generation
   */
  static generateConstraints(gameState) {
    return {
      // Band internal state - affects musical skill and chemistry
      bandConstraints: this._extractBandConstraints(gameState),
      
      // Psychological state - affects mood, complexity, risk-taking
      psychConstraints: this._extractPsychConstraints(gameState),
      
      // Industry pressure - affects commercial viability vs artistic risk
      industryConstraints: this._extractIndustryConstraints(gameState),
      
      // External context - venue, audience, equipment, studio
      contextConstraints: this._extractContextConstraints(gameState),
      
      // Narrative events - recent band events that shaped the music
      narrativeConstraints: this._extractNarrativeConstraints(gameState)
    };
  }

  /**
   * Extract band-related constraints
   */
  static _extractBandConstraints(gameState) {
    const { bandMembers = [], bandConfidence = 50, totalGigs = 0, albumsReleased = 0 } = gameState;
    
    return {
      // Average skill across all band members (0-100)
      overallSkill: this._calculateAverageSkill(bandMembers),
      
      // Individual member skills for complex interactions
      memberSkills: {
        vocalist: this._getMemberSkill(bandMembers, 'vocalist'),
        guitarist: this._getMemberSkill(bandMembers, 'guitarist'),
        bassist: this._getMemberSkill(bandMembers, 'bassist'),
        drummer: this._getMemberSkill(bandMembers, 'drummer'),
        keyboardist: this._getMemberSkill(bandMembers, 'keyboardist')
      },
      
      // Band chemistry affects cohesion in music
      chemistry: this._calculateBandChemistry(bandMembers),
      
      // Confidence (0-100) affects willingness to experiment
      confidence: bandConfidence,
      
      // Experience level (gigs + albums)
      experience: totalGigs + (albumsReleased * 5),
      
      // Maturity curve - older bands play differently
      maturityLevel: Math.min(100, totalGigs / 10)
    };
  }

  /**
   * Extract psychological state constraints
   */
  static _extractPsychConstraints(gameState) {
    const { psychState = {} } = gameState;
    const {
      stress = 0,
      addiction_risk = 0,
      moral_integrity = 100,
      depression = 0,
      paranoia = 0,
      ego = 50,
      burnout = 0,
      substance_use = 0
    } = psychState;

    // Calculate corruption first
    const corruption = 100 - moral_integrity;
    
    return {
      // Stress affects timing precision and chaotic elements (0-100)
      stress,
      
      // Addiction risk affects discipline and consistency (0-100)
      addictionRisk: addiction_risk,
      
      // Moral corruption (inverse of integrity) (0-100)
      corruption,
      
      // Depression affects tempo and emotional valence (0-100)
      depression,
      
      // Paranoia affects harmonic risk and dissonance (0-100)
      paranoia,
      
      // Ego affects pronoun usage in lyrics and showboating (0-100)
      ego,
      
      // Burnout affects creativity and cliché usage (0-100)
      burnout,
      
      // Current substance use level (0-100)
      substanceUse: substance_use,
      
      // Overall psychological resilience
      mentalHealth: Math.max(0, 100 - (stress + depression + burnout) / 3),
      
      // Creativity potential (inverse of burnout + corruption)
      creativePotential: Math.max(0, 100 - (burnout * 0.6 + corruption * 0.3))
    };
  }

  /**
   * Extract industry/label pressure constraints
   */
  static _extractIndustryConstraints(gameState) {
    const { labelDeal = null, fanbase = {}, mediaAttention = 0, money = 0 } = gameState;

    return {
      // Label pressure (0-100) affects commercial viability requirements
      labelPressure: labelDeal ? labelDeal.pressure || 0 : 0,
      
      // Label type affects music style expectations
      labelType: labelDeal ? labelDeal.type : 'independent',
      
      // Fan expectations based on current fanbase
      fanExpectations: this._calculateFanExpectations(fanbase),
      
      // Media scrutiny level
      mediaScrutiny: mediaAttention,
      
      // Financial pressure (inversely affects bold choices)
      financialPressure: money < 0 ? Math.abs(money) / 1000 : 0,
      
      // Commercial viability threshold (affects song structure)
      commercialThreshold: labelDeal ? (labelDeal.pressure / 100) * 0.8 : 0.3
    };
  }

  /**
   * Extract context-specific constraints
   */
  static _extractContextConstraints(gameState) {
    const { currentVenue = null, currentAudience = null, equipment = {}, currentStudio = null } = gameState;

    return {
      // Venue characteristics affect instrumentation
      venueType: currentVenue ? currentVenue.type : 'generic',
      venueCapacity: currentVenue ? currentVenue.capacity : 100,
      venueAcoustics: currentVenue ? currentVenue.acoustics : 'standard',
      
      // Audience characteristics affect musical choices
      audienceType: currentAudience ? currentAudience.type : 'mixed',
      audienceSize: currentAudience ? currentAudience.size : 100,
      audienceExpectations: currentAudience ? currentAudience.expectations : 'standard',
      
      // Equipment quality affects production fidelity
      equipmentQuality: equipment.quality || 50,
      
      // Studio quality affects production complexity
      studioQuality: currentStudio ? currentStudio.quality : 50,
      
      // Time/deadline pressure
      dayOfWeek: gameState.dayOfWeek || 0,
      seasonOfYear: gameState.season || 'spring'
    };
  }

  /**
   * Extract narrative event constraints
   */
  static _extractNarrativeConstraints(gameState) {
    const { recentEvents = [], gameWeek = 0 } = gameState;

    const themes = [];
    const unlockStatus = {};
    
    recentEvents.forEach(event => {
      // Each event type contributes thematic elements
      if (event.type === 'relationship_drama') {
        themes.push('betrayal', 'longing', 'conflict');
      }
      if (event.type === 'addiction_struggle') {
        themes.push('darkness', 'escape', 'degradation');
      }
      if (event.type === 'success_pressure') {
        themes.push('spotlight', 'corruption', 'fame');
      }
      if (event.type === 'creative_block') {
        themes.push('emptiness', 'silence', 'searching');
      }
      if (event.type === 'inspiration') {
        themes.push('revelation', 'clarity', 'energy');
        unlockStatus[event.genre] = true;
      }
    });

    return {
      // Thematic content influenced by recent events
      lyricThemes: themes,
      
      // Genre inspirations unlocked
      unlockedGenres: unlockStatus,
      
      // Emotional tone from recent events
      emotionalTone: this._calculateEmotionalTone(recentEvents),
      
      // Narrative progression affects music complexity
      narrativeWeight: Math.min(gameWeek / 52, 1)
    };
  }

  // ============ Helper Methods ============

  /**
   * Calculate average skill across band members
   */
  static _calculateAverageSkill(bandMembers) {
    if (!bandMembers || bandMembers.length === 0) return 50;
    const totalSkill = bandMembers.reduce((sum, member) => sum + (member.skill || 50), 0);
    return totalSkill / bandMembers.length;
  }

  /**
   * Get skill level for a specific instrument
   */
  static _getMemberSkill(bandMembers, instrument) {
    const member = bandMembers.find(m => m.instrument === instrument);
    return member ? member.skill : 50;
  }

  /**
   * Calculate band chemistry from member relationships
   */
  static _calculateBandChemistry(bandMembers) {
    if (!bandMembers || bandMembers.length < 2) return 50;
    
    // Average friendship/chemistry values
    let totalChemistry = 0;
    let pairCount = 0;
    
    for (let i = 0; i < bandMembers.length; i++) {
      for (let j = i + 1; j < bandMembers.length; j++) {
        totalChemistry += bandMembers[i].chemistry?.[bandMembers[j].id] || 50;
        pairCount++;
      }
    }
    
    return pairCount > 0 ? totalChemistry / pairCount : 50;
  }

  /**
   * Calculate fan expectations based on fanbase composition
   */
  static _calculateFanExpectations(fanbase) {
    const { primary = 'mixed', size = 0, loyalty = 50 } = fanbase;
    
    const expectations = {
      mainstream: { familiarProgressions: 0.9, complexity: 0.3, catchiness: 0.9 },
      underground: { familiarProgressions: 0.2, complexity: 0.8, originality: 0.9 },
      niche: { familiarProgressions: 0.4, complexity: 0.7, references: 0.9 },
      crossover: { familiarProgressions: 0.6, complexity: 0.5, balance: 0.8 },
      mixed: { familiarProgressions: 0.5, complexity: 0.5, variety: 0.8 }
    };
    
    return expectations[primary] || expectations.mixed;
  }

  /**
   * Calculate emotional tone from recent events
   */
  static _calculateEmotionalTone(recentEvents) {
    let positivity = 0;
    let intensity = 0;
    let darkness = 0;
    
    recentEvents.forEach(event => {
      switch (event.type) {
        case 'success':
        case 'inspiration':
          positivity += 20;
          intensity += 10;
          break;
        case 'addiction_struggle':
        case 'breakup':
          darkness += 25;
          intensity += 15;
          break;
        case 'success_pressure':
          intensity += 20;
          break;
        case 'creative_block':
          darkness += 15;
          positivity -= 10;
          break;
      }
    });
    
    return {
      positivity: Math.max(-100, Math.min(100, positivity)),
      intensity: Math.max(0, Math.min(100, intensity)),
      darkness: Math.max(0, Math.min(100, darkness))
    };
  }
}

export default ConstraintEngine;
