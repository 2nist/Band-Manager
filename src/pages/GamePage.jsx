import React, { useState, useEffect, useCallback } from 'react';
import { Music, Users, Zap, TrendingUp, Settings, Save, LogOut, ChevronRight } from 'lucide-react';
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
  eventGen
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
    // Process consequences from Phase 2 system
    if (onAdvanceWeek) {
      const { escalations, resurfaced } = onAdvanceWeek();
      
      // Queue escalations as events
      if (escalations && escalations.length > 0) {
        escalations.forEach(esc => {
          setEventQueue(prev => [...prev, {
            type: 'consequence',
            data: esc,
            title: `Consequence Escalated: ${esc.consequenceId}`,
            description: esc.description || 'A past decision has caught up with you...'
          }]);
        });
      }
      
      // Queue resurfaced consequences as events
      if (resurfaced && resurfaced.length > 0) {
        resurfaced.forEach(res => {
          setEventQueue(prev => [...prev, {
            type: 'consequence',
            data: res,
            title: `Consequence Resurfaced: ${res.consequenceId}`,
            description: res.description || 'The past returns to haunt you...'
          }]);
        });
      }
    }

    // Generate a random event from Enhanced Dialogue system (50% chance)
    if (Math.random() > 0.5 && eventGen?.generateEvent) {
      const newEvent = eventGen.generateEvent();
      if (newEvent) {
        setEventQueue(prev => [...prev, newEvent]);
      }
    }

    // Update game state (week advancement is handled by gameLogic)
    if (gameState?.updateGameState) {
      gameState.updateGameState({
        week: (gameState.state?.week || 0) + 1
      });
    }

    // Show first queued event if exists
    if (eventQueue.length > 0) {
      setPendingEvent(eventQueue[0]);
      setShowEventModal(true);
    }
  }, [onAdvanceWeek, eventGen, gameState, eventQueue]);

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
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#16213e',
        borderBottom: '2px solid rgba(131, 56, 236, 0.3)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
            {gameData?.bandName || 'Your Band'}
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#aaa', fontSize: '0.9rem' }}>
            Week {gameData?.week || 0}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
          <div>
            <div style={{ color: '#aaa' }}>Money</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#22c55e' }}>
              ${gameData?.money?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>Fame</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ff006e' }}>
              {gameData?.fame || 0}
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>Members</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#8338ec' }}>
              {gameData?.bandMembers?.length || 0}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => {
              setAutoSaving(true);
              onSave?.();
              setTimeout(() => setAutoSaving(false), 1000);
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: autoSaving ? '#22c55e' : 'rgba(34, 197, 94, 0.3)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!autoSaving) e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.6)';
            }}
            onMouseLeave={(e) => {
              if (!autoSaving) e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.3)';
            }}
          >
            <Save size={16} />
            {autoSaving ? 'Saving...' : 'Save'}
          </button>

          <button
            onClick={onQuit}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.3)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.6)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'}
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
      <div style={{
        flex: 1,
        padding: '2rem',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }}>
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
        />
      </div>

      {/* Week Advancement Button */}
      {activeTab === 'dashboard' && (
        <div style={{
          padding: '1rem 2rem',
          backgroundColor: '#16213e',
          borderTop: '2px solid rgba(131, 56, 236, 0.3)',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '1rem'
        }}>
          <button
            onClick={triggerEvent}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'rgba(131, 56, 236, 0.3)',
              color: '#fff',
              border: '2px solid rgba(131, 56, 236, 0.5)',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.6)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.3)'}
          >
            Trigger Event
          </button>

          <button
            onClick={handleAdvanceWeek}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#ff006e',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#ff1975'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#ff006e'}
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
          onChoice={(eventId, choiceId, choiceText, consequences) => {
            // Handle choice through consequence system
            if (onHandleEventChoice) {
              onHandleEventChoice({
                eventId,
                choiceId,
                choiceText,
                ...consequences
              });
            }

            // Apply psychological effects if present
            if (dialogueState?.updatePsychologicalState && consequences?.psychologyEffects) {
              dialogueState.updatePsychologicalState(consequences.psychologyEffects);
            }

            // Apply faction effects if present
            if (consequenceSystem && consequences?.factionEffects) {
              Object.entries(consequences.factionEffects).forEach(([faction, delta]) => {
                consequenceSystem.updateFactionReputation(faction, delta);
              });
            }

            // Remove from queue and show next event if exists
            setEventQueue(prev => prev.slice(1));
            if (eventQueue.length > 1) {
              setPendingEvent(eventQueue[1]);
            } else {
              setShowEventModal(false);
              setPendingEvent(null);
            }

            // Original choice handler
            onEventChoice?.(eventId, choiceId, choiceText, consequences);
          }}
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
  onTriggerEvent
}) => {
  switch (tabId) {
    case 'dashboard':
      return <DashboardTab 
        gameData={gameData} 
        dialogueState={dialogueState}
        gameState={gameState}
        onAdvanceWeek={onAdvanceWeek}
        onTriggerEvent={onTriggerEvent}
      />;
    case 'inventory':
      return <InventoryTab gameData={gameData} gameLogic={gameLogic} />;
    case 'band':
      return <BandTab gameData={gameData} gameLogic={gameLogic} />;
    case 'gigs':
      return <GigsTab gameData={gameData} gameLogic={gameLogic} />;
    case 'upgrades':
      return <UpgradesTab gameData={gameData} gameLogic={gameLogic} />;
    case 'rivals':
      return <RivalsTab gameData={gameData} />;
    case 'log':
      return <LogTab gameData={gameData} />;
    default:
      return null;
  }
};

export default GamePage;
