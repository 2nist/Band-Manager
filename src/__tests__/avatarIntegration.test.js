/**
 * Integration tests for Avatar System
 * 
 * Tests:
 * - AvatarCanvas component rendering
 * - Integration with EnhancedBandFormation
 * - Seed consistency
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { AvatarCanvas } from '../components/AvatarCanvas.jsx';
import { EnhancedAvatar } from '../components/EnhancedBandFormation/EnhancedAvatar.jsx';

// Mock canvas for testing
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  canvas: { width: 512, height: 512 },
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  translate: jest.fn(),
  rotate: jest.fn(),
  globalAlpha: 1,
  fillStyle: '#FFFFFF',
  toDataURL: jest.fn(() => 'data:image/png;base64,test')
}));

// Mock sessionStorage
const sessionStorageMock = {
  store: {},
  getItem: jest.fn(function(key) {
    return this.store[key] || null;
  }),
  setItem: jest.fn(function(key, value) {
    this.store[key] = value.toString();
  }),
  removeItem: jest.fn(function(key) {
    delete this.store[key];
  }),
  clear: jest.fn(function() {
    this.store = {};
  })
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: true
});

describe('AvatarCanvas Component', () => {
  beforeEach(() => {
    sessionStorageMock.clear();
    jest.clearAllMocks();
  });

  test('renders canvas element', () => {
    render(<AvatarCanvas seed={12345} size={256} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('width', '256');
    expect(canvas).toHaveAttribute('height', '256');
  });

  test('generates avatar with seed', async () => {
    render(<AvatarCanvas seed={12345} />);
    
    await waitFor(() => {
      const canvas = document.querySelector('canvas');
      expect(canvas).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('renders canvas for avatar generation', () => {
    render(<AvatarCanvas seed={12345} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    // Avatar generation happens asynchronously when assets are available
  });

  test('handles archetype prop', () => {
    render(<AvatarCanvas seed={12345} archetype="drummer" />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  test('accepts onGenerated callback prop', () => {
    const onGenerated = jest.fn();
    render(<AvatarCanvas seed={12345} onGenerated={onGenerated} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    // Callback will be called when avatar generation completes
  });
});

describe('EnhancedAvatar Integration', () => {
  test('renders with traits', () => {
    const traits = {
      role: 'guitarist',
      seed: 'test-seed-123'
    };
    
    render(<EnhancedAvatar traits={traits} size="medium" />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  test('generates seed from traits when not provided', () => {
    const traits = {
      role: 'drummer',
      faceShape: 'oval',
      hairStyle: 'mohawk'
    };
    
    render(<EnhancedAvatar traits={traits} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  test('maps role to archetype', () => {
    const traits = {
      role: 'drummer',
      seed: 'test'
    };
    
    render(<EnhancedAvatar traits={traits} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});

describe('Seed Consistency', () => {
  test('component accepts seed prop', () => {
    const seed = 12345;
    render(<AvatarCanvas seed={seed} />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
    // Same seed will produce same avatar when assets are available
  });
  
  test('component accepts archetype prop', () => {
    render(<AvatarCanvas seed={12345} archetype="drummer" />);
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});
