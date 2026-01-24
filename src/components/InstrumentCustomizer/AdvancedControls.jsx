/**
 * AdvancedControls - Full synthesis and effects chain controls
 */

import React from 'react';
import { Settings2 } from 'lucide-react';
import { EffectChainBuilder } from './EffectChainBuilder.jsx';

export const AdvancedControls = ({ member, config, onChange }) => {
  const synthesis = config.synthesis || {};
  const effects = config.effects || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Settings2 size={16} className="text-cyan-400" />
        <h5 className="text-sm font-semibold text-cyan-400 m-0">Advanced Controls</h5>
      </div>

      {/* Envelope Controls */}
      <div className="space-y-2">
        <label className="block text-xs text-gray-300">Envelope</label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-gray-400">Attack</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={synthesis.envelope?.attack || 0.01}
              onChange={(e) => onChange({
                synthesis: {
                  ...synthesis,
                  envelope: {
                    ...synthesis.envelope,
                    attack: parseFloat(e.target.value)
                  }
                }
              })}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400">Release</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.01"
              value={synthesis.envelope?.release || 0.5}
              onChange={(e) => onChange({
                synthesis: {
                  ...synthesis,
                  envelope: {
                    ...synthesis.envelope,
                    release: parseFloat(e.target.value)
                  }
                }
              })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Effect Chain Builder */}
      <EffectChainBuilder
        effects={effects}
        memberSkill={member.skill || 50}
        onChange={(newEffects) => onChange({ effects: newEffects })}
      />
    </div>
  );
};
