/**
 * AvatarCreator - Interactive avatar customization component
 * 
 * Allows players to customize their avatar or band member avatars
 * using Avataaars-style options
 */

import React, { useState, useCallback } from 'react';
import { X, Save, RotateCcw, User } from 'lucide-react';
import { AVATAR_OPTIONS, generateRandomAvatarConfig, getAvatarUrlFromConfig } from '../utils/avatarConfig.js';

export const AvatarCreator = ({ 
  initialConfig = null, 
  onSave, 
  onClose,
  title = "Customize Avatar"
}) => {
  const [config, setConfig] = useState(() => {
    return initialConfig || generateRandomAvatarConfig();
  });

  const updateConfig = useCallback((key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleRandomize = useCallback(() => {
    setConfig(generateRandomAvatarConfig());
  }, []);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(config);
    }
    if (onClose) {
      onClose();
    }
  }, [config, onSave, onClose]);

  const avatarUrl = getAvatarUrlFromConfig(config, 150);

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#0a0a0a',
      border: '2px solid #0ff',
      borderRadius: '8px',
      color: '#fff',
      maxWidth: '800px',
      maxHeight: '90vh',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#0ff', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <User size={24} />
          {title}
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

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>
        {/* Preview */}
        <div style={{
          padding: '20px',
          backgroundColor: '#111',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '15px',
          position: 'sticky',
          top: '20px',
          height: 'fit-content'
        }}>
          <div style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid #0ff',
            backgroundColor: '#222'
          }}>
            <img
              src={avatarUrl}
              alt="Avatar Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleRandomize}
              style={{
                padding: '8px 15px',
                backgroundColor: '#444',
                color: '#fff',
                border: '1px solid #666',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9em'
              }}
            >
              <RotateCcw size={16} />
              Randomize
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '8px 15px',
                backgroundColor: '#0f0',
                color: '#000',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9em',
                fontWeight: 'bold'
              }}
            >
              <Save size={16} />
              Save
            </button>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Hair */}
          <CategorySelector
            label="Hair Style"
            options={AVATAR_OPTIONS.hair}
            current={config.hair}
            onChange={(value) => updateConfig('hair', value)}
          />

          {/* Hair Color */}
          <CategorySelector
            label="Hair Color"
            options={AVATAR_OPTIONS.hairColor}
            current={config.hairColor}
            onChange={(value) => updateConfig('hairColor', value)}
          />

          {/* Skin */}
          <CategorySelector
            label="Skin Tone"
            options={AVATAR_OPTIONS.skin}
            current={config.skin}
            onChange={(value) => updateConfig('skin', value)}
          />

          {/* Eyes */}
          <CategorySelector
            label="Eyes"
            options={AVATAR_OPTIONS.eyes}
            current={config.eyes}
            onChange={(value) => updateConfig('eyes', value)}
          />

          {/* Eyebrows */}
          <CategorySelector
            label="Eyebrows"
            options={AVATAR_OPTIONS.eyebrows}
            current={config.eyebrows}
            onChange={(value) => updateConfig('eyebrows', value)}
          />

          {/* Mouth */}
          <CategorySelector
            label="Mouth"
            options={AVATAR_OPTIONS.mouth}
            current={config.mouth}
            onChange={(value) => updateConfig('mouth', value)}
          />

          {/* Facial Hair */}
          <CategorySelector
            label="Facial Hair"
            options={AVATAR_OPTIONS.facialHair}
            current={config.facialHair}
            onChange={(value) => updateConfig('facialHair', value)}
          />

          {/* Accessories */}
          <CategorySelector
            label="Accessories"
            options={AVATAR_OPTIONS.accessories}
            current={config.accessories}
            onChange={(value) => updateConfig('accessories', value)}
          />

          {/* Clothing */}
          <CategorySelector
            label="Clothing"
            options={AVATAR_OPTIONS.clothing}
            current={config.clothing}
            onChange={(value) => updateConfig('clothing', value)}
          />

          {/* Clothing Color */}
          <CategorySelector
            label="Clothing Color"
            options={AVATAR_OPTIONS.clothingColor}
            current={config.clothingColor}
            onChange={(value) => updateConfig('clothingColor', value)}
          />
        </div>
      </div>
    </div>
  );
};

function CategorySelector({ label, options, current, onChange }) {
  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#111',
      borderRadius: '4px',
      border: '1px solid #333'
    }}>
      <label style={{
        display: 'block',
        marginBottom: '10px',
        color: '#0ff',
        fontWeight: 'bold',
        fontSize: '0.9em'
      }}>
        {label}
      </label>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '8px',
        maxHeight: '200px',
        overflowY: 'auto',
        padding: '5px'
      }}>
        {options.map(option => (
          <button
            key={option}
            onClick={() => onChange(option)}
            style={{
              padding: '8px 12px',
              backgroundColor: current === option ? '#0ff' : '#222',
              color: current === option ? '#000' : '#fff',
              border: `1px solid ${current === option ? '#0ff' : '#444'}`,
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.85em',
              textAlign: 'center',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              transition: 'all 0.2s'
            }}
            title={option}
          >
            {option.replace(/([A-Z])/g, ' $1').trim()}
          </button>
        ))}
      </div>
    </div>
  );
}
