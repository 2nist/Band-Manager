import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

export default function SaveModal({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete,
  saveSlots,
  autoSaveEnabled,
  onToggleAutoSave 
}) {
  const [saveName, setSaveName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const name = saveName.trim() || `Save ${new Date().toLocaleDateString()}`;
    onSave(name);
    setSaveName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000" onClick={onClose}>
      <Card className="rounded-lg p-8 max-w-md w-11/12 max-h-[80vh] overflow-y-auto border-2 border-primary/30" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground m-0">Save Game</h2>
          <Button className="text-muted-foreground hover:text-destructive transition-colors text-xl" onClick={onClose}>✕</Button>
        </div>
        <div className="mb-6">
          <label className="block text-foreground font-medium mb-2">Save Slot Name</label>
          <input
            type="text"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Enter save name..."
            className="w-full px-3 py-2 bg-input border border-border/50 rounded text-foreground placeholder-muted-foreground"
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="mb-6 max-h-[300px] overflow-y-auto">
          <h3 className="text-lg font-bold text-foreground mb-3">Existing Saves</h3>
          {Object.keys(saveSlots).length === 0 ? (
            <p className="text-muted-foreground">No saved games</p>
          ) : (
            <div className="flex flex-col gap-2">
              {Object.entries(saveSlots).map(([name, data]) => (
                <div key={name} className="p-3 bg-muted/50 rounded border border-border/20">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-bold text-foreground">{name}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {data.bandName} • Week {data.state.week} • ${data.state.money.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground/60 mt-1">
                        {new Date(data.timestamp).toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button className="px-2 py-1 text-xs bg-primary/20 hover:bg-primary/30 text-foreground rounded transition-colors" onClick={() => onSave(name)}>
                        Overwrite
                      </Button>
                      <Button className="px-2 py-1 text-xs bg-destructive/20 hover:bg-destructive/30 text-destructive rounded transition-colors" onClick={() => onDelete(name)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-3 mb-4">
          <Button className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded font-medium transition-colors" onClick={handleSave}>
            Save
          </Button>
          <Button className="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium transition-colors" onClick={onClose}>Cancel</Button>
        </div>
        <div className="mt-4 p-3 bg-secondary/10 rounded border border-secondary/30">
          <label className="flex items-center gap-2 cursor-pointer text-foreground text-sm">
            <input
              type="checkbox"
              checked={autoSaveEnabled}
              onChange={(e) => onToggleAutoSave(e.target.checked)}
            />
            Enable Auto-Save (saves automatically each week)
          </label>
        </div>
      </Card>
    </div>
  );
}
