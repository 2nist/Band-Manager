/**
 * AuditionPhase - Browse and audition musicians from various sources
 */

import React, { useState, useMemo } from 'react';
import { Search, Filter, SortAsc, Users, DollarSign, Clock } from 'lucide-react';
import { AUDITION_SOURCES, conductAudition } from '../../utils/proceduralMusicianGenerator.js';
import { EnhancedAvatar } from './EnhancedAvatar.jsx';
import { SkillVisualization } from './SkillVisualization.jsx';
import { MusicianCard } from './MusicianCard.jsx';
import { AuditionModal } from './AuditionModal.jsx';

export const AuditionPhase = ({
  pool,
  selectedCandidates,
  onSelect,
  onRemove,
  onComplete,
  gameState
}) => {
  const [selectedCategory, setSelectedCategory] = useState('local_scene');
  const [sortBy, setSortBy] = useState('skill');
  const [filterBy, setFilterBy] = useState({ minSkill: 0, maxCost: 1000 });
  const [searchQuery, setSearchQuery] = useState('');
  const [auditioningCandidate, setAuditioningCandidate] = useState(null);
  const [auditionResult, setAuditionResult] = useState(null);

  const currentPool = pool[selectedCategory] || [];

  // Filter and sort musicians
  const filteredMusicians = useMemo(() => {
    let filtered = currentPool.filter(musician => {
      // Skill filter
      if (musician.skill < filterBy.minSkill) return false;
      
      // Cost filter
      if (musician.weeklyCost > filterBy.maxCost) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = musician.name.toLowerCase().includes(query);
        const matchesRole = musician.role.toLowerCase().includes(query);
        const matchesBackground = musician.background?.toLowerCase().includes(query);
        if (!matchesName && !matchesRole && !matchesBackground) return false;
      }
      
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'skill':
          return b.skill - a.skill;
        case 'cost':
          return a.weeklyCost - b.weeklyCost;
        case 'creativity':
          return b.creativity - a.creativity;
        case 'reliability':
          return b.reliability - a.reliability;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [currentPool, filterBy, searchQuery, sortBy]);

  const handleAudition = (candidate) => {
    const currentBand = gameState?.state?.bandMembers || [];
    const result = conductAudition(candidate, candidate.role, currentBand);
    setAuditionResult(result);
    setAuditioningCandidate(candidate);
  };

  const handleHireFromAudition = () => {
    if (auditionResult) {
      onSelect(auditionResult.candidate);
      setAuditioningCandidate(null);
      setAuditionResult(null);
    }
  };

  const budget = gameState?.state?.money || 1000;
  const selectedCount = selectedCandidates.length;

  return (
    <div className="audition-phase space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-cyan-400 mb-2">Find Your Band Members</h2>
        <p className="text-gray-400">
          Browse available musicians and hold auditions. Different sources have different costs and qualities.
        </p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm">
          <span className="text-gray-300">
            Selected: <span className="text-cyan-400 font-bold">{selectedCount}</span> candidates
          </span>
          <span className="text-gray-300">
            Budget: <span className="text-green-400">${budget}</span>
          </span>
        </div>
      </div>

      {/* Source Categories */}
      <div className="category-selector">
        <h3 className="text-lg font-semibold text-cyan-400 mb-3">Audition Sources</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(AUDITION_SOURCES).map(([key, source]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`
                p-4 rounded-lg border-2 transition-all text-left
                ${selectedCategory === key
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                  : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-cyan-500/50'
                }
              `}
            >
              <div className="font-semibold mb-1">{source.name}</div>
              <div className="text-xs text-gray-400">{source.description}</div>
              <div className="text-xs mt-2 text-gray-500">
                ${source.costRange[0]}-${source.costRange[1]}/week • {source.count} available
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section bg-[#1a1a1a] p-4 rounded-lg border border-cyan-500/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, role, or background..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-300 placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Skill Filter */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Min Skill</label>
            <input
              type="range"
              min="0"
              max="100"
              value={filterBy.minSkill}
              onChange={(e) => setFilterBy(prev => ({ ...prev, minSkill: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{filterBy.minSkill}+</div>
          </div>

          {/* Cost Filter */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Max Cost/Week</label>
            <input
              type="range"
              min="0"
              max="200"
              value={filterBy.maxCost}
              onChange={(e) => setFilterBy(prev => ({ ...prev, maxCost: parseInt(e.target.value) }))}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">${filterBy.maxCost}</div>
          </div>
        </div>

        {/* Sort */}
        <div className="mt-4 flex items-center gap-2">
          <SortAsc size={16} className="text-gray-400" />
          <span className="text-sm text-gray-400">Sort by:</span>
          {['skill', 'cost', 'creativity', 'reliability', 'name'].map(option => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`
                px-3 py-1 rounded text-xs transition-colors
                ${sortBy === option
                  ? 'bg-cyan-500 text-black font-semibold'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Musician Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-cyan-400">
            {AUDITION_SOURCES[selectedCategory]?.name} ({filteredMusicians.length} available)
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMusicians.map(musician => (
            <MusicianCard
              key={musician.id}
              musician={musician}
              isSelected={selectedCandidates.some(c => c.id === musician.id)}
              onAudition={() => handleAudition(musician)}
              onSelect={() => onSelect(musician)}
              onRemove={() => onRemove(musician.id)}
            />
          ))}
        </div>
        {filteredMusicians.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p>No musicians found matching your criteria.</p>
            <p className="text-sm mt-2">Try adjusting your filters.</p>
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div className="flex justify-center pt-6 border-t border-cyan-500/20">
        <button
          onClick={onComplete}
          disabled={selectedCount < 2}
          className={`
            px-8 py-3 rounded-lg font-semibold text-lg transition-all
            ${selectedCount >= 2
              ? 'bg-cyan-500 text-black hover:bg-cyan-400'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Continue to Assembly ({selectedCount}/2+ selected)
        </button>
      </div>

      {/* Audition Modal */}
      {auditioningCandidate && auditionResult && (
        <AuditionModal
          candidate={auditioningCandidate}
          result={auditionResult}
          onHire={handleHireFromAudition}
          onClose={() => {
            setAuditioningCandidate(null);
            setAuditionResult(null);
          }}
        />
      )}
    </div>
  );
};
