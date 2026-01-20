import React, { useState } from 'react';
import { Zap, Plus } from 'lucide-react';

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-primary/30 p-6 rounded-lg">
          <div className="text-muted-foreground text-xs uppercase mb-2">💰 Budget</div>
          <div className="text-2xl font-bold text-accent">${money.toLocaleString()}</div>
        </div>
        <div className="bg-card border border-secondary/30 p-6 rounded-lg">
          <div className="text-muted-foreground text-xs uppercase mb-2">⚡ Performance Bonus</div>
          <div className="text-2xl font-bold text-secondary">+{stats}%</div>
        </div>
        <div className="bg-card border border-primary/30 p-6 rounded-lg">
          <div className="text-muted-foreground text-xs uppercase mb-2">📊 Total Investments</div>
          <div className="text-2xl font-bold text-primary">${((gameState?.state?.totalUpgradeCost || 0)).toLocaleString()}</div>
        </div>
      </div>

      {/* Studio Upgrades */}
      <div className="border-t border-border/20 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground">🏢 Studio Equipment</h3>
          <button
            onClick={() => setShowStudio(!showStudio)}
            className="text-sm px-3 py-1 bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-all"
          >
            {showStudio ? 'Hide' : 'Show'}
          </button>
        </div>

        {showStudio && (
          <div className="space-y-3">
            {studioUpgrades.length > 0 ? (
              studioUpgrades.map((upgrade, idx) => (
                <div key={idx} className="bg-card border border-primary/30 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <h4 className="text-foreground font-semibold">{upgrade.name}</h4>
                    <p className="text-sm text-muted-foreground">Quality: +{upgrade.qualityBonus} • Cost: ${upgrade.cost.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => handleUpgrade('studio', upgrade.id)}
                    disabled={money < upgrade.cost}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all"
                  >
                    Upgrade
                  </button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No studio upgrades available</p>
            )}
          </div>
        )}
      </div>

      {/* Instrument Upgrades */}
      <div className="border-t border-border/20 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground">🎸 Instruments</h3>
          <button
            onClick={() => setShowInstruments(!showInstruments)}
            className="text-sm px-3 py-1 bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-all"
          >
            {showInstruments ? 'Hide' : 'Show'}
          </button>
        </div>

        {showInstruments && (
          <div className="space-y-3">
            {instrumentUpgrades.slice(0, 4).map((tier, idx) => (
              <div key={idx} className="bg-card border border-secondary/30 p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="text-foreground font-semibold">{tier.name}</h4>
                  <p className="text-sm text-muted-foreground">Bonus: +{tier.performanceBonus}% • Cost: ${tier.cost.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleUpgrade('instruments', idx)}
                  disabled={money < tier.cost}
                  className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all"
                >
                  Buy
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stage Gear */}
      <div className="border-t border-border/20 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground">🎤 Stage Gear</h3>
          <button
            onClick={() => setShowStageGear(!showStageGear)}
            className="text-sm px-3 py-1 bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-all"
          >
            {showStageGear ? 'Hide' : 'Show'}
          </button>
        </div>

        {showStageGear && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {stageEquipment.slice(0, 6).map((gear, idx) => (
              <div key={idx} className="bg-card border border-accent/30 p-4 rounded-lg">
                <h4 className="text-foreground font-semibold mb-2">{gear.name}</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Bonus: +{gear.prestige}pts • Cost: ${gear.cost.toLocaleString()}
                </p>
                <button
                  onClick={() => handleUpgrade('stage-gear', gear.id)}
                  disabled={money < gear.cost}
                  className="w-full px-3 py-2 bg-accent text-accent-foreground rounded hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-all"
                >
                  Purchase
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upgrade History */}
      <div className="border-t border-border/20 pt-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Upgrade History</h3>
        {(gameState?.state?.upgrades || []).length > 0 ? (
          <div className="flex flex-col gap-2">
            {(gameState?.state?.upgrades || []).slice(-10).reverse().map((upgrade, idx) => (
              <div key={idx} className="bg-card border border-border/20 p-4 rounded-lg flex justify-between items-start hover:border-primary/30 transition-all">
                <div>
                  <p className="text-foreground font-semibold m-0">{upgrade.name || upgrade}</p>
                  {upgrade.type && <p className="text-sm text-muted-foreground mt-1">Type: {upgrade.type}</p>}
                </div>
                {upgrade.cost && <div className="text-secondary font-bold ml-4">-${upgrade.cost.toLocaleString()}</div>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No upgrades purchased yet. Save up and improve your gear!</p>
        )}
      </div>
    </div>
  );
};
