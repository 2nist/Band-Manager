/**
 * App.jsx - Refactored Main Application Component
 * 
 * Phase 0 Refactoring Complete:
 * - Uses specialized hooks for state management
 * - Imports page components
 * - Orchestrates game flow
 * - Minimal logic (300 lines vs 6,117 original)
 */

import React, { useEffect, useState, useRef } from 'react';
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
  useGameData,
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
import { LandingPage, GamePage, LogoDesigner, BandCreation, ScenarioSelection, CharacterCreation, AvatarCreation, AuditionFlow } from './pages';
import { EnhancedEventModal } from './components/EnhancedEventModal';
import { VictoryScreen } from './components/VictoryScreen';
import { initializeFirstPersonMode } from './utils/preMadeBand';

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
  // Ref to store GamePage's handleEventChoice handler
  const gamePageEventChoiceHandlerRef = useRef(null);
  
  // Initialize theme system
  const themeSystem = useTheme();

  // Load game data (song titles, genres, etc.)
  const { data: gameData, loading: dataLoading, error: dataError } = useGameData();

  // Initialize hooks
  const gameState = useGameState();
  const uiState = useUIState();
  const modalState = useModalState();
  
  // Fix: useGameLogic needs correct parameters (state object, updateGameState, addLog, gameData)
  const gameLogic = useGameLogic(
    gameState.state,
    gameState.updateGameState,
    gameState.addLog,
    gameData || {}
  );
  
  const dialogueState = useEnhancedDialogue(gameState.state, gameState.updateGameState);
  
  // Enhanced Features Configuration (must be before eventGen)
  // Controls feature toggles and content preferences for mature content
  const [enhancedFeatures, setEnhancedFeatures] = useState({
    enabled: true, // Toggle enhanced dialogue features on/off
    maturityLevel: 'mature', // 'teen' or 'mature' - affects which events can appear (changed to 'mature' to allow enhanced dialogue events)
    contentPreferences: {
      substance_abuse: false, // Drug/alcohol themed events
      sexual_content: false, // Sexual/romance themed events
      criminal_activity: false, // Crime/law-breaking themed events
      psychological_themes: true, // Psychological stress, depression, etc. (ENABLED - this allows psychological_horror events)
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

  // Show loading state while game data loads
  if (dataLoading) {
    return (
      <div className="app flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-2xl mb-4">Loading game data...</div>
          <div className="animate-spin">⏳</div>
        </div>
      </div>
    );
  }

  // Show error state if game data fails to load
  if (dataError) {
    return (
      <div className="app flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <div className="text-2xl mb-4">Error loading game data</div>
          <div className="text-lg">{dataError.message}</div>
        </div>
      </div>
    );
  }

  // Render based on current step
  return (
    <div className={gameState.step === 'landing' ? 'app' : ''}>
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
            const isFirstPersonMode = scenario.specialRules?.firstPersonMode; // Band Member
            const isBandLeaderMode = scenario.specialRules?.bandLeaderMode; // Band Leader
            const isManagementMode = scenario.specialRules?.managementMode; // Band Manager
            
            if (isFirstPersonMode) {
              // Band Member Mode: logo -> pre-made band -> game
              gameState.updateGameState({
                selectedScenario: scenario,
                money: scenario.initialMoney,
                fame: scenario.initialFame,
                week: 0
              });
              gameState.setStep('logo');
            } else if (isBandLeaderMode) {
              // Band Leader Mode: logo -> character creation -> avatar -> auditions -> game
              gameState.updateGameState({
                selectedScenario: scenario,
                money: scenario.initialMoney,
                fame: scenario.initialFame,
                week: 0
              });
              gameState.setStep('logo');
            } else if (isManagementMode) {
              // Band Manager Mode: normal flow (logo -> band creation -> game)
              gameState.updateGameState({
                selectedScenario: scenario,
                money: scenario.initialMoney,
                fame: scenario.initialFame,
                week: 0
              });
              gameState.setStep('logo');
            } else {
              // Fallback: normal mode (shouldn't happen with only 3 scenarios)
              gameState.updateGameState({
                selectedScenario: scenario,
                money: scenario.initialMoney,
                fame: scenario.initialFame,
                week: 0
              });
              gameState.setStep('logo');
            }
          }}
          onBack={() => gameState.setStep('landing')}
        />
      ) : gameState.step === 'characterCreation' ? (
        <CharacterCreation
          gameState={gameState}
          onComplete={(characterData) => {
            gameState.updateGameState({
              bandName: gameState.state?.bandName || characterData.bandName, // Preserve existing band name
              leaderName: characterData.leaderName,
              leaderRole: characterData.leaderRole,
              bandMembers: [characterData.playerCharacter], // Start with just the leader
              bandLeaderMode: true,
              firstPersonNarrative: true
            });
            gameState.setStep('avatarCreation');
          }}
          onBack={() => gameState.setStep('logo')}
        />
      ) : gameState.step === 'avatarCreation' ? (
        <AvatarCreation
          gameState={gameState}
          mode={gameState.state?.selectedScenario?.specialRules?.bandLeaderMode ? 'leader' :
                gameState.state?.selectedScenario?.specialRules?.managementMode ? 'manager' :
                gameState.state?.selectedScenario?.specialRules?.firstPersonMode ? 'member' : 'leader'}
          onComplete={(avatarConfig) => {
            const isBandLeaderMode = gameState.state?.selectedScenario?.specialRules?.bandLeaderMode;
            const isManagementMode = gameState.state?.selectedScenario?.specialRules?.managementMode;
            const isFirstPersonMode = gameState.state?.selectedScenario?.specialRules?.firstPersonMode;
            
            if (isBandLeaderMode) {
              // Update player character (leader) with avatar
              const members = gameState.state?.bandMembers || [];
              if (members.length > 0 && members[0].isLeader) {
                const updatedMembers = [...members];
                updatedMembers[0] = {
                  ...updatedMembers[0],
                  avatarConfig: avatarConfig
                };
                gameState.updateGameState({ bandMembers: updatedMembers });
              }
              gameState.setStep('auditions');
            } else if (isManagementMode) {
              // Save manager avatar and proceed to band creation
              gameState.updateGameState({ 
                managerAvatarConfig: avatarConfig,
                managerName: gameState.state?.managerName || 'You'
              });
              gameState.setStep('bandCreation');
            } else if (isFirstPersonMode) {
              // Save player character avatar and proceed to pre-made band setup
              const preMadeBandData = initializeFirstPersonMode('midnight-echoes');
              // Update the player character in the pre-made band with the avatar
              const playerMember = preMadeBandData.bandMembers?.find(m => m.name === 'You' || m.isPlayer);
              if (playerMember) {
                playerMember.avatarConfig = avatarConfig;
              } else if (preMadeBandData.bandMembers && preMadeBandData.bandMembers.length > 0) {
                // If no "You" member, update the first member (assumed to be player)
                preMadeBandData.bandMembers[0].avatarConfig = avatarConfig;
                preMadeBandData.bandMembers[0].isPlayer = true;
              }
              gameState.updateGameState(preMadeBandData);
              gameState.setStep('game');
            }
          }}
          onBack={() => {
            const isBandLeaderMode = gameState.state?.selectedScenario?.specialRules?.bandLeaderMode;
            if (isBandLeaderMode) {
              gameState.setStep('characterCreation');
            } else {
              gameState.setStep('logo');
            }
          }}
          onSkip={() => {
            const isBandLeaderMode = gameState.state?.selectedScenario?.specialRules?.bandLeaderMode;
            const isManagementMode = gameState.state?.selectedScenario?.specialRules?.managementMode;
            const isFirstPersonMode = gameState.state?.selectedScenario?.specialRules?.firstPersonMode;
            
            if (isBandLeaderMode) {
              gameState.setStep('auditions');
            } else if (isManagementMode) {
              gameState.setStep('bandCreation');
            } else if (isFirstPersonMode) {
              const preMadeBandData = initializeFirstPersonMode('midnight-echoes');
              gameState.updateGameState(preMadeBandData);
              gameState.setStep('game');
            }
          }}
        />
      ) : gameState.step === 'auditions' ? (
        <AuditionFlow
          gameState={gameState}
          onComplete={() => {
            // Need at least 2 members (leader + 1 hired)
            const members = gameState.state?.bandMembers || [];
            if (members.length < 2) {
              alert('You need at least one band member to start! Continue auditioning.');
              return;
            }
            gameState.setStep('game');
          }}
          onBack={() => gameState.setStep('characterCreation')}
        />
      ) : gameState.step === 'logo' ? (
        <LogoDesigner
          bandName={gameState.state?.bandName || 'Your Band'}
          logoState={gameState.state}
          onLogoChange={(updates) => gameState.updateGameState(updates)}
          onComplete={() => {
            const isFirstPersonMode = gameState.state?.selectedScenario?.specialRules?.firstPersonMode;
            const isBandLeaderMode = gameState.state?.selectedScenario?.specialRules?.bandLeaderMode;
            
            if (isFirstPersonMode) {
              // Band Member Mode: after logo, create player avatar -> pre-made band -> game
              gameState.setStep('avatarCreation');
            } else if (isBandLeaderMode) {
              // Band Leader Mode: after logo, go to character creation
              gameState.setStep('characterCreation');
            } else {
              // Band Manager Mode: after logo, create manager avatar -> band creation
              gameState.setStep('avatarCreation');
            }
          }}
          onBack={() => gameState.setStep('scenario')}
        />
      ) : gameState.step === 'bandCreation' ? (
        <BandCreation
          bandName={gameState.state?.bandName || 'Your Band'}
          logo={gameState.state?.logo}
          onComplete={(members, genre) => {
            // Ensure state exists before updating
            if (!gameState.state) {
              console.warn('gameState.state is undefined, initializing...');
              gameState.updateGameState({
                bandName: gameState.state?.bandName || 'Your Band',
                week: gameState.state?.week || 0,
                money: gameState.state?.money || 0,
                fame: gameState.state?.fame || 0
              });
            }
            
            gameState.updateGameState({ 
              bandMembers: members,
              genre: genre || 'Pop' // Default to Pop if not provided
            });
            
            // Small delay to ensure state is updated before transition
            setTimeout(() => {
              gameState.setStep('game');
            }, 0);
          }}
        />
      ) : (
        <GamePage
          gameData={gameData}
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
          onSave={() => {
            if (gameState.state?.bandName) {
              gameState.saveGame(gameState.state.bandName);
            }
          }}
          onQuit={() => gameState.setStep('landing')}
          victoryConditions={victoryConditions}
          onRegisterEventChoiceHandler={(handler) => {
            gamePageEventChoiceHandlerRef.current = handler;
          }}
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

      {/* Global Modals - Enhanced Event Modal */}
      {modalState.modals.eventPopup && modalState.modalData.eventPopupData && (
        <EnhancedEventModal
          isOpen={true}
          event={modalState.modalData.eventPopupData}
          psychologicalState={dialogueState?.psychologicalState}
          gameState={gameState?.state || gameState}
          onChoice={(eventId, choiceId, choiceText, impacts) => {
            // Use GamePage's handleEventChoice if available, otherwise fallback to App's handler
            if (gamePageEventChoiceHandlerRef.current) {
              gamePageEventChoiceHandlerRef.current(eventId, choiceId, choiceText, impacts);
            } else {
              // Fallback: Find the choice object from the event
              const event = modalState.modalData.eventPopupData;
              const choice = event?.choices?.find(c => c.id === choiceId);
              
              if (!choice) return;
              
              // Apply psychological effects from the choice
              if (choice.psychologicalEffects && dialogueState?.updatePsychologicalState) {
                const updates = {};
                Object.entries(choice.psychologicalEffects).forEach(([key, value]) => {
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
              
              // Handle through consequence system
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
              
              // Log the choice made
              if (gameState?.addLog && choiceText) {
                gameState.addLog(`You chose: "${choiceText}"`, 'info');
              }
              
              // Close the modal
              modalState.closeEventPopup();
            }
          }}
          onClose={() => modalState.closeEventPopup()}
        />
      )}

      {modalState.modals.writeSong && (
        <WriteSongModal
          isOpen={modalState.modals.writeSong}
          onRecord={(songData) => {
            if (gameLogic.writeSong) {
              gameLogic.writeSong(songData);
            } else if (gameLogic.createSong) {
              gameLogic.createSong(songData);
            }
            modalState.closeWriteSongModal();
          }}
          onClose={() => modalState.closeWriteSongModal()}
          studioTier={gameState.state?.studioTier || 0}
          difficulty={gameState.state?.difficulty || 'normal'}
          defaultTitle={modalState.modalData.newSongTitle || ''}
          addLog={gameState.addLog}
        />
      )}

      {modalState.modals.albumBuilder && (
        <AlbumBuilderModal
          isOpen={modalState.modals.albumBuilder}
          songs={gameState.state?.songs || []}
          studioTier={gameState.state?.studioTier || 0}
          difficulty={gameState.state?.difficulty || 'normal'}
          onRecordAlbum={(songIds) => {
            if (gameLogic.recordAlbum) {
              gameLogic.recordAlbum(songIds);
            }
            modalState.closeModal('albumBuilder');
          }}
          onClose={() => modalState.closeModal('albumBuilder')}
        />
      )}

      {modalState.showSaveModal && (
        <SaveModal
          currentSave={gameState.state?.bandName || ''}
          onSave={(saveName) => {
            gameState.saveGame(saveName);
            modalState.setShowSaveModal(false);
          }}
          onClose={() => modalState.setShowSaveModal(false)}
        />
      )}

      {modalState.showLoadModal && (
        <LoadModal
          saves={gameState.saveSlots || {}}
          onLoad={(saveName) => {
            const result = gameState.loadGame(saveName);
            if (result?.success) {
              modalState.setShowLoadModal(false);
            }
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
