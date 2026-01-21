import React, { useState } from 'react';
import { Music, Plus, Zap } from 'lucide-react';
import { useMusicGeneration } from '../../hooks/useMusicGeneration';
import { SongPlaybackPanel } from '../SongPlaybackPanel';

/**
 * InventoryTab.jsx - Songs and albums management with procedural generation
 * 
 * Displays:
 * - List of recorded songs with quality metrics
 * - Released albums
 * - Music library statistics
 * - ACTION: Write new songs (Basic or Procedural)
 * - ACTION: Create albums
 * 
 * Integration: Merged procedural music system (Tone.js synthesis, MIDI export)
 */
export const InventoryTab = ({ gameData, recordingSystem, gameState }) => {
  const [showSongForm, setShowSongForm] = useState(false);
  const [songName, setSongName] = useState('');
  const [songGenre, setSongGenre] = useState('Rock');
  const [albumName, setAlbumName] = useState('');
  const [selectedSongs, setSelectedSongs] = useState([]);
  
  // Procedural music generation
  const musicGeneration = useMusicGeneration();
  const [generatingMode, setGeneratingMode] = useState('legacy');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSong, setGeneratedSong] = useState(null);
  const [showPlaybackPanel, setShowPlaybackPanel] = useState(false);

  const handleWriteSong = async () => {
    if (!songName.trim()) {
      alert('Enter a song name');
      return;
    }

    setIsGenerating(true);

    try {
      if (generatingMode === 'procedural' && musicGeneration?.generateSong) {
        // Procedural generation with constraint-based music
        const song = await musicGeneration.generateSong({
          title: songName,
          genre: songGenre,
          gameState: gameState?.state || {}
        });

        if (song) {
          setGeneratedSong(song);
          setShowPlaybackPanel(true);
          setSongName('');
          setShowSongForm(false);
        } else {
          alert('Failed to generate song');
        }
      } else {
        // Legacy basic song generation
        const result = recordingSystem?.recordSong?.(songName, songGenre);
        if (result?.success) {
          setSongName('');
          setShowSongForm(false);
        }
      }
    } catch (error) {
      console.error('Song generation failed:', error);
      alert('Error generating song: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateAlbum = () => {
    if (!albumName.trim()) {
      alert('Enter an album name');
      return;
    }

    if (selectedSongs.length === 0) {
      alert('Select at least 1 song');
      return;
    }

    const result = recordingSystem?.createAlbum?.(albumName, selectedSongs);
    if (result?.success) {
      setAlbumName('');
      setSelectedSongs([]);
    }
  };

  const songs = gameState?.state?.songs || [];
  const albums = gameState?.state?.albums || [];
  const money = gameState?.state?.money || 0;

  return (
    <div>
      {/* Write Song Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-foreground">Songs</h3>
          <button
            onClick={() => setShowSongForm(!showSongForm)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
          >
            <Plus size={18} />
            Write Song
          </button>
        </div>

        {showSongForm && (
          <div className="bg-card border border-primary/30 p-6 rounded-lg mb-6">
            <div className="space-y-4">
              {/* Generation Mode Toggle */}
              <div>
                <label className="block text-sm font-semibold mb-2">Generation Mode</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setGeneratingMode('legacy')}
                    className={`flex-1 px-3 py-2 rounded-lg transition-all font-medium ${
                      generatingMode === 'legacy'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    Basic
                  </button>
                  <button
                    onClick={() => setGeneratingMode('procedural')}
                    className={`flex-1 px-3 py-2 rounded-lg transition-all font-medium flex items-center justify-center gap-1 ${
                      generatingMode === 'procedural'
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    <Zap size={16} />
                    Procedural
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {generatingMode === 'legacy'
                    ? 'Quick basic song (instant)'
                    : 'Advanced AI generation (constraint-based, audio playback)'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Song Name</label>
                <input
                  type="text"
                  value={songName}
                  onChange={(e) => setSongName(e.target.value)}
                  placeholder="Enter song name"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Genre</label>
                <select
                  value={songGenre}
                  onChange={(e) => setSongGenre(e.target.value)}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option>Rock</option>
                  <option>Pop</option>
                  <option>Hip-Hop</option>
                  <option>Electronic</option>
                  <option>Jazz</option>
                  <option>Metal</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleWriteSong}
                  disabled={isGenerating}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isGenerating
                      ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                      : 'bg-secondary text-secondary-foreground hover:opacity-90'
                  }`}
                >
                  {isGenerating ? 'Generating...' : `${generatingMode === 'legacy' ? 'Record' : 'Generate'} Song ($2,500)`}
                </button>
                <button
                  onClick={() => setShowSongForm(false)}
                  disabled={isGenerating}
                  className="flex-1 px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
              <p className="text-xs text-muted-foreground">Current: ${(gameState?.state?.money || 0).toLocaleString()}</p>
            </div>
          </div>
        )}

        {songs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {songs.map(song => (
              <div key={song.id} className="bg-card border border-primary/30 p-4 rounded-lg hover:border-primary/60 transition-all">
                <h4 className="text-foreground font-semibold mb-2">{song.name || song.title}</h4>
                <p className="text-sm text-muted-foreground mb-1">Quality: <span className="text-accent font-medium">{song.quality}/10</span></p>
                <p className="text-sm text-muted-foreground mb-3">Genre: {song.genre}</p>
                <div className="flex gap-2">
                  <input
                    type="checkbox"
                    checked={selectedSongs.includes(song.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSongs([...selectedSongs, song.id]);
                      } else {
                        setSelectedSongs(selectedSongs.filter(id => id !== song.id));
                      }
                    }}
                    className="cursor-pointer"
                  />
                  <span className="text-xs text-muted-foreground">Add to album</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground mb-8">No songs recorded yet. Start writing!</p>
        )}

        {/* Playback Panel Modal for Generated Songs */}
        {generatedSong && showPlaybackPanel && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-primary max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-foreground">
                    🎵 {generatedSong.title || 'Generated Song'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowPlaybackPanel(false);
                      setGeneratedSong(null);
                    }}
                    className="text-muted-foreground hover:text-foreground transition-colors text-2xl leading-none"
                  >
                    ✕
                  </button>
                </div>

                <SongPlaybackPanel
                  song={generatedSong}
                  gameState={gameState?.state || {}}
                  dispatch={gameState?.updateGameState}
                  onAccept={() => {
                    // Add song to gameState
                    if (gameState?.updateGameState) {
                      const currentSongs = gameState.state?.songs || [];
                      const newSong = {
                        ...generatedSong,
                        id: `song-${Date.now()}`,
                        recordedWeek: gameState.state?.week || 0,
                        totalEarnings: 0,
                        totalStreams: 0
                      };
                      gameState.updateGameState({
                        songs: [...currentSongs, newSong]
                      });
                    }

                    // Close panel
                    setShowPlaybackPanel(false);
                    setGeneratedSong(null);

                    // Show success message
                    alert(`✓ "${generatedSong.title}" added to your songs!`);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Album Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-foreground">Albums</h3>
          {songs.length > 0 && (
            <button
              onClick={handleCreateAlbum}
              disabled={selectedSongs.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Music size={18} />
              Create Album
            </button>
          )}
        </div>

        {selectedSongs.length > 0 && (
          <div className="bg-card border border-secondary/30 p-4 rounded-lg mb-6">
            <label className="block text-sm font-semibold mb-3">Album Name</label>
            <input
              type="text"
              value={albumName}
              onChange={(e) => setAlbumName(e.target.value)}
              placeholder="Enter album name"
              className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary mb-4"
            />
            <p className="text-xs text-muted-foreground">{selectedSongs.length} songs selected • Cost: $5,000</p>
          </div>
        )}

        {albums.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {albums.map(album => (
              <div key={album.id} className="bg-card border border-secondary/30 p-4 rounded-lg hover:border-secondary/60 transition-all">
                <h4 className="text-foreground font-semibold mb-2">{album.name}</h4>
                <p className="text-sm text-muted-foreground mb-1">Songs: <span className="text-secondary font-medium">{album.songs?.length || 0}</span></p>
                <p className="text-sm text-muted-foreground">Revenue: <span className="text-accent font-medium">${album.totalRevenue?.toLocaleString() || 0}</span></p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No albums released yet. Create one to start earning!</p>
        )}
      </div>
    </div>
  );
};
