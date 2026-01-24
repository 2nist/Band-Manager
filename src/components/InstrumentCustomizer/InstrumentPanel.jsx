/**
 * InstrumentPanel - Individual instrument customization panel
 */

import React, { useState } from 'react';
import { ChevronRight, Play } from 'lucide-react';
import { BasicInstrumentControls } from './BasicInstrumentControls.jsx';
import { IntermediateControls } from './IntermediateControls.jsx';
import { AdvancedControls } from './AdvancedControls.jsx';

export const InstrumentPanel = ({
  member,
  config,
  viewLevel,
  isActive,
  onSelect,
  onConfigChange,
  roleIcon = '🎵'
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const role = member.role || member.type || member.instrument;
  const memberName = member.firstName || member.name || 'Member';
  const skill = member.skill || 50;

  const handleConfigUpdate = (updates) => {
    onConfigChange({
      ...config,
      ...updates
    });
  };

  return (
    <div
      className={`
        bg-[#1a1a1a] border-2 rounded-lg p-4 transition-all cursor-pointer
        ${isActive 
          ? 'border-cyan-500 bg-cyan-500/10' 
          : 'border-gray-700 hover:border-cyan-500/50'
        }
      `}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{roleIcon}</span>
          <div>
            <h4 className="text-cyan-400 font-semibold m-0 text-sm">{memberName}</h4>
            <p className="text-xs text-gray-400 m-0">
              {role} • Skill: {skill}
            </p>
          </div>
        </div>
        <ChevronRight 
          size={20} 
          className={`text-gray-400 transition-transform ${isActive ? 'rotate-90' : ''}`}
        />
      </div>

      {/* Basic Controls (Always Visible) */}
      <BasicInstrumentControls
        member={member}
        config={config}
        onChange={handleConfigUpdate}
      />

      {/* Progressive Disclosure Based on View Level */}
      {isActive && viewLevel === 'intermediate' && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <IntermediateControls
            member={member}
            config={config}
            onChange={handleConfigUpdate}
          />
        </div>
      )}

      {isActive && viewLevel === 'advanced' && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <AdvancedControls
            member={member}
            config={config}
            onChange={handleConfigUpdate}
          />
        </div>
      )}

      {/* Quick Preview Button */}
      {isActive && (
        <button
          className="mt-3 w-full px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded text-cyan-400 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          onClick={(e) => {
            e.stopPropagation();
            // Preview functionality would go here
          }}
        >
          <Play size={14} />
          Preview
        </button>
      )}
    </div>
  );
};
