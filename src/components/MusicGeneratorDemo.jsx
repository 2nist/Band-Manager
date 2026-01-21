/**
 * MusicGeneratorDemo - Test Phase 1 music generation
 * 
 * Demonstrates constraint-based generation with simple test scenarios
 */

import React, { useState } from 'react';
import { MusicGenerator, ConstraintEngine } from '../music';
import TrackPlayer from './TrackPlayer';

export const MusicGeneratorDemo = () => {
  const [testResults, setTestResults] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState('confident-rock');
  const [generatedSong, setGeneratedSong] = useState(null);

  // Test scenarios representing different band states
  const scenarios = {
    'confident-rock': {
      name: 'Confident Rock Band',
      genre: 'rock',
      gameState: {
        bandName: 'Thunder Road',
        currentWeek: 20,
        bandConfidence: 85,
        money: 5000,
        bandMembers: [
          { instrument: 'vocalist', skill: 80, chemistry: { } },
          { instrument: 'guitarist', skill: 75, chemistry: { } },
          { instrument: 'bassist', skill: 70, chemistry: { } },
          { instrument: 'drummer', skill: 85, chemistry: { } }
        ],
        psychState: {
          stress: 30,
          addiction_risk: 10,
          moral_integrity: 80,
          depression: 15,
          paranoia: 10,
          ego: 70,
          burnout: 20,
          substance_use: 5
        },
        labelDeal: { type: 'major', pressure: 60 },
        fanbase: { primary: 'mainstream', size: 5000, loyalty: 70 },
        mediaAttention: 50,
        totalGigs: 40,
        albumsReleased: 2
      }
    },
    'burnt-out-punk': {
      name: 'Burnt Out Punk Band',
      genre: 'punk',
      gameState: {
        bandName: 'Broken String',
        currentWeek: 60,
        bandConfidence: 35,
        money: -2000,
        bandMembers: [
          { instrument: 'vocalist', skill: 50, chemistry: { } },
          { instrument: 'guitarist', skill: 45, chemistry: { } },
          { instrument: 'bassist', skill: 40, chemistry: { } },
          { instrument: 'drummer', skill: 55, chemistry: { } }
        ],
        psychState: {
          stress: 85,
          addiction_risk: 70,
          moral_integrity: 40,
          depression: 80,
          paranoia: 60,
          ego: 30,
          burnout: 95,
          substance_use: 75
        },
        labelDeal: null,
        fanbase: { primary: 'underground', size: 500, loyalty: 40 },
        mediaAttention: 20,
        totalGigs: 120,
        albumsReleased: 0
      }
    },
    'rising-metal': {
      name: 'Rising Metal Band',
      genre: 'metal',
      gameState: {
        bandName: 'Iron Silence',
        currentWeek: 35,
        bandConfidence: 65,
        money: 1000,
        bandMembers: [
          { instrument: 'vocalist', skill: 70, chemistry: { } },
          { instrument: 'guitarist', skill: 85, chemistry: { } },
          { instrument: 'bassist', skill: 75, chemistry: { } },
          { instrument: 'drummer', skill: 80, chemistry: { } }
        ],
        psychState: {
          stress: 60,
          addiction_risk: 40,
          moral_integrity: 70,
          depression: 45,
          paranoia: 35,
          ego: 55,
          burnout: 40,
          substance_use: 30
        },
        labelDeal: { type: 'indie', pressure: 30 },
        fanbase: { primary: 'underground', size: 2000, loyalty: 85 },
        mediaAttention: 30,
        totalGigs: 60,
        albumsReleased: 1
      }
    }
  };

  /**
   * Run generation test
   */
  const handleGenerateSong = () => {
    const scenario = scenarios[selectedScenario];
    
    try {
      // Generate song
      const song = MusicGenerator.generateSong(
        scenario.gameState,
        scenario.genre,
        {
          seed: `demo-${selectedScenario}-${Date.now()}`,
          songName: `${scenario.name} - Demo Track`
        }
      );

      setTestResults({
        scenario: scenario.name,
        success: true,
        song
      });

      // Also set for playback
      setGeneratedSong(song);

    } catch (error) {
      setTestResults({
        scenario: scenario.name,
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Generate with seed twice to verify reproducibility
   */
  const handleVerifyReproducibility = () => {
    const scenario = scenarios[selectedScenario];
    const fixedSeed = 'reproducibility-test';

    try {
      const song1 = MusicGenerator.generateSong(
        scenario.gameState,
        scenario.genre,
        { seed: fixedSeed }
      );

      const song2 = MusicGenerator.generateSong(
        scenario.gameState,
        scenario.genre,
        { seed: fixedSeed }
      );

      const areDrumsIdentical = 
        JSON.stringify(song1.musicalContent.drums) === 
        JSON.stringify(song2.musicalContent.drums);

      const areHarmoniesIdentical =
        JSON.stringify(song1.musicalContent.harmony) ===
        JSON.stringify(song2.musicalContent.harmony);

      setTestResults({
        scenario: scenario.name,
        success: true,
        reproducibility: {
          drumPatternIdentical: areDrumsIdentical,
          harmonyIdentical: areHarmoniesIdentical,
          bothIdentical: areDrumsIdentical && areHarmoniesIdentical,
          song1Tempo: song1.composition.tempo,
          song2Tempo: song2.composition.tempo
        }
      });

    } catch (error) {
      setTestResults({
        scenario: scenario.name,
        success: false,
        error: error.message
      });
    }
  };

  /**
   * Test different psychological states affect music
   */
  const handleTestPsychologicalModulation = () => {
    const scenario = scenarios[selectedScenario];
    const baseSeed = 'psychology-test';

    try {
      // Generate with depression
      const gameState1 = {
        ...scenario.gameState,
        psychState: { ...scenario.gameState.psychState, depression: 90 }
      };

      // Generate with confidence/ego
      const gameState2 = {
        ...scenario.gameState,
        psychState: { ...scenario.gameState.psychState, ego: 95, confidence: 95 }
      };

      const song1 = MusicGenerator.generateSong(gameState1, scenario.genre, { seed: baseSeed });
      const song2 = MusicGenerator.generateSong(gameState2, scenario.genre, { seed: baseSeed });

      setTestResults({
        scenario: scenario.name,
        success: true,
        psychologicalModulation: {
          depressedState: {
            tempo: song1.composition.tempo,
            quality: song1.analysis.qualityScore,
            emotionalTone: song1.analysis.emotionalTone
          },
          confidentState: {
            tempo: song2.composition.tempo,
            quality: song2.analysis.qualityScore,
            emotionalTone: song2.analysis.emotionalTone
          },
          tempoChanged: song1.composition.tempo !== song2.composition.tempo
        }
      });

    } catch (error) {
      setTestResults({
        scenario: scenario.name,
        success: false,
        error: error.message
      });
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Phase 1: Music Generator Demo</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Test Scenario: </label>
        <select 
          value={selectedScenario}
          onChange={(e) => setSelectedScenario(e.target.value)}
          style={{ padding: '8px', marginLeft: '10px' }}
        >
          {Object.entries(scenarios).map(([key, value]) => (
            <option key={key} value={key}>{value.name}</option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={handleGenerateSong}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Generate Song
        </button>
        <button 
          onClick={handleVerifyReproducibility}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Verify Reproducibility
        </button>
        <button 
          onClick={handleTestPsychologicalModulation}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          Test Psychology Effects
        </button>
      </div>

      {testResults && (
        <div style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #0ff',
          padding: '15px',
          borderRadius: '5px',
          color: '#0f0',
          marginBottom: '20px'
        }}>
          <h2>{testResults.scenario}</h2>
          <pre style={{ overflow: 'auto', maxHeight: '300px', fontSize: '0.8em' }}>
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}

      {/* Track Player */}
      {generatedSong && (
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <h2>Now Playing</h2>
          <TrackPlayer 
            song={generatedSong}
            onExport={(exportData) => console.log('Exported:', exportData)}
          />
        </div>
      )}
    </div>
  );
};

export default MusicGeneratorDemo;
