/**
 * GigsModal.jsx - Gig booking modal
 */
export const GigsModal = ({ isOpen, onClose, gameData, onBookGig }) => {
  if (!isOpen) return null;

  const venues = [
    { id: 'local-bar', name: 'Local Bar', type: 'Local', earnings: 100, success: 0.7 },
    { id: 'small-venue', name: 'Small Venue', type: 'Local', earnings: 500, success: 0.65 },
    { id: 'city-arena', name: 'City Arena', type: 'Regional', earnings: 2000, success: 0.5 },
    { id: 'festival', name: 'Music Festival', type: 'Regional', earnings: 3000, success: 0.4 }
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
        <h3 style={{ margin: '0 0 1.5rem 0' }}>Book a Gig</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {venues.map(venue => (
            <div
              key={venue.id}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '1.25rem',
                borderRadius: '0.5rem',
                border: '1px solid rgba(131, 56, 236, 0.3)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>{venue.name}</h4>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#aaa' }}>
                  {venue.type} • Success: {Math.round(venue.success * 100)}% • Earnings: ${venue.earnings}
                </p>
              </div>
              <button
                onClick={() => onBookGig?.(venue)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'rgba(34, 197, 94, 0.3)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer'
                }}
              >
                Book
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
