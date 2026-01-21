/**
 * TrackPlayer - React component for playing generated songs
 * 
 * Provides playback controls, progress tracking, and export options
 */

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Square, Download, Music } from 'lucide-react';
import { ToneRenderer } from '../music/renderers/ToneRenderer';
import { MIDIExporter } from '../music/renderers/MIDIExporter';

export const TrackPlayer = ({ song, onExport }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  const rendererRef = useRef(null);
  const progressIntervalRef = useRef(null);

  /**
   * Initialize renderer and render song
   */
  const handleRender = async () => {
    if (!song) return;
    
    setIsLoading(true);
    try {
      if (!rendererRef.current) {
        rendererRef.current = new ToneRenderer();
      }

      const renderResult = await rendererRef.current.render(song);
      setDuration(renderResult.duration);
    } catch (error) {
      console.error('Failed to render song:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Play track
   */
  const handlePlay = async () => {
    if (!rendererRef.current) {
      await handleRender();
    }

    try {
      await rendererRef.current.play();
      setIsPlaying(true);

      // Update progress
      progressIntervalRef.current = setInterval(() => {
        const time = window.Tone?.Transport?.seconds || 0;
        setCurrentTime(time);
      }, 100);

    } catch (error) {
      console.error('Failed to play:', error);
    }
  };

  /**
   * Pause track
   */
  const handlePause = () => {
    if (rendererRef.current) {
      rendererRef.current.pause();
      setIsPlaying(false);
      clearInterval(progressIntervalRef.current);
    }
  };

  /**
   * Resume track
   */
  const handleResume = () => {
    if (rendererRef.current) {
      rendererRef.current.resume();
      setIsPlaying(true);

      progressIntervalRef.current = setInterval(() => {
        const time = window.Tone?.Transport?.seconds || 0;
        setCurrentTime(time);
      }, 100);
    }
  };

  /**
   * Stop track
   */
  const handleStop = () => {
    if (rendererRef.current) {
      rendererRef.current.stop();
      setIsPlaying(false);
      setCurrentTime(0);
      clearInterval(progressIntervalRef.current);
    }
  };

  /**
   * Export as MIDI
   */
  const handleExportMIDI = () => {
    if (!song) return;
    
    const filename = `${song.metadata.name.replace(/\s+/g, '_')}.mid`;
    MIDIExporter.downloadMIDI(song, filename);
    
    if (onExport) {
      onExport({
        type: 'midi',
        filename,
        data: MIDIExporter.exportToMIDI(song)
      });
    }
  };

  /**
   * Export as TrackDraft project
   */
  const handleExportTrackDraft = () => {
    if (!song) return;

    const project = MIDIExporter.createTrackDraftProject(song);
    const filename = `${song.metadata.name.replace(/\s+/g, '_')}_trackdraft.json`;
    
    const dataStr = JSON.stringify(project, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);

    if (onExport) {
      onExport({
        type: 'trackdraft',
        filename,
        data: project
      });
    }
  };

  /**
   * Format time display
   */
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      clearInterval(progressIntervalRef.current);
    };
  }, []);

  if (!song) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
        <Music size={32} style={{ opacity: 0.5 }} />
        <p>No song to play</p>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#0a0a0a',
      border: '1px solid #333',
      borderRadius: '8px',
      color: '#fff'
    }}>
      {/* Track Info */}
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ margin: '0 0 5px 0', color: '#0ff' }}>
          {song.metadata.name}
        </h3>
        <p style={{ margin: '5px 0', fontSize: '0.9em', color: '#888' }}>
          {song.metadata.band} • {song.composition.genre} • {song.composition.tempo} BPM
        </p>
        <div style={{ display: 'flex', gap: '15px', fontSize: '0.85em', color: '#666' }}>
          <span>Quality: {song.analysis.qualityScore.toFixed(0)}/100</span>
          <span>Originality: {song.analysis.originalityScore.toFixed(0)}/100</span>
          <span>Commercial: {song.analysis.commercialViability.toFixed(0)}/100</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center' }}>
        {!isPlaying ? (
          <button
            onClick={isLoading ? null : handlePlay}
            disabled={isLoading}
            style={{
              padding: '10px 15px',
              backgroundColor: '#0f0',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              opacity: isLoading ? 0.5 : 1
            }}
          >
            <Play size={18} /> {isLoading ? 'Loading...' : 'Play'}
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              style={{
                padding: '10px 15px',
                backgroundColor: '#ff6600',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              <Pause size={18} /> Pause
            </button>
            <button
              onClick={handleResume}
              style={{
                padding: '10px 15px',
                backgroundColor: '#0f0',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              <Play size={18} /> Resume
            </button>
          </>
        )}

        <button
          onClick={handleStop}
          style={{
            padding: '10px 15px',
            backgroundColor: '#f00',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          <Square size={18} /> Stop
        </button>

        {/* Time Display */}
        <div style={{ marginLeft: 'auto', fontFamily: 'monospace', fontSize: '0.9em' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: '6px',
        backgroundColor: '#222',
        borderRadius: '3px',
        marginBottom: '15px',
        overflow: 'hidden'
      }}>
        <div
          style={{
            height: '100%',
            backgroundColor: '#0f0',
            width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
            transition: 'width 0.1s linear'
          }}
        />
      </div>

      {/* Export Options */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button
          onClick={handleExportMIDI}
          style={{
            padding: '8px 12px',
            backgroundColor: '#444',
            color: '#0ff',
            border: '1px solid #0ff',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.85em',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <Download size={14} /> Export MIDI
        </button>

        <button
          onClick={handleExportTrackDraft}
          style={{
            padding: '8px 12px',
            backgroundColor: '#444',
            color: '#0f0',
            border: '1px solid #0f0',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.85em',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <Download size={14} /> Export TrackDraft
        </button>
      </div>
    </div>
  );
};

export default TrackPlayer;
