/**
 * DashboardTab.jsx - Game overview and quick stats with gameplay controls
 * 
 * Displays:
 * - Psychological state metrics
 * - Quick game statistics
 * - Key performance indicators
 * - Gameplay action buttons
 */
export const DashboardTab = ({ 
  gameData, 
  dialogueState,
  gameState,
  onAdvanceWeek,
  onTriggerEvent,
  recordingSystem,
  gigSystem,
  bandManagement,
  equipmentUpgrades,
  labelDeals,
  rivalCompetition,
  festivalPerformance,
  radioCharting,
  merchandise,
  sponsorships
}) => {
  const handleQuickAction = (action) => {
    switch(action) {
      case 'write-song':
        recordingSystem?.recordSong?.('Quick Recording', 'Rock');
        break;
      case 'book-gig':
        const venues = gigSystem?.getAvailableVenues?.();
        if (venues?.length > 0) {
          gigSystem?.bookGig?.(venues[0].id);
        }
        break;
      case 'practice-band':
        if (gameState?.state?.bandMembers?.length > 0) {
          bandManagement?.practiceMember?.(gameState.state.bandMembers[0].id);
        }
        break;
      case 'upgrade-studio':
        equipmentUpgrades?.upgradeStudio?.();
        break;
      case 'sign-label':
        const offers = labelDeals?.getAvailableLabelOffers?.();
        if (offers?.length > 0) {
          labelDeals?.signLabelDeal?.(offers[0].id);
        }
        break;
      case 'merchandise':
        const merch = merchandise?.getAvailableMerchandise?.();
        if (merch?.length > 0) {
          merchandise?.designMerchandise?.(merch[0].id, 'Quick Merch', 50);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Psychological State Card */}
        <div className="bg-card border-2 border-primary/30 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-foreground mb-4">Psychological State</h3>
          <div className="flex flex-col gap-3 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Stress Level ({Math.round(dialogueState?.psychologicalState?.stress_level || 0)}%)</div>
              <div className="h-2 bg-input rounded overflow-hidden">
                <div className="h-full bg-destructive" style={{ width: `${dialogueState?.psychologicalState?.stress_level || 0}%` }} />
              </div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Moral Integrity ({Math.round(dialogueState?.psychologicalState?.moral_integrity || 100)}%)</div>
              <div className="h-2 bg-input rounded overflow-hidden">
                <div className="h-full bg-secondary" style={{ width: `${dialogueState?.psychologicalState?.moral_integrity || 100}%` }} />
              </div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Addiction Risk ({Math.round(dialogueState?.psychologicalState?.addiction_risk || 0)}%)</div>
              <div className="h-2 bg-input rounded overflow-hidden">
                <div className="h-full bg-accent" style={{ width: `${dialogueState?.psychologicalState?.addiction_risk || 0}%` }} />
              </div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Paranoia ({Math.round(dialogueState?.psychologicalState?.paranoia || 0)}%)</div>
              <div className="h-2 bg-input rounded overflow-hidden">
                <div className="h-full bg-primary" style={{ width: `${dialogueState?.psychologicalState?.paranoia || 0}%` }} />
              </div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Depression ({Math.round(dialogueState?.psychologicalState?.depression || 0)}%)</div>
              <div className="h-2 bg-input rounded overflow-hidden">
                <div className="h-full bg-primary/70" style={{ width: `${dialogueState?.psychologicalState?.depression || 0}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-card border-2 border-primary/30 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-foreground mb-4">Quick Stats</h3>
          <div className="flex flex-col gap-3 text-sm">
            <div className="text-muted-foreground">💰 Money: <strong className="text-accent">${(gameState?.state?.money || 0).toLocaleString()}</strong></div>
            <div className="text-muted-foreground">⭐ Fame: <strong className="text-primary">{gameState?.state?.fame || 0}</strong></div>
            <div className="text-muted-foreground">🎵 Songs: <strong className="text-foreground">{(gameState?.state?.songs || []).length}</strong></div>
            <div className="text-muted-foreground">📀 Albums: <strong className="text-foreground">{(gameState?.state?.albums || []).length}</strong></div>
            <div className="text-muted-foreground">🎤 Gigs: <strong className="text-foreground">{(gameState?.state?.gigHistory || []).length}</strong></div>
            <div className="text-muted-foreground">👥 Band: <strong className="text-foreground">{(gameState?.state?.bandMembers || []).length}</strong></div>
          </div>
        </div>

        {/* Faction Standing Card */}
        <div className="bg-card border-2 border-primary/30 p-6 rounded-lg">
          <h3 className="text-lg font-bold text-foreground mb-4">Faction Standing</h3>
          <div className="flex flex-col gap-3 text-sm">
            {dialogueState?.narrativeState?.factionReputation ? (
              Object.entries(dialogueState.narrativeState.factionReputation).map(([faction, standing]) => (
                <div key={faction}>
                  <div className="text-muted-foreground mb-1 capitalize">{faction}</div>
                  <div className="h-2 bg-input rounded overflow-hidden">
                    <div 
                      className={`h-full ${
                        standing > 0 ? 'bg-secondary' : standing < 0 ? 'bg-destructive' : 'bg-primary'
                      }`}
                      style={{ width: `${Math.abs(standing) > 100 ? 100 : Math.abs(standing)}%` }} 
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {standing > 0 ? '+' : ''}{Math.round(standing)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground">No faction data yet</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="bg-card border-2 border-primary/30 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <button
            onClick={() => handleQuickAction('write-song')}
            className="px-4 py-3 bg-primary/20 hover:bg-primary/40 text-primary border border-primary/50 rounded-lg transition-all text-sm font-semibold"
          >
            🎵 Write Song
          </button>
          <button
            onClick={() => handleQuickAction('book-gig')}
            className="px-4 py-3 bg-secondary/20 hover:bg-secondary/40 text-secondary border border-secondary/50 rounded-lg transition-all text-sm font-semibold"
          >
            🎤 Book Gig
          </button>
          <button
            onClick={() => handleQuickAction('practice-band')}
            className="px-4 py-3 bg-accent/20 hover:bg-accent/40 text-accent border border-accent/50 rounded-lg transition-all text-sm font-semibold"
          >
            🎸 Practice
          </button>
          <button
            onClick={() => handleQuickAction('upgrade-studio')}
            className="px-4 py-3 bg-primary/20 hover:bg-primary/40 text-primary border border-primary/50 rounded-lg transition-all text-sm font-semibold"
          >
            🏢 Upgrade
          </button>
          <button
            onClick={() => handleQuickAction('sign-label')}
            className="px-4 py-3 bg-secondary/20 hover:bg-secondary/40 text-secondary border border-secondary/50 rounded-lg transition-all text-sm font-semibold"
          >
            🤝 Label Deal
          </button>
          <button
            onClick={() => handleQuickAction('merchandise')}
            className="px-4 py-3 bg-accent/20 hover:bg-accent/40 text-accent border border-accent/50 rounded-lg transition-all text-sm font-semibold"
          >
            👕 Merch
          </button>
        </div>
      </div>

      {/* Week Advancement */}
      <div className="bg-card border-2 border-accent/30 p-8 rounded-lg flex flex-col gap-4">
        <h3 className="text-lg font-bold text-foreground">Game Progress</h3>
        <div className="flex gap-4 flex-wrap">
          <button
            onClick={onTriggerEvent}
            className="px-6 py-3 bg-primary/20 hover:bg-primary/30 text-foreground border-2 border-primary/40 rounded-lg transition-all text-sm font-medium"
          >
            🎭 Trigger Event
          </button>

          <button
            onClick={onAdvanceWeek}
            className="flex-1 min-w-[200px] px-6 py-3 bg-accent hover:opacity-90 text-accent-foreground border-none rounded-lg transition-all text-base font-bold"
          >
            ⏭️ Advance Week
          </button>
        </div>
        <p className="text-xs text-muted-foreground m-0">
          Week {gameState?.state?.week || 0} • All systems process automatically each week
        </p>
      </div>
    </div>
  );
};
