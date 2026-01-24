import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Music, Users, Zap, TrendingUp, Settings, Save, LogOut, ChevronRight, Palette, Sun, Moon } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { EnhancedEventModal } from '../components/EnhancedEventModal';
import { WeeklySummaryModal } from '../components/Modals';
import {
  DashboardTab,
  InventoryTab,
  BandTab,
  GigsTab,
  UpgradesTab,
  RivalsTab,
  LogTab,
  TabNavigation
} from '../components/Tabs';
import { RightPanel } from '../components/Panels';
import { useChartSystem } from '../hooks/useChartSystem';
import { calculateLogoStyle, ensureFontLoaded } from '../utils/helpers';
import { buildConsequenceEvent } from '../utils/enhancedCopy';

/**
 * GamePage - Main game interface with tabs
 * 
 * Tabs:
 * 1. Dashboard - Overview and quick stats
 * 2. Inventory - Songs, albums, equipment
 * 3. Band - Member management
 * 4. Gigs - Performance booking
 * 5. Upgrades - Purchase improvements
 * 6. Rivals - Competition and battles
 * 7. Log - Game history
 * 
 * Phase 2: Integrated consequence tracking system
 * Phase 2 Enhancement: Full event generation and choice handling
 */
export const GamePage = ({
  gameData,
  dialogueState,
  modalState,
  uiState,
  onNavigate,
  onSave,
  onQuit,
  onEventChoice,
  consequenceSystem,
  onHandleEventChoice,
  onAdvanceWeek,
  gameState,
  gameLogic,
  eventGen,
  recordingSystem,
  gigSystem,
  bandManagement,
  equipmentUpgrades,
  labelDeals,
  rivalCompetition,
  festivalPerformance,
  radioCharting,
  merchandise,
  sponsorships,
  enhancedFeatures,
  setContentPreference,
  setMaturityLevel,
  themeSystem,
  victoryConditions,
  onRegisterEventChoiceHandler
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chartTab, setChartTab] = useState('topChart'); // Chart sidebar tab
  const [autoSaving, setAutoSaving] = useState(false);
  const [eventQueue, setEventQueue] = useState([]);
  const [weeklySummaryData, setWeeklySummaryData] = useState(null);
  const [showWeeklySummaryModal, setShowWeeklySummaryModal] = useState(false);
  const [renderError, setRenderError] = useState(null);
  const eventQueueAfterSummaryRef = useRef([]);

  // Error boundary effect
  useEffect(() => {
    const errorHandler = (error) => {
      console.error('GamePage render error:', error);
      setRenderError(error.message);
    };
    
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  // Get rivals data for charts
  const rivalBands = gameState?.state?.rivalBands || [];
  const rivalSongs = gameState?.state?.rivalSongs || {};

  // Ensure rival songs are generated when charts are visible
  useEffect(() => {
    if (radioCharting?.ensureRivalSongsGenerated && rivalBands.length > 0) {
      radioCharting.ensureRivalSongsGenerated();
    }
  }, [radioCharting, rivalBands.length, gameState?.state?.week]);

  // Calculate charts
  const { chartLeaders, albumChart, songChart } = useChartSystem(
    gameState?.state || {},
    rivalBands,
    rivalSongs
  );

  // Trigger a random event from event generation
  const triggerEvent = useCallback(() => {
    if (eventGen?.generateEvent) {
      const newEvent = eventGen.generateEvent();
      console.log('[Enhanced Dialogue] Trigger Event - Generated:', newEvent ? {
        title: newEvent.title,
        category: newEvent.category,
        maturityLevel: newEvent.maturityLevel,
        hasChoices: !!newEvent.choices?.length
      } : 'null/undefined');
      
      if (newEvent && modalState?.openEventPopup) {
        console.log('[Enhanced Dialogue] Opening event modal:', newEvent.title);
        modalState.openEventPopup(newEvent);
        return newEvent;
      } else if (!newEvent) {
        console.warn('[Enhanced Dialogue] Event generation returned null/undefined');
      } else if (!modalState?.openEventPopup) {
        console.warn('[Enhanced Dialogue] modalState.openEventPopup is not available');
      }
    } else {
      console.warn('[Enhanced Dialogue] eventGen.generateEvent is not available');
    }
  }, [eventGen, modalState]);

  // Check for pending gig events and trigger enhanced dialogue
  useEffect(() => {
    const pendingGigEvent = gameState?.state?.pendingGigEvent;
    if (pendingGigEvent && eventGen?.generateEvent && modalState?.openEventPopup) {
      // Generate a gig-related enhanced dialogue event
      const gigEvent = eventGen.generateEvent('random', {
        type: 'post_gig',
        venue: pendingGigEvent.venue,
        attendance: pendingGigEvent.attendance,
        performanceQuality: pendingGigEvent.performanceQuality,
        revenue: pendingGigEvent.revenue,
        fameGain: pendingGigEvent.fameGain
      });
      
      if (gigEvent) {
        console.log('[Enhanced Dialogue] Triggering post-gig event:', gigEvent.title);
        modalState.openEventPopup(gigEvent);
        
        // Clear the pending event
        gameState.updateGameState({ pendingGigEvent: null });
      }
    }
  }, [gameState?.state?.pendingGigEvent, eventGen, modalState, gameState]);

  // Handle week advancement with consequence processing and event generation
  const handleAdvanceWeek = useCallback(() => {
    // Create new queue for this week's events
    let weekEvents = [];
    
    // Process consequences from Phase 2 system
    if (onAdvanceWeek) {
      const { escalations, resurfaced } = onAdvanceWeek();
      
      // Queue escalations as enhanced dialogue events (modal-compatible)
      if (escalations && escalations.length > 0) {
        escalations.forEach(esc => {
          weekEvents.push(buildConsequenceEvent(esc, 'escalation'));
        });
      }

      // Queue resurfaced consequences as enhanced dialogue events
      if (resurfaced && resurfaced.length > 0) {
        resurfaced.forEach(res => {
          weekEvents.push(buildConsequenceEvent(res, 'resurfaced'));
        });
      }
    }

    // Process all gameplay systems for weekly updates
    if (bandManagement?.processWeeklyBandMaintenance) {
      bandManagement.processWeeklyBandMaintenance();
    }
    
    if (radioCharting?.processWeeklyRadioPlays) {
      radioCharting.processWeeklyRadioPlays();
    }
    
    if (merchandise?.processWeeklySales) {
      merchandise.processWeeklySales();
    }
    
    if (sponsorships?.processMonthlySponsorshipPayments) {
      sponsorships.processMonthlySponsorshipPayments();
    }
    
    if (labelDeals?.processWeeklyContractMaintenance) {
      labelDeals.processWeeklyContractMaintenance();
    }
    
    if (rivalCompetition?.processWeeklyRivalActivity) {
      rivalCompetition.processWeeklyRivalActivity();
    }

    // Generate a random event from Enhanced Dialogue system
    // Boost chance for enhanced-dialogue scenarios (Band Leader, Band Member) and under stress
    const scenario = gameState?.state?.selectedScenario;
    const enhancedDialogueFocus = scenario?.specialRules?.enhancedDialogueFocus;
    const psychState = dialogueState?.psychologicalState || {};
    const stressFactor = (psychState.stress_level || 0) / 100 * 0.4;
    const baseChance = enhancedDialogueFocus ? 0.5 : 0.3;
    const eventTriggerChance = Math.min(0.8, baseChance + stressFactor);

    if (Math.random() < eventTriggerChance && eventGen?.generateEvent) {
      const newEvent = eventGen.generateEvent();
      if (newEvent) {
        console.log('[Enhanced Dialogue] Generated event:', newEvent.title, {
          category: newEvent.category,
          maturityLevel: newEvent.maturityLevel,
          hasChoices: !!newEvent.choices?.length
        });
        weekEvents.push(newEvent);
      } else {
        console.warn('[Enhanced Dialogue] Event generation returned null/undefined');
      }
    }

    let detailedSummary = null;
    if (gameLogic?.advanceWeek) {
      detailedSummary = gameLogic.advanceWeek((s) => ({ ...s }));
    } else if (gameState?.updateGameState) {
      gameState.updateGameState({
        week: (gameState.state?.week || 0) + 1
      });
    }

    setEventQueue(weekEvents);

    if (detailedSummary) {
      eventQueueAfterSummaryRef.current = weekEvents;
      setWeeklySummaryData(detailedSummary);
      setShowWeeklySummaryModal(true);
    } else if (weekEvents.length > 0 && modalState?.openEventPopup) {
      // Show first event using modalState
      console.log('[Enhanced Dialogue] Showing event in modal:', weekEvents[0].title);
      // Use setTimeout to ensure state updates are complete
      setTimeout(() => {
        modalState.openEventPopup(weekEvents[0]);
      }, 100);
    } else if (weekEvents.length === 0) {
      console.log('[Enhanced Dialogue] No events generated this week');
    }
  }, [onAdvanceWeek, bandManagement, radioCharting, merchandise, sponsorships, labelDeals, rivalCompetition, eventGen, gameState, gameLogic, dialogueState, modalState]);

  const handleWeeklySummaryClose = useCallback(() => {
    setShowWeeklySummaryModal(false);
    setWeeklySummaryData(null);
    const queued = eventQueueAfterSummaryRef.current || [];
    eventQueueAfterSummaryRef.current = [];
    setEventQueue(queued);
    if (queued.length > 0 && modalState?.openEventPopup) {
      // Show first queued event using modalState
      setTimeout(() => {
        modalState.openEventPopup(queued[0]);
      }, 100);
    }
  }, [modalState]);

  /**
   * Handle player choice in event modal
   * Updates psychological state, applies consequences, and advances game state
   * This is called from App.jsx when EnhancedEventModal's onChoice is triggered
   */
  const handleEventChoice = useCallback((eventId, choiceId, choiceText, impacts) => {
    // Get the current event from modalState
    const currentEvent = modalState?.modalData?.eventPopupData;
    if (!currentEvent) return;
    
    // Find the full choice object from the current event
    const choice = currentEvent?.choices?.find(c => c.id === choiceId);
    
    // Apply psychological effects from the choice
    if (choice?.psychologicalEffects && dialogueState?.updatePsychologicalState) {
      // Map choice effects to psychological state updates
      const updates = {};
      
      // Convert psychologicalEffects object to updatePsychologicalState format
      Object.entries(choice.psychologicalEffects).forEach(([key, value]) => {
        // Map effect names to psychological state keys
        if (key === 'stress_level' || key === 'stress') updates.stress_level = value;
        if (key === 'moral_integrity' || key === 'morality') updates.moral_integrity = value;
        if (key === 'addiction_risk' || key === 'addiction') updates.addiction_risk = value;
        if (key === 'paranoia') updates.paranoia = value;
        if (key === 'depression') updates.depression = value;
      });
      
      if (Object.keys(updates).length > 0) {
        dialogueState.updatePsychologicalState(updates);
        if (gameState?.addLog) {
          const effects = Object.entries(updates)
            .map(([k, v]) => `${k.replace(/_/g, ' ')} ${v > 0 ? '+' : ''}${v}`)
            .join(', ');
          gameState.addLog(`Psychological effects: ${effects}`, 'info');
        }
      }
    }
    
    // Apply faction effects if choice has them
    if (choice?.factionEffects && onHandleEventChoice) {
      onHandleEventChoice(choice);
    }
    
    // Apply consequences if choice triggers them
    if (choice?.triggerConsequence && onHandleEventChoice) {
      onHandleEventChoice(choice);
    }
    
    // Log the choice made
    if (gameState?.addLog && choiceText) {
      gameState.addLog(`You chose: "${choiceText}"`, 'info');
    }
    
    // Close current event modal
    if (modalState?.closeEventPopup) {
      modalState.closeEventPopup();
    }
    
    // Remove event from queue and show next one
    setEventQueue(prevQueue => {
      const remainingEvents = prevQueue.slice(1);
      
      // Show next event if available
      if (remainingEvents.length > 0 && modalState?.openEventPopup) {
        // Use setTimeout to ensure modal closes before opening next one
        setTimeout(() => {
          modalState.openEventPopup(remainingEvents[0]);
        }, 100);
      }
      
      return remainingEvents;
    });
  }, [dialogueState, gameState, onHandleEventChoice, modalState]);

  // Register handleEventChoice with App so it can be called from the modal
  useEffect(() => {
    if (onRegisterEventChoiceHandler) {
      onRegisterEventChoiceHandler(handleEventChoice);
    }
  }, [onRegisterEventChoiceHandler, handleEventChoice]);

  // Auto-save every 5 minutes
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      setAutoSaving(true);
      onSave?.();
      setTimeout(() => setAutoSaving(false), 1000);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(autoSaveInterval);
  }, [onSave]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory', icon: Music },
    { id: 'band', label: 'Band', icon: Users },
    { id: 'gigs', label: 'Gigs', icon: Zap },
    { id: 'upgrades', label: 'Upgrades', icon: TrendingUp },
    { id: 'rivals', label: 'Rivals', icon: Users },
    { id: 'log', label: 'Log', icon: Music }
  ];

  // Safety check - ensure we have required data
  if (!gameState) {
    console.error('GamePage: gameState is missing', { gameState });
    return (
      <div className="min-h-screen p-8 text-white bg-red-500">
        <h1>Error: Game state not available</h1>
        <p>gameState: {JSON.stringify(gameState)}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 mt-4 text-red-500 bg-white rounded">Reload Page</button>
      </div>
    );
  }

  // Calculate logo style for display (must be before early returns)
  const logoStyle = useMemo(() => {
    const logoState = gameState?.state || {};
    if (logoState.logoFont) {
      ensureFontLoaded(logoState.logoFont);
    }
    return calculateLogoStyle(logoState);
  }, [gameState?.state]);

  const bandName = gameState?.state?.bandName || 'Your Band';
  const hasLogo = gameState?.state?.logo || (gameState?.state?.logoFont);

  // Ensure gameState.state exists - initialize if missing
  if (!gameState.state) {
    console.warn('GamePage: gameState.state is missing, initializing...', { gameState });
    // Try to initialize state
    if (gameState.updateGameState) {
      gameState.updateGameState({
        bandName: 'Your Band',
        week: 0,
        money: 0,
        fame: 0,
        bandMembers: []
      });
    }
    // Return loading state while initializing
    return (
      <div className="min-h-screen p-8 text-black bg-yellow-500">
        <h1>Initializing game state...</h1>
        <p>Please wait...</p>
      </div>
    );
  }

  // Show render error if one occurred
  if (renderError) {
    return (
      <div className="min-h-screen p-8 text-white bg-red-500">
        <h1>Render Error</h1>
        <p>{renderError}</p>
        <button onClick={() => {
          setRenderError(null);
          window.location.reload();
        }} className="px-4 py-2 mt-4 text-red-500 bg-white rounded">Reload Page</button>
      </div>
    );
  }

  // Fallback background color if CSS variables aren't set
  let backgroundColor = '#0a0a0a';
  let foregroundColor = '#ffffff';
  
  try {
    if (typeof window !== 'undefined' && document.documentElement) {
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--background');
      const fg = getComputedStyle(document.documentElement).getPropertyValue('--foreground');
      if (bg) backgroundColor = bg.trim();
      if (fg) foregroundColor = fg.trim();
    }
  } catch (e) {
    console.warn('Could not read CSS variables, using defaults', e);
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground" style={{ backgroundColor: backgroundColor, color: foregroundColor }}>
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header - Compact with Logo */}
        <Card className="px-4 py-2 border-b flex-shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0 flex items-center gap-3">
              {/* Logo Display - Prominent */}
              {hasLogo && (
                <div
                  style={{
                    ...logoStyle,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    minWidth: '200px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  className="flex-shrink-0"
                >
                  {bandName}
                </div>
              )}
              {/* Band Name (if no logo) or as fallback */}
              <div className="flex-1 min-w-0">
                {!hasLogo && (
                  <h1 className="m-0 text-xl font-bold truncate text-foreground">
                    {bandName}
                  </h1>
                )}
                <p className="mt-0.5 text-muted-foreground text-xs">
                  Week {gameState?.state?.week || 0}
                </p>
              </div>
            </div>
            
            {/* Stats - Compact */}
            <div className="flex flex-shrink-0 gap-3 text-xs">
              <div>
                <div className="text-xs text-muted-foreground">Money</div>
                <div className="text-lg font-bold text-accent">
                  ${(gameState?.state?.money || 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Fame</div>
                <div className="text-lg font-bold text-primary">
                  {gameState?.state?.fame || 0}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Members</div>
                <div className="text-lg font-bold text-secondary">
                  {(gameState?.state?.bandMembers || []).length}
                </div>
              </div>
            </div>

            {/* Theme Selector & Actions - Compact */}
            <div className="flex items-center flex-shrink-0 gap-2">
              {themeSystem && (
                <>
                  <label className="hidden text-xs font-semibold text-muted-foreground sm:inline">Theme:</label>
                  <select
                    value={themeSystem.currentTheme || 'synthwave'}
                    onChange={(e) => themeSystem.setTheme(e.target.value)}
                    className="px-1.5 py-0.5 text-xs rounded-md bg-input border border-border text-foreground cursor-pointer hover:border-primary transition-colors"
                  >
                    {themeSystem.availableThemes && themeSystem.availableThemes.map(theme => (
                      <option key={theme} value={theme}>
                        {themeSystem.THEME_NAMES?.[theme] || theme.replace('-', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={themeSystem.toggleDarkMode}
                    className={`px-1.5 py-0.5 text-xs rounded-md transition-all ${
                      themeSystem.isDarkMode
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                    title="Toggle Dark Mode"
                  >
                    {themeSystem.isDarkMode ? <Moon size={14} className="text-accent" /> : <Sun size={14} className="text-accent" />}
                  </button>
                </>
              )}

              <button
                onClick={() => {
                  setAutoSaving(true);
                  onSave?.();
                  setTimeout(() => setAutoSaving(false), 1000);
                }}
                className={`px-2 py-1 rounded-md cursor-pointer flex items-center gap-1 transition-all text-xs ${
                  autoSaving
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-accent/20 text-accent hover:bg-accent/40'
                }`}
              >
                <Save size={14} />
                {autoSaving ? 'Saving...' : 'Save'}
              </button>

              <button
                onClick={onQuit}
                className="flex items-center gap-1 px-2 py-1 text-xs transition-all rounded-md cursor-pointer bg-destructive/20 text-destructive hover:bg-destructive/40"
              >
                <LogOut size={14} />
                Quit
              </button>
            </div>
          </div>
        </Card>

        {/* Tab Bar - Compact */}
        <TabNavigation 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Content Area */}
        <div className="flex flex-col flex-1 min-h-0 p-4 overflow-auto">
          <TabContent
          tabId={activeTab}
          gameData={gameData}
          dialogueState={dialogueState}
          modalState={modalState}
          uiState={uiState}
          gameState={gameState}
          gameLogic={gameLogic}
          onAdvanceWeek={handleAdvanceWeek}
          onTriggerEvent={triggerEvent}
          recordingSystem={recordingSystem}
          gigSystem={gigSystem}
          bandManagement={bandManagement}
          equipmentUpgrades={equipmentUpgrades}
          labelDeals={labelDeals}
          rivalCompetition={rivalCompetition}
          festivalPerformance={festivalPerformance}
          radioCharting={radioCharting}
          merchandise={merchandise}
          sponsorships={sponsorships}
          enhancedFeatures={enhancedFeatures}
          setContentPreference={setContentPreference}
          setMaturityLevel={setMaturityLevel}
          victoryConditions={victoryConditions}
          />

          {/* Week Advancement Button */}
        {activeTab === 'dashboard' && (
          <Card className="flex justify-end gap-2 px-4 py-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <Button onClick={triggerEvent} className="px-3 py-1.5 bg-primary/20 text-primary border-2 border-primary/50 rounded-lg text-lg font-bold hover:bg-primary/40 transition-all">
              Trigger Event
            </Button>

            <Button onClick={handleAdvanceWeek} className="px-3 py-1.5 bg-accent text-accent-foreground rounded-lg text-lg font-bold hover:opacity-90 transition-all flex items-center gap-2">
              <ChevronRight size={18} />
              Advance Week
            </Button>
          </Card>
        )}
        </div>
      </div>

      {/* Weekly Summary Modal (after Advance Week) */}
      <WeeklySummaryModal
        isOpen={showWeeklySummaryModal}
        data={weeklySummaryData}
        onClose={handleWeeklySummaryClose}
      />

      {/* Right Sidebar - Charts */}
      <Card className="flex-shrink-0 hidden p-4 border-l w-80 border-border/20 lg:block">
        <RightPanel
          activeTab={chartTab}
          onTabChange={setChartTab}
          chartLeaders={chartLeaders}
          albumChart={albumChart}
          songChart={songChart}
          playerLogoState={gameState?.state || {}}
          onBandClick={(band) => {
            // Handle band click - could open band stats modal
            if (band.isPlayer) {
              // Show player stats
              console.log('Player band clicked:', band);
            } else {
              // Show rival stats
              console.log('Rival band clicked:', band);
            }
          }}
        />
      </Card>
    </div>
  );
};

/**
 * TabContent - Renders content for active tab
 * 
 * Uses imported tab components from src/components/Tabs/
 */
const TabContent = ({ 
  tabId, 
  gameData, 
  dialogueState, 
  modalState, 
  uiState,
  gameState,
  gameLogic,
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
  sponsorships,
  enhancedFeatures,
  setContentPreference,
  setMaturityLevel,
  victoryConditions
}) => {
  switch (tabId) {
    case 'dashboard':
      return <DashboardTab 
        gameData={gameData} 
        dialogueState={dialogueState}
        gameState={gameState}
        victoryConditions={victoryConditions}
        onAdvanceWeek={onAdvanceWeek}
        onTriggerEvent={onTriggerEvent}
        recordingSystem={recordingSystem}
        gigSystem={gigSystem}
        gameLogic={gameLogic}
        bandManagement={bandManagement}
        equipmentUpgrades={equipmentUpgrades}
        labelDeals={labelDeals}
        merchandise={merchandise}
        enhancedFeatures={enhancedFeatures}
        setContentPreference={setContentPreference}
        setMaturityLevel={setMaturityLevel}
        modalState={modalState}
      />;
    case 'inventory':
      return <InventoryTab 
        gameData={gameData} 
        gameState={gameState}
        gameLogic={gameLogic}
        recordingSystem={recordingSystem}
        modalState={modalState}
      />;
    case 'band':
      return <BandTab 
        gameData={gameData} 
        gameState={gameState}
        bandManagement={bandManagement}
        onAdvanceWeek={onAdvanceWeek}
      />;
    case 'gigs':
      return <GigsTab 
        gameData={gameData} 
        gameState={gameState}
        gigSystem={gigSystem}
        gameLogic={gameLogic}
      />;
    case 'upgrades':
      return <UpgradesTab 
        gameData={gameData} 
        gameState={gameState}
        equipmentUpgrades={equipmentUpgrades}
        labelDeals={labelDeals}
      />;
    case 'rivals':
      return <RivalsTab 
        gameData={gameData} 
        gameState={gameState}
        rivalCompetition={rivalCompetition}
      />;
    case 'log':
      return <LogTab 
        gameData={gameData} 
        gameState={gameState}
        gameLog={gameState?.gameLog}
      />;
    default:
      return null;
  }
};

export default GamePage;
