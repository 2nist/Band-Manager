/**
 * ToneRenderer - Converts generated music to audio via Tone.js
 * 
 * Renders drums, harmony, and melody as playable audio.
 * Handles synth synthesis, timing, and real-time playback.
 * Includes genre-specific and instrument-specific audio effects.
 */

import * as Tone from 'tone';
import { getGenreEffects, adjustEffectsForGameState, DEFAULT_EFFECTS } from './EffectsConfig.js';
import { getKeyboardTypeForGenre } from './KeyboardConfig.js';
import { SeededRandom } from '../utils/SeededRandom.js';

export class ToneRenderer {
  constructor() {
    this.isInitialized = false;
    this.isPlaying = false;
    this.currentTime = 0;
    
    // Synth instances
    this.melodySynth = null;
    this.harmonyVoices = [];
    this.keyboardSynth = null;
    this.keyboardType = null; // 'piano', 'electric-piano', 'synth'
    this.drums = {
      kick: null,
      snare: null,
      hihat: null
    };
    
    // Effect chains
    this.masterEffects = {
      reverb: null,
      compressor: null
    };
    this.melodyEffects = {
      distortion: null,
      delay: null,
      chorus: null,
      filter: null
    };
    this.harmonyEffects = {
      reverb: null,
      chorus: null,
      distortion: null,
      filter: null
    };
    this.drumEffects = {
      compression: null,
      reverb: null,
      distortion: null,
      filter: null
    };
    
    // Member skill traits for playback
    this.memberTraits = {
      drummer: null,
      guitarist: null,
      'lead-guitar': null,
      'rhythm-guitar': null,
      bassist: null,
      vocalist: null,
      keyboardist: null
    };
    
    // Member tone settings (volume, effects)
    this.memberToneSettings = {
      drummer: null,
      guitarist: null,
      'lead-guitar': null,
      'rhythm-guitar': null,
      bassist: null,
      vocalist: null,
      keyboardist: null
    };
    
    this.scheduledNotes = [];
    this.currentSong = null;
    this.traitRNG = null; // Seeded RNG for deterministic trait effects
  }

  /**
   * Initialize Tone.js context and synths with effects
   */
  async initialize(song = null) {
    if (this.isInitialized) {
      // Re-initialize effects if song changed
      if (song) {
        await this._setupEffects(song);
      }
      return;
    }
    
    // Start Tone.js audio context
    await Tone.start();
    
    // Create master effects chain first
    this.masterEffects.compressor = new Tone.Compressor({
      threshold: -22,
      ratio: 4,
      attack: 0.005,
      release: 0.1
    });
    
    this.masterEffects.reverb = new Tone.Reverb({
      roomSize: 0.3,
      dampening: 2000,
      wet: 0.1
    });
    
    // Connect master effects
    this.masterEffects.compressor.connect(this.masterEffects.reverb);
    this.masterEffects.reverb.toDestination();
    
    // Create keyboard effects BEFORE _setupEffects (needed by _initializeKeyboard)
    this.keyboardEffects = {
      reverb: new Tone.Reverb({ roomSize: 0.4, wet: 0 }),
      chorus: new Tone.Chorus(1.2, 2.5, 0.5),
      filter: new Tone.Filter(8000, 'lowpass'),
      delay: new Tone.FeedbackDelay('8n', 0)
    };
    
    // Create melody synth with effects
    this.melodySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: {
        attack: 0.005,
        decay: 0.1,
        sustain: 0.3,
        release: 0.5
      }
    });
    
    // Create melody effects
    this.melodyEffects.distortion = new Tone.Distortion(0);
    this.melodyEffects.delay = new Tone.FeedbackDelay('8n', 0);
    this.melodyEffects.chorus = new Tone.Chorus(1.5, 3.5, 0.7);
    this.melodyEffects.filter = new Tone.Filter(8000, 'lowpass');
    
    // Connect melody chain: synth -> filter -> distortion -> delay -> chorus -> master
    this.melodySynth
      .connect(this.melodyEffects.filter)
      .connect(this.melodyEffects.distortion)
      .connect(this.melodyEffects.delay)
      .connect(this.melodyEffects.chorus)
      .connect(this.masterEffects.compressor);
    
    this.melodySynth.volume.value = -8;
    
    // Connect keyboard effects (already created above)
    this.keyboardEffects.filter
      .connect(this.keyboardEffects.chorus)
      .connect(this.keyboardEffects.delay)
      .connect(this.keyboardEffects.reverb)
      .connect(this.masterEffects.compressor);
    
    // Setup effects AFTER keyboard effects are created (needed by _initializeKeyboard)
    if (song) {
      await this._setupEffects(song);
    }

    // Create harmony voices (4-voice polyphony for chords) with effects
    this.harmonyEffects.reverb = new Tone.Reverb({ roomSize: 0.3, wet: 0 });
    this.harmonyEffects.chorus = new Tone.Chorus(1.2, 2.5, 0.5);
    this.harmonyEffects.distortion = new Tone.Distortion(0);
    this.harmonyEffects.filter = new Tone.Filter(5000, 'lowpass');
    
    // Connect harmony effects
    this.harmonyEffects.filter
      .connect(this.harmonyEffects.distortion)
      .connect(this.harmonyEffects.chorus)
      .connect(this.harmonyEffects.reverb)
      .connect(this.masterEffects.compressor);
    
    for (let i = 0; i < 4; i++) {
      const voice = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.01,
          decay: 0.15,
          sustain: 0.2,
          release: 0.6
        }
      });
      voice.connect(this.harmonyEffects.filter);
      voice.volume.value = -12 + (i * -1); // Slightly quieter
      this.harmonyVoices.push(voice);
    }

    // Create drum synths with effects
    this.drumEffects.compression = new Tone.Compressor({
      threshold: -20,
      ratio: 5,
      attack: 0.002,
      release: 0.1
    });
    this.drumEffects.reverb = new Tone.Reverb({ roomSize: 0.2, wet: 0 });
    this.drumEffects.distortion = new Tone.Distortion(0);
    // Use lowpass filter for drums to preserve low frequencies (kick needs bass)
    this.drumEffects.filter = new Tone.Filter(8000, 'lowpass');
    
    // Connect drum effects
    this.drumEffects.filter
      .connect(this.drumEffects.distortion)
      .connect(this.drumEffects.compression)
      .connect(this.drumEffects.reverb)
      .connect(this.masterEffects.compressor);
    
    // Kick drum - use MembraneSynth for better kick sound (more realistic)
    this.drums.kick = new Tone.MembraneSynth({
      pitchDecay: 0.05,
      octaves: 10,
      oscillator: {
        type: 'sine'
      },
      envelope: {
        attack: 0.001,
        decay: 0.4,
        sustain: 0,
        release: 0.1
      }
    });
    this.drums.kick.connect(this.drumEffects.filter);
    this.drums.kick.volume.value = 0; // Increased from -6 to 0 for better audibility

    // Snare drum
    this.drums.snare = new Tone.MembraneSynth({
      pitchDecay: 0.08,
      octaves: 1,
      envelope: {
        attack: 0.001,
        decay: 0.2,
        sustain: 0,
        release: 0.1
      }
    });
    this.drums.snare.connect(this.drumEffects.filter);
    this.drums.snare.volume.value = -2; // Increased from -8 to -2

    // Hi-hat (high-frequency click)
    this.drums.hihat = new Tone.MetalSynth({
      frequency: 200,
      envelope: {
        attack: 0.001,
        decay: 0.1,
        release: 0
      },
      harmonics: [12, 8, 4]
    });
    this.drums.hihat.connect(this.drumEffects.filter);
    this.drums.hihat.volume.value = -8; // Increased from -14 to -8

    // Keyboard will be initialized when song is rendered (needs genre info)
    this.keyboardSynth = null;
    this.keyboardType = null;

    this.isInitialized = true;
  }
  
  /**
   * Initialize keyboard synth based on genre
   */
  async _initializeKeyboard(genre) {
    // Ensure keyboardEffects exists
    if (!this.keyboardEffects || !this.keyboardEffects.reverb) {
      console.warn('_initializeKeyboard: keyboardEffects not initialized, creating defaults');
      this.keyboardEffects = {
        reverb: new Tone.Reverb({ roomSize: 0.4, wet: 0 }),
        chorus: new Tone.Chorus(1.2, 2.5, 0.5),
        filter: new Tone.Filter(8000, 'lowpass'),
        delay: new Tone.FeedbackDelay('8n', 0)
      };
    }
    if (this.keyboardSynth && this.keyboardType === getKeyboardTypeForGenre(genre)) {
      return; // Already initialized with correct type
    }
    
    // Dispose old keyboard if exists
    if (this.keyboardSynth) {
      this.keyboardSynth.dispose();
    }
    
    const keyboardType = getKeyboardTypeForGenre(genre);
    this.keyboardType = keyboardType;
    
    switch (keyboardType) {
      case 'piano':
        // Acoustic piano - use FM synth for piano-like sound
        this.keyboardSynth = new Tone.PolySynth(Tone.FMSynth, {
          harmonicity: 3,
          modulationIndex: 10,
          detune: 0,
          oscillator: {
            type: 'sine'
          },
          envelope: {
            attack: 0.01,
            decay: 0.3,
            sustain: 0.1,
            release: 0.5
          },
          modulation: {
            type: 'square'
          },
          modulationEnvelope: {
            attack: 0.5,
            decay: 0.01,
            sustain: 1,
            release: 0.5
          }
        });
        // Piano effects - more reverb, less distortion
        await this.keyboardEffects.reverb.set({ roomSize: 0.6 });
        this.keyboardEffects.reverb.wet.value = 0.3;
        this.keyboardEffects.chorus.set({ frequency: 0.8, delayTime: 2, depth: 0.4 });
        this.keyboardEffects.chorus.wet.value = 0.15;
        break;
        
      case 'electric-piano':
        // Electric piano - Rhodes/Wurlitzer style
        this.keyboardSynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: {
            type: 'triangle'
          },
          envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.3,
            release: 0.4
          }
        });
        // Electric piano effects - chorus, light reverb
        await this.keyboardEffects.reverb.set({ roomSize: 0.4 });
        this.keyboardEffects.reverb.wet.value = 0.2;
        this.keyboardEffects.chorus.set({ frequency: 1.5, delayTime: 3, depth: 0.6 });
        this.keyboardEffects.chorus.wet.value = 0.3;
        break;
        
      case 'synth':
        // Synthesizer - electronic sound
        this.keyboardSynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: {
            type: 'sawtooth'
          },
          envelope: {
            attack: 0.01,
            decay: 0.2,
            sustain: 0.3,
            release: 0.3
          }
        });
        // Synth effects - filter sweeps, delay
        this.keyboardEffects.filter.set({ frequency: 4000, type: 'lowpass', Q: 2 });
        this.keyboardEffects.delay.set({ delayTime: '8n', feedback: 0.3 });
        this.keyboardEffects.delay.wet.value = 0.2;
        this.keyboardEffects.chorus.set({ frequency: 2, delayTime: 4, depth: 0.7 });
        this.keyboardEffects.chorus.wet.value = 0.25;
        break;
        
      default:
        // Fallback to electric piano
        this.keyboardSynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.3,
            release: 0.4
          }
        });
    }
    
    // Connect keyboard to effects
    this.keyboardSynth.connect(this.keyboardEffects.filter);
    this.keyboardSynth.volume.value = -10;
  }
  
  /**
   * Setup effects based on song genre and game state
   */
  async _setupEffects(song) {
    const genre = song?.composition?.genre || song?.metadata?.genre || 'rock';
    const gameState = song?.gameContext || {};
    
    // Initialize keyboard based on genre
    await this._initializeKeyboard(genre);
    
    // Get genre-specific effects
    let baseEffects = getGenreEffects(genre);
    
    // Ensure baseEffects is valid
    if (!baseEffects || typeof baseEffects !== 'object') {
      console.error('_setupEffects: Invalid baseEffects, using DEFAULT_EFFECTS', { genre, baseEffects });
      baseEffects = DEFAULT_EFFECTS;
    }
    
    // Adjust for game state - pass the full gameContext for proper extraction
    const effects = adjustEffectsForGameState(baseEffects, {
      ...gameState,
      equipmentQuality: gameState.equipmentQuality || gameState.contextConstraints?.equipmentQuality,
      studioQuality: gameState.studioQuality || gameState.contextConstraints?.studioQuality,
      gearTier: gameState.gearTier,
      studioTier: gameState.studioTier,
      psychState: gameState.psychState || gameState.psychologicalState || gameState.psychConstraints,
      constraints: gameState.constraints
    });
    
    // Ensure effects object is valid
    if (!effects || typeof effects !== 'object') {
      console.error('_setupEffects: Invalid effects after adjustment', { effects });
      throw new Error('Failed to generate effects configuration');
    }
    
    // Apply master effects
    if (effects.master) {
      if (effects.master.reverb && this.masterEffects.reverb) {
        const reverb = effects.master.reverb;
        await this.masterEffects.reverb.set({
          roomSize: reverb.roomSize || 0.3,
          dampening: reverb.dampening || 2000
        });
        this.masterEffects.reverb.wet.value = reverb.wet || 0.1;
      }
      if (effects.master.compression && this.masterEffects.compressor) {
        const comp = effects.master.compression;
        this.masterEffects.compressor.set({
          threshold: comp.threshold || -22,
          ratio: comp.ratio || 4,
          attack: comp.attack || 0.005,
          release: comp.release || 0.1
        });
      }
    }
    
    // Apply melody effects
    if (effects.melody) {
      if (effects.melody.distortion && this.melodyEffects.distortion) {
        this.melodyEffects.distortion.distortion = effects.melody.distortion.distortion || 0;
        this.melodyEffects.distortion.wet.value = effects.melody.distortion.wet || 0;
      }
      if (effects.melody.delay && this.melodyEffects.delay) {
        this.melodyEffects.delay.set({
          delayTime: effects.melody.delay.delayTime || '8n',
          feedback: effects.melody.delay.feedback || 0
        });
        this.melodyEffects.delay.wet.value = effects.melody.delay.wet || 0;
      }
      if (effects.melody.chorus && this.melodyEffects.chorus) {
        this.melodyEffects.chorus.set({
          frequency: effects.melody.chorus.frequency || 1.5,
          delayTime: effects.melody.chorus.delayTime || 3.5,
          depth: effects.melody.chorus.depth || 0.7
        });
        this.melodyEffects.chorus.wet.value = effects.melody.chorus.wet || 0;
      }
      if (effects.melody.filter && this.melodyEffects.filter) {
        this.melodyEffects.filter.set({
          frequency: effects.melody.filter.frequency || 8000,
          type: effects.melody.filter.type || 'lowpass',
          Q: effects.melody.filter.Q || 1
        });
      }
    }
    
    // Apply harmony effects
    if (effects.harmony) {
      if (effects.harmony.reverb && this.harmonyEffects.reverb) {
        const reverb = effects.harmony.reverb;
        await this.harmonyEffects.reverb.set({
          roomSize: reverb.roomSize || 0.3
        });
        this.harmonyEffects.reverb.wet.value = reverb.wet || 0;
      }
      if (effects.harmony.chorus && this.harmonyEffects.chorus) {
        this.harmonyEffects.chorus.set({
          frequency: effects.harmony.chorus.frequency || 1.2,
          delayTime: effects.harmony.chorus.delayTime || 2.5,
          depth: effects.harmony.chorus.depth || 0.5
        });
        this.harmonyEffects.chorus.wet.value = effects.harmony.chorus.wet || 0;
      }
      if (effects.harmony.distortion && this.harmonyEffects.distortion) {
        this.harmonyEffects.distortion.distortion = effects.harmony.distortion.distortion || 0;
        this.harmonyEffects.distortion.wet.value = effects.harmony.distortion.wet || 0;
      }
      if (effects.harmony.filter && this.harmonyEffects.filter) {
        this.harmonyEffects.filter.set({
          frequency: effects.harmony.filter.frequency || 5000,
          type: effects.harmony.filter.type || 'lowpass',
          Q: effects.harmony.filter.Q || 1
        });
      }
    }
    
    // Apply drum effects
    if (effects.drums) {
      if (effects.drums.compression && this.drumEffects.compression) {
        const comp = effects.drums.compression;
        this.drumEffects.compression.set({
          threshold: comp.threshold || -20,
          ratio: comp.ratio || 5,
          attack: comp.attack || 0.002,
          release: comp.release || 0.1
        });
      }
      if (effects.drums.reverb && this.drumEffects.reverb) {
        const reverb = effects.drums.reverb;
        await this.drumEffects.reverb.set({
          roomSize: reverb.roomSize || 0.2
        });
        this.drumEffects.reverb.wet.value = reverb.wet || 0;
      }
      if (effects.drums.distortion && this.drumEffects.distortion) {
        this.drumEffects.distortion.distortion = effects.drums.distortion.distortion || 0;
        this.drumEffects.distortion.wet.value = effects.drums.distortion.wet || 0;
      }
      if (effects.drums.filter && this.drumEffects.filter) {
        this.drumEffects.filter.set({
          frequency: effects.drums.filter.frequency || 10000,
          type: effects.drums.filter.type || 'highpass',
          Q: effects.drums.filter.Q || 1
        });
      }
    }
    
    // Apply member tone settings (overrides genre effects)
    await this._applyMemberToneSettings();
  }
  
  /**
   * Apply member tone settings to instruments
   */
  async _applyMemberToneSettings() {
    // Apply drummer settings
    const drummerSettings = this.memberToneSettings.drummer;
    if (drummerSettings) {
      const volume = drummerSettings.volume || 0.8;
      const volumeDB = -20 + (volume * 20);
      if (this.drums.kick) this.drums.kick.volume.value = volumeDB - 6;
      if (this.drums.snare) this.drums.snare.volume.value = volumeDB - 8;
      if (this.drums.hihat) this.drums.hihat.volume.value = volumeDB - 14;
      
      if (drummerSettings.effects?.reverb?.enabled && this.drumEffects.reverb) {
        await this.drumEffects.reverb.set({ roomSize: drummerSettings.effects.reverb.roomSize || 0.2 });
        this.drumEffects.reverb.wet.value = drummerSettings.effects.reverb.wet || 0.1;
      }
      if (drummerSettings.effects?.distortion?.enabled && this.drumEffects.distortion) {
        this.drumEffects.distortion.distortion = drummerSettings.effects.distortion.amount || 0.3;
        this.drumEffects.distortion.wet.value = drummerSettings.effects.distortion.wet || 0.3;
      }
      if (drummerSettings.effects?.compression?.enabled && this.drumEffects.compression) {
        this.drumEffects.compression.set({
          threshold: drummerSettings.effects.compression.threshold || -20,
          ratio: drummerSettings.effects.compression.ratio || 5,
          attack: drummerSettings.effects.compression.attack || 0.002,
          release: drummerSettings.effects.compression.release || 0.1
        });
      }
      if (drummerSettings.effects?.filter?.enabled && this.drumEffects.filter) {
        this.drumEffects.filter.set({
          frequency: drummerSettings.effects.filter.frequency || 10000,
          type: drummerSettings.effects.filter.type || 'highpass',
          Q: drummerSettings.effects.filter.Q || 1
        });
      }
    }
    
    // Apply guitarist/lead-guitar settings (melody)
    const leadGuitarSettings = this.memberToneSettings['lead-guitar'];
    const guitarSettings = this.memberToneSettings.guitarist;
    const melodySettings = leadGuitarSettings || guitarSettings;
    if (melodySettings && this.melodySynth) {
      const volume = melodySettings.volume || 0.8;
      const volumeDB = -20 + (volume * 20);
      this.melodySynth.volume.value = volumeDB - 8;
      
      if (melodySettings.effects?.distortion?.enabled && this.melodyEffects.distortion) {
        this.melodyEffects.distortion.distortion = melodySettings.effects.distortion.amount || 0.2;
        this.melodyEffects.distortion.wet.value = melodySettings.effects.distortion.wet || 0.3;
      }
      if (melodySettings.effects?.delay?.enabled && this.melodyEffects.delay) {
        this.melodyEffects.delay.set({
          delayTime: melodySettings.effects.delay.delayTime || '8n',
          feedback: melodySettings.effects.delay.feedback || 0.2
        });
        this.melodyEffects.delay.wet.value = melodySettings.effects.delay.wet || 0.15;
      }
      if (melodySettings.effects?.chorus?.enabled && this.melodyEffects.chorus) {
        this.melodyEffects.chorus.set({
          frequency: melodySettings.effects.chorus.frequency || 1.5,
          delayTime: melodySettings.effects.chorus.delayTime || 3.5,
          depth: melodySettings.effects.chorus.depth || 0.7
        });
        this.melodyEffects.chorus.wet.value = melodySettings.effects.chorus.wet || 0.2;
      }
      if (melodySettings.effects?.filter?.enabled && this.melodyEffects.filter) {
        this.melodyEffects.filter.set({
          frequency: melodySettings.effects.filter.frequency || 8000,
          type: melodySettings.effects.filter.type || 'lowpass',
          Q: melodySettings.effects.filter.Q || 1
        });
      }
    }
    
    // Apply keyboardist settings
    const keyboardSettings = this.memberToneSettings.keyboardist;
    if (keyboardSettings && this.keyboardSynth) {
      const volume = keyboardSettings.volume || 0.8;
      const volumeDB = -20 + (volume * 20);
      this.keyboardSynth.volume.value = volumeDB - 10;
      
      if (keyboardSettings.effects?.reverb?.enabled && this.keyboardEffects.reverb) {
        await this.keyboardEffects.reverb.set({ roomSize: keyboardSettings.effects.reverb.roomSize || 0.4 });
        this.keyboardEffects.reverb.wet.value = keyboardSettings.effects.reverb.wet || 0.2;
      }
      if (keyboardSettings.effects?.chorus?.enabled && this.keyboardEffects.chorus) {
        this.keyboardEffects.chorus.set({
          frequency: keyboardSettings.effects.chorus.frequency || 1.2,
          delayTime: keyboardSettings.effects.chorus.delayTime || 2.5,
          depth: keyboardSettings.effects.chorus.depth || 0.5
        });
        this.keyboardEffects.chorus.wet.value = keyboardSettings.effects.chorus.wet || 0.2;
      }
      if (keyboardSettings.effects?.delay?.enabled && this.keyboardEffects.delay) {
        this.keyboardEffects.delay.set({
          delayTime: keyboardSettings.effects.delay.delayTime || '8n',
          feedback: keyboardSettings.effects.delay.feedback || 0.2
        });
        this.keyboardEffects.delay.wet.value = keyboardSettings.effects.delay.wet || 0.15;
      }
      if (keyboardSettings.effects?.filter?.enabled && this.keyboardEffects.filter) {
        this.keyboardEffects.filter.set({
          frequency: keyboardSettings.effects.filter.frequency || 8000,
          type: keyboardSettings.effects.filter.type || 'lowpass',
          Q: keyboardSettings.effects.filter.Q || 1
        });
      }
    }
    
    // Apply bassist/rhythm-guitar settings (harmony)
    const bassSettings = this.memberToneSettings.bassist;
    const rhythmGuitarSettings = this.memberToneSettings['rhythm-guitar'];
    const harmonySettings = bassSettings || rhythmGuitarSettings;
    if (harmonySettings && this.harmonyVoices.length > 0) {
      const volume = harmonySettings.volume || 0.8;
      const volumeDB = -20 + (volume * 20);
      this.harmonyVoices.forEach(voice => {
        voice.volume.value = volumeDB - 12;
      });
      
      if (harmonySettings.effects?.reverb?.enabled && this.harmonyEffects.reverb) {
        await this.harmonyEffects.reverb.set({ roomSize: harmonySettings.effects.reverb.roomSize || 0.3 });
        this.harmonyEffects.reverb.wet.value = harmonySettings.effects.reverb.wet || 0.15;
      }
      if (harmonySettings.effects?.chorus?.enabled && this.harmonyEffects.chorus) {
        this.harmonyEffects.chorus.set({
          frequency: harmonySettings.effects.chorus.frequency || 1.2,
          delayTime: harmonySettings.effects.chorus.delayTime || 2.5,
          depth: harmonySettings.effects.chorus.depth || 0.5
        });
        this.harmonyEffects.chorus.wet.value = harmonySettings.effects.chorus.wet || 0.2;
      }
      if (harmonySettings.effects?.distortion?.enabled && this.harmonyEffects.distortion) {
        this.harmonyEffects.distortion.distortion = harmonySettings.effects.distortion.amount || 0.2;
        this.harmonyEffects.distortion.wet.value = harmonySettings.effects.distortion.wet || 0.2;
      }
      if (harmonySettings.effects?.filter?.enabled && this.harmonyEffects.filter) {
        this.harmonyEffects.filter.set({
          frequency: harmonySettings.effects.filter.frequency || 5000,
          type: harmonySettings.effects.filter.type || 'lowpass',
          Q: harmonySettings.effects.filter.Q || 1
        });
      }
    }
  }

  /**
   * Extract member traits from song game context
   */
  _extractMemberTraits(song) {
    const gameContext = song?.gameContext || {};
    const bandMembers = gameContext.bandMembers || 
                       gameContext.members ||
                       song?.metadata?.bandMembers ||
                       [];
    
    // Reset traits
    this.memberTraits = {
      drummer: null,
      guitarist: null,
      'lead-guitar': null,
      'rhythm-guitar': null,
      bassist: null,
      vocalist: null,
      keyboardist: null
    };
    
    // Reset tone settings
    this.memberToneSettings = {
      drummer: null,
      guitarist: null,
      'lead-guitar': null,
      'rhythm-guitar': null,
      bassist: null,
      vocalist: null,
      keyboardist: null
    };
    
    // Extract traits and tone settings from band members
    bandMembers.forEach(member => {
      const role = member.role || member.type || member.instrument;
      if (member.traits && this.memberTraits.hasOwnProperty(role)) {
        this.memberTraits[role] = member.traits;
      }
      if (member.toneSettings && this.memberToneSettings.hasOwnProperty(role)) {
        this.memberToneSettings[role] = member.toneSettings;
      }
    });
    
    // Create seeded RNG for deterministic trait effects
    const seed = song?.metadata?.seed || Date.now().toString();
    this.traitRNG = new SeededRandom(seed);
  }

  /**
   * Render complete song to audio
   */
  async render(song) {
    if (!this.isInitialized) {
      await this.initialize(song);
    } else {
      // Update effects if song changed
      await this._setupEffects(song);
    }

    this.currentSong = song;
    const { composition, musicalContent } = song;
    
    // Extract member traits and tone settings for playback
    this._extractMemberTraits(song);
    
    // Apply tone settings after extraction
    await this._applyMemberToneSettings();
    
    // Convert BPM to seconds per beat
    const bpm = composition.tempo;
    const secondsPerBeat = 60 / bpm;
    
    // Clear previous notes
    this.scheduledNotes = [];
    
    // Schedule all notes (with member skill traits applied)
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
      await this.initialize(this.currentSong);
    }

    if (this.isPlaying) return;

    // Ensure drums are initialized
    if (!this.drums.kick || !this.drums.snare || !this.drums.hihat) {
      console.warn('Drums not initialized, re-initializing...');
      await this.initialize(this.currentSong);
    }

    // Ensure audio context is running
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    
    // Ensure we have scheduled notes before starting
    if (this.scheduledNotes.length === 0) {
      console.warn('No notes scheduled, cannot start playback');
      this.isPlaying = false;
      return;
    }
    
    // Reset transport to beginning - must stop before canceling
    if (Tone.Transport.state !== 'stopped') {
      Tone.Transport.stop();
    }
    
    // Clear any existing scheduled events
    Tone.Transport.cancel();
    
    // Reset transport time BEFORE scheduling new events
    Tone.Transport.seconds = 0;
    
    // Re-schedule all notes (they may have been cleared by cancel)
    // Filter out notes with negative times and clamp to 0
    const validNotes = this.scheduledNotes.map(note => ({
      ...note,
      time: Math.max(0, note.time) // Clamp negative times to 0
    })).filter(note => note.time >= 0 && isFinite(note.time)); // Remove any invalid notes
    
    console.log(`Scheduling ${validNotes.length} notes for playback (filtered from ${this.scheduledNotes.length})`);
    let scheduledCount = 0;
    validNotes.forEach((note, index) => {
      // Clamp time before logging
      const clampedTime = Math.max(0, note.time);
      if (index < 10) {
        console.log(`Scheduling note ${index}: ${note.type} at ${clampedTime.toFixed(3)}s, note:`, note.note || 'N/A');
      }
      try {
        // Use clamped time for scheduling
        const scheduleTime = clampedTime;
        Tone.Transport.schedule((time) => {
          scheduledCount++;
          if (scheduledCount <= 10) {
            console.log(`Transport callback triggered for note ${index}: ${note.type} at scheduled time ${time.toFixed(3)}s`);
          }
          this._playNote(note, time);
        }, scheduleTime);
      } catch (error) {
        console.error(`Error scheduling note ${index}:`, error, note);
      }
    });
    console.log(`Successfully scheduled ${validNotes.length} notes`);
    
    this.isPlaying = true;
    
    // Ensure audio context is running before starting Transport
    if (Tone.context.state !== 'running') {
      console.warn('Audio context not running, attempting to start...');
      try {
        await Tone.start();
        console.log('Audio context started, state:', Tone.context.state);
      } catch (error) {
        console.error('Failed to start audio context:', error);
      }
    }
    
    // Reset Transport to beginning
    Tone.Transport.seconds = 0;
    
    // Start transport - use start() without arguments to start from current position (0)
    try {
      // Ensure Transport is stopped before starting
      if (Tone.Transport.state === 'started') {
        Tone.Transport.stop();
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
      // Test: Schedule a simple callback to verify Transport is working
      Tone.Transport.schedule((time) => {
        console.log('TEST: Transport callback fired at time:', time);
      }, 0.1);
      
      Tone.Transport.start();
      console.log('Tone.Transport.start() called, state:', Tone.Transport.state, 'seconds:', Tone.Transport.seconds, 'context state:', Tone.context.state);
      
      // Small delay to let Transport initialize
      await new Promise(resolve => setTimeout(resolve, 10));
      
      // Check if Transport actually started
      console.log('After start delay, Transport state:', Tone.Transport.state, 'seconds:', Tone.Transport.seconds);
      
    } catch (error) {
      console.error('Error starting Transport:', error);
    }
    
    // Verify transport started (give it a moment)
    await new Promise(resolve => setTimeout(resolve, 100));
    if (Tone.Transport.state !== 'started') {
      console.warn('Tone.Transport did not start, current state:', Tone.Transport.state, 'context state:', Tone.context.state);
      // Try starting again with full reset
      try {
        Tone.Transport.stop();
        Tone.Transport.cancel();
        Tone.Transport.seconds = 0;
        
        // Re-schedule notes (they may have been cleared)
        validNotes.forEach((note) => {
          Tone.Transport.schedule((time) => {
            this._playNote(note, time);
          }, note.time);
        });
        
        Tone.Transport.start();
        await new Promise(resolve => setTimeout(resolve, 50));
        console.log('Retry start, Transport state:', Tone.Transport.state, 'seconds:', Tone.Transport.seconds);
      } catch (error) {
        console.error('Error retrying Transport start:', error);
      }
    } else {
      console.log('Tone.Transport started successfully, state:', Tone.Transport.state, 'seconds:', Tone.Transport.seconds);
    }
    
    console.log(`Playing ${this.scheduledNotes.length} scheduled notes (${this.scheduledNotes.filter(n => n.type === 'kick').length} kicks, ${this.scheduledNotes.filter(n => n.type === 'snare').length} snares, ${this.scheduledNotes.filter(n => n.type === 'hihat').length} hihats), Transport state: ${Tone.Transport.state}`);
  }

  /**
   * Stop playback
   */
  stop() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    this.isPlaying = false;
    // Don't clear scheduledNotes - allow replay without re-rendering
    // this.scheduledNotes = [];
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
   * Schedule drum pattern playback with member skill traits
   */
  _scheduleDrumPattern(drumData, secondsPerBeat) {
    if (!drumData) {
      console.warn('_scheduleDrumPattern: No drumData provided');
      return;
    }
    
    const { pattern, tempo, beats } = drumData;
    
    // Handle different pattern structures
    // DrumEngine returns: { pattern: { beats: { kick, snare, hihat } }, tempo }
    let drumBeats = null;
    if (pattern?.beats) {
      drumBeats = pattern.beats;
    } else if (beats) {
      drumBeats = beats;
    } else if (pattern && (pattern.kick || pattern.snare || pattern.hihat)) {
      // Pattern is the beats object directly
      drumBeats = pattern;
    } else {
      console.warn('_scheduleDrumPattern: No pattern or beats found in drumData', { 
        hasPattern: !!pattern, 
        hasBeats: !!beats,
        patternKeys: pattern ? Object.keys(pattern) : [],
        drumDataKeys: Object.keys(drumData)
      });
      return;
    }

    const { kick = [], snare = [], hihat = [], ghostSnare = [] } = drumBeats;
    
    // Log if no drum beats found
    if (kick.length === 0 && snare.length === 0 && hihat.length === 0) {
      console.warn('_scheduleDrumPattern: No drum beats found in pattern', { 
        kick: kick.length, 
        snare: snare.length, 
        hihat: hihat.length, 
        pattern: drumBeats,
        drumData: drumData 
      });
    }
    const drummerTraits = this.memberTraits.drummer;
    
    // Calculate timing variance (bad timing = more variance)
    const timingSkill = drummerTraits?.timing || 70;
    const timingVariance = (100 - timingSkill) / 100 * 0.05; // Max 50ms variance
    
    // Calculate dynamics variance (no dynamics = all same velocity)
    const dynamicsSkill = drummerTraits?.dynamics || 60;
    const dynamicsRange = dynamicsSkill / 100; // 0-1 range
    
    // Calculate precision (affects hit consistency)
    const precisionSkill = drummerTraits?.precision || 75;
    const missChance = (100 - precisionSkill) / 100 * 0.1; // Up to 10% miss chance

    // Schedule kick drum
    kick.forEach(beatTime => {
      // Apply timing variance
      const timingOffset = (this.traitRNG.next() - 0.5) * timingVariance;
      const actualTime = Math.max(0, beatTime * secondsPerBeat + timingOffset); // Clamp to 0 to prevent negative times
      
      // Apply dynamics
      const baseVelocity = 1.0;
      const velocity = dynamicsSkill < 30 
        ? baseVelocity // No dynamics - always 100%
        : baseVelocity * (0.7 + dynamicsRange * 0.3 * this.traitRNG.next());
      
      // Apply precision (miss chance)
      if (this.traitRNG.next() > missChance) {
        this.scheduledNotes.push({
          type: 'kick',
          time: actualTime,
          velocity: Math.max(0.1, Math.min(1.0, velocity))
        });
      }
    });

    // Schedule snare
    snare.forEach(beatTime => {
      const timingOffset = (this.traitRNG.next() - 0.5) * timingVariance;
      const actualTime = beatTime * secondsPerBeat + timingOffset;
      
      const baseVelocity = 1.0;
      const velocity = dynamicsSkill < 30 
        ? baseVelocity 
        : baseVelocity * (0.7 + dynamicsRange * 0.3 * this.traitRNG.next());
      
      if (this.traitRNG.next() > missChance) {
        this.scheduledNotes.push({
          type: 'snare',
          time: actualTime,
          velocity: Math.max(0.1, Math.min(1.0, velocity))
        });
      }
    });

    // Schedule hi-hat
    hihat.forEach(beatTime => {
      const timingOffset = (this.traitRNG.next() - 0.5) * timingVariance;
      const actualTime = beatTime * secondsPerBeat + timingOffset;
      
      const baseVelocity = 0.7;
      const velocity = dynamicsSkill < 30 
        ? baseVelocity 
        : baseVelocity * (0.5 + dynamicsRange * 0.5 * this.traitRNG.next());
      
      if (this.traitRNG.next() > missChance) {
        this.scheduledNotes.push({
          type: 'hihat',
          time: actualTime,
          velocity: Math.max(0.1, Math.min(1.0, velocity))
        });
      }
    });

    // Schedule ghost snare (quieter)
    if (ghostSnare) {
      ghostSnare.forEach(beatTime => {
        const timingOffset = (this.traitRNG.next() - 0.5) * timingVariance;
        const actualTime = beatTime * secondsPerBeat + timingOffset;
        
        const velocity = 0.4 * (0.7 + dynamicsRange * 0.3 * this.traitRNG.next());
        
        if (this.traitRNG.next() > missChance) {
          this.scheduledNotes.push({
            type: 'snare',
            time: actualTime,
            velocity: Math.max(0.05, Math.min(0.6, velocity))
          });
        }
      });
    }
  }

  /**
   * Schedule harmony chord progressions with member skill traits
   */
  _scheduleHarmonyProgression(harmonyData, secondsPerBeat) {
    const { progression } = harmonyData;
    if (!progression || !progression.chords) return;

    const chords = progression.chords;
    const beatDuration = 4; // Assume 4 beats per chord
    
    // Get bassist or rhythm guitar traits for harmony
    const bassTraits = this.memberTraits.bassist;
    const rhythmGuitarTraits = this.memberTraits['rhythm-guitar'];
    const harmonyTraits = bassTraits || rhythmGuitarTraits || this.memberTraits.guitarist;
    
    const timingSkill = harmonyTraits?.timing || 70;
    const timingVariance = (100 - timingSkill) / 100 * 0.02;
    
    const precisionSkill = harmonyTraits?.precision || 70;
    const chordAccuracy = precisionSkill / 100; // 0-1, affects note accuracy

    chords.forEach((chord, index) => {
      const baseStartTime = index * beatDuration * secondsPerBeat;
      
          // Apply timing variance
          const timingOffset = (this.traitRNG.next() - 0.5) * timingVariance;
          const startTime = Math.max(0, baseStartTime + timingOffset); // Clamp to 0 to prevent negative times
      
      const duration = beatDuration * secondsPerBeat;

      // Get chord notes
      const notes = this._getChordNotes(chord);
      
      notes.forEach((note, voiceIndex) => {
        if (voiceIndex < this.harmonyVoices.length) {
          // Apply precision (slightly off notes for sloppy playing)
          let actualNote = note;
          if (precisionSkill < 50 && this.traitRNG.next() > chordAccuracy) {
            // Occasionally play wrong note
            const semitoneOffset = Math.round((this.traitRNG.next() - 0.5) * 2);
            actualNote = this._adjustNoteBySemitones(note, semitoneOffset);
          }
          
          this.scheduledNotes.push({
            type: 'harmony',
            note: actualNote,
            time: startTime,
            duration,
            voiceIndex
          });
        }
      });
    });
  }
  
  /**
   * Adjust note by semitones (for dissonance)
   */
  _adjustNoteBySemitones(noteName, semitones) {
    if (semitones === 0) return noteName;
    
    const noteMap = {
      'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5,
      'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11
    };
    
    const match = noteName.match(/^([A-G]#?)(\d+)$/);
    if (!match) return noteName;
    
    const [, note, octave] = match;
    const noteValue = noteMap[note] || 0;
    const newNoteValue = (noteValue + semitones + 12) % 12;
    const newOctave = parseInt(octave) + Math.floor((noteValue + semitones) / 12);
    
    const noteNames = Object.keys(noteMap);
    const newNote = noteNames[newNoteValue];
    
    return `${newNote}${newOctave}`;
  }

  /**
   * Schedule melody playback with member skill traits
   */
  _scheduleMelody(melodyData, secondsPerBeat) {
    const { melody, songStructure } = melodyData;
    if (!melody || melody.length === 0) return;

    // Get traits - prioritize keyboardist if present, then guitarist
    const keyboardTraits = this.memberTraits.keyboardist;
    const leadGuitarTraits = this.memberTraits['lead-guitar'];
    const rhythmGuitarTraits = this.memberTraits['rhythm-guitar'];
    const guitarTraits = this.memberTraits.guitarist;
    // Use keyboardist traits if keyboardist exists, otherwise use guitarist
    const melodyTraits = keyboardTraits || leadGuitarTraits || rhythmGuitarTraits || guitarTraits;
    
    const timingSkill = melodyTraits?.timing || 70;
    const timingVariance = (100 - timingSkill) / 100 * 0.03;
    
    const dynamicsSkill = melodyTraits?.dynamics || 65;
    const dynamicsRange = dynamicsSkill / 100;
    
    const precisionSkill = melodyTraits?.precision || 75;
    const dissonanceAmount = (100 - precisionSkill) / 100 * 2; // Up to 2 semitones off

    let currentTime = 0;

    melody.forEach(section => {
      section.phrases.forEach(phrase => {
        if (!phrase.notes) return;

        phrase.notes.forEach((noteValue, noteIndex) => {
          const baseDuration = (phrase.durations?.[noteIndex] || 1) * secondsPerBeat;
          
          // Apply timing variance
          const timingOffset = (this.traitRNG.next() - 0.5) * timingVariance;
          const actualTime = currentTime + timingOffset;
          
          // Apply precision (dissonance - wrong notes)
          let actualNoteValue = noteValue;
          if (precisionSkill < 50) {
            const dissonance = Math.round((this.traitRNG.next() - 0.5) * dissonanceAmount);
            actualNoteValue = noteValue + dissonance;
          }
          
          const note = this._scaleDegreeToNote(actualNoteValue, 'C', 'major');
          
          // Apply dynamics
          const baseVelocity = 0.8;
          const velocity = dynamicsSkill < 30 
            ? baseVelocity 
            : baseVelocity * (0.6 + dynamicsRange * 0.4 * this.traitRNG.next());

          // Determine if this should be keyboard or guitar based on member
          const useKeyboard = keyboardTraits && this.keyboardSynth;
          const noteType = useKeyboard ? 'keyboard' : 'melody';
          
          this.scheduledNotes.push({
            type: noteType,
            note,
            time: actualTime,
            duration: baseDuration,
            velocity: Math.max(0.2, Math.min(1.0, velocity))
          });

          currentTime += baseDuration;
        });
      });
    });
  }

  /**
   * Play individual note with velocity from member traits
   */
  _playNote(note, time) {
    // Only check drums for drum notes - don't block melody/harmony
    const isDrumNote = ['kick', 'snare', 'hihat'].includes(note.type);
    if (isDrumNote && (!this.drums.kick || !this.drums.snare || !this.drums.hihat)) {
      console.warn('Drums not initialized when trying to play drum note:', note.type);
      return;
    }

    // Debug: Log first few notes to verify they're being triggered
    const noteIndex = this.scheduledNotes.findIndex(n => n === note);
    if (noteIndex < 5) {
      console.log(`Playing note ${noteIndex}: ${note.type} at time ${time.toFixed(3)}s`, note);
    }

    switch (note.type) {
      case 'kick':
        if (!this.drums.kick) {
          console.warn('Kick drum not initialized');
          return;
        }
        // Apply velocity to kick (affects volume)
        // Base volume is 0, adjust down based on velocity
        const kickVolume = 0 - ((1 - (note.velocity || 1.0)) * 8); // 0 to -8 dB
        this.drums.kick.volume.value = kickVolume;
        // Use lower note (C1) for kick drum - MembraneSynth will produce proper kick sound
        try {
          this.drums.kick.triggerAttackRelease('C1', '0.4', time);
        } catch (error) {
          console.error('Error triggering kick:', error);
        }
        break;

      case 'snare':
        if (!this.drums.snare) {
          console.warn('Snare drum not initialized');
          return;
        }
        // Base volume is -2, adjust down based on velocity
        const snareVolume = -2 - ((1 - (note.velocity || 1.0)) * 10); // -2 to -12 dB
        this.drums.snare.volume.value = snareVolume;
        try {
          this.drums.snare.triggerAttackRelease('C2', '0.2', time);
        } catch (error) {
          console.error('Error triggering snare:', error);
        }
        break;

      case 'hihat':
        if (!this.drums.hihat) {
          console.warn('Hihat not initialized');
          return;
        }
        // Base volume is -8, adjust down based on velocity
        const hihatVolume = -8 - ((1 - (note.velocity || 0.7)) * 8); // -8 to -16 dB
        this.drums.hihat.volume.value = hihatVolume;
        try {
          this.drums.hihat.triggerAttackRelease('16n', time);
        } catch (error) {
          console.error('Error triggering hihat:', error);
        }
        break;

      case 'harmony':
        if (!this.harmonyVoices || this.harmonyVoices.length === 0) {
          console.warn('Harmony voices not initialized');
          return;
        }
        if (this.harmonyVoices[note.voiceIndex]) {
          // Apply velocity to harmony voices
          const harmonyVolume = -12 + (1 - (note.velocity || 0.8)) * 8;
          this.harmonyVoices[note.voiceIndex].volume.value = harmonyVolume;
          this.harmonyVoices[note.voiceIndex].triggerAttackRelease(
            note.note,
            note.duration,
            time
          );
        } else {
          console.warn(`Harmony voice ${note.voiceIndex} not found, total voices: ${this.harmonyVoices.length}`);
        }
        break;

      case 'melody':
        if (!this.melodySynth) {
          console.warn('Melody synth not initialized');
          return;
        }
        // Apply velocity to melody (guitar)
        const melodyVolume = -8 + (1 - (note.velocity || 0.8)) * 10;
        this.melodySynth.volume.value = melodyVolume;
        this.melodySynth.triggerAttackRelease(
          note.note,
          note.duration,
          time
        );
        break;

      case 'keyboard':
        if (!this.keyboardSynth) {
          console.warn('Keyboard synth not initialized');
          return;
        }
        // Apply velocity to keyboard
        const keyboardVolume = -10 + (1 - (note.velocity || 0.8)) * 10;
        this.keyboardSynth.volume.value = keyboardVolume;
        this.keyboardSynth.triggerAttackRelease(
          note.note,
          note.duration,
          time
        );
        break;
        
      default:
        console.warn('Unknown note type:', note.type);
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
    
    // Dispose synths
    if (this.melodySynth) this.melodySynth.dispose();
    if (this.keyboardSynth) this.keyboardSynth.dispose();
    this.harmonyVoices.forEach(voice => voice.dispose());
    
    if (this.drums.kick) this.drums.kick.dispose();
    if (this.drums.snare) this.drums.snare.dispose();
    if (this.drums.hihat) this.drums.hihat.dispose();
    
    // Dispose effects
    Object.values(this.masterEffects).forEach(effect => effect?.dispose());
    Object.values(this.melodyEffects).forEach(effect => effect?.dispose());
    Object.values(this.harmonyEffects).forEach(effect => effect?.dispose());
    Object.values(this.drumEffects).forEach(effect => effect?.dispose());
    if (this.keyboardEffects) {
      Object.values(this.keyboardEffects).forEach(effect => effect?.dispose());
    }
    
    this.isInitialized = false;
  }
}

export default ToneRenderer;
