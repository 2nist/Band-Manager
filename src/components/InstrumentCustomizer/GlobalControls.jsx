/**
 * GlobalControls - Genre and global settings
 */

import React from 'react';
import { Globe, Volume2 } from 'lucide-react';

export const GlobalControls = ({ 
  genre, 
  configs, 
  onGlobalChange, 
  viewLevel,
  gameState 
}) => {
  if (viewLevel === 'basic') {
    return (
      <div className="mb-6 p-4 bg-[#1a1a1a] border border-cyan-500/20 rounded-lg">
        <div className="flex items-center gap-2 mb-3">
          <Globe size={18} className="text-cyan-400" />
          <h3 className="text-lg font-semibold text-cyan-400 m-0">Global Settings</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Current Genre</label>
            <div className="px-3 py-2 bg-gray-800 rounded border border-gray-700 text-cyan-400 font-semibold">
              {genre}
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Overall Intensity</label>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="70"
              className="w-full"
              onChange={(e) => {
                // Apply intensity to all instruments
                const intensity = parseInt(e.target.value) / 100;
                const changes = {};
                Object.keys(configs).forEach(role => {
                  changes[role] = {
                    ...configs[role],
                    intensity
                  };
                });
                onGlobalChange(changes);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 bg-[#1a1a1a] border border-cyan-500/20 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <Globe size={18} className="text-cyan-400" />
        <h3 className="text-lg font-semibold text-cyan-400 m-0">Global Settings</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">Genre</label>
          <div className="px-3 py-2 bg-gray-800 rounded border border-gray-700 text-cyan-400 font-semibold">
            {genre}
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Master Volume</label>
          <div className="flex items-center gap-2">
            <Volume2 size={16} className="text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="80"
              className="flex-1"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Studio Quality</label>
          <div className="px-3 py-2 bg-gray-800 rounded border border-gray-700 text-gray-300">
            Tier {gameState.studioTier || 0}
          </div>
        </div>
      </div>
    </div>
  );
};
