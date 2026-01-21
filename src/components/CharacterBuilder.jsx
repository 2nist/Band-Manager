/**
 * CharacterBuilder - Full character creation system
 * 
 * Allows players to create custom characters (themselves or rockstars)
 * with full avatar customization, name, nickname, bio, and stats
 */

import React, { useState, useCallback } from 'react';
import { X, Save, User, Sparkles, Shuffle, UserPlus } from 'lucide-react';
import { AvatarCreator } from './AvatarCreator.jsx';
import { AVATAR_OPTIONS, generateRandomAvatarConfig, getAvatarUrlFromConfig } from '../utils/avatarConfig.js';
import { FIRST_NAMES, LAST_NAMES, NICKNAMES } from '../utils/constants.js';
import { createCharacter, saveCharacter } from '../utils/characterDatabase.js';
import { randomFrom } from '../utils/helpers.js';

const ROLES = [
  { id: 'vocalist', name: 'Vocalist' },
  { id: 'guitarist', name: 'Guitarist' },
  { id: 'lead-guitar', name: 'Lead Guitar' },
  { id: 'rhythm-guitar', name: 'Rhythm Guitar' },
  { id: 'bassist', name: 'Bassist' },
  { id: 'drummer', name: 'Drummer' },
  { id: 'keyboardist', name: 'Keyboardist' }
];

export const CharacterBuilder = ({ 
  onSave, 
  onClose,
  initialCharacter = null,
  mode = 'create' // 'create' or 'edit'
}) => {
  const [step, setStep] = useState(1); // 1: Avatar, 2: Name, 3: Details
  const [avatarConfig, setAvatarConfig] = useState(() => {
    return initialCharacter?.avatarConfig || generateRandomAvatarConfig();
  });
  const [name, setName] = useState(initialCharacter?.name || '');
  const [firstName, setFirstName] = useState(initialCharacter?.firstName || '');
  const [lastName, setLastName] = useState(initialCharacter?.lastName || '');
  const [nickname, setNickname] = useState(initialCharacter?.nickname || '');
  const [role, setRole] = useState(initialCharacter?.role || '');
  const [bio, setBio] = useState(initialCharacter?.bio || '');
  const [personality, setPersonality] = useState(initialCharacter?.personality || 'steady');

  const handleRandomizeName = useCallback(() => {
    const first = randomFrom(FIRST_NAMES);
    const last = randomFrom(LAST_NAMES);
    const nick = randomFrom(NICKNAMES);
    setFirstName(first);
    setLastName(last);
    setName(`${first} ${last}`);
    setNickname(nick);
  }, []);

  const handleRandomizeAvatar = useCallback(() => {
    setAvatarConfig(generateRandomAvatarConfig(personality));
  }, [personality]);

  const handleSave = useCallback(() => {
    const character = createCharacter({
      id: initialCharacter?.id,
      name: name || `${firstName} ${lastName}`.trim() || 'Unnamed Character',
      firstName: firstName || name.split(' ')[0],
      lastName: lastName || name.split(' ').slice(1).join(' '),
      nickname: nickname,
      role: role || null,
      avatarConfig: avatarConfig,
      personality: personality,
      bio: bio
    });

    if (saveCharacter(character)) {
      if (onSave) {
        onSave(character);
      }
      if (onClose) {
        onClose();
      }
    } else {
      alert('Failed to save character. Please try again.');
    }
  }, [name, firstName, lastName, nickname, role, avatarConfig, personality, bio, initialCharacter, onSave, onClose]);

  const canProceed = step === 1 ? true : step === 2 ? (name || (firstName && lastName)) : true;

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#0a0a0a',
      border: '2px solid #0ff',
      borderRadius: '8px',
      color: '#fff',
      maxWidth: '900px',
      maxHeight: '90vh',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#0ff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <UserPlus size={24} />
          {mode === 'edit' ? 'Edit Character' : 'Create Character'}
        </h2>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: '1px solid #666',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center' }}>
        {[1, 2, 3].map(s => (
          <div
            key={s}
            style={{
              flex: 1,
              padding: '10px',
              backgroundColor: step >= s ? '#0ff' : '#222',
              color: step >= s ? '#000' : '#888',
              borderRadius: '4px',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '0.9em'
            }}
          >
            {s === 1 ? 'Avatar' : s === 2 ? 'Name' : 'Details'}
          </div>
        ))}
      </div>

      {/* Step 1: Avatar */}
      {step === 1 && (
        <div>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h3 style={{ color: '#0ff', marginBottom: '10px' }}>Customize Appearance</h3>
            <p style={{ color: '#888', fontSize: '0.9em' }}>
              Create your character's look. You can always change this later.
            </p>
          </div>
          <AvatarCreator
            initialConfig={avatarConfig}
            onSave={(config) => setAvatarConfig(config)}
            onClose={() => setStep(2)}
            title=""
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button
              onClick={handleRandomizeAvatar}
              style={{
                padding: '10px 20px',
                backgroundColor: '#444',
                color: '#fff',
                border: '1px solid #666',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Shuffle size={16} />
              Randomize Avatar
            </button>
            <button
              onClick={() => setStep(2)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0f0',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Next: Name →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Name */}
      {step === 2 && (
        <div>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h3 style={{ color: '#0ff', marginBottom: '10px' }}>Character Name</h3>
            <p style={{ color: '#888', fontSize: '0.9em' }}>
              Give your character a name and nickname
            </p>
          </div>

          <div style={{ display: 'grid', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#0ff', fontWeight: 'bold' }}>
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., John Smith"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#111',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '1em'
                }}
              />
            </div>

            {/* Or First/Last */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First"
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#111',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    color: '#fff'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last"
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#111',
                    border: '1px solid #444',
                    borderRadius: '4px',
                    color: '#fff'
                  }}
                />
              </div>
            </div>

            {/* Nickname */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#0ff', fontWeight: 'bold' }}>
                Nickname / Stage Name
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="e.g., 'Ace', 'Thunder', 'The Rockstar'"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#111',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '1em'
                }}
              />
              <p style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>
                Optional: A cool stage name or nickname
              </p>
            </div>

            {/* Randomize Button */}
            <button
              onClick={handleRandomizeName}
              style={{
                padding: '10px 20px',
                backgroundColor: '#444',
                color: '#fff',
                border: '1px solid #666',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                justifyContent: 'center'
              }}
            >
              <Sparkles size={16} />
              Randomize Name
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
            <button
              onClick={() => setStep(1)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#444',
                color: '#fff',
                border: '1px solid #666',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!canProceed}
              style={{
                padding: '10px 20px',
                backgroundColor: canProceed ? '#0f0' : '#333',
                color: canProceed ? '#000' : '#666',
                border: 'none',
                borderRadius: '4px',
                cursor: canProceed ? 'pointer' : 'not-allowed',
                fontWeight: 'bold'
              }}
            >
              Next: Details →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Details */}
      {step === 3 && (
        <div>
          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h3 style={{ color: '#0ff', marginBottom: '10px' }}>Character Details</h3>
            <p style={{ color: '#888', fontSize: '0.9em' }}>
              Add personality and role information
            </p>
          </div>

          <div style={{ display: 'grid', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
            {/* Role */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#0ff', fontWeight: 'bold' }}>
                Role (Optional)
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#111',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '1em'
                }}
              >
                <option value="">No specific role</option>
                {ROLES.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            {/* Personality */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#0ff', fontWeight: 'bold' }}>
                Personality
              </label>
              <select
                value={personality}
                onChange={(e) => setPersonality(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#111',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '1em'
                }}
              >
                <option value="steady">Steady & Reliable</option>
                <option value="rebellious">Rebellious & Wild</option>
                <option value="professional">Professional & Polished</option>
                <option value="rock">Rock & Roll</option>
                <option value="punk">Punk Attitude</option>
                <option value="jazz">Jazz & Sophisticated</option>
                <option value="metal">Metal & Intense</option>
                <option value="pop">Pop & Energetic</option>
              </select>
            </div>

            {/* Bio */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#0ff', fontWeight: 'bold' }}>
                Bio / Description (Optional)
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about this character..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#111',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  color: '#fff',
                  fontSize: '1em',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Preview */}
            <div style={{
              padding: '20px',
              backgroundColor: '#111',
              borderRadius: '8px',
              border: '1px solid #333',
              textAlign: 'center'
            }}>
              <h4 style={{ color: '#0ff', marginBottom: '15px' }}>Preview</h4>
              <div style={{ marginBottom: '15px' }}>
                <img
                  src={getAvatarUrlFromConfig(avatarConfig, 150)}
                  alt="Character Preview"
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    border: '3px solid #0ff'
                  }}
                />
              </div>
              <div style={{ color: '#fff', fontSize: '1.1em', fontWeight: 'bold', marginBottom: '5px' }}>
                {nickname || name || `${firstName} ${lastName}`.trim() || 'Unnamed Character'}
              </div>
              {nickname && name && (
                <div style={{ color: '#888', fontSize: '0.9em' }}>
                  {name}
                </div>
              )}
              {role && (
                <div style={{ color: '#0ff', fontSize: '0.9em', marginTop: '5px' }}>
                  {ROLES.find(r => r.id === role)?.name}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
            <button
              onClick={() => setStep(2)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#444',
                color: '#fff',
                border: '1px solid #666',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '10px 20px',
                backgroundColor: '#0f0',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Save size={18} />
              Save Character
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
