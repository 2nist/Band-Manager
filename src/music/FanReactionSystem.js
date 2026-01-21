/**
 * FanReactionSystem - Enhanced Gritty Fan Feedback System
 * 
 * Generates visceral, psychologically complex fan reactions based on song quality,
 * with mature themes, obsessive behavior, and realistic industry feedback
 */

export class FanReactionSystem {
  /**
   * Generate fan reactions to a song (enhanced with gritty reactions)
   */
  static generateReactions(song, fanbase = {}, psychologicalState = {}, gameState = {}) {
    const { analysis } = song;
    const { quality, originality, commercial, emotional } = {
      quality: analysis?.qualityScore || song.quality || 50,
      originality: analysis?.originalityScore || song.originality || 50,
      commercial: analysis?.commercialViability || song.commercial || 50,
      emotional: analysis?.emotionalTone || 'neutral'
    };

    const { primary = 'mixed', size = 100, loyalty = 50 } = fanbase || {};
    const genre = song.metadata?.genre || gameState.genre || 'rock';
    const venue = gameState.currentVenue || {};

    // Determine if we should use gritty reactions
    const useGritty = this._shouldUseGrittyReactions(quality, originality, psychologicalState, fanbase);

    // Generate base reactions
    const reactions = {
      overall: useGritty 
        ? this._generateGrittyOverallReaction(quality, commercial, primary, genre, venue)
        : this._generateOverallReaction(quality, commercial, primary),
      quality: useGritty
        ? this._generateGrittyQualityFeedback(quality, genre, psychologicalState)
        : this._generateQualityFeedback(quality),
      originality: useGritty
        ? this._generateGrittyOriginalityFeedback(originality, genre)
        : this._generateOriginalityFeedback(originality),
      emotional: useGritty
        ? this._generateGrittyEmotionalFeedback(emotional, psychologicalState)
        : this._generateEmotionalFeedback(emotional),
      fanSpecific: useGritty
        ? this._generateGrittyFanbaseReaction(primary, quality, originality, commercial, psychologicalState, genre)
        : this._generateFanbaseSpecificReaction(primary, quality, originality, commercial),
      socialMedia: useGritty
        ? this._generateGrittySocialMedia(song, quality, originality, commercial, psychologicalState)
        : this._generateSocialMediaBuzz(song, fanbase, { reactions: {}, impact: {} })
    };

    // Calculate impact
    const impact = {
      fameGain: this._calculateFameGain(quality, originality, commercial, size),
      moneyGain: this._calculateMoneyGain(commercial, size),
      psychologicalEffect: this._calculatePsychEffect(quality, originality, fanbase),
      loyaltyChange: this._calculateLoyaltyChange(quality, originality, primary, loyalty),
      // Enhanced psychological effects
      obsessionChange: useGritty ? this._calculateObsessionChange(quality, originality, psychologicalState) : 0,
      controversyLevel: useGritty ? this._calculateControversyLevel(quality, originality, commercial, psychologicalState) : 0
    };

    return {
      reactions,
      impact,
      timestamp: Date.now(),
      gritty: useGritty
    };
  }

  /**
   * Determine if we should use gritty reactions
   */
  static _shouldUseGrittyReactions(quality, originality, psychologicalState, fanbase) {
    // Use gritty if:
    // - High stress or addiction risk
    // - Low moral integrity
    // - Underground fanbase
    // - Extreme quality (very high or very low)
    const { stress_level = 0, addiction_risk = 0, moral_integrity = 100 } = psychologicalState || {};
    const { primary = 'mixed' } = fanbase || {};

    return (
      stress_level > 60 ||
      addiction_risk > 40 ||
      moral_integrity < 60 ||
      primary === 'underground' ||
      quality > 90 ||
      quality < 20
    );
  }

  /**
   * Generate gritty overall reaction message
   */
  static _generateGrittyOverallReaction(quality, commercial, fanbaseType, genre, venue) {
    const messages = [];

    // Devastating failures
    if (quality < 30) {
      const failures = [
        `The crowd at ${venue.name || 'the venue'} turned hostile fast. Someone threw a bottle that barely missed your head. "GET OFF THE STAGE!" they screamed. The sound guy cut your power mid-song.`,
        `What a fucking disaster. Your amp caught fire during the second song, filling ${venue.name || 'the venue'} with smoke. Half the crowd evacuated thinking it was a real emergency.`,
        `Complete meltdown. Your bassist showed up wasted, couldn't remember any songs. The drummer's kit collapsed mid-song. You tried to salvage it solo, but the crowd started laughing. Someone filmed it and posted it online within minutes.`,
        `The silence was deafening. Not the good kind. After your third song, people started leaving. Not walking - running. Like they'd just witnessed something they needed to forget.`,
        `Booed off stage. Actually booed. Not the playful kind - the "we want our money back" kind. The promoter pulled you aside: "Don't ever come back here."`
      ];
      messages.push(failures[Math.floor(Math.random() * failures.length)]);
    }
    // Underground/gritty success
    else if (quality > 70 && fanbaseType === 'underground') {
      const successes = [
        `The basement at ${venue.name || 'the venue'} was a sweaty, beer-soaked hellhole - and the crowd ate it up. Bodies pressed against each other, screaming every word back at you. Some kid broke his nose in the pit and kept dancing, blood streaming down his face.`,
        `${venue.name || 'The venue'} erupted into beautiful chaos. The mosh pit spilled onto the street. Three people got arrested. The cops shut you down after four songs, but not before the whole block heard your sound.`,
        `The warehouse show was pure underground magic. No permits, no rules, just raw energy. The floor was shaking, the walls were sweating, and everyone looked like they'd found their religion.`,
        `Someone in the front row was crying. Not sad tears - the kind that come when music hits you so hard it breaks something open. That's when you know you've made something real.`,
        `The promoter slipped you cash in crumpled bills and whispered "You just made this place legendary."`
      ];
      messages.push(successes[Math.floor(Math.random() * successes.length)]);
    }
    // Mainstream success
    else if (quality > 80 && commercial > 70) {
      const mainstream = [
        `Radio stations are already picking this up. Your manager's phone won't stop ringing. Industry people you've never met are suddenly your "old friends."`,
        `This is going to be on every playlist. Spotify featured you. Apple Music wants an exclusive. The machine is hungry, and you're the meal.`,
        `You've got another hit on your hands. The kind that makes you rich and hollow at the same time. Enjoy it while it lasts.`,
        `Perfect radio-friendly track. It'll play in grocery stores and dentist offices. Your art is now background noise. Congratulations.`
      ];
      messages.push(mainstream[Math.floor(Math.random() * mainstream.length)]);
    }
    // Mixed/controversial
    else if (quality > 50 && quality < 70) {
      const mixed = [
        `The performance was decent, though it had rough edges. Some fans loved it, others walked out. The kind of reaction that builds cult followings or kills careers.`,
        `Polarizing. Half the crowd was losing their minds, the other half was checking their phones. That's usually a good sign - means you're doing something right.`,
        `The song had potential, but the production needs work. Critics will tear it apart, but your real fans will defend it like it's their child.`
      ];
      messages.push(mixed[Math.floor(Math.random() * mixed.length)]);
    }
    // Quality-based
    else if (quality > 70) {
      messages.push("The crowd went absolutely wild for this track. Bodies moving, voices screaming, the kind of energy that makes you remember why you do this.");
    } else {
      messages.push("This one didn't quite land with the crowd. Not a disaster, but not a triumph either. The kind of show you forget by next week.");
    }

    return messages.join(" ");
  }

  /**
   * Generate gritty quality-specific feedback
   */
  static _generateGrittyQualityFeedback(quality, genre, psychologicalState) {
    const feedbackPoints = [];

    if (quality > 80) {
      const highQuality = [
        "🔥 Production so clean it's almost sterile. Almost.",
        "⚡ Flawless execution. Almost too perfect - where's the soul?",
        "🎵 Exceptional quality. The kind that makes other bands jealous.",
        "✨ So polished it hurts. In a good way.",
        "💎 Professional grade. You could sell this to anyone."
      ];
      feedbackPoints.push(...highQuality.slice(0, 2));
    } else if (quality > 60) {
      const goodQuality = [
        "🎵 Good production quality. Nothing groundbreaking, but solid.",
        "✨ Solid band performance. Everyone did their job.",
        "📊 Competent. Not inspiring, but competent.",
        "🎯 Gets the job done. Won't change lives, but won't embarrass you either."
      ];
      feedbackPoints.push(...goodQuality.slice(0, 2));
    } else if (quality > 40) {
      const mediocreQuality = [
        "⚠️ Could use better production. Sounds like it was recorded in a garage. Because it was.",
        "⚠️ Some playing was inconsistent. Your drummer was off-beat for half the song.",
        "🔧 Rough around the edges. Very rough. Like sandpaper rough.",
        "📉 Amateur hour. But sometimes that's the charm, right?"
      ];
      feedbackPoints.push(...mediocreQuality.slice(0, 2));
    } else {
      const poorQuality = [
        "❌ Raw/unprofessional production. The kind that makes your ears bleed.",
        "❌ Band performance was rough. Like, really rough. Someone should have practiced.",
        "💀 This sounds like it was recorded on a phone. In a bathroom. During an earthquake.",
        "🔥 Trainwreck. Beautiful, chaotic trainwreck. Some people pay good money for this."
      ];
      feedbackPoints.push(...poorQuality.slice(0, 2));
    }

    // Add psychological state effects
    const psychEffects = [];
    if (psychologicalState?.addiction_risk > 50) {
      psychEffects.push("💊 There's an edge to this that wasn't there before. Raw. Dangerous. Real.");
    }
    if (psychologicalState?.stress_level > 70) {
      psychEffects.push("😰 You can hear the tension. It's either going to break you or make you legendary.");
    }
    feedbackPoints.push(...psychEffects);

    return feedbackPoints;
  }

  /**
   * Generate gritty originality feedback
   */
  static _generateGrittyOriginalityFeedback(originality, genre) {
    const feedbackPoints = [];

    if (originality > 80) {
      const highOriginality = [
        "🎨 Completely fresh. The kind of sound that makes record labels nervous.",
        "💡 Never heard anything quite like this. You're either a genius or insane. Probably both.",
        "🔥 Revolutionary. This is going to either change everything or get ignored completely.",
        "⚡ So original it's almost alien. Some people won't get it. Those people don't matter.",
        "🌟 This doesn't sound like anything else. That's either your greatest strength or your biggest weakness."
      ];
      feedbackPoints.push(...highOriginality.slice(0, 2));
    } else if (originality > 60) {
      const goodOriginality = [
        "🎨 Had some fresh ideas. Not groundbreaking, but interesting.",
        "💡 Unique twist on familiar sounds. Familiar enough to be safe, different enough to be noticed.",
        "📊 Solid attempt at something new. Didn't quite land, but the effort shows.",
        "🎯 Treading new ground. Carefully. Very carefully."
      ];
      feedbackPoints.push(...goodOriginality.slice(0, 2));
    } else if (originality > 40) {
      const mediocreOriginality = [
        "📋 Pretty familiar territory. We've heard this before, just with different lyrics.",
        "📋 Solid covers/riffs but not new. Competent, but forgettable.",
        "🔄 Derivative. Not in a good way. More like 'I've heard this exact song before' way.",
        "📉 Safe. Boring. Predictable. But safe."
      ];
      feedbackPoints.push(...mediocreOriginality.slice(0, 2));
    } else {
      const lowOriginality = [
        "🔄 Very derivative. Like, really derivative. Did you even try?",
        "🔄 Feeling pretty formulaic. The kind of song that plays in elevators.",
        "💀 Generic. So generic it hurts. Your mom would be proud, though.",
        "🔥 Completely unoriginal. But hey, at least it's consistent."
      ];
      feedbackPoints.push(...lowOriginality.slice(0, 2));
    }

    return feedbackPoints;
  }

  /**
   * Generate gritty emotional feedback
   */
  static _generateGrittyEmotionalFeedback(emotional, psychologicalState) {
    const { positivity = 0, intensity = 0, darkness = 0 } = typeof emotional === 'object' ? emotional : { positivity: 0, intensity: 0, darkness: 0 };
    const feedbackPoints = [];

    const emotionalPoints = [];
    if (positivity > 60) {
      emotionalPoints.push(
        "😊 Really lifted spirits. The kind of song that makes people forget their problems for three minutes.",
        "✨ Uplifting. Almost too uplifting. Like, suspiciously happy."
      );
    }
    if (darkness > 60) {
      emotionalPoints.push(
        "😔 Dealt with heavy themes. The kind that makes people uncomfortable. Good.",
        "💀 Dark. Really dark. The kind of dark that makes therapists take notes."
      );
      if (psychologicalState?.depression > 50) {
        emotionalPoints.push("🔥 You can hear the pain. Raw, unfiltered pain. Some people won't be able to handle it.");
      }
    }
    if (intensity > 70) {
      emotionalPoints.push(
        "🔥 Incredibly powerful and intense. The kind that leaves you exhausted after listening.",
        "⚡ So intense it's almost overwhelming. Almost."
      );
    }
    if (psychologicalState?.addiction_risk > 50 && intensity > 60) {
      emotionalPoints.push("💊 There's a manic energy here. Dangerous. Addictive. Real.");
    }
    feedbackPoints.push(...emotionalPoints);

    return feedbackPoints.length > 0 ? feedbackPoints : ["😐 Emotionally neutral. Safe. Boring. But safe."];
  }

  /**
   * Generate gritty fanbase-specific reactions
   */
  static _generateGrittyFanbaseReaction(fanbaseType, quality, originality, commercial, psychologicalState, genre) {
    const { addiction_risk = 0, moral_integrity = 100 } = psychologicalState || {};

    const reactions = {
      mainstream: {
        positive: [
          "This is going to be on every playlist! Your manager's already planning the tour.",
          "You've got another hit on your hands. The kind that makes you rich and hollow.",
          "Perfect radio-friendly track. It'll play in grocery stores and you'll hate hearing it in six months.",
          "The machine wants you. Congratulations. Or condolences. Depends on how you look at it."
        ],
        negative: [
          "Not catchy enough for mainstream audiences. Too much... you. Try being less you.",
          "Needs more commercial polish. Less art, more product.",
          "Too experimental. Mainstream audiences don't want to think, they want to feel good.",
          "This won't sell. But hey, at least it's honest."
        ],
        condition: commercial > 70
      },
      underground: {
        positive: [
          "Finally! A band not selling out! Keep this energy, don't let the industry ruin you.",
          "This is what real music sounds like. Raw, unfiltered, dangerous.",
          "Keep pushing the boundaries! The mainstream can't handle this, and that's exactly why it's perfect.",
          "Underground legend status. This is the kind of track that builds cults. Literally.",
          "You just made every major label nervous. Good. Make them nervous."
        ],
        negative: [
          "Too commercial for us. We can smell the sellout from a mile away.",
          "Feels too polished, lacking edge. Where's the danger? Where's the risk?",
          "This sounds like you're trying to get signed. Stop trying. Just be.",
          "The underground doesn't want safe. We want chaos. Give us chaos."
        ],
        condition: originality > 70 && commercial < 50
      },
      niche: {
        positive: [
          "You totally get our scene. This is exactly what we needed.",
          "Nailed the vibe perfectly. The kind of track that defines a movement.",
          "This is going to be our anthem. The one we play at every show, every party, every moment that matters.",
          "You understand us. That's rare. Don't forget that."
        ],
        negative: [
          "Doesn't quite fit our aesthetic. Close, but not quite there.",
          "Missing the genre conventions we love. Too experimental, or not experimental enough.",
          "We wanted more. More intensity, more authenticity, more... us.",
          "It's good, but it's not great. And we only accept great."
        ],
        condition: quality > 60
      },
      mixed: {
        positive: [
          "Something for everyone here. Which means it's for no one, but hey, you tried.",
          "Great variety in your sound. Or maybe you just can't decide what you want to be.",
          "Nice balance of familiar and fresh. Safe enough to be popular, different enough to be interesting.",
          "Pleasant. Inoffensive. The kind of music that plays in coffee shops."
        ],
        negative: [
          "Trying to please too many people. You can't be everything to everyone.",
          "Lacks a strong identity. Who are you? What do you stand for? We can't tell.",
          "Generic. Safe. Boring. But at least it won't offend anyone.",
          "This is the musical equivalent of beige. It exists, but why?"
        ],
        condition: true
      }
    };

    const fanReactions = reactions[fanbaseType] || reactions.mixed;
    const messages = fanReactions.condition ? fanReactions.positive : fanReactions.negative;
    let message = messages[Math.floor(Math.random() * messages.length)];

    // Add psychological state flavor
    if (addiction_risk > 50 && fanbaseType === 'underground') {
      message += " There's an edge here that wasn't there before. Dangerous. Real.";
    }
    if (moral_integrity < 50 && fanbaseType === 'mainstream') {
      message += " The industry will love this. That's not a compliment.";
    }

    return message;
  }

  /**
   * Generate gritty social media reactions
   */
  static _generateGrittySocialMedia(song, quality, originality, commercial, psychologicalState) {
    const bandName = song.metadata?.band || song.metadata?.bandName || 'Your Band';
    const songName = song.metadata?.name || 'Your Song';
    const tweets = [];
    const hashtags = [];

    // Generate hashtags
    if (originality > 75) hashtags.push('#NewSoundAlert', '#Revolutionary');
    if (quality > 80) hashtags.push('#BangersOnly', '#Perfection');
    if (commercial > 80) hashtags.push('#RadioReady', '#MainstreamBound');
    if (originality < 40) hashtags.push('#Generic', '#Derivative');
    if (psychologicalState?.addiction_risk > 50) hashtags.push('#Raw', '#Dangerous');
    if (psychologicalState?.moral_integrity < 50) hashtags.push('#Controversial', '#Problematic');

    const engagement = Math.round((quality + originality) / 2);

    // High engagement - positive reactions
    if (engagement > 75) {
      tweets.push(
        `OMG just heard ${songName} from ${bandName}. This is INSANE. I'm obsessed. ${hashtags.join(' ')}`,
        `${bandName} just dropped ${songName} and I'm not okay. This is going to be on repeat for WEEKS. ${hashtags.join(' ')}`,
        `I don't usually stan but ${bandName} just changed that. ${songName} is everything. ${hashtags.join(' ')}`,
        `Someone check on me I've listened to ${songName} 47 times today. ${bandName} did NOT have to go this hard. ${hashtags.join(' ')}`
      );
    }
    // Medium engagement - mixed reactions
    else if (engagement > 50) {
      tweets.push(
        `${bandName} just dropped ${songName}. Worth checking out! ${hashtags.join(' ')}`,
        `New ${songName} from ${bandName} is... interesting. Not sure how I feel yet. ${hashtags.join(' ')}`,
        `${songName} is good. Not great, but good. ${bandName} is getting there. ${hashtags.join(' ')}`,
        `I like ${songName} but I don't love it. ${bandName} has potential though. ${hashtags.join(' ')}`
      );
    }
    // Low engagement - negative reactions
    else {
      tweets.push(
        `New ${songName} from ${bandName} is... something. ${hashtags.join(' ')}`,
        `${bandName} really thought they did something with ${songName}. They didn't. ${hashtags.join(' ')}`,
        `I wanted to like ${songName} but... yeah. ${bandName} needs to go back to the drawing board. ${hashtags.join(' ')}`,
        `${songName} exists. That's about all I can say about it. ${hashtags.join(' ')}`
      );
    }

    // Add obsessive/controversial tweets if applicable
    if (psychologicalState?.addiction_risk > 50 && engagement > 60) {
      tweets.push(
        `${bandName} is speaking directly to my soul. ${songName} understands me in ways no one else does. ${hashtags.join(' ')}`,
        `I've been listening to ${songName} on repeat for 6 hours. This is fine. Everything is fine. ${hashtags.join(' ')}`
      );
    }

    if (psychologicalState?.moral_integrity < 50 && engagement > 70) {
      tweets.push(
        `${songName} is problematic and I'm here for it. ${bandName} doesn't care about your feelings and I respect that. ${hashtags.join(' ')}`,
        `Everyone's mad about ${songName} but they're all still listening. ${bandName} wins again. ${hashtags.join(' ')}`
      );
    }

    const reach = Math.round((fanbase?.size || 100) * (engagement / 100) * 10);

    return {
      tweets: tweets.slice(0, 5), // Limit to 5 tweets
      hashtags,
      engagement,
      reach,
      trending: engagement > 75,
      controversial: psychologicalState?.moral_integrity < 50 && engagement > 60
    };
  }

  /**
   * Calculate obsession change (new metric)
   */
  static _calculateObsessionChange(quality, originality, psychologicalState) {
    let obsession = 0;

    // High quality + originality creates obsession
    if (quality > 80 && originality > 70) {
      obsession += 10;
    }

    // Psychological state affects obsession
    if (psychologicalState?.addiction_risk > 50) {
      obsession += 5; // Addicted fans are more obsessive
    }

    // Low moral integrity creates controversy obsession
    if (psychologicalState?.moral_integrity < 50 && quality > 60) {
      obsession += 8; // Controversial but good = obsessed fans
    }

    return Math.min(100, Math.max(0, obsession));
  }

  /**
   * Calculate controversy level
   */
  static _calculateControversyLevel(quality, originality, commercial, psychologicalState) {
    let controversy = 0;

    // High originality can be controversial
    if (originality > 85) {
      controversy += 20;
    }

    // Low moral integrity = controversy
    if (psychologicalState?.moral_integrity < 50) {
      controversy += 30;
    }

    // High commercial + low originality = sellout controversy
    if (commercial > 80 && originality < 40) {
      controversy += 15;
    }

    // Addiction-related content
    if (psychologicalState?.addiction_risk > 50) {
      controversy += 10;
    }

    return Math.min(100, Math.max(0, controversy));
  }

  // ===== ORIGINAL METHODS (for backward compatibility) =====

  /**
   * Generate overall reaction message (original)
   */
  static _generateOverallReaction(quality, commercial, fanboseType) {
    const messages = [];

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

    if (commercial > 80 && fanboseType === 'mainstream') {
      messages.push("Radio stations are already picking this up!");
    } else if (commercial < 30 && fanboseType === 'underground') {
      messages.push("The underground loved how experimental it was.");
    }

    return messages.join(" ");
  }

  /**
   * Generate quality-specific feedback (original)
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
   * Generate originality-specific feedback (original)
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
   * Generate emotional response feedback (original)
   */
  static _generateEmotionalFeedback(emotional) {
    const { positivity = 0, intensity = 0, darkness = 0 } = typeof emotional === 'object' ? emotional : { positivity: 0, intensity: 0, darkness: 0 };
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
   * Generate fanbase-specific reactions (original)
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

    fameGain += quality * 0.5;
    fameGain += originality * 0.3;
    fameGain += commercial * 0.2;
    fameGain *= (fanboseSize / 100);

    return Math.round(fameGain);
  }

  /**
   * Calculate money gain (from concert/radio)
   */
  static _calculateMoneyGain(commercial, fanboseSize) {
    const commercialFactor = commercial / 100;
    const baseMoney = fanboseSize * 10;

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

    if (quality > 70) {
      effects.confidence_change = +(quality - 50) / 3;
      effects.ego_change = +(originality - 50) / 5;
    } else {
      effects.confidence_change = -(50 - quality) / 5;
      effects.stress_change = +(50 - quality) / 5;
    }

    if (originality > 70) {
      effects.burnout_change = -5;
    } else if (originality < 30) {
      effects.burnout_change = +10;
    }

    return effects;
  }

  /**
   * Calculate loyalty change
   */
  static _calculateLoyaltyChange(quality, originality, fanboseType, currentLoyalty) {
    let loyaltyChange = 0;

    if (quality > 75) {
      loyaltyChange += 5;
    } else if (quality < 40) {
      loyaltyChange -= 3;
    }

    if (fanboseType === 'mainstream' && quality > 70) {
      loyaltyChange += 3;
    } else if (fanboseType === 'underground' && originality > 70) {
      loyaltyChange += 4;
    } else if (fanboseType === 'niche' && originality > 60) {
      loyaltyChange += 2;
    }

    if (currentLoyalty > 85) {
      loyaltyChange *= 0.5;
    }

    return loyaltyChange;
  }

  /**
   * Generate social media narrative (original)
   */
  static generateSocialMediaBuzz(song, fanbase, reactionData) {
    const { quality, originality, commercial } = {
      quality: song.analysis?.qualityScore || song.quality || 50,
      originality: song.analysis?.originalityScore || song.originality || 50,
      commercial: song.analysis?.commercialViability || song.commercial || 50
    };

    const tweets = [];
    const engagement = Math.round((quality + originality) / 2);
    const hashtags = [];

    if (originality > 75) hashtags.push('#NewSoundAlert');
    if (quality > 80) hashtags.push('#BangersOnly');
    if (commercial > 80) hashtags.push('#RadioReady');
    if (originality < 40) hashtags.push('#CoversAllDay');

    const bandName = song.metadata?.band || 'Your Band';
    if (engagement > 75) {
      tweets.push(
        `OMG just heard the new track from ${bandName}. This is INSANE! ${hashtags.join(' ')}`,
        `Alright I'm obsessed with ${bandName}'s new direction. So good.`
      );
    } else if (engagement > 50) {
      tweets.push(`${bandName} just dropped a new track. Worth checking out! ${hashtags.join(' ')}`);
    } else {
      tweets.push(`New ${bandName} track is... something. ${hashtags.join(' ')}`);
    }

    const reach = Math.round((fanbase?.size || 100) * (engagement / 100) * 10);

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
