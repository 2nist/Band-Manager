/**
 * Skill Visualization - Radar chart and skill breakdown
 * 
 * Visualizes member skills using a custom radar chart (no external dependencies)
 */

import React from 'react';
import { TrendingUp } from 'lucide-react';

export const SkillVisualization = ({ member }) => {
  if (!member) return null;

  const skills = {
    'Technical Skill': member.skill || 50,
    'Creativity': member.creativity || 50,
    'Stage Presence': member.stagePresence || 50,
    'Reliability': member.reliability || 50,
    'Teamwork': member.teamwork || 50,
    'Experience': (member.experience || 0) * 5 // Convert years to 0-100 scale
  };

  return (
    <div className="skill-visualization space-y-4">
      {/* Radar Chart */}
      <div className="skill-radar-container">
        <h4 className="text-sm font-semibold text-cyan-400 mb-3">Skill Profile</h4>
        <RadarChart skills={skills} memberName={member.name || member.firstName} />
      </div>

      {/* Skill Breakdown */}
      <SkillBreakdown member={member} skills={skills} />
    </div>
  );
};

/**
 * Custom Radar Chart (no Chart.js dependency)
 */
const RadarChart = ({ skills, memberName }) => {
  const skillEntries = Object.entries(skills);
  const centerX = 100;
  const centerY = 100;
  const radius = 70;
  const angleStep = (2 * Math.PI) / skillEntries.length;

  // Generate polygon points
  const points = skillEntries.map(([label, value], index) => {
    const angle = (index * angleStep) - (Math.PI / 2); // Start at top
    const distance = (value / 100) * radius;
    const x = centerX + distance * Math.cos(angle);
    const y = centerY + distance * Math.sin(angle);
    return { x, y, label, value };
  });

  const polygonPoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // Generate axis lines
  const axes = skillEntries.map(([label], index) => {
    const angle = (index * angleStep) - (Math.PI / 2);
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    return { x, y, label, angle };
  });

  return (
    <div className="radar-chart-wrapper" style={{ width: '200px', height: '200px', margin: '0 auto' }}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Grid circles */}
        {[0.25, 0.5, 0.75, 1].map(scale => (
          <circle
            key={scale}
            cx={centerX}
            cy={centerY}
            r={radius * scale}
            fill="none"
            stroke="rgba(0, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Axes */}
        {axes.map((axis, idx) => (
          <g key={idx}>
            <line
              x1={centerX}
              y1={centerY}
              x2={axis.x}
              y2={axis.y}
              stroke="rgba(0, 255, 255, 0.2)"
              strokeWidth="1"
            />
            {/* Labels */}
            <text
              x={axis.x + (axis.x - centerX) * 0.15}
              y={axis.y + (axis.y - centerY) * 0.15}
              fontSize="10"
              fill="#0ff"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {axis.label.split(' ')[0]}
            </text>
          </g>
        ))}

        {/* Skill polygon */}
        <polygon
          points={polygonPoints}
          fill="rgba(0, 255, 255, 0.2)"
          stroke="#0ff"
          strokeWidth="2"
        />

        {/* Data points */}
        {points.map((point, idx) => (
          <circle
            key={idx}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="#0ff"
            stroke="#000"
            strokeWidth="1"
          />
        ))}
      </svg>
    </div>
  );
};

/**
 * Skill Breakdown with bars
 */
const SkillBreakdown = ({ member, skills }) => {
  const getSkillColor = (value) => {
    if (value >= 80) return '#0f0';
    if (value >= 60) return '#0ff';
    if (value >= 40) return '#ff0';
    return '#f00';
  };

  return (
    <div className="skill-breakdown space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp size={14} className="text-cyan-400" />
        <h5 className="text-sm font-semibold text-cyan-400 m-0">Detailed Skills</h5>
      </div>
      {Object.entries(skills).map(([skill, value]) => (
        <div key={skill} className="skill-item">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-300">{skill}</span>
            <span className={`text-xs font-semibold`} style={{ color: getSkillColor(value) }}>
              {Math.round(value)}
            </span>
          </div>
          <div className="skill-bar-container h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="skill-fill h-full transition-all"
              style={{
                width: `${value}%`,
                backgroundColor: getSkillColor(value)
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillVisualization;
