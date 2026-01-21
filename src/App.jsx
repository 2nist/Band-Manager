/**
 * App.jsx - Refactored Main Application Component
 * 
 * Phase 0 Refactoring Complete:
 * - Uses specialized hooks for state management
 * - Imports page components
 * - Orchestrates game flow
 * - Minimal logic (300 lines vs 6,117 original)
 */

import React, { useEffect, useState } from 'react';
import './styles.css';

// Initialize Tone.js for audio synthesis
if (typeof window !== 'undefined' && !window.audioContextInitialized) {
  import('tone').then(ToneLib => {
    const Tone = ToneLib.default || ToneLib;
    // Initialize the audio context
    if (Tone && Tone.start) {
      Tone.start().catch(err => {
        console.log('Tone.js audio context initialization pending user interaction');
      });
    }
    window.audioContextInitialized = true;
  }).catch(err => {
    console.warn('Tone.js could not be loaded. Audio playback will not work.', err);
  });
}

// Import hooks
import {
  useGameState,
  useUIState,
  useModalState,
  useGameLogic,
  useEnhancedDialogue,
  useEventGeneration,
  useConsequenceSystem,
  useRecordingSystem,
  useGigSystem,
  useBandManagementSystem,
  useEquipmentUpgradesSystem,
  useLabelDealsSystem,
  useRivalCompetitionSystem,
  useFestivalPerformanceSystem,
  useRadioChartingSystem,
  useMerchandiseSystem,
  useSponsorshipSystem,
  useVictoryConditions,
  useTheme
} from './hooks';

// Import page components
import { LandingPage, GamePage, LogoDesigner, BandCreation, ScenarioSelection } from './pages';
import { EnhancedEventModal } from './components/EnhancedEventModal';
import { VictoryScreen } from './components/VictoryScreen';

// Import modals
import WriteSongModal from './components/Modals/WriteSongModal';
import AlbumBuilderModal from './components/Modals/AlbumBuilderModal';
import SaveModal from './components/Modals/SaveModal';
import LoadModal from './components/Modals/LoadModal';
import BandStatsModal from './components/Modals/BandStatsModal';

/**
 * Main App Component
 * 
 * Architecture:
 * - useGameState: Core game data
 * - useUIState: Navigation and UI state
 * - useModalState: Modal management
 * - useGameLogic: Game actions
 * - useEnhancedDialogue: Psychological state + narrative
 * - useEventGeneration: Procedural events
 * - useConsequenceSystem: Phase 2 consequence tracking (NEW)
 */
function App() {
  // Initialize theme system
  const themeSystem = useTheme();

  // Initialize hooks
  const gameState = useGameState();
  const uiState = useUIState();
  const modalState = useModalState();
  const gameLogic = useGameLogic(gameState);
  const dialogueState = useEnhancedDialogue(gameState.state, gameState.updateGameState);
  
  // Enhanced Features Configuration (must be before eventGen)
  // Controls feature toggles and content preferences for mature content
  const [enhancedFeatures, setEnhancedFeatures] = useState({
    enabled: true, // Toggle enhanced dialogue features on/off
    maturityLevel: 'teen', // 'teen' or 'mature' - affects which events can appear
    contentPreferences: {
      substance_abuse: false, // Drug/alcohol themed events
      sexual_content: false, // Sexual/romance themed events
      criminal_activity: false, // Crime/law-breaking themed events
      psychological_themes: true, // Psychological stress, depression, etc.
      violence: false, // Violence themed events
      explicit_language: false // Profanity in dialogue
    }
  });
  
  // Helper function to update content preference
  const setContentPreference = (category, enabled) => {
    setEnhancedFeatures(prev => ({
      ...prev,
      contentPreferences: {
        ...prev.contentPreferences,
        [category]: enabled
      }
    }));
  };
  
  // Helper function to toggle maturity level
  const setMaturityLevel = (level) => {
    setEnhancedFeatures(prev => ({
      ...prev,
      maturityLevel: level
    }));
  };
  
  // Event generation with enhanced features integrated
  const eventGen = useEventGeneration(
    gameState.state,
    dialogueState.psychologicalState,
    dialogueState.narrativeState,
    enhancedFeatures
  );
  
  // Phase 2: Consequence system (tracks consequences, factions, psychology evolution)
  const consequenceSystem = useConsequenceSystem(gameState.state);
  
  // Recording system for music creation and streaming revenue
  const recordingSystem = useRecordingSystem(gameState.state, gameState.updateGameState, gameState.addLog);
  
  // Gig system for booking performances and touring
  const gigSystem = useGigSystem(gameState.state, gameState.updateGameState, gameState.addLog);

  // Band management system for recruitment, development, and conflict resolution
  const bandManagement = useBandManagementSystem(gameState.state, gameState.updateGameState, gameState.addLog);

  // Equipment upgrades system for studio, instruments, and stage gear
  const equipmentUpgrades = useEquipmentUpgradesSystem(gameState.state, gameState.updateGameState, gameState.addLog);

  // Label deals system for record contracts and promotional support
  const labelDeals = useLabelDealsSystem(gameState.state, gameState.updateGameState, gameState.addLog);

  // Rival competition system for battles and prestige competition
  const rivalCompetition = useRivalCompetitionSystem(gameState.state, gameState.updateGameState, gameState.addLog);

  // Festival performance system for special events and prestige multipliers
  const festivalPerformance = useFestivalPerformanceSystem(gameState.state, gameState.updateGameState, gameState.addLog);

  // Radio and charting system for airplay and chart rankings
  const radioCharting = useRadioChartingSystem(gameState.state, gameState.updateGameState, gameState.addLog);

  // Merchandise system for band merchandise sales and passive income
  const merchandise = useMerchandiseSystem(gameState.state, gameState.updateGameState, gameState.addLog);

  // Sponsorship system for brand partnerships and endorsement deals
  const sponsorships = useSponsorshipSystem(gameState.state, gameState.updateGameState, gameState.addLog);

  // Victory conditions tracking
  const victoryConditions = useVictoryConditions(gameState.state, gameState.state?.selectedScenario);

  // Update victory conditions on each game state change
  useEffect(() => {
    victoryConditions.updateGoalProgress(gameState.state);
  }, [gameState.state?.week, gameState.state?.fame, gameState.state?.money]);

  // Render based on current step
  return (
    <div className="app">
      {gameState.step === 'landing' ? (
        <LandingPage
          onNewGame={(bandName) => {
            gameState.setBandName(bandName);
            gameState.setStep('scenario');
          }}
          onLoadGame={(saveName) => {
            // Load game logic handled by GamePage
            gameState.setStep('game');
          }}
          onSettings={() => uiState.setShowSettings(true)}
          saveSlots={gameState.saveSlots}
        />
      ) : gameState.step === 'scenario' ? (
        <ScenarioSelection
          bandName={gameState.state?.bandName || 'Your Band'}
          onSelectScenario={(scenario) => {
            gameState.updateGameState({
              selectedScenario: scenario,
              money: scenario.initialMoney,
              fame: scenario.initialFame,
              week: 0
            });
            gameState.setStep('logo');
          }}
          onBack={() => gameState.setStep('landing')}
        />
      ) : gameState.step === 'logo' ? (
        <LogoDesigner
          bandName={gameState.state?.bandName || 'Your Band'}
          logoState={gameState.state}
          onLogoChange={(updates) => gameState.updateGameState(updates)}
          onComplete={() => gameState.setStep('bandCreation')}
          onBack={() => gameState.setStep('scenario')}
        />
      ) : gameState.step === 'bandCreation' ? (
        <BandCreation
          bandName={gameState.state?.bandName || 'Your Band'}
          logo={gameState.state?.logo}
          onComplete={(members) => {
            gameState.updateGameState({ bandMembers: members });
            gameState.setStep('game');
          }}
        />
      ) : (
        <GamePage
          gameState={gameState}
          uiState={uiState}
          modalState={modalState}
          gameLogic={gameLogic}
          dialogueState={dialogueState}
          eventGen={eventGen}
          consequenceSystem={consequenceSystem}
          enhancedFeatures={enhancedFeatures}
          setContentPreference={setContentPreference}
          setMaturityLevel={setMaturityLevel}
          themeSystem={themeSystem}
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
          onReturnToLanding={() => gameState.setStep('landing')}
          victoryConditions={victoryConditions}
          onHandleEventChoice={(choice) => {
            // Handle choice through consequence system
            if (choice.factionEffects) {
              consequenceSystem.updateFactionStandings(choice);
            }
            if (choice.triggerConsequence) {
              const consequence = choice.triggerConsequence;
              if (consequence.type === 'active') {
                consequenceSystem.addActiveConsequence(consequence);
              } else if (consequence.type === 'dormant') {
                consequenceSystem.addDormantConsequence(consequence);
              }
            }
            if (choice.psychologyEffects) {
              Object.entries(choice.psychologyEffects).forEach(([path, changes]) => {
                Object.entries(changes).forEach(([stat, amount]) => {
                  consequenceSystem.updatePsychology(path, stat, amount);
                });
              });
            }
          }}
          onAdvanceWeek={() => {
            // Process all consequence system updates on week advancement
            const weekResults = consequenceSystem.processWeeklyConsequences();
            const { escalations, resurfaced } = weekResults;
            
            // Log events if available
            if (gameState?.addLog) {
              if (escalations?.length > 0) {
                escalations.forEach(esc => {
                  gameState.addLog(`Consequence escalated: ${esc.description}`);
                });
              }
              if (resurfaced?.length > 0) {
                resurfaced.forEach(res => {
                  gameState.addLog(`Past consequence resurfaced: ${res.description}`);
                });
              }
            }
            
            return { escalations, resurfaced };
          }}
        />
      )}

      {/* Victory/Defeat Screen */}
      <VictoryScreen
        victoryState={victoryConditions.victoryState}
        scenario={gameState.state?.selectedScenario}
        onNewGame={() => {
          gameState.resetGame();
          gameState.setStep('scenario');
        }}
        onMainMenu={() => {
          gameState.resetGame();
          gameState.setStep('landing');
        }}
      />

      {/* Global Modals */}
      {modalState.showEventModal && (
        <EnhancedEventModal
          event={modalState.currentEvent}
          onChoice={(choiceId) => {
            // Handle event choice through game logic
            modalState.setShowEventModal(false);
          }}
          onClose={() => modalState.setShowEventModal(false)}
        />
      )}

      {modalState.showWriteSongModal && (
        <WriteSongModal
          onSave={(songData) => {
            gameLogic.createSong(songData);
            modalState.setShowWriteSongModal(false);
          }}
          onClose={() => modalState.setShowWriteSongModal(false)}
        />
      )}

      {modalState.showAlbumBuilderModal && (
        <AlbumBuilderModal
          songs={gameState.gameData.songs}
          onCreateAlbum={(albumData) => {
            gameLogic.recordAlbum(albumData);
            modalState.setShowAlbumBuilderModal(false);
          }}
          onClose={() => modalState.setShowAlbumBuilderModal(false)}
        />
      )}

      {modalState.showSaveModal && (
        <SaveModal
          currentSave={gameState.gameName}
          onSave={(saveName) => {
            gameState.saveGame(saveName);
            modalState.setShowSaveModal(false);
          }}
          onClose={() => modalState.setShowSaveModal(false)}
        />
      )}

      {modalState.showLoadModal && (
        <LoadModal
          saves={gameState.getSaveSlots()}
          onLoad={(saveName) => {
            gameState.loadGame(saveName);
            modalState.setShowLoadModal(false);
          }}
          onClose={() => modalState.setShowLoadModal(false)}
        />
      )}

      {modalState.showBandStatsModal && modalState.selectedBandMember && (
        <BandStatsModal
          member={modalState.selectedBandMember}
          onClose={() => modalState.setShowBandStatsModal(false)}
        />
      )}
    </div>
  );
}

export default App;
