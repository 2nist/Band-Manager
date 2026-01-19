/**
 * ToursModal.jsx - Tour management modal
 */
export const ToursModal = ({ isOpen, onClose, gameData, onStartTour }) => {
  if (!isOpen) return null;

  const tours = [
    { id: 'regional-us', name: 'US Regional Tour', region: 'North America', duration: 4, cost: 5000, potential: 15000 },
    { id: 'europe', name: 'European Tour', region: 'Europe', duration: 6, cost: 8000, potential: 25000 },
    { id: 'asia', name: 'Asian Tour', region: 'Asia', duration: 5, cost: 10000, potential: 30000 },
    { id: 'world', name: 'World Tour', region: 'Global', duration: 12, cost: 25000, potential: 100000 }
  ];

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
        <h3 style={{ margin: '0 0 1.5rem 0' }}>Manage Tours</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {tours.map(tour => (
            <div
              key={tour.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '1.25rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(131, 56, 236, 0.3)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>{tour.name}</h4>
                  <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#aaa' }}>
                    {tour.region} • {tour.duration} weeks
                  </p>
                </div>
                <button
                  onClick={() => onStartTour?.(tour)}
                  disabled={gameData?.money < tour.cost}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: gameData?.money >= tour.cost ? 'rgba(34, 197, 94, 0.3)' : 'rgba(100, 100, 100, 0.3)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.375rem',
                    cursor: gameData?.money >= tour.cost ? 'pointer' : 'not-allowed'
                  }}
                >
                  Start
                </button>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#aaa', display: 'flex', justifyContent: 'space-between' }}>
                <span>Cost: ${tour.cost.toLocaleString()}</span>
                <span>Potential: ${tour.potential.toLocaleString()}</span>
              </div>
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
