/**
 * MetersPanel.jsx - Band skill and morale metrics
 */
export const MetersPanel = ({ gameData }) => (
  <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.2)' }}>
    <h4 style={{ margin: '0 0 1rem 0' }}>Band Metrics</h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
          <span style={{ color: '#aaa' }}>Overall Skill</span>
          <span style={{ fontWeight: 'bold' }}>{gameData?.bandSkill || 0}/10</span>
        </div>
        <div style={{ height: '0.4rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
          <div style={{ height: '100%', backgroundColor: '#8338ec', width: `${((gameData?.bandSkill || 0) / 10) * 100}%` }} />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
          <span style={{ color: '#aaa' }}>Morale</span>
          <span style={{ fontWeight: 'bold' }}>{gameData?.morale || 50}%</span>
        </div>
        <div style={{ height: '0.4rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
          <div style={{ height: '100%', backgroundColor: '#22c55e', width: `${gameData?.morale || 50}%` }} />
        </div>
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
          <span style={{ color: '#aaa' }}>Chemistry</span>
          <span style={{ fontWeight: 'bold' }}>{gameData?.chemistry || 50}%</span>
        </div>
        <div style={{ height: '0.4rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
          <div style={{ height: '100%', backgroundColor: '#ffa94d', width: `${gameData?.chemistry || 50}%` }} />
        </div>
      </div>
    </div>
  </div>
);
