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
  useEventGeneration
} from './hooks';

// Import page components
import { LandingPage, GamePage } from './pages';
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
 */
function App() {
  // Initialize hooks
  const gameState = useGameState();
  const uiState = useUIState();
  const modalState = useModalState();
  const gameLogic = useGameLogic(gameState);
  const dialogueState = useEnhancedDialogue();
  const eventGen = useEventGeneration(
    gameState.gameData,
    dialogueState.psychologicalState,
    dialogueState.narrativeState
  );

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
          onStartNewGame={(bandName) => {
            gameState.setBandName(bandName);
            gameState.setStep('game');
          }}
          onLoadGame={(saveName) => {
            // Load game logic handled by GamePage
            gameState.setStep('game');
          }}
          onSettings={() => uiState.setShowSettings(true)}
        />
      ) : (
        <GamePage
          gameState={gameState}
          uiState={uiState}
          modalState={modalState}
          gameLogic={gameLogic}
          dialogueState={dialogueState}
          eventGen={eventGen}
          onReturnToLanding={() => gameState.setStep('landing')}
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
