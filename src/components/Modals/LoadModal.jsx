import React from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

export default function LoadModal({ 
  isOpen, 
  onClose, 
  onLoad, 
  saveSlots 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000" onClick={onClose}>
      <Card className="rounded-lg p-8 max-w-md w-11/12 max-h-[80vh] overflow-y-auto border-2 border-primary/30" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground m-0">Load Game</h2>
          <Button className="text-muted-foreground hover:text-destructive transition-colors text-xl" onClick={onClose}>✕</Button>
        </div>
        {Object.keys(saveSlots).length === 0 ? (
          <div>
            <p className="text-muted-foreground mb-6">No saved games found</p>
            <Button className="w-full px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded font-medium transition-colors" onClick={onClose}>Close</Button>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {Object.entries(saveSlots).map(([name, data]) => (
              <div key={name} className="p-3 bg-muted/50 rounded border border-border/20 mb-2">
                <div className="font-bold text-foreground mb-2">{name}</div>
                <div className="text-sm text-muted-foreground mb-3">
                  <div>Band: {data.bandName}</div>
                  <div>Week: {data.state.week} • Fame: {data.state.fame} • Money: ${data.state.money.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground/60 mt-2">
                    Saved: {new Date(data.timestamp).toLocaleString()}
                  </div>
                </div>
                <Button className="w-full px-4 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded font-medium transition-colors text-sm" onClick={() => onLoad(name)}>
                  Load This Game
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
