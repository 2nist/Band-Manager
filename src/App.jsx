/**
 * App.jsx - Refactored Main Application Component
 * 
 * Phase 0 Refactoring Complete:
 * - Uses specialized hooks for state management
 * - Imports page components
 * - Orchestrates game flow
 * - Minimal logic (300 lines vs 6,117 original)
 */

import React, { useEffect } from 'react';
import './styles.css';

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
  useGigSystem
} from './hooks';

// Import page components
import { LandingPage, GamePage, LogoDesigner, BandCreation } from './pages';
import { EnhancedEventModal } from './components/EnhancedEventModal';

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
  // Initialize hooks
  const gameState = useGameState();
  const uiState = useUIState();
  const modalState = useModalState();
  const gameLogic = useGameLogic(gameState);
  const dialogueState = useEnhancedDialogue(gameState.state, gameState.updateGameState);
  const eventGen = useEventGeneration(
    gameState.state,
    dialogueState.psychologicalState,
    dialogueState.narrativeState
  );
  
  // Phase 2: Consequence system (tracks consequences, factions, psychology evolution)
  const consequenceSystem = useConsequenceSystem(gameState.state);
  
  // Recording system for music creation and streaming revenue
  const recordingSystem = useRecordingSystem(gameState.state, gameState.updateGameState, gameState.addLog);
  
  // Gig system for booking performances and touring
  const gigSystem = useGigSystem(gameState.state, gameState.updateGameState, gameState.addLog);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.className = uiState.theme;
    if (uiState.darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [uiState.theme, uiState.darkMode]);

  // Render based on current step
  return (
    <div className="app">
      {gameState.step === 'landing' ? (
        <LandingPage
          onNewGame={(bandName) => {
            gameState.setBandName(bandName);
            gameState.setStep('logo');
          }}
          onLoadGame={(saveName) => {
            // Load game logic handled by GamePage
            gameState.setStep('game');
          }}
          onSettings={() => uiState.setShowSettings(true)}
          saveSlots={gameState.saveSlots}
        />
      ) : gameState.step === 'logo' ? (
        <LogoDesigner
          bandName={gameState.state?.bandName || 'Your Band'}
          logoState={gameState.state}
          onLogoChange={(updates) => gameState.updateGameState(updates)}
          onComplete={() => gameState.setStep('bandCreation')}
          onBack={() => gameState.setStep('landing')}
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
          onReturnToLanding={() => gameState.setStep('landing')}
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
            // Process consequences on week advancement
            const escalations = consequenceSystem.processEscalations();
            const resurfaced = consequenceSystem.checkResurfacing();
            consequenceSystem.applyFactionDecay();
            
            return { escalations, resurfaced };
          }}
        />
      )}

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
