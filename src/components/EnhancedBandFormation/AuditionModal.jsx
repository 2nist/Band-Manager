/**
 * AuditionModal - Detailed audition results and hiring
 */

import React from 'react';
import { X, Check, AlertCircle, Music, TrendingUp } from 'lucide-react';
import { EnhancedAvatar } from './EnhancedAvatar.jsx';
import { SkillVisualization } from './SkillVisualization.jsx';

export const AuditionModal = ({
  candidate,
  result,
  onHire,
  onClose
}) => {
  if (!candidate || !result) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#0a0a0a] border-2 border-cyan-500/30 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
          <div className="flex items-center gap-4">
            <EnhancedAvatar
              traits={candidate.appearance}
              expression="focused"
              size="large"
              seed={candidate.appearance?.seed || candidate.id}
            />
            <div>
              <h2 className="text-2xl font-bold text-cyan-400 m-0">
                {candidate.name} - Audition Results
              </h2>
              <p className="text-gray-400 m-0">{candidate.role} • {candidate.background}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Audition Results */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#1a1a1a] p-4 rounded border border-cyan-500/20">
              <div className="text-xs text-gray-400 mb-1">Technical Skill</div>
              <div className="text-2xl font-bold text-cyan-400">{result.technical_skill}</div>
              <div className="text-xs text-gray-500 mt-1">
                {result.technical_skill > 80 ? 'Exceptional' :
                 result.technical_skill > 60 ? 'Solid' : 'Needs work'}
              </div>
            </div>

            <div className="bg-[#1a1a1a] p-4 rounded border border-cyan-500/20">
              <div className="text-xs text-gray-400 mb-1">Chemistry</div>
              <div className="text-2xl font-bold text-green-400">{result.chemistry}</div>
              <div className="text-xs text-gray-500 mt-1">
                {result.chemistry > 75 ? 'Great fit' :
                 result.chemistry > 50 ? 'Neutral' : 'Potential issues'}
              </div>
            </div>

            <div className="bg-[#1a1a1a] p-4 rounded border border-cyan-500/20">
              <div className="text-xs text-gray-400 mb-1">Availability</div>
              <div className="text-2xl font-bold text-yellow-400">
                {Math.round(result.availability * 100)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {candidate.availability}
              </div>
            </div>

            <div className="bg-[#1a1a1a] p-4 rounded border border-cyan-500/20">
              <div className="text-xs text-gray-400 mb-1">Weekly Cost</div>
              <div className="text-2xl font-bold text-green-400">${result.cost}</div>
              <div className="text-xs text-gray-500 mt-1">Negotiated rate</div>
            </div>
          </div>

          {/* Skill Visualization */}
          <div className="bg-[#1a1a1a] p-4 rounded border border-cyan-500/20">
            <SkillVisualization member={candidate} />
          </div>

          {/* Special Traits */}
          {result.special_traits && result.special_traits.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <TrendingUp size={18} />
                Special Abilities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {result.special_traits.map(trait => (
                  <div
                    key={trait.id}
                    className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{trait.icon}</span>
                      <span className="font-semibold text-cyan-400">{trait.name}</span>
                    </div>
                    <p className="text-xs text-gray-400">{trait.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Red Flags */}
          {result.red_flags && result.red_flags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-3 flex items-center gap-2">
                <AlertCircle size={18} />
                Potential Issues
              </h3>
              <div className="space-y-2">
                {result.red_flags.map((flag, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded"
                  >
                    <div className="font-semibold text-red-400 mb-1">{flag.issue}</div>
                    <p className="text-sm text-gray-400">{flag.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audition Notes */}
          {result.audition_notes && result.audition_notes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-cyan-400 mb-3">Audition Notes</h3>
              <div className="bg-gray-900 p-4 rounded border border-gray-700">
                <ul className="space-y-2">
                  {result.audition_notes.map((note, idx) => (
                    <li key={idx} className="text-gray-300 flex items-start gap-2">
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-cyan-500/20 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onHire}
            className="flex-1 px-4 py-2 bg-cyan-500 text-black rounded font-semibold hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"
          >
            <Check size={18} />
            Add to Selected Candidates
          </button>
        </div>
      </div>
    </div>
  );
};
