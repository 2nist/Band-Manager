import React, { useState, useEffect } from 'react';
import { STUDIO_TIERS } from '../../utils/constants';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

export default function WriteSongModal({ 
  isOpen, 
  onClose, 
  onRecord, 
  studioTier, 
  difficulty,
  defaultTitle,
  addLog 
}) {
  const [songTitle, setSongTitle] = useState(defaultTitle || '');
  const [genre, setGenre] = useState('Pop');
  const [energy, setEnergy] = useState(5);
  const [quality, setQuality] = useState(5);
  const [themes, setThemes] = useState('');
  
  const genres = ['Pop', 'Rock', 'Hip-Hop', 'Electronic', 'R&B', 'Country', 'Alternative', 'Indie', 'Metal'];
  const themeOptions = ['Love', 'Loss', 'Success', 'Struggle', 'Nature', 'Urban', 'Dreams', 'Rebellion', 'Freedom'];
  
  useEffect(() => {
    if (isOpen && defaultTitle) {
      setSongTitle(defaultTitle);
    }
  }, [isOpen, defaultTitle]);

  if (!isOpen) return null;

  const costMultiplier = difficulty === 'easy' ? 0.8 : difficulty === 'hard' ? 1.2 : 1;
  const cost = Math.floor(STUDIO_TIERS[studioTier].recordCost * costMultiplier);

  const handleRecord = () => {
    if (!songTitle || !songTitle.trim()) {
      alert('Please enter a song title');
      return;
    }
    
    const selectedThemes = themeOptions.filter((_, i) => 
      themes.includes(i.toString())
    );
    
    onRecord({
      title: songTitle.trim(),
      genre,
      energy: parseInt(energy),
      quality: parseInt(quality),
      themes: selectedThemes
    });
    
    // Reset form
    setSongTitle('');
    setGenre('Pop');
    setEnergy(5);
    setQuality(5);
    setThemes('');
  };

  const handleClose = () => {
    setSongTitle('');
    setGenre('Pop');
    setEnergy(5);
    setQuality(5);
    setThemes('');
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRecord();
    } else if (e.key === 'Escape') {
      handleClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000" onClick={handleClose}>
      <Card className="rounded-lg p-8 max-w-2xl w-11/12 max-h-[90vh] overflow-y-auto border-2 border-primary/30" onClick={(e) => e.stopPropagation()}>
        <h2 className="mb-3 text-foreground text-xl font-bold">Write & Record Song</h2>
        <p className="mb-6 text-muted-foreground">
          Create a new single at {STUDIO_TIERS[studioTier].name}. Customize title, genre, energy, and themes.
        </p>
        
        {/* Song Title */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-foreground">Song Title</label>
          <input
            type="text"
            value={songTitle}
            onChange={(e) => setSongTitle(e.target.value)}
            placeholder="Enter song title..."
            className="w-full px-3 py-2 bg-input border border-border/50 rounded text-foreground placeholder-muted-foreground text-base"
            onKeyDown={handleKeyDown}
            autoFocus
          />
        </div>

        {/* Genre Selection */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-foreground">Genre</label>
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="w-full px-3 py-2 bg-input border border-border/50 rounded text-foreground text-base"
          >
            {genres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Energy Level */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-foreground">
            Energy Level: <span className="text-accent">{energy}/10</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(e.target.value)}
            className="w-full h-2 bg-input rounded accent-primary"
          />
          <p className="text-xs text-muted-foreground mt-1">Higher energy = more upbeat/intense</p>
        </div>

        {/* Quality/Effort */}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-foreground">
            Production Effort: <span className="text-secondary">{quality}/10</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="w-full h-2 bg-input rounded accent-secondary"
          />
          <p className="text-xs text-muted-foreground mt-1">Higher effort = better base quality</p>
        </div>

        {/* Themes */}
        <div className="mb-6">
          <label className="block mb-2 font-bold text-foreground">Themes (select multiple)</label>
          <div className="grid grid-cols-2 gap-2">
            {themeOptions.map((theme, idx) => (
              <label key={theme} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={themes.includes(idx.toString())}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setThemes(themes + idx.toString());
                    } else {
                      setThemes(themes.replace(idx.toString(), ''));
                    }
                  }}
                  className="w-4 h-4"
                />
                <span className="text-foreground text-sm">{theme}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Studio Info */}
        <div className="p-3 bg-muted/30 rounded border border-border/20 mb-6">
          <div className="flex justify-between mb-1">
            <span className="text-muted-foreground">Studio:</span>
            <strong className="text-foreground">{STUDIO_TIERS[studioTier].name}</strong>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-muted-foreground">Recording Cost:</span>
            <strong className="text-accent">${cost}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Quality Bonus:</span>
            <strong className="text-secondary">+{STUDIO_TIERS[studioTier].qualityBonus}%</strong>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleRecord} disabled={!songTitle || !songTitle.trim()} className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded font-medium">
            Record Song
          </Button>
          <Button onClick={handleClose} className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium">
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}
