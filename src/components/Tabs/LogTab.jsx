/**
 * LogTab.jsx - Game event history and log
 * 
 * Displays:
 * - Chronological game events
 * - Important milestones
 * - Decision consequences
 */
export const LogTab = ({ gameData, gameState }) => {
  // Use gameState.gameLog if available, fallback to gameData.log for backwards compatibility
  const logEntries = gameState?.gameLog || gameData?.log || [];
  
  // Helper to determine styling based on entry type
  const getEntryStyling = (entry) => {
    // Handle both string entries (legacy) and object entries (new format)
    const message = typeof entry === 'string' ? entry : entry.message || '';
    const type = typeof entry === 'object' ? entry.type : 'info';
    
    let borderColor = 'border-primary/50';
    let bgColor = 'bg-primary/5';
    
    // Check type first (new format)
    if (type === 'error' || type === 'warning') {
      borderColor = 'border-destructive/50';
      bgColor = 'bg-destructive/5';
    } else if (type === 'success') {
      borderColor = 'border-secondary/50';
      bgColor = 'bg-secondary/5';
    } else if (type === 'info' || message.includes('Event') || message.includes('Random')) {
      borderColor = 'border-accent/50';
      bgColor = 'bg-accent/5';
    }
    
    // Fallback to string matching for legacy entries
    if (typeof entry === 'string') {
      if (message.includes('Error') || message.includes('Failed')) {
        borderColor = 'border-destructive/50';
        bgColor = 'bg-destructive/5';
      } else if (message.includes('Success') || message.includes('Earned')) {
        borderColor = 'border-secondary/50';
        bgColor = 'bg-secondary/5';
      }
    }
    
    return { borderColor, bgColor, message };
  };

  return (
    <div className="max-h-[600px] overflow-y-auto">
      <h3 className="text-xl font-bold text-foreground mb-4">Game Log</h3>
      <div className="flex flex-col gap-1">
        {logEntries.length > 0 ? (
          logEntries.slice().reverse().map((entry, idx) => {
            const { borderColor, bgColor, message } = getEntryStyling(entry);
            const entryId = typeof entry === 'object' ? entry.id : `log-${idx}`;
            const timestamp = typeof entry === 'object' && entry.timestamp 
              ? new Date(entry.timestamp).toLocaleTimeString() 
              : null;
            const week = typeof entry === 'object' ? entry.week : null;

            return (
              <div key={entryId} className={`px-4 py-3 ${bgColor} border-l-4 ${borderColor} rounded text-sm text-foreground/80 leading-relaxed`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="m-0 flex-1">{message}</p>
                  {(timestamp || week !== null) && (
                    <div className="text-xs text-muted-foreground flex-shrink-0">
                      {week !== null && <span>Week {week}</span>}
                      {timestamp && week !== null && <span> • </span>}
                      {timestamp && <span>{timestamp}</span>}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-muted-foreground">No events logged yet. Start playing and generate some history!</p>
        )}
      </div>
    </div>
  );
};
