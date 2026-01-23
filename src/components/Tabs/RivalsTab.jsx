/**
 * RivalsTab.jsx - Rival bands and competition
 * 
 * Displays:
 * - Rival band listings
 * - Competition metrics
 * - Relationship status and hostility levels
 */
import Card from '../../ui/Card';
export const RivalsTab = ({ gameData }) => (
  <div>
    <h3 className="text-xl font-bold text-foreground mb-4">Rival Bands</h3>
    {gameData?.rivals?.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gameData.rivals.map(rival => (
          <Card key={rival.id} className="border border-border/20 p-4 rounded-lg hover:border-destructive/30 transition-all">
            <h4 className={`font-semibold mb-3 ${rival.hostility > 70 ? 'text-destructive' : 'text-foreground'}`}>{rival.name}</h4>
            
            <div className="mb-3">
              <div className="text-muted-foreground text-sm mb-1">Skill</div>
              <div className="h-1.5 bg-input rounded overflow-hidden mb-1">
                <div className="h-full bg-primary" style={{ width: `${(rival.skill / 10) * 100}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{rival.skill}/10</p>
            </div>

            <div className="mb-3">
              <div className="text-muted-foreground text-sm mb-1">Fame</div>
              <div className="h-1.5 bg-input rounded overflow-hidden mb-1">
                <div className="h-full bg-accent" style={{ width: `${Math.min(rival.fame / 100, 100)}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{rival.fame}</p>
            </div>

            <div>
              <div className="text-muted-foreground text-sm mb-1">Hostility</div>
              <div className="h-1.5 bg-input rounded overflow-hidden mb-1">
                <div className={`h-full ${rival.hostility > 70 ? 'bg-destructive' : 'bg-secondary'}`} style={{ width: `${rival.hostility}%` }} />
              </div>
              <p className="text-xs text-muted-foreground">{rival.hostility}%</p>
            </div>
          </Card>
        ))}
      </div>
    ) : (
      <p className="text-muted-foreground">No rivals yet. Make a name for yourself and you'll attract competition!</p>
    )}
  </div>
);
