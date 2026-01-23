/**
 * ToursModal.jsx - Tour management modal
 */
import Button from '../../ui/Button';
import Card from '../../ui/Card';
export const ToursModal = ({ isOpen, onClose, gameData, onStartTour }) => {
  if (!isOpen) return null;

  const tours = [
    { id: 'regional-us', name: 'US Regional Tour', region: 'North America', duration: 4, cost: 5000, potential: 15000 },
    { id: 'europe', name: 'European Tour', region: 'Europe', duration: 6, cost: 8000, potential: 25000 },
    { id: 'asia', name: 'Asian Tour', region: 'Asia', duration: 5, cost: 10000, potential: 30000 },
    { id: 'world', name: 'World Tour', region: 'Global', duration: 12, cost: 25000, potential: 100000 }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000">
      <Card className="rounded-xl p-8 max-w-2xl w-11/12 max-h-[80vh] overflow-y-auto border-2 border-primary/30">
        <h3 className="m-0 mb-6 text-foreground text-xl font-bold">Manage Tours</h3>

        <div className="flex flex-col gap-4 mb-8">
          {tours.map(tour => (
            <div
              key={tour.id}
              className="bg-muted/50 p-4 rounded border border-border/20"
            >
              <div className="flex justify-between mb-2">
                <div>
                  <h4 className="m-0 mb-1 text-foreground font-semibold">{tour.name}</h4>
                  <p className="m-0 text-sm text-muted-foreground">
                    {tour.region} • {tour.duration} weeks
                  </p>
                </div>
                <Button
                  onClick={() => onStartTour?.(tour)}
                  disabled={gameData?.money < tour.cost}
                  className={`px-6 py-2 rounded font-medium transition-colors flex-shrink-0 ${
                    gameData?.money >= tour.cost 
                      ? 'bg-secondary hover:bg-secondary/90 text-secondary-foreground' 
                      : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                  }`}
                >
                  Start
                </Button>
              </div>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>Cost: <span className="text-accent">${tour.cost.toLocaleString()}</span></span>
                <span>Potential: <span className="text-secondary">${tour.potential.toLocaleString()}</span></span>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={onClose}
          className="w-full px-6 py-3 bg-destructive/30 hover:bg-destructive/40 text-foreground rounded font-medium transition-colors"
        >
          Close
        </Button>
      </Card>
    </div>
  );
};
