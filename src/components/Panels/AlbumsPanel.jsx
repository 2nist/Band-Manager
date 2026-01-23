/**
 * AlbumsPanel.jsx - Top 20 Album Chart
 * 
 * Displays ranked list of albums by chartScore
 * Shows player albums vs rival albums
 * Includes band logos for each album
 */
import { getBandLogoStyle, calculateLogoStyle, ensureFontLoaded } from '../../utils/helpers';
import Card from '../../ui/Card';

export const AlbumsPanel = ({ albumChart, playerLogoState }) => {
  if (!albumChart || albumChart.length === 0) {
    return (
      <Card className="border border-secondary/30 p-4 rounded-lg">
        <h3 className="text-lg font-bold text-foreground mb-4">Top 20 Albums</h3>
        <p className="text-muted-foreground">No albums on chart yet.</p>
      </Card>
    );
  }

  return (
    <Card className="border border-secondary/30 p-4 rounded-lg">
      <h3 className="text-lg font-bold text-foreground mb-4">Top 20 Albums</h3>
      <ol className="space-y-2 max-h-[600px] overflow-y-auto">
        {albumChart.map((album) => {
          // Get logo style for the band
          let logoStyle;
          if (album.isPlayer && playerLogoState) {
            if (playerLogoState.logoFont) {
              ensureFontLoaded(playerLogoState.logoFont);
            }
            logoStyle = calculateLogoStyle(playerLogoState);
          } else {
            logoStyle = getBandLogoStyle(album.bandName);
          }

          return (
            <li
              key={`${album.name}-${album.bandName}-${album.id || ''}`}
              className={`p-3 rounded-lg border-2 ${
                album.isPlayer 
                  ? 'bg-secondary/20 border-secondary' 
                  : 'card border-border'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="text-sm font-bold text-muted-foreground min-w-[2rem] flex-shrink-0">
                    #{album.position}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground truncate mb-1">{album.name}</div>
                    {/* Band Logo */}
                    <div
                      style={{
                        ...logoStyle,
                        fontSize: '12px',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        backgroundColor: album.isPlayer ? 'rgba(var(--secondary-rgb), 0.1)' : 'transparent',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'inline-block'
                      }}
                      title={album.bandName}
                    >
                      {album.bandName}
                    </div>
                  </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <div className="text-sm font-bold text-secondary">
                    Score: {album.chartScore || 0}
                  </div>
                </div>
              </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex gap-3 flex-wrap">
                <span>Q{album.quality || 0}</span>
                <span>Pop {album.popularity || 0}</span>
                {album.totalStreams > 0 && (
                  <span>{((album.totalStreams || 0) / 1000).toFixed(1)}k streams/wk</span>
                )}
                <span>Age {album.age || 0}w</span>
              </div>
              {album.songIds && (
                <div className="text-xs text-muted-foreground/70">
                  {album.songIds.length} tracks
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
