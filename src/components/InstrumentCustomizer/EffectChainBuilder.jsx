/**
 * EffectChainBuilder - Visual effect chain editor
 */

import React, { useState } from 'react';
import { Plus, X, GripVertical } from 'lucide-react';

const AVAILABLE_EFFECTS = [
  { id: 'reverb', name: 'Reverb', category: 'Spatial', skillRequirement: 0 },
  { id: 'delay', name: 'Delay', category: 'Time', skillRequirement: 20 },
  { id: 'chorus', name: 'Chorus', category: 'Modulation', skillRequirement: 30 },
  { id: 'distortion', name: 'Distortion', category: 'Distortion', skillRequirement: 40 },
  { id: 'compression', name: 'Compression', category: 'Dynamics', skillRequirement: 50 },
  { id: 'filter', name: 'Filter', category: 'EQ', skillRequirement: 0 },
  { id: 'eq', name: 'EQ', category: 'EQ', skillRequirement: 20 },
  { id: 'gate', name: 'Noise Gate', category: 'Dynamics', skillRequirement: 30 }
];

export const EffectChainBuilder = ({ effects = [], memberSkill = 50, onChange }) => {
  const [draggedEffect, setDraggedEffect] = useState(null);

  const getAvailableEffects = () => {
    return AVAILABLE_EFFECTS.filter(effect => 
      !effect.skillRequirement || memberSkill >= effect.skillRequirement
    );
  };

  const addEffect = (effectId) => {
    if (!effects.includes(effectId)) {
      onChange([...effects, effectId]);
    }
  };

  const removeEffect = (index) => {
    onChange(effects.filter((_, i) => i !== index));
  };

  const reorderEffects = (fromIndex, toIndex) => {
    const newEffects = [...effects];
    const [removed] = newEffects.splice(fromIndex, 1);
    newEffects.splice(toIndex, 0, removed);
    onChange(newEffects);
  };

  const availableEffects = getAvailableEffects();
  const effectsByCategory = availableEffects.reduce((acc, effect) => {
    if (!acc[effect.category]) acc[effect.category] = [];
    acc[effect.category].push(effect);
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      <label className="block text-xs text-gray-300">Effects Chain</label>
      
      {/* Current Chain */}
      <div className="flex items-center gap-2 flex-wrap min-h-[40px] p-2 bg-gray-900 rounded border border-gray-700">
        {effects.length === 0 ? (
          <span className="text-xs text-gray-500 italic">No effects</span>
        ) : (
          effects.map((effectId, index) => {
            const effect = AVAILABLE_EFFECTS.find(e => e.id === effectId);
            return effect ? (
              <div
                key={index}
                className="flex items-center gap-1 px-2 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-xs text-cyan-400"
              >
                <GripVertical size={12} className="text-gray-400" />
                <span>{effect.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeEffect(index);
                  }}
                  className="ml-1 text-gray-400 hover:text-red-400"
                >
                  <X size={12} />
                </button>
              </div>
            ) : null;
          })
        )}
      </div>

      {/* Available Effects */}
      <div className="space-y-2">
        <label className="block text-xs text-gray-300">Add Effect</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(effectsByCategory).map(([category, categoryEffects]) => (
            <div key={category} className="space-y-1">
              <div className="text-xs text-gray-400 font-medium">{category}</div>
              <div className="flex flex-wrap gap-1">
                {categoryEffects.map(effect => (
                  <button
                    key={effect.id}
                    onClick={() => addEffect(effect.id)}
                    disabled={effects.includes(effect.id)}
                    className={`
                      px-2 py-1 text-xs rounded border transition-colors
                      ${effects.includes(effect.id)
                        ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                        : 'bg-gray-800 border-gray-600 text-gray-300 hover:border-cyan-500/50 hover:text-cyan-400'
                      }
                    `}
                  >
                    <Plus size={10} className="inline mr-1" />
                    {effect.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
