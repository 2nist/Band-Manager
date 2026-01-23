/**
 * RightPanel.jsx - Right sidebar with charts and analytics
 * 
 * Tabs:
 * - topChart: Top 20 Artists (ranked by fame)
 * - albums: Top 20 Albums (ranked by chartScore)
 * - songChart: Top 30 Songs (ranked by chartScore)
 */
import React, { useState } from 'react';
import { TopChartPanel } from './TopChartPanel';
import { AlbumsPanel } from './AlbumsPanel';
import { SongChartPanel } from './SongChartPanel';

export const RightPanel = ({ 
  activeTab: controlledTab,
  onTabChange: controlledOnTabChange,
  chartLeaders,
  albumChart,
  songChart,
  onBandClick,
  playerLogoState = {}
}) => {
  // Internal state if not controlled
  const [internalTab, setInternalTab] = useState('topChart');
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;
  const handleTabChange = controlledOnTabChange || setInternalTab;

  const tabs = [
    { id: 'topChart', label: 'Top 20 Artists' },
    { id: 'albums', label: 'Top 20 Albums' },
    { id: 'songChart', label: 'Top 30 Songs' }
  ];

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border/20 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-3 py-2 text-sm font-medium transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'topChart' && (
          <TopChartPanel 
            chartLeaders={chartLeaders} 
            onBandClick={onBandClick}
            playerLogoState={playerLogoState}
          />
        )}
        {activeTab === 'albums' && (
          <AlbumsPanel 
            albumChart={albumChart}
            playerLogoState={playerLogoState}
          />
        )}
        {activeTab === 'songChart' && (
          <SongChartPanel 
            songChart={songChart}
            playerLogoState={playerLogoState}
          />
        )}
      </div>
    </div>
  );
};
