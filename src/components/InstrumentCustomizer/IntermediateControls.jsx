/**
 * IntermediateControls - Tone shaping controls
 */

import React from 'react';
import { Sliders } from 'lucide-react';

export const IntermediateControls = ({ member, config, onChange }) => {
  const role = member.role || member.type;
  const synthesis = config.synthesis || {};
  const effects = config.effects || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Sliders size={16} className="text-cyan-400" />
        <h5 className="text-sm font-semibold text-cyan-400 m-0">Tone Controls</h5>
      </div>

      {/* Tone Type */}
      {role === 'guitar' || role === 'lead-guitar' || role === 'rhythm-guitar' && (
        <div>
          <label className="block text-xs text-gray-300 mb-1">Tone</label>
          <select
            value={synthesis.oscillator?.type || 'sawtooth'}
            onChange={(e) => onChange({
              synthesis: {
                ...synthesis,
                oscillator: {
                  ...synthesis.oscillator,
                  type: e.target.value
                }
              }
            })}
            className="w-full px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-gray-300"
          >
            <option value="sawtooth">Sawtooth</option>
            <option value="square">Square</option>
            <option value="triangle">Triangle</option>
            <option value="sine">Sine</option>
            {member.skill > 70 && (
              <>
                <option value="fatsawtooth">Fat Sawtooth</option>
                <option value="fmtriangle">FM Triangle</option>
              </>
            )}
          </select>
        </div>
      )}

      {/* Filter Controls */}
      <div>
        <label className="block text-xs text-gray-300 mb-1">
          Filter Frequency
        </label>
        <input
          type="range"
          min="200"
          max="20000"
          step="100"
          value={synthesis.filter?.frequency || 8000}
          onChange={(e) => onChange({
            synthesis: {
              ...synthesis,
              filter: {
                ...synthesis.filter,
                frequency: parseInt(e.target.value)
              }
            }
          })}
          className="w-full"
        />
        <div className="text-xs text-gray-400 mt-1">
          {synthesis.filter?.frequency || 8000} Hz
        </div>
      </div>

      {/* Active Effects */}
      {effects.length > 0 && (
        <div>
          <label className="block text-xs text-gray-300 mb-2">Active Effects</label>
          <div className="flex flex-wrap gap-2">
            {effects.map((effect, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-xs text-cyan-400"
              >
                {effect}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
