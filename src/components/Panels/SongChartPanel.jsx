/**
 * SongChartPanel.jsx - Individual song chart performance
 */
export const SongChartPanel = ({ gameData }) => (
  <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.2)' }}>
    <h4 style={{ margin: '0 0 1rem 0' }}>Song Performance</h4>
    {gameData?.songs?.length > 0 ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
        {gameData.songs.sort((a, b) => (b.streams || 0) - (a.streams || 0)).map(song => (
          <div key={song.id} style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '0.375rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <div style={{ fontWeight: 'bold' }}>{song.name}</div>
              <div style={{ fontSize: '0.85rem', color: '#ff006e', fontWeight: 'bold' }}>{(song.streams || 0).toLocaleString()}</div>
            </div>
            <div style={{ height: '0.35rem', backgroundColor: '#333', borderRadius: '0.2rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', backgroundColor: '#8338ec', width: `${Math.min((song.streams || 0) / 1000, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#aaa', margin: 0 }}>No songs yet.</p>
    )}
  </div>
);
