/**
 * CharacterLibrary - Browse and manage saved characters
 * 
 * Shows all saved characters and allows editing, deleting, or using them
 */

import React, { useState, useEffect, useCallback } from 'react';
import { X, Edit, Trash2, UserPlus, User, Search } from 'lucide-react';
import { getSavedCharacters, deleteCharacter, characterToBandMember } from '../utils/characterDatabase.js';
import { getAvatarUrlFromConfig } from '../utils/avatarConfig.js';
import { CharacterBuilder } from './CharacterBuilder.jsx';

export const CharacterLibrary = ({ onSelectCharacter, onClose }) => {
  const [characters, setCharacters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = useCallback(() => {
    const saved = getSavedCharacters();
    setCharacters(saved);
  }, []);

  const handleDelete = useCallback((characterId) => {
    if (confirm('Are you sure you want to delete this character?')) {
      if (deleteCharacter(characterId)) {
        loadCharacters();
      }
    }
  }, [loadCharacters]);

  const handleEdit = useCallback((character) => {
    setEditingCharacter(character);
    setShowBuilder(true);
  }, []);

  const handleSave = useCallback(() => {
    loadCharacters();
    setShowBuilder(false);
    setEditingCharacter(null);
  }, [loadCharacters]);

  const filteredCharacters = characters.filter(char => {
    const search = searchTerm.toLowerCase();
    return (
      char.name.toLowerCase().includes(search) ||
      (char.nickname && char.nickname.toLowerCase().includes(search)) ||
      (char.bio && char.bio.toLowerCase().includes(search))
    );
  });

  if (showBuilder) {
    return (
      <CharacterBuilder
        initialCharacter={editingCharacter}
        mode={editingCharacter ? 'edit' : 'create'}
        onSave={handleSave}
        onClose={() => {
          setShowBuilder(false);
          setEditingCharacter(null);
        }}
      />
    );
  }

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#0a0a0a',
      border: '2px solid #0ff',
      borderRadius: '8px',
      color: '#fff',
      maxWidth: '1000px',
      maxHeight: '90vh',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#0ff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={24} />
          Character Library ({characters.length})
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowBuilder(true)}
            style={{
              padding: '8px 15px',
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
            <UserPlus size={16} />
            New Character
          </button>
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
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', top: '12px', color: '#888' }} />
          <input
            type="text"
            placeholder="Search characters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 12px 12px 40px',
              backgroundColor: '#111',
              border: '1px solid #444',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '1em'
            }}
          />
        </div>
      </div>

      {/* Character Grid */}
      {filteredCharacters.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '15px'
        }}>
          {filteredCharacters.map(character => (
            <div
              key={character.id}
              style={{
                padding: '15px',
                backgroundColor: '#111',
                borderRadius: '8px',
                border: '1px solid #333',
                textAlign: 'center',
                cursor: onSelectCharacter ? 'pointer' : 'default',
                transition: 'all 0.2s',
                position: 'relative'
              }}
              onClick={() => onSelectCharacter && onSelectCharacter(character)}
              onMouseEnter={(e) => {
                if (onSelectCharacter) {
                  e.currentTarget.style.borderColor = '#0ff';
                  e.currentTarget.style.backgroundColor = '#1a1a2e';
                }
              }}
              onMouseLeave={(e) => {
                if (onSelectCharacter) {
                  e.currentTarget.style.borderColor = '#333';
                  e.currentTarget.style.backgroundColor = '#111';
                }
              }}
            >
              {/* Avatar */}
              <div style={{ marginBottom: '10px' }}>
                <img
                  src={character.avatarConfig ? getAvatarUrlFromConfig(character.avatarConfig, 150) : ''}
                  alt={character.name}
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    border: '3px solid #0ff',
                    margin: '0 auto'
                  }}
                />
              </div>

              {/* Name */}
              <div style={{ fontWeight: 'bold', fontSize: '1.1em', color: '#0ff', marginBottom: '5px' }}>
                {character.nickname || character.name}
              </div>
              {character.nickname && character.name && (
                <div style={{ fontSize: '0.85em', color: '#888', marginBottom: '5px' }}>
                  {character.name}
                </div>
              )}
              {character.role && (
                <div style={{ fontSize: '0.8em', color: '#666', marginBottom: '10px' }}>
                  {character.role}
                </div>
              )}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '10px' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(character);
                  }}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#444',
                    color: '#fff',
                    border: '1px solid #666',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85em'
                  }}
                  title="Edit"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(character.id);
                  }}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#f00',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.85em'
                  }}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <User size={48} style={{ opacity: 0.3, marginBottom: '10px' }} />
          <p>No characters saved yet.</p>
          <button
            onClick={() => setShowBuilder(true)}
            style={{
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#0f0',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Create Your First Character
          </button>
        </div>
      )}
    </div>
  );
};
