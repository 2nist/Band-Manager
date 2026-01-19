/**
 * LeftPanel.jsx - Left sidebar with band info and inventory
 * 
 * Tabs:
 * - snapshot: Band overview
 * - meters: Skill and morale metrics
 * - team: Current band members
 * - songs: Songs library
 */
import { SnapshotPanel } from './SnapshotPanel';
import { MetersPanel } from './MetersPanel';
import { TeamPanel } from './TeamPanel';
import { SongsPanel } from './SongsPanel';

export const LeftPanel = ({ activeTab = 'snapshot', gameData }) => {
  const tabs = [
    { id: 'snapshot', label: 'Snapshot' },
    { id: 'meters', label: 'Metrics' },
    { id: 'team', label: 'Team' },
    { id: 'songs', label: 'Songs' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeTab === tab.id ? 'rgba(131, 56, 236, 0.4)' : 'rgba(255, 255, 255, 0.05)',
              color: activeTab === tab.id ? '#fff' : '#aaa',
              border: `1px solid ${activeTab === tab.id ? 'rgba(131, 56, 236, 0.8)' : 'rgba(131, 56, 236, 0.2)'}`,
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.3s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'snapshot' && <SnapshotPanel gameData={gameData} />}
        {activeTab === 'meters' && <MetersPanel gameData={gameData} />}
        {activeTab === 'team' && <TeamPanel gameData={gameData} />}
        {activeTab === 'songs' && <SongsPanel gameData={gameData} />}
      </div>
    </div>
  );
};
