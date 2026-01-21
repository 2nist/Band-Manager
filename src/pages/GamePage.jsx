import React, { useState, useEffect, useCallback } from 'react';
import { Music, Users, Zap, TrendingUp, Settings, Save, LogOut, ChevronRight, Palette, Sun, Moon } from 'lucide-react';
import { EnhancedEventModal } from '../components/EnhancedEventModal';
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
  themeSystem
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [autoSaving, setAutoSaving] = useState(false);
  const [pendingEvent, setPendingEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventQueue, setEventQueue] = useState([]);

  // Trigger a random event from event generation
  const triggerEvent = useCallback(() => {
    if (eventGen?.generateEvent) {
      const newEvent = eventGen.generateEvent();
      if (newEvent) {
        setPendingEvent(newEvent);
        setShowEventModal(true);
        return newEvent;
      }
    }
  }, [eventGen]);

  // Handle week advancement with consequence processing and event generation
  const handleAdvanceWeek = useCallback(() => {
    // Create new queue for this week's events
    let weekEvents = [];
    
    // Process consequences from Phase 2 system
    if (onAdvanceWeek) {
      const { escalations, resurfaced } = onAdvanceWeek();
      
      // Queue escalations as events
      if (escalations && escalations.length > 0) {
        escalations.forEach(esc => {
          weekEvents.push({
            type: 'consequence',
            data: esc,
            title: `Consequence Escalated`,
            description: esc.description || 'A past decision has caught up with you...'
          });
        });
      }
      
      // Queue resurfaced consequences as events
      if (resurfaced && resurfaced.length > 0) {
        resurfaced.forEach(res => {
          weekEvents.push({
            type: 'consequence',
            data: res,
            title: `Consequence Resurfaced`,
            description: res.description || 'The past returns to haunt you...'
          });
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

    // Generate a random event from Enhanced Dialogue system based on player psychology
    // Higher chance if player is under stress or has other risk factors
    const psychState = dialogueState?.psychologicalState || {};
    const eventTriggerChance = Math.min(0.75, (psychState.stress_level || 0) / 100 * 0.5 + 0.3);
    
    if (Math.random() < eventTriggerChance && eventGen?.generateEvent) {
      const newEvent = eventGen.generateEvent();
      if (newEvent) {
        weekEvents.push(newEvent);
      }
    }

    // Update game state (week advancement)
    if (gameState?.updateGameState) {
      gameState.updateGameState({
        week: (gameState.state?.week || 0) + 1
      });
    }

    // Queue all events and show first one if exists
    setEventQueue(weekEvents);
    if (weekEvents.length > 0) {
      setPendingEvent(weekEvents[0]);
      setShowEventModal(true);
    }
  }, [onAdvanceWeek, bandManagement, radioCharting, merchandise, sponsorships, labelDeals, rivalCompetition, eventGen, gameState, dialogueState]);

  /**
   * Handle player choice in event modal
   * Updates psychological state, applies consequences, and advances game state
   */
  const handleEventChoice = useCallback((eventId, choiceId, choiceText, impacts) => {
    // Find the full choice object from the pending event
    const choice = pendingEvent?.choices?.find(c => c.id === choiceId);
    
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
          gameState.addLog(`Psychological effects: ${effects}`);
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
      gameState.addLog(`You chose: "${choiceText}"`);
    }
    
    // Remove event from queue and show next one
    const remainingEvents = eventQueue.slice(1);
    setEventQueue(remainingEvents);
    
    if (remainingEvents.length > 0) {
      setPendingEvent(remainingEvents[0]);
      setShowEventModal(true);
    } else {
      setShowEventModal(false);
      setPendingEvent(null);
    }
  }, [dialogueState, gameState, onHandleEventChoice, pendingEvent, eventQueue]);

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

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border/20 px-4 py-2 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground m-0">
            {gameData?.bandName || 'Your Band'}
          </h1>
          <p className="mt-1 text-muted-foreground text-sm">
            Week {gameData?.week || 0}
          </p>
        </div>

        <div className="flex gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Money</div>
            <div className="text-xl font-bold text-accent">
              ${gameData?.money?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Fame</div>
            <div className="text-xl font-bold text-primary">
              {gameData?.fame || 0}
            </div>
          </div>
          <div>
            <div className="text-muted-foreground">Members</div>
            <div className="text-xl font-bold text-secondary">
              {gameData?.bandMembers?.length || 0}
            </div>
          </div>
        </div>

        {/* Theme Selector */}
        {themeSystem && (
          <div className="flex gap-1 items-center">
            <label className="text-sm font-semibold text-muted-foreground">Theme:</label>
            <select
              value={themeSystem.currentTheme || 'synthwave'}
              onChange={(e) => themeSystem.setTheme(e.target.value)}
              className="px-2 py-1 text-sm rounded-md bg-card border border-border text-foreground cursor-pointer hover:border-primary transition-colors"
            >
              {themeSystem.availableThemes && themeSystem.availableThemes.map(theme => (
                <option key={theme} value={theme}>
                  {themeSystem.THEME_NAMES?.[theme] || theme.replace('-', ' ').toUpperCase()}
                </option>
              ))}
            </select>
            <button
              onClick={themeSystem.toggleDarkMode}
              className={`px-2 py-1 text-sm rounded-md transition-all ${
                themeSystem.isDarkMode
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
              title="Toggle Dark Mode"
            >
              {themeSystem.isDarkMode ? <Moon size={16} className="text-accent" /> : <Sun size={16} className="text-accent" />}
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => {
              setAutoSaving(true);
              onSave?.();
              setTimeout(() => setAutoSaving(false), 1000);
            }}
            className={`px-2 py-1 rounded-md cursor-pointer flex items-center gap-2 transition-all ${
              autoSaving
                ? 'bg-accent text-accent-foreground'
                : 'bg-accent/20 text-accent hover:bg-accent/40'
            }`}
          >
            <Save size={16} />
            {autoSaving ? 'Saving...' : 'Save'}
          </button>

          <button
            onClick={onQuit}
            className="px-2 py-1 bg-destructive/20 text-destructive hover:bg-destructive/40 rounded-md cursor-pointer flex items-center gap-2 transition-all"
          >
            <LogOut size={16} />
            Quit
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <TabNavigation 
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-auto flex flex-col">
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
        />
      </div>

      {/* Week Advancement Button */}
      {activeTab === 'dashboard' && (
        <div className="px-4 py-2 bg-card border-t border-border/20 flex justify-end gap-2">
          <button
            onClick={triggerEvent}
            className="px-3 py-1.5 bg-primary/20 text-primary border-2 border-primary/50 rounded-lg cursor-pointer text-lg font-bold hover:bg-primary/40 transition-all"
          >
            Trigger Event
          </button>

          <button
            onClick={handleAdvanceWeek}
            className="px-3 py-1.5 bg-accent text-accent-foreground rounded-lg cursor-pointer text-lg font-bold hover:opacity-90 transition-all flex items-center gap-2"
          >
            <ChevronRight size={18} />
            Advance Week
          </button>
        </div>
      )}

      {/* Enhanced Event Modal */}
      {showEventModal && pendingEvent && (
        <EnhancedEventModal
          isOpen={true}
          event={pendingEvent}
          psychologicalState={dialogueState?.psychologicalState}
          onChoice={handleEventChoice}
          onClose={() => {
            setShowEventModal(false);
            setPendingEvent(null);
          }}
        />
      )}
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
  setMaturityLevel
}) => {
  switch (tabId) {
    case 'dashboard':
      return <DashboardTab 
        gameData={gameData} 
        dialogueState={dialogueState}
        gameState={gameState}
        onAdvanceWeek={onAdvanceWeek}
        onTriggerEvent={onTriggerEvent}
        recordingSystem={recordingSystem}
        gigSystem={gigSystem}
        bandManagement={bandManagement}
        equipmentUpgrades={equipmentUpgrades}
        labelDeals={labelDeals}
        merchandise={merchandise}
        enhancedFeatures={enhancedFeatures}
        setContentPreference={setContentPreference}
        setMaturityLevel={setMaturityLevel}
      />;
    case 'inventory':
      return <InventoryTab 
        gameData={gameData} 
        gameState={gameState}
        recordingSystem={recordingSystem}
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
      />;
    default:
      return null;
  }
};

export default GamePage;
