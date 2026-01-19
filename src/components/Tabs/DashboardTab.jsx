/**
 * DashboardTab.jsx - Game overview and quick stats with gameplay controls
 * 
 * Displays:
 * - Psychological state metrics
 * - Quick game statistics
 * - Key performance indicators
 * - Gameplay action buttons
 */
export const DashboardTab = ({ 
  gameData, 
  dialogueState,
  gameState,
  onAdvanceWeek,
  onTriggerEvent
}) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
      <div style={{ backgroundColor: 'rgba(131, 56, 236, 0.1)', padding: '1.5rem', borderRadius: '0.5rem', border: '2px solid rgba(131, 56, 236, 0.3)' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Psychological State</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
          <div>
            <div style={{ marginBottom: '0.25rem', color: '#aaa' }}>Stress Level ({Math.round(dialogueState?.psychologicalState?.stress_level || 0)}%)</div>
            <div style={{ height: '0.5rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', backgroundColor: '#ff6b6b', width: `${dialogueState?.psychologicalState?.stress_level || 0}%` }} />
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '0.25rem', color: '#aaa' }}>Moral Integrity ({Math.round(dialogueState?.psychologicalState?.moral_integrity || 100)}%)</div>
            <div style={{ height: '0.5rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', backgroundColor: '#51cf66', width: `${dialogueState?.psychologicalState?.moral_integrity || 100}%` }} />
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '0.25rem', color: '#aaa' }}>Addiction Risk ({Math.round(dialogueState?.psychologicalState?.addiction_risk || 0)}%)</div>
            <div style={{ height: '0.5rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', backgroundColor: '#ffa94d', width: `${dialogueState?.psychologicalState?.addiction_risk || 0}%` }} />
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '0.25rem', color: '#aaa' }}>Paranoia ({Math.round(dialogueState?.psychologicalState?.paranoia || 0)}%)</div>
            <div style={{ height: '0.5rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', backgroundColor: '#a78bfa', width: `${dialogueState?.psychologicalState?.paranoia || 0}%` }} />
            </div>
          </div>
          <div>
            <div style={{ marginBottom: '0.25rem', color: '#aaa' }}>Depression ({Math.round(dialogueState?.psychologicalState?.depression || 0)}%)</div>
            <div style={{ height: '0.5rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
              <div style={{ height: '100%', backgroundColor: '#38bdf8', width: `${dialogueState?.psychologicalState?.depression || 0}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'rgba(131, 56, 236, 0.1)', padding: '1.5rem', borderRadius: '0.5rem', border: '2px solid rgba(131, 56, 236, 0.3)' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Quick Stats</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
          <div>Songs: <strong>{gameData?.songs?.length || 0}</strong></div>
          <div>Albums: <strong>{gameData?.albums?.length || 0}</strong></div>
          <div>Gigs Completed: <strong>{gameData?.gigHistory?.length || 0}</strong></div>
          <div>Total Earnings: <strong>${gameData?.totalEarnings?.toLocaleString() || 0}</strong></div>
          <div>Morale: <strong>{gameData?.morale || 70}/100</strong></div>
          <div>Band Members: <strong>{gameData?.bandMembers?.length || 0}</strong></div>
        </div>
      </div>

      <div style={{ backgroundColor: 'rgba(131, 56, 236, 0.1)', padding: '1.5rem', borderRadius: '0.5rem', border: '2px solid rgba(131, 56, 236, 0.3)' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>Faction Standing</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
          {dialogueState?.narrativeState?.factionReputation ? (
            Object.entries(dialogueState.narrativeState.factionReputation).map(([faction, standing]) => (
              <div key={faction}>
                <div style={{ marginBottom: '0.25rem', color: '#aaa', textTransform: 'capitalize' }}>
                  {faction}
                </div>
                <div style={{ height: '0.5rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    backgroundColor: standing > 0 ? '#51cf66' : standing < 0 ? '#ff6b6b' : '#8338ec',
                    width: `${Math.abs(standing) > 100 ? 100 : Math.abs(standing)}%` 
                  }} />
                </div>
                <div style={{ fontSize: '0.8rem', color: '#aaa', marginTop: '0.25rem' }}>
                  {standing > 0 ? '+' : ''}{Math.round(standing)}
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: '#aaa' }}>No faction data yet</div>
          )}
        </div>
      </div>
    </div>

    {/* Gameplay Controls */}
    <div style={{
      backgroundColor: 'rgba(255, 0, 110, 0.1)',
      padding: '2rem',
      borderRadius: '0.5rem',
      border: '2px solid rgba(255, 0, 110, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>Gameplay</h3>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={onTriggerEvent}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'rgba(131, 56, 236, 0.3)',
            color: '#fff',
            border: '2px solid rgba(131, 56, 236, 0.5)',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.6)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.3)'}
        >
          🎭 Trigger Random Event
        </button>

        <button
          onClick={onAdvanceWeek}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#ff006e',
            color: '#fff',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#ff1975'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#ff006e'}
        >
          ⏭️ Advance Week
        </button>
      </div>
      <p style={{ margin: '0', fontSize: '0.85rem', color: '#aaa' }}>
        Advance the week to trigger consequences, events, and progress your career. Events may appear automatically or on demand.
      </p>
    </div>
  </div>
);
