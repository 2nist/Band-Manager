/**
 * InstrumentGrid - Grid of instrument panels
 */

import React from 'react';
import { InstrumentPanel } from './InstrumentPanel.jsx';

const ROLE_ICONS = {
  guitar: '🎸',
  'lead-guitar': '🎸',
  'rhythm-guitar': '🎸',
  drums: '🥁',
  drummer: '🥁',
  bass: '🎸',
  bassist: '🎸',
  keyboard: '🎹',
  keyboardist: '🎹',
  synth: '🎹',
  vocals: '🎤',
  vocalist: '🎤'
};

export const InstrumentGrid = ({
  bandMembers,
  configs,
  viewLevel,
  activeInstrument,
  onInstrumentSelect,
  onConfigChange
}) => {
  if (!bandMembers || bandMembers.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>No band members available. Add members to customize instruments.</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-cyan-400 mb-4">Instruments</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {bandMembers.map((member) => {
          const role = member.role || member.type || member.instrument;
          const config = configs[role] || {};
          
          return (
            <InstrumentPanel
              key={member.id || role}
              member={member}
              config={config}
              viewLevel={viewLevel}
              isActive={activeInstrument === role}
              onSelect={() => onInstrumentSelect(role)}
              onConfigChange={(newConfig) => onConfigChange(role, newConfig)}
              roleIcon={ROLE_ICONS[role] || '🎵'}
            />
          );
        })}
      </div>
    </div>
  );
};
