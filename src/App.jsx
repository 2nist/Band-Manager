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
  useGameData,
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
  // Load game data first
  const { data: gameData, loading, error } = useGameData();
  
  // Initialize hooks
  const gameState = useGameState();
  const uiState = useUIState();
  const modalState = useModalState();
  const gameLogic = useGameLogic(gameState.state, gameState.updateGameState, gameState.addLog, gameData);
  const dialogueState = useEnhancedDialogue(gameState.state, gameState.updateGameState);
  const eventGen = useEventGeneration(
    gameData,
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

  // Handle loading state
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#1a1a2e', 
        color: '#fff',
        fontSize: '1.2rem'
      }}>
        Loading game data...
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#1a1a2e', 
        color: '#fff',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <h1 style={{ color: '#ef4444', marginBottom: '1rem' }}>Error Loading Game</h1>
        <p style={{ color: '#aaa' }}>{error.message}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            marginTop: '1rem', 
            padding: '0.5rem 1rem', 
            backgroundColor: '#8338ec', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '0.375rem', 
            cursor: 'pointer' 
          }}
        >
          Retry
        </button>
      </div>
    );
  }


  // Render based on current step
  return (
    <div className="app">
      {gameState.state.step === 'landing' || !gameState.state.step ? (
        <LandingPage
          onNewGame={(bandName) => {
            gameState.updateGameState({ bandName, step: 'game' });
          }}
          onLoadGame={(saveName) => {
            // Load game logic
            gameState.loadGame(saveName);
            gameState.updateGameState({ step: 'game' });
          }}
          onSettings={() => uiState.setShowSettings(true)}
        />
      ) : (
        <GamePage
          gameData={gameState.state}
          gameState={gameState}
          uiState={uiState}
          modalState={modalState}
          gameLogic={gameLogic}
          dialogueState={dialogueState}
          eventGen={eventGen}
          onReturnToLanding={() => gameState.updateGameState({ step: 'landing' })}
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
          songs={gameState.state.songs}
          onCreateAlbum={(albumData) => {
            gameLogic.recordAlbum(albumData);
            modalState.setShowAlbumBuilderModal(false);
          }}
          onClose={() => modalState.setShowAlbumBuilderModal(false)}
        />
      )}

      {modalState.showSaveModal && (
        <SaveModal
          currentSave={gameState.state.bandName}
          onSave={(saveName) => {
            gameState.saveGame(saveName);
            modalState.setShowSaveModal(false);
          }}
          onClose={() => modalState.setShowSaveModal(false)}
        />
      )}

      {modalState.showLoadModal && (
        <LoadModal
          saves={gameState.saveSlots}
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
