/**
 * UpgradesModal.jsx - Equipment and skill upgrades modal
 */
export const UpgradesModal = ({ isOpen, onClose, gameData, onPurchase }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#1a1a2e',
        borderRadius: '0.75rem',
        padding: '2rem',
        maxWidth: '600px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        border: '2px solid rgba(131, 56, 236, 0.3)'
      }}>
        <h3 style={{ margin: '0 0 1.5rem 0' }}>Equipment Upgrades</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { name: 'Studio Upgrade', cost: 5000, benefit: '+20% recording quality' },
            { name: 'Transport Upgrade', cost: 3000, benefit: '+15% tour earnings' },
            { name: 'Gear Package', cost: 2000, benefit: '+10% performance quality' },
            { name: 'Sound System', cost: 4000, benefit: '+25% gig success' }
          ].map((upgrade, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(131, 56, 236, 0.3)',
                textAlign: 'center'
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>{upgrade.name}</h4>
              <p style={{ margin: '0.5rem 0', fontSize: '0.85rem', color: '#aaa' }}>{upgrade.benefit}</p>
              <button
                onClick={() => onPurchase?.(upgrade)}
                disabled={gameData?.money < upgrade.cost}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: gameData?.money >= upgrade.cost ? 'rgba(34, 197, 94, 0.3)' : 'rgba(100, 100, 100, 0.3)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: gameData?.money >= upgrade.cost ? 'pointer' : 'not-allowed',
                  fontSize: '0.8rem'
                }}
              >
                ${upgrade.cost.toLocaleString()}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: 'rgba(239, 68, 68, 0.3)',
            color: '#fff',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
