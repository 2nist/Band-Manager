/**
 * TopChartPanel.jsx - Top songs on charts
 */
export const TopChartPanel = ({ gameData }) => (
  <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.2)' }}>
    <h4 style={{ margin: '0 0 1rem 0' }}>Top Charts</h4>
    {gameData?.topChart?.length > 0 ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {gameData.topChart.map((song, idx) => (
          <div key={idx} style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '0.375rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>#{idx + 1}</div>
              <div style={{ fontSize: '0.8rem', color: '#aaa' }}>{song.name}</div>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#ff006e', fontWeight: 'bold' }}>{song.streams?.toLocaleString()}</div>
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#aaa', margin: 0 }}>No songs on the charts yet.</p>
    )}
  </div>
);
