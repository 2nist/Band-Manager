/**
 * AssemblyPhase - Assemble final band from selected candidates
 */

import React, { useState, useMemo } from 'react';
import { Users, DollarSign, AlertTriangle, Check } from 'lucide-react';
import { EnhancedAvatar } from './EnhancedAvatar.jsx';
import { SkillVisualization } from './SkillVisualization.jsx';

const REQUIRED_ROLES = ['drummer', 'guitarist', 'bassist', 'vocalist'];
const OPTIONAL_ROLES = ['keyboardist', 'lead-guitar', 'rhythm-guitar', 'synth', 'dj'];

export const AssemblyPhase = ({
  candidates,
  onFormBand,
  onBack,
  gameState
}) => {
  const [selectedRoles, setSelectedRoles] = useState({});
  // Use band name from gameState (already set in LandingPage/LogoDesigner)
  const [bandName, setBandName] = useState(gameState?.state?.bandName || '');
  const bandLogo = gameState?.state?.logo || null; // Read-only from gameState

  // Calculate chemistry preview
  const chemistryPreview = useMemo(() => {
    return calculateChemistryPreview(Object.values(selectedRoles));
  }, [selectedRoles]);

  // Calculate total cost
  const totalWeeklyCost = useMemo(() => {
    return Object.values(selectedRoles).reduce((sum, member) => {
      return sum + (member.weeklyCost || 0);
    }, 0);
  }, [selectedRoles]);

  const handleRoleChange = (role, candidate) => {
    setSelectedRoles(prev => ({
      ...prev,
      [role]: candidate
    }));
  };

  const handleRemoveRole = (role) => {
    setSelectedRoles(prev => {
      const updated = { ...prev };
      delete updated[role];
      return updated;
    });
  };

  const handleFormBand = () => {
    const band = Object.values(selectedRoles);
    if (band.length < 2) {
      alert('Select at least 2 members to form a band');
      return;
    }
    onFormBand(band, bandName || 'Untitled Band', bandLogo);
  };

  const canFormBand = Object.keys(selectedRoles).length >= 2;

  return (
    <div className="assembly-phase space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-cyan-400 mb-2">Assemble Your Band</h2>
        <p className="text-gray-400">
          Choose your final lineup from auditioned musicians. Consider chemistry and budget.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Role Assignment */}
        <div className="lg:col-span-2 space-y-4">
          {/* Required Roles */}
          <div>
            <h3 className="text-lg font-semibold text-cyan-400 mb-3">Required Roles</h3>
            <div className="space-y-3">
              {REQUIRED_ROLES.map(role => (
                <RoleSlot
                  key={role}
                  role={role}
                  candidate={selectedRoles[role]}
                  candidates={candidates}
                  onSelect={(candidate) => handleRoleChange(role, candidate)}
                  onRemove={() => handleRemoveRole(role)}
                />
              ))}
            </div>
          </div>

          {/* Optional Roles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-400 mb-3">Optional Roles</h3>
            <div className="space-y-3">
              {OPTIONAL_ROLES.map(role => (
                <RoleSlot
                  key={role}
                  role={role}
                  candidate={selectedRoles[role]}
                  candidates={candidates}
                  onSelect={(candidate) => handleRoleChange(role, candidate)}
                  onRemove={() => handleRemoveRole(role)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Band Identity & Summary */}
        <div className="space-y-4">
          {/* Band Name Display (read-only if already set) */}
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-cyan-500/20">
            <label className="block text-sm font-semibold text-cyan-400 mb-2">Band Name</label>
            {bandName ? (
              <div className="px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-300 font-semibold">
                {bandName}
              </div>
            ) : (
              <input
                type="text"
                value={bandName}
                onChange={(e) => setBandName(e.target.value)}
                placeholder="Enter band name..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
              />
            )}
            {bandName && (
              <p className="text-xs text-gray-500 mt-1">Set during game setup</p>
            )}
          </div>
          
          {/* Logo Display */}
          {bandLogo && (
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-cyan-500/20">
              <label className="block text-sm font-semibold text-cyan-400 mb-2">Band Logo</label>
              <div
                style={bandLogo.style || {}}
                className="text-center py-3 rounded bg-gray-800"
              >
                {bandName}
              </div>
            </div>
          )}

          {/* Chemistry Preview */}
          {Object.keys(selectedRoles).length > 1 && (
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-cyan-500/20">
              <h4 className="text-sm font-semibold text-cyan-400 mb-3">Band Chemistry</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Overall Chemistry</span>
                  <span className={`text-sm font-bold ${
                    chemistryPreview.overall > 75 ? 'text-green-400' :
                    chemistryPreview.overall > 50 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {Math.round(chemistryPreview.overall)}%
                  </span>
                </div>
                {chemistryPreview.issues.length > 0 && (
                  <div className="mt-3 p-2 bg-red-500/10 border border-red-500/30 rounded">
                    <div className="flex items-center gap-1 text-xs text-red-400 mb-1">
                      <AlertTriangle size={12} />
                      <span>Potential Issues</span>
                    </div>
                    {chemistryPreview.issues.slice(0, 2).map((issue, idx) => (
                      <div key={idx} className="text-xs text-red-300">• {issue}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Budget Summary */}
          <div className="bg-[#1a1a1a] p-4 rounded-lg border border-cyan-500/20">
            <h4 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
              <DollarSign size={16} />
              Budget Summary
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Weekly Cost</span>
                <span className="text-cyan-400 font-semibold">${totalWeeklyCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Monthly Cost</span>
                <span className="text-gray-300">${totalWeeklyCost * 4}</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-400">Available Budget</span>
                  <span className="text-green-400">${gameState?.state?.money || 0}</span>
                </div>
                {totalWeeklyCost > (gameState?.state?.money || 0) && (
                  <div className="text-xs text-red-400 mt-2">
                    ⚠️ Weekly cost exceeds available budget
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selected Members Preview */}
          {Object.keys(selectedRoles).length > 0 && (
            <div className="bg-[#1a1a1a] p-4 rounded-lg border border-cyan-500/20">
              <h4 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <Users size={16} />
                Selected Members ({Object.keys(selectedRoles).length})
              </h4>
              <div className="space-y-2">
                {Object.entries(selectedRoles).map(([role, member]) => (
                  <div key={role} className="flex items-center gap-2 text-xs">
                    <EnhancedAvatar traits={member.appearance} size="small" />
                    <div className="flex-1">
                      <div className="text-cyan-400 font-medium">{member.name}</div>
                      <div className="text-gray-500">{role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-6 border-t border-cyan-500/20">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back to Auditions
        </button>
        <button
          onClick={handleFormBand}
          disabled={!canFormBand}
          className={`
            px-8 py-3 rounded-lg font-semibold text-lg transition-all flex items-center gap-2
            ${canFormBand
              ? 'bg-cyan-500 text-black hover:bg-cyan-400'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <Check size={20} />
          Form Band
        </button>
      </div>
    </div>
  );
};

/**
 * Role Slot Component
 */
const RoleSlot = ({ role, candidate, candidates, onSelect, onRemove }) => {
  const availableCandidates = candidates.filter(c => 
    !candidate || c.id !== candidate.id
  );

  return (
    <div className="bg-[#1a1a1a] border-2 border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-cyan-400 font-semibold capitalize">{role.replace('-', ' ')}</h4>
        {candidate && (
          <button
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 text-xs"
          >
            Remove
          </button>
        )}
      </div>

      {candidate ? (
        <div className="flex items-center gap-3">
          <EnhancedAvatar 
            traits={candidate.appearance} 
            size="medium"
            seed={candidate.appearance?.seed || candidate.id}
          />
          <div className="flex-1">
            <div className="text-cyan-400 font-semibold">{candidate.name}</div>
            <div className="text-xs text-gray-400">
              Skill: {candidate.skill} • ${candidate.weeklyCost}/week
            </div>
          </div>
        </div>
      ) : (
        <select
          onChange={(e) => {
            const selected = candidates.find(c => c.id === e.target.value);
            if (selected) onSelect(selected);
          }}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-300 focus:outline-none focus:border-cyan-500"
          defaultValue=""
        >
          <option value="">Select {role}...</option>
          {availableCandidates.map(c => (
            <option key={c.id} value={c.id}>
              {c.name} (Skill: {c.skill}, ${c.weeklyCost}/week)
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

/**
 * Calculate chemistry preview
 */
function calculateChemistryPreview(band) {
  if (band.length < 2) {
    return { overall: 70, issues: [] };
  }

  let totalChemistry = 0;
  let count = 0;
  const issues = [];

  for (let i = 0; i < band.length; i++) {
    for (let j = i + 1; j < band.length; j++) {
      const member1 = band[i];
      const member2 = band[j];
      
      let pairChemistry = 70;
      
      // Personality match
      if (member1.personality?.primary === member2.personality?.primary) {
        pairChemistry += 15;
      } else if (member1.personality?.primary === 'rebellious' && member2.personality?.primary === 'traditional') {
        pairChemistry -= 20;
        issues.push(`${member1.name} and ${member2.name} have conflicting personalities`);
      }
      
      // Skill balance
      const skillDiff = Math.abs(member1.skill - member2.skill);
      if (skillDiff > 40) {
        pairChemistry -= 10;
        issues.push(`Large skill gap between ${member1.name} and ${member2.name}`);
      }
      
      // Drama check
      if ((member1.drama || 0) > 70 && (member2.drama || 0) > 70) {
        pairChemistry -= 15;
        issues.push(`Both ${member1.name} and ${member2.name} have high drama`);
      }
      
      totalChemistry += pairChemistry;
      count++;
    }
  }

  const overall = count > 0 ? totalChemistry / count : 70;

  return {
    overall: Math.max(0, Math.min(100, overall)),
    issues: issues.slice(0, 3)
  };
}
