/**
 * TeamPanel.jsx - Band roster display
 */
export const TeamPanel = ({ gameData }) => (
  <div style={{ padding: '1.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.2)' }}>
    <h4 style={{ margin: '0 0 1rem 0' }}>Current Lineup</h4>
    {gameData?.bandMembers?.length > 0 ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {gameData.bandMembers.map(member => (
          <div key={member.id} style={{ padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '0.375rem', borderLeft: '3px solid #8338ec' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{member.name}</div>
            <div style={{ fontSize: '0.8rem', color: '#aaa', display: 'flex', justifyContent: 'space-between' }}>
              <span>{member.type}</span>
              <span>Skill: {member.skill}/10</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#aaa', margin: 0 }}>No band members. Start recruiting!</p>
    )}
  </div>
);
