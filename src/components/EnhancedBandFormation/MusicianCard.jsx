/**
 * MusicianCard - Individual musician card in audition grid
 */

import React from 'react';
import { Check, X, Music, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { EnhancedAvatar } from './EnhancedAvatar.jsx';

export const MusicianCard = ({
  musician,
  isSelected,
  onAudition,
  onSelect,
  onRemove
}) => {
  const role = musician.role || musician.primaryInstrument;
  const name = musician.name || musician.firstName || 'Unknown';
  const skill = musician.skill || 50;
  const cost = musician.weeklyCost || 50;

  return (
    <div
      className={`
        bg-[#1a1a1a] border-2 rounded-lg p-4 transition-all
        ${isSelected
          ? 'border-cyan-500 bg-cyan-500/10'
          : 'border-gray-700 hover:border-cyan-500/50'
        }
      `}
    >
      {/* Header with Avatar */}
      <div className="flex items-start gap-4 mb-3">
        <div className="flex-shrink-0">
          <EnhancedAvatar
            traits={musician.appearance}
            expression={musician.personality?.primary || 'neutral'}
            size="medium"
            seed={musician.appearance?.seed || musician.id}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-cyan-400 font-semibold text-lg mb-1 truncate">{name}</h3>
          <p className="text-sm text-gray-400 mb-2">
            {role} • {musician.experience || 0} years
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <DollarSign size={12} />
              ${cost}/week
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {musician.availability || 'Available'}
            </span>
          </div>
        </div>
        {isSelected && (
          <div className="flex-shrink-0">
            <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center">
              <Check size={14} className="text-black" />
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Skill</div>
          <div className={`text-sm font-bold ${
            skill >= 70 ? 'text-green-400' :
            skill >= 50 ? 'text-cyan-400' :
            'text-yellow-400'
          }`}>
            {skill}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Creativity</div>
          <div className="text-sm font-bold text-cyan-400">
            {musician.creativity || 50}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-400 mb-1">Reliability</div>
          <div className="text-sm font-bold text-cyan-400">
            {musician.reliability || 50}
          </div>
        </div>
      </div>

      {/* Background */}
      {musician.background && (
        <div className="mb-3">
          <p className="text-xs text-gray-500 italic line-clamp-2">
            {musician.background}
          </p>
        </div>
      )}

      {/* Special Traits */}
      {musician.specialTraits && musician.specialTraits.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {musician.specialTraits.slice(0, 3).map(trait => (
            <span
              key={trait.id}
              className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-xs text-cyan-400"
            >
              {trait.icon} {trait.name}
            </span>
          ))}
        </div>
      )}

      {/* Red Flags */}
      {musician.redFlags && musician.redFlags.length > 0 && (
        <div className="mb-3 p-2 bg-red-500/10 border border-red-500/30 rounded">
          <div className="flex items-center gap-1 text-xs text-red-400 mb-1">
            <AlertTriangle size={12} />
            <span className="font-semibold">Potential Issues</span>
          </div>
          {musician.redFlags.slice(0, 2).map((flag, idx) => (
            <div key={idx} className="text-xs text-red-300">
              • {flag.issue}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {isSelected ? (
          <button
            onClick={() => onRemove(musician.id)}
            className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded text-red-400 text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <X size={14} />
            Remove
          </button>
        ) : (
          <>
            <button
              onClick={onAudition}
              className="flex-1 px-3 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 rounded text-cyan-400 text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Music size={14} />
              Audition
            </button>
            <button
              onClick={onSelect}
              className="flex-1 px-3 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/50 rounded text-green-400 text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Check size={14} />
              Select
            </button>
          </>
        )}
      </div>
    </div>
  );
};
