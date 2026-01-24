/**
 * ViewLevelSelector - Progressive disclosure level selector
 */

import React from 'react';

const VIEW_LEVELS = [
  {
    id: 'basic',
    name: 'Quick Setup',
    description: 'Genre and intensity only',
    icon: '🎯',
    skillRequirement: 0
  },
  {
    id: 'intermediate', 
    name: 'Tone Control',
    description: 'Per-instrument tone shaping',
    icon: '🎛️',
    skillRequirement: 30
  },
  {
    id: 'advanced',
    name: 'Full Studio',
    description: 'Effects chains and synthesis',
    icon: '🎚️',
    skillRequirement: 60
  },
  {
    id: 'expert',
    name: 'Sound Design',
    description: 'Raw parameter control',
    icon: '⚡',
    skillRequirement: 80
  }
];

export const ViewLevelSelector = ({ currentLevel, onLevelChange, memberSkillLevels }) => {
  const getUnlockedLevels = () => {
    return VIEW_LEVELS.map(level => ({
      ...level,
      unlocked: level.skillRequirement === 0 || 
                (level.skillRequirement <= 30 && memberSkillLevels.average >= 30) ||
                (level.skillRequirement <= 60 && memberSkillLevels.average >= 60) ||
                (level.skillRequirement <= 80 && memberSkillLevels.highest >= 80)
    }));
  };

  const levels = getUnlockedLevels();
  const currentLevelInfo = levels.find(l => l.id === currentLevel);

  return (
    <div className="mb-6 p-4 bg-[#1a1a1a] border border-cyan-500/20 rounded-lg">
      <h3 className="text-lg font-semibold text-cyan-400 mb-3">Customization Depth</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        {levels.map(level => (
          <button
            key={level.id}
            className={`
              flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all
              ${currentLevel === level.id 
                ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' 
                : level.unlocked
                  ? 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-cyan-500/50 hover:bg-cyan-500/5'
                  : 'border-gray-800 bg-gray-900/50 text-gray-600 cursor-not-allowed opacity-50'
              }
            `}
            onClick={() => level.unlocked && onLevelChange(level.id)}
            disabled={!level.unlocked}
            title={!level.unlocked ? `Requires avg skill ${level.skillRequirement}` : level.description}
          >
            <span className="text-2xl">{level.icon}</span>
            <span className="text-sm font-medium">{level.name}</span>
            {!level.unlocked && (
              <span className="text-xs text-gray-500">🔒 {level.skillRequirement}</span>
            )}
          </button>
        ))}
      </div>
      {currentLevelInfo && (
        <p className="text-sm text-gray-400 italic">
          {currentLevelInfo.description}
        </p>
      )}
    </div>
  );
};
