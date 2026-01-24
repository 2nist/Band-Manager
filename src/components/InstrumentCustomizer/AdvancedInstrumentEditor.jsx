/**
 * AdvancedInstrumentEditor - Full editor panel for selected instrument
 */

import React from 'react';
import { X } from 'lucide-react';
import { EffectChainBuilder } from './EffectChainBuilder.jsx';

export const AdvancedInstrumentEditor = ({
  instrument,
  member,
  config,
  viewLevel,
  genre,
  onConfigChange
}) => {
  if (!member) return null;

  return (
    <div className="mt-6 p-4 bg-[#1a1a1a] border border-cyan-500/30 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-cyan-400 m-0">
          {member.firstName || member.name} - {instrument}
        </h4>
      </div>

      <div className="space-y-4">
        {/* Synthesis Parameters */}
        {(viewLevel === 'advanced' || viewLevel === 'expert') && (
          <div>
            <h5 className="text-sm font-semibold text-gray-300 mb-2">Synthesis</h5>
            <div className="space-y-2">
              <div>
                <label className="text-xs text-gray-400">Oscillator Type</label>
                <select
                  value={config.synthesis?.oscillator?.type || 'sawtooth'}
                  onChange={(e) => onConfigChange({
                    ...config,
                    synthesis: {
                      ...config.synthesis,
                      oscillator: {
                        ...config.synthesis?.oscillator,
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
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Effect Chain */}
        {(viewLevel === 'advanced' || viewLevel === 'expert') && (
          <div>
            <h5 className="text-sm font-semibold text-gray-300 mb-2">Effects Chain</h5>
            <EffectChainBuilder
              effects={config.effects || []}
              memberSkill={member.skill || 50}
              onChange={(newEffects) => onConfigChange({
                ...config,
                effects: newEffects
              })}
            />
          </div>
        )}

        {/* Performance Settings */}
        {config.performance && (
          <div>
            <h5 className="text-sm font-semibold text-gray-300 mb-2">Performance</h5>
            <div className="space-y-2 text-xs text-gray-400">
              <div>Timing Precision: {Math.round((config.performance.timing?.precision || 0.8) * 100)}%</div>
              <div>Dynamics Range: {Math.round((config.performance.dynamics?.range || 0.7) * 100)}%</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
