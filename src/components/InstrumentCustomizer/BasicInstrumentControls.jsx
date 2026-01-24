/**
 * BasicInstrumentControls - Essential controls visible at all view levels
 */

import React from 'react';
import { Volume2, Zap } from 'lucide-react';

export const BasicInstrumentControls = ({ member, config, onChange }) => {
  const volume = config.volume !== undefined ? config.volume : 0.8;
  const intensity = config.intensity !== undefined ? config.intensity : 0.7;

  return (
    <div className="space-y-3">
      {/* Volume Control */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-gray-300 flex items-center gap-1">
            <Volume2 size={12} />
            Volume
          </label>
          <span className="text-xs text-cyan-400">{Math.round(volume * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onChange({ volume: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Intensity Control */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-gray-300 flex items-center gap-1">
            <Zap size={12} />
            Intensity
          </label>
          <span className="text-xs text-cyan-400">{Math.round(intensity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={intensity}
          onChange={(e) => onChange({ intensity: parseFloat(e.target.value) })}
          className="w-full"
        />
      </div>

      {/* Skill Indicator */}
      <div className="pt-2 border-t border-gray-700">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">Performance Quality</span>
          <span className={`font-semibold ${
            (member.skill || 50) >= 70 ? 'text-green-400' :
            (member.skill || 50) >= 50 ? 'text-yellow-400' :
            'text-red-400'
          }`}>
            {Math.round(
              ((member.skill || 50) * 0.4 + 
               (member.reliability || 50) * 0.3 + 
               (member.morale || 50) * 0.3)
            )}%
          </span>
        </div>
      </div>
    </div>
  );
};
