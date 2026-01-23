/**
 * SongChartPanel.jsx - Top 30 Song Chart
 * 
 * Displays ranked list of songs by chartScore
 * Shows player songs vs rival songs
 * Includes band logos for each song
 */
import { getBandLogoStyle, calculateLogoStyle, ensureFontLoaded } from '../../utils/helpers';
import Card from '../../ui/Card';

export const SongChartPanel = ({ songChart, playerLogoState }) => {
  if (!songChart || songChart.length === 0) {
    return (
      <Card className="border border-accent/30 p-4 rounded-lg">
        <h3 className="text-lg font-bold text-foreground mb-4">Top 30 Songs</h3>
        <p className="text-muted-foreground">No songs on chart yet.</p>
      </Card>
    );
  }

  return (
    <Card className="border border-accent/30 p-4 rounded-lg">
      <h3 className="text-lg font-bold text-foreground mb-4">Top 30 Songs</h3>
      <ol className="space-y-2 max-h-[600px] overflow-y-auto">
        {songChart.map((song) => {
          // Get logo style for the band
          let logoStyle;
          if (song.isPlayer && playerLogoState) {
            if (playerLogoState.logoFont) {
              ensureFontLoaded(playerLogoState.logoFont);
            }
            logoStyle = calculateLogoStyle(playerLogoState);
          } else {
            logoStyle = getBandLogoStyle(song.bandName);
          }

          return (
            <li
              key={`${song.title}-${song.bandName}-${song.id || ''}`}
              className={`p-3 rounded-lg border-2 ${
                song.isPlayer 
                  ? 'bg-accent/20 border-accent' 
                  : 'card border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm font-bold text-muted-foreground min-w-[2rem] flex-shrink-0">
                    #{song.position}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground truncate mb-1">{song.title}</div>
                    {/* Band Logo */}
                    <div
                      style={{
                        ...logoStyle,
                        fontSize: '12px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        backgroundColor: song.isPlayer ? 'rgba(var(--accent-rgb), 0.1)' : 'transparent',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'inline-block'
                      }}
                      title={song.bandName}
                    >
                      {song.bandName}
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <div className="text-xs font-bold text-accent">
                    Score: {Math.round(song.chartScore || 0)}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex gap-3 flex-wrap">
                  <span>Pop {song.popularity || 0}</span>
                  <span>Q{song.quality || 0}</span>
                  {song.weeklyStreams > 0 && (
                    <span>{((song.weeklyStreams || 0) / 1000).toFixed(1)}k streams/wk</span>
                  )}
                  <span>Age {song.age || 0}w</span>
                </div>
                {song.genre && (
                  <div className="text-xs text-muted-foreground/70">
                    {song.genre}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
};
