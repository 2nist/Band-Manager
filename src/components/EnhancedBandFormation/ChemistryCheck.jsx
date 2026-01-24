/**
 * ChemistryCheck - Visualize band chemistry and relationships
 */

import React, { useState, useEffect } from 'react';
import { Users, AlertTriangle, Check, ArrowLeft } from 'lucide-react';
import { EnhancedAvatar } from './EnhancedAvatar.jsx';

export const ChemistryCheck = ({
  band,
  bandName,
  onComplete,
  onBack
}) => {
  const [chemistryResults, setChemistryResults] = useState(null);

  useEffect(() => {
    if (band && band.length > 0) {
      const results = calculateBandChemistry(band);
      setChemistryResults(results);
    }
  }, [band]);

  if (!chemistryResults) {
    return <div className="text-center py-12 text-gray-400">Calculating chemistry...</div>;
  }

  return (
    <div className="chemistry-check space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-cyan-400 mb-2">Band Chemistry Assessment</h2>
        <p className="text-gray-400">
          See how well your chosen members work together.
        </p>
        {bandName && (
          <p className="text-lg text-cyan-300 mt-2 font-semibold">{bandName}</p>
        )}
      </div>

      {/* Overall Chemistry Score */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-cyan-500/20 text-center">
        <div className="text-5xl font-bold mb-2" style={{
          color: chemistryResults.overall > 75 ? '#0f0' :
                 chemistryResults.overall > 50 ? '#0ff' :
                 '#f00'
        }}>
          {Math.round(chemistryResults.overall)}%
        </div>
        <div className="text-gray-400">
          {chemistryResults.overall > 75 ? 'Excellent Chemistry' :
           chemistryResults.overall > 50 ? 'Good Chemistry' :
           'Potential Issues'}
        </div>
      </div>

      {/* Chemistry Web Visualization */}
      <div className="bg-[#1a1a1a] p-6 rounded-lg border border-cyan-500/20">
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Member Relationships</h3>
        <ChemistryWeb
          members={band}
          relationships={chemistryResults.relationships}
        />
      </div>

      {/* Individual Assessments */}
      <div>
        <h3 className="text-lg font-semibold text-cyan-400 mb-4">Individual Assessments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {band.map(member => (
            <MemberAssessment
              key={member.id}
              member={member}
              chemistryData={chemistryResults.individual[member.id]}
            />
          ))}
        </div>
      </div>

      {/* Potential Issues */}
      {chemistryResults.potentialIssues.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={20} className="text-red-400" />
            <h3 className="text-lg font-semibold text-red-400">Potential Issues</h3>
          </div>
          <ul className="space-y-2">
            {chemistryResults.potentialIssues.map((issue, idx) => (
              <li key={idx} className="text-gray-300 flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Strengths */}
      {chemistryResults.strengths.length > 0 && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Check size={20} className="text-green-400" />
            <h3 className="text-lg font-semibold text-green-400">Band Strengths</h3>
          </div>
          <ul className="space-y-2">
            {chemistryResults.strengths.map((strength, idx) => (
              <li key={idx} className="text-gray-300 flex items-start gap-2">
                <span className="text-green-400 mt-1">•</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-between pt-6 border-t border-cyan-500/20">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Reassemble Band
        </button>
        <button
          onClick={onComplete}
          className="px-8 py-3 bg-cyan-500 text-black rounded-lg font-semibold hover:bg-cyan-400 transition-colors flex items-center gap-2"
        >
          <Check size={20} />
          Continue to First Rehearsal
        </button>
      </div>
    </div>
  );
};

/**
 * Chemistry Web Visualization
 */
const ChemistryWeb = ({ members, relationships }) => {
  // Simple visualization - can be enhanced with D3 or similar
  return (
    <div className="chemistry-web">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(relationships).map(([pair, chemistry]) => {
          const [id1, id2] = pair.split('-');
          const member1 = members.find(m => m.id === id1);
          const member2 = members.find(m => m.id === id2);
          
          if (!member1 || !member2) return null;
          
          return (
            <div
              key={pair}
              className="bg-gray-900 p-3 rounded border border-gray-700"
            >
              <div className="flex items-center gap-2 mb-2">
                <EnhancedAvatar traits={member1.appearance} size="small" />
                <span className="text-gray-400">↔</span>
                <EnhancedAvatar traits={member2.appearance} size="small" />
              </div>
              <div className="text-center">
                <div className={`text-lg font-bold ${
                  chemistry > 75 ? 'text-green-400' :
                  chemistry > 50 ? 'text-cyan-400' :
                  'text-red-400'
                }`}>
                  {Math.round(chemistry)}%
                </div>
                <div className="text-xs text-gray-500">
                  {member1.firstName || member1.name} & {member2.firstName || member2.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Member Assessment
 */
const MemberAssessment = ({ member, chemistryData }) => {
  return (
    <div className="bg-[#1a1a1a] p-4 rounded-lg border border-cyan-500/20">
      <div className="flex items-center gap-3 mb-3">
        <EnhancedAvatar 
          traits={member.appearance} 
          size="medium"
          seed={member.appearance?.seed || member.id}
        />
        <div>
          <h4 className="text-cyan-400 font-semibold">{member.name}</h4>
          <p className="text-sm text-gray-400">{member.role}</p>
        </div>
      </div>
      {chemistryData && (
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Band Fit</span>
            <span className={`font-semibold ${
              chemistryData.fit > 75 ? 'text-green-400' :
              chemistryData.fit > 50 ? 'text-cyan-400' :
              'text-red-400'
            }`}>
              {Math.round(chemistryData.fit)}%
            </span>
          </div>
          {chemistryData.notes && chemistryData.notes.length > 0 && (
            <div className="text-xs text-gray-500 mt-2">
              {chemistryData.notes[0]}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Calculate band chemistry
 */
function calculateBandChemistry(band) {
  const relationships = {};
  const individual = {};
  const potentialIssues = [];
  const strengths = [];

  // Calculate pair relationships
  for (let i = 0; i < band.length; i++) {
    for (let j = i + 1; j < band.length; j++) {
      const member1 = band[i];
      const member2 = band[j];
      const pairKey = `${member1.id}-${member2.id}`;
      
      let chemistry = 70;
      
      // Personality compatibility
      if (member1.personality?.primary === member2.personality?.primary) {
        chemistry += 15;
        strengths.push(`${member1.name} and ${member2.name} have similar personalities`);
      } else if (
        (member1.personality?.primary === 'rebellious' && member2.personality?.primary === 'traditional') ||
        (member1.personality?.primary === 'traditional' && member2.personality?.primary === 'rebellious')
      ) {
        chemistry -= 25;
        potentialIssues.push(`${member1.name} and ${member2.name} have conflicting personalities`);
      }
      
      // Skill balance
      const skillDiff = Math.abs(member1.skill - member2.skill);
      if (skillDiff > 40) {
        chemistry -= 15;
        potentialIssues.push(`Large skill gap between ${member1.name} and ${member2.name}`);
      } else if (skillDiff < 20) {
        chemistry += 10;
      }
      
      // Drama check
      if ((member1.drama || 0) > 70 && (member2.drama || 0) > 70) {
        chemistry -= 20;
        potentialIssues.push(`Both ${member1.name} and ${member2.name} have high drama levels`);
      }
      
      relationships[pairKey] = Math.max(0, Math.min(100, chemistry));
    }
  }

  // Calculate individual fit
  band.forEach(member => {
    let totalFit = 0;
    let count = 0;
    
    Object.entries(relationships).forEach(([pair, chemistry]) => {
      if (pair.includes(member.id)) {
        totalFit += chemistry;
        count++;
      }
    });
    
    const fit = count > 0 ? totalFit / count : 70;
    individual[member.id] = {
      fit,
      notes: [
        fit > 75 ? 'Great fit with the band' :
        fit > 50 ? 'Decent fit' :
        'May have compatibility issues'
      ]
    };
  });

  // Calculate overall
  const allChemistries = Object.values(relationships);
  const overall = allChemistries.length > 0
    ? allChemistries.reduce((a, b) => a + b, 0) / allChemistries.length
    : 70;

  // Add overall strengths
  if (overall > 75) {
    strengths.push('Strong overall band chemistry');
  }
  if (band.length >= 4) {
    strengths.push('Good band size for dynamics');
  }

  return {
    overall,
    relationships,
    individual,
    potentialIssues: potentialIssues.slice(0, 5),
    strengths: strengths.slice(0, 5)
  };
}
