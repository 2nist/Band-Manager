/**
 * MIDIExporter - Converts generated songs to MIDI format
 * 
 * Exports drums, harmony, and melody as separate MIDI tracks.
 * Compatible with DAWs and TrackDraft project import.
 */

export class MIDIExporter {
  /**
   * Export song to MIDI data
   * @param {Object} song - Generated song from MusicGenerator
   * @param {Object} options - Export options
   * @returns {Object} MIDI data that can be saved/played
   */
  static exportToMIDI(song, options = {}) {
    const { includeMetadata = true } = options;
    
    const midiData = {
      header: {
        format: 1, // Multi-track format
        trackCount: 3, // Drums, Harmony, Melody
        division: 480 // PPQN (Pulses Per Quarter Note)
      },
      metadata: includeMetadata ? this._generateMetadata(song) : {},
      tracks: [
        this._createDrumTrack(song),
        this._createHarmonyTrack(song),
        this._createMelodyTrack(song)
      ]
    };

    return midiData;
  }

  /**
   * Create drum track
   */
  static _createDrumTrack(song) {
    const { musicalContent, composition } = song;
    const { drums } = musicalContent;
    const { tempo } = composition;
    
    const track = {
      name: 'Drums',
      channel: 9, // MIDI drum channel
      program: 0,
      events: [],
      tempo
    };

    // Add tempo event
    track.events.push({
      type: 'tempo',
      bpm: tempo,
      tick: 0
    });

    if (!drums.pattern) return track;

    const { pattern } = drums;
    const secondsPerBeat = 60 / tempo;
    const ticksPerBeat = 480; // Standard PPQN

    // Drum note mapping (GM standard)
    const drumNotes = {
      kick: 36,    // Acoustic Bass Drum
      snare: 38,   // Acoustic Snare
      hihat: 42    // Closed Hi-Hat
    };

    // Add kick drum notes
    if (pattern.kick) {
      pattern.kick.forEach(beatTime => {
        track.events.push({
          type: 'note',
          note: drumNotes.kick,
          velocity: 100,
          tick: Math.round(beatTime * ticksPerBeat),
          duration: Math.round(0.5 * ticksPerBeat)
        });
      });
    }

    // Add snare notes
    if (pattern.snare) {
      pattern.snare.forEach(beatTime => {
        track.events.push({
          type: 'note',
          note: drumNotes.snare,
          velocity: 100,
          tick: Math.round(beatTime * ticksPerBeat),
          duration: Math.round(0.5 * ticksPerBeat)
        });
      });
    }

    // Add hi-hat notes
    if (pattern.hihat) {
      pattern.hihat.forEach(beatTime => {
        track.events.push({
          type: 'note',
          note: drumNotes.hihat,
          velocity: 70,
          tick: Math.round(beatTime * ticksPerBeat),
          duration: Math.round(0.25 * ticksPerBeat)
        });
      });
    }

    // Sort events by tick
    track.events.sort((a, b) => a.tick - b.tick);

    return track;
  }

  /**
   * Create harmony track (chords)
   */
  static _createHarmonyTrack(song) {
    const { musicalContent, composition } = song;
    const { harmony } = musicalContent;
    const { tempo } = composition;

    const track = {
      name: 'Harmony',
      channel: 0,
      program: 0, // Piano
      events: [],
      tempo
    };

    // Add tempo event
    track.events.push({
      type: 'tempo',
      bpm: tempo,
      tick: 0
    });

    if (!harmony.progression || !harmony.progression.chords) return track;

    const { progression } = harmony;
    const chords = progression.chords;
    const ticksPerBeat = 480;
    const beatDuration = 4; // 4 beats per chord

    // Note frequency map (C major scale)
    const noteMap = {
      'C': 60, 'D': 62, 'E': 64, 'F': 65, 'G': 67, 'A': 69, 'B': 71,
      'C#': 61, 'Db': 61, 'D#': 63, 'Eb': 63, 'F#': 66, 'Gb': 66, 'G#': 68, 'Ab': 68, 'A#': 70, 'Bb': 70
    };

    chords.forEach((chord, index) => {
      const tick = index * beatDuration * ticksPerBeat;
      const duration = beatDuration * ticksPerBeat;

      // Extract individual notes from chord symbol
      const notes = this._extractChordNotes(chord, noteMap);

      notes.forEach((note, octaveOffset) => {
        track.events.push({
          type: 'note',
          note: note + (octaveOffset * 12),
          velocity: 80 - (octaveOffset * 10),
          tick,
          duration
        });
      });
    });

    return track;
  }

  /**
   * Create melody track
   */
  static _createMelodyTrack(song) {
    const { musicalContent, composition } = song;
    const { melody } = musicalContent;
    const { tempo } = composition;

    const track = {
      name: 'Melody',
      channel: 1,
      program: 0, // Piano
      events: [],
      tempo
    };

    // Add tempo event
    track.events.push({
      type: 'tempo',
      bpm: tempo,
      tick: 0
    });

    if (!melody || melody.length === 0) return track;

    const ticksPerBeat = 480;
    const secondsPerBeat = 60 / tempo;
    let currentTick = 0;

    melody.forEach(section => {
      if (!section.phrases) return;

      section.phrases.forEach(phrase => {
        if (!phrase.notes) return;

        phrase.notes.forEach((noteValue, noteIndex) => {
          const noteDuration = phrase.durations?.[noteIndex] || 1;
          const duration = Math.round(noteDuration * ticksPerBeat);

          // Convert scale degree to MIDI note (C4 = 60)
          const midiNote = 60 + noteValue; // Simple mapping

          track.events.push({
            type: 'note',
            note: midiNote,
            velocity: 100,
            tick: currentTick,
            duration
          });

          currentTick += duration;
        });
      });
    });

    return track;
  }

  /**
   * Extract notes from chord symbol
   */
  static _extractChordNotes(chordSymbol, noteMap) {
    const chordMap = {
      'C': [60, 64, 67],
      'Cm': [60, 63, 67],
      'C7': [60, 64, 67, 70],
      'Cmaj7': [60, 64, 67, 71],
      'Cm7': [60, 63, 67, 70],
      'D': [62, 66, 69],
      'Dm': [62, 65, 69],
      'D7': [62, 66, 69, 72],
      'E': [64, 68, 71],
      'Em': [64, 67, 71],
      'E7': [64, 68, 71, 74],
      'F': [65, 69, 72],
      'Fm': [65, 68, 72],
      'F7': [65, 69, 72, 75],
      'G': [67, 71, 74],
      'Gm': [67, 70, 74],
      'G7': [67, 71, 74, 77],
      'A': [69, 73, 76],
      'Am': [69, 72, 76],
      'A7': [69, 73, 76, 79],
      'B': [71, 75, 78],
      'Bm': [71, 74, 78],
      'B7': [71, 75, 78, 81]
    };

    return chordMap[chordSymbol] || [60, 64, 67]; // Default C major
  }

  /**
   * Generate MIDI metadata
   */
  static _generateMetadata(song) {
    const { metadata, gameContext } = song;

    return {
      title: metadata.name,
      composer: metadata.band,
      genre: metadata.genre,
      tempo: gameContext.constraints.bandConstraints.overallSkill,
      week: metadata.week,
      seed: metadata.seed,
      generatedAt: new Date(metadata.generatedAt).toISOString(),
      bandSkill: gameContext.bandSkill,
      bandConfidence: gameContext.bandConfidence,
      psychologicalState: gameContext.psychologicalState
    };
  }

  /**
   * Convert MIDI data to binary format (simplified)
   * For full implementation, use a library like jsmidgen
   */
  static midiDataToBinary(midiData) {
    // Placeholder - actual implementation would encode to standard MIDI format
    // For now, return JSON representation that can be saved
    return JSON.stringify(midiData);
  }

  /**
   * Create downloadable MIDI file
   */
  static downloadMIDI(song, filename = 'song.mid') {
    const midiData = this.exportToMIDI(song);
    const dataStr = JSON.stringify(midiData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Create TrackDraft compatible MIDI
   * TrackDraft expects specific format/metadata
   */
  static createTrackDraftProject(song, options = {}) {
    const { projectName = 'GigMaster Export' } = options;
    
    const midiData = this.exportToMIDI(song);

    return {
      project: {
        name: projectName,
        version: '1.0',
        createdAt: new Date().toISOString(),
        source: 'GigMaster Music Generator'
      },
      song: {
        title: song.metadata.name,
        artist: song.metadata.band,
        genre: song.metadata.genre,
        tempo: song.composition.tempo,
        key: song.composition.key,
        mode: song.composition.mode,
        originalityScore: song.analysis.originalityScore,
        commercialViability: song.analysis.commercialViability,
        qualityScore: song.analysis.qualityScore
      },
      midi: midiData,
      gameContext: {
        band: song.metadata.band,
        week: song.metadata.week,
        gameState: song.gameContext
      }
    };
  }
}

export default MIDIExporter;
