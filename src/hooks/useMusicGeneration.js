/**
 * useMusicGeneration - Hook for music system integration with game
 * 
 * Provides music generation tied to game state, caching, and lifecycle management
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { MusicGenerator, ToneRenderer } from '../music';
import { MIDIExporter } from '../music/renderers/MIDIExporter';

export const useMusicGeneration = () => {
  // Song state
  const [currentSong, setCurrentSong] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Cache for reproducibility
  const songCacheRef = useRef({});
  const rendererRef = useRef(null);
  const progressIntervalRef = useRef(null);

  /**
   * Generate song from game state
   * Accepts either: generateSong(gameState, genre, options) or generateSong({gameState, title, genre})
   */
  const generateSong = useCallback(async (gameStateOrObj, genre = 'rock', options = {}) => {
    // Handle both call signatures for compatibility
    let gameState, songTitle;
    if (typeof gameStateOrObj === 'object' && gameStateOrObj.gameState !== undefined) {
      // Called with object: {gameState, title, genre}
      gameState = gameStateOrObj.gameState || {};
      songTitle = gameStateOrObj.title || 'Untitled';
      genre = gameStateOrObj.genre || genre;
    } else {
      // Called with positional args: generateSong(gameState, genre, options)
      gameState = gameStateOrObj || {};
    }

    // Ensure gameState has required properties
    gameState = {
      bandName: gameState.bandName || 'Your Band',
      week: gameState.week || gameState.currentWeek || 0,
      money: gameState.money || 0,
      fame: gameState.fame || 0,
      bandMembers: gameState.bandMembers || [],
      ...gameState
    };

    const { 
      useCache = true,
      cacheKey = null,
      onComplete = null,
      onError = null
    } = options;

    // Generate cache key if not provided
    const key = cacheKey || `${gameState.bandName}-${gameState.week}-${genre}`;

    // Check cache
    if (useCache && songCacheRef.current[key]) {
      setCurrentSong(songCacheRef.current[key]);
      if (onComplete) onComplete(songCacheRef.current[key]);
      return songCacheRef.current[key];
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      // Generate song and normalize structure (await async call)
      const generatedSong = await MusicGenerator.generateSong(gameState, genre, {
        seed: key,
        songName: songTitle || `${gameState.bandName} - Week ${gameState.week}`,
        ...options
      });

      // Normalize song structure for consistency
      const song = {
        ...generatedSong,
        // Add game-friendly properties
        title: songTitle || generatedSong.metadata?.name || 'Untitled',
        name: songTitle || generatedSong.metadata?.name || 'Untitled',
        genre: genre,
        quality: Math.round(generatedSong.analysis?.qualityScore || 0),
        originality: Math.round(generatedSong.analysis?.originalityScore || 0),
        commercial: Math.round(generatedSong.analysis?.commercialViability || 0),
        recordedWeek: gameState.week
      };

      // Cache result
      songCacheRef.current[key] = song;
      setCurrentSong(song);

      if (onComplete) onComplete(song);
      return song;

    } catch (error) {
      setGenerationError(error.message);
      if (onError) onError(error);
      throw error;

    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * Generate album (multiple tracks)
   */
  const generateAlbum = useCallback(async (gameState, genre = 'rock', trackCount = 5) => {
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const album = await MusicGenerator.generateAlbum(gameState, genre, {
        trackCount,
        albumName: `${gameState.bandName} - Week ${gameState.currentWeek}`
      });

      return album;

    } catch (error) {
      setGenerationError(error.message);
      throw error;

    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * Initialize and render song for playback
   */
  const renderForPlayback = useCallback(async (song = currentSong) => {
    if (!song) {
      setGenerationError('No song to render');
      return null;
    }

    try {
      if (!rendererRef.current) {
        rendererRef.current = new ToneRenderer();
      }

      const renderResult = await rendererRef.current.render(song);
      setDuration(renderResult.duration);
      setGenerationError(null);

      return renderResult;

    } catch (error) {
      setGenerationError(`Render error: ${error.message}`);
      throw error;
    }
  }, [currentSong]);

  /**
   * Play current song
   */
  const play = useCallback(async () => {
    if (!currentSong) {
      setGenerationError('No song to play');
      return;
    }

    try {
      if (!rendererRef.current) {
        await renderForPlayback();
      }

      await rendererRef.current.play();
      setIsPlaying(true);

      // Track progress
      progressIntervalRef.current = setInterval(() => {
        if (window.Tone?.Transport) {
          setCurrentTime(window.Tone.Transport.seconds);
        }
      }, 100);

      setGenerationError(null);

    } catch (error) {
      setGenerationError(`Playback error: ${error.message}`);
      throw error;
    }
  }, [currentSong, renderForPlayback]);

  /**
   * Pause playback
   */
  const pause = useCallback(() => {
    if (rendererRef.current && isPlaying) {
      rendererRef.current.pause();
      setIsPlaying(false);
      clearInterval(progressIntervalRef.current);
    }
  }, [isPlaying]);

  /**
   * Resume playback
   */
  const resume = useCallback(() => {
    if (rendererRef.current && !isPlaying) {
      rendererRef.current.resume();
      setIsPlaying(true);

      progressIntervalRef.current = setInterval(() => {
        if (window.Tone?.Transport) {
          setCurrentTime(window.Tone.Transport.seconds);
        }
      }, 100);
    }
  }, [isPlaying]);

  /**
   * Stop playback
   */
  const stop = useCallback(() => {
    if (rendererRef.current) {
      rendererRef.current.stop();
      setIsPlaying(false);
      setCurrentTime(0);
      clearInterval(progressIntervalRef.current);
    }
  }, []);

  /**
   * Export to MIDI
   */
  const exportMIDI = useCallback((filename = null) => {
    if (!currentSong) {
      setGenerationError('No song to export');
      return null;
    }

    try {
      const fname = filename || `${currentSong.metadata.name.replace(/\s+/g, '_')}.mid`;
      MIDIExporter.downloadMIDI(currentSong, fname);
      setGenerationError(null);
      return fname;

    } catch (error) {
      setGenerationError(`Export error: ${error.message}`);
      throw error;
    }
  }, [currentSong]);

  /**
   * Export to TrackDraft
   */
  const exportTrackDraft = useCallback((projectName = null) => {
    if (!currentSong) {
      setGenerationError('No song to export');
      return null;
    }

    try {
      const project = MIDIExporter.createTrackDraftProject(
        currentSong,
        { projectName: projectName || currentSong.metadata.name }
      );

      const filename = `${currentSong.metadata.name.replace(/\s+/g, '_')}_trackdraft.json`;
      const dataStr = JSON.stringify(project, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      setGenerationError(null);
      return project;

    } catch (error) {
      setGenerationError(`Export error: ${error.message}`);
      throw error;
    }
  }, [currentSong]);

  /**
   * Get song analysis data
   */
  const getSongAnalysis = useCallback(() => {
    if (!currentSong) return null;

    return {
      quality: currentSong.analysis.qualityScore,
      originality: currentSong.analysis.originalityScore,
      commercial: currentSong.analysis.commercialViability,
      emotional: currentSong.analysis.emotionalTone
    };
  }, [currentSong]);

  /**
   * Clear cache
   */
  const clearCache = useCallback(() => {
    songCacheRef.current = {};
  }, []);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stop();
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      clearInterval(progressIntervalRef.current);
    };
  }, [stop]);

  return {
    // Song state
    currentSong,
    isGenerating,
    generationError,

    // Playback state
    isPlaying,
    duration,
    currentTime,

    // Generation methods
    generateSong,
    generateAlbum,
    renderForPlayback,

    // Playback controls
    play,
    pause,
    resume,
    stop,

    // Export methods
    exportMIDI,
    exportTrackDraft,

    // Analysis
    getSongAnalysis,

    // Cache management
    clearCache
  };
};

export default useMusicGeneration;
