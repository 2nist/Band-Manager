/**
 * RightPanel.jsx - Right sidebar with charts and analytics
 * 
 * Tabs:
 * - topChart: Top performing songs
 * - albums: Released albums
 * - songChart: Individual song performance
 */
import { TopChartPanel } from './TopChartPanel';
import { AlbumsPanel } from './AlbumsPanel';
import { SongChartPanel } from './SongChartPanel';

export const RightPanel = ({ activeTab = 'topChart', gameData }) => {
  const tabs = [
    { id: 'topChart', label: 'Top Chart' },
    { id: 'albums', label: 'Albums' },
    { id: 'songChart', label: 'Song Chart' }
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
        {activeTab === 'topChart' && <TopChartPanel gameData={gameData} />}
        {activeTab === 'albums' && <AlbumsPanel gameData={gameData} />}
        {activeTab === 'songChart' && <SongChartPanel gameData={gameData} />}
      </div>
    </div>
  );
};
