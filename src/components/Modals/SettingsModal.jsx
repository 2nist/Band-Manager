/**
 * SettingsModal.jsx - Game settings and preferences
 */
export const SettingsModal = ({ isOpen, onClose, gameData, onSettingChange }) => {
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
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        border: '2px solid rgba(131, 56, 236, 0.3)'
      }}>
        <h3 style={{ margin: '0 0 1.5rem 0' }}>Settings</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          {/* Audio Settings */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              <span>Sound Effects</span>
            </label>
          </div>

          {/* Music Settings */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              <span>Background Music</span>
            </label>
          </div>

          {/* Auto-save Settings */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
              <span>Auto-save every 5 minutes</span>
            </label>
          </div>

          {/* Difficulty Settings */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
              Difficulty
            </label>
            <select style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(131, 56, 236, 0.3)',
              borderRadius: '0.375rem',
              color: '#fff',
              cursor: 'pointer'
            }}>
              <option>Easy</option>
              <option selected>Normal</option>
              <option>Hard</option>
              <option>Insane</option>
            </select>
          </div>

          {/* Theme Settings */}
          <div>
            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
              Theme
            </label>
            <select style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(131, 56, 236, 0.3)',
              borderRadius: '0.375rem',
              color: '#fff',
              cursor: 'pointer'
            }}>
              <option>Warm</option>
              <option>Neon</option>
              <option selected>Modern</option>
              <option>Dark</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              backgroundColor: 'rgba(34, 197, 94, 0.3)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Save
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem 1.5rem',
              backgroundColor: 'rgba(239, 68, 68, 0.3)',
              color: '#fff',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
