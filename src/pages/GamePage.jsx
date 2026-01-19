import React, { useState, useEffect } from 'react';
import { Music, Users, Zap, TrendingUp, Settings, Save, LogOut } from 'lucide-react';
import { EnhancedEventModal } from '../components/EnhancedEventModal';

/**
 * GamePage - Main game interface with tabs
 * 
 * Tabs:
 * 1. Dashboard - Overview and quick stats
 * 2. Inventory - Songs, albums, equipment
 * 3. Band - Member management
 * 4. Gigs - Performance booking
 * 5. Upgrades - Purchase improvements
 * 6. Rivals - Competition and battles
 * 7. Log - Game history
 */
export const GamePage = ({
  gameData,
  dialogueState,
  modalState,
  uiState,
  onNavigate,
  onSave,
  onQuit,
  onEventChoice
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [autoSaving, setAutoSaving] = useState(false);

  // Auto-save every 5 minutes
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      setAutoSaving(true);
      onSave?.();
      setTimeout(() => setAutoSaving(false), 1000);
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(autoSaveInterval);
  }, [onSave]);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'inventory', label: 'Inventory', icon: Music },
    { id: 'band', label: 'Band', icon: Users },
    { id: 'gigs', label: 'Gigs', icon: Zap },
    { id: 'upgrades', label: 'Upgrades', icon: TrendingUp },
    { id: 'rivals', label: 'Rivals', icon: Users },
    { id: 'log', label: 'Log', icon: Music }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a1a2e',
      color: '#fff',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#16213e',
        borderBottom: '2px solid rgba(131, 56, 236, 0.3)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
            {gameData?.bandName || 'Your Band'}
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#aaa', fontSize: '0.9rem' }}>
            Week {gameData?.week || 0}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
          <div>
            <div style={{ color: '#aaa' }}>Money</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#22c55e' }}>
              ${gameData?.money?.toLocaleString() || 0}
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>Fame</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#ff006e' }}>
              {gameData?.fame || 0}
            </div>
          </div>
          <div>
            <div style={{ color: '#aaa' }}>Members</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#8338ec' }}>
              {gameData?.bandMembers?.length || 0}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => {
              setAutoSaving(true);
              onSave?.();
              setTimeout(() => setAutoSaving(false), 1000);
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: autoSaving ? '#22c55e' : 'rgba(34, 197, 94, 0.3)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!autoSaving) e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.6)';
            }}
            onMouseLeave={(e) => {
              if (!autoSaving) e.target.style.backgroundColor = 'rgba(34, 197, 94, 0.3)';
            }}
          >
            <Save size={16} />
            {autoSaving ? 'Saving...' : 'Save'}
          </button>

          <button
            onClick={onQuit}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(239, 68, 68, 0.3)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.6)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.3)'}
          >
            <LogOut size={16} />
            Quit
          </button>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        padding: '1rem 2rem',
        backgroundColor: '#0f3460',
        borderBottom: '2px solid rgba(131, 56, 236, 0.2)',
        overflowX: 'auto'
      }}>
        {tabs.map(tab => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: isActive ? 'rgba(131, 56, 236, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                color: isActive ? '#fff' : '#aaa',
                border: `2px solid ${isActive ? 'rgba(131, 56, 236, 0.8)' : 'rgba(131, 56, 236, 0.2)'}`,
                borderRadius: '0.375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'rgba(131, 56, 236, 0.2)';
                  e.target.style.borderColor = 'rgba(131, 56, 236, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(131, 56, 236, 0.2)';
                }
              }}
            >
              <IconComponent size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div style={{
        flex: 1,
        padding: '2rem',
        overflow: 'auto'
      }}>
        <TabContent
          tabId={activeTab}
          gameData={gameData}
          dialogueState={dialogueState}
          modalState={modalState}
          uiState={uiState}
        />
      </div>

      {/* Enhanced Event Modal */}
      <EnhancedEventModal
        isOpen={modalState?.modals?.enhancedEvent}
        event={modalState?.modalData?.enhancedEvent?.event}
        psychologicalState={dialogueState?.psychologicalState}
        onChoice={onEventChoice}
        onClose={() => modalState?.closeAllModals?.()}
      />
    </div>
  );
};

/**
 * TabContent - Renders content for active tab
 */
const TabContent = ({ tabId, gameData, dialogueState, modalState, uiState }) => {
  switch (tabId) {
    case 'dashboard':
      return <DashboardTab gameData={gameData} dialogueState={dialogueState} />;
    case 'inventory':
      return <InventoryTab gameData={gameData} />;
    case 'band':
      return <BandTab gameData={gameData} />;
    case 'gigs':
      return <GigsTab gameData={gameData} />;
    case 'upgrades':
      return <UpgradesTab gameData={gameData} />;
    case 'rivals':
      return <RivalsTab gameData={gameData} />;
    case 'log':
      return <LogTab gameData={gameData} />;
    default:
      return null;
  }
};

// Tab Components
const DashboardTab = ({ gameData, dialogueState }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
    <div style={{ backgroundColor: 'rgba(131, 56, 236, 0.1)', padding: '1.5rem', borderRadius: '0.5rem', border: '2px solid rgba(131, 56, 236, 0.3)' }}>
      <h3 style={{ margin: '0 0 1rem 0' }}>Psychological State</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
        <div>
          <div style={{ marginBottom: '0.25rem', color: '#aaa' }}>Stress Level</div>
          <div style={{ height: '0.5rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', backgroundColor: '#ff6b6b', width: `${dialogueState?.psychologicalState?.stress_level || 0}%` }} />
          </div>
        </div>
        <div>
          <div style={{ marginBottom: '0.25rem', color: '#aaa' }}>Moral Integrity</div>
          <div style={{ height: '0.5rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', backgroundColor: '#51cf66', width: `${dialogueState?.psychologicalState?.moral_integrity || 100}%` }} />
          </div>
        </div>
        <div>
          <div style={{ marginBottom: '0.25rem', color: '#aaa' }}>Addiction Risk</div>
          <div style={{ height: '0.5rem', backgroundColor: '#333', borderRadius: '0.25rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', backgroundColor: '#ffa94d', width: `${dialogueState?.psychologicalState?.addiction_risk || 0}%` }} />
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
      </div>
    </div>
  </div>
);

const InventoryTab = ({ gameData }) => (
  <div>
    <h3>Songs</h3>
    {gameData?.songs?.length > 0 ? (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {gameData.songs.map(song => (
          <div key={song.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.3)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{song.name}</h4>
            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#aaa' }}>Quality: {song.quality}/10</p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#aaa' }}>Genre: {song.genre}</p>
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#aaa' }}>No songs recorded yet. Start writing!</p>
    )}
  </div>
);

const BandTab = ({ gameData }) => (
  <div>
    <h3>Band Members</h3>
    {gameData?.bandMembers?.length > 0 ? (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {gameData.bandMembers.map(member => (
          <div key={member.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.3)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{member.name}</h4>
            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#aaa' }}>Role: {member.type}</p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#aaa' }}>Skill: {member.skill}/10</p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#aaa' }}>Morale: {member.morale}%</p>
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#aaa' }}>No band members yet. Recruit some musicians!</p>
    )}
  </div>
);

const GigsTab = ({ gameData }) => (
  <div>
    <h3>Performance History</h3>
    <p style={{ color: '#aaa' }}>Total Gigs: {gameData?.gigHistory?.length || 0}</p>
    <p style={{ color: '#aaa' }}>Earnings from Gigs: ${gameData?.gigEarnings?.toLocaleString() || 0}</p>
  </div>
);

const UpgradesTab = ({ gameData }) => (
  <div>
    <h3>Purchased Upgrades</h3>
    {gameData?.upgrades?.length > 0 ? (
      <ul style={{ color: '#aaa' }}>
        {gameData.upgrades.map(upgrade => (
          <li key={upgrade}>{upgrade}</li>
        ))}
      </ul>
    ) : (
      <p style={{ color: '#aaa' }}>No upgrades purchased yet.</p>
    )}
  </div>
);

const RivalsTab = ({ gameData }) => (
  <div>
    <h3>Rivals</h3>
    {gameData?.rivals?.length > 0 ? (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {gameData.rivals.map(rival => (
          <div key={rival.id} style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(131, 56, 236, 0.3)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0' }}>{rival.name}</h4>
            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#aaa' }}>Skill: {rival.skill}/10</p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#aaa' }}>Fame: {rival.fame}</p>
            <p style={{ margin: '0.25rem 0', fontSize: '0.85rem', color: '#aaa' }}>Hostility: {rival.hostility}</p>
          </div>
        ))}
      </div>
    ) : (
      <p style={{ color: '#aaa' }}>No rivals yet. Make a name for yourself!</p>
    )}
  </div>
);

const LogTab = ({ gameData }) => (
  <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
    <h3>Game Log</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {gameData?.log?.length > 0 ? (
        gameData.log.slice().reverse().map((entry, idx) => (
          <div key={idx} style={{ padding: '0.5rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderLeft: '3px solid rgba(131, 56, 236, 0.5)', paddingLeft: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#ccc' }}>{entry}</p>
          </div>
        ))
      ) : (
        <p style={{ color: '#aaa' }}>No events logged yet.</p>
      )}
    </div>
  </div>
);

export default GamePage;
