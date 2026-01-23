/**
 * UpgradesModal.jsx - Equipment and skill upgrades modal
 */
import Card from '../../ui/Card';
import Button from '../../ui/Button';

export const UpgradesModal = ({ isOpen, onClose, gameData, onPurchase }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000">
      <Card className="rounded-xl p-8 max-w-2xl w-11/12 max-h-[80vh] overflow-y-auto border-2 border-primary/30">
        <h3 className="m-0 mb-6 text-foreground text-xl font-bold">Equipment Upgrades</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {[
            { name: 'Studio Upgrade', cost: 5000, benefit: '+20% recording quality' },
            { name: 'Transport Upgrade', cost: 3000, benefit: '+15% tour earnings' },
            { name: 'Gear Package', cost: 2000, benefit: '+10% performance quality' },
            { name: 'Sound System', cost: 4000, benefit: '+25% gig success' }
          ].map((upgrade, idx) => (
            <div
              key={idx}
              className="bg-muted/50 p-4 rounded border border-border/20 text-center"
            >
              <h4 className="m-0 mb-2 text-sm font-semibold text-foreground">{upgrade.name}</h4>
              <p className="m-2 text-xs text-muted-foreground">{upgrade.benefit}</p>
              <Button onClick={() => onPurchase?.(upgrade)} disabled={gameData?.money < upgrade.cost} className={`w-full px-3 py-2 rounded text-xs font-medium ${gameData?.money >= upgrade.cost ? 'bg-secondary text-secondary-foreground' : 'bg-muted text-muted-foreground'}`}>
                ${upgrade.cost.toLocaleString()}
              </Button>
            </div>
          ))}
        </div>
        <Button onClick={onClose} className="w-full px-6 py-3 bg-destructive/30 hover:bg-destructive/40 text-foreground rounded font-medium">
          Close
        </Button>
      </Card>
    </div>
  );
};
