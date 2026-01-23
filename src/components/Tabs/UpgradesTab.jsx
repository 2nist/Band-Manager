import React, { useState } from 'react';
import { Zap, Plus } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';

/**
 * UpgradesTab.jsx - Equipment and skill upgrades
 * 
 * Displays:
 * - Available equipment upgrades
 * - Purchased upgrades and improvements
 * - Equipment tier levels
 * - ACTION: Purchase studio, instruments, and stage gear
 */
export const UpgradesTab = ({ gameData, equipmentUpgrades, gameState }) => {
  const [showStudio, setShowStudio] = useState(true);
  const [showInstruments, setShowInstruments] = useState(true);
  const [showStageGear, setShowStageGear] = useState(true);

  const handleUpgrade = (type, itemId) => {
    if (type === 'studio') {
      equipmentUpgrades?.upgradeStudio?.();
    } else if (type === 'instruments') {
      equipmentUpgrades?.upgradeInstruments?.(itemId);
    } else if (type === 'stage-gear') {
      equipmentUpgrades?.buyStageEquipment?.(itemId);
    }
  };

  const money = gameState?.state?.money || 0;
  const studioUpgrades = equipmentUpgrades?.getAvailableStudioUpgrades?.() || [];
  const instrumentUpgrades = equipmentUpgrades?.INSTRUMENT_TIERS || [];
  const stageEquipment = equipmentUpgrades?.STAGE_EQUIPMENT || [];
  const stats = equipmentUpgrades?.getTotalPerformanceBonus?.() || 0;

  return (
    <div className="space-y-8">
      {/* Current Status */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="p-6 border rounded-lg border-primary/30">
          <div className="mb-2 text-xs uppercase text-muted-foreground">Budget</div>
          <div className="text-2xl font-bold text-accent">${money.toLocaleString()}</div>
        </Card>
        <Card className="p-6 border rounded-lg border-secondary/30">
          <div className="mb-2 text-xs uppercase text-muted-foreground">Performance Bonus</div>
          <div className="text-2xl font-bold text-secondary">+{stats}%</div>
        </Card>
        <Card className="p-6 border rounded-lg border-primary/30">
          <div className="mb-2 text-xs uppercase text-muted-foreground">Total Investments</div>
          <div className="text-2xl font-bold text-primary">${((gameState?.state?.totalUpgradeCost || 0)).toLocaleString()}</div>
        </Card>
      </div>

      {/* Studio Upgrades */}
      <div className="pt-6 border-t border-border/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground">Studio Equipment</h3>
          <Button onClick={() => setShowStudio(!showStudio)} className="px-3 py-1 text-sm rounded bg-muted text-muted-foreground hover:bg-muted/80">
            {showStudio ? 'Hide' : 'Show'}
          </Button>
        </div>

        {showStudio && (
          <div className="space-y-3">
            {studioUpgrades.length > 0 ? (
              studioUpgrades.map((upgrade, idx) => (
                <Card key={idx} className="flex items-center justify-between p-4 border rounded-lg border-primary/30">
                  <div>
                    <h4 className="font-semibold text-foreground">{upgrade.name}</h4>
                    <p className="text-sm text-muted-foreground">Quality: +{upgrade.qualityBonus} • Cost: ${upgrade.cost.toLocaleString()}</p>
                  </div>
                  <Button onClick={() => handleUpgrade('studio', upgrade.id)} disabled={money < upgrade.cost} className="px-4 py-2 font-semibold rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50">
                    Upgrade
                  </Button>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground">No studio upgrades available</p>
            )}
          </div>
        )}
      </div>

      {/* Instrument Upgrades */}
      <div className="pt-6 border-t border-border/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground">Instruments</h3>
          <button
            onClick={() => setShowInstruments(!showInstruments)}
            className="px-3 py-1 text-sm transition-all rounded bg-muted text-muted-foreground hover:bg-muted/80"
          >
            {showInstruments ? 'Hide' : 'Show'}
          </button>
        </div>

        {showInstruments && (
          <div className="space-y-3">
            {instrumentUpgrades.slice(0, 4).map((tier, idx) => (
              <Card key={idx} className="flex items-center justify-between p-4 border rounded-lg border-secondary/30">
                <div>
                  <h4 className="font-semibold text-foreground">{tier.name}</h4>
                  <p className="text-sm text-muted-foreground">Bonus: +{tier.performanceBonus}% • Cost: ${tier.cost.toLocaleString()}</p>
                </div>
                <Button onClick={() => handleUpgrade('instruments', idx)} disabled={money < tier.cost} className="px-4 py-2 font-semibold rounded bg-secondary text-secondary-foreground hover:opacity-90 disabled:opacity-50">
                  Buy
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Stage Gear */}
      <div className="pt-6 border-t border-border/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground">Stage Gear</h3>
          <button
            onClick={() => setShowStageGear(!showStageGear)}
            className="px-3 py-1 text-sm transition-all rounded bg-muted text-muted-foreground hover:bg-muted/80"
          >
            {showStageGear ? 'Hide' : 'Show'}
          </button>
        </div>

        {showStageGear && (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {stageEquipment.slice(0, 6).map((gear, idx) => (
              <Card key={idx} className="p-4 border rounded-lg border-accent/30">
                <h4 className="mb-2 font-semibold text-foreground">{gear.name}</h4>
                <p className="mb-3 text-sm text-muted-foreground">
                  Bonus: +{gear.prestige}pts • Cost: ${gear.cost.toLocaleString()}
                </p>
                <Button onClick={() => handleUpgrade('stage-gear', gear.id)} disabled={money < gear.cost} className="w-full px-3 py-2 text-sm font-semibold rounded bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-50">
                  Purchase
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade History */}
      <div className="pt-6 border-t border-border/20">
        <h3 className="mb-4 text-xl font-bold text-foreground">Upgrade History</h3>
        {(gameState?.state?.upgrades || []).length > 0 ? (
          <div className="flex flex-col gap-2">
            {(gameState?.state?.upgrades || []).slice(-10).reverse().map((upgrade, idx) => (
              <Card key={idx} className="flex items-start justify-between p-4 transition-all border rounded-lg border-border/20 hover:border-primary/30">
                <div>
                  <p className="m-0 font-semibold text-foreground">{upgrade.name || upgrade}</p>
                  {upgrade.type && <p className="mt-1 text-sm text-muted-foreground">Type: {upgrade.type}</p>}
                </div>
                {upgrade.cost && <div className="ml-4 font-bold text-secondary">-${upgrade.cost.toLocaleString()}</div>}
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No upgrades purchased yet. Save up and improve your gear!</p>
        )}
      </div>
    </div>
  );
};
