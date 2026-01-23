import React, { useState, useEffect } from 'react';
import { STUDIO_TIERS } from '../../utils/constants';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

export default function AlbumBuilderModal({ 
  isOpen, 
  onClose, 
  onRecordAlbum, 
  songs, 
  studioTier,
  difficulty 
}) {
  const [selectedSongs, setSelectedSongs] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedSongs([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const availableSongs = songs.filter(s => !s.inAlbum);
  const costMultiplier = difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.2 : 1;
  const albumCost = Math.floor(
    STUDIO_TIERS[studioTier].recordCost * selectedSongs.length * 0.8 * 1.5 * costMultiplier
  );

  const toggleSong = (songId) => {
    if (selectedSongs.includes(songId)) {
      setSelectedSongs(prev => prev.filter(t => t !== songId));
    } else {
      if (selectedSongs.length >= 12) {
        alert('Albums can have at most 12 songs.');
        return;
      }
      setSelectedSongs(prev => [...prev, songId]);
    }
  };

  const handleRecord = () => {
    if (selectedSongs.length < 8) {
      alert('Need at least 8 songs to release an album (maximum 12).');
      return;
    }
    onRecordAlbum(selectedSongs);
    setSelectedSongs([]);
    onClose();
  };

  const selectedSongObjects = songs.filter(s => selectedSongs.includes(s.id || s.title));

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000" onClick={onClose}>
      <Card className="rounded-lg p-8 max-w-3xl w-11/12 max-h-[90vh] overflow-y-auto border-2 border-primary/30" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-3 text-foreground text-xl font-bold">Build Album</h2>
        <p className="mb-6 text-muted-foreground">
          Select 8-12 songs to compile into an album. Albums provide sustained streaming revenue and boost your overall reputation.
        </p>
        
        {availableSongs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>You don't have any songs available for an album.</p>
            <p className="text-sm mt-2">All your songs are already part of albums, or you need to record more singles.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <strong className="text-foreground">Available Songs ({availableSongs.length})</strong>
                <span className={selectedSongs.length >= 8 ? 'text-secondary text-sm' : 'text-accent text-sm'}>
                  Selected: {selectedSongs.length} / 12
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto p-2 bg-muted/30 rounded border border-border/20">
                {availableSongs.map((song) => {
                  const songKey = song.id || song.title;
                  const isSelected = selectedSongs.includes(songKey);
                  return (
                    <div
                      key={songKey}
                      onClick={() => toggleSong(songKey)}
                      className={`p-2 rounded border-2 cursor-pointer transition-all text-xs ${
                        isSelected 
                          ? 'bg-primary/20 border-primary' 
                          : 'bg-muted/50 border-border/50 hover:border-border'
                      }`}
                    >
                      <div className="font-semibold text-foreground mb-1">{song.title}</div>
                      <div className="text-muted-foreground">
                        Q{song.quality} • Pop {song.popularity || 0}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {selectedSongs.length > 0 && (
              <div className="mb-6 p-3 bg-secondary/10 rounded border border-secondary/30">
                <strong className="text-secondary">Album Preview</strong>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div>Songs: {selectedSongs.length}</div>
                  <div>
                    Avg Quality: {selectedSongObjects.length > 0 
                      ? Math.round(selectedSongObjects.reduce((sum, s) => sum + (s.quality || 0), 0) / selectedSongObjects.length)
                      : 0}%
                  </div>
                  <div>
                    Estimated Album Quality: ~{selectedSongObjects.length > 0
                      ? Math.min(100, Math.round(
                          (selectedSongObjects.reduce((sum, s) => sum + (s.quality || 0), 0) / selectedSongObjects.length) +
                          STUDIO_TIERS[studioTier].qualityBonus * 1.5
                        ))
                      : 0}%
                  </div>
                  <div className="mt-2 text-accent font-medium">
                    Estimated Cost: ${albumCost}
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3 justify-end">
              <Button
                className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium transition-colors"
                onClick={() => {
                  setSelectedSongs([]);
                  onClose();
                }}
              >
                Cancel
              </Button>
              <Button
                className={`flex-1 px-4 py-2 rounded font-medium transition-colors ${
                  selectedSongs.length >= 8 && selectedSongs.length <= 12
                    ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                }`}
                onClick={handleRecord}
                disabled={selectedSongs.length < 8 || selectedSongs.length > 12}
              >
                Release Album ({selectedSongs.length} songs)
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
