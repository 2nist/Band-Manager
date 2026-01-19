/**
 * AlbumsPanel.jsx - Released albums display
 */
export const AlbumsPanel = ({ gameData }) => (
  <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.2)' }}>
    <h4 style={{ margin: '0 0 1rem 0' }}>Albums ({gameData?.albums?.length || 0})</h4>
    {gameData?.albums?.length > 0 ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '400px', overflowY: 'auto' }}>
        {gameData.albums.map(album => (
          <div key={album.id} style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '0.375rem', borderLeft: '3px solid #8338ec' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{album.name}</div>
            <div style={{ fontSize: '0.8rem', color: '#aaa', display: 'flex', justifyContent: 'space-between' }}>
              <span>{album.label || 'Independent'}</span>
              <span>{album.songs?.length} tracks</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#aaa', margin: 0 }}>No albums released yet.</p>
    )}
  </div>
);
