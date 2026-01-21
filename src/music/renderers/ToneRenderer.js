/**
 * ToneRenderer - Converts generated music to audio via Tone.js
 * 
 * Renders drums, harmony, and melody as playable audio.
 * Handles synth synthesis, timing, and real-time playback.
 */

import * as Tone from 'tone';

export class ToneRenderer {
  constructor() {
    this.isInitialized = false;
    this.isPlaying = false;
    this.currentTime = 0;
    
    // Synth instances
    this.melodySynth = null;
    this.harmonyVoices = [];
    this.drums = {
      kick: null,
      snare: null,
      hihat: null
    };
    
    this.scheduledNotes = [];
    this.currentSong = null;
  }

  /**
   * Initialize Tone.js context and synths
   */
  async initialize() {
    if (this.isInitialized) return;
    
    // Start Tone.js audio context
    await Tone.start();
    
    // Create melody synth (simple PolySynth)
    this.melodySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 0.5
      }
    }).toDestination();
    this.melodySynth.volume.value = -8;

    // Create harmony voices (4-voice polyphony for chords)
    for (let i = 0; i < 4; i++) {
      const voice = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.01,
          decay: 0.15,
          sustain: 0.2,
          release: 0.6
        }
      }).toDestination();
      voice.volume.value = -12 + (i * -1); // Slightly quieter
      this.harmonyVoices.push(voice);
    }

    // Create drum synths
    this.drums.kick = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0,
        release: 0.1
      }
    }).toDestination();
    this.drums.kick.volume.value = -6;

    this.drums.snare = new Tone.MembraneSynth({
      pitchDecay: 0.08,
      octaves: 1,
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0,
        release: 0.1
      }
    }).toDestination();
    this.drums.snare.volume.value = -8;

    // Hi-hat (high-frequency click)
    this.drums.hihat = new Tone.MetalSynth({
      frequency: 200,
      envelope: {
        attack: 0.001,
        decay: 0.1,
        release: 0
      },
      harmonics: [12, 8, 4]
    }).toDestination();
    this.drums.hihat.volume.value = -14;

    this.isInitialized = true;
  }

  /**
   * Render complete song to audio
   */
  async render(song) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    this.currentSong = song;
    const { composition, musicalContent } = song;
    
    // Convert BPM to seconds per beat
    const bpm = composition.tempo;
    const secondsPerBeat = 60 / bpm;
    
    // Schedule all notes
    this._scheduleDrumPattern(musicalContent.drums, secondsPerBeat);
    this._scheduleHarmonyProgression(musicalContent.harmony, secondsPerBeat);
    this._scheduleMelody(musicalContent.melody, secondsPerBeat);
    
    return {
      tempo: bpm,
      duration: this._calculateDuration(secondsPerBeat),
      scheduledNotes: this.scheduledNotes.length
    };
  }

  /**
   * Play rendered song
   */
  async play() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.isPlaying) return;

    this.isPlaying = true;
    
    // Trigger all scheduled notes
    this.scheduledNotes.forEach(note => {
      Tone.Transport.schedule((time) => {
        this._playNote(note, time);
      }, note.time);
    });

    // Start transport
    Tone.Transport.start();
  }

  /**
   * Stop playback
   */
  stop() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    this.isPlaying = false;
    this.scheduledNotes = [];
  }

  /**
   * Pause playback
   */
  pause() {
    Tone.Transport.pause();
    this.isPlaying = false;
  }

  /**
   * Resume playback
   */
  resume() {
    if (!this.isPlaying) {
      Tone.Transport.start();
      this.isPlaying = true;
    }
  }

  /**
   * Schedule drum pattern playback
   */
  _scheduleDrumPattern(drumData, secondsPerBeat) {
    const { pattern, tempo } = drumData;
    if (!pattern) return;

    const { kick = [], snare = [], hihat = [], ghostSnare = [] } = pattern;

    // Schedule kick drum
    kick.forEach(beatTime => {
      this.scheduledNotes.push({
        type: 'kick',
        time: beatTime * secondsPerBeat,
        velocity: 1.0
      });
    });

    // Schedule snare
    snare.forEach(beatTime => {
      this.scheduledNotes.push({
        type: 'snare',
        time: beatTime * secondsPerBeat,
        velocity: 1.0
      });
    });

    // Schedule hi-hat
    hihat.forEach(beatTime => {
      this.scheduledNotes.push({
        type: 'hihat',
        time: beatTime * secondsPerBeat,
        velocity: 0.7
      });
    });

    // Schedule ghost snare (quieter)
    if (ghostSnare) {
      ghostSnare.forEach(beatTime => {
        this.scheduledNotes.push({
          type: 'snare',
          time: beatTime * secondsPerBeat,
          velocity: 0.4
        });
      });
    }
  }

  /**
   * Schedule harmony chord progressions
   */
  _scheduleHarmonyProgression(harmonyData, secondsPerBeat) {
    const { progression } = harmonyData;
    if (!progression || !progression.chords) return;

    const chords = progression.chords;
    const beatDuration = 4; // Assume 4 beats per chord

    chords.forEach((chord, index) => {
      const startTime = index * beatDuration * secondsPerBeat;
      const duration = beatDuration * secondsPerBeat;

      // Get chord notes (simplified - just use note names)
      const notes = this._getChordNotes(chord);
      
      notes.forEach((note, voiceIndex) => {
        if (voiceIndex < this.harmonyVoices.length) {
          this.scheduledNotes.push({
            type: 'harmony',
            note,
            time: startTime,
            duration,
            voiceIndex
          });
        }
      });
    });
  }

  /**
   * Schedule melody playback
   */
  _scheduleMelody(melodyData, secondsPerBeat) {
    const { melody, songStructure } = melodyData;
    if (!melody || melody.length === 0) return;

    let currentTime = 0;

    melody.forEach(section => {
      section.phrases.forEach(phrase => {
        if (!phrase.notes) return;

        phrase.notes.forEach((noteValue, noteIndex) => {
          const duration = (phrase.durations?.[noteIndex] || 1) * secondsPerBeat;
          const note = this._scaleDegreeToNote(noteValue, 'C', 'major');

          this.scheduledNotes.push({
            type: 'melody',
            note,
            time: currentTime,
            duration,
            velocity: 0.8
          });

          currentTime += duration;
        });
      });
    });
  }

  /**
   * Play individual note
   */
  _playNote(note, time) {
    switch (note.type) {
      case 'kick':
        this.drums.kick.triggerAttackRelease('C1', '0.4', time);
        break;

      case 'snare':
        this.drums.snare.triggerAttackRelease('C2', '0.2', time);
        break;

      case 'hihat':
        this.drums.hihat.triggerAttackRelease('16n', time);
        break;

      case 'harmony':
        if (this.harmonyVoices[note.voiceIndex]) {
          this.harmonyVoices[note.voiceIndex].triggerAttackRelease(
            note.note,
            note.duration,
            time
          );
        }
        break;

      case 'melody':
        this.melodySynth.triggerAttackRelease(
          note.note,
          note.duration,
          time
        );
        break;
    }
  }

  /**
   * Convert scale degree to note name
   */
  _scaleDegreeToNote(degree, key = 'C', mode = 'major') {
    const majorScale = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const noteIndex = degree % 7;
    const octave = Math.floor(degree / 7) + 4;
    
    return majorScale[noteIndex] + octave;
  }

  /**
   * Get notes for chord symbol
   */
  _getChordNotes(chordSymbol) {
    const chordMap = {
      'C': ['C3', 'E3', 'G3', 'C4'],
      'Am': ['A2', 'C3', 'E3', 'A3'],
      'F': ['F2', 'A2', 'C3', 'F3'],
      'G': ['G2', 'B2', 'D3', 'G3'],
      'Em': ['E2', 'G2', 'B2', 'E3'],
      'Dm': ['D2', 'F2', 'A2', 'D3'],
      'D': ['D2', 'F#2', 'A2', 'D3'],
      'E': ['E2', 'G#2', 'B2', 'E3'],
      'A': ['A2', 'C#3', 'E3', 'A3'],
      'B': ['B2', 'D#3', 'F#3', 'B3']
    };

    return chordMap[chordSymbol] || ['C3', 'E3', 'G3', 'C4'];
  }

  /**
   * Calculate total duration
   */
  _calculateDuration(secondsPerBeat) {
    if (this.scheduledNotes.length === 0) return 0;
    
    const lastNote = this.scheduledNotes.reduce((max, note) => {
      const noteEnd = (note.time || 0) + (note.duration || 0);
      return Math.max(max, noteEnd);
    }, 0);

    return lastNote;
  }

  /**
   * Dispose resources
   */
  dispose() {
    this.stop();
    
    if (this.melodySynth) this.melodySynth.dispose();
    this.harmonyVoices.forEach(voice => voice.dispose());
    
    if (this.drums.kick) this.drums.kick.dispose();
    if (this.drums.snare) this.drums.snare.dispose();
    if (this.drums.hihat) this.drums.hihat.dispose();
    
    this.isInitialized = false;
  }
}

export default ToneRenderer;
