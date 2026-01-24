/**
 * InstrumentCustomizer - Main orchestrating component for instrument customization
 * 
 * Provides progressive disclosure UI with intelligent defaults and modular architecture
 */

import React, { useState, useEffect, useCallback } from 'react';
import { X, Settings } from 'lucide-react';
import { generateIntelligentDefaults, calculateMemberSkillLevels } from '../../music/utils/intelligentDefaults.js';
import { ViewLevelSelector } from './ViewLevelSelector.jsx';
import { GlobalControls } from './GlobalControls.jsx';
import { InstrumentGrid } from './InstrumentGrid.jsx';
import { AdvancedInstrumentEditor } from './AdvancedInstrumentEditor.jsx';
import { PreviewControls } from './PreviewControls.jsx';

export const InstrumentCustomizer = ({ 
  bandMembers = [],
  currentGenre = 'Rock',
  onConfigChange,
  gameState = {},
  isOpen = true,
  onClose
}) => {
  const [viewLevel, setViewLevel] = useState('basic');
  const [activeInstrument, setActiveInstrument] = useState(null);
  const [instrumentConfigs, setInstrumentConfigs] = useState({});
  const [previewPlaying, setPreviewPlaying] = useState(false);

  // Calculate member skill levels for view unlocking
  const memberSkillLevels = calculateMemberSkillLevels(bandMembers);

  // Initialize with intelligent defaults
  useEffect(() => {
    if (bandMembers.length > 0) {
      const defaultConfigs = generateIntelligentDefaults(bandMembers, currentGenre, gameState);
      setInstrumentConfigs(defaultConfigs);
      
      // Notify parent of initial configs
      if (onConfigChange) {
        Object.entries(defaultConfigs).forEach(([role, config]) => {
          onConfigChange(role, config);
        });
      }
    }
  }, [bandMembers, currentGenre, gameState]);

  // Update view level based on skill
  useEffect(() => {
    if (viewLevel === 'intermediate' && memberSkillLevels.average < 30) {
      setViewLevel('basic');
    } else if (viewLevel === 'advanced' && memberSkillLevels.average < 60) {
      setViewLevel('basic');
    } else if (viewLevel === 'expert' && memberSkillLevels.highest < 80) {
      setViewLevel('basic');
    }
  }, [memberSkillLevels, viewLevel]);

  const handleConfigChange = useCallback((instrument, config) => {
    setInstrumentConfigs(prev => ({
      ...prev,
      [instrument]: config
    }));
    
    if (onConfigChange) {
      onConfigChange(instrument, config);
    }
  }, [onConfigChange]);

  const applyGlobalChanges = useCallback((changes) => {
    const updatedConfigs = { ...instrumentConfigs };
    
    Object.keys(changes).forEach(role => {
      if (updatedConfigs[role]) {
        updatedConfigs[role] = {
          ...updatedConfigs[role],
          ...changes[role]
        };
      }
    });
    
    setInstrumentConfigs(updatedConfigs);
    
    // Notify parent
    Object.entries(updatedConfigs).forEach(([role, config]) => {
      if (onConfigChange) {
        onConfigChange(role, config);
      }
    });
  }, [instrumentConfigs, onConfigChange]);

  const exportConfiguration = useCallback(() => {
    const configData = {
      genre: currentGenre,
      timestamp: new Date().toISOString(),
      configs: instrumentConfigs,
      bandMembers: bandMembers.map(m => ({
        id: m.id,
        role: m.role || m.type,
        name: m.firstName || m.name
      }))
    };
    
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `instrument-config-${currentGenre}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [instrumentConfigs, currentGenre, bandMembers]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] border-2 border-cyan-500/30 rounded-lg max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-3">
            <Settings size={24} className="text-cyan-400" />
            <h2 className="text-xl font-bold text-cyan-400 m-0">
              Instrument Customization
            </h2>
            <span className="text-sm text-gray-400">
              {currentGenre} • {bandMembers.length} Members
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* View Level Selector */}
          <ViewLevelSelector 
            currentLevel={viewLevel} 
            onLevelChange={setViewLevel}
            memberSkillLevels={memberSkillLevels}
          />

          {/* Quick Genre & Global Controls */}
          <GlobalControls 
            genre={currentGenre}
            configs={instrumentConfigs}
            onGlobalChange={applyGlobalChanges}
            viewLevel={viewLevel}
            gameState={gameState}
          />

          {/* Instrument Panel Grid */}
          <InstrumentGrid 
            bandMembers={bandMembers}
            configs={instrumentConfigs}
            viewLevel={viewLevel}
            activeInstrument={activeInstrument}
            onInstrumentSelect={setActiveInstrument}
            onConfigChange={handleConfigChange}
          />

          {/* Advanced Editing Panel */}
          {activeInstrument && viewLevel !== 'basic' && (
            <AdvancedInstrumentEditor 
              instrument={activeInstrument}
              member={bandMembers.find(m => (m.role || m.type) === activeInstrument)}
              config={instrumentConfigs[activeInstrument]}
              viewLevel={viewLevel}
              genre={currentGenre}
              onConfigChange={(config) => {
                handleConfigChange(activeInstrument, config);
              }}
            />
          )}
        </div>

        {/* Preview & Export Controls */}
        <PreviewControls 
          configs={instrumentConfigs}
          onPreview={(playing) => setPreviewPlaying(playing)}
          onExport={exportConfiguration}
          isPlaying={previewPlaying}
        />
      </div>
    </div>
  );
};

export default InstrumentCustomizer;
