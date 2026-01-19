/**
 * SnapshotPanel.jsx - Band summary and key information
 */
export const SnapshotPanel = ({ gameData }) => (
  <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.2)' }}>
    <h4 style={{ margin: '0 0 1rem 0' }}>Band Snapshot</h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
      <div>
        <div style={{ color: '#aaa', marginBottom: '0.25rem' }}>Band Name</div>
        <div style={{ fontWeight: 'bold' }}>{gameData?.bandName || 'Unknown'}</div>
      </div>
      <div>
        <div style={{ color: '#aaa', marginBottom: '0.25rem' }}>Week</div>
        <div style={{ fontWeight: 'bold' }}>{gameData?.week || 0}</div>
      </div>
      <div>
        <div style={{ color: '#aaa', marginBottom: '0.25rem' }}>Money</div>
        <div style={{ fontWeight: 'bold', color: '#22c55e' }}>${gameData?.money?.toLocaleString() || 0}</div>
      </div>
      <div>
        <div style={{ color: '#aaa', marginBottom: '0.25rem' }}>Fame</div>
        <div style={{ fontWeight: 'bold', color: '#ff006e' }}>{gameData?.fame || 0}</div>
      </div>
      <div>
        <div style={{ color: '#aaa', marginBottom: '0.25rem' }}>Members</div>
        <div style={{ fontWeight: 'bold' }}>{gameData?.bandMembers?.length || 0}</div>
      </div>
    </div>
  </div>
);
