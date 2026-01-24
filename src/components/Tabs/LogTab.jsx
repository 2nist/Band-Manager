import React, { useState, useMemo } from 'react';

/**
 * LogTab.jsx - Game event history and log
 * 
 * Displays:
 * - Chronological game events
 * - Important milestones
 * - Decision consequences
 * - Enhanced with emotional tone, narrative weight, and categorization
 */
export const LogTab = ({ gameData, gameState, gameLog }) => {
  // Prioritize gameLog prop, then gameState.gameLog (the real log from useGameState), fallback to gameData.log for backwards compatibility
  const logEntries = gameLog ?? gameState?.gameLog ?? gameData?.log ?? [];
  
  const [groupByCategory, setGroupByCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Get unique categories from log entries
  const categories = useMemo(() => {
    const cats = new Set(['all']);
    logEntries.forEach(entry => {
      if (typeof entry === 'object' && entry.category) {
        cats.add(entry.category);
      }
    });
    return Array.from(cats);
  }, [logEntries]);
  
  // Filter and group entries
  const displayEntries = useMemo(() => {
    let filtered = logEntries;
    
    // Filter by category if selected
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(entry => {
        if (typeof entry === 'object') {
          return entry.category === selectedCategory;
        }
        return false;
      });
    }
    
    // If grouping by category, sort by category first
    if (groupByCategory) {
      filtered = [...filtered].sort((a, b) => {
        const catA = typeof a === 'object' ? a.category || 'general' : 'general';
        const catB = typeof b === 'object' ? b.category || 'general' : 'general';
        return catA.localeCompare(catB);
      });
    }
    
    return filtered;
  }, [logEntries, selectedCategory, groupByCategory]);
  
  // Get category display name
  const getCategoryName = (category) => {
    if (!category) return 'General';
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };
  
  // Get icon for entry
  const getEntryIcon = (entry) => {
    if (typeof entry === 'object' && entry.icon) {
      const iconMap = {
        substance_warning: '💊',
        corruption_alert: '⚠️',
        violence_warning: '⚔️',
        relationship_icon: '💔',
        mental_health_icon: '🧠',
        performance_icon: '🎤',
        business_icon: '💼',
        error_icon: '❌',
        warning_icon: '⚠️',
        success_icon: '✅',
        info_icon: 'ℹ️'
      };
      return iconMap[entry.icon] || '📝';
    }
    
    const type = typeof entry === 'object' ? entry.type : 'info';
    const typeIconMap = {
      error: '❌',
      warning: '⚠️',
      success: '✅',
      info: 'ℹ️'
    };
    return typeIconMap[type] || '📝';
  };
  
  // Helper to determine styling based on entry type
  const getEntryStyling = (entry) => {
    // Handle both string entries (legacy) and object entries (new format)
    const message = typeof entry === 'string' ? entry : entry.message || '';
    const type = typeof entry === 'object' ? entry.type : 'info';
    const narrativeWeight = typeof entry === 'object' ? entry.narrative_weight : null;
    
    let borderColor = 'border-primary/50';
    let bgColor = 'bg-primary/5';
    let weightClass = '';
    
    // Check narrative weight first (highest priority)
    if (narrativeWeight === 'critical') {
      borderColor = 'border-destructive';
      bgColor = 'bg-destructive/10';
      weightClass = 'border-l-4';
    } else if (narrativeWeight === 'high') {
      borderColor = 'border-warning';
      bgColor = 'bg-warning/10';
      weightClass = 'border-l-2';
    }
    
    // Check type (new format)
    if (!narrativeWeight) {
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
    
    return { borderColor, bgColor, message, weightClass };
  };

  return (
    <div className="max-h-[600px] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground">Game Log</h3>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground flex items-center gap-2">
            <input
              type="checkbox"
              checked={groupByCategory}
              onChange={(e) => setGroupByCategory(e.target.checked)}
              className="w-4 h-4"
            />
            Group by category
          </label>
          {(groupByCategory || selectedCategory !== 'all') && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-sm px-2 py-1 border rounded bg-background text-foreground"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : getCategoryName(cat)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {displayEntries.length > 0 ? (
          displayEntries.slice().reverse().map((entry, idx) => {
            const { borderColor, bgColor, message, weightClass } = getEntryStyling(entry);
            const entryId = typeof entry === 'object' ? entry.id : `log-${idx}`;
            const timestamp = typeof entry === 'object' && entry.timestamp 
              ? new Date(entry.timestamp).toLocaleTimeString() 
              : null;
            const week = typeof entry === 'object' ? entry.week : null;
            const category = typeof entry === 'object' ? entry.category : null;
            const emotionalTone = typeof entry === 'object' ? entry.emotional_tone : null;
            const narrativeWeight = typeof entry === 'object' ? entry.narrative_weight : null;
            const icon = getEntryIcon(entry);

            return (
              <div 
                key={entryId} 
                className={`px-4 py-3 ${bgColor} ${borderColor} ${weightClass} rounded text-sm text-foreground/80 leading-relaxed transition-all hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-lg flex-shrink-0">{icon}</span>
                    <div className="flex-1">
                      <p className="m-0">{message}</p>
                      {(category || emotionalTone || narrativeWeight) && (
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          {category && (
                            <span className="px-2 py-0.5 bg-background/50 rounded">
                              {getCategoryName(category)}
                            </span>
                          )}
                          {emotionalTone && (
                            <span className="px-2 py-0.5 bg-background/50 rounded">
                              {emotionalTone}
                            </span>
                          )}
                          {narrativeWeight && (
                            <span className={`px-2 py-0.5 rounded ${
                              narrativeWeight === 'critical' ? 'bg-destructive/20' :
                              narrativeWeight === 'high' ? 'bg-warning/20' :
                              'bg-accent/20'
                            }`}>
                              {narrativeWeight}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
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
