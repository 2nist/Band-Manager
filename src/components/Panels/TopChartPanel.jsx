/**
 * TopChartPanel.jsx - Top 20 Artist Chart
 * 
 * Displays ranked list of bands/artists by fame
 * Shows player band position vs rivals
 * Includes logo generation for each band
 */
import { getBandLogoStyle, calculateLogoStyle, ensureFontLoaded } from '../../utils/helpers';
import Card from '../../ui/Card';

export const TopChartPanel = ({ chartLeaders, onBandClick, playerLogoState }) => {
  if (!chartLeaders || chartLeaders.length === 0) {
    return (
      <Card className="border border-primary/30 p-4 rounded-lg">
        <h3 className="text-lg font-bold text-foreground mb-4">Top 20 Artists</h3>
        <p className="text-muted-foreground">No artists on chart yet.</p>
      </Card>
    );
  }

  return (
    <Card className="border border-primary/30 p-4 rounded-lg">
      <h3 className="text-lg font-bold text-foreground mb-4">Top 20 Artists</h3>
      <ol className="space-y-2">
        {chartLeaders.map((band) => {
          // Get logo style - use player's actual logo if available, otherwise generate
          let logoStyle;
          if (band.isPlayer && playerLogoState) {
            // Use player's custom logo
            if (playerLogoState.logoFont) {
              ensureFontLoaded(playerLogoState.logoFont);
            }
            logoStyle = calculateLogoStyle(playerLogoState);
          } else {
            // Generate logo style for rival bands
            logoStyle = getBandLogoStyle(band.name);
          }

          return (
            <li
              key={band.name || band.id}
              onClick={() => onBandClick?.(band)}
              className={`p-3 rounded-lg border-2 transition-all ${
                band.isPlayer 
                  ? 'bg-primary/20 border-primary cursor-pointer hover:bg-primary/30' 
                  : 'card border-border hover:border-primary/50 cursor-pointer'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-sm font-bold text-muted-foreground min-w-[2rem] flex-shrink-0">
                    #{band.position}
                  </span>
                  <div className="flex-1 min-w-0">
                    {/* Band Logo/Name */}
                    <div
                      style={{
                        ...logoStyle,
                        fontSize: '14px',
                        border: band.isPlayer ? '2px solid var(--primary)' : 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: band.isPlayer ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent',
                        maxWidth: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                      className="mb-1"
                      title={band.name}
                    >
                      {band.name}
                    </div>
                    {band.isPlayer && (
                      <span className="text-xs text-primary font-medium">Your Band</span>
                    )}
                    {!band.isPlayer && band.genre && (
                      <span className="text-xs text-muted-foreground">{band.genre}</span>
                    )}
                  </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <div className="text-sm font-bold text-accent">{band.fame || 0}</div>
                  <div className="text-xs text-muted-foreground">Fame</div>
                </div>
              </div>
              {band.totalStreams > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {band.totalStreams.toLocaleString()} total streams
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </Card>
  );
};
