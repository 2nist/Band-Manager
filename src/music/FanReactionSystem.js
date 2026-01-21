/**
 * FanReactionSystem - Generates fan feedback based on song quality
 * 
 * Translates music analysis scores into narrative fan reactions,
 * fame impact, and psychological band effects
 */

export class FanReactionSystem {
  /**
   * Generate fan reactions to a song
   */
  static generateReactions(song, fanbase = {}) {
    const { analysis } = song;
    const { quality, originality, commercial, emotional } = {
      quality: analysis.qualityScore,
      originality: analysis.originalityScore,
      commercial: analysis.commercialViability,
      emotional: analysis.emotionalTone
    };

    const { primary = 'mixed', size = 100, loyalty = 50 } = fanbase;

    // Generate base reactions
    const reactions = {
      overall: this._generateOverallReaction(quality, commercial, primary),
      quality: this._generateQualityFeedback(quality),
      originality: this._generateOriginalityFeedback(originality),
      emotional: this._generateEmotionalFeedback(emotional),
      fanSpecific: this._generateFanbaseSpecificReaction(primary, quality, originality, commercial)
    };

    // Calculate impact
    const impact = {
      fameGain: this._calculateFameGain(quality, originality, commercial, size),
      moneyGain: this._calculateMoneyGain(commercial, size),
      psychologicalEffect: this._calculatePsychEffect(quality, originality, fanbase),
      loyaltyChange: this._calculateLoyaltyChange(quality, originality, primary, loyalty)
    };

    return {
      reactions,
      impact,
      timestamp: Date.now()
    };
  }

  /**
   * Generate overall reaction message
   */
  static _generateOverallReaction(quality, commercial, fanboseType) {
    const messages = [];

    // Quality-based
    if (quality > 85) {
      messages.push("The crowd went absolutely wild for this track!");
    } else if (quality > 70) {
      messages.push("Fans really enjoyed the execution and polished sound.");
    } else if (quality > 50) {
      messages.push("The performance was decent, though it had rough edges.");
    } else if (quality > 30) {
      messages.push("The song had potential, but the production needs work.");
    } else {
      messages.push("This one didn't quite land with the crowd.");
    }

    // Commercial viability
    if (commercial > 80 && fanboseType === 'mainstream') {
      messages.push("Radio stations are already picking this up!");
    } else if (commercial < 30 && fanboseType === 'underground') {
      messages.push("The underground loved how experimental it was.");
    }

    return messages.join(" ");
  }

  /**
   * Generate quality-specific feedback
   */
  static _generateQualityFeedback(quality) {
    const feedbackPoints = [];

    if (quality > 80) {
      feedbackPoints.push("🎵 Exceptional production quality");
      feedbackPoints.push("✨ Flawless execution from all band members");
    } else if (quality > 60) {
      feedbackPoints.push("🎵 Good production quality");
      feedbackPoints.push("✨ Solid band performance");
    } else if (quality > 40) {
      feedbackPoints.push("⚠️ Could use better production");
      feedbackPoints.push("⚠️ Some playing was inconsistent");
    } else {
      feedbackPoints.push("❌ Raw/unprofessional production");
      feedbackPoints.push("❌ Band performance was rough");
    }

    return feedbackPoints;
  }

  /**
   * Generate originality-specific feedback
   */
  static _generateOriginalityFeedback(originality) {
    const feedbackPoints = [];

    if (originality > 80) {
      feedbackPoints.push("🎨 Completely fresh and original");
      feedbackPoints.push("💡 Never heard anything quite like this before");
    } else if (originality > 60) {
      feedbackPoints.push("🎨 Had some fresh ideas");
      feedbackPoints.push("💡 Unique twist on familiar sounds");
    } else if (originality > 40) {
      feedbackPoints.push("📋 Pretty familiar territory");
      feedbackPoints.push("📋 Solid covers/riffs but not new");
    } else {
      feedbackPoints.push("🔄 Very derivative");
      feedbackPoints.push("🔄 Feeling pretty formulaic");
    }

    return feedbackPoints;
  }

  /**
   * Generate emotional response feedback
   */
  static _generateEmotionalFeedback(emotional) {
    const { positivity = 0, intensity = 0, darkness = 0 } = emotional;
    const feedbackPoints = [];

    if (positivity > 60) {
      feedbackPoints.push("😊 Really lifted our spirits");
    }
    if (darkness > 60) {
      feedbackPoints.push("😔 Dealt with some heavy themes");
    }
    if (intensity > 70) {
      feedbackPoints.push("🔥 Incredibly powerful and intense");
    }

    return feedbackPoints.length > 0 ? feedbackPoints : ["😐 Emotionally neutral"];
  }

  /**
   * Generate fanbase-specific reactions
   */
  static _generateFanbaseSpecificReaction(fanboseType, quality, originality, commercial) {
    const reactions = {
      mainstream: {
        positive: [
          "This is going to be on every playlist!",
          "You've got another hit on your hands",
          "Perfect radio-friendly track"
        ],
        negative: [
          "Not catchy enough for mainstream audiences",
          "Needs more commercial polish"
        ],
        condition: commercial > 70
      },
      underground: {
        positive: [
          "Finally! A band not selling out!",
          "This is what real music sounds like",
          "Keep pushing the boundaries!"
        ],
        negative: [
          "Too commercial for us",
          "Feels too polished, lacking edge"
        ],
        condition: originality > 70 && commercial < 50
      },
      niche: {
        positive: [
          "You totally get our scene",
          "This is exactly what we needed",
          "Nailed the vibe perfectly"
        ],
        negative: [
          "Doesn't quite fit our aesthetic",
          "Missing the genre conventions we love"
        ],
        condition: quality > 60
      },
      mixed: {
        positive: [
          "Something for everyone here",
          "Great variety in your sound",
          "Nice balance of familiar and fresh"
        ],
        negative: [
          "Trying to please too many people",
          "Lacks a strong identity"
        ],
        condition: true
      }
    };

    const fanReactions = reactions[fanboseType] || reactions.mixed;
    const messages = fanReactions.condition ? fanReactions.positive : fanReactions.negative;

    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * Calculate fame gain
   */
  static _calculateFameGain(quality, originality, commercial, fanboseSize) {
    let fameGain = 0;

    // Base from quality
    fameGain += quality * 0.5;

    // Boost from originality
    fameGain += originality * 0.3;

    // Boost from commercial viability
    fameGain += commercial * 0.2;

    // Scale by fanbase size
    fameGain *= (fanboseSize / 100);

    return Math.round(fameGain);
  }

  /**
   * Calculate money gain (from concert/radio)
   */
  static _calculateMoneyGain(commercial, fanboseSize) {
    // Commercial viability drives money
    const commercialFactor = commercial / 100;
    const baseMoney = fanboseSize * 10; // $10 per fan base unit

    return Math.round(baseMoney * commercialFactor);
  }

  /**
   * Calculate psychological band effects
   */
  static _calculatePsychEffect(quality, originality, fanbase) {
    const effects = {
      confidence_change: 0,
      stress_change: 0,
      ego_change: 0,
      burnout_change: 0
    };

    // Success boosts confidence and ego
    if (quality > 70) {
      effects.confidence_change = +(quality - 50) / 3;
      effects.ego_change = +(originality - 50) / 5;
    } else {
      effects.confidence_change = -(50 - quality) / 5;
      effects.stress_change = +(50 - quality) / 5;
    }

    // Originality affects burnout (doing something fresh = less burnout)
    if (originality > 70) {
      effects.burnout_change = -5;
    } else if (originality < 30) {
      effects.burnout_change = +10; // Formulaic = burnout
    }

    return effects;
  }

  /**
   * Calculate loyalty change
   */
  static _calculateLoyaltyChange(quality, originality, fanboseType, currentLoyalty) {
    let loyaltyChange = 0;

    // Quality drives loyalty
    if (quality > 75) {
      loyaltyChange += 5;
    } else if (quality < 40) {
      loyaltyChange -= 3;
    }

    // Different fanboses value different things
    if (fanboseType === 'mainstream' && quality > 70) {
      loyaltyChange += 3;
    } else if (fanboseType === 'underground' && originality > 70) {
      loyaltyChange += 4;
    } else if (fanboseType === 'niche' && originality > 60) {
      loyaltyChange += 2;
    }

    // Diminishing returns at high loyalty
    if (currentLoyalty > 85) {
      loyaltyChange *= 0.5;
    }

    return loyaltyChange;
  }

  /**
   * Generate social media narrative
   */
  static generateSocialMediaBuzz(song, fanbase, reactionData) {
    const { reactions, impact } = reactionData;
    const { quality, originality, commercial } = {
      quality: song.analysis.qualityScore,
      originality: song.analysis.originalityScore,
      commercial: song.analysis.commercialViability
    };

    const tweets = [];

    // Calculate engagement
    const engagement = Math.round((quality + originality) / 2);

    // Generate hashtag trends
    const hashtags = [];
    if (originality > 75) hashtags.push('#NewSoundAlert');
    if (quality > 80) hashtags.push('#BangersOnly');
    if (commercial > 80) hashtags.push('#RadioReady');
    if (originality < 40) hashtags.push('#CoversAllDay');

    // Generate sample tweets
    if (engagement > 75) {
      tweets.push(`OMG just heard the new track from ${song.metadata.band}. This is INSANE! ${hashtags.join(' ')}`);
      tweets.push(`Alright I'm obsessed with ${song.metadata.band}'s new direction. So good.`);
    } else if (engagement > 50) {
      tweets.push(`${song.metadata.band} just dropped a new track. Worth checking out! ${hashtags.join(' ')}`);
    } else {
      tweets.push(`New ${song.metadata.band} track is... something. ${hashtags.join(' ')}`);
    }

    // Calculate reach
    const reach = Math.round(fanbase.size * (engagement / 100) * 10);

    return {
      tweets,
      hashtags,
      engagement,
      reach,
      trending: engagement > 75
    };
  }
}

export default FanReactionSystem;
